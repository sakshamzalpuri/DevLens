const GITHUB_API_BASE = "https://api.github.com";
const REPOSITORY_LIMIT = 6;

async function fetchJson(url) {
  let response;

  try {
    response = await fetch(url);
  } catch {
    throw new Error("Network error. Check your connection and try again.");
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("GitHub user not found.");
    }

    if (response.status === 403 || response.status === 429) {
      throw new Error("GitHub API rate limit reached. Please try again later.");
    }

    throw new Error("GitHub data could not be loaded. Please try again.");
  }

  return response.json();
}

export async function getGitHubUser(username) {
  const encodedUsername = encodeURIComponent(username.trim());
  const profileUrl = `${GITHUB_API_BASE}/users/${encodedUsername}`;
  const reposUrl = `${GITHUB_API_BASE}/users/${encodedUsername}/repos?per_page=${REPOSITORY_LIMIT}&sort=updated&direction=desc`;

  const [profile, repos] = await Promise.all([
    fetchJson(profileUrl),
    fetchJson(reposUrl),
  ]);

  return { profile, repos };
}
