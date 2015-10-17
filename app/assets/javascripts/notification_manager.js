function NotificationManager() {
  // this.subscribeButton = subscribeButton;
  this.registration = "";
  this.init();
}


NotificationManager.prototype.init = function() {
  this.registerServiceWorker();
}

NotificationManager.prototype.hasWorkerSupport = function() {
  if('serviceWorker' in navigator) {

    console.log('Service worker is supported');
    return true;
  } else {
    return false;
  }
}

NotificationManager.prototype.registerServiceWorker = function() {
  var that = this;
  if(this.hasWorkerSupport()) {

    //register serviceWorker
    navigator.serviceWorker.register('service_worker.js', { scope: "./" })
    .then(function(){

      //once the service worker is registered, return its status
      return navigator.serviceWorker.ready;
    }).then(function(serviceWorkerRegistration){
      this.registration = serviceWorkerRegistration;
      that.setup();
    }).catch(function(error){
      console.log('A service worker error occurred', error);
    })
  }
}

NotificationManager.prototype.setup = function() {

  if(!this.isNotificatonAllowed()) {
    this.requestPermission();
    return;
  }

  // Check if push messaging is supported
  if (!this.isPushSupported()) {
    this.requestPermission();
    return ;
  }

  // We need the service worker registration to check for an existing subscription
  this.checkForSubscription();
}

NotificationManager.prototype.subscribe = function(){
  navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {

    console.log("User about to suscribe for push notification");
    serviceWorkerRegistration.pushManager.subscribe({ userVisibleOnly: true })
      .then(function(pushSubscription){

        currentEndpoint = pushSubscription.endpoint;
        console.log("Subscribed endpoint: " + currentEndpoint);
        this.sendSubscriptionToServer(pushSubscription);

        return;
      })
      .catch(function(e){
        if(Notification.permission === 'denied') {
          console.log("Push has not been enabled");
        }
      });
  });
}

NotificationManager.prototype.isNotificatonAllowed = function() {
  return Notification.permission === 'granted'
}

NotificationManager.prototype.isPushSupported = function() {
  return ('PushManager' in window);
}

NotificationManager.prototype.checkForSubscription = function() {
  var that = this;
  navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {

   // Do we already have a push message subscription?
   this.registration.pushManager.getSubscription()
     .then(function(subscription) {

       if (!subscription) {
         console.log("User needs to suscribe for push notification");
         that.subscribe();
         return
       }

       that.sendSubscriptionToServer(subscription);
       console.log("User already suscribed for push notification");
       console.log(subscription);
     })
     .catch(function(err) {
       console.warn('Error during getSubscription()', err);
     });

   });
}


NotificationManager.prototype.requestPermission = function(){
  var that = this;
  Notification.requestPermission(function(response){
    console.log(response)
    if(response === 'granted') {
      if (that.isPushSupported()) {
        that.checkForSubscription()
      }
    }
  });
}

NotificationManager.prototype.sendSubscriptionToServer = function(subscription) {
  var registrationID = this.getRegistrationID(subscription.endpoint);

  var data = new FormData();

  data.append( "json", JSON.stringify( registrationID ) );

  console.log("registrationID");
  console.log(registrationID);

  fetch("https://web-notify.herokuapp.com//notifications/register",
  {
      method: "POST",
      body: data
  })
  .then(function(res){ return res.json(); })
  .then(function(data){ console.log( JSON.stringify( data ) ) })
}

NotificationManager.prototype.getRegistrationID = function(subscription) {
  var registrationID = subscription.split('/').pop();
  console.log(registrationID);
}

$(function(){
  //var subscribeButton = $('#subscribe')
  //new NotificationManager(subscribeButton);
  new NotificationManager();
});
