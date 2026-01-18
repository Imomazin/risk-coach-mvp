import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import './index.css'
import App from './App.tsx'

// Synchronous theme detection BEFORE React renders (prevents flash)
;(function applyInitialTheme() {
  const theme = localStorage.getItem('lumina_r_theme')
  const root = document.documentElement

  // Clear existing theme classes
  root.classList.remove('light', 'dark', 'black')

  if (theme === 'light') {
    // Light mode: no dark class
    root.classList.add('light')
  } else if (theme === 'dark') {
    // Dark slate mode
    root.classList.add('dark')
  } else {
    // Default: black (OLED) mode - treat as dark
    root.classList.add('dark', 'black')
  }
})()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
