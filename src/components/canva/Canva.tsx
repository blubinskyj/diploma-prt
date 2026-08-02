import React, { useRef, useState, useCallback } from 'react';
import scanSrc from '../../assets/scan.jpg';

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

const Canva: React.FC = () => {
  // translation in pixels
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  // scale (zoom)
  const [scale, setScale] = useState(1);
  // dragging UI state (used for cursor and accessibility)
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  const onMouseDown = (e: React.MouseEvent) => {
    // start panning
    draggingRef.current = true;
    setIsDragging(true);
    lastPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!draggingRef.current || !lastPosRef.current) return;
    const dx = e.clientX - lastPosRef.current.x;
    const dy = e.clientY - lastPosRef.current.y;
    lastPosRef.current = { x: e.clientX, y: e.clientY };
    setTx((v) => v + dx);
    setTy((v) => v + dy);
  };

  const endDrag = () => {
    draggingRef.current = false;
    lastPosRef.current = null;
    setIsDragging(false);
  };

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const delta = -e.deltaY;
      const zoomFactor = delta > 0 ? 1.1 : 0.9;
      const newScale = clamp(scale * zoomFactor, 0.2, 3);

      // Zoom towards cursor: adjust tx/ty so the point under the cursor stays under cursor
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) {
        setScale(newScale);
        return;
      }
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;

      // world coords before zoom
      const worldX = (cx - tx) / scale;
      const worldY = (cy - ty) / scale;

      // new translation so worldX*newScale + newTx = cx
      const newTx = cx - worldX * newScale;
      const newTy = cy - worldY * newScale;

      setScale(newScale);
      setTx(newTx);
      setTy(newTy);
    },
    [scale, tx, ty],
  );

  const onDoubleClick = () => {
    // reset
    setScale(1);
    setTx(0);
    setTy(0);
  };

  // touch handlers for panning (simple single-touch pan)
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const t = e.touches[0];
      draggingRef.current = true;
      setIsDragging(true);
      lastPosRef.current = { x: t.clientX, y: t.clientY };
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!draggingRef.current || !lastPosRef.current) return;
    if (e.touches.length !== 1) return;
    const t = e.touches[0];
    const dx = t.clientX - lastPosRef.current.x;
    const dy = t.clientY - lastPosRef.current.y;
    lastPosRef.current = { x: t.clientX, y: t.clientY };
    setTx((v) => v + dx);
    setTy((v) => v + dy);
  };

  const onTouchEnd = () => {
    endDrag();
  };

  const [bgOpacity, setBgOpacity] = useState(0.9);

  return (
    <div className="w-full h-full " style={{ touchAction: 'none' }}>
      <div className="flex items-center justify-center gap-2 px-2 py-1 mb-2 rounded">
        <label className="text-xs text-slate-700 dark:text-slate-200">
          Прозорість підложки
        </label>
        <input
          aria-label="opacity"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={bgOpacity}
          onChange={(e) => setBgOpacity(Number(e.target.value))}
          className="w-36"
        />
        <div className="text-xs w-10 text-right text-slate-700 dark:text-slate-200">
          {Math.round(bgOpacity * 100)}%
        </div>
      </div>
      <div
        ref={containerRef}
        className="relative w-full h-[85vh] border border-slate-300 dark:border-slate-700 bg-transparent overflow-hidden"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onDoubleClick={onDoubleClick}
        onWheel={onWheel}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div
          className="absolute top-0 left-0"
          style={{
            transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
            transformOrigin: '0 0',
            width: 2000,
            height: 1400,
          }}
        >
          {/* background image as an <img> so opacity affects only the scan */}
          <img
            src={scanSrc}
            alt="scan"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              opacity: bgOpacity,
              pointerEvents: 'none',
              display: 'block',
            }}
          />

          {/* transparent overlay for future drawings (above the image) */}
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          />
        </div>
      </div>
      {/*<div className="mt-2 text-sm text-slate-600 dark:text-slate-400">*/}
      {/*  Панорамування: натисніть і перетягуйте, Прокрутка: масштаб*/}
      {/*</div>*/}
    </div>
  );
};

export default Canva;
