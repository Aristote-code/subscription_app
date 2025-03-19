'use client';

import dynamic from 'next/dynamic';

// Dynamically import the App component with SSR disabled to avoid hydration errors
const App = dynamic(() => import('../src/App'), { ssr: false });

export default function Home() {
  return <App />;
} 