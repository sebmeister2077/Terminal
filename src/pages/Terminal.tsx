import { makeStyles } from '@mui/styles';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { handleKeyDown } from '../shared/helpers/handleKeyDown';
import { getItem, removeItems, setItem } from '../shared/helpers/localstorageHandler';
import { InputData } from '../shared/models/InputData';

const initialText =
    '' ??
    ` a = document.createElement('a');
a.text = "Hello";
a.setAttribute('href','ok');
document.body.append(a);`;

export const Terminal = () => {
    const [terminalHistory, setTerminalHistory] = useState<string[]>([]);
    const [currentRoute, setCurrentRoute] = useState('D:/Sebas>');
    const [{ selectedIndex, text }, setTextData] = useState<InputData>({
        selectedIndex: initialText.length,
        text: initialText,
    });
    const location = useLocation();

    const commandContainerRef = useRef<HTMLDivElement | null>(null);
    const cursorRef = useRef<HTMLSpanElement | null>(null);

    const [mode, setMode] = useState<'command' | 'javascript'>('javascript');
    const frameRef = useRef<HTMLIFrameElement>(null);
    const isBasePage = !location.pathname.endsWith('/blank');
    const showIframe = isBasePage && mode == 'javascript';

    const textRef = useRef(text);
    const routeTextRef = useRef(currentRoute);
    const modeRef = useRef(mode);

    const { terminalRoot, command, cursor, routeText, commandHistory, reminder } = useStyles({ showIframe });

    useEffect(() => {
        if (!cursorRef.current || !commandContainerRef.current) return;
        if (selectedIndex == null) {
            cursorRef.current.style.visibility = 'hidden';
            return;
        }
        const routeLength = currentRoute.length;
        const childIndex = routeLength + selectedIndex - 1;

        const lastElement = commandContainerRef.current.children[childIndex] as HTMLElement;
        const { offsetTop, offsetHeight, offsetLeft, offsetWidth } = lastElement;

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

    useEffect(() => {
        modeRef.current = mode;
    }, [mode]);

    function keyListener(e) {
        document.title = String.raw`C:\WINDOWS\System32\cmd.exe`;
        handleKeyDown(setTextData, {
            setCurrentRoute,
            text: textRef.current,
            route: routeTextRef.current,
            setMode,
            mode: modeRef.current,
            frameRef,
            setTerminalHistory,
        })(e);
    }

    function clickListener() {
        document.title = String.raw`Select C:\WINDOWS\System32\cmd.exe`;
    }
    function unloadListener() {
        const shouldSave = getItem('save') === 'true';

        if (shouldSave) {
            setItem({ name: 'currentRoute', value: currentRoute });
            setItem({ name: 'history', value: terminalHistory.join('MyDelimiterOk') });
        } else {
            removeItems(['currentRoute', 'history']);
        }
    }

    useEffect(() => {
        document.addEventListener('click', clickListener);
        document.addEventListener('keydown', keyListener);
        window.addEventListener('unload', unloadListener);
        return () => {
            document.removeEventListener('click', clickListener);
            document.removeEventListener('keydown', keyListener);
            window.removeEventListener('unload', unloadListener);
        };
    }, []);

    return (
        <>
            <section className={terminalRoot}>
                {terminalHistory.map((message) => (
                    <pre className={commandHistory} key={`history-${message}`}>
                        {message}
                    </pre>
                ))}
                <div className={command} ref={commandContainerRef}>
                    {currentRoute.split('').map((char, idx) => (
                        <pre className={routeText} key={`route-txt-${idx}`}>
                            {char}
                        </pre>
                    ))}
                    {text.split('').map((char, idx) => (
                        <pre key={`text-${idx}`}>{char}</pre>
                    ))}
                    <span className={cursor} ref={cursorRef}></span>
                </div>
            </section>
            {showIframe && (
                <>
                    {/* @ts-ignore */}
                    <marquee className={reminder}>Use terminal to write JavaScript</marquee>
                    <iframe src={window.location.origin + '/blank'} data-iframe ref={frameRef}></iframe>
                </>
            )}
        </>
    );
};

type StyleProps = {
    showIframe: boolean;
};
const useStyles = makeStyles({
    terminalRoot: ({ showIframe }: StyleProps) => ({
        height: '100vh',
        width: showIframe ? '50%' : '100%',
        overflow: 'clip auto',
        display: 'flex',
        flexDirection: 'column',
        '&>div': {
            display: 'flex',
            flexWrap: 'wrap',
        },
    }),
    commandHistory: {},
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
    routeText: {
        userSelect: 'none',
    },
    reminder: {
        position: 'fixed',
        top: '0px',
        right: '0px',
    },
});
