const HISTORY_KEY = "github-search-history";
const MAX_HISTORY = 5;

function getSearchHistory() {
  try {
    const items = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    return Array.isArray(items)
      ? items.filter(item => typeof item === "string").slice(0, MAX_HISTORY)
      : [];
  } catch {
    return [];
  }
}

function saveSearch(username) {
  const history = [
    username,
    ...getSearchHistory().filter(item => item.toLowerCase() !== username.toLowerCase()),
  ].slice(0, MAX_HISTORY);

  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    // Search still works if storage is unavailable.
  }

  return history;
}

function removeSearch(username) {
  const history = getSearchHistory().filter(item => item.toLowerCase() !== username.toLowerCase());

  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {}

  return history;
}

function clearSearchHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {}

  return [];
}

import { getGitHubUser } from "./api.js";
import {
  dom, renderError, hideError, renderHistory, showLoading, hideLoading,
  renderProfile, renderRepos,
} from "./render.js";

let lastSearch = "";

async function searchUser(username = dom.searchInput.value.trim()) {
  username = username.trim();

  if (!username) {
    renderError("Please enter a GitHub username.");
    return;
  }

  if (!/^[a-zA-Z0-9-]{1,39}$/.test(username) || username.startsWith("-") || username.endsWith("-")) {
    renderError("Enter a valid GitHub username.");
    return;
  }

  lastSearch = username;
  dom.searchBtn.disabled = true;
  showLoading();

  try {
    const { profile, repos } = await getGitHubUser(username);
    renderProfile(profile);
    renderRepos(repos);
    renderHistory(saveSearch(username), selectHistory, removeHistory, clearHistory);
    dom.profileContainer.classList.remove("hidden");
    dom.searchInput.value = "";
    hideError();
  } catch (error) {
    dom.profileContainer.classList.add("hidden");
    renderError(error.message || "Could not load this user.");
  } finally {
    hideLoading();
    dom.searchBtn.disabled = false;
  }
}

function selectHistory(username) {
  dom.searchInput.value = username;
  searchUser(username);
}

function removeHistory(username) {
  renderHistory(removeSearch(username), selectHistory, removeHistory, clearHistory);
}

function clearHistory() {
  renderHistory(clearSearchHistory(), selectHistory, removeHistory, clearHistory);
}

dom.searchBtn.addEventListener("click", () => searchUser());
dom.searchInput.addEventListener("keydown", event => {
  if (event.key === "Enter") searchUser();
});
document.getElementById("retry-btn").addEventListener("click", () => {
  if (lastSearch) searchUser(lastSearch);
});

renderHistory(getSearchHistory(), selectHistory, removeHistory, clearHistory);
