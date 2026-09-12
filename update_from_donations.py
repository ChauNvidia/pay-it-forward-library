#!/usr/bin/env python3
"""
update_from_donations.py

Reads the real donor export (P1266 Donations.xlsx format) and updates
data.js's campaignData (currentDonors, cohortsWithActivity,
totalRaised) and cohorts[] to match.

PRIVACY: only extracts "Cohort Year" and "Amount" per row (either a
4-digit class year, or the literal "GMS Friend" for non-alumni
allies, plus the dollar amount of that single gift). Names, emails,
and addresses are intentionally NOT read into data.js, since that
file is plain-text and loads directly in the browser -- anyone can
View Source and read it. Amount is aggregated into a single running
total, never stored per-donor, so no individual gift size is ever
exposed either.

Usage:
    python3 update_from_donations.py /path/to/P1266\\ Donations.xlsx

Re-run any time a new export is dropped in -- this OVERWRITES the
campaignData.currentDonors / cohortsWithActivity / totalRaised and
cohorts[] blocks in data.js with fresh totals computed from the
spreadsheet. Everything else in data.js (campaignFrames,
frameIndexForProgress, lightCoordinates, etc.) is left untouched.
This same data.js is read by both index.html (the homepage) and
leaderboard.html ("Option 2"), so one run of this script keeps both
pages in sync.
"""

import sys
import re
import openpyxl
from collections import Counter
from datetime import datetime
from zoneinfo import ZoneInfo

DATA_JS_PATH = "/Users/leeannd/Boards-and-Orgs/SEN/library-campaign/data.js"

# The cohort years the room is built for (goal of 10 founding donors
# each). "GMS Friend" donors are non-alumni allies and get their own
# bucket, not a class year.
ALL_COHORT_YEARS = list(range(2000, 2021))  # 2000..2020 inclusive
FRIEND_LABEL = "GMS Friend"
FRIEND_GOAL = 10


def read_donations(path):
    wb = openpyxl.load_workbook(path, data_only=True)
    ws = wb.worksheets[0]
    rows = list(ws.iter_rows(values_only=True))

    # Find the header row (has "Cohort Year" as a column name)
    header_idx = None
    for i, row in enumerate(rows):
        if row and "Cohort Year" in [str(c) for c in row]:
            header_idx = i
            break
    if header_idx is None:
        raise ValueError("Could not find header row with 'Cohort Year' column")

    header = rows[header_idx]
    cohort_col = header.index("Cohort Year")
    amount_col = header.index("Amount") if "Amount" in header else None

    cohort_years = []
    total_raised = 0.0
    for row in rows[header_idx + 1:]:
        if row is None:
            continue
        val = row[cohort_col]
        if val is None:
            # Rows with no Cohort Year are not real donor rows -- this
            # is how the trailing "totals" row (Amount-only, everything
            # else blank) gets excluded from both the cohort counts and
            # the dollar total below.
            continue
        # Also skip the trailing totals row in the unlikely case it
        # has a huge numeric value where Cohort Year would be.
        if isinstance(val, (int, float)) and val > 2100:
            continue
        cohort_years.append(val)
        if amount_col is not None and row[amount_col] is not None:
            total_raised += float(row[amount_col])

    return cohort_years, total_raised


def build_counts(cohort_years):
    counts = Counter()
    for v in cohort_years:
        if isinstance(v, str) and v.strip() == FRIEND_LABEL:
            counts[FRIEND_LABEL] += 1
        else:
            try:
                year = int(v)
                counts[year] += 1
            except (ValueError, TypeError):
                print(f"WARNING: unrecognized Cohort Year value, skipping: {v!r}")
    return counts


def render_cohorts_block(counts):
    lines = ["const cohorts = ["]
    for year in ALL_COHORT_YEARS:
        donors = counts.get(year, 0)
        suffix = ' // "2020+" -- most recent scholars, bucketed together' if year == 2020 else ""
        comma = "," if year != ALL_COHORT_YEARS[-1] or True else ""
        lines.append(f"  {{ year: {year}, donors: {donors}, goal: 10 }},{suffix}")
    friend_donors = counts.get(FRIEND_LABEL, 0)
    lines.append(
        f'  {{ year: "{FRIEND_LABEL}", donors: {friend_donors}, goal: {FRIEND_GOAL} }} '
        f'// non-alumni allies, not a class year'
    )
    lines.append("];")
    return "\n".join(lines)


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 update_from_donations.py /path/to/donations.xlsx")
        sys.exit(1)

    xlsx_path = sys.argv[1]
    cohort_years, total_raised = read_donations(xlsx_path)
    counts = build_counts(cohort_years)
    total_donors = sum(counts.values())
    cohorts_with_activity = sum(1 for v in counts.values() if v > 0)

    print(f"Total real donors: {total_donors}")
    for k in ALL_COHORT_YEARS:
        if counts.get(k, 0):
            print(f"  {k}: {counts[k]}")
    if counts.get(FRIEND_LABEL, 0):
        print(f"  {FRIEND_LABEL}: {counts[FRIEND_LABEL]}")
    print(f"Cohorts with activity: {cohorts_with_activity}")
    print(f"Total raised: ${total_raised:,.2f}")

    with open(DATA_JS_PATH) as f:
        content = f.read()

    # Replace currentDonors value
    old_current = re.search(r"currentDonors:\s*\d+,", content)
    if not old_current:
        raise ValueError("Could not find currentDonors: N, in data.js")
    content = content.replace(
        old_current.group(0),
        f"currentDonors: {total_donors},"
    )

    # Replace cohortsWithActivity (used by leaderboard.html)
    old_active = re.search(r"cohortsWithActivity:\s*\d+,", content)
    if not old_active:
        raise ValueError("Could not find cohortsWithActivity: N, in data.js")
    content = content.replace(
        old_active.group(0),
        f"cohortsWithActivity: {cohorts_with_activity},"
    )

    # Replace totalRaised (used by leaderboard.html). Whole dollars --
    # the site never needs cent-level precision.
    old_raised = re.search(r"totalRaised:\s*[\d.]+", content)
    if not old_raised:
        raise ValueError("Could not find totalRaised: N in data.js")
    content = content.replace(
        old_raised.group(0),
        f"totalRaised: {round(total_raised)}"
    )

    # Replace lastUpdated with today's date (Pacific time, since the
    # site displays it as "Updated [date] at 9pm PST" -- the export
    # this script reads is expected to land once a day, in the evening).
    today_pacific = datetime.now(ZoneInfo("America/Los_Angeles")).strftime("%B %-d, %Y")
    old_updated = re.search(r'lastUpdated:\s*"[^"]*"', content)
    if not old_updated:
        raise ValueError('Could not find lastUpdated: "..." in data.js')
    content = content.replace(
        old_updated.group(0),
        f'lastUpdated: "{today_pacific}"'
    )

    # Replace the cohorts block entirely (from "const cohorts = [" to
    # its closing "];")
    cohorts_pattern = re.compile(r"const cohorts = \[.*?\];", re.DOTALL)
    if not cohorts_pattern.search(content):
        raise ValueError("Could not find cohorts array in data.js")
    new_cohorts_block = render_cohorts_block(counts)
    content = cohorts_pattern.sub(new_cohorts_block, content, count=1)

    with open(DATA_JS_PATH, "w") as f:
        f.write(content)

    print(f"\nUpdated {DATA_JS_PATH}")
    print(f"(currentDonors, cohortsWithActivity, totalRaised, lastUpdated ({today_pacific}), cohorts[] --")
    print(" campaignFrames, lightCoordinates, etc. untouched)")


if __name__ == "__main__":
    main()
