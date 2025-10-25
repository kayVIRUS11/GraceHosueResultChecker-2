export type Student = {
  id: number;
  name: string;
  regNumber: string;
  class: string;
  status: string;
};

export const studentProfile = {
  name: "John Doe",
  regNumber: "MM-2024-001",
  class: "JSS 3",
  session: "2023/2024",
  term: "Third Term",
  photoUrl: "https://picsum.photos/seed/student1/200/200",
};

export const currentResults = [
  { subject: "Mathematics", test1: 15, test2: 18, test3: 10, exam: 45 },
  { subject: "English Language", test1: 18, test2: 17, test3: 12, exam: 50 },
  { subject: "Basic Science", test1: 19, test2: 20, test3: 14, exam: 55 },
  { subject: "Basic Technology", test1: 17, test2: 15, test3: 13, exam: 48 },
  { subject: "Social Studies", test1: 20, test2: 19, test3: 9, exam: 52 },
  { subject: "Civic Education", test1: 16, test2: 18, test3: 15, exam: 49 },
  { subject: "Computer Science", test1: 20, test2: 20, test3: 15, exam: 58 },
  { subject: "Agricultural Science", test1: 14, test2: 16, test3: 11, exam: 40 },
  { subject: "Home Economics", test1: 18, test2: 17, test3: 13, exam: 47 },
];

export const performanceData = [
  { term: "1st Term '23", average: 68 },
  { term: "2nd Term '24", average: 72 },
  { term: "3rd Term '24", average: 81 },
];

export const studentsForTeacher = [
    { id: 1, name: "Alice Johnson", reg: "MM-2024-002", scores: { test1: 18, test2: 19, test3: 15, exam: 55 } },
    { id: 2, name: "Bob Williams", reg: "MM-2024-003", scores: { test1: 15, test2: 17, test3: 12, exam: 48 } },
    { id: 3, name: "Charlie Brown", reg: "MM-2024-004", scores: { test1: 20, test2: 20, test3: 14, exam: 58 } },
    { id: 4, name: "Diana Miller", reg: "MM-2024-005", scores: { test1: 17, test2: 16, test3: 13, exam: 50 } },
    { id: 5, name: "Ethan Davis", reg: "MM-2024-006", scores: { test1: 19, test2: 18, test3: 11, exam: 52 } },
];

export const allStudents: Student[] = [
    { id: 1, name: "John Doe", regNumber: "MM-2024-001", class: "JSS 3A", status: "Active" },
    { id: 2, name: "Alice Johnson", regNumber: "MM-2024-002", class: "JSS 3A", status: "Active" },
    { id: 3, name: "Bob Williams", regNumber: "MM-2024-003", class: "JSS 3A", status: "Active" },
    { id: 4, name: "Charlie Brown", regNumber: "MM-2024-004", class: "JSS 3B", status: "Suspended" },
    { id: 5, name: "Diana Miller", regNumber: "MM-2024-005", class: "JSS 3B", status: "Active" },
    { id: 6, name: "Ethan Davis", regNumber: "MM-2024-006", class: "SSS 1A", status: "Graduated" },
    { id: 7, name: "Fiona Garcia", regNumber: "MM-2024-007", class: "SSS 1A", status: "Active" },
];

export const classReportData = {
    className: "JSS 3A",
    session: "2023/2024",
    term: "Third Term",
    students: [
        { name: "John Doe", totalScore: 750, average: 75, position: 2 },
        { name: "Alice Johnson", totalScore: 810, average: 81, position: 1 },
        { name: "Bob Williams", totalScore: 720, average: 72, position: 3 },
    ],
    subjects: [
        { name: "Mathematics", classAverage: 70 },
        { name: "English Language", classAverage: 78 },
        { name: "Basic Science", classAverage: 82 },
    ]
};
