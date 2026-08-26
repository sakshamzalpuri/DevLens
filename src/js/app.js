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

const SEARCH_DEBOUNCE_MS = 300;
let searchDebounceId;

async function handleSearch(username = dom.searchInput.value.trim()) {
  if (!username) {
    renderError("Please enter a GitHub username");
    return;
  }

  showLoading();

  try {
    const { profile, repos } = await getGitHubUser(username);
    const history = saveSearch(username);

    hideError();
    dom.profileContainer.classList.remove("hidden");
    renderProfile(profile);
    renderRepos(repos);
    renderHistory(history, handleHistorySelect, handleHistoryRemove, handleHistoryClear);
    dom.searchInput.value = "";
  } catch (error) {
    dom.profileContainer.classList.add("hidden");
    renderError(error.message);
  } finally {
    hideLoading();
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

dom.searchInput.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    clearTimeout(searchDebounceId);
    handleSearch();
  }
});

dom.searchInput.addEventListener("input", () => {
  clearTimeout(searchDebounceId);
  searchDebounceId = setTimeout(() => {
    handleSearch();
  }, SEARCH_DEBOUNCE_MS);
});

renderHistory(
  getSearchHistory(),
  handleHistorySelect,
  handleHistoryRemove,
  handleHistoryClear
);
