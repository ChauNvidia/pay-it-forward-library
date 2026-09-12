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
  const goalStateSection = document.getElementById("goalState");

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
  // NOTE: exploring an open-ended version of this campaign --
  // no fixed 200-donor target surfaced anywhere in the copy.
  // campaignData.campaignGoal still exists internally (the legacy
  // 200-dot canvas array is sized to it), but nothing user-facing
  // compares currentDonors against it anymore. The "THE ROOM IS
  // LIT" goal-reached celebration is disabled for the same reason
  // -- there's no longer a defined finish line to reach. If a
  // milestone-based celebration (e.g. every 50 donors) is wanted
  // later, that's a different, reintroducible feature.
  // ----------------------------------------------------------
  function renderProgress() {
    progressLine.textContent = `${currentDonors} light${currentDonors === 1 ? "" : "s"} are on`;
    statDonors.textContent = String(currentDonors);

    goalReached = false;
    goalStateSection.hidden = true;
  }

  // ----------------------------------------------------------
  // COHORT NAV + PANEL
  // ----------------------------------------------------------
  const cohortNav = document.getElementById("cohortNav");
  const cohortReset = document.getElementById("cohortReset");
  const cohortPanel = document.getElementById("cohortPanel");
  const cohortPanelYear = document.getElementById("cohortPanelYear");
  const cohortPanelDonors = document.getElementById("cohortPanelDonors");
  const cohortPanelPercent = document.getElementById("cohortPanelPercent");
  const cohortPanelRank = document.getElementById("cohortPanelRank");
  const cohortPanelBarFill = document.getElementById("cohortPanelBarFill");
  const cohortPanelCta = document.getElementById("cohortPanelCta");

  function cohortLabel(year) {
    return year >= 2020 ? "2020+" : String(year);
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
      btn.setAttribute("aria-label", `${cohortDisplayLabel(c.year)}, ${c.donors} of ${c.goal} monthly donors`);
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

    const pct = Math.round((cohort.donors / cohort.goal) * 100);
    const rank = ranksByDonors().find((c) => c.year === year).rank;

    cohortPanelYear.textContent = `${cohortDisplayLabel(year)}`;
    cohortPanelDonors.textContent = String(cohort.donors);
    cohortPanelPercent.textContent = `${pct}%`;
    cohortPanelRank.textContent = `#${rank}`;
    cohortPanelBarFill.style.width = pct + "%";
    cohortPanelCta.textContent = `TAKE YOUR PLACE WITH CLASS OF ${cohortLabel(year)}`;
    cohortPanel.hidden = false;

    renderLights();
  }

  function resetCohortSelection() {
    selectedCohort = null;
    Array.from(cohortNav.children).forEach((btn) =>
      btn.setAttribute("aria-pressed", "false")
    );
    cohortPanel.hidden = true;
    renderLights();
  }

  // ----------------------------------------------------------
  // renderLeaderboard()
  // Builds the "WHO'S SHOWING UP?" cards (top 3 cohorts) and
  // the "biggest move this week" callout.
  // ----------------------------------------------------------
  const leaderboardCards = document.getElementById("leaderboardCards");
  const leaderboardMover = document.getElementById("leaderboardMover");
  const leaderboardMoverDetail = document.getElementById("leaderboardMoverDetail");

  function renderLeaderboard() {
    const ranked = ranksByDonors().slice(0, 3);
    leaderboardCards.innerHTML = "";

    ranked.forEach((c) => {
      const card = document.createElement("div");
      card.className = "leaderboard__card";
      card.innerHTML = `
        <span class="leaderboard__card-rank">#${c.rank}</span>
        <span class="leaderboard__card-body">
          <span class="leaderboard__card-year">${cohortDisplayLabel(c.year)}</span>
          <span class="leaderboard__card-progress">${c.donors} of ${c.goal} lights</span>
        </span>
      `;
      leaderboardCards.appendChild(card);
    });

    // "Biggest move this week" needs real week-over-week tracking --
    // hide it rather than show the mock placeholder alongside real
    // donor counts. See campaignData.hasHistoricalData in data.js.
    if (campaignData.hasWeeklyMoverData) {
      leaderboardMover.hidden = false;
      leaderboardMoverDetail.textContent = `${cohortDisplayLabel(biggestMove.year)} — +${biggestMove.newDonorsThisWeek} new monthly donors`;
    } else {
      leaderboardMover.hidden = true;
    }
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
      dailyChangeSummary.textContent = `${delta} more scholars showed up since yesterday.`;
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

    dailyChangeSummary.textContent = `${delta} more scholars showed up since yesterday.`;
    setTimeout(tick, stepDelayMs);
  }

  // ----------------------------------------------------------
  // simulateNewDonor()
  // Dev-mode button: turns on the next inactive light with a
  // brief glow animation, updates all progress counts, and
  // shows a temporary "your light is on" moment.
  // ----------------------------------------------------------
  const simulateDonorBtn = document.getElementById("simulateDonorBtn");
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

    donorMomentDetail.textContent = `You are monthly donor #${currentDonors} helping light the room.`;
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
  // EVENT WIRING
  // ----------------------------------------------------------
  window.addEventListener("resize", debounce(resizeCanvas, 150));
  cohortReset.addEventListener("click", resetCohortSelection);
  seeWhatChangedBtn.addEventListener("click", animateDailyChange);
  simulateDonorBtn.addEventListener("click", simulateNewDonor);
  shareMomentBtn.addEventListener("click", () => {
    showToast("Link copied — share your moment.");
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
        ? `${delta} more scholar${delta === 1 ? "" : "s"} showed up since yesterday.`
        : delta < 0
        ? `${Math.abs(delta)} fewer than yesterday -- still ${campaignData.currentDonors} strong.`
        : `Same as yesterday -- ${campaignData.currentDonors} strong.`;
  }

  function init() {
    buildCohortNav();
    startHeroFrameAutoplay();
    renderProgress();
    renderLeaderboard();
    renderDailyChangeSection();
    resizeCanvas(); // also performs the initial renderLights()
  }

  document.addEventListener("DOMContentLoaded", init);
})();
