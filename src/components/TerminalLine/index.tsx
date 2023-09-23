import { useEffect, useRef, useState } from 'react';
import { TerminalLineData } from '../Terminal';
import { cn } from '../../utils/cn';
import { nanoid } from 'nanoid/non-secure';
import { deepCopy } from '../../utils/deepCopy';
import { useEffectOnce } from 'react-use';

type Props = Pick<TerminalLineData, 'route' | 'commandResponse'> & {
    onEnter(command: string): void;
    readonly?: boolean;
};
type CommandKeyElement = {
    key: string;
    character: string;
};
export const TerminalLine = ({ onEnter, route, commandResponse, readonly }: Props) => {
    const spanRef = useRef<HTMLSpanElement | null>(null);
    const [command, setCommand] = useState<CommandKeyElement[]>([]);
    const [cursorPositionKey, setCursorPositionKey] = useState<string | null>(null);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
        console.log(e);

        if (e.key === 'Backspace') {
            setCommand((old) => [...old].filter((c) => c.key !== cursorPositionKey));
            if (cursorPositionKey) setCursorPositionKey(command[command.findIndex((c) => c.key === cursorPositionKey) - 1].key);
            return;
        }
        if (e.key === 'Enter') {
            onEnter(comppressCommandToString());
            return;
        }

        const handled = handleMoveCursor(e.key);
        if (handled) return;

        const newKey = nanoid();
        setCursorPositionKey(newKey);
        setCommand((old) => {
            const indexToInsert = old.findIndex(({ key }) => key === cursorPositionKey) + 1;
            const newElement: CommandKeyElement = { character: e.key, key: newKey };
            const newCommand = [...old.slice(0, indexToInsert), newElement, ...old.slice(indexToInsert)];
            return newCommand;
        });
    };

    function handleMoveCursor(move: string): boolean {
        const currentElementIndex = command.findIndex((c) => c.key === cursorPositionKey);
        if (move === 'ArrowLeft') {
            if (cursorPositionKey === null) return true;
            setCursorPositionKey(currentElementIndex ? command[currentElementIndex - 1].key : null);
            return true;
        }
        if (move === 'ArrowRight') {
            if ((cursorPositionKey === null && command.length === 0) || currentElementIndex == command.length - 1) return true;
            if (cursorPositionKey === null) {
                setCursorPositionKey(command[0].key);
                return true;
            }
            setCursorPositionKey(command[currentElementIndex + 1].key);
            return true;
        }
        return false;
    }

    function comppressCommandToString() {
        return command.map((c) => c.character).join();
    }

    useEffect(() => {
        if (readonly && spanRef.current) spanRef.current.onkeydown = null;
    }, [readonly]);

    useEffectOnce(() => {
        if (!spanRef.current) return;
        spanRef.current.focus();
    });

    return (
        <>
            <div className="w-full flex">
                <span>{route}</span>
                <span>{'>'}</span>
                <span onKeyDown={handleKeyDown} ref={spanRef} className="grow outline-0 relative" tabIndex={-1} autoFocus>
                    <span
                        className={cn('absolute left-0 w-[1ch] h-full bg-neutral-200', {
                            'opacity-0': cursorPositionKey !== null,
                        })}
                    ></span>
                    {command.map(({ character, key }) => (
                        <span key={key} className="w-[1ch]">
                            {character}
                        </span>
                    ))}
                </span>
            </div>
            {commandResponse && (
                <div className="w-full">
                    {commandResponse.map((text) => (
                        <div>{text}</div>
                    ))}
                </div>
            )}
        </>
    );
};
