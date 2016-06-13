var mongoose= require('mongoose');
var express = require('express');
var request = require('request');
var router  = express.Router();

var bitbucketURL = "https://api.bitbucket.org/2.0/repositories/";
var gitlabURL    = "https://gitlab.com/api/v3/projects/";
var githubURL    = "https://api.github.com/";

var githubClientID = "396b2089a7431c038c65";
var githubSecretID = "78b41c6b6941d12a01c409a499662d5096d7588a";

mongoose.connect('mongodb://heroku_7r444rng:1i71qc222o89omdlqjjeusmkfb@ds013024.mlab.com:13024/heroku_7r444rng');

var repoSchema = require('../models/repoSchema');
var bugSchema  = require('../models/bugSchema');
var userSchema = require('../models/userSchema');

// we need to create a model for each schema
var repoModel = mongoose.model('repositories', repoSchema);
var bugModel  = mongoose.model('bugs', bugSchema);
var userModel = mongoose.model('users', userSchema);

// welcome route
router.get('/', function(req,res,next){
  res.send('Welcome to the API for services (Github, Gitlab, Bitbucket)');
});

router.get('/gitlab/token/:user/:password', function(req,res,next){
  //curl http://git.ep.petrobras.com.br/api/v3/session --data 'login=myUser&password=myPass'
  request.post('https://gitlab.com/services/v3/session?login='+req.params.user+'&password='+req.params.password+'', function (error, response, body) {
    if (!error) {
      res.send(body) // Show the HTML for the Google homepage.
    }
  })
});

// route for getting repositories given a username
// for the gitlab service provide the access_token at your profile settings

router.get("/:service/:id/repos", function(req,res){

    var url = "";

    var doCall = function (langURL, callback) {
        request.get(langURL, function (err,res,body) {
            callback(body);
        });
    };

    switch (req.params.service) {
        case "github":
          url = {
            url : githubURL+"users/"
                 +req.params.id+"/repos?client_id="
                 +githubClientID+"&client_secret="
                 +githubSecretID+"&per_page=100",
            headers: {
              'User-Agent': 'zdr00'
            }
          };
          break;
        case "bitbucket":
          url += bitbucketURL;
          url += req.params.id;
          break;
        case "gitlab":
          url += gitlabURL;
          url += "?private_token=";
          url += req.params.id;
          break;
        
      }

    var repositories = function (error, response, body) {
        if (!error && response.statusCode == 200) {
            body = JSON.parse(body);
            var issuesArray = [];
            switch (req.params.service){
                case "github":
                    var x = 0;
                    for(x in body){

                        var langURL =
                        {
                            url: githubURL + "repos/"
                            +req.params.id+"/"
                            +body[x].name+"/languages?client_id="
                            +githubClientID+"&client_secret="
                            +githubSecretID+"&per_page=10",
                            headers: {
                                'User-Agent': 'zdr00'
                            }
                        };

                        var saveRepostoArray = function(lang){

                            var repo = new Object();
                            repo.id        = body[x].id;
                            repo.name      = body[x].name;
                            repo.full_name = body[x].full_name;
                            repo.description = body[x].description;
                            repo.url         = body[x].html_url;
                            repo.service     = "github"
                            repo.languages   = lang;

                            /* Creates the model to save to database */
                            var myRepo = new repoModel(repo);
                            myRepo.save(function(err){
                                if(err)
                                    console.log("error saving!");
                                console.log("saved!");
                            });
                        };


                        doCall(langURL, saveRepostoArray);

                    }
                    break;

                case "gitlab":
                    var y;
                    for(y in body){
                        var gitrepo = new Object();
                        gitrepo.id    = body[y].id;
                        gitrepo.name  = body[y].name;
                        gitrepo.full_name   = body[y].path_with_namespace;
                        gitrepo.description = body[y].description;
                        gitrepo.url   = body[y].web_url;
                        gitrepo.service = "gitlab";
                        gitrepo.tags  = body[y].tag_list;
                        /* Creates the model to save to database */
                        var myRepo = new repoModel(gitrepo);
                        myRepo.save(function(err){
                            if(err)
                                console.log("error saving!");
                            console.log("saved!");
                        });
                        //issuesArray.push(gitrepo);
                    }
                    break;

                case "bitbucket":
                    var body = body.values;
                    var z;
                    for(z in body){
                        var repo  = new Object();
                        repo.id   = body[z].uuid;
                        repo.name = body[z].name;
                        repo.full_name   = body[z].full_name;
                        repo.description = body[z].description;
                        repo.url       = body[z].links.self.href;
                        repo.service   = "bitbucket";
                        repo.language  = body[z].language;
                        var myRepo = new repoModel(repo);
                        myRepo.save(function(err){
                            if(err)
                                console.log("error saving!");
                            console.log("saved!");
                        });
                        //issuesArray.push(repo);
                    }
                    break;

            }
            res.send("<p class='lead text-right'>The project information for " + req.params.id+" stored in "+req.params.service+" was succesfully saved to the database</p>");
        }else{
            res.send("Check the user you are looking for");
        }
    };

    request(url, repositories);
});


// route for getting bugs(issues)
router.get('/:service/:user/:repo/bugs', function(req,res,next){
  var url = "";
  switch (req.params.service) {
    case "github":
      url = {
        url : githubURL+"repos/"
              +req.params.user+"/"
              +req.params.repo+"/issues?client_id="
              +githubClientID+"&client_secret="
              +githubSecretID+"&per_page=100",
        headers: {
          'User-Agent': 'zdr00'
        }
      };
      break;

    case "bitbucket":
      url += bitbucketURL;
      url += req.params.user+"/";
      url += req.params.repo+"/issues";
      break;

    case "gitlab":
      url += gitlabURL;
      url += req.params.repo+"/issues";
      url += "?private_token="+req.params.user;
      break;

  }

  console.log(url);

  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        body = JSON.parse(body);
        //var issuesArray = [];
        switch (req.params.service){
            case "github":
                for(x in body){
                    var bugGithub = Object();
                    bugGithub.id    = body[x].id;
                    bugGithub.title = body[x].title;
                    bugGithub.body  = body[x].body;
                    bugGithub.reporter = body[x].user.login;
                    bugGithub.comments = body[x].comments_url;
                    bugGithub.url      = body[x].url;

                    var bm = new bugModel(bugGithub);
                    bm.save(function (err) {
                        if(err)
                            console.log("there was an error!");
                        console.log("saved!");
                    });
                }
                break;
            case "gitlab":
                for(y in body){
                    var bug = new Object();
                    bug.id    = body[y].id;
                    bug.title = body[y].title;
                    bug.body  = body[y].description;
                    bug.reporter = body[y].author.username;
                    bug.comments = "Not available at gitlab";
                    bug.url      = body[y].author.web_url;
                    var bugs     = new bugModel(bug);
                    bugs.save(function (err) {
                        if(err)
                            console.log("error "+err);
                        console.log("Bug saved!");
                    });
                }
                break;
            case "bitbucket":
                var body = body.values;
                var z;
                for(z in body){
                    var bug = new Object();
                    bug.id    = body[z].id;
                    bug.title = body[z].title;
                    bug.body  = body[z].content.raw;
                    bug.reporter = body[z].reporter.username;
                    bug.comments = body[z].links.comments.href;
                    bug.url      = body[z].links.self.href;
                    var bugs = new bugModel(bug);
                    bugs.save(function(err){
                        if(err)
                            console.log("Error!");
                        console.log("bitbucket bugs saved!");
                    });
                }
                break;
        }
        res.send("<p>The bugs from "+req.params.user+"/"+req.params.repo+" stored in "+req.params.service+" were saved to the database</p>")
    }else{
      res.send("Check the user or the repo you are looking for");
    }
  });
});



// route for getting collaborator
router.get('/:service/:user/:repo/users', function(req,res,next){
  var url = "";
  switch (req.params.service) {

    case "github":
      url = {
        url : githubURL+"repos/"
              +req.params.user+"/"
              +req.params.repo+"/contributors?client_id="
              +githubClientID+"&client_secret="
              +githubSecretID+"&per_page=100",
        headers: {
          'User-Agent': 'alisajedi'
        }
      };
      break;

    case "bitbucket":
      url += bitbucketURL;
      url += req.params.user+"/";
      url += req.params.repo+"/watchers";
      break;

    case "gitlab":
      url += gitlabURL;
      url += req.params.repo+"/members";
      url += "?private_token="+req.params.user;
      break;

    default:
      url = "http://example.com";
      break;
  }

  console.log(url);

  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      body = JSON.parse(body);
        var collabArray = [];
        switch (req.params.service){
            case "github":
                var a;
                for(a in body){
                    var collabgithub = new Object();
                    collabgithub.id = body[a].id;
                    collabgithub.user = body[a].login;
                    collabgithub.name = "Name is not provided";
                    collabgithub.email = "Email not provided by github";
                    collabgithub.repositories = body[a].repos_url;
                    collabgithub.date = Date.now();
                    var collab = new userModel(collabgithub);
                    collab.save(function(err){
                       if(err)
                           console.log("error!");
                        console.log("github user saved!");
                    });
                }

                break;
            case "bitbucket":
                body = body.values;
                var b;
                for(b in body){
                    var collab = new Object();
                    collab.id    = body[b].uuid;
                    collab.name  = body[b].display_name;
                    collab.user  = body[b].username;
                    collab.email = "Not available on Bitbucket";
                    collab.date  = new Date.now();
                    var collab = new userModel(collab);
                    collab.save(function(err){
                        if(err)
                            console.log("error!");
                        console.log("bitbucket user saved!");
                    });
                }
                break;
            case "gitlab":
                var c;
                for(c in body){
                    var collablab = {};
                    collablab.id = body[b].id;
                    collablab.name = body[b].name;
                    collablab.user = body[b].username;
                    collab.email = "Not available on Gitlab";
                    collab.date = new Date.now();
                    var collab = new userModel(collab);
                    collab.save(function (err) {
                        if(err)
                            console.log("error");
                        console.log("gitlab user saved!");
                    })
                }
                break;
        }

      res.send("The users from "+req.params.user+"/"+req.params.repo+" were saved to the database!");
    }else{
      res.send("There was en error, try again!");
    }
  });
});

module.exports = router;