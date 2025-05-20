
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useVideo } from '@/contexts/VideoContext';
import { Video } from '@/types/video';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';

const TeacherDashboard = () => {
  const { authState } = useAuth();
  const { getUserVideos, deleteVideo } = useVideo();
  const [videos, setVideos] = useState<Video[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch videos
  useEffect(() => {
    if (authState.isAuthenticated && authState.user?.role === 'professor') {
      const userVideos = getUserVideos();
      setVideos(userVideos);
    } else {
      navigate('/');
    }
  }, [authState, getUserVideos, navigate]);

  // Filter videos based on search
  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateVideo = () => {
    navigate('/admin/videos/new');
  };

  const handleEditVideo = (videoId: string) => {
    navigate(`/admin/videos/edit/${videoId}`);
  };

  const handleDeleteVideo = (videoId: string, videoTitle: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o vídeo "${videoTitle}"?`)) {
      const success = deleteVideo(videoId);
      
      if (success) {
        setVideos(videos.filter(video => video.id !== videoId));
        toast({
          title: "Vídeo excluído",
          description: `O vídeo "${videoTitle}" foi removido com sucesso.`
        });
      } else {
        toast({
          title: "Erro ao excluir",
          description: "Não foi possível excluir o vídeo.",
          variant: "destructive"
        });
      }
    }
  };

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Painel de Professor</h1>
            <p className="text-gray-600">Gerencie suas aulas de música</p>
          </div>
          <Button onClick={handleCreateVideo}>
            <Plus className="mr-2 h-4 w-4" /> Nova Aula
          </Button>
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
                  <CardDescription>{formatDate(video.createdAt)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 line-clamp-2">
                    {video.description}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleEditVideo(video.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleDeleteVideo(video.id, video.title)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    onClick={() => handleViewVideo(video.id)}
                  >
                    Visualizar
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">
                {searchTerm ? 'Nenhuma aula encontrada com esse termo.' : 'Você ainda não tem aulas cadastradas.'}
              </p>
              <Button 
                onClick={handleCreateVideo}
                className="mt-4"
              >
                <Plus className="mr-2 h-4 w-4" /> Criar Primeira Aula
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
