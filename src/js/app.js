import { getGitHubUser } from "./api.js";
import {
  dom, renderError, hideError, renderHistory, showLoading, hideLoading,
  renderProfile, renderRepos,
} from "./render.js";
import {
  getSearchHistory, saveSearch, removeSearch, clearSearchHistory,
} from "./storage.js";

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
