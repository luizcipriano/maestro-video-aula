
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useVideo } from '@/contexts/VideoContext';
import { Video } from '@/types/video';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header';

const StudentDashboard = () => {
  const { authState } = useAuth();
  const { getUserVideos } = useVideo();
  const [videos, setVideos] = useState<Video[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Fetch videos
  useEffect(() => {
    if (authState.isAuthenticated) {
      const userVideos = getUserVideos();
      setVideos(userVideos);
    }
  }, [authState.isAuthenticated, getUserVideos]);

  // Filter videos based on search
  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewVideo = (videoId: string) => {
    navigate(`/videos/${videoId}`);
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Olá, {authState.user?.name}!</h1>
          <p className="text-gray-600">Bem-vindo à plataforma MúsicaAulas. Explore as aulas disponíveis abaixo.</p>
        </div>
        
        <div className="mb-8">
          <Input
            placeholder="Buscar aulas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.length > 0 ? (
            filteredVideos.map((video) => (
              <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{video.title}</CardTitle>
                  <CardDescription>
                    Por: {video.ownerName} • {formatDate(video.createdAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 line-clamp-2">
                    {video.description}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => handleViewVideo(video.id)}
                    className="w-full"
                  >
                    Assistir aula
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">
                {searchTerm ? 'Nenhuma aula encontrada com esse termo.' : 'Nenhuma aula disponível no momento.'}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
