import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'
import { applyTheme, getStoredTheme } from './utils/theme'

applyTheme(getStoredTheme())

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <App />
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: 'var(--color-surface)',
                        color: 'var(--color-text)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontFamily: 'Inter, sans-serif',
                    },
                    success: {
                        iconTheme: {
                            primary: 'var(--color-green)',
                            secondary: 'var(--color-surface)',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: 'var(--color-red)',
                            secondary: 'var(--color-surface)',
                        },
                    },
                }}
            />
        </BrowserRouter>
    </StrictMode>
)