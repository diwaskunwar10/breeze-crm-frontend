
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { AppProvider } from './context/AppContext';
import Routes from './routes/routes';
import { Toaster } from 'sonner';
import { BrowserRouter } from 'react-router-dom';
import AppModal from './components/AppModal';
import { validateAuthState, checkAuthState } from '@/features/authSlice';
import './index.css';

// Dispatch the validateAuthState action when the app starts
store.dispatch(validateAuthState());

const App = () => {
  return (
    <Provider store={store}>
      <AppProvider>
        <BrowserRouter>
          <AuthStateValidator />
          <Routes />
          <Toaster position="top-right" />
          <AppModal />
        </BrowserRouter>
      </AppProvider>
    </Provider>
  );
};

// Component to periodically check auth state
const AuthStateValidator = () => {
  useEffect(() => {
    // Check auth state when component mounts
    store.dispatch(checkAuthState());

    // Set up interval to check auth state periodically
    const interval = setInterval(() => {
      store.dispatch(checkAuthState());
    }, 60000); // Check every minute

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, []);

  return null; // This component doesn't render anything
};

export default App;
