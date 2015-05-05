/**
 * Aggregation
 */

/**
 * Represents an aggregation of terms or aggregations in the current query.
 * @constructor
 * @param {string} keyName - The name of the key that will be used to access the aggregation in the search result.
 * @param {string} type - The type of aggregation.
 * @param {string} body - The body of the aggregation.
 */

function Aggregation(keyName, type, body) {
    "use strict";
    this.keyName = keyName;
    this.type = type;
    this.body = body;
    this.encapsulated = true;
    this.parent = null;
    this.subAgg = null;
}

/**
 * Getter for body.
 * @function
 * @returns {string} body - The body.
 */
Aggregation.prototype.getBody = function() {
    return this.body;
};

/**
 * Setter for body.
 * @function
 * @param {string} newBody - The new body.
 */
Aggregation.prototype.setBody = function(newBody) {
    this.body = newBody;
};

Aggregation.prototype.getParent = function() {
    return this.parent;
};

Aggregation.prototype.setParent = function(newParent) {
    this.parent = newParent;
};

Aggregation.prototype.getSubAgg = function() {
    return this.subAgg;
};

/**
 * Set the sub aggregation.
 * @function
 * @param {Aggregation} newSubAgg - The child aggregation.
 */

Aggregation.prototype.setSubAgg = function(newSubAgg) {
    newSubAgg.setParent(this);
    this.subAgg = newSubAgg;
};

Aggregation.prototype.toJSON = function() {
    "use strict";
    var index;
    
    var agg = '';
    
    if (debug) {
        agg = '"' + this.keyName + '" : [START AGG]{';
    } else {
        agg = '"' + this.keyName + '" : {';
    }

    if (debug) {
        agg += '"' + this.type + '" : [START BODY]{';
    } else {
        agg += '"' + this.type + '" : {';
    }
    
    agg += this.body;
    
    if (debug) {
        agg += ' }[END BODY]';
    } else {
        agg += ' }';
    }
    
    if (typeof(this.subAgg) !== "undefined" && this.subAgg !== null) {
        if (debug) {
            agg += ', "aggs" : {' + this.subAgg.toJSON() + ' }';
        } else {
            agg += ', "aggs" : {' + this.subAgg.toJSON() + ' }';
        }
    }
    
    
    
    if (debug) {
        agg += ' }[END AGG]';
    } else {
        agg += ' }';
    }

    return agg;
};

/*"aggs" : {
 "communities" : {
 "terms" : {
 "field" : "jmd_community.exact"
 }
 }
 }*/

//var body = '';

//var agg = new Aggregation("communities","terms",'"field" : "jmd_community.exact"');

//console.log(agg.toJSON());
/**
 * =============================================================================================
 */

/**
 * Aggregations
 */
 
/**
 * Represents an aggregation in the current query.
 * @constructor
 */
 
function Aggregations() {
    "use strict";
    this.encapsulated = true;
    this.parent = null;
    this.aggs = new Array();
}

Aggregations.prototype.getAggs = function () {
    return this.aggs;
};

Aggregations.prototype.setAggs = function (newAggs) {
    this.aggs = newAggs;
};

Aggregations.prototype.addAgg = function (newAgg) {
    this.aggs.push(newAgg);
    newAgg.setParent(this);
};

Aggregations.prototype.toJSON = function () {
    "use strict";
    var index;
    var aggsStr = '"aggs" : {';
    
    //alert(this.aggs.length);
    for (index = 0; index < this.aggs.length; ++index) {
        aggsStr += this.aggs[index].toJSON();
        
        if (index + 1 < this.aggs.length) {
            aggsStr += ',';
        }
    }
    
    aggsStr += ' }';
    
    return aggsStr;
};

/*"aggs" : {
        "communities" : {
            "terms" : {
                "field" : "jmd_community.exact"
            }
        }
    }*/ 
    
    if (testAggs) {
        var agg1 = new Aggregation("communities","terms",'"field" : "jmd_community.exact"');
        var agg2 = new Aggregation("publishers","terms",'"field" : "dc_publisher"');
        var aggs = new Aggregations();
        aggs.addAgg(agg1);
        aggs.addAgg(agg2);
        console.log(aggs.toJSON());
    }
/**
 * =============================================================================================
 */

/**
 * TermsAggregation
 */

/**
 * Represents an aggregation of terms or aggregations in the current query.
 * @constructor
 * @augments Aggregation
 * @param {string} keyName - The name of the key that will be used to access the aggregation in the search result.
 * @param {string} field - The name of the field to aggregate over.
 */

function TermsAggregation(keyName, field) {
    "use strict";
    var body = '"field" : "' + field + '"';
    Aggregation.call(this, keyName, "terms", body);
    this.field = field;
}

TermsAggregation.prototype = Object.create(Aggregation.prototype);

TermsAggregation.prototype.constructor = TermsAggregation;

/**
 * toJSON.
 * @function
 * @returns {string} - A JSON representation of the query.
 */
TermsAggregation.prototype.toJSON = function() {
    "use strict";
    return Aggregation.prototype.toJSON.call(this);
    
};

if (testAggs) {
    //var ta = new TermsAggregation("communites", "jmd_community.exact");
    
    //var x;
    //console.log(ta.toJSON());
}

/**
 * =============================================================================================
 */

/**
 * FilterAggregation
 */

/**
 * Defines a single bucket of all the documents in the current document set context that match a specified filter.
 * @constructor
 * @augments Aggregation
 * @param {string} keyName - The name of the key that will be used to access the aggregation in the search result.
 * @param {string} filter - The body of the filter.
 */
function FilterAggregation(keyName, filter) {
    "use strict";
    Aggregation.call(this,keyName, "filter", null);

    this.filter = filter;
}

FilterAggregation.prototype = Object.create(Aggregation.prototype);

FilterAggregation.prototype.constructor = FilterAggregation;

/**
 * Getter for filter.
 * @function
 * @returns {string} filter - The filter body.
 */
FilterAggregation.prototype.getFilter = function() {
    return this.filter;
};

/**
 * Setter for filter.
 * @function
 * @param {string} newFilter - The new body for the filter.
 */
FilterAggregation.prototype.setFilter = function(newFilter) {
    this.filter = newFilter;
};

/**
 * toJSON.
 * @function
 * @returns {string} - A JSON representation of the query.
 */
FilterAggregation.prototype.toJSON = function() {
    "use strict";
    
    this.setBody(this.filter);
    return Aggregation.prototype.toJSON.call(this);
};
/*
 
 "filter": {
 "term": {
 "event_type": "download"
 }
 }
 */
if (testAggs) {
    var oer_filter = new TermQuery("jmd_oer", "true");
    console.log(oer_filter.toJSON());
    //var agg = new FilterAggregation("myAgg", '"term": {"event_type": "download"})');
    var filterAgg = new FilterAggregation("myAgg", oer_filter.toJSON());

    console.log(filterAgg.toJSON());
    var filterAggs = new Aggregations();
    filterAggs.addAgg(filterAgg);
    console.log(filterAggs.toJSON());
}

/**
 * =============================================================================================
 */

/**
 * Range
 */

/**
 * Defines a range between value.
 * Note that this aggregration includes the from value and excludes the to value for each range.
 * @constructor
 * @param {string} from - The start of the range.
 * @param {string} to - The end of the range.
 * @param {string} quoteValue - If true surround value with double quotes.
 */
function Range(from, to, quoteValue) {
    "use strict";

    this.from = from;
    this.to= to;
    this.quoteValue = quoteValue;
}

/**
 * Getter for from.
 * @function
 * @returns {string} from - The start of the range.
 */
Range.prototype.getFrom = function () {
    return this.from;
};

/**
 * Setter for from.
 * @function
 * @param {string} newFrom - The new start of the range.
 */
Range.prototype.setFrom = function (newFrom) {
    this.from = newFrom;
};

/**
 * Getter for to.
 * @function
 * @returns {string} to - The end of the range.
 */
Range.prototype.getTo = function () {
    return this.to;
};

/**
 * Setter for to.
 * @function
 * @param {string} newTo - The new end of the range.
 */
Range.prototype.setTo = function (newTo) {
    this.to = newTo;
};

/**
 * toJSON.
 * @function
 * @returns {string} - A JSON representation of the range.
 */
Range.prototype.toJSON = function() {
    "use strict";
    
    var range = "{";
    
    if (typeof(this.from) !== "undefined" && this.from !== null) {
        if (this.quoteValue) {
            range += '"from" : "' + this.from + '"';
        } else {
            range += '"from" : ' + this.from;
        }
    }
    if (typeof(this.to) !== "undefined" && this.to !== null) {
        if (typeof(this.from) !== "undefined" && this.from !== null) {
            range += ", ";
        }
        if (this.quoteValue) {
            range += '"to" : "' + this.to + '"';
        } else {
            range += '"to" : ' + this.to;
        }
    }
    range += "}";
    
    return range;
};

if (testAggs) {
    var range1 = new Range("0","50",false);
    var range2 = new Range("100",null,false);
    var range3 = new Range(null,"150",false);
    console.log(range1.toJSON());
    console.log(range2.toJSON());
    console.log(range3.toJSON());
    
}
/**
 * =============================================================================================
 */

/**
 * RangeAggregation
 */

/**
 * Defines a single bucket of all the documents in the current document set context that match a specified range.
 * @constructor
 * @augments Aggregation
 * @param {string} keyName - The name of the key that will be used to access the aggregation in the search result.
 * @param {string} field - The name of the field to apply the range to.
 * @param {string} type - The type of range aggregation.
 * @param {Range[]} ranges - The ranges.
 */
function RangeAggregation(keyName, field, type, ranges) {
    "use strict";
    Aggregation.call(this,keyName, type, null);

    this.field = field;
    this.ranges = ranges;
}

RangeAggregation.prototype = Object.create(Aggregation.prototype);

RangeAggregation.prototype.constructor = RangeAggregation;

/**
 * Getter for field.
 * @function
 * @returns {string} field - The name of the field to apply the range to.
 */
RangeAggregation.prototype.getField = function () {
    return this.field;
};

/**
 * Setter for field.
 * @function
 * @param {string} newField - The new name of the field to apply the range to.
 */
RangeAggregation.prototype.setField = function (newField) {
    this.field = newField;
};

/**
 * Getter for ranges.
 * @function
 * @returns {Range[]} ranges - The ranges.
 */
RangeAggregation.prototype.getRanges = function () {
    return this.ranges;
};

/**
 * Setter for ranges.
 * @function
 * @param {Range[]} newRanges - The new ranges.
 */
RangeAggregation.prototype.setRanges = function (newRanges) {
    this.ranges = newRanges;
};

/**
 * Add a new range.
 * @function
 * @param {Range} newRange - A new range.
 */
RangeAggregation.prototype.addRange = function(newRange) {
    this.ranges.push(newRange);
};

/**
 * toJSON.
 * @function
 * @returns {string} - A JSON representation of the range aggregation.
 */
RangeAggregation.prototype.toJSON = function() {
    "use strict";
    
    var index;
    var body = '"field" : "' + this.field + '",';
            
    body += '"ranges" : [';

    for (index = 0; index < this.ranges.length; ++index) {
        body += this.ranges[index].toJSON();
        if (index + 1 < this.ranges.length) {
            body += ',';
        }
    }

    body += ' ]';

    this.setBody(body);
    return Aggregation.prototype.toJSON.call(this);
};

if (testAggs) {
    var ranges = new Array(range1,range2);
    var rangeAgg = new RangeAggregation("myRange","time","range",ranges);
    
    
    console.log(rangeAgg.toJSON());
    rangeAgg.addRange(range3);
    console.log(rangeAgg.toJSON());
}

/**
 * =============================================================================================
 */

/**
 * DateRangeAggregation
 */

/**
 * Defines a single bucket of all the documents in the current document set context that match a specified range.
 * @constructor
 * @augments RangeAggregation
 * @param {string} keyName - The name of the key that will be used to access the aggregation in the search result.
 * @param {string} type - The type of range aggregation.
 * @param {Range[]} ranges - The ranges.
 */
function DateRangeAggregation(keyName, field, ranges) {
    "use strict";
    RangeAggregation.call(this,keyName, field, "date_range", ranges);
}

DateRangeAggregation.prototype = Object.create(RangeAggregation.prototype);

DateRangeAggregation.prototype.constructor = DateRangeAggregation;

/**
 * toJSON.
 * @function
 * @returns {string} - A JSON representation of the range aggregation.
 */
DateRangeAggregation.prototype.toJSON = function() {
    "use strict";
    
    return RangeAggregation.prototype.toJSON.call(this);
};

if (testAggs) {
    var dateRange = new Range("2014-01-01","2014-08-30",true);
    var dateRanges = new Array(dateRange);
    var dateRangeAgg = new DateRangeAggregation("downloads","time",dateRanges);
    console.log(dateRangeAgg.toJSON());
}
/**
 * =============================================================================================
 */

/**
 * DateHistogramAggregation
 */

/**
 * Defines a number of buckets container the documents in the current document set context, one bucket per interval.
 * @constructor
 * @augments Aggregation
 * @param {string} keyName - The name of the key that will be used to access the aggregation in the search result.
 * @param {string} field - The name of the field to apply the histogram to.
 * @param {string} interval - The interval with which to split the buckets by.
 * @param {string} format - The format to use for the date/time stamp returned.
 */
function DateHistogramAggregation(keyName, field, interval, format) {
    "use strict";
    Aggregation.call(this,keyName, "date_histogram", null);

    this.field = field;
    this.interval = interval;
    this.format = format;
}

DateHistogramAggregation.prototype = Object.create(Aggregation.prototype);

DateHistogramAggregation.prototype.constructor = DateHistogramAggregation;

/**
 * Getter for field.
 * @function
 * @returns {string} field - The name of the field to apply the range to.
 */
DateHistogramAggregation.prototype.getField = function () {
    return this.field;
};

/**
 * Setter for field.
 * @function
 * @param {string} newField - The new name of the field to apply the range to.
 */
DateHistogramAggregation.prototype.setField = function (newField) {
    this.field = newField;
};

/**
 * Getter for interval.
 * @function
 * @returns {string} interval - The interval.
 */
DateHistogramAggregation.prototype.getInterval = function () {
    return this.interval;
};

/**
 * Setter for interval.
 * @function
 * @param {string} newInterval - The new interval.
 */
DateHistogramAggregation.prototype.setInterval = function (newInterval) {
    this.interval = newInterval;
};

/**
 * Getter for format.
 * @function
 * @returns {string} format - The format.
 */
DateHistogramAggregation.prototype.getFormat = function () {
    return this.format;
};

/**
 * Setter for format.
 * @function
 * @param {string} newFormat - The new format.
 */
DateHistogramAggregation.prototype.setFormat = function (newFormat) {
    this.format = newFormat;
};

/**
 * toJSON.
 * @function
 * @returns {string} - A JSON representation of the range aggregation.
 */
DateHistogramAggregation.prototype.toJSON = function() {
    "use strict";
    
    var body = '"field" : "' + this.field + '",';
    body += ' "interval" : "' + this.interval + '", ';
    body += ' "format" : "' + this.format + '"';

    this.setBody(body);
    return Aggregation.prototype.toJSON.call(this);
};

if (testAggs) {
    var histoAgg = new DateHistogramAggregation("downloads_over_time","time","month","dd-MM-YYYY");
    
    console.log(histoAgg.toJSON());
    var histoAggs = new Aggregations();
    histoAggs.addAgg(histoAgg);
    console.log(histoAggs.toJSON());
    
}

/**
 * =============================================================================================
 */
