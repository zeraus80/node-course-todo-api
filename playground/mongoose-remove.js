const { ObjectId } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');

/* Todo.remove({})
    .then(result => console.log(result)); */

Todo.findByIdAndRemove('5acd5b217c48a78803fce6c8')  
    .then(doc => console.log(doc));