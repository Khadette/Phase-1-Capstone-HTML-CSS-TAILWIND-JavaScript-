/* =========================================
   utils.js — FULL CLEAN FIXED VERSION
   UI + FAVORITES + SAFE DATA HANDLING
========================================= */

const STORAGE_KEY = "book_favorites";

/* =========================
   FAVORITES STORAGE
========================= */

function getFavorites() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveFavorites(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function isFavorite(id) {
  return getFavorites().some(b => b.id === id);
}

function toggleFavorite(book) {
  let favs = getFavorites();

  const exists = favs.find(b => b.id === book.id);

  if (exists) {
    favs = favs.filter(b => b.id !== book.id);
  } else {
    favs.push(book);
  }

  saveFavorites(favs);
  return !exists;
}

/* =========================
   SAFE DATA NORMALIZER
========================= */

function normalizeBook(book) {
  return {
    id: book.id || book.key || Math.random().toString(36),
    title: book.title || "Untitled",
    author: book.author || book.author_name?.[0] || "Unknown Author",
    year: book.year || book.first_publish_year || "N/A",
    cover_i: book.cover_i || null
  };
}

/* =========================
   BOOK CARD UI (FULL FIXED)
========================= */

function buildBookCard(rawBook, isFavPage = false) {

  const book = normalizeBook(rawBook);
  const saved = isFavorite(book.id);

  const card = document.createElement("div");
  card.className = "book-card";

  const cover = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
    : "https://via.placeholder.com/300x450?text=No+Cover";

  card.innerHTML = `
    <div class="book-cover-wrap">
      <span class="book-year-badge">${book.year}</span>
      <img src="${cover}" alt="${book.title}" loading="lazy" />
    </div>

    <div class="book-card-body">
      <h3 class="book-title">${book.title}</h3>
      <p class="book-author">${book.author}</p>

      ${
        isFavPage
          ? `<button class="btn-remove">Remove</button>`
          : `<button class="btn-favorite ${saved ? "saved" : ""}">
              ${saved ? "Saved ❤️" : "+ Favorite"}
            </button>`
      }
    </div>
  `;

  const btn = card.querySelector("button");

  /* FAVORITES PAGE BUTTON */
  if (isFavPage) {
    btn.onclick = () => {
      const favs = getFavorites().filter(b => b.id !== book.id);
      saveFavorites(favs);
      card.remove();
    };
  }

  /* MAIN PAGE BUTTON */
  else {
    btn.onclick = () => {
      const added = toggleFavorite(book);
      btn.textContent = added ? "Saved ❤️" : "+ Favorite";
      btn.classList.toggle("saved");
    };
  }

  return card;
}

/* =========================
   EXPORTS
========================= */

window.buildBookCard = buildBookCard;
window.getFavorites = getFavorites;
window.saveFavorites = saveFavorites;
window.toggleFavorite = toggleFavorite;
window.isFavorite = isFavorite;