import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Evento } from '../models/types';
import { useAuth } from '../contexts/AuthContext';

export function HistoricoEventosPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [filtroAno, setFiltroAno] = useState<string>('todos');
  const [filtroPalavraChave, setFiltroPalavraChave] = useState<string>('');
  const [anosFiltro, setAnosFiltro] = useState<string[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);

  // Simulação de carregamento de dados
  useEffect(() => {
    const carregarDados = async () => {
      setCarregando(true);
      try {
        // Aqui viria a chamada à API para buscar eventos arquivados ou concluídos
        // Por enquanto, vamos simular com dados de exemplo
        const eventosHistoricos = gerarDadosExemplo();
        setEventos(eventosHistoricos);
        
        // Extrair anos únicos dos eventos para o filtro
        const anos = Array.from(new Set(
          eventosHistoricos.map(evento => new Date(evento.date).getFullYear().toString())
        )).sort((a, b) => b.localeCompare(a)); // Ordenar do mais recente para o mais antigo
        
        setAnosFiltro(['todos', ...anos]);
      } catch (error) {
        console.error('Erro ao carregar histórico de eventos:', error);
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, []);

  // Função para gerar dados de exemplo
  const gerarDadosExemplo = (): Evento[] => {
    return [
      {
        id: '101',
        title: 'Workshop de Ergonomia - Fase 1',
        empresaId: '1',
        date: new Date('2023-05-15'),
        startTime: '09:00',
        endTime: '12:00',
        location: 'Sede ABC Ltda, São Paulo',
        description: 'Workshop sobre ergonomia no ambiente de trabalho.',
        status: 'concluido',
        responsibleName: 'Maria Silva',
        responsibleContact: '11987654321',
        prestadoresNecessarios: 2,
        arquivado: true,
        dataConclusao: new Date('2023-05-15'),
        createdAt: new Date('2023-04-01'),
        updatedAt: new Date('2023-05-16'),
        prestadores: [],
        items: [],
        logs: [
          {
            id: '1001',
            eventoId: '101',
            userId: '1',
            action: 'Evento concluído',
            details: 'Evento concluído com 28 participantes',
            createdAt: new Date('2023-05-15'),
          },
          {
            id: '1002',
            eventoId: '101',
            userId: '1',
            action: 'Evento arquivado',
            details: 'Arquivado após conclusão de relatórios',
            createdAt: new Date('2023-05-16'),
          }
        ]
      },
      {
        id: '102',
        title: 'Massagem Empresarial - Outubro 2023',
        empresaId: '2',
        date: new Date('2023-10-20'),
        startTime: '10:00',
        endTime: '16:00',
        location: 'TechSoft, São Paulo',
        description: 'Day care com massagens para todos os funcionários.',
        status: 'concluido',
        responsibleName: 'João Santos',
        responsibleContact: '11976543210',
        prestadoresNecessarios: 5,
        mediaParticipantes: 75,
        arquivado: true,
        dataConclusao: new Date('2023-10-20'),
        createdAt: new Date('2023-09-10'),
        updatedAt: new Date('2023-10-21'),
        prestadores: [],
        items: [],
        logs: [
          {
            id: '1003',
            eventoId: '102',
            userId: '1',
            action: 'Evento concluído',
            details: 'Evento concluído com sucesso e 80 atendimentos realizados',
            createdAt: new Date('2023-10-20'),
          }
        ]
      },
      {
        id: '103',
        title: 'Avaliação Postural - Semana da Saúde',
        empresaId: '3',
        date: new Date('2024-01-10'),
        startTime: '08:00',
        endTime: '17:00',
        location: 'FinTech Solutions, São Paulo',
        description: 'Avaliações posturais durante a semana da saúde corporativa.',
        status: 'concluido',
        responsibleName: 'Ana Oliveira',
        responsibleContact: '11965432109',
        prestadoresNecessarios: 3,
        mediaParticipantes: 50,
        arquivado: true,
        dataConclusao: new Date('2024-01-10'),
        createdAt: new Date('2023-12-05'),
        updatedAt: new Date('2024-01-11'),
        prestadores: [],
        items: [],
        logs: [
          {
            id: '1004',
            eventoId: '103',
            userId: '1',
            action: 'Evento concluído',
            details: 'Evento concluído com 52 avaliações realizadas',
            createdAt: new Date('2024-01-10'),
          }
        ]
      },
      {
        id: '104',
        title: 'Workshop de Prevenção de LER/DORT',
        empresaId: '1',
        date: new Date('2024-03-05'),
        startTime: '14:00',
        endTime: '17:00',
        location: 'Sede ABC Ltda, São Paulo',
        description: 'Workshop sobre prevenção de lesões ocupacionais.',
        status: 'cancelado',
        responsibleName: 'Carlos Mendes',
        responsibleContact: '11954321098',
        prestadoresNecessarios: 2,
        arquivado: true,
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-28'),
        prestadores: [],
        items: [],
        logs: [
          {
            id: '1005',
            eventoId: '104',
            userId: '1',
            action: 'Evento cancelado',
            details: 'Cancelado devido a problemas no local do evento',
            createdAt: new Date('2024-02-28'),
          }
        ]
      }
    ];
  };

  // Filtrar eventos com base nos critérios
  const eventosFiltrados = eventos.filter(evento => {
    // Filtro por status
    if (filtroStatus !== 'todos' && evento.status !== filtroStatus) {
      return false;
    }
    
    // Filtro por ano
    if (filtroAno !== 'todos') {
      const anoEvento = new Date(evento.date).getFullYear().toString();
      if (anoEvento !== filtroAno) {
        return false;
      }
    }
    
    // Filtro por palavra-chave
    if (filtroPalavraChave) {
      const termo = filtroPalavraChave.toLowerCase();
      return (
        evento.title.toLowerCase().includes(termo) ||
        evento.location.toLowerCase().includes(termo) ||
        evento.description.toLowerCase().includes(termo) ||
        evento.responsibleName.toLowerCase().includes(termo)
      );
    }
    
    return true;
  });

  // Função para formatar o status do evento
  const formatarStatus = (status: string): string => {
    switch (status) {
      case 'planejamento': return 'Planejamento';
      case 'confirmado': return 'Confirmado';
      case 'emAndamento': return 'Em Andamento';
      case 'concluido': return 'Concluído';
      case 'cancelado': return 'Cancelado';
      case 'inativo': return 'Inativo';
      default: return status;
    }
  };

  // Função para obter a classe CSS com base no status
  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'planejamento': return 'bg-yellow-100 text-yellow-800';
      case 'confirmado': return 'bg-green-100 text-green-800';
      case 'emAndamento': return 'bg-blue-100 text-blue-800';
      case 'concluido': return 'bg-teal-100 text-teal-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      case 'inativo': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Função para navegar para a página de detalhes do evento
  const verDetalhes = (eventoId: string) => {
    navigate(`/eventos/${eventoId}`);
  };

  // Função para restaurar um evento (desmarcar como arquivado)
  const restaurarEvento = (eventoId: string) => {
    if (confirm('Tem certeza que deseja restaurar este evento para o painel principal?')) {
      // Aqui viria a chamada à API para desmarcar o evento como arquivado
      // Por enquanto, vamos apenas atualizar o estado local
      const eventosAtualizados = eventos.map(evento => 
        evento.id === eventoId ? { ...evento, arquivado: false } : evento
      );
      setEventos(eventosAtualizados);
      alert('Evento restaurado com sucesso!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button 
              className="text-gray-600 hover:text-gray-900"
              onClick={() => navigate('/dashboard')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Histórico de Eventos</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filtros */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Filtros</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="statusFilter"
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="todos">Todos</option>
                  <option value="concluido">Concluído</option>
                  <option value="cancelado">Cancelado</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>
              <div>
                <label htmlFor="yearFilter" className="block text-sm font-medium text-gray-700 mb-1">
                  Ano
                </label>
                <select
                  id="yearFilter"
                  value={filtroAno}
                  onChange={(e) => setFiltroAno(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {anosFiltro.map((ano) => (
                    <option key={ano} value={ano}>
                      {ano === 'todos' ? 'Todos' : ano}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="keywordFilter" className="block text-sm font-medium text-gray-700 mb-1">
                  Palavra-chave
                </label>
                <input
                  id="keywordFilter"
                  type="text"
                  value={filtroPalavraChave}
                  onChange={(e) => setFiltroPalavraChave(e.target.value)}
                  placeholder="Buscar por título, local, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Eventos */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Eventos Arquivados</h2>
            <span className="text-sm text-gray-500">{eventosFiltrados.length} eventos encontrados</span>
          </div>
          
          {carregando ? (
            <div className="flex justify-center items-center p-12">
              <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : eventosFiltrados.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500">Nenhum evento arquivado encontrado com os filtros selecionados.</p>
            </div>
          ) : (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evento</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Local</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsável</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {eventosFiltrados.map((evento) => (
                    <tr key={evento.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{evento.title}</div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">{evento.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{new Date(evento.date).toLocaleDateString('pt-BR')}</div>
                        <div className="text-xs text-gray-500">{evento.startTime} - {evento.endTime}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 truncate max-w-xs">{evento.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(evento.status)}`}>
                          {formatarStatus(evento.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{evento.responsibleName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-center space-x-3">
                          <button
                            onClick={() => verDetalhes(evento.id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Ver Detalhes
                          </button>
                          <button
                            onClick={() => restaurarEvento(evento.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Restaurar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 