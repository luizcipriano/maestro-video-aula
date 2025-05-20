
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
    let playerElement = videoRef.current;

    if (!isEmbed) {
      // Create a video element for direct video files
      const videoElement = document.createElement('video');
      videoElement.controls = true;
      videoElement.src = src;
      
      // Clear the container and append the video element
      while (playerElement.firstChild) {
        playerElement.removeChild(playerElement.firstChild);
      }
      playerElement.appendChild(videoElement);
      playerElement = videoElement;
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
    
    plyrInstance.current = new Plyr(playerElement, options);

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
