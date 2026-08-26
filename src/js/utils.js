export function formatDate(dateString, options) {
  return new Date(dateString).toLocaleDateString("en-US", options);
}

export function getLanguageColor(language) {
  const colors = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    Python: "#3572A5",
    Java: "#b07219",
    HTML: "#e34c26",
    CSS: "#563d7c",
    "C++": "#f34b7d",
    C: "#555555",
    "C#": "#178600",
    Ruby: "#701516",
    Go: "#00ADD8",
    PHP: "#4F5D95",
    Shell: "#89e051",
    Swift: "#F05138",
    Kotlin: "#A97BFF",
    Rust: "#DEA584",
    Dart: "#00B4AB",
    Vue: "#41b883",
    Svelte: "#ff3e00",
    Scala: "#c22d40",
    Lua: "#000080",
    R: "#198CE7",
    MATLAB: "#e16737",
    Jupyter: "#DA5B0B",
  };

  return colors[language] || "#8b949e";
}
