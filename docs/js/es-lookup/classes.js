/**
	SearchField
 */
 
/**
 * Represents a search field that the user can select and can be specified in a query.
 * @constructor
 * @param {string} displayName - The text to display to user in a UI component.
 * @param {string} fieldName - The ES name of the property key to use in a query.
 */
function SearchField (displayName, fieldName) {
	this.displayName = displayName;
	this.fieldName = fieldName;
}

/**
 * Getter for displayName.
 * @function
 * @returns {string} displayName.
 */
SearchField.prototype.getDisplayName = function() {
	return this.displayName;
}

/**
 * Setter for displayName.
 * @function
 * @param {string} newDisplayName - The text to display to user in a UI component.
 */
SearchField.prototype.setDisplayName = function(newDisplayName) {
	this.displayName = newDisplayName;
}

/**
 * Getter for fieldName.
 * @function
 * @returns {string} fieldName.
 */
SearchField.prototype.getDisplayName = function() {
	return this.fieldName;
}

/**
 * Setter for fieldName.
 * @function
 * @param {string} newFieldName - The ES name of the property key to use in a query.
 */
SearchField.prototype.setFieldName = function(newFieldName) {
	this.fieldName = newFieldName;
}

/**
 * =============================================================================================
 */
 
 /**
  * ResultField
  */
  
/**
 * Represents a result field that the user can select and can be specified in a query.
 * @constructor
 * @augments SearchField
 * @param {string} displayName - The text to display to user in a UI component.
 * @param {string} fieldName - The ES name of the property key to use in a query.
 * @param {string} value - The current value of this field for the current query.
 */
function ResultField (displayName, fieldName, value) {
	SearchField.call(this,displayname, fieldName);
	
	this.value = value;
}

ResultField.prototype = Object.create(SearchField.prototype);

ResultField.prototype.constructor = ResultField;

/**
 * Getter for value.
 * @function
 * @returns {string} value - The current value of this field for the current query.
 */
ResultField.prototype.getValue = function() {
	return this.value;
}

/**
 * Setter for value.
 * @function
 * @param {string} newValue - The value of the result for the current query.
 */
ResultField.prototype.setvalue = function(newValue) {
	this.value = newValue;
}

/**
 * =============================================================================================
 */
 
/**
 * ResultScope
 */
 
/**
 * Represents the scope of the search results requested for the current query.
 * @constructor
 * @param {string} from - Defines the offset from the first result you want to fetch.
 * @param {string} size - Configures the maximum amount of hits to be returned.
 */
function ResultScope (from, size) {
	
	if (from >=0 ) {
		this.from = from
	} else {
		this.from = 0;
	}
	
	if (size >=1 ) {
		this.size = size
	} else {
		this.size = 1;
	}
}

//ResultScope.prototype.constructor = ResultScope;

/**
 * Getter for from.
 * @function
 * @returns {string} from - The current offset from the first result you want to fetch.
 */
ResultScope.prototype.getFrom = function () {
	return this.from;
}

/**
 * Setter for from.
 * @function
 * @param {string} newFrom - The current offset from the first result you want to fetch.
 */
ResultScope.prototype.setFrom = function (newFrom) {
	
	if (newFrom >=0 ) {
		this.from = newFrom
	} else {
		this.from = 0;
	}
}

/**
 * Getter for size.
 * @function
 * @returns {string} size - The current maximum amount of hits to be returned.
 */
ResultScope.prototype.getSize = function () {
	return this.size;
}

/**
 * Setter for size.
 * @function
 * @param {string} newSize - The new maximum amount of hits to be returned.
 */
ResultScope.prototype.setSize = function (newSize) {
	
	if (newSize >=0 ) {
		this.size = newSize
	} else {
		this.size = 10;
	}
}

/**
 * =============================================================================================
 */
 
/**
 * ResultPage
 */
 
/**
 * Represents a single page of the hits of the current query.
 * @constructor
 * @param {number} hits - The total number of hits.
 * @param {ResultScope} scope - The ResultScope used in the current query
 * @param {ResultField[]} fields - The results for this page.
 */
function ResultPage (hits, scope, fields) {

	if (hits >= 0) {
		this.hits = hits
	} else {
		this.hits = 0;
	}
	
	this.scope = scope;
	this.fields = fields;
	
	// todo add modulus stuff 
	hitsPerPage = hits / scope.size;
	pages = hits / hitsPerPage;
	pageOffset = scope.from / scope.size;
	
	this.pageNumber = pageOffset;
}

/**
 * =============================================================================================
 */
 
/**
 * SearchResults
 */
 
/**
 * Represents the hits of the current query.
 * @constructor
 * @param {number} hits - The total number of hits.
 * @param {ResultScope} scope - The ResultScope used in the current query.
 * @param {ResultPage[]} pages - The pages for this result.
 */
function SearchResults (hits, scope, pages) {

	if (hits >= 0) {
		this.hits = hits
	} else {
		this.hits = 0;
	}
	
	this.scope = scope;
	this.pages = pages;
}

 
function Aggregation (keyName, type) {
	this.keyName = keyName;
	this.type =	type;
	this.body = {};
	this.encapsulated = true;
	this.parent = null;
	this.children = [];
}

Aggregation.prototype.getBody = function() {
	return this.body;
}

Aggregation.prototype.setBody = function(newBody) {
	this.body = newBody;
}

function FilterAggregation (keyName, type, field, value) {
	Aggregation.call(keyName, type);
	
	this.field = field;
	this.value = value;
}

FilterAggregation.prototype = Object.create(Aggregation.prototype);

FilterAggregation.prototype.constructor = FilterAggregation;

FilterAggregation.prototype.getField = function () {
	return this.field;
}

FilterAggregation.prototype.setField = function (newField) {
	this.field = newField;
}

FilterAggregation.prototype.getValue = function () {
	return this.value;
}

FilterAggregation.prototype.setValue = function (newValue) {
	this.value = newValue;
}

var agg = new FilterAggregation("myAgg","term","date","2014-07-31");


