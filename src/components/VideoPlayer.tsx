
import React, { useEffect, useRef } from 'react';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

interface VideoPlayerProps {
  src: string;
  title?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, title }) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const plyrInstance = useRef<Plyr | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    // Clean up previous player instance if it exists
    if (plyrInstance.current) {
      plyrInstance.current.destroy();
    }

    // Determine if the source is a video file or an embed URL (like YouTube, Vimeo)
    const isEmbed = src.includes('youtube.com') || 
                   src.includes('youtu.be') || 
                   src.includes('vimeo.com') || 
                   src.includes('player.vimeo.com');

    // Create video element or use existing container for embeds
    if (!isEmbed) {
      // Create a video element for direct video files
      videoRef.current.innerHTML = `
        <video controls>
          <source src="${src}" type="video/mp4">
        </video>
      `;
    } else {
      // For embeds, we'll use the div as a container
      videoRef.current.innerHTML = `
        <iframe
          src="${src}"
          allowfullscreen
          allow="autoplay"
        ></iframe>
      `;
    }

    // Initialize Plyr
    const options = {
      controls: [
        'play-large', 'play', 'progress', 'current-time', 'mute', 
        'volume', 'captions', 'settings', 'fullscreen'
      ]
    };
    
    // Use the correct selector to initialize Plyr
    if (videoRef.current) {
      const videoElement = isEmbed ? 
        videoRef.current.querySelector('iframe') : 
        videoRef.current.querySelector('video');
        
      if (videoElement) {
        plyrInstance.current = new Plyr(videoElement, options);
      }
    }

    // Clean up on component unmount
    return () => {
      if (plyrInstance.current) {
        plyrInstance.current.destroy();
      }
    };
  }, [src]);

  return (
    <div className="aspect-video bg-black rounded-md overflow-hidden">
      <div 
        ref={videoRef} 
        className="plyr__video-embed w-full h-full"
        data-title={title}
      ></div>
    </div>
  );
};

export default VideoPlayer;
