import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './App';
import { USE_MOCK_DATA } from './constants';
import { interceptRequestsOnMock } from './api/mock-interceptor';

if (USE_MOCK_DATA) {
  interceptRequestsOnMock();
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
