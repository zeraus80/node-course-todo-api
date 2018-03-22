const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.warn('Unable to connect to mongodb server');
    }
    console.log('Connect to mongodb server');
    
    const db = client.db('TodoApp');
/* 
    db.collection('Todos').find({
        _id: new ObjectID('5ab1a0fa31c4a213c0c91421')
    }).toArray().then(docs => {
        console.log('todos');
        console.log(JSON.stringify(docs, undefined, 2));
    }, err => console.log('Unable to fetch todos', err));
 */

    db.collection('Todos').find().count().then(count => {
        console.log('todos count', count);
    }, err => console.log('Unable to fetch todos', err));


    //client.close();
})