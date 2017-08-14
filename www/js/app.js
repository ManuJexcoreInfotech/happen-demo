 
var port = location.port ? ':'+location.port: '';
var url = window.location.protocol + '://'+ window.location.hostname+port;
app.constant("Config", {
  "WebUrl": "http://localhost/code/happenstance/",
  "AppName" : "Happenspances",
  "AndroidAppUrl" : "https://play.google.com/store/apps/details?id=com.myspecialgames.advanced2048game",
  "ErrorMessage" : "End of results"
})
// config contact
app.constant("ConfigContact", {
  "EmailId": "weblogtemplatesnet@gmail.com",
  "ContactSubject": "Contact"
})
// config admon
app.constant("ConfigAdmob", {
  "interstitial": "ca-app-pub-3940256099942544/6300978111",
  "banner": "ca-app-pub-3940256099942544/1033173712"
})
// color variations
app.constant("Color", {
  "AppColor": "light", //light, stable, positive, calm, balanced, energized, assertive, royal, dark
})
// push notification
app.constant("PushNoti", {
  "senderID": "senderID",
})

