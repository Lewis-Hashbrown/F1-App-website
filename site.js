// Live widget replica, weekend timeline and calendar, all in the visitor's own time zone.
(function () {
  const races = window.RACES_2026 || [];
  const now = Date.now();
  const RACE_LENGTH_MS = 3 * 60 * 60 * 1000;

  const TRACKS = {
    "Australian": "albert_park", "Chinese": "shanghai", "Japanese": "suzuka", "Bahrain": "bahrain",
    "Saudi Arabian": "jeddah", "Miami": "miami", "Canadian": "montreal", "Monaco": "monaco",
    "Barcelona": "barcelona", "Austrian": "spielberg", "British": "silverstone", "Belgian": "spa",
    "Hungarian": "hungaroring", "Dutch": "zandvoort", "Italian": "monza", "Spanish": "madrid",
    "Azerbaijan": "baku", "Singapore": "marina_bay", "United States": "cota", "Mexican": "rodriguez",
    "Brazilian": "interlagos", "Las Vegas": "vegas_strip", "Qatar": "lusail", "Abu Dhabi": "yas_marina"
  };
  const trackFor = (name) => {
    const key = Object.keys(TRACKS).find((k) => name.startsWith(k));
    return key ? `assets/tracks/${TRACKS[key]}.webp` : null;
  };
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

  // Widget: same text rules as the app. Dates like "24 - 26 Sep"; times like "Thu 9:30am" (Standard) or "Thu 9:30AM" (themes).
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const twentyFour = /h2[34]/.test(new Intl.DateTimeFormat(undefined, { hour: "numeric" }).resolvedOptions().hourCycle || "");
  const pad = (n) => String(n).padStart(2, "0");
  const widgetRange = (race) => {
    const end = new Date(race.race), start = new Date(end.getTime() - 2 * 86400000);
    const endMonth = MONTHS[end.getUTCMonth()], startMonth = MONTHS[start.getUTCMonth()];
    return `${pad(start.getUTCDate())}${startMonth !== endMonth ? ` ${startMonth}` : ""} - ${pad(end.getUTCDate())} ${endMonth}`;
  };
  const widgetTime = (iso, upper) => {
    const d = new Date(iso), day = WEEKDAYS[d.getDay()];
    if (twentyFour) return `${day} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    const suffix = d.getHours() < 12 ? "am" : "pm";
    return `${day} ${d.getHours() % 12 || 12}:${pad(d.getMinutes())}${upper ? suffix.toUpperCase() : suffix}`;
  };
  const widget = document.querySelector("[data-widget]");
  const drawWidget = (themed) => {
    if (!widget || !shown) return;
    const labels = shown.sprint ? ["FP1", "SQ", "Sprint", "Quali", "Race"] : ["FP1", "FP2", "FP3", "Quali", "Race"];
    const tones = shown.sprint ? ["fp", "fp", "fp", "q", "r"] : ["fp", "fp", "fp", "q", "r"];
    const times = [shown.fp1, shown.s2, shown.s3, shown.quali, shown.race];
    widget.querySelector("[data-dates]").textContent = widgetRange(shown);
    widget.querySelector("[data-gp]").textContent = title(shown);
    widget.querySelector("[data-place]").textContent = shown.location;
    widget.querySelector("[data-rows]").innerHTML = labels.map((label, i) =>
      `<div class="row"><b class="${tones[i]}">${label}</b><span class="${i === 3 ? "q-time" : i === 4 ? "r-time" : ""}">${widgetTime(times[i], themed)}</span></div>`).join("");
  };
  if (widget && shown) {
    drawWidget(false);
    const track = trackFor(shown.name);
    if (track) widget.querySelector("[data-track]").src = track;
    widget.setAttribute("aria-label", `Widget preview: ${title(shown)}, times shown in your time zone`);
  }
  const zoneNote = document.querySelector("[data-zone]");
  if (zoneNote) zoneNote.textContent = zone ? zone.replace(/_/g, " ") : "your time zone";

  // Theme picker: re-skins the widget with the app's own frame drawings and artwork.
  const picker = document.querySelector("[data-picker]");
  if (picker && widget) {
    const choices = [["standard", "Standard"], ["verstappen", "Verstappen"], ["norris", "Norris"], ["mclaren", "McLaren"],
      ["leclerc", "Leclerc"], ["hamilton", "Hamilton"], ["mercedes", "Mercedes"], ["alonso", "Alonso"]];
    const teamOf = (id) => TEAMS[id] ? id : (DRIVERS.find((x) => x[0] === id) || [])[2];
    const apply = (id) => {
      const themed = id !== "standard";
      const team = teamOf(id);
      widget.classList.toggle("themed", themed);
      if (themed) {
        const accent = TEAMS[team][1];
        const isDriver = !TEAMS[id];
        widget.style.setProperty("--accent", accent);
        widget.style.setProperty("--title", id === "verstappen" ? "#FF3045" : accent);
        widget.style.setProperty("--quali-time", "#FFD542");
        widget.style.setProperty("--race-time", "#FF3045");
        // Header art split, as in the themed layout: drivers .46/.54, McLaren .33/.67, other teams .43/.57.
        const [gap, art] = isDriver ? [.46, .54] : id === "mclaren" ? [.33, .67] : [.43, .57];
        widget.style.setProperty("--gap", gap);
        widget.style.setProperty("--art", art);
        widget.querySelector("[data-header]").src = `assets/frames/${team}_header.svg`;
        widget.querySelector("[data-corner-left]").src = `assets/frames/${team}_corner.svg`;
        widget.querySelector("[data-corner-right]").src = `assets/frames/${team}_corner_right.svg`;
        widget.querySelector("[data-art]").src = `assets/art/${id}.webp`;
      } else {
        ["--accent", "--title", "--quali-time", "--race-time"].forEach((v) => widget.style.removeProperty(v));
      }
      drawWidget(themed);
      picker.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.theme === id)));
    };
    picker.innerHTML = choices.map(([id, name]) =>
      `<button type="button" data-theme="${id}" aria-pressed="false" style="--chip:${id === "standard" ? "#FF343D" : TEAMS[teamOf(id)][1]}">${name}</button>`).join("");
    // Preload artwork so the slow cycle never shows a half-loaded frame.
    choices.slice(1).forEach(([id]) => { new Image().src = `assets/art/${id}.webp`; new Image().src = `assets/frames/${teamOf(id)}_header.svg`; });

    // Cycle slowly through the themes until the visitor picks one. Hovering pauses it.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index = 0, timer = null, hovering = false;
    const stop = () => { clearInterval(timer); timer = null; };
    const show = (i, fade) => {
      index = i;
      apply(choices[i][0]);
      if (fade && widget.animate) widget.animate([{ opacity: .35 }, { opacity: 1 }], { duration: 450, easing: "ease-out" });
    };
    picker.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      stop();
      show(choices.findIndex(([id]) => id === b.dataset.theme), false);
    });
    widget.addEventListener("pointerenter", () => { hovering = true; });
    widget.addEventListener("pointerleave", () => { hovering = false; });

    // ?theme=norris opens the demo on that theme, handy for sharing a link.
    const requested = choices.findIndex(([id]) => id === new URLSearchParams(location.search).get("theme"));
    show(requested > 0 ? requested : 0, false);
    if (requested < 0 && !reduceMotion) {
      timer = setInterval(() => { if (!hovering && !document.hidden) show((index + 1) % choices.length, true); }, 4000);
    }
  }

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
      `<figure style="--team:${colour}"><img src="assets/art/${id}.webp" alt="" loading="lazy" width="120" height="76"><figcaption>${name}</figcaption></figure>`).join("");
  }

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
