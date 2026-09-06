import React, { useRef, useState, useCallback, useEffect } from 'react';
import scanSrc from '../../assets/scan.jpg';
import type { Student } from '../../utils/parseExcel';

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

// Grade number to Ukrainian text mapping
const gradeToUkrainian: Record<string | number, string> = {
  0: 'нуль',
  1: 'один',
  2: 'два',
  3: 'три',
  4: 'чотири',
  5: "п'ять",
  6: 'шість',
  7: 'сім',
  8: 'вісім',
  9: "дев'ять",
  10: 'десять',
  11: 'одинадцять',
  12: 'дванадцять',
};

const getGradeText = (grade: string | number): string => {
  const numGrade = Number(grade);
  return gradeToUkrainian[numGrade] || String(grade);
};

type Props = {
  year: string;
  institution: string;
  institution2: string;
  selectedStudent: Student | null;
};

const Canva: React.FC<Props> = ({
  year,
  institution,
  institution2,
  selectedStudent,
}) => {
  // translation in pixels
  const [tx, setTx] = useState(280);
  const [ty, setTy] = useState(30);
  // scale (zoom)
  const [scale, setScale] = useState(0.6);
  // dragging UI state (used for cursor and accessibility)
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const draggingTextRef = useRef<string | null>(null);

  const [studentNamePos, setStudentNamePos] = useState<{
    x: number;
    y: number;
  }>(() => {
    try {
      const raw = localStorage.getItem('canva:studentNamePos');
      return raw ? JSON.parse(raw) : { x: 333, y: 250 };
    } catch {
      return { x: 333, y: 250 };
    }
  });

  const [yearPos, setYearPos] = useState<{ x: number; y: number }>(() => {
    try {
      const raw = localStorage.getItem('canva:yearPos');
      return raw ? JSON.parse(raw) : { x: 762, y: 374 };
    } catch {
      return { x: 1500, y: 120 };
    }
  });
  const [instPos, setInstPos] = useState<{ x: number; y: number }>(() => {
    try {
      const raw = localStorage.getItem('canva:instPos');
      return raw ? JSON.parse(raw) : { x: 109, y: 417 };
    } catch {
      return { x: 140, y: 220 };
    }
  });
  const [inst2Pos, setInst2Pos] = useState<{ x: number; y: number }>(() => {
    try {
      const raw = localStorage.getItem('canva:inst2Pos');
      return raw ? JSON.parse(raw) : { x: 218, y: 482 };
    } catch {
      return { x: 140, y: 260 };
    }
  });

  // grades start position (subsequent grades will be positioned vertically)
  const [gradesStartPos] = useState<{ x: number; y: number }>({
    x: 140,
    y: 530,
  });

  // positions of grades items (Record<gradeKey, {x, y}>
  const [gradesPositions, setGradesPositions] = useState<
    Record<string, { x: number; y: number }>
  >({});

  // Initialize or reset grades positions when selectedStudent changes
  useEffect(() => {
    // Load or initialize positions for this student's grades
    const newPositions: Record<string, { x: number; y: number }> = {};
    if (!selectedStudent) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGradesPositions(newPositions);
      return;
    }

    const subjects = Object.keys(selectedStudent.grades);
    const lineHeight = 51;
    const startX = 48;
    const startY = 685;
    const start2X = 1000;
    const start2Y = 120;

    subjects.forEach((subject, idx) => {
      const stored = localStorage.getItem(`canva:grade:${subject}`);
      if (stored) {
        try {
          newPositions[subject] = JSON.parse(stored);
        } catch {
          newPositions[subject] = {
            x: idx <= 11 ? startX : start2X,
            y:
              idx <= 11
                ? startY + idx * lineHeight
                : start2Y + (idx - 12) * lineHeight,
          };
        }
      } else {
        newPositions[subject] = {
          x: idx <= 11 ? startX : start2X,
          y:
            idx <= 11
              ? startY + idx * lineHeight
              : start2Y + (idx - 12) * lineHeight,
        };
      }
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGradesPositions(newPositions);
  }, [selectedStudent]);

  useEffect(() => {
    localStorage.setItem(
      'canva:studentNamePos',
      JSON.stringify(studentNamePos),
    );
  }, [studentNamePos]);
  useEffect(() => {
    localStorage.setItem('canva:yearPos', JSON.stringify(yearPos));
  }, [yearPos]);
  useEffect(() => {
    localStorage.setItem('canva:instPos', JSON.stringify(instPos));
  }, [instPos]);
  useEffect(() => {
    localStorage.setItem('canva:inst2Pos', JSON.stringify(inst2Pos));
  }, [inst2Pos]);

  // persist grades positions
  useEffect(() => {
    if (!selectedStudent) return;
    Object.entries(gradesPositions).forEach(([subject, pos]) => {
      localStorage.setItem(`canva:grade:${subject}`, JSON.stringify(pos));
    });
  }, [gradesPositions, selectedStudent]);

  const onMouseDown = (e: React.MouseEvent) => {
    // start panning
    draggingRef.current = true;
    setIsDragging(true);
    lastPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (draggingTextRef.current && lastPosRef.current) {
      // dragging a text element: update its world position (delta / scale)
      const dx = e.clientX - lastPosRef.current.x;
      const dy = e.clientY - lastPosRef.current.y;
      lastPosRef.current = { x: e.clientX, y: e.clientY };
      const wx = dx / scale;
      const wy = dy / scale;
      if (draggingTextRef.current === 'year') {
        setYearPos((p) => ({ x: p.x + wx, y: p.y + wy }));
      } else if (draggingTextRef.current === 'inst') {
        setInstPos((p) => ({ x: p.x + wx, y: p.y + wy }));
      } else if (draggingTextRef.current === 'studentName') {
        setStudentNamePos((p) => ({ x: p.x + wx, y: p.y + wy }));
      } else if (draggingTextRef.current === 'inst2') {
        setInst2Pos((p) => ({ x: p.x + wx, y: p.y + wy }));
      } else if (draggingTextRef.current.startsWith('grade:')) {
        // dragging a grade item
        const subject = draggingTextRef.current.slice(6); // remove 'grade:' prefix
        setGradesPositions((prev) => ({
          ...prev,
          [subject]: {
            x: (prev[subject]?.x ?? 0) + wx,
            y: (prev[subject]?.y ?? 0) + wy,
          },
        }));
      }
      return;
    }

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
    if (draggingTextRef.current && lastPosRef.current) {
      if (e.touches.length !== 1) return;
      const t = e.touches[0];
      const dx = t.clientX - lastPosRef.current.x;
      const dy = t.clientY - lastPosRef.current.y;
      lastPosRef.current = { x: t.clientX, y: t.clientY };
      const wx = dx / scale;
      const wy = dy / scale;
      if (draggingTextRef.current === 'year') {
        setYearPos((p) => ({ x: p.x + wx, y: p.y + wy }));
      } else if (draggingTextRef.current === 'inst') {
        setInstPos((p) => ({ x: p.x + wx, y: p.y + wy }));
      } else if (draggingTextRef.current === 'inst2') {
        setInst2Pos((p) => ({ x: p.x + wx, y: p.y + wy }));
      } else if (draggingTextRef.current.startsWith('grade:')) {
        // dragging a grade item
        const subject = draggingTextRef.current.slice(6); // remove 'grade:' prefix
        setGradesPositions((prev) => ({
          ...prev,
          [subject]: {
            x: (prev[subject]?.x ?? 0) + wx,
            y: (prev[subject]?.y ?? 0) + wy,
          },
        }));
      }
      return;
    }

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
  const [showBackground, setShowBackground] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem('canva:showBackground');
      return raw === null ? false : JSON.parse(raw);
    } catch {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem(
      'canva:showBackground',
      JSON.stringify(showBackground),
    );
  }, [showBackground]);

  const nameParts = selectedStudent?.name.trim().split(/\s+/);
  const firstLine = nameParts?.slice(0, 2).join(' ');
  const secondLine = nameParts?.slice(2).join(' ');

  return (
    <div className="w-full h-full " style={{ touchAction: 'none' }}>
      <div className="canva-toolbar flex flex-col items-center justify-center gap-2 px-2 py-1 mb-2 rounded">
        <label className="flex items-center gap-2 text-s text-slate-700 dark:text-slate-200">
          <input
            type="checkbox"
            checked={showBackground}
            onChange={(e) => setShowBackground(e.target.checked)}
          />
          Показувати підкладку
        </label>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <label className="text-s text-slate-700 dark:text-slate-200">
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
            disabled={!showBackground}
          />
          <div className="text-xs w-10 text-right text-slate-700 dark:text-slate-200">
            {Math.round(bgOpacity * 100)}%
          </div>
        </div>
      </div>
      <div
        ref={containerRef}
        className="canvas-viewport relative w-full h-[80vh] border border-slate-300 dark:border-slate-700 bg-transparent overflow-hidden"
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
          {showBackground && (
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
          )}
          {selectedStudent && (
            <div
              data-draggable
              onMouseDown={(e) => {
                e.stopPropagation();
                draggingTextRef.current = 'studentName';
                lastPosRef.current = { x: e.clientX, y: e.clientY };
                setIsDragging(true);
              }}
              onMouseUp={(e) => {
                e.stopPropagation();
                draggingTextRef.current = null;
                setIsDragging(false);
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
                if (e.touches.length === 1) {
                  const t = e.touches[0];
                  draggingTextRef.current = 'studentName';
                  lastPosRef.current = { x: t.clientX, y: t.clientY };
                  setIsDragging(true);
                }
              }}
              className="absolute"
              style={{
                left: studentNamePos.x,
                top: studentNamePos.y,
                cursor: 'grab',
              }}
            >
              <div
                id={'name'}
                className="select-none flex flex-col text-center text-4xl font-bold text-black dark:text-black leading-tight"
              >
                <div className={'mb-3'}>{firstLine}</div>
                {secondLine && <div>{secondLine}</div>}
              </div>
            </div>
          )}

          <div
            data-draggable
            onMouseDown={(e) => {
              // start dragging year text
              e.stopPropagation();
              draggingTextRef.current = 'year';
              lastPosRef.current = { x: e.clientX, y: e.clientY };
              setIsDragging(true);
            }}
            onMouseUp={(e) => {
              e.stopPropagation();
              draggingTextRef.current = null;
              setIsDragging(false);
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              if (e.touches.length === 1) {
                const t = e.touches[0];
                draggingTextRef.current = 'year';
                lastPosRef.current = { x: t.clientX, y: t.clientY };
                setIsDragging(true);
              }
            }}
            className="absolute"
            style={{ left: yearPos.x, top: yearPos.y, cursor: 'grab' }}
          >
            <div className="select-none text-right text-3xl font-bold text-black text-black">
              {year}
            </div>
          </div>

          <div
            data-draggable
            onMouseDown={(e) => {
              e.stopPropagation();
              draggingTextRef.current = 'inst';
              lastPosRef.current = { x: e.clientX, y: e.clientY };
              setIsDragging(true);
            }}
            onMouseUp={(e) => {
              e.stopPropagation();
              draggingTextRef.current = null;
              setIsDragging(false);
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              if (e.touches.length === 1) {
                const t = e.touches[0];
                draggingTextRef.current = 'inst';
                lastPosRef.current = { x: t.clientX, y: t.clientY };
                setIsDragging(true);
              }
            }}
            className="absolute"
            style={{ left: instPos.x, top: instPos.y, cursor: 'grab' }}
          >
            <div className="select-none text-4xl font-semibold text-black text-black">
              {institution}
            </div>
          </div>
          <div
            data-draggable
            onMouseDown={(e) => {
              e.stopPropagation();
              draggingTextRef.current = 'inst2';
              lastPosRef.current = { x: e.clientX, y: e.clientY };
              setIsDragging(true);
            }}
            onMouseUp={(e) => {
              e.stopPropagation();
              draggingTextRef.current = null;
              setIsDragging(false);
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              if (e.touches.length === 1) {
                const t = e.touches[0];
                draggingTextRef.current = 'inst2';
                lastPosRef.current = { x: t.clientX, y: t.clientY };
                setIsDragging(true);
              }
            }}
            className="absolute"
            style={{ left: inst2Pos.x, top: inst2Pos.y, cursor: 'grab' }}
          >
            <div className="select-none text-4xl font-semibold text-black text-black">
              {institution2}
            </div>
          </div>

          {/* Render grades if student is selected */}
          {selectedStudent && (
            <>
              {Object.entries(selectedStudent.grades).map(
                ([subject, grade]) => (
                  <div
                    key={subject}
                    data-draggable
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      draggingTextRef.current = `grade:${subject}`;
                      lastPosRef.current = { x: e.clientX, y: e.clientY };
                      setIsDragging(true);
                    }}
                    onMouseUp={(e) => {
                      e.stopPropagation();
                      draggingTextRef.current = null;
                      setIsDragging(false);
                    }}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                      if (e.touches.length === 1) {
                        const t = e.touches[0];
                        draggingTextRef.current = `grade:${subject}`;
                        lastPosRef.current = { x: t.clientX, y: t.clientY };
                        setIsDragging(true);
                      }
                    }}
                    className="absolute"
                    style={{
                      left: gradesPositions[subject]?.x ?? gradesStartPos.x,
                      top: gradesPositions[subject]?.y ?? gradesStartPos.y,
                      cursor: 'grab',
                    }}
                    id={'selected-student'}
                  >
                    <div
                      className="select-none text-sm text-slate-900 dark:text-white  w-200
                     flex"
                    >
                      <span className="flex-5 font-bold text-4xl text-black text-black">
                        {subject}
                      </span>
                      <span className="flex-2 font-bold text-4xl text-black text-black ">
                        {getGradeText(grade)}
                      </span>
                    </div>
                  </div>
                ),
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Canva;
