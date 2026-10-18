import { getGitHubUser } from "./api.js";
import {
  dom, showLoading, hideLoading, showError,
  renderProfile, renderRepos, renderHistory
} from "./render.js";

const HISTORY_KEY = "github-search-history";
let lastUsername = "";

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch {
    return [];
  }
}

function saveHistory(username) {
  const history = [username, ...getHistory().filter(name => name.toLowerCase() !== username.toLowerCase())].slice(0, 5);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  return history;
}

function updateHistory() {
  renderHistory(getHistory(), searchUser, removeHistory, clearHistory);
}

function removeHistory(username) {
  const history = getHistory().filter(name => name !== username);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  updateHistory();
}

function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
  updateHistory();
}

async function searchUser(username = dom.searchInput.value.trim()) {
  username = username.trim();

  if (!username) {
    showError("Please enter a GitHub username.");
    return;
  }

  lastUsername = username;
  dom.searchBtn.disabled = true;
  showLoading();

  try {
    const data = await getGitHubUser(username);
    renderProfile(data.profile);
    renderRepos(data.repos);
    saveHistory(username);
    updateHistory();
    dom.profileContainer.classList.remove("hidden");
    dom.searchInput.value = "";
  } catch (error) {
    dom.profileContainer.classList.add("hidden");
    showError(error.message || "Something went wrong.");
  } finally {
    hideLoading();
    dom.searchBtn.disabled = false;
  }
}

dom.searchBtn.addEventListener("click", () => searchUser());

dom.searchInput.addEventListener("keydown", event => {
  if (event.key === "Enter") searchUser();
});

document.getElementById("retry-btn").addEventListener("click", () => {
  if (lastUsername) searchUser(lastUsername);
});

updateHistory();
