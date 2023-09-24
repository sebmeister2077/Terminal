import { TerminalLine } from '../TerminalLine';
import { useRef, useState } from 'react';
import { deepCopy } from '../../utils/deepCopy';
import { nanoid } from 'nanoid';
import { executeCommand } from '../../utils/handleCommand';
import { Keyable } from '../../models/Keyable';

export type TerminalLineData = Keyable & {
    route: string;
    command?: string;
    commandResponse?: (Keyable & { message: string })[];
    readonly?: boolean;
};

export const Terminal = () => {
    const [terminalItems, setTerminalItems] = useState<TerminalLineData[]>([{ route: 'C:/Seba/documents', key: nanoid() }]);
    const isExecuting = useRef<boolean>(false);

    const handleCommand = async (command: string) => {
        if (isExecuting.current) return;
        try {
            isExecuting.current = true;
            const newItems = deepCopy(terminalItems);
            const lastItem = newItems.at(-1);
            if (!lastItem) return;

            //EXECUTE COMMAND
            const { newRoute, messages: outputData } = await executeCommand(lastItem.route, command);

            lastItem.command = command;
            lastItem.commandResponse = outputData.filter((msg) => !!msg).map((msg) => ({ key: nanoid(), message: msg }));
            lastItem.readonly = true;

            newItems.push({
                key: nanoid(),
                route: newRoute,
            });
            setTerminalItems(newItems);
        } finally {
            isExecuting.current = false;
        }
    };

    const handleNavigateCommand = (type: 'up' | 'down'): string | null => {
        console.log(type);
        return null;
    };

    return (
        <section className="select-none">
            <div>
                {navigator.platform ?? 'Terminal'} [Version 127.0.0.1]
                <br />
                (c) Terminal Corporation. All rights reserved.
                <div className="h-4"></div>
            </div>
            {terminalItems.map((item) => (
                <TerminalLine
                    {...item}
                    onEnter={handleCommand}
                    key={`terminal-item-${item.key}`}
                    onNavigateCommand={handleNavigateCommand}
                />
            ))}
        </section>
    );
};
