/**
 * =============================================================================================
 */

/**
 * Query
 */

/**
 * Represents a complete query that can be combined with sorting and aggregations.
 * @constructor
 * @param {string} body - The JSON reqpresentation of the query.
 * @param {boolean} nested - Whether this query is nested in another query or filter construct.
 */
function Query(body, nested) {
    "use strict";
    this.body = body;
    //alert(body);
    this.nested = nested;
}

/**
 * toJSON.
 * @function
 * @returns {string} - A JSON representation of the query.
 */
Query.prototype.toJSON = function () {
    "use strict";
    if (this.nested) {
        return '"query" : { ' + this.body + ' } ';
    } else {
        return '{ "query" : { ' + this.body + ' } }';
    }
};

/**
 * Getter for body.
 * @function
 * @returns {string} - The body of the query.
 */
Query.prototype.getBody = function () {
    return this.body;
};

/**
 * Setter for body.
 * @function
 * @param {string} newBody - The new body of the query.
 */
Query.prototype.setBody = function (newBody) {
    this.body = newBody;
};

/**
 * Getter for nested.
 * @function
 * @returns {boolean} - Whether this query is nested in another query or filter construct.
 */
Query.prototype.getNested = function () {
    return this.nested;
};

/**
 * Setter for nested.
 * @function
 * @param {boolean} newNested - The new value.
 */
Query.prototype.setNested = function (newNested) {
    this.nested = newNested;
};

/**
 * =============================================================================================
 */

/**
 * HasParentQuery
 */

/**
 * Represents a complete query that can be combined with sorting and aggregations.
 * @constructor
 * @param {Query} query - The JSON reqpresentation of the query.
 * @param {string} parentType - The type of the parent document.
 */
function HasParentQuery(query, parentType) {
    "use strict";
    this.query = query;
    //alert(body);
    this.parentType = parentType;
}

HasParentQuery.prototype = Object.create(Query.prototype);

HasParentQuery.prototype.constructor = HasParentQuery;
/**
 * toJSON.
 * @function
 * @returns {string} - A JSON representation of the query.
 */
HasParentQuery.prototype.toJSON = function () {
    "use strict";
    
    var query = '"query" : { "has_parent" : { "parent_type" : "';
    query += this.parentType + '",';
    query += this.query.toJSON();
    query += '} }';
    
    return query;
};

/**
 * Getter for query.
 * @function
 * @returns {string} - The body of the query.
 */
HasParentQuery.prototype.getQuery = function () {
    return this.query;
};

/**
 * Setter for query.
 * @function
 * @param {string} newQuery - The new query.
 */
HasParentQuery.prototype.setQuery = function (newQuery) {
    this.query = newQuery;
};

/**
 * Getter for parentType.
 * @function
 * @returns {string} - The type of the parent document.
 */
HasParentQuery.prototype.getBody = function () {
    return this.parentType;
};

/**
 * Setter for parentType.
 * @function
 * @param {string} newParentType - The new type of the parent document.
 */
HasParentQuery.prototype.setParentType = function (newParentType) {
    this.parentType = newParentType;
};

/**
 * =============================================================================================
 */

/**
 * TermQuery
 */

/**
 * Represents a term in the current query.
 * @constructor
 * @augments Query
 * @param {string} field - The field to search.
 * @param {string} termValue - The value of the term.
 */
function TermQuery(field, termValue) {
    "use strict";
    Query.call(this);
    this.field = field;
    this.termValue = termValue;
}

TermQuery.prototype = Object.create(Query.prototype);

TermQuery.prototype.constructor = TermQuery;

/**
 * Getter for field.
 * @function
 * @returns {string} field - The current value of this field for the current query.
 */
TermQuery.prototype.getField = function () {
    return this.field;
};

/**
 * Setter for field.
 * @function
 * @param {string} newField - A field of the current query.
 */
TermQuery.prototype.setField = function (newField) {
    this.field = newField;
};

/**
 * Getter for termValue.
 * @function
 * @returns {string} termValue - The current value of a term in the current query.
 */
TermQuery.prototype.getTermValue = function () {
    return this.termValue;
};

/**
 * Setter for termValue.
 * @function
 * @param {string} newTermValue - The new value of a term in the current query.
 */
TermQuery.prototype.setTermValue = function (newTermValue) {
    this.termValue = newTermValue;
};

/**
 * toJSON.
 * @function
 * @returns {string} - A JSON representation of the query.
 */
TermQuery.prototype.toJSON = function() {
    "use strict";
    /*"term" : {
     "oer" : true
     }*/
    return '"term" : { "' + this.getField() + '" : "' + this.getTermValue() + '" }';
};

if (test) {
    var tq = new TermQuery("title", "rat");
    console.log(tq.toJSON());
}
/**
 * =============================================================================================
 */

/**
 * BoolQuery
 */

/**
 * Represents a boolean query in the current query.
 * @constructor
 * @augments Query
 * @param {TermQuery[]} terms - The facets selected for this query.
 * @param {string} mode - The mode of the boolean operation - either must, should or must not.
 */
function BoolQuery(terms, mode) {
    "use strict";
    Query.call(this);
    this.terms = terms;
    this.mode = mode;
}

BoolQuery.prototype = Object.create(Query.prototype);

BoolQuery.prototype.constructor = BoolQuery;

/**
 * Getter for mode.
 * @function
 * @returns {string} mode - The mode of the boolean operation - either must, should or must not.
 */
BoolQuery.prototype.getMode = function () {
    return this.mode;
};

/**
 * Setter for mode.
 * @function
 * @param {string} newMode - The mode of the boolean operation - either must, should or must not.
 */
BoolQuery.prototype.setMode = function (newMode) {
    this.mode = newMode;
};

/**
 * Getter for terms.
 * @function
 * @returns {TermQuery[]} terms - The facets selected for this query.
 */
BoolQuery.prototype.getTerms = function () {
    return this.terms;
};

/**
 * Setter for terms.
 * @function
 * @param {TermQuery[]} newTerms - The facets selected for this query.
 */
BoolQuery.prototype.setTerms = function (newTerms) {
    this.terms = newTerms;
};

/**
 * Add a new term.
 * @function
 * @param {TermQuery} newTerm - A new facet term selected for this query.
 */
BoolQuery.prototype.addTerm = function (newTerm) {
    this.terms.push(newTerm);
};

/**
 * toJSON.
 * @function
 * @returns {string} - A JSON representation of the query.
 */
BoolQuery.prototype.toJSON = function () {
    "use strict";
    var query = '"bool": { "' + this.mode + '" [';
    var index;

    for (index = 0; index < this.terms.length; ++index) {
        query += this.terms[index].toJSON();
        if (index + 1 < this.terms.length) {
            query += ',';
        }
    }

    query += ']}';

    return query;
};

if (test) {
    var tq1 = new TermQuery("title", "rat");
    var tq2 = new TermQuery("desc", "tail");
    var terms = new Array(tq1, tq2);
    var bq = new BoolQuery(terms, "must");

    console.log(bq.toJSON());
}


/**
 * =============================================================================================
 */

/**
 * QueryStringQuery
 */

/**
 * Represents a query string query in the current query.
 * @constructor
 * @augments Query
 * @param {QueryString} queryString - The query string for this query.
 * @param {string} defaultOperator - The default logical operator - either AND or OR.
 * @param {SearchFields} searchFields - The set of fields to search over.
 * @param {boolean} useDisMax - Should the queries be combined using dis_max (set it to true), or a bool query (set it to false). Defaults to true.
 */
function QueryStringQuery(queryString, defaultOperator, searchFields, useDisMax) {
    "use strict";
    Query.call(this);
    this.queryString = queryString;
    this.defaultOperator = defaultOperator;
    this.searchFields = searchFields;
    this.useDisMax = useDisMax;
}

QueryStringQuery.prototype = Object.create(Query.prototype);

QueryStringQuery.prototype.constructor = QueryStringQuery;

/**
 * Getter for queryString.
 * @function
 * @returns {QueryString} queryString - The query string for this query.
 */
QueryStringQuery.prototype.getQueryString = function () {
    return this.queryString;
};

/**
 * Setter for queryString.
 * @function
 * @param {QueryString} newQueryString - The new query string for this query.
 */
QueryStringQuery.prototype.setQueryString = function (newQueryString) {
    this.queryString = newQueryString;
};

/**
 * Getter for defaultOperator.
 * @function
 * @returns {string} defaultOperator - The default logical operator - either AND or OR.
 */
QueryStringQuery.prototype.getDefaultOperator = function () {
    return this.defaultOperator;
};

/**
 * Setter for defaultOperator.
 * @function
 * @param {string} newDefaultOperator - The new default logical operator - either AND or OR.
 */
QueryStringQuery.prototype.setDefaultOperator = function (newDefaultOperator) {
    this.defaultOperator = newDefaultOperator;
};

/**
 * Getter for searchFields.
 * @function
 * @returns {SearchFields} searchFields - The default logical operator - either AND or OR.
 */
QueryStringQuery.prototype.getSearchFields = function () {
    return this.searchFields;
};

/**
 * Setter for searchFields.
 * @function
 * @param {SearchFields} newSearchFields - The new default logical operator - either AND or OR.
 */
QueryStringQuery.prototype.setSearchFields = function (newSearchFields) {
    this.searchFields = newSearchFields;
};

/**
 * Getter for useDisMax.
 * @function
 * @returns {boolean} useDisMax - Should the queries be combined using dis_max (set it to true), or a bool query (set it to false). Defaults to true.
 */
QueryStringQuery.prototype.getUseDisMax = function () {
    return this.useDisMax;
};

/**
 * Setter for useDisMax.
 * @function
 * @param {boolean} newUseDisMax - Should the queries be combined using dis_max (set it to true), or a bool query (set it to false). Defaults to true.
 */
QueryStringQuery.prototype.setUseDisMax = function (newUseDisMax) {
    this.useDisMax = newUseDisMax;
};

/**
 * toJSON.
 * @function
 * @returns {string} - A JSON representation of the query.
 */
QueryStringQuery.prototype.toJSON = function () {
    "use strict";
    var query = '"query_string" : { ';
    var index;

    query += '"query" : "' + this.queryString + '", "default_operator" : "' + this.defaultOperator + '"';
    if (typeof(this.searchFields) !== "undefined" && this.searchFields !== null) {
        query += ',' + this.searchFields.toJSON();
    }
    if (!this.useDisMax) {
        query += ', "use_dis_max" : false';
    }


    query += '}';

    return query;
};

if (test) {
    var qsq = new QueryStringQuery("frog cycle", "AND");
    console.log(qsq.toJSON());
}

/**
 * =============================================================================================
 */

/**
 * FilterQuery
 */

/**
 * Represents a filter query in the current query (used for oer == true).
 * @constructor
 * @augments TermQuery
 * @param {string} field - The field to search.
 * @param {string} termValue - The value of the term.
 */
function FilterQuery(field, termValue) {
    "use strict";
    TermQuery.call(this, field, termValue);
}

FilterQuery.prototype = Object.create(TermQuery.prototype);

FilterQuery.prototype.constructor = FilterQuery;

/**
 * toJSON.
 * @function
 * @returns {string} - A JSON representation of the query.
 */
FilterQuery.prototype.toJSON = function () {
    "use strict";
    /*"filter" : {
     "term" : {
     "adult" : true
     }
     }*/

    return '"filter" : { ' + TermQuery.prototype.toJSON.call(this) + ' }';
};

if (test) {
    var filter = new FilterQuery("oer", "true");
    console.log(filter.toJSON());
}

/**
 * =============================================================================================
 */

/**
 * FiltersQuery
 */

/**
 * Represents a filter query with more than one term in the current query.
 * @constructor
 * @augments Query
 * @param {TermQuery[]} terms - The facets selected for this query.
 */
function FiltersQuery(terms) {
    "use strict";
    Query.call(this);
    this.terms = terms;
}

FiltersQuery.prototype = Object.create(Query.prototype);

FiltersQuery.prototype.constructor = FiltersQuery;

/**
 * Getter for terms.
 * @function
 * @returns {TermQuery[]} terms - The facets selected for this query.
 */
FiltersQuery.prototype.getTerms = function () {
    return this.terms;
};

/**
 * Setter for terms.
 * @function
 * @param {TermQuery[]} newTerms - The facets selected for this query.
 */
FiltersQuery.prototype.setTerms = function (newTerms) {
    this.terms = newTerms;
};

/**
 * Add a new term.
 * @function
 * @param {TermQuery} newTerm - A new facet term selected for this query.
 */
FiltersQuery.prototype.addTerm = function (newTerm) {
    var idx = this.terms.indexOf(newTerm);
    //alert(idx);
    if (idx === -1) {
        this.terms.push(newTerm);
    }
};

/**
 * Remove a term.
 * @function
 * @param {TermQuery} term - The term to be removed from this query.
 */
FiltersQuery.prototype.removeTerm = function (term) {
    var idx = this.terms.indexOf(term);
    
    if (idx !== -1) {
        this.terms.splice(idx,1);
    }
};

/**
 * toJSON.
 * @function
 * @returns {string} - A JSON representation of the query.
 */
FiltersQuery.prototype.toJSON = function () {
    "use strict";
    var query = '"filter": { "bool" : {';
    var index;

    query += '"must" : [';
    for (index = 0; index < this.terms.length; ++index) {
        query += '{' + this.terms[index].toJSON() + '}';
        if (index + 1 < this.terms.length) {
            query += ',';
        }
    }

    query += '] } }';

    return  query;
};

if (test) {
    var oer_filter = new TermQuery("oer", "true");
    var hefe_filter = new TermQuery("hefe.exact", "Further Education");
    var filters = new Array(oer_filter, hefe_filter);

    var filtersQuery = new FiltersQuery(filters);

    console.log(filtersQuery.toJSON());
}

/**
 * =============================================================================================
 */

/**
 * FilteredQuery
 */

/**
 * Represents a filtered query with a filter of one or more filtered terms and a query.
 * @constructor
 * @augments Query
 * @param {FiltersQuery} filters - The filters selected by the user from the facets for this query.
 * @param {Query} query - The user entered query string for this query.
 */
function FilteredQuery(filters, query) {
    "use strict";
    Query.call(this);
    this.filters = filters;
    this.query = query;
}

FilteredQuery.prototype = Object.create(Query.prototype);

FilteredQuery.prototype.constructor = FilteredQuery;

/**
 * Getter for filters.
 * @function
 * @returns {FiltersQuery} filters - The filters selected by the user from the facets for this query.
 */
FilteredQuery.prototype.getFilters = function () {
    return this.filters;
};

/**
 * Setter for filters.
 * @function
 * @param {FiltersQuery} newFilters - The filters selected by the user from the facets for this query.
 */
FilteredQuery.prototype.setFilters = function (newFilters) {
    this.filters = newFilters;
};

/**
 * Getter for query.
 * @function
 * @returns {Query} query - The filters selected by the user from the facets for this query.
 */
FilteredQuery.prototype.getQuery = function () {
    return this.query;
};

/**
 * Setter for query.
 * @function
 * @param {Query} newQuery - The filters selected by the user from the facets for this query.
 */
FilteredQuery.prototype.setQuery = function (newQuery) {
    this.query = newQuery;
};

/**
 * toJSON.
 * @function
 * @returns {string} - A JSON representation of the query.
 */
FilteredQuery.prototype.toJSON = function () {
    "use strict";
    var fil = '"filtered": { ';

    fil += this.query.toJSON();
    fil += ',';
    fil += this.filters.toJSON();
    fil += '}';

    return  fil;
};

if (test) {
    var filteredQ = new FilteredQuery(filtersQuery, qsq);
    console.log(filteredQ.toJSON());

    var query = new Query(filteredQ.toJSON());
    console.log(query.toJSON());
}

/**
 * =============================================================================================
 */

/**
 * FieldSort
 */

/**
 * Represents a field that the result are sorted against.
 * @constructor
 * @param {string} field - The field to sort on.
 * @param {string} order - The sort order, either asc or desc, default desc.
 * @param {string} mode - The sort mode, either min, max, sum or avg, default desc.
 */
function FieldSort(field, order, mode) {
    "use strict";
    this.field = field;
    this.order = order;
    this.mode = mode;
}

/**
 * Getter for field.
 * @function
 * @returns {string} field - The field to sort on.
 */
FieldSort.prototype.getField = function () {
    return this.field;
};

/**
 * Setter for field.
 * @function
 * @param {string} newField - The new field to sort on.
 */
FieldSort.prototype.setField = function (newField) {
    this.field = newField;
};

/**
 * Getter for order.
 * @function
 * @returns {string} order - The sort order, either asc or desc, default desc.
 */
FieldSort.prototype.getOrder = function () {
    return this.order;
};

/**
 * Setter for order.
 * @function
 * @param {string} newOrder - The new sort order, either asc or desc, default desc.
 */
FieldSort.prototype.setOrder = function (newOrder) {
    this.order = newOrder;
};

/**
 * Getter for mode.
 * @function
 * @returns {string} mode - The sort mode, either min, max, sum or avg, default desc.
 */
FieldSort.prototype.getMode = function () {
    return this.mode;
};

/**
 * Setter for mode.
 * @function
 * @param {string} newMode - The new sort mode, either min, max, sum or avg, default desc.
 */
FieldSort.prototype.setMode = function (newMode) {
    this.mode = newMode;
};

/**
 * toJSON.
 * @function
 * @returns {string} - A JSON representation of the field.
 */
FieldSort.prototype.toJSON = function () {
    "use strict";
    var sort = '{ "';

    sort += this.field;
    sort += '" : {';
    if (typeof(this.order) !== "undefined" && this.order !== null) {
        sort += '"order" : "' + this.order + '"';
    } else {
        sort += '"order" : "desc"';
    }
    if (typeof(this.mode) !== "undefined" && this.mode !== null) {
        sort += ', "mode" : "' + this.mode + '"';
    }
    sort += '} }';

    return  sort;
};

if (test) {
    var fs1 = new FieldSort("dc_title", null, null);
    console.log(fs1.toJSON());
     var fs2 = new FieldSort("dc_title", "desc", null);
    console.log(fs2.toJSON());
     var fs3 = new FieldSort("dc_title", "asc", "avg");
    console.log(fs3.toJSON());  
}
/**
 * =============================================================================================
 */

/**
 * =============================================================================================
 */

/**
 * SortFields
 */

/**
 * Represents the fields that the result are sorted against.
 * @constructor
 * @param {FieldSort[]} fields - The fields to sort on.
 */
function SortFields(fields) {
    "use strict";
    this.fields = fields;
}

/**
 * Getter for fields.
 * @function
 * @returns {FieldSort[]} fields - The fields to sort on.
 */
SortFields.prototype.getFields = function () {
    return this.fields;
};

/**
 * Setter for mode.
 * @function
 * @param {FieldSort[]} newField - The new fields to sort on.
 */
SortFields.prototype.setFields = function (newFields) {
    this.fields = newFields;
};

/**
 * Add a new FieldsSort.
 * @function
 * @param {FieldsSort} newFieldSort - A new field to sort on.
 */
SortFields.prototype.addFieldSort = function (newFieldSort) {
    this.fields.push(newFieldSort);
};

/**
 * toJSON.
 * @function
 * @returns {string} - A JSON representation of the sort.
 */
SortFields.prototype.toJSON = function () {
    //"use strict";
    var sort = '"sort" : [ ';
    var index;

    for (index = 0; index < this.fields.length; ++index) {
        sort += this.fields[index].toJSON();
        if (index + 1 < this.fields.length) {
            sort += ',';
        }
    }
    sort += ']';

    return  sort;
};

if (test) {
    var fs1 = new FieldSort("dc_title", null, null);
    console.log(fs1.toJSON());
     var fs2 = new FieldSort("dc_title", "desc", null);
    console.log(fs2.toJSON());
     var fs3 = new FieldSort("dc_title", "asc", "avg");
    console.log(fs3.toJSON());  
}

/**
 * =============================================================================================
 */

/**
 * Size
 */

/**
 * Represents the size of search results requested.
 * @constructor
 * @param {number} size - The size of result set to return.
 */
function Size(size) {
    "use strict";
    this.size = size;
}

/**
 * Getter for size.
 * @function
 * @returns {number} size - The size of result set to return.
 */
Size.prototype.getSize = function () {
    return this.size;
};

/**
 * Setter for size.
 * @function
 * @param {number} newSize - The size of result set to return.
 */
Size.prototype.setSize = function (newSize) {
    this.size = newSize;
};

/**
 * toJSON.
 * @function
 * @returns {string} - A JSON representation of the query.
 */
Size.prototype.toJSON = function () {
    "use strict";
    var query = '"size" : ' + this.size;

    return  query;
};


/**
 * =============================================================================================
 */

/**
 * From
 */

/**
 * Represents the offest into the search results requested.
 * @constructor
 * @param {number} from - The offset into the result set to return.
 */
function From(from) {
    "use strict";
    this.from = from;
}

/**
 * Getter for from.
 * @function
 * @returns {number} from - The offest into the result set to return.
 */
From.prototype.getFrom = function () {
    return this.from;
};

/**
 * Setter for from.
 * @function
 * @param {number} newFrom - The offest into the result set to return.
 */
From.prototype.setFrom = function (newFrom) {
    this.from = newFrom;
};

/**
 * toJSON.
 * @function
 * @returns {string} - A JSON representation of the query.
 */
From.prototype.toJSON = function () {
    "use strict";
    var query = '"from" : ' + this.from;

    return  query;
};

/**
 * =============================================================================================
 */

/**
 * SearchQuery
 */

/**
 * Represents a full search query with filter, size, sort and aggregations.
 * @constructor
 * @param {SearchFields} fields - The fields to perform the search over.
 * @param {Query} query - The query constructed from the user entered query terms and the user selected facets.
 * @param {Size} size - The size of result set to return.
 * @param {SortFields} sort - The sorting criteria for the result set.
 * @param {Aggregation} aggs - The aggregations requested.
 * @param {Highlight} highlight - The fields to highlight in the result list.
 */
function SearchQuery(fields, query, size, sort, highlight, aggs) {
    "use strict";
    this.fields = fields;
    this.query = query;
    this.size = size;
    this.sort = sort;
    this.aggs = aggs;
    this.highlight = highlight;
}

//SearchQuery.prototype = Object.create(Query.prototype);

//SearchQuery.prototype.constructor = FilteredQuery;

/**
 * Getter for query.
 * @function
 * @returns {Query} query - The query constructed from the user entered query terms and the user selected facets.
 */
SearchQuery.prototype.getQuery = function () {
    return this.query;
};

/**
 * Setter for query.
 * @function
 * @param {Query} newQuery - The query constructed from the user entered query terms and the user selected facets.
 */
SearchQuery.prototype.setQuery = function (newQuery) {
    this.query = newQuery;
};

/**
 * Getter for size.
 * @function
 * @returns {Size} size - The size of result set to return.
 */
SearchQuery.prototype.getSize = function () {
    return this.size;
};

/**
 * Setter for size.
 * @function
 * @param {Size} newSize - The size of result set to return.
 */
SearchQuery.prototype.setSize = function (newSize) {
    this.size = newSize;
};

/**
 * Getter for sort.
 * @function
 * @returns {SortFields} sort - The size of result set to return.
 */
SearchQuery.prototype.getSort = function () {
    return this.sort;
};

/**
 * Setter for sort.
 * @function
 * @param {SortFields} newSort - The size of result set to return.
 */
SearchQuery.prototype.setSort = function (newSort) {
    this.sort = newSort;
};

/**
 * Getter for aggs.
 * @function
 * @returns {Aggregation} aggs - The size of result set to return.
 */
SearchQuery.prototype.getAggs = function () {
    return this.aggs;
};

/**
 * Setter for aggs.
 * @function
 * @param {Aggregation} newAggs - The size of result set to return.
 */
SearchQuery.prototype.setAggs = function (newAggs) {
    this.aggs = newAggs;
};

/**
 * toJSON.
 * @function
 * @returns {string} - A JSON representation of the query.
 */
SearchQuery.prototype.toJSON = function () {
    "use strict";
    var query = '{ ';

    query += this.query.toJSON();
    
    if (typeof(this.fields) !== "undefined" && this.fields !== null) {
        query += ',';
        query += this.fields.toJSON();
    }
    if (typeof(this.size) !== "undefined" && this.size !== null) {
        query += ',';
        query += this.size.toJSON();
    }
    if (typeof(this.sort) !== "undefined" && this.sort !== null) {
        query += ',';
        query += this.sort.toJSON();
    }
    if (typeof(this.highlight) !== "undefined" && this.highlight !== null) {
        query += ',';
        query += this.highlight.toJSON();
    }
    if (typeof(this.aggs) !== "undefined" && this.aggs !== null) {
        query += ',';
        query += this.aggs.toJSON();
    }
    query += '}';

    return  query;
};

if (test) {
    var filteredQ = new SearchQuery(filtersQuery, qsq);
    console.log(filteredQ.toJSON());
    var query = new Query(filteredQ.toJSON());
    console.log(query.toJSON());
}

/**
 * =============================================================================================
 */
