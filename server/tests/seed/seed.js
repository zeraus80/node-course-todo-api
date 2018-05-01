const { ObjectID } = require('mongodb'); 
const jwt = require('jsonwebtoken');

const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');

const userOneId = new ObjectID();
const userTowId = new ObjectID();

const users = [{
    _id: userOneId,
    email: 'zeraus80@hotmail.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
    }]
}, {
    _id: userTowId,
    email: 'zeraus1@hotmail.com',
    password: 'userTwoPass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTowId, access: 'auth'}, 'abc123').toString()
    }]    
}];

const todos = [{
    _id: new ObjectID(),
    text: 'clean the room',
    _creator: userOneId
}, {
    _id: new ObjectID(),
    text: 'go tho the gym',
    completed: true,
    completedAt: 333,
    _creator: userTowId
}];

const populateTodos = done => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
};

const populateUsers = done => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
        return Promise.all([userOne, userTwo]);
    }).then(() => done());
}

module.exports = { todos, populateTodos, users, populateUsers };
