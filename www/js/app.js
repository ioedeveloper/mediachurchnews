angular.module('starter', ['ionic', 'starter.services', 'starter.controllers', 'starter.translate', 'ngStorage', 'ionic.closePopup', 'ab-base64'])
.run(function($ionicPlatform, $rootScope, $ionicLoading, $localStorage, $timeout, $http, $state, base64) {
	if(rtl_language) $rootScope.app_direction = "rtl";
	$ionicPlatform.ready(function() {
		if (window.cordova && window.cordova.plugins.Keyboard) {
		  cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		  cordova.plugins.Keyboard.disableScroll(true);
		}
		if (window.StatusBar) {
		  StatusBar.styleDefault();
		}
		setTimeout(function(){
			if(navigator.splashscreen) navigator.splashscreen.hide();
		}, 100);
		if(window.plugins){
			var notificationOpenedCallback = function(data){
				if(ionic.Platform.isAndroid()) var additionalData = JSON.parse(data.notification.payload.additionalData);
				else var additionalData = data.notification.payload.additionalData;
				if(angular.isDefined(additionalData)){
					if(angular.isDefined(additionalData.posts)){
						var posts = Number(additionalData.posts);
						$state.go("app.news",{id:posts});
					}
					else if(angular.isDefined(additionalData.category)){
						var category = Number(additionalData.category);
						$state.go("app.category",{id:category});
					}
				}
			};
			window.plugins.OneSignal
			.startInit(onesignal_app_id, onesignal_project_number)
			.handleNotificationOpened(notificationOpenedCallback)
			.inFocusDisplaying(window.plugins.OneSignal.OSInFocusDisplayOption.Notification)
			.endInit();
		}
		document.addEventListener("offline", onOffline, false);
		function onOffline(){
			$rootScope.isOffline = true;
			$rootScope.$apply();
		}
		document.addEventListener("online", onOnline, false);
		function onOnline(){
			$rootScope.isOffline = false;
			$rootScope.$apply();
		}
		if(window.ga){
			window.ga.startTrackerWithId(google_analytics, 30);
			if(ionic.Platform.isAndroid()) window.ga.trackView('Android');
			else window.ga.trackView('iOS');
		}
	});
  	$rootScope.showLoading = function(template) {
		$ionicLoading.show({
		  template: template
		});
		$timeout(function(){
			$rootScope.hideLoading();
			document.addEventListener("offline", function(){
				window.plugins.toast.showShortCenter("Network disconnected");
			}, false);
		}, 30000);
		$rootScope.hideLoading = function(){
			$ionicLoading.hide();
		};
	};
	$rootScope.checkToken = function(){
		if(angular.isDefined($localStorage.login)){
			var check = $http({
				method: 'POST',
				url: wordpress_url+'/wp-json/jwt-auth/v1/token/validate',
				cache: false,
				headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'Authorization': 'Bearer '+$localStorage.login.token},
				withCredentials: true,
				transformRequest: function(obj) {
						var str = [];
						for(var p in obj)
						str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
						return str.join("&");
				}
			});
			return check;
		}
	};
	$rootScope.autoLogin = function(){
		if(angular.isDefined($localStorage.login)){
			var user = base64.decode($localStorage.login.base.one);
			var pass = base64.decode($localStorage.login.base.two);
			$state.go('app.login', {user:user,pass:pass});
		}
	};
	$rootScope.openLink = function(link){
		if(link.indexOf("link://") == 0){
			link = link.replace("link://", "");
			var data = link.split("/");
			if(data[0] == "posts") $state.go("app.news",{id:data[1]});
			else if(data[0] == "category") $state.go("app.category",{id:data[1]});
			else if(data[0] == "bookmark"){
				if(data[1]) $state.go("app.bookmark",{type:data[1]});
				else $state.go("app.bookmark");
			}
			else if(data[0] == "about-us") $state.go("app.about");
			else if(data[0] == "term-and-conditions") $state.go("app.terms");
			else if(data[0] == "privacy-policy") $state.go("app.policy");
		} else {
			if(window.cordova){
				if(open_target_blank) cordova.InAppBrowser.open(link, '_blank', 'location=yes');
				else cordova.InAppBrowser.open(link, '_system', 'location=yes');
			}
		}
	};
})
.config(function($stateProvider, $urlRouterProvider){
	$stateProvider
	.state('app', {
		url: '/app',
		abstract: true,
		templateUrl: 'templates/menu.html',
		controller: 'AppCtrl'
	})
    .state('app.home', {
		url: '/home',
		views: {
			'menuContent': {
				templateUrl: 'templates/home.html',
				controller: 'HomeCtrl'
			}
		}
    })
	.state('app.news', {
		url: '/news/:id',
		views: {
			'menuContent': {
			templateUrl: 'templates/dailynews/news.html',
			controller: 'DetailCtrl'
			}
		}
	})
	.state('app.comment', {
		cache: false,
		url: '/comment/:id',
		views: {
			'menuContent': {
			templateUrl: 'templates/dailynews/comment.html',
			controller: 'CommentCtrl'
			}
		}
	})
	.state('app.category',{
		url:'/category/:id',
		views:{
			'menuContent':{
				templateUrl:'templates/category/index.html',
				controller:'CategoryCtrl'
			}
		}
	})
	.state('app.photo', {
		url: '/photo',
		views: {
			'menuContent': {
			templateUrl: 'templates/photo/photo.html',
			controller: 'PhotoCtrl'
			}
		}
	})
	.state('app.newsPhoto', {
		cache:false,
		url: '/photo/detail/:id',
		views: {
			'menuContent': {
				templateUrl: 'templates/photo/detail.html',
				controller: 'PhotoDetail'
			}
		}
	})
	.state('app.video', {
		url: '/video',
		views: {
			'menuContent': {
			templateUrl: 'templates/video/video.html',
			controller: 'VideoCtrl'
			}
		}
	})
	.state('app.settings', {
		cache:false,
		url: '/settings',
		views: {
			'menuContent': {
			templateUrl: 'templates/setting/settings.html',
			controller: 'SettingsCtrl'
			}
		}
	})
	.state('app.bookmark', {
		url: '/settings/bookmark/:type',
		views: {
			'menuContent': {
			templateUrl: 'templates/setting/bookmark.html',
			controller: 'BookmarkCtrl'
			}
		}
	})
	.state('app.notification', {
		url: '/settings/notification',
		views: {
			'menuContent': {
				templateUrl: 'templates/setting/noti.html'
			}
		}
	})
	.state('app.login', {
		cache: false,
		url: '/settings/login/:username/:password',
		views: {
			'menuContent': {
				templateUrl: 'templates/setting/login.html',
				controller: 'LoginCtrl'
			}
		}
	})
	.state('app.forgot', {
		url: '/settings/forgot',
		views: {
			'menuContent': {
				templateUrl: 'templates/setting/forgot.html',
				controller: 'ForgotCtrl'
			}
		}
	})
	.state('app.signup', {
		url: '/settings/login/signup',
		views: {
			'menuContent': {
				templateUrl: 'templates/setting/signup.html',
				controller: 'SignupCtrl'
			}
		}
	})
	.state('app.terms', {
		url: '/settings/terms',
		views: {
			'menuContent': {
				templateUrl: 'templates/setting/terms.html'
			}
		}
	})
	.state('app.about', {
		url: '/settings/about',
		views: {
			'menuContent': {
				templateUrl: 'templates/setting/about.html'
			}
		}
	})
	.state('app.policy', {
		url: '/settings/policy',
		views: {
			'menuContent': {
				templateUrl: 'templates/setting/policy.html'
			}
		}
	})
	.state('app.search', {
		url: '/search',
		views: {
			'menuContent': {
				templateUrl: 'templates/search.html',
				controller: 'SearchCtrl'
			}
		}
	})
	;
	$urlRouterProvider.otherwise('/app/home');
})
.filter('timeAgo', function($filter){
	return function(time){
		var perMinute=60*1000;
		var perHour=perMinute*60;
		var perDay=perHour*24;
		var perMonth=perDay*30;
		var perYear=perMonth*12;
		var now = new Date().getTime();
		var time_ago = now-time;
		if(time_ago<0){
			return $filter('date')(time, date_format);
		}
		else if (time_ago<perMinute){
			return Math.round(time_ago/1000) + ' seconds ago';
		}
		else if(time_ago<perHour){
			return Math.round(time_ago/perMinute) + ' minutes ago';
		}
		else if(time_ago<perDay){
			return Math.round(time_ago/perHour) + ' hours ago';
		}
		else if(time_ago<perMonth){
			return Math.round(time_ago/perDay) + ' days ago';
		}
		else if(time_ago<perYear){
			return Math.round(time_ago/perMonth) + ' months ago';
		}
		else{
			return Math.round(time_ago/perYear) + ' years ago';
		}
	}
})
.filter('firstSentence', function() {
	return function(text) {
		text = text ? String(text).replace(/<[^>]+>/gm, '') : '';
		text = text.replace(/(\r\n|\n|\r)/gm,"");
		text = text.split(" ");
		newText = [];
		for(var i = 0; i < 15; i++){
			if(angular.isDefined(text[i])) newText.push(text[i]);
		}
		text = newText.join(" ");
		return text.toLowerCase();
	};
})
.config(function($ionicConfigProvider){
	$ionicConfigProvider.backButton.text('').previousTitleText(false).icon('ion-android-arrow-back');
	$ionicConfigProvider.tabs.position('top');
	if(rtl_language) {
		$ionicConfigProvider.navBar.alignTitle('right');
		$ionicConfigProvider.views.transition('none');
	} else $ionicConfigProvider.navBar.alignTitle('left');
	
})
.directive('detail', function($compile, $parse) {
    return {
      restrict: 'E',
      link: function(scope, element, attr) {
        scope.$watch(attr.content, function() {
          element.html($parse(attr.content)(scope));
          $compile(element.contents())(scope);
        }, true);
      }
    }
})
.config(function($httpProvider) {
	$httpProvider.interceptors.push('httpInterceptor');
})
.factory('httpInterceptor', ['$q',function($q) {
	var regex = new RegExp('\.(html|js|css)$','i');
	var isAsset = function(url){
		return regex.test(url);
	};
	return {
		'request': function(config) {
			if(!isAsset(config.url)){
				if(config.url.indexOf('?') == -1) config.url+= "?ts=" +  Date.now();
				else config.url+= "&ts=" +  Date.now();
			}
			return config;
		},
		'requestError': function(rejection) {
			return $q.reject(rejection);
		},
		'response': function(response) {
			return response;
		},
		'responseError': function(rejection) {
			return $q.reject(rejection);
		}
	};
}])
