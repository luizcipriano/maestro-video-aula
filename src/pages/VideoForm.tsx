
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useVideo } from '@/contexts/VideoContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';

const VideoForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = id !== 'new';
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { authState } = useAuth();
  const { getVideoById, addVideo, updateVideo } = useVideo();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Redirect if not logged in as a professor
    if (!authState.isAuthenticated || authState.user?.role !== 'professor') {
      navigate('/login');
      return;
    }
    
    // Load video data if in edit mode
    if (isEditMode && id) {
      const videoData = getVideoById(id);
      
      if (videoData && videoData.ownerId === authState.user?.id) {
        setTitle(videoData.title);
        setDescription(videoData.description);
        setVideoUrl(videoData.videoUrl);
      } else {
        // Video not found or not owned by current user
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para editar este vídeo.",
          variant: "destructive"
        });
        navigate('/admin');
      }
    }
  }, [authState, isEditMode, id, getVideoById, navigate, toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !videoUrl) {
      toast({
        title: "Campos em branco",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      if (isEditMode && id) {
        // Update existing video
        const success = updateVideo(id, { title, description, videoUrl });
        
        if (success) {
          toast({
            title: "Vídeo atualizado",
            description: "As alterações foram salvas com sucesso."
          });
          navigate('/admin');
        } else {
          toast({
            title: "Erro ao atualizar",
            description: "Não foi possível atualizar o vídeo.",
            variant: "destructive"
          });
        }
      } else {
        // Create new video
        addVideo({ title, description, videoUrl });
        toast({
          title: "Vídeo criado",
          description: "O vídeo foi adicionado com sucesso."
        });
        navigate('/admin');
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um problema ao processar sua solicitação.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>{isEditMode ? 'Editar Aula' : 'Nova Aula'}</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título da aula</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Introdução ao Violão"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva o conteúdo da aula..."
                  rows={4}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="videoUrl">URL do vídeo</Label>
                <Input
                  id="videoUrl"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://player.vimeo.com/video/123456789"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Cole o link de incorporação (embed) do Vimeo, YouTube ou outro serviço de vídeo.
                </p>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin')}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Salvando...' : isEditMode ? 'Atualizar' : 'Criar'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default VideoForm;
