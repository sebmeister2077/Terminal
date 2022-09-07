import { handleCommand } from './commands.js'
import { initializeCarretSymbols } from './seeds/carretSymbols.js'

function addGlobalListeners() {
    addEventListener('keyup', (e) => {
        document.head.querySelector('title').textContent = 'Terminal'
    })

    addEventListener('mousedown', (e) => {
        const selection = getSelection()
        if (selection.isCollapsed) return
        document.head.querySelector('title').textContent = 'Select Terminal'
    })
}

function addListenersForInput(_input) {
    const input = _input
    const amountOfSpaces = input.dataset['spaces']

    const carretSymbols = initializeCarretSymbols()
    let cursorPosition = input.textContent.length
    const prevSelection = {
        beg: cursorPosition,
        end: cursorPosition,
        isCollapsed() {
            return this.beg === this.end
        },
    }

    function listenForKey(e) {
        console.log('key')
        const key = e.key
        const textCursorIndex = e.target.selectionStart
        const currentSelection = { beg: e.target.selectionStart, end: e.target.selectionEnd }

        switch (key) {
            case 'ArrowLeft':
                if (textCursorIndex > amountOfSpaces) {
                    cursorPosition--
                    prevSelection.beg = cursorPosition
                    prevSelection.end = cursorPosition
                    return
                }
                input.setSelectionRange(cursorPosition + 1, cursorPosition + 1)
                break
            case 'ArrowRight':
                if (cursorPosition >= input.textLength) return
                cursorPosition++
                prevSelection.beg = cursorPosition
                prevSelection.end = cursorPosition

                break
            case 'Enter':
                input.parentElement.setAttribute('readonly', '')
                input.removeEventListener('keydown', listenForKey)
                input.removeEventListener('click', listenForClick)
                input.blur()
                handleCommand(input.parentElement)
                break
            default:
                //allow selection, but now overriding selection text
                if (!prevSelection.isCollapsed()) {
                    e.preventDefault()
                    input.textContent = `${input.textContent.slice(0, cursorPosition)}${key}${input.textContent.slice(cursorPosition)}`
                    cursorPosition++
                    prevSelection.beg = cursorPosition
                    prevSelection.end = cursorPosition
                    input.setSelectionRange(cursorPosition, cursorPosition)
                    return
                }

                const keyDoesNothing = e.ctrlKey && carretSymbols.includes(key.toLowerCase())
                if (keyDoesNothing) {
                    input.textContent = `${input.textContent.slice(0, cursorPosition)}^${key.toUpperCase()}${input.textContent.slice(
                        cursorPosition
                    )}`
                    cursorPosition += 2
                    prevSelection.beg = cursorPosition
                    prevSelection.end = cursorPosition
                    input.setSelectionRange(cursorPosition, cursorPosition)
                    e.preventDefault()
                    return
                }
                break
        }
    }

    function listenForClick(e) {
        e.preventDefault()
        const textCursorIndex = e.target.selectionStart
        const isCollapsed = e.target.selectionEnd === textCursorIndex
        if (textCursorIndex !== cursorPosition && isCollapsed) input.setSelectionRange(cursorPosition, cursorPosition)
    }
    function listenForSelect(e) {
        prevSelection.beg = e.target.selectionStart
        prevSelection.end = e.target.selectionEnd
    }

    input.addEventListener('select', listenForSelect)
    input.addEventListener('keydown', listenForKey)
    input.addEventListener('click', listenForClick)
}

export { addGlobalListeners, addListenersForInput }
