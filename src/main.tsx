import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/index.css';
import App from '@/App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { TooltipProvider } from './components/ui/tooltip.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <App />
          <Toaster position='top-right' />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </StrictMode>,
);
