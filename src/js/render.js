const $ = id => document.getElementById(id);

export const dom = {
  searchInput: $("search"),
  searchBtn: $("search-btn"),
  profileContainer: $("profile-container"),
  errorContainer: $("error-container"),
  skeletonContainer: $("skeleton-container"),
  historyContainer: $("history-container"),
  reposContainer: $("repos-container")
};

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

function formatDate(date, options) {
  return new Date(date).toLocaleDateString("en-US", options);
}

export function showLoading() {
  dom.skeletonContainer.classList.remove("hidden");
  dom.profileContainer.classList.add("hidden");
  dom.errorContainer.classList.add("hidden");
}

export function hideLoading() {
  dom.skeletonContainer.classList.add("hidden");
}

export function showError(message) {
  dom.errorContainer.classList.remove("hidden");
  $("error-message").textContent = message;
}

export function renderProfile(user) {
  $("avatar").src = user.avatar_url;
  $("avatar").alt = user.login + "'s avatar";
  $("name").textContent = user.name || user.login;
  $("username").textContent = "@" + user.login;
  $("profile-link").href = user.html_url;

  $("bio").textContent = user.bio || "";
  $("bio").classList.toggle("hidden", !user.bio);

  $("joined-date").textContent = formatDate(user.created_at, {
    month: "short", day: "numeric", year: "numeric"
  });

  $("followers").textContent = user.followers;
  $("following").textContent = user.following;
  $("repos").textContent = user.public_repos;
  $("gists").textContent = user.public_gists;

  $("location").textContent = user.location || "";
  $("location").parentElement.classList.toggle("hidden", !user.location);

  $("company").textContent = user.company || "";
  $("company-container").classList.toggle("hidden", !user.company);

  $("blog").textContent = user.blog || "";
  $("blog").href = user.blog ? (user.blog.startsWith("http") ? user.blog : "https://" + user.blog) : "#";
  $("blog-container").classList.toggle("hidden", !user.blog);

  $("twitter").textContent = user.twitter_username ? "@" + user.twitter_username : "";
  $("twitter").href = user.twitter_username ? "https://twitter.com/" + user.twitter_username : "#";
  $("twitter-container").classList.toggle("hidden", !user.twitter_username);
}

export function renderRepos(repos) {
  if (!repos.length) {
    dom.reposContainer.innerHTML = '<p class="no-repos">No public repositories found.</p>';
    return;
  }

  const colors = {
    JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572A5",
    HTML: "#e34c26", CSS: "#563d7c", Java: "#b07219"
  };

  dom.reposContainer.innerHTML = repos.map(repo => {
    const language = repo.language
      ? '<span class="repo-meta-item"><span class="lang-dot" style="background-color:' +
        (colors[repo.language] || "#8b949e") + '"></span>' + escapeHTML(repo.language) + '</span>'
      : "";

    return '<div class="repo-card">' +
      '<div class="repo-card-header"><i class="fas fa-code-branch"></i> ' +
      '<a class="repo-name" href="' + escapeHTML(repo.html_url) +
      '" target="_blank" rel="noopener noreferrer">' + escapeHTML(repo.name) + '</a></div>' +
      '<p class="repo-description">' + escapeHTML(repo.description || "No description available.") + '</p>' +
      '<div class="repo-meta">' + language +
      '<span class="repo-meta-item"><i class="fas fa-star"></i> ' + repo.stargazers_count + '</span>' +
      '<span class="repo-meta-item"><i class="fas fa-code-branch"></i> ' + repo.forks_count + '</span>' +
      '<span class="repo-meta-item"><i class="fas fa-calendar"></i> ' +
      formatDate(repo.updated_at, { month: "short", day: "numeric" }) + '</span></div></div>';
  }).join("");
}

export function renderHistory(history, selectUser, removeUser, clearHistory) {
  dom.historyContainer.innerHTML = history.map(username =>
    '<button class="history-chip" type="button" data-user="' + escapeHTML(username) + '">' +
    escapeHTML(username) + '<span class="chip-remove" data-remove="' + escapeHTML(username) +
    '" aria-label="Remove ' + escapeHTML(username) + '">x</span></button>'
  ).join("");

  if (history.length) {
    dom.historyContainer.innerHTML += '<button class="history-clear" type="button">Clear history</button>';
  }

  dom.historyContainer.onclick = event => {
    const remove = event.target.dataset.remove;
    const user = event.target.dataset.user || event.target.closest("[data-user]")?.dataset.user;

    if (remove) {
      event.stopPropagation();
      removeUser(remove);
    } else if (event.target.closest(".history-clear")) {
      clearHistory();
    } else if (user) {
      selectUser(user);
    }
  };
}
