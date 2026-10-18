import { getGitHubUser } from "./api.js";
import {
  dom,
  showLoading,
  hideLoading,
  showError,
  renderProfile,
  renderRepos,
  renderHistory
} from "./render.js";

const HISTORY_KEY = "github-search-history";

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch {
    return [];
  }
}

function saveHistory(username) {
  const history = [
    username,
    ...getHistory().filter(name => name.toLowerCase() !== username.toLowerCase())
  ].slice(0, 3);

  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  renderHistory(history, searchUser);
}

async function searchUser(username = dom.searchInput.value.trim()) {
  username = username.trim();

  if (!username) {
    showError("Please enter a GitHub username.");
    return;
  }

  dom.searchBtn.disabled = true;
  showLoading();

  try {
    const data = await getGitHubUser(username);
    renderProfile(data.profile);
    renderRepos(data.repos);
    saveHistory(username);
    dom.searchInput.value = "";
  } catch (error) {
    dom.profileContainer.classList.add("hidden");
    showError(error.message || "Something went wrong. Please try again.");
  } finally {
    hideLoading();
  }
}

dom.searchForm.addEventListener("submit", event => {
  event.preventDefault();
  searchUser();
});

renderHistory(getHistory(), searchUser);
