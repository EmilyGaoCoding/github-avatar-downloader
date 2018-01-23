request = require('request');
fs = require('fs');
require('dotenv').config();
token = process.env.GITHUB_TOKEN;
var repo = process.argv.slice(2);

if (repo.length !== 2) {
  return console.log("I can't continue without the repo owner and repo names!");
}

console.log('Welcome to the GitHub Avatar Downloader!');

// download from URL and save
function downloadImageByURL(url, filePath) {
  request.get(url)
    .on('err', err => { throw err; })
    .pipe(fs.createWriteStream(filePath));
}

// loop through all contributors to save their avatar_url
function saveAvatar(err, body) {
  if (err) throw err;

  JSON.parse(body).forEach(user => {
    if (!fs.existsSync('./avatars/')) {
      fs.mkdirSync('./avatars/');
    }

    downloadImageByURL(user.avatar_url, ('./avatars/' + user.login + '.png'))
  })
}

// find contributors info from a repo
function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request'
    },
    token: token.GITHUB_TOKEN
  };

  request(options, function(err, res, body) {
    cb(err, body);
  });
}

getRepoContributors(repo[0], repo[1], saveAvatar);
