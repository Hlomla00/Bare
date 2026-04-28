// Re-exports the AuthContext hook for backward compatibility.
// All components that call useAuth() automatically get the real logged-in user.
export { useAuthContext as useAuth } from '../context/AuthContext'
