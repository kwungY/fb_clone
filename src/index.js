const setup = require('./app');
const config = require('./config')
const port = config.port || 5000;
const host = config.host || '127.0.0.1';

setup().then(app => {
  app.listen(port, () => {
    console.log(`Server is running on http://${host}:${port}`);
  });
}).catch(err => {
  console.error('Failed to initialize the app:', err);
  process.exit(1);
});