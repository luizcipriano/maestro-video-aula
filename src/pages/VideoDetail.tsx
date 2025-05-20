
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useVideo } from '@/contexts/VideoContext';
import { Video } from '@/types/video';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import VideoPlayer from '@/components/VideoPlayer';
import Header from '@/components/Header';

const VideoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { authState } = useAuth();
  const { getVideoById } = useVideo();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authState.isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (id) {
      const videoData = getVideoById(id);
      
      if (videoData) {
        setVideo(videoData);
      } else {
        // Video not found
        navigate('/');
      }
    }
    
    setIsLoading(false);
  }, [authState, id, getVideoById, navigate]);

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Vídeo não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            ← Voltar
          </Button>
          
          <Card className="overflow-hidden">
            <CardHeader className="pb-0">
              <CardTitle className="text-2xl font-bold">{video.title}</CardTitle>
              <CardDescription>
                Por: {video.ownerName} • {formatDate(video.createdAt)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <VideoPlayer src={video.videoUrl} title={video.title} />
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Descrição</h3>
                <p className="text-gray-700 whitespace-pre-line">{video.description}</p>
              </div>
              
              {/* Could add comments section here in the future */}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default VideoDetail;
