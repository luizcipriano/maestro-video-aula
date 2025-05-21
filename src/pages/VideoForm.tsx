
import { useState, useEffect, useRef } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const VideoForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = id !== 'new';
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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

  // Clean up object URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      // Check if file is a video
      if (!file.type.startsWith('video/')) {
        toast({
          title: "Arquivo inválido",
          description: "Por favor, selecione um arquivo de vídeo.",
          variant: "destructive"
        });
        return;
      }
      
      // Check file size (limit to 100MB for example)
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (file.size > maxSize) {
        toast({
          title: "Arquivo muito grande",
          description: "Por favor, selecione um arquivo menor que 100MB.",
          variant: "destructive"
        });
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description) {
      toast({
        title: "Campos em branco",
        description: "Por favor, preencha título e descrição.",
        variant: "destructive"
      });
      return;
    }
    
    if (uploadMethod === 'url' && !videoUrl) {
      toast({
        title: "URL não fornecida",
        description: "Por favor, insira a URL do vídeo.",
        variant: "destructive"
      });
      return;
    }
    
    if (uploadMethod === 'file' && !selectedFile) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione um arquivo de vídeo.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      let finalVideoUrl = videoUrl;
      
      // If we're uploading a file, we would normally upload it to a server
      // and get back a URL. Since this is a demo, we'll use the object URL.
      if (uploadMethod === 'file' && selectedFile && previewUrl) {
        // In a real app, you'd upload the file to a server here
        finalVideoUrl = previewUrl;
        
        toast({
          title: "Demo de upload",
          description: "Em uma implementação real, o arquivo seria enviado para um servidor."
        });
      }
      
      if (isEditMode && id) {
        // Update existing video
        const success = updateVideo(id, { title, description, videoUrl: finalVideoUrl });
        
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
        addVideo({ title, description, videoUrl: finalVideoUrl });
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
              
              <Tabs 
                value={uploadMethod} 
                onValueChange={(value) => setUploadMethod(value as 'url' | 'file')}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="url">URL do Vídeo</TabsTrigger>
                  <TabsTrigger value="file">Upload de Arquivo</TabsTrigger>
                </TabsList>
                
                <TabsContent value="url" className="space-y-2">
                  <Label htmlFor="videoUrl">URL do vídeo</Label>
                  <Input
                    id="videoUrl"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://player.vimeo.com/video/123456789"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Cole o link de incorporação (embed) do Vimeo, YouTube ou outro serviço de vídeo.
                  </p>
                </TabsContent>
                
                <TabsContent value="file" className="space-y-4">
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {selectedFile ? (
                      <div className="text-center">
                        <p className="text-sm font-medium">{selectedFile.name}</p>
                        <p className="text-xs text-gray-500">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p className="mt-2 text-sm font-medium">
                          Clique para selecionar um arquivo
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          MP4, WebM, Ogg até 100MB
                        </p>
                      </div>
                    )}
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                  
                  {previewUrl && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Pré-visualização:</p>
                      <video 
                        src={previewUrl} 
                        controls 
                        className="w-full rounded-md"
                        style={{ maxHeight: '200px' }}
                      ></video>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
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
