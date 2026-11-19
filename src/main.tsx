import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { App } from './App';
import './styles/index.css';

const url = import.meta.env.VITE_CONVEX_URL as string | undefined;
const root = ReactDOM.createRoot(document.getElementById('root')!);

if (!url) {
  root.render(
    <div className="p-8 font-mono text-sm text-gh-text">
      <div className="text-gh-accent font-semibold mb-2">Configuration error</div>
      <code>VITE_CONVEX_URL</code> is not set. Run <code>npx convex dev</code> (writes it to <code>.env.local</code>) and restart the dev server.
    </div>
  );
} else {
  root.render(
    <StrictMode>
      <ConvexProvider client={new ConvexReactClient(url)}>
        <App />
      </ConvexProvider>
    </StrictMode>
  );
}
