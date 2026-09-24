export const users = {
  guest: { id: "guest", name: "Guest", role: "PUBLIC", programme: "" },
  student: {
    id: "STU-2024-0187",
    name: "Arjun Menon",
    role: "STUDENT",
    programme: "B.Tech Computer Science & Engineering",
    semester: "Semester V",
    email: "arjun.menon@institute.edu",
  },
  faculty: {
    id: "FAC-118",
    name: "Dr. Meera Nair",
    role: "FACULTY",
    department: "Computer Science & Engineering",
    email: "meera.nair@institute.edu",
  },
  admin: {
    id: "ADM-001",
    name: "Portal Administrator",
    role: "ADMIN",
    department: "Academic Administration",
    email: "admin@institute.edu",
  },
};

export const notices = [
  { date: "23 Sep", tag: "Academic", title: "End-semester registration window is now open.", body: "Students are requested to review their registered courses before the deadline." },
  { date: "21 Sep", tag: "Examination", title: "Mid-semester examination timetable published.", body: "The detailed schedule is available under Examinations." },
  { date: "18 Sep", tag: "Campus", title: "Annual technical symposium registrations opened.", body: "Registration is available through the Events section." },
];

export const studentStats = [
  ["CGPA", "8.42", "Current cumulative performance"],
  ["Attendance", "87.4%", "Across registered courses"],
  ["Credits", "92", "Credits completed"],
  ["Backlogs", "0", "Current outstanding courses"],
];

export const timetable = [
  ["09:00", "Database Management Systems", "CSE 302", "LH-204"],
  ["11:00", "Computer Networks", "CSE 304", "LH-106"],
  ["14:00", "Operating Systems", "CSE 306", "LH-301"],
];

export const courses = [
  ["CSE 302", "Database Management Systems", "Dr. R. Krishnan", "4"],
  ["CSE 304", "Computer Networks", "Dr. Meera Nair", "4"],
  ["CSE 306", "Operating Systems", "Prof. A. Thomas", "4"],
  ["CSE 308", "Software Engineering", "Dr. P. Iyer", "3"],
];

export const attendance = [
  ["Database Management Systems", "91%", "39 / 43"],
  ["Computer Networks", "84%", "36 / 43"],
  ["Operating Systems", "88%", "38 / 43"],
  ["Software Engineering", "86%", "31 / 36"],
];

export const results = [
  ["Database Management Systems", "A", "9"],
  ["Computer Networks", "A-", "8"],
  ["Operating Systems", "A", "9"],
  ["Software Engineering", "B+", "7"],
];

export const facultyClasses = [
  ["CSE 304", "Computer Networks", "Semester V", "62 students"],
  ["CSE 504", "Distributed Systems", "Semester VII", "48 students"],
];

export const adminStats = [
  ["Students", "4,862"],
  ["Faculty", "318"],
  ["Departments", "14"],
  ["Active Courses", "436"],
];