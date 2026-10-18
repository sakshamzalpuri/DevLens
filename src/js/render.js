function formatDate(date, options) {
  return new Date(date).toLocaleDateString("en-US", options);
}

function getLanguageColor(language) {
  const colors = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    Python: "#3572A5",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Java: "#b07219",
    "C++": "#f34b7d",
    Ruby: "#701516",
    Go: "#00ADD8",
    PHP: "#4F5D95",
  };

  return colors[language] || "#8b949e";
}

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
  dom.reposContainer.replaceChildren();

  if (repos.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "no-repos";
    emptyMessage.textContent = "No public repositories found.";
    dom.reposContainer.appendChild(emptyMessage);
    return;
  }

  repos.forEach(repo => {
    const card = document.createElement("article");
    card.className = "repo-card";

    const header = document.createElement("div");
    header.className = "repo-card-header";

    const repoIcon = document.createElement("i");
    repoIcon.className = "fas fa-code-branch";
    repoIcon.setAttribute("aria-hidden", "true");

    const link = document.createElement("a");
    link.className = "repo-name";
    link.href = repo.html_url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = repo.name;

    header.append(repoIcon, link);

    const description = document.createElement("p");
    description.className = "repo-description";
    description.textContent = repo.description || "No description available.";

    const meta = document.createElement("div");
    meta.className = "repo-meta";

    if (repo.language) {
      const language = document.createElement("span");
      language.className = "repo-meta-item";

      const dot = document.createElement("span");
      dot.className = "lang-dot";
      dot.style.backgroundColor = getLanguageColor(repo.language);

      language.append(dot, document.createTextNode(repo.language));
      meta.appendChild(language);
    }

    [
      ["fas fa-star", repo.stargazers_count],
      ["fas fa-code-branch", repo.forks_count],
      ["fas fa-calendar", formatDate(repo.updated_at, { month: "short", day: "numeric" })],
    ].forEach(([iconClass, value]) => {
      const item = document.createElement("span");
      item.className = "repo-meta-item";

      const icon = document.createElement("i");
      icon.className = iconClass;
      icon.setAttribute("aria-hidden", "true");

      item.append(icon, document.createTextNode(String(value)));
      meta.appendChild(item);
    });

    card.append(header, description, meta);
    dom.reposContainer.appendChild(card);
  });
}
