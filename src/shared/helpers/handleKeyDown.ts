import { Dispatch, RefObject, SetStateAction } from 'react';
import { InputData, TerminalHistory } from '../models/InputData';
import { sendApiRequest } from './sendApiRequest';
import { addTextWithAtIndex, getTextWithRemovedIndex } from './stringManipulators';

type ExtraProps = {
    setCurrentRoute: Dispatch<SetStateAction<string>>;
    text: string;
    route: string;
    mode: 'command' | 'javascript';
    frameRef: RefObject<HTMLIFrameElement>;
    setMode: Dispatch<SetStateAction<'command' | 'javascript'>>;
    setTerminalHistory: Dispatch<SetStateAction<TerminalHistory>>;
};

export const handleKeyDown = (
    setTextData: Dispatch<SetStateAction<InputData>>,
    { mode, route, setCurrentRoute, setMode, text, frameRef, setTerminalHistory }: ExtraProps
) =>
    function (e: KeyboardEvent) {
        const { key, ctrlKey, shiftKey, code } = e;

        const ignores = ['Shift', 'Control'];
        if (ignores.includes(key)) return;

        let addedText = key;

        const functionRegex = /^F[\d]{1,2}$/;
        if (functionRegex.test(key)) return;
        if (code == 'Quote' && shiftKey) addedText = '"';
        if (code == 'Quote' && !shiftKey) addedText = "'";
        switch (key) {
            case 'ArrowLeft':
                setTextData((t) => ({ ...t, selectedIndex: Math.max((t.selectedIndex ?? 0) - 1, 0) }));
                return;
            case 'ArrowRight':
                setTextData((t) => ({ ...t, selectedIndex: Math.min((t.selectedIndex ?? 0) + 1, t.text.length) }));
                return;
            case 'Home':
                setTextData((t) => ({ ...t, selectedIndex: 0 }));
                return;
            case 'End':
                setTextData((t) => ({ ...t, selectedIndex: t.text.length }));
                return;
            case 'Backspace':
                setTextData(({ selectedIndex, text }) => ({
                    text: getTextWithRemovedIndex(text, selectedIndex ?? text.length),
                    selectedIndex: Math.max((selectedIndex ?? text.length) - 1, 0),
                }));
                return;

            case 'Delete':
            case 'Insert':

            case 'Pause':
            case 'ArrowUp':
            case 'ArrowDown':
            case 'AltGraph':
            case 'Meta':
            case 'CapsLock':
            case 'Tab':
            case 'Escape':
                return;
            case 'Enter':
                const changeModeregex = /^mode (?:js|cmd)$/;
                if (changeModeregex.test(text)) {
                    if (text.includes('js')) setMode('javascript');
                    else setMode('command');
                    return;
                }
                if (mode == 'javascript') {
                    if (!frameRef.current) return;
                    const { contentWindow } = frameRef.current;
                    if (!contentWindow) return;

                    setTextData({ text: '', selectedIndex: 0 });
                    try {
                        contentWindow['eval'](text);
                    } catch (e: any) {
                        setTerminalHistory((old) => [...old, route + text, e.message]);
                        return;
                    }
                    setTerminalHistory((old) => [...old, route + text]);
                    return;
                }
                if (mode == 'command') {
                    sendApiRequest(text).then(({ route: newRoute, response }) => {
                        if (response) setTerminalHistory((old) => [...old, route + text, response]);
                        else setTerminalHistory((old) => [...old, route + text]);

                        setCurrentRoute(newRoute);
                        setTextData({ selectedIndex: 0, text: '' });
                    });
                }

                return;

            case 'a':
                if (ctrlKey) return;
                break;
        }

        setTextData(({ text, selectedIndex }) => ({
            text: addTextWithAtIndex(text, selectedIndex ?? text.length, addedText),
            selectedIndex: (selectedIndex ?? text.length) + addedText.length,
        }));
    };
