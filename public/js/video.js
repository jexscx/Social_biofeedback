//UNUSED!

function onVidyoClientLoaded(status) {
    console.log(`Vidyo shizzle status: ${status.state}`)
    if (status.state == "READY") {
        VC.CreateVidyoConnector({
            viewId: "renderer",
            viewStyle: "VIDYO_CONNECTORVIEWSTYLE_Default",
            remoteParticipants: 3,
            logFileFilter: "error",
            logFileName: "",
            userData: ""
        }).then(function (vidyoConnector) {
            /*Handle appearance and disappearance of camera devices in the system*/
            vidyoConnector.RegisterLocalCameraEventListener({
                onAdded: function(localCamera) {},
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

            vidyoConnector.Connect({
                host: "prod.vidyo.io",
                token: 'cHJvdmlzaW9uAHNsYXZhM0A5ZGEyZDQudmlkeW8uaW8ANjM3NDU2MjQ2NDQAADY3YjE5ODY4Y2EwYTBhM2UyZGExZjhkNTRjMDg1OTMwNzZjYjNiNjE3NjQ3NmFkZWIzMzI5ZmZmNTBmYWE4NjdiNzgwZTgwYWE5NDRiZDY2YzRmNmM3YjRhYmYxZWNjNw==\n', //Generated Token
                displayName: "slava3", //User Name
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