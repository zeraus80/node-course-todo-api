var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var connectPath, options;
//Check if we are on Heroku
if (process.env.NODE_ENV === 'production') {
    //connectPath = `mongodb://ds241019.mlab.com:41019/javier-todo`;
    options = {
        auth: {
            user: 'jnavarro',
            password: 'zuca6419'
        }
    };
    mongoose.connect(process.env.MONGODB_URI, options).then(() => console.log('success connection'), err => console.log(err));
} else {
    mongoose.connect(process.env.MONGODB_URI);
/*     connectPath = 'mongodb://localhost:27017/TodoApp';
    options = {}; */
}

//mongoose.connect(process.env.MONGODB_URI, options).then(() => console.log('success connection'), err => console.log(err));

module.exports = { mongoose };