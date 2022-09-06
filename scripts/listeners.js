import { createTerminalLine } from './components.js'

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
    let position = { pageY: input.pageY, pageX: input.pageX }
    input.addEventListener('keydown', listenerFn)
    function listenerFn(e) {
        const key = e.key
        // console.log(e)
        let [left, cursor, right] = input.children
        switch (key) {
            case 'ArrowLeft':
                if (!left) break
                right = `${left.slice(-1)}${right}`
                left = left.slice(0, -1)
                input.children = [left, cursor, right]
                break
            case 'ArrowRight':
                if (!right) break
                left = `${left}${right.slice(0, 1)}`
                right = right.slice(1)
                input.children = [left, cursor, right]
                break
            case 'Enter':
                input.parentElement.setAttribute('readonly', '')
                input.removeEventListener('keydown', listenerFn)
                input.blur()
                createTerminalLine('D:\\New line')
                break
            default:
                break
        }
    }
}

export { addGlobalListeners, addListenersForInput }
