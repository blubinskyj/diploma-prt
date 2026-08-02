import React from 'react';
import type { Student } from '../../utils/parseExcel';

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
  console.log(students[0], 'student');
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-2">Налаштування документа</h2>

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
        Значення зберігаються локально і відображаються на підложці документа.
      </div>

      {students.length > 0 && (
        <>
          <hr className="my-4" />
          <div>
            <h3 className="text-md font-semibold mb-2">Список студентів</h3>
            <div className="space-y-1 max-h-96 overflow-y-auto border rounded p-2">
              {students.map((student, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectStudent(idx)}
                  className={`w-full text-left px-2 py-1 rounded transition-colors text-sm ${
                    selectedStudentIdx === idx
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {student.name}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
