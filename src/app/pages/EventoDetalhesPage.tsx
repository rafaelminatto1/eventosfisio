import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Evento, EventoPrestador, EventoItem } from '../models/types';
import { useNavigate } from 'react-router-dom';

// Componente para página de detalhes do evento
export function EventoDetalhesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [showPrestadorModal, setShowPrestadorModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPrestador, setSelectedPrestador] = useState<EventoPrestador | null>(null);
  const [selectedItem, setSelectedItem] = useState<EventoItem | null>(null);
  const [editandoDescricao, setEditandoDescricao] = useState(false);
  const [descricaoTemp, setDescricaoTemp] = useState('');
  const [itensPreparados, setItensPreparados] = useState<boolean>(false);
  
  // Mock de dados de evento para demonstração
  const [evento, setEvento] = useState<Evento>({
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
      }
    ],
    logs: []
  });
  
  // Estado para o formulário de edição
  const [formDataEdit, setFormDataEdit] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    responsibleName: '',
    responsibleContact: '',
    prestadoresNecessarios: 0,
    status: '',
    mediaParticipantes: 0,
  });
  
  // Verificar se todos os itens estão preparados
  const todosItensPreparados = evento.items.length > 0 && evento.items.every(item => item.prepared);
  
  // Função para marcar/desmarcar todos os itens como preparados
  const toggleTodosItensPreparados = () => {
    const novoValor = !todosItensPreparados;
    setEvento(prev => ({
      ...prev,
      items: prev.items.map(item => ({
        ...item,
        prepared: novoValor
      }))
    }));
    
    mostrarAlerta(novoValor 
      ? "Todos os itens foram marcados como preparados!" 
      : "Todos os itens foram desmarcados como preparados!"
    );
  };
  
  // Atualizar dados do formulário quando o evento mudar
  useEffect(() => {
    if (evento) {
      setDescricaoTemp(evento.description);
      setFormDataEdit({
        title: evento.title,
        date: evento.date.toISOString().split('T')[0],
        startTime: evento.startTime,
        endTime: evento.endTime,
        location: evento.location,
        responsibleName: evento.responsibleName,
        responsibleContact: evento.responsibleContact,
        prestadoresNecessarios: evento.prestadoresNecessarios || 0,
        status: evento.status,
        mediaParticipantes: evento.mediaParticipantes || 0,
      });
    }
  }, [evento]);

  // Função para lidar com mudanças no formulário de edição
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormDataEdit(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value
    }));
  };

  // Função para salvar as edições do evento
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Atualizar o evento com os novos dados
    setEvento(prev => ({
      ...prev,
      title: formDataEdit.title,
      date: new Date(formDataEdit.date),
      startTime: formDataEdit.startTime,
      endTime: formDataEdit.endTime,
      location: formDataEdit.location,
      responsibleName: formDataEdit.responsibleName,
      responsibleContact: formDataEdit.responsibleContact,
      prestadoresNecessarios: formDataEdit.prestadoresNecessarios,
      status: formDataEdit.status as any,
      mediaParticipantes: formDataEdit.mediaParticipantes,
    }));
    
    setShowEditModal(false);
    mostrarAlerta("Evento atualizado com sucesso!");
  };

  // Função para simular abrir WhatsApp
  const enviarMensagemWhatsApp = (telefone: string, mensagem: string) => {
    const mensagemFormatada = encodeURIComponent(mensagem);
    window.open(`https://wa.me/${telefone.replace(/\D/g, '')}?text=${mensagemFormatada}`, '_blank');
  };

  // Adicionar toast/alerta
  const mostrarAlerta = (mensagem: string) => {
    alert(mensagem);
  };

  // Preparar mensagem para prestador
  const mensagemPrestador = (prestador: EventoPrestador) => {
    return `Olá! Gostaria de confirmar sua participação no evento "${evento.title}" no dia ${new Date(evento.date).toLocaleDateString('pt-BR')}. Local: ${evento.location}. Horário: ${evento.startTime} às ${evento.endTime}. Valor: R$${prestador.value.toFixed(2)}. Aguardo sua confirmação. Obrigado!`;
  };

  // Preparar mensagem para grupo
  const mensagemGrupo = () => {
    return `Detalhes do Evento: "${evento.title}" 
Data: ${new Date(evento.date).toLocaleDateString('pt-BR')}
Horário: ${evento.startTime} às ${evento.endTime}
Local: ${evento.location}
Responsável: ${evento.responsibleName}
Contato: ${evento.responsibleContact}
Descrição: ${evento.description}
Total de prestadores: ${evento.prestadores.length}`;
  };

  // Calcular totais
  const calcularTotais = () => {
    let totalPrestadores = 0;
    evento.prestadores.forEach(p => totalPrestadores += p.value);
    
    let totalItens = 0;
    evento.items.forEach(item => {
      if (!item.isOwned) {
        totalItens += item.quantity * item.unitValue;
      }
    });
    
    return {
      totalPrestadores,
      totalItens,
      total: totalPrestadores + totalItens
    };
  };

  // Totais
  const totais = calcularTotais();
  
  // Calcular progresso de preparação dos itens
  const calcularProgressoPreparacao = () => {
    if (evento.items.length === 0) return 0;
    const itensPreparados = evento.items.filter(item => item.prepared).length;
    return Math.round((itensPreparados / evento.items.length) * 100);
  };
  
  const progressoItens = calcularProgressoPreparacao();

  // Adicionar novo item
  const adicionarItem = () => {
    setSelectedItem(null);
    setShowItemModal(true);
  };
  
  // Editar item existente
  const editarItem = (item: EventoItem) => {
    setSelectedItem(item);
    setShowItemModal(true);
  };
  
  // Salvar item
  const salvarItem = (dadosItem: Partial<EventoItem>) => {
    if (selectedItem) {
      // Editar item existente
      setEvento(prev => ({
        ...prev,
        items: prev.items.map(item => 
          item.id === selectedItem.id 
            ? { 
                ...item, 
                ...dadosItem,
                updatedAt: new Date()
              } 
            : item
        )
      }));
      mostrarAlerta("Item atualizado com sucesso!");
    } else {
      // Adicionar novo item
      const novoItem: EventoItem = {
        id: Date.now().toString(),
        eventoId: evento.id,
        name: dadosItem.name || '',
        quantity: dadosItem.quantity || 0,
        unitValue: dadosItem.unitValue || 0,
        isOwned: dadosItem.isOwned !== undefined ? dadosItem.isOwned : false,
        fornecedor: dadosItem.fornecedor || '',
        observations: dadosItem.observations,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setEvento(prev => ({
        ...prev,
        items: [...prev.items, novoItem]
      }));
      mostrarAlerta("Novo item adicionado com sucesso!");
    }
    
    setShowItemModal(false);
  };
  
  // Componente modal para item
  const ItemModal = () => {
    const [formData, setFormData] = useState({
      name: selectedItem?.name || '',
      quantity: selectedItem?.quantity || 1,
      unitValue: selectedItem?.unitValue || 0,
      isOwned: selectedItem?.isOwned || false,
      fornecedor: selectedItem?.fornecedor || '',
      observations: selectedItem?.observations || '',
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' 
          ? (e.target as HTMLInputElement).checked 
          : (name === 'quantity' || name === 'unitValue') 
            ? parseFloat(value) 
            : value
      }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const submitBtn = e.currentTarget.querySelector('button[type="submit"]') as HTMLButtonElement;
      if (submitBtn) {
        submitBtn.textContent = 'Salvando...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
          salvarItem(formData);
          submitBtn.textContent = 'Salvar';
          submitBtn.disabled = false;
        }, 500);
      } else {
        salvarItem(formData);
      }
    };
    
    if (!showItemModal) return null;
    
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedItem ? 'Editar Item' : 'Adicionar Item'}
              </h2>
              <button onClick={() => setShowItemModal(false)} className="text-gray-400 hover:text-gray-500">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Item
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
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                      Quantidade
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      min="1"
                      className="w-full px-4 py-2 border rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="unitValue" className="block text-sm font-medium text-gray-700 mb-1">
                      Valor Unitário
                    </label>
                    <input
                      type="number"
                      id="unitValue"
                      name="unitValue"
                      value={formData.unitValue}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border rounded-md"
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isOwned"
                      name="isOwned"
                      checked={formData.isOwned}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isOwned" className="ml-2 block text-sm text-gray-900">
                      Temos este item
                    </label>
                  </div>
                </div>
                
                {!formData.isOwned && (
                  <div>
                    <label htmlFor="fornecedor" className="block text-sm font-medium text-gray-700 mb-1">
                      Fornecedor
                    </label>
                    <select
                      id="fornecedor"
                      name="fornecedor"
                      value={formData.fornecedor}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md"
                    >
                      <option value="">Selecionar fornecedor</option>
                      <option value="estoque">Estoque interno</option>
                      <option value="fornecedor1">Fornecedor 1</option>
                      <option value="fornecedor2">Fornecedor 2</option>
                      <option value="fornecedor3">Fornecedor 3</option>
                      <option value="outro">Outro fornecedor</option>
                    </select>
                  </div>
                )}
                
                <div>
                  <label htmlFor="observations" className="block text-sm font-medium text-gray-700 mb-1">
                    Observações
                  </label>
                  <textarea
                    id="observations"
                    name="observations"
                    value={formData.observations}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  onClick={() => setShowItemModal(false)}
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

  // Função para navegar de volta
  const voltarParaDashboard = () => {
    navigate('/dashboard');
  };

  // Função para editar evento
  const editarEvento = () => {
    navigate(`/eventos/editar/${evento.id}`);
  };
  
  // Adicionar novo prestador
  const adicionarPrestador = () => {
    setSelectedPrestador(null);
    setShowPrestadorModal(true);
  };
  
  // Editar prestador existente
  const editarPrestador = (prestador: EventoPrestador) => {
    setSelectedPrestador(prestador);
    setShowPrestadorModal(true);
  };
  
  // Salvar prestador
  const salvarPrestador = (dadosPrestador: Partial<EventoPrestador>) => {
    if (selectedPrestador) {
      // Editar prestador existente
      setEvento(prev => ({
        ...prev,
        prestadores: prev.prestadores.map(prestador => 
          prestador.id === selectedPrestador.id 
            ? { 
                ...prestador, 
                ...dadosPrestador,
                updatedAt: new Date()
              } 
            : prestador
        )
      }));
      mostrarAlerta("Prestador atualizado com sucesso!");
    } else {
      // Adicionar novo prestador
      const novoPrestador: EventoPrestador = {
        id: Date.now().toString(),
        eventoId: evento.id,
        prestadorId: dadosPrestador.prestadorId || '',
        status: dadosPrestador.status || 'pendente',
        value: dadosPrestador.value || 0,
        observations: dadosPrestador.observations,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setEvento(prev => ({
        ...prev,
        prestadores: [...prev.prestadores, novoPrestador]
      }));
      mostrarAlerta("Novo prestador adicionado com sucesso!");
    }
    
    setShowPrestadorModal(false);
  };
  
  // Componente modal para prestador
  const PrestadorModal = () => {
    const [formData, setFormData] = useState({
      prestadorId: selectedPrestador?.prestadorId || '3',
      status: selectedPrestador?.status || 'pendente',
      value: selectedPrestador?.value || 150,
      observations: selectedPrestador?.observations || '',
    });
    
    const [busca, setBusca] = useState("");
    const [filteredPrestadores, setFilteredPrestadores] = useState([
      { id: '1', nome: 'João Silva', especializacoes: ['Massagem', 'RPG', 'Quiropraxia'] },
      { id: '2', nome: 'Maria Oliveira', especializacoes: ['Acupuntura', 'Drenagem', 'Massagem'] },
      { id: '3', nome: 'Carlos Souza', especializacoes: ['Quiropraxia', 'Fisioterapia', 'Pilates'] },
      { id: '4', nome: 'Ana Pereira', especializacoes: ['Massagem', 'Estética', 'Drenagem'] },
      { id: '5', nome: 'Paulo Mendes', especializacoes: ['RPG', 'Ortopedia', 'Avaliação Física'] },
      { id: '6', nome: 'Lucia Santos', especializacoes: ['Osteopatia', 'Quiropraxia', 'Pilates'] },
    ]);
    
    // Efeito para filtrar prestadores quando a busca mudar
    useEffect(() => {
      if (busca.trim() === "") {
        setFilteredPrestadores([
          { id: '1', nome: 'João Silva', especializacoes: ['Massagem', 'RPG', 'Quiropraxia'] },
          { id: '2', nome: 'Maria Oliveira', especializacoes: ['Acupuntura', 'Drenagem', 'Massagem'] },
          { id: '3', nome: 'Carlos Souza', especializacoes: ['Quiropraxia', 'Fisioterapia', 'Pilates'] },
          { id: '4', nome: 'Ana Pereira', especializacoes: ['Massagem', 'Estética', 'Drenagem'] },
          { id: '5', nome: 'Paulo Mendes', especializacoes: ['RPG', 'Ortopedia', 'Avaliação Física'] },
          { id: '6', nome: 'Lucia Santos', especializacoes: ['Osteopatia', 'Quiropraxia', 'Pilates'] },
        ]);
      } else {
        const searchLower = busca.toLowerCase();
        setFilteredPrestadores([
          { id: '1', nome: 'João Silva', especializacoes: ['Massagem', 'RPG', 'Quiropraxia'] },
          { id: '2', nome: 'Maria Oliveira', especializacoes: ['Acupuntura', 'Drenagem', 'Massagem'] },
          { id: '3', nome: 'Carlos Souza', especializacoes: ['Quiropraxia', 'Fisioterapia', 'Pilates'] },
          { id: '4', nome: 'Ana Pereira', especializacoes: ['Massagem', 'Estética', 'Drenagem'] },
          { id: '5', nome: 'Paulo Mendes', especializacoes: ['RPG', 'Ortopedia', 'Avaliação Física'] },
          { id: '6', nome: 'Lucia Santos', especializacoes: ['Osteopatia', 'Quiropraxia', 'Pilates'] },
        ].filter(prestador => 
          prestador.nome.toLowerCase().includes(searchLower) || 
          prestador.especializacoes.some(esp => esp.toLowerCase().includes(searchLower))
        ));
      }
    }, [busca]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: name === 'value' ? parseFloat(value) : value
      }));
    };
    
    const selecionarPrestador = (id: string) => {
      setFormData(prev => ({
        ...prev,
        prestadorId: id
      }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const submitBtn = e.currentTarget.querySelector('button[type="submit"]') as HTMLButtonElement;
      if (submitBtn) {
        submitBtn.textContent = 'Salvando...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
          salvarPrestador(formData);
          submitBtn.textContent = 'Salvar';
          submitBtn.disabled = false;
        }, 500);
      } else {
        salvarPrestador(formData);
      }
    };
    
    if (!showPrestadorModal) return null;
    
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-hidden">
          <div className="flex h-full max-h-[90vh]">
            {/* Lista de prestadores */}
            <div className="w-1/2 border-r border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Selecionar Pessoa</h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar por nome ou especialidade..."
                    className="w-full px-4 py-2 pr-10 border rounded-md"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="overflow-y-auto max-h-[calc(90vh-8rem)]">
                {filteredPrestadores.map(prestador => (
                  <div 
                    key={prestador.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors ${formData.prestadorId === prestador.id ? 'bg-blue-50' : ''}`}
                    onClick={() => selecionarPrestador(prestador.id)}
                  >
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium mr-3 ${formData.prestadorId === prestador.id ? 'bg-blue-500' : 'bg-gray-400'}`}>
                        {prestador.nome.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{prestador.nome}</h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {prestador.especializacoes.map((esp, idx) => (
                            <span 
                              key={idx}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800"
                            >
                              {esp}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredPrestadores.length === 0 && (
                  <div className="p-4 text-center text-gray-500">
                    Nenhum prestador encontrado. Tente outra busca.
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-gray-200">
                <button
                  type="button"
                  className="w-full py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
                  onClick={() => navigate('/gerenciar-pessoas')}
                >
                  + Cadastrar Nova Pessoa
                </button>
              </div>
            </div>
            
            {/* Formulário detalhes */}
            <div className="w-1/2 p-6 overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedPrestador ? 'Editar Pessoa no Evento' : 'Adicionar Pessoa ao Evento'}
                </h2>
                <button onClick={() => setShowPrestadorModal(false)} className="text-gray-400 hover:text-gray-500">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <label className={`flex items-center justify-center px-4 py-2 rounded-md cursor-pointer ${
                      formData.status === 'pendente' ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-400' : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-yellow-50'
                    }`}>
                      <input
                        type="radio"
                        name="status"
                        value="pendente"
                        checked={formData.status === 'pendente'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span className="text-sm">Pendente</span>
                    </label>
                    <label className={`flex items-center justify-center px-4 py-2 rounded-md cursor-pointer ${
                      formData.status === 'confirmado' ? 'bg-green-100 text-green-800 border-2 border-green-400' : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-green-50'
                    }`}>
                      <input
                        type="radio"
                        name="status"
                        value="confirmado"
                        checked={formData.status === 'confirmado'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span className="text-sm">Confirmado</span>
                    </label>
                    <label className={`flex items-center justify-center px-4 py-2 rounded-md cursor-pointer ${
                      formData.status === 'recusado' ? 'bg-red-100 text-red-800 border-2 border-red-400' : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-red-50'
                    }`}>
                      <input
                        type="radio"
                        name="status"
                        value="recusado"
                        checked={formData.status === 'recusado'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span className="text-sm">Recusado</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
                    Valor (R$)
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">R$</span>
                    </div>
                    <input
                      type="number"
                      id="value"
                      name="value"
                      value={formData.value}
                      onChange={handleChange}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 py-3 sm:text-sm border-gray-300 rounded-md"
                      placeholder="0,00"
                      step="0.01"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="observations" className="block text-sm font-medium text-gray-700 mb-1">
                    Observações
                  </label>
                  <textarea
                    id="observations"
                    name="observations"
                    value={formData.observations}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border rounded-md"
                    placeholder="Instruções especiais, restrições, especificações..."
                  />
                </div>
                
                <div className="pt-4">
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      className="flex-1 px-4 py-2 border text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      onClick={() => setShowPrestadorModal(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 text-sm rounded-md text-white bg-blue-600 hover:bg-blue-700 flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Salvar
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Função para formatar nome de status
  const formatStatusName = (status: string) => {
    switch (status) {
      case 'planejamento': return 'Em Planejamento';
      case 'confirmado': return 'Confirmado';
      case 'emAndamento': return 'Em Andamento';
      case 'concluido': return 'Concluído';
      case 'cancelado': return 'Cancelado';
      case 'inativo': return 'Inativo';
      default: return status;
    }
  };

  // Função para calcular prestadores confirmados
  const getPrestadoresConfirmados = () => {
    return evento.prestadores.filter(p => p.status === 'confirmado').length;
  };

  // Função para calcular a porcentagem de prestadores confirmados
  const getPrestadoresProgresso = () => {
    if (!evento.prestadoresNecessarios || evento.prestadoresNecessarios <= 0) return 0;
    const confirmados = getPrestadoresConfirmados();
    return Math.min(100, Math.round((confirmados / evento.prestadoresNecessarios) * 100));
  };

  // Função para obter a cor da barra de progresso
  const getProgressoBarColor = (progresso: number) => {
    if (progresso >= 100) return 'bg-green-500';
    if (progresso >= 75) return 'bg-blue-500';
    if (progresso >= 50) return 'bg-yellow-500';
    if (progresso >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Modal para editar evento
  const EditModal = () => {
    if (!showEditModal) return null;
    
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Editar Informações do Evento
              </h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-500">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Evento
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formDataEdit.title}
                  onChange={handleEditChange}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Data
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formDataEdit.date}
                    onChange={handleEditChange}
                    required
                    className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formDataEdit.status}
                    onChange={handleEditChange}
                    required
                    className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="planejamento">Em Planejamento</option>
                    <option value="confirmado">Confirmado</option>
                    <option value="emAndamento">Em Andamento</option>
                    <option value="concluido">Concluído</option>
                    <option value="cancelado">Cancelado</option>
                    <option value="inativo">Inativo</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Hora de Início
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={formDataEdit.startTime}
                    onChange={handleEditChange}
                    required
                    className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Hora de Término
                  </label>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={formDataEdit.endTime}
                    onChange={handleEditChange}
                    required
                    className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Local
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formDataEdit.location}
                  onChange={handleEditChange}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="responsibleName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Responsável
                  </label>
                  <input
                    type="text"
                    id="responsibleName"
                    name="responsibleName"
                    value={formDataEdit.responsibleName}
                    onChange={handleEditChange}
                    required
                    className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="responsibleContact" className="block text-sm font-medium text-gray-700 mb-1">
                    Contato do Responsável
                  </label>
                  <input
                    type="text"
                    id="responsibleContact"
                    name="responsibleContact"
                    value={formDataEdit.responsibleContact}
                    onChange={handleEditChange}
                    required
                    className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="prestadoresNecessarios" className="block text-sm font-medium text-gray-700 mb-1">
                  Prestadores Necessários
                </label>
                <input
                  type="number"
                  id="prestadoresNecessarios"
                  name="prestadoresNecessarios"
                  value={formDataEdit.prestadoresNecessarios}
                  onChange={handleEditChange}
                  min="0"
                  className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="mediaParticipantes" className="block text-sm font-medium text-gray-700 mb-1">
                  Média de Participantes
                </label>
                <input
                  type="number"
                  id="mediaParticipantes"
                  name="mediaParticipantes"
                  value={formDataEdit.mediaParticipantes || ''}
                  onChange={handleEditChange}
                  min="0"
                  className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex justify-end pt-4 border-t border-gray-200 mt-4">
                <div className="flex space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 border text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm rounded-md text-white bg-blue-600 hover:bg-blue-700 flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Salvar Alterações
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Adicionar função para arquivar eventos
  const arquivarEvento = () => {
    if (confirm('Tem certeza que deseja arquivar este evento? Ele será movido para o histórico.')) {
      // Aqui viria uma chamada para API para arquivar o evento
      setEvento(prev => ({ ...prev, arquivado: true, dataConclusao: new Date() }));
      
      // Adicionar um log para o arquivamento
      const novoLog: EventoLog = {
        id: `log-${Date.now()}`,
        eventoId: evento.id,
        userId: user?.id || '1',
        action: 'Evento arquivado',
        details: `Evento "${evento.title}" arquivado por ${user?.name || 'usuário'}`,
        createdAt: new Date()
      };
      
      setEvento(prev => ({
        ...prev,
        logs: [...prev.logs, novoLog]
      }));
      
      mostrarAlerta('Evento arquivado com sucesso!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button 
              className="text-gray-600 hover:text-gray-900"
              onClick={voltarParaDashboard}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Detalhes do Evento</h1>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowEditModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Editar Evento
            </button>
            <div className="relative">
              <button
                onClick={() => setShowActionsMenu(!showActionsMenu)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition flex items-center"
              >
                Mais Ações
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showActionsMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    <button
                      onClick={() => {
                        setShowActionsMenu(false);
                        exportarPDF();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Exportar como PDF
                    </button>
                    <button
                      onClick={() => {
                        setShowActionsMenu(false);
                        navigate(`/eventos/editar/${evento.id}`);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Editar evento
                    </button>
                    <button
                      onClick={() => {
                        setShowActionsMenu(false);
                        const message = `Olá! Confira as informações do evento "${evento.title}" em ${evento.date}.`;
                        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Compartilhar via WhatsApp
                    </button>
                    <button
                      onClick={() => {
                        setShowActionsMenu(false);
                        arquivarEvento();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-100"
                      role="menuitem"
                    >
                      Arquivar evento
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Coluna 1: Informações Gerais */}
          <div className="lg:col-span-7 space-y-6">
            {/* Card de informações principais */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-medium text-gray-900">Informações do Evento</h2>
                  <div className="flex space-x-2 items-center">
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      evento.status === 'confirmado' ? 'bg-green-100 text-green-800' :
                      evento.status === 'planejamento' ? 'bg-yellow-100 text-yellow-800' :
                      evento.status === 'emAndamento' ? 'bg-blue-100 text-blue-800' :
                      evento.status === 'concluido' ? 'bg-teal-100 text-teal-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {formatStatusName(evento.status)}
                    </span>
                    <button 
                      onClick={() => setShowEditModal(true)}
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Editar
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{evento.title}</h2>
                
                {evento.items.length > 0 && (
                  <div className="mb-6 bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-medium text-gray-700">Preparação de Itens</p>
                      <span className="text-sm font-medium text-gray-500">
                        {evento.items.filter(item => item.prepared).length}/{evento.items.length} itens preparados ({progressoItens}%)
                      </span>
                    </div>
                    {/* Barra de progresso */}
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className={`h-2.5 rounded-full ${
                          progressoItens === 100 
                            ? 'bg-green-600' 
                            : progressoItens > 50 
                              ? 'bg-blue-600' 
                              : progressoItens > 25 
                                ? 'bg-yellow-600' 
                                : 'bg-red-600'
                        }`} 
                        style={{ width: `${progressoItens}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Data</p>
                    <p className="font-medium">{new Date(evento.date).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Horário</p>
                    <p className="font-medium">{evento.startTime} às {evento.endTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Local</p>
                    <p className="font-medium">{evento.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Responsável</p>
                    <p className="font-medium">{evento.responsibleName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Média de Participantes</p>
                    <p className="font-medium">{evento.mediaParticipantes || 'Não definido'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500 mb-1">Prestadores</p>
                    <div className="flex flex-col space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">
                          <span className={`${getPrestadoresConfirmados() >= (evento.prestadoresNecessarios || 0) ? 'text-green-600' : 'text-blue-600'}`}>
                            {getPrestadoresConfirmados()}
                          </span>
                          <span className="text-gray-500">/</span>
                          <span className="text-gray-900">{evento.prestadoresNecessarios || 0}</span>
                          <span className="ml-1 text-sm text-gray-500 font-normal">confirmados</span>
                        </span>
                        
                        <span className="text-sm text-gray-500">
                          {getPrestadoresProgresso()}%
                        </span>
                      </div>
                    
                      {/* Barra de progresso */}
                      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className={`h-2.5 rounded-full ${getProgressoBarColor(getPrestadoresProgresso())}`} 
                          style={{ width: `${getPrestadoresProgresso()}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-gray-500">Descrição</p>
                    <button 
                      className="text-blue-600 hover:text-blue-800 text-xs flex items-center"
                      onClick={() => setEditandoDescricao(!editandoDescricao)}
                    >
                      {editandoDescricao ? 'Cancelar' : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          Editar
                        </>
                      )}
                    </button>
                  </div>
                  {editandoDescricao ? (
                    <div className="space-y-2">
                      <textarea
                        value={descricaoTemp}
                        onChange={(e) => setDescricaoTemp(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        rows={4}
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => {
                            setEditandoDescricao(false);
                            setDescricaoTemp(evento.description);
                          }}
                          className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => {
                            setEvento(prev => ({...prev, description: descricaoTemp}));
                            setEditandoDescricao(false);
                            mostrarAlerta("Descrição atualizada com sucesso!");
                          }}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          Salvar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-700">{evento.description}</p>
                  )}
                </div>

                <div className="flex justify-between">
                  <button 
                    className="flex items-center text-green-600 hover:text-green-800"
                    onClick={() => {
                      enviarMensagemWhatsApp(evento.responsibleContact, `Olá ${evento.responsibleName}, sobre o evento ${evento.title}...`);
                      mostrarAlerta("Abrindo WhatsApp para contato com o responsável.");
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Contatar Responsável
                  </button>
                  <button 
                    className="flex items-center text-blue-600 hover:text-blue-800"
                    onClick={() => {
                      // Simular abrir Google Maps
                      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(evento.location)}`, '_blank');
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Ver no Mapa
                  </button>
                </div>
              </div>
            </div>

            {/* Card de prestadores */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Prestadores</h3>
                <div className="flex space-x-2">
                  <button 
                    className="px-3 py-1 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition"
                    onClick={() => {
                      navigate('/gerenciar-pessoas');
                    }}
                  >
                    Gerenciar Pessoas
                  </button>
                  <button 
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition"
                    onClick={adicionarPrestador}
                  >
                    Adicionar Prestador
                  </button>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {evento.prestadores.map((prestador) => (
                  <div key={prestador.id} className="px-6 py-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">
                          {prestador.prestadorId === '1' ? 'João Silva' :
                           prestador.prestadorId === '2' ? 'Maria Oliveira' :
                           prestador.prestadorId === '3' ? 'Carlos Souza' : 'Ana Pereira'}
                        </h4>
                        <p className="text-sm text-gray-600">{prestador.observations}</p>
                        <p className="text-sm text-gray-600 mt-1">Valor: R$ {prestador.value.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          prestador.status === 'confirmado' ? 'bg-green-100 text-green-800' :
                          prestador.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {prestador.status === 'confirmado' ? 'Confirmado' :
                           prestador.status === 'pendente' ? 'Pendente' : 'Recusado'}
                        </span>
                        <button 
                          className="p-1 text-green-600 hover:text-green-900"
                          onClick={() => {
                            enviarMensagemWhatsApp('5511987654321', mensagemPrestador(prestador));
                            mostrarAlerta("Abrindo WhatsApp para contato com o prestador.");
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </button>
                        <button 
                          className="p-1 text-blue-600 hover:text-blue-900"
                          onClick={() => editarPrestador(prestador)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 bg-gray-50">
                <button 
                  className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center"
                  onClick={() => {
                    enviarMensagemWhatsApp('5511987651234', mensagemGrupo());
                    mostrarAlerta("Abrindo WhatsApp para mensagem de grupo.");
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                  Enviar Mensagem para Grupo de WhatsApp
                </button>
              </div>
            </div>
          </div>

          {/* Coluna 2: Itens e Financeiro */}
          <div className="lg:col-span-5 space-y-6">
            {/* Card de Itens */}
            <div className="bg-white rounded-lg shadow h-auto">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Itens do Evento</h3>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    className={`px-3 py-1 text-sm rounded-md transition ${
                      todosItensPreparados 
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                    onClick={toggleTodosItensPreparados}
                    title={todosItensPreparados ? "Desmarcar todos os itens" : "Marcar todos os itens como preparados"}
                  >
                    {todosItensPreparados ? 'Todos Preparados ✓' : 'Marcar Todos'}
                  </button>
                  <button 
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition"
                    onClick={adicionarItem}
                  >
                    Adicionar Item
                  </button>
                </div>
              </div>
              <div className="p-2">
                <table className="min-w-full divide-y divide-gray-200 table-fixed">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[35%]">Item</th>
                      <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[8%]">Qtd</th>
                      <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[12%]">Temos</th>
                      <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">Preparado</th>
                      <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[30%]">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {evento.items.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-2 py-2">
                          <div className="text-sm font-medium text-gray-900 break-words">{item.name}</div>
                          {item.observations && (
                            <div className="text-xs text-gray-500 break-words pr-2" title={item.observations}>
                              {item.observations}
                            </div>
                          )}
                        </td>
                        <td className="px-2 py-2 text-sm text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="px-2 py-2">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-1"
                              checked={item.isOwned}
                              onChange={(e) => {
                                const updatedItem = {...item, isOwned: e.target.checked};
                                setEvento(prev => ({
                                  ...prev,
                                  items: prev.items.map(i => i.id === item.id ? updatedItem : i)
                                }));
                              }}
                            />
                            <span className="text-xs">
                              {item.isOwned ? 'Sim' : 'Não'}
                            </span>
                          </div>
                        </td>
                        <td className="px-2 py-2">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mr-1"
                              checked={item.prepared || false}
                              onChange={(e) => {
                                const updatedItem = {...item, prepared: e.target.checked};
                                setEvento(prev => ({
                                  ...prev,
                                  items: prev.items.map(i => i.id === item.id ? updatedItem : i)
                                }));
                              }}
                            />
                            <span className="text-xs">
                              {item.prepared ? 'Sim' : 'Não'}
                            </span>
                          </div>
                        </td>
                        <td className="px-2 py-2">
                          <div className="flex justify-center space-x-1">
                            <button 
                              className="p-1 text-blue-600 hover:text-blue-900 rounded-full hover:bg-blue-50 transition-colors"
                              onClick={() => editarItem(item)}
                              title="Editar item"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>

                            <button 
                              className="p-1 text-red-600 hover:text-red-900 rounded-full hover:bg-red-50 transition-colors"
                              onClick={() => {
                                if (confirm(`Tem certeza que deseja excluir o item "${item.name}"?`)) {
                                  setEvento(prev => ({
                                    ...prev,
                                    items: prev.items.filter(i => i.id !== item.id)
                                  }));
                                  mostrarAlerta("Item removido com sucesso!");
                                }
                              }}
                              title="Excluir item"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>

                            <button 
                              className={`p-1 rounded-full transition-colors ${
                                item.prepared 
                                  ? 'text-green-600 hover:text-green-900 hover:bg-green-50' 
                                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                              }`}
                              onClick={() => {
                                const updatedItem = {...item, prepared: !item.prepared};
                                setEvento(prev => ({
                                  ...prev,
                                  items: prev.items.map(i => i.id === item.id ? updatedItem : i)
                                }));
                              }}
                              title={item.prepared ? "Desmarcar como preparado" : "Marcar como preparado"}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {/* Adicionar linhas vazias para preencher o espaço */}
                    {evento.items.length < 3 && Array.from({ length: 3 - evento.items.length }).map((_, index) => (
                      <tr key={`empty-${index}`} className="h-12">
                        <td colSpan={5} className="px-2 py-2"></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Card de resumo financeiro */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Resumo Financeiro</h3>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total com Prestadores:</span>
                    <span className="font-medium">R$ {totais.totalPrestadores.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total com Itens:</span>
                    <span className="font-medium">R$ {totais.totalItens.toFixed(2)}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-200 flex justify-between">
                    <span className="font-medium text-gray-900">Total do Evento:</span>
                    <span className="font-bold text-gray-900">R$ {totais.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card de Logs */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Histórico de Atividades</h3>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-4">
                  {evento.logs.length > 0 ? (
                    evento.logs.map((log) => (
                      <div key={log.id} className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{log.action}</p>
                          <p className="text-sm text-gray-500">{log.details}</p>
                          <p className="text-xs text-gray-400 mt-1">{new Date(log.createdAt).toLocaleString('pt-BR')}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-3">Nenhuma atividade registrada.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Modal de Adicionar/Editar Prestador */}
      <PrestadorModal />
      
      {/* Modal de Adicionar/Editar Item */}
      <ItemModal />
      
      {/* Modal para editar evento */}
      <EditModal />
    </div>
  );
} 