var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var connectPath, options;
//Check if we are on Heroku
if(process.env.PORT){
 connectPath = "mongodb://<dbuser>@ds241019.mlab.com:41019/javier-todo";
 options= {
     auth: {
         user: 'jnavarro',
         password: 'zuca6419'
     }
 }
}else{
 connectPath = "mongodb://localhost:27017/TodoApp";
 options = {}
}
mongoose.connect(connectPath, options);

module.exports = { mongoose };