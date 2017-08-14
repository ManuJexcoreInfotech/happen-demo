// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('YourApp', ['ionic','ngSanitize', 'ngCordova','ngIOS9UIWebViewPatch']);
// not necessary for a web based app // needed for cordova/ phonegap application



app.run(function($ionicPlatform, $rootScope, $http, $ionicPopup,Config) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // Set the statusbar to use the default style, tweak this to
      // remove the status bar on iOS or change it to use white instead of dark colors.
      StatusBar.styleDefault();
    }
  });
   Service($rootScope, $http, $ionicPopup,Config);
});
//app run getting device id
app.run(function ($rootScope, myPushNotification) {
	// app device ready
	document.addEventListener("deviceready", function(){
		myPushNotification.registerPush();
	});
   $rootScope.get_device_token = function () {
      if(localStorage.device_token) {
         return localStorage.device_token;
      } else {
         return '-1';
      }
   }
});
//myservice device registration id to localstorage
app.service('myService', ['$http','Config','SendPush', function($http,Config,SendPush) {
   this.registerID = function(regID, platform) {
		if(regID && platform && device.uuid ){
			SendPush.saveDetails(regID, device.uuid, platform)
			.success(function (data) {
				//alert(data)
			})
			.error(function (error) {
				//alert('error'+data)
			});
		}
		localStorage.device_token = regID;
   }
}]);
app.run(function($rootScope, globalFactory) {
	$rootScope.globalFunction = globalFactory;
});
// config to disable default ionic navbar back button text and setting a new icon
app.config(function($ionicConfigProvider) {
    $ionicConfigProvider.backButton.text('').icon('fa fa-arrow-left').previousTitleText(false);
})
// main controller file // 
app.controller('NewsCtrl', ['$scope', '$state', '$ionicSlideBoxDelegate','Color','Config','$location','$localstorage', function($scope, $state, $ionicSlideBoxDelegate, Color, Config,$location,$localstorage) {
	
	$scope.appColor = Color.AppColor;
	$scope.userId = $localstorage.get('user_id');
	$scope.locPath = $location.path();
  	// Toggle left function for app sidebar
  	$scope.toggleLeft = function() {
    	$ionicSideMenuDelegate.toggleLeft();
  	};
	console.log($location.path());
	// sharing plugin
	$scope.shareArticle = function(title,url){
		window.plugins.socialsharing.share(title, null, null, url)
	}
	// open link url
	$scope.openLinkArticle = function(url){
		//window.open(url, '_system');
		var ref = cordova.InAppBrowser.open(url, '_blank', 'location=yes');
		//use ref
	}
	$scope.openLinkSystem = function(url){
		//window.open(url, '_system');
		var ref = cordova.InAppBrowser.open(url, '_system', 'location=yes');
		// use  ref
	}
	$scope.shareArticleImage = function(title,url) {
		navigator.screenshot.URI(function(error,res){
		  if(error){
			console.error(error);
		  }else{
			  window.plugins.socialsharing.share(title, Config.AppName, res.URI, url)
		  }
		},'jpg',70);
	}
}])
/* recent posts controller */
app.controller('HomeCtrl', ['$scope', 'NewsApp', '$state', 'Config', '$cordovaToast', 'ConfigAdmob', function($scope, NewsApp, $state, Config, $cordovaToast, ConfigAdmob) {	
	// setting header -- 
	$scope.heading = Config.AppName;
	
	document.addEventListener("deviceready", function(){
		if(AdMob) {
			// show admob banner
			if(ConfigAdmob.banner) {
				AdMob.createBanner( {
					adId: ConfigAdmob.banner, 
					position: AdMob.AD_POSITION.BOTTOM_CENTER, 
					autoShow: true 
				} );
			}
		}
	});
}])
/* category posts controller */
app.controller('CategoryCtrl', ['$scope', 'NewsApp', '$state', '$stateParams', 'Config', '$cordovaToast', function($scope, NewsApp, $state, $stateParams, Config, $cordovaToast) {	
	// setting header --
	
	$scope.categoryName = $stateParams.categoryName;
	$scope.category = parseInt($stateParams.category);
	if($scope.categoryName){ 
		$scope.heading = $scope.categoryName;
	}
	$scope.items = [];
	$scope.times = 0 ;
	$scope.postsCompleted = false;
	// load more content function
	$scope.getPosts = function(){
		NewsApp.getPosts($scope.times, $scope.category)
		.success(function (posts) {
			$scope.items = $scope.items.concat(posts.news);
			NewsApp.posts = $scope.items;
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.times = $scope.times + 1;
			if(posts.news.length == 0) {
				$cordovaToast.showLongBottom(Config.ErrorMessage).then(function(success) {
				 // success
			   }, function (error) {
				 // error
			   });
				$scope.postsCompleted = true;
			}
		})
		.error(function (error) {
			$scope.items = [];
		});
	}
	// pull to refresh buttons
	$scope.doRefresh = function(){
		$scope.times = 0 ;
		$scope.items = [];
		$scope.postsCompleted = false;
		$scope.getPosts();
		$scope.$broadcast('scroll.refreshComplete');
	}
	// showing single post
	$scope.readMore = function(index){
		$state.go('news.post',{
			catId:$scope.category,
			offset:$scope.times,
			index:index,
			type:'category'
		});
	}
}])
/* search controller */
app.controller('SearchCtrl', ['$scope', '$state', 'NewsApp', '$stateParams', '$sce', 'Config', '$cordovaToast', function($scope, $state, NewsApp, $stateParams, $sce, Config, $cordovaToast) {
	// getting label from params
  	$scope.query = '';
	// setting header same as label
	$scope.MainHeading = $sce.trustAsHtml($scope.query);
	$scope.query = "";
	$scope.items = [];
	$scope.searchQuery = [];
	$scope.times = 0;
	$scope.postsCompleted = false;
	// get posts function
	$scope.getPosts = function(){
		NewsApp.searchPosts($scope.query, $scope.times)
		.success(function (posts) {
			$scope.items = $scope.items.concat(posts.news);
			NewsApp.posts = $scope.items;
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.times = $scope.times + 1;
			if(posts.news.length == 0) {
				if($scope.query){
					$cordovaToast.showLongBottom(Config.ErrorMessage).then(function(success) {
					 // success
					}, function (error) {
					 // error
					});
				}
				$scope.postsCompleted = true;
			}
		})
		.error(function (error) {
			$scope.posts = [];
		});
	}
	$scope.searchSubmitFunction = function(){
		$scope.times = 0;
		$scope.items = [];
		$scope.query = $scope.searchQuery.query;
		//$scope.getPosts();
		$scope.postsCompleted = false;
		$scope.MainHeading = $sce.trustAsHtml($scope.query);
	}
	// showing single post
	$scope.readMore = function(index){
		$state.go('news.post',{
			catId:$scope.query,
			offset:$scope.times,
			index:index,
			type:'search'
		});
	}
	//
}])
/* post controller */
app.controller('PostCtrl', ['$scope', 'NewsApp', '$stateParams', '$sce', 'Config', '$cordovaToast', function($scope, NewsApp, $stateParams, $sce, Config, $cordovaToast) {
	
	
	$scope.$on("$stateChangeStart", function() {
		$scope.$root.showExtraButton = false;
	})
	//console.log(NewsApp.posts);
	// getting category id or search param -- 0 in case of home page posts
	$scope.catId = $stateParams.catId;
	$scope.times = parseInt($stateParams.offset);
	$scope.index = parseInt($stateParams.index);
	$scope.type = $stateParams.type;
	
	$scope.showPost = function(selectedIndex){
		if(NewsApp.posts[selectedIndex]){
			//$scope.item.image = '';
			$scope.item = NewsApp.posts[selectedIndex];
			$scope.heading = $scope.item.title;
			$scope.description = $sce.trustAsHtml($scope.item.description);
			$scope.$root.showExtraButton = false;
		}
	}
	$scope.showPost($scope.index);
	
	// post completed flag
	$scope.postsCompleted = false;
	// getting more posts function
	$scope.gettingPosts = false;
	$scope.getPosts = function(){
		if($scope.gettingPosts == false) {
			$scope.gettingPosts = true;
			if($scope.type == 'home') {
				NewsApp.getPosts($scope.times)
				.success(function (posts) {
					NewsApp.posts = NewsApp.posts.concat(posts.news);
					$scope.times = $scope.times + 1;
					if(posts.news.length == 0) {
						$scope.postsCompleted = true;
						$scope.showErrorToast();
					} else {
						$scope.showPost($scope.index);
					}
					$scope.gettingPosts = false;
				})
				.error(function (error) {
					$scope.gettingPosts = false;
				});
			} else if($scope.type == 'category') {
				NewsApp.getPosts($scope.times, $scope.catId)
				.success(function (posts) {
					NewsApp.posts = NewsApp.posts.concat(posts.news);
					$scope.times = $scope.times + 1;
					if(posts.news.length == 0) {
						$scope.postsCompleted = true;
						$scope.showErrorToast();
					} else {
						$scope.showPost($scope.index);
					}
					$scope.gettingPosts = false;
				})
				.error(function (error) {
					$scope.gettingPosts = false;
				});
			} else if($scope.type == 'search'){
				NewsApp.searchPosts($scope.catId, $scope.times)
				.success(function (posts) {
					NewsApp.posts = NewsApp.posts.concat(posts.news);
					$scope.times = $scope.times + 1;
					if(posts.news.length == 0) {
						$scope.postsCompleted = true;
						$scope.showErrorToast();
					} else {
						$scope.showPost($scope.index);
					}
					$scope.gettingPosts = false;
				})
				.error(function (error) {
					$scope.gettingPosts = false;
				});
			}
		}
	}
	$scope.showErrorToast = function(){

		$scope.$root.showExtraButton = false;
		$cordovaToast.showLongBottom(Config.ErrorMessage).then(function(success) {
		 // success
		}, function (error) {
		 // error
		});
	}
	$scope.onSwipeRight = function(){
		//$scope.item.image = '';
		$scope.index = $scope.index - 1;
		if($scope.index >= 0 ){
			$scope.$root.showExtraButton = true;
			$scope.showPost($scope.index)
		} else {
			$scope.index = $scope.index + 1;
		}
	}
	$scope.onSwipeLeft = function(){
		//$scope.item.image = '';
		$scope.index = $scope.index + 1;
		if(NewsApp.posts[$scope.index]){
			$scope.$root.showExtraButton = true;
			$scope.showPost($scope.index)
		} else {
			if($scope.postsCompleted == false){
				$scope.$root.showExtraButton = true;
				$scope.getPosts();
			} else {
				$scope.index = $scope.index - 1;
			}
		}
	}
	
}])
/* recent posts controller */
app.controller('CategoriesCtrl', ['$scope', 'NewsApp', '$state', function($scope, NewsApp, $state) {	
	// setting header -- 
	$scope.heading = "Categories";
	$scope.postsCompleted = false;
	$scope.categories = [];
	// load more content function
	$scope.getCategries = function(){
		NewsApp.getCategries()
		.success(function (posts) {
			$scope.categories = $scope.categories.concat(posts.categories);
			$scope.postsCompleted = true;
		})
		.error(function (error) {
			$scope.categories = [];
			$scope.postsCompleted = true;
		});
	}
}])

app.controller('SettingsCtrl', ['$scope','SendPush','Config', function( $scope, SendPush, Config ) {
	
	$scope.AndroidAppUrl = Config.AndroidAppUrl;
	$scope.AppName = Config.AppName;
	
	$scope.pushNot = [];
	$scope.pushNot.pushStatus = false;
	document.addEventListener("deviceready", function(){
		SendPush.getDetails(device.uuid)
		.success(function (data) {
			if(data.enable == 'yes') {
				$scope.pushNot.pushStatus = true;
			}
		})
		.error(function (error) {
			//alert('error'+data)
		});
	});
	$scope.savePushDetails = function(){
		$scope.sendStatus = 'no';
		if($scope.pushNot.pushStatus == true){
			$scope.sendStatus = 'yes';
		}
		SendPush.savePushDetails(device.uuid, $scope.sendStatus)
		.success(function (data) {
			// alert success
		})
		.error(function (error) {
			//alert('error'+data)
		});
	}
}])
/* About us Controller */
app.controller('AboutCtrl', ['$scope', function($scope) {
}])
/* Login us form page */
app.controller('LogoutCtrl', ['$localstorage', '$scope', '$state','$rootScope','ConfigContact','$ionicSlideBoxDelegate','Color','Config','$ionicPopup', function($localstorage,$scope, $state,$rootScope,ConfigContact,$ionicSlideBoxDelegate, Color, Config,$ionicPopup)
{
	$localstorage.remove('user_id');
	$localstorage.remove('username');
	$localstorage.remove('u_email');
	var showAlert = function() {
		
			var alertPopup = $ionicPopup.alert({
				title: 'Success',
				template: '<h4 style="text-align:center">Logout Successfully</h4>'
			});
			alertPopup.then(function(res) {
				$state.go('news.login');
			});
	};
	showAlert();
	
	
}]);


/* Login us form page */
app.controller('LoginCtrl', ['$localstorage', '$scope', '$state','$rootScope','ConfigContact','$ionicSlideBoxDelegate','Color','Config','$ionicPopup', function($localstorage,$scope, $state,$rootScope,ConfigContact,$ionicSlideBoxDelegate, Color, Config,$ionicPopup)
{
	
	if($localstorage.get('user_id'))
	{
		$state.go('news.home');
	}
	$scope.appColor = Color.AppColor;
	//setting heading here
	$scope.user = {};
	// contact form submit event
	$scope.signup = function() {
		//$location.path('news/register');
		$state.go('news.register');
	}
	$scope.forgot = function() {
		//$location.path('news/register');
		$state.go('news.forgot');
	}
	var showAlert = function(type,msg) {
		
			var alertPopup = $ionicPopup.alert({
				title: type,
				template: '<h4 style="text-align:center">' +msg+'</h4>'
			});
			alertPopup.then(function(res) {
				if(type=='Success')
					$state.go('news.home');
				else
					return;
			});
	};
	$scope.submitForm = function(isValid) {
		if (isValid) {
			//alert($scope.user.email+$scope.user.password);
			$rootScope.service.post('login', $scope.user, function (res) {
				
				if (res.status==1) {
					
					showAlert('Success',res.message);
					
					$localstorage.set('user_id',res.u_id);
					$localstorage.set('username',res.u_name);
					$localstorage.set('u_email',res.u_email);
					$scope.user = res;
				}
				else
				{
					showAlert('Error',res.message);
				}
				
				
			});
			/* cordova.plugins.email.isAvailable(
				function (isAvailable) {
					window.plugin.email.open({
						to:      [ConfigContact.EmailId],
						subject: ConfigContact.ContactSubject,
						body:    '<h1>'+$scope.user.email+'</h1><br><h2>'+$scope.user.password+'</h2>',
						isHtml:  true
					});
				}
			); */
		}
	}
}])



/* forgot PwdCtrl */
app.controller('forgotPwdCtrl', ['$scope', '$state','$rootScope','ConfigContact','$ionicSlideBoxDelegate','Color','Config','$ionicPopup', function($scope, $state,$rootScope,ConfigContact,$ionicSlideBoxDelegate, Color, Config,$ionicPopup)
{
	$scope.appColor = Color.AppColor;
	//setting heading here
	$scope.user = {};
	// contact form submit event
	
	var showAlert = function(type,msg) {
	
	  var alertPopup = $ionicPopup.alert({
		 title: type,
		 template: msg
	  });
	  alertPopup.then(function(res) {
			if (type=="Success") {
				$state.go('news.login');
			}
	  });
   };
	$scope.submitForm = function(isValid) {
		
		
		if (isValid) {
			
			
			$rootScope.service.post('forgotPassword', $scope.user, function (res) {
			
				if (res.status==1) {
					showAlert('Success',res.message);
				}
				else
				{
					showAlert('Error',res.message);
				}
				
			});
			/* cordova.plugins.email.isAvailable(
				function (isAvailable) {
					window.plugin.email.open({
						to:      [ConfigContact.EmailId],
						subject: ConfigContact.ContactSubject,
						body:    '<h1>'+$scope.user.email+'</h1><br><h2>'+$scope.user.password+'</h2>',
						isHtml:  true
					});
				}
			); */
		}
	}
}]);	


/* Register */
app.controller('RegisterCtrl', ['$scope', '$state','$rootScope','ConfigContact','$ionicSlideBoxDelegate','Color','Config','$ionicPopup', function($scope, $state,$rootScope,ConfigContact,$ionicSlideBoxDelegate, Color, Config,$ionicPopup)
{
	$scope.appColor = Color.AppColor;
	//setting heading here
	$scope.user = {};
	// contact form submit event
	
	var showAlert = function(type,msg) {
	
	  var alertPopup = $ionicPopup.alert({
		 title: type,
		 template: msg
	  });
	  alertPopup.then(function(res) {
			if (type=="Success") {
				$state.go('news.login');
			}
	  });
   };
	$scope.submitForm = function(isValid) {
		
		
		if (isValid) {
			
			
			$rootScope.service.post('register', $scope.user, function (res) {
			
				if (res.status==1) {
					showAlert('Success',res.message);
				}
				else
				{
					showAlert('Error',res.message);
				}
				
				//setStorage('user_id',res.id);
				
				
			});
			/* cordova.plugins.email.isAvailable(
				function (isAvailable) {
					window.plugin.email.open({
						to:      [ConfigContact.EmailId],
						subject: ConfigContact.ContactSubject,
						body:    '<h1>'+$scope.user.email+'</h1><br><h2>'+$scope.user.password+'</h2>',
						isHtml:  true
					});
				}
			); */
		}
	}
}])
/* Contact us form page */
app.controller('ContactCtrl', ['$scope', 'ConfigContact', function($scope, ConfigContact) {
	//setting heading here
	$scope.user = [];
	// contact form submit event
	$scope.submitForm = function(isValid) {
		if (isValid) {
			cordova.plugins.email.isAvailable(
				function (isAvailable) {
					window.plugin.email.open({
						to:      [ConfigContact.EmailId],
						subject: ConfigContact.ContactSubject,
						body:    '<h1>'+$scope.user.email+'</h1><br><h2>'+$scope.user.name+'</h2><br><p>'+$scope.user.details+'</p>',
						isHtml:  true
					});
				}
			);
		}
	}
}])
// show ad mob here in this page
app.controller('AdmobCtrl', ['$scope', 'ConfigAdmob', function($scope, ConfigAdmob){
	
	$scope.showInterstitial = function(){
		if(AdMob) AdMob.showInterstitial();
			
	}
	document.addEventListener("deviceready", function(){
		alert(2)
		if(AdMob) {
			// show admob banner
			if(ConfigAdmob.banner) {
				AdMob.createBanner( {
					adId: ConfigAdmob.banner, 
					position: AdMob.AD_POSITION.BOTTOM_CENTER, 
					autoShow: true 
				} );
			}
			// preparing admob interstitial ad
			if(ConfigAdmob.interstitial) {
				AdMob.prepareInterstitial( {
					adId:ConfigAdmob.interstitial, 
					autoShow:false
				} );
			}
		}
		if(ConfigAdmob.interstitial) {
			$scope.showInterstitial();
		}
	});
}]);