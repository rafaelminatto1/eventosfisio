import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function EventoFormPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  
  // Estado do formulário
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    empresaId: '',
    description: '',
    responsibleName: '',
    responsibleContact: '',
    status: 'planejamento',
    estimatedAttendees: '',
    eventType: '',
    needsEquipment: false,
    prestadoresNecessarios: '',
  });

  // Lista de empresas (mock)
  const empresas = [
    { id: '1', name: 'Empresa XYZ' },
    { id: '2', name: 'Corporação ABC' },
    { id: '3', name: 'Indústrias 123' },
  ];

  // Lista de tipos de eventos
  const eventTypes = [
    'Massagem Corporativa',
    'Fisioterapia Preventiva',
    'Quick Massage',
    'Ginástica Laboral',
    'Campanha de Saúde',
    'Evento Esportivo',
    'Outro'
  ];

  // Manipulador de mudanças nos campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Manipulador de envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Aqui seria a lógica para salvar no backend
    console.log('Dados do evento:', formData);
    
    // Simulação de sucesso após um segundo
    setTimeout(() => {
      setIsSubmitting(false);
      // Navegar para página de detalhes após cadastro
      navigate('/dashboard');
    }, 1000);
  };

  // Validar o formulário por etapas
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!formData.title && !!formData.empresaId && !!formData.eventType;
      case 2:
        return !!formData.date && !!formData.startTime && !!formData.endTime && !!formData.location;
      case 3:
        return !!formData.responsibleName && !!formData.responsibleContact;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps && validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      // Voltar para o dashboard
      navigate('/dashboard');
    }
  };

  // Renderizar o progresso das etapas
  const renderStepProgress = () => {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step < currentStep ? 'bg-green-500 text-white' : 
                  step === currentStep ? 'bg-blue-600 text-white' : 
                  'bg-gray-200 text-gray-700'
                } transition-all duration-300`}
              >
                {step < currentStep ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span>{step}</span>
                )}
              </div>
              <span className={`text-xs mt-2 ${step === currentStep ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                {step === 1 ? 'Informações Básicas' : 
                 step === 2 ? 'Data e Local' : 'Responsável'}
              </span>
            </div>
          ))}
        </div>
        <div className="relative flex items-center justify-between mt-4">
          <div className="absolute left-0 right-0 h-1 bg-gray-200">
            <div 
              className="absolute h-1 bg-blue-600 transition-all duration-300" 
              style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  // Renderizar etapa atual
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="animate-fade-in">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Informações Básicas do Evento</h2>
            <div className="space-y-6">
              {/* Nome do Evento */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Evento <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="Ex: Massagem Pós-Maratona Empresa XYZ"
                />
              </div>

              {/* Tipo de Evento */}
              <div>
                <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Evento <span className="text-red-500">*</span>
                </label>
                <select
                  id="eventType"
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Selecione o tipo</option>
                  {eventTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Empresa */}
              <div>
                <label htmlFor="empresaId" className="block text-sm font-medium text-gray-700 mb-1">
                  Empresa Cliente <span className="text-red-500">*</span>
                </label>
                <select
                  id="empresaId"
                  name="empresaId"
                  value={formData.empresaId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Selecione uma empresa</option>
                  {empresas.map(empresa => (
                    <option key={empresa.id} value={empresa.id}>
                      {empresa.name}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs text-blue-600">
                  <span className="cursor-pointer hover:underline">
                    + Cadastrar nova empresa
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Status */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status do Evento
                  </label>
                  <div className="relative">
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none"
                    >
                      <option value="planejamento">Em Planejamento</option>
                      <option value="confirmado">Confirmado</option>
                      <option value="emAndamento">Em Andamento</option>
                      <option value="concluido">Concluído</option>
                      <option value="cancelado">Cancelado</option>
                      <option value="inativo">Inativo</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Número estimado de participantes */}
                <div>
                  <label htmlFor="estimatedAttendees" className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Participantes
                  </label>
                  <input
                    type="number"
                    id="estimatedAttendees"
                    name="estimatedAttendees"
                    value={formData.estimatedAttendees}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    placeholder="Ex: 50"
                  />
                </div>
              </div>

              {/* Número de prestadores necessários */}
              <div className="relative">
                <label htmlFor="prestadoresNecessarios" className="block text-sm font-medium text-gray-700 mb-1">
                  Prestadores Necessários <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <input
                    type="number"
                    id="prestadoresNecessarios"
                    name="prestadoresNecessarios"
                    value={formData.prestadoresNecessarios}
                    onChange={handleChange}
                    min="1"
                    required
                    className="w-full pl-10 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    placeholder="Número de profissionais necessários"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Informe quantos prestadores de serviço serão necessários para este evento
                </p>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="animate-fade-in">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Data e Local do Evento</h2>
            <div className="space-y-6">
              {/* Data */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Data <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Horário de Início */}
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Início <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>

                {/* Horário de Término */}
                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Término <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>

              {/* Local */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Local <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    placeholder="Endereço completo do evento"
                  />
                </div>
              </div>

              {/* Precisa de Equipamentos */}
              <div className="flex items-start mt-4">
                <div className="flex items-center h-5">
                  <input
                    id="needsEquipment"
                    name="needsEquipment"
                    type="checkbox"
                    checked={formData.needsEquipment}
                    onChange={handleChange}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="needsEquipment" className="font-medium text-gray-700">
                    Precisa de equipamentos
                  </label>
                  <p className="text-gray-500">
                    Marque esta opção se precisará de equipamentos específicos para este evento.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="animate-fade-in">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Responsável e Detalhes Adicionais</h2>
            <div className="space-y-6">
              {/* Nome do Responsável */}
              <div>
                <label htmlFor="responsibleName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Responsável <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="responsibleName"
                  name="responsibleName"
                  value={formData.responsibleName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="Nome do responsável na empresa"
                />
              </div>

              {/* Contato do Responsável */}
              <div>
                <label htmlFor="responsibleContact" className="block text-sm font-medium text-gray-700 mb-1">
                  Contato do Responsável <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="responsibleContact"
                    name="responsibleContact"
                    value={formData.responsibleContact}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    placeholder="(xx) xxxxx-xxxx"
                  />
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição do Evento
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="Detalhes sobre o evento, número de prestadores necessários, etc."
                />
              </div>

              {/* Mensagem informativa */}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-800">
                      Após salvar este evento, você poderá adicionar prestadores e itens na tela de detalhes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button 
              className="text-gray-600 hover:text-gray-900 transition-colors"
              onClick={prevStep}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Editar Evento' : 'Novo Evento'}
            </h1>
          </div>

          {/* Etapas do formulário */}
          <div className="text-sm text-gray-500">
            Etapa {currentStep} de {totalSteps}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progresso de etapas */}
        {renderStepProgress()}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="p-6 min-h-[400px]">
              {renderCurrentStep()}
            </div>

            {/* Botões de navegação */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                {currentStep === 1 ? 'Cancelar' : 'Voltar'}
              </button>
              <div>
                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!validateStep(currentStep)}
                    className={`px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                      validateStep(currentStep)
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-blue-300 cursor-not-allowed'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
                  >
                    Próximo
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting || !validateStep(currentStep)}
                    className={`px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                      isSubmitting || !validateStep(currentStep)
                        ? 'bg-blue-300 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex items-center`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Salvando...
                      </>
                    ) : (
                      'Salvar Evento'
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
} 