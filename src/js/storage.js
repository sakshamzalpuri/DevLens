const HISTORY_KEY = "github-search-history";
const MAX_HISTORY = 5;

export function getSearchHistory() {
  try {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    return Array.isArray(history)
      ? history.filter(item => typeof item === "string").slice(0, MAX_HISTORY)
      : [];
  } catch {
    return [];
  }
}

export function saveSearch(username) {
  const nextHistory = [
    username,
    ...getSearchHistory().filter(
      item => item.toLowerCase() !== username.toLowerCase()
    ),
  ].slice(0, MAX_HISTORY);

  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
  } catch {
    // The current search still works if browser storage is unavailable.
  }

  return nextHistory;
}

export function clearSearchHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {
    // Ignore storage errors; the visible history is cleared regardless.
  }

  return [];
}

export function removeSearch(username) {
  const nextHistory = getSearchHistory().filter(
    item => item.toLowerCase() !== username.toLowerCase()
  );

  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
  } catch {
    // Keep the UI responsive if browser storage is unavailable.
  }

  return nextHistory;
}
