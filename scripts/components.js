import { addListenersForInput } from './listeners.js'

function createTerminalLine(pathText = 'C:\\Users', text = 'Some text') {
    const main = document.createElement('terminal-line')
    const path = document.createElement('terminal-line-path')
    const input = document.createElement('p')
    const cursor = document.createElement('span')

    input.setAttribute('spellcheck', 'false')
    input.classList.add('terminal-input')
    cursor.classList.add('text-cursor')

    path.innerText = pathText

    main.append(path)
    main.append(input)

    if (text) input.append(text)
    // input.append(cursor)
    // input.append(' ') //TODO issue here
    document.body.append(main)

    input.focus()

    addListenersForInput(input)
}

export { createTerminalLine }
