
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { AppProvider } from './context/AppContext';
import Routes from './routes/routes';
import { Toaster } from 'sonner';
import { BrowserRouter } from 'react-router-dom';
import AppModal from './components/AppModal';
import './index.css';

const App = () => {
  return (
    <Provider store={store}>
      <AppProvider>
        <BrowserRouter>
          <Routes />
          <Toaster position="top-right" />
          <AppModal />
        </BrowserRouter>
      </AppProvider>
    </Provider>
  );
};

export default App;
