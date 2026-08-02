import * as XLSX from 'xlsx';

export interface Student {
  name: string;
  grades: Record<string, string | number>;
}

export interface ParsedData {
  students: Student[];
  subjects: string[];
}

export async function parseExcelFile(file: File): Promise<ParsedData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) throw new Error('Failed to read file');

        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Get all data as JSON
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as (
          string | number
        )[][];

        if (jsonData.length < 2) {
          throw new Error(
            'Excel file must have at least a header row and one data row',
          );
        }
        console.log(jsonData, 'jsonData');

        // First row is headers
        const headers = jsonData[0] as string[];

        // First column is student names
        const nameColumn = 1;
        const subjects = headers.slice(1); // Rest of headers are subjects

        const students: Student[] = [];

        // Process each row as a student
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          const name = String(row[nameColumn] || '').trim();

          if (!name) continue; // Skip empty rows

          const grades: Record<string, string | number> = {};
          for (let j = 1; j < headers.length; j++) {
            const subject = String(headers[j]).trim();
            const grade = row[j] ?? '';
            if (subject) {
              grades[subject] = grade;
            }
          }

          students.push({ name, grades });
        }

        resolve({
          students,
          subjects: subjects.map((s) => String(s).trim()).filter((s) => s),
        });
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsBinaryString(file);
  });
}
