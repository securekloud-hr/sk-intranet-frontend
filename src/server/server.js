const express = require('express');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());

app.get('/api/user', (req, res) => {
  const username =
    req.headers['x-iisnode-logon_user'] ||
    req.headers['x-authenticated-user'] ||
    req.headers['remote_user'] ||
    req.headers['x-iisnode-auth_user'] ||
    'guest';

  res.json({ username });
});

app.listen(port, () => {
  console.log(`✅ Backend running at http://localhost:${port}`);
});
