'use strict';
const pug = require('pug');

function handle(req, res) {
  switch (req.method) {
    case 'GET':
      res.writeHead(200, {
        'Content-type': 'text/html; charset=utf-8'
      });
      res.end(pug.renderFile('./views/posts.pug'));
      break;
    case 'POST':
      break;
    default:
      break;
  }
}

module.exports = {
  handle
};