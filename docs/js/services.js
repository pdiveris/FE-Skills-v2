'use strict';

var rights_type_filter = new TermQuery("lifecycle.publication.rights.uri","http://creativecommons.org/licenses/by-nc/2.0/uk/");

var facetVisibility = [];
var theSelectedFacets = [];
var haveQuery = false;

// new tricks. 
var userFilters = [
  {
    'title': 'Subject Area',
    'class': 'hidden',
    'id': 100,
    'tags': [
      {'label': 'Education / Training / Teaching', 'checked': false, 'id': 2001},
      {'label': 'Catering / food / leisure services / tourism', 'checked': false, 'id': 2002},
      {'label': 'Business Management', 'checked': false, 'id': 2003},
      {'label': 'Busilding and construction', 'checked': false, 'id': 2004},
      {'label': 'Personal care and appearence', 'checked': false, 'id': 2005},
      {'label': 'Construction and Building', 'checked': false}
    ]
  },
  {
    'title': 'Services',
    'class': 'hidden',
    'facet': 'collection',
    'id': 101,
    'type': 'facet',
    'tags': [
      {'label': 'Jorum', 'checked': false, 'value': 'jorum', 'id': 1001},
      {'label': 'Hairdressing Training', 'checked': false, 'value': 'ht', 'id': 1002},
      {'label': 'Mediahub', 'checked': false, 'value': 'mediahub', 'id': 1004}
    ]
  },
  {
    'title': 'Resource Type',
    'id':102,
    'class': 'hidden', 
  },
  {
    'title': 'Level',
    'id':103,
    'class': 'hidden',    
  },
  {
    'title': 'Currency',
    'id':103,
    'class': 'hidden' 
  },
  {
    'title': 'Licence',
    'id':104,
    'class': 'hidden'
  }

];

var stateMachine;

var newStateMachine = {
    totalCount: 0,
    pageCount: 0,
    pageSize: 0,
    offset: 0,
    resultsStart: 1
  };

var pageCurrent = 1;

facetVisibility[0] = false;
facetVisibility[1] = false;
facetVisibility[2] = false;
facetVisibility[3] = false;
facetVisibility[4] = false;
facetVisibility[5] = false;

var initFilters = function() {

  // var oer_filter = new TermQuery("audience", "FE");
  // var oer_filter = new TermQuery("admin.complete","true");
   
  var oer_filter = new TermQuery("sector","FE");



  var filters = new Array(oer_filter);
  var filters = [];
  var filtersQuery = new FiltersQuery(filters);

  return filtersQuery;
}; 

var getStateMachine = function() {
  return stateMachine;
}

var setStateMachine = function(machine) {
  stateMachine = machine;
}

var call = function($scope) {
  // http://window.bentleysoft.com/api/items/jorum-10949/16778
  // Holistic Massage
  var request = $scope.$http({
    method: "post",
    url: "/api/items",
    data: {data: $scope.fields}
  });

  request.success(
    function(data) {
      $scope.fileInfo = data;
    }
  );

}

var initUserFilters = function($scope) {
  return userFilters;
}

var initAggregations = function($scope) {
  var agg1 = new Aggregation("format","terms",'"field" : "format"');
  var agg2 = new Aggregation("author","terms",'"field" : "lifecycle.creation.author.name.value"');
  var agg3 = new Aggregation("license","terms",'"field" : "lifecycle.publication.rights.details"');
  var agg4 = new Aggregation("programme","terms",'"field" : "programme"');
  var agg5 = new Aggregation("subject","terms",'"field" : "subject.value"');
  var agg6 = new Aggregation("collection","terms",'"field" : "admin.source"');
  //var agg7 = new Aggregation("jacs3","terms",'"field" : "jmd_jacs3_subject.exact"');
  //var agg8 = new Aggregation("learn_direct","terms",'"field" : "jmd_learndirect_subject.exact"');
  //var agg9 = new Aggregation("resource_type","terms",'"field" : "jmd_resource_type"');

  var aggs = new Aggregations();
  aggs.addAgg(agg1);
  aggs.addAgg(agg2);
  aggs.addAgg(agg3);
  aggs.addAgg(agg4);
  aggs.addAgg(agg5);
  aggs.addAgg(agg6);
  //aggs.addAgg(agg7);
  //aggs.addAgg(agg8);
  //aggs.addAgg(agg9);


  return aggs;
};

var initQuery = function(filters) {
  var defaultQuery = new Query('"match_all" : {}',true);
  var filteredQ = new FilteredQuery(filters, defaultQuery);
  var query = new Query(filteredQ.toJSON(), true);
  
  return query;

};

var initSearch = function(query,aggs) {
  var size = new Size(10);
  var searchQuery = new SearchQuery(query,size,null,aggs);
  return searchQuery;

};


var initSources = function() {
  var ret = [];

  var temp = [];
  temp['id'] = 'ht';
  temp['label'] = 'Hairdressing';
  temp['state'] = 'btn-active';
  ret.push(temp);

  var temp = [];
  temp['id'] = 'jorum';
  temp['label'] = 'Jorum';
  temp['state'] = 'btn-active';

  ret.push(temp);

  var temp = [];
  temp['id'] = 'mediahub';
  temp['label'] = 'Mediahub';
  temp['state'] = 'btn-active';

  ret.push(temp);

  return ret;
};

var clientSearch = function(client, $scope, body) {

  client.search({
    index: 'ciim',
  //  type: 'media resource',
    body: body
  }).then(function (resp) {

    $scope.fields = resp.hits.hits;

    var io = call($scope);

    $scope.totalCount = resp.hits.total;

    if ($scope.totalCount > 0 && $scope.pageCurrent == 0) {
      $scope.pageCurrent = 1;
    }
    
    haveQuery = true;

    $scope.pageCount = Math.ceil($scope.totalCount / $scope.pageSize);

    $scope.facets = [];

    var keys = Object.keys(resp.aggregations);
    
    for (var i=0; i<keys.length; i++) {
      var meArray = [];
      var obj = eval('resp.aggregations.'+keys[i]);

      meArray['id'] = i;
      meArray['title'] = keys[i];
      meArray['count'] = '';

      meArray['subs'] = [];

      //  $scope.facetVisibility[i] = false;

      for (var j=0; j<obj.buckets.length; j++)  {
        var subs = [];

        subs['title'] = obj.buckets[j].key;
        subs['id'] = i;
        subs['field'] = meArray['title'];
        subs['count'] = obj.buckets[j].doc_count;

        meArray['subs'].push(subs);
      }
      $scope.facets.push(meArray);

    }
    $scope.error = null;
  }).catch(function (err) {
    $scope.fields = [];
    $scope.error = err;

    // if the err is a NoConnections error, then the client was not able to
    // connect to elasticsearch. In that case, create a more detailed error
    // message
    if (err instanceof esFactory.errors.NoConnections) {
      $scope.error = new Error('Unable to connect to elasticsearch. ' +
        'Make sure that it is running and listening at http://localhost:9200');
      }
  });

};

var app = angular.module('aggregationServices', ['elasticsearch']);

app.service('client', function (esFactory) {
  return esFactory({
    //   host: '130.88.120.147:9200',
    // host: 'www.definitio.org:9200',
    // host: 'es.definitio.org:80',
        host: 'feskills.mimas.ac.uk:80',
        apiVersion: '1.2',
        log: 'trace'
      });
});
// factory 
app.factory('Init',function() {
  return {
    apiCall: function(data,$scope) {
      return call(data,$scope);
    },
    aggs : function() {
      return initAggregations();
    },
    userFilters: function() {
      return initUserFilters();
    },
    filters : function() {
      return initFilters();
    },
    sources: function() {
      return initSources();
    },
    query : function(filters) {
      return initQuery(filters);
    },
    search : function(query,aggs) {
      return initSearch(query,aggs);
    },
    clientSearch: function(client, $scope, body) {
      return clientSearch(client, $scope, body);
    },
    hello : function(name) {
      return 'Hello '+name;
    },
    setMachine: function(machine) {
      setStateMachine(machine);
    },
    getMachine: function() {
      return getStateMachine();
    },
    facetsVisibility: function(visibility) {
      if (typeof(visibility) != 'undefined') {
        facetVisibility = visibility;
      }
      return facetVisibility;
    },
    hasQuery: function() {
      return haveQuery;
    },
    facetNameMap: function() {
      return {
        format: 'format',
        author: 'lifecycle.creation.author.name.value',
        license: 'lifecycle.publication.rights.details',
        programme: 'programme',
        subject: 'subject.value',
        collection: 'admin.source'
      }
    },
    currentPage: function(page) {
      if (typeof(page) != 'undefined') {

        pageCurrent = page;
      }
      return pageCurrent;
    },
    searchFields: function() {
      return [
        {name:'All', fields:['_all']},
        {name:'Title', fields:['name.value_text']},
        {name:'Description', fields:['description.value']},
        {name:'Keywords', fields:['programme']},
        {name:'Title and Description', fields:['name.value_text','description.value']},
        {name:'Title, Description and Keywords', fields:['name.value_text','description.value','programme']}
      ];
    },
    initBuckets: function($scope, client)  {
      return;

      client.search({
        index: 'ciim',
        type: 'learning resource',
        body: $scope.initialSearch.toJSON()
      })
      .then(function(resp) {
        var keys = Object.keys(resp.aggregations);
        for (var i=0; i<keys.length; i++) {
          var meArray = [];
          var obj = eval('resp.aggregations.'+keys[i]);

          meArray['id'] = i;
          meArray['title'] = keys[i];
          meArray['count'] = '';
          meArray['subs'] = [];

          for (var j=0; j<obj.buckets.length; j++)  {
            var subs = [];

            subs['title'] = obj.buckets[j].key;
            subs['id'] = i;
            subs['field'] = meArray['title'];
            subs['count'] = obj.buckets[j].doc_count;

            meArray['subs'].push(subs);
          }
          $scope.facets.push(meArray);
        }

    })
    .catch(function(err) {
        $scope.fields = [];
        $scope.error = err;

        // if the err is a NoConnections error, then the client was not able to
        // connect to elasticsearch. In that case, create a more detailed error
        // message  
        if (err instanceof esFactory.errors.NoConnections) {
            $scope.error = new Error('Unable to connect to elasticsearch. ' +
                    'Make sure that it is running and listening at http://localhost:9200');
        }
      });



    },
    selectedFacets: function(facets) {
      if (typeof(facets) != 'undefined') {
        theSelectedFacets = facets;
      } else {

      }
      return theSelectedFacets;
    }
  }
});

app.directive('pagination', function() {
  return {
      restrict: 'AE',
      replace: 'true',
      template: '<ul class="player">\
        <li><a href="#" ng-click="pageFirst()" ng-init="0"><i class="fa fa-step-backward fa-1x"></i></a></li> \
       <li><a href="#" ng-click="pageBack()" ng-init="0" ><i class="fa fa-play fa-1x fa-flip-horizontal"></i></a></li> \
        <li><a href="#" ng-click="pageForward()" ng-init="0" ><i class="fa fa-play fa-1x"></i></a></li> \
        <li><a href="#" ng-click="pageLast()" ng-init="0"><i class="fa fa-step-forward fa-1x"></i></a></li> \
       \
      </ul>'
  };
});

/*
  <button class="btn"><i class="fa fa-times fa-1x"></i>&nbsp; Clear Search</button>
  <button class="btn"><i class="fa fa-file-text-o fa-1x"></i>&nbsp; View Report</button>
  <button class="btn"><i class="fa fa-paperclip fa-1x"></i>&nbsp; Share</button>
  <button class="btn"><i class="fa fa-question-circle fa-1x"></i>&nbsp; Help</button>
*/

app.directive('controls', function() {
  return {
      restrict: 'AE',
      replace: 'true',
      template: '<span>\
                <button ng-click="clearAll()" class="btn"><i class="fa fa-times fa-1x"></i>&nbsp; Clear Search</button>\
                </span>'
  };
});

app.directive('colorbox', function() {
  return {   
      restrict: 'AC',    
      link: function (scope, element, attrs) {
      var attributes = JSON.parse(attrs.colorbox);

      $(element).colorbox(attributes);     
    }
  };  
});


app.directive('a', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if(attrs.ngClick || attrs.href === '' || attrs.href === '#'){
                elem.on('click', function(e){
                    e.preventDefault();
                });
            }
        }
   };
});




