/* ============================================================
   app.js
   All interactive behavior for the SEN "library lighting up"
   campaign page. Reads mock data from data.js.

   Functions:
     renderLights()        - draws all 200 lamps on canvas
     renderProgress()       - updates hero + stats panel copy/numbers
     renderLeaderboard()    - builds the "who's showing up" cards
     selectCohort(year)     - focuses one cohort's lights + opens panel
     animateDailyChange()   - yesterday -> today lamp animation
     simulateNewDonor()     - dev-mode "new donor" simulation
     resizeCanvas()         - keeps canvas pixel size in sync with CSS size
   ============================================================ */

(function () {
  "use strict";

  // ----------------------------------------------------------
  // STATE
  // Work off a mutable copy of the light data + donor count so
  // the simulation buttons can change things without mutating
  // the original data.js arrays.
  // ----------------------------------------------------------
  const lights = lightCoordinates.map((l) => ({ ...l }));
  let currentDonors = campaignData.currentDonors;
  let selectedCohort = null; // null = "view all cohorts"
  let goalReached = currentDonors >= campaignData.campaignGoal;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // ----------------------------------------------------------
  // CANVAS SETUP
  // ----------------------------------------------------------
  const canvas = document.getElementById("lightCanvas");
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    renderLights();
  }

  // ----------------------------------------------------------
  // renderLights()
  // Draws all 200 lamps. Active lamps get a warm amber core +
  // soft glow with slight per-lamp brightness variance so the
  // room doesn't look mechanically identical. Inactive lamps
  // are faint points that suggest "room for more."
  //
  // When a cohort is selected, that cohort's lights are drawn
  // brighter/larger and everything else is dimmed slightly.
  // ----------------------------------------------------------
  function renderLights() {
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);

    lights.forEach((light) => {
      const x = light.x * w;
      const y = light.y * h;
      const isFocused = selectedCohort === null || light.cohort === selectedCohort;
      const dimFactor = selectedCohort === null ? 1 : isFocused ? 1 : 0.35;

      if (light.active) {
        drawActiveLight(x, y, light.brightness * dimFactor, isFocused && selectedCohort !== null);
      } else {
        drawInactiveLight(x, y, dimFactor);
      }
    });
  }

  function drawActiveLight(x, y, brightness, emphasized) {
    const coreRadius = emphasized ? 4.5 : 3.4;
    const glowRadius = (emphasized ? 22 : 16) * brightness;

    // soft outer glow
    const glow = ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
    glow.addColorStop(0, `rgba(255, 207, 138, ${0.55 * brightness})`);
    glow.addColorStop(0.5, `rgba(227, 161, 90, ${0.22 * brightness})`);
    glow.addColorStop(1, "rgba(227, 161, 90, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
    ctx.fill();

    // small central core
    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 236, 204, ${Math.min(1, brightness + 0.1)})`;
    ctx.arc(x, y, coreRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawInactiveLight(x, y, dimFactor) {
    ctx.beginPath();
    ctx.fillStyle = `rgba(180, 170, 150, ${0.28 * dimFactor})`;
    ctx.arc(x, y, 2.1, 0, Math.PI * 2);
    ctx.fill();
  }

  // ----------------------------------------------------------
  // renderProgress()
  // Updates hero copy, progress bar, and the stats panel.
  // Always keeps the "X of 200" / "20,000+ community" framing
  // separate -- never mixes the two numbers together.
  // ----------------------------------------------------------
  const heroHeadline = document.getElementById("heroHeadline");
  const heroSubhead = document.getElementById("heroSubhead");
  const progressLine = document.getElementById("progressLine");
  const statDonors = document.getElementById("statDonors");
  const statRaised = document.getElementById("statRaised");
  const statLastUpdated = document.getElementById("statLastUpdated");

  // ----------------------------------------------------------
  // Hero frame autoplay
  // Crossfades the hero background through all 14 chapter images
  // (campaignFrames, in data.js) on a fixed 2-second loop —
  // decorative/ambient, independent of real donor progress.
  // (Progress numbers in the sidebar/stats still reflect real
  // data; only the background cycles on its own timer.)
  // Replaces the old per-lamp canvas animation as the primary
  // "room filling up" visual.
  // ----------------------------------------------------------
  const heroFrameA = document.getElementById("heroFrameA");
  const heroFrameB = document.getElementById("heroFrameB");
  let currentFrameIndex = -1;
  let frameALayerIsVisible = true; // tracks which of A/B is on top
  const FRAME_INTERVAL_MS = 2000;

  function setHeroFrame(idx) {
    if (idx === currentFrameIndex) return;
    const nextSrc = `url("${campaignFrames[idx]}")`;

    if (currentFrameIndex === -1) {
      // First render: set the starting frame instantly, no fade-in
      // from blank.
      heroFrameA.style.backgroundImage = nextSrc;
      currentFrameIndex = idx;
      return;
    }
    currentFrameIndex = idx;

    const showing = frameALayerIsVisible ? heroFrameA : heroFrameB;
    const hidden = frameALayerIsVisible ? heroFrameB : heroFrameA;

    hidden.style.backgroundImage = nextSrc;
    // Force a layout flush so the browser registers the new
    // background-image before we start the opacity transition.
    void hidden.offsetWidth;
    hidden.classList.add("hero__frame--visible");
    showing.classList.remove("hero__frame--visible");
    frameALayerIsVisible = !frameALayerIsVisible;
  }

  function startHeroFrameAutoplay() {
    setHeroFrame(0);

    if (prefersReducedMotion) {
      // Respect reduced-motion preference: show the first frame
      // and stop there rather than looping every 2 seconds.
      return;
    }

    setInterval(() => {
      const next = (currentFrameIndex + 1) % campaignFrames.length;
      setHeroFrame(next);
    }, FRAME_INTERVAL_MS);
  }

  // ----------------------------------------------------------
  // NOTE: open-ended version of this campaign -- no fixed
  // 200-donor target surfaced anywhere in the copy.
  // campaignData.campaignGoal still exists internally (the legacy
  // 200-dot canvas array is sized to it), but nothing user-facing
  // compares currentDonors against it anymore. #goalState used to
  // be a "THE ROOM IS LIT" goal-reached celebration that stayed
  // permanently hidden for that reason -- it's now been repurposed
  // as "The Room Is Ours to Build," a permanent closing section, so
  // renderProgress() no longer force-hides it (goalReached is kept
  // around only to gate the demo/preview interactions below, in
  // case a future milestone feature wants it again).
  // ----------------------------------------------------------
  function renderProgress() {
    // The hero's "X seats are taken" line was replaced with the
    // Larry letter/challenge story copy (static, in index.html) --
    // this element no longer exists on the page, so this guard
    // keeps renderProgress() from throwing if it's ever removed
    // entirely from the DOM. The real seat count still lives in the
    // stats panel (statDonors) below.
    if (progressLine) {
      progressLine.textContent = `${currentDonors} seat${currentDonors === 1 ? "" : "s"} ${currentDonors === 1 ? "is" : "are"} taken`;
    }
    statDonors.textContent = String(currentDonors);
    if (typeof campaignData.totalRaised === "number") {
      statRaised.textContent = "$" + Math.round(campaignData.totalRaised).toLocaleString("en-US");
    }
    if (campaignData.lastUpdated) {
      // Visible label just says "Updated daily" -- an exact
      // date/time reads as more automated than this actually is
      // (a script Chau runs by hand after each day's export, not a
      // scheduled job). The real date is still there on hover for
      // anyone who wants to verify it.
      statLastUpdated.title = `Last updated ${campaignData.lastUpdated}`;
    }
    renderResponseLights();

    goalReached = false;
  }

  // ----------------------------------------------------------
  // COHORT NAV + PANEL
  // ----------------------------------------------------------
  const cohortNav = document.getElementById("cohortNav");
  const cohortReset = document.getElementById("cohortReset");
  const cohortAllGrid = document.getElementById("cohortAllGrid");
  const cohortPanel = document.getElementById("cohortPanel");
  const cohortPanelYear = document.getElementById("cohortPanelYear");
  const cohortPanelDonors = document.getElementById("cohortPanelDonors");
  const cohortPanelRank = document.getElementById("cohortPanelRank");
  const cohortPanelCta = document.getElementById("cohortPanelCta");

  function cohortLabel(year) {
    return year >= 2020 ? "2020" : String(year);
  }

  // Non-year cohorts (e.g. "GMS Friend" -- non-alumni allies) shouldn't
  // be prefixed with "Class of". Numeric years still get the prefix.
  function cohortDisplayLabel(year) {
    if (typeof year === "string") return year;
    return `Class of ${cohortLabel(year)}`;
  }

  function buildCohortNav() {
    cohortNav.innerHTML = "";
    cohorts.forEach((c) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cohort-nav__btn";
      btn.textContent = cohortLabel(c.year);
      btn.setAttribute("aria-pressed", "false");
      btn.setAttribute("aria-label", `${cohortDisplayLabel(c.year)}, ${c.donors} sustaining scholars`);
      btn.addEventListener("click", () => selectCohort(c.year));
      cohortNav.appendChild(btn);
    });
  }

  function ranksByDonors() {
    return [...cohorts]
      .sort((a, b) => b.donors - a.donors)
      .map((c, i) => ({ ...c, rank: i + 1 }));
  }

  // ----------------------------------------------------------
  // buildCohortAllGrid()
  // One small card per cohort (label, donors/goal, rank) so
  // "View all cohorts" actually shows all of them at a glance,
  // instead of just closing the single-cohort detail panel.
  // ----------------------------------------------------------
  function buildCohortAllGrid() {
    cohortAllGrid.innerHTML = "";
    const ranked = ranksByDonors();
    ranked.forEach((c) => {
      const card = document.createElement("button");
      card.type = "button";
      // A cohort with any sustaining scholars reads as "lit" (warm
      // amber, matching the lightbulb icons elsewhere) -- zero-donor
      // cohorts stay dim. Without this, every card looked identical
      // regardless of who's actually shown up.
      card.className = "cohort-all-grid__card" + (c.donors > 0 ? " cohort-all-grid__card--lit" : "");
      card.innerHTML = `
        <span class="cohort-all-grid__rank">#${c.rank}</span>
        <span class="cohort-all-grid__label">${cohortDisplayLabel(c.year)}</span>
        <span class="cohort-all-grid__count">${c.donors} <span class="cohort-all-grid__of">sustaining scholar${c.donors === 1 ? "" : "s"}</span></span>
      `;
      card.setAttribute(
        "aria-label",
        `${cohortDisplayLabel(c.year)}, ranked #${c.rank}, ${c.donors} sustaining scholars. View details.`
      );
      card.addEventListener("click", () => selectCohort(c.year));
      cohortAllGrid.appendChild(card);
    });
  }

  // ----------------------------------------------------------
  // selectCohort(year)
  // Highlights a cohort's lights, dims the rest, and opens the
  // side panel with its stats + a CTA scoped to that class year.
  // ----------------------------------------------------------
  function selectCohort(year) {
    selectedCohort = year;

    // update nav button pressed state
    Array.from(cohortNav.children).forEach((btn) => {
      const isMatch = btn.textContent === cohortLabel(year);
      btn.setAttribute("aria-pressed", isMatch ? "true" : "false");
    });

    const cohort = cohorts.find((c) => c.year === year);
    if (!cohort) return;

    const rank = ranksByDonors().find((c) => c.year === year).rank;

    cohortPanelYear.textContent = `${cohortDisplayLabel(year)}`;
    cohortPanelDonors.textContent = String(cohort.donors);
    cohortPanelRank.textContent = `#${rank}`;
    cohortPanelCta.textContent = `TAKE YOUR PLACE WITH THE CLASS OF ${cohortLabel(year)}`;
    cohortPanel.hidden = false;
    cohortAllGrid.hidden = true;

    renderLights();
    renderLeaderboard(); // refresh race highlight + "YOUR CLASS" card
  }

  // ----------------------------------------------------------
  // resetCohortSelection()
  // "View all cohorts" now actually shows every cohort at once
  // (a small ranked card per year) instead of just closing the
  // single-cohort detail panel -- clicking it always shows
  // something, even if no cohort had been selected yet.
  // ----------------------------------------------------------
  function resetCohortSelection() {
    selectedCohort = null;
    Array.from(cohortNav.children).forEach((btn) =>
      btn.setAttribute("aria-pressed", "false")
    );
    cohortPanel.hidden = true;
    renderLights();
    renderLeaderboard(); // clears race highlight + "YOUR CLASS" back to prompt state

    buildCohortAllGrid();
    cohortAllGrid.hidden = false;
    cohortAllGrid.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  // ----------------------------------------------------------
  // renderLeaderboard()
  // Umbrella render for the whole "WHO'S SHOWING UP?" section:
  // the race bars, the "biggest move" callout, and the personalized
  // "YOUR CLASS" card. Called from every place donor counts or the
  // selected cohort can change (init, selectCohort, resetCohortSelection,
  // simulateNewDonor) so all three always stay in sync with each other
  // and with the cohort-nav selection above.
  // ----------------------------------------------------------
  const raceList = document.getElementById("raceList");
  const leaderboardMover = document.getElementById("leaderboardMover");
  const leaderboardMoverDetail = document.getElementById("leaderboardMoverDetail");
  const yourClassCard = document.getElementById("yourClassCard");
  const RACE_ROWS = 5; // how many cohorts show as bars in "The Race Right Now"

  function ordinal(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  // ----------------------------------------------------------
  // computeGap(year)
  // The core calculation the whole redesign is built around: how
  // many MORE donors the given class needs to PASS (not tie) the
  // class immediately ahead of it. Reuses ranksByDonors() -- same
  // sort/rank logic already driving the cohort panel elsewhere, so
  // there's exactly one source of truth for "who's ahead of whom."
  // ----------------------------------------------------------
  function computeGap(year) {
    const ranked = ranksByDonors();
    const idx = ranked.findIndex((c) => c.year === year);
    if (idx === -1) return null;
    const current = ranked[idx];

    if (idx === 0) {
      const second = ranked[1] || null;
      const lead = second ? current.donors - second.donors : current.donors;
      return { isLeader: true, current, second, lead, ranked };
    }

    const above = ranked[idx - 1];
    // +1 because matching their count is still a tie, not a pass.
    const needed = Math.max(1, above.donors - current.donors + 1);
    return { isLeader: false, current, above, needed, ranked };
  }

  // Short, energetic kicker line above the main gap message --
  // only for the near-miss/leader cases explicitly called out in
  // the brief; larger gaps just show the main message with no kicker
  // rather than force a punchy line that doesn't fit.
  function microcopyKicker(gap) {
    if (gap.isLeader) {
      return gap.second && gap.lead <= 2 ? "YOU'RE #1. FOR NOW." : "IN THE LEAD.";
    }
    // needed===1 is skipped here -- the headline itself now says
    // "1 MORE.", so a kicker of "ONE MORE." right above it would
    // just repeat the same number twice.
    if (gap.needed >= 2 && gap.needed <= 3) return "SO CLOSE.";
    return "";
  }

  // ----------------------------------------------------------
  // buildLightIcons(lit, unlit)
  // Renders the "lit vs. unlit bulb" visualization. Caps the total
  // icon count so a large donor number never renders dozens of tiny
  // bulbs -- past the cap it shows a handful of lit bulbs plus a
  // "+N" chip, but the unlit count (the number that actually matters)
  // is always rendered in full, never summarized away.
  // ----------------------------------------------------------
  const LIGHT_ICON_CAP = 24;
  const LIGHT_SVG = (extraClass) => `
    <svg class="light-icon ${extraClass}" viewBox="0 0 24 24" aria-hidden="true">
      <path class="light-icon__glow" d="M12 2a7 7 0 0 0-4 12.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26A7 7 0 0 0 12 2z"/>
      <rect class="light-icon__base" x="9.3" y="18.4" width="5.4" height="1.6" rx="0.6"/>
      <rect class="light-icon__base" x="9.9" y="20.4" width="4.2" height="1.3" rx="0.6"/>
    </svg>`;

  function buildLightIcons(lit, unlit) {
    const total = lit + unlit;
    if (total <= LIGHT_ICON_CAP) {
      return (
        LIGHT_SVG("light-icon--lit").repeat(lit) +
        LIGHT_SVG("light-icon--unlit").repeat(unlit)
      );
    }
    // Over the cap: show a representative handful of lit bulbs (not
    // the real count -- a "+N" chip carries that) plus every unlit
    // bulb, since the unlit count is the whole point of this
    // visualization and must never be summarized away.
    const litShown = Math.max(0, LIGHT_ICON_CAP - unlit - 1);
    return (
      LIGHT_SVG("light-icon--lit").repeat(litShown) +
      `<span class="light-icon__more">+${lit - litShown}</span>` +
      LIGHT_SVG("light-icon--unlit").repeat(unlit)
    );
  }

  // ----------------------------------------------------------
  // buildShareText(gap)
  // Concise, class-specific share copy for the Web Share API /
  // clipboard fallback. Uses the same campaign link the rest of the
  // page already points visitors to.
  // ----------------------------------------------------------
  function buildShareText(gap) {
    const label = cohortDisplayLabel(gap.current.year);
    const link = "https://chaunvidia.github.io/pay-it-forward-library/";
    if (gap.isLeader) {
      const leadLine = gap.second
        ? `We're #1 right now, ${gap.lead} ahead of ${cohortDisplayLabel(gap.second.year)}.`
        : "We're #1 right now.";
      return `HEY ${label.toUpperCase()} \u{1F440}\n\n${leadLine}\nLet's keep it that way.\n\nWho's in?\n\n${link}`;
    }
    return `HEY ${label.toUpperCase()} \u{1F440}\n\nWe're #${gap.current.rank} right now.\n\nWe need ${gap.needed} more scholar${gap.needed === 1 ? "" : "s"} to jump into ${ordinal(gap.above.rank)}.\n\nWho's in?\n\n${link}`;
  }

  async function shareYourClass() {
    if (!selectedCohort) return;
    const gap = computeGap(selectedCohort);
    if (!gap) return;
    const text = buildShareText(gap);

    if (navigator.share) {
      try {
        await navigator.share({ text });
        return;
      } catch (err) {
        // User canceled the native share sheet -- not an error, just stop.
        if (err && err.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied. Paste it in your class chat.");
    } catch (err) {
      showToast("Couldn't copy automatically -- select the text and copy it manually.");
    }
  }

  // ----------------------------------------------------------
  // renderRace()
  // "The Race Right Now" -- top RACE_ROWS cohorts as ranked bars,
  // proportional to the #1 cohort's donor count. Highlights the
  // selected class's row if it's within the visible rows.
  // ----------------------------------------------------------
  function renderRace() {
    const ranked = ranksByDonors();
    const rows = ranked.slice(0, RACE_ROWS);
    const maxDonors = Math.max(1, ranked[0] ? ranked[0].donors : 0);

    raceList.innerHTML = rows
      .map((c) => {
        const pct = Math.max(6, Math.round((c.donors / maxDonors) * 100));
        const isSelected = selectedCohort !== null && c.year === selectedCohort;
        return `
          <div class="race__row${isSelected ? " race__row--selected" : ""}">
            <span class="race__rank">#${c.rank}</span>
            <span class="race__label">${cohortDisplayLabel(c.year)}</span>
            <span class="race__bar"><span class="race__bar-fill" style="width:${pct}%"></span></span>
            <span class="race__count">${c.donors}</span>
          </div>
        `;
      })
      .join("");
  }

  // ----------------------------------------------------------
  // renderYourClassCard()
  // The personalized, screenshot-friendly card. Shows a prompt to
  // choose a class when selectedCohort is null; otherwise shows
  // rank, the lit/unlit light visualization, the gap-to-next
  // message (the hero metric per the brief -- not raw rank), and
  // the Rally/Share CTAs.
  // ----------------------------------------------------------
  function renderYourClassCard() {
    if (selectedCohort === null) {
      yourClassCard.innerHTML = `
        <p class="your-class__prompt">Choose your class above to see exactly how close it is.</p>
        <button type="button" class="btn btn--ghost your-class__choose-btn" id="yourClassChooseBtn">Choose your class</button>
      `;
      const btn = document.getElementById("yourClassChooseBtn");
      if (btn) {
        btn.addEventListener("click", () => {
          cohortNav.scrollIntoView({ behavior: "smooth", block: "center" });
        });
      }
      return;
    }

    const gap = computeGap(selectedCohort);
    if (!gap) return;
    const label = cohortDisplayLabel(gap.current.year);
    // Card eyebrow: "CLASS OF 2003" for a class year, but just
    // "GMS FRIEND" (no "Class of") for the non-year cohort --
    // cohortDisplayLabel() already returns the right base string
    // for each case (label above), this just picks the right prefix.
    const cardLabel =
      typeof gap.current.year === "string" ? label.toUpperCase() : `CLASS OF ${cohortLabel(gap.current.year)}`;
    const kicker = microcopyKicker(gap);

    // Headline is a big standalone number ("4 MORE.") rather than a
    // full sentence -- the number itself is the hero metric per the
    // brief. "Who's lighting the next one?" sits under the lights as
    // its own caption, tying the number directly to the visual.
    let headline, sub, lights, lightsCaption;
    if (gap.isLeader) {
      headline = gap.second ? `${gap.lead} AHEAD.` : "#1.";
      sub = gap.second ? "Let's keep it that way." : "The only class on the board so far.";
      lights = buildLightIcons(gap.current.donors, 0);
      // No unlit lights to point to when you're #1 with no gap --
      // "who's lighting the NEXT one" only makes sense when there's
      // a specific unlit count to fill.
      lightsCaption = "Every one of these is ours.";
    } else {
      headline = `WE ONLY NEED ${gap.needed} MORE.`;
      sub = `${gap.needed} more scholar${gap.needed === 1 ? "" : "s"} and ${label} moves into ${ordinal(gap.above.rank)}.`;
      lights = buildLightIcons(gap.current.donors, gap.needed);
      lightsCaption = "Who's lighting the next one?";
    }

    const rallySub = gap.isLeader
      ? `We're ${gap.lead} ahead. Let's keep it that way. Who's in?`
      : `We're ${gap.needed} scholar${gap.needed === 1 ? "" : "s"} away from taking ${ordinal(gap.above.rank)}. Who's in?`;

    yourClassCard.innerHTML = `
      ${kicker ? `<p class="your-class__kicker">${kicker}</p>` : ""}
      <p class="your-class__label">${cardLabel}</p>
      <p class="your-class__rank">CURRENTLY #${gap.current.rank}</p>
      <p class="your-class__headline">${headline}</p>
      <p class="your-class__sub">${sub}</p>
      <div class="your-class__lights" aria-hidden="true">${lights}</div>
      <p class="your-class__lights-caption">${lightsCaption}</p>
      <div class="your-class__ctas">
        <button type="button" class="btn btn--primary your-class__rally-btn" id="rallyBtn">RALLY ${label.toUpperCase()}</button>
        <button type="button" class="btn btn--ghost your-class__share-btn" id="shareClassBtn">SHARE</button>
      </div>
      <p class="your-class__rally-sub">${rallySub}</p>
      <p class="your-class__brand">Scholars Equity Network &middot; Pay It Forward</p>
    `;

    const rallyBtn = document.getElementById("rallyBtn");
    if (rallyBtn) rallyBtn.addEventListener("click", shareYourClass);
    const shareBtn = document.getElementById("shareClassBtn");
    if (shareBtn) shareBtn.addEventListener("click", shareYourClass);
  }

  function renderLeaderboard() {
    renderRace();

    // "Biggest move this week" needs real week-over-week tracking --
    // hide it rather than show the mock placeholder alongside real
    // donor counts. See campaignData.hasHistoricalData in data.js.
    if (campaignData.hasWeeklyMoverData) {
      leaderboardMover.hidden = false;
      leaderboardMoverDetail.textContent = `${cohortDisplayLabel(biggestMove.year)}: ${biggestMove.newDonorsThisWeek} scholar${biggestMove.newDonorsThisWeek === 1 ? "" : "s"} answered Larry's call this week`;
    } else {
      leaderboardMover.hidden = true;
    }

    renderYourClassCard();
  }

  // ----------------------------------------------------------
  // animateDailyChange()
  // Resets the canvas to yesterday's donor count, then turns on
  // the new lights one at a time, finishing at today's count.
  // ----------------------------------------------------------
  const seeWhatChangedBtn = document.getElementById("seeWhatChangedBtn");
  const dailyChangeSummary = document.getElementById("dailyChangeSummary");

  function firstNInactiveIndexesToActivate(fromCount, toCount) {
    // lights are laid out sequentially per cohort (10 per cohort);
    // find the (toCount - fromCount) lights that come right after
    // the "fromCount"-th currently-active light, in data order.
    const activeIndexes = lights
      .map((l, i) => (l.active ? i : null))
      .filter((i) => i !== null);
    const inactiveIndexes = lights
      .map((l, i) => (!l.active ? i : null))
      .filter((i) => i !== null);
    return inactiveIndexes.slice(0, Math.max(0, toCount - fromCount));
  }

  function animateDailyChange() {
    if (goalReached) return;
    seeWhatChangedBtn.disabled = true;

    const yesterday = campaignData.yesterdayDonors;
    const today = campaignData.currentDonors;
    const delta = today - yesterday;

    // Step 1: temporarily reset the room to yesterday's count.
    const originallyActive = lights.filter((l) => l.active).map((l) => l.index);
    const keepActiveCount = yesterday;
    lights.forEach((l, i) => {
      const activeRank = originallyActive.indexOf(l.index);
      l.active = activeRank !== -1 && activeRank < keepActiveCount;
    });
    currentDonors = yesterday;
    renderLights();
    renderProgress();

    const toReactivate = originallyActive.slice(keepActiveCount, keepActiveCount + delta);

    if (prefersReducedMotion || toReactivate.length === 0) {
      // Jump straight to today's state, no per-light animation.
      toReactivate.forEach((idx) => {
        const light = lights.find((l) => l.index === idx);
        if (light) light.active = true;
      });
      currentDonors = today;
      renderLights();
      renderProgress();
      dailyChangeSummary.textContent = `${delta} more scholar${delta === 1 ? "" : "s"} answered Larry's call.`;
      seeWhatChangedBtn.disabled = false;
      return;
    }

    // Step 2: turn on the new lights one at a time, subtly.
    let step = 0;
    const stepDelayMs = 350;

    function tick() {
      if (step >= toReactivate.length) {
        seeWhatChangedBtn.disabled = false;
        return;
      }
      const idx = toReactivate[step];
      const light = lights.find((l) => l.index === idx);
      if (light) light.active = true;
      currentDonors = yesterday + step + 1;
      renderLights();
      renderProgress();
      step += 1;
      setTimeout(tick, stepDelayMs);
    }

    dailyChangeSummary.textContent = `${delta} more scholar${delta === 1 ? "" : "s"} answered Larry's call.`;
    setTimeout(tick, stepDelayMs);
  }

  // ----------------------------------------------------------
  // simulateNewDonor()
  // Triggered by the "Preview your moment" button -- turns on the
  // next inactive light with a brief glow animation, updates all
  // progress counts (locally only; never touches data.js), and
  // shows a temporary "your light is on" moment. This is a preview
  // of what the moment looks like, not a real transaction -- the
  // primary CTA above it is the real donation link.
  // ----------------------------------------------------------
  const previewMomentBtn = document.getElementById("previewMomentBtn");
  const donorMoment = document.getElementById("donorMoment");
  const donorMomentDetail = document.getElementById("donorMomentDetail");
  const shareMomentBtn = document.getElementById("shareMomentBtn");
  const toast = document.getElementById("toast");

  function simulateNewDonor() {
    if (goalReached) {
      showToast("The room is already lit.");
      return;
    }

    const nextLight = lights.find((l) => !l.active);
    if (!nextLight) return;

    nextLight.active = true;
    currentDonors += 1;

    // bump the cohort's donor count too, so the leaderboard/panel
    // stay consistent with the lit lamp.
    const cohort = cohorts.find((c) => c.year === nextLight.cohort);
    if (cohort && cohort.donors < cohort.goal) {
      cohort.donors += 1;
    }

    renderLights();
    renderProgress();
    renderLeaderboard();
    if (selectedCohort !== null) {
      selectCohort(selectedCohort); // refresh open panel if relevant
    }

    donorMomentDetail.textContent = `You're sustaining scholar #${currentDonors}. And the room just got a little brighter.`;
    donorMoment.hidden = false;

    if (!prefersReducedMotion) {
      // brief highlight pulse handled purely by re-render timing;
      // renderLights() already draws active lights with glow, so a
      // second render after a short delay gives a gentle "settle" cue.
      setTimeout(renderLights, 220);
    }

    showToast("Your light is on.");
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 2600);
  }

  // ----------------------------------------------------------
  // LETTER — collapsed by default (see index.html), so visitors
  // arriving from the letter itself recognize it instantly without
  // scrolling through the whole thing to reach the live campaign.
  // ----------------------------------------------------------
  const letterToggle = document.getElementById("letterToggle");
  const letterMore = document.getElementById("letterMore");
  const letterFade = document.getElementById("letterFade");

  function toggleLetter() {
    const expanded = !letterMore.hidden;
    letterMore.hidden = expanded;
    letterFade.hidden = !expanded;
    letterToggle.setAttribute("aria-expanded", String(!expanded));
    letterToggle.textContent = expanded ? "Read Larry's full letter ↓" : "Collapse letter ↑";
    if (expanded) {
      document.getElementById("letter").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  // ----------------------------------------------------------
  // renderResponseLights()
  // Real, live currentDonors as lit bulbs (via the same
  // buildLightIcons() helper the personalized leaderboard card
  // uses) -- the unlit count here is a fixed, purely illustrative
  // "there's room for more" visual, not a specific numeric claim
  // (the caption never states a number; the real per-class gap
  // lives in the leaderboard card further down the page).
  // ----------------------------------------------------------
  const RESPONSE_ILLUSTRATIVE_UNLIT = 6;

  function renderResponseLights() {
    const el = document.getElementById("responseLights");
    if (!el) return;
    // Local `currentDonors` (not campaignData.currentDonors) so this
    // stays in sync with the preview-moment demo, same as statDonors
    // in renderProgress() below.
    el.innerHTML = buildLightIcons(currentDonors, RESPONSE_ILLUSTRATIVE_UNLIT);
  }

  // ----------------------------------------------------------
  // EVENT WIRING
  // ----------------------------------------------------------
  window.addEventListener("resize", debounce(resizeCanvas, 150));
  cohortReset.addEventListener("click", resetCohortSelection);
  seeWhatChangedBtn.addEventListener("click", animateDailyChange);
  previewMomentBtn.addEventListener("click", simulateNewDonor);
  letterToggle.addEventListener("click", toggleLetter);
  shareMomentBtn.addEventListener("click", () => {
    showToast("Link copied. Share your moment.");
  });

  function debounce(fn, wait) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  // ----------------------------------------------------------
  // INIT
  // ----------------------------------------------------------
  // "Yesterday vs today" needs real day-over-day tracking. When
  // hasYesterdayData is true, populate the static compare numbers
  // from campaignData instead of leaving the placeholder HTML text
  // in place. When false, hide the whole section rather than show
  // mock numbers next to real donor counts.
  function renderDailyChangeSection() {
    const dailyChangeSection = document.getElementById("daily-change");
    if (!campaignData.hasYesterdayData) {
      if (dailyChangeSection) dailyChangeSection.hidden = true;
      return;
    }
    const yesterdayValue = document.getElementById("yesterdayValue");
    const todayValue = document.getElementById("todayValue");
    const delta = campaignData.currentDonors - campaignData.yesterdayDonors;

    yesterdayValue.textContent = `${campaignData.yesterdayDonors} lights`;
    todayValue.textContent = `${campaignData.currentDonors} lights`;
    dailyChangeSummary.textContent =
      delta > 0
        ? `${delta} more scholar${delta === 1 ? "" : "s"} answered Larry's call.`
        : delta < 0
        ? `${Math.abs(delta)} fewer than yesterday. Still ${campaignData.currentDonors} scholars strong.`
        : `Same as yesterday. ${campaignData.currentDonors} scholars strong.`;
  }

  function init() {
    buildCohortNav();
    startHeroFrameAutoplay();
    renderProgress(); // also renders the response lights
    renderLeaderboard();
    renderDailyChangeSection();
    resizeCanvas(); // also performs the initial renderLights()
  }

  document.addEventListener("DOMContentLoaded", init);
})();
