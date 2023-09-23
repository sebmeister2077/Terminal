import { useToggle } from 'react-use'
import { Terminal } from './components/Terminal';
import { configureFS } from './utils/configureFs';
import { useEffectWithAbort } from './hooks/useEffectWithAbort';

function App() {
  const [isInitialized, toggleIsInitialized] = useToggle(false);
  
  useEffectWithAbort((signal) => {
    configureFS().then(() => {
      if (signal.aborted) return;
      toggleIsInitialized();
    })
  }, [])
  

  return (
    <main className='h-screen w-screen'>
      {isInitialized && <Terminal/>}
    </main>
  )
}

export default App
