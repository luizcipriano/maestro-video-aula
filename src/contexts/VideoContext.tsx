
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Video } from '@/types/video';
import { useAuth } from './AuthContext';

// This is a mock implementation. In a real app, you'd connect to your backend API
const MOCK_VIDEOS: Video[] = [
  {
    id: '1',
    title: 'Introdução ao Violão',
    description: 'Aula básica para iniciantes em violão. Aprenda as primeiras notas e acordes.',
    videoUrl: 'https://player.vimeo.com/video/76979871',
    ownerId: '1',
    ownerName: 'Professor João',
    createdAt: '2023-05-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Técnicas de Dedilhado',
    description: 'Aprenda técnicas avançadas de dedilhado para violão clássico.',
    videoUrl: 'https://player.vimeo.com/video/90509568',
    ownerId: '1',
    ownerName: 'Professor João',
    createdAt: '2023-05-16T14:30:00Z'
  },
  {
    id: '3',
    title: 'Teoria Musical Básica',
    description: 'Fundamentos de teoria musical essenciais para qualquer músico.',
    videoUrl: 'https://player.vimeo.com/video/163153865',
    ownerId: '1',
    ownerName: 'Professor João',
    createdAt: '2023-05-18T09:45:00Z'
  }
];

interface VideoContextType {
  videos: Video[];
  getUserVideos: () => Video[];
  getVideoById: (id: string) => Video | undefined;
  addVideo: (video: Omit<Video, 'id' | 'ownerId' | 'ownerName' | 'createdAt'>) => void;
  updateVideo: (id: string, video: Partial<Video>) => boolean;
  deleteVideo: (id: string) => boolean;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export function VideoProvider({ children }: { children: ReactNode }) {
  const [videos, setVideos] = useState<Video[]>(MOCK_VIDEOS);
  const { authState } = useAuth();

  useEffect(() => {
    // Mock loading videos from API
    // In a real app, you'd fetch from your backend here
  }, []);

  const getUserVideos = (): Video[] => {
    if (!authState.user) return [];
    
    if (authState.user.role === 'professor') {
      // Professors see only their own videos
      return videos.filter(video => video.ownerId === authState.user!.id);
    } else {
      // Students see all videos (in a real app, you'd filter by allowed access)
      return videos;
    }
  };

  const getVideoById = (id: string): Video | undefined => {
    return videos.find(video => video.id === id);
  };

  const addVideo = (videoData: Omit<Video, 'id' | 'ownerId' | 'ownerName' | 'createdAt'>) => {
    if (!authState.user || authState.user.role !== 'professor') return;
    
    const newVideo: Video = {
      id: `${videos.length + 1}`,
      ...videoData,
      ownerId: authState.user.id,
      ownerName: authState.user.name,
      createdAt: new Date().toISOString()
    };
    
    setVideos(prev => [...prev, newVideo]);
  };

  const updateVideo = (id: string, videoUpdate: Partial<Video>): boolean => {
    if (!authState.user || authState.user.role !== 'professor') return false;
    
    const videoIndex = videos.findIndex(video => 
      video.id === id && video.ownerId === authState.user!.id
    );
    
    if (videoIndex === -1) return false;
    
    const updatedVideos = [...videos];
    updatedVideos[videoIndex] = {
      ...updatedVideos[videoIndex],
      ...videoUpdate,
      ownerId: authState.user.id // Ensure ownerId can't be changed
    };
    
    setVideos(updatedVideos);
    return true;
  };

  const deleteVideo = (id: string): boolean => {
    if (!authState.user || authState.user.role !== 'professor') return false;
    
    const videoExists = videos.some(video => 
      video.id === id && video.ownerId === authState.user!.id
    );
    
    if (!videoExists) return false;
    
    setVideos(prev => prev.filter(video => 
      !(video.id === id && video.ownerId === authState.user!.id)
    ));
    
    return true;
  };

  return (
    <VideoContext.Provider value={{ 
      videos, 
      getUserVideos, 
      getVideoById,
      addVideo, 
      updateVideo, 
      deleteVideo 
    }}>
      {children}
    </VideoContext.Provider>
  );
}

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
};
