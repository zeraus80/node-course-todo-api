const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.warn('Unable to connect to mongodb server');
    }
    console.log('Connect to mongodb server');
    
    const db = client.db('TodoApp');
/*     db.collection('Todos').insertOne({
        text: 'something to do',
        completed: false
    }, (err, result) => {
        if (err) {
            return console.log('Unable to insert todo', err);
        }
        console.info(JSON.stringify(result.ops, undefined, 2))
    }); */

    db.collection('Users').insertOne({
        name: 'Luffy',
        age: 17, 
        location: 'East Blue'
    }, (err, result) => {
        if (err) {
            return console.warn('Unable to insert user', err);
        }
        console.info(JSON.stringify(result.ops, undefined, 2));
    });

    client.close();
})