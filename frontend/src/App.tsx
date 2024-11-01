// import { useState } from 'react'
import { Route, Routes } from 'react-router-dom';
import { Home } from './components/Home';
import { Sources } from './components/Sources'
import { Consumers } from './components/Consumers';
import { Sidebar } from './components/Sidebar';
import { ErrorBoundary } from 'react-error-boundary';
import { Error } from './components/Error';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './styles/Theme';

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary fallback={<Error />}>
          <Sidebar />
          <div className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sources" element={<Sources />} />
            <Route path="/consumers" element={<Consumers />} />
            <Route path='*' element={<Error />} />
          </Routes>
          </div>
        </ErrorBoundary>
      </ThemeProvider>
    </>
  )
}

export default App
