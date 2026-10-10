# DevLens — GitHub Developer Analytics

DevLens is a responsive web application for looking up GitHub users and exploring their profile and repository data using the GitHub REST API.

**[Live Demo](https://sakshamzalpuri.github.io/DevLens/) · [Source Code](https://github.com/sakshamzalpuri/DevLens)**

## Features

- Search for a GitHub username using a click or the Enter key.
- View profile details and repository statistics.
- Browse repositories and inspect details such as language, stars, forks, and update date.
- Revisit recent searches saved in localStorage.
- Show loading placeholders while requests are in progress.
- Provide user-facing feedback for missing users and network/API errors.
- Use a responsive layout across desktop and mobile screens.

## Tech Stack

- HTML5 and semantic markup
- CSS3 and responsive layouts
- Vanilla JavaScript (ES6+)
- GitHub REST API
- localStorage for recent search history

## Run Locally

No build step or package installation is required.

```bash
git clone https://github.com/sakshamzalpuri/DevLens.git
cd DevLens
```

Open `index.html` in your browser, or use the VS Code Live Server extension during development.

## Project Structure

```text
DevLens/
├── index.html
├── style.css
├── script.js
└── .gitignore
```

## API Notes

DevLens uses the public GitHub REST API. Unauthenticated requests are rate-limited by GitHub, so searches can temporarily fail after the limit is reached.

## License

See the [LICENSE](LICENSE) file.
