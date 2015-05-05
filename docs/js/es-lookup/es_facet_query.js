var rights_type_filter = new TermQuery("lifecycle.publication.rights.uri","http://creativecommons.org/licenses/by-nc/2.0/uk/");

var initFilters = function() {
  var oer_filter = new TermQuery("admin.complete","true");
  // var oer_filter = new TermQuery("audience","FE");
  var filters = new Array(oer_filter);
  var filtersQuery = new FiltersQuery(filters);
  
   return filtersQuery;
};

var initAggregations = function() {
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
