/**
 * Created by diego on 6/06/16.
 */
// creates a bug schema

var mongoose= require('mongoose');
var Schema = mongoose.Schema;

var repoSchema = new Schema({
    id       : String,
    title    : String,
    body     : String,
    reporter : String,
    comments : String,
    datetime : String,
    url      : String
});

module.exports = repoSchema;