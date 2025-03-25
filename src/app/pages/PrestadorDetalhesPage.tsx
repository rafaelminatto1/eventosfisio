import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Prestador, User, EventoPrestador } from '../models/types';

export function PrestadorDetalhesPage() {
  const { user } = useAuth();
  
  // Mock de dados de prestador para demonstração
  const [prestador, setPrestador] = useState<Prestador & { user: User, eventos: EventoPrestador[] }>({
    id: '1',
    userId: '2',
    skills: ['Massagem Relaxante', 'Quick Massage', 'Massagem Esportiva'],
    bio: 'Fisioterapeuta formado há 5 anos, especialista em massagem desportiva e recuperação muscular. Trabalho com atletas de alto rendimento e eventos corporativos.',
    available: true,
    rating: 4.8,
    specialties: ['Massagem Desportiva', 'Relaxamento Muscular'],
    hourlyRate: 120,
    bankInfo: 'Banco 123, Ag: 1234, CC: 12345-6',
    createdAt: new Date(),
    updatedAt: new Date(),
    user: {
      id: '2',
      name: 'João Silva',
      email: 'joao@exemplo.com',
      role: 'prestador',
      phone: '(11) 98765-4321',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    eventos: [
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
        eventoId: '2',
        prestadorId: '1',
        status: 'pendente',
        value: 150,
        observations: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]
  });

  // Função simulada para enviar mensagem WhatsApp
  const enviarMensagemWhatsApp = () => {
    const telefone = prestador.user.phone.replace(/\D/g, '');
    const mensagem = encodeURIComponent(`Olá ${prestador.user.name}, temos um novo evento para você participar!`);
    window.open(`https://wa.me/${telefone}?text=${mensagem}`, '_blank');
  };

  // Calcular total de eventos
  const totalEventos = prestador.eventos.length;
  const eventosConfirmados = prestador.eventos.filter(e => e.status === 'confirmado').length;

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Detalhes do Prestador</h1>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
              Editar Informações
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna 1: Informações do Prestador */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl">
                    {prestador.user.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="ml-4">
                    <h2 className="text-xl font-bold text-gray-900">{prestador.user.name}</h2>
                    <div className="flex items-center mt-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${i < Math.floor(prestador.rating) ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-1 text-gray-600">{prestador.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="ml-auto">
                    <span className={`px-3 py-1 text-sm rounded-full ${prestador.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {prestador.available ? 'Disponível' : 'Indisponível'}
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Informações de Contato</h3>
                    <div className="mt-2 space-y-2">
                      <p className="flex items-center text-gray-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {prestador.user.email}
                      </p>
                      <p className="flex items-center text-gray-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {prestador.user.phone}
                      </p>
                    </div>
                    
                    <div className="mt-4">
                      <button 
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center"
                        onClick={enviarMensagemWhatsApp}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Enviar Mensagem
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Informações Profissionais</h3>
                    <div className="mt-2 space-y-2">
                      <p className="text-gray-800">
                        <span className="font-medium">Valor/Hora:</span> R$ {prestador.hourlyRate.toFixed(2)}
                      </p>
                      <p className="text-gray-800">
                        <span className="font-medium">Eventos Participados:</span> {eventosConfirmados}/{totalEventos}
                      </p>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-500">Dados Bancários</h4>
                      <p className="mt-1 text-gray-800">{prestador.bankInfo}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Sobre</h3>
                  <p className="text-gray-700">{prestador.bio}</p>
                </div>
              </div>
            </div>

            {/* Habilidades e Especialidades */}
            <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Habilidades e Especialidades</h3>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Habilidades</h4>
                  <div className="flex flex-wrap gap-2">
                    {prestador.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Especialidades</h4>
                  <div className="flex flex-wrap gap-2">
                    {prestador.specialties.map((specialty, index) => (
                      <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna 2: Histórico de Eventos */}
          <div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Histórico de Eventos</h3>
              </div>
              
              <div className="divide-y divide-gray-200">
                {prestador.eventos.length > 0 ? (
                  prestador.eventos.map((evento) => (
                    <div key={evento.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Evento #{evento.eventoId}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Valor: R$ {evento.value.toFixed(2)}
                          </p>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          evento.status === 'confirmado' ? 'bg-green-100 text-green-800' :
                          evento.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {evento.status === 'confirmado' ? 'Confirmado' :
                           evento.status === 'pendente' ? 'Pendente' : 'Recusado'}
                        </span>
                      </div>
                      {evento.observations && (
                        <p className="text-sm text-gray-600 mt-2">{evento.observations}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-4 text-center text-gray-500">
                    Nenhum evento encontrado para este prestador.
                  </div>
                )}
              </div>
            </div>

            {/* Disponibilidade */}
            <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Disponibilidade</h3>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Status Atual:</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    prestador.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {prestador.available ? 'Disponível' : 'Indisponível'}
                  </span>
                </div>
                
                <div className="mt-4">
                  <button className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                    Ver Agenda Completa
                  </button>
                </div>
              </div>
            </div>

            {/* Observações Internas */}
            <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Observações Internas</h3>
              </div>
              <div className="p-6">
                <textarea
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Adicione observações internas sobre este prestador (visíveis apenas para administradores)"
                ></textarea>
                <button className="mt-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition">
                  Salvar Observações
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 