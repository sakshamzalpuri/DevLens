const API_URL = "https://api.github.com/users/";

export async function getGitHubUser(username) {
  const userResponse = await fetch(API_URL + encodeURIComponent(username));

  if (!userResponse.ok) {
    if (userResponse.status === 404) {
      throw new Error("User not found. Check the username and try again.");
    }
    if (userResponse.status === 403) {
      throw new Error("GitHub API limit reached. Try again later.");
    }
    throw new Error("Could not load the GitHub profile.");
  }

  const profile = await userResponse.json();
  const reposResponse = await fetch(
    API_URL + encodeURIComponent(username) + "/repos?per_page=6&sort=updated"
  );

  if (!reposResponse.ok) {
    throw new Error("Could not load repositories. Please try again.");
  }

  const repos = await reposResponse.json();
  return { profile, repos };
}
