let activesession = false
let role
let username
const socket = io({path: "/socket1/"}) //slavaserver-specific magic (running multiple diffenrent socket-io instances)

//tokens for the vidyo webcam chat service
let tokens = {
    client: 'cHJvdmlzaW9uADIzNDIzNEA5ZGEyZDQudmlkeW8uaW8ANjM3NDcwMDY0MjgAADJjMTBjMmEwZjI1MTMyNWFjMzQ1MTkxYTcxOWRjY2FiMTM2MjY5MDI1NGU1YzlmODMzNzIxNGM5OTk1YzJmNWY3MzcxYjgyMTRlMzIzYzE0MTY1YTUwZGFmMTBiYzE5Mg==',
    therapist: 'cHJvdmlzaW9uADIzNTQyMzRAOWRhMmQ0LnZpZHlvLmlvADYzNzQ3MDA2NDQzAAA1YmM2NDc2ZWVlYzgzNDEzNjM4MDA3ZTk4MDFlODBmNzI0MTdjOTU3ZTIwMjc1NDE1ZmU2NzZkMWY2OWFhMjU0Y2E4NzhkOTIwYmZmZTNmZjQxM2FiOTQxYWUxM2EzY2Y='
}

//so that we can quickly see in the console if socket.io is (not) working)
socket.on('serverMsg', function(msg){ console.log(msg); })

socket.on('arduino', function(arduinoData) {
    updateBiosignals(arduinoData)
})

function updateBiosignals(data) {
    console.log(data)
    const heartbeatLive = document.querySelector('#heartbeat-live');
    const skinconductanceLive = document.querySelector('#skinconductance-live');
    heartbeatLive.innerHTML = data.heartrate;
    skinconductanceLive.innerHTML = data.conduction;
    if(data.conduction <= 0){
        document.getElementById('stressColor').style.backgroundColor = 'green';
    } else if (data.conduction <= 1){
        document.getElementById('stressColor').style.backgroundColor = 'orange';
    } else if (data.conduction > 1){
        document.getElementById('stressColor').style.backgroundColor = 'red';
    }
    
}

//recieving data from the server (via socket)
socket.on('sessionActivity', function (statusChange) {
    console.log(statusChange)
    if (statusChange == 'completed') { endSession(); return }
    if(statusChange.started == false) {
        switch(statusChange.change.role) {
            case 'client':
                if(statusChange.change.status == 'active')  $( "#join-client" ).addClass( "disabled" );
                if(statusChange.change.status == 'inactive')  $( "#join-client" ).removeClass( "disabled" );
                break;
            case 'therapist':
                if(statusChange.change.status == 'active')  $( "#join-therapist" ).addClass( "disabled" );
                if(statusChange.change.status == 'inactive')  $( "#join-therapist" ).removeClass( "disabled" );
                break;
        }
    } else {
        if(role == 'client') fireVideo({state: 'READY'}, {role: role, token: tokens.client});
        if(role == 'therapist') fireVideo({state: 'READY'}, {role: role, token: tokens.therapist});

    }
})



function joinSession(newRole) {
    let nameInput = document.getElementById("enter-username");
    if (nameInput.value == '' || nameInput.value == null || activesession) return showUsernameErrorPopUp(newRole);
    console.log(`Joining session as a ${newRole}`)
    let now = Date.now(); // Unix timestamp in milliseconds
    socket.emit('session-activity', {activity: `joined-${newRole}`, id: now})
    role = newRole;
    if (role ==  'client') $( "#information" ).remove();
    username = nameInput.value
    showWaitingWindow()
}

function showUsernameErrorPopUp(role) {
    let joinButton = (role == 'client') ? '#join-client' : '#join-therapist';
    $(joinButton)
        .popup({
            position : 'top center',
            content    : 'Please specify a username',
            on: false
        })
    ;
    $(joinButton)
        .popup('show')
    ;
}

function showWaitingWindow() {
    $('#enter-username').parent().css('display', 'none')
    $('#waiting').css('display', 'block')
    $('#sign-in-buttons').css('display', 'none')
    console.log(role)
    let otherParty = role == 'client' ? "therapist" : "client";
    $('#waitingtext').html(`Waiting for the ${otherParty} to join!`)
}

function fireInfoOverlay() {
    $('#information').css('display', 'block')
}

function fireTimerOverlay() {
    let timerOverlay = document.getElementById("timerOverlay")
    let stopButton = document.getElementById("stopBtn")
    stopButton.addEventListener('click', function () {
        endSession()
        socket.emit('session-activity', 'completed')
    })
    timerOverlay.style.display = 'flex';
    setInterval(function() {
        let now = document.getElementById("countdown")
        // console.log(now.innerHTML.substring(0,2));
        // console.log(now.innerHTML.substring(3,5));

        let mins = parseFloat(now.innerHTML.substring(0,2));
        let secs = parseFloat(now.innerHTML.substring(3,5));
        // console.log(`Mins: ${mins} Secs: ${secs}`)
        if (secs == 59) {
            secs = 0; mins ++
        } else {
            secs++;
        }
        mins = mins < 10 ? `0${mins.toString()}` : mins
        secs = secs < 10 ? `0${secs.toString()}` : secs
        now.innerHTML = `${mins}:${secs}`;
    }, 1000)
}

function endSession() {
    let now = document.getElementById("countdown").innerHTML;
    $('#video-container').css('display', 'none')
    $('#timerOverlay').css('display', 'none')
    $('#waiting').css('display', 'none')

    $('#main').css('display', 'none')
    $('#sessionCompleted').css('display', 'block')
    $('#completedDuration').html(now);
    $('#information').css('display', 'none')
}

window.addEventListener('DOMContentLoaded', function () {
    let userNameInput = document.getElementById('enter-username');
    userNameInput.addEventListener('input', function(){
        $('#join-client')
            .popup('destroy')
        ;
        $('#join-therapist')
            .popup('destroy')
        ;
    })

    userNameInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            joinSession('client')
        }
    });

})

function fireVideo(status, tokendata) {
    $('#video-container').css('display', 'block');
    console.log(`Vidyo shizzle status: ${status.state}`)
    console.log(`token data: ${tokendata}`)
    if (status.state == "READY") {
        VC.CreateVidyoConnector({
            viewId: "renderer",
            viewStyle: "VIDYO_CONNECTORVIEWSTYLE_Default",
            remoteParticipants: 2,
            logFileFilter: "error",
            logFileName: "",
            userData: ""
        }).then(function (vidyoConnector) {
            /*Handle appearance and disappearance of camera devices in the system*/
            vidyoConnector.RegisterLocalCameraEventListener({
                onAdded: function(localCamera) {                    if(role=='therapist') {
                    console.log("NEW CAMERA"); console.log(localCamera); vidyoConnector.SelectLocalCamera({localCamera:localCamera});
                }},
                onRemoved: function(localCamera) {},
                onSelected: function(localCamera) {},
                onStateUpdated: function(localCamera, state) {}
            }).then(function() {
                console.log("RegisterLocalCameraEventListener Success");
            }).catch(function() {
                console.error("RegisterLocalCameraEventListener Failed");
            });

            /*Handle appearance and disappearance of microphone devices in the system*/
            vidyoConnector.RegisterLocalMicrophoneEventListener({
                onAdded: function(localMicrophone) {},
                onRemoved: function(localMicrophone) {},
                onSelected: function(localMicrophone) {},
                onStateUpdated: function(localMicrophone, state) {}
            }).then(function() {
                console.log("RegisterLocalMicrophoneEventListener Success");
            }).catch(function() {
                console.error("RegisterLocalMicrophoneEventListener Failed");
            });

            /*Handle appearance and disappearance of speaker devices in the system*/
            vidyoConnector.RegisterLocalSpeakerEventListener({
                onAdded: function(localSpeaker) {},
                onRemoved: function(localSpeaker) {},
                onSelected: function(localSpeaker) {},
                onStateUpdated: function(localSpeaker, state) {}
            }).then(function() {
                console.log("RegisterLocalSpeakerEventListener Success");
            }).catch(function() {
                console.error("RegisterLocalSpeakerEventListener Failed");
            });
            // Add Token and Connect To Conference

            vidyoConnector.RegisterParticipantEventListener(
                {
                    onJoined: function(participant) {
                        console.log("Someone joined a videocall")
                        fireTimerOverlay();
                        if(role == 'therapist') fireInfoOverlay();
                    },
                    onLeft: function(participant)   {
                        endSession()
                    },
                    onDynamicChanged: function(participants) { /* Ordered array of participants according to rank */ },
                    onLoudestChanged: function(participant, audioOnly) { /* Current loudest speaker */ }
                }).then(function() {
                console.log("RegisterParticipantEventListener Success");
            }).catch(function() {
                console.err("RegisterParticipantEventListener Failed");
            });

            vidyoConnector.Connect({
                host: "prod.vidyo.io",
                token: tokendata.token, //Generated Token
                displayName: username, //User Name
                resourceId: "demoroom", //Conference Name
                onSuccess: function () {
                    console.log("Sucessfully connected");
                },
                onFailure: function (reason) {
                    console.log("Error while connecting ", reason);
                },
                onDisconnected: function (reason) {
                    console.log("Disconnected ", reason);
                }
            }).then(function (status) {

            }).catch(function () {

            });

        });

    }
}

