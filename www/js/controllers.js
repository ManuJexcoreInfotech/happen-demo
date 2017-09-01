angular.module('app.controllers', [])

        // �?��?�
        .controller('AppCtrl', function ($scope, $rootScope,
                $ionicModal, $ionicSlideBoxDelegate,
                $ionicTabsDelegate, $ionicLoading,
                $ionicPopup, $timeout, $state,
                $ionicSideMenuDelegate, $translate,
                $ionicPlatform, $ionicHistory, Color, $cordovaGeolocation, $cordovaDevice) {

            $ionicPlatform.ready(function () {
                $scope.$apply(function () {

                    var device = $cordovaDevice.getDevice();
                    console.log(device);
                    $scope.manufacturer = device.manufacturer;
                    $scope.model = device.model;
                    $scope.platform = device.platform;
                    $scope.uuid = device.uuid;
                });
            });

            var posOptions = {timeout: 10000, enableHighAccuracy: false};
            $cordovaGeolocation
                    .getCurrentPosition(posOptions)
                    .then(function (position) {
                        var lat = position.coords.latitude
                        var long = position.coords.longitude
                        console.log(position.coords);
                    }, function (err) {
                        console.log(err);
                    });

            $scope.dynamic_menus = {};
            $scope.appColor = Color.AppColor;
            $scope.isIOS = ionic.Platform.isIPad() || ionic.Platform.isIOS();

            $scope.$on('refreshParent', function () {
                $state.reload(); //reload the state
            })
            // Loading
            $scope.showLoading = function () {
                $ionicLoading.show({
                    template: '<ion-spinner icon="spiral"></ion-spinner>'
                });
            };
            $scope.hideLoading = function () {
                $ionicLoading.hide();
            };

            // Alert dialog
            $scope.showAlert = function (_title, _content) {
                $ionicPopup.alert({
                    title: _title,
                    template: _content,
                    okType: 'button-assertive'
                });
            };

            $scope.menuClose = function () {
                $ionicSideMenuDelegate.toggleLeft(false);
            };

            //首次欢迎页


            // 登录
            $scope.showLogin = function () {
                $scope.user = {};
                if (Config.getRememberme()) {
                    $scope.user.rememberme = true;
                    $scope.user.username = Config.getUsername();
                    $scope.user.password = Config.getPassword();
                }

                var popupLogin = $ionicPopup.show({
                    templateUrl: 'templates/login.html',
                    title: "Login",
                    cssClass: 'login-container',
                    scope: $scope,
                    buttons: [
                        {text: "cancel"},
                        {
                            text: "login",
                            type: 'button-assertive',
                            onTap: function (e) {
                                e.preventDefault();
                                if (!$scope.loginData.username || !$scope.loginData.password) {
                                    return;
                                }
                                $scope.showLoading();
                                $rootScope.service.post('login', $scope.loginData, function (res) {
                                    $scope.hideLoading();

                                    if (res.code || res.message) {
                                        alert(res.message || res.code);
                                        return;
                                    }
                                    $scope.user = res;
                                    setStorage('user_id', res.id);
                                    Config.setRememberme($scope.loginData.rememberme);
                                    if ($scope.loginData.rememberme) {
                                        Config.setUsername($scope.loginData.username);
                                        Config.setPassword($scope.loginData.password);
                                    } else {
                                        Config.setUsername('');
                                        Config.setPassword('');
                                    }
                                    $scope.hideLogin();
                                });
                            }
                        }
                    ]
                });
                $scope.hideLogin = function () {
                    popupLogin.close();
                };
            };
            // 自动登录

            $scope.autoLogin = function () {
                $scope.loginData = {};
                var $username = Config.getUsername();
                if (Config.getRememberme() && $username.length > 0) {
                    $scope.loginData.username = Config.getUsername();
                    $scope.loginData.password = Config.getPassword();
                    $scope.showLoading();
                    console.log($scope.loginData);
                    $rootScope.service.post('login', $scope.loginData, function (res) {
                        $scope.login_status = true;
                        $scope.hideLoading();
                        if (res.code || res.message) {
                            //alert(res.message || res.code);
                            return;
                        }
                        setStorage('user_id', res.id);
                        $scope.user = res;
                    });
                }
            };

            $scope.invite = '';
            $scope.getUser = function () {
                $scope.sessionData = {};
                $scope.sessionData.user_id = getStorage('user_id');
                $rootScope.service.post('getUser', $scope.sessionData, function (user) {
                    $scope.user = typeof user.result === 'object' ? user.result : null;
                    setStorage('username', user.result.u_username);
                    $scope.invite = user.invite;
                    $scope.notification = user.message;
                });
            };
            $scope.getUser();
            if (!$scope.user) {
                $scope.autoLogin();
            } else
            {
                $rootScope.service.post('getInvitation', $scope.sessionData, function (user) {
                    $scope.user = typeof user.result === 'object' ? user.result : null;
                });
            }
            ;

            $scope.doLogout = function () {
                $scope.showLoading();
                //$rootScope.service.get('logout', $scope.getUser);
                removeStorage('user_id');
                Config.setUsername('');
                Config.setPassword('');
                $timeout($scope.hideLoading(), 1000);
                $state.go('app.login');
                return;
            };

            $scope.showExit = function () {
                $ionicPopup.confirm({
                    title: "Confirm",
                    template: "",
                    okType: 'button-assertive',
                    buttons: [
                        {text: "Cancel"},
                        {
                            text: "ok",
                            onTap: function (e) {
                                e.preventDefault();
                                navigator.app.exitApp();
                            }
                        }
                    ]
                });
            };

            $ionicPlatform.registerBackButtonAction(function () {
                if ($ionicHistory.currentStateName() === 'app.home') {
                    $scope.showExit();
                } else {
                    navigator.app.backHistory();
                }
            }, 100);



        })
        // Home Controller
        .controller('HomeCtrl', function ($scope, $rootScope, $state, $cordovaGeolocation, $timeout, $ionicPopup) {


            var user = 0;
            user = getStorage('user_id');
            if (user == 0 || user == null) {
                $state.go('app.login');
                return;

            }
            $scope.invitation = function () {

                $scope.showLoading();
                $scope.data = {};
                $scope.sessionData.u_id = getStorage('user_id');

                $rootScope.service.post('getInvitationDetail', $scope.sessionData, function (user) {
                    $scope.data = typeof user.result === 'object' ? user.result : null;
                    $scope.hideLoading();
                    $ionicPopup.show({
                        template: '<h3>You Have One Invitation From ' + $scope.data.inv_name + '</h3>',
                        title: 'Receive Inviation',
                        scope: $scope,
                        state: $state,
                        buttons: [
                            {text: 'Cancel'},
                            {
                                text: '<b>Go to Invitation</b>',
                                type: 'button-positive',
                                onTap: function (e) {
                                    $state.go('app.receive_invitation');
                                }
                            },
                        ]
                    });

                });


            }


            $scope.sessionData = {};
            $scope.sessionData.user_id = user;
            $rootScope.service.post('getUser', $scope.sessionData, function (user) {
                $scope.user = typeof user.result === 'object' ? user.result : null;

                $scope.contact = user.contact;
                $scope.invite = user.invite;
                $scope.notification = user.message;
                if ($scope.invite > 0)
                {
                    $scope.invitation();
                }

            });
            $scope.dat = {};
            $scope.dat.u_id = user;
            $scope.publishLocation = function () {
                var posOptions = {timeout: 10000, enableHighAccuracy: false};
                $cordovaGeolocation
                        .getCurrentPosition(posOptions)
                        .then(function (position) {
                            $scope.dat.latitude = position.coords.latitude;
                            $scope.dat.longitude = position.coords.longitude;
                            $scope.showLoading();
                            $rootScope.service.post('updateLocation', $scope.dat, function (res) {
                                $scope.hideLoading();
                                if (res.status == 1) {
                                    alert("Your Location Publish Successfully.;")
                                }
                            });

                        }, function (err) {
                            console.log(err);
                        });
            };





        })
        // Login Controller
        .controller('loginCtrl', function ($scope, $rootScope, $ionicPopup, $timeout, $state, $ionicHistory) {
            var user = 0;
            user = getStorage('user_id');
            if (user !== 0 && user !== null) {

                $ionicHistory.goBack();

            }
            $scope.user = {};
            if (Config.getRememberme()) {
                $scope.user.rememberme = true;
                $scope.user.username = Config.getUsername();
                $scope.user.password = Config.getPassword();
            }


            $scope.submitForm = function (isValid) {
                if (isValid) {
                    $scope.showLoading();
                    //alert($scope.user.email+$scope.user.password);
                    $rootScope.service.post('login', $scope.user, function (res) {
                        $scope.hideLoading();

                        if (res.status == 1) {
                            alert(res.message);
                            $scope.user = res;
                            setStorage('user_id', res.result.u_id);
                            //alert(res.result.u_username);
                            Config.setUsername($scope.user.username);
                            Config.setPassword($scope.user.password);

                            $scope.getUser();

                            $state.go('app.home', {}, {reload: true});

                            return;
                        } else
                        {
                            alert(res.message);
                        }


                    });

                }
            }

        })
        // Register
        .controller('registerCtrl', function ($scope, $rootScope, $ionicPopup, $timeout, $state) {
            $scope.user = {};



            $scope.showPrivacy = function () {
                var popupPrivacy = $ionicPopup.show({
                    templateUrl: 'templates/privacy.html',
                    title: $scope.translations.term_privacy,
                    cssClass: 'privacy-container',
                    scope: $scope,
                    buttons: [
                        {text: $scope.translations.ok,
                            type: 'button-assertive'},
                    ]
                });
            };
            $scope.submitForm = function (isValid) {
                $scope.showLoading();

                if (isValid) {


                    $rootScope.service.post('register', $scope.user, function (res) {
                        $scope.hideLoading();
                        if (res.status == 1) {
                            alert(res.message);
                            $state.go('app.login');
                        } else
                        {
                            alert(res.message);
                        }


                    });

                }
            }
            $scope.doRegister = function () {
                /*            if ($scope.registerData.password !== $scope.registerData.confirmation) {
                 alert($scope.translations.need_confirm_pwd );
                 return;
                 }
                 */
                if ($scope.validationCode !== $scope.registerData.validation_Code) {
                    alert($scope.translations.need_confirm_vali);
                    return;
                }

                $scope.showLoading();
                $rootScope.service.get('register', $scope.registerData, function (res) {
                    $scope.hideLoading();

                    if (res[0]) {
                        alert('Register Successfully Done');
                        $scope.getUser();
                        $state.go('app.home');
                        return;
                    }
                    alert(res[2]);
                });
            };
        })
        // Forgot Password
        .controller('forgotPwdCtrl', function ($scope, $rootScope, $timeout, $state) {
            $scope.user = {};
            ;
            $scope.hideLogin;

            $scope.myBack = function () {
                $state.go('app.home');
                $scope.showLogin();
            };
            $scope.submitForm = function (isValid) {
                if (isValid) {
                    $scope.showLoading();

                    $rootScope.service.post('forgotPassword', $scope.user, function (res) {
                        $scope.hideLoading();
                        if (res.status == 1) {
                            alert(res.message);
                            $state.go('app.login');
                        } else
                        {
                            alert(res.message);
                        }

                    });

                }
            }

        })

        //Changed password
        .controller('ChangePwdCtrl', function ($scope, $rootScope, $state, $stateParams) {
            $scope.user = {};
            $scope.submitForm = function (isValid) {
                $scope.showLoading();
                if (isValid) {

                    $scope.user.u_id = getStorage('user_id');
                    $rootScope.service.post('changepassword', $scope.user, function (res) {
                        $scope.hideLoading();
                        if (res.status == 1) {
                            alert(res.message);
                            $state.go('app.home');
                        } else
                        {
                            alert(res.message);
                        }
                    });
                }
            }
        })

        //Contact Controller
        .controller('contactCtrl', function ($scope, $rootScope, $state, $stateParams, $ionicPopup) {

            $scope.data = {};
            $scope.data.u_id = getStorage('user_id');
            $scope.user = {};
            $scope.contacts = {};
            $rootScope.service.post('getContacts', $scope.data, function (res) {
                $scope.contacts = angular.fromJson(res.result);
            });

            $scope.sendMessage = function () {

                $scope.data.sender_u_id = $scope.data.u_id;
                $scope.data.receiver_u_id = $scope.user;

                $scope.valid = 1;

                var myPopup = $ionicPopup.show({
                    templateUrl: 'templates/templates/send_message.html',
                    title: 'Send Message',
                    scope: $scope,
                    state: $state,
                    buttons: [
                        {text: 'Cancel'},
                        {
                            text: '<b>Send</b>',
                            type: 'button-positive',
                            onTap: function (e) {
                                if (!$scope.data.message) {
                                    e.preventDefault();
                                    alert("Please Eneter Message")
                                } else {

                                    $scope.showLoading();

                                    $rootScope.service.post('sendMessage', $scope.data, function (res) {
                                        $scope.hideLoading();

                                        if (res.status == 1) {
                                            alert(res.message);

                                            $state.go($state.current, {}, {reload: true});
                                        } else
                                        {
                                            $scope.valid = 0;
                                            alert(res.message);
                                        }
                                    });
                                    if ($scope.valid == 0)
                                        e.preventDefault();
                                }
                            }
                        },
                    ]
                });

            };

        })

        //Send Invitation 
        .controller('SendInviteCtrl', function ($scope, $rootScope, $state, $ionicHistory) {
            $scope.groups = [];
            $rootScope.service.post('groupList', $scope.user, function (res) {
                $scope.groups = res.result;
            });

            $scope.user = {};

            $scope.submitForm = function (isValid) {

                if (isValid) {
                    $scope.showLoading();
                    $scope.user.userid = getStorage('user_id');
                    $rootScope.service.post('sendInvitation', $scope.user, function (res) {
                        $scope.hideLoading();
                        if (res.status == 1) {
                            alert(res.message);
                            $ionicHistory.goBack();
                        } else
                        {
                            alert(res.message);
                        }
                    });
                }
            }
        })

        // Receive Invitation 
        .controller('ReceiveInvitationCtrl', function ($scope, $rootScope, $state, $ionicPopup, $window) {
            $scope.invite = {};
            $scope.sessionData.u_id = getStorage('user_id');
            $rootScope.service.post('receiveInvitation', $scope.sessionData, function (data) {
                $scope.invite = typeof data.result === 'object' ? data.result : null;

            });

            /* Accept Inviation  */
            $scope.acceptInvitation = function (inv_id, group_id) {
                $scope.groups = {};
                $rootScope.service.post('groupList', $scope.user, function (res) {
                    $scope.groups = angular.fromJson(res.result);
                });
                $scope.user = {};
                $scope.user.username = getStorage('username');
                $scope.user.inv_id = inv_id;
                $scope.group = group_id;
                $scope.valid = 1;
                var myPopup = $ionicPopup.show({
                    templateUrl: 'templates/templates/receive_invitation_popup.html',
                    title: 'Accept Invitation',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancel'},
                        {
                            text: '<b>Accept</b>',
                            type: 'button-positive',
                            onTap: function (e) {
                                if (!$scope.user.code) {
                                    e.preventDefault();
                                    alert("Please Eneter code.")
                                } else {
                                    if (!$scope.user.group_id) {
                                        $scope.user.group_id = group_id;
                                    }
                                    $scope.showLoading();
                                    $scope.user.u_id = getStorage('user_id');
                                    $rootScope.service.post('acceptInvitation', $scope.user, function (res) {
                                        $scope.hideLoading();

                                        if (res.status == 1) {
                                            alert(res.message);
                                            $state.go($state.current, {}, {reload: true});

                                        } else
                                        {
                                            $scope.valid = 0;
                                            alert(res.message);
                                        }
                                    });
                                    if ($scope.valid == 0)
                                        e.preventDefault();
                                }
                            }
                        },
                    ]
                });

            };
            /* Ignore Inviation  */
            $scope.ignoreInvitation = function (inv_id) {
                $scope.user.username = getStorage('username');
                $scope.user.inv_id = inv_id;
                $scope.valid = 1;
                var myPopup = $ionicPopup.show({
                    template: '<h4>Are You want to sure to ignore this invitation ?</h4>',
                    title: 'Reject Invitation',
                    cssClass: "normal",
                    scope: $scope,
                    buttons: [
                        {text: 'Cancel'},
                        {
                            text: '<b>Yes</b>',
                            type: 'button-positive',
                            onTap: function (e) {
                              
                                $scope.showLoading();
                                $scope.user.u_id = getStorage('user_id');
                                $rootScope.service.post('ignoreInvitation', $scope.user, function (res) {
                                    $scope.hideLoading();
                                    if (res.status == 1) {
                                        alert(res.message);
                                        $state.go($state.current, {}, {reload: true});
                                    } else
                                    {
                                        $scope.valid = 0;
                                        alert(res.message);
                                    }
                                });
                               

                            }
                        },
                    ]
                });

            };

        })



        .controller('messageCtrl', function ($scope, $rootScope, $translate, $ionicHistory) {

            $scope.messages = {};
            $scope.sessionData.u_id = getStorage('user_id');
            $rootScope.service.post('getMessageList', $scope.sessionData, function (data) {
                $scope.messages = typeof data.result === 'object' ? data.result : null;

            });

        })
        .controller('ReplyMessageCtrl', function ($scope, $rootScope, $state, $location, $ionicHistory, $ionicPopup) {

            $scope.messages = {};
            $scope.data = {};
            $scope.user_id = getStorage("user_id");
            if ($location.search().msg_id)
            {
                removeStorage('m_id')
                setStorage('m_id', $location.search().msg_id);
            }
            $scope.sessionData.m_id = getStorage("m_id"); // $location.search().msg_id;
            $rootScope.service.post('getMessageDetail', $scope.sessionData, function (data) {
                $scope.messages = typeof data.result === 'object' ? data.result : null;

            });
            $scope.replyMessage = function () {

                $scope.data.u_id = $scope.user_id;
                $scope.data.m_ref_id = $location.search().msg_id;//getStorage("m_id");

                $scope.valid = 1;

                var myPopup = $ionicPopup.show({
                    templateUrl: 'templates/templates/send_message.html',
                    title: 'Send Message',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancel'},
                        {
                            text: '<b>Send</b>',
                            type: 'button-positive',
                            onTap: function (e) {
                                if (!$scope.data.message) {
                                    e.preventDefault();
                                    alert("Please Eneter Message");
                                } else {
                                    $scope.showLoading();
                                    $rootScope.service.post('replyMessage', $scope.data, function (res) {
                                        $scope.hideLoading();
                                        if (res.status == 1) {
                                            alert(res.message);
                                            $state.reload();
                                        } else
                                        {
                                            $scope.valid = 0;
                                            alert(res.message);
                                        }
                                    });
                                    e.preventDefault();
                                }
                            }
                        },
                    ]
                });

            };

        })
        .controller('settingCtrl', function ($scope, $rootScope, $translate, $ionicHistory) {


        })






        .controller('AgentsCtrl', function ($scope, $rootScope, $ionicPopup, $timeout) {
            if (!$rootScope.agent) {
                return;
            }
            $scope.titleText = $rootScope.agent.title;
            $rootScope.service.get('searchAgent', $rootScope.agent.params, function (res) {
                $scope.agentList = res;
            });

            $scope.showAgent = function () {
                $scope.agent = this.agent;
                $ionicPopup.show({
                    templateUrl: 'templates/agent.html',
                    title: this.agent.store_name,
                    cssClass: 'agent-container',
                    scope: $scope,
                    buttons: [{
                            text: $scope.translations.ok,
                            type: 'button-assertive',
                        }, ]
                });
            };

            $scope.showMap = function () {
                if (!$('#map').length) {
                    setTimeout($scope.showMap, 100);
                    return;
                }
                $('#map').parent().html('<div id="map"></div>');

                setTimeout(function () {
                    var map = new BMap.Map('map'),
                            point = new BMap.Point($rootScope.agent.params.lng, $rootScope.agent.params.lat);
                    if ($rootScope.agent.params['radius'] > 0) {
                        $scope.zoomLevel = 13;
                    }
                    if ($rootScope.agent.params['radius'] > 10) {
                        $scope.zoomLevel = 11;
                    }
                    if ($rootScope.agent.params['radius'] > 20) {
                        $scope.zoomLevel = 9;
                    }
                    if ($rootScope.agent.params['radius'] > 50) {
                        $scope.zoomLevel = 8;
                    }
                    if ($rootScope.agent.params['radius'] > 200) {
                        $scope.zoomLevel = 6;
                    }
                    if ($rootScope.agent.params['radius'] > 500) {
                        $scope.zoomLevel = 5;
                    }

                    //1000公里用5，500公里用5，200的用6，100公里用8，50公里用8，20公里用9，10公里用11，5公里内用13，
                    map.centerAndZoom(point, $scope.zoomLevel);

                    var point = new BMap.Point($rootScope.agent.params.lng, $rootScope.agent.params.lat),
                            icon = new BMap.Icon('img/position.png', new BMap.Size(32, 32)),
                            label = new BMap.Label($rootScope.agent.title, {offset: new BMap.Size(20, -10)}),
                            marker = new BMap.Marker(point, {icon: icon});
                    map.addOverlay(marker);
                    marker.setLabel(label);

                    $scope.agentList.forEach(function (item) {
                        var point = new BMap.Point(item.lng, item.lat),
                                marker = new BMap.Marker(point),
                                label = new BMap.Label(item.store_name, {offset: new BMap.Size(20, -10)});

                        map.addOverlay(marker);
                        marker.setLabel(label);
                    });
                }, 100);
            };
        })

        .controller('notification', function ($scope, $sce, $stateParams) {
            $scope.trustSrc = function (src) {
                return $sce.trustAsResourceUrl(src);
            };

            var frame = Config.frames[$stateParams.page];
            $scope.title = $scope.translations[$stateParams.page];
            $scope.src = Config.baseUrl + Config.getLocale() + frame.src;
        })
        .controller('checkInvitationCtrl', function ($scope, $rootScope, $state, $ionicSlideBoxDelegate, $timeout, $ionicPopup) {

            $scope.groups = {};
            $rootScope.service.post('groupList', $scope.user, function (res) {
                $scope.groups = angular.fromJson(res.result);
            });
            $scope.user = {};
            $scope.user.username = getStorage('username');
            $scope.submitForm = function (isValid) {

                if (isValid) {
                    $scope.showLoading();
                    $scope.user.userid = getStorage('user_id');

                    $rootScope.service.post('acceptInvitation', $scope.user, function (res) {
                        $scope.hideLoading();
                        if (res.status == 1) {
                            alert(res.message);
                        } else
                        {
                            alert(res.message);
                        }
                    });
                }
            }
        })
        .controller('FrameCtrl', function ($scope, $sce, $stateParams) {
            $scope.trustSrc = function (src) {
                return $sce.trustAsResourceUrl(src);
            };

            var frame = Config.frames[$stateParams.page];
            $scope.title = $scope.translations[$stateParams.page];
            $scope.src = Config.baseUrl + Config.getLocale() + frame.src;
        });
