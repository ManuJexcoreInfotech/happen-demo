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