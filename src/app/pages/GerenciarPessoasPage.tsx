import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Prestador } from '../models/types';

// Componente Modal para adicionar/editar prestador
const PrestadorFormModal = ({ 
  isOpen, 
  onClose, 
  prestadorToEdit,
  onSave
}: { 
  isOpen: boolean;
  onClose: () => void;
  prestadorToEdit?: Prestador;
  onSave: (prestadorData: Partial<Prestador>) => void;
}) => {
  const [formData, setFormData] = useState({
    userId: '',
    skills: [] as string[],
    bio: '',
    available: true,
    rating: 5,
    specialties: [] as string[],
    hourlyRate: 100,
    bankInfo: ''
  });
  
  const [skill, setSkill] = useState('');
  const [specialty, setSpecialty] = useState('');

  useEffect(() => {
    if (prestadorToEdit) {
      setFormData({
        userId: prestadorToEdit.userId,
        skills: [...prestadorToEdit.skills],
        bio: prestadorToEdit.bio,
        available: prestadorToEdit.available,
        rating: prestadorToEdit.rating,
        specialties: [...prestadorToEdit.specialties],
        hourlyRate: prestadorToEdit.hourlyRate,
        bankInfo: prestadorToEdit.bankInfo || ''
      });
    } else {
      setFormData({
        userId: '',
        skills: [],
        bio: '',
        available: true,
        rating: 5,
        specialties: [],
        hourlyRate: 100,
        bankInfo: ''
      });
    }
  }, [prestadorToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : name === 'hourlyRate' || name === 'rating'
          ? parseFloat(value) 
          : value
    }));
  };
  
  const addSkill = () => {
    if (skill.trim() && !formData.skills.includes(skill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill.trim()]
      }));
      setSkill('');
    }
  };
  
  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };
  
  const addSpecialty = () => {
    if (specialty.trim() && !formData.specialties.includes(specialty.trim())) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, specialty.trim()]
      }));
      setSpecialty('');
    }
  };
  
  const removeSpecialty = (specialtyToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialtyToRemove)
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
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {prestadorToEdit ? 'Editar Pessoa' : 'Adicionar Nova Pessoa'}
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
                <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
                  Usuário
                </label>
                <select
                  id="userId"
                  name="userId"
                  value={formData.userId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-md"
                >
                  <option value="">Selecione um usuário</option>
                  <option value="1">João Silva</option>
                  <option value="2">Maria Oliveira</option>
                  <option value="3">Carlos Souza</option>
                  <option value="4">Ana Pereira</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Biografia
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Habilidades
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => setSkill(e.target.value)}
                    className="flex-grow px-4 py-2 border rounded-md"
                    placeholder="Adicionar habilidade"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    +
                  </button>
                </div>
                <div className="flex flex-wrap mt-2 gap-2">
                  {formData.skills.map((s, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {s}
                      <button 
                        type="button"
                        onClick={() => removeSkill(s)}
                        className="ml-1.5 text-blue-500 hover:text-blue-700"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Especialidades
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="flex-grow px-4 py-2 border rounded-md"
                    placeholder="Adicionar especialidade"
                  />
                  <button
                    type="button"
                    onClick={addSpecialty}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    +
                  </button>
                </div>
                <div className="flex flex-wrap mt-2 gap-2">
                  {formData.specialties.map((s, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                    >
                      {s}
                      <button 
                        type="button"
                        onClick={() => removeSpecialty(s)}
                        className="ml-1.5 text-green-500 hover:text-green-700"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-1">
                    Valor por Hora (R$)
                  </label>
                  <input
                    type="number"
                    id="hourlyRate"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>
                
                <div>
                  <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                    Classificação (1-5)
                  </label>
                  <input
                    type="number"
                    id="rating"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    min="1"
                    max="5"
                    step="0.1"
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="bankInfo" className="block text-sm font-medium text-gray-700 mb-1">
                  Informações Bancárias
                </label>
                <textarea
                  id="bankInfo"
                  name="bankInfo"
                  value={formData.bankInfo}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="available"
                  name="available"
                  checked={formData.available}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="available" className="ml-2 block text-sm text-gray-900">
                  Disponível para novos eventos
                </label>
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

// Componente principal da página de Gerenciar Pessoas
export function GerenciarPessoasPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPrestador, setSelectedPrestador] = useState<Prestador | undefined>(undefined);
  const [filterText, setFilterText] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  
  // Mock de prestadores
  const [prestadores, setPrestadores] = useState<Prestador[]>([
    {
      id: '1',
      userId: '1',
      skills: ['Massagem', 'Fisioterapia', 'RPG'],
      bio: 'Fisioterapeuta especialista em massagem esportiva com 5 anos de experiência',
      available: true,
      rating: 4.8,
      specialties: ['Esportiva', 'Relaxante'],
      hourlyRate: 150,
      bankInfo: 'Banco XYZ, Agência 0001, Conta 123456',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      userId: '2',
      skills: ['Acupuntura', 'Quiropraxia', 'Drenagem'],
      bio: 'Especialista em acupuntura e quiropraxia',
      available: true,
      rating: 4.5,
      specialties: ['Acupuntura', 'Terapêutica'],
      hourlyRate: 180,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      userId: '3',
      skills: ['Fisioterapia', 'Pilates', 'Reabilitação'],
      bio: 'Fisioterapeuta com especialização em reabilitação',
      available: false,
      rating: 4.9,
      specialties: ['Ortopédica', 'Neurológica'],
      hourlyRate: 200,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const handleAddPrestador = () => {
    setSelectedPrestador(undefined);
    setModalOpen(true);
  };

  const handleEditPrestador = (prestador: Prestador) => {
    setSelectedPrestador(prestador);
    setModalOpen(true);
  };

  const handleSavePrestador = (prestadorData: Partial<Prestador>) => {
    if (selectedPrestador) {
      // Editar prestador existente
      setPrestadores(prevPrestadores => 
        prevPrestadores.map(prestador => 
          prestador.id === selectedPrestador.id 
            ? { 
                ...prestador, 
                ...prestadorData,
                updatedAt: new Date()
              } 
            : prestador
        )
      );
      alert('Pessoa atualizada com sucesso!');
    } else {
      // Adicionar novo prestador
      const novoPrestador: Prestador = {
        id: Date.now().toString(),
        userId: prestadorData.userId || '',
        skills: prestadorData.skills || [],
        bio: prestadorData.bio || '',
        available: prestadorData.available !== undefined ? prestadorData.available : true,
        rating: prestadorData.rating || 5,
        specialties: prestadorData.specialties || [],
        hourlyRate: prestadorData.hourlyRate || 0,
        bankInfo: prestadorData.bankInfo,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setPrestadores(prevPrestadores => [...prevPrestadores, novoPrestador]);
      alert('Nova pessoa adicionada com sucesso!');
    }
    
    setModalOpen(false);
  };

  // Função para aplicar filtros
  const filteredPrestadores = prestadores.filter(prestador => {
    // Filtro por disponibilidade
    if (showAvailableOnly && !prestador.available) {
      return false;
    }
    
    // Filtro por especialidade
    if (filterSpecialty && !prestador.specialties.some(s => 
      s.toLowerCase().includes(filterSpecialty.toLowerCase())
    )) {
      return false;
    }
    
    // Filtro por texto (nome ou habilidades)
    if (filterText) {
      const textToSearch = filterText.toLowerCase();
      const userMatch = ['João Silva', 'Maria Oliveira', 'Carlos Souza', 'Ana Pereira']
        [parseInt(prestador.userId) - 1].toLowerCase().includes(textToSearch);
      const skillsMatch = prestador.skills.some(skill => 
        skill.toLowerCase().includes(textToSearch)
      );
      const bioMatch = prestador.bio.toLowerCase().includes(textToSearch);
      
      return userMatch || skillsMatch || bioMatch;
    }
    
    return true;
  });

  // Função para visualizar histórico de eventos
  const visualizarHistoricoEventos = (prestadorId: string) => {
    // Na implementação real, navegaria para uma página de histórico
    alert(`Visualizando histórico de eventos para a pessoa com ID ${prestadorId}`);
  };

  // Função para ver detalhes do prestador
  const verDetalhesPrestador = (prestadorId: string) => {
    navigate(`/prestadores/${prestadorId}`);
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Gerenciar Pessoas</h1>
          </div>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            onClick={handleAddPrestador}
          >
            Adicionar Pessoa
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filtros */}
        <div className="bg-white shadow rounded-lg mb-6 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <input
                type="text"
                id="search"
                placeholder="Nome, habilidade ou biografia..."
                className="w-full px-4 py-2 border rounded-md"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
                Especialidade
              </label>
              <input
                type="text"
                id="specialty"
                placeholder="Filtrar por especialidade..."
                className="w-full px-4 py-2 border rounded-md"
                value={filterSpecialty}
                onChange={(e) => setFilterSpecialty(e.target.value)}
              />
            </div>
            
            <div className="flex items-end">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="available"
                  checked={showAvailableOnly}
                  onChange={(e) => setShowAvailableOnly(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="available" className="ml-2 block text-sm text-gray-900">
                  Mostrar apenas disponíveis
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Prestadores */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Pessoas Cadastradas</h3>
          </div>
          
          {filteredPrestadores.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              Nenhuma pessoa encontrada com os filtros selecionados.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredPrestadores.map((prestador) => (
                <div key={prestador.id} className="px-6 py-4">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center">
                        <h4 className="font-medium text-gray-900">
                          {['João Silva', 'Maria Oliveira', 'Carlos Souza', 'Ana Pereira'][parseInt(prestador.userId) - 1]}
                        </h4>
                        <span className={`ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          prestador.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {prestador.available ? 'Disponível' : 'Indisponível'}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mt-1">{prestador.bio}</p>
                      
                      <div className="flex flex-wrap mt-2 gap-1">
                        {prestador.skills.map((skill, index) => (
                          <span 
                            key={index} 
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex flex-wrap mt-1 gap-1">
                        {prestador.specialties.map((specialty, index) => (
                          <span 
                            key={index} 
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          Valor/Hora: R$ {prestador.hourlyRate.toFixed(2)}
                        </p>
                        <div className="flex items-center mt-1">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= Math.round(prestador.rating) ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500 ml-1">({prestador.rating})</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button 
                          className="p-2 text-gray-500 hover:text-gray-700"
                          onClick={() => visualizarHistoricoEventos(prestador.id)}
                          title="Ver histórico de eventos"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </button>
                        <button 
                          className="p-2 text-blue-500 hover:text-blue-700"
                          onClick={() => verDetalhesPrestador(prestador.id)}
                          title="Ver detalhes"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button 
                          className="p-2 text-indigo-500 hover:text-indigo-700"
                          onClick={() => handleEditPrestador(prestador)}
                          title="Editar"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal de Adicionar/Editar Prestador */}
      <PrestadorFormModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)}
        prestadorToEdit={selectedPrestador}
        onSave={handleSavePrestador}
      />
    </div>
  );
} 