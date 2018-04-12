const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb'); 

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: 'clean the room'
}, {
    _id: new ObjectID(),
    text: 'go tho the gym',
    completed: true,
    completedAt: 333
}];


beforeEach(done => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});


describe('POST /todos', () => {

    it('should create a new todo', done => {
        var text = 'Text to do test';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect(res => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) return done(err);
                Todo.find({text}).then(todos => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch(e => done(e));
            })
    });

    it('should not create to do with invalid body data', done => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                Todo.find().then(todos => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch(e => done(e));                
            })
    });
});

describe('GET /todos', () => {
    it('should get all todos', done => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect(res => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
})

describe('GET /todos/:id', () => {
    it('should return todo doc', done => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return 404 if todo not found', done => {
        const todoId = new ObjectID();
        request(app)
            .get(`/todos/${todoId.toHexString()}`)
            .expect(404)
            .end(done);        
    });

    it('should return 404 for non-object ids', done => {
        request(app)
            .get('/todos/123')
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', done => {
        var hexId = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) return done(err);

                Todo.findById(hexId).then(todo => {
                    expect(todo).toBeNull();
                    done();
                }).catch(err => done(err));
            })
    });

    it('should return 404 if todo not found', done => {
        const todoId = new ObjectID();
        request(app)
            .delete(`/todos/${todoId.toHexString()}`)
            .expect(404)
            .end(done);                
    });
    
    it('should return 404 if object id is invalid', done => {
        request(app)
        .delete('/todos/123')
        .expect(404)
        .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update the todo', done => {
        var hexId = todos[0]._id.toHexString();
        const payload = {
            text: 'clean desk',
            completed: true
        };
        request(app)
            .patch(`/todos/${hexId}`)
            .send(payload)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(payload.text);
                expect(res.body.todo.completed).toBeTruthy();                
            })
            .end(done);        
    });

    it('should clear completedAt when todo is not completed', done => {
        var hexId = todos[1]._id.toHexString();
        const payload = {
            text: 'clean bathroom',
            completed: false
        };        
        request(app)
            .patch(`/todos/${hexId}`)
            .send(payload)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(payload.text);
                expect(res.body.todo.completed).toBeFalsy();                
                expect(res.body.todo.completedAt).toBeNull();                
            })
            .end(done);  

    });
});