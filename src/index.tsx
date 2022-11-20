import * as ReactDOMClient from 'react-dom/client';

import './index.css';
import { interceptRequestsOnMock } from './api/mock-interceptor';
import { App } from './App';
import { USE_MOCK_DATA } from './constants';

if (USE_MOCK_DATA) {
  interceptRequestsOnMock();
}

const root = ReactDOMClient.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
