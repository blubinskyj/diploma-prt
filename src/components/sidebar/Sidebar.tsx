import React from 'react';
import type { Student } from '../../utils/parseExcel';

const PrintIcon = () => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7 9V4h10v5" />
    <path d="M7 18H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <path d="M7 14h10v6H7z" />
  </svg>
);

type Props = {
  year: string;
  setYear: (v: string) => void;
  institution: string;
  setInstitution: (v: string) => void;
  institution2: string;
  setInstitution2: (v: string) => void;
  students: Student[];
  selectedStudentIdx: number;
  onSelectStudent: (idx: number) => void;
};

const Sidebar: React.FC<Props> = ({
  year,
  setYear,
  institution,
  setInstitution,
  institution2,
  setInstitution2,
  students,
  selectedStudentIdx,
  onSelectStudent,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-2">Спільна інформація</h2>

      <div>
        <label className="block text-sm text-slate-700 dark:text-slate-200">
          Рік
        </label>
        <input
          className="mt-1 block w-full rounded border px-2 py-1"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm text-slate-700 dark:text-slate-200">
          Назва закладу
        </label>
        <input
          className="mt-1 block w-full rounded border px-2 py-1"
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm text-slate-700 dark:text-slate-200">
          Додаткова стрічка (назва)
        </label>
        <input
          className="mt-1 block w-full rounded border px-2 py-1"
          value={institution2}
          onChange={(e) => setInstitution2(e.target.value)}
        />
      </div>

      <div className="text-sm text-slate-600 dark:text-slate-400">
        Значення зберігаються після перезавантаження сторінки
      </div>

      {students.length > 0 && (
        <>
          <hr className="my-4" />
          <div>
            <h2 className="text-lg font-semibold mb-1">Список студентів</h2>
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              Дані НЕ зберішаються після перезавантаження сторінки
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto border rounded p-2">
              {students.map((student, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2 rounded transition-colors ${
                    selectedStudentIdx === idx
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onSelectStudent(idx)}
                    className="flex-1 text-left px-3 py-2 rounded text-xl"
                  >
                    {student.name}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectStudent(idx);
                      window.setTimeout(() => {
                        window.print();
                      }, 50);
                    }}
                    className="print-button me-1 shrink-0 rounded bg-slate-800 p-2 text-white hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-100"
                    aria-label={`Роздрукувати дані студента ${student.name}`}
                    title={`Роздрукувати дані студента ${student.name}`}
                  >
                    <PrintIcon />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
