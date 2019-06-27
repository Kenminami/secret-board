'use strict';
const pug = require('pug');
const Post = require('./post');

function handle(req, res) {
  switch (req.method) {
    case 'GET':
      res.writeHead(200, {
        'Content-type': 'text/html; charset=utf-8'
      });
      Post.findAll().then((posts) => {
        res.end(pug.renderFile('./views/posts.pug', {
          posts: posts
        }));
      });
      break;
    case 'POST':
    let body = [];
    req.on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      body = Buffer.concat(body).toString();
      const decoded = decodeURIComponent(body);
      const content = decoded.split('content=')[1];
      console.info('投稿されました: ' + content);
      Post.create({
        content: content,
        trackingCookie: null,
        postedby: req.user
      }).then(() => {
        handleRedirectPosts(req, res);
      });
    });
      break;
    default:
      break;
  }
}

function handleRedirectPosts(req, res) {
  res.writeHead(303, {
    'Location': '/posts'
  });
  res.end();
}

module.exports = {
  handle
};