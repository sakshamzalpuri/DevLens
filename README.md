# DevLens

A responsive web application for searching GitHub users and exploring their profile and repository data using the GitHub REST API.

**[Live Demo](https://sakshamzalpuri.github.io/DevLens/) · [Source Code](https://github.com/sakshamzalpuri/DevLens)**

## Features

- Search for a GitHub username by clicking Search or pressing Enter.
- View profile details, followers, following, public repositories, and public gists.
- Browse repositories with language, stars, forks, and last-updated date.
- Show up to six recently updated public repositories.
- Revisit the last five searches stored in localStorage.
- Show loading placeholders and user-facing errors for missing users, network issues, and API limits.
- Use a responsive layout on desktop and mobile.

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- GitHub REST API
- localStorage

## Run Locally

No package installation or build step is required.

```bash
git clone https://github.com/sakshamzalpuri/DevLens.git
cd DevLens
```

Open `index.html` in your browser, or use the VS Code Live Server extension.

## API Notes

DevLens uses GitHub's public REST API. Unauthenticated API requests are rate-limited, so searches may temporarily fail if the limit is reached.

## Project Scope

To keep the demo focused, DevLens displays up to six recently updated repositories. It does not fetch every repository page.

## License

See the [LICENSE](LICENSE) file.
