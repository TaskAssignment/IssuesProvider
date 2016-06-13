var mongoose = require('mongoose');
var request = require('request');
var express = require('express');
var router = express.Router();

var bugzillaURL  = "https://bugzilla.mozilla.org/rest/";
var bugpartyURL  = "http://localhost:8080/bugparty/";
var eclipseURL   = "";


var repoSchema = require('../models/repoSchema');
var bugSchema  = require('../models/bugSchema');
var userSchema = require('../models/userSchema');
var bugzillaSchema = require('../models/bugzillaSchema');

// we need to create a model for each schema
var repoModel = mongoose.model('repositories', repoSchema);
var bugModel  = mongoose.model('bugs', bugSchema);
var userModel = mongoose.model('users',userSchema);
var bugzillaModel = mongoose.model('bugzilla',bugzillaSchema);


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('This is the endpoint for products (BugParty, Mozilla, Eclipse)');
});


router.get('/:service/:product/:component/repos',function(req,res){

    var url = "";

    switch (req.params.service){
        case "bugparty":
            url += bugparty;
            url += req.params.id+"/reports";
            break;
        case "bugzilla":
            url += bugzillaURL;
            url += "product?names="+req.params.id;
            break;
        case "eclipse":
            url += "";
            break;
        default:
            url += "http://www.example.com";
            break;
    }

    var repos = function(error, response, body){
        if(!error && response.statusCode == 200){
            body = JSON.parse(body);

            switch (req.params.service){
                case "bugparty":
                    break;

                case "bugzilla":
                    var body =  body.products[0].components;
                    var m;
                    for(m in body){
                        var component = new Object();
                        component.id   = body[m].id;
                        component.name = body[m].name;
                        component.description = body[m].description;
                        component.full_name   = body[m].default_assigned_to;
                        var myRepo = new repoModel(component);
                        myRepo.save(function(err){
                            if(err)
                                console.log("error saving!");
                            console.log("saved!");
                        });
                    }
                    break;
                case "eclipse":
                    break;
            }
            res.send("The projects information from "+req.params.product);
        }else{
            res.send("There was an error finding the projects");
        }
    };
    request(url, repos);
});

router.get('/:service/:product/:component/bugs',function (req,res) {
    var url = "";
    var doCall = function (langURL, callback) {
        request.get(langURL, function (err,res,body) {
            callback(body);
        });
    };
    switch (req.params.service){
        case "bugparty":
            url += bugpartyURL;
            url += req.params.component+"/bugs/";
            url += req.params.user;
            break;

        case "bugzilla":
            url += bugzillaURL;
            url += "bug?component="+req.params.component;
            url += "&product="+req.params.product;
            break;
    }

    request(url, function (error,response,body) {
        if(!error && response.statusCode==200){
            body = JSON.parse(body);
            switch(req.params.service){
                case "bugparty":
                    var bug = new Object();
                    bug.id    = body.bugid;
                    bug.title = body.title;
                    bug.body  = body.description;
                    bug.reporter = body.reportedBy;
                    bug.comments = body.comment.what;
                    bug.url = "http://localhost:8080"+body.location;
                    var bugs = new bugModel(bug);
                    bugs.save(function(err){
                        if(err)
                            console.log("there was an error!");
                        console.log("bug saved!");
                    });
                    break;

                case "bugzilla":
                    body = body.bugs;
                    var n;
                    for(n in body){

                        var saveRepostoArray = function(history){
                            var bug = new Object();
                            bug.id    = body[n].id;
                            bug.title = body[n].alias;
                            bug.body  = body[n].description;
                            bug.reporter = body[n].cc_list;
                            bug.url      = body[n].url;
                            bug.severity = body[n].severity;
                            bug.status   = body[n].status;
                            bug.open     = body[n].open;
                            bug.classification = body[n].classification;
                            bug.component      = body[n].component;
                            bug.creationTime   = body[n].creation_time;
                            bug.assignedEmail  = body[n].assigned_to_detail.email;
                            bug.creatorEmail   = body[n].creator_detail.email;
                            bug.cc      = body[n].cc;
                            bug.version = body[n].version;
                            bug.op_sys  = body[n].op_sys;
                            bug.product = body[n].product;
                            bug.history = history.bugs;

                            var bugs = new bugzillaModel(bug);
                            bugs.save(function(err){
                                if(err)
                                    console.log("error!");
                                console.log("saved!")
                            });
                            console.log(history);
                        };



                        doCall("https://bugzilla.mozilla.org/rest/bug/"+body[n].id+"/history", saveRepostoArray);
                    }
                    break;
            }
            res.send("The bugs from bugzilla: product"+req.params.product+" are now saved to the db");
        }else{
            res.send("There was en error!");
        }
    });
});

router.get("/:service/:product/:component/users",function(req,res){
    var url = "";
    switch (req.params.service){
        case "bugparty":
            url += bugpartyURL;
            url += req.params.repo+"/topics/alldates";
            break;
        case "bugzilla":
            break;
        case "eclipse":
            break;
    }
    request(url, function(error, response, body){
        switch (req.params.service){
            case "bugparty":
                break;
            case "bugzilla":
                break;
            case "eclipse":
                break;
        }
    });
});

module.exports = router;
