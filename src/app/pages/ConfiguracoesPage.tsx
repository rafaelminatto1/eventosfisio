import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ConfiguracoesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full">
          <h2 className="text-2xl font-bold text-white mb-4">Acesso Negado</h2>
          <p className="text-gray-300 mb-6">
            Você não tem permissão para acessar esta página. Esta seção é reservada para administradores.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Voltar para o Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Configurações</h1>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition"
          >
            Voltar
          </button>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-700">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-200 mb-4">Configurações do Sistema</h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-200 mb-2">Configurações Gerais</h3>
                  <div className="bg-gray-700 p-4 rounded-md shadow-sm">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Nome da Empresa
                      </label>
                      <input
                        type="text"
                        className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-gray-200"
                        defaultValue="EventosFisio"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Email de Contato
                      </label>
                      <input
                        type="email"
                        className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-gray-200"
                        defaultValue="contato@eventosfisio.com.br"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Telefone de Contato
                      </label>
                      <input
                        type="text"
                        className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-gray-200"
                        defaultValue="(11) 99999-9999"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-200 mb-2">Configurações de Email</h3>
                  <div className="bg-gray-700 p-4 rounded-md shadow-sm">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Servidor SMTP
                      </label>
                      <input
                        type="text"
                        className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-gray-200"
                        defaultValue="smtp.example.com"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Porta
                      </label>
                      <input
                        type="number"
                        className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-gray-200"
                        defaultValue="587"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        id="use-ssl"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-500 rounded"
                        defaultChecked
                      />
                      <label htmlFor="use-ssl" className="ml-2 block text-sm text-gray-300">
                        Usar SSL/TLS
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-200 mb-2">Configurações de Notificação</h3>
                  <div className="bg-gray-700 p-4 rounded-md shadow-sm">
                    <div className="mb-4">
                      <div className="flex items-center mb-3">
                        <input
                          id="notify-events"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-500 rounded"
                          defaultChecked
                        />
                        <label htmlFor="notify-events" className="ml-2 block text-sm text-gray-300">
                          Notificações de novos eventos
                        </label>
                      </div>
                      <div className="flex items-center mb-3">
                        <input
                          id="notify-tasks"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-500 rounded"
                          defaultChecked
                        />
                        <label htmlFor="notify-tasks" className="ml-2 block text-sm text-gray-300">
                          Notificações de novas tarefas
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="notify-comments"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-500 rounded"
                          defaultChecked
                        />
                        <label htmlFor="notify-comments" className="ml-2 block text-sm text-gray-300">
                          Notificações de comentários
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-200 mb-2">Preferências de Sistema</h3>
                  <div className="bg-gray-700 p-4 rounded-md shadow-sm">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Tema
                      </label>
                      <select className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-gray-200">
                        <option>Escuro</option>
                        <option>Claro</option>
                        <option>Sistema</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Idioma
                      </label>
                      <select className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-gray-200">
                        <option>Português (Brasil)</option>
                        <option>English</option>
                        <option>Español</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition">
                Cancelar
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 