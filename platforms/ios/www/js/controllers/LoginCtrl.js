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