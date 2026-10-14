import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import MainLayout from './layouts/MainLayout';
import DashboardPage from './pages/DashboardPage';
import MistakeHistoryPage from './pages/MistakeHistoryPage';
import AddMistakePage from './pages/AddMistakePage';
import EditMistakePage from './pages/EditMistakePage';
import MistakeDetailPage from './pages/MistakeDetailPage';
import AnalyticsPage from './pages/AnalyticsPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="mistakes" element={<MistakeHistoryPage />} />
              <Route path="mistakes/new" element={<AddMistakePage />} />
              <Route path="mistakes/:id" element={<MistakeDetailPage />} />
              <Route path="mistakes/:id/edit" element={<EditMistakePage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
