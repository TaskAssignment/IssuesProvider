/**
 * Created by diego on 7/06/16.
 */

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var user = new Schema({
    id   : String,
    user : String,
    name : String,
    email: String,
    repositories:String,
    date : String
});
/*
* repositories (user is a member of)
 commits (indirectly, by repository)
 issues assigned (indirectly)
 comments (indirectly, by repository)
 */
module.exports = user;
