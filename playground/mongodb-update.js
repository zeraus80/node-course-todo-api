const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.warn('Unable to connect to mongodb server');
    }
    console.log('Connect to mongodb server');
    
    const db = client.db('TodoApp');

    db.collection('Todos').findOneAndUpdate({
        _id: new ObjectID('5ab5b1558fcfb439912ade62')
    }, {
        $set: {
            completed: true
        }
    }, {
        returnOriginal: false
    }).then(result => console.log(result));
    //client.close();
})