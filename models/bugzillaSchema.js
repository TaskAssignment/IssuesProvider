/**
 * Created by diego on 10/06/16.
 */

var mongoose = require("mongoose");
var Schema   = mongoose.Schema;

var user = new Schema({
    id      : String,
    title   : String,
    body    : String,
    reporter: String,
    url     : String,
    severity: String,
    status  : String,
    open    : String,
    classification : String,
    component      : String,
    creationTime   : String,
    assignedEmail  : String,
    creatorEmail   : String,
    history : Object,
    cc      : String,
    version : String,
    op_sys  : String,
    product : String
});
/*
 repositories (user is a member of)
 commits      (indirectly, by repository)
 issues assigned (indirectly)
 comments     (indirectly, by repository)
 */
module.exports = user;