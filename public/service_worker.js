//service workers are event driven
"use strict";

console.log('Started', self);

console.log('Started', self);

self.addEventListener('install', function(event){
  self.skipWaiting();
  console.log('Installed', event);
});

self.addEventListener('activate', function(event){
  console.log('Activated', event);
});

self.addEventListener('push', function(event) {

  event.waitUntil (

    fetch('https://web-notify.herokuapp.com/notifications/most_recent.json').then(function(response) {
      console.log(response)
      if (response.status !== 200) {
        console.log("something has gone wrong while trying to fetch data for the notification, Status: " + response.status)
      }

      return response.json().then(function(responseData) {
        if (responseData == null) {
         console.log('The API returned an error.' + data.error);
         throw new Error();
        }

        console.log(responseData);
        var title = responseData.title;
        var body = responseData.body;
        var icon = responseData.image;

        self.registration.showNotification(title, {
          body: body,
          icon: icon
        });
      });
    }).catch(function(err) {
      console.log('Unable to retrieve data', err);

      var title = 'An error occurred';
      var message = "Error" + err;
      var icon = "";
      var notificationTag = 'notification-error';

      return self.registration.showNotification(title, {
        body: message,
        icon: icon,
        tag: notificationTag
      });
    })
  )
});

self.addEventListener('notificationclick', function(event){
  console.log('Notification click', event.notification.tag);
  event.notification.close();
  var url = "http://promohub.ng";

  event.waitUntil(
    clients.matchAll({
      type: "window"
    })
    .then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if (client.url == '/' && 'focus' in client)
          return client.focus();
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );

})
