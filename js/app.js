/* =========================================
   Book Explorer — FIXED app.js
   Improved category loading + safer errors
========================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ---- ELEMENTS ----
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const loadingState = document.getElementById('loadingState');
  const noResults = document.getElementById('noResults');
  const searchResultsSection = document.getElementById('searchResultsSection');
  const searchResultsGrid = document.getElementById('searchResultsGrid');
  const searchResultsCount = document.getElementById('searchResultsCount');
  const clearSearchBtn = document.getElementById('clearSearch');
  const categorySections = document.getElementById('categorySections');

  const grids = {
    trending: document.getElementById('trendingGrid'),
    romance: document.getElementById('romanceGrid'),
    classics: document.getElementById('classicsGrid'),
    scifi: document.getElementById('scifiGrid'),
    mystery: document.getElementById('mysteryGrid'),
  };

  // ---- SAFETY WRAPPER ----
  function safe(fn, fallback = []) {
    try {
      return fn();
    } catch (e) {
      console.error("Function error:", e);
      return fallback;
    }
  }

  // ---- CHECK REQUIRED FUNCTIONS ----
  const required = [
    "buildBookCard",
    "fetchTrending",
    "fetchBySubject",
    "searchBooks",
    "renderSkeletons"
  ];

  required.forEach(fn => {
    if (typeof window[fn] === "undefined") {
      console.error(`❌ Missing function: ${fn}`);
    }
  });

  // ---- FIXED CATEGORIES (IMPORTANT PART) ----
  const categories = [
  {
    key: 'trending',
    fetcher: () => safe(() => fetchTrending(6))
  },
  {
    key: 'romance',
    fetcher: () => safe(() => fetchBySubject('love', 6))
  },
  {
    key: 'classics',
    fetcher: () => safe(() => fetchBySubject('fiction', 6))
  },
  {
    key: 'scifi',
    fetcher: () => safe(() => fetchBySubject('science_fiction', 6))
  },
  {
    key: 'mystery',
    fetcher: () => safe(() => fetchBySubject('detective_and_mystery', 6))
  }
];
  // ---- SKELETON LOADING ----
  Object.values(grids).forEach(g => {
    if (!g) return;

    if (typeof renderSkeletons === "function") {
      renderSkeletons(g, 6);
    } else {
      g.innerHTML = "<p>Loading...</p>";
    }
  });

  // ---- LOAD CATEGORIES ----
  categories.forEach(async ({ key, fetcher }) => {

    const grid = grids[key];
    if (!grid) return;

    try {
      const books = await fetcher();

      grid.innerHTML = "";

      if (!books || books.length === 0) {
        grid.innerHTML = "<p>No books found for this category.</p>";
        return;
      }

      books.forEach(book => {

        if (typeof buildBookCard !== "function") {
          grid.innerHTML = "<p>buildBookCard missing</p>";
          return;
        }

        const card = buildBookCard(book, false);

        // FIX IMAGE HANDLING
        const img = card.querySelector("img");

        if (img) {
          if (book.cover_i) {
            img.src = `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`;
          } else {
            img.src = "https://via.placeholder.com/300x450?text=No+Cover";
          }

          img.loading = "lazy";
          img.decoding = "async";

          img.onerror = () => {
            img.src = "https://via.placeholder.com/300x450?text=No+Cover";
          };
        }

        grid.appendChild(card);
      });

    } catch (err) {
      console.error(`Category load error (${key}):`, err);
      grid.innerHTML = "<p>Unable to load this category.</p>";
    }
  });

  // ---- SEARCH FUNCTION ----
  async function doSearch() {

    const q = searchInput.value.trim();
    if (!q) return;

    loadingState?.classList.remove('hidden');
    noResults?.classList.add('hidden');
    searchResultsSection?.classList.add('hidden');
    categorySections?.classList.add('hidden');

    try {

      const books = await searchBooks(q, 20);

      loadingState?.classList.add('hidden');

      if (!books || books.length === 0) {
        noResults?.classList.remove('hidden');
        categorySections?.classList.remove('hidden');
        return;
      }

      searchResultsGrid.innerHTML = "";

      books.forEach(book => {

        const card = buildBookCard(book, false);

        const img = card.querySelector("img");

        if (img) {
          if (book.cover_i) {
            img.src = `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`;
          } else {
            img.src = "https://via.placeholder.com/300x450?text=No+Cover";
          }

          img.loading = "lazy";
          img.decoding = "async";

          img.onerror = () => {
            img.src = "https://via.placeholder.com/300x450?text=No+Cover";
          };
        }

        searchResultsGrid.appendChild(card);
      });

      searchResultsCount.textContent =
        `${books.length} results for "${q}"`;

      searchResultsSection.classList.remove('hidden');

    } catch (err) {
      console.error("Search error:", err);
      loadingState?.classList.add('hidden');
    }
  }

  // ---- EVENTS ----
  searchBtn?.addEventListener('click', doSearch);

  searchInput?.addEventListener('keydown', e => {
    if (e.key === 'Enter') doSearch();
  });

  clearSearchBtn?.addEventListener('click', () => {
    searchInput.value = '';
    searchResultsSection?.classList.add('hidden');
    noResults?.classList.add('hidden');
    categorySections?.classList.remove('hidden');
  });

});