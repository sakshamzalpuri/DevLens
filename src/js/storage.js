const HISTORY_KEY = "github-search-history";
const MAX_HISTORY = 6;

export function getSearchHistory() {
  return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
}

export function saveSearch(username) {
  const currentHistory = getSearchHistory();
  const nextHistory = [
    username,
    ...currentHistory.filter(
      item => item.toLowerCase() !== username.toLowerCase()
    ),
  ].slice(0, MAX_HISTORY);

  localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));

  return nextHistory;
}

export function clearSearchHistory() {
  localStorage.removeItem(HISTORY_KEY);
  return [];
}

export function removeSearch(username) {
  const nextHistory = getSearchHistory().filter(
    item => item.toLowerCase() !== username.toLowerCase()
  );

  localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));

  return nextHistory;
}
