/* ============================================================
   data.js
   All mock campaign data lives here so it can be swapped for
   real numbers later without touching any rendering logic.
   ============================================================ */

// ----------------------------------------------------------
// TOP-LEVEL CAMPAIGN DATA
// networkSize   = the full Gates Millennium Scholars community
//                 (NOT visualized as individual lights)
// campaignGoal  = number of visible lamps in the room (200)
// currentDonors = how many lamps are lit right now (today's total)
// yesterdayDonors = lamp count as of yesterday, used for the
//                    "yesterday vs today" animation
// ----------------------------------------------------------
const campaignData = {
  networkSize: 20000,
  campaignGoal: 200,
  // Sept 17: now combines UNCF (10 donors, $610) + Give Butter (7
  // unique donors, $2,047) via the new Donation-Master-Tracker.xlsx.
  // See that file for source-by-source detail. The 7 Give Butter
  // donors count toward currentDonors/totalRaised immediately, but
  // NOT yet toward any specific cohort's lit lamp below -- their
  // class years are marked "NEEDS LOOKUP" in the tracker. Once Chau
  // fills those in, cohorts[] below should be updated to include them.
  currentDonors: 17,
  yesterdayDonors: 10, // yesterday's UNCF-only total, before Give Butter was folded in today
  hasYesterdayData: true, // real yesterday-vs-today number now exists
  // Turned off Sept 16 -- this week's real delta was a tie (2012 and
  // 2013 both +1, no single winner), so "Biggest move" stopped making
  // sense as a singular callout. Flip back to true once there's a
  // real single biggest mover to show, and update biggestMove below.
  hasWeeklyMoverData: false,
  // ---- Used only by leaderboard.html ("Option 2") ----
  // cohortsWithActivity = count of cohorts[] entries with donors > 0
  // totalRaised = sum of the Amount column across all real donations,
  // now across ALL sources in Donation-Master-Tracker.xlsx, not just
  // the UNCF export.
  cohortsWithActivity: 9,
  totalRaised: 2657,
  // Stamped whenever the master tracker is rebuilt (previously ran
  // once a day; now runs any time a new source is folded in) -- shown
  // as "Updated [date] at 9pm PST" wherever lastUpdatedNote appears.
  lastUpdated: "September 17, 2026"
};

// ----------------------------------------------------------
// COHORT DATA
// 20 scholar class-year cohorts, each with its own goal of 10
// sustaining donors (20 cohorts x 10 = 200 campaign lights).
// "donors" here should always match the count of active lights
// tagged with that cohort year in lightCoordinates below.
// ----------------------------------------------------------
const cohorts = [
  { year: 2000, donors: 1, goal: 10 },
  { year: 2001, donors: 0, goal: 10 },
  { year: 2002, donors: 0, goal: 10 },
  { year: 2003, donors: 0, goal: 10 },
  { year: 2004, donors: 0, goal: 10 },
  { year: 2005, donors: 1, goal: 10 }, // Give Butter: Naomie Droll (2 gifts, 1 donor)
  { year: 2006, donors: 0, goal: 10 },
  { year: 2007, donors: 0, goal: 10 },
  { year: 2008, donors: 1, goal: 10 },
  { year: 2009, donors: 1, goal: 10 },
  { year: 2010, donors: 0, goal: 10 },
  { year: 2011, donors: 1, goal: 10 },
  { year: 2012, donors: 1, goal: 10 },
  { year: 2013, donors: 1, goal: 10 },
  { year: 2014, donors: 0, goal: 10 },
  { year: 2015, donors: 0, goal: 10 },
  { year: 2016, donors: 1, goal: 10 }, // Give Butter: Emilia Savage
  { year: 2017, donors: 0, goal: 10 },
  { year: 2018, donors: 0, goal: 10 },
  { year: 2019, donors: 0, goal: 10 },
  { year: 2020, donors: 0, goal: 10 }, // "2020+" -- most recent scholars, bucketed together
  { year: "GMS Friend", donors: 7, goal: 10 } // non-alumni allies, not a class year -- +3 from Give Butter (Barry Nagle, Michael Boone, Michelle Cohenour)
];

// ----------------------------------------------------------
// "Biggest move this week" -- placeholder for the leaderboard
// section's friendly-competition callout. NOT wired to real data --
// only shown when campaignData.hasHistoricalData is true. Update
// this with a real weekly-delta computation before flipping that
// flag on.
// ----------------------------------------------------------
const biggestMove = {
  year: "GMS Friend", // real: only mover this week -- GMS Friend went 3 -> 4 (+1); all class-year cohorts unchanged
  newDonorsThisWeek: 1
};

// ----------------------------------------------------------
// LIGHT COORDINATES
// 200 campaign lamps, one per sustaining donor slot.
// Coordinates are PERCENTAGES (0-1) of the canvas width/height,
// not fixed pixels, so the room can resize responsively.
//
// Each light belongs to a cohort "zone" -- positions are hand-fit to
// the actual reading tables visible in library-bg.jpg: two table
// "wings" (left of the aisle, right of the aisle), each with two
// columns (outer row near the bookshelves, inner row near the
// aisle) x 5 rows receding in depth. 10 cohorts sit in each wing.
//
// `active` mirrors the cohort's current donor count: the first
// N lights in a cohort's group of 10 are lit, matching
// cohorts[].donors above.
//
// `brightness` (0.82-1.0) gives active lights a slight natural
// variance so the room doesn't look mechanically uniform.
// ----------------------------------------------------------
const lightCoordinates = [
  { x: 0.0730, y: 0.5607, cohort: 2001, index: 0, brightness: 0.99, active: false },
  { x: 0.0952, y: 0.5601, cohort: 2001, index: 1, brightness: 0.93, active: false },
  { x: 0.1150, y: 0.5601, cohort: 2001, index: 2, brightness: 0.93, active: false },
  { x: 0.1419, y: 0.5551, cohort: 2001, index: 3, brightness: 0.87, active: false },
  { x: 0.1583, y: 0.5637, cohort: 2001, index: 4, brightness: 0.94, active: false },
  { x: 0.0698, y: 0.5758, cohort: 2001, index: 5, brightness: 0.99, active: false },
  { x: 0.0967, y: 0.5714, cohort: 2001, index: 6, brightness: 0.85, active: false },
  { x: 0.1136, y: 0.5703, cohort: 2001, index: 7, brightness: 0.83, active: false },
  { x: 0.1371, y: 0.5669, cohort: 2001, index: 8, brightness: 0.83, active: false },
  { x: 0.1613, y: 0.5693, cohort: 2001, index: 9, brightness: 0.97, active: false },
  { x: 0.0736, y: 0.6039, cohort: 2002, index: 10, brightness: 0.91, active: false },
  { x: 0.0968, y: 0.6017, cohort: 2002, index: 11, brightness: 0.87, active: false },
  { x: 0.1215, y: 0.6081, cohort: 2002, index: 12, brightness: 0.97, active: false },
  { x: 0.1412, y: 0.6000, cohort: 2002, index: 13, brightness: 0.86, active: false },
  { x: 0.1599, y: 0.5970, cohort: 2002, index: 14, brightness: 0.96, active: false },
  { x: 0.0726, y: 0.6190, cohort: 2002, index: 15, brightness: 0.89, active: false },
  { x: 0.0991, y: 0.6191, cohort: 2002, index: 16, brightness: 0.82, active: false },
  { x: 0.1152, y: 0.6198, cohort: 2002, index: 17, brightness: 0.90, active: false },
  { x: 0.1434, y: 0.6137, cohort: 2002, index: 18, brightness: 0.83, active: false },
  { x: 0.1626, y: 0.6182, cohort: 2002, index: 19, brightness: 0.87, active: false },
  { x: 0.0701, y: 0.6858, cohort: 2003, index: 20, brightness: 0.99, active: false },
  { x: 0.0975, y: 0.6832, cohort: 2003, index: 21, brightness: 0.86, active: false },
  { x: 0.1143, y: 0.6825, cohort: 2003, index: 22, brightness: 0.96, active: false },
  { x: 0.1370, y: 0.6885, cohort: 2003, index: 23, brightness: 0.90, active: false },
  { x: 0.1591, y: 0.6906, cohort: 2003, index: 24, brightness: 0.84, active: false },
  { x: 0.0746, y: 0.7015, cohort: 2003, index: 25, brightness: 0.90, active: false },
  { x: 0.0932, y: 0.7033, cohort: 2003, index: 26, brightness: 0.99, active: false },
  { x: 0.1199, y: 0.7037, cohort: 2003, index: 27, brightness: 0.98, active: false },
  { x: 0.1372, y: 0.7048, cohort: 2003, index: 28, brightness: 0.97, active: false },
  { x: 0.1627, y: 0.7013, cohort: 2003, index: 29, brightness: 1.00, active: false },
  { x: 0.0711, y: 0.8017, cohort: 2004, index: 30, brightness: 0.96, active: false },
  { x: 0.0941, y: 0.8021, cohort: 2004, index: 31, brightness: 0.83, active: false },
  { x: 0.1142, y: 0.8055, cohort: 2004, index: 32, brightness: 0.86, active: false },
  { x: 0.1404, y: 0.8030, cohort: 2004, index: 33, brightness: 0.90, active: false },
  { x: 0.1653, y: 0.8044, cohort: 2004, index: 34, brightness: 0.92, active: false },
  { x: 0.0764, y: 0.8265, cohort: 2004, index: 35, brightness: 0.85, active: false },
  { x: 0.0987, y: 0.8341, cohort: 2004, index: 36, brightness: 0.86, active: false },
  { x: 0.1150, y: 0.8332, cohort: 2004, index: 37, brightness: 0.99, active: false },
  { x: 0.1371, y: 0.8357, cohort: 2004, index: 38, brightness: 0.98, active: false },
  { x: 0.1624, y: 0.8294, cohort: 2004, index: 39, brightness: 0.84, active: false },
  { x: 0.0697, y: 0.9531, cohort: 2005, index: 40, brightness: 0.86, active: false },
  { x: 0.0971, y: 0.9446, cohort: 2005, index: 41, brightness: 0.97, active: false },
  { x: 0.1183, y: 0.9450, cohort: 2005, index: 42, brightness: 0.85, active: false },
  { x: 0.1413, y: 0.9423, cohort: 2005, index: 43, brightness: 0.86, active: false },
  { x: 0.1621, y: 0.9517, cohort: 2005, index: 44, brightness: 0.93, active: false },
  { x: 0.0717, y: 0.9875, cohort: 2005, index: 45, brightness: 0.86, active: false },
  { x: 0.0916, y: 0.9797, cohort: 2005, index: 46, brightness: 0.90, active: false },
  { x: 0.1140, y: 0.9786, cohort: 2005, index: 47, brightness: 0.89, active: false },
  { x: 0.1401, y: 0.9781, cohort: 2005, index: 48, brightness: 0.89, active: false },
  { x: 0.1647, y: 0.9883, cohort: 2005, index: 49, brightness: 0.94, active: false },
  { x: 0.2299, y: 0.5610, cohort: 2006, index: 50, brightness: 0.85, active: false },
  { x: 0.2467, y: 0.5542, cohort: 2006, index: 51, brightness: 0.98, active: false },
  { x: 0.2741, y: 0.5656, cohort: 2006, index: 52, brightness: 0.82, active: false },
  { x: 0.2956, y: 0.5598, cohort: 2006, index: 53, brightness: 0.95, active: false },
  { x: 0.3151, y: 0.5660, cohort: 2006, index: 54, brightness: 0.83, active: false },
  { x: 0.2288, y: 0.5728, cohort: 2006, index: 55, brightness: 0.98, active: false },
  { x: 0.2524, y: 0.5724, cohort: 2006, index: 56, brightness: 0.96, active: false },
  { x: 0.2758, y: 0.5682, cohort: 2006, index: 57, brightness: 0.94, active: false },
  { x: 0.2977, y: 0.5745, cohort: 2006, index: 58, brightness: 0.90, active: false },
  { x: 0.3189, y: 0.5744, cohort: 2006, index: 59, brightness: 0.92, active: false },
  { x: 0.2294, y: 0.6008, cohort: 2007, index: 60, brightness: 0.92, active: false },
  { x: 0.2513, y: 0.5971, cohort: 2007, index: 61, brightness: 0.94, active: false },
  { x: 0.2764, y: 0.6067, cohort: 2007, index: 62, brightness: 0.95, active: false },
  { x: 0.2936, y: 0.6050, cohort: 2007, index: 63, brightness: 0.92, active: false },
  { x: 0.3161, y: 0.6062, cohort: 2007, index: 64, brightness: 0.84, active: false },
  { x: 0.2304, y: 0.6092, cohort: 2007, index: 65, brightness: 0.93, active: false },
  { x: 0.2503, y: 0.6117, cohort: 2007, index: 66, brightness: 0.95, active: false },
  { x: 0.2725, y: 0.6163, cohort: 2007, index: 67, brightness: 0.99, active: false },
  { x: 0.2926, y: 0.6090, cohort: 2007, index: 68, brightness: 0.87, active: false },
  { x: 0.3180, y: 0.6113, cohort: 2007, index: 69, brightness: 0.85, active: false },
  { x: 0.2317, y: 0.6897, cohort: 2008, index: 70, brightness: 0.90, active: true },
  { x: 0.2536, y: 0.6858, cohort: 2008, index: 71, brightness: 0.94, active: false },
  { x: 0.2701, y: 0.6870, cohort: 2008, index: 72, brightness: 0.97, active: false },
  { x: 0.2979, y: 0.6924, cohort: 2008, index: 73, brightness: 0.89, active: false },
  { x: 0.3172, y: 0.6856, cohort: 2008, index: 74, brightness: 0.84, active: false },
  { x: 0.2284, y: 0.7101, cohort: 2008, index: 75, brightness: 0.97, active: false },
  { x: 0.2521, y: 0.7115, cohort: 2008, index: 76, brightness: 0.87, active: false },
  { x: 0.2699, y: 0.7055, cohort: 2008, index: 77, brightness: 0.87, active: false },
  { x: 0.2923, y: 0.7050, cohort: 2008, index: 78, brightness: 0.93, active: false },
  { x: 0.3165, y: 0.7039, cohort: 2008, index: 79, brightness: 0.97, active: false },
  { x: 0.2323, y: 0.8040, cohort: 2009, index: 80, brightness: 0.83, active: true },
  { x: 0.2467, y: 0.8090, cohort: 2009, index: 81, brightness: 0.83, active: false },
  { x: 0.2742, y: 0.8054, cohort: 2009, index: 82, brightness: 0.88, active: false },
  { x: 0.2969, y: 0.7988, cohort: 2009, index: 83, brightness: 0.84, active: false },
  { x: 0.3162, y: 0.7988, cohort: 2009, index: 84, brightness: 0.97, active: false },
  { x: 0.2263, y: 0.8260, cohort: 2009, index: 85, brightness: 0.83, active: false },
  { x: 0.2515, y: 0.8297, cohort: 2009, index: 86, brightness: 0.93, active: false },
  { x: 0.2737, y: 0.8340, cohort: 2009, index: 87, brightness: 0.99, active: false },
  { x: 0.2960, y: 0.8267, cohort: 2009, index: 88, brightness: 0.91, active: false },
  { x: 0.3140, y: 0.8245, cohort: 2009, index: 89, brightness: 0.90, active: false },
  { x: 0.2301, y: 0.9436, cohort: 2010, index: 90, brightness: 0.87, active: false },
  { x: 0.2492, y: 0.9499, cohort: 2010, index: 91, brightness: 0.91, active: false },
  { x: 0.2734, y: 0.9506, cohort: 2010, index: 92, brightness: 0.89, active: false },
  { x: 0.2969, y: 0.9524, cohort: 2010, index: 93, brightness: 0.84, active: false },
  { x: 0.3200, y: 0.9502, cohort: 2010, index: 94, brightness: 0.84, active: false },
  { x: 0.2280, y: 0.9840, cohort: 2010, index: 95, brightness: 0.98, active: false },
  { x: 0.2495, y: 0.9833, cohort: 2010, index: 96, brightness: 0.98, active: false },
  { x: 0.2749, y: 0.9878, cohort: 2010, index: 97, brightness: 0.90, active: false },
  { x: 0.2958, y: 0.9790, cohort: 2010, index: 98, brightness: 0.95, active: false },
  { x: 0.3191, y: 0.9842, cohort: 2010, index: 99, brightness: 0.95, active: false },
  { x: 0.6811, y: 0.5648, cohort: 2011, index: 100, brightness: 1.00, active: true },
  { x: 0.7093, y: 0.5604, cohort: 2011, index: 101, brightness: 0.96, active: false },
  { x: 0.7261, y: 0.5649, cohort: 2011, index: 102, brightness: 0.97, active: false },
  { x: 0.7483, y: 0.5550, cohort: 2011, index: 103, brightness: 0.90, active: false },
  { x: 0.7720, y: 0.5632, cohort: 2011, index: 104, brightness: 0.91, active: false },
  { x: 0.6796, y: 0.5737, cohort: 2011, index: 105, brightness: 0.83, active: false },
  { x: 0.7079, y: 0.5661, cohort: 2011, index: 106, brightness: 0.88, active: false },
  { x: 0.7298, y: 0.5657, cohort: 2011, index: 107, brightness: 0.85, active: false },
  { x: 0.7497, y: 0.5727, cohort: 2011, index: 108, brightness: 0.97, active: false },
  { x: 0.7731, y: 0.5753, cohort: 2011, index: 109, brightness: 0.91, active: false },
  { x: 0.6870, y: 0.5972, cohort: 2012, index: 110, brightness: 0.86, active: false },
  { x: 0.7057, y: 0.5996, cohort: 2012, index: 111, brightness: 0.95, active: false },
  { x: 0.7286, y: 0.6024, cohort: 2012, index: 112, brightness: 0.97, active: false },
  { x: 0.7500, y: 0.5999, cohort: 2012, index: 113, brightness: 0.89, active: false },
  { x: 0.7743, y: 0.6070, cohort: 2012, index: 114, brightness: 0.86, active: false },
  { x: 0.6862, y: 0.6205, cohort: 2012, index: 115, brightness: 0.91, active: false },
  { x: 0.7060, y: 0.6113, cohort: 2012, index: 116, brightness: 0.92, active: false },
  { x: 0.7275, y: 0.6162, cohort: 2012, index: 117, brightness: 0.82, active: false },
  { x: 0.7533, y: 0.6151, cohort: 2012, index: 118, brightness: 0.89, active: false },
  { x: 0.7740, y: 0.6156, cohort: 2012, index: 119, brightness: 0.91, active: false },
  { x: 0.6849, y: 0.6826, cohort: 2013, index: 120, brightness: 0.92, active: false },
  { x: 0.7048, y: 0.6933, cohort: 2013, index: 121, brightness: 0.99, active: false },
  { x: 0.7257, y: 0.6875, cohort: 2013, index: 122, brightness: 0.84, active: false },
  { x: 0.7490, y: 0.6916, cohort: 2013, index: 123, brightness: 0.98, active: false },
  { x: 0.7714, y: 0.6856, cohort: 2013, index: 124, brightness: 0.85, active: false },
  { x: 0.6844, y: 0.7112, cohort: 2013, index: 125, brightness: 0.84, active: false },
  { x: 0.7077, y: 0.7003, cohort: 2013, index: 126, brightness: 0.85, active: false },
  { x: 0.7253, y: 0.7083, cohort: 2013, index: 127, brightness: 0.88, active: false },
  { x: 0.7484, y: 0.7075, cohort: 2013, index: 128, brightness: 0.84, active: false },
  { x: 0.7734, y: 0.7015, cohort: 2013, index: 129, brightness: 0.91, active: false },
  { x: 0.6814, y: 0.8009, cohort: 2014, index: 130, brightness: 0.92, active: false },
  { x: 0.7050, y: 0.8031, cohort: 2014, index: 131, brightness: 0.89, active: false },
  { x: 0.7277, y: 0.8005, cohort: 2014, index: 132, brightness: 0.86, active: false },
  { x: 0.7506, y: 0.8062, cohort: 2014, index: 133, brightness: 0.92, active: false },
  { x: 0.7744, y: 0.8059, cohort: 2014, index: 134, brightness: 0.97, active: false },
  { x: 0.6813, y: 0.8332, cohort: 2014, index: 135, brightness: 0.97, active: false },
  { x: 0.7087, y: 0.8281, cohort: 2014, index: 136, brightness: 0.88, active: false },
  { x: 0.7309, y: 0.8269, cohort: 2014, index: 137, brightness: 1.00, active: false },
  { x: 0.7526, y: 0.8259, cohort: 2014, index: 138, brightness: 0.86, active: false },
  { x: 0.7734, y: 0.8274, cohort: 2014, index: 139, brightness: 0.84, active: false },
  { x: 0.6861, y: 0.9466, cohort: 2015, index: 140, brightness: 0.96, active: false },
  { x: 0.7025, y: 0.9463, cohort: 2015, index: 141, brightness: 0.94, active: false },
  { x: 0.7236, y: 0.9439, cohort: 2015, index: 142, brightness: 0.94, active: false },
  { x: 0.7528, y: 0.9531, cohort: 2015, index: 143, brightness: 0.84, active: false },
  { x: 0.7716, y: 0.9506, cohort: 2015, index: 144, brightness: 0.91, active: false },
  { x: 0.6849, y: 0.9788, cohort: 2015, index: 145, brightness: 0.83, active: false },
  { x: 0.7023, y: 0.9769, cohort: 2015, index: 146, brightness: 0.92, active: false },
  { x: 0.7276, y: 0.9833, cohort: 2015, index: 147, brightness: 0.85, active: false },
  { x: 0.7470, y: 0.9789, cohort: 2015, index: 148, brightness: 0.97, active: false },
  { x: 0.7755, y: 0.9876, cohort: 2015, index: 149, brightness: 0.84, active: false },
  { x: 0.8389, y: 0.5654, cohort: 2016, index: 150, brightness: 0.90, active: false },
  { x: 0.8658, y: 0.5579, cohort: 2016, index: 151, brightness: 0.90, active: false },
  { x: 0.8851, y: 0.5592, cohort: 2016, index: 152, brightness: 0.93, active: false },
  { x: 0.9024, y: 0.5624, cohort: 2016, index: 153, brightness: 0.97, active: false },
  { x: 0.9250, y: 0.5594, cohort: 2016, index: 154, brightness: 0.95, active: false },
  { x: 0.8417, y: 0.5663, cohort: 2016, index: 155, brightness: 0.85, active: false },
  { x: 0.8638, y: 0.5642, cohort: 2016, index: 156, brightness: 0.98, active: false },
  { x: 0.8874, y: 0.5725, cohort: 2016, index: 157, brightness: 0.97, active: false },
  { x: 0.9073, y: 0.5689, cohort: 2016, index: 158, brightness: 0.93, active: false },
  { x: 0.9276, y: 0.5758, cohort: 2016, index: 159, brightness: 0.96, active: false },
  { x: 0.8405, y: 0.6071, cohort: 2017, index: 160, brightness: 0.95, active: false },
  { x: 0.8659, y: 0.6059, cohort: 2017, index: 161, brightness: 0.89, active: false },
  { x: 0.8882, y: 0.6067, cohort: 2017, index: 162, brightness: 0.95, active: false },
  { x: 0.9084, y: 0.6054, cohort: 2017, index: 163, brightness: 0.89, active: false },
  { x: 0.9293, y: 0.5970, cohort: 2017, index: 164, brightness: 0.88, active: false },
  { x: 0.8422, y: 0.6090, cohort: 2017, index: 165, brightness: 0.88, active: false },
  { x: 0.8648, y: 0.6164, cohort: 2017, index: 166, brightness: 0.86, active: false },
  { x: 0.8886, y: 0.6169, cohort: 2017, index: 167, brightness: 0.88, active: false },
  { x: 0.9076, y: 0.6157, cohort: 2017, index: 168, brightness: 0.92, active: false },
  { x: 0.9267, y: 0.6209, cohort: 2017, index: 169, brightness: 0.94, active: false },
  { x: 0.8441, y: 0.6910, cohort: 2018, index: 170, brightness: 1.00, active: false },
  { x: 0.8599, y: 0.6892, cohort: 2018, index: 171, brightness: 0.95, active: false },
  { x: 0.8831, y: 0.6866, cohort: 2018, index: 172, brightness: 0.83, active: false },
  { x: 0.9038, y: 0.6863, cohort: 2018, index: 173, brightness: 0.84, active: false },
  { x: 0.9256, y: 0.6927, cohort: 2018, index: 174, brightness: 0.92, active: false },
  { x: 0.8425, y: 0.7117, cohort: 2018, index: 175, brightness: 0.92, active: false },
  { x: 0.8677, y: 0.7077, cohort: 2018, index: 176, brightness: 0.97, active: false },
  { x: 0.8816, y: 0.7072, cohort: 2018, index: 177, brightness: 0.96, active: false },
  { x: 0.9026, y: 0.7112, cohort: 2018, index: 178, brightness: 0.85, active: false },
  { x: 0.9273, y: 0.7021, cohort: 2018, index: 179, brightness: 0.91, active: false },
  { x: 0.8433, y: 0.7993, cohort: 2019, index: 180, brightness: 0.99, active: false },
  { x: 0.8631, y: 0.8049, cohort: 2019, index: 181, brightness: 0.93, active: false },
  { x: 0.8839, y: 0.8020, cohort: 2019, index: 182, brightness: 0.94, active: false },
  { x: 0.9068, y: 0.8020, cohort: 2019, index: 183, brightness: 0.95, active: false },
  { x: 0.9259, y: 0.7987, cohort: 2019, index: 184, brightness: 0.86, active: false },
  { x: 0.8388, y: 0.8262, cohort: 2019, index: 185, brightness: 0.96, active: false },
  { x: 0.8628, y: 0.8351, cohort: 2019, index: 186, brightness: 0.95, active: false },
  { x: 0.8814, y: 0.8362, cohort: 2019, index: 187, brightness: 0.99, active: false },
  { x: 0.9029, y: 0.8352, cohort: 2019, index: 188, brightness: 0.90, active: false },
  { x: 0.9274, y: 0.8360, cohort: 2019, index: 189, brightness: 0.86, active: false },
  { x: 0.8426, y: 0.9527, cohort: 2020, index: 190, brightness: 0.95, active: false },
  { x: 0.8635, y: 0.9532, cohort: 2020, index: 191, brightness: 0.97, active: false },
  { x: 0.8858, y: 0.9429, cohort: 2020, index: 192, brightness: 0.93, active: false },
  { x: 0.9059, y: 0.9439, cohort: 2020, index: 193, brightness: 0.83, active: false },
  { x: 0.9278, y: 0.9430, cohort: 2020, index: 194, brightness: 0.90, active: false },
  { x: 0.8438, y: 0.9820, cohort: 2020, index: 195, brightness: 0.87, active: false },
  { x: 0.8644, y: 0.9815, cohort: 2020, index: 196, brightness: 0.96, active: false },
  { x: 0.8852, y: 0.9885, cohort: 2020, index: 197, brightness: 0.99, active: false },
  { x: 0.9082, y: 0.9794, cohort: 2020, index: 198, brightness: 0.84, active: false },
  { x: 0.9307, y: 0.9859, cohort: 2020, index: 199, brightness: 0.93, active: false }
];

// ----------------------------------------------------------
// CAMPAIGN FRAMES
// Replaces the lightCoordinates canvas-dot system for the hero
// background. 15 chapter illustrations (Chapter 0 through Chapter
// 14), chronologically ordered, showing the library going from
// empty to full as the campaign progresses. The hero background
// swaps to the frame matching current progress toward campaignGoal.
//
// Filenames now match each image's own baked-in "CHAPTER N" caption
// (frames/chapter-00.jpg = Chapter 0, etc.) -- they used to be off
// by one (chapter-01.jpg actually contained the Chapter 0 art),
// which is what made "Chapter 12" look present when it wasn't.
//
// TEMPORARY: the real Chapter 12 ("This is just the beginning" ->
// "Together, we go further" is the actual Ch.11->Ch.13 jump) image
// doesn't exist yet -- not in frames/, not in Downloads. Reusing
// chapter-11.jpg as a stand-in so the loop doesn't skip a beat.
// Swap frames/chapter-12.jpg in and uncomment the line below once
// Chau supplies the real image.
// ----------------------------------------------------------
const campaignFrames = [
  "frames/chapter-00.jpg",
  "frames/chapter-01.jpg",
  "frames/chapter-02.jpg",
  "frames/chapter-03.jpg",
  "frames/chapter-04.jpg",
  "frames/chapter-05.jpg",
  "frames/chapter-06.jpg",
  "frames/chapter-07.jpg",
  "frames/chapter-08.jpg",
  "frames/chapter-09.jpg",
  "frames/chapter-10.jpg",
  "frames/chapter-11.jpg",
  "frames/chapter-12.jpg",
  "frames/chapter-13.jpg",
  "frames/chapter-14.jpg"
];

// Given current donor count and the goal, return the index into
// campaignFrames that best represents progress (0 .. frames.length-1).
function frameIndexForProgress(donors, goal) {
  const pct = Math.max(0, Math.min(1, donors / goal));
  const idx = Math.round(pct * (campaignFrames.length - 1));
  return Math.max(0, Math.min(campaignFrames.length - 1, idx));
}
