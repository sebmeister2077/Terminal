import { addListenersForInput } from './listeners.js'

function createTerminalLine(pathText = 'C:\\Users', text = 'Some text') {
    const main = document.createElement('terminal-line')
    const path = document.createElement('span')
    const input = document.createElement('textarea')
    const cursor = document.createElement('span')

    path.classList.add('line-path')
    input.setAttribute('spellcheck', 'false')
    input.classList.add('terminal-input')
    cursor.classList.add('text-cursor')

    const newPathText = `${pathText}>`
    path.innerText = newPathText

    const neededSpaces = Array(newPathText.length * 2)
        .fill(' ')
        .join('')
    input.textContent = `${neededSpaces}${text}`
    main.append(path)
    main.append(input)
    main.append(cursor)

    // input.append(' ') //TODO issue here
    document.body.append(main)

    input.focus()

    addListenersForInput(input)
}

export { createTerminalLine }
