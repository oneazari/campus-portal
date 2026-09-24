const app = require('./app');
const { PORT } = require('./config/env');

app.listen(PORT, () => {
  console.log(`Auth backend server running on http://localhost:${PORT}`);
});