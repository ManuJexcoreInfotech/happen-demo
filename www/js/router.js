app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  	//sidebar
    .state('news', {
      url: "/news",
      abstract: true,
      templateUrl: "templates/sidebar-menu.html"
    })
	 // Blog page
	 .state('news.home', {
      url: "/home",
		cache : false,
      views: {
        'menuWorPress' :{
          	templateUrl: "templates/home.html",
		  		controller: "HomeCtrl"
        }
      }
    })
	.state('news.login', {
      url: "/login",
		cache : false,
      views: {
        'menuWorPress' :{
          	templateUrl: "templates/login.html",
		  		controller: "LoginCtrl"
        }
      }
    })
	.state('news.register', {
      url: "/register",
		cache : false,
      views: {
        'menuWorPress' :{
          	templateUrl: "templates/registration.html",
		  		controller: "RegisterCtrl"
        }
      }
    })
	.state('news.logout', {
      url: "/logout",
		cache : false,
      views: {
        'menuWorPress' :{
          	templateUrl: "",
			controller: "LogoutCtrl"
        }
      }
    })
	.state('news.forgot', {
      url: "/forgot",
		cache : false,
      views: {
        'menuWorPress' :{
          	templateUrl: "templates/forgotpwd.html",
			controller: "forgotPwdCtrl"
        }
      }
    })
	.state('news.settings', {
      url: "/settings",
      views: {
        'menuWorPress' :{
          	templateUrl: "templates/settings.html",
		  		controller: "SettingsCtrl"
        }
      }
    })
	 .state('news.send_invitation', {
		url: "/send_invitation",
		cache: false,
		views: {
			'menuWorPress': {
				templateUrl: "templates/send_invitation.html",
				controller: "HomeCtrl"
			}
		}
	})
	.state('news.invitation', {
		url: "/invitation",
		cache: false,
		views: {
			'menuWorPress': {
				templateUrl: "templates/receive_invitation.html",
				controller: "HomeCtrl"
			}
		}
	})
	.state('news.send_message', {
		url: "/send_message",
		cache: false,
		views: {
			'menuWorPress': {
				templateUrl: "templates/send_message.html",
				controller: "HomeCtrl"
			}
		}
	})
	.state('news.nearbycontacts', {
		url: "/nearbycontacts",
		cache: false,
		views: {
			'menuWorPress': {
				templateUrl: "templates/nearbycontacts.html",
				controller: "HomeCtrl"
			}
		}
	})
	.state('news.messages', {
		url: "/messages",
		cache: false,
		views: {
			'menuWorPress': {
				templateUrl: "templates/messages.html",
				controller: "HomeCtrl"
			}
		}
	})
	.state('news.reply_message', {
		url: "/reply_message",
		cache: false,
		views: {
			'menuWorPress': {
				templateUrl: "templates/reply_message.html",
				controller: "HomeCtrl"
			}
		}
	})
	 .state('news.contact', {
      url: "/contact",
      views: {
        'menuWorPress' :{
          	templateUrl: "templates/contacts.html",
			controller: "ContactCtrl"
        }
      }
    })
	 .state('news.about', {
      url: "/about",
      views: {
        'menuWorPress' :{
          	templateUrl: "templates/about.html",
		  		controller: "AboutCtrl"
        }
      }
    })
	 .state('news.admob', {
      url: "/admob",
      views: {
        'menuWorPress' :{
          	templateUrl: "templates/admob.html",
		  		controller: "AdmobCtrl"
        }
      }
    })
  	$urlRouterProvider.otherwise("/news/login");
})