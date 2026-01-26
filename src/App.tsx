import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';

// Public pages - explicit imports, no lazy loading
import { LandingPage } from './pages/LandingPage';
import { CoverPage } from './pages/CoverPage';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';

// Protected pages - explicit imports
import { Dashboard } from './pages/Dashboard';
import { RiskRegister } from './pages/RiskRegister';
import { Alerts } from './pages/Alerts';
import { Analytics } from './pages/Analytics';
import { Reports } from './pages/Reports';
import { AICoach } from './pages/AICoach';
import { RiskFrameworks } from './pages/RiskFrameworks';
import { Team } from './pages/Team';
import { Settings } from './pages/Settings';
import { Admin } from './pages/Admin';
import { DataAnalysis } from './pages/DataAnalysis';
import { APIGateway } from './pages/APIGateway';
import { RiskIndicators } from './pages/RiskIndicators';

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  // CRITICAL: Always render routes, never return null or blank
  // The routes themselves handle auth state, not App component

  return (
    <Routes>
      {/* ROOT PATH - Explicit handling, no blank screen possible */}
      <Route
        path="/"
        element={
          isLoading ? (
            // Show cover page during auth check - never blank
            <CoverPage />
          ) : isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <CoverPage />
          )
        }
      />

      {/* LOGIN - Explicit route, always renders */}
      <Route
        path="/login"
        element={
          isLoading ? (
            <Login />
          ) : isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login />
          )
        }
      />

      {/* Other public routes */}
      <Route
        path="/cover"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <CoverPage />}
      />
      <Route
        path="/landing"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <CoverPage />}
      />
      <Route
        path="/landing-old"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />}
      />

      {/* DASHBOARD - Protected route for authenticated users */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Other protected routes */}
      <Route
        path="/risks"
        element={
          <ProtectedRoute>
            <RiskRegister />
          </ProtectedRoute>
        }
      />
      <Route
        path="/alerts"
        element={
          <ProtectedRoute>
            <Alerts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-coach"
        element={
          <ProtectedRoute>
            <AICoach />
          </ProtectedRoute>
        }
      />
      <Route
        path="/frameworks"
        element={
          <ProtectedRoute>
            <RiskFrameworks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/team"
        element={
          <ProtectedRoute>
            <Team />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/help"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/data-analysis"
        element={
          <ProtectedRoute>
            <DataAnalysis />
          </ProtectedRoute>
        }
      />
      <Route
        path="/api-gateway"
        element={
          <ProtectedRoute>
            <APIGateway />
          </ProtectedRoute>
        }
      />
      <Route
        path="/risk-indicators"
        element={
          <ProtectedRoute>
            <RiskIndicators />
          </ProtectedRoute>
        }
      />

      {/* CATCH-ALL - Always redirect to /login, never undefined */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
