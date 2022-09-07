import { createTerminalLine } from './components.js'

//TODO use api for commands so easter eggs wont be found
const previousCommands = []
export const handleCommand = (mainEl) => {
    const path = mainEl.querySelector('.line-path').textContent.replace('>', '')
    const command = mainEl.querySelector('.terminal-input').textContent.trim()

    previousCommands.push(command)
    console.log(path)
    console.log(command)

    window.requestIdleCallback(() => createTerminalLine('D:\\New line'))
}
