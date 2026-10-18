const KEY = "github-search-history";
const LIMIT = 5;

export function getSearchHistory() {
  try {
    const items = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(items)
      ? items.filter(item => typeof item === "string").slice(0, LIMIT)
      : [];
  } catch {
    return [];
  }
}

export function saveSearch(username) {
  const history = [
    username,
    ...getSearchHistory().filter(item => item.toLowerCase() !== username.toLowerCase()),
  ].slice(0, LIMIT);

  try {
    localStorage.setItem(KEY, JSON.stringify(history));
  } catch {
    // Search still works if storage is unavailable.
  }

  return history;
}

export function removeSearch(username) {
  const history = getSearchHistory().filter(item => item.toLowerCase() !== username.toLowerCase());

  try {
    localStorage.setItem(KEY, JSON.stringify(history));
  } catch {}

  return history;
}

export function clearSearchHistory() {
  try {
    localStorage.removeItem(KEY);
  } catch {}

  return [];
}
