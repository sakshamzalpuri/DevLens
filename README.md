# DevLens

A lightweight GitHub profile explorer built with HTML, CSS, and vanilla JavaScript. Search for a GitHub username to view profile details, public repository statistics, and recently updated repositories.

**[Live Demo](https://sakshamzalpuri.github.io/DevLens/) · [Source Code](https://github.com/sakshamzalpuri/DevLens)**

## Preview

<!-- Add a real screenshot at docs/desktop.png before publishing this image reference. -->
![DevLens desktop preview](docs/desktop.png)

## Features

- Search for a GitHub user by submitting a username or pressing Enter.
- View profile information, including avatar, bio, followers, following, and public repository count.
- Browse up to six recently updated public repositories with descriptions and star counts.
- Revisit up to three recent successful searches using browser local storage.
- Display loading feedback and useful messages for missing users and API failures.
- Responsive layout for desktop and mobile screens.

## Built With

- HTML5
- CSS3
- JavaScript (ES modules)
- GitHub REST API
- Browser localStorage

## How It Works

1. The search form passes the username to the application module in `src/js/app.js`.
2. The application calls `getUser()` from `src/js/api.js` to request the user's public profile and repository data from GitHub.
3. The API module returns the profile and repository data, or throws an error when a request fails.
4. Functions in `src/js/render.js` update the interface with the profile, repository cards, loading state, or error message.
5. Successful searches are saved in localStorage, with the most recent three usernames shown as clickable history items.

## Project Structure

```text
DevLens/
├── index.html
├── style.css
└── src/
    └── js/
        ├── app.js
        ├── api.js
        └── render.js
```

- **`app.js`** — coordinates search events, loading and error flow, and search history.
- **`api.js`** — requests profile and repository data from GitHub's public REST API and handles HTTP errors.
- **`render.js`** — updates the DOM and renders profile details, repositories, search history, and UI states.

## Run Locally

No package installation or build step is required.

```bash
git clone https://github.com/sakshamzalpuri/DevLens.git
cd DevLens
```

Open `index.html` in a browser, or use the VS Code Live Server extension.

## API Notes

DevLens uses GitHub's public REST API without authentication. Unauthenticated requests are rate-limited, so requests may fail temporarily when the limit is reached. See the [GitHub REST API documentation](https://docs.github.com/en/rest).

## Manual Test Checklist

- [ ] Search for a valid GitHub username.
- [ ] Submit a username that does not exist.
- [ ] Submit an empty input.
- [ ] Press Enter to submit a search.
- [ ] Open a repository link and verify it points to the correct repository.
- [ ] Revisit a recent search and refresh the page to check saved history.
- [ ] Test the layout on a narrow mobile viewport.
- [ ] Verify that loading feedback and error messages are readable.

## Future Improvements

- Add automated tests for API responses and rendering states.
- Improve handling of transient network errors and concurrent searches.
- Add keyboard and screen-reader usability checks.

## License

No license file is currently present. Add a license that matches how you want others to use the project before describing it as open source.
