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