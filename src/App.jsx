import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './features/auth/context/AuthContext';
import { SubjectProvider } from './context/SubjectContext';
import AppRoutes from './routes/AppRoutes';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SubjectProvider>
          <AppRoutes />
        </SubjectProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
