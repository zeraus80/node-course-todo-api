const {ObjectId} = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');

var id = '5abd891b9bc77a270c730db5';

if (!ObjectId.isValid(id)) {
    console.log('ID not valid');
}

Todo.find({
    _id: id
}).then(todos => console.log(todos));

Todo.findOne({
    _id: id
}).then(todo => console.log(todo));

Todo.findById(id).then(todo => {
    if (!todo) {
        return console.log('Id not found');
    }
    console.log(todo);
}).catch(e => console.log(e));
