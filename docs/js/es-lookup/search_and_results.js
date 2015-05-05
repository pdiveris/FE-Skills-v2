/**
	QueryString
 */
 
/**
 * Represents a query string that the user has entered and can be specified in a query.
 * @constructor
 * @param {string} queryString - The text of the query.
 */
function QueryString (queryString) {
	this.queryString = queryString;
}

/**
 * Getter for queryString.
 * @function
 * @returns {string} queryString.
 */
QueryString.prototype.getQueryString = function() {
	return this.queryString;
};

/**
 * Setter for queryString.
 * @function
 * @param {string} newQueryString - The new text of the query.
 */
QueryString.prototype.setQueryString = function(newQueryString) {
	this.queryString = newQueryString;
};

/**
 * =============================================================================================
 */
 
/**
 * =============================================================================================
 */
/**
	Highlight
 */

/**
 * Represents a set of fields that search terms should be highlighted for if the search term matches.
 * @constructor
 * @param {string[]} preTags - The names of the HTML elements to use as the prefix highlight.
 * @param {string[]} postTags - The names of the HTML elements to use as the prefix highlight.
 * @param {string[]} fields - The names of the fields to highlight.
 */
function Highlight (preTags, postTags, fields) {
	this.preTags = preTags;
	this.postTags = postTags;
	this.fields = fields;
        
        if (this.preTags === null) {
            this.preTags = new Array("em");
        }
        if (this.postTags === null) {
            this.postTags = new Array("em");
        }
        if (this.fields === null) {
            this.fields = new Array("_all");
        }
}

/**
 * Getter for preTags.
 * @function
 * @returns {string[]} preTags.
 */
Highlight.prototype.getPreTags = function() {
	return this.preTags;
};

/**
 * Setter for preTags.
 * @function
 * @param {string[]} newPreTags - The tags to prefix a highlight.
 */
Highlight.prototype.setPreTags = function(newPreTags) {
	this.preTags = newPreTags;
};

/**
 * Getter for postTags.
 * @function
 * @returns {string[]} postTags.
 */
Highlight.prototype.getPostTags = function() {
	return this.postTags;
};

/**
 * Setter for postTags.
 * @function
 * @param {string[]} newPostTags - The tags to postfix a highlight.
 */
Highlight.prototype.setPostTags = function(newPostTags) {
	this.postTags = newPostTags;
};

/**
 * Getter for fields.
 * @function
 * @returns {string[]} fields.
 */
Highlight.prototype.getFields = function() {
	return this.fields;
};

/**
 * Setter for fields.
 * @function
 * @param {string[]} newFields - The field names to highlight.
 */
Highlight.prototype.setFields = function(newFields) {
	this.fields = newFields;
};

/**
 * toJSON.
 * @function
 * @returns {string} - A JSON representation of the highlight.
 */
Highlight.prototype.toJSON = function() {
	var json = '"highlight" : {';
	
        if (typeof(this.preTags) !== "undefined" && this.preTags !== null) {
            json += '"pre_tags" : [';
            for (index = 0; index < this.preTags.length; ++index) {
                    json += '"<' + this.preTags[index].toString() + '>"';
                    if (index + 1 < this.preTags.length) {
                            json += ',';
                    }
            }
            json += ']';
        }
        
        if (typeof(this.postTags) !== "undefined" && this.postTags !== null) {
            json += ', "post_tags" : [';
            for (index = 0; index < this.postTags.length; ++index) {
                    json += '"</' + this.postTags[index].toString() + '>"';
                    if (index + 1 < this.postTags.length) {
                            json += ',';
                    }
            }
            json += '], ';
        }
        
        if (typeof(this.fields) !== "undefined" && this.fields !== null) {
            json += '"fields" : {';
            for (index = 0; index < this.fields.length; ++index) {
                    json += '"' + this.fields[index].toString() + '" : {}';
                    //if (index + 1 < this.fields.length) {
                    //        json += ',';
                    //}
            }
            json += '}';
        }
	
	json += '}';

	return json;
};

/*if (test) {
	var f1 = new SearchField("Title","dc_title",3);
	var f2 = new SearchField("Publisher","dc_publisher",-1);
	console.log(f1.toJSON());
	console.log(f2.toJSON());
}*/

/**
 * =============================================================================================
 */

/**
 * =============================================================================================
 */
/**
	SearchField
 */
 
/**
 * Represents a search field that the user can select and can be specified in a query.
 * @constructor
 * @param {string} displayName - The text to display to user in a UI component.
 * @param {string} fieldName - The ES name of the property key to use in a query.
 * @param {number} boost - The boost factor use for this field when used in a query string query.
 */
function SearchField (displayName, fieldName, boost) {
	this.displayName = displayName;
	this.fieldName = fieldName;
	this.boost = boost;
}

/**
 * Getter for displayName.
 * @function
 * @returns {string} displayName.
 */
SearchField.prototype.getDisplayName = function() {
	return this.displayName;
};

/**
 * Setter for displayName.
 * @function
 * @param {string} newDisplayName - The text to display to user in a UI component.
 */
SearchField.prototype.setDisplayName = function(newDisplayName) {
	this.displayName = newDisplayName;
};

/**
 * Getter for fieldName.
 * @function
 * @returns {string} fieldName.
 */
SearchField.prototype.getFieldName = function() {
	return this.fieldName;
};

/**
 * Setter for fieldName.
 * @function
 * @param {string} newFieldName - The ES name of the property key to use in a query.
 */
SearchField.prototype.setFieldName = function(newFieldName) {
	this.fieldName = newFieldName;
};

/**
 * Getter for boost.
 * @function
 * @returns {number} boost.
 */
SearchField.prototype.getBoost = function() {
	return this.boost;
};

/**
 * Setter for boost.
 * @function
 * @param {number} newBoost - The boost factor for this field, -1 = no boost.
 */
SearchField.prototype.setBoost = function(newBoost) {
	this.boost = newBoost;
};

/**
 * toJSON.
 * @function
 * @returns {string} - A JSON representation of the search field.
 */
SearchField.prototype.toJSON = function() {
	var json = '"';
	
	json += this.getFieldName();
	
	if (this.boost !== -1) {
		json += "^" + this.boost;
	}
	
	json += '"';

	return json;
};



/**
 * =============================================================================================
 */
 
/**
 * =============================================================================================
 */
/**
	SearchFields
 */
 
/**
 * Represents a set of search fields that the user can select and can be specified ONLY in a query string query.
 * @constructor
 * @param {SearchField[]} fields - The text to display to user in a UI component.
 */
function SearchFields (fields) {
	this.fields = fields;
}

/**
 * Getter for fields.
 * @function
 * @returns {SearchField[]} fields.
 */
SearchFields.prototype.getFields = function() {
	return this.fields;
};

/**
 * Setter for fields.
 * @function
 * @param {SearchField[]} newFields - The new search fields.
 */
SearchFields.prototype.setFields = function(newFields) {
	this.fields = newFields;
};

/**
 * toJSON.
 * @function
 * @returns {string} - A JSON representation of the search fields.
 */
SearchFields.prototype.toJSON = function() {
	var json = ' "fields" : [';
	var index;
	
	for (index = 0; index < this.fields.length; ++index) {
		json += this.fields[index].toJSON();
		if (index + 1 < this.fields.length) {
			json += ',';
		}
	}
	
	json += ']';

	return json;
};

/**
 * =============================================================================================
 */
 
 /**
  * ResultField
  */
  
/**
 * Represents a single field of a result from the curent query.
 * @constructor
 * @param {string} displayName - The text to display to user in a UI component.
 * @param {string} fieldName - The ES name of the property key to use in a query.
 * @param {string} value - The current value of this field for the current query.
 */
function ResultField (displayName, fieldName, value) {
	//SearchField.call(this,displayName, fieldName);
	this.displayName = displayName;
        this.fieldName = fieldName;
	this.value = value;
}

//ResultField.prototype = Object.create(SearchField.prototype);

ResultField.prototype.constructor = ResultField;

/**
 * Getter for displayName.
 * @function
 * @returns {string} displayName.
 */
ResultField.prototype.getDisplayName = function() {
	return this.displayName;
};

/**
 * Setter for displayName.
 * @function
 * @param {string} newDisplayName - The text to display to user in a UI component.
 */
ResultField.prototype.setDisplayName = function(newDisplayName) {
	this.displayName = newDisplayName;
};

/**
 * Getter for fieldName.
 * @function
 * @returns {string} fieldName.
 */
ResultField.prototype.getFieldName = function() {
	return this.fieldName;
};

/**
 * Setter for fieldName.
 * @function
 * @param {string} newFieldName - The ES name of the property key to use in a query.
 */
ResultField.prototype.setFieldName = function(newFieldName) {
	this.fieldName = newFieldName;
};
/**
 * Getter for value.
 * @function
 * @returns {string} value - The current value of this field for the current query.
 */
ResultField.prototype.getValue = function() {
	return this.value;
};

/**
 * Setter for value.
 * @function
 * @param {string} newValue - The value of the result for the current query.
 */
ResultField.prototype.setvalue = function(newValue) {
	this.value = newValue;
};

/**
 * =============================================================================================
 */
 
 /**
 * =============================================================================================
 */
 
 /**
  * ResultRow
  */
  
/**
 * Represents a single field of a result from the curent query.
 * @constructor
 * @param {ResultField[]} fields - The result fields for this row.
 */
function ResultRow (fields) {
	
	this.fields = fields;
}

ResultRow.prototype.constructor = ResultRow;

/**
 * Getter for fields.
 * @function
 * @returns {ResultField[]} fields - The current value of the fields for the current query.
 */
ResultRow.prototype.getFields = function() {
	return this.fields;
};

/**
 * Setter for fields.
 * @function
 * @param {ResultField[]} newFields - The new value of the result fields for the current query.
 */
ResultRow.prototype.setFields = function(newFields) {
	this.fields = newFields;
};

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
		this.from = from;
	} else {
		this.from = 0;
	}
	
	if (size >=1 ) {
		this.size = size;
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
};

/**
 * Setter for from.
 * @function
 * @param {string} newFrom - The current offset from the first result you want to fetch.
 */
ResultScope.prototype.setFrom = function (newFrom) {
	
	if (newFrom >=0 ) {
		this.from = newFrom;
	} else {
		this.from = 0;
	}
};

/**
 * Getter for size.
 * @function
 * @returns {string} size - The current maximum amount of hits to be returned.
 */
ResultScope.prototype.getSize = function () {
	return this.size;
};

/**
 * Setter for size.
 * @function
 * @param {string} newSize - The new maximum amount of hits to be returned.
 */
ResultScope.prototype.setSize = function (newSize) {
	
	if (newSize >=0 ) {
		this.size = newSize;
	} else {
		this.size = 10;
	}
};

/**
 * =============================================================================================
 */
 
/**
 * ResultPage
 */
 
/**
 * Represents a single page of the hits of the current query.
 * @constructor
 * @param {bool} current - Whether this is the current page or not.
 * @param {number} size - Configures the number of results per page.
 * @param {ResultScope} scope - The ResultScope used in the current query.
 * @param {ResultRow[]} rows - The results for this page.
 */
function ResultPage (size, current, scope, rows) {

        if (size >=0 ) {
		this.pageSize = size;
	} else {
		this.pageSize = 10; // default - should be in a config
	}
        this.currentPage = current;
	this.scope = scope;
	this.rows = rows;
	
	// todo add modulus stuff 
	//hitsPerPage = hits / scope.size;
	//pages = hits / hitsPerPage;
	//pageOffset = scope.from / scope.size;
	
	//this.pageNumber = pageOffset;
}

/**
 * Getter for current.
 * @function
 * @returns {bool} current - Whether this is the current page or not.
 */
ResultPage.prototype.getCurrent = function () {
	return this.currentPage;
};

/**
 * Setter for current.
 * @function
 * @param {bool} newCurrent - Set whether this is the current page or not.
 */
ResultPage.prototype.setCurrent = function (newCurrent) {
	
	this.currentPage = newCurrent;
};

/**
 * Getter for pageSize.
 * @function
 * @returns {number} size - The current maximum amount of hits to be returned.
 */
ResultPage.prototype.getSize = function () {
	return this.pageSize;
};

/**
 * Setter for pageSize.
 * @function
 * @param {number} newSize - The new maximum amount of hits to be returned.
 */
ResultPage.prototype.setSize = function (newSize) {
	
	if (newSize >=0 ) {
		this.pageSize = newSize;
	} else {
		this.pageSize = 10; // default - should be in a config
	}
};

/**
 * =============================================================================================
 */
 
 /**
 * =============================================================================================
 */

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
		this.hits = hits;
	} else {
		this.hits = 0;
	}
	
	this.scope = scope;
        if (pages === null) {
            this.pages = new Array();
            this.currentPage = null;
        } else {
            this.pages = pages;
            this.currentPage = pages[0];
        }
        
}

/**
 * Getter for current.
 * @function
 * @returns {ResultPage} current - Get the current page.
 */
SearchResults.prototype.getCurrent = function () {
	return this.currentPage;
};

/**
 * Setter for current.
 * @function
 * @param {ResultPage} newCurrent - Set the current page.
 */
SearchResults.prototype.setCurrent = function (newCurrent) {
	
	this.currentPage = newCurrent;
};

/**
 * Add a new result page.
 * @function
 * @param {ResultPage} newPage - New page to add.
 */
SearchResults.prototype.addPage = function (newPage) {
	
	this.pages.push(newPage);
};

/**
 * =============================================================================================
 */