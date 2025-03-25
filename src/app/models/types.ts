// Modelo para usuário
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'prestador' | 'usuario';
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

// Modelo para o prestador de serviço
export interface Prestador {
  id: string;
  userId: string;
  skills: string[];
  bio: string;
  available: boolean;
  rating: number;
  specialties: string[];
  hourlyRate: number;
  bankInfo?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Modelo para empresa cliente
export interface Empresa {
  id: string;
  name: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

// Modelo para evento
export interface Evento {
  id: string;
  title: string;
  empresaId: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  status: 'planejamento' | 'confirmado' | 'emAndamento' | 'concluido' | 'cancelado' | 'inativo';
  responsibleName: string;
  responsibleContact: string;
  prestadoresNecessarios?: number;
  mediaParticipantes?: number; // Média de participantes esperados
  arquivado?: boolean; // Indica se o evento está arquivado
  dataConclusao?: Date; // Data em que o evento foi concluído
  createdAt: Date;
  updatedAt: Date;
  prestadores: EventoPrestador[];
  items: EventoItem[];
  logs: EventoLog[];
}

// Modelo para prestador associado a um evento
export interface EventoPrestador {
  id: string;
  eventoId: string;
  prestadorId: string;
  status: 'pendente' | 'confirmado' | 'recusado';
  value: number;
  observations?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Modelo para itens do evento
export interface EventoItem {
  id: string;
  eventoId: string;
  name: string;
  quantity: number;
  unitValue: number;
  isOwned: boolean; // Indica se já possui o item ou precisará alugar/comprar
  fornecedor?: string; // Nome do fornecedor quando o item não é próprio
  observations?: string;
  prepared?: boolean; // Indica se o item está preparado para o evento
  createdAt: Date;
  updatedAt: Date;
}

// Modelo para logs do evento
export interface EventoLog {
  id: string;
  eventoId: string;
  userId: string;
  action: string;
  details: string;
  createdAt: Date;
}

// Modelo para tarefa (sistema de Trello)
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'backlog' | 'todo' | 'doing' | 'done' | 'archived';
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  assigneeId?: string;
  eventoId?: string; // Opcional, para vincular a um evento
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Modelo para logs de auditoria
export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: 'user' | 'prestador' | 'empresa' | 'evento' | 'task';
  entityId: string;
  details: string;
  createdAt: Date;
} 