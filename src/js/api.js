const GITHUB_API_BASE = "https://api.github.com";

export async function getGitHubUser(username){
    const profileUrl = `${GITHUB_API_BASE}/users/${username}`
    const reposUrl = `${GITHUB_API_BASE}/users/${username}/repos`

    let profileResponse
    let reposResponse

    try {
        [profileResponse, reposResponse] = await Promise.all([
            fetch(profileUrl),
            fetch(reposUrl)
        ])
    } catch (error) {
        throw new Error("Network error. Please check your connection and try again.")
    }

    if(!profileResponse.ok){
        if(profileResponse.status === 404){
            throw new Error("User not found")
        }

        if(profileResponse.status === 403){
            throw new Error("GitHub API rate limit reached. Please try again later.")
        }

        throw new Error("GitHub profile could not be loaded")
    }

    if(!reposResponse.ok){
        if(reposResponse.status === 403){
            throw new Error("GitHub API rate limit reached. Please try again later.")
        }

        throw new Error("Repositories could not be loaded")
    }

    const profile = await profileResponse.json()
    const repos = await reposResponse.json()

    return { profile, repos }
}
