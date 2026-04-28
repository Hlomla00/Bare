import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/Bare" future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Navigate to="/app" replace />} />
          {/* Auth */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
          <Route path="/auth/onboarding" element={<Onboarding />} />
          <Route path="/auth/partner-signup" element={<PartnerSignup />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          {/* Apps */}
          <Route path="/app/*" element={<MemberApp />} />
          <Route path="/partner/*" element={<PartnerApp />} />
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)
