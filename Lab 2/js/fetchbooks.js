/* =========================================
   fetchBooks.js — Open Library API helpers
   ========================================= */

const BASE = 'https://openlibrary.org';

/* ============================================================
   SEARCH BOOKS
============================================================ */

async function searchBooks(query, limit = 20) {
  try {
    const url =
      `${BASE}/search.json?q=${encodeURIComponent(query)}` +
      `&limit=${limit}` +
      `&fields=key,title,author_name,first_publish_year,cover_i`;

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error('Search failed');
    }

    const data = await res.json();

    return normaliseSearchResults(data.docs || []);

  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

/* ============================================================
   FETCH BOOKS BY SUBJECT (CATEGORY)
============================================================ */

async function fetchBySubject(subject, limit = 6) {
  try {
    console.log("Fetching subject:", subject);

    const url = `https://openlibrary.org/subjects/${subject}.json?limit=${limit}`;

    const res = await fetch(url);

    if (!res.ok) {
      console.warn("Subject not found:", subject, res.status);
      return [];
    }

    const data = await res.json();

    if (!data || !Array.isArray(data.works)) {
      console.warn("Invalid subject data:", subject, data);
      return [];
    }

    return normaliseSubjectResults(data.works);

  } catch (error) {
    console.error(`Category error (${subject}):`, error);
    return [];
  }
}
/* ============================================================
   FETCH TRENDING BOOKS
============================================================ */

async function fetchTrending(limit = 6) {
  try {
    const url =
      `${BASE}/search.json?q=subject:fiction` +
      `&sort=editions` +
      `&limit=${limit}` +
      `&fields=key,title,author_name,first_publish_year,cover_i`;

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error('Trending fetch failed');
    }

    const data = await res.json();

    return normaliseSearchResults(data.docs || []);

  } catch (error) {
    console.error('Trending error:', error);
    return [];
  }
}

/* ============================================================
   NORMALISE SEARCH RESULTS
============================================================ */

function normaliseSearchResults(docs) {
  return docs
    .filter(book => book.title)
    .map(book => ({
      id:
        (book.key || '').replace('/works/', '') ||
        Math.random().toString(36).slice(2),

      key: book.key || "",

      title: book.title || 'Unknown Title',

      author:
        Array.isArray(book.author_name)
          ? book.author_name[0]
          : 'Unknown Author',

      year: book.first_publish_year || null,

      cover_i: book.cover_i || null,
    }));
}

/* ============================================================
   NORMALISE SUBJECT RESULTS
============================================================ */

function normaliseSubjectResults(works) {
  return works
    .filter(book => book.title)
    .map(book => ({
      id:
        (book.key || '').replace('/works/', '') ||
        Math.random().toString(36).slice(2),

      key: book.key || "",

      title: book.title || 'Unknown Title',

      author:
        book.authors?.[0]?.name ||
        'Unknown Author',

      year: book.first_publish_year || null,

      cover_i: book.cover_id || null,
    }));
}

/* ============================================================
   GLOBAL ACCESS FOR app.js
============================================================ */

window.searchBooks = searchBooks;
window.fetchBySubject = fetchBySubject;
window.fetchTrending = fetchTrending;
