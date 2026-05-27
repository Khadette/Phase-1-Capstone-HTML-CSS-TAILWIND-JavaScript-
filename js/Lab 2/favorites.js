/* =========================================
   favorites.js — DISPLAY FAVORITES PAGE
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  const container = document.getElementById("favoritesGrid");

  if (!container) {
    console.error("favoritesGrid not found in favorites.html");
    return;
  }

  function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem("book_favorites")) || [];

    container.innerHTML = "";

    if (favorites.length === 0) {
      container.innerHTML = `
        <p style="color:#9ca3af; text-align:center; width:100%;">
          No favorite books yet ❤️
        </p>
      `;
      return;
    }

    favorites.forEach(book => {
      const card = buildBookCard(book, true);
      container.appendChild(card);
    });
  }

  loadFavorites();
});
