import React from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './stores/AuthStore';
import AppRoutes from './routes';

import './index.css';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <AuthProvider>
        <AppRoutes />
    </AuthProvider>
  </React.StrictMode>
);
