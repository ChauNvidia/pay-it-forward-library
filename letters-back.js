/* ============================================================
   letters-back.js
   "Letters Back to Larry" -- featured carousel + strip + expandable
   full gallery. Reads from lettersBackData (letters-back-data.js).
   Self-contained: does not read or write campaignData / data.js,
   so it can't affect the donor numbers, lightbulb visualization,
   leaderboard, or any other existing behavior on the page.
   ============================================================ */

(function () {
  const data = window.lettersBackData || [];
  if (!data.length) return;

  let currentIndex = 0;
  let galleryOpen = false;

  const els = {};

  function q(id) {
    return document.getElementById(id);
  }

  function render() {
    const total = data.length;
    const person = data[currentIndex];

    els.art.src = person.image;
    els.art.alt = `${person.name} — Letter Back to Larry`;
    els.count.textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${total}`;
    // Featured quote prefers the fuller "Letter Back" paragraph (column G
    // of the tracker) when it exists; falls back to the short pull-quote
    // already embedded in the card artwork for scholars not yet synthesized.
    const featuredText = person.letter || person.quote;
    els.quote.textContent = `“${featuredText}”`;
    els.quote.classList.toggle("lb2-featured__quote--long", Boolean(person.letter));
    els.name.textContent = person.name;
    els.role.textContent = person.role;

    els.prevBtn.disabled = currentIndex === 0;
    els.prevBtn.style.visibility = currentIndex === 0 ? "hidden" : "visible";
    // Label stays fixed ("Next letter →") at every position, including
    // the last one (which loops back to the first) -- so the nav row's
    // width never changes and neither button visually shifts position.

    // The strip always shows "who's next" relative to the current
    // person, so it has to rebuild every time the featured letter changes.
    buildStrip();
  }

  // ---- Deep-linking ----------------------------------------------
  // Each scholar gets a permanent, personal, shareable URL:
  // https://library.scholarsequity.org/?letter=<slug>
  // Read on load to jump straight to that card; kept in sync via
  // history.replaceState as people navigate, so copying the address
  // bar at any point always links back to whoever is featured.
  function slugFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("letter");
  }

  function indexForSlug(slug) {
    if (!slug) return -1;
    return data.findIndex((p) => p.slug === slug);
  }

  function updateURL(index, { replace = true } = {}) {
    const slug = data[index] && data[index].slug;
    if (!slug) return;
    const url = new URL(window.location.href);
    url.searchParams.set("letter", slug);
    const method = replace ? "replaceState" : "pushState";
    window.history[method](null, "", url);
  }

  function goTo(index, opts) {
    const total = data.length;
    currentIndex = ((index % total) + total) % total;
    render();
    updateURL(currentIndex, opts);
    els.featured.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function buildStrip() {
    // Show up to 5 people after the currently-featured one, plus a
    // "+N more" tile that opens the full gallery.
    const total = data.length;
    const previewCount = Math.min(5, total - 1);
    els.strip.innerHTML = "";

    for (let i = 1; i <= previewCount; i++) {
      const idx = (currentIndex + i) % total;
      const person = data[idx];
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "lb2-strip__card";
      btn.dataset.index = String(idx);
      btn.setAttribute("aria-label", `View ${person.name}'s letter`);
      const img = document.createElement("img");
      img.src = person.image;
      img.alt = person.name;
      img.loading = "lazy";
      btn.appendChild(img);
      btn.addEventListener("click", () => goTo(idx));
      els.strip.appendChild(btn);
    }

    const remaining = total - 1 - previewCount;
    if (remaining > 0) {
      const moreBtn = document.createElement("button");
      moreBtn.type = "button";
      moreBtn.className = "lb2-strip__card lb2-strip__more";
      moreBtn.innerHTML = `<span class="lb2-strip__more-count">+${remaining}</span><span class="lb2-strip__more-label">more letters</span>`;
      moreBtn.addEventListener("click", openGallery);
      els.strip.appendChild(moreBtn);
    }
  }

  function buildGallery() {
    els.galleryGrid.innerHTML = "";
    data.forEach((person, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "lb2-gallery__card";
      btn.setAttribute("aria-label", `View ${person.name}'s letter`);
      const img = document.createElement("img");
      img.src = person.image;
      img.alt = person.name;
      img.loading = "lazy";
      btn.appendChild(img);
      btn.addEventListener("click", () => {
        goTo(idx);
        closeGallery();
      });
      els.galleryGrid.appendChild(btn);
    });
  }

  function openGallery() {
    galleryOpen = true;
    els.gallery.hidden = false;
    els.viewAllBtn.hidden = true;
    els.galleryHeading.textContent = `${data.length} voices from across the Gates Millennium Scholars Program`;
  }

  function closeGallery() {
    galleryOpen = false;
    els.gallery.hidden = true;
    els.viewAllBtn.hidden = false;
  }

  // ---- Swipe support (mobile) ----------------------------------
  function addSwipe(el, onLeft, onRight) {
    let startX = null;
    el.addEventListener(
      "touchstart",
      (e) => {
        startX = e.touches[0].clientX;
      },
      { passive: true }
    );
    el.addEventListener(
      "touchend",
      (e) => {
        if (startX === null) return;
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 40) {
          if (dx < 0) onLeft();
          else onRight();
        }
        startX = null;
      },
      { passive: true }
    );
  }

  function init() {
    els.featured = q("lb2Featured");
    if (!els.featured) return; // section not present on this page

    els.art = q("lb2Art");
    els.count = q("lb2Count");
    els.quote = q("lb2Quote");
    els.name = q("lb2Name");
    els.role = q("lb2Role");
    els.prevBtn = q("lb2Prev");
    els.nextBtn = q("lb2Next");
    els.strip = q("lb2Strip");
    els.viewAllBtn = q("lb2ViewAll");
    els.gallery = q("lb2Gallery");
    els.galleryGrid = q("lb2GalleryGrid");
    els.galleryHeading = q("lb2GalleryHeading");
    els.galleryClose = q("lb2GalleryClose");
    // Every element whose id starts with "lb2TotalCount" (there are a
    // few, sprinkled through the intro copy + "View all N letters"
    // button) shows the live count -- N reflects however many entries
    // are actually in lettersBackData right now, not a hardcoded number,
    // so the page can grow from 6 letters to 27 without an edit here.
    document.querySelectorAll('[id^="lb2TotalCount"]').forEach((el) => {
      el.textContent = data.length;
    });
    els.prevBtn.addEventListener("click", () => goTo(currentIndex - 1));
    els.nextBtn.addEventListener("click", () => goTo(currentIndex + 1));
    els.viewAllBtn.addEventListener("click", openGallery);
    els.galleryClose.addEventListener("click", closeGallery);

    addSwipe(
      els.art,
      () => goTo(currentIndex + 1),
      () => goTo(currentIndex - 1)
    );

    // If the URL names a scholar (?letter=<slug>), open directly on
    // their card AND scroll it into view -- a ?query= param (unlike a
    // #hash) gets no automatic browser scroll on load, so without this
    // a shared personal link would silently land at the top of the
    // page instead of at the person it's actually for.
    const requestedSlug = slugFromURL();
    const requestedIndex = indexForSlug(requestedSlug);
    if (requestedIndex !== -1) {
      currentIndex = requestedIndex;
    }

    buildGallery();
    render();

    // Only touch the URL on load if the visitor actually arrived via a
    // ?letter=<slug> link. A bare domain visit (or any slug-less load)
    // must stay exactly as typed -- previously this ran unconditionally
    // and silently appended whichever scholar happened to be first in
    // lettersBackData to every plain visit to the homepage.
    if (requestedIndex !== -1) {
      updateURL(currentIndex);
      // Wait a tick for images/layout to settle so the scroll lands on
      // the right spot instead of being thrown off by a late layout
      // shift (e.g. the hero image finishing its load).
      window.requestAnimationFrame(() => {
        els.featured.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }

    window.addEventListener("popstate", () => {
      const idx = indexForSlug(slugFromURL());
      if (idx !== -1) {
        currentIndex = idx;
        render();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
