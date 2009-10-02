/*
 * jsaUnit module v0.1
 * http://github.com/quixote2030/jsaUnit

 * Copyright (c) 2009 Christopher Byrum
 * Released under the MIT license
 * http://github.com/quixote2030/jsaUnit/blob/master/LICENSE.txt
 */

/** 
The jsaUnit module contains functionality to assist in UNIT testing asynchronous JavaScript
@example
Sample:

//execute async call
jsaUnit.run(
    function () {
        jQuery.ajax({
            url: "/someApp/TestEndpoint",
            complete: function () {
                jsaUnit.callback("myKey", arguments);
            }
        });
    })
    .whenDone(function () {
        //code to kick off tests/test runner
    });

//unit test	
function testShouldDoSomething () {
    jsaUnit.test("myKey", function(xmlHttp, textStatus) {
        //run test assertions
    });
}
@class 
*/
var jsaUnit = function () {
	
	var _testArgs = {}; //contains arguments from async callback
	var _callbackFn = null; //fn to call when all async calls are complete
	var _testCnt = 0, _callbackCnt = 0;
	
	var _instance =
	/** @lends jsaUnit */
	{
		/**
		Executes all of the supplied async functions provided
		@param {Function} *fn	Variable number of function arguments
		@returns The jsaUnit instance
		*/
		run: function() {
			_testCnt = arguments.length;
			for(var i = 0; i < arguments.length; ++i) {
				arguments[i].apply(null, []);
			}
			return _instance;
		},
		
		/**
		Calls the supplied function when all async callbacks have been received
		@param {Function} fn	The callback function
		*/
		whenDone: function(fn) {
			_callbackFn = fn;
		},
		
		/**
		Registers the arguments supplied in the async callback under a key name
		to be retrieved later
		@param {String} key						The key name
		@param {Function::arguments} args		The arguments supplied in the async callback
		*/
		callback: function(key, args) {
			_testArgs[key] = args;
			_callbackCnt += 1;
			if(_callbackFn && _testCnt === _callbackCnt) {
				_callbackFn.apply(null, []);
			}
		},
		
		/**
		Executes the test function, and passes it the arguments from the
		callback registered under the supplied key
		@param {String} key		The key name which the callback arguments were registered under
		@param {Function} fn	The test function to execute
		*/
		test: function(key, fn) {
			fn.apply(null, _testArgs[key]);
		}

	};
	return _instance;
	
}();