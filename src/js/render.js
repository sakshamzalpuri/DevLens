const $ = id => document.getElementById(id);

export const dom = {
  searchForm: $("search-form"),
  searchInput: $("search"),
  searchBtn: $("search-btn"),
  loading: $("loading"),
  profileContainer: $("profile-container"),
  errorContainer: $("error-container"),
  errorMessage: $("error-message"),
  historyContainer: $("history-container"),
  reposContainer: $("repos-container")
};

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

export function showLoading() {
  dom.loading.classList.remove("hidden");
  dom.profileContainer.classList.add("hidden");
  dom.errorContainer.classList.add("hidden");
}

export function hideLoading() {
  dom.loading.classList.add("hidden");
  dom.searchBtn.disabled = false;
}

export function showError(message) {
  dom.errorMessage.textContent = message;
  dom.errorContainer.classList.remove("hidden");
}

export function renderProfile(user) {
  $("avatar").src = user.avatar_url;
  $("avatar").alt = user.login + "'s avatar";
  $("name").textContent = user.name || user.login;
  $("username").textContent = "@" + user.login;
  $("bio").textContent = user.bio || "";
  $("bio").classList.toggle("hidden", !user.bio);

  $("followers").textContent = user.followers;
  $("following").textContent = user.following;
  $("repos").textContent = user.public_repos;

  dom.profileContainer.classList.remove("hidden");
  dom.errorContainer.classList.add("hidden");
}

export function renderRepos(repos) {
  if (repos.length === 0) {
    dom.reposContainer.innerHTML = '<p class="no-repos">No public repositories found.</p>';
    return;
  }

  dom.reposContainer.innerHTML = repos.map(repo => (
    '<article class="repo-card">' +
      '<h4><i class="fas fa-book"></i> <a class="repo-name" href="' +
      escapeHTML(repo.html_url) +
      '" target="_blank" rel="noopener noreferrer">' +
      escapeHTML(repo.name) + '</a></h4>' +
      '<p class="repo-description">' +
      escapeHTML(repo.description || "No description available.") +
      '</p>' +
      '<p class="repo-stars"><i class="fas fa-star"></i> ' +
      repo.stargazers_count + ' stars</p>' +
    '</article>'
  )).join("");
}

export function renderHistory(history, onSelect) {
  dom.historyContainer.innerHTML = history.map(username =>
    '<button class="history-chip" type="button" data-username="' +
    escapeHTML(username) + '">' + escapeHTML(username) + '</button>'
  ).join("");

  dom.historyContainer.onclick = event => {
    const button = event.target.closest("[data-username]");
    if (button) onSelect(button.dataset.username);
  };
}
