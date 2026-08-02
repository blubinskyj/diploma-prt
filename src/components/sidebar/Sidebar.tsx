import React from 'react';

type Props = {
  year: string;
  setYear: (v: string) => void;
  institution: string;
  setInstitution: (v: string) => void;
  institution2: string;
  setInstitution2: (v: string) => void;
};

const Sidebar: React.FC<Props> = ({
  year,
  setYear,
  institution,
  setInstitution,
  institution2,
  setInstitution2,
}) => {
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
    </div>
  );
};

export default Sidebar;
