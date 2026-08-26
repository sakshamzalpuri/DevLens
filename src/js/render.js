import { formatDate, getLanguageColor } from "./utils.js";

export const dom = {
  searchInput: document.getElementById("search"),
  searchBtn: document.getElementById("search-btn"),
  profileContainer: document.getElementById("profile-container"),
  errorContainer: document.getElementById("error-container"),
  avatar: document.getElementById("avatar"),
  nameElement: document.getElementById("name"),
  usernameElement: document.getElementById("username"),
  bioElement: document.getElementById("bio"),
  locationElement: document.getElementById("location"),
  joinedDateElement: document.getElementById("joined-date"),
  profileLink: document.getElementById("profile-link"),
  followers: document.getElementById("followers"),
  following: document.getElementById("following"),
  repos: document.getElementById("repos"),
  companyElement: document.getElementById("company"),
  blogElement: document.getElementById("blog"),
  twitterElement: document.getElementById("twitter"),
  companyContainer: document.getElementById("company-container"),
  blogContainer: document.getElementById("blog-container"),
  twitterContainer: document.getElementById("twitter-container"),
  reposContainer: document.getElementById("repos-container"),
  gists: document.getElementById("gists"),
  skeletonContainer: document.getElementById("skeleton-container"),
  historyContainer: document.getElementById("history-container"),
};

export function renderError(message) {
  dom.errorContainer.classList.remove("hidden");
  dom.errorContainer.querySelector(".error-message").textContent = message;
}

export function hideError() {
  dom.errorContainer.classList.add("hidden");
}

export function renderHistory(history, onSelect, onRemove, onClear) {
  dom.historyContainer.innerHTML = "";

  if (history.length === 0) {
    return;
  }

  history.forEach(username => {
    const chip = document.createElement("button");
    chip.className = "history-chip";
    chip.type = "button";
    chip.textContent = username;

    chip.addEventListener("click", () => {
      onSelect(username);
    });

    const removeButton = document.createElement("span");
    removeButton.className = "chip-remove";
    removeButton.textContent = "x";
    removeButton.setAttribute("aria-label", `Remove ${username} from search history`);

    removeButton.addEventListener("click", event => {
      event.stopPropagation();
      onRemove(username);
    });

    chip.appendChild(removeButton);
    dom.historyContainer.appendChild(chip);
  });

  const clearButton = document.createElement("button");
  clearButton.className = "history-clear";
  clearButton.type = "button";
  clearButton.textContent = "Clear history";

  clearButton.addEventListener("click", onClear);

  dom.historyContainer.appendChild(clearButton);
}

export function showLoading() {
  dom.skeletonContainer.classList.remove("hidden");
  dom.skeletonContainer.setAttribute("aria-busy", "true");
  dom.profileContainer.classList.add("hidden");
  dom.errorContainer.classList.add("hidden");
}

export function hideLoading() {
  dom.skeletonContainer.classList.add("hidden");
  dom.skeletonContainer.setAttribute("aria-busy", "false");
}

export function renderProfile(profile) {
  dom.avatar.src = profile.avatar_url;
  dom.avatar.alt = `${profile.login} profile avatar`;
  dom.nameElement.textContent = profile.name || profile.login;
  dom.usernameElement.textContent = `@${profile.login}`;
  dom.profileLink.href = profile.html_url;

  dom.bioElement.classList.toggle("hidden", !profile.bio);
  dom.bioElement.textContent = profile.bio || "";

  dom.joinedDateElement.textContent = formatDate(profile.created_at, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  dom.followers.textContent = profile.followers;
  dom.following.textContent = profile.following;
  dom.gists.textContent = profile.public_gists;
  dom.repos.textContent = profile.public_repos;

  dom.locationElement.parentElement.classList.toggle("hidden", !profile.location);
  dom.locationElement.textContent = profile.location || "";

  dom.companyContainer.classList.toggle("hidden", !profile.company);
  dom.companyElement.textContent = profile.company || "";

  dom.blogContainer.classList.toggle("hidden", !profile.blog);
  dom.blogElement.href = profile.blog
    ? (profile.blog.startsWith("http") ? profile.blog : `//${profile.blog}`)
    : "#";
  dom.blogElement.textContent = profile.blog || "";

  dom.twitterContainer.classList.toggle("hidden", !profile.twitter_username);
  dom.twitterElement.href = profile.twitter_username
    ? `https://twitter.com/${profile.twitter_username}`
    : "#";
  dom.twitterElement.textContent = profile.twitter_username
    ? `@${profile.twitter_username}`
    : "";
}

export function renderRepos(repos) {
  dom.reposContainer.textContent = "";

  if (repos.length === 0) {
    dom.reposContainer.innerHTML = '<p class="no-repos">No public repositories found.</p>';
    return;
  }

  const sortedRepos = [...repos].sort(
    (a, b) => b.stargazers_count - a.stargazers_count
  );

  dom.reposContainer.innerHTML = sortedRepos.map(repo => {
    const updatedDate = formatDate(repo.updated_at, {
      month: "short",
      day: "numeric",
    });

    const languageHtml = repo.language
      ? `<span class="repo-meta-item">
           <span class="lang-dot" style="background-color: ${getLanguageColor(repo.language)};"></span>
           ${repo.language}
         </span>`
      : "";

    return `
      <div class="repo-card">
        <div class="repo-card-header">
          <i class="fas fa-code-branch"></i>
          <a href="${repo.html_url}" target="_blank" rel="noreferrer" class="repo-name">${repo.name}</a>
        </div>
        <p class="repo-description">${repo.description || "No description available."}</p>
        <div class="repo-meta">
          ${languageHtml}
          <span class="repo-meta-item">
            <i class="fas fa-star"></i>
            ${repo.stargazers_count}
          </span>
          <span class="repo-meta-item">
            <i class="fas fa-code-branch"></i>
            ${repo.forks_count}
          </span>
          <span class="repo-meta-item">
            <i class="fas fa-calendar"></i>
            ${updatedDate}
          </span>
        </div>
      </div>
    `;
  }).join("");
}
