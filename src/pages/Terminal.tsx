import { makeStyles } from '@mui/styles';
import { SyntheticEvent, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { handleKeyDown } from '../shared/helpers/handleKeyDown';
import { addTextWithAtIndex, getTextWithRemovedIndex } from '../shared/helpers/stringManipulators';
import { InputData } from '../shared/models/InputData';

export const Terminal = () => {
    const { terminalRoot, command, cursor } = useStyles();
    const [currentRoute, setCurrentRoute] = useState('D:/Sebas>');
    const [{ selectedIndex, text }, setTextData] = useState<InputData>({ selectedIndex: 0, text: '' });

    const textRef = useRef(text);
    const routeTextRef = useRef(currentRoute);

    const commandContainerRef = useRef<HTMLDivElement | null>(null);
    const cursorRef = useRef<HTMLSpanElement | null>(null);

    useEffect(() => {
        if (!cursorRef.current || !commandContainerRef.current) return;
        if (selectedIndex == null) {
            cursorRef.current.style.visibility = 'hidden';
            return;
        }
        const routeLength = currentRoute.length;
        const childIndex = routeLength + selectedIndex - 1;

        const lastElement = commandContainerRef.current.children[childIndex];
        const { offsetTop, offsetHeight, offsetLeft, offsetWidth } = lastElement as HTMLElement;

        cursorRef.current.style.display = 'visible';
        cursorRef.current.style.top = `${offsetTop + offsetHeight}px`;
        cursorRef.current.style.left = `${offsetLeft + offsetWidth}px`;
    }, [selectedIndex]);

    useEffect(() => {
        textRef.current = text;
    }, [text]);

    useEffect(() => {
        routeTextRef.current = currentRoute;
    }, [currentRoute]);

    function listener(e) {
        handleKeyDown(setTextData, { setCurrentRoute, text: textRef.current, route: routeTextRef.current })(e);
    }

    useEffect(() => {
        //handle key here + change title
        document.addEventListener('keydown', listener);
        return () => {
            document.removeEventListener('keydown', listener);
        };
    }, []);

    return (
        <section className={terminalRoot}>
            <div className={command} ref={commandContainerRef}>
                {(currentRoute + text).split('').map((character, idx) => (
                    <pre key={idx}>{character}</pre>
                ))}
                <span className={cursor} ref={cursorRef}></span>
            </div>
        </section>
    );
};

const useStyles = makeStyles({
    terminalRoot: {
        height: '100vh',
        width: '100vw',
        overflow: 'clip auto',
        display: 'flex',
        flexDirection: 'column',
        '&>div': {
            display: 'flex',
            flexWrap: 'wrap',
        },
    },
    command: {
        position: 'relative',
    },
    cursor: {
        position: 'absolute',
        background: 'hsla(0, 0%, 80%, 0.9)',
        width: '12px',
        height: '4px',
        transform: 'translateY(-4px)',
    },
});
