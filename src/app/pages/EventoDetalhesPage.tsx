import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Evento {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  status: string;
}

export function EventoDetalhesPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);

  // Simular carregamento do evento
  useEffect(() => {
    setTimeout(() => {
      const mockEvento: Evento = {
        id: id || '1',
        title: 'Workshop de Fisioterapia Esportiva',
        date: '2023-10-15',
        startTime: '09:00',
        endTime: '17:00',
        location: 'Centro de Convenções, São Paulo',
        description: 'Workshop com foco em fisioterapia para atletas de alta performance.',
        status: 'confirmado',
      };
      
      setEvento(mockEvento);
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando detalhes do evento...</div>
      </div>
    );
  }

  if (!evento) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Evento não encontrado</h2>
          <p className="text-gray-300 mb-6">
            O evento que você está procurando não existe ou foi removido.
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Voltar para o Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-300 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-white">Detalhes do Evento</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">{evento.title}</h2>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center text-gray-300">
              <span>{new Date(evento.date).toLocaleDateString('pt-BR')}</span>
            </div>
            
            <div className="flex items-center text-gray-300">
              <span>{evento.startTime} - {evento.endTime}</span>
            </div>
            
            <div className="flex items-center text-gray-300">
              <span>{evento.location}</span>
            </div>
            
            <div className="flex items-center text-gray-300">
              <span className="px-2 py-1 bg-green-900 text-green-100 rounded-full text-xs uppercase font-medium">
                {evento.status}
              </span>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-2">Descrição</h3>
            <p className="text-gray-300">{evento.description}</p>
          </div>
          
          <div className="flex justify-end">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              onClick={() => navigate('/')}
            >
              Voltar para Dashboard
            </button>
          </div>
        </div>
      </main>
    </div>
  );
} 