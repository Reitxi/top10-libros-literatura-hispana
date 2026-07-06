let mapRoot = null;

const ERA_LABELS = {
  pre1800: "Antes de 1800",
  "1800-1899": "1800 - 1899",
  "1900-1949": "1900 - 1949",
  "1950-1999": "1950 - 1999",
  "2000-": "2000 - actualidad",
};

function flagFor(name) {
  const entry = COUNTRIES.find((c) => c.name === name);
  return entry ? entry.flag : "📖";
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function eraKeyOf(anio) {
  const match = String(anio).match(/\d{4}/);
  if (!match) return null;
  const year = parseInt(match[0], 10);
  if (year < 1800) return "pre1800";
  if (year < 1900) return "1800-1899";
  if (year < 1950) return "1900-1949";
  if (year < 2000) return "1950-1999";
  return "2000-";
}

function genreLabelFor(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function eraLabelFor(value) {
  return ERA_LABELS[value] || value;
}

function isFilterActive() {
  return Boolean(document.getElementById("genre-filter").value) ||
    Boolean(document.getElementById("era-filter").value);
}

// Búsquedas de edición libre en bibliotecas digitales de dominio público;
// no enlaces directos, ya que no todos los libros están disponibles.
function freeEditionLinks(book) {
  const combined = encodeURIComponent(`${book.titulo} ${book.autor}`);
  const titleOnly = encodeURIComponent(book.titulo);
  return {
    cervantes: `https://www.cervantesvirtual.com/controladores/busqueda_avanzada.php?q=${combined}`,
    wikisource: `https://es.wikisource.org/w/index.php?search=${titleOnly}`,
    archive: `https://archive.org/search?query=${combined}`,
  };
}

function coverCacheKey(book) {
  return `coverv1:${book.titulo}|${book.autor}`;
}

function readCachedCover(book) {
  let stored;
  try {
    stored = localStorage.getItem(coverCacheKey(book));
  } catch (err) {
    return undefined;
  }
  if (stored === null) return undefined; // never checked
  return stored === "" ? null : stored; // "" = checked, no cover found
}

function writeCachedCover(book, url) {
  try {
    localStorage.setItem(coverCacheKey(book), url || "");
  } catch (err) {
    // localStorage full/unavailable: cover just won't be cached for next visit
  }
}

async function fetchCover(book) {
  const cached = readCachedCover(book);
  if (cached !== undefined) return cached;

  try {
    const params = new URLSearchParams({
      title: book.titulo,
      author: book.autor,
      limit: "1",
      fields: "cover_i",
    });
    const response = await fetch(`https://openlibrary.org/search.json?${params}`);
    if (!response.ok) throw new Error("openlibrary request failed");
    const json = await response.json();
    const coverId = json.docs && json.docs[0] && json.docs[0].cover_i;
    const url = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : null;
    writeCachedCover(book, url);
    return url;
  } catch (err) {
    return null; // don't cache network errors, so a later retry can succeed
  }
}

function attachCovers(container) {
  container.querySelectorAll(".book-cover[data-pending]").forEach((el) => {
    const book = { titulo: el.dataset.titulo, autor: el.dataset.autor };
    fetchCover(book).then((url) => {
      el.removeAttribute("data-pending");
      if (url) {
        el.innerHTML = `<img src="${url}" alt="" loading="lazy" />`;
      } else {
        el.classList.add("book-cover-placeholder");
        el.textContent = "📖";
      }
    });
  });
}

function renderBookItem(book, opts) {
  const links = freeEditionLinks(book);
  const leading = opts.showCountry
    ? `<span class="flag" aria-hidden="true">${opts.countryFlag}</span>`
    : `<span class="rank">${opts.rank}</span>`;
  const countryTag = opts.showCountry
    ? `<div class="meta country-tag">${opts.countryName}</div>`
    : "";

  return `
    <li class="book-item">
      ${leading}
      <div class="book-cover" data-pending data-titulo="${escapeHtml(book.titulo)}" data-autor="${escapeHtml(book.autor)}" aria-hidden="true"></div>
      <div class="book-body">
        ${countryTag}
        <h3>${book.titulo}</h3>
        <div class="meta">${book.autor} · ${book.anio} · <span class="genre-badge">${genreLabelFor(book.genero)}</span></div>
        <p>${book.descripcion}</p>
        <div class="free-links">
          <span class="free-links-label">Buscar edición libre:</span>
          <a href="${links.cervantes}" target="_blank" rel="noopener noreferrer">Cervantes Virtual</a>
          <a href="${links.wikisource}" target="_blank" rel="noopener noreferrer">Wikisource</a>
          <a href="${links.archive}" target="_blank" rel="noopener noreferrer">Internet Archive</a>
        </div>
      </div>
    </li>`;
}

function renderGrid(filter = "") {
  const grid = document.getElementById("country-grid");
  grid.innerHTML = "";
  const normalizedFilter = filter.trim().toLowerCase();

  const matches = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(normalizedFilter)
  );

  if (matches.length === 0) {
    grid.innerHTML = '<p class="empty-state">No se encontraron países.</p>';
    return;
  }

  matches.forEach((country) => {
    const card = document.createElement("button");
    card.className = "country-card";
    card.type = "button";
    card.setAttribute("data-country", country.name);
    card.innerHTML = `
      <span class="flag" aria-hidden="true">${country.flag}</span>
      <span class="name">${country.name}</span>
    `;
    card.addEventListener("click", () => showCountry(country.name));
    grid.appendChild(card);
  });
}

function showCountry(name) {
  const books = BOOKS[name];
  const detail = document.getElementById("country-detail");
  const heading = document.getElementById("detail-heading");
  const list = document.getElementById("book-list");

  document.querySelectorAll(".country-card").forEach((card) => {
    card.classList.toggle("active", card.getAttribute("data-country") === name);
  });

  if (mapRoot) {
    mapRoot.querySelectorAll(".map-active").forEach((el) => el.classList.remove("map-active"));
    const country = COUNTRIES.find((c) => c.name === name);
    if (country) {
      mapRoot.querySelectorAll("." + country.code).forEach((el) => el.classList.add("map-active"));
    }
  }

  if (!books) {
    detail.classList.remove("hidden");
    heading.innerHTML = `<span class="flag">${flagFor(name)}</span><h2>${name}</h2>`;
    list.innerHTML = '<p class="empty-state">Aún no hay datos para este país.</p>';
    detail.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  heading.innerHTML = `<span class="flag">${flagFor(name)}</span><h2>Los 10 libros más importantes de ${name}</h2>`;

  list.innerHTML = books
    .map((book, i) => renderBookItem(book, { rank: i + 1, showCountry: false }))
    .join("");
  attachCovers(list);

  detail.classList.remove("hidden");
  detail.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderFilteredResults(searchTerm = "") {
  const genre = document.getElementById("genre-filter").value;
  const era = document.getElementById("era-filter").value;
  const term = searchTerm.trim().toLowerCase();
  const heading = document.getElementById("filtered-heading");
  const list = document.getElementById("filtered-book-list");

  const matches = [];
  COUNTRIES.forEach((country) => {
    (BOOKS[country.name] || []).forEach((book) => {
      if (genre && book.genero !== genre) return;
      if (era && eraKeyOf(book.anio) !== era) return;
      if (term) {
        const haystack = `${country.name} ${book.titulo} ${book.autor}`.toLowerCase();
        if (!haystack.includes(term)) return;
      }
      matches.push({ book, country });
    });
  });

  const labelParts = [];
  if (genre) labelParts.push(genreLabelFor(genre));
  if (era) labelParts.push(eraLabelFor(era));
  const label = labelParts.length ? labelParts.join(" · ") : "Todos los libros";

  heading.innerHTML = `
    <h2>${label} <span class="result-count">(${matches.length})</span></h2>
    <button type="button" id="clear-filters" class="clear-filters">✕ Quitar filtros</button>
  `;
  document.getElementById("clear-filters").addEventListener("click", () => {
    document.getElementById("genre-filter").value = "";
    document.getElementById("era-filter").value = "";
    updateView();
  });

  if (matches.length === 0) {
    list.innerHTML = '<p class="empty-state">No se encontraron libros con estos filtros.</p>';
    return;
  }

  list.innerHTML = matches
    .map(({ book, country }) =>
      renderBookItem(book, { showCountry: true, countryName: country.name, countryFlag: country.flag })
    )
    .join("");
  attachCovers(list);
}

function updateView() {
  const searchValue = document.getElementById("search").value;
  const mapSection = document.getElementById("map-section");
  const grid = document.getElementById("country-grid");
  const detail = document.getElementById("country-detail");
  const filtered = document.getElementById("filtered-results");

  if (isFilterActive()) {
    mapSection.classList.add("hidden");
    grid.classList.add("hidden");
    detail.classList.add("hidden");
    filtered.classList.remove("hidden");
    renderFilteredResults(searchValue);
  } else {
    mapSection.classList.remove("hidden");
    grid.classList.remove("hidden");
    filtered.classList.add("hidden");
    renderGrid(searchValue);
  }
}

function updateThemeToggleIcon(theme) {
  const btn = document.getElementById("theme-toggle");
  btn.textContent = theme === "dark" ? "☀️" : "🌙";
}

function initThemeToggle() {
  const btn = document.getElementById("theme-toggle");
  updateThemeToggleIcon(document.documentElement.getAttribute("data-theme"));

  btn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    updateThemeToggleIcon(next);
  });
}

async function initMap() {
  const container = document.getElementById("world-map");

  let svgText;
  try {
    const response = await fetch("img/world-map.svg");
    svgText = await response.text();
  } catch (err) {
    container.innerHTML = '<p class="empty-state">No se pudo cargar el mapa.</p>';
    return;
  }

  container.innerHTML = svgText;
  mapRoot = container.querySelector("svg");
  if (!mapRoot) return;

  COUNTRIES.forEach((country) => {
    const elements = mapRoot.querySelectorAll("." + country.code);
    elements.forEach((el, i) => {
      el.classList.add("map-highlight");
      el.addEventListener("click", () => showCountry(country.name));
      if (i === 0) {
        el.setAttribute("tabindex", "0");
        el.setAttribute("role", "button");
        el.setAttribute("aria-label", country.name);
        el.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            showCountry(country.name);
          }
        });
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateView();
  initThemeToggle();
  initMap();

  document.getElementById("search").addEventListener("input", (e) => {
    if (isFilterActive()) {
      renderFilteredResults(e.target.value);
    } else {
      renderGrid(e.target.value);
    }
  });

  document.getElementById("genre-filter").addEventListener("change", updateView);
  document.getElementById("era-filter").addEventListener("change", updateView);
});
