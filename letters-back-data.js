// letters-back-data.js
// One object per finished "Letter Back to Larry" card.
// ALL 27 ENTRIES BELOW ARE REAL -- pulled directly from the finished
// social graphics in ~/Boards-and-Orgs/SEN/letter-back-social-template/,
// not placeholder content. As new cards are finished, add a new object
// to this array in the same shape -- nothing else needs to change.
//
// Shape:
//   slug   -- matches the image filename in letter-back-cards/
//   name   -- scholar's full name as shown on their card
//   role   -- title/organization line as shown on their card
//   quote  -- the short pull-quote text embedded in the card artwork
//   letter -- the fuller "Letter Back" paragraph from column G of the
//             tracker (Letter-Back-LinkedIn-Seed-Tracker...xlsx). Only
//             14 of 27 scholars have this yet -- everyone else falls
//             back to `quote` in the featured display (see
//             letters-back.js). NOT present = not yet synthesized in
//             the tracker, not a placeholder/invented value.
//   image  -- path to the finished card graphic
//
// IMPORTANT: attach to window explicitly (not `const lettersBackData =`)
// -- a bare top-level const/let does NOT become a window property, and
// letters-back.js reads this off window.lettersBackData.

window.lettersBackData = [
  {
    slug: "darrius",
    name: "Darrius Atkins",
    role: "Assistant United States Attorney, U.S. Attorney's Office for the Northern District of Illinois",
    quote: "A license to dream and to try.",
    letter: "Larry, I never knew much about my dad, and my mom struggled with drug addiction throughout her life -- I was raised on the West Side of Chicago by a grandmother who grew up picking cotton in Mississippi. What I built with the Gates Millennium Scholarship is a career as an Assistant United States Attorney, working to keep communities safe, seek justice for victims, and hold those entrusted with public power to honest service. Now I'm paying it forward by insisting on that same honest service every day in the work I do.",
    image: "letter-back-cards/darrius.png"
  },
  {
    slug: "charity",
    name: "Charity Ntansah, PhD, MPH, CHES",
    role: "Gates Millennium Scholar, Class of 2010",
    quote: "Doors I didn't know existed.",
    letter: "Larry, the Gates Millennium Scholarship opened doors for me that I didn't even know existed — not just paying for school, but putting me in rooms and connecting me with people who changed the trajectory of my life, like the APHA conference in 2018 where I met my future PhD advisor. What I built with it is a career in public health, now as a Presidential Postdoctoral Fellow at Rutgers University, studying the underserved communities whose stories don't always make it to the front of the research. Now I'm paying it forward by mentoring students and running a platform that helps them navigate the unwritten rules of academia — because GMS taught us that giving back isn't something you wait to do until you've made it.",
    image: "letter-back-cards/charity.png"
  },
  {
    slug: "jasmine",
    name: "Jasmine Frazier",
    role: "Gates Millennium Scholar, Class of 2010",
    quote: "Chills, every time I pay it forward.",
    letter: "Larry, 16 years ago, I received the life-changing news that I'd been selected for the Gates Millennium Scholarship — a first-generation student from Southside, Richmond, for whom that opportunity didn't just change where I'd go to college, it changed the trajectory of my life. What I built with it is a career as a college counselor and owner of Access Granted Consulting, LLC, helping hundreds of marginalized students pursue a debt-free education and win scholarships — over $70 million and counting. Now I'm paying it forward every time I help a student relive the moment that changed my life forever.",
    image: "letter-back-cards/jasmine.png"
  },
  {
    slug: "judith",
    name: "Judith Rendon, PharmD, BCPS",
    role: "Gates Millennium Scholar · Rendon Entrepreneurial Center",
    quote: "Excited for the growth still ahead.",
    letter: "Larry, I'm incredibly grateful to be part of this community and everything that continues to grow from it. What I've found as a Gates Millennium Scholar is something special about being surrounded by people who believe in creating opportunities for others, the same belief that drives my work at the Rendon Entrepreneurial Center. Now I'm paying it forward by staying excited for the continued growth of this network, and everything still ahead of us.",
    image: "letter-back-cards/judith.png"
  },
  {
    slug: "shambrekia",
    name: "Shambrekia Wise",
    role: "Gates Millennium Scholar, Class of 2004",
    quote: "A yes that changed every yes.",
    letter: "Larry, in May 2004, just days before I graduated from high school, I learned I'd been selected as a Gates Millennium Scholar — a \"yes\" that changed the course of my life. What I built with it is a career shaped by the confidence that scholarship gave me to expect more of myself, and a community of mentors, colleagues, and friends through GMS and UNCF. Twenty-two years later, I'm the co-founder of a children's educational platform, helping kids and families see the world — and themselves — with greater possibility. Now I'm paying it forward every time I mentor a future scholar and help them recognize what's possible for their own life.",
    image: "letter-back-cards/shambrekia.png"
  },
  {
    slug: "tina",
    name: "Augustina (Tina) Mensa-Kwao, PhD, MPH, CHES",
    role: "Gates Millennium Scholar",
    quote: "People opened doors and believed in me first.",
    letter: "Larry, my journey has been shaped by people who opened doors, invested in me, and believed in what was possible long before I could see it myself. What I built with that is a career in public health — creating healthier communities and helping build systems where more people can thrive. Now, I'm paying it forward by lifting as I climb, because the best way to honor an opportunity is to create one for someone else.",
    image: "letter-back-cards/tina.png"
  },
  {
    slug: "lila",
    name: "Lila K. Chamlagai, MPH, PhD(c)",
    role: "Gates Millennium Scholar · PhD Candidate, Brown University School of Public Health",
    quote: "GMS → SEN. The journey continues.",
    letter: "Larry, being selected as a Gates Millennium Scholar was more than just financial support — it was an investment in who I could become. With that opportunity, I built a career dedicated to research, service, and giving back to communities in need. Along the way, I've also built a meaningful community of fellow Gates Scholars — physicians, researchers, educators, and leaders — who share a similar journey and commitment to making a difference. Today, I'm proud to pay that investment forward by serving my communities, supporting others, and staying actively engaged with SEN as we carry this legacy into its next chapter.",
    image: "letter-back-cards/lila.png"
  },
  {
    slug: "ana",
    name: "Ana Quiñones, LCSW-S, MPH, MCHES",
    role: "Gates Millennium Scholar",
    quote: "A door I ran through with joy.",
    letter: "Larry, sixteen years ago, the Gates Millennium Scholarship opened a door I ran through with joy and disbelief — it let a young Hispanic girl from a single-mother household sit at tables in Ivy League rooms. What I built with it is a career in clinical social work and public health, and the confidence to build Twin Suns Counseling from the ground up. That opportunity didn't just lift me — it grew through me, into my children, my brother, my interns, my patients, and my students. Now I'm paying it forward every time I hand someone else the same momentum and confidence that was handed to me.",
    image: "letter-back-cards/ana.png"
  },
  {
    slug: "allyson",
    name: "Allyson Leggett Watson, PhD",
    role: "Gates Millennium Scholar, Class of 2000",
    quote: "Class of 2000. Now it's our turn to pay it forward.",
    letter: "Larry, as an inaugural 2000 Gates Millennium Scholar, I got to see firsthand what happens when an investment in education becomes a lifetime of impact. What I built with it is a career among thousands of scholars now working as nonprofit founders, tech leaders, educators, and entrepreneurs. Now it's our turn to pay that investment forward, reinvesting in the next generation the way this community reinvested in us.",
    image: "letter-back-cards/allyson.png"
  },
  {
    slug: "lani",
    name: "Lani Shaw",
    role: "Gates Millennium Scholar, Inaugural Class",
    quote: "1 of 1,000, chosen from 60,000 applicants.",
    letter: "Larry, more than 20 years ago, Bill and Melinda Gates and UNCF invested in my future and paid for my college education — one of just 1,000 scholars selected from more than 60,000 applications in that inaugural class. What I built with it is a career, and a session at the Summit called Stop Being the Best Kept Secret, teaching fellow scholars that doing great work isn't always enough — you have to advocate for yourself too. Now I'm paying it forward by pouring back into a community that poured so much into me.",
    image: "letter-back-cards/lani.png"
  },
  {
    slug: "chau",
    name: "Chau Dang",
    role: "Gates Millennium Scholar",
    quote: "I still think, \"Why me?\"",
    letter: "Larry, I remember being confused about getting the Gates Millennium Scholarship. I remember thinking, \"Why me?\" I still think that. What I built with it is a life spent trying to make sense of that question — working with scholars, hearing their stories, and creating the conditions for them to thrive. The Pay It Forward Summit was a collection of a lot of invisible work that led up to one moment, and hearing Jim Larimore describe carrying the weight of a $1.6 billion investment from the very beginning reminded me what it means to be championed by someone who didn't even know you yet. Now I'm paying it forward by chairing this board and building SEN into the room where that investment keeps multiplying — because the audacity to dream it is what got us this far, and it's what will get us further.",
    image: "letter-back-cards/chau.png"
  },
  {
    slug: "corey",
    name: "Corey A. Hardiman",
    role: "Gates Millennium Scholar",
    quote: "Almost 20 years ago, someone bet on me.",
    letter: "Larry, almost 20 years ago you couldn't have told me I'd be living my life in full circle — but the Gates Millennium Scholarship made that possible. What I built with it is work I now carry forward through the Herrendorf Family Foundation and the Oprah Winfrey Charitable Foundation, investing in others the way I was invested in. The biggest investor in your future is you — and now I'm paying it forward by betting on the next generation the way this network bet on me.",
    image: "letter-back-cards/corey.png"
  },
  {
    slug: "onyinye",
    name: "Onyinye Edeh-Vincent, MPH",
    role: "Gates Millennium Scholar",
    quote: "It started with believing I was worthy.",
    letter: "Larry, the scholarship gave me the opportunity to believe I was worthy — worthy of being seen, invested in, and dreaming bigger. It fully funded my education at Agnes Scott College and provided significant support toward my education at the University of Washington School of Public Health. What I did with that opportunity was found the Strong Enough Girls' Empowerment Initiative (SEGEI), a nonprofit with a 10-year record of transforming lives across communities and continents. Now I'm paying it forward by advancing education, leadership, and healthcare access for girls, youth, and women in underserved communities around the world.",
    image: "letter-back-cards/onyinye.png"
  },
  {
    slug: "hernando",
    name: "Hernando Sevilla-Garcia, M.S.",
    role: "Gates Millennium Scholar",
    quote: "Education is a catalyst for mobility.",
    letter: "Larry, the scholarship gave me the opportunity to pursue my Bachelor's, Master's, and now Doctoral studies, fully funded from the moment I was awarded in 2009. What I did with it was build a career rooted in the belief that education is a true catalyst for socioeconomic mobility — and reconnect with the very community, including you, Larry, that shaped my path. Now I'm paying it forward by continuing my doctoral work at UCLA on the internationalization of higher education, and by showing up for my community — including my home country of Colombia — as it rebuilds.",
    image: "letter-back-cards/hernando.png"
  },
  {
    slug: "joi",
    name: "Joi Howard, Ed.D.",
    role: "Gates Millennium Scholar",
    quote: "It started with a stack of scholarship essays.",
    letter: "Larry, in the fall of my senior year I searched for scholarships in my school library because paying for college was going to be hard for my family — and one search changed the entire trajectory of my life. What I built with the Gates Millennium Scholarship is a bachelor's from Vanderbilt, a semester abroad in Spain, and both a master's and doctoral degree. Twenty-one years later, I'm still an educator and instructional designer carrying that impact forward. Now I'm paying it forward by helping ensure the next scholar's letter changes their life the way mine changed mine.",
    image: "letter-back-cards/joi.png"
  },
  {
    slug: "tilifayea",
    name: "Tilifayea L. Griffin, MAT",
    role: "Gates Millennium Scholar",
    quote: "A pen, a prayer, on the MARTA train.",
    letter: "Larry, in 2009 I was riding the MARTA train with a stack of scholarship essays, because without the Gates Millennium Scholars Program, college wasn't possible for me. What I built with it is a career in education, community organizing, and movement building. Hearing you speak reminded me this isn't just a scholarship — it's a living commitment to one another. Now I'm paying it forward by helping hold the door open for others, the way it was held open for me.",
    image: "letter-back-cards/tilifayea.png"
  },
  {
    slug: "dpbetlehem",
    name: "Dpbetlehem Reyna",
    role: "Gates Millennium Scholar",
    quote: "An envelope arrived, and everything changed.",
    letter: "Larry, fourteen years ago I opened an envelope that told me I'd been selected as a Gates Millennium Scholar — one of 1,000 recipients out of more than 20,000 applicants that year. What I built with it was a debt-free degree from Emory University and the distinction of being the first in my family to graduate college. Now I'm paying it forward by staying connected to this community and never forgetting the people who helped get me here.",
    image: "letter-back-cards/dpbetlehem.png"
  },
  {
    slug: "kelvin",
    name: "Kelvin J. Harris",
    role: "UNCF · Gates Millennium Scholars Program",
    quote: "We talked about this day almost 10 years ago.",
    letter: "Dear Larry, Your message is a powerful reminder of what can happen when opportunity is matched with vision and commitment. Almost 10 years ago, we talked about what this moment could become, and I always believed something extraordinary would emerge from this community. Today, that vision is taking shape in remarkable ways. Through my work supporting scholars with UNCF and the Gates Millennium Scholars Program, I've had the privilege of reconnecting with individuals I first met more than 15 years ago and witnessing the impact they are making in their professions, communities, and beyond. Their success is a testament to the power of investing in talent and possibility. As I reflect on this moment, I am proud to continue paying it forward by showing up for this family and supporting the next chapter of the Scholars Equity Network. While we celebrate how far we've come, I'm even more inspired by what lies ahead. Thank you for your leadership, partnership, and unwavering belief in the potential of our scholars.",
    image: "letter-back-cards/kelvin.png"
  },
  {
    slug: "whitney",
    name: "Whitney N. Blanco",
    role: "Gates Millennium Scholar",
    quote: "Nearly two decades later, still deeply grateful.",
    letter: "Larry, nearly two decades ago, the Gates Millennium Scholarship changed the trajectory of my life. It gave me the opportunity to live and work around the world, pursue meaningful work in policy and service, and build relationships that shaped who I am. This past year, I had lost a bit of my hope. But being back in community with Gates Scholars through the Scholars Equity Network deeply repaired something in me. It renewed my faith in people, in service, and in our collective ability to make the world better. I left with a renewed sense of responsibility and a reminder that the opportunity I was given was never meant to end with me. I am still called to pay it forward. Thank you, Larry.",
    image: "letter-back-cards/whitney.png"
  },
  {
    slug: "sara",
    name: "Sara Prato",
    role: "Gates Millennium Scholar",
    quote: "Twenty-six years ago, someone believed in me.",
    letter: "Larry, twenty-six years ago I was at one of the lowest points in my life, unsure what my future would look like — then I received the Gates Millennium Scholarship. What I built with it is my bachelor's and master's degrees, a year studying abroad in Australia, and now a career as one of about 600 Board Certified Specialists in Renal Nutrition, running The CKD Dietitian, a social enterprise serving people with chronic kidney disease. Now I'm paying it forward by carrying that investment through my work, my story, and the people I have the privilege to serve.",
    image: "letter-back-cards/sara.png"
  },
  {
    slug: "timothy",
    name: "Timothy Wells",
    role: "Gates Millennium Scholar",
    quote: "Gates Millennium Scholar, Class of 2002.",
    letter: "Larry, as a Gates Millennium Scholar from the Class of 2002, my undergraduate scholarship laid the foundation for me to flourish professionally. Whether in wealth management, ministry, or now as a Master Certified Coach, paying it forward aligns with my life's mission: to help people who help people be the best version of themselves. I was honored to return to the Summit and offer complimentary executive coaching sessions to fellow scholars — one idea from the Summit stayed with me: what we receive isn't meant to stop with us. Now I'm paying it forward through coaching, helping leaders clarify their goals, work through challenges, and move confidently toward what's next.",
    image: "letter-back-cards/timothy.png"
  },
  {
    slug: "nicole",
    name: "Nicole Galicia",
    role: "Gates Millennium Scholar",
    quote: "Twelve years later, still recharged.",
    letter: "Larry, 12 years ago, the Gates Millennium Scholars Program changed my life by investing in my education and my personal and professional development. What I built with it is a path that's taken me back to school as a current graduate student, still carrying what I learned at that first leadership conference my freshman semester. This program recognized that while talent is universal, opportunity is not. Now I'm paying it forward by being part of what this network builds next, together.",
    image: "letter-back-cards/nicole.png"
  },
  {
    slug: "shai",
    name: "Shai Basys",
    role: "Gates Millennium Scholar",
    quote: "To whom much is given, much is required.",
    letter: "Larry, my grandmother taught me how to give — to whom much is given, much is required. In high school, I became one of about 20,000 Gates Millennium Scholars Program recipients. What I built with that lesson is a workshop I hosted at the Summit on building agentic AI solutions for impact, in my own hometown of Chicago. Seeing this community's alumni fund $68,000 in grants last year alone, expanding libraries, building free clinics, reviving Indigenous language, reminded me why my grandmother's lesson still holds. Now I'm paying it forward by teaching others to build the same way she taught me to give.",
    image: "letter-back-cards/shai.png"
  },
  {
    slug: "ibraheem",
    name: "Ibraheem Alinur",
    role: "Gates Millennium Scholar",
    quote: "Breaking down barriers, one workshop at a time.",
    letter: "Larry, I've gone from counting pennies to investing millions, and I had the privilege of bringing that journey to the Pay It Forward Summit, hosting a workshop on the basics of entrepreneurship and venture capital. What I built with that perspective is a way to break down the barriers that make VC feel overwhelming to navigate alone. Now I'm paying it forward by helping the leaders in this community advance their journeys, one workshop at a time.",
    image: "letter-back-cards/ibraheem.png"
  },
  {
    slug: "lima",
    name: "Lima Hossain",
    role: "Gates Millennium Scholar",
    quote: "Investing in the people the world too often overlooks.",
    letter: "Larry, thirteen years ago I opened a large white envelope and found out I'd been accepted into the Gates Millennium Scholars Program — a chance that changed the course of my life. What I built with it is a career in clean energy access and energy equity, presenting on that work at the Summit. That acceptance opened doors that continue to shape my journey today. Now I'm paying it forward by investing my career in the people the world too often overlooks, the same way someone once invested in me.",
    image: "letter-back-cards/lima.png"
  },
  {
    slug: "robert",
    name: "Robert Lee",
    role: "Gates Millennium Scholar",
    quote: "13 years learning how to scale without losing the mission.",
    letter: "Larry, I had the opportunity to speak at the Pay It Forward Summit about something I've spent the last 13 years learning firsthand: how you build an organization that can scale its impact without losing the mission that started it. What I built as a Gates Millennium Scholar is Rescuing Leftover Cuisine, where we've redirected more than 24 million pounds of surplus food to people who need it. Now I'm paying it forward by sharing what it took to get here — systems, partnerships, technology, and a lot of learning along the way.",
    image: "letter-back-cards/robert.png"
  },
  {
    slug: "kristen",
    name: "Kristen C. Smith-Devine",
    role: "Gates Millennium Scholar",
    quote: "1 of 1,000, selected in 2006.",
    letter: "Larry, twenty years ago I received the golden ticket — a 2006 Gates Millennium Scholarship, as one of 1,000 recipients that year selected to attend the college of their choice. I chose my flagship, the University of Illinois Urbana-Champaign. What I built with it is a career centered around the spirit of scholarship, and now I serve as a National Board Member of the Scholars Equity Network. To paraphrase what you said that night: we've received many checks — now is the time to send some back. Now I'm paying it forward by helping build and activate a network of 20,000+ scholars becoming their own philanthropists.",
    image: "letter-back-cards/kristen.png"
  },
  {
    slug: "tiffani",
    name: "Tiffani Knowles Senatus",
    role: "Gates Millennium Scholar",
    quote: "Two decades since the hottest scholarship.",
    letter: "Larry, two decades ago I became one of the inaugural Gates Millennium Scholars — what we all called the hottest scholarship on the planet. What I built with it was a career as a journalist, communication strategist, two-time author and now lecturer at the University of Miami, which sparked a session on personal branding I got to bring back to the Summit stage. I'm so glad it resonated with you enough to stop by. Now I'm paying it forward by staying in the classroom, and staying ready for whatever this network builds next.",
    image: "letter-back-cards/tiffani.png"
  },
  {
    slug: "naomie",
    name: "Naomie Droll",
    role: "Gates Millennium Scholar",
    quote: "It started with the power of educational opportunity.",
    letter: "Larry, at the end of last year, the Pay It Forward Summit was an idea I put to paper — and this year, I had the privilege of watching that vision come to life. What I found is a community that showed up fully: alumni who are brilliant, accomplished, and deeply committed to lifting others as they move forward. Now I'm paying it forward by continuing to build what's next for this network, because this summit was just one chapter.",
    image: "letter-back-cards/naomie.png"
  },
  {
    slug: "ramona",
    name: "Ramona Bowie-Amos, M.Ed.",
    role: "Gates Millennium Scholar",
    quote: "The courage to begin again.",
    letter: "Larry, the Gates Millennium Scholarship let me earn a bachelor's in Biology and a master's in Educational Policy and Leadership without a dollar of student loan debt — freedom that shaped everything that came after. What I built with it is a career in student affairs, and later, after stepping away in 2017 to care for my mother until she passed in 2019, the courage to found Wellthy Reflections LLC, creating restorative spaces for people navigating grief, burnout, and life transitions. Now I'm paying it forward by bringing the same care, encouragement, and belief that shaped me into every space I create for someone else.",
    image: "letter-back-cards/ramona.png"
  },
  {
    slug: "aaron",
    name: "Aaron Stallworth",
    role: "Director, GMS Alumni Programs, UNCF",
    quote: "Mentorship. Opportunity. A genuine commitment.",
    letter: "Larry, I had the privilege of serving as MC for the Pay It Forward Summit at the Obama Presidential Center — and being in that room, helping guide the day's conversations, was an honor I won't forget. What I found there is a community built on shared purpose, mentorship, and a genuine commitment to expanding opportunity for scholars. Now I'm paying it forward by helping guide this network forward, grateful for the invitation and already looking forward to the next one.",
    image: "letter-back-cards/aaron.png"
  },
];
