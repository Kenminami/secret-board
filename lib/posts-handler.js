'use strict';
const pug = require('pug');
const Cookies = require('cookies');
const Post = require('./post');

const trackingIdKey = 'tracking_id';

function handle(req, res) {
  const cookies = new Cookies(req, res);
  addTrackingCoolie(cookies);

  switch (req.method) {
    case 'GET':
      res.writeHead(200, {
        'Content-type': 'text/html; charset=utf-8'
      });
      Post.findAll().then((posts) => {
        res.end(pug.renderFile('./views/posts.pug', {
          posts: posts
        }));
        console.info(
          `閲覧されました: user: ${req.user}, ` +
          `remoteAddress: ${req.connection.remoteAddress}`
        );
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
        trackingCookie: cookies.get(trackingIdKey),
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

function addTrackingCoolie(cookies) {
  if (!cookies.get(trackingIdKey)) {
    const trackingId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    const tomorrow = new Date(Date.now() + (1000 * 60 * 60 * 24));
    cookies.set(trackingIdKey, trackingId, { expires: tomorrow });
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