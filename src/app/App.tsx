import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { EventoFormPage } from './pages/EventoFormPage';
import { EventoDetalhesPage } from './pages/EventoDetalhesPage';
import { TarefasPage } from './pages/TarefasPage';
import { GerenciarPessoasPage } from './pages/GerenciarPessoasPage';
import { ConfiguracoesPage } from './pages/ConfiguracoesPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Componente para proteger rotas que requerem autenticação
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

// Componente para proteger rotas de admin
const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();
  return user && user.role === 'admin' ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route 
              path="/dashboard" 
              element={<PrivateRoute><DashboardPage /></PrivateRoute>} 
            />
            <Route 
              path="/eventos/novo" 
              element={<PrivateRoute><EventoFormPage /></PrivateRoute>} 
            />
            <Route 
              path="/eventos/editar/:id" 
              element={<PrivateRoute><EventoFormPage /></PrivateRoute>} 
            />
            <Route 
              path="/eventos/:id" 
              element={<PrivateRoute><EventoDetalhesPage /></PrivateRoute>} 
            />
            <Route 
              path="/tarefas" 
              element={<PrivateRoute><TarefasPage /></PrivateRoute>} 
            />
            <Route 
              path="/gerenciar-pessoas" 
              element={<PrivateRoute><GerenciarPessoasPage /></PrivateRoute>} 
            />
            <Route 
              path="/configuracoes" 
              element={<AdminRoute><ConfiguracoesPage /></AdminRoute>} 
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App 