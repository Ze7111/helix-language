import React, { useEffect, useRef, useState } from 'react';
import './ChessboardBackground.css';

const ChessboardBackground: React.FC = () => {
  const chessboardRef = useRef<HTMLDivElement>(null);
  const [gridSize, setGridSize] = useState({ columns: 16, rows: 16+16 });

  useEffect(() => {
    const calculateGridSize = () => {
      const tileSize = window.innerWidth > 800 ? 100 : 50; // Size of each tile

      let rows;
      if (chessboardRef.current) {
        rows = Math.floor(chessboardRef.current.clientHeight / tileSize);
      }
      if (!rows || rows <= 0) {
        // Fallback if container height is not defined or zero
        rows = Math.floor(window.innerHeight / tileSize);
      }

      let columns
      if (chessboardRef.current) {
        columns = Math.floor(chessboardRef.current.clientWidth / tileSize);
      }
      if (!columns || columns <= 0) {
        // Fallback if container width is not defined or zero
        columns = Math.floor(window.innerWidth / tileSize);
      }


      setGridSize({ columns, rows });
    };

    calculateGridSize();
    window.addEventListener('resize', calculateGridSize);

    return () => {
      window.removeEventListener('resize', calculateGridSize);
    };
  }, []);

  return (
    <div
      ref={chessboardRef}
      className="chessboard"
      style={{ '--columns': gridSize.columns, '--rows': gridSize.rows } as React.CSSProperties}
    >
      {Array.from({ length: gridSize.columns * gridSize.rows }).map((_, index) => (
        <div key={index} className="tile" />
      ))}
    </div>
  );
};

export default ChessboardBackground;
