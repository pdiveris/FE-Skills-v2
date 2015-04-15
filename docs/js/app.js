var aggregationApp = angular.module('aggregationApp', [
	'ngRoute',
  	'aggregationControllers',
  	'aggregationServices',
]);

aggregationApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/aggregation-list.html',
        controller: 'AggregationListCtrl'
      }).
      when('/hudson', {
        templateUrl: 'partials/aggregation-list-hudson.html',
        controller: 'AggregationListCtrlHudson'
      }).
      when('/advanced', {
        templateUrl: 'partials/aggregation-list-advanced.html',
        controller: 'AggregationAdvancedListCtrl'
      }).
      when('/resources/:resourceId/:extraId', {
        templateUrl: 'partials/aggregation-details.html',
        controller: 'AggregationDetailsCtrl'
      }).
      when('/resources/:resourceId', {
        templateUrl: 'partials/aggregation-details.html',
        controller: 'AggregationDetailsCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);
