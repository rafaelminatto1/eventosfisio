import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { User } from '../models/types';

// Componente Modal para adicionar/editar usuário
const UserFormModal = ({ 
  isOpen, 
  onClose, 
  userToEdit,
  onSave
}: { 
  isOpen: boolean;
  onClose: () => void;
  userToEdit?: User;
  onSave: (userData: Partial<User>) => void;
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'usuario' as User['role'],
    phone: ''
  });

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        name: userToEdit.name,
        email: userToEdit.email,
        password: '',
        role: userToEdit.role,
        phone: userToEdit.phone
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'usuario' as User['role'],
        phone: ''
      });
    }
  }, [userToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitBtn = e.currentTarget.querySelector('button[type="submit"]') as HTMLButtonElement;
    if (submitBtn) {
      submitBtn.textContent = 'Salvando...';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        onSave(formData);
      }, 500);
    } else {
      onSave(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {userToEdit ? 'Editar Usuário' : 'Adicionar Novo Usuário'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  {userToEdit ? 'Nova Senha (deixe em branco para manter a atual)' : 'Senha'}
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required={!userToEdit}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Função
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md"
                >
                  <option value="admin">Administrador</option>
                  <option value="prestador">Prestador</option>
                  <option value="usuario">Usuário</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Administrador: Acesso total ao sistema<br />
                  Prestador: Pode ver eventos e tarefas em que está alocado<br />
                  Usuário: Pode gerenciar eventos e prestadores
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 border text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Componente principal da página de Configurações
export function ConfiguracoesPage() {
  const { user } = useAuth();
  const { theme, toggleTheme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('usuarios');
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock de usuários
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Administrador',
      email: 'admin@exemplo.com',
      role: 'admin',
      phone: '(11) 99999-9999',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    },
    {
      id: '2',
      name: 'João Silva',
      email: 'joao.silva@exemplo.com',
      role: 'prestador',
      phone: '(11) 98765-4321',
      createdAt: new Date('2023-01-02'),
      updatedAt: new Date('2023-01-02'),
    },
    {
      id: '3',
      name: 'Maria Oliveira',
      email: 'maria.oliveira@exemplo.com',
      role: 'prestador',
      phone: '(11) 98765-1234',
      createdAt: new Date('2023-01-03'),
      updatedAt: new Date('2023-01-03'),
    },
    {
      id: '4',
      name: 'Carlos Souza',
      email: 'carlos.souza@exemplo.com',
      role: 'usuario',
      phone: '(11) 91234-5678',
      createdAt: new Date('2023-01-04'),
      updatedAt: new Date('2023-01-04'),
    },
  ]);

  // Função para adicionar usuário
  const handleAddUser = () => {
    setSelectedUser(undefined);
    setModalOpen(true);
  };

  // Função para editar usuário
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  // Função para salvar usuário
  const handleSaveUser = (userData: Partial<User>) => {
    if (selectedUser) {
      // Editar usuário existente
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === selectedUser.id 
            ? { 
                ...user, 
                ...userData,
                updatedAt: new Date()
              } 
            : user
        )
      );
      alert('Usuário atualizado com sucesso!');
    } else {
      // Adicionar novo usuário
      const novoUsuario: User = {
        id: Date.now().toString(),
        name: userData.name || '',
        email: userData.email || '',
        role: userData.role || 'usuario',
        phone: userData.phone || '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setUsers(prevUsers => [...prevUsers, novoUsuario]);
      alert('Novo usuário adicionado com sucesso!');
    }
    
    setModalOpen(false);
  };

  // Filtrar usuários com base na busca
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Verificar se o usuário atual é admin
  const isAdmin = user?.role === 'admin';

  // Redirecionar se não for admin
  useEffect(() => {
    if (!isAdmin) {
      alert('Acesso restrito: Apenas administradores podem acessar esta página.');
      navigate('/dashboard');
    }
  }, [isAdmin, navigate]);

  // Se não for admin, não renderiza a página
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button 
              className="text-gray-600 hover:text-gray-900"
              onClick={() => navigate(-1)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Configurações do Sistema</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Abas de navegação */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  selectedTab === 'usuarios'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setSelectedTab('usuarios')}
              >
                Usuários
              </button>
              <button
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  selectedTab === 'permissoes'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setSelectedTab('permissoes')}
              >
                Permissões
              </button>
              <button
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  selectedTab === 'sistema'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setSelectedTab('sistema')}
              >
                Sistema
              </button>
            </nav>
          </div>

          {/* Conteúdo da aba selecionada */}
          <div className="p-6">
            {selectedTab === 'usuarios' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="w-64">
                    <label htmlFor="search" className="sr-only">Buscar</label>
                    <div className="relative text-gray-400 focus-within:text-gray-600">
                      <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <input
                        id="search"
                        className="block w-full bg-white py-2 pl-10 pr-3 border border-gray-300 rounded-md leading-5 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm"
                        placeholder="Buscar usuários..."
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    onClick={handleAddUser}
                  >
                    Adicionar Usuário
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nome
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          E-mail
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Função
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Telefone
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.role === 'admin' 
                                ? 'bg-purple-100 text-purple-800' 
                                : user.role === 'prestador'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role === 'admin' ? 'Administrador' : 
                               user.role === 'prestador' ? 'Prestador' : 'Usuário'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.phone}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Ativo
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                              onClick={() => handleEditUser(user)}
                            >
                              Editar
                            </button>
                            <button
                              className="text-red-600 hover:text-red-900"
                              onClick={() => {
                                if (user.id === '1') {
                                  alert('Não é possível excluir o administrador principal.');
                                  return;
                                }
                                
                                if (confirm(`Tem certeza que deseja excluir o usuário ${user.name}?`)) {
                                  setUsers(prevUsers => prevUsers.filter(u => u.id !== user.id));
                                  alert('Usuário excluído com sucesso!');
                                }
                              }}
                            >
                              Excluir
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {selectedTab === 'permissoes' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Permissões do Sistema</h2>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Administrador</h3>
                    <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                      <li>Acesso completo a todas as funcionalidades</li>
                      <li>Gerenciamento de usuários e permissões</li>
                      <li>Criação e edição de eventos</li>
                      <li>Gerenciamento de prestadores</li>
                      <li>Acesso a relatórios financeiros</li>
                      <li>Configurações do sistema</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Prestador</h3>
                    <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                      <li>Visualização dos eventos em que está alocado</li>
                      <li>Atualização do próprio perfil e disponibilidade</li>
                      <li>Acesso a tarefas atribuídas</li>
                      <li>Comunicação via sistema</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Usuário</h3>
                    <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                      <li>Criação e edição de eventos</li>
                      <li>Gerenciamento de prestadores em eventos</li>
                      <li>Gestão de tarefas</li>
                      <li>Acesso a relatórios básicos</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'sistema' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Configurações do Sistema</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Aparência</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Modo Escuro</h4>
                          <p className="text-sm text-gray-600">Alterar entre os temas claro e escuro</p>
                        </div>
                        <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                          <input
                            type="checkbox"
                            id="darkModeToggle"
                            className="absolute w-6 h-6 opacity-0 cursor-pointer"
                            checked={theme === 'dark'}
                            onChange={toggleTheme}
                          />
                          <label
                            htmlFor="darkModeToggle"
                            className={`block h-6 overflow-hidden rounded-full transition-colors ${
                              theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`flex items-center justify-center block w-6 h-6 rounded-full transition-transform bg-white transform ${
                                theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
                              }`}
                            >
                              {theme === 'dark' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                              )}
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Informações Gerais</h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                          Nome da Empresa
                        </label>
                        <input
                          type="text"
                          id="companyName"
                          className="w-full px-4 py-2 border rounded-md"
                          defaultValue="EventosFisio"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                          E-mail de Contato
                        </label>
                        <input
                          type="email"
                          id="contact"
                          className="w-full px-4 py-2 border rounded-md"
                          defaultValue="contato@eventosfisio.com.br"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Backups e Segurança</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      O sistema realiza backups automáticos diariamente às 02:00.
                    </p>
                    <button 
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                      onClick={() => alert('Backup manual iniciado com sucesso!')}
                    >
                      Realizar Backup Manual
                    </button>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Integrações</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="whatsapp"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="whatsapp" className="ml-2 block text-sm text-gray-900">
                          Integração com WhatsApp
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="google"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="google" className="ml-2 block text-sm text-gray-900">
                          Integração com Google Maps
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="financeiro"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="financeiro" className="ml-2 block text-sm text-gray-900">
                          Integração com Sistema Financeiro
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <button 
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                      onClick={() => alert('Configurações salvas com sucesso!')}
                    >
                      Salvar Configurações
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal de Adicionar/Editar Usuário */}
      <UserFormModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)}
        userToEdit={selectedUser}
        onSave={handleSaveUser}
      />
    </div>
  );
} 