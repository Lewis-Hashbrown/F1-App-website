// Live widget replica, weekend timeline and calendar, all in the visitor's own time zone.
(function () {
  const races = window.RACES_2026 || [];
  const now = Date.now();
  // The app treats a race as live for 2 hours, then moves to the next weekend.
  const RACE_LENGTH_MS = 2 * 60 * 60 * 1000;

  const title = (race) => `${race.name.replace("Barcelona-Catalunya", "Barcelona")} Grand Prix`;

  // Team accents come from the app's WidgetTeam colours.
  const TEAMS = {
    mclaren: ["McLaren", "#FF8700"], ferrari: ["Ferrari", "#FF343D"], mercedes: ["Mercedes", "#27E4CA"],
    red_bull: ["Red Bull Racing", "#1687FF"], racing_bulls: ["Racing Bulls", "#669CFF"],
    aston_martin: ["Aston Martin", "#2CD3AA"], alpine: ["Alpine", "#38ACF7"], haas: ["Haas", "#F25765"],
    williams: ["Williams", "#4695FF"], audi: ["Audi", "#FF503D"], cadillac: ["Cadillac", "#D9E2EC"]
  };
  const DRIVERS = [
    ["norris", "Norris", "mclaren"], ["piastri", "Piastri", "mclaren"], ["leclerc", "Leclerc", "ferrari"],
    ["hamilton", "Hamilton", "ferrari"], ["russell", "Russell", "mercedes"], ["antonelli", "Antonelli", "mercedes"],
    ["verstappen", "Verstappen", "red_bull"], ["hadjar", "Hadjar", "red_bull"], ["lawson", "Lawson", "racing_bulls"],
    ["lindblad", "Lindblad", "racing_bulls"], ["alonso", "Alonso", "aston_martin"], ["stroll", "Stroll", "aston_martin"],
    ["gasly", "Gasly", "alpine"], ["colapinto", "Colapinto", "alpine"], ["ocon", "Ocon", "haas"],
    ["bearman", "Bearman", "haas"], ["albon", "Albon", "williams"], ["sainz", "Sainz", "williams"],
    ["hulkenberg", "Hülkenberg", "audi"], ["bortoleto", "Bortoleto", "audi"], ["perez", "Pérez", "cadillac"],
    ["bottas", "Bottas", "cadillac"]
  ];

  const weekday = new Intl.DateTimeFormat(undefined, { weekday: "short" });
  const clock = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" });
  const dayMonth = new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short" });
  const full = new Intl.DateTimeFormat(undefined, { weekday: "long", day: "numeric", month: "long", hour: "numeric", minute: "2-digit" });
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const sessionTime = (iso) => { const d = new Date(iso); return `${weekday.format(d)} ${clock.format(d)}`; };
  // formatRange writes "24–26 Sept" or "Sep 24 – 26" to suit the visitor's locale.
  const range = (race) => dayMonth.formatRange ? dayMonth.formatRange(new Date(race.fp1), new Date(race.race))
    : `${dayMonth.format(new Date(race.fp1))} – ${dayMonth.format(new Date(race.race))}`;
  const sessions = (race) => race.sprint
    ? [["FP1", race.fp1, "fp"], ["Sprint Qualifying", race.s2, "s"], ["Sprint", race.s3, "s"], ["Qualifying", race.quali, "q"], ["Race", race.race, "r"]]
    : [["Practice 1", race.fp1, "fp"], ["Practice 2", race.s2, "fp"], ["Practice 3", race.s3, "fp"], ["Qualifying", race.quali, "q"], ["Race", race.race, "r"]];

  // Same rule as the app: show the current weekend until the race is over, then the next one.
  const current = races.find((r) => new Date(r.race).getTime() + RACE_LENGTH_MS > now);
  const shown = current || races[races.length - 1];
  const seasonOver = !current;

  // Hero: pictures of the real widget, drawn by the app. The stack works like the app's own theme showcase:
  // the front card is the chosen theme and the ones either side peek out, tilted.
  const stack = document.querySelector("[data-stack]");
  const picker = document.querySelector("[data-picker]");
  const stackName = document.querySelector("[data-stack-name]");
  const CHOICES = [["standard", "Standard"], ["verstappen", "Verstappen"], ["norris", "Norris"], ["mclaren", "McLaren"],
    ["leclerc", "Leclerc"], ["hamilton", "Hamilton"], ["mercedes", "Mercedes"], ["alonso", "Alonso"], ["williams", "Williams"]];
  const cardFor = (id) => `assets/cards/${id}.webp`;
  if (stack && picker) {
    const cards = [...stack.querySelectorAll("img")];
    const slots = ["behind-left", "front", "behind-right"];
    const nameOf = (i) => CHOICES[((i % CHOICES.length) + CHOICES.length) % CHOICES.length];
    let front = 0;
    const place = (order) => cards.forEach((card, i) => { card.className = slots[order[i]]; });
    let order = [0, 1, 2];
    const paint = () => {
      cards.forEach((card, i) => {
        const offset = order[i] - 1; // -1 behind left, 0 front, 1 behind right
        card.src = cardFor(nameOf(front + offset)[0]);
      });
      place(order);
      const [, label] = nameOf(front);
      stackName.textContent = label;
      stack.setAttribute("aria-label", `Widget preview: ${label} theme`);
      picker.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.theme === nameOf(front)[0])));
    };
    const step = (direction) => {
      front += direction;
      order = order.map((slot) => (slot + (direction > 0 ? 2 : 1)) % 3);
      paint();
    };
    const show = (id) => {
      const target = CHOICES.findIndex(([x]) => x === id);
      if (target < 0 || target === ((front % CHOICES.length) + CHOICES.length) % CHOICES.length) return;
      front = target;
      paint();
    };
    picker.innerHTML = CHOICES.map(([id, name]) =>
      `<button type="button" data-theme="${id}" aria-pressed="false">${name}</button>`).join("");
    paint();
    CHOICES.forEach(([id]) => { new Image().src = cardFor(id); });

    // Cycle slowly until the visitor picks a theme; hovering pauses it.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let timer = null, hovering = false;
    const stop = () => { clearInterval(timer); timer = null; };
    picker.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      stop();
      show(b.dataset.theme);
    });
    stack.addEventListener("pointerenter", () => { hovering = true; });
    stack.addEventListener("pointerleave", () => { hovering = false; });
    const requested = new URLSearchParams(location.search).get("theme");
    if (requested) show(requested);
    if (!requested && !reduceMotion) timer = setInterval(() => { if (!hovering && !document.hidden) step(1); }, 4000);
  }
  const zoneNote = document.querySelector("[data-zone]");
  if (zoneNote) zoneNote.textContent = zone ? zone.replace(/_/g, " ") : "your time zone";

  // Timeline for the shown weekend
  const timeline = document.querySelector("[data-timeline]");
  if (timeline && shown) {
    document.querySelector("[data-weekend-title]").textContent = seasonOver
      ? `The 2026 season is over. The last race was the ${title(shown)}.`
      : `${title(shown)}, ${shown.location}. Round ${shown.round} of ${races.length}.`;
    const list = sessions(shown);
    const nextIndex = list.findIndex(([, iso]) => new Date(iso).getTime() > now);
    const until = (iso) => {
      const mins = Math.round((new Date(iso).getTime() - now) / 60000);
      if (mins <= 0) return "Started";
      const d = Math.floor(mins / 1440), h = Math.floor((mins % 1440) / 60), m = mins % 60;
      return `Starts in ${d ? `${d}d ` : ""}${h}h ${d ? "" : `${m}m`}`.trim();
    };
    timeline.innerHTML = list.map(([name, iso, tone], i) => {
      const state = new Date(iso).getTime() + (tone === "r" ? RACE_LENGTH_MS : 60 * 60000) < now ? "done" : (i === nextIndex ? "next" : "");
      return `<li class="panel ${tone} ${state}"><span class="kind">${name}</span><time datetime="${iso}">${full.format(new Date(iso))}</time><span class="until">${state === "done" ? "Finished" : until(iso)}</span></li>`;
    }).join("");
  }

  // Calendar
  const calendar = document.querySelector("[data-calendar]");
  if (calendar) {
    calendar.innerHTML = races.map((r) => {
      const past = new Date(r.race).getTime() + RACE_LENGTH_MS < now;
      const cls = past ? "past" : (r === current ? "upcoming" : "");
      return `<li class="${cls}"><span class="round">${r.round}</span><span class="name">${title(r).replace(" Grand Prix", "")}${r.sprint ? '<span class="sprint">Sprint</span>' : ""}</span><time datetime="${r.race}">${range(r)}</time></li>`;
    }).join("");
  }

  // Theme wall: all 33 themes, teams first then their drivers.
  const wall = document.querySelector("[data-wall]");
  if (wall) {
    const items = Object.entries(TEAMS).flatMap(([id, [name, colour]]) =>
      [[id, name, colour], ...DRIVERS.filter((d) => d[2] === id).map(([did, dname]) => [did, dname, colour])]);
    wall.innerHTML = items.map(([id, name, colour]) =>
      `<figure style="--team:${colour}" data-wall-theme="${id}"><img src="assets/art/${id}.webp" alt="" loading="lazy" width="120" height="76"><figcaption>${name}</figcaption></figure>`).join("");
    // Clicking a theme shows its widget in the hero stack.
    wall.addEventListener("click", (e) => {
      const figure = e.target.closest("[data-wall-theme]");
      if (!figure) return;
      const front = document.querySelector("[data-stack] .front");
      const name = document.querySelector("[data-stack-name]");
      if (!front) return;
      front.src = `assets/cards/${figure.dataset.wallTheme}.webp`;
      if (name) name.textContent = figure.querySelector("figcaption").textContent;
      document.querySelector("[data-stack]").scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
