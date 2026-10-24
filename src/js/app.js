import { getUser } from "./api.js";
import {
  searchForm,
  searchInput,
  showLoading,
  hideLoading,
  showError,
  showProfile,
  showRepos,
  showHistory
} from "./render.js";

const HISTORY_KEY = "github-search-history";

function getHistory() {
  try {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      const history = JSON.parse(saved);
      return Array.isArray(history) ? history.filter(name => typeof name === "string") : [];
    }
    return [];
  } catch (error) {
    return [];
  }
}

function saveHistory(username) {
  let history = getHistory();
  history = history.filter((name) => name.toLowerCase() !== username.toLowerCase());
  history.unshift(username);
  history = history.slice(0, 3);

  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    // Searching still works when browser storage is unavailable.
  }
  showHistory(history, searchUser);
}

async function searchUser(username) {
  username = username.trim();

  if (username === "") {
    showError("Please enter a GitHub username.");
    return;
  }
  showLoading();

  try {
    const data = await getUser(username);
    showProfile(data.profile);
    showRepos(data.repos);
    saveHistory(data.profile.login || username);
    searchInput.value = "";
  } catch (error) {
    showError(error.message || "Something went wrong. Please try again.");
  } finally {
    hideLoading();
  }
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  searchUser(searchInput.value);
});

showHistory(getHistory(), searchUser);
