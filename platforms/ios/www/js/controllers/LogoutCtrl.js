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