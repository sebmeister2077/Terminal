import { Dispatch, SetStateAction } from 'react';
import { InputData } from '../models/InputData';
import { addTextWithAtIndex, getTextWithRemovedIndex } from './stringManipulators';

export const handleKeyDown = (
    setTextData: Dispatch<SetStateAction<InputData>>,
    other: { setCurrentRoute: Dispatch<SetStateAction<string>>; text: string; route: string }
) =>
    function (e: KeyboardEvent) {
        const { key, ctrlKey, shiftKey } = e;

        const ignores = ['Shift', 'Control'];
        if (ignores.includes(key)) return;

        let addedText = key;

        const functionRegex = /^F[\d]{1,2}$/;
        if (functionRegex.test(key)) return;
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
                return;
        }

        setTextData(({ text, selectedIndex }) => ({
            text: addTextWithAtIndex(text, selectedIndex ?? text.length, addedText),
            selectedIndex: (selectedIndex ?? text.length) + addedText.length,
        }));
    };
