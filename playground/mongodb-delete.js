const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.warn('Unable to connect to mongodb server');
    }
    console.log('Connect to mongodb server');
    
    const db = client.db('TodoApp');

    // delete many
    //db.collection('Todos').deleteMany({ text: 'eat lunch'}).then(result => console.log(result));

    // delete one
    //db.collection('Todos').deleteOne({ text: 'eat lunch'}).then(result => console.log(result));

    // find one and delete
    //db.collection('Todos').findOneAndDelete({ completed: false }).then(result => console.log(result));

    //client.close();
})