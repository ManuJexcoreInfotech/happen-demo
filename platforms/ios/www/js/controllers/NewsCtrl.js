app.controller('NewsCtrl', ['$scope', '$state', '$ionicSlideBoxDelegate','Color','Config','$location', function($scope, $state, $ionicSlideBoxDelegate, Color, Config,$location) {
	
	$scope.appColor = Color.AppColor;
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