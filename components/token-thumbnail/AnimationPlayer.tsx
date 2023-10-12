import * as React from 'react';

interface AnimationPlayerProps {
  animationUrl: string;
  isPlaying?: boolean;
  onClickPlayButton?: () => void;
}

const playIcon = (
  <div className="border-l-primary-dark group-hover:border-l-lightBg ml-1 border-b-[6.5px] border-l-[9px] border-t-[6.5px] border-solid border-b-transparent border-t-transparent" />
);

const pauseIcon = (
  <div className="border-l-primary-dark group-hover:border-l-lightBg h-5 border-l-[10px] border-double" />
);

export default function AnimationPlayer({
  animationUrl,
  isPlaying,
  onClickPlayButton,
}: AnimationPlayerProps) {
  const handlePlayButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClickPlayButton) {
      onClickPlayButton();
    }
  };

  return (
    <div>
      {isPlaying && (
        <video autoPlay controlsList="nodownload" loop playsInline preload="metadata">
          <source src={animationUrl} type="video/mp4" />
        </video>
      )}
      <div
        onClick={handlePlayButtonClick}
        className="bg-lightBg group absolute bottom-5 right-5 flex aspect-square w-1/5 min-w-[40px] max-w-[50px] cursor-pointer items-center justify-center rounded-full bg-opacity-70 shadow-md transition-colors hover:bg-primary"
      >
        {onClickPlayButton && isPlaying ? pauseIcon : playIcon}
      </div>
    </div>
  );
}
