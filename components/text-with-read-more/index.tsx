import React, { useState, useEffect, useRef } from "react";

const TextWithReadMore = ({
  children,
  maxLength,
  className = ""
}: {
  children: string;
  maxLength: number;
  className?: string;
}) => {
  const [isOverflow, setIsOverflow] = useState(false);
  const [isReadingMore, setIsReadingMore] = useState(false);

  useEffect(() => {
    setIsOverflow(children.length > maxLength);
  }, [children, maxLength]);

  return (
    <div>
      <p className={className}>
        {isOverflow && !isReadingMore
          ? `${children.substring(0, maxLength)} ...`
          : children}
        {isOverflow && (
          <button
            onClick={() => setIsReadingMore(prev => !prev)}
            className="ml-2 text-xs font-semibold text-primary"
          >
            {isReadingMore ? "read less" : "read more"}
          </button>
        )}
      </p>
    </div>
  );
};

export default TextWithReadMore;
