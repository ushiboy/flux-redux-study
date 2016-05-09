module.exports = runApiServer;

function runApiServer(port) {
  port = port || 3001;
  var connect = require('connect')
  , http = require('http')
  , app = connect()
  , state = {
    count: 0
  };

  app.use('/api/count', (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(state));
  });
  app.use('/api/vote', (req, res) => {
    var method = req.method.toUpperCase();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    if (method === 'POST') {
      state.count += 1;
    } else if (method === 'DELETE') {
      state.count -= 1;
    } else {
      res.end('Method Not Allowed', 405);
      return;
    }
    res.end(JSON.stringify(state));
  });
  http.createServer(app).listen(port);
}
