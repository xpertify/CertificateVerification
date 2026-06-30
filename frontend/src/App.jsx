import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Layout from './components/layout/Layout.jsx';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';
import LoadingSpinner from './components/ui/LoadingSpinner.jsx';

const Landing = lazy(() => import('./pages/Landing.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Verify = lazy(() => import('./pages/Verify.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const IssueCertificate = lazy(() => import('./pages/IssueCertificate.jsx'));
const Institutions = lazy(() => import('./pages/Institutions.jsx'));

function PageLoader() {
  return (
    <div className="flex justify-center items-center py-24">
      <LoadingSpinner size="lg" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Suspense fallback={<PageLoader />}><Landing /></Suspense>} />
            <Route path="/login" element={<Suspense fallback={<PageLoader />}><Login /></Suspense>} />
            <Route path="/verify" element={<Suspense fallback={<PageLoader />}><Verify /></Suspense>} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<PageLoader />}><Dashboard /></Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/issue"
              element={
                <ProtectedRoute role="institution">
                  <Suspense fallback={<PageLoader />}><IssueCertificate /></Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/institutions"
              element={
                <ProtectedRoute role="admin">
                  <Suspense fallback={<PageLoader />}><Institutions /></Suspense>
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
