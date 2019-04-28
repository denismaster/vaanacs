import React from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { AppLayout } from './layout/Layout';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppLayout></AppLayout>
    </BrowserRouter>
  );
}

export default App;
