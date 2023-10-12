'use client';

import Image from 'next/image';
import * as React from 'react';

import AnimationPlayer from './AnimationPlayer';

interface NFTThumbnailProps {
  alt?: string;
  imgUrl?: string;
  animationUrl?: string;
  badge?: React.ReactNode;
  width?: number;
  height?: number;
}

function TokenThumbnail({
  alt,
  imgUrl,
  animationUrl,
  width = 240,
  height = 240,
}: NFTThumbnailProps) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const handleLoadingComplete = () => {
    setIsLoaded(true);
  };

  React.useEffect(() => {
    setIsLoaded(false);
  }, [imgUrl]);

  return (
    <div className="relative flex aspect-square items-center justify-center overflow-hidden lg:rounded-md">
      {imgUrl && (
        <Image
          alt={alt || ''}
          width={width}
          height={height}
          src={imgUrl}
          onLoadingComplete={handleLoadingComplete}
        />
      )}
      {animationUrl && (
        <div
          className={`absolute inset-0 flex items-center ${
            isPlaying ? 'bg-black bg-opacity-60' : ''
          }`}
        >
          <AnimationPlayer
            animationUrl={animationUrl}
            isPlaying={isPlaying}
            onClickPlayButton={() => setIsPlaying(!isPlaying)}
          />
        </div>
      )}
      <div
        className={`absolute inset-0 flex items-center justify-center bg-primary-light transition-opacity duration-500 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <p className="text-center text-primary">3pm.studio</p>
      </div>
    </div>
  );
}

export default TokenThumbnail;
