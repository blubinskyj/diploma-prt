import './App.css';
import Canva from './components/canva/Canva.tsx';
import Sidebar from './components/sidebar/Sidebar.tsx';
import { useEffect, useState } from 'react';
import { parseExcelFile, type Student } from './utils/parseExcel';

function App() {
  const [year, setYear] = useState<string>(() => {
    return localStorage.getItem('canva:year') || '26';
  });
  const [institution, setInstitution] = useState<string>(() => {
    return (
      localStorage.getItem('canva:institution') ||
      'КЗВО ЛОР "Львівська медична академія'
    );
  });
  const [institution2, setInstitution2] = useState<string>(() => {
    return (
      localStorage.getItem('canva:institution2') || 'імені Андрея Крупинського"'
    );
  });
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentIdx, setSelectedStudentIdx] = useState<number>(-1);
  const [fileError, setFileError] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('canva:year', year);
  }, [year]);

  useEffect(() => {
    localStorage.setItem('canva:institution', institution);
  }, [institution]);
  useEffect(() => {
    localStorage.setItem('canva:institution2', institution2);
  }, [institution2]);

  const handleFileUpload = async (file: File) => {
    try {
      setFileError('');
      const data = await parseExcelFile(file);
      setStudents(data.students);
      setSelectedStudentIdx(data.students.length > 0 ? 0 : -1);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to parse file';
      setFileError(msg);
      setStudents([]);
      setSelectedStudentIdx(-1);
    }
  };

  return (
    <>
      <header>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <label className="px-3 py-1 ms-6 my-3 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700">
              Завантажити Excel
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => {
                  const file = e.currentTarget.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                className="hidden"
              />
            </label>
            {fileError && (
              <span className="text-red-600 text-sm">{fileError}</span>
            )}
            {students.length > 0 && (
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Завантажено: {students.length} студентів
              </span>
            )}
          </div>
        </div>
      </header>
      <main className="flex flex-1">
        <section className="flex-1 bg-gray-50 dark:bg-slate-800 p-6">
          <Sidebar
            year={year}
            setYear={setYear}
            institution={institution}
            setInstitution={setInstitution}
            institution2={institution2}
            setInstitution2={setInstitution2}
            students={students}
            selectedStudentIdx={selectedStudentIdx}
            onSelectStudent={setSelectedStudentIdx}
          />
        </section>
        <section className="flex-4 dark:bg-slate-900 p-6 ">
          <Canva
            year={year}
            institution={institution}
            institution2={institution2}
            selectedStudent={
              selectedStudentIdx >= 0 ? students[selectedStudentIdx] : null
            }
          />
        </section>
      </main>
    </>
  );
}

export default App;
