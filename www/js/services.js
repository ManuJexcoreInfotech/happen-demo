function Service($rootScope, $http, $ionicPopup,Config) {

    var api = {
        website: 'webservice/api/websiteinfo',
        forgotPassword: 'webservice/api/forgotPassword',
        logout: 'webservice/api/logout',
        login: 'webservice/api/login',
        register: 'webservice/api/register',
        
    }, showError = false;

    $rootScope.service = {
        get: function (key, params, success, error) {
			
            if (typeof params === 'function') {
                error = success;
                success = params;
                params = null;
            }       
			
			
            var url = Config.WebUrl  + api[key] ;
			
            $http.get(url, {
                params: params,
                timeout: 20000
            }).then(function (res) {
                success(res.data);
            }, handleError(error));
        },
        post: function (key, params, success, error) {
            if (typeof params === 'function') {
                callback = params;
                params = null;
            }
			
			var userData=[];
			console.log(params);
			
            var url = Config.WebUrl+ api[key];
			$http.post(url,params).then(function (res) {
                success(res.data);
            }, handleError(error));
        },
        sendSms: function (params, success, error) {
            if (typeof params === 'function') {
                error = success;
                success = params;
                params = null;
            }

            var url = Config.WebUrl + 'smsapi/SendTemplateSMS.php';
            $http.get(url, {
                params: params
            }).then(function (res) {
                success(res.data);
            }, handleError(error));
        }
    };

    function handleError(error) {
        return function (err) {
            if (error) error(err);
            if (showError) {
                return;
            }
            showError = true;
            
            
            $ionicPopup.alert({
                title: "Alert",
                template: "<h4 style='text-align:center'>Something went Wrong</h4>",
                buttons: [{
                    text: 'OK',
                    onTap: function () {
                        showError = false;
                    }
                }]
            });
            
        };
    }
}
