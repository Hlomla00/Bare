import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
import { AuthProvider, useAuthContext } from './context/AuthContext'
import type { AuthRole } from './context/AuthContext'
import { MemberApp } from './app/App'
import { PartnerApp } from './partner/App'
import { AdminApp } from './admin/App'
import { Login } from './auth/Login'
import { Signup } from './auth/Signup'
import { Onboarding } from './auth/Onboarding'
import { PartnerSignup } from './auth/PartnerSignup'
import { ForgotPassword } from './auth/ForgotPassword'
import { ToastContainer } from './components/Toast'
import './index.css'

// Register PWA service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/Bare/sw.js').catch(() => {})
  })
}

// Route guard — redirects to /auth/login when not authenticated or wrong role
function ProtectedRoute({ children, required }: { children: React.ReactNode; required: AuthRole }) {
  const { isAuthenticated, role } = useAuthContext()
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />
  if (role !== required) {
    // Redirect to their actual dashboard
    if (role === 'partner') return <Navigate to="/partner" replace />
    if (role === 'admin')   return <Navigate to="/admin" replace />
    return <Navigate to="/app" replace />
  }
  return <>{children}</>
}

// Default redirect after load — goes straight to the user's dashboard if already logged in
function RootRedirect() {
  const { isAuthenticated, role } = useAuthContext()
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />
  if (role === 'partner') return <Navigate to="/partner" replace />
  if (role === 'admin')   return <Navigate to="/admin" replace />
  return <Navigate to="/app" replace />
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter basename="/Bare" future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            {/* Auth (public) */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/auth/onboarding" element={<Onboarding />} />
            <Route path="/auth/partner-signup" element={<PartnerSignup />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            {/* Protected apps */}
            <Route path="/app/*" element={<ProtectedRoute required="member"><MemberApp /></ProtectedRoute>} />
            <Route path="/partner/*" element={<ProtectedRoute required="partner"><PartnerApp /></ProtectedRoute>} />
            <Route path="/admin/*" element={<ProtectedRoute required="admin"><AdminApp /></ProtectedRoute>} />
            <Route path="*" element={<RootRedirect />} />
          </Routes>
          <ToastContainer />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
