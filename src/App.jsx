import React from 'react';
import PulsePDF from './components/PulsePDF';

function App() {
  return (
    <div className="min-h-screen bg-cyberpunk text-white font- pt-10">
      <PulsePDF />
      <footer className="py-6 text-center text-red-300 text-sm">
        <p>© 2025 Softweb Elevation. All rights reserved.</p>
        <a
          href="https://github.com/kingofdead6"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 hover:text-red-500 transition-colors duration-300 cursor-pointer"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.66-.22.66-.49v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.12-1.47-1.12-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03A9.564 9.564 0 0112 6.8c.85.004 1.71.11 2.52.33 1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.16.59.67.49A10.014 10.014 0 0022 12c0-5.52-4.48-10-10-10z" />
          </svg>
        </a>
      </footer>
    </div>
  );
}

export default App;