import { createTerminalLine } from "./scripts/components.js";
import { addListeners } from "./scripts/listeners.js";

addListeners();

document.body.append(createTerminalLine("C:\\Seba", "some text"));
