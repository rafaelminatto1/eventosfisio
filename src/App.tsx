import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './app/contexts/AuthContext';
import { ThemeProvider } from './app/contexts/ThemeContext';
import { LoginPage } from './app/pages/LoginPage';
import { DashboardPage } from './app/pages/DashboardPage';
import { EventoDetalhesPage } from './app/pages/EventoDetalhesPage';
import { EventoFormPage } from './app/pages/EventoFormPage';
import { TarefasPage } from './app/pages/TarefasPage';
import { PrestadorDetalhesPage } from './app/pages/PrestadorDetalhesPage';
import { GerenciarPessoasPage } from './app/pages/GerenciarPessoasPage';
import { ConfiguracoesPage } from './app/pages/ConfiguracoesPage';
import { HistoricoEventosPage } from './app/pages/HistoricoEventosPage';

// Componente para proteger rotas que exigem autenticação
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Componente para proteger rotas que exigem privilégios de administrador
const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();
  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            
            <Route path="/eventos/novo" element={
              <ProtectedRoute>
                <EventoFormPage />
              </ProtectedRoute>
            } />
            
            <Route path="/eventos/editar/:id" element={
              <ProtectedRoute>
                <EventoFormPage />
              </ProtectedRoute>
            } />
            
            <Route path="/eventos/:id" element={
              <ProtectedRoute>
                <EventoDetalhesPage />
              </ProtectedRoute>
            } />
            
            <Route path="/tarefas" element={
              <ProtectedRoute>
                <TarefasPage />
              </ProtectedRoute>
            } />
            
            <Route path="/prestadores/:id" element={
              <ProtectedRoute>
                <PrestadorDetalhesPage />
              </ProtectedRoute>
            } />
            
            <Route path="/gerenciar-pessoas" element={
              <ProtectedRoute>
                <GerenciarPessoasPage />
              </ProtectedRoute>
            } />
            
            <Route path="/configuracoes" element={
              <AdminRoute>
                <ConfiguracoesPage />
              </AdminRoute>
            } />
            
            <Route path="/historico-eventos" element={
              <ProtectedRoute>
                <HistoricoEventosPage />
              </ProtectedRoute>
            } />
            
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App; 