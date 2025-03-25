import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Task } from '../models/types';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Interface para o formulário de tarefa
interface TaskFormData {
  title?: string;
  description?: string;
  status?: Task['status'];
  priority?: Task['priority'];
  dueDate?: Date;
  assigneeId?: string;
  eventoId?: string;
}

// Componente de cartão de tarefa
const TaskCard = ({ task, index, onClick }: { task: Task; index: number; onClick: () => void }) => {
  const [expanded, setExpanded] = useState(false);
  const [swipeDistance, setSwipeDistance] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [showSwipeIndicator, setShowSwipeIndicator] = useState(false);
  
  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  // Manipuladores de eventos de toque para swipe horizontal
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setShowSwipeIndicator(true);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartX) return;
    
    const currentX = e.touches[0].clientX;
    const distance = currentX - touchStartX;
    
    // Limitar o deslizamento a uma distância razoável
    const maxSwipe = 100;
    const limitedDistance = Math.max(Math.min(distance, maxSwipe), -maxSwipe);
    
    setSwipeDistance(limitedDistance);
  };
  
  const handleTouchEnd = () => {
    setShowSwipeIndicator(false);
    
    // Determinar direção do swipe para mudar status
    const statusOrder = ['backlog', 'todo', 'doing', 'done'];
    const currentIndex = statusOrder.indexOf(task.status);
    const swipeThreshold = 50; // pixels mínimos para considerar um swipe
    
    if (Math.abs(swipeDistance) >= swipeThreshold) {
      // Determinar o próximo status com base na direção do swipe
      let nextIndex;
      
      if (swipeDistance > 0) {
        // Swipe para direita (mover para status anterior)
        nextIndex = Math.max(0, currentIndex - 1);
      } else {
        // Swipe para esquerda (mover para próximo status)
        nextIndex = Math.min(statusOrder.length - 1, currentIndex + 1);
      }
      
      if (nextIndex !== currentIndex) {
        const nextStatus = statusOrder[nextIndex] as Task['status'];
        const statusLabels: Record<Task['status'], string> = {
          'backlog': 'Backlog',
          'todo': 'A Fazer',
          'doing': 'Em Andamento',
          'done': 'Concluído',
          'archived': 'Arquivado'
        };
        
        // Buscar as tarefas para atualizar (via contexto global ou outro meio)
        // Esta é uma simulação da atualização de estado
        const event = new CustomEvent('updateTaskStatus', {
          detail: {
            taskId: task.id,
            newStatus: nextStatus,
            message: `Tarefa "${task.title}" movida para ${statusLabels[nextStatus]}`
          }
        });
        window.dispatchEvent(event);
      }
    }
    
    // Resetar o swipe
    setSwipeDistance(0);
    setTouchStartX(0);
  };
  
  useEffect(() => {
    // Manipulador de eventos para atualizar o status da tarefa
    const handleUpdateTaskStatus = (event: CustomEvent<{ taskId: string; newStatus: string; message: string }>) => {
      const { taskId, newStatus, message } = event.detail;
      
      if (taskId === task.id) {
        // Feedback visual
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-4 right-4 bg-blue-100 text-blue-800 px-4 py-2 rounded-md shadow-md z-50';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Remove notificação após 2 segundos
        setTimeout(() => {
          notification.classList.add('opacity-0', 'transition-opacity', 'duration-500');
          setTimeout(() => document.body.removeChild(notification), 500);
        }, 2000);
      }
    };
    
    // Adicionar listener do evento
    window.addEventListener('updateTaskStatus', handleUpdateTaskStatus as EventListener);
    
    // Limpar listener
    return () => {
      window.removeEventListener('updateTaskStatus', handleUpdateTaskStatus as EventListener);
    };
  }, [task.id]);
  
  // Calcular o indicador visual de próximo status
  const getNextStatusIndicator = () => {
    if (!showSwipeIndicator || Math.abs(swipeDistance) < 20) return null;
    
    const statusOrder = ['backlog', 'todo', 'doing', 'done'];
    const currentIndex = statusOrder.indexOf(task.status);
    
    let nextStatus: Task['status'] | null = null;
    let direction: 'left' | 'right' | null = null;
    
    if (swipeDistance > 0 && currentIndex > 0) {
      // Swipe para direita (status anterior)
      nextStatus = statusOrder[currentIndex - 1] as Task['status'];
      direction = 'left';
    } else if (swipeDistance < 0 && currentIndex < statusOrder.length - 1) {
      // Swipe para esquerda (próximo status)
      nextStatus = statusOrder[currentIndex + 1] as Task['status'];
      direction = 'right';
    } else {
      return null;
    }
    
    const statusLabels: Record<Task['status'], string> = {
      'backlog': 'Backlog',
      'todo': 'A Fazer',
      'doing': 'Em Andamento',
      'done': 'Concluído',
      'archived': 'Arquivado'
    };
    
    const colors: Record<Task['status'], string> = {
      'backlog': 'bg-gray-600 text-gray-100',
      'todo': 'bg-blue-600 text-blue-100',
      'doing': 'bg-yellow-600 text-yellow-100',
      'done': 'bg-green-600 text-green-100',
      'archived': 'bg-purple-600 text-purple-100'
    };
    
    return (
      <div className={`absolute ${direction === 'left' ? 'left-0' : 'right-0'} top-1/2 transform -translate-y-1/2 ${direction === 'left' ? '-translate-x-1/2' : 'translate-x-1/2'} ${colors[nextStatus]} px-2 py-1 rounded-md text-xs opacity-90 z-10 transition-opacity duration-200 animate-pulse`}>
        {statusLabels[nextStatus]}
        <span className="ml-1">
          {direction === 'left' ? '←' : '→'}
        </span>
      </div>
    );
  };
  
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`relative bg-white task-card draggable-task p-3 rounded shadow-sm border-l-4 mb-3 cursor-grab hover:shadow-md transition-all ${
            snapshot.isDragging ? 'shadow-lg opacity-90 rotate-1 scale-105' : ''
          }`}
          style={{ 
            borderLeftColor: 
              task.priority === 'high' ? '#ef4444' : 
              task.priority === 'medium' ? '#f59e0b' : '#60a5fa',
            transform: `${provided.draggableProps.style?.transform} translateX(${swipeDistance}px)`,
            transition: swipeDistance !== 0 ? 'none' : provided.draggableProps.style?.transition,
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {getNextStatusIndicator()}
          
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <div {...provided.dragHandleProps} className="flex items-center gap-2 mb-1">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
                <h4 className="font-medium text-gray-800 truncate pr-1">{task.title}</h4>
              </div>
              
              {!expanded && task.description && (
                <div 
                  className="text-sm text-gray-600 line-clamp-1"
                  dangerouslySetInnerHTML={{ __html: task.description }}
                />
              )}
            </div>
            
            <div className="flex items-center space-x-1 ml-2">
              <button 
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                onClick={toggleExpand}
              >
                {expanded ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>
              <button 
                className="p-1 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50"
                onClick={onClick}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Conteúdo expandido */}
          {expanded && (
            <div className="mt-2 space-y-2 text-sm">
              {task.description && (
                <div 
                  className="text-gray-600 whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: task.description }}
                />
              )}
              
              <div className="flex flex-col gap-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Prioridade:</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    task.priority === 'high' ? 'bg-red-100 text-red-800' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {task.priority === 'high' ? 'Alta' :
                    task.priority === 'medium' ? 'Média' : 'Baixa'}
                  </span>
                </div>
                
                {task.dueDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Vencimento:</span>
                    <span className="text-gray-700">
                      {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    task.status === 'backlog' ? 'bg-gray-100 text-gray-800' :
                    task.status === 'todo' ? 'bg-blue-100 text-blue-800' :
                    task.status === 'doing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.status === 'backlog' ? 'Backlog' :
                    task.status === 'todo' ? 'A Fazer' :
                    task.status === 'doing' ? 'Em Andamento' : 'Concluído'}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-end space-x-1 mt-2 pt-2 border-t">
                <button 
                  className="p-1 rounded-md text-xs bg-blue-50 text-blue-700 hover:bg-blue-100"
                  onClick={onClick}
                >
                  Editar
                </button>
              </div>
            </div>
          )}
          
          {!expanded && (
            <div className="flex justify-between items-center mt-3">
              <span className={`text-xs px-2 py-1 rounded-full ${
                task.priority === 'high' ? 'bg-red-100 text-red-800' :
                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {task.priority === 'high' ? 'Alta' :
                task.priority === 'medium' ? 'Média' : 'Baixa'}
              </span>
              
              {task.dueDate && (
                <span className="text-xs text-gray-500 flex items-center">
                  <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                </span>
              )}
            </div>
          )}
          
          {/* Dica de arrastar horizontalmente - só aparece em telas de toque */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-center">
            <div className="text-xs text-blue-500 opacity-50 pb-1 touch-hint">
              ← deslize para mover →
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

// Componente de coluna
const Column = ({ 
  title, 
  tasks, 
  status,
  onAddTask,
  onTaskClick
}: { 
  title: string;
  tasks: Task[];
  status: Task['status'];
  onAddTask: (status: Task['status']) => void;
  onTaskClick: (task: Task) => void;
}) => {
  return (
    <div className="flex-shrink-0 w-80 task-column">
      <div className="bg-gray-100 rounded-lg shadow p-3 h-full">
        <div className="flex justify-between items-center mb-3 column-header">
          <h3 className="font-medium text-gray-800 px-2">{title}</h3>
          <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
            {tasks.length}
          </span>
        </div>
        
        <Droppable droppableId={status}>
          {(provided, snapshot) => (
            <div 
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto min-h-[200px] p-2 rounded transition-all ${
                snapshot.isDraggingOver ? 'column-drag-over' : ''
              } ${snapshot.draggingFromThisWith ? 'column-droppable-active' : ''}`}
            >
              {tasks.map((task, index) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  index={index}
                  onClick={() => onTaskClick(task)}
                />
              ))}
              {provided.placeholder}
              
              {tasks.length === 0 && !snapshot.isDraggingOver && (
                <div className="flex flex-col items-center justify-center text-center h-24 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <p className="text-sm">Arraste tarefas para esta coluna ou</p>
                  <button 
                    onClick={() => onAddTask(status)}
                    className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    + Adicionar nova tarefa
                  </button>
                </div>
              )}
            </div>
          )}
        </Droppable>
        
        <button 
          className="mt-3 w-full py-2 text-gray-600 hover:text-gray-900 bg-white rounded-md border border-gray-300 flex items-center justify-center text-sm"
          onClick={() => onAddTask(status)}
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Adicionar Tarefa
        </button>
      </div>
    </div>
  );
};

// Componente modal para adicionar/editar tarefa
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleEditorChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      description: value
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
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined 
      };
      
      setTimeout(() => {
        onSave(taskData);
        submitBtn.textContent = 'Salvar';
        submitBtn.disabled = false;
      }, 500);
    } else {
      const taskData = { 
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined 
      };
      onSave(taskData);
    }
  };

  // Módulos e formatos do editor de texto rico
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };
  
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
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
                <div className="quill-editor-container">
                  <ReactQuill
                    theme="snow"
                    value={formData.description}
                    onChange={handleEditorChange}
                    modules={modules}
                    formats={formats}
                    className="bg-white"
                  />
                </div>
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
                Salvar Tarefa
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Componente principal da página de Tarefas
export function TarefasPage() {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [initialTaskStatus, setInitialTaskStatus] = useState<Task['status']>('todo');
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const [activeFilter, setActiveFilter] = useState<string>('todas');
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [movingTaskNotification, setMovingTaskNotification] = useState<{show: boolean, message: string}>({show: false, message: ''});
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<Task['priority'] | 'all'>('all');
  
  // Mock de tarefas
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Comprar óleo para massagem',
      description: 'Para o evento da XYZ que acontecerá na próxima semana',
      status: 'backlog',
      priority: 'high',
      dueDate: new Date('2025-04-12'),
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
      dueDate: new Date('2025-04-10'),
      createdBy: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      title: 'Reservar transporte',
      description: 'Para levar equipamentos ao evento',
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
      dueDate: new Date('2025-04-05'),
      createdBy: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const handleAddTask = (status: Task['status']) => {
    setSelectedTask(undefined);
    setInitialTaskStatus(status);
    setModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setInitialTaskStatus(task.status);
    setModalOpen(true);
  };

  // Função para salvar a tarefa
  const handleSaveTask = (taskData: TaskFormData) => {
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
      setAlertMessage("Tarefa atualizada com sucesso!");
      setShowAlert(true);
    } else {
      // Adicionar nova tarefa
      const newTask: Task = {
        id: Date.now().toString(),
        title: taskData.title || '',
        description: taskData.description,
        status: taskData.status || 'todo',
        dueDate: taskData.dueDate,
        priority: taskData.priority || 'medium',
        assigneeId: taskData.assigneeId,
        eventoId: taskData.eventoId,
        createdBy: '1', // ID do usuário atual simulado
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setTasks(prevTasks => [...prevTasks, newTask]);
      setAlertMessage("Nova tarefa adicionada com sucesso!");
      setShowAlert(true);
    }
    
    setModalOpen(false);
  };

  // Função para lidar com o fim do arrasto
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    
    // Se não houver destino ou se a origem for igual ao destino, não faz nada
    if (!destination || 
        (source.droppableId === destination.droppableId && 
         source.index === destination.index)) {
      return;
    }
    
    // Encontrar a tarefa que foi arrastada
    const tasksList = [...tasks];
    const sourceStatus = source.droppableId as Task['status'];
    const destStatus = destination.droppableId as Task['status'];
    
    // Filtrar tarefas pelo status da origem
    const sourceTasks = tasksList.filter(task => task.status === sourceStatus);
    
    // Obter a tarefa que está sendo movida
    const [movedTask] = sourceTasks.splice(source.index, 1);
    
    // Mostrar notificação
    const statusLabels: {[key in Task['status']]: string} = {
      backlog: 'Backlog',
      todo: 'A Fazer',
      doing: 'Em Andamento',
      done: 'Concluído',
      archived: 'Arquivado'
    };
    
    setMovingTaskNotification({
      show: true,
      message: `Tarefa "${movedTask.title}" movida para "${statusLabels[destStatus]}"`
    });
    
    setTimeout(() => {
      setMovingTaskNotification({show: false, message: ''});
    }, 3000);
    
    // Atualizar o status da tarefa
    movedTask.status = destStatus;
    movedTask.updatedAt = new Date();
    
    // Recriar a lista de tarefas
    const updatedTasks = tasksList.filter(task => task.id !== movedTask.id);
    updatedTasks.push(movedTask);
    
    setTasks(updatedTasks);
  };

  // Função para aplicar filtros nas tarefas
  const applyFilters = (taskList: Task[]) => {
    return taskList.filter(task => {
      // Filtrar por termo de busca
      const matchesSearchTerm = searchTerm.trim() === '' || 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Filtrar por prioridade
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
      
      return matchesSearchTerm && matchesPriority;
    });
  };

  // Aplicar filtros a todas as tarefas
  const filteredTasks = applyFilters(tasks);
  const backlogTasks = filteredTasks.filter(task => task.status === 'backlog');
  const todoTasks = filteredTasks.filter(task => task.status === 'todo');
  const doingTasks = filteredTasks.filter(task => task.status === 'doing');
  const doneTasks = filteredTasks.filter(task => task.status === 'done');

  return (
    <div className="min-h-screen bg-gray-50 pt-5 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="sm:flex sm:justify-between sm:items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Tarefas</h1>
            
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="w-full sm:w-auto flex flex-wrap gap-2 filters-container">
                <div className="relative w-full sm:w-auto mb-3 sm:mb-0">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full sm:w-64 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Buscar tarefas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <select
                  className="form-select rounded-md border-gray-300 py-2 pl-3 pr-10 text-base filter-button"
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value as Task['priority'] | 'all')}
                >
                  <option value="all">Todas prioridades</option>
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                </select>
                
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  onClick={() => handleAddTask('todo')}
                >
                  Nova Tarefa
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex space-x-4 overflow-x-auto pb-6 task-columns-container">
            <Column
              title="Backlog"
              tasks={filteredTasks.filter(task => task.status === 'backlog')}
              status="backlog"
              onAddTask={handleAddTask}
              onTaskClick={handleEditTask}
            />
            
            <Column
              title="A Fazer"
              tasks={filteredTasks.filter(task => task.status === 'todo')}
              status="todo"
              onAddTask={handleAddTask}
              onTaskClick={handleEditTask}
            />
            
            <Column
              title="Em Andamento"
              tasks={filteredTasks.filter(task => task.status === 'doing')}
              status="doing"
              onAddTask={handleAddTask}
              onTaskClick={handleEditTask}
            />
            
            <Column
              title="Concluído"
              tasks={filteredTasks.filter(task => task.status === 'done')}
              status="done"
              onAddTask={handleAddTask}
              onTaskClick={handleEditTask}
            />
          </div>
        </DragDropContext>
        
        {/* Dica de rolagem horizontal (visível apenas em dispositivos móveis) */}
        <div className="text-center text-sm text-gray-500 mt-4 md:hidden">
          <span>← Deslize para ver mais colunas →</span>
        </div>
      </div>
      
      {modalOpen && (
        <TaskFormModal 
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          initialStatus={initialTaskStatus}
          taskToEdit={selectedTask}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
} 