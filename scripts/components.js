function createTerminalLine(pathText, text) {
  const main = document.createElement("terminal-line");
  const path = document.createElement("terminal-line-path");
  const input = document.createElement("p");
  input.setAttribute("spellcheck", "false");
  input.classList.add("terminal-input");
  input.classList.add("writable");

  path.textContent = pathText;
  input.textContent = text;

  main.append(path);
  main.append(input);

  return main;
}

export { createTerminalLine };
