import { useRef } from 'react';
import { TerminalLineData } from '../Terminal';

type Props = Pick<TerminalLineData, 'command' | 'route'> & {
    route: string;
    onEnter(command: string): void;
    command?: string;
};
export const TerminalLine = ({ onEnter, route, command = 'Hello' }: Props) => {
    const isDisabled = !command;
    const spanRef = useRef<HTMLSpanElement | null>(null);
    const handleKeyUp = (e: React.KeyboardEvent<HTMLSpanElement>) => {
        if (e.key !== 'Enter') return;
        onEnter(spanRef.current?.textContent ?? '');
    };

    return (
        <div>
            <span>{route}</span>
            <span>{'>'}</span>
            <span contentEditable="true" onKeyUp={handleKeyUp} ref={spanRef}>
                {command}
            </span>
        </div>
    );
};
