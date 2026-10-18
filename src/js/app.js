import { getGitHubUser } from "./api.js";
import {
  getSearchHistory,
  saveSearch,
  removeSearch,
  clearSearchHistory,
} from "./storage.js";
import {
  dom,
  renderProfile,
  renderRepos,
  renderHistory,
  renderError,
  hideError,
  showLoading,
  hideLoading,
} from "./render.js";

let lastSearch = "";

async function handleSearch(username = dom.searchInput.value.trim()) {
  const cleanUsername = username.trim();

  if (!cleanUsername) {
    renderError("Please enter a GitHub username.");
    return;
  }

  if (
    !/^[a-zA-Z0-9-]{1,39}$/.test(cleanUsername) ||
    cleanUsername.startsWith("-") ||
    cleanUsername.endsWith("-")
  ) {
    renderError("Enter a valid GitHub username.");
    return;
  }

  lastSearch = cleanUsername;
  dom.searchBtn.disabled = true;
  showLoading();

  try {
    const { profile, repos } = await getGitHubUser(cleanUsername);
    const history = saveSearch(cleanUsername);

    hideError();
    dom.profileContainer.classList.remove("hidden");
    renderProfile(profile);
    renderRepos(repos);
    renderHistory(history, handleHistorySelect, handleHistoryRemove, handleHistoryClear);
    dom.searchInput.value = "";
  } catch (error) {
    dom.profileContainer.classList.add("hidden");
    renderError(error.message || "Something went wrong. Please try again.");
  } finally {
    hideLoading();
    dom.searchBtn.disabled = false;
  }
}

function handleHistorySelect(username) {
  dom.searchInput.value = username;
  handleSearch(username);
}

function handleHistoryRemove(username) {
  renderHistory(
    removeSearch(username),
    handleHistorySelect,
    handleHistoryRemove,
    handleHistoryClear
  );
}

function handleHistoryClear() {
  renderHistory(
    clearSearchHistory(),
    handleHistorySelect,
    handleHistoryRemove,
    handleHistoryClear
  );
}

dom.searchBtn.addEventListener("click", () => handleSearch());

document.getElementById("retry-btn").addEventListener("click", () => {
  if (lastSearch) handleSearch(lastSearch);
});

dom.searchInput.addEventListener("keydown", event => {
  if (event.key === "Enter") handleSearch();
});

renderHistory(
  getSearchHistory(),
  handleHistorySelect,
  handleHistoryRemove,
  handleHistoryClear
);
