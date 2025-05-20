
import { useEffect, useRef } from 'react';
import Plyr from 'plyr';

interface VideoPlayerProps {
  src: string;
  title?: string;
}

const VideoPlayer = ({ src, title }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Plyr | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    let videoElement: HTMLDivElement | HTMLIFrameElement;
    
    // Check if the source is a Vimeo or YouTube URL
    if (src.includes('vimeo.com') || src.includes('youtube.com') || src.includes('youtu.be')) {
      // Create iframe for embedded videos
      const iframe = document.createElement('iframe');
      iframe.src = src;
      iframe.allowFullscreen = true;
      iframe.allow = 'autoplay; fullscreen; picture-in-picture';
      iframe.style.width = '100%';
      iframe.style.aspectRatio = '16/9';
      videoRef.current.appendChild(iframe);
      videoElement = iframe;
    } else {
      // Create video element for direct video sources
      const video = document.createElement('video');
      video.controls = true;
      video.crossOrigin = 'anonymous';
      
      const source = document.createElement('source');
      source.src = src;
      source.type = 'video/mp4';
      
      video.appendChild(source);
      videoRef.current.appendChild(video);
      videoElement = video;
    }

    // Initialize Plyr
    playerRef.current = new Plyr(videoElement, {
      title,
      controls: [
        'play-large', 'play', 'progress', 'current-time', 'mute', 
        'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'
      ],
      hideControls: false,
      autoplay: false
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
      
      if (videoRef.current) {
        videoRef.current.innerHTML = '';
      }
    };
  }, [src, title]);

  return (
    <div className="video-player">
      <div ref={videoRef} className="plyr__video-embed"></div>
    </div>
  );
};

export default VideoPlayer;
