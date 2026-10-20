import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import DashboardPage from './pages/DashboardPage';
import MistakeHistoryPage from './pages/MistakeHistoryPage';
import AddMistakePage from './pages/AddMistakePage';
import EditMistakePage from './pages/EditMistakePage';
import MistakeDetailPage from './pages/MistakeDetailPage';
import ReviewQueuePage from './pages/ReviewQueuePage';
import AnalyticsPage from './pages/AnalyticsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import LearnLandingPage from './pages/learn/LearnLandingPage';
import LearnTopicPage from './pages/learn/LearnTopicPage';
import ProtectedRoute from './components/ProtectedRoute';
import PublicOnlyRoute from './components/PublicOnlyRoute';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public only routes: redirected to home if already authenticated */}
              <Route element={<PublicOnlyRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>

              {/* Protected application routes: guarded by authentication */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<DashboardPage />} />
                  <Route path="mistakes" element={<MistakeHistoryPage />} />
                  <Route path="mistakes/new" element={<AddMistakePage />} />
                  <Route path="mistakes/:id" element={<MistakeDetailPage />} />
                  <Route path="mistakes/:id/edit" element={<EditMistakePage />} />
                  <Route path="reviews" element={<ReviewQueuePage />} />
                  <Route path="analytics" element={<AnalyticsPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  
                  {/* Learn DSA Educational Routes */}
                  <Route path="learn" element={<LearnLandingPage />} />
                  <Route path="learn/:topicSlug" element={<LearnTopicPage />} />
                  <Route path="learn/:topicSlug/:lessonSlug" element={<LearnTopicPage />} />
                </Route>
              </Route>

              {/* 404 Not Found fallback */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
