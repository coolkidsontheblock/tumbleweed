import { Route, Routes } from 'react-router-dom';
import { Home } from './components/Home';
import { Sources } from './components/Sources'
import { Consumers } from './components/Consumers';
import { Topics } from './components/Topics'
import { Sidebar } from './components/Sidebar';
import { ErrorBoundary } from 'react-error-boundary';
import { Loading } from './components/Loading';
import { Error } from './components/Error';
import { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { textFieldTheme } from './styles/Theme';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <ErrorBoundary fallback={<Error />}>
      <Sidebar />
      <div className="main">
        <ThemeProvider theme={textFieldTheme}>
          { loading && <Loading /> }
          <Routes>
            <Route path="/" element={<Home setLoading={setLoading} />} />
            <Route path="/sources" element={<Sources setLoading={setLoading} />} />
            <Route path="/consumers" element={<Consumers setLoading={setLoading} />} />
            <Route path="/topics" element={<Topics setLoading={setLoading} />} />
            <Route path='*' element={<Error />} />
          </Routes>
        </ ThemeProvider>
      </div>
    </ErrorBoundary>
  )
}

export default App
