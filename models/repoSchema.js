/**
 * Created by diego on 6/06/16.
 */
// creates a repo schema

var mongoose= require('mongoose');
var Schema = mongoose.Schema;

var repoSchema = new Schema({
    id        : String,
    name      : String,
    full_name : String,
    description : String,
    url         : String,
    service     : String,
    languages   : Array
});

module.exports = repoSchema;