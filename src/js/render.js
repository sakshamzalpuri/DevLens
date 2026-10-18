// Elements
export const searchForm = document.getElementById("search-form");
export const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");
const loading = document.getElementById("loading");
const profileContainer = document.getElementById("profile-container");
const errorContainer = document.getElementById("error-container");
const errorMessage = document.getElementById("error-message");
const historyContainer = document.getElementById("history-container");
const reposContainer = document.getElementById("repos-container");

export function showLoading() {
  searchBtn.disabled = true;
  loading.classList.remove("hidden");
  profileContainer.classList.add("hidden");
  errorContainer.classList.add("hidden");
}

export function hideLoading() {
  searchBtn.disabled = false;
  loading.classList.add("hidden");
}

export function showError(message) {
  profileContainer.classList.add("hidden");
  errorMessage.textContent = message;
  errorContainer.classList.remove("hidden");
}

export function showProfile(user) {
  document.getElementById("avatar").src = user.avatar_url;
  document.getElementById("avatar").alt = user.login + "'s avatar";
  document.getElementById("name").textContent = user.name || user.login;
  document.getElementById("username").textContent = "@" + user.login;
  document.getElementById("followers").textContent = user.followers;
  document.getElementById("following").textContent = user.following;
  document.getElementById("repos").textContent = user.public_repos;

  const bio = document.getElementById("bio");
  if (user.bio) {
    bio.textContent = user.bio;
    bio.classList.remove("hidden");
  } else {
    bio.classList.add("hidden");
  }

  profileContainer.classList.remove("hidden");
  errorContainer.classList.add("hidden");
}

export function showRepos(repos) {
  reposContainer.innerHTML = "";

  if (!Array.isArray(repos) || repos.length === 0) {
    reposContainer.innerHTML = '<p class="no-repos">No public repositories found.</p>';
    return;
  }

  repos.forEach((repo) => {
    const card = document.createElement("article");
    card.className = "repo-card";
    card.innerHTML =
      '<h4><i class="fas fa-book"></i> <a class="repo-name" target="_blank" rel="noopener noreferrer"></a></h4>' +
      '<p class="repo-description"></p>' +
      '<p class="repo-stars"><i class="fas fa-star"></i> <span></span> stars</p>';

    const link = card.querySelector(".repo-name");
    link.href = repo.html_url;
    link.textContent = repo.name;
    card.querySelector(".repo-description").textContent =
      repo.description || "No description available.";
    card.querySelector(".repo-stars span").textContent = repo.stargazers_count;

    reposContainer.appendChild(card);
  });
}

export function showHistory(history, onSelect) {
  historyContainer.innerHTML = "";

  history.forEach((name) => {
    const button = document.createElement("button");
    button.className = "history-chip";
    button.type = "button";
    button.textContent = name;
    button.addEventListener("click", () => onSelect(name));
    historyContainer.appendChild(button);
  });
}
