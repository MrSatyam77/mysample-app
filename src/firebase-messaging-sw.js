
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/5.8.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.8.2/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.

/* @if NODE_ENV='live' **
firebase.initializeApp({
    'messagingSenderId': '840619808027'
});
/* @endif */

/* @if NODE_ENV='production' **
firebase.initializeApp({
    'messagingSenderId': '454556854348'
});
/* @endif */

/* @if NODE_ENV='local' */
firebase.initializeApp({
    'messagingSenderId': '454556854348'
});
/* @endif */

/* @if NODE_ENV='test' **
firebase.initializeApp({
    'messagingSenderId': '454556854348'
});
/* @endif */

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
var messaging = firebase.messaging();


messaging.setBackgroundMessageHandler(function (payload) {
    // console.log('FIREBASE : Received background message ', payload.data);
    // Customize notification here
    var notify = JSON.parse(payload.data.notification);
    var data = {}
    data.click_action = notify.click_action;
    notify.data = data;
    return self.registration.showNotification(notify.title, notify);
});

self.addEventListener('notificationclick', function (e) {
    var notification = e.notification;
    var extraData = e.notification.data;
    var action = e.action;

    if (action === 'close') {
        notification.close();
    } else {
        clients.openWindow(extraData.click_action);
        notification.close();
    }
});