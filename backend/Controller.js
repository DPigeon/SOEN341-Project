const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const User = require('./User')
const Persistence = require('./Persistence')

// ============ Allow Requests from a Browser ==========
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next()
})

app.get('/', (req, res) => {
    res.status(200)
    res.contentType('application/json')
    res.json({
        response: 'hello world',
        method: "GET"
    })
    console.log("Get request at path '/'")
})

app.post('/signup', (req,res)=>{
    const{firstname,lastname,email,password,isteacher} = req.body
    const user = new User({firstname,lastname,email,password,isteacher})
    console.log('Attemp at signup:\n',);
    console.log(user);
    const {success, message} = Persistence.RegisterUser(user)
    const status = {success,message}
    console.log(status);
    res.json(status)
    res.end()
})

app.post('/login',(req,res)=>{
    const{firstname,lastname,email,password, isteacher} = req.body
    const user = new User({firstname,lastname,email,password, isteacher})
    console.log(user)
    res.contentType('application/json')
    res.send(Persistence.queryStringify(user))
})

const MessageController = require('./controllers/Message');
const messageController = new MessageController;

app.post('/messages', messageController.create);
app.get('/messages/:messageId', messageController.getById);
app.put('/messages/:messageId', messageController.updateById);
app.delete('/messages/:messageId', messageController.deleteById);
//const messageRouter = require('./routes/Message');
//app.use('/messages', messageRouter);

const ThreadController = require('./controllers/Thread');
const threadController = new ThreadController;

app.get('/threads', threadController.getAll);
app.post('/threads', threadController.create);
app.get('/threads/:threadId', threadController.getById);
app.put('/threads/:threadId', threadController.updateById);
app.get('/threads/:threadId/messages', threadController.getAllMessagesById);

let port = 8000
app.listen(port, () => {
    console.log('backend started on port', port)
})

module.exports = app;
