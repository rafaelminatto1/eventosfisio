import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { useAuth } from '../contexts/AuthContext';
import { TaskFormModal } from '../components/TaskFormModal';
import { TaskCard } from '../components/TaskCard';

// Tipos
interface Evento {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  status: string;
  prestadoresNecessarios?: number;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: 'baixa' | 'media' | 'alta';
  dueDate?: string;
  eventId?: string;
  assignedTo?: string;
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // Estados
  const [activeTab, setActiveTab] = useState<'eventos' | 'tarefas'>('eventos');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [visualizacao, setVisualizacao] = useState<'cards' | 'calendario'>('cards');
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [eventosFiltrados, setEventosFiltrados] = useState<Evento[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('todas');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [initialStatus, setInitialStatus] = useState<string>('');

  // Mock data para eventos
  useEffect(() => {
    const mockEventos: Evento[] = [
      {
        id: '1',
        title: 'Workshop de Fisioterapia Esportiva',
        date: '2023-06-15',
        startTime: '09:00',
        endTime: '17:00',
        location: 'Centro de Convenções, São Paulo',
        status: 'confirmado',
        prestadoresNecessarios: 5,
      },
      {
        id: '2',
        title: 'Palestra sobre Reabilitação Cardíaca',
        date: '2023-07-20',
        startTime: '14:00',
        endTime: '16:30',
        location: 'Hospital Universitário, Rio de Janeiro',
        status: 'planejamento',
        prestadoresNecessarios: 3,
      },
      {
        id: '3',
        title: 'Curso de Pilates Terapêutico',
        date: '2023-08-10',
        startTime: '08:30',
        endTime: '18:00',
        location: 'Espaço Saúde, Belo Horizonte',
        status: 'concluido',
        prestadoresNecessarios: 2,
      },
    ];

    setEventos(mockEventos);
    setEventosFiltrados(mockEventos);
  }, []);

  // Mock data para tarefas
  useEffect(() => {
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Contratar equipamentos de som',
        description: 'Verificar orçamentos com pelo menos 3 fornecedores para o Workshop de Fisioterapia',
        status: 'backlog',
        priority: 'alta',
        dueDate: '2023-06-01',
        eventId: '1',
      },
      {
        id: '2',
        title: 'Confirmar palestrantes',
        description: 'Entrar em contato com todos os palestrantes da Palestra sobre Reabilitação',
        status: 'todo',
        priority: 'alta',
        dueDate: '2023-06-10',
        eventId: '2',
      },
      {
        id: '3',
        title: 'Preparar material didático',
        description: 'Produzir apostilas e slides para o Curso de Pilates',
        status: 'doing',
        priority: 'media',
        dueDate: '2023-07-15',
        eventId: '3',
      },
      {
        id: '4',
        title: 'Verificar coffee break',
        description: 'Contratar serviço de coffee break para o Workshop',
        status: 'done',
        priority: 'baixa',
        dueDate: '2023-05-20',
        eventId: '1',
      },
    ];

    setTasks(mockTasks);
  }, []);

  // Filtrar eventos com base no status
  useEffect(() => {
    if (filtroStatus === 'todos') {
      setEventosFiltrados(eventos);
    } else {
      setEventosFiltrados(eventos.filter(evento => evento.status === filtroStatus));
    }
  }, [filtroStatus, eventos]);

  // Funções para gerenciar eventos
  const criarNovoEvento = () => {
    navigate('/evento/novo');
  };

  const verDetalhesEvento = (id: string) => {
    navigate(`/evento/${id}`);
  };

  const getPrestadoresConfirmados = (evento: Evento) => {
    // Mock - em um ambiente real, isto viria do backend
    return Math.floor(Math.random() * (evento.prestadoresNecessarios || 5)) + 1;
  };

  // Funções para gerenciar tarefas
  const handleAddTask = (status: string) => {
    setSelectedTask(null);
    setInitialStatus(status);
    setModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setInitialStatus(task.status);
    setModalOpen(true);
  };

  const handleSaveTask = (task: Task, isNew: boolean) => {
    if (isNew) {
      const newTask = {
        ...task,
        id: Date.now().toString(),
      };
      setTasks([...tasks, newTask]);
    } else {
      setTasks(tasks.map(t => t.id === task.id ? task : t));
    }
    setModalOpen(false);
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const updatedTasks = [...tasks];
    const taskToUpdate = updatedTasks.find(task => task.id === draggableId);

    if (taskToUpdate) {
      taskToUpdate.status = destination.droppableId;
      setTasks(updatedTasks);
    }
  };

  // Função para filtrar tarefas
  const applyFilters = (task: Task) => {
    const matchesSearch = searchTerm === '' || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPriority = selectedPriority === 'todas' || task.priority === selectedPriority;
    
    return matchesSearch && matchesPriority;
  };

  const filteredTasks = tasks.filter(applyFilters);

  // Mapeamento de colunas para os headers coloridos
  const columnColorMap: Record<string, string> = {
    backlog: 'before:bg-gray-500',
    todo: 'before:bg-blue-500',
    doing: 'before:bg-yellow-500',
    done: 'before:bg-green-500',
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">EventosFisio</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">Olá, {user?.name}</span>
            {user?.role === 'admin' && (
              <button
                onClick={() => navigate('/configuracoes')}
                className="px-3 py-1 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Configurações
              </button>
            )}
            <button
              onClick={logout}
              className="px-3 py-1 bg-red-900 text-red-100 rounded-md hover:bg-red-800 transition"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Navegação de Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="border-b border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'eventos'
                  ? 'border-blue-400 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
              }`}
              onClick={() => setActiveTab('eventos')}
            >
              Eventos
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tarefas'
                  ? 'border-blue-400 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
              }`}
              onClick={() => setActiveTab('tarefas')}
            >
              Tarefas
            </button>
            <button
              className="py-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-400 hover:text-gray-300 hover:border-gray-600"
              onClick={() => navigate('/gerenciar-pessoas')}
            >
              Gerenciar Pessoas
            </button>
          </nav>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'eventos' ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Meus Eventos</h2>
              <div className="flex space-x-2">
                <button 
                  className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition flex items-center"
                  onClick={() => navigate('/historico-eventos')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Histórico
                </button>
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  onClick={criarNovoEvento}
                >
                  Novo Evento
                </button>
              </div>
            </div>

            {/* Lista de eventos - Visualização em Cards */}
            {visualizacao === 'cards' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {eventosFiltrados.map((evento) => (
                  <div 
                    key={evento.id} 
                    className="bg-gray-800 shadow-lg rounded-lg overflow-hidden cursor-pointer hover:shadow-xl border border-gray-700 transition-all duration-200"
                    onClick={() => verDetalhesEvento(evento.id)}
                  >
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-100 truncate">{evento.title}</h3>
                      <div className="flex items-center text-gray-400 text-sm mt-1">
                        <span>{new Date(evento.date).toLocaleDateString('pt-BR')}</span>
                        <span className="mx-1">•</span>
                        <span>{evento.startTime} - {evento.endTime}</span>
                      </div>
                      <p className="text-sm text-gray-300 mt-2">{evento.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Barra de busca e filtros para tarefas */}
            <div className="mb-4 flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Buscar tarefas..."
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-gray-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="p-2 bg-gray-800 border border-gray-700 rounded text-gray-200"
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
              >
                <option value="todas">Todas as prioridades</option>
                <option value="baixa">Baixa prioridade</option>
                <option value="media">Média prioridade</option>
                <option value="alta">Alta prioridade</option>
              </select>
            </div>

            {/* Dica para dispositivos móveis */}
            <div className="mb-4 p-2 text-sm bg-gray-800 border border-gray-700 rounded text-gray-300 md:hidden">
              Deslize horizontalmente para ver todas as colunas
            </div>

            {/* Quadro Kanban */}
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="flex space-x-4 overflow-x-auto pb-4 task-columns">
                {/* Coluna: Backlog */}
                <div className="flex-shrink-0 w-72 task-column">
                  <div className="bg-gray-800 rounded-lg shadow-lg p-3 h-full border border-gray-700">
                    <div className="flex justify-between items-center mb-3 column-header">
                      <h3 className="font-medium text-gray-200 px-2">Backlog</h3>
                      <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
                        {filteredTasks.filter(task => task.status === 'backlog').length}
                      </span>
                    </div>
                    
                    <Droppable droppableId="backlog">
                      {(provided) => (
                        <div 
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto min-h-[150px] p-1"
                        >
                          {filteredTasks
                            .filter(task => task.status === 'backlog')
                            .map((task, index) => (
                              <TaskCard 
                                key={task.id} 
                                task={task} 
                                index={index}
                                onClick={() => handleEditTask(task)}
                              />
                            ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                    
                    <button 
                      className="mt-3 w-full py-2 text-gray-300 hover:text-gray-100 bg-gray-700 rounded-md border border-gray-600 flex items-center justify-center text-sm hover:bg-gray-600 transition-colors"
                      onClick={() => handleAddTask('backlog')}
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Adicionar
                    </button>
                  </div>
                </div>

                {/* Coluna: To Do */}
                <div className="flex-shrink-0 w-72 task-column">
                  <div className="bg-gray-800 rounded-lg shadow-lg p-3 h-full border border-gray-700">
                    <div className="flex justify-between items-center mb-3 column-header">
                      <h3 className="font-medium text-gray-200 px-2">A Fazer</h3>
                      <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
                        {filteredTasks.filter(task => task.status === 'todo').length}
                      </span>
                    </div>
                    
                    <Droppable droppableId="todo">
                      {(provided) => (
                        <div 
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto min-h-[150px] p-1"
                        >
                          {filteredTasks
                            .filter(task => task.status === 'todo')
                            .map((task, index) => (
                              <TaskCard 
                                key={task.id} 
                                task={task} 
                                index={index}
                                onClick={() => handleEditTask(task)}
                              />
                            ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                    
                    <button 
                      className="mt-3 w-full py-2 text-gray-300 hover:text-gray-100 bg-gray-700 rounded-md border border-gray-600 flex items-center justify-center text-sm hover:bg-gray-600 transition-colors"
                      onClick={() => handleAddTask('todo')}
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Adicionar
                    </button>
                  </div>
                </div>

                {/* Coluna: Em Andamento */}
                <div className="flex-shrink-0 w-72 task-column">
                  <div className="bg-gray-800 rounded-lg shadow-lg p-3 h-full border border-gray-700">
                    <div className="flex justify-between items-center mb-3 column-header">
                      <h3 className="font-medium text-gray-200 px-2">Em Andamento</h3>
                      <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
                        {filteredTasks.filter(task => task.status === 'doing').length}
                      </span>
                    </div>
                    
                    <Droppable droppableId="doing">
                      {(provided) => (
                        <div 
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto min-h-[150px] p-1"
                        >
                          {filteredTasks
                            .filter(task => task.status === 'doing')
                            .map((task, index) => (
                              <TaskCard 
                                key={task.id} 
                                task={task} 
                                index={index}
                                onClick={() => handleEditTask(task)}
                              />
                            ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                    
                    <button 
                      className="mt-3 w-full py-2 text-gray-300 hover:text-gray-100 bg-gray-700 rounded-md border border-gray-600 flex items-center justify-center text-sm hover:bg-gray-600 transition-colors"
                      onClick={() => handleAddTask('doing')}
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Adicionar
                    </button>
                  </div>
                </div>

                {/* Coluna: Concluído */}
                <div className="flex-shrink-0 w-72 task-column">
                  <div className="bg-gray-800 rounded-lg shadow-lg p-3 h-full border border-gray-700">
                    <div className="flex justify-between items-center mb-3 column-header">
                      <h3 className="font-medium text-gray-200 px-2">Concluído</h3>
                      <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
                        {filteredTasks.filter(task => task.status === 'done').length}
                      </span>
                    </div>
                    
                    <Droppable droppableId="done">
                      {(provided) => (
                        <div 
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto min-h-[150px] p-1"
                        >
                          {filteredTasks
                            .filter(task => task.status === 'done')
                            .map((task, index) => (
                              <TaskCard 
                                key={task.id} 
                                task={task} 
                                index={index}
                                onClick={() => handleEditTask(task)}
                              />
                            ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                    
                    <button 
                      className="mt-3 w-full py-2 text-gray-300 hover:text-gray-100 bg-gray-700 rounded-md border border-gray-600 flex items-center justify-center text-sm hover:bg-gray-600 transition-colors"
                      onClick={() => handleAddTask('done')}
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Adicionar
                    </button>
                  </div>
                </div>
              </div>
            </DragDropContext>
          </div>
        )}
      </main>

      {/* Modal de edição de tarefa */}
      <TaskFormModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialStatus={initialStatus}
        taskToEdit={selectedTask}
        onSave={handleSaveTask}
      />
    </div>
  );
} 