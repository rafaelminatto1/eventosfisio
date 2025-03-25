import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Evento, Task } from '../models/types';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  ArcElement,
  LineElement,
  PointElement,
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  ArcElement, 
  LineElement,
  PointElement,
  Title, 
  Tooltip, 
  Legend
);

export function DashboardPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'eventos' | 'tarefas'>('eventos');
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [visualizacao, setVisualizacao] = useState<'cards' | 'calendario'>('cards');
  
  // Estado para controlar o tipo de gráfico
  const [tipoGrafico, setTipoGrafico] = useState<'bar' | 'line' | 'pie' | 'doughnut'>('bar');
  
  // Estados para tarefas
  const [tasks, setTasks] = useState<Task[]>([]);
  const [initialStatus, setInitialStatus] = useState<Task['status']>('todo');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  const navigate = useNavigate();

  // Adicionar estado para controle do mês atual
  const [currentDate, setCurrentDate] = useState(new Date());

  // Funções para navegação entre meses
  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  // Função para obter o primeiro dia do mês e total de dias
  const getMonthData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    return { firstDay, totalDays };
  };

  // Função de exemplo para gerar dados de exemplo
  const gerarDadosExemplo = () => {
    const eventosExemplo: Evento[] = [
      {
        id: '1',
        title: 'Evento Corrida Corporativa XYZ',
        empresaId: '1',
        date: new Date('2025-04-15'),
        startTime: '08:00',
        endTime: '14:00',
        location: 'Parque do Ibirapuera, São Paulo',
        description: 'Massagem pós-corrida para funcionários da empresa XYZ.',
        status: 'confirmado',
        responsibleName: 'Maria Silva',
        responsibleContact: '(11) 98765-4321',
        prestadoresNecessarios: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
        prestadores: [
          {
            id: '1',
            eventoId: '1',
            prestadorId: '1',
            status: 'confirmado',
            value: 150,
            observations: 'Especialista em massagem esportiva',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: '2',
            eventoId: '1',
            prestadorId: '2',
            status: 'confirmado',
            value: 150,
            observations: 'Fisioterapeuta',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: '3',
            eventoId: '1',
            prestadorId: '3',
            status: 'pendente',
            value: 150,
            observations: 'Aguardando confirmação',
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        ],
        items: [
          {
            id: '1',
            eventoId: '1',
            name: 'Maca portátil',
            quantity: 10,
            unitValue: 0,
            isOwned: true,
            observations: 'Já possuímos, sem custo adicional',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: '2',
            eventoId: '1',
            name: 'Óleo para massagem',
            quantity: 5,
            unitValue: 25,
            isOwned: false,
            observations: 'Comprar óleo neutro',
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        ],
        logs: [
          {
            id: '1',
            eventoId: '1',
            userId: '1',
            action: 'Evento criado',
            details: 'Evento criado pelo administrador',
            createdAt: new Date(),
          }
        ]
      },
      {
        id: '2',
        title: 'Feira de Saúde Empresarial',
        empresaId: '2',
        date: new Date('2025-05-20'),
        startTime: '09:00',
        endTime: '17:00',
        location: 'Centro de Convenções, São Paulo',
        description: 'Avaliações posturais e dicas de ergonomia para colaboradores.',
        status: 'planejamento',
        responsibleName: 'Carlos Santos',
        responsibleContact: '(11) 97654-3210',
        prestadoresNecessarios: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
        prestadores: [
          {
            id: '4',
            eventoId: '2',
            prestadorId: '4',
            status: 'confirmado',
            value: 180,
            observations: 'Fisioterapeuta especializado em ergonomia',
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        ],
        items: [],
        logs: []
      },
      {
        id: '3',
        title: 'Workshop de Alongamento',
        empresaId: '1',
        date: new Date('2025-03-10'),
        startTime: '14:00',
        endTime: '16:00',
        location: 'Escritório Central ABC, São Paulo',
        description: 'Sessão de alongamento e técnicas para alívio de tensões.',
        status: 'concluido',
        responsibleName: 'Ana Oliveira',
        responsibleContact: '(11) 96543-2109',
        prestadoresNecessarios: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
        prestadores: [
          {
            id: '5',
            eventoId: '3',
            prestadorId: '1',
            status: 'confirmado',
            value: 120,
            observations: 'Especialista em alongamento',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: '6',
            eventoId: '3',
            prestadorId: '5',
            status: 'confirmado',
            value: 120,
            observations: 'Especialista em alongamento',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: '7',
            eventoId: '3',
            prestadorId: '6',
            status: 'confirmado',
            value: 120,
            observations: 'Especialista em alongamento',
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        ],
        items: [],
        logs: []
      }
    ];

    setEventos(eventosExemplo);
  };

  // Função para gerar dados de exemplo de tarefas
  const gerarTarefasExemplo = () => {
    const tarefasExemplo: Task[] = [
      {
        id: '1',
        title: 'Comprar óleo para massagem',
        description: 'Para o evento da XYZ',
        status: 'backlog',
        priority: 'high',
        dueDate: new Date('2025-04-10'),
        createdBy: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        title: 'Confirmar prestadores',
        description: 'Evento Corrida Corporativa XYZ',
        status: 'todo',
        priority: 'medium',
        dueDate: new Date('2025-04-12'),
        createdBy: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        title: 'Reservar transporte',
        description: 'Para levar equipamentos',
        status: 'doing',
        priority: 'medium',
        dueDate: new Date(),
        createdBy: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '4',
        title: 'Enviar proposta',
        description: 'Evento Maratona Saúde',
        status: 'done',
        priority: 'low',
        dueDate: new Date('2025-03-30'),
        createdBy: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    setTasks(tarefasExemplo);
  };

  // Carregar dados de exemplo ao montar o componente
  useEffect(() => {
    gerarDadosExemplo();
    gerarTarefasExemplo();
  }, []);

  // Filtrar eventos com base no status selecionado
  const eventosFiltrados = eventos.filter(evento => {
    if (filtroStatus === 'todos') return true;
    return evento.status === filtroStatus;
  });

  // Navegar para a página de detalhes do evento
  const verDetalhesEvento = (eventoId: string) => {
    navigate(`/eventos/${eventoId}`);
  };

  // Navegar para criar um novo evento
  const criarNovoEvento = () => {
    navigate('/eventos/novo');
  };

  // Função para obter a cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado': return 'green';
      case 'planejamento': return 'blue';
      case 'emAndamento': return 'yellow';
      case 'concluido': return 'purple';
      case 'cancelado': return 'red';
      case 'inativo': return 'gray';
      default: return 'gray';
    }
  };

  // Função para obter a classe de cor do status para badges
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'confirmado': return 'bg-green-900 text-green-300';
      case 'planejamento': return 'bg-blue-900 text-blue-300';
      case 'emAndamento': return 'bg-yellow-900 text-yellow-300';
      case 'concluido': return 'bg-purple-900 text-purple-300';
      case 'cancelado': return 'bg-red-900 text-red-300';
      case 'inativo': return 'bg-gray-800 text-gray-300';
      default: return 'bg-gray-800 text-gray-300';
    }
  };

  // Função para obter o nome do status formatado
  const getStatusName = (status: string) => {
    switch (status) {
      case 'confirmado': return 'Confirmado';
      case 'planejamento': return 'Planejamento';
      case 'emAndamento': return 'Em Andamento';
      case 'concluido': return 'Concluído';
      case 'cancelado': return 'Cancelado';
      case 'inativo': return 'Inativo';
      default: return status;
    }
  };

  // Funções para manipulação de tarefas
  const handleAddTask = (status: Task['status']) => {
    setSelectedTask(undefined);
    setInitialStatus(status);
    setModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setInitialStatus(task.status);
    setModalOpen(true);
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (selectedTask) {
      // Editar tarefa existente
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === selectedTask.id 
            ? { 
                ...task, 
                ...taskData,
                updatedAt: new Date()
              } 
            : task
        )
      );
    } else {
      // Adicionar nova tarefa
      const novaTarefa: Task = {
        id: Date.now().toString(),
        title: taskData.title || '',
        description: taskData.description,
        status: taskData.status || 'todo',
        priority: taskData.priority || 'medium',
        dueDate: taskData.dueDate,
        createdBy: user?.id || '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setTasks(prevTasks => [...prevTasks, novaTarefa]);
    }
    
    setModalOpen(false);
  };

  // Função para drag and drop de tarefas melhorada com feedback visual
  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Sem destino, retorna
    if (!destination) return;

    // Mesma posição, retorna
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    // Encontra a tarefa que foi arrastada
    const task = tasks.find(t => t.id === draggableId);
    if (!task) return;

    // Cria uma cópia atualizada da tarefa com o novo status
    const updatedTask = {
      ...task,
      status: destination.droppableId as Task['status'],
      updatedAt: new Date()
    };

    // Atualiza a lista de tarefas com animação
    setTasks(prevTasks => 
      prevTasks.map(t => t.id === draggableId ? updatedTask : t)
    );
    
    // Feedback visual para o usuário
    const statusLabels: Record<string, string> = {
      'backlog': 'Backlog',
      'todo': 'A Fazer',
      'doing': 'Em Andamento',
      'done': 'Concluído'
    };
    
    const message = `Tarefa "${task.title}" movida para ${statusLabels[destination.droppableId]}`;
    
    // Cria notificação temporária
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-green-100 text-green-800 px-4 py-2 rounded-md shadow-md';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remove notificação após 2 segundos
    setTimeout(() => {
      notification.classList.add('opacity-0', 'transition-opacity', 'duration-500');
      setTimeout(() => document.body.removeChild(notification), 500);
    }, 2000);
  };

  // Componente de cartão de tarefa melhorado para o dashboard
  const TaskCard = ({ task, index, onClick }: { task: Task; index: number; onClick: () => void }) => {
    return (
      <Draggable draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`bg-white task-card draggable-task p-3 rounded shadow-sm border-l-4 mb-2 cursor-pointer hover:shadow-md transition-shadow ${snapshot.isDragging ? 'shadow-lg opacity-90' : ''}`}
            style={{ 
              borderLeftColor: 
                task.priority === 'high' ? '#ef4444' : 
                task.priority === 'medium' ? '#f59e0b' : '#60a5fa',
              ...provided.draggableProps.style
            }}
            onClick={onClick}
          >
            <h4 className="font-medium text-gray-800 text-sm flex items-center justify-between">
              <span>{task.title}</span>
              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                task.priority === 'high' ? 'bg-red-100 text-red-800' :
                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {task.priority === 'high' ? 'Alta' :
                task.priority === 'medium' ? 'Média' : 'Baixa'}
              </span>
            </h4>
            {task.description && (
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">{task.description}</p>
            )}
            
            <div className="flex justify-between items-center mt-2">
              {task.dueDate && (
                <span className="text-xs text-gray-500 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                </span>
              )}
              
              <div className="flex space-x-1">
                <button 
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Passar para a coluna seguinte
                    const statusOrder = ['backlog', 'todo', 'doing', 'done'];
                    const currentIndex = statusOrder.indexOf(task.status);
                    const nextStatus = statusOrder[Math.min(currentIndex + 1, statusOrder.length - 1)];
                    
                    setTasks(prevTasks => 
                      prevTasks.map(t => 
                        t.id === task.id 
                          ? { ...t, status: nextStatus as Task['status'], updatedAt: new Date() } 
                          : t
                      )
                    );
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </Draggable>
    );
  };

  // Componente de modal para adicionar/editar tarefa
  const TaskFormModal = ({ 
    isOpen, 
    onClose,
    initialStatus,
    taskToEdit,
    onSave
  }: { 
    isOpen: boolean;
    onClose: () => void;
    initialStatus: Task['status'];
    taskToEdit?: Task;
    onSave: (taskData: Partial<Task>) => void;
  }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      priority: 'medium' as Task['priority'],
      dueDate: '',
      status: initialStatus
    });

    useEffect(() => {
      if (taskToEdit) {
        setFormData({
          title: taskToEdit.title,
          description: taskToEdit.description || '',
          priority: taskToEdit.priority,
          dueDate: taskToEdit.dueDate ? new Date(taskToEdit.dueDate).toISOString().split('T')[0] : '',
          status: taskToEdit.status
        });
      } else {
        setFormData({
          title: '',
          description: '',
          priority: 'medium' as Task['priority'],
          dueDate: '',
          status: initialStatus
        });
      }
    }, [taskToEdit, initialStatus, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
        
        // Conversão de string para Date
        const taskData = { 
          ...formData,
          dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
          createdBy: user?.id || '',
        };
        
        setTimeout(() => {
          onSave(taskData);
          submitBtn.textContent = 'Salvar';
          submitBtn.disabled = false;
        }, 500);
      } else {
        const taskData = { 
          ...formData,
          dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
          createdBy: user?.id || '',
        };
        onSave(taskData);
      }
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {taskToEdit ? 'Editar Tarefa' : 'Nova Tarefa'}
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
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                      Prioridade
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md"
                    >
                      <option value="low">Baixa</option>
                      <option value="medium">Média</option>
                      <option value="high">Alta</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Vencimento
                    </label>
                    <input
                      type="date"
                      id="dueDate"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md"
                  >
                    <option value="backlog">Backlog</option>
                    <option value="todo">A Fazer</option>
                    <option value="doing">Em Andamento</option>
                    <option value="done">Concluído</option>
                  </select>
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

  // Função para calcular prestadores confirmados
  const getPrestadoresConfirmados = (evento: Evento) => {
    return evento.prestadores.filter(p => p.status === 'confirmado').length;
  };

  // Função para calcular a porcentagem de prestadores confirmados
  const getPrestadoresProgresso = (evento: Evento) => {
    if (!evento.prestadoresNecessarios || evento.prestadoresNecessarios <= 0) return 0;
    const confirmados = getPrestadoresConfirmados(evento);
    return Math.min(100, Math.round((confirmados / evento.prestadoresNecessarios) * 100));
  };

  // Função para obter a cor da barra de progresso
  const getProgressoBarColor = (progresso: number) => {
    if (progresso >= 100) return 'bg-green-500';
    if (progresso >= 75) return 'bg-blue-400';
    if (progresso >= 50) return 'bg-yellow-500';
    if (progresso >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Adicionar função para processar dados do gráfico
  const getEventosPorMes = () => {
    const eventosPorMes = Array(12).fill(0);
    const eventosPorStatus = {
      confirmado: Array(12).fill(0),
      planejamento: Array(12).fill(0),
      negociacao: Array(12).fill(0),
      concluido: Array(12).fill(0),
      cancelado: Array(12).fill(0)
    };
    
    eventos.forEach(evento => {
      const mes = new Date(evento.date).getMonth();
      eventosPorMes[mes]++;
      
      // Contagem por status
      if (evento.status && eventosPorStatus[evento.status as keyof typeof eventosPorStatus]) {
        eventosPorStatus[evento.status as keyof typeof eventosPorStatus][mes]++;
      }
    });

    const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    if (tipoGrafico === 'pie') {
      // Para gráfico de pizza, usamos o total por mês
      return {
        labels,
        datasets: [
          {
            label: 'Eventos por Mês',
            data: eventosPorMes,
            backgroundColor: [
              'rgba(255, 99, 132, 0.7)',
              'rgba(54, 162, 235, 0.7)',
              'rgba(255, 206, 86, 0.7)',
              'rgba(75, 192, 192, 0.7)',
              'rgba(153, 102, 255, 0.7)',
              'rgba(255, 159, 64, 0.7)',
              'rgba(255, 99, 132, 0.7)',
              'rgba(54, 162, 235, 0.7)',
              'rgba(255, 206, 86, 0.7)',
              'rgba(75, 192, 192, 0.7)',
              'rgba(153, 102, 255, 0.7)',
              'rgba(255, 159, 64, 0.7)',
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 206, 86)',
              'rgb(75, 192, 192)',
              'rgb(153, 102, 255)',
              'rgb(255, 159, 64)',
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 206, 86)',
              'rgb(75, 192, 192)',
              'rgb(153, 102, 255)',
              'rgb(255, 159, 64)',
            ],
            borderWidth: 1,
          },
        ],
      };
    } else if (tipoGrafico === 'line') {
      // Para gráfico de linhas, podemos mostrar a evolução por status
      return {
        labels,
        datasets: [
          {
            label: 'Confirmados',
            data: eventosPorStatus.confirmado,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 2,
            tension: 0.3,
            fill: false,
          },
          {
            label: 'Em Planejamento',
            data: eventosPorStatus.planejamento,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 2,
            tension: 0.3,
            fill: false,
          },
          {
            label: 'Em Negociação',
            data: eventosPorStatus.negociacao,
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderColor: 'rgb(255, 206, 86)',
            borderWidth: 2,
            tension: 0.3,
            fill: false,
          },
          {
            label: 'Concluídos',
            data: eventosPorStatus.concluido,
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgb(153, 102, 255)',
            borderWidth: 2,
            tension: 0.3,
            fill: false,
          },
        ],
      };
    } else {
      // Gráfico de barras (padrão)
      return {
        labels,
        datasets: [
          {
            label: 'Eventos por Mês',
            data: eventosPorMes,
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 1,
            barPercentage: 0.6,
            categoryPercentage: 0.7,
            borderRadius: 4,
          },
        ],
      };
    }
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
              <h2 className="text-xl font-semibold text-gray-800">Meus Eventos</h2>
              <div className="flex space-x-2">
                <button 
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition flex items-center"
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

            {/* Filtros e visualização */}
            <div className="bg-white shadow rounded-lg mb-6 p-4">
              <div className="flex flex-wrap items-center justify-between">
                <div className="flex space-x-4 mb-4 sm:mb-0">
                  <button 
                    className={`px-3 py-1 rounded-full ${filtroStatus === 'todos' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800 hover:bg-blue-50 hover:text-blue-600'}`}
                    onClick={() => setFiltroStatus('todos')}
                  >
                    Todos
                  </button>
                  <button 
                    className={`px-3 py-1 rounded-full ${filtroStatus === 'confirmado' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800 hover:bg-green-50 hover:text-green-600'}`}
                    onClick={() => setFiltroStatus('confirmado')}
                  >
                    Confirmados
                  </button>
                  <button 
                    className={`px-3 py-1 rounded-full ${filtroStatus === 'planejamento' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800 hover:bg-yellow-50 hover:text-yellow-600'}`}
                    onClick={() => setFiltroStatus('planejamento')}
                  >
                    Em planejamento
                  </button>
                  <button 
                    className={`px-3 py-1 rounded-full ${filtroStatus === 'concluido' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800 hover:bg-purple-50 hover:text-purple-600'}`}
                    onClick={() => setFiltroStatus('concluido')}
                  >
                    Concluídos
                  </button>
                </div>
                <div className="flex space-x-2">
                  <button 
                    className={`px-3 py-1 rounded-md flex items-center ${visualizacao === 'cards' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    onClick={() => setVisualizacao('cards')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Cards
                  </button>
                  <button 
                    className={`px-3 py-1 rounded-md flex items-center ${visualizacao === 'calendario' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    onClick={() => setVisualizacao('calendario')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Calendário
                  </button>
                </div>
              </div>
            </div>

            {/* Lista de eventos - Visualização em Cards */}
            {visualizacao === 'cards' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {eventosFiltrados.map((evento) => (
                  <div 
                    key={evento.id} 
                    className={`event-card bg-gray-800 shadow-lg rounded-lg overflow-hidden cursor-pointer hover:shadow-xl border border-gray-700 transition-all duration-200 status-${evento.status} animate-fade-in`}
                    onClick={() => verDetalhesEvento(evento.id)}
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-100 truncate max-w-[200px]">{evento.title}</h3>
                          <div className="flex items-center text-gray-400 text-sm mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(evento.date).toLocaleDateString('pt-BR')}
                            <span className="mx-1">•</span>
                            <span className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {evento.startTime} - {evento.endTime}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm text-gray-300 flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="truncate max-w-[230px]">{evento.location}</span>
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-700">
                        <div className="flex-col space-y-2 w-full">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              <span className="text-xs text-gray-400">Prestadores:</span>
                            </div>
                            <span className="text-xs font-medium">
                              <span className={`${getPrestadoresConfirmados(evento) >= (evento.prestadoresNecessarios || 0) ? 'text-green-400' : 'text-blue-400'}`}>
                                {getPrestadoresConfirmados(evento)}
                              </span>
                              <span className="text-gray-500">/</span>
                              <span className="text-gray-400">{evento.prestadoresNecessarios || 0}</span>
                            </span>
                          </div>
                          
                          {/* Barra de progresso */}
                          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                            <div 
                              className={`h-2 rounded-full ${getProgressoBarColor(getPrestadoresProgresso(evento))}`} 
                              style={{ width: `${getPrestadoresProgresso(evento)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Card para adicionar novo evento */}
                <div 
                  className="event-card-new bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg overflow-hidden cursor-pointer hover:border-blue-400 hover:shadow-md transition-all flex flex-col items-center justify-center p-8"
                  onClick={criarNovoEvento}
                >
                  <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center text-blue-400 mb-4 transform transition-transform hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-200">Novo Evento</h3>
                  <p className="text-gray-400 text-sm text-center mt-2">
                    Clique para criar um novo evento de fisioterapia
                  </p>
                </div>
              </div>
            )}

            {/* Lista de eventos - Visualização em Calendário */}
            {visualizacao === 'calendario' && (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-lg font-medium text-gray-900">Calendário de Eventos</h3>
                    <span className="text-gray-600">
                      {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={prevMonth}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setCurrentDate(new Date())}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                    >
                      Hoje
                    </button>
                    <button
                      onClick={nextMonth}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-7 gap-px bg-gray-200">
                    {/* Cabeçalho dos dias da semana */}
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((dia, index) => (
                      <div key={index} className="bg-gray-100 py-2 text-center text-sm font-medium text-gray-700">
                        {dia}
                      </div>
                    ))}
                    
                    {/* Dias do mês */}
                    {Array.from({ length: 42 }).map((_, index) => {
                      const { firstDay, totalDays } = getMonthData();
                      const day = index - firstDay + 1;
                      const isCurrentMonth = day > 0 && day <= totalDays;
                      
                      // Eventos para este dia
                      const eventosNoDia = eventosFiltrados.filter(evento => {
                        if (!isCurrentMonth) return false;
                        const eventDate = new Date(evento.date);
                        return day === eventDate.getDate() && 
                               eventDate.getMonth() === currentDate.getMonth() &&
                               eventDate.getFullYear() === currentDate.getFullYear();
                      });
                      
                      // Determinar a cor de fundo com base no status do evento mais importante
                      // (confirmado > emAndamento > planejamento > concluido > cancelado)
                      let dayClassName = "";
                      let borderClass = "";
                      
                      if (eventosNoDia.length > 0) {
                        // Prioridade dos status para destacar
                        const statusPriorities = {
                          'confirmado': 1,
                          'emAndamento': 2,
                          'planejamento': 3,
                          'concluido': 4,
                          'cancelado': 5,
                          'inativo': 6
                        };
                        
                        // Encontrar o evento com status de maior prioridade
                        const eventoDestaque = eventosNoDia.reduce((prev, current) => {
                          return statusPriorities[prev.status] < statusPriorities[current.status] ? prev : current;
                        });
                        
                        // Definir as classes baseadas no status
                        switch (eventoDestaque.status) {
                          case 'confirmado':
                            dayClassName = "hover:bg-green-50";
                            borderClass = "border-t-2 border-green-500";
                            break;
                          case 'emAndamento':
                            dayClassName = "hover:bg-yellow-50";
                            borderClass = "border-t-2 border-yellow-500";
                            break;
                          case 'planejamento':
                            dayClassName = "hover:bg-blue-50";
                            borderClass = "border-t-2 border-blue-500";
                            break;
                          case 'concluido':
                            dayClassName = "hover:bg-purple-50";
                            borderClass = "border-t-2 border-purple-500";
                            break;
                          case 'cancelado':
                            dayClassName = "hover:bg-red-50";
                            borderClass = "border-t-2 border-red-500";
                            break;
                          default:
                            dayClassName = "hover:bg-gray-50";
                            borderClass = "";
                        }
                      }
                      
                      return (
                        <div key={index} className={`bg-white min-h-24 p-2 ${
                          !isCurrentMonth ? 'bg-gray-50 text-gray-400' : 
                          eventosNoDia.length > 0 ? `${dayClassName} ${borderClass} cursor-pointer` : ''
                        }`}>
                          <div className={`text-right text-sm mb-1 ${
                            !isCurrentMonth ? 'text-gray-400' :
                            eventosNoDia.length > 0 ? 'font-medium' : 'text-gray-500'
                          }`}>
                            {isCurrentMonth ? day : ''}
                          </div>
                          
                          {/* Exibir eventos do dia */}
                          {eventosNoDia.map((evento, idx) => (
                            <div 
                              key={idx}
                              className={`text-xs p-1.5 mb-1 rounded truncate ${
                                evento.status === 'confirmado' ? 'bg-green-100 text-green-800 border-l-4 border-green-500' :
                                evento.status === 'planejamento' ? 'bg-blue-100 text-blue-800 border-l-4 border-blue-500' :
                                evento.status === 'emAndamento' ? 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500' :
                                evento.status === 'concluido' ? 'bg-purple-100 text-purple-800 border-l-4 border-purple-500' :
                                evento.status === 'cancelado' ? 'bg-red-100 text-red-800 border-l-4 border-red-500' :
                                'bg-gray-100 text-gray-800 border-l-4 border-gray-500'
                              }`}
                              onClick={() => verDetalhesEvento(evento.id)}
                            >
                              <div className="font-medium">{evento.title}</div>
                              <div className="text-[10px] mt-0.5">{evento.startTime} - {evento.endTime}</div>
                            </div>
                          ))}
                          
                          {/* Indicador de múltiplos eventos */}
                          {eventosNoDia.length > 2 && (
                            <div className="text-xs text-center mt-1 font-medium text-blue-600">
                              + {eventosNoDia.length - 2} mais eventos
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Gráfico movido para a parte inferior */}
            <div className="mt-8">
              <div className="bg-white shadow rounded-lg">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Distribuição de Eventos por Mês</h3>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setTipoGrafico('bar')} 
                        className={`px-3 py-1.5 rounded text-sm flex items-center ${tipoGrafico === 'bar' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4M9 4v16M15 4v16" />
                        </svg>
                        Barras
                      </button>
                      <button 
                        onClick={() => setTipoGrafico('line')} 
                        className={`px-3 py-1.5 rounded text-sm flex items-center ${tipoGrafico === 'line' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                        </svg>
                        Linhas
                      </button>
                      <button 
                        onClick={() => setTipoGrafico('pie')} 
                        className={`px-3 py-1.5 rounded text-sm flex items-center ${tipoGrafico === 'pie' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v10l4.45 4.45" />
                        </svg>
                        Pizza
                      </button>
                    </div>
                  </div>
                  <div className="h-72">
                    {tipoGrafico === 'bar' && (
                      <Bar
                        data={getEventosPorMes()}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: true,
                              position: 'top',
                            },
                            title: {
                              display: false,
                            },
                            tooltip: {
                              callbacks: {
                                label: function(context) {
                                  return `${context.dataset.label}: ${context.raw} eventos`;
                                }
                              }
                            }
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              ticks: {
                                precision: 0,
                                callback: function(value) {
                                  return value + (Number(value) === 1 ? ' evento' : ' eventos');
                                }
                              },
                              title: {
                                display: true,
                                text: 'Número de Eventos'
                              }
                            },
                            x: {
                              title: {
                                display: true,
                                text: 'Mês'
                              }
                            }
                          },
                          animation: {
                            duration: 1000,
                            easing: 'easeOutQuart'
                          }
                        }}
                      />
                    )}
                    {tipoGrafico === 'line' && (
                      <Line
                        data={getEventosPorMes()}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: true,
                              position: 'top',
                            },
                            tooltip: {
                              callbacks: {
                                label: function(context) {
                                  return `${context.dataset.label}: ${context.raw} eventos`;
                                }
                              }
                            }
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              ticks: {
                                precision: 0
                              },
                              title: {
                                display: true,
                                text: 'Número de Eventos'
                              }
                            },
                            x: {
                              title: {
                                display: true,
                                text: 'Mês'
                              }
                            }
                          },
                          animation: {
                            duration: 1000,
                            easing: 'easeOutQuart'
                          }
                        }}
                      />
                    )}
                    {tipoGrafico === 'pie' && (
                      <Pie
                        data={getEventosPorMes()}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: true,
                              position: 'right',
                            },
                            tooltip: {
                              callbacks: {
                                label: function(context) {
                                  return `${context.label}: ${context.raw} eventos`;
                                }
                              }
                            }
                          },
                          animation: {
                            animateScale: true,
                            animateRotate: true,
                            duration: 1000,
                            easing: 'easeOutQuart'
                          }
                        }}
                      />
                    )}
                  </div>
                  <div className="mt-4 text-sm text-gray-500 text-center">
                    {tipoGrafico === 'bar' && 'Visualize a quantidade total de eventos por mês'}
                    {tipoGrafico === 'line' && 'Compare a distribuição de eventos por status ao longo do ano'}
                    {tipoGrafico === 'pie' && 'Veja a proporção de eventos entre os meses do ano'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Minhas Tarefas</h2>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                onClick={() => handleAddTask('todo')}
              >
                Nova Tarefa
              </button>
            </div>

            {/* Sistema estilo Trello - Atualizado para arrastar horizontalmente */}
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 pb-6 overflow-x-auto">
                {/* Status columns array */}
                {[
                  { id: 'backlog', title: 'Backlog', color: 'gray-800', textColor: 'gray-200', buttonColor: 'gray-700', buttonHoverColor: 'gray-600', buttonTextColor: 'gray-300', buttonBorderColor: 'gray-600' },
                  { id: 'todo', title: 'A Fazer', color: 'gray-800', textColor: 'gray-200', buttonColor: 'gray-700', buttonHoverColor: 'gray-600', buttonTextColor: 'gray-300', buttonBorderColor: 'gray-600' },
                  { id: 'doing', title: 'Em Andamento', color: 'gray-800', textColor: 'gray-200', buttonColor: 'gray-700', buttonHoverColor: 'gray-600', buttonTextColor: 'gray-300', buttonBorderColor: 'gray-600' },
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Evento, Task } from '../models/types';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  ArcElement,
  LineElement,
  PointElement,
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  ArcElement, 
  LineElement,
  PointElement,
  Title, 
  Tooltip, 
  Legend
);

export function DashboardPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'eventos' | 'tarefas'>('eventos');
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [visualizacao, setVisualizacao] = useState<'cards' | 'calendario'>('cards');
  
  // Estado para controlar o tipo de gráfico
  const [tipoGrafico, setTipoGrafico] = useState<'bar' | 'line' | 'pie' | 'doughnut'>('bar');
  
  // Estados para tarefas
  const [tasks, setTasks] = useState<Task[]>([]);
  const [initialStatus, setInitialStatus] = useState<Task['status']>('todo');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  const navigate = useNavigate();

  // Adicionar estado para controle do mês atual
  const [currentDate, setCurrentDate] = useState(new Date());

  // Funções para navegação entre meses
  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  // Função para obter o primeiro dia do mês e total de dias
  const getMonthData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    return { firstDay, totalDays };
  };

  // Função de exemplo para gerar dados de exemplo
  const gerarDadosExemplo = () => {
    const eventosExemplo: Evento[] = [
      {
        id: '1',
        title: 'Evento Corrida Corporativa XYZ',
        empresaId: '1',
        date: new Date('2025-04-15'),
        startTime: '08:00',
        endTime: '14:00',
        location: 'Parque do Ibirapuera, São Paulo',
        description: 'Massagem pós-corrida para funcionários da empresa XYZ.',
        status: 'confirmado',
        responsibleName: 'Maria Silva',
        responsibleContact: '(11) 98765-4321',
        prestadoresNecessarios: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
        prestadores: [
          {
            id: '1',
            eventoId: '1',
            prestadorId: '1',
            status: 'confirmado',
            value: 150,
            observations: 'Especialista em massagem esportiva',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: '2',
            eventoId: '1',
            prestadorId: '2',
            status: 'confirmado',
            value: 150,
            observations: 'Fisioterapeuta',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: '3',
            eventoId: '1',
            prestadorId: '3',
            status: 'pendente',
            value: 150,
            observations: 'Aguardando confirmação',
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        ],
        items: [
          {
            id: '1',
            eventoId: '1',
            name: 'Maca portátil',
            quantity: 10,
            unitValue: 0,
            isOwned: true,
            observations: 'Já possuímos, sem custo adicional',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: '2',
            eventoId: '1',
            name: 'Óleo para massagem',
            quantity: 5,
            unitValue: 25,
            isOwned: false,
            observations: 'Comprar óleo neutro',
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        ],
        logs: [
          {
            id: '1',
            eventoId: '1',
            userId: '1',
            action: 'Evento criado',
            details: 'Evento criado pelo administrador',
            createdAt: new Date(),
          }
        ]
      },
      {
        id: '2',
        title: 'Feira de Saúde Empresarial',
        empresaId: '2',
        date: new Date('2025-05-20'),
        startTime: '09:00',
        endTime: '17:00',
        location: 'Centro de Convenções, São Paulo',
        description: 'Avaliações posturais e dicas de ergonomia para colaboradores.',
        status: 'planejamento',
        responsibleName: 'Carlos Santos',
        responsibleContact: '(11) 97654-3210',
        prestadoresNecessarios: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
        prestadores: [
          {
            id: '4',
            eventoId: '2',
            prestadorId: '4',
            status: 'confirmado',
            value: 180,
            observations: 'Fisioterapeuta especializado em ergonomia',
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        ],
        items: [],
        logs: []
      },
      {
        id: '3',
        title: 'Workshop de Alongamento',
        empresaId: '1',
        date: new Date('2025-03-10'),
        startTime: '14:00',
        endTime: '16:00',
        location: 'Escritório Central ABC, São Paulo',
        description: 'Sessão de alongamento e técnicas para alívio de tensões.',
        status: 'concluido',
        responsibleName: 'Ana Oliveira',
        responsibleContact: '(11) 96543-2109',
        prestadoresNecessarios: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
        prestadores: [
          {
            id: '5',
            eventoId: '3',
            prestadorId: '1',
            status: 'confirmado',
            value: 120,
            observations: 'Especialista em alongamento',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: '6',
            eventoId: '3',
            prestadorId: '5',
            status: 'confirmado',
            value: 120,
            observations: 'Especialista em alongamento',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: '7',
            eventoId: '3',
            prestadorId: '6',
            status: 'confirmado',
            value: 120,
            observations: 'Especialista em alongamento',
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        ],
        items: [],
        logs: []
      }
    ];

    setEventos(eventosExemplo);
  };

  // Função para gerar dados de exemplo de tarefas
  const gerarTarefasExemplo = () => {
    const tarefasExemplo: Task[] = [
      {
        id: '1',
        title: 'Comprar óleo para massagem',
        description: 'Para o evento da XYZ',
        status: 'backlog',
        priority: 'high',
        dueDate: new Date('2025-04-10'),
        createdBy: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        title: 'Confirmar prestadores',
        description: 'Evento Corrida Corporativa XYZ',
        status: 'todo',
        priority: 'medium',
        dueDate: new Date('2025-04-12'),
        createdBy: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        title: 'Reservar transporte',
        description: 'Para levar equipamentos',
        status: 'doing',
        priority: 'medium',
        dueDate: new Date(),
        createdBy: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '4',
        title: 'Enviar proposta',
        description: 'Evento Maratona Saúde',
        status: 'done',
        priority: 'low',
        dueDate: new Date('2025-03-30'),
        createdBy: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    setTasks(tarefasExemplo);
  };

  // Carregar dados de exemplo ao montar o componente
  useEffect(() => {
    gerarDadosExemplo();
    gerarTarefasExemplo();
  }, []);

  // Filtrar eventos com base no status selecionado
  const eventosFiltrados = eventos.filter(evento => {
    if (filtroStatus === 'todos') return true;
    return evento.status === filtroStatus;
  });

  // Navegar para a página de detalhes do evento
  const verDetalhesEvento = (eventoId: string) => {
    navigate(`/eventos/${eventoId}`);
  };

  // Navegar para criar um novo evento
  const criarNovoEvento = () => {
    navigate('/eventos/novo');
  };

  // Função para obter a cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado': return 'green';
      case 'planejamento': return 'blue';
      case 'emAndamento': return 'yellow';
      case 'concluido': return 'purple';
      case 'cancelado': return 'red';
      case 'inativo': return 'gray';
      default: return 'gray';
    }
  };

  // Função para obter a classe de cor do status para badges
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'confirmado': return 'bg-green-900 text-green-300';
      case 'planejamento': return 'bg-blue-900 text-blue-300';
      case 'emAndamento': return 'bg-yellow-900 text-yellow-300';
      case 'concluido': return 'bg-purple-900 text-purple-300';
      case 'cancelado': return 'bg-red-900 text-red-300';
      case 'inativo': return 'bg-gray-800 text-gray-300';
      default: return 'bg-gray-800 text-gray-300';
    }
  };

  // Função para obter o nome do status formatado
  const getStatusName = (status: string) => {
    switch (status) {
      case 'confirmado': return 'Confirmado';
      case 'planejamento': return 'Planejamento';
      case 'emAndamento': return 'Em Andamento';
      case 'concluido': return 'Concluído';
      case 'cancelado': return 'Cancelado';
      case 'inativo': return 'Inativo';
      default: return status;
    }
  };

  // Funções para manipulação de tarefas
  const handleAddTask = (status: Task['status']) => {
    setSelectedTask(undefined);
    setInitialStatus(status);
    setModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setInitialStatus(task.status);
    setModalOpen(true);
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (selectedTask) {
      // Editar tarefa existente
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === selectedTask.id 
            ? { 
                ...task, 
                ...taskData,
                updatedAt: new Date()
              } 
            : task
        )
      );
    } else {
      // Adicionar nova tarefa
      const novaTarefa: Task = {
        id: Date.now().toString(),
        title: taskData.title || '',
        description: taskData.description,
        status: taskData.status || 'todo',
        priority: taskData.priority || 'medium',
        dueDate: taskData.dueDate,
        createdBy: user?.id || '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setTasks(prevTasks => [...prevTasks, novaTarefa]);
    }
    
    setModalOpen(false);
  };

  // Função para drag and drop de tarefas melhorada com feedback visual
  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Sem destino, retorna
    if (!destination) return;

    // Mesma posição, retorna
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    // Encontra a tarefa que foi arrastada
    const task = tasks.find(t => t.id === draggableId);
    if (!task) return;

    // Cria uma cópia atualizada da tarefa com o novo status
    const updatedTask = {
      ...task,
      status: destination.droppableId as Task['status'],
      updatedAt: new Date()
    };

    // Atualiza a lista de tarefas com animação
    setTasks(prevTasks => 
      prevTasks.map(t => t.id === draggableId ? updatedTask : t)
    );
    
    // Feedback visual para o usuário
    const statusLabels: Record<string, string> = {
      'backlog': 'Backlog',
      'todo': 'A Fazer',
      'doing': 'Em Andamento',
      'done': 'Concluído'
    };
    
    const message = `Tarefa "${task.title}" movida para ${statusLabels[destination.droppableId]}`;
    
    // Cria notificação temporária
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-green-100 text-green-800 px-4 py-2 rounded-md shadow-md';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remove notificação após 2 segundos
    setTimeout(() => {
      notification.classList.add('opacity-0', 'transition-opacity', 'duration-500');
      setTimeout(() => document.body.removeChild(notification), 500);
    }, 2000);
  };

  // Componente de cartão de tarefa melhorado para o dashboard
  const TaskCard = ({ task, index, onClick }: { task: Task; index: number; onClick: () => void }) => {
    return (
      <Draggable draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`bg-white task-card draggable-task p-3 rounded shadow-sm border-l-4 mb-2 cursor-pointer hover:shadow-md transition-shadow ${snapshot.isDragging ? 'shadow-lg opacity-90' : ''}`}
            style={{ 
              borderLeftColor: 
                task.priority === 'high' ? '#ef4444' : 
                task.priority === 'medium' ? '#f59e0b' : '#60a5fa',
              ...provided.draggableProps.style
            }}
            onClick={onClick}
          >
            <h4 className="font-medium text-gray-800 text-sm flex items-center justify-between">
              <span>{task.title}</span>
              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                task.priority === 'high' ? 'bg-red-100 text-red-800' :
                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {task.priority === 'high' ? 'Alta' :
                task.priority === 'medium' ? 'Média' : 'Baixa'}
              </span>
            </h4>
            {task.description && (
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">{task.description}</p>
            )}
            
            <div className="flex justify-between items-center mt-2">
              {task.dueDate && (
                <span className="text-xs text-gray-500 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                </span>
              )}
              
              <div className="flex space-x-1">
                <button 
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Passar para a coluna seguinte
                    const statusOrder = ['backlog', 'todo', 'doing', 'done'];
                    const currentIndex = statusOrder.indexOf(task.status);
                    const nextStatus = statusOrder[Math.min(currentIndex + 1, statusOrder.length - 1)];
                    
                    setTasks(prevTasks => 
                      prevTasks.map(t => 
                        t.id === task.id 
                          ? { ...t, status: nextStatus as Task['status'], updatedAt: new Date() } 
                          : t
                      )
                    );
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </Draggable>
    );
  };

  // Componente de modal para adicionar/editar tarefa
  const TaskFormModal = ({ 
    isOpen, 
    onClose,
    initialStatus,
    taskToEdit,
    onSave
  }: { 
    isOpen: boolean;
    onClose: () => void;
    initialStatus: Task['status'];
    taskToEdit?: Task;
    onSave: (taskData: Partial<Task>) => void;
  }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      priority: 'medium' as Task['priority'],
      dueDate: '',
      status: initialStatus
    });

    useEffect(() => {
      if (taskToEdit) {
        setFormData({
          title: taskToEdit.title,
          description: taskToEdit.description || '',
          priority: taskToEdit.priority,
          dueDate: taskToEdit.dueDate ? new Date(taskToEdit.dueDate).toISOString().split('T')[0] : '',
          status: taskToEdit.status
        });
      } else {
        setFormData({
          title: '',
          description: '',
          priority: 'medium' as Task['priority'],
          dueDate: '',
          status: initialStatus
        });
      }
    }, [taskToEdit, initialStatus, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
        
        // Conversão de string para Date
        const taskData = { 
          ...formData,
          dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
          createdBy: user?.id || '',
        };
        
        setTimeout(() => {
          onSave(taskData);
          submitBtn.textContent = 'Salvar';
          submitBtn.disabled = false;
        }, 500);
      } else {
        const taskData = { 
          ...formData,
          dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
          createdBy: user?.id || '',
        };
        onSave(taskData);
      }
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {taskToEdit ? 'Editar Tarefa' : 'Nova Tarefa'}
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
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                      Prioridade
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md"
                    >
                      <option value="low">Baixa</option>
                      <option value="medium">Média</option>
                      <option value="high">Alta</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Vencimento
                    </label>
                    <input
                      type="date"
                      id="dueDate"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md"
                  >
                    <option value="backlog">Backlog</option>
                    <option value="todo">A Fazer</option>
                    <option value="doing">Em Andamento</option>
                    <option value="done">Concluído</option>
                  </select>
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

  // Função para calcular prestadores confirmados
  const getPrestadoresConfirmados = (evento: Evento) => {
    return evento.prestadores.filter(p => p.status === 'confirmado').length;
  };

  // Função para calcular a porcentagem de prestadores confirmados
  const getPrestadoresProgresso = (evento: Evento) => {
    if (!evento.prestadoresNecessarios || evento.prestadoresNecessarios <= 0) return 0;
    const confirmados = getPrestadoresConfirmados(evento);
    return Math.min(100, Math.round((confirmados / evento.prestadoresNecessarios) * 100));
  };

  // Função para obter a cor da barra de progresso
  const getProgressoBarColor = (progresso: number) => {
    if (progresso >= 100) return 'bg-green-500';
    if (progresso >= 75) return 'bg-blue-400';
    if (progresso >= 50) return 'bg-yellow-500';
    if (progresso >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Adicionar função para processar dados do gráfico
  const getEventosPorMes = () => {
    const eventosPorMes = Array(12).fill(0);
    const eventosPorStatus = {
      confirmado: Array(12).fill(0),
      planejamento: Array(12).fill(0),
      negociacao: Array(12).fill(0),
      concluido: Array(12).fill(0),
      cancelado: Array(12).fill(0)
    };
    
    eventos.forEach(evento => {
      const mes = new Date(evento.date).getMonth();
      eventosPorMes[mes]++;
      
      // Contagem por status
      if (evento.status && eventosPorStatus[evento.status as keyof typeof eventosPorStatus]) {
        eventosPorStatus[evento.status as keyof typeof eventosPorStatus][mes]++;
      }
    });

    const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    if (tipoGrafico === 'pie') {
      // Para gráfico de pizza, usamos o total por mês
      return {
        labels,
        datasets: [
          {
            label: 'Eventos por Mês',
            data: eventosPorMes,
            backgroundColor: [
              'rgba(255, 99, 132, 0.7)',
              'rgba(54, 162, 235, 0.7)',
              'rgba(255, 206, 86, 0.7)',
              'rgba(75, 192, 192, 0.7)',
              'rgba(153, 102, 255, 0.7)',
              'rgba(255, 159, 64, 0.7)',
              'rgba(255, 99, 132, 0.7)',
              'rgba(54, 162, 235, 0.7)',
              'rgba(255, 206, 86, 0.7)',
              'rgba(75, 192, 192, 0.7)',
              'rgba(153, 102, 255, 0.7)',
              'rgba(255, 159, 64, 0.7)',
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 206, 86)',
              'rgb(75, 192, 192)',
              'rgb(153, 102, 255)',
              'rgb(255, 159, 64)',
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 206, 86)',
              'rgb(75, 192, 192)',
              'rgb(153, 102, 255)',
              'rgb(255, 159, 64)',
            ],
            borderWidth: 1,
          },
        ],
      };
    } else if (tipoGrafico === 'line') {
      // Para gráfico de linhas, podemos mostrar a evolução por status
      return {
        labels,
        datasets: [
          {
            label: 'Confirmados',
            data: eventosPorStatus.confirmado,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 2,
            tension: 0.3,
            fill: false,
          },
          {
            label: 'Em Planejamento',
            data: eventosPorStatus.planejamento,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 2,
            tension: 0.3,
            fill: false,
          },
          {
            label: 'Em Negociação',
            data: eventosPorStatus.negociacao,
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderColor: 'rgb(255, 206, 86)',
            borderWidth: 2,
            tension: 0.3,
            fill: false,
          },
          {
            label: 'Concluídos',
            data: eventosPorStatus.concluido,
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgb(153, 102, 255)',
            borderWidth: 2,
            tension: 0.3,
            fill: false,
          },
        ],
      };
    } else {
      // Gráfico de barras (padrão)
      return {
        labels,
        datasets: [
          {
            label: 'Eventos por Mês',
            data: eventosPorMes,
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 1,
            barPercentage: 0.6,
            categoryPercentage: 0.7,
            borderRadius: 4,
          },
        ],
      };
    }
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
              <h2 className="text-xl font-semibold text-gray-800">Meus Eventos</h2>
              <div className="flex space-x-2">
                <button 
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition flex items-center"
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

            {/* Filtros e visualização */}
            <div className="bg-white shadow rounded-lg mb-6 p-4">
              <div className="flex flex-wrap items-center justify-between">
                <div className="flex space-x-4 mb-4 sm:mb-0">
                  <button 
                    className={`px-3 py-1 rounded-full ${filtroStatus === 'todos' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800 hover:bg-blue-50 hover:text-blue-600'}`}
                    onClick={() => setFiltroStatus('todos')}
                  >
                    Todos
                  </button>
                  <button 
                    className={`px-3 py-1 rounded-full ${filtroStatus === 'confirmado' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800 hover:bg-green-50 hover:text-green-600'}`}
                    onClick={() => setFiltroStatus('confirmado')}
                  >
                    Confirmados
                  </button>
                  <button 
                    className={`px-3 py-1 rounded-full ${filtroStatus === 'planejamento' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800 hover:bg-yellow-50 hover:text-yellow-600'}`}
                    onClick={() => setFiltroStatus('planejamento')}
                  >
                    Em planejamento
                  </button>
                  <button 
                    className={`px-3 py-1 rounded-full ${filtroStatus === 'concluido' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800 hover:bg-purple-50 hover:text-purple-600'}`}
                    onClick={() => setFiltroStatus('concluido')}
                  >
                    Concluídos
                  </button>
                </div>
                <div className="flex space-x-2">
                  <button 
                    className={`px-3 py-1 rounded-md flex items-center ${visualizacao === 'cards' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    onClick={() => setVisualizacao('cards')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Cards
                  </button>
                  <button 
                    className={`px-3 py-1 rounded-md flex items-center ${visualizacao === 'calendario' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    onClick={() => setVisualizacao('calendario')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Calendário
                  </button>
                </div>
              </div>
            </div>

            {/* Lista de eventos - Visualização em Cards */}
            {visualizacao === 'cards' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {eventosFiltrados.map((evento) => (
                  <div 
                    key={evento.id} 
                    className={`event-card bg-gray-800 shadow-lg rounded-lg overflow-hidden cursor-pointer hover:shadow-xl border border-gray-700 transition-all duration-200 status-${evento.status} animate-fade-in`}
                    onClick={() => verDetalhesEvento(evento.id)}
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-100 truncate max-w-[200px]">{evento.title}</h3>
                          <div className="flex items-center text-gray-400 text-sm mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(evento.date).toLocaleDateString('pt-BR')}
                            <span className="mx-1">•</span>
                            <span className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {evento.startTime} - {evento.endTime}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm text-gray-300 flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="truncate max-w-[230px]">{evento.location}</span>
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-700">
                        <div className="flex-col space-y-2 w-full">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              <span className="text-xs text-gray-400">Prestadores:</span>
                            </div>
                            <span className="text-xs font-medium">
                              <span className={`${getPrestadoresConfirmados(evento) >= (evento.prestadoresNecessarios || 0) ? 'text-green-400' : 'text-blue-400'}`}>
                                {getPrestadoresConfirmados(evento)}
                              </span>
                              <span className="text-gray-500">/</span>
                              <span className="text-gray-400">{evento.prestadoresNecessarios || 0}</span>
                            </span>
                          </div>
                          
                          {/* Barra de progresso */}
                          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                            <div 
                              className={`h-2 rounded-full ${getProgressoBarColor(getPrestadoresProgresso(evento))}`} 
                              style={{ width: `${getPrestadoresProgresso(evento)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Card para adicionar novo evento */}
                <div 
                  className="event-card-new bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg overflow-hidden cursor-pointer hover:border-blue-400 hover:shadow-md transition-all flex flex-col items-center justify-center p-8"
                  onClick={criarNovoEvento}
                >
                  <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center text-blue-400 mb-4 transform transition-transform hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-200">Novo Evento</h3>
                  <p className="text-gray-400 text-sm text-center mt-2">
                    Clique para criar um novo evento de fisioterapia
                  </p>
                </div>
              </div>
            )}

            {/* Lista de eventos - Visualização em Calendário */}
            {visualizacao === 'calendario' && (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-lg font-medium text-gray-900">Calendário de Eventos</h3>
                    <span className="text-gray-600">
                      {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={prevMonth}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setCurrentDate(new Date())}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                    >
                      Hoje
                    </button>
                    <button
                      onClick={nextMonth}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-7 gap-px bg-gray-200">
                    {/* Cabeçalho dos dias da semana */}
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((dia, index) => (
                      <div key={index} className="bg-gray-100 py-2 text-center text-sm font-medium text-gray-700">
                        {dia}
                      </div>
                    ))}
                    
                    {/* Dias do mês */}
                    {Array.from({ length: 42 }).map((_, index) => {
                      const { firstDay, totalDays } = getMonthData();
                      const day = index - firstDay + 1;
                      const isCurrentMonth = day > 0 && day <= totalDays;
                      
                      // Eventos para este dia
                      const eventosNoDia = eventosFiltrados.filter(evento => {
                        if (!isCurrentMonth) return false;
                        const eventDate = new Date(evento.date);
                        return day === eventDate.getDate() && 
                               eventDate.getMonth() === currentDate.getMonth() &&
                               eventDate.getFullYear() === currentDate.getFullYear();
                      });
                      
                      // Determinar a cor de fundo com base no status do evento mais importante
                      // (confirmado > emAndamento > planejamento > concluido > cancelado)
                      let dayClassName = "";
                      let borderClass = "";
                      
                      if (eventosNoDia.length > 0) {
                        // Prioridade dos status para destacar
                        const statusPriorities = {
                          'confirmado': 1,
                          'emAndamento': 2,
                          'planejamento': 3,
                          'concluido': 4,
                          'cancelado': 5,
                          'inativo': 6
                        };
                        
                        // Encontrar o evento com status de maior prioridade
                        const eventoDestaque = eventosNoDia.reduce((prev, current) => {
                          return statusPriorities[prev.status] < statusPriorities[current.status] ? prev : current;
                        });
                        
                        // Definir as classes baseadas no status
                        switch (eventoDestaque.status) {
                          case 'confirmado':
                            dayClassName = "hover:bg-green-50";
                            borderClass = "border-t-2 border-green-500";
                            break;
                          case 'emAndamento':
                            dayClassName = "hover:bg-yellow-50";
                            borderClass = "border-t-2 border-yellow-500";
                            break;
                          case 'planejamento':
                            dayClassName = "hover:bg-blue-50";
                            borderClass = "border-t-2 border-blue-500";
                            break;
                          case 'concluido':
                            dayClassName = "hover:bg-purple-50";
                            borderClass = "border-t-2 border-purple-500";
                            break;
                          case 'cancelado':
                            dayClassName = "hover:bg-red-50";
                            borderClass = "border-t-2 border-red-500";
                            break;
                          default:
                            dayClassName = "hover:bg-gray-50";
                            borderClass = "";
                        }
                      }
                      
                      return (
                        <div key={index} className={`bg-white min-h-24 p-2 ${
                          !isCurrentMonth ? 'bg-gray-50 text-gray-400' : 
                          eventosNoDia.length > 0 ? `${dayClassName} ${borderClass} cursor-pointer` : ''
                        }`}>
                          <div className={`text-right text-sm mb-1 ${
                            !isCurrentMonth ? 'text-gray-400' :
                            eventosNoDia.length > 0 ? 'font-medium' : 'text-gray-500'
                          }`}>
                            {isCurrentMonth ? day : ''}
                          </div>
                          
                          {/* Exibir eventos do dia */}
                          {eventosNoDia.map((evento, idx) => (
                            <div 
                              key={idx}
                              className={`text-xs p-1.5 mb-1 rounded truncate ${
                                evento.status === 'confirmado' ? 'bg-green-100 text-green-800 border-l-4 border-green-500' :
                                evento.status === 'planejamento' ? 'bg-blue-100 text-blue-800 border-l-4 border-blue-500' :
                                evento.status === 'emAndamento' ? 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500' :
                                evento.status === 'concluido' ? 'bg-purple-100 text-purple-800 border-l-4 border-purple-500' :
                                evento.status === 'cancelado' ? 'bg-red-100 text-red-800 border-l-4 border-red-500' :
                                'bg-gray-100 text-gray-800 border-l-4 border-gray-500'
                              }`}
                              onClick={() => verDetalhesEvento(evento.id)}
                            >
                              <div className="font-medium">{evento.title}</div>
                              <div className="text-[10px] mt-0.5">{evento.startTime} - {evento.endTime}</div>
                            </div>
                          ))}
                          
                          {/* Indicador de múltiplos eventos */}
                          {eventosNoDia.length > 2 && (
                            <div className="text-xs text-center mt-1 font-medium text-blue-600">
                              + {eventosNoDia.length - 2} mais eventos
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Gráfico movido para a parte inferior */}
            <div className="mt-8">
              <div className="bg-white shadow rounded-lg">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Distribuição de Eventos por Mês</h3>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setTipoGrafico('bar')} 
                        className={`px-3 py-1.5 rounded text-sm flex items-center ${tipoGrafico === 'bar' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4M9 4v16M15 4v16" />
                        </svg>
                        Barras
                      </button>
                      <button 
                        onClick={() => setTipoGrafico('line')} 
                        className={`px-3 py-1.5 rounded text-sm flex items-center ${tipoGrafico === 'line' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                        </svg>
                        Linhas
                      </button>
                      <button 
                        onClick={() => setTipoGrafico('pie')} 
                        className={`px-3 py-1.5 rounded text-sm flex items-center ${tipoGrafico === 'pie' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v10l4.45 4.45" />
                        </svg>
                        Pizza
                      </button>
                    </div>
                  </div>
                  <div className="h-72">
                    {tipoGrafico === 'bar' && (
                      <Bar
                        data={getEventosPorMes()}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: true,
                              position: 'top',
                            },
                            title: {
                              display: false,
                            },
                            tooltip: {
                              callbacks: {
                                label: function(context) {
                                  return `${context.dataset.label}: ${context.raw} eventos`;
                                }
                              }
                            }
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              ticks: {
                                precision: 0,
                                callback: function(value) {
                                  return value + (Number(value) === 1 ? ' evento' : ' eventos');
                                }
                              },
                              title: {
                                display: true,
                                text: 'Número de Eventos'
                              }
                            },
                            x: {
                              title: {
                                display: true,
                                text: 'Mês'
                              }
                            }
                          },
                          animation: {
                            duration: 1000,
                            easing: 'easeOutQuart'
                          }
                        }}
                      />
                    )}
                    {tipoGrafico === 'line' && (
                      <Line
                        data={getEventosPorMes()}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: true,
                              position: 'top',
                            },
                            tooltip: {
                              callbacks: {
                                label: function(context) {
                                  return `${context.dataset.label}: ${context.raw} eventos`;
                                }
                              }
                            }
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              ticks: {
                                precision: 0
                              },
                              title: {
                                display: true,
                                text: 'Número de Eventos'
                              }
                            },
                            x: {
                              title: {
                                display: true,
                                text: 'Mês'
                              }
                            }
                          },
                          animation: {
                            duration: 1000,
                            easing: 'easeOutQuart'
                          }
                        }}
                      />
                    )}
                    {tipoGrafico === 'pie' && (
                      <Pie
                        data={getEventosPorMes()}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: true,
                              position: 'right',
                            },
                            tooltip: {
                              callbacks: {
                                label: function(context) {
                                  return `${context.label}: ${context.raw} eventos`;
                                }
                              }
                            }
                          },
                          animation: {
                            animateScale: true,
                            animateRotate: true,
                            duration: 1000,
                            easing: 'easeOutQuart'
                          }
                        }}
                      />
                    )}
                  </div>
                  <div className="mt-4 text-sm text-gray-500 text-center">
                    {tipoGrafico === 'bar' && 'Visualize a quantidade total de eventos por mês'}
                    {tipoGrafico === 'line' && 'Compare a distribuição de eventos por status ao longo do ano'}
                    {tipoGrafico === 'pie' && 'Veja a proporção de eventos entre os meses do ano'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Minhas Tarefas</h2>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                onClick={() => handleAddTask('todo')}
              >
                Nova Tarefa
              </button>
            </div>

            {/* Sistema estilo Trello */}
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="flex space-x-4 pb-6 overflow-x-auto">
                {/* Coluna: Backlog */}
                <div className="flex-shrink-0 w-72">
                  <div className="bg-gray-800 rounded-lg shadow-lg p-3 h-full border border-gray-700">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium text-gray-200 px-2">Backlog</h3>
                      <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
                        {tasks.filter(task => task.status === 'backlog').length}
                      </span>
                    </div>
                    
                    <Droppable droppableId="backlog">
                      {(provided) => (
                        <div 
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto min-h-[150px] p-1"
                        >
                          {tasks
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
                <div className="flex-shrink-0 w-72">
                  <div className="bg-gray-100 rounded-lg shadow p-3 h-full">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium text-gray-800 px-2">A Fazer</h3>
                      <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                        {tasks.filter(task => task.status === 'todo').length}
                      </span>
                    </div>
                    
                    <Droppable droppableId="todo">
                      {(provided) => (
                        <div 
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto min-h-[150px] p-1"
                        >
                          {tasks
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
                      className="mt-3 w-full py-2 text-gray-600 hover:text-gray-900 bg-white rounded-md border border-gray-300 flex items-center justify-center text-sm"
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
                <div className="flex-shrink-0 w-72">
                  <div className="bg-gray-100 rounded-lg shadow p-3 h-full">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium text-gray-800 px-2">Em Andamento</h3>
                      <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                        {tasks.filter(task => task.status === 'doing').length}
                      </span>
                    </div>
                    
                    <Droppable droppableId="doing">
                      {(provided) => (
                        <div 
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto min-h-[150px] p-1"
                        >
                          {tasks
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
                      className="mt-3 w-full py-2 text-gray-600 hover:text-gray-900 bg-white rounded-md border border-gray-300 flex items-center justify-center text-sm"
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
                <div className="flex-shrink-0 w-72">
                  <div className="bg-gray-100 rounded-lg shadow p-3 h-full">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium text-gray-800 px-2">Concluído</h3>
                      <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                        {tasks.filter(task => task.status === 'done').length}
                      </span>
                    </div>
                    
                    <Droppable droppableId="done">
                      {(provided) => (
                        <div 
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto min-h-[150px] p-1"
                        >
                          {tasks
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
                      className="mt-3 w-full py-2 text-gray-600 hover:text-gray-900 bg-white rounded-md border border-gray-300 flex items-center justify-center text-sm"
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