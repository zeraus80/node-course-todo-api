var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var connectPath, options;
//Check if we are on Heroku
if (process.env.NODE_ENV === 'production') {
    options = {
        auth: {
            user: 'jnavarro',
            password: 'zuca6419'
        }
    };
    mongoose.connect(process.env.MONGODB_URI, options).then(() => console.log('success connection'), err => console.log(err));
} else {
    mongoose.connect(process.env.MONGODB_URI);
}

module.exports = { mongoose };