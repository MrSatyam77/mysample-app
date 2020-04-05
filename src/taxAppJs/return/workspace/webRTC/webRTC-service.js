returnApp.service("webRTCService", ["returnService", "$rootScope", "$q",
    function (returnService, $rootScope, $q) {
        var webRTCService = {};
        // holds connection obj
        var webRTCConnection;
        // holds receiving data channel reference.
        var receiveChannel;
        // holds sending data channel reference.
        var sendingChannel;
        //creating our RTCPeerConnection object 
        var configuration = {
            "iceServers": [{
                'urls': 'stun:stun.l.google.com:19302'
            }]
        };

        /**
         * This function is used to create connection with webRTC.
         */
        webRTCService.createConnectionWithWebRTC = function () {
            webRTCConnection = new RTCPeerConnection(configuration);
            console.log("RTCPeerConnection object was created successfully.");

            //setup ice handling 
            webRTCConnection.onicecandidate = iceCandidateCallback;

            // get datachannel from which message comes from other browser.
            webRTCConnection.ondatachannel = receiveChannelCallback;

            // create our own data channel for communicating with other browser.
            createDataChannel();
        }

        //when the browser finds an ice candidate we send it to another peer 
        var iceCandidateCallback = function (event) {
            if (event.candidate) {
                $rootScope.$broadcast("iceCandidateCallback", event.candidate);
            }
        }

        // subscribe to event when message comes from other browser. and do other business logic here.
        var receiveChannelCallback = function (event) {
            receiveChannel = event.channel;

            // whenever message comes from data channel.
            receiveChannel.onmessage = function (event) {
                console.log("Other Browser Sends Message: " + event.data);
            }

            // receive channel data state change event,
            receiveChannel.onopen = receiveChannelStateChangeCallback;
            receiveChannel.onclosed = receiveChannelStateChangeCallback;
        }

        // receive channel state callback event
        var receiveChannelStateChangeCallback = function () {
            console.log("Recieve Channel State is: " + receiveChannel.readyState);
            // to initially send data to preview app, when connection established.
            if (receiveChannel.readyState === "open") {
                webRTCService.sendMessage(returnService.getDataToSendToPrintPreview());
            }

            if (receiveChannel.readyState === "close") {
            }
        }

        webRTCService.getReceiveChannelState = function () {
            if (receiveChannel) {
                return receiveChannel.readyState;
            } else {
                return "close";
            }
        }

        // to create our data channel for sending message to other peer.
        var createDataChannel = function () {
            sendingChannel = webRTCConnection.createDataChannel("myDataChannel", { reliable: true });

            sendingChannel.onerror = function (error) { };

            sendingChannel.onmessage = function (event) { };

            sendingChannel.onclose = function () {
                console.log(sendingChannel.readyState);
            }
        }

        // to create an offer for send other for connection.
        webRTCService.createOffer = function () {
            var deferred = $q.defer();
            //make an offer 
            webRTCConnection.createOffer(function (offer) {
                webRTCConnection.setLocalDescription(offer);
                deferred.resolve(offer);
            }, function (error) {
                console.log("Error ocurred while creating an offer." + error);
                deferred.reject(error);
            });
            return deferred.promise;
        }

        // to create an offer answer
        webRTCService.offerAnswer = function (offerData) {
            var deferred = $q.defer();
            // save offer
            webRTCConnection.setRemoteDescription(new RTCSessionDescription(offerData.offer));
            // create and save answer
            webRTCConnection.createAnswer(function (answer) {
                webRTCConnection.setLocalDescription(answer);
                deferred.resolve(answer);
            }, function (error) {
                console.log("Error ocurred while creating answer for offer: " + error);
                deferred.reject(error);
            });
            return deferred.promise;
        }

        // called when offer answer is received.
        webRTCService.onAnswer = function (data) {
            webRTCConnection.setRemoteDescription(new RTCSessionDescription(data));
        }

        // add other app ICE candidate reference to our connection.
        webRTCService.onCandidate = function (data) {
            webRTCConnection.addIceCandidate(new RTCIceCandidate(data));
        }

        /**
         * @author Hannan Desai
         * @description This function is used to send return data to print preview app whenever data changes.
         * Here, we can not send more than 65000 character string via datachannel of webRTC.
         * So, here we divide data into chunks of 65000 characters and than send chunks orderly to print preview app.
         * Here, first we also send the length of entire data to preview app.
         * and on the preview app side we combined chunks untill we get the data match to the actual size.
         */
        webRTCService.sendMessage = function (data) {
            if (sendingChannel && sendingChannel.readyState == "open") {
                var docs = JSON.stringify(data);
                var chunkSize = 65000;
                // send original data length to preview app.
                sendingChannel.send(JSON.stringify({ "combinedTotalLength": docs.length }));
                // if string is already less than maximum size limit than no need to divide into chunks.
                if (docs.length <= chunkSize) {
                    sendingChannel.send(docs);
                } else {
                    // divide into chunks send them one by one.
                    var totalChunks = Math.ceil(docs.length / chunkSize);
                    for (var i = 0; i < totalChunks; i++) {
                        var start = i * chunkSize;
                        var end = (i + 1) * chunkSize;
                        sendingChannel.send(docs.substring(start, end));
                    }
                }
            }
        }

        // to handle other app disconnect
        webRTCService.handleLeave = function (data) {
            if (webRTCConnection) {
                webRTCService.closeConnection();
                // to reinitiate webRTC object, in case of other app trying to connect again.
                webRTCService.createConnectionWithWebRTC();
            }
        }

        // to close webRTC connection.
        webRTCService.closeConnection = function () {
            if (webRTCConnection) {
                webRTCConnection.close();
                webRTCConnection.onicecandidate = null;
                sendingChannel = null;
                receiveChannel = null;
            }
        }
        return webRTCService;
    }])