import React, { useEffect, useRef, useState } from 'react';

interface Props {
  show: boolean;
  message: string;
  duration?: number;
}

export default function Toast({ show, message, duration = 1500 }: Props) {
  const [visible, setVisible] = useState(show);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (show) {
      setVisible(true);

      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setVisible(false);
      }, duration);
    }
  }, [show, duration]);

  if (!visible) {
    return null;
  }

  return (
    <>
      <div
        className="fixed inset-x-16 z-50 rounded-lg bg-primary px-8 py-4
        text-base shadow-md sm:bottom-[unset] sm:left-1/2 sm:right-[unset] sm:top-56 sm:min-w-[24rem] sm:-translate-x-1/2 sm:px-12 sm:py-6"
      >
        {message}
      </div>
    </>
  );
}
