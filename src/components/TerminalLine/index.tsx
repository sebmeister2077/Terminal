import { useEffect, useRef, useState } from 'react';
import { type TerminalLineData } from '../Terminal';
import { cn } from '../../utils/cn';
import { nanoid } from 'nanoid/non-secure';
import { useEffectOnce } from 'react-use';
import styles from './index.module.css';

type Props = Pick<TerminalLineData, 'route' | 'commandResponse'> & {
    onEnter(command: string): void;
    readonly?: boolean;
    onNavigateCommand(type: 'up' | 'down'): string | null;
};
type CommandKeyElement = {
    key: string;
    character: string;
    previousKey: string | null;
};
export const TerminalLine = ({ onEnter, route, commandResponse, readonly, onNavigateCommand }: Props) => {
    const spanRef = useRef<HTMLSpanElement | null>(null);
    const [command, setCommand] = useState<CommandKeyElement[]>([]);
    const [cursorPositionKey, setCursorPositionKey] = useState<string | null>(null);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
        if (readonly) return;
        // console.log(e);

        if (e.key === 'Backspace') {
            if (cursorPositionKey === null) return;
            setCommand((old) => {
                const currentIndex = old.findIndex(({ key }) => key === cursorPositionKey);
                const newCommand = [...old].filter((c) => c.key !== cursorPositionKey);
                if (currentIndex < old.length - 1) newCommand[currentIndex].previousKey = newCommand[currentIndex - 1].key;
                return newCommand;
            });
            if (cursorPositionKey) setCursorPositionKey(command[command.findIndex((c) => c.key === cursorPositionKey) - 1]?.key ?? null);
            return;
        }
        if (e.key === 'Delete') {
            if (cursorPositionKey === null && command.length === 0) return;
            const toDeleteIndex = command.findIndex(({ previousKey }) => previousKey === cursorPositionKey);
            if (toDeleteIndex === -1) return; //skip render
            const newCommand = [...command].filter((c) => c.previousKey !== cursorPositionKey);
            if (toDeleteIndex < command.length - 1) newCommand[toDeleteIndex].previousKey = cursorPositionKey;
            setCommand(newCommand);
        }
        if (e.key === 'Enter') {
            onEnter(comppressCommandToString());
            return;
        }

        const handled = handleMoveCursor(e.key);
        if (handled) return;

        //probably some combination of keys
        if (e.key.length > 1) return;

        const newKey = nanoid();
        setCursorPositionKey(newKey);
        setCommand((old) => {
            const indexToInsert = old.findIndex(({ key }) => key === cursorPositionKey) + 1;
            const previousKey = indexToInsert ? old[indexToInsert - 1].key : null;
            const newElement: CommandKeyElement = { character: e.key, key: newKey, previousKey };
            const newCommand = [...old.slice(0, indexToInsert), newElement, ...old.slice(indexToInsert)];
            const elementAfter = newCommand.at(indexToInsert + 1);
            if (elementAfter) elementAfter.previousKey = newKey;
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
            setCursorPositionKey(command[currentElementIndex + 1]?.key ?? null);
            return true;
        }
        if (move === 'ArrowUp') {
            onNavigateCommand('up');
            return true;
        }
        if (move === 'ArrowDown') {
            onNavigateCommand('down');
            return true;
        }
        return false;
    }

    function comppressCommandToString() {
        return command.map((c) => c.character).join('');
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
            <div
                className={cn('w-full flex   items-start', {
                    'min-h-[32rem]': !readonly,
                })}
                onClick={() => spanRef.current?.focus()}
            >
                <span>{route}</span>
                <span>{'>'}</span>
                <span onKeyDown={handleKeyDown} ref={spanRef} className="grow outline-0 relative flex min-h-[24px]" tabIndex={-1} autoFocus>
                    <div
                        className={cn(styles.character, 'bg-neutral-200 hidden', {
                            [styles.blink]: !(cursorPositionKey !== null || command.length || readonly),
                        })}
                    ></div>
                    {command.map(({ character, key, previousKey }) => (
                        <div
                            key={key}
                            className={cn(styles.character, {
                                [styles.blink]: cursorPositionKey === previousKey && !readonly,
                            })}
                        >
                            {character}
                        </div>
                    ))}
                    <div
                        className={cn(styles.character, 'bg-neutral-200 opacity-0', {
                            [styles.blink]: !(cursorPositionKey !== command.at(-1)?.key || readonly),
                        })}
                    ></div>
                </span>
            </div>
            {commandResponse && (
                <div className="w-full">
                    {commandResponse.map(({ key, message }) => (
                        <div key={key}>{message}</div>
                    ))}
                </div>
            )}
        </>
    );
};
