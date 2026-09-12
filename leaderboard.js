/* ============================================================
   leaderboard.js
   Standalone script for leaderboard.html ("Option 2" — the same
   hero animation as the homepage, but with a live stats bar +
   an always-visible cohort grid instead of a single donate CTA.

   Deliberately self-contained (does NOT touch app.js) so nothing
   here can regress the homepage. Reads the same data.js as the
   homepage, so both pages always show consistent numbers as long
   as data.js is kept up to date.
   ============================================================ */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // ----------------------------------------------------------
  // Hero frame autoplay -- identical logic to app.js's version.
  // Kept as a separate copy (not a shared module) on purpose:
  // this page has no build step, and duplicating ~30 lines is a
  // much smaller risk than adding a shared-script dependency
  // between the two pages.
  // ----------------------------------------------------------
  const heroFrameA = document.getElementById("heroFrameA");
  const heroFrameB = document.getElementById("heroFrameB");
  let currentFrameIndex = -1;
  let frameALayerIsVisible = true;
  const FRAME_INTERVAL_MS = 2000;

  function setHeroFrame(idx) {
    if (idx === currentFrameIndex) return;
    const nextSrc = `url("${campaignFrames[idx]}")`;

    if (currentFrameIndex === -1) {
      heroFrameA.style.backgroundImage = nextSrc;
      currentFrameIndex = idx;
      return;
    }
    currentFrameIndex = idx;

    const showing = frameALayerIsVisible ? heroFrameA : heroFrameB;
    const hidden = frameALayerIsVisible ? heroFrameB : heroFrameA;

    hidden.style.backgroundImage = nextSrc;
    void hidden.offsetWidth;
    hidden.classList.add("hero__frame--visible");
    showing.classList.remove("hero__frame--visible");
    frameALayerIsVisible = !frameALayerIsVisible;
  }

  function startHeroFrameAutoplay() {
    setHeroFrame(0);
    if (prefersReducedMotion) return;
    setInterval(() => {
      const next = (currentFrameIndex + 1) % campaignFrames.length;
      setHeroFrame(next);
    }, FRAME_INTERVAL_MS);
  }

  // ----------------------------------------------------------
  // Stats bar
  // totalRaised / cohortsWithActivity come from campaignData,
  // written by update_from_donations.py alongside currentDonors.
  // If a real export hasn't set them yet, fall back to computing
  // cohortsWithActivity from the cohorts array so the page never
  // shows "undefined".
  // ----------------------------------------------------------
  function cohortsWithActivityCount() {
    if (typeof campaignData.cohortsWithActivity === "number") {
      return campaignData.cohortsWithActivity;
    }
    return cohorts.filter((c) => c.donors > 0).length;
  }

  function formatDollars(amount) {
    return "$" + Math.round(amount).toLocaleString("en-US");
  }

  function renderStats() {
    document.getElementById("lbTotalDonors").textContent = String(
      campaignData.currentDonors
    );
    document.getElementById("lbCohortsActive").textContent = String(
      cohortsWithActivityCount()
    );
    document.getElementById("lbTotalRaised").textContent =
      typeof campaignData.totalRaised === "number"
        ? formatDollars(campaignData.totalRaised)
        : "—";
    if (campaignData.lastUpdated) {
      // Visible label just says "Updated daily" -- see app.js's
      // renderProgress() for why (matches the homepage's approach).
      document.getElementById("lbLastUpdated").title =
        `Last updated ${campaignData.lastUpdated}`;
    }
  }

  // ----------------------------------------------------------
  // Cohort label helpers -- same rules as app.js: "2020+" bucket,
  // non-year cohorts (e.g. "GMS Friend") skip the "Class of" prefix
  // and get a friendlier display name here ("Community Allies") to
  // match this page's design.
  // ----------------------------------------------------------
  function cohortLabel(year) {
    return year >= 2020 ? "2020" : String(year);
  }

  function cohortDisplayLabel(year) {
    if (typeof year === "string") {
      return year === "GMS Friend" ? "Community Allies" : year;
    }
    return `Class of ${cohortLabel(year)}`;
  }

  function ranksByDonors() {
    return [...cohorts]
      .sort((a, b) => b.donors - a.donors)
      .map((c, i) => ({ ...c, rank: i + 1 }));
  }

  // ----------------------------------------------------------
  // Always-visible cohort grid -- no goal/progress-bar framing
  // (matches the open-ended homepage), just rank + plain count.
  // The non-year "Community Allies" card gets its own accent
  // style, same idea as the mockup's blue-highlighted card.
  // ----------------------------------------------------------
  function buildCohortGrid() {
    const grid = document.getElementById("lbCohortGrid");
    grid.innerHTML = "";
    const ranked = ranksByDonors();

    ranked.forEach((c) => {
      const card = document.createElement("div");
      const isAlly = typeof c.year === "string";
      card.className =
        "cohort-all-grid__card lb-grid__card" +
        (isAlly ? " lb-grid__card--ally" : "");
      card.innerHTML = `
        <span class="cohort-all-grid__rank">#${c.rank}</span>
        <span class="cohort-all-grid__label">${cohortDisplayLabel(c.year)}</span>
        <span class="cohort-all-grid__count">${c.donors} <span class="cohort-all-grid__of">sustaining donor${c.donors === 1 ? "" : "s"}</span></span>
      `;
      grid.appendChild(card);
    });
  }

  function init() {
    startHeroFrameAutoplay();
    renderStats();
    buildCohortGrid();
  }

  init();
})();
