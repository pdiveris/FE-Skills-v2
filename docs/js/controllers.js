'use strict';

function notExists(haystack, needle) {
  var i = 0;

  for (i = 0; i < haystack.length; i++) {
    if (haystack[i].title == needle.title) {
      return false;
    }
  }
  return true;
}

/*
* Controllers
* PD
* v1.70 
* Added touch and autocomplete
*/
var aggregationControllers = angular.module('aggregationControllers', ["ngTouch", "angucomplete-alt"]);

aggregationControllers.controller('AggregationListCtrl', ['$scope', '$http', 'client', 'esFactory', 'Init', '$routeParams', '$route', '$location',
  
  function ($scope, $http, client, esFactory, Init, $routeParams, $route, $location) {

    $scope.$http = $http;
    $scope.fileInfo = 'blank';
    $scope.fields = [1,2,3];

    $scope.pageCurrent = Init.currentPage();

    $scope.totalCount = 0;
    $scope.pageCount = 0;
    $scope.pageSize = 12;

    $scope.offset = 0;

    // this needs to go actually - only call once is the right thing. 

    $scope.facetVisibility = Init.facetsVisibility();
    $scope.selectedFacets = Init.selectedFacets();

    $scope.resultsStart = 1;
    $scope.resultsEnd = $scope.pageSize;
 
    $scope.aggs = Init.aggs();
    $scope.initialFilters = Init.filters();
    $scope.initialQuery = Init.query($scope.initialFilters);
    $scope.initialSearch = Init.search($scope.initialQuery, $scope.aggs);

    $scope.facets = [];

    // moved to services
    $scope.facetNameMap = Init.facetNameMap();

    $scope.sources = Init.sources();


    // moved to services
    $scope.searchFields = Init.searchFields();

    $scope.currentSearchFields = $scope.searchFields[0];

    // our state (array to hold pageNum, offet etc)
    var machine = Init.getMachine();
    

    if (typeof(machine) != 'undefined') {
      Init.clientSearch(client, $scope, machine.toJSON(),$http);

    }

    $scope.clearSearches = function() {
      $scope.facets = [];
      // $scope.selectedFacets = Init.selectedFacets();
      // $scope.facetVisibility = [];
      $scope.currentSearchFields = $scope.searchFields[0];
      $scope.yourName = '';
    }

    // $scope.clearSearches();

    $scope.pageForward = function () {
      $scope.newPage = $scope.pageCurrent + 1;
      $scope.pageCurrent = Math.min($scope.newPage, $scope.pageCount);
      $scope.offset = ($scope.pageCurrent-1)*$scope.pageSize;
      $scope.updateResults();
    }

    $scope.pageBack = function () {
      $scope.newPage = $scope.pageCurrent - 1;
      $scope.pageCurrent = Math.max($scope.newPage, 1);

      if ($scope.pageCurrent==1) {
        $scope.offset = 0;
      } else {
        $scope.offset = ($scope.pageCurrent-1)*$scope.pageSize;
      }

      $scope.updateResults();
    }

    $scope.pageFirst = function () {
      $scope.pageCurrent = Math.min(1, $scope.pageCount);
      $scope.offset = 0;
      $scope.updateResults();
    }

    $scope.pageLast = function () {
      $scope.pageCurrent = $scope.pageCount;
      var goldNumber = $scope.totalCount % $scope.pageSize;

      $scope.offset = $scope.totalCount - goldNumber;

      $scope.updateResults();
    }

    $scope.removeFacet = function(facet) {

      var tempArray = [];
      // $scope.selectedFacets = Init.selectedFacets();
      for ($scope.i = 0; $scope.i < $scope.selectedFacets.length; $scope.i++) {
        if (facet != $scope.selectedFacets[$scope.i]) {
          tempArray.push($scope.selectedFacets[$scope.i]);
        }
      }
      $scope.selectedFacets = tempArray;
      Init.selectedFacets(tempArray);

      $scope.updateResults();
    }

   /**
    * So, we know it's going in here onclick
    * The problem is that it's running the whole controller
    * and therefore the selectedFacets end up been empty
    * They need to become static - move to the sercice...
    */
    $scope.addFacet = function(facet) {
      // 1. see we are running

      if (notExists(Init.selectedFacets(),facet)) {
        Init.selectedFacets().push(facet);
        Init.selectedFacets(Init.selectedFacets());

      }
      $scope.updateResults();
    }

    $scope.toggleFacet = function (f) {
      $scope.facetVisibility = Init.facetsVisibility();
      $scope.facetVisibility[f.id] = !$scope.facetVisibility[f.id];      
    }    

    $scope.toggleFilter = function(button) {
      if (button['state'] == 'btn-active') {
        button['state'] = 'off';
      } else {
        button['state'] = 'btn-active';
      }
    }

    $scope.clearAll = function() {
      $scope.selectedFacets = [];
      $scope.facetVisibility = [];
      $scope.currentSearchFields = $scope.searchFields[0];
      $scope.yourName = '';
     // $scope.updateResults();
      $scope.fields = [];
      $scope.pageCurrent = 0;
      $scope.pageCount = 0;
      $scope.totalCount = 0;
      // $scope.resultsStart = 0;
      // $scope.resultsEnd = 0;
    }

    Init.initBuckets($scope, client);

    $scope.isExpanded = function(f) {
      return $scope.facetVisibility[f.id];
    }

    $scope.buildQueryWithAQ = function(q) {
      var fs = null;

      if ($scope.currentSearchFields.name !== 'All') {
        var fields = new Array();

        for (var i = 0; i < $scope.currentSearchFields.fields.length; i++) {
            var sf = new SearchField($scope.currentSearchFields.name,$scope.currentSearchFields.fields[i],-1);
            fields.push(sf);
        }
        var fs = new SearchFields(fields);
       }

      // check query term if null use default query
      var qsq = new QueryStringQuery(q+'*', "OR", fs, true);

      var filtersQuery = $scope.initialFilters;          //  Init.filters();

      var qsqXXX = new Query(qsq.toJSON(), true);

      var filteredQ = new FilteredQuery(filtersQuery, qsqXXX);

      var query = new Query(filteredQ.toJSON(), true);

      return query;
    }

    $scope.getFormat = function(longFormat) {
      switch(longFormat) {
        case 'application/msword':
          return 'doc';
        case 'application/vnd.ms-powerpoint':
          return 'powerpoint';
        case 'text/richtext':
          return 'text';
        case 'text/html':
          return 'text';
        case 'vnd.ms-excel':
          return 'doc';
        case 'image/gif':
          return 'image';
        case 'application/pdf':
          return 'pdf';
        case 'application/zip':
          return 'zip';
        default:
          return 'unknown';
      }      
      return 'unknown';
    }

    $scope.getSuperFormat = function(longFormat, id) {
      if (typeof(longFormat)=='undefined') {
      //  obj =  $scope.fileInfo[id];
        if (typeof(id)=='undefined') {
          return 'unknown-1';
        } else {
          if (typeof($scope.fileInfo[id])!='undefined' && typeof($scope.fileInfo[id].original)!='undefined') {
            return $scope.fileInfo[id].original.format  
          }
          return 'unknown';
        }
        return 'unknown-3';
      }
      return $scope.getFormat(longFormat);
    }

    // check if a query was performed...
    $scope.hasQuery = function() { 
      return Init.hasQuery();
    }

    $scope.updateResultsFromScratch = function() {

      $scope.pageCurrent = 1;
      $scope.updateResults();
    }

    $scope.updateResults = function() {
      if ($scope.selectedFacets.length == 0) {
        $scope.initialFilters = Init.filters();
      } else {
        for (var i =0; i<$scope.selectedFacets.length; i++) {
          var facade = $scope.selectedFacets[i];
          $scope.initialFilters.addTerm(new TermQuery($scope.facetNameMap[facade.field], facade.title));
        }

      }

      var query = '';

      if (typeof($scope.yourName) != 'undefined') {
        query = $scope.buildQueryWithAQ($scope.yourName);
      } else {
        query = Init.query($scope.initialFilters);
      }

      $scope.initialSearch = Init.search(query, $scope.aggs);

      var aggs = Init.aggs();

      var size = new Size($scope.pageSize);
      var from = new From($scope.offset);

      var fs3 = new FieldSort("summary_title", "asc", "avg");
      var sortFields = new Array(fs3);
      var sort = new SortFields(sortFields);

      ////////  function SearchQuery(fields, query, size, sort, highlight, aggs) {

      var searchQ = new SearchQuery(query, from, size, sort, aggs);

      $scope.theQuery = searchQ.toJSON();

      Init.setMachine(searchQ);
      

      Init.clientSearch(client, $scope, searchQ.toJSON());

    }

    return $scope.AggregationListCtrl = this;

}]);

aggregationControllers.controller('AggregationListCtrlHudson', ['$scope', '$http', 'client', 'esFactory', 'Init', '$routeParams', '$route', '$location',
  
  function ($scope, $http, client, esFactory, Init, $routeParams, $route, $location) {

    // $scope.pageCurrent = 0;
    
    $scope.pageCurrent = Init.currentPage();

    $scope.totalCount = 0;
    $scope.pageCount = 0;
    $scope.pageSize = 10;
    $scope.offset = 0;
    $scope.resultsStart = 1;
    $scope.resultsEnd = $scope.pageSize;

    // this needs to go actually - only call once is the right thing. 

    $scope.facetVisibility = Init.facetsVisibility();
    $scope.selectedFacets = Init.selectedFacets();

 
    $scope.aggs = Init.aggs();
    $scope.initialFilters = Init.filters();
    $scope.initialQuery = Init.query($scope.initialFilters);
    $scope.initialSearch = Init.search($scope.initialQuery, $scope.aggs);

    $scope.facets = [];


    // moved to services
    $scope.facetNameMap = Init.facetNameMap();

    $scope.sources = Init.sources();

    var machine = Init.getMachine();


    if (typeof(machine) != 'undefined') {
      Init.clientSearch(client, $scope, machine.toJSON(),$http);

    }

    $scope.remoteUrlRequestFn = function(str) {
      return {q: str};
    };

    $scope.selectedStuff = function(selected) {
     $scope.updateResultsFromScratch();
    };

    // moved to services
    $scope.searchFields = Init.searchFields();

    $scope.currentSearchFields = $scope.searchFields[0];

    $scope.clearSearches = function() {
      $scope.facets = [];
      // $scope.selectedFacets = Init.selectedFacets();
      // $scope.facetVisibility = [];
      $scope.currentSearchFields = $scope.searchFields[0];
      $scope.yourName = '';
    }

    // $scope.clearSearches();

    $scope.pageForward = function () {
      // $scope.newPage = $scope.pageCurrent + 1;
      $scope.newPage = Init.currentPage() + 1;
      
      // $scope.pageCurrent = Math.min($scope.newPage, $scope.pageCount);
      $scope.pageCurrent = Init.currentPage( Math.min($scope.newPage, $scope.pageCount));


      $scope.offset = ($scope.pageCurrent-1)*$scope.pageSize;
      $scope.updateResults();
    }

    $scope.pageBack = function () {
      $scope.newPage = $scope.pageCurrent - 1;
      
      // $scope.pageCurrent = Math.max($scope.newPage, 1);

      $scope.pageCurrent = Init.currentPage(Math.max($scope.newPage, 1));  

      if ($scope.pageCurrent==1) {
        $scope.offset = 0;
      } else {
        $scope.offset = ($scope.pageCurrent-1)*$scope.pageSize;
      }

      $scope.updateResults();
    }

    $scope.pageFirst = function () {
      // $scope.pageCurrent = Math.min(1, $scope.pageCount);
      $scope.pageCurrent = Init.currentPage(1);

      $scope.offset = 0;
      $scope.updateResults();
    }

    $scope.pageLast = function () {
      $scope.pageCurrent = Init.currentPage($scope.pageCount);


      var goldNumber = $scope.totalCount % $scope.pageSize;

      $scope.offset = $scope.totalCount - goldNumber;

      $scope.updateResults();
    }

    $scope.removeFacet = function(facet) {

      var tempArray = [];
      // $scope.selectedFacets = Init.selectedFacets();
      for ($scope.i = 0; $scope.i < $scope.selectedFacets.length; $scope.i++) {
        if (facet != $scope.selectedFacets[$scope.i]) {
          tempArray.push($scope.selectedFacets[$scope.i]);
        }
      }
      $scope.selectedFacets = tempArray;
      Init.selectedFacets(tempArray);

      $scope.updateResults();
    }

   /**
    * So, we know it's going in here onclick
    * The problem is that it's running the whole controller
    * and therefore the selectedFacets end up been empty
    * They need to become static - move to the sercice...
    */
    $scope.addFacet = function(facet) {
      // 1. see we are running

      if (notExists(Init.selectedFacets(),facet)) {
        Init.selectedFacets().push(facet);
        Init.selectedFacets(Init.selectedFacets());

      }
      $scope.updateResults();
    }

    $scope.toggleFacet = function (f) {
      $scope.facetVisibility = Init.facetsVisibility();
      $scope.facetVisibility[f.id] = !$scope.facetVisibility[f.id];      
    }    

    $scope.toggleFilter = function(button) {
      if (button['state'] == 'btn-active') {
        button['state'] = 'off';
      } else {
        button['state'] = 'btn-active';
      }
    }

    $scope.clearAll = function() {
      $scope.selectedFacets = [];
      $scope.facetVisibility = [];
      $scope.currentSearchFields = $scope.searchFields[0];
      $scope.yourName = '';
     // $scope.updateResults();
      $scope.fields = [];
      $scope.pageCurrent = 0;
      $scope.pageCount = 0;
      $scope.totalCount = 0;
      // $scope.resultsStart = 0;
      // $scope.resultsEnd = 0;
    }

    Init.initBuckets($scope, client);

    $scope.isExpanded = function(f) {
      return $scope.facetVisibility[f.id];
    }

    $scope.buildQueryWithAQ = function(q) {
      var fs = null;

      if ($scope.currentSearchFields.name !== 'All') {
        var fields = new Array();

        for (var i = 0; i < $scope.currentSearchFields.fields.length; i++) {
            var sf = new SearchField($scope.currentSearchFields.name,$scope.currentSearchFields.fields[i],-1);
            fields.push(sf);
        }
        var fs = new SearchFields(fields);
       }

      // check query term if null use default query
      var qsq = new QueryStringQuery(q+'*', "OR", fs, true);

      var filtersQuery = $scope.initialFilters;          //  Init.filters();

      var qsqXXX = new Query(qsq.toJSON(), true);

      var filteredQ = new FilteredQuery(filtersQuery, qsqXXX);

      var query = new Query(filteredQ.toJSON(), true);

      return query;
    }


    // check if a query was performed...
    $scope.hasQuery = function() { 
      return Init.hasQuery();
    }


    $scope.updateResultsFromScratch = function() {
      $scope.pageCurrent = 1;
      $scope.updateResults();
    }

    $scope.updateResults = function() {
      if ($scope.selectedFacets.length == 0) {
        $scope.initialFilters = Init.filters();
      } else {
        for (var i =0; i<$scope.selectedFacets.length; i++) {
          var facade = $scope.selectedFacets[i];
          $scope.initialFilters.addTerm(new TermQuery($scope.facetNameMap[facade.field], facade.title));
        }

      }
      var query = '';

      if (typeof($scope.yourName) != 'undefined') {
        query = $scope.buildQueryWithAQ($scope.yourName);
      } else {
        query = Init.query($scope.initialFilters);
      }

      $scope.initialSearch = Init.search(query, $scope.aggs);

      var aggs = Init.aggs();

      var size = new Size($scope.pageSize);
      var from = new From($scope.offset);

      var fs3 = new FieldSort("summary_title", "asc", "avg");
      var sortFields = new Array(fs3);
      var sort = new SortFields(sortFields);

      ////////  function SearchQuery(fields, query, size, sort, highlight, aggs) {


      var searchQ = new SearchQuery(query, from, size, sort, aggs);

      $scope.theQuery = searchQ.toJSON();

      Init.setMachine(searchQ);
      Init.clientSearch(client, $scope, searchQ.toJSON(), $http);

    }

    return $scope.AggregationListCtrl = this;

}]);



aggregationControllers.controller('AggregationAdvancedListCtrl', ['$scope', '$http', 'client', 'esFactory', 'Init', '$routeParams', '$route', '$location',
  
  function ($scope, $http, client, esFactory, Init, $routeParams, $route, $location) {

    $scope.pageCurrent = 0;

    $scope.totalCount = 0;
    $scope.pageCount = 0;
    $scope.pageSize = 10;

    $scope.offset = 0;

    // this needs to go actually - only call once is the right thing. 

    $scope.facetVisibility = Init.facetsVisibility();
    $scope.selectedFacets = Init.selectedFacets();

    $scope.resultsStart = 1;
    $scope.resultsEnd = $scope.pageSize;
 
    $scope.aggs = Init.aggs();
    $scope.initialFilters = Init.filters();
    $scope.initialQuery = Init.query($scope.initialFilters);
    $scope.initialSearch = Init.search($scope.initialQuery, $scope.aggs);

    $scope.facets = [];


    // moved to services
    $scope.facetNameMap = Init.facetNameMap();

    // moved to services
    $scope.searchFields = Init.searchFields();

    $scope.currentSearchFields = $scope.searchFields[0];

    $scope.clearSearches = function() {
      $scope.facets = [];
      // $scope.selectedFacets = Init.selectedFacets();
      // $scope.facetVisibility = [];
      $scope.currentSearchFields = $scope.searchFields[0];
      $scope.yourName = '';
    }

    // $scope.clearSearches();

    $scope.pageForward = function () {
      $scope.newPage = $scope.pageCurrent + 1;
      $scope.pageCurrent = Math.min($scope.newPage, $scope.pageCount);
      $scope.offset = ($scope.pageCurrent-1)*$scope.pageSize;
      $scope.updateResults();
    }

    $scope.pageBack = function () {
      $scope.newPage = $scope.pageCurrent - 1;
      $scope.pageCurrent = Math.max($scope.newPage, 1);

      if ($scope.pageCurrent==1) {
        $scope.offset = 0;
      } else {
        $scope.offset = ($scope.pageCurrent-1)*$scope.pageSize;
      }

      $scope.updateResults();
    }

    $scope.pageFirst = function () {
      $scope.pageCurrent = Math.min(1, $scope.pageCount);
      $scope.offset = 0;
      $scope.updateResults();
    }

    $scope.pageLast = function () {
      $scope.pageCurrent = $scope.pageCount;
      var goldNumber = $scope.totalCount % $scope.pageSize;

      $scope.offset = $scope.totalCount - goldNumber;

      $scope.updateResults();
    }

    $scope.removeFacet = function(facet) {

      var tempArray = [];
      // $scope.selectedFacets = Init.selectedFacets();
      for ($scope.i = 0; $scope.i < $scope.selectedFacets.length; $scope.i++) {
        if (facet != $scope.selectedFacets[$scope.i]) {
          tempArray.push($scope.selectedFacets[$scope.i]);
        }
      }
      $scope.selectedFacets = tempArray;
      Init.selectedFacets(tempArray);

      $scope.updateResults();
    }

   /**
    * So, we know it's going in here onclick
    * The problem is that it's running the whole controller
    * and therefore the selectedFacets end up been empty
    * They need to become static - move to the sercice...
    */
    $scope.addFacet = function(facet) {
      // 1. see we are running

      if (notExists(Init.selectedFacets(),facet)) {
        Init.selectedFacets().push(facet);
        Init.selectedFacets(Init.selectedFacets());

      }
      $scope.updateResults();
    }

    $scope.toggleFacet = function (f) {
      $scope.facetVisibility = Init.facetsVisibility();
      $scope.facetVisibility[f.id] = !$scope.facetVisibility[f.id];      
    }    

    $scope.clearAll = function() {
      $scope.selectedFacets = [];
      $scope.facetVisibility = [];
      $scope.currentSearchFields = $scope.searchFields[0];
      $scope.yourName = '';
     // $scope.updateResults();
      $scope.fields = [];
      $scope.pageCurrent = 0;
      $scope.pageCount = 0;
      $scope.totalCount = 0;
      // $scope.resultsStart = 0;
      // $scope.resultsEnd = 0;
    }

    Init.initBuckets($scope, client);

    $scope.isExpanded = function(f) {
      return $scope.facetVisibility[f.id];
    }

    $scope.buildQueryWithAQ = function(q) {
      var fs = null;

      if ($scope.currentSearchFields.name !== 'All') {
        var fields = new Array();

        for (var i = 0; i < $scope.currentSearchFields.fields.length; i++) {
            var sf = new SearchField($scope.currentSearchFields.name,$scope.currentSearchFields.fields[i],-1);
            fields.push(sf);
        }
        var fs = new SearchFields(fields);
       }

      // check query term if null use default query
      var qsq = new QueryStringQuery(q+'*', "OR", fs, true);

      var filtersQuery = $scope.initialFilters;          //  Init.filters();

      var qsqXXX = new Query(qsq.toJSON(), true);

      var filteredQ = new FilteredQuery(filtersQuery, qsqXXX);

      var query = new Query(filteredQ.toJSON(), true);

      return query;
    }


    $scope.updateResultsFromScratch = function() {
      $scope.pageCurrent = 1;
      $scope.updateResults();
    }

    $scope.updateResults = function() {
      if ($scope.selectedFacets.length == 0) {
        $scope.initialFilters = Init.filters();
      } else {
        for (var i =0; i<$scope.selectedFacets.length; i++) {
          var facade = $scope.selectedFacets[i];
          $scope.initialFilters.addTerm(new TermQuery($scope.facetNameMap[facade.field], facade.title));
        }

      }
      var query = '';

      if (typeof($scope.yourName) != 'undefined') {
        query = $scope.buildQueryWithAQ($scope.yourName);
      } else {
        query = Init.query($scope.initialFilters);
      }

      $scope.initialSearch = Init.search(query, $scope.aggs);

      var aggs = Init.aggs();

      var size = new Size($scope.pageSize);
      var from = new From($scope.offset);

      var fs3 = new FieldSort("summary_title", "asc", "avg");
      var sortFields = new Array(fs3);
      var sort = new SortFields(sortFields);

      var searchQ = new SearchQuery(query, from, size, sort, aggs);

      $scope.theQuery = searchQ.toJSON();

      Init.clientSearch(client, $scope, searchQ.toJSON());

    }

    return $scope.AggregationAdvancedListCtrl = this;

}]);

// aggregationControllers.controller('AggregationDetailCtrl', ['$scope', '$routeParams', 'Resource',
aggregationControllers.controller('AggregationDetailsCtrl', ['$scope', '$http', 'client', 'esFactory', 'Init', '$routeParams', '$route', '$location',
  function ($scope, $http, client, esFactory, Init, $routeParams, $route, $location) {
    var path = $location.path();

    path = path.replace('/resources/', '');

    var request = $http({
      method: "get",
      url: "http://mapping.mimas.ac.uk/quickviewjs/"+path,
        data: {}
      });

      request.success(
        function(data) {

          if (data.bitstreams[0].bundleName == 'URL_BUNDLE') {
            $scope.url = 'http://player.vimeo.com/video/19751528';
            // $scope.url = data.bitstreams[0].name;
          } else {
            $scope.url = 'http://window.bentleysoft.com/api/preview/'+path;
          }

          $scope.details = data;

        }
      );


    $scope.setImage = function (imageUrl) {
      $scope.mainImageUrl = imageUrl;
    }
  }]);
