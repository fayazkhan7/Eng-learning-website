(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- Data ---------- */
  const courses = [
    { title: "English Foundations", level: "Beginner", skill: "All skills", text: "Greetings, routines, shopping and simple questions with slow, clear audio." },
    { title: "Everyday Speaking", level: "Beginner", skill: "Speaking", text: "Pronunciation and short dialogues you can use the same day." },
    { title: "Essential Vocabulary", level: "Beginner", skill: "Vocabulary", text: "The 500 most useful words, taught in context with examples." },
    { title: "Grammar That Sticks", level: "Intermediate", skill: "Grammar", text: "Fix the mistakes that keep coming back, tense by tense." },
    { title: "Writing Clear Emails", level: "Intermediate", skill: "Writing", text: "Short, polite and professional messages for work and study." },
    { title: "Listening at Natural Speed", level: "Intermediate", skill: "Listening", text: "Real-speed clips with questions and transcripts." },
    { title: "Fluent and Natural", level: "Advanced", skill: "Speaking", text: "Idioms, tone and collocations for natural-sounding speech." },
    { title: "Academic and Formal Writing", level: "Advanced", skill: "Writing", text: "Structure essays and reports with precise, persuasive language." }
  ];
  const words = [
    { w: "resilient", p: "adjective", d: "Able to recover quickly after difficulty.", e: "She stayed resilient after losing her job and found a better one." },
    { w: "reluctant", p: "adjective", d: "Not willing to do something.", e: "He was reluctant to speak in front of the class." },
    { w: "adapt", p: "verb", d: "To change in order to fit a new situation.", e: "It took a month to adapt to the new schedule." },
    { w: "genuine", p: "adjective", d: "Real and sincere, not fake.", e: "Her thanks were genuine." },
    { w: "afford", p: "verb", d: "To have enough money or time for something.", e: "We can’t afford a new car this year." }
  ];
  const examples = [
    { wrong: "She don’t like coffee.", fix: "She <mark>doesn’t</mark> like coffee.", note: "With he, she and it, the verb needs its third-person form." },
    { wrong: "I have seen him yesterday.", fix: "I <mark>saw</mark> him yesterday.", note: "Use the simple past with a finished time like “yesterday”." },
    { wrong: "He is more taller than me.", fix: "He is <mark>taller</mark> than me.", note: "Short adjectives take -er. Do not add “more” as well." },
    { wrong: "I am agree with you.", fix: "I <mark>agree</mark> with you.", note: "“Agree” is already a verb, so it does not need “am”." }
  ];

  /* ---------- Router (hash-based, one page visible at a time) ---------- */
  const pages = $$(".page"), links = $$("[data-route]"), main = $("#main");
  const titles = { home: "Learn English with Fayaz", courses: "Courses", about: "About us", resources: "Resources", contact: "Contact us" };
  const route = () => {
    let name = location.hash.replace(/^#\/?/, "") || "home";
    if (!titles[name]) name = "home";
    pages.forEach(p => { p.hidden = p.dataset.page !== name; });
    links.forEach(a => a.dataset.route === name ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"));
    document.title = name === "home" ? titles.home : titles[name] + " | Learn English with Fayaz";
    nav.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false");
    window.scrollTo(0, 0);
    main.focus({ preventScroll: true });
  };

  /* ---------- Mobile nav ---------- */
  const toggle = $(".nav-toggle"), nav = $("#nav");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  /* ---------- Course cards + filter ---------- */
  const cardHTML = c => `<article class="card"><p class="meta">${c.level} · ${c.skill}</p><h3>${c.title}</h3><p>${c.text}</p><a class="btn btn-small" href="#/contact">Enroll interest</a></article>`;
  $("#featured").innerHTML = [courses[0], courses[3], courses[6]].map(cardHTML).join("");
  const grid = $("#course-grid"), chips = $$(".chip");
  const filter = level => {
    chips.forEach(c => c.setAttribute("aria-pressed", String(c.dataset.filter === level)));
    grid.innerHTML = courses.filter(c => level === "all" || c.level === level).map(cardHTML).join("");
  };
  chips.forEach(c => c.addEventListener("click", () => filter(c.dataset.filter)));
  $$("[data-filter-link]").forEach(a => a.addEventListener("click", () => setTimeout(() => filter(a.dataset.filterLink), 0)));
  filter("all");

  /* ---------- Lesson preview (red-pen) ---------- */
  let ei = 0;
  const rp = $(".redpen"), wrong = $(".wrong"), fix = $(".fix"), note = $("#rp-note"), rpBtn = $("#rp-toggle");
  const setFixed = on => {
    wrong.hidden = on; fix.hidden = !on;
    rp.classList.toggle("is-fixed", on);
    rpBtn.setAttribute("aria-pressed", String(on));
    rpBtn.textContent = on ? "Hide the correction" : "Show the correction";
  };
  const renderExample = () => {
    const ex = examples[ei];
    wrong.textContent = ex.wrong; fix.innerHTML = ex.fix; note.textContent = ex.note;
    setFixed(false);
  };
  rpBtn.addEventListener("click", () => setFixed(fix.hidden));
  $("#rp-next").addEventListener("click", () => { ei = (ei + 1) % examples.length; renderExample(); });
  renderExample();

  /* ---------- Word of the day ---------- */
  let wi = Math.floor(Date.now() / 864e5) % words.length;
  const showWord = () => {
    const x = words[wi];
    $("#w-word").textContent = x.w; $("#w-pos").textContent = x.p;
    $("#w-def").textContent = x.d; $("#w-ex").textContent = "“" + x.e + "”";
  };
  $("#word-next").addEventListener("click", () => { wi = (wi + 1) % words.length; showWord(); });
  showWord();

  /* ---------- Contact form (front-end validation only) ---------- */
  const form = $("#contact-form"), status = $("#form-status");
  const check = (id, valid, msg) => {
    const input = $("#" + id);
    input.setAttribute("aria-invalid", String(!valid));
    $("#" + id + "-err").textContent = valid ? "" : msg;
    return valid;
  };
  form.addEventListener("submit", e => {
    e.preventDefault(); status.textContent = "";
    const nameOk = check("name", $("#name").value.trim().length > 1, "Enter your name.");
    const mailOk = check("email", /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test($("#email").value.trim()), "Enter a valid email address, like name@example.com.");
    if (!nameOk) return $("#name").focus();
    if (!mailOk) return $("#email").focus();
    // TODO: send the form data to your backend or a form service.
    status.textContent = "Thanks. Your message is ready to send once a backend is connected.";
    form.reset();
  });

  $("#year").textContent = new Date().getFullYear();
  window.addEventListener("hashchange", route);
  route();
})();
