function flagFor(name) {
  const entry = COUNTRIES.find((c) => c.name === name);
  return entry ? entry.flag : "📖";
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

  if (!books) {
    detail.classList.remove("hidden");
    heading.innerHTML = `<span class="flag">${flagFor(name)}</span><h2>${name}</h2>`;
    list.innerHTML = '<p class="empty-state">Aún no hay datos para este país.</p>';
    detail.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  heading.innerHTML = `<span class="flag">${flagFor(name)}</span><h2>Los 10 libros más importantes de ${name}</h2>`;

  list.innerHTML = books
    .map(
      (book, i) => `
      <li class="book-item">
        <span class="rank">${i + 1}</span>
        <div>
          <h3>${book.titulo}</h3>
          <div class="meta">${book.autor} · ${book.anio}</div>
          <p>${book.descripcion}</p>
        </div>
      </li>`
    )
    .join("");

  detail.classList.remove("hidden");
  detail.scrollIntoView({ behavior: "smooth", block: "start" });
}

document.addEventListener("DOMContentLoaded", () => {
  renderGrid();
  document.getElementById("search").addEventListener("input", (e) => {
    renderGrid(e.target.value);
  });
});
