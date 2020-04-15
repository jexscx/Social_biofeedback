import BioFeedback from './server/biofeedback';
const express=require("express");
const app = express(); //123
const http = require('http').createServer(app);
const path = require('path')
const io = require('socket.io')(http, {path: "/socket1/"}); //huh
app.use("/static", express.static(path.join(__dirname, "public")))
// app.use(express.static('public'))//123

app.set('view-engine', 'ejs');

let activesession = false;
let joinedpool = { client: null, therapist: null }

io.on('connection', function(socket){
    var user;

    const checkStartSession = (role) => {
        var started = (joinedpool.client != null && joinedpool.therapist != null)
        if (started) {
            console.log("STARTING SESSION!!");
            activesession = true;
        }
        io.emit('sessionActivity', {started: started, change: {role: role, status: 'active'}})
    }

    let id = Date.now();
    console.log(`A user is connected with id ${id}`);
    io.emit('serverMsg', 'Hello from the other sssiiiiiiiiiiiiiiideeeeeee');

    socket.on('notification', function(msg) {
        console.log(msg);
    })

    socket.on('session-activity', function(msg) {
        if(msg == 'completed') {
            io.emit('sessionActivity','completed')
            return
        }
        switch(msg.activity) {
            case 'joined-client':
                joinedpool.client = id
                console.log(`a client has joined with id: ${id}`)
                checkStartSession('client');
                break;
            case 'joined-therapist':
                joinedpool.therapist = id
                console.log(`a therapist has joined with id: ${id}`)
                checkStartSession('therapist');
                break;
            default:
                break;
        }



    })

    socket.on('disconnect', function() {
        console.log(`A user with id ${id} has disconnected`)
        if((id == joinedpool.client || id == joinedpool.therapist) && activesession)  {
            activesession = false;
            joinedpool = {}
            console.log('Ending session')
        }
        if(id == joinedpool.client) {
            joinedpool.client = null
            io.emit('sessionActivity', {started: false, change: {role: 'client', status: 'inactive'}})

        }
        if(id == joinedpool.therapist) {
            joinedpool.therapist = null
            io.emit('sessionActivity', {started: false, change: {role: 'therapist', status: 'inactive'}})
        }
        console.log(joinedpool)

    });

});

io.on('blalb', function () {

})

app.get('/', function(req, res){
   res.render('homepage.ejs', {activesession: activesession, joinedpool: joinedpool});
});

const bioFeedback = new BioFeedback();
bioFeedback.init().subscribe(data => {
    io.emit('arduino', data)
  console.log(data);
});



http.listen(8050, function(){
    console.log('listening on *:8050');
});
