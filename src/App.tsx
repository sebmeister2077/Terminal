import { useEffectOnce } from 'react-use';
import { Terminal } from './components/Terminal';
import { configureFS } from './utils/configureFs';

function App() {
    useEffectOnce(() => {
        configureFS();
    });

    return (
        <main className="h-screen w-screen p-8 bg-zinc-900 text-neutral-200 overflow-auto scroll-smooth">
            <Terminal />
        </main>
    );
}

export default App;
