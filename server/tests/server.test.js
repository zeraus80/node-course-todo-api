const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb'); 

const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');
const { todos, populateTodos, users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);


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

describe('GET /users/me', () => {

    it('should return user if authenticated', done => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);    
    });

    it('should return 401 if not authenticated', done => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect(res => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });

});

describe('POST /users', () => {
    
    it('should create a user', done => {
        var email = 'zeraus@hotmail.com';
        var password = '123dfj!';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect(res => {
                expect(res.headers['x-auth']).toBeDefined();
                expect(res.body._id).toBeDefined();
                expect(res.body.email).toBe(email);
            })
            .end(err => {
                if (err) return done(err);
                User.findOne({email}).then(user => {
                    expect(user).toBeDefined();
                    expect(user.password).not.toBe(password);
                    done();
                }).catch(e => done(e));
            });
            
    });
    
    it('should return validation errors if request invalid', done => {
        var email = 'jgdsjf';
        var password;

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);
    });
    
    it('should not create user if email in use', done => {
        var email = users[0].email;
        var password = '123refsdaf';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);
    });

});

describe('POST /users/login', () => {
    
    it('should login user and return auth token', done => {
        const {email, password, _id} = users[1];
        request(app)
            .post('/users/login')
            .send({email, password})
            .expect(200)
            .expect(res => {
                expect(res.headers['x-auth']).toBeDefined();
            })
            .end((err, res) => {
                if (err) return done(err);

                User.findById(_id).then(user => {
                    expect(user.tokens[0]).toMatchObject({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch(e => done(e));
            });
    });
    
    it('should reject invalid login', done => {
        const {email, _id} = users[1];
        const password = 'asafdgete';
        request(app)
            .post('/users/login')
            .send({email, password})
            .expect(400)
            .expect(res => {
                expect(res.headers['x-auth']).not.toBeDefined();
            })
            .end((err, res) => {
                if (err) return done(err);

                User.findById(_id).then(user => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch(e => done(e));
            });
    });
});

describe('DELETE /users/me/token', () => {
    it('should remove auth token on logout', done => {
        const {_id} = users[0];
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                User.findById(_id).then(user => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch(e => done(e));
            });
    });
});