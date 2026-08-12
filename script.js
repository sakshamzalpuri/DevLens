const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");
const profileContainer = document.getElementById("profile-container");
const errorContainer = document.getElementById("error-container");
const avatar = document.getElementById("avatar");
const nameElement = document.getElementById("name");
const usernameElement = document.getElementById("username");
const bioElement = document.getElementById("bio");
const locationElement = document.getElementById("location");
const joinedDateElement = document.getElementById("joined-date");
const profileLink = document.getElementById("profile-link");
const followers = document.getElementById("followers");
const following = document.getElementById("following");
const repos = document.getElementById("repos");
const companyElement = document.getElementById("company");
const blogElement = document.getElementById("blog");
const twitterElement = document.getElementById("twitter");
const companyContainer = document.getElementById("company-container");
const blogContainer = document.getElementById("blog-container");
const twitterContainer = document.getElementById("twitter-container");
const reposContainer = document.getElementById("repos-container");
const gists = document.getElementById("gists");
const skeletonContainer = document.getElementById("skeleton-container");

// Localstorage

const historyContainer = document.getElementById("history-container")
const HISTORY_KEY = "github-search-history"
const MAX_HISTORY = 8

const handleSearch = async () => {
    const searchTerm = searchInput.value.trim();

    if (!searchTerm) {
        renderError("Please enter a GitHub Username");
        return;
    }

    // ── Show skeleton, hide stale content while fetching ──
    skeletonContainer.classList.remove("hidden");
    profileContainer.classList.add("hidden");
    errorContainer.classList.add("hidden");

    const data = await fetchData(searchTerm);

    // ── Fetch done — hide skeleton regardless of outcome ──
    skeletonContainer.classList.add("hidden");

    searchInput.value = "";

    if (data) {
        errorContainer.classList.add("hidden");
        profileContainer.classList.remove("hidden");
        renderProfile(data[0]);
        renderRepos(data[1]);
    } else {
        profileContainer.classList.add("hidden");
        renderError(`User "${searchTerm}" not found.`);
    }
};

searchBtn.addEventListener("click", handleSearch);

searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        handleSearch();
    }
});

async function fetchData(username) {
    const profileUrl = `https://api.github.com/users/${username}`;
    const reposUrl = `https://api.github.com/users/${username}/repos`;
    try {
        const [profileRes, repoRes] = await Promise.all([
            fetch(profileUrl),
            fetch(reposUrl)
        ]);

        if (!profileRes.ok) {
            throw new Error(`User not found: ${profileRes.status}`);
        }

        const profile = await profileRes.json();
        const repoData = await repoRes.json();
        return [profile, repoData];
    } catch (err) {
        console.error("Fetch Error", err);
        return null;
    }
}

function renderError(message) {
    errorContainer.classList.remove("hidden");
    errorContainer.querySelector(".error-message").textContent = message;
}

function renderProfile(profileData) {
    avatar.src = profileData.avatar_url;
    nameElement.textContent = profileData.name || profileData.login;
    usernameElement.textContent = `@${profileData.login}`;
    profileLink.href = profileData.html_url;

    bioElement.classList.toggle("hidden", !profileData.bio);
    bioElement.textContent = profileData.bio || "";

    joinedDateElement.textContent = new Date(profileData.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    followers.textContent = profileData.followers;
    following.textContent = profileData.following;
    gists.textContent = profileData.public_gists;
    repos.textContent = profileData.public_repos;

    locationElement.parentElement.classList.toggle("hidden", !profileData.location);
    locationElement.textContent = profileData.location;

    companyContainer.classList.toggle("hidden", !profileData.company);
    companyElement.textContent = profileData.company;

    blogContainer.classList.toggle("hidden", !profileData.blog);
    blogElement.href = profileData.blog
        ? (profileData.blog.startsWith("http") ? profileData.blog : `//${profileData.blog}`)
        : "#";
    blogElement.textContent = profileData.blog || "";

    twitterContainer.classList.toggle("hidden", !profileData.twitter_username);
    twitterElement.href = profileData.twitter_username
        ? `https://twitter.com/${profileData.twitter_username}`
        : "#";
    twitterElement.textContent = profileData.twitter_username
        ? `@${profileData.twitter_username}`
        : "";
}

function renderRepos(repoData) {
    reposContainer.textContent = "";

    if (repoData.length === 0) {
        reposContainer.innerHTML = '<p class="no-repos">No public repositories found.</p>';
        return;
    }

    const sorted = [...repoData].sort((a, b) => b.stargazers_count - a.stargazers_count);

    const repoCardsHtml = sorted.map(repo => {
        const updatedDate = new Date(repo.updated_at).toLocaleDateString("en-US", {
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
    reposContainer.innerHTML = repoCardsHtml;
}


function getLanguageColor(language) {
    const colors = {
        JavaScript: "#f1e05a",
        TypeScript: "#3178c6",
        Python:     "#3572A5",
        Java:       "#b07219",
        HTML:       "#e34c26",
        CSS:        "#563d7c",
        "C++":      "#f34b7d",
        C:          "#555555",
        "C#":       "#178600",
        Ruby:       "#701516",
        Go:         "#00ADD8",
        PHP:        "#4F5D95",
        Shell:      "#89e051",
        Swift:      "#F05138",
        Kotlin:     "#A97BFF",
        Rust:       "#DEA584",
        Dart:       "#00B4AB",
        Vue:        "#41b883",
        Svelte:     "#ff3e00",
        Scala:      "#c22d40",
        Lua:        "#000080",
        R:          "#198CE7",
        MATLAB:     "#e16737",
        Jupyter:    "#DA5B0B",
    };
    return colors[language] || "#8b949e";
}