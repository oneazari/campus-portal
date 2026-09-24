exports.getAdminPage = (req, res) => {
  res.json({ page: 'admin-page', access: 'Full Admin Access' });
};

exports.getFacultyPage = (req, res) => {
  res.json({ page: 'faculty-page', access: 'Faculty & Admin Access' });
};

exports.getStudentPage = (req, res) => {
  res.json({ page: 'student-page', access: 'Student, Faculty & Admin Access' });
};