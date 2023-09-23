import { useQueue, useStateList } from 'react-use';
import { TerminalLine } from '../TerminalLine';
import { useRef, useState } from 'react';
import { deepCopy } from '../../utils/deepCopy';
import { nanoid } from 'nanoid';

export type TerminalLineData = {
    route: string;
    command?: string;
    id: string;
};

export const Terminal = () => {
    const [terminalItems, setTerminalItems] = useState<TerminalLineData[]>([{ route: 'C:/', id: nanoid() }]);
    const isExecuting = useRef<boolean>(false);

    const handleCommand = (command: string) => {
        if (isExecuting.current) return;
        try {
            isExecuting.current = true;
            //EXECUTE COMMAND

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
        <section>
            <div>
                Microsoft Windows [Version 10.0.19045.3448]
                <br></br>
                (c) Microsoft Corporation. All rights reserved.
            </div>
            {terminalItems.map((item) => (
                <TerminalLine {...item} onEnter={handleCommand} key={`terminal-item-${item.id}`} />
            ))}
        </section>
    );
};
