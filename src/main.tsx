import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '@/store';
import { ToastProvider } from '@/toast';
import { ThemeProvider } from '@/theme';
import { LanguageProvider } from '@/language';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <AppProvider>
          <ToastProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ToastProvider>
        </AppProvider>
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>
);