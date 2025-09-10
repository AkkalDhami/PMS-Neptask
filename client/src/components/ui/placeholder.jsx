import React from "react";

const Placeholder = ({ length = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {[...Array(length)].map((_, index) => (
        <div
          key={index}
          className="bg-muted-foreground/50 aspect-video animate-pulse rounded-xl"></div>
      ))}
    </div>
  );
};

export default Placeholder;
