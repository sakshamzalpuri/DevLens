# DevLens

A beginner-friendly GitHub profile viewer built with HTML, CSS, and vanilla JavaScript.

**[Live Demo](https://sakshamzalpuri.github.io/DevLens/) · [Source Code](https://github.com/sakshamzalpuri/DevLens)**

## Features

- Search for a GitHub username by clicking Search or pressing Enter.
- View the user's avatar, name, username, bio, followers, following, and public repository count.
- Browse up to six repositories with their names, descriptions, and star counts.
- Revisit up to three recent searches from a clickable history list.
- See simple loading text and clear error messages.
- Responsive layout for desktop and mobile.

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
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

DevLens uses GitHub's public REST API. Unauthenticated requests are rate-limited, so searches may temporarily fail if the limit is reached.

## License

See the [LICENSE](LICENSE) file.
