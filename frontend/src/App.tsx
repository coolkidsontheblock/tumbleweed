import { Route, Routes } from 'react-router-dom';
import { Home } from './components/Home';
import { Sources } from './components/Sources'
import { Consumers } from './components/Consumers';
import { Topics } from './components/Topics'
import { Sidebar } from './components/Sidebar';
import { ErrorBoundary } from 'react-error-boundary';
import { Error } from './components/Error';

function App() {
  return (
    <>
      <ErrorBoundary fallback={<Error />}>
        <Sidebar />
        <div className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sources" element={<Sources />} />
            <Route path="/consumers" element={<Consumers />} />
            <Route path="/topics" element={<Topics />} />
            <Route path='*' element={<Error />} />
          </Routes>
        </div>
      </ErrorBoundary>
    </>
  )
}

export default App
