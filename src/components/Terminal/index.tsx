import { TerminalLine } from '../TerminalLine';
import { useRef, useState } from 'react';
import { deepCopy } from '../../utils/deepCopy';
import { nanoid } from 'nanoid';
import { executeCommand } from '../../utils/handleCommand';

export type TerminalLineData = {
    route: string;
    command?: string;
    commandResponse?: string[];
    id: string;
};

export const Terminal = () => {
    const [terminalItems, setTerminalItems] = useState<TerminalLineData[]>([{ route: 'C:/', id: nanoid() }]);
    const isExecuting = useRef<boolean>(false);

    const handleCommand = async (command: string) => {
        if (isExecuting.current) return;
        try {
            isExecuting.current = true;
            //EXECUTE COMMAND
            // const { newRoute, outputData } = await executeCommand(command);

            const newItems = deepCopy(terminalItems);
            const lastItem = newItems.at(-1);
            if (!lastItem) return;
            lastItem.command = command;
            const route = lastItem.route;

            newItems.push({
                id: nanoid(),
                route,
            });
            setTerminalItems(newItems);
        } finally {
            isExecuting.current = false;
        }
    };
    return (
        <section className="select-none">
            <div>
                Microsoft Windows [Version 10.0.19045.3448]
                <br />
                (c) Microsoft Corporation. All rights reserved.
                <div className="h-4"></div>
            </div>
            {terminalItems.map((item) => (
                <TerminalLine {...item} onEnter={handleCommand} key={`terminal-item-${item.id}`} readonly={Boolean(item.command)} />
            ))}
        </section>
    );
};
