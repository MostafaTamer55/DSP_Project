import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './features/auth/context/AuthContext';
import { CourseProvider } from './features/courses/context/CourseContext';
import { SubjectProvider } from './context/SubjectContext';
import AppRoutes from './routes/AppRoutes';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error Caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8FAF5] flex items-center justify-center p-6 text-center text-[#15313C]">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-red-100 max-w-md w-full">
            <h2 className="text-xl font-bold mb-2 text-red-600">Something went wrong</h2>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              {this.state.error?.message || 'An unexpected rendering error occurred.'}
            </p>
            <button
              onClick={() => {
                localStorage.removeItem('dsp_selected_course');
                window.location.href = '/dashboard';
              }}
              className="px-5 py-2.5 rounded-full bg-[#15313C] text-[#CCEB74] text-xs font-bold shadow-md hover:bg-[#1f424f] transition-all cursor-pointer"
            >
              Reload Dashboard
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <CourseProvider>
            <SubjectProvider>
              <AppRoutes />
            </SubjectProvider>
          </CourseProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
