'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
/**
 * Thing Schema
 */
var assessmentSchema = new Schema({
    accountId: String,
    userId: String,
    title: String
});

/**
 * Validations
 */
/*testSchema.path('name').validate(function (text) {
  return !!text;
}, 'You must name the test.');*/

mongoose.model('assessment', assessmentSchema);
