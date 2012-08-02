/*!
 * jQuery JavaScript Library v1.7.2
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Wed Mar 21 12:46:34 2012 -0700
 */

(function( window, undefined ) {

// Use the correct document accordingly with window argument (sandbox)
var document = window.document,
	navigator = window.navigator,
	location = window.location;
var jQuery = (function() {

// Define a local copy of jQuery
var jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// A simple way to check for HTML strings or ID strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

	// Check if a string has a non-whitespace character in it
	rnotwhite = /\S/,

	// Used for trimming whitespace
	trimLeft = /^\s+/,
	trimRight = /\s+$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

	// Useragent RegExp
	rwebkit = /(webkit)[ \/]([\w.]+)/,
	ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
	rmsie = /(msie) ([\w.]+)/,
	rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

	// Matches dashed string for camelizing
	rdashAlpha = /-([a-z]|[0-9])/ig,
	rmsPrefix = /^-ms-/,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return ( letter + "" ).toUpperCase();
	},

	// Keep a UserAgent string for use with jQuery.browser
	userAgent = navigator.userAgent,

	// For matching the engine and version of the browser
	browserMatch,

	// The deferred used on DOM ready
	readyList,

	// The ready event handler
	DOMContentLoaded,

	// Save a reference to some core methods
	toString = Object.prototype.toString,
	hasOwn = Object.prototype.hasOwnProperty,
	push = Array.prototype.push,
	slice = Array.prototype.slice,
	trim = String.prototype.trim,
	indexOf = Array.prototype.indexOf,

	// [[Class]] -> type pairs
	class2type = {};

jQuery.fn = jQuery.prototype = {
	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), or $(undefined)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}

		// The body element only exists once, optimize finding it
		if ( selector === "body" && !context && document.body ) {
			this.context = document;
			this[0] = document.body;
			this.selector = selector;
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			// Are we dealing with HTML string or an ID?
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = quickExpr.exec( selector );
			}

			// Verify a match, and that no context was specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;
					doc = ( context ? context.ownerDocument || context : document );

					// If a single string is passed in and it's a single tag
					// just do a createElement and skip the rest
					ret = rsingleTag.exec( selector );

					if ( ret ) {
						if ( jQuery.isPlainObject( context ) ) {
							selector = [ document.createElement( ret[1] ) ];
							jQuery.fn.attr.call( selector, context, true );

						} else {
							selector = [ doc.createElement( ret[1] ) ];
						}

					} else {
						ret = jQuery.buildFragment( [ match[1] ], [ doc ] );
						selector = ( ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment ).childNodes;
					}

					return jQuery.merge( this, selector );

				// HANDLE: $("#id")
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.7.2",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return slice.call( this, 0 );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {
		// Build a new jQuery matched element set
		var ret = this.constructor();

		if ( jQuery.isArray( elems ) ) {
			push.apply( ret, elems );

		} else {
			jQuery.merge( ret, elems );
		}

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + ( this.selector ? " " : "" ) + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Attach the listeners
		jQuery.bindReady();

		// Add the callback
		readyList.add( fn );

		return this;
	},

	eq: function( i ) {
		i = +i;
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ),
			"slice", slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {
		// Either a released hold or an DOMready/load event and not yet ready
		if ( (wait === true && !--jQuery.readyWait) || (wait !== true && !jQuery.isReady) ) {
			// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
			if ( !document.body ) {
				return setTimeout( jQuery.ready, 1 );
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}

			// If there are functions bound, to execute
			readyList.fireWith( document, [ jQuery ] );

			// Trigger any bound ready events
			if ( jQuery.fn.trigger ) {
				jQuery( document ).trigger( "ready" ).off( "ready" );
			}
		}
	},

	bindReady: function() {
		if ( readyList ) {
			return;
		}

		readyList = jQuery.Callbacks( "once memory" );

		// Catch cases where $(document).ready() is called after the
		// browser event has already occurred.
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			return setTimeout( jQuery.ready, 1 );
		}

		// Mozilla, Opera and webkit nightlies currently support this event
		if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );

		// If IE event model is used
		} else if ( document.attachEvent ) {
			// ensure firing before onload,
			// maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", DOMContentLoaded );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", jQuery.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var toplevel = false;

			try {
				toplevel = window.frameElement == null;
			} catch(e) {}

			if ( document.documentElement.doScroll && toplevel ) {
				doScrollCheck();
			}
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ toString.call(obj) ] || "object";
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!hasOwn.call(obj, "constructor") &&
				!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		for ( var name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	parseJSON: function( data ) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = jQuery.trim( data );

		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( rvalidchars.test( data.replace( rvalidescape, "@" )
			.replace( rvalidtokens, "]" )
			.replace( rvalidbraces, "")) ) {

			return ( new Function( "return " + data ) )();

		}
		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}
		var xml, tmp;
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && rnotwhite.test( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
	},

	// args is for internal usage only
	each: function( object, callback, args ) {
		var name, i = 0,
			length = object.length,
			isObj = length === undefined || jQuery.isFunction( object );

		if ( args ) {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.apply( object[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( object[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.call( object[ i ], i, object[ i++ ] ) === false ) {
						break;
					}
				}
			}
		}

		return object;
	},

	// Use native String.trim function wherever possible
	trim: trim ?
		function( text ) {
			return text == null ?
				"" :
				trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
		},

	// results is for internal usage only
	makeArray: function( array, results ) {
		var ret = results || [];

		if ( array != null ) {
			// The window, strings (and functions) also have 'length'
			// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
			var type = jQuery.type( array );

			if ( array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( array ) ) {
				push.call( ret, array );
			} else {
				jQuery.merge( ret, array );
			}
		}

		return ret;
	},

	inArray: function( elem, array, i ) {
		var len;

		if ( array ) {
			if ( indexOf ) {
				return indexOf.call( array, elem, i );
			}

			len = array.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in array && array[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var i = first.length,
			j = 0;

		if ( typeof second.length === "number" ) {
			for ( var l = second.length; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}

		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var ret = [], retVal;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value, key, ret = [],
			i = 0,
			length = elems.length,
			// jquery objects are treated as arrays
			isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( key in elems ) {
				value = callback( elems[ key ], key, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return ret.concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		if ( typeof context === "string" ) {
			var tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		var args = slice.call( arguments, 2 ),
			proxy = function() {
				return fn.apply( context, args.concat( slice.call( arguments ) ) );
			};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;

		return proxy;
	},

	// Mutifunctional method to get and set values to a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, pass ) {
		var exec,
			bulk = key == null,
			i = 0,
			length = elems.length;

		// Sets many values
		if ( key && typeof key === "object" ) {
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], 1, emptyGet, value );
			}
			chainable = 1;

		// Sets one value
		} else if ( value !== undefined ) {
			// Optionally, function values get executed if exec is true
			exec = pass === undefined && jQuery.isFunction( value );

			if ( bulk ) {
				// Bulk operations only iterate when executing function values
				if ( exec ) {
					exec = fn;
					fn = function( elem, key, value ) {
						return exec.call( jQuery( elem ), value );
					};

				// Otherwise they run against the entire set
				} else {
					fn.call( elems, value );
					fn = null;
				}
			}

			if ( fn ) {
				for (; i < length; i++ ) {
					fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
				}
			}

			chainable = 1;
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// Use of jQuery.browser is frowned upon.
	// More details: http://docs.jquery.com/Utilities/jQuery.browser
	uaMatch: function( ua ) {
		ua = ua.toLowerCase();

		var match = rwebkit.exec( ua ) ||
			ropera.exec( ua ) ||
			rmsie.exec( ua ) ||
			ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
			[];

		return { browser: match[1] || "", version: match[2] || "0" };
	},

	sub: function() {
		function jQuerySub( selector, context ) {
			return new jQuerySub.fn.init( selector, context );
		}
		jQuery.extend( true, jQuerySub, this );
		jQuerySub.superclass = this;
		jQuerySub.fn = jQuerySub.prototype = this();
		jQuerySub.fn.constructor = jQuerySub;
		jQuerySub.sub = this.sub;
		jQuerySub.fn.init = function init( selector, context ) {
			if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
				context = jQuerySub( context );
			}

			return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
		};
		jQuerySub.fn.init.prototype = jQuerySub.fn;
		var rootjQuerySub = jQuerySub(document);
		return jQuerySub;
	},

	browser: {}
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

browserMatch = jQuery.uaMatch( userAgent );
if ( browserMatch.browser ) {
	jQuery.browser[ browserMatch.browser ] = true;
	jQuery.browser.version = browserMatch.version;
}

// Deprecated, use jQuery.browser.webkit instead
if ( jQuery.browser.webkit ) {
	jQuery.browser.safari = true;
}

// IE doesn't match non-breaking spaces with \s
if ( rnotwhite.test( "\xA0" ) ) {
	trimLeft = /^[\s\xA0]+/;
	trimRight = /[\s\xA0]+$/;
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);

// Cleanup functions for the document ready method
if ( document.addEventListener ) {
	DOMContentLoaded = function() {
		document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
		jQuery.ready();
	};

} else if ( document.attachEvent ) {
	DOMContentLoaded = function() {
		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( document.readyState === "complete" ) {
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	};
}

// The DOM ready check for Internet Explorer
function doScrollCheck() {
	if ( jQuery.isReady ) {
		return;
	}

	try {
		// If IE is used, use the trick by Diego Perini
		// http://javascript.nwbox.com/IEContentLoaded/
		document.documentElement.doScroll("left");
	} catch(e) {
		setTimeout( doScrollCheck, 1 );
		return;
	}

	// and execute any waiting functions
	jQuery.ready();
}

return jQuery;

})();


// String to Object flags format cache
var flagsCache = {};

// Convert String-formatted flags into Object-formatted ones and store in cache
function createFlags( flags ) {
	var object = flagsCache[ flags ] = {},
		i, length;
	flags = flags.split( /\s+/ );
	for ( i = 0, length = flags.length; i < length; i++ ) {
		object[ flags[i] ] = true;
	}
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	flags:	an optional list of space-separated flags that will change how
 *			the callback list behaves
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible flags:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( flags ) {

	// Convert flags from String-formatted to Object-formatted
	// (we check in cache first)
	flags = flags ? ( flagsCache[ flags ] || createFlags( flags ) ) : {};

	var // Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = [],
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Add one or several callbacks to the list
		add = function( args ) {
			var i,
				length,
				elem,
				type,
				actual;
			for ( i = 0, length = args.length; i < length; i++ ) {
				elem = args[ i ];
				type = jQuery.type( elem );
				if ( type === "array" ) {
					// Inspect recursively
					add( elem );
				} else if ( type === "function" ) {
					// Add if not in unique mode and callback is not in
					if ( !flags.unique || !self.has( elem ) ) {
						list.push( elem );
					}
				}
			}
		},
		// Fire callbacks
		fire = function( context, args ) {
			args = args || [];
			memory = !flags.memory || [ context, args ];
			fired = true;
			firing = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( context, args ) === false && flags.stopOnFalse ) {
					memory = true; // Mark as halted
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( !flags.once ) {
					if ( stack && stack.length ) {
						memory = stack.shift();
						self.fireWith( memory[ 0 ], memory[ 1 ] );
					}
				} else if ( memory === true ) {
					self.disable();
				} else {
					list = [];
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					var length = list.length;
					add( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away, unless previous
					// firing was halted (stopOnFalse)
					} else if ( memory && memory !== true ) {
						firingStart = length;
						fire( memory[ 0 ], memory[ 1 ] );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					var args = arguments,
						argIndex = 0,
						argLength = args.length;
					for ( ; argIndex < argLength ; argIndex++ ) {
						for ( var i = 0; i < list.length; i++ ) {
							if ( args[ argIndex ] === list[ i ] ) {
								// Handle firingIndex and firingLength
								if ( firing ) {
									if ( i <= firingLength ) {
										firingLength--;
										if ( i <= firingIndex ) {
											firingIndex--;
										}
									}
								}
								// Remove the element
								list.splice( i--, 1 );
								// If we have some unicity property then
								// we only need to do this once
								if ( flags.unique ) {
									break;
								}
							}
						}
					}
				}
				return this;
			},
			// Control if a given callback is in the list
			has: function( fn ) {
				if ( list ) {
					var i = 0,
						length = list.length;
					for ( ; i < length; i++ ) {
						if ( fn === list[ i ] ) {
							return true;
						}
					}
				}
				return false;
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory || memory === true ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( stack ) {
					if ( firing ) {
						if ( !flags.once ) {
							stack.push( [ context, args ] );
						}
					} else if ( !( flags.once && memory ) ) {
						fire( context, args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};




var // Static reference to slice
	sliceDeferred = [].slice;

jQuery.extend({

	Deferred: function( func ) {
		var doneList = jQuery.Callbacks( "once memory" ),
			failList = jQuery.Callbacks( "once memory" ),
			progressList = jQuery.Callbacks( "memory" ),
			state = "pending",
			lists = {
				resolve: doneList,
				reject: failList,
				notify: progressList
			},
			promise = {
				done: doneList.add,
				fail: failList.add,
				progress: progressList.add,

				state: function() {
					return state;
				},

				// Deprecated
				isResolved: doneList.fired,
				isRejected: failList.fired,

				then: function( doneCallbacks, failCallbacks, progressCallbacks ) {
					deferred.done( doneCallbacks ).fail( failCallbacks ).progress( progressCallbacks );
					return this;
				},
				always: function() {
					deferred.done.apply( deferred, arguments ).fail.apply( deferred, arguments );
					return this;
				},
				pipe: function( fnDone, fnFail, fnProgress ) {
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( {
							done: [ fnDone, "resolve" ],
							fail: [ fnFail, "reject" ],
							progress: [ fnProgress, "notify" ]
						}, function( handler, data ) {
							var fn = data[ 0 ],
								action = data[ 1 ],
								returned;
							if ( jQuery.isFunction( fn ) ) {
								deferred[ handler ](function() {
									returned = fn.apply( this, arguments );
									if ( returned && jQuery.isFunction( returned.promise ) ) {
										returned.promise().then( newDefer.resolve, newDefer.reject, newDefer.notify );
									} else {
										newDefer[ action + "With" ]( this === deferred ? newDefer : this, [ returned ] );
									}
								});
							} else {
								deferred[ handler ]( newDefer[ action ] );
							}
						});
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					if ( obj == null ) {
						obj = promise;
					} else {
						for ( var key in promise ) {
							obj[ key ] = promise[ key ];
						}
					}
					return obj;
				}
			},
			deferred = promise.promise({}),
			key;

		for ( key in lists ) {
			deferred[ key ] = lists[ key ].fire;
			deferred[ key + "With" ] = lists[ key ].fireWith;
		}

		// Handle state
		deferred.done( function() {
			state = "resolved";
		}, failList.disable, progressList.lock ).fail( function() {
			state = "rejected";
		}, doneList.disable, progressList.lock );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( firstParam ) {
		var args = sliceDeferred.call( arguments, 0 ),
			i = 0,
			length = args.length,
			pValues = new Array( length ),
			count = length,
			pCount = length,
			deferred = length <= 1 && firstParam && jQuery.isFunction( firstParam.promise ) ?
				firstParam :
				jQuery.Deferred(),
			promise = deferred.promise();
		function resolveFunc( i ) {
			return function( value ) {
				args[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				if ( !( --count ) ) {
					deferred.resolveWith( deferred, args );
				}
			};
		}
		function progressFunc( i ) {
			return function( value ) {
				pValues[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				deferred.notifyWith( promise, pValues );
			};
		}
		if ( length > 1 ) {
			for ( ; i < length; i++ ) {
				if ( args[ i ] && args[ i ].promise && jQuery.isFunction( args[ i ].promise ) ) {
					args[ i ].promise().then( resolveFunc(i), deferred.reject, progressFunc(i) );
				} else {
					--count;
				}
			}
			if ( !count ) {
				deferred.resolveWith( deferred, args );
			}
		} else if ( deferred !== firstParam ) {
			deferred.resolveWith( deferred, length ? [ firstParam ] : [] );
		}
		return promise;
	}
});




jQuery.support = (function() {

	var support,
		all,
		a,
		select,
		opt,
		input,
		fragment,
		tds,
		events,
		eventName,
		i,
		isSupported,
		div = document.createElement( "div" ),
		documentElement = document.documentElement;

	// Preliminary tests
	div.setAttribute("className", "t");
	div.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

	all = div.getElementsByTagName( "*" );
	a = div.getElementsByTagName( "a" )[ 0 ];

	// Can't get basic test support
	if ( !all || !all.length || !a ) {
		return {};
	}

	// First batch of supports tests
	select = document.createElement( "select" );
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName( "input" )[ 0 ];

	support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: ( div.firstChild.nodeType === 3 ),

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: ( a.getAttribute("href") === "/a" ),

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.55/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: ( input.value === "on" ),

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// Tests for enctype support on a form(#6743)
		enctype: !!document.createElement("form").enctype,

		// Makes sure cloning an html5 element does not cause problems
		// Where outerHTML is undefined, this still works
		html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

		// Will be defined later
		submitBubbles: true,
		changeBubbles: true,
		focusinBubbles: false,
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true,
		pixelMargin: true
	};

	// jQuery.boxModel DEPRECATED in 1.3, use jQuery.support.boxModel instead
	jQuery.boxModel = support.boxModel = (document.compatMode === "CSS1Compat");

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
		div.attachEvent( "onclick", function() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			support.noCloneEvent = false;
		});
		div.cloneNode( true ).fireEvent( "onclick" );
	}

	// Check if a radio maintains its value
	// after being appended to the DOM
	input = document.createElement("input");
	input.value = "t";
	input.setAttribute("type", "radio");
	support.radioValue = input.value === "t";

	input.setAttribute("checked", "checked");

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "name", "t" );

	div.appendChild( input );
	fragment = document.createDocumentFragment();
	fragment.appendChild( div.lastChild );

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	fragment.removeChild( input );
	fragment.appendChild( div );

	// Technique from Juriy Zaytsev
	// http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
	// We only care about the case where non-standard event systems
	// are used, namely in IE. Short-circuiting here helps us to
	// avoid an eval call (in setAttribute) which can cause CSP
	// to go haywire. See: https://developer.mozilla.org/en/Security/CSP
	if ( div.attachEvent ) {
		for ( i in {
			submit: 1,
			change: 1,
			focusin: 1
		}) {
			eventName = "on" + i;
			isSupported = ( eventName in div );
			if ( !isSupported ) {
				div.setAttribute( eventName, "return;" );
				isSupported = ( typeof div[ eventName ] === "function" );
			}
			support[ i + "Bubbles" ] = isSupported;
		}
	}

	fragment.removeChild( div );

	// Null elements to avoid leaks in IE
	fragment = select = opt = div = input = null;

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, outer, inner, table, td, offsetSupport,
			marginDiv, conMarginTop, style, html, positionTopLeftWidthHeight,
			paddingMarginBorderVisibility, paddingMarginBorder,
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		conMarginTop = 1;
		paddingMarginBorder = "padding:0;margin:0;border:";
		positionTopLeftWidthHeight = "position:absolute;top:0;left:0;width:1px;height:1px;";
		paddingMarginBorderVisibility = paddingMarginBorder + "0;visibility:hidden;";
		style = "style='" + positionTopLeftWidthHeight + paddingMarginBorder + "5px solid #000;";
		html = "<div " + style + "display:block;'><div style='" + paddingMarginBorder + "0;display:block;overflow:hidden;'></div></div>" +
			"<table " + style + "' cellpadding='0' cellspacing='0'>" +
			"<tr><td></td></tr></table>";

		container = document.createElement("div");
		container.style.cssText = paddingMarginBorderVisibility + "width:0;height:0;position:static;top:0;margin-top:" + conMarginTop + "px";
		body.insertBefore( container, body.firstChild );

		// Construct the test element
		div = document.createElement("div");
		container.appendChild( div );

		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		// (only IE 8 fails this test)
		div.innerHTML = "<table><tr><td style='" + paddingMarginBorder + "0;display:none'></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName( "td" );
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Check if empty table cells still have offsetWidth/Height
		// (IE <= 8 fail this test)
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check if div with explicit width and no margin-right incorrectly
		// gets computed margin-right based on width of container. For more
		// info see bug #3333
		// Fails in WebKit before Feb 2011 nightlies
		// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
		if ( window.getComputedStyle ) {
			div.innerHTML = "";
			marginDiv = document.createElement( "div" );
			marginDiv.style.width = "0";
			marginDiv.style.marginRight = "0";
			div.style.width = "2px";
			div.appendChild( marginDiv );
			support.reliableMarginRight =
				( parseInt( ( window.getComputedStyle( marginDiv, null ) || { marginRight: 0 } ).marginRight, 10 ) || 0 ) === 0;
		}

		if ( typeof div.style.zoom !== "undefined" ) {
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			// (IE < 8 does this)
			div.innerHTML = "";
			div.style.width = div.style.padding = "1px";
			div.style.border = 0;
			div.style.overflow = "hidden";
			div.style.display = "inline";
			div.style.zoom = 1;
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Check if elements with layout shrink-wrap their children
			// (IE 6 does this)
			div.style.display = "block";
			div.style.overflow = "visible";
			div.innerHTML = "<div style='width:5px;'></div>";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );
		}

		div.style.cssText = positionTopLeftWidthHeight + paddingMarginBorderVisibility;
		div.innerHTML = html;

		outer = div.firstChild;
		inner = outer.firstChild;
		td = outer.nextSibling.firstChild.firstChild;

		offsetSupport = {
			doesNotAddBorder: ( inner.offsetTop !== 5 ),
			doesAddBorderForTableAndCells: ( td.offsetTop === 5 )
		};

		inner.style.position = "fixed";
		inner.style.top = "20px";

		// safari subtracts parent border width here which is 5px
		offsetSupport.fixedPosition = ( inner.offsetTop === 20 || inner.offsetTop === 15 );
		inner.style.position = inner.style.top = "";

		outer.style.overflow = "hidden";
		outer.style.position = "relative";

		offsetSupport.subtractsBorderForOverflowNotVisible = ( inner.offsetTop === -5 );
		offsetSupport.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== conMarginTop );

		if ( window.getComputedStyle ) {
			div.style.marginTop = "1%";
			support.pixelMargin = ( window.getComputedStyle( div, null ) || { marginTop: 0 } ).marginTop !== "1%";
		}

		if ( typeof container.style.zoom !== "undefined" ) {
			container.style.zoom = 1;
		}

		body.removeChild( container );
		marginDiv = div = container = null;

		jQuery.extend( support, offsetSupport );
	});

	return support;
})();




var rbrace = /^(?:\{.*\}|\[.*\])$/,
	rmultiDash = /([A-Z])/g;

jQuery.extend({
	cache: {},

	// Please use with caution
	uuid: 0,

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var privateCache, thisCache, ret,
			internalKey = jQuery.expando,
			getByName = typeof name === "string",

			// We have to handle DOM nodes and JS objects differently because IE6-7
			// can't GC object references properly across the DOM-JS boundary
			isNode = elem.nodeType,

			// Only DOM nodes need the global jQuery cache; JS object data is
			// attached directly to the object so GC can occur automatically
			cache = isNode ? jQuery.cache : elem,

			// Only defining an ID for JS objects if its cache already exists allows
			// the code to shortcut on the same path as a DOM node with no cache
			id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey,
			isEvents = name === "events";

		// Avoid doing any more work than we need to when trying to get data on an
		// object that has no data at all
		if ( (!id || !cache[id] || (!isEvents && !pvt && !cache[id].data)) && getByName && data === undefined ) {
			return;
		}

		if ( !id ) {
			// Only DOM nodes need a new unique ID for each element since their data
			// ends up in the global cache
			if ( isNode ) {
				elem[ internalKey ] = id = ++jQuery.uuid;
			} else {
				id = internalKey;
			}
		}

		if ( !cache[ id ] ) {
			cache[ id ] = {};

			// Avoids exposing jQuery metadata on plain JS objects when the object
			// is serialized using JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}
		}

		// An object can be passed to jQuery.data instead of a key/value pair; this gets
		// shallow copied over onto the existing cache
		if ( typeof name === "object" || typeof name === "function" ) {
			if ( pvt ) {
				cache[ id ] = jQuery.extend( cache[ id ], name );
			} else {
				cache[ id ].data = jQuery.extend( cache[ id ].data, name );
			}
		}

		privateCache = thisCache = cache[ id ];

		// jQuery data() is stored in a separate object inside the object's internal data
		// cache in order to avoid key collisions between internal data and user-defined
		// data.
		if ( !pvt ) {
			if ( !thisCache.data ) {
				thisCache.data = {};
			}

			thisCache = thisCache.data;
		}

		if ( data !== undefined ) {
			thisCache[ jQuery.camelCase( name ) ] = data;
		}

		// Users should not attempt to inspect the internal events object using jQuery.data,
		// it is undocumented and subject to change. But does anyone listen? No.
		if ( isEvents && !thisCache[ name ] ) {
			return privateCache.events;
		}

		// Check for both converted-to-camel and non-converted data property names
		// If a data property was specified
		if ( getByName ) {

			// First Try to find as-is property data
			ret = thisCache[ name ];

			// Test for null|undefined property data
			if ( ret == null ) {

				// Try to find the camelCased property
				ret = thisCache[ jQuery.camelCase( name ) ];
			}
		} else {
			ret = thisCache;
		}

		return ret;
	},

	removeData: function( elem, name, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var thisCache, i, l,

			// Reference to internal data cache key
			internalKey = jQuery.expando,

			isNode = elem.nodeType,

			// See jQuery.data for more information
			cache = isNode ? jQuery.cache : elem,

			// See jQuery.data for more information
			id = isNode ? elem[ internalKey ] : internalKey;

		// If there is already no cache entry for this object, there is no
		// purpose in continuing
		if ( !cache[ id ] ) {
			return;
		}

		if ( name ) {

			thisCache = pvt ? cache[ id ] : cache[ id ].data;

			if ( thisCache ) {

				// Support array or space separated string names for data keys
				if ( !jQuery.isArray( name ) ) {

					// try the string as a key before any manipulation
					if ( name in thisCache ) {
						name = [ name ];
					} else {

						// split the camel cased version by spaces unless a key with the spaces exists
						name = jQuery.camelCase( name );
						if ( name in thisCache ) {
							name = [ name ];
						} else {
							name = name.split( " " );
						}
					}
				}

				for ( i = 0, l = name.length; i < l; i++ ) {
					delete thisCache[ name[i] ];
				}

				// If there is no data left in the cache, we want to continue
				// and let the cache object itself get destroyed
				if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
					return;
				}
			}
		}

		// See jQuery.data for more information
		if ( !pvt ) {
			delete cache[ id ].data;

			// Don't destroy the parent cache unless the internal data object
			// had been the only thing left in it
			if ( !isEmptyDataObject(cache[ id ]) ) {
				return;
			}
		}

		// Browsers that fail expando deletion also refuse to delete expandos on
		// the window, but it will allow it on all other JS objects; other browsers
		// don't care
		// Ensure that `cache` is not a window object #10080
		if ( jQuery.support.deleteExpando || !cache.setInterval ) {
			delete cache[ id ];
		} else {
			cache[ id ] = null;
		}

		// We destroyed the cache and need to eliminate the expando on the node to avoid
		// false lookups in the cache for entries that no longer exist
		if ( isNode ) {
			// IE does not allow us to delete expando properties from nodes,
			// nor does it have a removeAttribute function on Document nodes;
			// we must handle all of these cases
			if ( jQuery.support.deleteExpando ) {
				delete elem[ internalKey ];
			} else if ( elem.removeAttribute ) {
				elem.removeAttribute( internalKey );
			} else {
				elem[ internalKey ] = null;
			}
		}
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return jQuery.data( elem, name, data, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		if ( elem.nodeName ) {
			var match = jQuery.noData[ elem.nodeName.toLowerCase() ];

			if ( match ) {
				return !(match === true || elem.getAttribute("classid") !== match);
			}
		}

		return true;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var parts, part, attr, name, l,
			elem = this[0],
			i = 0,
			data = null;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attr = elem.attributes;
					for ( l = attr.length; i < l; i++ ) {
						name = attr[i].name;

						if ( name.indexOf( "data-" ) === 0 ) {
							name = jQuery.camelCase( name.substring(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		parts = key.split( ".", 2 );
		parts[1] = parts[1] ? "." + parts[1] : "";
		part = parts[1] + "!";

		return jQuery.access( this, function( value ) {

			if ( value === undefined ) {
				data = this.triggerHandler( "getData" + part, [ parts[0] ] );

				// Try to fetch any internally stored data first
				if ( data === undefined && elem ) {
					data = jQuery.data( elem, key );
					data = dataAttr( elem, key, data );
				}

				return data === undefined && parts[1] ?
					this.data( parts[0] ) :
					data;
			}

			parts[1] = value;
			this.each(function() {
				var self = jQuery( this );

				self.triggerHandler( "setData" + part, parts );
				jQuery.data( this, key, value );
				self.triggerHandler( "changeData" + part, parts );
			});
		}, null, value, arguments.length > 1, null, false );
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
				data === "false" ? false :
				data === "null" ? null :
				jQuery.isNumeric( data ) ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	for ( var name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}




function handleQueueMarkDefer( elem, type, src ) {
	var deferDataKey = type + "defer",
		queueDataKey = type + "queue",
		markDataKey = type + "mark",
		defer = jQuery._data( elem, deferDataKey );
	if ( defer &&
		( src === "queue" || !jQuery._data(elem, queueDataKey) ) &&
		( src === "mark" || !jQuery._data(elem, markDataKey) ) ) {
		// Give room for hard-coded callbacks to fire first
		// and eventually mark/queue something else on the element
		setTimeout( function() {
			if ( !jQuery._data( elem, queueDataKey ) &&
				!jQuery._data( elem, markDataKey ) ) {
				jQuery.removeData( elem, deferDataKey, true );
				defer.fire();
			}
		}, 0 );
	}
}

jQuery.extend({

	_mark: function( elem, type ) {
		if ( elem ) {
			type = ( type || "fx" ) + "mark";
			jQuery._data( elem, type, (jQuery._data( elem, type ) || 0) + 1 );
		}
	},

	_unmark: function( force, elem, type ) {
		if ( force !== true ) {
			type = elem;
			elem = force;
			force = false;
		}
		if ( elem ) {
			type = type || "fx";
			var key = type + "mark",
				count = force ? 0 : ( (jQuery._data( elem, key ) || 1) - 1 );
			if ( count ) {
				jQuery._data( elem, key, count );
			} else {
				jQuery.removeData( elem, key, true );
				handleQueueMarkDefer( elem, type, "mark" );
			}
		}
	},

	queue: function( elem, type, data ) {
		var q;
		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			q = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !q || jQuery.isArray(data) ) {
					q = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					q.push( data );
				}
			}
			return q || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			fn = queue.shift(),
			hooks = {};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
		}

		if ( fn ) {
			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			jQuery._data( elem, type + ".run", hooks );
			fn.call( elem, function() {
				jQuery.dequeue( elem, type );
			}, hooks );
		}

		if ( !queue.length ) {
			jQuery.removeData( elem, type + "queue " + type + ".run", true );
			handleQueueMarkDefer( elem, type, "queue" );
		}
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, object ) {
		if ( typeof type !== "string" ) {
			object = type;
			type = undefined;
		}
		type = type || "fx";
		var defer = jQuery.Deferred(),
			elements = this,
			i = elements.length,
			count = 1,
			deferDataKey = type + "defer",
			queueDataKey = type + "queue",
			markDataKey = type + "mark",
			tmp;
		function resolve() {
			if ( !( --count ) ) {
				defer.resolveWith( elements, [ elements ] );
			}
		}
		while( i-- ) {
			if (( tmp = jQuery.data( elements[ i ], deferDataKey, undefined, true ) ||
					( jQuery.data( elements[ i ], queueDataKey, undefined, true ) ||
						jQuery.data( elements[ i ], markDataKey, undefined, true ) ) &&
					jQuery.data( elements[ i ], deferDataKey, jQuery.Callbacks( "once memory" ), true ) )) {
				count++;
				tmp.add( resolve );
			}
		}
		resolve();
		return defer.promise( object );
	}
});




var rclass = /[\n\t\r]/g,
	rspace = /\s+/,
	rreturn = /\r/g,
	rtype = /^(?:button|input)$/i,
	rfocusable = /^(?:button|input|object|select|textarea)$/i,
	rclickable = /^a(?:rea)?$/i,
	rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	nodeHook, boolHook, fixSpecified;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classNames, i, l, elem,
			setClass, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call(this, j, this.className) );
			});
		}

		if ( value && typeof value === "string" ) {
			classNames = value.split( rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className && classNames.length === 1 ) {
						elem.className = value;

					} else {
						setClass = " " + elem.className + " ";

						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( !~setClass.indexOf( " " + classNames[ c ] + " " ) ) {
								setClass += classNames[ c ] + " ";
							}
						}
						elem.className = jQuery.trim( setClass );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classNames, i, l, elem, className, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call(this, j, this.className) );
			});
		}

		if ( (value && typeof value === "string") || value === undefined ) {
			classNames = ( value || "" ).split( rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 && elem.className ) {
					if ( value ) {
						className = (" " + elem.className + " ").replace( rclass, " " );
						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							className = className.replace(" " + classNames[ c ] + " ", " ");
						}
						elem.className = jQuery.trim( className );

					} else {
						elem.className = "";
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.split( rspace );

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space seperated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// toggle whole className
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var self = jQuery(this), val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, i, max, option,
					index = elem.selectedIndex,
					values = [],
					options = elem.options,
					one = elem.type === "select-one";

				// Nothing was selected
				if ( index < 0 ) {
					return null;
				}

				// Loop through all the selected options
				i = one ? index : 0;
				max = one ? index + 1 : options.length;
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Don't return options that are disabled or in a disabled optgroup
					if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
							(!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				// Fixes Bug #2551 -- select.val() broken in IE after form.reset()
				if ( one && !values.length && options.length ) {
					return jQuery( options[ index ] ).val();
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attrFn: {
		val: true,
		css: true,
		html: true,
		text: true,
		data: true,
		width: true,
		height: true,
		offset: true
	},

	attr: function( elem, name, value, pass ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( pass && name in jQuery.attrFn ) {
			return jQuery( elem )[ name ]( value );
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( notxml ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;

			} else if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, "" + value );
				return value;
			}

		} else if ( hooks && "get" in hooks && notxml && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			ret = elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to undefined
			return ret === null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var propName, attrNames, name, l, isBool,
			i = 0;

		if ( value && elem.nodeType === 1 ) {
			attrNames = value.toLowerCase().split( rspace );
			l = attrNames.length;

			for ( ; i < l; i++ ) {
				name = attrNames[ i ];

				if ( name ) {
					propName = jQuery.propFix[ name ] || name;
					isBool = rboolean.test( name );

					// See #9699 for explanation of this approach (setting first, then removal)
					// Do not do this for boolean attributes (see #10870)
					if ( !isBool ) {
						jQuery.attr( elem, name, "" );
					}
					elem.removeAttribute( getSetAttribute ? name : propName );

					// Set corresponding property to false for boolean attributes
					if ( isBool && propName in elem ) {
						elem[ propName ] = false;
					}
				}
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				// We can't allow the type property to be changed (since it causes problems in IE)
				if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
					jQuery.error( "type property can't be changed" );
				} else if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to it's default in case type is set after value
					// This is for element creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		},
		// Use the value property for back compat
		// Use the nodeHook for button elements in IE6/7 (#1954)
		value: {
			get: function( elem, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.get( elem, name );
				}
				return name in elem ?
					elem.value :
					null;
			},
			set: function( elem, value, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.set( elem, value, name );
				}
				// Does not return so that setAttribute is also used
				elem.value = value;
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return ( elem[ name ] = value );
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabindex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		}
	}
});

// Add the tabIndex propHook to attrHooks for back-compat (different case is intentional)
jQuery.attrHooks.tabindex = jQuery.propHooks.tabIndex;

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		// Align boolean attributes with corresponding properties
		// Fall back to attribute presence where some booleans are not supported
		var attrNode,
			property = jQuery.prop( elem, name );
		return property === true || typeof property !== "boolean" && ( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		var propName;
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			// value is true since we know at this point it's type boolean and not false
			// Set boolean attributes to the same name and set the DOM property
			propName = jQuery.propFix[ name ] || name;
			if ( propName in elem ) {
				// Only set the IDL specifically if it already exists on the element
				elem[ propName ] = true;
			}

			elem.setAttribute( name, name.toLowerCase() );
		}
		return name;
	}
};

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	fixSpecified = {
		name: true,
		id: true,
		coords: true
	};

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret;
			ret = elem.getAttributeNode( name );
			return ret && ( fixSpecified[ name ] ? ret.nodeValue !== "" : ret.specified ) ?
				ret.nodeValue :
				undefined;
		},
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				ret = document.createAttribute( name );
				elem.setAttributeNode( ret );
			}
			return ( ret.nodeValue = value + "" );
		}
	};

	// Apply the nodeHook to tabindex
	jQuery.attrHooks.tabindex.set = nodeHook.set;

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		get: nodeHook.get,
		set: function( elem, value, name ) {
			if ( value === "" ) {
				value = "false";
			}
			nodeHook.set( elem, value, name );
		}
	};
}


// Some attributes require a special call on IE
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret === null ? undefined : ret;
			}
		});
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Normalize to lowercase since IE uppercases css property names
			return elem.style.cssText.toLowerCase() || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = "" + value );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	});
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	});
});




var rformElems = /^(?:textarea|input|select)$/i,
	rtypenamespace = /^([^\.]*)?(?:\.(.+))?$/,
	rhoverHack = /(?:^|\s)hover(\.\S+)?\b/,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rquickIs = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,
	quickParse = function( selector ) {
		var quick = rquickIs.exec( selector );
		if ( quick ) {
			//   0  1    2   3
			// [ _, tag, id, class ]
			quick[1] = ( quick[1] || "" ).toLowerCase();
			quick[3] = quick[3] && new RegExp( "(?:^|\\s)" + quick[3] + "(?:\\s|$)" );
		}
		return quick;
	},
	quickIs = function( elem, m ) {
		var attrs = elem.attributes || {};
		return (
			(!m[1] || elem.nodeName.toLowerCase() === m[1]) &&
			(!m[2] || (attrs.id || {}).value === m[2]) &&
			(!m[3] || m[3].test( (attrs[ "class" ] || {}).value ))
		);
	},
	hoverHack = function( events ) {
		return jQuery.event.special.hover ? events : events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
	};

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	add: function( elem, types, handler, data, selector ) {

		var elemData, eventHandle, events,
			t, tns, type, namespaces, handleObj,
			handleObjIn, quick, handlers, special;

		// Don't attach events to noData or text/comment nodes (allow plain objects tho)
		if ( elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data( elem )) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		events = elemData.events;
		if ( !events ) {
			elemData.events = events = {};
		}
		eventHandle = elemData.handle;
		if ( !eventHandle ) {
			elemData.handle = eventHandle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = jQuery.trim( hoverHack(types) ).split( " " );
		for ( t = 0; t < types.length; t++ ) {

			tns = rtypenamespace.exec( types[t] ) || [];
			type = tns[1];
			namespaces = ( tns[2] || "" ).split( "." ).sort();

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: tns[1],
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				quick: selector && quickParse( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			handlers = events[ type ];
			if ( !handlers ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var elemData = jQuery.hasData( elem ) && jQuery._data( elem ),
			t, tns, type, origType, namespaces, origCount,
			j, events, special, handle, eventType, handleObj;

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = jQuery.trim( hoverHack( types || "" ) ).split(" ");
		for ( t = 0; t < types.length; t++ ) {
			tns = rtypenamespace.exec( types[t] ) || [];
			type = origType = tns[1];
			namespaces = tns[2];

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector? special.delegateType : special.bindType ) || type;
			eventType = events[ type ] || [];
			origCount = eventType.length;
			namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null;

			// Remove matching events
			for ( j = 0; j < eventType.length; j++ ) {
				handleObj = eventType[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					 ( !handler || handler.guid === handleObj.guid ) &&
					 ( !namespaces || namespaces.test( handleObj.namespace ) ) &&
					 ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					eventType.splice( j--, 1 );

					if ( handleObj.selector ) {
						eventType.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( eventType.length === 0 && origCount !== eventType.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			handle = elemData.handle;
			if ( handle ) {
				handle.elem = null;
			}

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery.removeData( elem, [ "events", "handle" ], true );
		}
	},

	// Events that are safe to short-circuit if no handlers are attached.
	// Native DOM events should not be added, they may have inline handlers.
	customEvent: {
		"getData": true,
		"setData": true,
		"changeData": true
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		// Don't do events on text and comment nodes
		if ( elem && (elem.nodeType === 3 || elem.nodeType === 8) ) {
			return;
		}

		// Event object or event type
		var type = event.type || event,
			namespaces = [],
			cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType;

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "!" ) >= 0 ) {
			// Exclusive events trigger only for the exact event (no namespaces)
			type = type.slice(0, -1);
			exclusive = true;
		}

		if ( type.indexOf( "." ) >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}

		if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
			// No jQuery handlers for this event type, and it can't have inline handlers
			return;
		}

		// Caller can pass in an Event, Object, or just an event type string
		event = typeof event === "object" ?
			// jQuery.Event object
			event[ jQuery.expando ] ? event :
			// Object literal
			new jQuery.Event( type, event ) :
			// Just the event type (string)
			new jQuery.Event( type );

		event.type = type;
		event.isTrigger = true;
		event.exclusive = exclusive;
		event.namespace = namespaces.join( "." );
		event.namespace_re = event.namespace? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
		ontype = type.indexOf( ":" ) < 0 ? "on" + type : "";

		// Handle a global trigger
		if ( !elem ) {

			// TODO: Stop taunting the data cache; remove global events and always attach to document
			cache = jQuery.cache;
			for ( i in cache ) {
				if ( cache[ i ].events && cache[ i ].events[ type ] ) {
					jQuery.event.trigger( event, data, cache[ i ].handle.elem, true );
				}
			}
			return;
		}

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data != null ? jQuery.makeArray( data ) : [];
		data.unshift( event );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		eventPath = [[ elem, special.bindType || type ]];
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			cur = rfocusMorph.test( bubbleType + type ) ? elem : elem.parentNode;
			old = null;
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push([ cur, bubbleType ]);
				old = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( old && old === elem.ownerDocument ) {
				eventPath.push([ old.defaultView || old.parentWindow || window, bubbleType ]);
			}
		}

		// Fire handlers on the event path
		for ( i = 0; i < eventPath.length && !event.isPropagationStopped(); i++ ) {

			cur = eventPath[i][0];
			event.type = eventPath[i][1];

			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}
			// Note that this is a bare JS function and not a jQuery handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				// IE<9 dies on focus/blur to hidden element (#1486)
				if ( ontype && elem[ type ] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					old = elem[ ontype ];

					if ( old ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( old ) {
						elem[ ontype ] = old;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event || window.event );

		var handlers = ( (jQuery._data( this, "events" ) || {} )[ event.type ] || []),
			delegateCount = handlers.delegateCount,
			args = [].slice.call( arguments, 0 ),
			run_all = !event.exclusive && !event.namespace,
			special = jQuery.event.special[ event.type ] || {},
			handlerQueue = [],
			i, j, cur, jqcur, ret, selMatch, matched, matches, handleObj, sel, related;

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers that should run if there are delegated events
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && !(event.button && event.type === "click") ) {

			// Pregenerate a single jQuery object for reuse with .is()
			jqcur = jQuery(this);
			jqcur.context = this.ownerDocument || this;

			for ( cur = event.target; cur != this; cur = cur.parentNode || this ) {

				// Don't process events on disabled elements (#6911, #8165)
				if ( cur.disabled !== true ) {
					selMatch = {};
					matches = [];
					jqcur[0] = cur;
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];
						sel = handleObj.selector;

						if ( selMatch[ sel ] === undefined ) {
							selMatch[ sel ] = (
								handleObj.quick ? quickIs( cur, handleObj.quick ) : jqcur.is( sel )
							);
						}
						if ( selMatch[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, matches: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( handlers.length > delegateCount ) {
			handlerQueue.push({ elem: this, matches: handlers.slice( delegateCount ) });
		}

		// Run delegates first; they may want to stop propagation beneath us
		for ( i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++ ) {
			matched = handlerQueue[ i ];
			event.currentTarget = matched.elem;

			for ( j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++ ) {
				handleObj = matched.matches[ j ];

				// Triggered event must either 1) be non-exclusive and have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test( handleObj.namespace ) ) {

					event.data = handleObj.data;
					event.handleObj = handleObj;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						event.result = ret;
						if ( ret === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	// *** attrChange attrName relatedNode srcElement  are not normalized, non-W3C, deprecated, will be removed in 1.8 ***
	props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop,
			originalEvent = event,
			fixHook = jQuery.event.fixHooks[ event.type ] || {},
			copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = jQuery.Event( originalEvent );

		for ( i = copy.length; i; ) {
			prop = copy[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Target should not be a text node (#504, Safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// For mouse/key events; add metaKey if it's not there (#3368, IE6/7/8)
		if ( event.metaKey === undefined ) {
			event.metaKey = event.ctrlKey;
		}

		return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		ready: {
			// Make sure the ready event is setup
			setup: jQuery.bindReady
		},

		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},

		focus: {
			delegateType: "focusin"
		},
		blur: {
			delegateType: "focusout"
		},

		beforeunload: {
			setup: function( data, namespaces, eventHandle ) {
				// We only want to do this special case on windows
				if ( jQuery.isWindow( this ) ) {
					this.onbeforeunload = eventHandle;
				}
			},

			teardown: function( namespaces, eventHandle ) {
				if ( this.onbeforeunload === eventHandle ) {
					this.onbeforeunload = null;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{ type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

// Some plugins are using, but it's undocumented/deprecated and will be removed.
// The 1.7 special event interface should provide all the hooks needed now.
jQuery.event.handle = jQuery.event.dispatch;

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		if ( elem.detachEvent ) {
			elem.detachEvent( "on" + type, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}

		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// otherwise set the returnValue property of the original event to false (IE)
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj,
				selector = handleObj.selector,
				ret;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !form._submit_attached ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					form._submit_attached = true;
				}
			});
			// return undefined since we don't need an event listener
		},
		
		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
							jQuery.event.simulate( "change", this, event, true );
						}
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !elem._change_attached ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					elem._change_attached = true;
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) { // && selector != null
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			var handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( var type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	live: function( types, data, fn ) {
		jQuery( this.context ).on( types, this.selector, data, fn );
		return this;
	},
	die: function( types, fn ) {
		jQuery( this.context ).off( types, this.selector || "**", fn );
		return this;
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length == 1? this.off( selector, "**" ) : this.off( types, selector, fn );
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			return jQuery.event.trigger( type, data, this[0], true );
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments,
			guid = fn.guid || jQuery.guid++,
			i = 0,
			toggler = function( event ) {
				// Figure out which function to execute
				var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
				jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

				// Make sure that clicks stop
				event.preventDefault();

				// and execute the function
				return args[ lastToggle ].apply( this, arguments ) || false;
			};

		// link all the functions, so any of them can unbind this click handler
		toggler.guid = guid;
		while ( i < args.length ) {
			args[ i++ ].guid = guid;
		}

		return this.click( toggler );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		if ( fn == null ) {
			fn = data;
			data = null;
		}

		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};

	if ( jQuery.attrFn ) {
		jQuery.attrFn[ name ] = true;
	}

	if ( rkeyEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.keyHooks;
	}

	if ( rmouseEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.mouseHooks;
	}
});



/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2011, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	expando = "sizcache" + (Math.random() + '').replace('.', ''),
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true,
	rBackslash = /\\/g,
	rReturn = /\r\n/g,
	rNonWord = /\W/;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function() {
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function( selector, context, results, seed ) {
	results = results || [];
	context = context || document;

	var origContext = context;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var m, set, checkSet, extra, ret, cur, pop, i,
		prune = true,
		contextXML = Sizzle.isXML( context ),
		parts = [],
		soFar = selector;

	// Reset the position of the chunker regexp (start from head)
	do {
		chunker.exec( "" );
		m = chunker.exec( soFar );

		if ( m ) {
			soFar = m[3];

			parts.push( m[1] );

			if ( m[2] ) {
				extra = m[3];
				break;
			}
		}
	} while ( m );

	if ( parts.length > 1 && origPOS.exec( selector ) ) {

		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context, seed );

		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}

				set = posProcess( selector, set, seed );
			}
		}

	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

			ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ?
				Sizzle.filter( ret.expr, ret.set )[0] :
				ret.set[0];
		}

		if ( context ) {
			ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

			set = ret.expr ?
				Sizzle.filter( ret.expr, ret.set ) :
				ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray( set );

			} else {
				prune = false;
			}

			while ( parts.length ) {
				cur = parts.pop();
				pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}

		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		Sizzle.error( cur || selector );
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );

		} else if ( context && context.nodeType === 1 ) {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}

		} else {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}

	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function( results ) {
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[ i - 1 ] ) {
					results.splice( i--, 1 );
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function( expr, set ) {
	return Sizzle( expr, null, null, set );
};

Sizzle.matchesSelector = function( node, expr ) {
	return Sizzle( expr, null, null, [node] ).length > 0;
};

Sizzle.find = function( expr, context, isXML ) {
	var set, i, len, match, type, left;

	if ( !expr ) {
		return [];
	}

	for ( i = 0, len = Expr.order.length; i < len; i++ ) {
		type = Expr.order[i];

		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			left = match[1];
			match.splice( 1, 1 );

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace( rBackslash, "" );
				set = Expr.find[ type ]( match, context, isXML );

				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( "*" ) :
			[];
	}

	return { set: set, expr: expr };
};

Sizzle.filter = function( expr, set, inplace, not ) {
	var match, anyFound,
		type, found, item, filter, left,
		i, pass,
		old = expr,
		result = [],
		curLoop = set,
		isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

	while ( expr && set.length ) {
		for ( type in Expr.filter ) {
			if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
				filter = Expr.filter[ type ];
				left = match[1];

				anyFound = false;

				match.splice(1,1);

				if ( left.substr( left.length - 1 ) === "\\" ) {
					continue;
				}

				if ( curLoop === result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;

					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							pass = not ^ found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;

								} else {
									curLoop[i] = false;
								}

							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr === old ) {
			if ( anyFound == null ) {
				Sizzle.error( expr );

			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Utility function for retreiving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
var getText = Sizzle.getText = function( elem ) {
    var i, node,
		nodeType = elem.nodeType,
		ret = "";

	if ( nodeType ) {
		if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
			// Use textContent || innerText for elements
			if ( typeof elem.textContent === 'string' ) {
				return elem.textContent;
			} else if ( typeof elem.innerText === 'string' ) {
				// Replace IE's carriage returns
				return elem.innerText.replace( rReturn, '' );
			} else {
				// Traverse it's children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
	} else {

		// If no nodeType, this is expected to be an array
		for ( i = 0; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			if ( node.nodeType !== 8 ) {
				ret += getText( node );
			}
		}
	}
	return ret;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],

	match: {
		ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
	},

	leftMatch: {},

	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},

	attrHandle: {
		href: function( elem ) {
			return elem.getAttribute( "href" );
		},
		type: function( elem ) {
			return elem.getAttribute( "type" );
		}
	},

	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !rNonWord.test( part ),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},

		">": function( checkSet, part ) {
			var elem,
				isPartStr = typeof part === "string",
				i = 0,
				l = checkSet.length;

			if ( isPartStr && !rNonWord.test( part ) ) {
				part = part.toLowerCase();

				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
					}
				}

			} else {
				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},

		"": function(checkSet, part, isXML){
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
		},

		"~": function( checkSet, part, isXML ) {
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
		}
	},

	find: {
		ID: function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		},

		NAME: function( match, context ) {
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [],
					results = context.getElementsByName( match[1] );

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},

		TAG: function( match, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( match[1] );
			}
		}
	},
	preFilter: {
		CLASS: function( match, curLoop, inplace, result, not, isXML ) {
			match = " " + match[1].replace( rBackslash, "" ) + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
						if ( !inplace ) {
							result.push( elem );
						}

					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},

		ID: function( match ) {
			return match[1].replace( rBackslash, "" );
		},

		TAG: function( match, curLoop ) {
			return match[1].replace( rBackslash, "" ).toLowerCase();
		},

		CHILD: function( match ) {
			if ( match[1] === "nth" ) {
				if ( !match[2] ) {
					Sizzle.error( match[0] );
				}

				match[2] = match[2].replace(/^\+|\s*/g, '');

				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}
			else if ( match[2] ) {
				Sizzle.error( match[0] );
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},

		ATTR: function( match, curLoop, inplace, result, not, isXML ) {
			var name = match[1] = match[1].replace( rBackslash, "" );

			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			// Handle if an un-quoted value was used
			match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},

		PSEUDO: function( match, curLoop, inplace, result, not ) {
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);

				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

					if ( !inplace ) {
						result.push.apply( result, ret );
					}

					return false;
				}

			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}

			return match;
		},

		POS: function( match ) {
			match.unshift( true );

			return match;
		}
	},

	filters: {
		enabled: function( elem ) {
			return elem.disabled === false && elem.type !== "hidden";
		},

		disabled: function( elem ) {
			return elem.disabled === true;
		},

		checked: function( elem ) {
			return elem.checked === true;
		},

		selected: function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		parent: function( elem ) {
			return !!elem.firstChild;
		},

		empty: function( elem ) {
			return !elem.firstChild;
		},

		has: function( elem, i, match ) {
			return !!Sizzle( match[3], elem ).length;
		},

		header: function( elem ) {
			return (/h\d/i).test( elem.nodeName );
		},

		text: function( elem ) {
			var attr = elem.getAttribute( "type" ), type = elem.type;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" && "text" === type && ( attr === type || attr === null );
		},

		radio: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
		},

		checkbox: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
		},

		file: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
		},

		password: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
		},

		submit: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "submit" === elem.type;
		},

		image: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
		},

		reset: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "reset" === elem.type;
		},

		button: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && "button" === elem.type || name === "button";
		},

		input: function( elem ) {
			return (/input|select|textarea|button/i).test( elem.nodeName );
		},

		focus: function( elem ) {
			return elem === elem.ownerDocument.activeElement;
		}
	},
	setFilters: {
		first: function( elem, i ) {
			return i === 0;
		},

		last: function( elem, i, match, array ) {
			return i === array.length - 1;
		},

		even: function( elem, i ) {
			return i % 2 === 0;
		},

		odd: function( elem, i ) {
			return i % 2 === 1;
		},

		lt: function( elem, i, match ) {
			return i < match[3] - 0;
		},

		gt: function( elem, i, match ) {
			return i > match[3] - 0;
		},

		nth: function( elem, i, match ) {
			return match[3] - 0 === i;
		},

		eq: function( elem, i, match ) {
			return match[3] - 0 === i;
		}
	},
	filter: {
		PSEUDO: function( elem, match, i, array ) {
			var name = match[1],
				filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );

			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || getText([ elem ]) || "").indexOf(match[3]) >= 0;

			} else if ( name === "not" ) {
				var not = match[3];

				for ( var j = 0, l = not.length; j < l; j++ ) {
					if ( not[j] === elem ) {
						return false;
					}
				}

				return true;

			} else {
				Sizzle.error( name );
			}
		},

		CHILD: function( elem, match ) {
			var first, last,
				doneName, parent, cache,
				count, diff,
				type = match[1],
				node = elem;

			switch ( type ) {
				case "only":
				case "first":
					while ( (node = node.previousSibling) ) {
						if ( node.nodeType === 1 ) {
							return false;
						}
					}

					if ( type === "first" ) {
						return true;
					}

					node = elem;

					/* falls through */
				case "last":
					while ( (node = node.nextSibling) ) {
						if ( node.nodeType === 1 ) {
							return false;
						}
					}

					return true;

				case "nth":
					first = match[2];
					last = match[3];

					if ( first === 1 && last === 0 ) {
						return true;
					}

					doneName = match[0];
					parent = elem.parentNode;

					if ( parent && (parent[ expando ] !== doneName || !elem.nodeIndex) ) {
						count = 0;

						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						}

						parent[ expando ] = doneName;
					}

					diff = elem.nodeIndex - last;

					if ( first === 0 ) {
						return diff === 0;

					} else {
						return ( diff % first === 0 && diff / first >= 0 );
					}
			}
		},

		ID: function( elem, match ) {
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},

		TAG: function( elem, match ) {
			return (match === "*" && elem.nodeType === 1) || !!elem.nodeName && elem.nodeName.toLowerCase() === match;
		},

		CLASS: function( elem, match ) {
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},

		ATTR: function( elem, match ) {
			var name = match[1],
				result = Sizzle.attr ?
					Sizzle.attr( elem, name ) :
					Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				!type && Sizzle.attr ?
				result != null :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value !== check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},

		POS: function( elem, match, i, array ) {
			var name = match[2],
				filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS,
	fescape = function(all, num){
		return "\\" + (num - 0 + 1);
	};

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
	Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
}
// Expose origPOS
// "global" as in regardless of relation to brackets/parens
Expr.match.globalPOS = origPOS;

var makeArray = function( array, results ) {
	array = Array.prototype.slice.call( array, 0 );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}

	return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
	Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
} catch( e ) {
	makeArray = function( array, results ) {
		var i = 0,
			ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );

		} else {
			if ( typeof array.length === "number" ) {
				for ( var l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}

			} else {
				for ( ; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder, siblingCheck;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
			return a.compareDocumentPosition ? -1 : 1;
		}

		return a.compareDocumentPosition(b) & 4 ? -1 : 1;
	};

} else {
	sortOrder = function( a, b ) {
		// The nodes are identical, we can exit early
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Fallback to using sourceIndex (in IE) if it's available on both nodes
		} else if ( a.sourceIndex && b.sourceIndex ) {
			return a.sourceIndex - b.sourceIndex;
		}

		var al, bl,
			ap = [],
			bp = [],
			aup = a.parentNode,
			bup = b.parentNode,
			cur = aup;

		// If the nodes are siblings (or identical) we can do a quick check
		if ( aup === bup ) {
			return siblingCheck( a, b );

		// If no parents were found then the nodes are disconnected
		} else if ( !aup ) {
			return -1;

		} else if ( !bup ) {
			return 1;
		}

		// Otherwise they're somewhere else in the tree so we need
		// to build up a full list of the parentNodes for comparison
		while ( cur ) {
			ap.unshift( cur );
			cur = cur.parentNode;
		}

		cur = bup;

		while ( cur ) {
			bp.unshift( cur );
			cur = cur.parentNode;
		}

		al = ap.length;
		bl = bp.length;

		// Start walking down the tree looking for a discrepancy
		for ( var i = 0; i < al && i < bl; i++ ) {
			if ( ap[i] !== bp[i] ) {
				return siblingCheck( ap[i], bp[i] );
			}
		}

		// We ended someplace up the tree so do a sibling check
		return i === al ?
			siblingCheck( a, bp[i], -1 ) :
			siblingCheck( ap[i], b, 1 );
	};

	siblingCheck = function( a, b, ret ) {
		if ( a === b ) {
			return ret;
		}

		var cur = a.nextSibling;

		while ( cur ) {
			if ( cur === b ) {
				return -1;
			}

			cur = cur.nextSibling;
		}

		return 1;
	};
}

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("div"),
		id = "script" + (new Date()).getTime(),
		root = document.documentElement;

	form.innerHTML = "<a name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it quickly
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( document.getElementById( id ) ) {
		Expr.find.ID = function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);

				return m ?
					m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
						[m] :
						undefined :
					[];
			}
		};

		Expr.filter.ID = function( elem, match ) {
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );

	// release memory in IE
	root = form = null;
})();

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function( match, context ) {
			var results = context.getElementsByTagName( match[1] );

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";

	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {

		Expr.attrHandle.href = function( elem ) {
			return elem.getAttribute( "href", 2 );
		};
	}

	// release memory in IE
	div = null;
})();

if ( document.querySelectorAll ) {
	(function(){
		var oldSizzle = Sizzle,
			div = document.createElement("div"),
			id = "__sizzle__";

		div.innerHTML = "<p class='TEST'></p>";

		// Safari can't handle uppercase or unicode characters when
		// in quirks mode.
		if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
			return;
		}

		Sizzle = function( query, context, extra, seed ) {
			context = context || document;

			// Only use querySelectorAll on non-XML documents
			// (ID selectors don't work in non-HTML documents)
			if ( !seed && !Sizzle.isXML(context) ) {
				// See if we find a selector to speed up
				var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );

				if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
					// Speed-up: Sizzle("TAG")
					if ( match[1] ) {
						return makeArray( context.getElementsByTagName( query ), extra );

					// Speed-up: Sizzle(".CLASS")
					} else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
						return makeArray( context.getElementsByClassName( match[2] ), extra );
					}
				}

				if ( context.nodeType === 9 ) {
					// Speed-up: Sizzle("body")
					// The body element only exists once, optimize finding it
					if ( query === "body" && context.body ) {
						return makeArray( [ context.body ], extra );

					// Speed-up: Sizzle("#ID")
					} else if ( match && match[3] ) {
						var elem = context.getElementById( match[3] );

						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document #6963
						if ( elem && elem.parentNode ) {
							// Handle the case where IE and Opera return items
							// by name instead of ID
							if ( elem.id === match[3] ) {
								return makeArray( [ elem ], extra );
							}

						} else {
							return makeArray( [], extra );
						}
					}

					try {
						return makeArray( context.querySelectorAll(query), extra );
					} catch(qsaError) {}

				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				} else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					var oldContext = context,
						old = context.getAttribute( "id" ),
						nid = old || id,
						hasParent = context.parentNode,
						relativeHierarchySelector = /^\s*[+~]/.test( query );

					if ( !old ) {
						context.setAttribute( "id", nid );
					} else {
						nid = nid.replace( /'/g, "\\$&" );
					}
					if ( relativeHierarchySelector && hasParent ) {
						context = context.parentNode;
					}

					try {
						if ( !relativeHierarchySelector || hasParent ) {
							return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
						}

					} catch(pseudoError) {
					} finally {
						if ( !old ) {
							oldContext.removeAttribute( "id" );
						}
					}
				}
			}

			return oldSizzle(query, context, extra, seed);
		};

		for ( var prop in oldSizzle ) {
			Sizzle[ prop ] = oldSizzle[ prop ];
		}

		// release memory in IE
		div = null;
	})();
}

(function(){
	var html = document.documentElement,
		matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

	if ( matches ) {
		// Check to see if it's possible to do matchesSelector
		// on a disconnected node (IE 9 fails this)
		var disconnectedMatch = !matches.call( document.createElement( "div" ), "div" ),
			pseudoWorks = false;

		try {
			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( document.documentElement, "[test!='']:sizzle" );

		} catch( pseudoError ) {
			pseudoWorks = true;
		}

		Sizzle.matchesSelector = function( node, expr ) {
			// Make sure that attribute selectors are quoted
			expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

			if ( !Sizzle.isXML( node ) ) {
				try {
					if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
						var ret = matches.call( node, expr );

						// IE 9's matchesSelector returns false on disconnected nodes
						if ( ret || !disconnectedMatch ||
								// As well, disconnected nodes are said to be in a document
								// fragment in IE 9, so check for that
								node.document && node.document.nodeType !== 11 ) {
							return ret;
						}
					}
				} catch(e) {}
			}

			return Sizzle(expr, null, null, [node]).length > 0;
		};
	}
})();

(function(){
	var div = document.createElement("div");

	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	// Opera can't find a second classname (in 9.6)
	// Also, make sure that getElementsByClassName actually exists
	if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
		return;
	}

	// Safari caches class attributes, doesn't catch changes (in 3.2)
	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 ) {
		return;
	}

	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function( match, context, isXML ) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};

	// release memory in IE
	div = null;
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem[ expando ] === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem[ expando ] = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName.toLowerCase() === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem[ expando ] === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem[ expando ] = doneName;
						elem.sizset = i;
					}

					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

if ( document.documentElement.contains ) {
	Sizzle.contains = function( a, b ) {
		return a !== b && (a.contains ? a.contains(b) : true);
	};

} else if ( document.documentElement.compareDocumentPosition ) {
	Sizzle.contains = function( a, b ) {
		return !!(a.compareDocumentPosition(b) & 16);
	};

} else {
	Sizzle.contains = function() {
		return false;
	};
}

Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function( selector, context, seed ) {
	var match,
		tmpSet = [],
		later = "",
		root = context.nodeType ? [context] : context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet, seed );
	}

	return Sizzle.filter( later, tmpSet );
};

// EXPOSE
// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
Sizzle.selectors.attrMap = {};
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.filters;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})();


var runtil = /Until$/,
	rparentsprev = /^(?:parents|prevUntil|prevAll)/,
	// Note: This RegExp should be improved, or likely pulled from Sizzle
	rmultiselector = /,/,
	isSimple = /^.[^:#\[\.,]*$/,
	slice = Array.prototype.slice,
	POS = jQuery.expr.match.globalPOS,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var self = this,
			i, l;

		if ( typeof selector !== "string" ) {
			return jQuery( selector ).filter(function() {
				for ( i = 0, l = self.length; i < l; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			});
		}

		var ret = this.pushStack( "", "find", selector ),
			length, n, r;

		for ( i = 0, l = this.length; i < l; i++ ) {
			length = ret.length;
			jQuery.find( selector, this[i], ret );

			if ( i > 0 ) {
				// Make sure that the results are unique
				for ( n = length; n < ret.length; n++ ) {
					for ( r = 0; r < length; r++ ) {
						if ( ret[r] === ret[n] ) {
							ret.splice(n--, 1);
							break;
						}
					}
				}
			}
		}

		return ret;
	},

	has: function( target ) {
		var targets = jQuery( target );
		return this.filter(function() {
			for ( var i = 0, l = targets.length; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false), "not", selector);
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true), "filter", selector );
	},

	is: function( selector ) {
		return !!selector && (
			typeof selector === "string" ?
				// If this is a positional selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				POS.test( selector ) ?
					jQuery( selector, this.context ).index( this[0] ) >= 0 :
					jQuery.filter( selector, this ).length > 0 :
				this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var ret = [], i, l, cur = this[0];

		// Array (deprecated as of jQuery 1.7)
		if ( jQuery.isArray( selectors ) ) {
			var level = 1;

			while ( cur && cur.ownerDocument && cur !== context ) {
				for ( i = 0; i < selectors.length; i++ ) {

					if ( jQuery( cur ).is( selectors[ i ] ) ) {
						ret.push({ selector: selectors[ i ], elem: cur, level: level });
					}
				}

				cur = cur.parentNode;
				level++;
			}

			return ret;
		}

		// String
		var pos = POS.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( i = 0, l = this.length; i < l; i++ ) {
			cur = this[i];

			while ( cur ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;

				} else {
					cur = cur.parentNode;
					if ( !cur || !cur.ownerDocument || cur === context || cur.nodeType === 11 ) {
						break;
					}
				}
			}
		}

		ret = ret.length > 1 ? jQuery.unique( ret ) : ret;

		return this.pushStack( ret, "closest", selectors );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
			all :
			jQuery.unique( all ) );
	},

	andSelf: function() {
		return this.add( this.prevObject );
	}
});

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
	return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return jQuery.nth( elem, 2, "nextSibling" );
	},
	prev: function( elem ) {
		return jQuery.nth( elem, 2, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.makeArray( elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( (this.length > 1 || rmultiselector.test( selector )) && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret, name, slice.call( arguments ).join(",") );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	nth: function( cur, result, dir, elem ) {
		result = result || 1;
		var num = 0;

		for ( ; cur; cur = cur[dir] ) {
			if ( cur.nodeType === 1 && ++num === result ) {
				break;
			}
		}

		return cur;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

	// Can't pass null or undefined to indexOf in Firefox 4
	// Set to 0 to skip string check
	qualifier = qualifier || 0;

	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem, i ) {
			return ( elem === qualifier ) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem, i ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
	});
}




function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
	safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style)/i,
	rnocache = /<(?:script|object|embed|option|style)/i,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /\/(java|ecma)script/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)/,
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		area: [ 1, "<map>", "</map>" ],
		_default: [ 0, "", "" ]
	},
	safeFragment = createSafeFragment( document );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE can't serialize <link> and <script> tags normally
if ( !jQuery.support.htmlSerialize ) {
	wrapMap._default = [ 1, "div<div>", "</div>" ];
}

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this );
			});
		} else if ( arguments.length ) {
			var set = jQuery.clean( arguments );
			set.push.apply( set, this.toArray() );
			return this.pushStack( set, "before", arguments );
		}
	},

	after: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			});
		} else if ( arguments.length ) {
			var set = this.pushStack( this, "after", arguments );
			set.push.apply( set, jQuery.clean(arguments) );
			return set;
		}
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( elem.getElementsByTagName("*") );
					jQuery.cleanData( [ elem ] );
				}

				if ( elem.parentNode ) {
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( elem.getElementsByTagName("*") );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					null;
			}


			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( elem.getElementsByTagName( "*" ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function( value ) {
		if ( this[0] && this[0].parentNode ) {
			// Make sure that the elements are removed from the DOM before they are inserted
			// this can help fix replacing a parent with child elements
			if ( jQuery.isFunction( value ) ) {
				return this.each(function(i) {
					var self = jQuery(this), old = self.html();
					self.replaceWith( value.call( this, i, old ) );
				});
			}

			if ( typeof value !== "string" ) {
				value = jQuery( value ).detach();
			}

			return this.each(function() {
				var next = this.nextSibling,
					parent = this.parentNode;

				jQuery( this ).remove();

				if ( next ) {
					jQuery(next).before( value );
				} else {
					jQuery(parent).append( value );
				}
			});
		} else {
			return this.length ?
				this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value ) :
				this;
		}
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {
		var results, first, fragment, parent,
			value = args[0],
			scripts = [];

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( !jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test( value ) ) {
			return this.each(function() {
				jQuery(this).domManip( args, table, callback, true );
			});
		}

		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				args[0] = value.call(this, i, table ? self.html() : undefined);
				self.domManip( args, table, callback );
			});
		}

		if ( this[0] ) {
			parent = value && value.parentNode;

			// If we're in a fragment, just use that instead of building a new one
			if ( jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length ) {
				results = { fragment: parent };

			} else {
				results = jQuery.buildFragment( args, this, scripts );
			}

			fragment = results.fragment;

			if ( fragment.childNodes.length === 1 ) {
				first = fragment = fragment.firstChild;
			} else {
				first = fragment.firstChild;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );

				for ( var i = 0, l = this.length, lastIndex = l - 1; i < l; i++ ) {
					callback.call(
						table ?
							root(this[i], first) :
							this[i],
						// Make sure that we do not leak memory by inadvertently discarding
						// the original fragment (which might have attached data) instead of
						// using it; in addition, use the original fragment object for the last
						// item instead of first because it can end up being emptied incorrectly
						// in certain situations (Bug #8070).
						// Fragments from the fragment cache must always be cloned and never used
						// in place.
						results.cacheable || ( l > 1 && i < lastIndex ) ?
							jQuery.clone( fragment, true, true ) :
							fragment
					);
				}
			}

			if ( scripts.length ) {
				jQuery.each( scripts, function( i, elem ) {
					if ( elem.src ) {
						jQuery.ajax({
							type: "GET",
							global: false,
							url: elem.src,
							async: false,
							dataType: "script"
						});
					} else {
						jQuery.globalEval( ( elem.text || elem.textContent || elem.innerHTML || "" ).replace( rcleanScript, "/*$0*/" ) );
					}

					if ( elem.parentNode ) {
						elem.parentNode.removeChild( elem );
					}
				});
			}
		}

		return this;
	}
});

function root( elem, cur ) {
	return jQuery.nodeName(elem, "table") ?
		(elem.getElementsByTagName("tbody")[0] ||
		elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
		elem;
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function cloneFixAttributes( src, dest ) {
	var nodeName;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	// clearAttributes removes the attributes, which we don't want,
	// but also removes the attachEvent events, which we *do* want
	if ( dest.clearAttributes ) {
		dest.clearAttributes();
	}

	// mergeAttributes, in contrast, only merges back on the
	// original attributes, not the events
	if ( dest.mergeAttributes ) {
		dest.mergeAttributes( src );
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 fail to clone children inside object elements that use
	// the proprietary classid attribute value (rather than the type
	// attribute) to identify the type of content to display
	if ( nodeName === "object" ) {
		dest.outerHTML = src.outerHTML;

	} else if ( nodeName === "input" && (src.type === "checkbox" || src.type === "radio") ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set
		if ( src.checked ) {
			dest.defaultChecked = dest.checked = src.checked;
		}

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;

	// IE blanks contents when cloning scripts
	} else if ( nodeName === "script" && dest.text !== src.text ) {
		dest.text = src.text;
	}

	// Event data gets referenced instead of copied if the expando
	// gets copied too
	dest.removeAttribute( jQuery.expando );

	// Clear flags for bubbling special change/submit events, they must
	// be reattached when the newly cloned events are first activated
	dest.removeAttribute( "_submit_attached" );
	dest.removeAttribute( "_change_attached" );
}

jQuery.buildFragment = function( args, nodes, scripts ) {
	var fragment, cacheable, cacheresults, doc,
	first = args[ 0 ];

	// nodes may contain either an explicit document object,
	// a jQuery collection or context object.
	// If nodes[0] contains a valid object to assign to doc
	if ( nodes && nodes[0] ) {
		doc = nodes[0].ownerDocument || nodes[0];
	}

	// Ensure that an attr object doesn't incorrectly stand in as a document object
	// Chrome and Firefox seem to allow this to occur and will throw exception
	// Fixes #8950
	if ( !doc.createDocumentFragment ) {
		doc = document;
	}

	// Only cache "small" (1/2 KB) HTML strings that are associated with the main document
	// Cloning options loses the selected state, so don't cache them
	// IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
	// Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
	// Lastly, IE6,7,8 will not correctly reuse cached fragments that were created from unknown elems #10501
	if ( args.length === 1 && typeof first === "string" && first.length < 512 && doc === document &&
		first.charAt(0) === "<" && !rnocache.test( first ) &&
		(jQuery.support.checkClone || !rchecked.test( first )) &&
		(jQuery.support.html5Clone || !rnoshimcache.test( first )) ) {

		cacheable = true;

		cacheresults = jQuery.fragments[ first ];
		if ( cacheresults && cacheresults !== 1 ) {
			fragment = cacheresults;
		}
	}

	if ( !fragment ) {
		fragment = doc.createDocumentFragment();
		jQuery.clean( args, doc, fragment, scripts );
	}

	if ( cacheable ) {
		jQuery.fragments[ first ] = cacheresults ? fragment : 1;
	}

	return { fragment: fragment, cacheable: cacheable };
};

jQuery.fragments = {};

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var ret = [],
			insert = jQuery( selector ),
			parent = this.length === 1 && this[0].parentNode;

		if ( parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1 ) {
			insert[ original ]( this[0] );
			return this;

		} else {
			for ( var i = 0, l = insert.length; i < l; i++ ) {
				var elems = ( i > 0 ? this.clone(true) : this ).get();
				jQuery( insert[i] )[ original ]( elems );
				ret = ret.concat( elems );
			}

			return this.pushStack( ret, name, insert.selector );
		}
	};
});

function getAll( elem ) {
	if ( typeof elem.getElementsByTagName !== "undefined" ) {
		return elem.getElementsByTagName( "*" );

	} else if ( typeof elem.querySelectorAll !== "undefined" ) {
		return elem.querySelectorAll( "*" );

	} else {
		return [];
	}
}

// Used in clean, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( elem.type === "checkbox" || elem.type === "radio" ) {
		elem.defaultChecked = elem.checked;
	}
}
// Finds all inputs and passes them to fixDefaultChecked
function findInputs( elem ) {
	var nodeName = ( elem.nodeName || "" ).toLowerCase();
	if ( nodeName === "input" ) {
		fixDefaultChecked( elem );
	// Skip scripts, get other children
	} else if ( nodeName !== "script" && typeof elem.getElementsByTagName !== "undefined" ) {
		jQuery.grep( elem.getElementsByTagName("input"), fixDefaultChecked );
	}
}

// Derived From: http://www.iecss.com/shimprove/javascript/shimprove.1-0-1.js
function shimCloneNode( elem ) {
	var div = document.createElement( "div" );
	safeFragment.appendChild( div );

	div.innerHTML = elem.outerHTML;
	return div.firstChild;
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var srcElements,
			destElements,
			i,
			// IE<=8 does not properly clone detached, unknown element nodes
			clone = jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ?
				elem.cloneNode( true ) :
				shimCloneNode( elem );

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
			// IE copies events bound via attachEvent when using cloneNode.
			// Calling detachEvent on the clone will also remove the events
			// from the original. In order to get around this, we use some
			// proprietary methods to clear the events. Thanks to MooTools
			// guys for this hotness.

			cloneFixAttributes( elem, clone );

			// Using Sizzle here is crazy slow, so we use getElementsByTagName instead
			srcElements = getAll( elem );
			destElements = getAll( clone );

			// Weird iteration because IE will replace the length property
			// with an element if you are cloning the body and one of the
			// elements on the page has a name or id of "length"
			for ( i = 0; srcElements[i]; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					cloneFixAttributes( srcElements[i], destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			cloneCopyEvent( elem, clone );

			if ( deepDataAndEvents ) {
				srcElements = getAll( elem );
				destElements = getAll( clone );

				for ( i = 0; srcElements[i]; ++i ) {
					cloneCopyEvent( srcElements[i], destElements[i] );
				}
			}
		}

		srcElements = destElements = null;

		// Return the cloned set
		return clone;
	},

	clean: function( elems, context, fragment, scripts ) {
		var checkScriptType, script, j,
				ret = [];

		context = context || document;

		// !context.createElement fails in IE with an error but returns typeof 'object'
		if ( typeof context.createElement === "undefined" ) {
			context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
		}

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( typeof elem === "number" ) {
				elem += "";
			}

			if ( !elem ) {
				continue;
			}

			// Convert html string into DOM nodes
			if ( typeof elem === "string" ) {
				if ( !rhtml.test( elem ) ) {
					elem = context.createTextNode( elem );
				} else {
					// Fix "XHTML"-style tags in all browsers
					elem = elem.replace(rxhtmlTag, "<$1></$2>");

					// Trim whitespace, otherwise indexOf won't work as expected
					var tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase(),
						wrap = wrapMap[ tag ] || wrapMap._default,
						depth = wrap[0],
						div = context.createElement("div"),
						safeChildNodes = safeFragment.childNodes,
						remove;

					// Append wrapper element to unknown element safe doc fragment
					if ( context === document ) {
						// Use the fragment we've already created for this document
						safeFragment.appendChild( div );
					} else {
						// Use a fragment created with the owner document
						createSafeFragment( context ).appendChild( div );
					}

					// Go to html and back, then peel off extra wrappers
					div.innerHTML = wrap[1] + elem + wrap[2];

					// Move to the right depth
					while ( depth-- ) {
						div = div.lastChild;
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						var hasBody = rtbody.test(elem),
							tbody = tag === "table" && !hasBody ?
								div.firstChild && div.firstChild.childNodes :

								// String was a bare <thead> or <tfoot>
								wrap[1] === "<table>" && !hasBody ?
									div.childNodes :
									[];

						for ( j = tbody.length - 1; j >= 0 ; --j ) {
							if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
								tbody[ j ].parentNode.removeChild( tbody[ j ] );
							}
						}
					}

					// IE completely kills leading whitespace when innerHTML is used
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
					}

					elem = div.childNodes;

					// Clear elements from DocumentFragment (safeFragment or otherwise)
					// to avoid hoarding elements. Fixes #11356
					if ( div ) {
						div.parentNode.removeChild( div );

						// Guard against -1 index exceptions in FF3.6
						if ( safeChildNodes.length > 0 ) {
							remove = safeChildNodes[ safeChildNodes.length - 1 ];

							if ( remove && remove.parentNode ) {
								remove.parentNode.removeChild( remove );
							}
						}
					}
				}
			}

			// Resets defaultChecked for any radios and checkboxes
			// about to be appended to the DOM in IE 6/7 (#8060)
			var len;
			if ( !jQuery.support.appendChecked ) {
				if ( elem[0] && typeof (len = elem.length) === "number" ) {
					for ( j = 0; j < len; j++ ) {
						findInputs( elem[j] );
					}
				} else {
					findInputs( elem );
				}
			}

			if ( elem.nodeType ) {
				ret.push( elem );
			} else {
				ret = jQuery.merge( ret, elem );
			}
		}

		if ( fragment ) {
			checkScriptType = function( elem ) {
				return !elem.type || rscriptType.test( elem.type );
			};
			for ( i = 0; ret[i]; i++ ) {
				script = ret[i];
				if ( scripts && jQuery.nodeName( script, "script" ) && (!script.type || rscriptType.test( script.type )) ) {
					scripts.push( script.parentNode ? script.parentNode.removeChild( script ) : script );

				} else {
					if ( script.nodeType === 1 ) {
						var jsTags = jQuery.grep( script.getElementsByTagName( "script" ), checkScriptType );

						ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
					}
					fragment.appendChild( script );
				}
			}
		}

		return ret;
	},

	cleanData: function( elems ) {
		var data, id,
			cache = jQuery.cache,
			special = jQuery.event.special,
			deleteExpando = jQuery.support.deleteExpando;

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
				continue;
			}

			id = elem[ jQuery.expando ];

			if ( id ) {
				data = cache[ id ];

				if ( data && data.events ) {
					for ( var type in data.events ) {
						if ( special[ type ] ) {
							jQuery.event.remove( elem, type );

						// This is a shortcut to avoid jQuery.event.remove's overhead
						} else {
							jQuery.removeEvent( elem, type, data.handle );
						}
					}

					// Null the DOM reference to avoid IE6/7/8 leak (#7054)
					if ( data.handle ) {
						data.handle.elem = null;
					}
				}

				if ( deleteExpando ) {
					delete elem[ jQuery.expando ];

				} else if ( elem.removeAttribute ) {
					elem.removeAttribute( jQuery.expando );
				}

				delete cache[ id ];
			}
		}
	}
});




var ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity=([^)]*)/,
	// fixed for IE9, see #8346
	rupper = /([A-Z]|^ms)/g,
	rnum = /^[\-+]?(?:\d*\.)?\d+$/i,
	rnumnonpx = /^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i,
	rrelNum = /^([\-+])=([\-+.\de]+)/,
	rmargin = /^margin/,

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },

	// order is important!
	cssExpand = [ "Top", "Right", "Bottom", "Left" ],

	curCSS,

	getComputedStyle,
	currentStyle;

jQuery.fn.css = function( name, value ) {
	return jQuery.access( this, function( elem, name, value ) {
		return value !== undefined ?
			jQuery.style( elem, name, value ) :
			jQuery.css( elem, name );
	}, name, value, arguments.length > 1 );
};

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;

				} else {
					return elem.style.opacity;
				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, origName = jQuery.camelCase( name ),
			style = elem.style, hooks = jQuery.cssHooks[ origName ];

		name = jQuery.cssProps[ origName ] || origName;

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( +( ret[1] + 1) * +ret[2] ) + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value )) !== undefined ) {
				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra ) {
		var ret, hooks;

		// Make sure that we're working with the right name
		name = jQuery.camelCase( name );
		hooks = jQuery.cssHooks[ name ];
		name = jQuery.cssProps[ name ] || name;

		// cssFloat needs a special treatment
		if ( name === "cssFloat" ) {
			name = "float";
		}

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks && (ret = hooks.get( elem, true, extra )) !== undefined ) {
			return ret;

		// Otherwise, if a way to get the computed value exists, use that
		} else if ( curCSS ) {
			return curCSS( elem, name );
		}
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback ) {
		var old = {},
			ret, name;

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.call( elem );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

// DEPRECATED in 1.3, Use jQuery.css() instead
jQuery.curCSS = jQuery.css;

if ( document.defaultView && document.defaultView.getComputedStyle ) {
	getComputedStyle = function( elem, name ) {
		var ret, defaultView, computedStyle, width,
			style = elem.style;

		name = name.replace( rupper, "-$1" ).toLowerCase();

		if ( (defaultView = elem.ownerDocument.defaultView) &&
				(computedStyle = defaultView.getComputedStyle( elem, null )) ) {

			ret = computedStyle.getPropertyValue( name );
			if ( ret === "" && !jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
				ret = jQuery.style( elem, name );
			}
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// WebKit uses "computed value (percentage if specified)" instead of "used value" for margins
		// which is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
		if ( !jQuery.support.pixelMargin && computedStyle && rmargin.test( name ) && rnumnonpx.test( ret ) ) {
			width = style.width;
			style.width = ret;
			ret = computedStyle.width;
			style.width = width;
		}

		return ret;
	};
}

if ( document.documentElement.currentStyle ) {
	currentStyle = function( elem, name ) {
		var left, rsLeft, uncomputed,
			ret = elem.currentStyle && elem.currentStyle[ name ],
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && (uncomputed = style[ name ]) ) {
			ret = uncomputed;
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		if ( rnumnonpx.test( ret ) ) {

			// Remember the original values
			left = style.left;
			rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				elem.runtimeStyle.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				elem.runtimeStyle.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

curCSS = getComputedStyle || currentStyle;

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property
	var val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		i = name === "width" ? 1 : 0,
		len = 4;

	if ( val > 0 ) {
		if ( extra !== "border" ) {
			for ( ; i < len; i += 2 ) {
				if ( !extra ) {
					val -= parseFloat( jQuery.css( elem, "padding" + cssExpand[ i ] ) ) || 0;
				}
				if ( extra === "margin" ) {
					val += parseFloat( jQuery.css( elem, extra + cssExpand[ i ] ) ) || 0;
				} else {
					val -= parseFloat( jQuery.css( elem, "border" + cssExpand[ i ] + "Width" ) ) || 0;
				}
			}
		}

		return val + "px";
	}

	// Fall back to computed then uncomputed css if necessary
	val = curCSS( elem, name );
	if ( val < 0 || val == null ) {
		val = elem.style[ name ];
	}

	// Computed unit is not pixels. Stop here and return.
	if ( rnumnonpx.test(val) ) {
		return val;
	}

	// Normalize "", auto, and prepare for extra
	val = parseFloat( val ) || 0;

	// Add padding, border, margin
	if ( extra ) {
		for ( ; i < len; i += 2 ) {
			val += parseFloat( jQuery.css( elem, "padding" + cssExpand[ i ] ) ) || 0;
			if ( extra !== "padding" ) {
				val += parseFloat( jQuery.css( elem, "border" + cssExpand[ i ] + "Width" ) ) || 0;
			}
			if ( extra === "margin" ) {
				val += parseFloat( jQuery.css( elem, extra + cssExpand[ i ]) ) || 0;
			}
		}
	}

	return val + "px";
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				if ( elem.offsetWidth !== 0 ) {
					return getWidthOrHeight( elem, name, extra );
				} else {
					return jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					});
				}
			}
		},

		set: function( elem, value ) {
			return rnum.test( value ) ?
				value + "px" :
				value;
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( parseFloat( RegExp.$1 ) / 100 ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			if ( value >= 1 && jQuery.trim( filter.replace( ralpha, "" ) ) === "" ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there there is no filter style applied in a css rule, we are done
				if ( currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

jQuery(function() {
	// This hook cannot be added until DOM ready because the support test
	// for it is not run until after DOM ready
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				// Work around by temporarily setting element display to inline-block
				return jQuery.swap( elem, { "display": "inline-block" }, function() {
					if ( computed ) {
						return curCSS( elem, "margin-right" );
					} else {
						return elem.style.marginRight;
					}
				});
			}
		};
	}
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		var width = elem.offsetWidth,
			height = elem.offsetHeight;

		return ( width === 0 && height === 0 ) || (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {

	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i,

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ],
				expanded = {};

			for ( i = 0; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};
});




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rhash = /#.*$/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rquery = /\?/,
	rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	rselectTextarea = /^(?:select|textarea)/i,
	rspacesAjax = /\s+/,
	rts = /([?&])_=[^&]*/,
	rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Document location
	ajaxLocation,

	// Document location segments
	ajaxLocParts,

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = ["*/"] + ["*"];

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		if ( jQuery.isFunction( func ) ) {
			var dataTypes = dataTypeExpression.toLowerCase().split( rspacesAjax ),
				i = 0,
				length = dataTypes.length,
				dataType,
				list,
				placeBefore;

			// For each dataType in the dataTypeExpression
			for ( ; i < length; i++ ) {
				dataType = dataTypes[ i ];
				// We control if we're asked to add before
				// any existing element
				placeBefore = /^\+/.test( dataType );
				if ( placeBefore ) {
					dataType = dataType.substr( 1 ) || "*";
				}
				list = structure[ dataType ] = structure[ dataType ] || [];
				// then we add to the structure accordingly
				list[ placeBefore ? "unshift" : "push" ]( func );
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR,
		dataType /* internal */, inspected /* internal */ ) {

	dataType = dataType || options.dataTypes[ 0 ];
	inspected = inspected || {};

	inspected[ dataType ] = true;

	var list = structure[ dataType ],
		i = 0,
		length = list ? list.length : 0,
		executeOnly = ( structure === prefilters ),
		selection;

	for ( ; i < length && ( executeOnly || !selection ); i++ ) {
		selection = list[ i ]( options, originalOptions, jqXHR );
		// If we got redirected to another dataType
		// we try there if executing only and not done already
		if ( typeof selection === "string" ) {
			if ( !executeOnly || inspected[ selection ] ) {
				selection = undefined;
			} else {
				options.dataTypes.unshift( selection );
				selection = inspectPrefiltersOrTransports(
						structure, options, originalOptions, jqXHR, selection, inspected );
			}
		}
	}
	// If we're only executing or nothing was selected
	// we try the catchall dataType if not done already
	if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
		selection = inspectPrefiltersOrTransports(
				structure, options, originalOptions, jqXHR, "*", inspected );
	}
	// unnecessary when only executing (prefilters)
	// but it'll be ignored by the caller in that case
	return selection;
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};
	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}
}

jQuery.fn.extend({
	load: function( url, params, callback ) {
		if ( typeof url !== "string" && _load ) {
			return _load.apply( this, arguments );

		// Don't do a request if no elements are being requested
		} else if ( !this.length ) {
			return this;
		}

		var off = url.indexOf( " " );
		if ( off >= 0 ) {
			var selector = url.slice( off, url.length );
			url = url.slice( 0, off );
		}

		// Default to a GET request
		var type = "GET";

		// If the second parameter was provided
		if ( params ) {
			// If it's a function
			if ( jQuery.isFunction( params ) ) {
				// We assume that it's the callback
				callback = params;
				params = undefined;

			// Otherwise, build a param string
			} else if ( typeof params === "object" ) {
				params = jQuery.param( params, jQuery.ajaxSettings.traditional );
				type = "POST";
			}
		}

		var self = this;

		// Request the remote document
		jQuery.ajax({
			url: url,
			type: type,
			dataType: "html",
			data: params,
			// Complete callback (responseText is used internally)
			complete: function( jqXHR, status, responseText ) {
				// Store the response as specified by the jqXHR object
				responseText = jqXHR.responseText;
				// If successful, inject the HTML into all the matched elements
				if ( jqXHR.isResolved() ) {
					// #4825: Get the actual response in case
					// a dataFilter is present in ajaxSettings
					jqXHR.done(function( r ) {
						responseText = r;
					});
					// See if a selector was specified
					self.html( selector ?
						// Create a dummy div to hold the results
						jQuery("<div>")
							// inject the contents of the document in, removing the scripts
							// to avoid any 'Permission Denied' errors in IE
							.append(responseText.replace(rscript, ""))

							// Locate the specified elements
							.find(selector) :

						// If not, just inject the full result
						responseText );
				}

				if ( callback ) {
					self.each( callback, [ responseText, status, jqXHR ] );
				}
			}
		});

		return this;
	},

	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},

	serializeArray: function() {
		return this.map(function(){
			return this.elements ? jQuery.makeArray( this.elements ) : this;
		})
		.filter(function(){
			return this.name && !this.disabled &&
				( this.checked || rselectTextarea.test( this.nodeName ) ||
					rinput.test( this.type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val, i ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
	jQuery.fn[ o ] = function( f ){
		return this.on( o, f );
	};
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			type: method,
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	};
});

jQuery.extend({

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		if ( settings ) {
			// Building a settings object
			ajaxExtend( target, jQuery.ajaxSettings );
		} else {
			// Extending ajaxSettings
			settings = target;
			target = jQuery.ajaxSettings;
		}
		ajaxExtend( target, settings );
		return target;
	},

	ajaxSettings: {
		url: ajaxLocation,
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		traditional: false,
		headers: {},
		*/

		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			text: "text/plain",
			json: "application/json, text/javascript",
			"*": allTypes
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// List of data converters
		// 1) key format is "source_type destination_type" (a single space in-between)
		// 2) the catchall symbol "*" can be used for source_type
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			context: true,
			url: true
		}
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events
			// It's the callbackContext if one was provided in the options
			// and if it's a DOM node or a jQuery collection
			globalEventContext = callbackContext !== s &&
				( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
						jQuery( callbackContext ) : jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// ifModified key
			ifModifiedKey,
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// Response headers
			responseHeadersString,
			responseHeaders,
			// transport
			transport,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// The jqXHR state
			state = 0,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Fake xhr
			jqXHR = {

				readyState: 0,

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( !state ) {
						var lname = name.toLowerCase();
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match === undefined ? null : match;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					statusText = statusText || "abort";
					if ( transport ) {
						transport.abort( statusText );
					}
					done( 0, statusText );
					return this;
				}
			};

		// Callback for when everything is done
		// It is defined here because jslint complains if it is declared
		// at the end of the function (which would be more logical and readable)
		function done( status, nativeStatusText, responses, headers ) {

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			var isSuccess,
				success,
				error,
				statusText = nativeStatusText,
				response = responses ? ajaxHandleResponses( s, jqXHR, responses ) : undefined,
				lastModified,
				etag;

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {

					if ( ( lastModified = jqXHR.getResponseHeader( "Last-Modified" ) ) ) {
						jQuery.lastModified[ ifModifiedKey ] = lastModified;
					}
					if ( ( etag = jqXHR.getResponseHeader( "Etag" ) ) ) {
						jQuery.etag[ ifModifiedKey ] = etag;
					}
				}

				// If not modified
				if ( status === 304 ) {

					statusText = "notmodified";
					isSuccess = true;

				// If we have data
				} else {

					try {
						success = ajaxConvert( s, response );
						statusText = "success";
						isSuccess = true;
					} catch(e) {
						// We have a parsererror
						statusText = "parsererror";
						error = e;
					}
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( !statusText || status ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = "" + ( nativeStatusText || statusText );

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
						[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		// Attach deferreds
		deferred.promise( jqXHR );
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;
		jqXHR.complete = completeDeferred.add;

		// Status-dependent callbacks
		jqXHR.statusCode = function( map ) {
			if ( map ) {
				var tmp;
				if ( state < 2 ) {
					for ( tmp in map ) {
						statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
					}
				} else {
					tmp = map[ jqXHR.status ];
					jqXHR.then( tmp, tmp );
				}
			}
			return this;
		};

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// We also use the url parameter if available
		s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( rspacesAjax );

		// Determine if a cross-domain request is in order
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] != ajaxLocParts[ 1 ] || parts[ 2 ] != ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return false;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Get ifModifiedKey before adding the anti-cache parameter
			ifModifiedKey = s.url;

			// Add anti-cache in url if needed
			if ( s.cache === false ) {

				var ts = jQuery.now(),
					// try replacing _= if it is there
					ret = s.url.replace( rts, "$1_=" + ts );

				// if nothing was replaced, add timestamp to the end
				s.url = ret + ( ( ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			ifModifiedKey = ifModifiedKey || s.url;
			if ( jQuery.lastModified[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ ifModifiedKey ] );
			}
			if ( jQuery.etag[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ ifModifiedKey ] );
			}
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
				// Abort if not done already
				jqXHR.abort();
				return false;

		}

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;
			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout( function(){
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch (e) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		return jqXHR;
	},

	// Serialize an array of form elements or a set of
	// key/values into a query string
	param: function( a, traditional ) {
		var s = [],
			add = function( key, value ) {
				// If value is a function, invoke it and return its value
				value = jQuery.isFunction( value ) ? value() : value;
				s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
			};

		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings.traditional;
		}

		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			});

		} else {
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( var prefix in a ) {
				buildParams( prefix, a[ prefix ], traditional, add );
			}
		}

		// Return the resulting serialization
		return s.join( "&" ).replace( r20, "+" );
	}
});

function buildParams( prefix, obj, traditional, add ) {
	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// If array item is non-scalar (array or object), encode its
				// numeric index to resolve deserialization ambiguity issues.
				// Note that rack (as of 1.0.0) can't currently deserialize
				// nested arrays properly, and attempting to do so may cause
				// a server error. Possible fixes are to modify rack's
				// deserialization algorithm or to provide an option or flag
				// to force array serialization to be shallow.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( var name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// This is still on the jQuery object... for now
// Want to move this to jQuery.ajax some day
jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {}

});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields,
		ct,
		type,
		finalDataType,
		firstDataType;

	// Fill responseXXX fields
	for ( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	var dataTypes = s.dataTypes,
		converters = {},
		i,
		key,
		length = dataTypes.length,
		tmp,
		// Current and previous dataTypes
		current = dataTypes[ 0 ],
		prev,
		// Conversion expression
		conversion,
		// Conversion function
		conv,
		// Conversion functions (transitive conversion)
		conv1,
		conv2;

	// For each dataType in the chain
	for ( i = 1; i < length; i++ ) {

		// Create converters map
		// with lowercased keys
		if ( i === 1 ) {
			for ( key in s.converters ) {
				if ( typeof key === "string" ) {
					converters[ key.toLowerCase() ] = s.converters[ key ];
				}
			}
		}

		// Get the dataTypes
		prev = current;
		current = dataTypes[ i ];

		// If current is auto dataType, update it to prev
		if ( current === "*" ) {
			current = prev;
		// If no auto and dataTypes are actually different
		} else if ( prev !== "*" && prev !== current ) {

			// Get the converter
			conversion = prev + " " + current;
			conv = converters[ conversion ] || converters[ "* " + current ];

			// If there is no direct converter, search transitively
			if ( !conv ) {
				conv2 = undefined;
				for ( conv1 in converters ) {
					tmp = conv1.split( " " );
					if ( tmp[ 0 ] === prev || tmp[ 0 ] === "*" ) {
						conv2 = converters[ tmp[1] + " " + current ];
						if ( conv2 ) {
							conv1 = converters[ conv1 ];
							if ( conv1 === true ) {
								conv = conv2;
							} else if ( conv2 === true ) {
								conv = conv1;
							}
							break;
						}
					}
				}
			}
			// If we found no converter, dispatch an error
			if ( !( conv || conv2 ) ) {
				jQuery.error( "No conversion from " + conversion.replace(" "," to ") );
			}
			// If found converter is not an equivalence
			if ( conv !== true ) {
				// Convert with 1 or 2 converters accordingly
				response = conv ? conv( response ) : conv2( conv1(response) );
			}
		}
	}
	return response;
}




var jsc = jQuery.now(),
	jsre = /(\=)\?(&|$)|\?\?/i;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		return jQuery.expando + "_" + ( jsc++ );
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var inspectData = ( typeof s.data === "string" ) && /^application\/x\-www\-form\-urlencoded/.test( s.contentType );

	if ( s.dataTypes[ 0 ] === "jsonp" ||
		s.jsonp !== false && ( jsre.test( s.url ) ||
				inspectData && jsre.test( s.data ) ) ) {

		var responseContainer,
			jsonpCallback = s.jsonpCallback =
				jQuery.isFunction( s.jsonpCallback ) ? s.jsonpCallback() : s.jsonpCallback,
			previous = window[ jsonpCallback ],
			url = s.url,
			data = s.data,
			replace = "$1" + jsonpCallback + "$2";

		if ( s.jsonp !== false ) {
			url = url.replace( jsre, replace );
			if ( s.url === url ) {
				if ( inspectData ) {
					data = data.replace( jsre, replace );
				}
				if ( s.data === data ) {
					// Add callback manually
					url += (/\?/.test( url ) ? "&" : "?") + s.jsonp + "=" + jsonpCallback;
				}
			}
		}

		s.url = url;
		s.data = data;

		// Install callback
		window[ jsonpCallback ] = function( response ) {
			responseContainer = [ response ];
		};

		// Clean-up function
		jqXHR.always(function() {
			// Set callback back to previous value
			window[ jsonpCallback ] = previous;
			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( previous ) ) {
				window[ jsonpCallback ]( responseContainer[ 0 ] );
			}
		});

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( jsonpCallback + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Delegate to script
		return "script";
	}
});




// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /javascript|ecmascript/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement( "script" );

				script.async = "async";

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( head && script.parentNode ) {
							head.removeChild( script );
						}

						// Dereference the script
						script = undefined;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};
				// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
				// This arises when a base node is used (#2709 and #4378).
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( 0, 1 );
				}
			}
		};
	}
});




var // #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject ? function() {
		// Abort all pending requests
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( 0, 1 );
		}
	} : false,
	xhrId = 0,
	xhrCallbacks;

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
(function( xhr ) {
	jQuery.extend( jQuery.support, {
		ajax: !!xhr,
		cors: !!xhr && ( "withCredentials" in xhr )
	});
})( jQuery.ajaxSettings.xhr() );

// Create transport if the browser can provide an xhr
if ( jQuery.support.ajax ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var xhr = s.xhr(),
						handle,
						i;

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( _ ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {

						var status,
							statusText,
							responseHeaders,
							responses,
							xml;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occured
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();
									responses = {};
									xml = xhr.responseXML;

									// Construct response list
									if ( xml && xml.documentElement /* #4958 */ ) {
										responses.xml = xml;
									}

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									try {
										responses.text = xhr.responseText;
									} catch( _ ) {
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					// if we're in sync mode or it's in cache
					// and has been retrieved directly (IE6 & IE7)
					// we need to manually fire the callback
					if ( !s.async || xhr.readyState === 4 ) {
						callback();
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback(0,1);
					}
				}
			};
		}
	});
}




var elemdisplay = {},
	iframe, iframeDoc,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
	timerId,
	fxAttrs = [
		// height animations
		[ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
		// width animations
		[ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
		// opacity animations
		[ "opacity" ]
	],
	fxNow;

jQuery.fn.extend({
	show: function( speed, easing, callback ) {
		var elem, display;

		if ( speed || speed === 0 ) {
			return this.animate( genFx("show", 3), speed, easing, callback );

		} else {
			for ( var i = 0, j = this.length; i < j; i++ ) {
				elem = this[ i ];

				if ( elem.style ) {
					display = elem.style.display;

					// Reset the inline display of this element to learn if it is
					// being hidden by cascaded rules or not
					if ( !jQuery._data(elem, "olddisplay") && display === "none" ) {
						display = elem.style.display = "";
					}

					// Set elements which have been overridden with display: none
					// in a stylesheet to whatever the default browser style is
					// for such an element
					if ( (display === "" && jQuery.css(elem, "display") === "none") ||
						!jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
						jQuery._data( elem, "olddisplay", defaultDisplay(elem.nodeName) );
					}
				}
			}

			// Set the display of most of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				elem = this[ i ];

				if ( elem.style ) {
					display = elem.style.display;

					if ( display === "" || display === "none" ) {
						elem.style.display = jQuery._data( elem, "olddisplay" ) || "";
					}
				}
			}

			return this;
		}
	},

	hide: function( speed, easing, callback ) {
		if ( speed || speed === 0 ) {
			return this.animate( genFx("hide", 3), speed, easing, callback);

		} else {
			var elem, display,
				i = 0,
				j = this.length;

			for ( ; i < j; i++ ) {
				elem = this[i];
				if ( elem.style ) {
					display = jQuery.css( elem, "display" );

					if ( display !== "none" && !jQuery._data( elem, "olddisplay" ) ) {
						jQuery._data( elem, "olddisplay", display );
					}
				}
			}

			// Set the display of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				if ( this[i].style ) {
					this[i].style.display = "none";
				}
			}

			return this;
		}
	},

	// Save the old toggle function
	_toggle: jQuery.fn.toggle,

	toggle: function( fn, fn2, callback ) {
		var bool = typeof fn === "boolean";

		if ( jQuery.isFunction(fn) && jQuery.isFunction(fn2) ) {
			this._toggle.apply( this, arguments );

		} else if ( fn == null || bool ) {
			this.each(function() {
				var state = bool ? fn : jQuery(this).is(":hidden");
				jQuery(this)[ state ? "show" : "hide" ]();
			});

		} else {
			this.animate(genFx("toggle", 3), fn, fn2, callback);
		}

		return this;
	},

	fadeTo: function( speed, to, easing, callback ) {
		return this.filter(":hidden").css("opacity", 0).show().end()
					.animate({opacity: to}, speed, easing, callback);
	},

	animate: function( prop, speed, easing, callback ) {
		var optall = jQuery.speed( speed, easing, callback );

		if ( jQuery.isEmptyObject( prop ) ) {
			return this.each( optall.complete, [ false ] );
		}

		// Do not change referenced properties as per-property easing will be lost
		prop = jQuery.extend( {}, prop );

		function doAnimation() {
			// XXX 'this' does not always have a nodeName when running the
			// test suite

			if ( optall.queue === false ) {
				jQuery._mark( this );
			}

			var opt = jQuery.extend( {}, optall ),
				isElement = this.nodeType === 1,
				hidden = isElement && jQuery(this).is(":hidden"),
				name, val, p, e, hooks, replace,
				parts, start, end, unit,
				method;

			// will store per property easing and be used to determine when an animation is complete
			opt.animatedProperties = {};

			// first pass over propertys to expand / normalize
			for ( p in prop ) {
				name = jQuery.camelCase( p );
				if ( p !== name ) {
					prop[ name ] = prop[ p ];
					delete prop[ p ];
				}

				if ( ( hooks = jQuery.cssHooks[ name ] ) && "expand" in hooks ) {
					replace = hooks.expand( prop[ name ] );
					delete prop[ name ];

					// not quite $.extend, this wont overwrite keys already present.
					// also - reusing 'p' from above because we have the correct "name"
					for ( p in replace ) {
						if ( ! ( p in prop ) ) {
							prop[ p ] = replace[ p ];
						}
					}
				}
			}

			for ( name in prop ) {
				val = prop[ name ];
				// easing resolution: per property > opt.specialEasing > opt.easing > 'swing' (default)
				if ( jQuery.isArray( val ) ) {
					opt.animatedProperties[ name ] = val[ 1 ];
					val = prop[ name ] = val[ 0 ];
				} else {
					opt.animatedProperties[ name ] = opt.specialEasing && opt.specialEasing[ name ] || opt.easing || 'swing';
				}

				if ( val === "hide" && hidden || val === "show" && !hidden ) {
					return opt.complete.call( this );
				}

				if ( isElement && ( name === "height" || name === "width" ) ) {
					// Make sure that nothing sneaks out
					// Record all 3 overflow attributes because IE does not
					// change the overflow attribute when overflowX and
					// overflowY are set to the same value
					opt.overflow = [ this.style.overflow, this.style.overflowX, this.style.overflowY ];

					// Set display property to inline-block for height/width
					// animations on inline elements that are having width/height animated
					if ( jQuery.css( this, "display" ) === "inline" &&
							jQuery.css( this, "float" ) === "none" ) {

						// inline-level elements accept inline-block;
						// block-level elements need to be inline with layout
						if ( !jQuery.support.inlineBlockNeedsLayout || defaultDisplay( this.nodeName ) === "inline" ) {
							this.style.display = "inline-block";

						} else {
							this.style.zoom = 1;
						}
					}
				}
			}

			if ( opt.overflow != null ) {
				this.style.overflow = "hidden";
			}

			for ( p in prop ) {
				e = new jQuery.fx( this, opt, p );
				val = prop[ p ];

				if ( rfxtypes.test( val ) ) {

					// Tracks whether to show or hide based on private
					// data attached to the element
					method = jQuery._data( this, "toggle" + p ) || ( val === "toggle" ? hidden ? "show" : "hide" : 0 );
					if ( method ) {
						jQuery._data( this, "toggle" + p, method === "show" ? "hide" : "show" );
						e[ method ]();
					} else {
						e[ val ]();
					}

				} else {
					parts = rfxnum.exec( val );
					start = e.cur();

					if ( parts ) {
						end = parseFloat( parts[2] );
						unit = parts[3] || ( jQuery.cssNumber[ p ] ? "" : "px" );

						// We need to compute starting value
						if ( unit !== "px" ) {
							jQuery.style( this, p, (end || 1) + unit);
							start = ( (end || 1) / e.cur() ) * start;
							jQuery.style( this, p, start + unit);
						}

						// If a +=/-= token was provided, we're doing a relative animation
						if ( parts[1] ) {
							end = ( (parts[ 1 ] === "-=" ? -1 : 1) * end ) + start;
						}

						e.custom( start, end, unit );

					} else {
						e.custom( start, val, "" );
					}
				}
			}

			// For JS strict compliance
			return true;
		}

		return optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},

	stop: function( type, clearQueue, gotoEnd ) {
		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var index,
				hadTimers = false,
				timers = jQuery.timers,
				data = jQuery._data( this );

			// clear marker counters if we know they won't be
			if ( !gotoEnd ) {
				jQuery._unmark( true, this );
			}

			function stopQueue( elem, data, index ) {
				var hooks = data[ index ];
				jQuery.removeData( elem, index, true );
				hooks.stop( gotoEnd );
			}

			if ( type == null ) {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && index.indexOf(".run") === index.length - 4 ) {
						stopQueue( this, data, index );
					}
				}
			} else if ( data[ index = type + ".run" ] && data[ index ].stop ){
				stopQueue( this, data, index );
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					if ( gotoEnd ) {

						// force the next step to be the last
						timers[ index ]( true );
					} else {
						timers[ index ].saveState();
					}
					hadTimers = true;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( !( gotoEnd && hadTimers ) ) {
				jQuery.dequeue( this, type );
			}
		});
	}

});

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout( clearFxNow, 0 );
	return ( fxNow = jQuery.now() );
}

function clearFxNow() {
	fxNow = undefined;
}

// Generate parameters to create a standard animation
function genFx( type, num ) {
	var obj = {};

	jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice( 0, num )), function() {
		obj[ this ] = type;
	});

	return obj;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx( "show", 1 ),
	slideUp: genFx( "hide", 1 ),
	slideToggle: genFx( "toggle", 1 ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.extend({
	speed: function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

		// normalize opt.queue - true/undefined/null -> "fx"
		if ( opt.queue == null || opt.queue === true ) {
			opt.queue = "fx";
		}

		// Queueing
		opt.old = opt.complete;

		opt.complete = function( noUnmark ) {
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}

			if ( opt.queue ) {
				jQuery.dequeue( this, opt.queue );
			} else if ( noUnmark !== false ) {
				jQuery._unmark( this );
			}
		};

		return opt;
	},

	easing: {
		linear: function( p ) {
			return p;
		},
		swing: function( p ) {
			return ( -Math.cos( p*Math.PI ) / 2 ) + 0.5;
		}
	},

	timers: [],

	fx: function( elem, options, prop ) {
		this.options = options;
		this.elem = elem;
		this.prop = prop;

		options.orig = options.orig || {};
	}

});

jQuery.fx.prototype = {
	// Simple function for setting a style value
	update: function() {
		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		( jQuery.fx.step[ this.prop ] || jQuery.fx.step._default )( this );
	},

	// Get the current size
	cur: function() {
		if ( this.elem[ this.prop ] != null && (!this.elem.style || this.elem.style[ this.prop ] == null) ) {
			return this.elem[ this.prop ];
		}

		var parsed,
			r = jQuery.css( this.elem, this.prop );
		// Empty strings, null, undefined and "auto" are converted to 0,
		// complex values such as "rotate(1rad)" are returned as is,
		// simple values such as "10px" are parsed to Float.
		return isNaN( parsed = parseFloat( r ) ) ? !r || r === "auto" ? 0 : r : parsed;
	},

	// Start an animation from one number to another
	custom: function( from, to, unit ) {
		var self = this,
			fx = jQuery.fx;

		this.startTime = fxNow || createFxNow();
		this.end = to;
		this.now = this.start = from;
		this.pos = this.state = 0;
		this.unit = unit || this.unit || ( jQuery.cssNumber[ this.prop ] ? "" : "px" );

		function t( gotoEnd ) {
			return self.step( gotoEnd );
		}

		t.queue = this.options.queue;
		t.elem = this.elem;
		t.saveState = function() {
			if ( jQuery._data( self.elem, "fxshow" + self.prop ) === undefined ) {
				if ( self.options.hide ) {
					jQuery._data( self.elem, "fxshow" + self.prop, self.start );
				} else if ( self.options.show ) {
					jQuery._data( self.elem, "fxshow" + self.prop, self.end );
				}
			}
		};

		if ( t() && jQuery.timers.push(t) && !timerId ) {
			timerId = setInterval( fx.tick, fx.interval );
		}
	},

	// Simple 'show' function
	show: function() {
		var dataShow = jQuery._data( this.elem, "fxshow" + this.prop );

		// Remember where we started, so that we can go back to it later
		this.options.orig[ this.prop ] = dataShow || jQuery.style( this.elem, this.prop );
		this.options.show = true;

		// Begin the animation
		// Make sure that we start at a small width/height to avoid any flash of content
		if ( dataShow !== undefined ) {
			// This show is picking up where a previous hide or show left off
			this.custom( this.cur(), dataShow );
		} else {
			this.custom( this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur() );
		}

		// Start by showing the element
		jQuery( this.elem ).show();
	},

	// Simple 'hide' function
	hide: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[ this.prop ] = jQuery._data( this.elem, "fxshow" + this.prop ) || jQuery.style( this.elem, this.prop );
		this.options.hide = true;

		// Begin the animation
		this.custom( this.cur(), 0 );
	},

	// Each step of an animation
	step: function( gotoEnd ) {
		var p, n, complete,
			t = fxNow || createFxNow(),
			done = true,
			elem = this.elem,
			options = this.options;

		if ( gotoEnd || t >= options.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			options.animatedProperties[ this.prop ] = true;

			for ( p in options.animatedProperties ) {
				if ( options.animatedProperties[ p ] !== true ) {
					done = false;
				}
			}

			if ( done ) {
				// Reset the overflow
				if ( options.overflow != null && !jQuery.support.shrinkWrapBlocks ) {

					jQuery.each( [ "", "X", "Y" ], function( index, value ) {
						elem.style[ "overflow" + value ] = options.overflow[ index ];
					});
				}

				// Hide the element if the "hide" operation was done
				if ( options.hide ) {
					jQuery( elem ).hide();
				}

				// Reset the properties, if the item has been hidden or shown
				if ( options.hide || options.show ) {
					for ( p in options.animatedProperties ) {
						jQuery.style( elem, p, options.orig[ p ] );
						jQuery.removeData( elem, "fxshow" + p, true );
						// Toggle data is no longer needed
						jQuery.removeData( elem, "toggle" + p, true );
					}
				}

				// Execute the complete function
				// in the event that the complete function throws an exception
				// we must ensure it won't be called twice. #5684

				complete = options.complete;
				if ( complete ) {

					options.complete = false;
					complete.call( elem );
				}
			}

			return false;

		} else {
			// classical easing cannot be used with an Infinity duration
			if ( options.duration == Infinity ) {
				this.now = t;
			} else {
				n = t - this.startTime;
				this.state = n / options.duration;

				// Perform the easing function, defaults to swing
				this.pos = jQuery.easing[ options.animatedProperties[this.prop] ]( this.state, n, 0, 1, options.duration );
				this.now = this.start + ( (this.end - this.start) * this.pos );
			}
			// Perform the next step of the animation
			this.update();
		}

		return true;
	}
};

jQuery.extend( jQuery.fx, {
	tick: function() {
		var timer,
			timers = jQuery.timers,
			i = 0;

		for ( ; i < timers.length; i++ ) {
			timer = timers[ i ];
			// Checks the timer has not already been removed
			if ( !timer() && timers[ i ] === timer ) {
				timers.splice( i--, 1 );
			}
		}

		if ( !timers.length ) {
			jQuery.fx.stop();
		}
	},

	interval: 13,

	stop: function() {
		clearInterval( timerId );
		timerId = null;
	},

	speeds: {
		slow: 600,
		fast: 200,
		// Default speed
		_default: 400
	},

	step: {
		opacity: function( fx ) {
			jQuery.style( fx.elem, "opacity", fx.now );
		},

		_default: function( fx ) {
			if ( fx.elem.style && fx.elem.style[ fx.prop ] != null ) {
				fx.elem.style[ fx.prop ] = fx.now + fx.unit;
			} else {
				fx.elem[ fx.prop ] = fx.now;
			}
		}
	}
});

// Ensure props that can't be negative don't go there on undershoot easing
jQuery.each( fxAttrs.concat.apply( [], fxAttrs ), function( i, prop ) {
	// exclude marginTop, marginLeft, marginBottom and marginRight from this list
	if ( prop.indexOf( "margin" ) ) {
		jQuery.fx.step[ prop ] = function( fx ) {
			jQuery.style( fx.elem, prop, Math.max(0, fx.now) + fx.unit );
		};
	}
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}

// Try to restore the default display value of an element
function defaultDisplay( nodeName ) {

	if ( !elemdisplay[ nodeName ] ) {

		var body = document.body,
			elem = jQuery( "<" + nodeName + ">" ).appendTo( body ),
			display = elem.css( "display" );
		elem.remove();

		// If the simple way fails,
		// get element's real default display by attaching it to a temp iframe
		if ( display === "none" || display === "" ) {
			// No iframe to use yet, so create it
			if ( !iframe ) {
				iframe = document.createElement( "iframe" );
				iframe.frameBorder = iframe.width = iframe.height = 0;
			}

			body.appendChild( iframe );

			// Create a cacheable copy of the iframe document on first call.
			// IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
			// document to it; WebKit & Firefox won't allow reusing the iframe document.
			if ( !iframeDoc || !iframe.createElement ) {
				iframeDoc = ( iframe.contentWindow || iframe.contentDocument ).document;
				iframeDoc.write( ( jQuery.support.boxModel ? "<!doctype html>" : "" ) + "<html><body>" );
				iframeDoc.close();
			}

			elem = iframeDoc.createElement( nodeName );

			iframeDoc.body.appendChild( elem );

			display = jQuery.css( elem, "display" );
			body.removeChild( iframe );
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return elemdisplay[ nodeName ];
}




var getOffset,
	rtable = /^t(?:able|d|h)$/i,
	rroot = /^(?:body|html)$/i;

if ( "getBoundingClientRect" in document.documentElement ) {
	getOffset = function( elem, doc, docElem, box ) {
		try {
			box = elem.getBoundingClientRect();
		} catch(e) {}

		// Make sure we're not dealing with a disconnected DOM node
		if ( !box || !jQuery.contains( docElem, elem ) ) {
			return box ? { top: box.top, left: box.left } : { top: 0, left: 0 };
		}

		var body = doc.body,
			win = getWindow( doc ),
			clientTop  = docElem.clientTop  || body.clientTop  || 0,
			clientLeft = docElem.clientLeft || body.clientLeft || 0,
			scrollTop  = win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop  || body.scrollTop,
			scrollLeft = win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft,
			top  = box.top  + scrollTop  - clientTop,
			left = box.left + scrollLeft - clientLeft;

		return { top: top, left: left };
	};

} else {
	getOffset = function( elem, doc, docElem ) {
		var computedStyle,
			offsetParent = elem.offsetParent,
			prevOffsetParent = elem,
			body = doc.body,
			defaultView = doc.defaultView,
			prevComputedStyle = defaultView ? defaultView.getComputedStyle( elem, null ) : elem.currentStyle,
			top = elem.offsetTop,
			left = elem.offsetLeft;

		while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
			if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
				break;
			}

			computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
			top  -= elem.scrollTop;
			left -= elem.scrollLeft;

			if ( elem === offsetParent ) {
				top  += elem.offsetTop;
				left += elem.offsetLeft;

				if ( jQuery.support.doesNotAddBorder && !(jQuery.support.doesAddBorderForTableAndCells && rtable.test(elem.nodeName)) ) {
					top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
					left += parseFloat( computedStyle.borderLeftWidth ) || 0;
				}

				prevOffsetParent = offsetParent;
				offsetParent = elem.offsetParent;
			}

			if ( jQuery.support.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
				top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
				left += parseFloat( computedStyle.borderLeftWidth ) || 0;
			}

			prevComputedStyle = computedStyle;
		}

		if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
			top  += body.offsetTop;
			left += body.offsetLeft;
		}

		if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
			top  += Math.max( docElem.scrollTop, body.scrollTop );
			left += Math.max( docElem.scrollLeft, body.scrollLeft );
		}

		return { top: top, left: left };
	};
}

jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var elem = this[0],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return null;
	}

	if ( elem === doc.body ) {
		return jQuery.offset.bodyOffset( elem );
	}

	return getOffset( elem, doc, doc.documentElement );
};

jQuery.offset = {

	bodyOffset: function( body ) {
		var top = body.offsetTop,
			left = body.offsetLeft;

		if ( jQuery.support.doesNotIncludeMarginInBodyOffset ) {
			top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
			left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
		}

		return { top: top, left: left };
	},

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[0] ) {
			return null;
		}

		var elem = this[0],

		// Get *real* offsetParent
		offsetParent = this.offsetParent(),

		// Get correct offsets
		offset       = this.offset(),
		parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

		// Subtract element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
		offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

		// Add offsetParent borders
		parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
		parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

		// Subtract the two offsets
		return {
			top:  offset.top  - parentOffset.top,
			left: offset.left - parentOffset.left
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.body;
			while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					jQuery.support.boxModel && win.document.documentElement[ method ] ||
						win.document.body[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					 top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}




// Create width, height, innerHeight, innerWidth, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	var clientProp = "client" + name,
		scrollProp = "scroll" + name,
		offsetProp = "offset" + name;

	// innerHeight and innerWidth
	jQuery.fn[ "inner" + name ] = function() {
		var elem = this[0];
		return elem ?
			elem.style ?
			parseFloat( jQuery.css( elem, type, "padding" ) ) :
			this[ type ]() :
			null;
	};

	// outerHeight and outerWidth
	jQuery.fn[ "outer" + name ] = function( margin ) {
		var elem = this[0];
		return elem ?
			elem.style ?
			parseFloat( jQuery.css( elem, type, margin ? "margin" : "border" ) ) :
			this[ type ]() :
			null;
	};

	jQuery.fn[ type ] = function( value ) {
		return jQuery.access( this, function( elem, type, value ) {
			var doc, docElemProp, orig, ret;

			if ( jQuery.isWindow( elem ) ) {
				// 3rd condition allows Nokia support, as it supports the docElem prop but not CSS1Compat
				doc = elem.document;
				docElemProp = doc.documentElement[ clientProp ];
				return jQuery.support.boxModel && docElemProp ||
					doc.body && doc.body[ clientProp ] || docElemProp;
			}

			// Get document width or height
			if ( elem.nodeType === 9 ) {
				// Either scroll[Width/Height] or offset[Width/Height], whichever is greater
				doc = elem.documentElement;

				// when a window > document, IE6 reports a offset[Width/Height] > client[Width/Height]
				// so we can't use max, as it'll choose the incorrect offset[Width/Height]
				// instead we use the correct client[Width/Height]
				// support:IE6
				if ( doc[ clientProp ] >= doc[ scrollProp ] ) {
					return doc[ clientProp ];
				}

				return Math.max(
					elem.body[ scrollProp ], doc[ scrollProp ],
					elem.body[ offsetProp ], doc[ offsetProp ]
				);
			}

			// Get width or height on the element
			if ( value === undefined ) {
				orig = jQuery.css( elem, type );
				ret = parseFloat( orig );
				return jQuery.isNumeric( ret ) ? ret : orig;
			}

			// Set the width or height on the element
			jQuery( elem ).css( type, value );
		}, type, value, arguments.length, null );
	};
});




// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
	define( "jquery", [], function () { return jQuery; } );
}



})( window );
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 *
 * Requires jQuery 1.6.0 or later.
 * https://github.com/rails/jquery-ujs

 * Uploading file using rails.js
 * =============================
 *
 * By default, browsers do not allow files to be uploaded via AJAX. As a result, if there are any non-blank file fields
 * in the remote form, this adapter aborts the AJAX submission and allows the form to submit through standard means.
 *
 * The `ajax:aborted:file` event allows you to bind your own handler to process the form submission however you wish.
 *
 * Ex:
 *     $('form').live('ajax:aborted:file', function(event, elements){
 *       // Implement own remote file-transfer handler here for non-blank file inputs passed in `elements`.
 *       // Returning false in this handler tells rails.js to disallow standard form submission
 *       return false;
 *     });
 *
 * The `ajax:aborted:file` event is fired when a file-type input is detected with a non-blank value.
 *
 * Third-party tools can use this hook to detect when an AJAX file upload is attempted, and then use
 * techniques like the iframe method to upload the file instead.
 *
 * Required fields in rails.js
 * ===========================
 *
 * If any blank required inputs (required="required") are detected in the remote form, the whole form submission
 * is canceled. Note that this is unlike file inputs, which still allow standard (non-AJAX) form submission.
 *
 * The `ajax:aborted:required` event allows you to bind your own handler to inform the user of blank required inputs.
 *
 * !! Note that Opera does not fire the form's submit event if there are blank required inputs, so this event may never
 *    get fired in Opera. This event is what causes other browsers to exhibit the same submit-aborting behavior.
 *
 * Ex:
 *     $('form').live('ajax:aborted:required', function(event, elements){
 *       // Returning false in this handler tells rails.js to submit the form anyway.
 *       // The blank required inputs are passed to this function in `elements`.
 *       return ! confirm("Would you like to submit the form with missing info?");
 *     });
 */

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote], a[data-disable-with]',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not(button[type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with], button[data-disable-with], textarea[data-disable-with]',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]),textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input:file',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with]',

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = $('meta[name="csrf-token"]').attr('content');
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element.attr('href');
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, crossDomain, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        crossDomain = element.data('cross-domain') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.attr('method');
          url = element.attr('action');
          data = element.serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType, crossDomain: crossDomain,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            return rails.fire(element, 'ajax:beforeSend', [xhr, settings]);
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          }
        };
        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        return rails.ajax(options);
      } else {
        return false;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrf_token = $('meta[name=csrf-token]').attr('content'),
        csrf_param = $('meta[name=csrf-param]').attr('content'),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrf_param !== undefined && csrf_token !== undefined) {
        metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadata_input).appendTo('body');
      form.submit();
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      form.find(rails.disableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        element.data('ujs:enable-with', element[method]());
        element[method](element.data('disable-with'));
        element.prop('disabled', true);
      });
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      form.find(rails.enableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        if (element.data('ujs:enable-with')) element[method](element.data('ujs:enable-with'));
        element.prop('disabled', false);
      });
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        answer = rails.confirm(message);
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var inputs = $(), input,
        selector = specifiedSelector || 'input,textarea';
      form.find(selector).each(function() {
        input = $(this);
        // Collect non-blank inputs if nonBlank option is true, otherwise, collect blank inputs
        if (nonBlank ? input.val() : !input.val()) {
          inputs = inputs.add(input);
        }
      });
      return inputs.length ? inputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    // find all the submit events directly bound to the form and
    // manually invoke them. If anyone returns false then stop the loop
    callFormSubmitBindings: function(form, event) {
      var events = form.data('events'), continuePropagation = true;
      if (events !== undefined && events['submit'] !== undefined) {
        $.each(events['submit'], function(i, obj){
          if (typeof obj.handler === 'function') return continuePropagation = obj.handler(event);
        });
      }
      return continuePropagation;
    },

    //  replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      element.data('ujs:enable-with', element.html()); // store enabled state
      element.html(element.data('disable-with')); // set to disabled state
      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e)
      });
    },

    // restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        // this should be element.removeData('ujs:enable-with')
        // but, there is currently a bug in jquery which makes hyphenated data attributes not get removed
        element.data('ujs:enable-with', false); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
    }

  };

  $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

  $(document).delegate(rails.linkDisableSelector, 'ajax:complete', function() {
      rails.enableElement($(this));
  });

  $(document).delegate(rails.linkClickSelector, 'click.rails', function(e) {
    var link = $(this), method = link.data('method'), data = link.data('params');
    if (!rails.allowAction(link)) return rails.stopEverything(e);

    if (link.is(rails.linkDisableSelector)) rails.disableElement(link);

    if (link.data('remote') !== undefined) {
      if ( (e.metaKey || e.ctrlKey) && (!method || method === 'GET') && !data ) { return true; }

      if (rails.handleRemote(link) === false) { rails.enableElement(link); }
      return false;

    } else if (link.data('method')) {
      rails.handleMethod(link);
      return false;
    }
  });

  $(document).delegate(rails.inputChangeSelector, 'change.rails', function(e) {
    var link = $(this);
    if (!rails.allowAction(link)) return rails.stopEverything(e);

    rails.handleRemote(link);
    return false;
  });

  $(document).delegate(rails.formSubmitSelector, 'submit.rails', function(e) {
    var form = $(this),
      remote = form.data('remote') !== undefined,
      blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector),
      nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);

    if (!rails.allowAction(form)) return rails.stopEverything(e);

    // skip other logic when required values are missing or file upload is present
    if (blankRequiredInputs && form.attr("novalidate") == undefined && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
      return rails.stopEverything(e);
    }

    if (remote) {
      if (nonBlankFileInputs) {
        return rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);
      }

      // If browser does not support submit bubbling, then this live-binding will be called before direct
      // bindings. Therefore, we should directly call any direct bindings before remotely submitting form.
      if (!$.support.submitBubbles && $().jquery < '1.7' && rails.callFormSubmitBindings(form, e) === false) return rails.stopEverything(e);

      rails.handleRemote(form);
      return false;

    } else {
      // slight timeout so that the submit button gets properly serialized
      setTimeout(function(){ rails.disableFormElements(form); }, 13);
    }
  });

  $(document).delegate(rails.formInputClickSelector, 'click.rails', function(event) {
    var button = $(this);

    if (!rails.allowAction(button)) return rails.stopEverything(event);

    // register the pressed submit button
    var name = button.attr('name'),
      data = name ? {name:name, value:button.val()} : null;

    button.closest('form').data('ujs:submit-button', data);
  });

  $(document).delegate(rails.formSubmitSelector, 'ajax:beforeSend.rails', function(event) {
    if (this == event.target) rails.disableFormElements($(this));
  });

  $(document).delegate(rails.formSubmitSelector, 'ajax:complete.rails', function(event) {
    if (this == event.target) rails.enableFormElements($(this));
  });

})( jQuery );
(function(a){a.jgrid={defaults:{recordtext:"View {0} - {1} of {2}",emptyrecords:"No records to view",loadtext:"Loading...",pgtext:"Page {0} of {1}"},search:{caption:"Search...",Find:"Find",Reset:"Reset",odata:["equal","not equal","less","less or equal","greater","greater or equal","begins with","does not begin with","is in","is not in","ends with","does not end with","contains","does not contain"],groupOps:[{op:"AND",text:"all"},{op:"OR",text:"any"}],matchText:" match",rulesText:" rules"},edit:{addCaption:"Add Record",editCaption:"Edit Record",bSubmit:"Submit",bCancel:"Cancel",bClose:"Close",saveData:"Data has been changed! Save changes?",bYes:"Yes",bNo:"No",bExit:"Cancel",msg:{required:"Field is required",number:"Please, enter valid number",minValue:"value must be greater than or equal to ",maxValue:"value must be less than or equal to",email:"is not a valid e-mail",integer:"Please, enter valid integer value",date:"Please, enter valid date value",url:"is not a valid URL. Prefix required ('http://' or 'https://')",nodefined:" is not defined!",novalue:" return value is required!",customarray:"Custom function should return array!",customfcheck:"Custom function should be present in case of custom checking!"}},view:{caption:"View Record",bClose:"Close"},del:{caption:"Delete",msg:"Delete selected record(s)?",bSubmit:"Delete",bCancel:"Cancel"},nav:{edittext:"",edittitle:"Edit selected row",addtext:"",addtitle:"Add new row",deltext:"",deltitle:"Delete selected row",searchtext:"",searchtitle:"Find records",refreshtext:"",refreshtitle:"Reload Grid",alertcap:"Warning",alerttext:"Please, select row",viewtext:"",viewtitle:"View selected row"},col:{caption:"Select columns",bSubmit:"Ok",bCancel:"Cancel"},errors:{errcap:"Error",nourl:"No url is set",norecords:"No records to process",model:"Length of colNames <> colModel!"},formatter:{integer:{thousandsSeparator:" ",defaultValue:"0"},number:{decimalSeparator:".",thousandsSeparator:" ",decimalPlaces:2,defaultValue:"0.00"},currency:{decimalSeparator:".",thousandsSeparator:" ",decimalPlaces:2,prefix:"",suffix:"",defaultValue:"0.00"},date:{dayNames:["Sun","Mon","Tue","Wed","Thr","Fri","Sat","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],monthNames:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","January","February","March","April","May","June","July","August","September","October","November","December"],AmPm:["am","pm","AM","PM"],S:function(b){return b<11||b>13?["st","nd","rd","th"][Math.min((b-1)%10,3)]:"th"},srcformat:"Y-m-d",newformat:"d/m/Y",masks:{ISO8601Long:"Y-m-d H:i:s",ISO8601Short:"Y-m-d",ShortDate:"n/j/Y",LongDate:"l, F d, Y",FullDateTime:"l, F d, Y g:i:s A",MonthDay:"F d",ShortTime:"g:i A",LongTime:"g:i:s A",SortableDateTime:"Y-m-d\\TH:i:s",UniversalSortableDateTime:"Y-m-d H:i:sO",YearMonth:"F, Y"},reformatAfterEdit:false},baseLinkUrl:"",showAction:"",target:"",checkbox:{disabled:true},idName:"id"}}})(jQuery);
/*!
 * jQuery UI 1.8.13
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI
 */

(function(c,j){function k(a,b){var d=a.nodeName.toLowerCase();if("area"===d){b=a.parentNode;d=b.name;if(!a.href||!d||b.nodeName.toLowerCase()!=="map")return false;a=c("img[usemap=#"+d+"]")[0];return!!a&&l(a)}return(/input|select|textarea|button|object/.test(d)?!a.disabled:"a"==d?a.href||b:b)&&l(a)}function l(a){return!c(a).parents().andSelf().filter(function(){return c.curCSS(this,"visibility")==="hidden"||c.expr.filters.hidden(this)}).length}c.ui=c.ui||{};if(!c.ui.version){c.extend(c.ui,{version:"1.8.13",
keyCode:{ALT:18,BACKSPACE:8,CAPS_LOCK:20,COMMA:188,COMMAND:91,COMMAND_LEFT:91,COMMAND_RIGHT:93,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,INSERT:45,LEFT:37,MENU:93,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SHIFT:16,SPACE:32,TAB:9,UP:38,WINDOWS:91}});c.fn.extend({_focus:c.fn.focus,focus:function(a,b){return typeof a==="number"?this.each(function(){var d=this;setTimeout(function(){c(d).focus();
b&&b.call(d)},a)}):this._focus.apply(this,arguments)},scrollParent:function(){var a;a=c.browser.msie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?this.parents().filter(function(){return/(relative|absolute|fixed)/.test(c.curCSS(this,"position",1))&&/(auto|scroll)/.test(c.curCSS(this,"overflow",1)+c.curCSS(this,"overflow-y",1)+c.curCSS(this,"overflow-x",1))}).eq(0):this.parents().filter(function(){return/(auto|scroll)/.test(c.curCSS(this,"overflow",1)+c.curCSS(this,
"overflow-y",1)+c.curCSS(this,"overflow-x",1))}).eq(0);return/fixed/.test(this.css("position"))||!a.length?c(document):a},zIndex:function(a){if(a!==j)return this.css("zIndex",a);if(this.length){a=c(this[0]);for(var b;a.length&&a[0]!==document;){b=a.css("position");if(b==="absolute"||b==="relative"||b==="fixed"){b=parseInt(a.css("zIndex"),10);if(!isNaN(b)&&b!==0)return b}a=a.parent()}}return 0},disableSelection:function(){return this.bind((c.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",
function(a){a.preventDefault()})},enableSelection:function(){return this.unbind(".ui-disableSelection")}});c.each(["Width","Height"],function(a,b){function d(f,g,m,n){c.each(e,function(){g-=parseFloat(c.curCSS(f,"padding"+this,true))||0;if(m)g-=parseFloat(c.curCSS(f,"border"+this+"Width",true))||0;if(n)g-=parseFloat(c.curCSS(f,"margin"+this,true))||0});return g}var e=b==="Width"?["Left","Right"]:["Top","Bottom"],h=b.toLowerCase(),i={innerWidth:c.fn.innerWidth,innerHeight:c.fn.innerHeight,outerWidth:c.fn.outerWidth,
outerHeight:c.fn.outerHeight};c.fn["inner"+b]=function(f){if(f===j)return i["inner"+b].call(this);return this.each(function(){c(this).css(h,d(this,f)+"px")})};c.fn["outer"+b]=function(f,g){if(typeof f!=="number")return i["outer"+b].call(this,f);return this.each(function(){c(this).css(h,d(this,f,true,g)+"px")})}});c.extend(c.expr[":"],{data:function(a,b,d){return!!c.data(a,d[3])},focusable:function(a){return k(a,!isNaN(c.attr(a,"tabindex")))},tabbable:function(a){var b=c.attr(a,"tabindex"),d=isNaN(b);
return(d||b>=0)&&k(a,!d)}});c(function(){var a=document.body,b=a.appendChild(b=document.createElement("div"));c.extend(b.style,{minHeight:"100px",height:"auto",padding:0,borderWidth:0});c.support.minHeight=b.offsetHeight===100;c.support.selectstart="onselectstart"in b;a.removeChild(b).style.display="none"});c.extend(c.ui,{plugin:{add:function(a,b,d){a=c.ui[a].prototype;for(var e in d){a.plugins[e]=a.plugins[e]||[];a.plugins[e].push([b,d[e]])}},call:function(a,b,d){if((b=a.plugins[b])&&a.element[0].parentNode)for(var e=
0;e<b.length;e++)a.options[b[e][0]]&&b[e][1].apply(a.element,d)}},contains:function(a,b){return document.compareDocumentPosition?a.compareDocumentPosition(b)&16:a!==b&&a.contains(b)},hasScroll:function(a,b){if(c(a).css("overflow")==="hidden")return false;b=b&&b==="left"?"scrollLeft":"scrollTop";var d=false;if(a[b]>0)return true;a[b]=1;d=a[b]>0;a[b]=0;return d},isOverAxis:function(a,b,d){return a>b&&a<b+d},isOver:function(a,b,d,e,h,i){return c.ui.isOverAxis(a,d,h)&&c.ui.isOverAxis(b,e,i)}})}})(jQuery);
;/*!
 * jQuery UI Widget 1.8.13
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Widget
 */
(function(b,j){if(b.cleanData){var k=b.cleanData;b.cleanData=function(a){for(var c=0,d;(d=a[c])!=null;c++)b(d).triggerHandler("remove");k(a)}}else{var l=b.fn.remove;b.fn.remove=function(a,c){return this.each(function(){if(!c)if(!a||b.filter(a,[this]).length)b("*",this).add([this]).each(function(){b(this).triggerHandler("remove")});return l.call(b(this),a,c)})}}b.widget=function(a,c,d){var e=a.split(".")[0],f;a=a.split(".")[1];f=e+"-"+a;if(!d){d=c;c=b.Widget}b.expr[":"][f]=function(h){return!!b.data(h,
a)};b[e]=b[e]||{};b[e][a]=function(h,g){arguments.length&&this._createWidget(h,g)};c=new c;c.options=b.extend(true,{},c.options);b[e][a].prototype=b.extend(true,c,{namespace:e,widgetName:a,widgetEventPrefix:b[e][a].prototype.widgetEventPrefix||a,widgetBaseClass:f},d);b.widget.bridge(a,b[e][a])};b.widget.bridge=function(a,c){b.fn[a]=function(d){var e=typeof d==="string",f=Array.prototype.slice.call(arguments,1),h=this;d=!e&&f.length?b.extend.apply(null,[true,d].concat(f)):d;if(e&&d.charAt(0)==="_")return h;
e?this.each(function(){var g=b.data(this,a),i=g&&b.isFunction(g[d])?g[d].apply(g,f):g;if(i!==g&&i!==j){h=i;return false}}):this.each(function(){var g=b.data(this,a);g?g.option(d||{})._init():b.data(this,a,new c(d,this))});return h}};b.Widget=function(a,c){arguments.length&&this._createWidget(a,c)};b.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",options:{disabled:false},_createWidget:function(a,c){b.data(c,this.widgetName,this);this.element=b(c);this.options=b.extend(true,{},this.options,
this._getCreateOptions(),a);var d=this;this.element.bind("remove."+this.widgetName,function(){d.destroy()});this._create();this._trigger("create");this._init()},_getCreateOptions:function(){return b.metadata&&b.metadata.get(this.element[0])[this.widgetName]},_create:function(){},_init:function(){},destroy:function(){this.element.unbind("."+this.widgetName).removeData(this.widgetName);this.widget().unbind("."+this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass+"-disabled ui-state-disabled")},
widget:function(){return this.element},option:function(a,c){var d=a;if(arguments.length===0)return b.extend({},this.options);if(typeof a==="string"){if(c===j)return this.options[a];d={};d[a]=c}this._setOptions(d);return this},_setOptions:function(a){var c=this;b.each(a,function(d,e){c._setOption(d,e)});return this},_setOption:function(a,c){this.options[a]=c;if(a==="disabled")this.widget()[c?"addClass":"removeClass"](this.widgetBaseClass+"-disabled ui-state-disabled").attr("aria-disabled",c);return this},
enable:function(){return this._setOption("disabled",false)},disable:function(){return this._setOption("disabled",true)},_trigger:function(a,c,d){var e=this.options[a];c=b.Event(c);c.type=(a===this.widgetEventPrefix?a:this.widgetEventPrefix+a).toLowerCase();d=d||{};if(c.originalEvent){a=b.event.props.length;for(var f;a;){f=b.event.props[--a];c[f]=c.originalEvent[f]}}this.element.trigger(c,d);return!(b.isFunction(e)&&e.call(this.element[0],c,d)===false||c.isDefaultPrevented())}}})(jQuery);
;/*!
 * jQuery UI Mouse 1.8.13
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Mouse
 *
 * Depends:
 *	jquery.ui.widget.js
 */
(function(b){var d=false;b(document).mousedown(function(){d=false});b.widget("ui.mouse",{options:{cancel:":input,option",distance:1,delay:0},_mouseInit:function(){var a=this;this.element.bind("mousedown."+this.widgetName,function(c){return a._mouseDown(c)}).bind("click."+this.widgetName,function(c){if(true===b.data(c.target,a.widgetName+".preventClickEvent")){b.removeData(c.target,a.widgetName+".preventClickEvent");c.stopImmediatePropagation();return false}});this.started=false},_mouseDestroy:function(){this.element.unbind("."+
this.widgetName)},_mouseDown:function(a){if(!d){this._mouseStarted&&this._mouseUp(a);this._mouseDownEvent=a;var c=this,f=a.which==1,g=typeof this.options.cancel=="string"?b(a.target).parents().add(a.target).filter(this.options.cancel).length:false;if(!f||g||!this._mouseCapture(a))return true;this.mouseDelayMet=!this.options.delay;if(!this.mouseDelayMet)this._mouseDelayTimer=setTimeout(function(){c.mouseDelayMet=true},this.options.delay);if(this._mouseDistanceMet(a)&&this._mouseDelayMet(a)){this._mouseStarted=
this._mouseStart(a)!==false;if(!this._mouseStarted){a.preventDefault();return true}}true===b.data(a.target,this.widgetName+".preventClickEvent")&&b.removeData(a.target,this.widgetName+".preventClickEvent");this._mouseMoveDelegate=function(e){return c._mouseMove(e)};this._mouseUpDelegate=function(e){return c._mouseUp(e)};b(document).bind("mousemove."+this.widgetName,this._mouseMoveDelegate).bind("mouseup."+this.widgetName,this._mouseUpDelegate);a.preventDefault();return d=true}},_mouseMove:function(a){if(b.browser.msie&&
!(document.documentMode>=9)&&!a.button)return this._mouseUp(a);if(this._mouseStarted){this._mouseDrag(a);return a.preventDefault()}if(this._mouseDistanceMet(a)&&this._mouseDelayMet(a))(this._mouseStarted=this._mouseStart(this._mouseDownEvent,a)!==false)?this._mouseDrag(a):this._mouseUp(a);return!this._mouseStarted},_mouseUp:function(a){b(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate);if(this._mouseStarted){this._mouseStarted=
false;a.target==this._mouseDownEvent.target&&b.data(a.target,this.widgetName+".preventClickEvent",true);this._mouseStop(a)}return false},_mouseDistanceMet:function(a){return Math.max(Math.abs(this._mouseDownEvent.pageX-a.pageX),Math.abs(this._mouseDownEvent.pageY-a.pageY))>=this.options.distance},_mouseDelayMet:function(){return this.mouseDelayMet},_mouseStart:function(){},_mouseDrag:function(){},_mouseStop:function(){},_mouseCapture:function(){return true}})})(jQuery);
;/*
 * jQuery UI Position 1.8.13
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Position
 */
(function(c){c.ui=c.ui||{};var n=/left|center|right/,o=/top|center|bottom/,t=c.fn.position,u=c.fn.offset;c.fn.position=function(b){if(!b||!b.of)return t.apply(this,arguments);b=c.extend({},b);var a=c(b.of),d=a[0],g=(b.collision||"flip").split(" "),e=b.offset?b.offset.split(" "):[0,0],h,k,j;if(d.nodeType===9){h=a.width();k=a.height();j={top:0,left:0}}else if(d.setTimeout){h=a.width();k=a.height();j={top:a.scrollTop(),left:a.scrollLeft()}}else if(d.preventDefault){b.at="left top";h=k=0;j={top:b.of.pageY,
left:b.of.pageX}}else{h=a.outerWidth();k=a.outerHeight();j=a.offset()}c.each(["my","at"],function(){var f=(b[this]||"").split(" ");if(f.length===1)f=n.test(f[0])?f.concat(["center"]):o.test(f[0])?["center"].concat(f):["center","center"];f[0]=n.test(f[0])?f[0]:"center";f[1]=o.test(f[1])?f[1]:"center";b[this]=f});if(g.length===1)g[1]=g[0];e[0]=parseInt(e[0],10)||0;if(e.length===1)e[1]=e[0];e[1]=parseInt(e[1],10)||0;if(b.at[0]==="right")j.left+=h;else if(b.at[0]==="center")j.left+=h/2;if(b.at[1]==="bottom")j.top+=
k;else if(b.at[1]==="center")j.top+=k/2;j.left+=e[0];j.top+=e[1];return this.each(function(){var f=c(this),l=f.outerWidth(),m=f.outerHeight(),p=parseInt(c.curCSS(this,"marginLeft",true))||0,q=parseInt(c.curCSS(this,"marginTop",true))||0,v=l+p+(parseInt(c.curCSS(this,"marginRight",true))||0),w=m+q+(parseInt(c.curCSS(this,"marginBottom",true))||0),i=c.extend({},j),r;if(b.my[0]==="right")i.left-=l;else if(b.my[0]==="center")i.left-=l/2;if(b.my[1]==="bottom")i.top-=m;else if(b.my[1]==="center")i.top-=
m/2;i.left=Math.round(i.left);i.top=Math.round(i.top);r={left:i.left-p,top:i.top-q};c.each(["left","top"],function(s,x){c.ui.position[g[s]]&&c.ui.position[g[s]][x](i,{targetWidth:h,targetHeight:k,elemWidth:l,elemHeight:m,collisionPosition:r,collisionWidth:v,collisionHeight:w,offset:e,my:b.my,at:b.at})});c.fn.bgiframe&&f.bgiframe();f.offset(c.extend(i,{using:b.using}))})};c.ui.position={fit:{left:function(b,a){var d=c(window);d=a.collisionPosition.left+a.collisionWidth-d.width()-d.scrollLeft();b.left=
d>0?b.left-d:Math.max(b.left-a.collisionPosition.left,b.left)},top:function(b,a){var d=c(window);d=a.collisionPosition.top+a.collisionHeight-d.height()-d.scrollTop();b.top=d>0?b.top-d:Math.max(b.top-a.collisionPosition.top,b.top)}},flip:{left:function(b,a){if(a.at[0]!=="center"){var d=c(window);d=a.collisionPosition.left+a.collisionWidth-d.width()-d.scrollLeft();var g=a.my[0]==="left"?-a.elemWidth:a.my[0]==="right"?a.elemWidth:0,e=a.at[0]==="left"?a.targetWidth:-a.targetWidth,h=-2*a.offset[0];b.left+=
a.collisionPosition.left<0?g+e+h:d>0?g+e+h:0}},top:function(b,a){if(a.at[1]!=="center"){var d=c(window);d=a.collisionPosition.top+a.collisionHeight-d.height()-d.scrollTop();var g=a.my[1]==="top"?-a.elemHeight:a.my[1]==="bottom"?a.elemHeight:0,e=a.at[1]==="top"?a.targetHeight:-a.targetHeight,h=-2*a.offset[1];b.top+=a.collisionPosition.top<0?g+e+h:d>0?g+e+h:0}}}};if(!c.offset.setOffset){c.offset.setOffset=function(b,a){if(/static/.test(c.curCSS(b,"position")))b.style.position="relative";var d=c(b),
g=d.offset(),e=parseInt(c.curCSS(b,"top",true),10)||0,h=parseInt(c.curCSS(b,"left",true),10)||0;g={top:a.top-g.top+e,left:a.left-g.left+h};"using"in a?a.using.call(b,g):d.css(g)};c.fn.offset=function(b){var a=this[0];if(!a||!a.ownerDocument)return null;if(b)return this.each(function(){c.offset.setOffset(this,b)});return u.call(this)}}})(jQuery);
;/*
 * jQuery UI Draggable 1.8.13
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Draggables
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */
(function(d){d.widget("ui.draggable",d.ui.mouse,{widgetEventPrefix:"drag",options:{addClasses:true,appendTo:"parent",axis:false,connectToSortable:false,containment:false,cursor:"auto",cursorAt:false,grid:false,handle:false,helper:"original",iframeFix:false,opacity:false,refreshPositions:false,revert:false,revertDuration:500,scope:"default",scroll:true,scrollSensitivity:20,scrollSpeed:20,snap:false,snapMode:"both",snapTolerance:20,stack:false,zIndex:false},_create:function(){if(this.options.helper==
"original"&&!/^(?:r|a|f)/.test(this.element.css("position")))this.element[0].style.position="relative";this.options.addClasses&&this.element.addClass("ui-draggable");this.options.disabled&&this.element.addClass("ui-draggable-disabled");this._mouseInit()},destroy:function(){if(this.element.data("draggable")){this.element.removeData("draggable").unbind(".draggable").removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled");this._mouseDestroy();return this}},_mouseCapture:function(a){var b=
this.options;if(this.helper||b.disabled||d(a.target).is(".ui-resizable-handle"))return false;this.handle=this._getHandle(a);if(!this.handle)return false;d(b.iframeFix===true?"iframe":b.iframeFix).each(function(){d('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>').css({width:this.offsetWidth+"px",height:this.offsetHeight+"px",position:"absolute",opacity:"0.001",zIndex:1E3}).css(d(this).offset()).appendTo("body")});return true},_mouseStart:function(a){var b=this.options;this.helper=
this._createHelper(a);this._cacheHelperProportions();if(d.ui.ddmanager)d.ui.ddmanager.current=this;this._cacheMargins();this.cssPosition=this.helper.css("position");this.scrollParent=this.helper.scrollParent();this.offset=this.positionAbs=this.element.offset();this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left};d.extend(this.offset,{click:{left:a.pageX-this.offset.left,top:a.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()});
this.originalPosition=this.position=this._generatePosition(a);this.originalPageX=a.pageX;this.originalPageY=a.pageY;b.cursorAt&&this._adjustOffsetFromHelper(b.cursorAt);b.containment&&this._setContainment();if(this._trigger("start",a)===false){this._clear();return false}this._cacheHelperProportions();d.ui.ddmanager&&!b.dropBehaviour&&d.ui.ddmanager.prepareOffsets(this,a);this.helper.addClass("ui-draggable-dragging");this._mouseDrag(a,true);return true},_mouseDrag:function(a,b){this.position=this._generatePosition(a);
this.positionAbs=this._convertPositionTo("absolute");if(!b){b=this._uiHash();if(this._trigger("drag",a,b)===false){this._mouseUp({});return false}this.position=b.position}if(!this.options.axis||this.options.axis!="y")this.helper[0].style.left=this.position.left+"px";if(!this.options.axis||this.options.axis!="x")this.helper[0].style.top=this.position.top+"px";d.ui.ddmanager&&d.ui.ddmanager.drag(this,a);return false},_mouseStop:function(a){var b=false;if(d.ui.ddmanager&&!this.options.dropBehaviour)b=
d.ui.ddmanager.drop(this,a);if(this.dropped){b=this.dropped;this.dropped=false}if((!this.element[0]||!this.element[0].parentNode)&&this.options.helper=="original")return false;if(this.options.revert=="invalid"&&!b||this.options.revert=="valid"&&b||this.options.revert===true||d.isFunction(this.options.revert)&&this.options.revert.call(this.element,b)){var c=this;d(this.helper).animate(this.originalPosition,parseInt(this.options.revertDuration,10),function(){c._trigger("stop",a)!==false&&c._clear()})}else this._trigger("stop",
a)!==false&&this._clear();return false},_mouseUp:function(a){this.options.iframeFix===true&&d("div.ui-draggable-iframeFix").each(function(){this.parentNode.removeChild(this)});return d.ui.mouse.prototype._mouseUp.call(this,a)},cancel:function(){this.helper.is(".ui-draggable-dragging")?this._mouseUp({}):this._clear();return this},_getHandle:function(a){var b=!this.options.handle||!d(this.options.handle,this.element).length?true:false;d(this.options.handle,this.element).find("*").andSelf().each(function(){if(this==
a.target)b=true});return b},_createHelper:function(a){var b=this.options;a=d.isFunction(b.helper)?d(b.helper.apply(this.element[0],[a])):b.helper=="clone"?this.element.clone().removeAttr("id"):this.element;a.parents("body").length||a.appendTo(b.appendTo=="parent"?this.element[0].parentNode:b.appendTo);a[0]!=this.element[0]&&!/(fixed|absolute)/.test(a.css("position"))&&a.css("position","absolute");return a},_adjustOffsetFromHelper:function(a){if(typeof a=="string")a=a.split(" ");if(d.isArray(a))a=
{left:+a[0],top:+a[1]||0};if("left"in a)this.offset.click.left=a.left+this.margins.left;if("right"in a)this.offset.click.left=this.helperProportions.width-a.right+this.margins.left;if("top"in a)this.offset.click.top=a.top+this.margins.top;if("bottom"in a)this.offset.click.top=this.helperProportions.height-a.bottom+this.margins.top},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var a=this.offsetParent.offset();if(this.cssPosition=="absolute"&&this.scrollParent[0]!=document&&
d.ui.contains(this.scrollParent[0],this.offsetParent[0])){a.left+=this.scrollParent.scrollLeft();a.top+=this.scrollParent.scrollTop()}if(this.offsetParent[0]==document.body||this.offsetParent[0].tagName&&this.offsetParent[0].tagName.toLowerCase()=="html"&&d.browser.msie)a={top:0,left:0};return{top:a.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:a.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if(this.cssPosition=="relative"){var a=
this.element.position();return{top:a.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:a.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}else return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.element.css("marginLeft"),10)||0,top:parseInt(this.element.css("marginTop"),10)||0,right:parseInt(this.element.css("marginRight"),10)||0,bottom:parseInt(this.element.css("marginBottom"),10)||0}},_cacheHelperProportions:function(){this.helperProportions=
{width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var a=this.options;if(a.containment=="parent")a.containment=this.helper[0].parentNode;if(a.containment=="document"||a.containment=="window")this.containment=[(a.containment=="document"?0:d(window).scrollLeft())-this.offset.relative.left-this.offset.parent.left,(a.containment=="document"?0:d(window).scrollTop())-this.offset.relative.top-this.offset.parent.top,(a.containment=="document"?0:d(window).scrollLeft())+
d(a.containment=="document"?document:window).width()-this.helperProportions.width-this.margins.left,(a.containment=="document"?0:d(window).scrollTop())+(d(a.containment=="document"?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top];if(!/^(document|window|parent)$/.test(a.containment)&&a.containment.constructor!=Array){a=d(a.containment);var b=a[0];if(b){a.offset();var c=d(b).css("overflow")!="hidden";this.containment=[(parseInt(d(b).css("borderLeftWidth"),
10)||0)+(parseInt(d(b).css("paddingLeft"),10)||0),(parseInt(d(b).css("borderTopWidth"),10)||0)+(parseInt(d(b).css("paddingTop"),10)||0),(c?Math.max(b.scrollWidth,b.offsetWidth):b.offsetWidth)-(parseInt(d(b).css("borderLeftWidth"),10)||0)-(parseInt(d(b).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left-this.margins.right,(c?Math.max(b.scrollHeight,b.offsetHeight):b.offsetHeight)-(parseInt(d(b).css("borderTopWidth"),10)||0)-(parseInt(d(b).css("paddingBottom"),10)||0)-this.helperProportions.height-
this.margins.top-this.margins.bottom];this.relative_container=a}}else if(a.containment.constructor==Array)this.containment=a.containment},_convertPositionTo:function(a,b){if(!b)b=this.position;a=a=="absolute"?1:-1;var c=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=document&&d.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,f=/(html|body)/i.test(c[0].tagName);return{top:b.top+this.offset.relative.top*a+this.offset.parent.top*a-(d.browser.safari&&
d.browser.version<526&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():f?0:c.scrollTop())*a),left:b.left+this.offset.relative.left*a+this.offset.parent.left*a-(d.browser.safari&&d.browser.version<526&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():f?0:c.scrollLeft())*a)}},_generatePosition:function(a){var b=this.options,c=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=document&&d.ui.contains(this.scrollParent[0],
this.offsetParent[0]))?this.offsetParent:this.scrollParent,f=/(html|body)/i.test(c[0].tagName),e=a.pageX,h=a.pageY;if(this.originalPosition){var g;if(this.containment){if(this.relative_container){g=this.relative_container.offset();g=[this.containment[0]+g.left,this.containment[1]+g.top,this.containment[2]+g.left,this.containment[3]+g.top]}else g=this.containment;if(a.pageX-this.offset.click.left<g[0])e=g[0]+this.offset.click.left;if(a.pageY-this.offset.click.top<g[1])h=g[1]+this.offset.click.top;
if(a.pageX-this.offset.click.left>g[2])e=g[2]+this.offset.click.left;if(a.pageY-this.offset.click.top>g[3])h=g[3]+this.offset.click.top}if(b.grid){h=this.originalPageY+Math.round((h-this.originalPageY)/b.grid[1])*b.grid[1];h=g?!(h-this.offset.click.top<g[1]||h-this.offset.click.top>g[3])?h:!(h-this.offset.click.top<g[1])?h-b.grid[1]:h+b.grid[1]:h;e=this.originalPageX+Math.round((e-this.originalPageX)/b.grid[0])*b.grid[0];e=g?!(e-this.offset.click.left<g[0]||e-this.offset.click.left>g[2])?e:!(e-this.offset.click.left<
g[0])?e-b.grid[0]:e+b.grid[0]:e}}return{top:h-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+(d.browser.safari&&d.browser.version<526&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollTop():f?0:c.scrollTop()),left:e-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+(d.browser.safari&&d.browser.version<526&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():f?0:c.scrollLeft())}},_clear:function(){this.helper.removeClass("ui-draggable-dragging");
this.helper[0]!=this.element[0]&&!this.cancelHelperRemoval&&this.helper.remove();this.helper=null;this.cancelHelperRemoval=false},_trigger:function(a,b,c){c=c||this._uiHash();d.ui.plugin.call(this,a,[b,c]);if(a=="drag")this.positionAbs=this._convertPositionTo("absolute");return d.Widget.prototype._trigger.call(this,a,b,c)},plugins:{},_uiHash:function(){return{helper:this.helper,position:this.position,originalPosition:this.originalPosition,offset:this.positionAbs}}});d.extend(d.ui.draggable,{version:"1.8.13"});
d.ui.plugin.add("draggable","connectToSortable",{start:function(a,b){var c=d(this).data("draggable"),f=c.options,e=d.extend({},b,{item:c.element});c.sortables=[];d(f.connectToSortable).each(function(){var h=d.data(this,"sortable");if(h&&!h.options.disabled){c.sortables.push({instance:h,shouldRevert:h.options.revert});h.refreshPositions();h._trigger("activate",a,e)}})},stop:function(a,b){var c=d(this).data("draggable"),f=d.extend({},b,{item:c.element});d.each(c.sortables,function(){if(this.instance.isOver){this.instance.isOver=
0;c.cancelHelperRemoval=true;this.instance.cancelHelperRemoval=false;if(this.shouldRevert)this.instance.options.revert=true;this.instance._mouseStop(a);this.instance.options.helper=this.instance.options._helper;c.options.helper=="original"&&this.instance.currentItem.css({top:"auto",left:"auto"})}else{this.instance.cancelHelperRemoval=false;this.instance._trigger("deactivate",a,f)}})},drag:function(a,b){var c=d(this).data("draggable"),f=this;d.each(c.sortables,function(){this.instance.positionAbs=
c.positionAbs;this.instance.helperProportions=c.helperProportions;this.instance.offset.click=c.offset.click;if(this.instance._intersectsWith(this.instance.containerCache)){if(!this.instance.isOver){this.instance.isOver=1;this.instance.currentItem=d(f).clone().removeAttr("id").appendTo(this.instance.element).data("sortable-item",true);this.instance.options._helper=this.instance.options.helper;this.instance.options.helper=function(){return b.helper[0]};a.target=this.instance.currentItem[0];this.instance._mouseCapture(a,
true);this.instance._mouseStart(a,true,true);this.instance.offset.click.top=c.offset.click.top;this.instance.offset.click.left=c.offset.click.left;this.instance.offset.parent.left-=c.offset.parent.left-this.instance.offset.parent.left;this.instance.offset.parent.top-=c.offset.parent.top-this.instance.offset.parent.top;c._trigger("toSortable",a);c.dropped=this.instance.element;c.currentItem=c.element;this.instance.fromOutside=c}this.instance.currentItem&&this.instance._mouseDrag(a)}else if(this.instance.isOver){this.instance.isOver=
0;this.instance.cancelHelperRemoval=true;this.instance.options.revert=false;this.instance._trigger("out",a,this.instance._uiHash(this.instance));this.instance._mouseStop(a,true);this.instance.options.helper=this.instance.options._helper;this.instance.currentItem.remove();this.instance.placeholder&&this.instance.placeholder.remove();c._trigger("fromSortable",a);c.dropped=false}})}});d.ui.plugin.add("draggable","cursor",{start:function(){var a=d("body"),b=d(this).data("draggable").options;if(a.css("cursor"))b._cursor=
a.css("cursor");a.css("cursor",b.cursor)},stop:function(){var a=d(this).data("draggable").options;a._cursor&&d("body").css("cursor",a._cursor)}});d.ui.plugin.add("draggable","opacity",{start:function(a,b){a=d(b.helper);b=d(this).data("draggable").options;if(a.css("opacity"))b._opacity=a.css("opacity");a.css("opacity",b.opacity)},stop:function(a,b){a=d(this).data("draggable").options;a._opacity&&d(b.helper).css("opacity",a._opacity)}});d.ui.plugin.add("draggable","scroll",{start:function(){var a=d(this).data("draggable");
if(a.scrollParent[0]!=document&&a.scrollParent[0].tagName!="HTML")a.overflowOffset=a.scrollParent.offset()},drag:function(a){var b=d(this).data("draggable"),c=b.options,f=false;if(b.scrollParent[0]!=document&&b.scrollParent[0].tagName!="HTML"){if(!c.axis||c.axis!="x")if(b.overflowOffset.top+b.scrollParent[0].offsetHeight-a.pageY<c.scrollSensitivity)b.scrollParent[0].scrollTop=f=b.scrollParent[0].scrollTop+c.scrollSpeed;else if(a.pageY-b.overflowOffset.top<c.scrollSensitivity)b.scrollParent[0].scrollTop=
f=b.scrollParent[0].scrollTop-c.scrollSpeed;if(!c.axis||c.axis!="y")if(b.overflowOffset.left+b.scrollParent[0].offsetWidth-a.pageX<c.scrollSensitivity)b.scrollParent[0].scrollLeft=f=b.scrollParent[0].scrollLeft+c.scrollSpeed;else if(a.pageX-b.overflowOffset.left<c.scrollSensitivity)b.scrollParent[0].scrollLeft=f=b.scrollParent[0].scrollLeft-c.scrollSpeed}else{if(!c.axis||c.axis!="x")if(a.pageY-d(document).scrollTop()<c.scrollSensitivity)f=d(document).scrollTop(d(document).scrollTop()-c.scrollSpeed);
else if(d(window).height()-(a.pageY-d(document).scrollTop())<c.scrollSensitivity)f=d(document).scrollTop(d(document).scrollTop()+c.scrollSpeed);if(!c.axis||c.axis!="y")if(a.pageX-d(document).scrollLeft()<c.scrollSensitivity)f=d(document).scrollLeft(d(document).scrollLeft()-c.scrollSpeed);else if(d(window).width()-(a.pageX-d(document).scrollLeft())<c.scrollSensitivity)f=d(document).scrollLeft(d(document).scrollLeft()+c.scrollSpeed)}f!==false&&d.ui.ddmanager&&!c.dropBehaviour&&d.ui.ddmanager.prepareOffsets(b,
a)}});d.ui.plugin.add("draggable","snap",{start:function(){var a=d(this).data("draggable"),b=a.options;a.snapElements=[];d(b.snap.constructor!=String?b.snap.items||":data(draggable)":b.snap).each(function(){var c=d(this),f=c.offset();this!=a.element[0]&&a.snapElements.push({item:this,width:c.outerWidth(),height:c.outerHeight(),top:f.top,left:f.left})})},drag:function(a,b){for(var c=d(this).data("draggable"),f=c.options,e=f.snapTolerance,h=b.offset.left,g=h+c.helperProportions.width,n=b.offset.top,
o=n+c.helperProportions.height,i=c.snapElements.length-1;i>=0;i--){var j=c.snapElements[i].left,l=j+c.snapElements[i].width,k=c.snapElements[i].top,m=k+c.snapElements[i].height;if(j-e<h&&h<l+e&&k-e<n&&n<m+e||j-e<h&&h<l+e&&k-e<o&&o<m+e||j-e<g&&g<l+e&&k-e<n&&n<m+e||j-e<g&&g<l+e&&k-e<o&&o<m+e){if(f.snapMode!="inner"){var p=Math.abs(k-o)<=e,q=Math.abs(m-n)<=e,r=Math.abs(j-g)<=e,s=Math.abs(l-h)<=e;if(p)b.position.top=c._convertPositionTo("relative",{top:k-c.helperProportions.height,left:0}).top-c.margins.top;
if(q)b.position.top=c._convertPositionTo("relative",{top:m,left:0}).top-c.margins.top;if(r)b.position.left=c._convertPositionTo("relative",{top:0,left:j-c.helperProportions.width}).left-c.margins.left;if(s)b.position.left=c._convertPositionTo("relative",{top:0,left:l}).left-c.margins.left}var t=p||q||r||s;if(f.snapMode!="outer"){p=Math.abs(k-n)<=e;q=Math.abs(m-o)<=e;r=Math.abs(j-h)<=e;s=Math.abs(l-g)<=e;if(p)b.position.top=c._convertPositionTo("relative",{top:k,left:0}).top-c.margins.top;if(q)b.position.top=
c._convertPositionTo("relative",{top:m-c.helperProportions.height,left:0}).top-c.margins.top;if(r)b.position.left=c._convertPositionTo("relative",{top:0,left:j}).left-c.margins.left;if(s)b.position.left=c._convertPositionTo("relative",{top:0,left:l-c.helperProportions.width}).left-c.margins.left}if(!c.snapElements[i].snapping&&(p||q||r||s||t))c.options.snap.snap&&c.options.snap.snap.call(c.element,a,d.extend(c._uiHash(),{snapItem:c.snapElements[i].item}));c.snapElements[i].snapping=p||q||r||s||t}else{c.snapElements[i].snapping&&
c.options.snap.release&&c.options.snap.release.call(c.element,a,d.extend(c._uiHash(),{snapItem:c.snapElements[i].item}));c.snapElements[i].snapping=false}}}});d.ui.plugin.add("draggable","stack",{start:function(){var a=d(this).data("draggable").options;a=d.makeArray(d(a.stack)).sort(function(c,f){return(parseInt(d(c).css("zIndex"),10)||0)-(parseInt(d(f).css("zIndex"),10)||0)});if(a.length){var b=parseInt(a[0].style.zIndex)||0;d(a).each(function(c){this.style.zIndex=b+c});this[0].style.zIndex=b+a.length}}});
d.ui.plugin.add("draggable","zIndex",{start:function(a,b){a=d(b.helper);b=d(this).data("draggable").options;if(a.css("zIndex"))b._zIndex=a.css("zIndex");a.css("zIndex",b.zIndex)},stop:function(a,b){a=d(this).data("draggable").options;a._zIndex&&d(b.helper).css("zIndex",a._zIndex)}})})(jQuery);
;/*
 * jQuery UI Droppable 1.8.13
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Droppables
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	jquery.ui.mouse.js
 *	jquery.ui.draggable.js
 */
(function(d){d.widget("ui.droppable",{widgetEventPrefix:"drop",options:{accept:"*",activeClass:false,addClasses:true,greedy:false,hoverClass:false,scope:"default",tolerance:"intersect"},_create:function(){var a=this.options,b=a.accept;this.isover=0;this.isout=1;this.accept=d.isFunction(b)?b:function(c){return c.is(b)};this.proportions={width:this.element[0].offsetWidth,height:this.element[0].offsetHeight};d.ui.ddmanager.droppables[a.scope]=d.ui.ddmanager.droppables[a.scope]||[];d.ui.ddmanager.droppables[a.scope].push(this);
a.addClasses&&this.element.addClass("ui-droppable")},destroy:function(){for(var a=d.ui.ddmanager.droppables[this.options.scope],b=0;b<a.length;b++)a[b]==this&&a.splice(b,1);this.element.removeClass("ui-droppable ui-droppable-disabled").removeData("droppable").unbind(".droppable");return this},_setOption:function(a,b){if(a=="accept")this.accept=d.isFunction(b)?b:function(c){return c.is(b)};d.Widget.prototype._setOption.apply(this,arguments)},_activate:function(a){var b=d.ui.ddmanager.current;this.options.activeClass&&
this.element.addClass(this.options.activeClass);b&&this._trigger("activate",a,this.ui(b))},_deactivate:function(a){var b=d.ui.ddmanager.current;this.options.activeClass&&this.element.removeClass(this.options.activeClass);b&&this._trigger("deactivate",a,this.ui(b))},_over:function(a){var b=d.ui.ddmanager.current;if(!(!b||(b.currentItem||b.element)[0]==this.element[0]))if(this.accept.call(this.element[0],b.currentItem||b.element)){this.options.hoverClass&&this.element.addClass(this.options.hoverClass);
this._trigger("over",a,this.ui(b))}},_out:function(a){var b=d.ui.ddmanager.current;if(!(!b||(b.currentItem||b.element)[0]==this.element[0]))if(this.accept.call(this.element[0],b.currentItem||b.element)){this.options.hoverClass&&this.element.removeClass(this.options.hoverClass);this._trigger("out",a,this.ui(b))}},_drop:function(a,b){var c=b||d.ui.ddmanager.current;if(!c||(c.currentItem||c.element)[0]==this.element[0])return false;var e=false;this.element.find(":data(droppable)").not(".ui-draggable-dragging").each(function(){var g=
d.data(this,"droppable");if(g.options.greedy&&!g.options.disabled&&g.options.scope==c.options.scope&&g.accept.call(g.element[0],c.currentItem||c.element)&&d.ui.intersect(c,d.extend(g,{offset:g.element.offset()}),g.options.tolerance)){e=true;return false}});if(e)return false;if(this.accept.call(this.element[0],c.currentItem||c.element)){this.options.activeClass&&this.element.removeClass(this.options.activeClass);this.options.hoverClass&&this.element.removeClass(this.options.hoverClass);this._trigger("drop",
a,this.ui(c));return this.element}return false},ui:function(a){return{draggable:a.currentItem||a.element,helper:a.helper,position:a.position,offset:a.positionAbs}}});d.extend(d.ui.droppable,{version:"1.8.13"});d.ui.intersect=function(a,b,c){if(!b.offset)return false;var e=(a.positionAbs||a.position.absolute).left,g=e+a.helperProportions.width,f=(a.positionAbs||a.position.absolute).top,h=f+a.helperProportions.height,i=b.offset.left,k=i+b.proportions.width,j=b.offset.top,l=j+b.proportions.height;
switch(c){case "fit":return i<=e&&g<=k&&j<=f&&h<=l;case "intersect":return i<e+a.helperProportions.width/2&&g-a.helperProportions.width/2<k&&j<f+a.helperProportions.height/2&&h-a.helperProportions.height/2<l;case "pointer":return d.ui.isOver((a.positionAbs||a.position.absolute).top+(a.clickOffset||a.offset.click).top,(a.positionAbs||a.position.absolute).left+(a.clickOffset||a.offset.click).left,j,i,b.proportions.height,b.proportions.width);case "touch":return(f>=j&&f<=l||h>=j&&h<=l||f<j&&h>l)&&(e>=
i&&e<=k||g>=i&&g<=k||e<i&&g>k);default:return false}};d.ui.ddmanager={current:null,droppables:{"default":[]},prepareOffsets:function(a,b){var c=d.ui.ddmanager.droppables[a.options.scope]||[],e=b?b.type:null,g=(a.currentItem||a.element).find(":data(droppable)").andSelf(),f=0;a:for(;f<c.length;f++)if(!(c[f].options.disabled||a&&!c[f].accept.call(c[f].element[0],a.currentItem||a.element))){for(var h=0;h<g.length;h++)if(g[h]==c[f].element[0]){c[f].proportions.height=0;continue a}c[f].visible=c[f].element.css("display")!=
"none";if(c[f].visible){e=="mousedown"&&c[f]._activate.call(c[f],b);c[f].offset=c[f].element.offset();c[f].proportions={width:c[f].element[0].offsetWidth,height:c[f].element[0].offsetHeight}}}},drop:function(a,b){var c=false;d.each(d.ui.ddmanager.droppables[a.options.scope]||[],function(){if(this.options){if(!this.options.disabled&&this.visible&&d.ui.intersect(a,this,this.options.tolerance))c=c||this._drop.call(this,b);if(!this.options.disabled&&this.visible&&this.accept.call(this.element[0],a.currentItem||
a.element)){this.isout=1;this.isover=0;this._deactivate.call(this,b)}}});return c},drag:function(a,b){a.options.refreshPositions&&d.ui.ddmanager.prepareOffsets(a,b);d.each(d.ui.ddmanager.droppables[a.options.scope]||[],function(){if(!(this.options.disabled||this.greedyChild||!this.visible)){var c=d.ui.intersect(a,this,this.options.tolerance);if(c=!c&&this.isover==1?"isout":c&&this.isover==0?"isover":null){var e;if(this.options.greedy){var g=this.element.parents(":data(droppable):eq(0)");if(g.length){e=
d.data(g[0],"droppable");e.greedyChild=c=="isover"?1:0}}if(e&&c=="isover"){e.isover=0;e.isout=1;e._out.call(e,b)}this[c]=1;this[c=="isout"?"isover":"isout"]=0;this[c=="isover"?"_over":"_out"].call(this,b);if(e&&c=="isout"){e.isout=0;e.isover=1;e._over.call(e,b)}}}})}}})(jQuery);
;/*
 * jQuery UI Resizable 1.8.13
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Resizables
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */
(function(e){e.widget("ui.resizable",e.ui.mouse,{widgetEventPrefix:"resize",options:{alsoResize:false,animate:false,animateDuration:"slow",animateEasing:"swing",aspectRatio:false,autoHide:false,containment:false,ghost:false,grid:false,handles:"e,s,se",helper:false,maxHeight:null,maxWidth:null,minHeight:10,minWidth:10,zIndex:1E3},_create:function(){var b=this,a=this.options;this.element.addClass("ui-resizable");e.extend(this,{_aspectRatio:!!a.aspectRatio,aspectRatio:a.aspectRatio,originalElement:this.element,
_proportionallyResizeElements:[],_helper:a.helper||a.ghost||a.animate?a.helper||"ui-resizable-helper":null});if(this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i)){/relative/.test(this.element.css("position"))&&e.browser.opera&&this.element.css({position:"relative",top:"auto",left:"auto"});this.element.wrap(e('<div class="ui-wrapper" style="overflow: hidden;"></div>').css({position:this.element.css("position"),width:this.element.outerWidth(),height:this.element.outerHeight(),
top:this.element.css("top"),left:this.element.css("left")}));this.element=this.element.parent().data("resizable",this.element.data("resizable"));this.elementIsWrapper=true;this.element.css({marginLeft:this.originalElement.css("marginLeft"),marginTop:this.originalElement.css("marginTop"),marginRight:this.originalElement.css("marginRight"),marginBottom:this.originalElement.css("marginBottom")});this.originalElement.css({marginLeft:0,marginTop:0,marginRight:0,marginBottom:0});this.originalResizeStyle=
this.originalElement.css("resize");this.originalElement.css("resize","none");this._proportionallyResizeElements.push(this.originalElement.css({position:"static",zoom:1,display:"block"}));this.originalElement.css({margin:this.originalElement.css("margin")});this._proportionallyResize()}this.handles=a.handles||(!e(".ui-resizable-handle",this.element).length?"e,s,se":{n:".ui-resizable-n",e:".ui-resizable-e",s:".ui-resizable-s",w:".ui-resizable-w",se:".ui-resizable-se",sw:".ui-resizable-sw",ne:".ui-resizable-ne",
nw:".ui-resizable-nw"});if(this.handles.constructor==String){if(this.handles=="all")this.handles="n,e,s,w,se,sw,ne,nw";var c=this.handles.split(",");this.handles={};for(var d=0;d<c.length;d++){var f=e.trim(c[d]),g=e('<div class="ui-resizable-handle '+("ui-resizable-"+f)+'"></div>');/sw|se|ne|nw/.test(f)&&g.css({zIndex:++a.zIndex});"se"==f&&g.addClass("ui-icon ui-icon-gripsmall-diagonal-se");this.handles[f]=".ui-resizable-"+f;this.element.append(g)}}this._renderAxis=function(h){h=h||this.element;for(var i in this.handles){if(this.handles[i].constructor==
String)this.handles[i]=e(this.handles[i],this.element).show();if(this.elementIsWrapper&&this.originalElement[0].nodeName.match(/textarea|input|select|button/i)){var j=e(this.handles[i],this.element),k=0;k=/sw|ne|nw|se|n|s/.test(i)?j.outerHeight():j.outerWidth();j=["padding",/ne|nw|n/.test(i)?"Top":/se|sw|s/.test(i)?"Bottom":/^e$/.test(i)?"Right":"Left"].join("");h.css(j,k);this._proportionallyResize()}e(this.handles[i])}};this._renderAxis(this.element);this._handles=e(".ui-resizable-handle",this.element).disableSelection();
this._handles.mouseover(function(){if(!b.resizing){if(this.className)var h=this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i);b.axis=h&&h[1]?h[1]:"se"}});if(a.autoHide){this._handles.hide();e(this.element).addClass("ui-resizable-autohide").hover(function(){if(!a.disabled){e(this).removeClass("ui-resizable-autohide");b._handles.show()}},function(){if(!a.disabled)if(!b.resizing){e(this).addClass("ui-resizable-autohide");b._handles.hide()}})}this._mouseInit()},destroy:function(){this._mouseDestroy();
var b=function(c){e(c).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing").removeData("resizable").unbind(".resizable").find(".ui-resizable-handle").remove()};if(this.elementIsWrapper){b(this.element);var a=this.element;a.after(this.originalElement.css({position:a.css("position"),width:a.outerWidth(),height:a.outerHeight(),top:a.css("top"),left:a.css("left")})).remove()}this.originalElement.css("resize",this.originalResizeStyle);b(this.originalElement);return this},_mouseCapture:function(b){var a=
false;for(var c in this.handles)if(e(this.handles[c])[0]==b.target)a=true;return!this.options.disabled&&a},_mouseStart:function(b){var a=this.options,c=this.element.position(),d=this.element;this.resizing=true;this.documentScroll={top:e(document).scrollTop(),left:e(document).scrollLeft()};if(d.is(".ui-draggable")||/absolute/.test(d.css("position")))d.css({position:"absolute",top:c.top,left:c.left});e.browser.opera&&/relative/.test(d.css("position"))&&d.css({position:"relative",top:"auto",left:"auto"});
this._renderProxy();c=m(this.helper.css("left"));var f=m(this.helper.css("top"));if(a.containment){c+=e(a.containment).scrollLeft()||0;f+=e(a.containment).scrollTop()||0}this.offset=this.helper.offset();this.position={left:c,top:f};this.size=this._helper?{width:d.outerWidth(),height:d.outerHeight()}:{width:d.width(),height:d.height()};this.originalSize=this._helper?{width:d.outerWidth(),height:d.outerHeight()}:{width:d.width(),height:d.height()};this.originalPosition={left:c,top:f};this.sizeDiff=
{width:d.outerWidth()-d.width(),height:d.outerHeight()-d.height()};this.originalMousePosition={left:b.pageX,top:b.pageY};this.aspectRatio=typeof a.aspectRatio=="number"?a.aspectRatio:this.originalSize.width/this.originalSize.height||1;a=e(".ui-resizable-"+this.axis).css("cursor");e("body").css("cursor",a=="auto"?this.axis+"-resize":a);d.addClass("ui-resizable-resizing");this._propagate("start",b);return true},_mouseDrag:function(b){var a=this.helper,c=this.originalMousePosition,d=this._change[this.axis];
if(!d)return false;c=d.apply(this,[b,b.pageX-c.left||0,b.pageY-c.top||0]);if(this._aspectRatio||b.shiftKey)c=this._updateRatio(c,b);c=this._respectSize(c,b);this._propagate("resize",b);a.css({top:this.position.top+"px",left:this.position.left+"px",width:this.size.width+"px",height:this.size.height+"px"});!this._helper&&this._proportionallyResizeElements.length&&this._proportionallyResize();this._updateCache(c);this._trigger("resize",b,this.ui());return false},_mouseStop:function(b){this.resizing=
false;var a=this.options,c=this;if(this._helper){var d=this._proportionallyResizeElements,f=d.length&&/textarea/i.test(d[0].nodeName);d=f&&e.ui.hasScroll(d[0],"left")?0:c.sizeDiff.height;f=f?0:c.sizeDiff.width;f={width:c.helper.width()-f,height:c.helper.height()-d};d=parseInt(c.element.css("left"),10)+(c.position.left-c.originalPosition.left)||null;var g=parseInt(c.element.css("top"),10)+(c.position.top-c.originalPosition.top)||null;a.animate||this.element.css(e.extend(f,{top:g,left:d}));c.helper.height(c.size.height);
c.helper.width(c.size.width);this._helper&&!a.animate&&this._proportionallyResize()}e("body").css("cursor","auto");this.element.removeClass("ui-resizable-resizing");this._propagate("stop",b);this._helper&&this.helper.remove();return false},_updateCache:function(b){this.offset=this.helper.offset();if(l(b.left))this.position.left=b.left;if(l(b.top))this.position.top=b.top;if(l(b.height))this.size.height=b.height;if(l(b.width))this.size.width=b.width},_updateRatio:function(b){var a=this.position,c=this.size,
d=this.axis;if(b.height)b.width=c.height*this.aspectRatio;else if(b.width)b.height=c.width/this.aspectRatio;if(d=="sw"){b.left=a.left+(c.width-b.width);b.top=null}if(d=="nw"){b.top=a.top+(c.height-b.height);b.left=a.left+(c.width-b.width)}return b},_respectSize:function(b){var a=this.options,c=this.axis,d=l(b.width)&&a.maxWidth&&a.maxWidth<b.width,f=l(b.height)&&a.maxHeight&&a.maxHeight<b.height,g=l(b.width)&&a.minWidth&&a.minWidth>b.width,h=l(b.height)&&a.minHeight&&a.minHeight>b.height;if(g)b.width=
a.minWidth;if(h)b.height=a.minHeight;if(d)b.width=a.maxWidth;if(f)b.height=a.maxHeight;var i=this.originalPosition.left+this.originalSize.width,j=this.position.top+this.size.height,k=/sw|nw|w/.test(c);c=/nw|ne|n/.test(c);if(g&&k)b.left=i-a.minWidth;if(d&&k)b.left=i-a.maxWidth;if(h&&c)b.top=j-a.minHeight;if(f&&c)b.top=j-a.maxHeight;if((a=!b.width&&!b.height)&&!b.left&&b.top)b.top=null;else if(a&&!b.top&&b.left)b.left=null;return b},_proportionallyResize:function(){if(this._proportionallyResizeElements.length)for(var b=
this.helper||this.element,a=0;a<this._proportionallyResizeElements.length;a++){var c=this._proportionallyResizeElements[a];if(!this.borderDif){var d=[c.css("borderTopWidth"),c.css("borderRightWidth"),c.css("borderBottomWidth"),c.css("borderLeftWidth")],f=[c.css("paddingTop"),c.css("paddingRight"),c.css("paddingBottom"),c.css("paddingLeft")];this.borderDif=e.map(d,function(g,h){g=parseInt(g,10)||0;h=parseInt(f[h],10)||0;return g+h})}e.browser.msie&&(e(b).is(":hidden")||e(b).parents(":hidden").length)||
c.css({height:b.height()-this.borderDif[0]-this.borderDif[2]||0,width:b.width()-this.borderDif[1]-this.borderDif[3]||0})}},_renderProxy:function(){var b=this.options;this.elementOffset=this.element.offset();if(this._helper){this.helper=this.helper||e('<div style="overflow:hidden;"></div>');var a=e.browser.msie&&e.browser.version<7,c=a?1:0;a=a?2:-1;this.helper.addClass(this._helper).css({width:this.element.outerWidth()+a,height:this.element.outerHeight()+a,position:"absolute",left:this.elementOffset.left-
c+"px",top:this.elementOffset.top-c+"px",zIndex:++b.zIndex});this.helper.appendTo("body").disableSelection()}else this.helper=this.element},_change:{e:function(b,a){return{width:this.originalSize.width+a}},w:function(b,a){return{left:this.originalPosition.left+a,width:this.originalSize.width-a}},n:function(b,a,c){return{top:this.originalPosition.top+c,height:this.originalSize.height-c}},s:function(b,a,c){return{height:this.originalSize.height+c}},se:function(b,a,c){return e.extend(this._change.s.apply(this,
arguments),this._change.e.apply(this,[b,a,c]))},sw:function(b,a,c){return e.extend(this._change.s.apply(this,arguments),this._change.w.apply(this,[b,a,c]))},ne:function(b,a,c){return e.extend(this._change.n.apply(this,arguments),this._change.e.apply(this,[b,a,c]))},nw:function(b,a,c){return e.extend(this._change.n.apply(this,arguments),this._change.w.apply(this,[b,a,c]))}},_propagate:function(b,a){e.ui.plugin.call(this,b,[a,this.ui()]);b!="resize"&&this._trigger(b,a,this.ui())},plugins:{},ui:function(){return{originalElement:this.originalElement,
element:this.element,helper:this.helper,position:this.position,size:this.size,originalSize:this.originalSize,originalPosition:this.originalPosition}}});e.extend(e.ui.resizable,{version:"1.8.13"});e.ui.plugin.add("resizable","alsoResize",{start:function(){var b=e(this).data("resizable").options,a=function(c){e(c).each(function(){var d=e(this);d.data("resizable-alsoresize",{width:parseInt(d.width(),10),height:parseInt(d.height(),10),left:parseInt(d.css("left"),10),top:parseInt(d.css("top"),10),position:d.css("position")})})};
if(typeof b.alsoResize=="object"&&!b.alsoResize.parentNode)if(b.alsoResize.length){b.alsoResize=b.alsoResize[0];a(b.alsoResize)}else e.each(b.alsoResize,function(c){a(c)});else a(b.alsoResize)},resize:function(b,a){var c=e(this).data("resizable");b=c.options;var d=c.originalSize,f=c.originalPosition,g={height:c.size.height-d.height||0,width:c.size.width-d.width||0,top:c.position.top-f.top||0,left:c.position.left-f.left||0},h=function(i,j){e(i).each(function(){var k=e(this),q=e(this).data("resizable-alsoresize"),
p={},r=j&&j.length?j:k.parents(a.originalElement[0]).length?["width","height"]:["width","height","top","left"];e.each(r,function(n,o){if((n=(q[o]||0)+(g[o]||0))&&n>=0)p[o]=n||null});if(e.browser.opera&&/relative/.test(k.css("position"))){c._revertToRelativePosition=true;k.css({position:"absolute",top:"auto",left:"auto"})}k.css(p)})};typeof b.alsoResize=="object"&&!b.alsoResize.nodeType?e.each(b.alsoResize,function(i,j){h(i,j)}):h(b.alsoResize)},stop:function(){var b=e(this).data("resizable"),a=b.options,
c=function(d){e(d).each(function(){var f=e(this);f.css({position:f.data("resizable-alsoresize").position})})};if(b._revertToRelativePosition){b._revertToRelativePosition=false;typeof a.alsoResize=="object"&&!a.alsoResize.nodeType?e.each(a.alsoResize,function(d){c(d)}):c(a.alsoResize)}e(this).removeData("resizable-alsoresize")}});e.ui.plugin.add("resizable","animate",{stop:function(b){var a=e(this).data("resizable"),c=a.options,d=a._proportionallyResizeElements,f=d.length&&/textarea/i.test(d[0].nodeName),
g=f&&e.ui.hasScroll(d[0],"left")?0:a.sizeDiff.height;f={width:a.size.width-(f?0:a.sizeDiff.width),height:a.size.height-g};g=parseInt(a.element.css("left"),10)+(a.position.left-a.originalPosition.left)||null;var h=parseInt(a.element.css("top"),10)+(a.position.top-a.originalPosition.top)||null;a.element.animate(e.extend(f,h&&g?{top:h,left:g}:{}),{duration:c.animateDuration,easing:c.animateEasing,step:function(){var i={width:parseInt(a.element.css("width"),10),height:parseInt(a.element.css("height"),
10),top:parseInt(a.element.css("top"),10),left:parseInt(a.element.css("left"),10)};d&&d.length&&e(d[0]).css({width:i.width,height:i.height});a._updateCache(i);a._propagate("resize",b)}})}});e.ui.plugin.add("resizable","containment",{start:function(){var b=e(this).data("resizable"),a=b.element,c=b.options.containment;if(a=c instanceof e?c.get(0):/parent/.test(c)?a.parent().get(0):c){b.containerElement=e(a);if(/document/.test(c)||c==document){b.containerOffset={left:0,top:0};b.containerPosition={left:0,
top:0};b.parentData={element:e(document),left:0,top:0,width:e(document).width(),height:e(document).height()||document.body.parentNode.scrollHeight}}else{var d=e(a),f=[];e(["Top","Right","Left","Bottom"]).each(function(i,j){f[i]=m(d.css("padding"+j))});b.containerOffset=d.offset();b.containerPosition=d.position();b.containerSize={height:d.innerHeight()-f[3],width:d.innerWidth()-f[1]};c=b.containerOffset;var g=b.containerSize.height,h=b.containerSize.width;h=e.ui.hasScroll(a,"left")?a.scrollWidth:h;
g=e.ui.hasScroll(a)?a.scrollHeight:g;b.parentData={element:a,left:c.left,top:c.top,width:h,height:g}}}},resize:function(b){var a=e(this).data("resizable"),c=a.options,d=a.containerOffset,f=a.position;b=a._aspectRatio||b.shiftKey;var g={top:0,left:0},h=a.containerElement;if(h[0]!=document&&/static/.test(h.css("position")))g=d;if(f.left<(a._helper?d.left:0)){a.size.width+=a._helper?a.position.left-d.left:a.position.left-g.left;if(b)a.size.height=a.size.width/c.aspectRatio;a.position.left=c.helper?d.left:
0}if(f.top<(a._helper?d.top:0)){a.size.height+=a._helper?a.position.top-d.top:a.position.top;if(b)a.size.width=a.size.height*c.aspectRatio;a.position.top=a._helper?d.top:0}a.offset.left=a.parentData.left+a.position.left;a.offset.top=a.parentData.top+a.position.top;c=Math.abs((a._helper?a.offset.left-g.left:a.offset.left-g.left)+a.sizeDiff.width);d=Math.abs((a._helper?a.offset.top-g.top:a.offset.top-d.top)+a.sizeDiff.height);f=a.containerElement.get(0)==a.element.parent().get(0);g=/relative|absolute/.test(a.containerElement.css("position"));
if(f&&g)c-=a.parentData.left;if(c+a.size.width>=a.parentData.width){a.size.width=a.parentData.width-c;if(b)a.size.height=a.size.width/a.aspectRatio}if(d+a.size.height>=a.parentData.height){a.size.height=a.parentData.height-d;if(b)a.size.width=a.size.height*a.aspectRatio}},stop:function(){var b=e(this).data("resizable"),a=b.options,c=b.containerOffset,d=b.containerPosition,f=b.containerElement,g=e(b.helper),h=g.offset(),i=g.outerWidth()-b.sizeDiff.width;g=g.outerHeight()-b.sizeDiff.height;b._helper&&
!a.animate&&/relative/.test(f.css("position"))&&e(this).css({left:h.left-d.left-c.left,width:i,height:g});b._helper&&!a.animate&&/static/.test(f.css("position"))&&e(this).css({left:h.left-d.left-c.left,width:i,height:g})}});e.ui.plugin.add("resizable","ghost",{start:function(){var b=e(this).data("resizable"),a=b.options,c=b.size;b.ghost=b.originalElement.clone();b.ghost.css({opacity:0.25,display:"block",position:"relative",height:c.height,width:c.width,margin:0,left:0,top:0}).addClass("ui-resizable-ghost").addClass(typeof a.ghost==
"string"?a.ghost:"");b.ghost.appendTo(b.helper)},resize:function(){var b=e(this).data("resizable");b.ghost&&b.ghost.css({position:"relative",height:b.size.height,width:b.size.width})},stop:function(){var b=e(this).data("resizable");b.ghost&&b.helper&&b.helper.get(0).removeChild(b.ghost.get(0))}});e.ui.plugin.add("resizable","grid",{resize:function(){var b=e(this).data("resizable"),a=b.options,c=b.size,d=b.originalSize,f=b.originalPosition,g=b.axis;a.grid=typeof a.grid=="number"?[a.grid,a.grid]:a.grid;
var h=Math.round((c.width-d.width)/(a.grid[0]||1))*(a.grid[0]||1);a=Math.round((c.height-d.height)/(a.grid[1]||1))*(a.grid[1]||1);if(/^(se|s|e)$/.test(g)){b.size.width=d.width+h;b.size.height=d.height+a}else if(/^(ne)$/.test(g)){b.size.width=d.width+h;b.size.height=d.height+a;b.position.top=f.top-a}else{if(/^(sw)$/.test(g)){b.size.width=d.width+h;b.size.height=d.height+a}else{b.size.width=d.width+h;b.size.height=d.height+a;b.position.top=f.top-a}b.position.left=f.left-h}}});var m=function(b){return parseInt(b,
10)||0},l=function(b){return!isNaN(parseInt(b,10))}})(jQuery);
;/*
 * jQuery UI Selectable 1.8.13
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Selectables
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */
(function(e){e.widget("ui.selectable",e.ui.mouse,{options:{appendTo:"body",autoRefresh:true,distance:0,filter:"*",tolerance:"touch"},_create:function(){var c=this;this.element.addClass("ui-selectable");this.dragged=false;var f;this.refresh=function(){f=e(c.options.filter,c.element[0]);f.each(function(){var d=e(this),b=d.offset();e.data(this,"selectable-item",{element:this,$element:d,left:b.left,top:b.top,right:b.left+d.outerWidth(),bottom:b.top+d.outerHeight(),startselected:false,selected:d.hasClass("ui-selected"),
selecting:d.hasClass("ui-selecting"),unselecting:d.hasClass("ui-unselecting")})})};this.refresh();this.selectees=f.addClass("ui-selectee");this._mouseInit();this.helper=e("<div class='ui-selectable-helper'></div>")},destroy:function(){this.selectees.removeClass("ui-selectee").removeData("selectable-item");this.element.removeClass("ui-selectable ui-selectable-disabled").removeData("selectable").unbind(".selectable");this._mouseDestroy();return this},_mouseStart:function(c){var f=this;this.opos=[c.pageX,
c.pageY];if(!this.options.disabled){var d=this.options;this.selectees=e(d.filter,this.element[0]);this._trigger("start",c);e(d.appendTo).append(this.helper);this.helper.css({left:c.clientX,top:c.clientY,width:0,height:0});d.autoRefresh&&this.refresh();this.selectees.filter(".ui-selected").each(function(){var b=e.data(this,"selectable-item");b.startselected=true;if(!c.metaKey){b.$element.removeClass("ui-selected");b.selected=false;b.$element.addClass("ui-unselecting");b.unselecting=true;f._trigger("unselecting",
c,{unselecting:b.element})}});e(c.target).parents().andSelf().each(function(){var b=e.data(this,"selectable-item");if(b){var g=!c.metaKey||!b.$element.hasClass("ui-selected");b.$element.removeClass(g?"ui-unselecting":"ui-selected").addClass(g?"ui-selecting":"ui-unselecting");b.unselecting=!g;b.selecting=g;(b.selected=g)?f._trigger("selecting",c,{selecting:b.element}):f._trigger("unselecting",c,{unselecting:b.element});return false}})}},_mouseDrag:function(c){var f=this;this.dragged=true;if(!this.options.disabled){var d=
this.options,b=this.opos[0],g=this.opos[1],h=c.pageX,i=c.pageY;if(b>h){var j=h;h=b;b=j}if(g>i){j=i;i=g;g=j}this.helper.css({left:b,top:g,width:h-b,height:i-g});this.selectees.each(function(){var a=e.data(this,"selectable-item");if(!(!a||a.element==f.element[0])){var k=false;if(d.tolerance=="touch")k=!(a.left>h||a.right<b||a.top>i||a.bottom<g);else if(d.tolerance=="fit")k=a.left>b&&a.right<h&&a.top>g&&a.bottom<i;if(k){if(a.selected){a.$element.removeClass("ui-selected");a.selected=false}if(a.unselecting){a.$element.removeClass("ui-unselecting");
a.unselecting=false}if(!a.selecting){a.$element.addClass("ui-selecting");a.selecting=true;f._trigger("selecting",c,{selecting:a.element})}}else{if(a.selecting)if(c.metaKey&&a.startselected){a.$element.removeClass("ui-selecting");a.selecting=false;a.$element.addClass("ui-selected");a.selected=true}else{a.$element.removeClass("ui-selecting");a.selecting=false;if(a.startselected){a.$element.addClass("ui-unselecting");a.unselecting=true}f._trigger("unselecting",c,{unselecting:a.element})}if(a.selected)if(!c.metaKey&&
!a.startselected){a.$element.removeClass("ui-selected");a.selected=false;a.$element.addClass("ui-unselecting");a.unselecting=true;f._trigger("unselecting",c,{unselecting:a.element})}}}});return false}},_mouseStop:function(c){var f=this;this.dragged=false;e(".ui-unselecting",this.element[0]).each(function(){var d=e.data(this,"selectable-item");d.$element.removeClass("ui-unselecting");d.unselecting=false;d.startselected=false;f._trigger("unselected",c,{unselected:d.element})});e(".ui-selecting",this.element[0]).each(function(){var d=
e.data(this,"selectable-item");d.$element.removeClass("ui-selecting").addClass("ui-selected");d.selecting=false;d.selected=true;d.startselected=true;f._trigger("selected",c,{selected:d.element})});this._trigger("stop",c);this.helper.remove();return false}});e.extend(e.ui.selectable,{version:"1.8.13"})})(jQuery);
;/*
 * jQuery UI Sortable 1.8.13
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Sortables
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */
(function(d){d.widget("ui.sortable",d.ui.mouse,{widgetEventPrefix:"sort",options:{appendTo:"parent",axis:false,connectWith:false,containment:false,cursor:"auto",cursorAt:false,dropOnEmpty:true,forcePlaceholderSize:false,forceHelperSize:false,grid:false,handle:false,helper:"original",items:"> *",opacity:false,placeholder:false,revert:false,scroll:true,scrollSensitivity:20,scrollSpeed:20,scope:"default",tolerance:"intersect",zIndex:1E3},_create:function(){var a=this.options;this.containerCache={};this.element.addClass("ui-sortable");
this.refresh();this.floating=this.items.length?a.axis==="x"||/left|right/.test(this.items[0].item.css("float"))||/inline|table-cell/.test(this.items[0].item.css("display")):false;this.offset=this.element.offset();this._mouseInit()},destroy:function(){this.element.removeClass("ui-sortable ui-sortable-disabled").removeData("sortable").unbind(".sortable");this._mouseDestroy();for(var a=this.items.length-1;a>=0;a--)this.items[a].item.removeData("sortable-item");return this},_setOption:function(a,b){if(a===
"disabled"){this.options[a]=b;this.widget()[b?"addClass":"removeClass"]("ui-sortable-disabled")}else d.Widget.prototype._setOption.apply(this,arguments)},_mouseCapture:function(a,b){if(this.reverting)return false;if(this.options.disabled||this.options.type=="static")return false;this._refreshItems(a);var c=null,e=this;d(a.target).parents().each(function(){if(d.data(this,"sortable-item")==e){c=d(this);return false}});if(d.data(a.target,"sortable-item")==e)c=d(a.target);if(!c)return false;if(this.options.handle&&
!b){var f=false;d(this.options.handle,c).find("*").andSelf().each(function(){if(this==a.target)f=true});if(!f)return false}this.currentItem=c;this._removeCurrentsFromItems();return true},_mouseStart:function(a,b,c){b=this.options;var e=this;this.currentContainer=this;this.refreshPositions();this.helper=this._createHelper(a);this._cacheHelperProportions();this._cacheMargins();this.scrollParent=this.helper.scrollParent();this.offset=this.currentItem.offset();this.offset={top:this.offset.top-this.margins.top,
left:this.offset.left-this.margins.left};this.helper.css("position","absolute");this.cssPosition=this.helper.css("position");d.extend(this.offset,{click:{left:a.pageX-this.offset.left,top:a.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()});this.originalPosition=this._generatePosition(a);this.originalPageX=a.pageX;this.originalPageY=a.pageY;b.cursorAt&&this._adjustOffsetFromHelper(b.cursorAt);this.domPosition={prev:this.currentItem.prev()[0],parent:this.currentItem.parent()[0]};
this.helper[0]!=this.currentItem[0]&&this.currentItem.hide();this._createPlaceholder();b.containment&&this._setContainment();if(b.cursor){if(d("body").css("cursor"))this._storedCursor=d("body").css("cursor");d("body").css("cursor",b.cursor)}if(b.opacity){if(this.helper.css("opacity"))this._storedOpacity=this.helper.css("opacity");this.helper.css("opacity",b.opacity)}if(b.zIndex){if(this.helper.css("zIndex"))this._storedZIndex=this.helper.css("zIndex");this.helper.css("zIndex",b.zIndex)}if(this.scrollParent[0]!=
document&&this.scrollParent[0].tagName!="HTML")this.overflowOffset=this.scrollParent.offset();this._trigger("start",a,this._uiHash());this._preserveHelperProportions||this._cacheHelperProportions();if(!c)for(c=this.containers.length-1;c>=0;c--)this.containers[c]._trigger("activate",a,e._uiHash(this));if(d.ui.ddmanager)d.ui.ddmanager.current=this;d.ui.ddmanager&&!b.dropBehaviour&&d.ui.ddmanager.prepareOffsets(this,a);this.dragging=true;this.helper.addClass("ui-sortable-helper");this._mouseDrag(a);
return true},_mouseDrag:function(a){this.position=this._generatePosition(a);this.positionAbs=this._convertPositionTo("absolute");if(!this.lastPositionAbs)this.lastPositionAbs=this.positionAbs;if(this.options.scroll){var b=this.options,c=false;if(this.scrollParent[0]!=document&&this.scrollParent[0].tagName!="HTML"){if(this.overflowOffset.top+this.scrollParent[0].offsetHeight-a.pageY<b.scrollSensitivity)this.scrollParent[0].scrollTop=c=this.scrollParent[0].scrollTop+b.scrollSpeed;else if(a.pageY-this.overflowOffset.top<
b.scrollSensitivity)this.scrollParent[0].scrollTop=c=this.scrollParent[0].scrollTop-b.scrollSpeed;if(this.overflowOffset.left+this.scrollParent[0].offsetWidth-a.pageX<b.scrollSensitivity)this.scrollParent[0].scrollLeft=c=this.scrollParent[0].scrollLeft+b.scrollSpeed;else if(a.pageX-this.overflowOffset.left<b.scrollSensitivity)this.scrollParent[0].scrollLeft=c=this.scrollParent[0].scrollLeft-b.scrollSpeed}else{if(a.pageY-d(document).scrollTop()<b.scrollSensitivity)c=d(document).scrollTop(d(document).scrollTop()-
b.scrollSpeed);else if(d(window).height()-(a.pageY-d(document).scrollTop())<b.scrollSensitivity)c=d(document).scrollTop(d(document).scrollTop()+b.scrollSpeed);if(a.pageX-d(document).scrollLeft()<b.scrollSensitivity)c=d(document).scrollLeft(d(document).scrollLeft()-b.scrollSpeed);else if(d(window).width()-(a.pageX-d(document).scrollLeft())<b.scrollSensitivity)c=d(document).scrollLeft(d(document).scrollLeft()+b.scrollSpeed)}c!==false&&d.ui.ddmanager&&!b.dropBehaviour&&d.ui.ddmanager.prepareOffsets(this,
a)}this.positionAbs=this._convertPositionTo("absolute");if(!this.options.axis||this.options.axis!="y")this.helper[0].style.left=this.position.left+"px";if(!this.options.axis||this.options.axis!="x")this.helper[0].style.top=this.position.top+"px";for(b=this.items.length-1;b>=0;b--){c=this.items[b];var e=c.item[0],f=this._intersectsWithPointer(c);if(f)if(e!=this.currentItem[0]&&this.placeholder[f==1?"next":"prev"]()[0]!=e&&!d.ui.contains(this.placeholder[0],e)&&(this.options.type=="semi-dynamic"?!d.ui.contains(this.element[0],
e):true)){this.direction=f==1?"down":"up";if(this.options.tolerance=="pointer"||this._intersectsWithSides(c))this._rearrange(a,c);else break;this._trigger("change",a,this._uiHash());break}}this._contactContainers(a);d.ui.ddmanager&&d.ui.ddmanager.drag(this,a);this._trigger("sort",a,this._uiHash());this.lastPositionAbs=this.positionAbs;return false},_mouseStop:function(a,b){if(a){d.ui.ddmanager&&!this.options.dropBehaviour&&d.ui.ddmanager.drop(this,a);if(this.options.revert){var c=this;b=c.placeholder.offset();
c.reverting=true;d(this.helper).animate({left:b.left-this.offset.parent.left-c.margins.left+(this.offsetParent[0]==document.body?0:this.offsetParent[0].scrollLeft),top:b.top-this.offset.parent.top-c.margins.top+(this.offsetParent[0]==document.body?0:this.offsetParent[0].scrollTop)},parseInt(this.options.revert,10)||500,function(){c._clear(a)})}else this._clear(a,b);return false}},cancel:function(){var a=this;if(this.dragging){this._mouseUp({target:null});this.options.helper=="original"?this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper"):
this.currentItem.show();for(var b=this.containers.length-1;b>=0;b--){this.containers[b]._trigger("deactivate",null,a._uiHash(this));if(this.containers[b].containerCache.over){this.containers[b]._trigger("out",null,a._uiHash(this));this.containers[b].containerCache.over=0}}}if(this.placeholder){this.placeholder[0].parentNode&&this.placeholder[0].parentNode.removeChild(this.placeholder[0]);this.options.helper!="original"&&this.helper&&this.helper[0].parentNode&&this.helper.remove();d.extend(this,{helper:null,
dragging:false,reverting:false,_noFinalSort:null});this.domPosition.prev?d(this.domPosition.prev).after(this.currentItem):d(this.domPosition.parent).prepend(this.currentItem)}return this},serialize:function(a){var b=this._getItemsAsjQuery(a&&a.connected),c=[];a=a||{};d(b).each(function(){var e=(d(a.item||this).attr(a.attribute||"id")||"").match(a.expression||/(.+)[-=_](.+)/);if(e)c.push((a.key||e[1]+"[]")+"="+(a.key&&a.expression?e[1]:e[2]))});!c.length&&a.key&&c.push(a.key+"=");return c.join("&")},
toArray:function(a){var b=this._getItemsAsjQuery(a&&a.connected),c=[];a=a||{};b.each(function(){c.push(d(a.item||this).attr(a.attribute||"id")||"")});return c},_intersectsWith:function(a){var b=this.positionAbs.left,c=b+this.helperProportions.width,e=this.positionAbs.top,f=e+this.helperProportions.height,g=a.left,h=g+a.width,i=a.top,k=i+a.height,j=this.offset.click.top,l=this.offset.click.left;j=e+j>i&&e+j<k&&b+l>g&&b+l<h;return this.options.tolerance=="pointer"||this.options.forcePointerForContainers||
this.options.tolerance!="pointer"&&this.helperProportions[this.floating?"width":"height"]>a[this.floating?"width":"height"]?j:g<b+this.helperProportions.width/2&&c-this.helperProportions.width/2<h&&i<e+this.helperProportions.height/2&&f-this.helperProportions.height/2<k},_intersectsWithPointer:function(a){var b=d.ui.isOverAxis(this.positionAbs.top+this.offset.click.top,a.top,a.height);a=d.ui.isOverAxis(this.positionAbs.left+this.offset.click.left,a.left,a.width);b=b&&a;a=this._getDragVerticalDirection();
var c=this._getDragHorizontalDirection();if(!b)return false;return this.floating?c&&c=="right"||a=="down"?2:1:a&&(a=="down"?2:1)},_intersectsWithSides:function(a){var b=d.ui.isOverAxis(this.positionAbs.top+this.offset.click.top,a.top+a.height/2,a.height);a=d.ui.isOverAxis(this.positionAbs.left+this.offset.click.left,a.left+a.width/2,a.width);var c=this._getDragVerticalDirection(),e=this._getDragHorizontalDirection();return this.floating&&e?e=="right"&&a||e=="left"&&!a:c&&(c=="down"&&b||c=="up"&&!b)},
_getDragVerticalDirection:function(){var a=this.positionAbs.top-this.lastPositionAbs.top;return a!=0&&(a>0?"down":"up")},_getDragHorizontalDirection:function(){var a=this.positionAbs.left-this.lastPositionAbs.left;return a!=0&&(a>0?"right":"left")},refresh:function(a){this._refreshItems(a);this.refreshPositions();return this},_connectWith:function(){var a=this.options;return a.connectWith.constructor==String?[a.connectWith]:a.connectWith},_getItemsAsjQuery:function(a){var b=[],c=[],e=this._connectWith();
if(e&&a)for(a=e.length-1;a>=0;a--)for(var f=d(e[a]),g=f.length-1;g>=0;g--){var h=d.data(f[g],"sortable");if(h&&h!=this&&!h.options.disabled)c.push([d.isFunction(h.options.items)?h.options.items.call(h.element):d(h.options.items,h.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),h])}c.push([d.isFunction(this.options.items)?this.options.items.call(this.element,null,{options:this.options,item:this.currentItem}):d(this.options.items,this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),
this]);for(a=c.length-1;a>=0;a--)c[a][0].each(function(){b.push(this)});return d(b)},_removeCurrentsFromItems:function(){for(var a=this.currentItem.find(":data(sortable-item)"),b=0;b<this.items.length;b++)for(var c=0;c<a.length;c++)a[c]==this.items[b].item[0]&&this.items.splice(b,1)},_refreshItems:function(a){this.items=[];this.containers=[this];var b=this.items,c=[[d.isFunction(this.options.items)?this.options.items.call(this.element[0],a,{item:this.currentItem}):d(this.options.items,this.element),
this]],e=this._connectWith();if(e)for(var f=e.length-1;f>=0;f--)for(var g=d(e[f]),h=g.length-1;h>=0;h--){var i=d.data(g[h],"sortable");if(i&&i!=this&&!i.options.disabled){c.push([d.isFunction(i.options.items)?i.options.items.call(i.element[0],a,{item:this.currentItem}):d(i.options.items,i.element),i]);this.containers.push(i)}}for(f=c.length-1;f>=0;f--){a=c[f][1];e=c[f][0];h=0;for(g=e.length;h<g;h++){i=d(e[h]);i.data("sortable-item",a);b.push({item:i,instance:a,width:0,height:0,left:0,top:0})}}},refreshPositions:function(a){if(this.offsetParent&&
this.helper)this.offset.parent=this._getParentOffset();for(var b=this.items.length-1;b>=0;b--){var c=this.items[b];if(!(c.instance!=this.currentContainer&&this.currentContainer&&c.item[0]!=this.currentItem[0])){var e=this.options.toleranceElement?d(this.options.toleranceElement,c.item):c.item;if(!a){c.width=e.outerWidth();c.height=e.outerHeight()}e=e.offset();c.left=e.left;c.top=e.top}}if(this.options.custom&&this.options.custom.refreshContainers)this.options.custom.refreshContainers.call(this);else for(b=
this.containers.length-1;b>=0;b--){e=this.containers[b].element.offset();this.containers[b].containerCache.left=e.left;this.containers[b].containerCache.top=e.top;this.containers[b].containerCache.width=this.containers[b].element.outerWidth();this.containers[b].containerCache.height=this.containers[b].element.outerHeight()}return this},_createPlaceholder:function(a){var b=a||this,c=b.options;if(!c.placeholder||c.placeholder.constructor==String){var e=c.placeholder;c.placeholder={element:function(){var f=
d(document.createElement(b.currentItem[0].nodeName)).addClass(e||b.currentItem[0].className+" ui-sortable-placeholder").removeClass("ui-sortable-helper")[0];if(!e)f.style.visibility="hidden";return f},update:function(f,g){if(!(e&&!c.forcePlaceholderSize)){g.height()||g.height(b.currentItem.innerHeight()-parseInt(b.currentItem.css("paddingTop")||0,10)-parseInt(b.currentItem.css("paddingBottom")||0,10));g.width()||g.width(b.currentItem.innerWidth()-parseInt(b.currentItem.css("paddingLeft")||0,10)-parseInt(b.currentItem.css("paddingRight")||
0,10))}}}}b.placeholder=d(c.placeholder.element.call(b.element,b.currentItem));b.currentItem.after(b.placeholder);c.placeholder.update(b,b.placeholder)},_contactContainers:function(a){for(var b=null,c=null,e=this.containers.length-1;e>=0;e--)if(!d.ui.contains(this.currentItem[0],this.containers[e].element[0]))if(this._intersectsWith(this.containers[e].containerCache)){if(!(b&&d.ui.contains(this.containers[e].element[0],b.element[0]))){b=this.containers[e];c=e}}else if(this.containers[e].containerCache.over){this.containers[e]._trigger("out",
a,this._uiHash(this));this.containers[e].containerCache.over=0}if(b)if(this.containers.length===1){this.containers[c]._trigger("over",a,this._uiHash(this));this.containers[c].containerCache.over=1}else if(this.currentContainer!=this.containers[c]){b=1E4;e=null;for(var f=this.positionAbs[this.containers[c].floating?"left":"top"],g=this.items.length-1;g>=0;g--)if(d.ui.contains(this.containers[c].element[0],this.items[g].item[0])){var h=this.items[g][this.containers[c].floating?"left":"top"];if(Math.abs(h-
f)<b){b=Math.abs(h-f);e=this.items[g]}}if(e||this.options.dropOnEmpty){this.currentContainer=this.containers[c];e?this._rearrange(a,e,null,true):this._rearrange(a,null,this.containers[c].element,true);this._trigger("change",a,this._uiHash());this.containers[c]._trigger("change",a,this._uiHash(this));this.options.placeholder.update(this.currentContainer,this.placeholder);this.containers[c]._trigger("over",a,this._uiHash(this));this.containers[c].containerCache.over=1}}},_createHelper:function(a){var b=
this.options;a=d.isFunction(b.helper)?d(b.helper.apply(this.element[0],[a,this.currentItem])):b.helper=="clone"?this.currentItem.clone():this.currentItem;a.parents("body").length||d(b.appendTo!="parent"?b.appendTo:this.currentItem[0].parentNode)[0].appendChild(a[0]);if(a[0]==this.currentItem[0])this._storedCSS={width:this.currentItem[0].style.width,height:this.currentItem[0].style.height,position:this.currentItem.css("position"),top:this.currentItem.css("top"),left:this.currentItem.css("left")};if(a[0].style.width==
""||b.forceHelperSize)a.width(this.currentItem.width());if(a[0].style.height==""||b.forceHelperSize)a.height(this.currentItem.height());return a},_adjustOffsetFromHelper:function(a){if(typeof a=="string")a=a.split(" ");if(d.isArray(a))a={left:+a[0],top:+a[1]||0};if("left"in a)this.offset.click.left=a.left+this.margins.left;if("right"in a)this.offset.click.left=this.helperProportions.width-a.right+this.margins.left;if("top"in a)this.offset.click.top=a.top+this.margins.top;if("bottom"in a)this.offset.click.top=
this.helperProportions.height-a.bottom+this.margins.top},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var a=this.offsetParent.offset();if(this.cssPosition=="absolute"&&this.scrollParent[0]!=document&&d.ui.contains(this.scrollParent[0],this.offsetParent[0])){a.left+=this.scrollParent.scrollLeft();a.top+=this.scrollParent.scrollTop()}if(this.offsetParent[0]==document.body||this.offsetParent[0].tagName&&this.offsetParent[0].tagName.toLowerCase()=="html"&&d.browser.msie)a=
{top:0,left:0};return{top:a.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:a.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if(this.cssPosition=="relative"){var a=this.currentItem.position();return{top:a.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:a.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}else return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.currentItem.css("marginLeft"),
10)||0,top:parseInt(this.currentItem.css("marginTop"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var a=this.options;if(a.containment=="parent")a.containment=this.helper[0].parentNode;if(a.containment=="document"||a.containment=="window")this.containment=[0-this.offset.relative.left-this.offset.parent.left,0-this.offset.relative.top-this.offset.parent.top,d(a.containment=="document"?
document:window).width()-this.helperProportions.width-this.margins.left,(d(a.containment=="document"?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top];if(!/^(document|window|parent)$/.test(a.containment)){var b=d(a.containment)[0];a=d(a.containment).offset();var c=d(b).css("overflow")!="hidden";this.containment=[a.left+(parseInt(d(b).css("borderLeftWidth"),10)||0)+(parseInt(d(b).css("paddingLeft"),10)||0)-this.margins.left,a.top+(parseInt(d(b).css("borderTopWidth"),
10)||0)+(parseInt(d(b).css("paddingTop"),10)||0)-this.margins.top,a.left+(c?Math.max(b.scrollWidth,b.offsetWidth):b.offsetWidth)-(parseInt(d(b).css("borderLeftWidth"),10)||0)-(parseInt(d(b).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left,a.top+(c?Math.max(b.scrollHeight,b.offsetHeight):b.offsetHeight)-(parseInt(d(b).css("borderTopWidth"),10)||0)-(parseInt(d(b).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top]}},_convertPositionTo:function(a,b){if(!b)b=
this.position;a=a=="absolute"?1:-1;var c=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=document&&d.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,e=/(html|body)/i.test(c[0].tagName);return{top:b.top+this.offset.relative.top*a+this.offset.parent.top*a-(d.browser.safari&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():e?0:c.scrollTop())*a),left:b.left+this.offset.relative.left*a+this.offset.parent.left*a-(d.browser.safari&&
this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():e?0:c.scrollLeft())*a)}},_generatePosition:function(a){var b=this.options,c=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=document&&d.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,e=/(html|body)/i.test(c[0].tagName);if(this.cssPosition=="relative"&&!(this.scrollParent[0]!=document&&this.scrollParent[0]!=this.offsetParent[0]))this.offset.relative=this._getRelativeOffset();
var f=a.pageX,g=a.pageY;if(this.originalPosition){if(this.containment){if(a.pageX-this.offset.click.left<this.containment[0])f=this.containment[0]+this.offset.click.left;if(a.pageY-this.offset.click.top<this.containment[1])g=this.containment[1]+this.offset.click.top;if(a.pageX-this.offset.click.left>this.containment[2])f=this.containment[2]+this.offset.click.left;if(a.pageY-this.offset.click.top>this.containment[3])g=this.containment[3]+this.offset.click.top}if(b.grid){g=this.originalPageY+Math.round((g-
this.originalPageY)/b.grid[1])*b.grid[1];g=this.containment?!(g-this.offset.click.top<this.containment[1]||g-this.offset.click.top>this.containment[3])?g:!(g-this.offset.click.top<this.containment[1])?g-b.grid[1]:g+b.grid[1]:g;f=this.originalPageX+Math.round((f-this.originalPageX)/b.grid[0])*b.grid[0];f=this.containment?!(f-this.offset.click.left<this.containment[0]||f-this.offset.click.left>this.containment[2])?f:!(f-this.offset.click.left<this.containment[0])?f-b.grid[0]:f+b.grid[0]:f}}return{top:g-
this.offset.click.top-this.offset.relative.top-this.offset.parent.top+(d.browser.safari&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollTop():e?0:c.scrollTop()),left:f-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+(d.browser.safari&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():e?0:c.scrollLeft())}},_rearrange:function(a,b,c,e){c?c[0].appendChild(this.placeholder[0]):b.item[0].parentNode.insertBefore(this.placeholder[0],
this.direction=="down"?b.item[0]:b.item[0].nextSibling);this.counter=this.counter?++this.counter:1;var f=this,g=this.counter;window.setTimeout(function(){g==f.counter&&f.refreshPositions(!e)},0)},_clear:function(a,b){this.reverting=false;var c=[];!this._noFinalSort&&this.currentItem[0].parentNode&&this.placeholder.before(this.currentItem);this._noFinalSort=null;if(this.helper[0]==this.currentItem[0]){for(var e in this._storedCSS)if(this._storedCSS[e]=="auto"||this._storedCSS[e]=="static")this._storedCSS[e]=
"";this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")}else this.currentItem.show();this.fromOutside&&!b&&c.push(function(f){this._trigger("receive",f,this._uiHash(this.fromOutside))});if((this.fromOutside||this.domPosition.prev!=this.currentItem.prev().not(".ui-sortable-helper")[0]||this.domPosition.parent!=this.currentItem.parent()[0])&&!b)c.push(function(f){this._trigger("update",f,this._uiHash())});if(!d.ui.contains(this.element[0],this.currentItem[0])){b||c.push(function(f){this._trigger("remove",
f,this._uiHash())});for(e=this.containers.length-1;e>=0;e--)if(d.ui.contains(this.containers[e].element[0],this.currentItem[0])&&!b){c.push(function(f){return function(g){f._trigger("receive",g,this._uiHash(this))}}.call(this,this.containers[e]));c.push(function(f){return function(g){f._trigger("update",g,this._uiHash(this))}}.call(this,this.containers[e]))}}for(e=this.containers.length-1;e>=0;e--){b||c.push(function(f){return function(g){f._trigger("deactivate",g,this._uiHash(this))}}.call(this,
this.containers[e]));if(this.containers[e].containerCache.over){c.push(function(f){return function(g){f._trigger("out",g,this._uiHash(this))}}.call(this,this.containers[e]));this.containers[e].containerCache.over=0}}this._storedCursor&&d("body").css("cursor",this._storedCursor);this._storedOpacity&&this.helper.css("opacity",this._storedOpacity);if(this._storedZIndex)this.helper.css("zIndex",this._storedZIndex=="auto"?"":this._storedZIndex);this.dragging=false;if(this.cancelHelperRemoval){if(!b){this._trigger("beforeStop",
a,this._uiHash());for(e=0;e<c.length;e++)c[e].call(this,a);this._trigger("stop",a,this._uiHash())}return false}b||this._trigger("beforeStop",a,this._uiHash());this.placeholder[0].parentNode.removeChild(this.placeholder[0]);this.helper[0]!=this.currentItem[0]&&this.helper.remove();this.helper=null;if(!b){for(e=0;e<c.length;e++)c[e].call(this,a);this._trigger("stop",a,this._uiHash())}this.fromOutside=false;return true},_trigger:function(){d.Widget.prototype._trigger.apply(this,arguments)===false&&this.cancel()},
_uiHash:function(a){var b=a||this;return{helper:b.helper,placeholder:b.placeholder||d([]),position:b.position,originalPosition:b.originalPosition,offset:b.positionAbs,item:b.currentItem,sender:a?a.element:null}}});d.extend(d.ui.sortable,{version:"1.8.13"})})(jQuery);
;/*
 * jQuery UI Accordion 1.8.13
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Accordion
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */
(function(c){c.widget("ui.accordion",{options:{active:0,animated:"slide",autoHeight:true,clearStyle:false,collapsible:false,event:"click",fillSpace:false,header:"> li > :first-child,> :not(li):even",icons:{header:"ui-icon-triangle-1-e",headerSelected:"ui-icon-triangle-1-s"},navigation:false,navigationFilter:function(){return this.href.toLowerCase()===location.href.toLowerCase()}},_create:function(){var a=this,b=a.options;a.running=0;a.element.addClass("ui-accordion ui-widget ui-helper-reset").children("li").addClass("ui-accordion-li-fix");
a.headers=a.element.find(b.header).addClass("ui-accordion-header ui-helper-reset ui-state-default ui-corner-all").bind("mouseenter.accordion",function(){b.disabled||c(this).addClass("ui-state-hover")}).bind("mouseleave.accordion",function(){b.disabled||c(this).removeClass("ui-state-hover")}).bind("focus.accordion",function(){b.disabled||c(this).addClass("ui-state-focus")}).bind("blur.accordion",function(){b.disabled||c(this).removeClass("ui-state-focus")});a.headers.next().addClass("ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom");
if(b.navigation){var d=a.element.find("a").filter(b.navigationFilter).eq(0);if(d.length){var h=d.closest(".ui-accordion-header");a.active=h.length?h:d.closest(".ui-accordion-content").prev()}}a.active=a._findActive(a.active||b.active).addClass("ui-state-default ui-state-active").toggleClass("ui-corner-all").toggleClass("ui-corner-top");a.active.next().addClass("ui-accordion-content-active");a._createIcons();a.resize();a.element.attr("role","tablist");a.headers.attr("role","tab").bind("keydown.accordion",
function(f){return a._keydown(f)}).next().attr("role","tabpanel");a.headers.not(a.active||"").attr({"aria-expanded":"false","aria-selected":"false",tabIndex:-1}).next().hide();a.active.length?a.active.attr({"aria-expanded":"true","aria-selected":"true",tabIndex:0}):a.headers.eq(0).attr("tabIndex",0);c.browser.safari||a.headers.find("a").attr("tabIndex",-1);b.event&&a.headers.bind(b.event.split(" ").join(".accordion ")+".accordion",function(f){a._clickHandler.call(a,f,this);f.preventDefault()})},_createIcons:function(){var a=
this.options;if(a.icons){c("<span></span>").addClass("ui-icon "+a.icons.header).prependTo(this.headers);this.active.children(".ui-icon").toggleClass(a.icons.header).toggleClass(a.icons.headerSelected);this.element.addClass("ui-accordion-icons")}},_destroyIcons:function(){this.headers.children(".ui-icon").remove();this.element.removeClass("ui-accordion-icons")},destroy:function(){var a=this.options;this.element.removeClass("ui-accordion ui-widget ui-helper-reset").removeAttr("role");this.headers.unbind(".accordion").removeClass("ui-accordion-header ui-accordion-disabled ui-helper-reset ui-state-default ui-corner-all ui-state-active ui-state-disabled ui-corner-top").removeAttr("role").removeAttr("aria-expanded").removeAttr("aria-selected").removeAttr("tabIndex");
this.headers.find("a").removeAttr("tabIndex");this._destroyIcons();var b=this.headers.next().css("display","").removeAttr("role").removeClass("ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content ui-accordion-content-active ui-accordion-disabled ui-state-disabled");if(a.autoHeight||a.fillHeight)b.css("height","");return c.Widget.prototype.destroy.call(this)},_setOption:function(a,b){c.Widget.prototype._setOption.apply(this,arguments);a=="active"&&this.activate(b);if(a=="icons"){this._destroyIcons();
b&&this._createIcons()}if(a=="disabled")this.headers.add(this.headers.next())[b?"addClass":"removeClass"]("ui-accordion-disabled ui-state-disabled")},_keydown:function(a){if(!(this.options.disabled||a.altKey||a.ctrlKey)){var b=c.ui.keyCode,d=this.headers.length,h=this.headers.index(a.target),f=false;switch(a.keyCode){case b.RIGHT:case b.DOWN:f=this.headers[(h+1)%d];break;case b.LEFT:case b.UP:f=this.headers[(h-1+d)%d];break;case b.SPACE:case b.ENTER:this._clickHandler({target:a.target},a.target);
a.preventDefault()}if(f){c(a.target).attr("tabIndex",-1);c(f).attr("tabIndex",0);f.focus();return false}return true}},resize:function(){var a=this.options,b;if(a.fillSpace){if(c.browser.msie){var d=this.element.parent().css("overflow");this.element.parent().css("overflow","hidden")}b=this.element.parent().height();c.browser.msie&&this.element.parent().css("overflow",d);this.headers.each(function(){b-=c(this).outerHeight(true)});this.headers.next().each(function(){c(this).height(Math.max(0,b-c(this).innerHeight()+
c(this).height()))}).css("overflow","auto")}else if(a.autoHeight){b=0;this.headers.next().each(function(){b=Math.max(b,c(this).height("").height())}).height(b)}return this},activate:function(a){this.options.active=a;a=this._findActive(a)[0];this._clickHandler({target:a},a);return this},_findActive:function(a){return a?typeof a==="number"?this.headers.filter(":eq("+a+")"):this.headers.not(this.headers.not(a)):a===false?c([]):this.headers.filter(":eq(0)")},_clickHandler:function(a,b){var d=this.options;
if(!d.disabled)if(a.target){a=c(a.currentTarget||b);b=a[0]===this.active[0];d.active=d.collapsible&&b?false:this.headers.index(a);if(!(this.running||!d.collapsible&&b)){var h=this.active;j=a.next();g=this.active.next();e={options:d,newHeader:b&&d.collapsible?c([]):a,oldHeader:this.active,newContent:b&&d.collapsible?c([]):j,oldContent:g};var f=this.headers.index(this.active[0])>this.headers.index(a[0]);this.active=b?c([]):a;this._toggle(j,g,e,b,f);h.removeClass("ui-state-active ui-corner-top").addClass("ui-state-default ui-corner-all").children(".ui-icon").removeClass(d.icons.headerSelected).addClass(d.icons.header);
if(!b){a.removeClass("ui-state-default ui-corner-all").addClass("ui-state-active ui-corner-top").children(".ui-icon").removeClass(d.icons.header).addClass(d.icons.headerSelected);a.next().addClass("ui-accordion-content-active")}}}else if(d.collapsible){this.active.removeClass("ui-state-active ui-corner-top").addClass("ui-state-default ui-corner-all").children(".ui-icon").removeClass(d.icons.headerSelected).addClass(d.icons.header);this.active.next().addClass("ui-accordion-content-active");var g=this.active.next(),
e={options:d,newHeader:c([]),oldHeader:d.active,newContent:c([]),oldContent:g},j=this.active=c([]);this._toggle(j,g,e)}},_toggle:function(a,b,d,h,f){var g=this,e=g.options;g.toShow=a;g.toHide=b;g.data=d;var j=function(){if(g)return g._completed.apply(g,arguments)};g._trigger("changestart",null,g.data);g.running=b.size()===0?a.size():b.size();if(e.animated){d={};d=e.collapsible&&h?{toShow:c([]),toHide:b,complete:j,down:f,autoHeight:e.autoHeight||e.fillSpace}:{toShow:a,toHide:b,complete:j,down:f,autoHeight:e.autoHeight||
e.fillSpace};if(!e.proxied)e.proxied=e.animated;if(!e.proxiedDuration)e.proxiedDuration=e.duration;e.animated=c.isFunction(e.proxied)?e.proxied(d):e.proxied;e.duration=c.isFunction(e.proxiedDuration)?e.proxiedDuration(d):e.proxiedDuration;h=c.ui.accordion.animations;var i=e.duration,k=e.animated;if(k&&!h[k]&&!c.easing[k])k="slide";h[k]||(h[k]=function(l){this.slide(l,{easing:k,duration:i||700})});h[k](d)}else{if(e.collapsible&&h)a.toggle();else{b.hide();a.show()}j(true)}b.prev().attr({"aria-expanded":"false",
"aria-selected":"false",tabIndex:-1}).blur();a.prev().attr({"aria-expanded":"true","aria-selected":"true",tabIndex:0}).focus()},_completed:function(a){this.running=a?0:--this.running;if(!this.running){this.options.clearStyle&&this.toShow.add(this.toHide).css({height:"",overflow:""});this.toHide.removeClass("ui-accordion-content-active");if(this.toHide.length)this.toHide.parent()[0].className=this.toHide.parent()[0].className;this._trigger("change",null,this.data)}}});c.extend(c.ui.accordion,{version:"1.8.13",
animations:{slide:function(a,b){a=c.extend({easing:"swing",duration:300},a,b);if(a.toHide.size())if(a.toShow.size()){var d=a.toShow.css("overflow"),h=0,f={},g={},e;b=a.toShow;e=b[0].style.width;b.width(parseInt(b.parent().width(),10)-parseInt(b.css("paddingLeft"),10)-parseInt(b.css("paddingRight"),10)-(parseInt(b.css("borderLeftWidth"),10)||0)-(parseInt(b.css("borderRightWidth"),10)||0));c.each(["height","paddingTop","paddingBottom"],function(j,i){g[i]="hide";j=(""+c.css(a.toShow[0],i)).match(/^([\d+-.]+)(.*)$/);
f[i]={value:j[1],unit:j[2]||"px"}});a.toShow.css({height:0,overflow:"hidden"}).show();a.toHide.filter(":hidden").each(a.complete).end().filter(":visible").animate(g,{step:function(j,i){if(i.prop=="height")h=i.end-i.start===0?0:(i.now-i.start)/(i.end-i.start);a.toShow[0].style[i.prop]=h*f[i.prop].value+f[i.prop].unit},duration:a.duration,easing:a.easing,complete:function(){a.autoHeight||a.toShow.css("height","");a.toShow.css({width:e,overflow:d});a.complete()}})}else a.toHide.animate({height:"hide",
paddingTop:"hide",paddingBottom:"hide"},a);else a.toShow.animate({height:"show",paddingTop:"show",paddingBottom:"show"},a)},bounceslide:function(a){this.slide(a,{easing:a.down?"easeOutBounce":"swing",duration:a.down?1E3:200})}}})})(jQuery);
;/*
 * jQuery UI Autocomplete 1.8.13
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Autocomplete
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	jquery.ui.position.js
 */
(function(d){var e=0;d.widget("ui.autocomplete",{options:{appendTo:"body",autoFocus:false,delay:300,minLength:1,position:{my:"left top",at:"left bottom",collision:"none"},source:null},pending:0,_create:function(){var a=this,b=this.element[0].ownerDocument,g;this.element.addClass("ui-autocomplete-input").attr("autocomplete","off").attr({role:"textbox","aria-autocomplete":"list","aria-haspopup":"true"}).bind("keydown.autocomplete",function(c){if(!(a.options.disabled||a.element.attr("readonly"))){g=
false;var f=d.ui.keyCode;switch(c.keyCode){case f.PAGE_UP:a._move("previousPage",c);break;case f.PAGE_DOWN:a._move("nextPage",c);break;case f.UP:a._move("previous",c);c.preventDefault();break;case f.DOWN:a._move("next",c);c.preventDefault();break;case f.ENTER:case f.NUMPAD_ENTER:if(a.menu.active){g=true;c.preventDefault()}case f.TAB:if(!a.menu.active)return;a.menu.select(c);break;case f.ESCAPE:a.element.val(a.term);a.close(c);break;default:clearTimeout(a.searching);a.searching=setTimeout(function(){if(a.term!=
a.element.val()){a.selectedItem=null;a.search(null,c)}},a.options.delay);break}}}).bind("keypress.autocomplete",function(c){if(g){g=false;c.preventDefault()}}).bind("focus.autocomplete",function(){if(!a.options.disabled){a.selectedItem=null;a.previous=a.element.val()}}).bind("blur.autocomplete",function(c){if(!a.options.disabled){clearTimeout(a.searching);a.closing=setTimeout(function(){a.close(c);a._change(c)},150)}});this._initSource();this.response=function(){return a._response.apply(a,arguments)};
this.menu=d("<ul></ul>").addClass("ui-autocomplete").appendTo(d(this.options.appendTo||"body",b)[0]).mousedown(function(c){var f=a.menu.element[0];d(c.target).closest(".ui-menu-item").length||setTimeout(function(){d(document).one("mousedown",function(h){h.target!==a.element[0]&&h.target!==f&&!d.ui.contains(f,h.target)&&a.close()})},1);setTimeout(function(){clearTimeout(a.closing)},13)}).menu({focus:function(c,f){f=f.item.data("item.autocomplete");false!==a._trigger("focus",c,{item:f})&&/^key/.test(c.originalEvent.type)&&
a.element.val(f.value)},selected:function(c,f){var h=f.item.data("item.autocomplete"),i=a.previous;if(a.element[0]!==b.activeElement){a.element.focus();a.previous=i;setTimeout(function(){a.previous=i;a.selectedItem=h},1)}false!==a._trigger("select",c,{item:h})&&a.element.val(h.value);a.term=a.element.val();a.close(c);a.selectedItem=h},blur:function(){a.menu.element.is(":visible")&&a.element.val()!==a.term&&a.element.val(a.term)}}).zIndex(this.element.zIndex()+1).css({top:0,left:0}).hide().data("menu");
d.fn.bgiframe&&this.menu.element.bgiframe()},destroy:function(){this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete").removeAttr("role").removeAttr("aria-autocomplete").removeAttr("aria-haspopup");this.menu.element.remove();d.Widget.prototype.destroy.call(this)},_setOption:function(a,b){d.Widget.prototype._setOption.apply(this,arguments);a==="source"&&this._initSource();if(a==="appendTo")this.menu.element.appendTo(d(b||"body",this.element[0].ownerDocument)[0]);a==="disabled"&&
b&&this.xhr&&this.xhr.abort()},_initSource:function(){var a=this,b,g;if(d.isArray(this.options.source)){b=this.options.source;this.source=function(c,f){f(d.ui.autocomplete.filter(b,c.term))}}else if(typeof this.options.source==="string"){g=this.options.source;this.source=function(c,f){a.xhr&&a.xhr.abort();a.xhr=d.ajax({url:g,data:c,dataType:"json",autocompleteRequest:++e,success:function(h){this.autocompleteRequest===e&&f(h)},error:function(){this.autocompleteRequest===e&&f([])}})}}else this.source=
this.options.source},search:function(a,b){a=a!=null?a:this.element.val();this.term=this.element.val();if(a.length<this.options.minLength)return this.close(b);clearTimeout(this.closing);if(this._trigger("search",b)!==false)return this._search(a)},_search:function(a){this.pending++;this.element.addClass("ui-autocomplete-loading");this.source({term:a},this.response)},_response:function(a){if(!this.options.disabled&&a&&a.length){a=this._normalize(a);this._suggest(a);this._trigger("open")}else this.close();
this.pending--;this.pending||this.element.removeClass("ui-autocomplete-loading")},close:function(a){clearTimeout(this.closing);if(this.menu.element.is(":visible")){this.menu.element.hide();this.menu.deactivate();this._trigger("close",a)}},_change:function(a){this.previous!==this.element.val()&&this._trigger("change",a,{item:this.selectedItem})},_normalize:function(a){if(a.length&&a[0].label&&a[0].value)return a;return d.map(a,function(b){if(typeof b==="string")return{label:b,value:b};return d.extend({label:b.label||
b.value,value:b.value||b.label},b)})},_suggest:function(a){var b=this.menu.element.empty().zIndex(this.element.zIndex()+1);this._renderMenu(b,a);this.menu.deactivate();this.menu.refresh();b.show();this._resizeMenu();b.position(d.extend({of:this.element},this.options.position));this.options.autoFocus&&this.menu.next(new d.Event("mouseover"))},_resizeMenu:function(){var a=this.menu.element;a.outerWidth(Math.max(a.width("").outerWidth(),this.element.outerWidth()))},_renderMenu:function(a,b){var g=this;
d.each(b,function(c,f){g._renderItem(a,f)})},_renderItem:function(a,b){return d("<li></li>").data("item.autocomplete",b).append(d("<a></a>").text(b.label)).appendTo(a)},_move:function(a,b){if(this.menu.element.is(":visible"))if(this.menu.first()&&/^previous/.test(a)||this.menu.last()&&/^next/.test(a)){this.element.val(this.term);this.menu.deactivate()}else this.menu[a](b);else this.search(null,b)},widget:function(){return this.menu.element}});d.extend(d.ui.autocomplete,{escapeRegex:function(a){return a.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,
"\\$&")},filter:function(a,b){var g=new RegExp(d.ui.autocomplete.escapeRegex(b),"i");return d.grep(a,function(c){return g.test(c.label||c.value||c)})}})})(jQuery);
(function(d){d.widget("ui.menu",{_create:function(){var e=this;this.element.addClass("ui-menu ui-widget ui-widget-content ui-corner-all").attr({role:"listbox","aria-activedescendant":"ui-active-menuitem"}).click(function(a){if(d(a.target).closest(".ui-menu-item a").length){a.preventDefault();e.select(a)}});this.refresh()},refresh:function(){var e=this;this.element.children("li:not(.ui-menu-item):has(a)").addClass("ui-menu-item").attr("role","menuitem").children("a").addClass("ui-corner-all").attr("tabindex",
-1).mouseenter(function(a){e.activate(a,d(this).parent())}).mouseleave(function(){e.deactivate()})},activate:function(e,a){this.deactivate();if(this.hasScroll()){var b=a.offset().top-this.element.offset().top,g=this.element.scrollTop(),c=this.element.height();if(b<0)this.element.scrollTop(g+b);else b>=c&&this.element.scrollTop(g+b-c+a.height())}this.active=a.eq(0).children("a").addClass("ui-state-hover").attr("id","ui-active-menuitem").end();this._trigger("focus",e,{item:a})},deactivate:function(){if(this.active){this.active.children("a").removeClass("ui-state-hover").removeAttr("id");
this._trigger("blur");this.active=null}},next:function(e){this.move("next",".ui-menu-item:first",e)},previous:function(e){this.move("prev",".ui-menu-item:last",e)},first:function(){return this.active&&!this.active.prevAll(".ui-menu-item").length},last:function(){return this.active&&!this.active.nextAll(".ui-menu-item").length},move:function(e,a,b){if(this.active){e=this.active[e+"All"](".ui-menu-item").eq(0);e.length?this.activate(b,e):this.activate(b,this.element.children(a))}else this.activate(b,
this.element.children(a))},nextPage:function(e){if(this.hasScroll())if(!this.active||this.last())this.activate(e,this.element.children(".ui-menu-item:first"));else{var a=this.active.offset().top,b=this.element.height(),g=this.element.children(".ui-menu-item").filter(function(){var c=d(this).offset().top-a-b+d(this).height();return c<10&&c>-10});g.length||(g=this.element.children(".ui-menu-item:last"));this.activate(e,g)}else this.activate(e,this.element.children(".ui-menu-item").filter(!this.active||
this.last()?":first":":last"))},previousPage:function(e){if(this.hasScroll())if(!this.active||this.first())this.activate(e,this.element.children(".ui-menu-item:last"));else{var a=this.active.offset().top,b=this.element.height();result=this.element.children(".ui-menu-item").filter(function(){var g=d(this).offset().top-a+b-d(this).height();return g<10&&g>-10});result.length||(result=this.element.children(".ui-menu-item:first"));this.activate(e,result)}else this.activate(e,this.element.children(".ui-menu-item").filter(!this.active||
this.first()?":last":":first"))},hasScroll:function(){return this.element.height()<this.element[d.fn.prop?"prop":"attr"]("scrollHeight")},select:function(e){this._trigger("selected",e,{item:this.active})}})})(jQuery);
;/*
 * jQuery UI Button 1.8.13
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Button
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */
(function(a){var g,i=function(b){a(":ui-button",b.target.form).each(function(){var c=a(this).data("button");setTimeout(function(){c.refresh()},1)})},h=function(b){var c=b.name,d=b.form,f=a([]);if(c)f=d?a(d).find("[name='"+c+"']"):a("[name='"+c+"']",b.ownerDocument).filter(function(){return!this.form});return f};a.widget("ui.button",{options:{disabled:null,text:true,label:null,icons:{primary:null,secondary:null}},_create:function(){this.element.closest("form").unbind("reset.button").bind("reset.button",
i);if(typeof this.options.disabled!=="boolean")this.options.disabled=this.element.attr("disabled");this._determineButtonType();this.hasTitle=!!this.buttonElement.attr("title");var b=this,c=this.options,d=this.type==="checkbox"||this.type==="radio",f="ui-state-hover"+(!d?" ui-state-active":"");if(c.label===null)c.label=this.buttonElement.html();if(this.element.is(":disabled"))c.disabled=true;this.buttonElement.addClass("ui-button ui-widget ui-state-default ui-corner-all").attr("role","button").bind("mouseenter.button",
function(){if(!c.disabled){a(this).addClass("ui-state-hover");this===g&&a(this).addClass("ui-state-active")}}).bind("mouseleave.button",function(){c.disabled||a(this).removeClass(f)}).bind("focus.button",function(){a(this).addClass("ui-state-focus")}).bind("blur.button",function(){a(this).removeClass("ui-state-focus")}).bind("click.button",function(e){c.disabled&&e.stopImmediatePropagation()});d&&this.element.bind("change.button",function(){b.refresh()});if(this.type==="checkbox")this.buttonElement.bind("click.button",
function(){if(c.disabled)return false;a(this).toggleClass("ui-state-active");b.buttonElement.attr("aria-pressed",b.element[0].checked)});else if(this.type==="radio")this.buttonElement.bind("click.button",function(){if(c.disabled)return false;a(this).addClass("ui-state-active");b.buttonElement.attr("aria-pressed",true);var e=b.element[0];h(e).not(e).map(function(){return a(this).button("widget")[0]}).removeClass("ui-state-active").attr("aria-pressed",false)});else{this.buttonElement.bind("mousedown.button",
function(){if(c.disabled)return false;a(this).addClass("ui-state-active");g=this;a(document).one("mouseup",function(){g=null})}).bind("mouseup.button",function(){if(c.disabled)return false;a(this).removeClass("ui-state-active")}).bind("keydown.button",function(e){if(c.disabled)return false;if(e.keyCode==a.ui.keyCode.SPACE||e.keyCode==a.ui.keyCode.ENTER)a(this).addClass("ui-state-active")}).bind("keyup.button",function(){a(this).removeClass("ui-state-active")});this.buttonElement.is("a")&&this.buttonElement.keyup(function(e){e.keyCode===
a.ui.keyCode.SPACE&&a(this).click()})}this._setOption("disabled",c.disabled)},_determineButtonType:function(){this.type=this.element.is(":checkbox")?"checkbox":this.element.is(":radio")?"radio":this.element.is("input")?"input":"button";if(this.type==="checkbox"||this.type==="radio"){var b=this.element.parents().filter(":last"),c="label[for="+this.element.attr("id")+"]";this.buttonElement=b.find(c);if(!this.buttonElement.length){b=b.length?b.siblings():this.element.siblings();this.buttonElement=b.filter(c);
if(!this.buttonElement.length)this.buttonElement=b.find(c)}this.element.addClass("ui-helper-hidden-accessible");(b=this.element.is(":checked"))&&this.buttonElement.addClass("ui-state-active");this.buttonElement.attr("aria-pressed",b)}else this.buttonElement=this.element},widget:function(){return this.buttonElement},destroy:function(){this.element.removeClass("ui-helper-hidden-accessible");this.buttonElement.removeClass("ui-button ui-widget ui-state-default ui-corner-all ui-state-hover ui-state-active  ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only").removeAttr("role").removeAttr("aria-pressed").html(this.buttonElement.find(".ui-button-text").html());
this.hasTitle||this.buttonElement.removeAttr("title");a.Widget.prototype.destroy.call(this)},_setOption:function(b,c){a.Widget.prototype._setOption.apply(this,arguments);if(b==="disabled")c?this.element.attr("disabled",true):this.element.removeAttr("disabled");this._resetButton()},refresh:function(){var b=this.element.is(":disabled");b!==this.options.disabled&&this._setOption("disabled",b);if(this.type==="radio")h(this.element[0]).each(function(){a(this).is(":checked")?a(this).button("widget").addClass("ui-state-active").attr("aria-pressed",
true):a(this).button("widget").removeClass("ui-state-active").attr("aria-pressed",false)});else if(this.type==="checkbox")this.element.is(":checked")?this.buttonElement.addClass("ui-state-active").attr("aria-pressed",true):this.buttonElement.removeClass("ui-state-active").attr("aria-pressed",false)},_resetButton:function(){if(this.type==="input")this.options.label&&this.element.val(this.options.label);else{var b=this.buttonElement.removeClass("ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only"),
c=a("<span></span>").addClass("ui-button-text").html(this.options.label).appendTo(b.empty()).text(),d=this.options.icons,f=d.primary&&d.secondary,e=[];if(d.primary||d.secondary){if(this.options.text)e.push("ui-button-text-icon"+(f?"s":d.primary?"-primary":"-secondary"));d.primary&&b.prepend("<span class='ui-button-icon-primary ui-icon "+d.primary+"'></span>");d.secondary&&b.append("<span class='ui-button-icon-secondary ui-icon "+d.secondary+"'></span>");if(!this.options.text){e.push(f?"ui-button-icons-only":
"ui-button-icon-only");this.hasTitle||b.attr("title",c)}}else e.push("ui-button-text-only");b.addClass(e.join(" "))}}});a.widget("ui.buttonset",{options:{items:":button, :submit, :reset, :checkbox, :radio, a, :data(button)"},_create:function(){this.element.addClass("ui-buttonset")},_init:function(){this.refresh()},_setOption:function(b,c){b==="disabled"&&this.buttons.button("option",b,c);a.Widget.prototype._setOption.apply(this,arguments)},refresh:function(){this.buttons=this.element.find(this.options.items).filter(":ui-button").button("refresh").end().not(":ui-button").button().end().map(function(){return a(this).button("widget")[0]}).removeClass("ui-corner-all ui-corner-left ui-corner-right").filter(":first").addClass("ui-corner-left").end().filter(":last").addClass("ui-corner-right").end().end()},
destroy:function(){this.element.removeClass("ui-buttonset");this.buttons.map(function(){return a(this).button("widget")[0]}).removeClass("ui-corner-left ui-corner-right").end().button("destroy");a.Widget.prototype.destroy.call(this)}})})(jQuery);
;/*
 * jQuery UI Dialog 1.8.13
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Dialog
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *  jquery.ui.button.js
 *	jquery.ui.draggable.js
 *	jquery.ui.mouse.js
 *	jquery.ui.position.js
 *	jquery.ui.resizable.js
 */
(function(c,l){var m={buttons:true,height:true,maxHeight:true,maxWidth:true,minHeight:true,minWidth:true,width:true},n={maxHeight:true,maxWidth:true,minHeight:true,minWidth:true},o=c.attrFn||{val:true,css:true,html:true,text:true,data:true,width:true,height:true,offset:true,click:true};c.widget("ui.dialog",{options:{autoOpen:true,buttons:{},closeOnEscape:true,closeText:"close",dialogClass:"",draggable:true,hide:null,height:"auto",maxHeight:false,maxWidth:false,minHeight:150,minWidth:150,modal:false,
position:{my:"center",at:"center",collision:"fit",using:function(a){var b=c(this).css(a).offset().top;b<0&&c(this).css("top",a.top-b)}},resizable:true,show:null,stack:true,title:"",width:300,zIndex:1E3},_create:function(){this.originalTitle=this.element.attr("title");if(typeof this.originalTitle!=="string")this.originalTitle="";this.options.title=this.options.title||this.originalTitle;var a=this,b=a.options,d=b.title||"&#160;",e=c.ui.dialog.getTitleId(a.element),g=(a.uiDialog=c("<div></div>")).appendTo(document.body).hide().addClass("ui-dialog ui-widget ui-widget-content ui-corner-all "+
b.dialogClass).css({zIndex:b.zIndex}).attr("tabIndex",-1).css("outline",0).keydown(function(i){if(b.closeOnEscape&&i.keyCode&&i.keyCode===c.ui.keyCode.ESCAPE){a.close(i);i.preventDefault()}}).attr({role:"dialog","aria-labelledby":e}).mousedown(function(i){a.moveToTop(false,i)});a.element.show().removeAttr("title").addClass("ui-dialog-content ui-widget-content").appendTo(g);var f=(a.uiDialogTitlebar=c("<div></div>")).addClass("ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix").prependTo(g),
h=c('<a href="#"></a>').addClass("ui-dialog-titlebar-close ui-corner-all").attr("role","button").hover(function(){h.addClass("ui-state-hover")},function(){h.removeClass("ui-state-hover")}).focus(function(){h.addClass("ui-state-focus")}).blur(function(){h.removeClass("ui-state-focus")}).click(function(i){a.close(i);return false}).appendTo(f);(a.uiDialogTitlebarCloseText=c("<span></span>")).addClass("ui-icon ui-icon-closethick").text(b.closeText).appendTo(h);c("<span></span>").addClass("ui-dialog-title").attr("id",
e).html(d).prependTo(f);if(c.isFunction(b.beforeclose)&&!c.isFunction(b.beforeClose))b.beforeClose=b.beforeclose;f.find("*").add(f).disableSelection();b.draggable&&c.fn.draggable&&a._makeDraggable();b.resizable&&c.fn.resizable&&a._makeResizable();a._createButtons(b.buttons);a._isOpen=false;c.fn.bgiframe&&g.bgiframe()},_init:function(){this.options.autoOpen&&this.open()},destroy:function(){var a=this;a.overlay&&a.overlay.destroy();a.uiDialog.hide();a.element.unbind(".dialog").removeData("dialog").removeClass("ui-dialog-content ui-widget-content").hide().appendTo("body");
a.uiDialog.remove();a.originalTitle&&a.element.attr("title",a.originalTitle);return a},widget:function(){return this.uiDialog},close:function(a){var b=this,d,e;if(false!==b._trigger("beforeClose",a)){b.overlay&&b.overlay.destroy();b.uiDialog.unbind("keypress.ui-dialog");b._isOpen=false;if(b.options.hide)b.uiDialog.hide(b.options.hide,function(){b._trigger("close",a)});else{b.uiDialog.hide();b._trigger("close",a)}c.ui.dialog.overlay.resize();if(b.options.modal){d=0;c(".ui-dialog").each(function(){if(this!==
b.uiDialog[0]){e=c(this).css("z-index");isNaN(e)||(d=Math.max(d,e))}});c.ui.dialog.maxZ=d}return b}},isOpen:function(){return this._isOpen},moveToTop:function(a,b){var d=this,e=d.options;if(e.modal&&!a||!e.stack&&!e.modal)return d._trigger("focus",b);if(e.zIndex>c.ui.dialog.maxZ)c.ui.dialog.maxZ=e.zIndex;if(d.overlay){c.ui.dialog.maxZ+=1;d.overlay.$el.css("z-index",c.ui.dialog.overlay.maxZ=c.ui.dialog.maxZ)}a={scrollTop:d.element.attr("scrollTop"),scrollLeft:d.element.attr("scrollLeft")};c.ui.dialog.maxZ+=
1;d.uiDialog.css("z-index",c.ui.dialog.maxZ);d.element.attr(a);d._trigger("focus",b);return d},open:function(){if(!this._isOpen){var a=this,b=a.options,d=a.uiDialog;a.overlay=b.modal?new c.ui.dialog.overlay(a):null;a._size();a._position(b.position);d.show(b.show);a.moveToTop(true);b.modal&&d.bind("keypress.ui-dialog",function(e){if(e.keyCode===c.ui.keyCode.TAB){var g=c(":tabbable",this),f=g.filter(":first");g=g.filter(":last");if(e.target===g[0]&&!e.shiftKey){f.focus(1);return false}else if(e.target===
f[0]&&e.shiftKey){g.focus(1);return false}}});c(a.element.find(":tabbable").get().concat(d.find(".ui-dialog-buttonpane :tabbable").get().concat(d.get()))).eq(0).focus();a._isOpen=true;a._trigger("open");return a}},_createButtons:function(a){var b=this,d=false,e=c("<div></div>").addClass("ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"),g=c("<div></div>").addClass("ui-dialog-buttonset").appendTo(e);b.uiDialog.find(".ui-dialog-buttonpane").remove();typeof a==="object"&&a!==null&&c.each(a,
function(){return!(d=true)});if(d){c.each(a,function(f,h){h=c.isFunction(h)?{click:h,text:f}:h;var i=c('<button type="button"></button>').click(function(){h.click.apply(b.element[0],arguments)}).appendTo(g);c.each(h,function(j,k){if(j!=="click")j in o?i[j](k):i.attr(j,k)});c.fn.button&&i.button()});e.appendTo(b.uiDialog)}},_makeDraggable:function(){function a(f){return{position:f.position,offset:f.offset}}var b=this,d=b.options,e=c(document),g;b.uiDialog.draggable({cancel:".ui-dialog-content, .ui-dialog-titlebar-close",
handle:".ui-dialog-titlebar",containment:"document",start:function(f,h){g=d.height==="auto"?"auto":c(this).height();c(this).height(c(this).height()).addClass("ui-dialog-dragging");b._trigger("dragStart",f,a(h))},drag:function(f,h){b._trigger("drag",f,a(h))},stop:function(f,h){d.position=[h.position.left-e.scrollLeft(),h.position.top-e.scrollTop()];c(this).removeClass("ui-dialog-dragging").height(g);b._trigger("dragStop",f,a(h));c.ui.dialog.overlay.resize()}})},_makeResizable:function(a){function b(f){return{originalPosition:f.originalPosition,
originalSize:f.originalSize,position:f.position,size:f.size}}a=a===l?this.options.resizable:a;var d=this,e=d.options,g=d.uiDialog.css("position");a=typeof a==="string"?a:"n,e,s,w,se,sw,ne,nw";d.uiDialog.resizable({cancel:".ui-dialog-content",containment:"document",alsoResize:d.element,maxWidth:e.maxWidth,maxHeight:e.maxHeight,minWidth:e.minWidth,minHeight:d._minHeight(),handles:a,start:function(f,h){c(this).addClass("ui-dialog-resizing");d._trigger("resizeStart",f,b(h))},resize:function(f,h){d._trigger("resize",
f,b(h))},stop:function(f,h){c(this).removeClass("ui-dialog-resizing");e.height=c(this).height();e.width=c(this).width();d._trigger("resizeStop",f,b(h));c.ui.dialog.overlay.resize()}}).css("position",g).find(".ui-resizable-se").addClass("ui-icon ui-icon-grip-diagonal-se")},_minHeight:function(){var a=this.options;return a.height==="auto"?a.minHeight:Math.min(a.minHeight,a.height)},_position:function(a){var b=[],d=[0,0],e;if(a){if(typeof a==="string"||typeof a==="object"&&"0"in a){b=a.split?a.split(" "):
[a[0],a[1]];if(b.length===1)b[1]=b[0];c.each(["left","top"],function(g,f){if(+b[g]===b[g]){d[g]=b[g];b[g]=f}});a={my:b.join(" "),at:b.join(" "),offset:d.join(" ")}}a=c.extend({},c.ui.dialog.prototype.options.position,a)}else a=c.ui.dialog.prototype.options.position;(e=this.uiDialog.is(":visible"))||this.uiDialog.show();this.uiDialog.css({top:0,left:0}).position(c.extend({of:window},a));e||this.uiDialog.hide()},_setOptions:function(a){var b=this,d={},e=false;c.each(a,function(g,f){b._setOption(g,f);
if(g in m)e=true;if(g in n)d[g]=f});e&&this._size();this.uiDialog.is(":data(resizable)")&&this.uiDialog.resizable("option",d)},_setOption:function(a,b){var d=this,e=d.uiDialog;switch(a){case "beforeclose":a="beforeClose";break;case "buttons":d._createButtons(b);break;case "closeText":d.uiDialogTitlebarCloseText.text(""+b);break;case "dialogClass":e.removeClass(d.options.dialogClass).addClass("ui-dialog ui-widget ui-widget-content ui-corner-all "+b);break;case "disabled":b?e.addClass("ui-dialog-disabled"):
e.removeClass("ui-dialog-disabled");break;case "draggable":var g=e.is(":data(draggable)");g&&!b&&e.draggable("destroy");!g&&b&&d._makeDraggable();break;case "position":d._position(b);break;case "resizable":(g=e.is(":data(resizable)"))&&!b&&e.resizable("destroy");g&&typeof b==="string"&&e.resizable("option","handles",b);!g&&b!==false&&d._makeResizable(b);break;case "title":c(".ui-dialog-title",d.uiDialogTitlebar).html(""+(b||"&#160;"));break}c.Widget.prototype._setOption.apply(d,arguments)},_size:function(){var a=
this.options,b,d,e=this.uiDialog.is(":visible");this.element.show().css({width:"auto",minHeight:0,height:0});if(a.minWidth>a.width)a.width=a.minWidth;b=this.uiDialog.css({height:"auto",width:a.width}).height();d=Math.max(0,a.minHeight-b);if(a.height==="auto")if(c.support.minHeight)this.element.css({minHeight:d,height:"auto"});else{this.uiDialog.show();a=this.element.css("height","auto").height();e||this.uiDialog.hide();this.element.height(Math.max(a,d))}else this.element.height(Math.max(a.height-
b,0));this.uiDialog.is(":data(resizable)")&&this.uiDialog.resizable("option","minHeight",this._minHeight())}});c.extend(c.ui.dialog,{version:"1.8.13",uuid:0,maxZ:0,getTitleId:function(a){a=a.attr("id");if(!a){this.uuid+=1;a=this.uuid}return"ui-dialog-title-"+a},overlay:function(a){this.$el=c.ui.dialog.overlay.create(a)}});c.extend(c.ui.dialog.overlay,{instances:[],oldInstances:[],maxZ:0,events:c.map("focus,mousedown,mouseup,keydown,keypress,click".split(","),function(a){return a+".dialog-overlay"}).join(" "),
create:function(a){if(this.instances.length===0){setTimeout(function(){c.ui.dialog.overlay.instances.length&&c(document).bind(c.ui.dialog.overlay.events,function(d){if(c(d.target).zIndex()<c.ui.dialog.overlay.maxZ)return false})},1);c(document).bind("keydown.dialog-overlay",function(d){if(a.options.closeOnEscape&&d.keyCode&&d.keyCode===c.ui.keyCode.ESCAPE){a.close(d);d.preventDefault()}});c(window).bind("resize.dialog-overlay",c.ui.dialog.overlay.resize)}var b=(this.oldInstances.pop()||c("<div></div>").addClass("ui-widget-overlay")).appendTo(document.body).css({width:this.width(),
height:this.height()});c.fn.bgiframe&&b.bgiframe();this.instances.push(b);return b},destroy:function(a){var b=c.inArray(a,this.instances);b!=-1&&this.oldInstances.push(this.instances.splice(b,1)[0]);this.instances.length===0&&c([document,window]).unbind(".dialog-overlay");a.remove();var d=0;c.each(this.instances,function(){d=Math.max(d,this.css("z-index"))});this.maxZ=d},height:function(){var a,b;if(c.browser.msie&&c.browser.version<7){a=Math.max(document.documentElement.scrollHeight,document.body.scrollHeight);
b=Math.max(document.documentElement.offsetHeight,document.body.offsetHeight);return a<b?c(window).height()+"px":a+"px"}else return c(document).height()+"px"},width:function(){var a,b;if(c.browser.msie&&c.browser.version<7){a=Math.max(document.documentElement.scrollWidth,document.body.scrollWidth);b=Math.max(document.documentElement.offsetWidth,document.body.offsetWidth);return a<b?c(window).width()+"px":a+"px"}else return c(document).width()+"px"},resize:function(){var a=c([]);c.each(c.ui.dialog.overlay.instances,
function(){a=a.add(this)});a.css({width:0,height:0}).css({width:c.ui.dialog.overlay.width(),height:c.ui.dialog.overlay.height()})}});c.extend(c.ui.dialog.overlay.prototype,{destroy:function(){c.ui.dialog.overlay.destroy(this.$el)}})})(jQuery);
;/*
 * jQuery UI Slider 1.8.13
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Slider
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */
(function(d){d.widget("ui.slider",d.ui.mouse,{widgetEventPrefix:"slide",options:{animate:false,distance:0,max:100,min:0,orientation:"horizontal",range:false,step:1,value:0,values:null},_create:function(){var b=this,a=this.options,c=this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"),f=a.values&&a.values.length||1,e=[];this._mouseSliding=this._keySliding=false;this._animateOff=true;this._handleIndex=null;this._detectOrientation();this._mouseInit();this.element.addClass("ui-slider ui-slider-"+
this.orientation+" ui-widget ui-widget-content ui-corner-all"+(a.disabled?" ui-slider-disabled ui-disabled":""));this.range=d([]);if(a.range){if(a.range===true){if(!a.values)a.values=[this._valueMin(),this._valueMin()];if(a.values.length&&a.values.length!==2)a.values=[a.values[0],a.values[0]]}this.range=d("<div></div>").appendTo(this.element).addClass("ui-slider-range ui-widget-header"+(a.range==="min"||a.range==="max"?" ui-slider-range-"+a.range:""))}for(var j=c.length;j<f;j+=1)e.push("<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>");
this.handles=c.add(d(e.join("")).appendTo(b.element));this.handle=this.handles.eq(0);this.handles.add(this.range).filter("a").click(function(g){g.preventDefault()}).hover(function(){a.disabled||d(this).addClass("ui-state-hover")},function(){d(this).removeClass("ui-state-hover")}).focus(function(){if(a.disabled)d(this).blur();else{d(".ui-slider .ui-state-focus").removeClass("ui-state-focus");d(this).addClass("ui-state-focus")}}).blur(function(){d(this).removeClass("ui-state-focus")});this.handles.each(function(g){d(this).data("index.ui-slider-handle",
g)});this.handles.keydown(function(g){var k=true,l=d(this).data("index.ui-slider-handle"),i,h,m;if(!b.options.disabled){switch(g.keyCode){case d.ui.keyCode.HOME:case d.ui.keyCode.END:case d.ui.keyCode.PAGE_UP:case d.ui.keyCode.PAGE_DOWN:case d.ui.keyCode.UP:case d.ui.keyCode.RIGHT:case d.ui.keyCode.DOWN:case d.ui.keyCode.LEFT:k=false;if(!b._keySliding){b._keySliding=true;d(this).addClass("ui-state-active");i=b._start(g,l);if(i===false)return}break}m=b.options.step;i=b.options.values&&b.options.values.length?
(h=b.values(l)):(h=b.value());switch(g.keyCode){case d.ui.keyCode.HOME:h=b._valueMin();break;case d.ui.keyCode.END:h=b._valueMax();break;case d.ui.keyCode.PAGE_UP:h=b._trimAlignValue(i+(b._valueMax()-b._valueMin())/5);break;case d.ui.keyCode.PAGE_DOWN:h=b._trimAlignValue(i-(b._valueMax()-b._valueMin())/5);break;case d.ui.keyCode.UP:case d.ui.keyCode.RIGHT:if(i===b._valueMax())return;h=b._trimAlignValue(i+m);break;case d.ui.keyCode.DOWN:case d.ui.keyCode.LEFT:if(i===b._valueMin())return;h=b._trimAlignValue(i-
m);break}b._slide(g,l,h);return k}}).keyup(function(g){var k=d(this).data("index.ui-slider-handle");if(b._keySliding){b._keySliding=false;b._stop(g,k);b._change(g,k);d(this).removeClass("ui-state-active")}});this._refreshValue();this._animateOff=false},destroy:function(){this.handles.remove();this.range.remove();this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-slider-disabled ui-widget ui-widget-content ui-corner-all").removeData("slider").unbind(".slider");this._mouseDestroy();
return this},_mouseCapture:function(b){var a=this.options,c,f,e,j,g;if(a.disabled)return false;this.elementSize={width:this.element.outerWidth(),height:this.element.outerHeight()};this.elementOffset=this.element.offset();c=this._normValueFromMouse({x:b.pageX,y:b.pageY});f=this._valueMax()-this._valueMin()+1;j=this;this.handles.each(function(k){var l=Math.abs(c-j.values(k));if(f>l){f=l;e=d(this);g=k}});if(a.range===true&&this.values(1)===a.min){g+=1;e=d(this.handles[g])}if(this._start(b,g)===false)return false;
this._mouseSliding=true;j._handleIndex=g;e.addClass("ui-state-active").focus();a=e.offset();this._clickOffset=!d(b.target).parents().andSelf().is(".ui-slider-handle")?{left:0,top:0}:{left:b.pageX-a.left-e.width()/2,top:b.pageY-a.top-e.height()/2-(parseInt(e.css("borderTopWidth"),10)||0)-(parseInt(e.css("borderBottomWidth"),10)||0)+(parseInt(e.css("marginTop"),10)||0)};this.handles.hasClass("ui-state-hover")||this._slide(b,g,c);return this._animateOff=true},_mouseStart:function(){return true},_mouseDrag:function(b){var a=
this._normValueFromMouse({x:b.pageX,y:b.pageY});this._slide(b,this._handleIndex,a);return false},_mouseStop:function(b){this.handles.removeClass("ui-state-active");this._mouseSliding=false;this._stop(b,this._handleIndex);this._change(b,this._handleIndex);this._clickOffset=this._handleIndex=null;return this._animateOff=false},_detectOrientation:function(){this.orientation=this.options.orientation==="vertical"?"vertical":"horizontal"},_normValueFromMouse:function(b){var a;if(this.orientation==="horizontal"){a=
this.elementSize.width;b=b.x-this.elementOffset.left-(this._clickOffset?this._clickOffset.left:0)}else{a=this.elementSize.height;b=b.y-this.elementOffset.top-(this._clickOffset?this._clickOffset.top:0)}a=b/a;if(a>1)a=1;if(a<0)a=0;if(this.orientation==="vertical")a=1-a;b=this._valueMax()-this._valueMin();return this._trimAlignValue(this._valueMin()+a*b)},_start:function(b,a){var c={handle:this.handles[a],value:this.value()};if(this.options.values&&this.options.values.length){c.value=this.values(a);
c.values=this.values()}return this._trigger("start",b,c)},_slide:function(b,a,c){var f;if(this.options.values&&this.options.values.length){f=this.values(a?0:1);if(this.options.values.length===2&&this.options.range===true&&(a===0&&c>f||a===1&&c<f))c=f;if(c!==this.values(a)){f=this.values();f[a]=c;b=this._trigger("slide",b,{handle:this.handles[a],value:c,values:f});this.values(a?0:1);b!==false&&this.values(a,c,true)}}else if(c!==this.value()){b=this._trigger("slide",b,{handle:this.handles[a],value:c});
b!==false&&this.value(c)}},_stop:function(b,a){var c={handle:this.handles[a],value:this.value()};if(this.options.values&&this.options.values.length){c.value=this.values(a);c.values=this.values()}this._trigger("stop",b,c)},_change:function(b,a){if(!this._keySliding&&!this._mouseSliding){var c={handle:this.handles[a],value:this.value()};if(this.options.values&&this.options.values.length){c.value=this.values(a);c.values=this.values()}this._trigger("change",b,c)}},value:function(b){if(arguments.length){this.options.value=
this._trimAlignValue(b);this._refreshValue();this._change(null,0)}else return this._value()},values:function(b,a){var c,f,e;if(arguments.length>1){this.options.values[b]=this._trimAlignValue(a);this._refreshValue();this._change(null,b)}else if(arguments.length)if(d.isArray(arguments[0])){c=this.options.values;f=arguments[0];for(e=0;e<c.length;e+=1){c[e]=this._trimAlignValue(f[e]);this._change(null,e)}this._refreshValue()}else return this.options.values&&this.options.values.length?this._values(b):
this.value();else return this._values()},_setOption:function(b,a){var c,f=0;if(d.isArray(this.options.values))f=this.options.values.length;d.Widget.prototype._setOption.apply(this,arguments);switch(b){case "disabled":if(a){this.handles.filter(".ui-state-focus").blur();this.handles.removeClass("ui-state-hover");this.handles.attr("disabled","disabled");this.element.addClass("ui-disabled")}else{this.handles.removeAttr("disabled");this.element.removeClass("ui-disabled")}break;case "orientation":this._detectOrientation();
this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-"+this.orientation);this._refreshValue();break;case "value":this._animateOff=true;this._refreshValue();this._change(null,0);this._animateOff=false;break;case "values":this._animateOff=true;this._refreshValue();for(c=0;c<f;c+=1)this._change(null,c);this._animateOff=false;break}},_value:function(){var b=this.options.value;return b=this._trimAlignValue(b)},_values:function(b){var a,c;if(arguments.length){a=this.options.values[b];
return a=this._trimAlignValue(a)}else{a=this.options.values.slice();for(c=0;c<a.length;c+=1)a[c]=this._trimAlignValue(a[c]);return a}},_trimAlignValue:function(b){if(b<=this._valueMin())return this._valueMin();if(b>=this._valueMax())return this._valueMax();var a=this.options.step>0?this.options.step:1,c=(b-this._valueMin())%a;alignValue=b-c;if(Math.abs(c)*2>=a)alignValue+=c>0?a:-a;return parseFloat(alignValue.toFixed(5))},_valueMin:function(){return this.options.min},_valueMax:function(){return this.options.max},
_refreshValue:function(){var b=this.options.range,a=this.options,c=this,f=!this._animateOff?a.animate:false,e,j={},g,k,l,i;if(this.options.values&&this.options.values.length)this.handles.each(function(h){e=(c.values(h)-c._valueMin())/(c._valueMax()-c._valueMin())*100;j[c.orientation==="horizontal"?"left":"bottom"]=e+"%";d(this).stop(1,1)[f?"animate":"css"](j,a.animate);if(c.options.range===true)if(c.orientation==="horizontal"){if(h===0)c.range.stop(1,1)[f?"animate":"css"]({left:e+"%"},a.animate);
if(h===1)c.range[f?"animate":"css"]({width:e-g+"%"},{queue:false,duration:a.animate})}else{if(h===0)c.range.stop(1,1)[f?"animate":"css"]({bottom:e+"%"},a.animate);if(h===1)c.range[f?"animate":"css"]({height:e-g+"%"},{queue:false,duration:a.animate})}g=e});else{k=this.value();l=this._valueMin();i=this._valueMax();e=i!==l?(k-l)/(i-l)*100:0;j[c.orientation==="horizontal"?"left":"bottom"]=e+"%";this.handle.stop(1,1)[f?"animate":"css"](j,a.animate);if(b==="min"&&this.orientation==="horizontal")this.range.stop(1,
1)[f?"animate":"css"]({width:e+"%"},a.animate);if(b==="max"&&this.orientation==="horizontal")this.range[f?"animate":"css"]({width:100-e+"%"},{queue:false,duration:a.animate});if(b==="min"&&this.orientation==="vertical")this.range.stop(1,1)[f?"animate":"css"]({height:e+"%"},a.animate);if(b==="max"&&this.orientation==="vertical")this.range[f?"animate":"css"]({height:100-e+"%"},{queue:false,duration:a.animate})}}});d.extend(d.ui.slider,{version:"1.8.13"})})(jQuery);
;/*
 * jQuery UI Tabs 1.8.13
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Tabs
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */
(function(d,p){function u(){return++v}function w(){return++x}var v=0,x=0;d.widget("ui.tabs",{options:{add:null,ajaxOptions:null,cache:false,cookie:null,collapsible:false,disable:null,disabled:[],enable:null,event:"click",fx:null,idPrefix:"ui-tabs-",load:null,panelTemplate:"<div></div>",remove:null,select:null,show:null,spinner:"<em>Loading&#8230;</em>",tabTemplate:"<li><a href='#{href}'><span>#{label}</span></a></li>"},_create:function(){this._tabify(true)},_setOption:function(b,e){if(b=="selected")this.options.collapsible&&
e==this.options.selected||this.select(e);else{this.options[b]=e;this._tabify()}},_tabId:function(b){return b.title&&b.title.replace(/\s/g,"_").replace(/[^\w\u00c0-\uFFFF-]/g,"")||this.options.idPrefix+u()},_sanitizeSelector:function(b){return b.replace(/:/g,"\\:")},_cookie:function(){var b=this.cookie||(this.cookie=this.options.cookie.name||"ui-tabs-"+w());return d.cookie.apply(null,[b].concat(d.makeArray(arguments)))},_ui:function(b,e){return{tab:b,panel:e,index:this.anchors.index(b)}},_cleanup:function(){this.lis.filter(".ui-state-processing").removeClass("ui-state-processing").find("span:data(label.tabs)").each(function(){var b=
d(this);b.html(b.data("label.tabs")).removeData("label.tabs")})},_tabify:function(b){function e(g,f){g.css("display","");!d.support.opacity&&f.opacity&&g[0].style.removeAttribute("filter")}var a=this,c=this.options,h=/^#.+/;this.list=this.element.find("ol,ul").eq(0);this.lis=d(" > li:has(a[href])",this.list);this.anchors=this.lis.map(function(){return d("a",this)[0]});this.panels=d([]);this.anchors.each(function(g,f){var i=d(f).attr("href"),l=i.split("#")[0],q;if(l&&(l===location.toString().split("#")[0]||
(q=d("base")[0])&&l===q.href)){i=f.hash;f.href=i}if(h.test(i))a.panels=a.panels.add(a.element.find(a._sanitizeSelector(i)));else if(i&&i!=="#"){d.data(f,"href.tabs",i);d.data(f,"load.tabs",i.replace(/#.*$/,""));i=a._tabId(f);f.href="#"+i;f=a.element.find("#"+i);if(!f.length){f=d(c.panelTemplate).attr("id",i).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").insertAfter(a.panels[g-1]||a.list);f.data("destroy.tabs",true)}a.panels=a.panels.add(f)}else c.disabled.push(g)});if(b){this.element.addClass("ui-tabs ui-widget ui-widget-content ui-corner-all");
this.list.addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all");this.lis.addClass("ui-state-default ui-corner-top");this.panels.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom");if(c.selected===p){location.hash&&this.anchors.each(function(g,f){if(f.hash==location.hash){c.selected=g;return false}});if(typeof c.selected!=="number"&&c.cookie)c.selected=parseInt(a._cookie(),10);if(typeof c.selected!=="number"&&this.lis.filter(".ui-tabs-selected").length)c.selected=
this.lis.index(this.lis.filter(".ui-tabs-selected"));c.selected=c.selected||(this.lis.length?0:-1)}else if(c.selected===null)c.selected=-1;c.selected=c.selected>=0&&this.anchors[c.selected]||c.selected<0?c.selected:0;c.disabled=d.unique(c.disabled.concat(d.map(this.lis.filter(".ui-state-disabled"),function(g){return a.lis.index(g)}))).sort();d.inArray(c.selected,c.disabled)!=-1&&c.disabled.splice(d.inArray(c.selected,c.disabled),1);this.panels.addClass("ui-tabs-hide");this.lis.removeClass("ui-tabs-selected ui-state-active");
if(c.selected>=0&&this.anchors.length){a.element.find(a._sanitizeSelector(a.anchors[c.selected].hash)).removeClass("ui-tabs-hide");this.lis.eq(c.selected).addClass("ui-tabs-selected ui-state-active");a.element.queue("tabs",function(){a._trigger("show",null,a._ui(a.anchors[c.selected],a.element.find(a._sanitizeSelector(a.anchors[c.selected].hash))[0]))});this.load(c.selected)}d(window).bind("unload",function(){a.lis.add(a.anchors).unbind(".tabs");a.lis=a.anchors=a.panels=null})}else c.selected=this.lis.index(this.lis.filter(".ui-tabs-selected"));
this.element[c.collapsible?"addClass":"removeClass"]("ui-tabs-collapsible");c.cookie&&this._cookie(c.selected,c.cookie);b=0;for(var j;j=this.lis[b];b++)d(j)[d.inArray(b,c.disabled)!=-1&&!d(j).hasClass("ui-tabs-selected")?"addClass":"removeClass"]("ui-state-disabled");c.cache===false&&this.anchors.removeData("cache.tabs");this.lis.add(this.anchors).unbind(".tabs");if(c.event!=="mouseover"){var k=function(g,f){f.is(":not(.ui-state-disabled)")&&f.addClass("ui-state-"+g)},n=function(g,f){f.removeClass("ui-state-"+
g)};this.lis.bind("mouseover.tabs",function(){k("hover",d(this))});this.lis.bind("mouseout.tabs",function(){n("hover",d(this))});this.anchors.bind("focus.tabs",function(){k("focus",d(this).closest("li"))});this.anchors.bind("blur.tabs",function(){n("focus",d(this).closest("li"))})}var m,o;if(c.fx)if(d.isArray(c.fx)){m=c.fx[0];o=c.fx[1]}else m=o=c.fx;var r=o?function(g,f){d(g).closest("li").addClass("ui-tabs-selected ui-state-active");f.hide().removeClass("ui-tabs-hide").animate(o,o.duration||"normal",
function(){e(f,o);a._trigger("show",null,a._ui(g,f[0]))})}:function(g,f){d(g).closest("li").addClass("ui-tabs-selected ui-state-active");f.removeClass("ui-tabs-hide");a._trigger("show",null,a._ui(g,f[0]))},s=m?function(g,f){f.animate(m,m.duration||"normal",function(){a.lis.removeClass("ui-tabs-selected ui-state-active");f.addClass("ui-tabs-hide");e(f,m);a.element.dequeue("tabs")})}:function(g,f){a.lis.removeClass("ui-tabs-selected ui-state-active");f.addClass("ui-tabs-hide");a.element.dequeue("tabs")};
this.anchors.bind(c.event+".tabs",function(){var g=this,f=d(g).closest("li"),i=a.panels.filter(":not(.ui-tabs-hide)"),l=a.element.find(a._sanitizeSelector(g.hash));if(f.hasClass("ui-tabs-selected")&&!c.collapsible||f.hasClass("ui-state-disabled")||f.hasClass("ui-state-processing")||a.panels.filter(":animated").length||a._trigger("select",null,a._ui(this,l[0]))===false){this.blur();return false}c.selected=a.anchors.index(this);a.abort();if(c.collapsible)if(f.hasClass("ui-tabs-selected")){c.selected=
-1;c.cookie&&a._cookie(c.selected,c.cookie);a.element.queue("tabs",function(){s(g,i)}).dequeue("tabs");this.blur();return false}else if(!i.length){c.cookie&&a._cookie(c.selected,c.cookie);a.element.queue("tabs",function(){r(g,l)});a.load(a.anchors.index(this));this.blur();return false}c.cookie&&a._cookie(c.selected,c.cookie);if(l.length){i.length&&a.element.queue("tabs",function(){s(g,i)});a.element.queue("tabs",function(){r(g,l)});a.load(a.anchors.index(this))}else throw"jQuery UI Tabs: Mismatching fragment identifier.";
d.browser.msie&&this.blur()});this.anchors.bind("click.tabs",function(){return false})},_getIndex:function(b){if(typeof b=="string")b=this.anchors.index(this.anchors.filter("[href$="+b+"]"));return b},destroy:function(){var b=this.options;this.abort();this.element.unbind(".tabs").removeClass("ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible").removeData("tabs");this.list.removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all");this.anchors.each(function(){var e=
d.data(this,"href.tabs");if(e)this.href=e;var a=d(this).unbind(".tabs");d.each(["href","load","cache"],function(c,h){a.removeData(h+".tabs")})});this.lis.unbind(".tabs").add(this.panels).each(function(){d.data(this,"destroy.tabs")?d(this).remove():d(this).removeClass("ui-state-default ui-corner-top ui-tabs-selected ui-state-active ui-state-hover ui-state-focus ui-state-disabled ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide")});b.cookie&&this._cookie(null,b.cookie);return this},add:function(b,
e,a){if(a===p)a=this.anchors.length;var c=this,h=this.options;e=d(h.tabTemplate.replace(/#\{href\}/g,b).replace(/#\{label\}/g,e));b=!b.indexOf("#")?b.replace("#",""):this._tabId(d("a",e)[0]);e.addClass("ui-state-default ui-corner-top").data("destroy.tabs",true);var j=c.element.find("#"+b);j.length||(j=d(h.panelTemplate).attr("id",b).data("destroy.tabs",true));j.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide");if(a>=this.lis.length){e.appendTo(this.list);j.appendTo(this.list[0].parentNode)}else{e.insertBefore(this.lis[a]);
j.insertBefore(this.panels[a])}h.disabled=d.map(h.disabled,function(k){return k>=a?++k:k});this._tabify();if(this.anchors.length==1){h.selected=0;e.addClass("ui-tabs-selected ui-state-active");j.removeClass("ui-tabs-hide");this.element.queue("tabs",function(){c._trigger("show",null,c._ui(c.anchors[0],c.panels[0]))});this.load(0)}this._trigger("add",null,this._ui(this.anchors[a],this.panels[a]));return this},remove:function(b){b=this._getIndex(b);var e=this.options,a=this.lis.eq(b).remove(),c=this.panels.eq(b).remove();
if(a.hasClass("ui-tabs-selected")&&this.anchors.length>1)this.select(b+(b+1<this.anchors.length?1:-1));e.disabled=d.map(d.grep(e.disabled,function(h){return h!=b}),function(h){return h>=b?--h:h});this._tabify();this._trigger("remove",null,this._ui(a.find("a")[0],c[0]));return this},enable:function(b){b=this._getIndex(b);var e=this.options;if(d.inArray(b,e.disabled)!=-1){this.lis.eq(b).removeClass("ui-state-disabled");e.disabled=d.grep(e.disabled,function(a){return a!=b});this._trigger("enable",null,
this._ui(this.anchors[b],this.panels[b]));return this}},disable:function(b){b=this._getIndex(b);var e=this.options;if(b!=e.selected){this.lis.eq(b).addClass("ui-state-disabled");e.disabled.push(b);e.disabled.sort();this._trigger("disable",null,this._ui(this.anchors[b],this.panels[b]))}return this},select:function(b){b=this._getIndex(b);if(b==-1)if(this.options.collapsible&&this.options.selected!=-1)b=this.options.selected;else return this;this.anchors.eq(b).trigger(this.options.event+".tabs");return this},
load:function(b){b=this._getIndex(b);var e=this,a=this.options,c=this.anchors.eq(b)[0],h=d.data(c,"load.tabs");this.abort();if(!h||this.element.queue("tabs").length!==0&&d.data(c,"cache.tabs"))this.element.dequeue("tabs");else{this.lis.eq(b).addClass("ui-state-processing");if(a.spinner){var j=d("span",c);j.data("label.tabs",j.html()).html(a.spinner)}this.xhr=d.ajax(d.extend({},a.ajaxOptions,{url:h,success:function(k,n){e.element.find(e._sanitizeSelector(c.hash)).html(k);e._cleanup();a.cache&&d.data(c,
"cache.tabs",true);e._trigger("load",null,e._ui(e.anchors[b],e.panels[b]));try{a.ajaxOptions.success(k,n)}catch(m){}},error:function(k,n){e._cleanup();e._trigger("load",null,e._ui(e.anchors[b],e.panels[b]));try{a.ajaxOptions.error(k,n,b,c)}catch(m){}}}));e.element.dequeue("tabs");return this}},abort:function(){this.element.queue([]);this.panels.stop(false,true);this.element.queue("tabs",this.element.queue("tabs").splice(-2,2));if(this.xhr){this.xhr.abort();delete this.xhr}this._cleanup();return this},
url:function(b,e){this.anchors.eq(b).removeData("cache.tabs").data("load.tabs",e);return this},length:function(){return this.anchors.length}});d.extend(d.ui.tabs,{version:"1.8.13"});d.extend(d.ui.tabs.prototype,{rotation:null,rotate:function(b,e){var a=this,c=this.options,h=a._rotate||(a._rotate=function(j){clearTimeout(a.rotation);a.rotation=setTimeout(function(){var k=c.selected;a.select(++k<a.anchors.length?k:0)},b);j&&j.stopPropagation()});e=a._unrotate||(a._unrotate=!e?function(j){j.clientX&&
a.rotate(null)}:function(){t=c.selected;h()});if(b){this.element.bind("tabsshow",h);this.anchors.bind(c.event+".tabs",e);h()}else{clearTimeout(a.rotation);this.element.unbind("tabsshow",h);this.anchors.unbind(c.event+".tabs",e);delete this._rotate;delete this._unrotate}return this}})})(jQuery);
;/*
 * jQuery UI Datepicker 1.8.13
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Datepicker
 *
 * Depends:
 *	jquery.ui.core.js
 */
(function(d,B){function M(){this.debug=false;this._curInst=null;this._keyEvent=false;this._disabledInputs=[];this._inDialog=this._datepickerShowing=false;this._mainDivId="ui-datepicker-div";this._inlineClass="ui-datepicker-inline";this._appendClass="ui-datepicker-append";this._triggerClass="ui-datepicker-trigger";this._dialogClass="ui-datepicker-dialog";this._disableClass="ui-datepicker-disabled";this._unselectableClass="ui-datepicker-unselectable";this._currentClass="ui-datepicker-current-day";this._dayOverClass=
"ui-datepicker-days-cell-over";this.regional=[];this.regional[""]={closeText:"Done",prevText:"Prev",nextText:"Next",currentText:"Today",monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],dayNamesMin:["Su",
"Mo","Tu","We","Th","Fr","Sa"],weekHeader:"Wk",dateFormat:"mm/dd/yy",firstDay:0,isRTL:false,showMonthAfterYear:false,yearSuffix:""};this._defaults={showOn:"focus",showAnim:"fadeIn",showOptions:{},defaultDate:null,appendText:"",buttonText:"...",buttonImage:"",buttonImageOnly:false,hideIfNoPrevNext:false,navigationAsDateFormat:false,gotoCurrent:false,changeMonth:false,changeYear:false,yearRange:"c-10:c+10",showOtherMonths:false,selectOtherMonths:false,showWeek:false,calculateWeek:this.iso8601Week,shortYearCutoff:"+10",
minDate:null,maxDate:null,duration:"fast",beforeShowDay:null,beforeShow:null,onSelect:null,onChangeMonthYear:null,onClose:null,numberOfMonths:1,showCurrentAtPos:0,stepMonths:1,stepBigMonths:12,altField:"",altFormat:"",constrainInput:true,showButtonPanel:false,autoSize:false};d.extend(this._defaults,this.regional[""]);this.dpDiv=N(d('<div id="'+this._mainDivId+'" class="ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>'))}function N(a){return a.delegate("button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a",
"mouseout",function(){d(this).removeClass("ui-state-hover");this.className.indexOf("ui-datepicker-prev")!=-1&&d(this).removeClass("ui-datepicker-prev-hover");this.className.indexOf("ui-datepicker-next")!=-1&&d(this).removeClass("ui-datepicker-next-hover")}).delegate("button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a","mouseover",function(){if(!d.datepicker._isDisabledDatepicker(J.inline?a.parent()[0]:J.input[0])){d(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover");
d(this).addClass("ui-state-hover");this.className.indexOf("ui-datepicker-prev")!=-1&&d(this).addClass("ui-datepicker-prev-hover");this.className.indexOf("ui-datepicker-next")!=-1&&d(this).addClass("ui-datepicker-next-hover")}})}function H(a,b){d.extend(a,b);for(var c in b)if(b[c]==null||b[c]==B)a[c]=b[c];return a}d.extend(d.ui,{datepicker:{version:"1.8.13"}});var z=(new Date).getTime(),J;d.extend(M.prototype,{markerClassName:"hasDatepicker",log:function(){this.debug&&console.log.apply("",arguments)},
_widgetDatepicker:function(){return this.dpDiv},setDefaults:function(a){H(this._defaults,a||{});return this},_attachDatepicker:function(a,b){var c=null;for(var e in this._defaults){var f=a.getAttribute("date:"+e);if(f){c=c||{};try{c[e]=eval(f)}catch(h){c[e]=f}}}e=a.nodeName.toLowerCase();f=e=="div"||e=="span";if(!a.id){this.uuid+=1;a.id="dp"+this.uuid}var i=this._newInst(d(a),f);i.settings=d.extend({},b||{},c||{});if(e=="input")this._connectDatepicker(a,i);else f&&this._inlineDatepicker(a,i)},_newInst:function(a,
b){return{id:a[0].id.replace(/([^A-Za-z0-9_-])/g,"\\\\$1"),input:a,selectedDay:0,selectedMonth:0,selectedYear:0,drawMonth:0,drawYear:0,inline:b,dpDiv:!b?this.dpDiv:N(d('<div class="'+this._inlineClass+' ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>'))}},_connectDatepicker:function(a,b){var c=d(a);b.append=d([]);b.trigger=d([]);if(!c.hasClass(this.markerClassName)){this._attachments(c,b);c.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).keyup(this._doKeyUp).bind("setData.datepicker",
function(e,f,h){b.settings[f]=h}).bind("getData.datepicker",function(e,f){return this._get(b,f)});this._autoSize(b);d.data(a,"datepicker",b)}},_attachments:function(a,b){var c=this._get(b,"appendText"),e=this._get(b,"isRTL");b.append&&b.append.remove();if(c){b.append=d('<span class="'+this._appendClass+'">'+c+"</span>");a[e?"before":"after"](b.append)}a.unbind("focus",this._showDatepicker);b.trigger&&b.trigger.remove();c=this._get(b,"showOn");if(c=="focus"||c=="both")a.focus(this._showDatepicker);
if(c=="button"||c=="both"){c=this._get(b,"buttonText");var f=this._get(b,"buttonImage");b.trigger=d(this._get(b,"buttonImageOnly")?d("<img/>").addClass(this._triggerClass).attr({src:f,alt:c,title:c}):d('<button type="button"></button>').addClass(this._triggerClass).html(f==""?c:d("<img/>").attr({src:f,alt:c,title:c})));a[e?"before":"after"](b.trigger);b.trigger.click(function(){d.datepicker._datepickerShowing&&d.datepicker._lastInput==a[0]?d.datepicker._hideDatepicker():d.datepicker._showDatepicker(a[0]);
return false})}},_autoSize:function(a){if(this._get(a,"autoSize")&&!a.inline){var b=new Date(2009,11,20),c=this._get(a,"dateFormat");if(c.match(/[DM]/)){var e=function(f){for(var h=0,i=0,g=0;g<f.length;g++)if(f[g].length>h){h=f[g].length;i=g}return i};b.setMonth(e(this._get(a,c.match(/MM/)?"monthNames":"monthNamesShort")));b.setDate(e(this._get(a,c.match(/DD/)?"dayNames":"dayNamesShort"))+20-b.getDay())}a.input.attr("size",this._formatDate(a,b).length)}},_inlineDatepicker:function(a,b){var c=d(a);
if(!c.hasClass(this.markerClassName)){c.addClass(this.markerClassName).append(b.dpDiv).bind("setData.datepicker",function(e,f,h){b.settings[f]=h}).bind("getData.datepicker",function(e,f){return this._get(b,f)});d.data(a,"datepicker",b);this._setDate(b,this._getDefaultDate(b),true);this._updateDatepicker(b);this._updateAlternate(b);b.dpDiv.show()}},_dialogDatepicker:function(a,b,c,e,f){a=this._dialogInst;if(!a){this.uuid+=1;this._dialogInput=d('<input type="text" id="'+("dp"+this.uuid)+'" style="position: absolute; top: -100px; width: 0px; z-index: -10;"/>');
this._dialogInput.keydown(this._doKeyDown);d("body").append(this._dialogInput);a=this._dialogInst=this._newInst(this._dialogInput,false);a.settings={};d.data(this._dialogInput[0],"datepicker",a)}H(a.settings,e||{});b=b&&b.constructor==Date?this._formatDate(a,b):b;this._dialogInput.val(b);this._pos=f?f.length?f:[f.pageX,f.pageY]:null;if(!this._pos)this._pos=[document.documentElement.clientWidth/2-100+(document.documentElement.scrollLeft||document.body.scrollLeft),document.documentElement.clientHeight/
2-150+(document.documentElement.scrollTop||document.body.scrollTop)];this._dialogInput.css("left",this._pos[0]+20+"px").css("top",this._pos[1]+"px");a.settings.onSelect=c;this._inDialog=true;this.dpDiv.addClass(this._dialogClass);this._showDatepicker(this._dialogInput[0]);d.blockUI&&d.blockUI(this.dpDiv);d.data(this._dialogInput[0],"datepicker",a);return this},_destroyDatepicker:function(a){var b=d(a),c=d.data(a,"datepicker");if(b.hasClass(this.markerClassName)){var e=a.nodeName.toLowerCase();d.removeData(a,
"datepicker");if(e=="input"){c.append.remove();c.trigger.remove();b.removeClass(this.markerClassName).unbind("focus",this._showDatepicker).unbind("keydown",this._doKeyDown).unbind("keypress",this._doKeyPress).unbind("keyup",this._doKeyUp)}else if(e=="div"||e=="span")b.removeClass(this.markerClassName).empty()}},_enableDatepicker:function(a){var b=d(a),c=d.data(a,"datepicker");if(b.hasClass(this.markerClassName)){var e=a.nodeName.toLowerCase();if(e=="input"){a.disabled=false;c.trigger.filter("button").each(function(){this.disabled=
false}).end().filter("img").css({opacity:"1.0",cursor:""})}else if(e=="div"||e=="span"){b=b.children("."+this._inlineClass);b.children().removeClass("ui-state-disabled");b.find("select.ui-datepicker-month, select.ui-datepicker-year").removeAttr("disabled")}this._disabledInputs=d.map(this._disabledInputs,function(f){return f==a?null:f})}},_disableDatepicker:function(a){var b=d(a),c=d.data(a,"datepicker");if(b.hasClass(this.markerClassName)){var e=a.nodeName.toLowerCase();if(e=="input"){a.disabled=
true;c.trigger.filter("button").each(function(){this.disabled=true}).end().filter("img").css({opacity:"0.5",cursor:"default"})}else if(e=="div"||e=="span"){b=b.children("."+this._inlineClass);b.children().addClass("ui-state-disabled");b.find("select.ui-datepicker-month, select.ui-datepicker-year").attr("disabled","disabled")}this._disabledInputs=d.map(this._disabledInputs,function(f){return f==a?null:f});this._disabledInputs[this._disabledInputs.length]=a}},_isDisabledDatepicker:function(a){if(!a)return false;
for(var b=0;b<this._disabledInputs.length;b++)if(this._disabledInputs[b]==a)return true;return false},_getInst:function(a){try{return d.data(a,"datepicker")}catch(b){throw"Missing instance data for this datepicker";}},_optionDatepicker:function(a,b,c){var e=this._getInst(a);if(arguments.length==2&&typeof b=="string")return b=="defaults"?d.extend({},d.datepicker._defaults):e?b=="all"?d.extend({},e.settings):this._get(e,b):null;var f=b||{};if(typeof b=="string"){f={};f[b]=c}if(e){this._curInst==e&&
this._hideDatepicker();var h=this._getDateDatepicker(a,true),i=this._getMinMaxDate(e,"min"),g=this._getMinMaxDate(e,"max");H(e.settings,f);if(i!==null&&f.dateFormat!==B&&f.minDate===B)e.settings.minDate=this._formatDate(e,i);if(g!==null&&f.dateFormat!==B&&f.maxDate===B)e.settings.maxDate=this._formatDate(e,g);this._attachments(d(a),e);this._autoSize(e);this._setDate(e,h);this._updateAlternate(e);this._updateDatepicker(e)}},_changeDatepicker:function(a,b,c){this._optionDatepicker(a,b,c)},_refreshDatepicker:function(a){(a=
this._getInst(a))&&this._updateDatepicker(a)},_setDateDatepicker:function(a,b){if(a=this._getInst(a)){this._setDate(a,b);this._updateDatepicker(a);this._updateAlternate(a)}},_getDateDatepicker:function(a,b){(a=this._getInst(a))&&!a.inline&&this._setDateFromField(a,b);return a?this._getDate(a):null},_doKeyDown:function(a){var b=d.datepicker._getInst(a.target),c=true,e=b.dpDiv.is(".ui-datepicker-rtl");b._keyEvent=true;if(d.datepicker._datepickerShowing)switch(a.keyCode){case 9:d.datepicker._hideDatepicker();
c=false;break;case 13:c=d("td."+d.datepicker._dayOverClass+":not(."+d.datepicker._currentClass+")",b.dpDiv);c[0]?d.datepicker._selectDay(a.target,b.selectedMonth,b.selectedYear,c[0]):d.datepicker._hideDatepicker();return false;case 27:d.datepicker._hideDatepicker();break;case 33:d.datepicker._adjustDate(a.target,a.ctrlKey?-d.datepicker._get(b,"stepBigMonths"):-d.datepicker._get(b,"stepMonths"),"M");break;case 34:d.datepicker._adjustDate(a.target,a.ctrlKey?+d.datepicker._get(b,"stepBigMonths"):+d.datepicker._get(b,
"stepMonths"),"M");break;case 35:if(a.ctrlKey||a.metaKey)d.datepicker._clearDate(a.target);c=a.ctrlKey||a.metaKey;break;case 36:if(a.ctrlKey||a.metaKey)d.datepicker._gotoToday(a.target);c=a.ctrlKey||a.metaKey;break;case 37:if(a.ctrlKey||a.metaKey)d.datepicker._adjustDate(a.target,e?+1:-1,"D");c=a.ctrlKey||a.metaKey;if(a.originalEvent.altKey)d.datepicker._adjustDate(a.target,a.ctrlKey?-d.datepicker._get(b,"stepBigMonths"):-d.datepicker._get(b,"stepMonths"),"M");break;case 38:if(a.ctrlKey||a.metaKey)d.datepicker._adjustDate(a.target,
-7,"D");c=a.ctrlKey||a.metaKey;break;case 39:if(a.ctrlKey||a.metaKey)d.datepicker._adjustDate(a.target,e?-1:+1,"D");c=a.ctrlKey||a.metaKey;if(a.originalEvent.altKey)d.datepicker._adjustDate(a.target,a.ctrlKey?+d.datepicker._get(b,"stepBigMonths"):+d.datepicker._get(b,"stepMonths"),"M");break;case 40:if(a.ctrlKey||a.metaKey)d.datepicker._adjustDate(a.target,+7,"D");c=a.ctrlKey||a.metaKey;break;default:c=false}else if(a.keyCode==36&&a.ctrlKey)d.datepicker._showDatepicker(this);else c=false;if(c){a.preventDefault();
a.stopPropagation()}},_doKeyPress:function(a){var b=d.datepicker._getInst(a.target);if(d.datepicker._get(b,"constrainInput")){b=d.datepicker._possibleChars(d.datepicker._get(b,"dateFormat"));var c=String.fromCharCode(a.charCode==B?a.keyCode:a.charCode);return a.ctrlKey||a.metaKey||c<" "||!b||b.indexOf(c)>-1}},_doKeyUp:function(a){a=d.datepicker._getInst(a.target);if(a.input.val()!=a.lastVal)try{if(d.datepicker.parseDate(d.datepicker._get(a,"dateFormat"),a.input?a.input.val():null,d.datepicker._getFormatConfig(a))){d.datepicker._setDateFromField(a);
d.datepicker._updateAlternate(a);d.datepicker._updateDatepicker(a)}}catch(b){d.datepicker.log(b)}return true},_showDatepicker:function(a){a=a.target||a;if(a.nodeName.toLowerCase()!="input")a=d("input",a.parentNode)[0];if(!(d.datepicker._isDisabledDatepicker(a)||d.datepicker._lastInput==a)){var b=d.datepicker._getInst(a);d.datepicker._curInst&&d.datepicker._curInst!=b&&d.datepicker._curInst.dpDiv.stop(true,true);var c=d.datepicker._get(b,"beforeShow");H(b.settings,c?c.apply(a,[a,b]):{});b.lastVal=
null;d.datepicker._lastInput=a;d.datepicker._setDateFromField(b);if(d.datepicker._inDialog)a.value="";if(!d.datepicker._pos){d.datepicker._pos=d.datepicker._findPos(a);d.datepicker._pos[1]+=a.offsetHeight}var e=false;d(a).parents().each(function(){e|=d(this).css("position")=="fixed";return!e});if(e&&d.browser.opera){d.datepicker._pos[0]-=document.documentElement.scrollLeft;d.datepicker._pos[1]-=document.documentElement.scrollTop}c={left:d.datepicker._pos[0],top:d.datepicker._pos[1]};d.datepicker._pos=
null;b.dpDiv.empty();b.dpDiv.css({position:"absolute",display:"block",top:"-1000px"});d.datepicker._updateDatepicker(b);c=d.datepicker._checkOffset(b,c,e);b.dpDiv.css({position:d.datepicker._inDialog&&d.blockUI?"static":e?"fixed":"absolute",display:"none",left:c.left+"px",top:c.top+"px"});if(!b.inline){c=d.datepicker._get(b,"showAnim");var f=d.datepicker._get(b,"duration"),h=function(){var i=b.dpDiv.find("iframe.ui-datepicker-cover");if(i.length){var g=d.datepicker._getBorders(b.dpDiv);i.css({left:-g[0],
top:-g[1],width:b.dpDiv.outerWidth(),height:b.dpDiv.outerHeight()})}};b.dpDiv.zIndex(d(a).zIndex()+1);d.datepicker._datepickerShowing=true;d.effects&&d.effects[c]?b.dpDiv.show(c,d.datepicker._get(b,"showOptions"),f,h):b.dpDiv[c||"show"](c?f:null,h);if(!c||!f)h();b.input.is(":visible")&&!b.input.is(":disabled")&&b.input.focus();d.datepicker._curInst=b}}},_updateDatepicker:function(a){var b=d.datepicker._getBorders(a.dpDiv);J=a;a.dpDiv.empty().append(this._generateHTML(a));var c=a.dpDiv.find("iframe.ui-datepicker-cover");
c.length&&c.css({left:-b[0],top:-b[1],width:a.dpDiv.outerWidth(),height:a.dpDiv.outerHeight()});a.dpDiv.find("."+this._dayOverClass+" a").mouseover();b=this._getNumberOfMonths(a);c=b[1];a.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width("");c>1&&a.dpDiv.addClass("ui-datepicker-multi-"+c).css("width",17*c+"em");a.dpDiv[(b[0]!=1||b[1]!=1?"add":"remove")+"Class"]("ui-datepicker-multi");a.dpDiv[(this._get(a,"isRTL")?"add":"remove")+"Class"]("ui-datepicker-rtl");
a==d.datepicker._curInst&&d.datepicker._datepickerShowing&&a.input&&a.input.is(":visible")&&!a.input.is(":disabled")&&a.input[0]!=document.activeElement&&a.input.focus();if(a.yearshtml){var e=a.yearshtml;setTimeout(function(){e===a.yearshtml&&a.yearshtml&&a.dpDiv.find("select.ui-datepicker-year:first").replaceWith(a.yearshtml);e=a.yearshtml=null},0)}},_getBorders:function(a){var b=function(c){return{thin:1,medium:2,thick:3}[c]||c};return[parseFloat(b(a.css("border-left-width"))),parseFloat(b(a.css("border-top-width")))]},
_checkOffset:function(a,b,c){var e=a.dpDiv.outerWidth(),f=a.dpDiv.outerHeight(),h=a.input?a.input.outerWidth():0,i=a.input?a.input.outerHeight():0,g=document.documentElement.clientWidth+d(document).scrollLeft(),j=document.documentElement.clientHeight+d(document).scrollTop();b.left-=this._get(a,"isRTL")?e-h:0;b.left-=c&&b.left==a.input.offset().left?d(document).scrollLeft():0;b.top-=c&&b.top==a.input.offset().top+i?d(document).scrollTop():0;b.left-=Math.min(b.left,b.left+e>g&&g>e?Math.abs(b.left+e-
g):0);b.top-=Math.min(b.top,b.top+f>j&&j>f?Math.abs(f+i):0);return b},_findPos:function(a){for(var b=this._get(this._getInst(a),"isRTL");a&&(a.type=="hidden"||a.nodeType!=1||d.expr.filters.hidden(a));)a=a[b?"previousSibling":"nextSibling"];a=d(a).offset();return[a.left,a.top]},_hideDatepicker:function(a){var b=this._curInst;if(!(!b||a&&b!=d.data(a,"datepicker")))if(this._datepickerShowing){a=this._get(b,"showAnim");var c=this._get(b,"duration"),e=function(){d.datepicker._tidyDialog(b);this._curInst=
null};d.effects&&d.effects[a]?b.dpDiv.hide(a,d.datepicker._get(b,"showOptions"),c,e):b.dpDiv[a=="slideDown"?"slideUp":a=="fadeIn"?"fadeOut":"hide"](a?c:null,e);a||e();if(a=this._get(b,"onClose"))a.apply(b.input?b.input[0]:null,[b.input?b.input.val():"",b]);this._datepickerShowing=false;this._lastInput=null;if(this._inDialog){this._dialogInput.css({position:"absolute",left:"0",top:"-100px"});if(d.blockUI){d.unblockUI();d("body").append(this.dpDiv)}}this._inDialog=false}},_tidyDialog:function(a){a.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar")},
_checkExternalClick:function(a){if(d.datepicker._curInst){a=d(a.target);a[0].id!=d.datepicker._mainDivId&&a.parents("#"+d.datepicker._mainDivId).length==0&&!a.hasClass(d.datepicker.markerClassName)&&!a.hasClass(d.datepicker._triggerClass)&&d.datepicker._datepickerShowing&&!(d.datepicker._inDialog&&d.blockUI)&&d.datepicker._hideDatepicker()}},_adjustDate:function(a,b,c){a=d(a);var e=this._getInst(a[0]);if(!this._isDisabledDatepicker(a[0])){this._adjustInstDate(e,b+(c=="M"?this._get(e,"showCurrentAtPos"):
0),c);this._updateDatepicker(e)}},_gotoToday:function(a){a=d(a);var b=this._getInst(a[0]);if(this._get(b,"gotoCurrent")&&b.currentDay){b.selectedDay=b.currentDay;b.drawMonth=b.selectedMonth=b.currentMonth;b.drawYear=b.selectedYear=b.currentYear}else{var c=new Date;b.selectedDay=c.getDate();b.drawMonth=b.selectedMonth=c.getMonth();b.drawYear=b.selectedYear=c.getFullYear()}this._notifyChange(b);this._adjustDate(a)},_selectMonthYear:function(a,b,c){a=d(a);var e=this._getInst(a[0]);e._selectingMonthYear=
false;e["selected"+(c=="M"?"Month":"Year")]=e["draw"+(c=="M"?"Month":"Year")]=parseInt(b.options[b.selectedIndex].value,10);this._notifyChange(e);this._adjustDate(a)},_clickMonthYear:function(a){var b=this._getInst(d(a)[0]);b.input&&b._selectingMonthYear&&setTimeout(function(){b.input.focus()},0);b._selectingMonthYear=!b._selectingMonthYear},_selectDay:function(a,b,c,e){var f=d(a);if(!(d(e).hasClass(this._unselectableClass)||this._isDisabledDatepicker(f[0]))){f=this._getInst(f[0]);f.selectedDay=f.currentDay=
d("a",e).html();f.selectedMonth=f.currentMonth=b;f.selectedYear=f.currentYear=c;this._selectDate(a,this._formatDate(f,f.currentDay,f.currentMonth,f.currentYear))}},_clearDate:function(a){a=d(a);this._getInst(a[0]);this._selectDate(a,"")},_selectDate:function(a,b){a=this._getInst(d(a)[0]);b=b!=null?b:this._formatDate(a);a.input&&a.input.val(b);this._updateAlternate(a);var c=this._get(a,"onSelect");if(c)c.apply(a.input?a.input[0]:null,[b,a]);else a.input&&a.input.trigger("change");if(a.inline)this._updateDatepicker(a);
else{this._hideDatepicker();this._lastInput=a.input[0];typeof a.input[0]!="object"&&a.input.focus();this._lastInput=null}},_updateAlternate:function(a){var b=this._get(a,"altField");if(b){var c=this._get(a,"altFormat")||this._get(a,"dateFormat"),e=this._getDate(a),f=this.formatDate(c,e,this._getFormatConfig(a));d(b).each(function(){d(this).val(f)})}},noWeekends:function(a){a=a.getDay();return[a>0&&a<6,""]},iso8601Week:function(a){a=new Date(a.getTime());a.setDate(a.getDate()+4-(a.getDay()||7));var b=
a.getTime();a.setMonth(0);a.setDate(1);return Math.floor(Math.round((b-a)/864E5)/7)+1},parseDate:function(a,b,c){if(a==null||b==null)throw"Invalid arguments";b=typeof b=="object"?b.toString():b+"";if(b=="")return null;var e=(c?c.shortYearCutoff:null)||this._defaults.shortYearCutoff;e=typeof e!="string"?e:(new Date).getFullYear()%100+parseInt(e,10);for(var f=(c?c.dayNamesShort:null)||this._defaults.dayNamesShort,h=(c?c.dayNames:null)||this._defaults.dayNames,i=(c?c.monthNamesShort:null)||this._defaults.monthNamesShort,
g=(c?c.monthNames:null)||this._defaults.monthNames,j=c=-1,l=-1,u=-1,k=false,o=function(p){(p=A+1<a.length&&a.charAt(A+1)==p)&&A++;return p},m=function(p){var C=o(p);p=new RegExp("^\\d{1,"+(p=="@"?14:p=="!"?20:p=="y"&&C?4:p=="o"?3:2)+"}");p=b.substring(s).match(p);if(!p)throw"Missing number at position "+s;s+=p[0].length;return parseInt(p[0],10)},n=function(p,C,K){p=d.map(o(p)?K:C,function(w,x){return[[x,w]]}).sort(function(w,x){return-(w[1].length-x[1].length)});var E=-1;d.each(p,function(w,x){w=
x[1];if(b.substr(s,w.length).toLowerCase()==w.toLowerCase()){E=x[0];s+=w.length;return false}});if(E!=-1)return E+1;else throw"Unknown name at position "+s;},r=function(){if(b.charAt(s)!=a.charAt(A))throw"Unexpected literal at position "+s;s++},s=0,A=0;A<a.length;A++)if(k)if(a.charAt(A)=="'"&&!o("'"))k=false;else r();else switch(a.charAt(A)){case "d":l=m("d");break;case "D":n("D",f,h);break;case "o":u=m("o");break;case "m":j=m("m");break;case "M":j=n("M",i,g);break;case "y":c=m("y");break;case "@":var v=
new Date(m("@"));c=v.getFullYear();j=v.getMonth()+1;l=v.getDate();break;case "!":v=new Date((m("!")-this._ticksTo1970)/1E4);c=v.getFullYear();j=v.getMonth()+1;l=v.getDate();break;case "'":if(o("'"))r();else k=true;break;default:r()}if(c==-1)c=(new Date).getFullYear();else if(c<100)c+=(new Date).getFullYear()-(new Date).getFullYear()%100+(c<=e?0:-100);if(u>-1){j=1;l=u;do{e=this._getDaysInMonth(c,j-1);if(l<=e)break;j++;l-=e}while(1)}v=this._daylightSavingAdjust(new Date(c,j-1,l));if(v.getFullYear()!=
c||v.getMonth()+1!=j||v.getDate()!=l)throw"Invalid date";return v},ATOM:"yy-mm-dd",COOKIE:"D, dd M yy",ISO_8601:"yy-mm-dd",RFC_822:"D, d M y",RFC_850:"DD, dd-M-y",RFC_1036:"D, d M y",RFC_1123:"D, d M yy",RFC_2822:"D, d M yy",RSS:"D, d M y",TICKS:"!",TIMESTAMP:"@",W3C:"yy-mm-dd",_ticksTo1970:(718685+Math.floor(492.5)-Math.floor(19.7)+Math.floor(4.925))*24*60*60*1E7,formatDate:function(a,b,c){if(!b)return"";var e=(c?c.dayNamesShort:null)||this._defaults.dayNamesShort,f=(c?c.dayNames:null)||this._defaults.dayNames,
h=(c?c.monthNamesShort:null)||this._defaults.monthNamesShort;c=(c?c.monthNames:null)||this._defaults.monthNames;var i=function(o){(o=k+1<a.length&&a.charAt(k+1)==o)&&k++;return o},g=function(o,m,n){m=""+m;if(i(o))for(;m.length<n;)m="0"+m;return m},j=function(o,m,n,r){return i(o)?r[m]:n[m]},l="",u=false;if(b)for(var k=0;k<a.length;k++)if(u)if(a.charAt(k)=="'"&&!i("'"))u=false;else l+=a.charAt(k);else switch(a.charAt(k)){case "d":l+=g("d",b.getDate(),2);break;case "D":l+=j("D",b.getDay(),e,f);break;
case "o":l+=g("o",(b.getTime()-(new Date(b.getFullYear(),0,0)).getTime())/864E5,3);break;case "m":l+=g("m",b.getMonth()+1,2);break;case "M":l+=j("M",b.getMonth(),h,c);break;case "y":l+=i("y")?b.getFullYear():(b.getYear()%100<10?"0":"")+b.getYear()%100;break;case "@":l+=b.getTime();break;case "!":l+=b.getTime()*1E4+this._ticksTo1970;break;case "'":if(i("'"))l+="'";else u=true;break;default:l+=a.charAt(k)}return l},_possibleChars:function(a){for(var b="",c=false,e=function(h){(h=f+1<a.length&&a.charAt(f+
1)==h)&&f++;return h},f=0;f<a.length;f++)if(c)if(a.charAt(f)=="'"&&!e("'"))c=false;else b+=a.charAt(f);else switch(a.charAt(f)){case "d":case "m":case "y":case "@":b+="0123456789";break;case "D":case "M":return null;case "'":if(e("'"))b+="'";else c=true;break;default:b+=a.charAt(f)}return b},_get:function(a,b){return a.settings[b]!==B?a.settings[b]:this._defaults[b]},_setDateFromField:function(a,b){if(a.input.val()!=a.lastVal){var c=this._get(a,"dateFormat"),e=a.lastVal=a.input?a.input.val():null,
f,h;f=h=this._getDefaultDate(a);var i=this._getFormatConfig(a);try{f=this.parseDate(c,e,i)||h}catch(g){this.log(g);e=b?"":e}a.selectedDay=f.getDate();a.drawMonth=a.selectedMonth=f.getMonth();a.drawYear=a.selectedYear=f.getFullYear();a.currentDay=e?f.getDate():0;a.currentMonth=e?f.getMonth():0;a.currentYear=e?f.getFullYear():0;this._adjustInstDate(a)}},_getDefaultDate:function(a){return this._restrictMinMax(a,this._determineDate(a,this._get(a,"defaultDate"),new Date))},_determineDate:function(a,b,
c){var e=function(h){var i=new Date;i.setDate(i.getDate()+h);return i},f=function(h){try{return d.datepicker.parseDate(d.datepicker._get(a,"dateFormat"),h,d.datepicker._getFormatConfig(a))}catch(i){}var g=(h.toLowerCase().match(/^c/)?d.datepicker._getDate(a):null)||new Date,j=g.getFullYear(),l=g.getMonth();g=g.getDate();for(var u=/([+-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,k=u.exec(h);k;){switch(k[2]||"d"){case "d":case "D":g+=parseInt(k[1],10);break;case "w":case "W":g+=parseInt(k[1],10)*7;break;case "m":case "M":l+=
parseInt(k[1],10);g=Math.min(g,d.datepicker._getDaysInMonth(j,l));break;case "y":case "Y":j+=parseInt(k[1],10);g=Math.min(g,d.datepicker._getDaysInMonth(j,l));break}k=u.exec(h)}return new Date(j,l,g)};if(b=(b=b==null||b===""?c:typeof b=="string"?f(b):typeof b=="number"?isNaN(b)?c:e(b):new Date(b.getTime()))&&b.toString()=="Invalid Date"?c:b){b.setHours(0);b.setMinutes(0);b.setSeconds(0);b.setMilliseconds(0)}return this._daylightSavingAdjust(b)},_daylightSavingAdjust:function(a){if(!a)return null;
a.setHours(a.getHours()>12?a.getHours()+2:0);return a},_setDate:function(a,b,c){var e=!b,f=a.selectedMonth,h=a.selectedYear;b=this._restrictMinMax(a,this._determineDate(a,b,new Date));a.selectedDay=a.currentDay=b.getDate();a.drawMonth=a.selectedMonth=a.currentMonth=b.getMonth();a.drawYear=a.selectedYear=a.currentYear=b.getFullYear();if((f!=a.selectedMonth||h!=a.selectedYear)&&!c)this._notifyChange(a);this._adjustInstDate(a);if(a.input)a.input.val(e?"":this._formatDate(a))},_getDate:function(a){return!a.currentYear||
a.input&&a.input.val()==""?null:this._daylightSavingAdjust(new Date(a.currentYear,a.currentMonth,a.currentDay))},_generateHTML:function(a){var b=new Date;b=this._daylightSavingAdjust(new Date(b.getFullYear(),b.getMonth(),b.getDate()));var c=this._get(a,"isRTL"),e=this._get(a,"showButtonPanel"),f=this._get(a,"hideIfNoPrevNext"),h=this._get(a,"navigationAsDateFormat"),i=this._getNumberOfMonths(a),g=this._get(a,"showCurrentAtPos"),j=this._get(a,"stepMonths"),l=i[0]!=1||i[1]!=1,u=this._daylightSavingAdjust(!a.currentDay?
new Date(9999,9,9):new Date(a.currentYear,a.currentMonth,a.currentDay)),k=this._getMinMaxDate(a,"min"),o=this._getMinMaxDate(a,"max");g=a.drawMonth-g;var m=a.drawYear;if(g<0){g+=12;m--}if(o){var n=this._daylightSavingAdjust(new Date(o.getFullYear(),o.getMonth()-i[0]*i[1]+1,o.getDate()));for(n=k&&n<k?k:n;this._daylightSavingAdjust(new Date(m,g,1))>n;){g--;if(g<0){g=11;m--}}}a.drawMonth=g;a.drawYear=m;n=this._get(a,"prevText");n=!h?n:this.formatDate(n,this._daylightSavingAdjust(new Date(m,g-j,1)),this._getFormatConfig(a));
n=this._canAdjustMonth(a,-1,m,g)?'<a class="ui-datepicker-prev ui-corner-all" onclick="DP_jQuery_'+z+".datepicker._adjustDate('#"+a.id+"', -"+j+", 'M');\" title=\""+n+'"><span class="ui-icon ui-icon-circle-triangle-'+(c?"e":"w")+'">'+n+"</span></a>":f?"":'<a class="ui-datepicker-prev ui-corner-all ui-state-disabled" title="'+n+'"><span class="ui-icon ui-icon-circle-triangle-'+(c?"e":"w")+'">'+n+"</span></a>";var r=this._get(a,"nextText");r=!h?r:this.formatDate(r,this._daylightSavingAdjust(new Date(m,
g+j,1)),this._getFormatConfig(a));f=this._canAdjustMonth(a,+1,m,g)?'<a class="ui-datepicker-next ui-corner-all" onclick="DP_jQuery_'+z+".datepicker._adjustDate('#"+a.id+"', +"+j+", 'M');\" title=\""+r+'"><span class="ui-icon ui-icon-circle-triangle-'+(c?"w":"e")+'">'+r+"</span></a>":f?"":'<a class="ui-datepicker-next ui-corner-all ui-state-disabled" title="'+r+'"><span class="ui-icon ui-icon-circle-triangle-'+(c?"w":"e")+'">'+r+"</span></a>";j=this._get(a,"currentText");r=this._get(a,"gotoCurrent")&&
a.currentDay?u:b;j=!h?j:this.formatDate(j,r,this._getFormatConfig(a));h=!a.inline?'<button type="button" class="ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all" onclick="DP_jQuery_'+z+'.datepicker._hideDatepicker();">'+this._get(a,"closeText")+"</button>":"";e=e?'<div class="ui-datepicker-buttonpane ui-widget-content">'+(c?h:"")+(this._isInRange(a,r)?'<button type="button" class="ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all" onclick="DP_jQuery_'+
z+".datepicker._gotoToday('#"+a.id+"');\">"+j+"</button>":"")+(c?"":h)+"</div>":"";h=parseInt(this._get(a,"firstDay"),10);h=isNaN(h)?0:h;j=this._get(a,"showWeek");r=this._get(a,"dayNames");this._get(a,"dayNamesShort");var s=this._get(a,"dayNamesMin"),A=this._get(a,"monthNames"),v=this._get(a,"monthNamesShort"),p=this._get(a,"beforeShowDay"),C=this._get(a,"showOtherMonths"),K=this._get(a,"selectOtherMonths");this._get(a,"calculateWeek");for(var E=this._getDefaultDate(a),w="",x=0;x<i[0];x++){for(var O=
"",G=0;G<i[1];G++){var P=this._daylightSavingAdjust(new Date(m,g,a.selectedDay)),t=" ui-corner-all",y="";if(l){y+='<div class="ui-datepicker-group';if(i[1]>1)switch(G){case 0:y+=" ui-datepicker-group-first";t=" ui-corner-"+(c?"right":"left");break;case i[1]-1:y+=" ui-datepicker-group-last";t=" ui-corner-"+(c?"left":"right");break;default:y+=" ui-datepicker-group-middle";t="";break}y+='">'}y+='<div class="ui-datepicker-header ui-widget-header ui-helper-clearfix'+t+'">'+(/all|left/.test(t)&&x==0?c?
f:n:"")+(/all|right/.test(t)&&x==0?c?n:f:"")+this._generateMonthYearHeader(a,g,m,k,o,x>0||G>0,A,v)+'</div><table class="ui-datepicker-calendar"><thead><tr>';var D=j?'<th class="ui-datepicker-week-col">'+this._get(a,"weekHeader")+"</th>":"";for(t=0;t<7;t++){var q=(t+h)%7;D+="<th"+((t+h+6)%7>=5?' class="ui-datepicker-week-end"':"")+'><span title="'+r[q]+'">'+s[q]+"</span></th>"}y+=D+"</tr></thead><tbody>";D=this._getDaysInMonth(m,g);if(m==a.selectedYear&&g==a.selectedMonth)a.selectedDay=Math.min(a.selectedDay,
D);t=(this._getFirstDayOfMonth(m,g)-h+7)%7;D=l?6:Math.ceil((t+D)/7);q=this._daylightSavingAdjust(new Date(m,g,1-t));for(var Q=0;Q<D;Q++){y+="<tr>";var R=!j?"":'<td class="ui-datepicker-week-col">'+this._get(a,"calculateWeek")(q)+"</td>";for(t=0;t<7;t++){var I=p?p.apply(a.input?a.input[0]:null,[q]):[true,""],F=q.getMonth()!=g,L=F&&!K||!I[0]||k&&q<k||o&&q>o;R+='<td class="'+((t+h+6)%7>=5?" ui-datepicker-week-end":"")+(F?" ui-datepicker-other-month":"")+(q.getTime()==P.getTime()&&g==a.selectedMonth&&
a._keyEvent||E.getTime()==q.getTime()&&E.getTime()==P.getTime()?" "+this._dayOverClass:"")+(L?" "+this._unselectableClass+" ui-state-disabled":"")+(F&&!C?"":" "+I[1]+(q.getTime()==u.getTime()?" "+this._currentClass:"")+(q.getTime()==b.getTime()?" ui-datepicker-today":""))+'"'+((!F||C)&&I[2]?' title="'+I[2]+'"':"")+(L?"":' onclick="DP_jQuery_'+z+".datepicker._selectDay('#"+a.id+"',"+q.getMonth()+","+q.getFullYear()+', this);return false;"')+">"+(F&&!C?"&#xa0;":L?'<span class="ui-state-default">'+q.getDate()+
"</span>":'<a class="ui-state-default'+(q.getTime()==b.getTime()?" ui-state-highlight":"")+(q.getTime()==u.getTime()?" ui-state-active":"")+(F?" ui-priority-secondary":"")+'" href="#">'+q.getDate()+"</a>")+"</td>";q.setDate(q.getDate()+1);q=this._daylightSavingAdjust(q)}y+=R+"</tr>"}g++;if(g>11){g=0;m++}y+="</tbody></table>"+(l?"</div>"+(i[0]>0&&G==i[1]-1?'<div class="ui-datepicker-row-break"></div>':""):"");O+=y}w+=O}w+=e+(d.browser.msie&&parseInt(d.browser.version,10)<7&&!a.inline?'<iframe src="javascript:false;" class="ui-datepicker-cover" frameborder="0"></iframe>':
"");a._keyEvent=false;return w},_generateMonthYearHeader:function(a,b,c,e,f,h,i,g){var j=this._get(a,"changeMonth"),l=this._get(a,"changeYear"),u=this._get(a,"showMonthAfterYear"),k='<div class="ui-datepicker-title">',o="";if(h||!j)o+='<span class="ui-datepicker-month">'+i[b]+"</span>";else{i=e&&e.getFullYear()==c;var m=f&&f.getFullYear()==c;o+='<select class="ui-datepicker-month" onchange="DP_jQuery_'+z+".datepicker._selectMonthYear('#"+a.id+"', this, 'M');\" onclick=\"DP_jQuery_"+z+".datepicker._clickMonthYear('#"+
a.id+"');\">";for(var n=0;n<12;n++)if((!i||n>=e.getMonth())&&(!m||n<=f.getMonth()))o+='<option value="'+n+'"'+(n==b?' selected="selected"':"")+">"+g[n]+"</option>";o+="</select>"}u||(k+=o+(h||!(j&&l)?"&#xa0;":""));if(!a.yearshtml){a.yearshtml="";if(h||!l)k+='<span class="ui-datepicker-year">'+c+"</span>";else{g=this._get(a,"yearRange").split(":");var r=(new Date).getFullYear();i=function(s){s=s.match(/c[+-].*/)?c+parseInt(s.substring(1),10):s.match(/[+-].*/)?r+parseInt(s,10):parseInt(s,10);return isNaN(s)?
r:s};b=i(g[0]);g=Math.max(b,i(g[1]||""));b=e?Math.max(b,e.getFullYear()):b;g=f?Math.min(g,f.getFullYear()):g;for(a.yearshtml+='<select class="ui-datepicker-year" onchange="DP_jQuery_'+z+".datepicker._selectMonthYear('#"+a.id+"', this, 'Y');\" onclick=\"DP_jQuery_"+z+".datepicker._clickMonthYear('#"+a.id+"');\">";b<=g;b++)a.yearshtml+='<option value="'+b+'"'+(b==c?' selected="selected"':"")+">"+b+"</option>";a.yearshtml+="</select>";k+=a.yearshtml;a.yearshtml=null}}k+=this._get(a,"yearSuffix");if(u)k+=
(h||!(j&&l)?"&#xa0;":"")+o;k+="</div>";return k},_adjustInstDate:function(a,b,c){var e=a.drawYear+(c=="Y"?b:0),f=a.drawMonth+(c=="M"?b:0);b=Math.min(a.selectedDay,this._getDaysInMonth(e,f))+(c=="D"?b:0);e=this._restrictMinMax(a,this._daylightSavingAdjust(new Date(e,f,b)));a.selectedDay=e.getDate();a.drawMonth=a.selectedMonth=e.getMonth();a.drawYear=a.selectedYear=e.getFullYear();if(c=="M"||c=="Y")this._notifyChange(a)},_restrictMinMax:function(a,b){var c=this._getMinMaxDate(a,"min");a=this._getMinMaxDate(a,
"max");b=c&&b<c?c:b;return b=a&&b>a?a:b},_notifyChange:function(a){var b=this._get(a,"onChangeMonthYear");if(b)b.apply(a.input?a.input[0]:null,[a.selectedYear,a.selectedMonth+1,a])},_getNumberOfMonths:function(a){a=this._get(a,"numberOfMonths");return a==null?[1,1]:typeof a=="number"?[1,a]:a},_getMinMaxDate:function(a,b){return this._determineDate(a,this._get(a,b+"Date"),null)},_getDaysInMonth:function(a,b){return 32-this._daylightSavingAdjust(new Date(a,b,32)).getDate()},_getFirstDayOfMonth:function(a,
b){return(new Date(a,b,1)).getDay()},_canAdjustMonth:function(a,b,c,e){var f=this._getNumberOfMonths(a);c=this._daylightSavingAdjust(new Date(c,e+(b<0?b:f[0]*f[1]),1));b<0&&c.setDate(this._getDaysInMonth(c.getFullYear(),c.getMonth()));return this._isInRange(a,c)},_isInRange:function(a,b){var c=this._getMinMaxDate(a,"min");a=this._getMinMaxDate(a,"max");return(!c||b.getTime()>=c.getTime())&&(!a||b.getTime()<=a.getTime())},_getFormatConfig:function(a){var b=this._get(a,"shortYearCutoff");b=typeof b!=
"string"?b:(new Date).getFullYear()%100+parseInt(b,10);return{shortYearCutoff:b,dayNamesShort:this._get(a,"dayNamesShort"),dayNames:this._get(a,"dayNames"),monthNamesShort:this._get(a,"monthNamesShort"),monthNames:this._get(a,"monthNames")}},_formatDate:function(a,b,c,e){if(!b){a.currentDay=a.selectedDay;a.currentMonth=a.selectedMonth;a.currentYear=a.selectedYear}b=b?typeof b=="object"?b:this._daylightSavingAdjust(new Date(e,c,b)):this._daylightSavingAdjust(new Date(a.currentYear,a.currentMonth,a.currentDay));
return this.formatDate(this._get(a,"dateFormat"),b,this._getFormatConfig(a))}});d.fn.datepicker=function(a){if(!this.length)return this;if(!d.datepicker.initialized){d(document).mousedown(d.datepicker._checkExternalClick).find("body").append(d.datepicker.dpDiv);d.datepicker.initialized=true}var b=Array.prototype.slice.call(arguments,1);if(typeof a=="string"&&(a=="isDisabled"||a=="getDate"||a=="widget"))return d.datepicker["_"+a+"Datepicker"].apply(d.datepicker,[this[0]].concat(b));if(a=="option"&&
arguments.length==2&&typeof arguments[1]=="string")return d.datepicker["_"+a+"Datepicker"].apply(d.datepicker,[this[0]].concat(b));return this.each(function(){typeof a=="string"?d.datepicker["_"+a+"Datepicker"].apply(d.datepicker,[this].concat(b)):d.datepicker._attachDatepicker(this,a)})};d.datepicker=new M;d.datepicker.initialized=false;d.datepicker.uuid=(new Date).getTime();d.datepicker.version="1.8.13";window["DP_jQuery_"+z]=d})(jQuery);
;/*
 * jQuery UI Progressbar 1.8.13
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Progressbar
 *
 * Depends:
 *   jquery.ui.core.js
 *   jquery.ui.widget.js
 */
(function(b,d){b.widget("ui.progressbar",{options:{value:0,max:100},min:0,_create:function(){this.element.addClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").attr({role:"progressbar","aria-valuemin":this.min,"aria-valuemax":this.options.max,"aria-valuenow":this._value()});this.valueDiv=b("<div class='ui-progressbar-value ui-widget-header ui-corner-left'></div>").appendTo(this.element);this.oldValue=this._value();this._refreshValue()},destroy:function(){this.element.removeClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow");
this.valueDiv.remove();b.Widget.prototype.destroy.apply(this,arguments)},value:function(a){if(a===d)return this._value();this._setOption("value",a);return this},_setOption:function(a,c){if(a==="value"){this.options.value=c;this._refreshValue();this._value()===this.options.max&&this._trigger("complete")}b.Widget.prototype._setOption.apply(this,arguments)},_value:function(){var a=this.options.value;if(typeof a!=="number")a=0;return Math.min(this.options.max,Math.max(this.min,a))},_percentage:function(){return 100*
this._value()/this.options.max},_refreshValue:function(){var a=this.value(),c=this._percentage();if(this.oldValue!==a){this.oldValue=a;this._trigger("change")}this.valueDiv.toggle(a>this.min).toggleClass("ui-corner-right",a===this.options.max).width(c.toFixed(0)+"%");this.element.attr("aria-valuenow",a)}});b.extend(b.ui.progressbar,{version:"1.8.13"})})(jQuery);
;/*
 * jQuery UI Effects 1.8.13
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/
 */
jQuery.effects||function(f,j){function m(c){var a;if(c&&c.constructor==Array&&c.length==3)return c;if(a=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(c))return[parseInt(a[1],10),parseInt(a[2],10),parseInt(a[3],10)];if(a=/rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(c))return[parseFloat(a[1])*2.55,parseFloat(a[2])*2.55,parseFloat(a[3])*2.55];if(a=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(c))return[parseInt(a[1],
16),parseInt(a[2],16),parseInt(a[3],16)];if(a=/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(c))return[parseInt(a[1]+a[1],16),parseInt(a[2]+a[2],16),parseInt(a[3]+a[3],16)];if(/rgba\(0, 0, 0, 0\)/.exec(c))return n.transparent;return n[f.trim(c).toLowerCase()]}function s(c,a){var b;do{b=f.curCSS(c,a);if(b!=""&&b!="transparent"||f.nodeName(c,"body"))break;a="backgroundColor"}while(c=c.parentNode);return m(b)}function o(){var c=document.defaultView?document.defaultView.getComputedStyle(this,null):this.currentStyle,
a={},b,d;if(c&&c.length&&c[0]&&c[c[0]])for(var e=c.length;e--;){b=c[e];if(typeof c[b]=="string"){d=b.replace(/\-(\w)/g,function(g,h){return h.toUpperCase()});a[d]=c[b]}}else for(b in c)if(typeof c[b]==="string")a[b]=c[b];return a}function p(c){var a,b;for(a in c){b=c[a];if(b==null||f.isFunction(b)||a in t||/scrollbar/.test(a)||!/color/i.test(a)&&isNaN(parseFloat(b)))delete c[a]}return c}function u(c,a){var b={_:0},d;for(d in a)if(c[d]!=a[d])b[d]=a[d];return b}function k(c,a,b,d){if(typeof c=="object"){d=
a;b=null;a=c;c=a.effect}if(f.isFunction(a)){d=a;b=null;a={}}if(typeof a=="number"||f.fx.speeds[a]){d=b;b=a;a={}}if(f.isFunction(b)){d=b;b=null}a=a||{};b=b||a.duration;b=f.fx.off?0:typeof b=="number"?b:b in f.fx.speeds?f.fx.speeds[b]:f.fx.speeds._default;d=d||a.complete;return[c,a,b,d]}function l(c){if(!c||typeof c==="number"||f.fx.speeds[c])return true;if(typeof c==="string"&&!f.effects[c])return true;return false}f.effects={};f.each(["backgroundColor","borderBottomColor","borderLeftColor","borderRightColor",
"borderTopColor","borderColor","color","outlineColor"],function(c,a){f.fx.step[a]=function(b){if(!b.colorInit){b.start=s(b.elem,a);b.end=m(b.end);b.colorInit=true}b.elem.style[a]="rgb("+Math.max(Math.min(parseInt(b.pos*(b.end[0]-b.start[0])+b.start[0],10),255),0)+","+Math.max(Math.min(parseInt(b.pos*(b.end[1]-b.start[1])+b.start[1],10),255),0)+","+Math.max(Math.min(parseInt(b.pos*(b.end[2]-b.start[2])+b.start[2],10),255),0)+")"}});var n={aqua:[0,255,255],azure:[240,255,255],beige:[245,245,220],black:[0,
0,0],blue:[0,0,255],brown:[165,42,42],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgrey:[169,169,169],darkgreen:[0,100,0],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkviolet:[148,0,211],fuchsia:[255,0,255],gold:[255,215,0],green:[0,128,0],indigo:[75,0,130],khaki:[240,230,140],lightblue:[173,216,230],lightcyan:[224,255,255],lightgreen:[144,238,144],lightgrey:[211,
211,211],lightpink:[255,182,193],lightyellow:[255,255,224],lime:[0,255,0],magenta:[255,0,255],maroon:[128,0,0],navy:[0,0,128],olive:[128,128,0],orange:[255,165,0],pink:[255,192,203],purple:[128,0,128],violet:[128,0,128],red:[255,0,0],silver:[192,192,192],white:[255,255,255],yellow:[255,255,0],transparent:[255,255,255]},q=["add","remove","toggle"],t={border:1,borderBottom:1,borderColor:1,borderLeft:1,borderRight:1,borderTop:1,borderWidth:1,margin:1,padding:1};f.effects.animateClass=function(c,a,b,
d){if(f.isFunction(b)){d=b;b=null}return this.queue(function(){var e=f(this),g=e.attr("style")||" ",h=p(o.call(this)),r,v=e.attr("class");f.each(q,function(w,i){c[i]&&e[i+"Class"](c[i])});r=p(o.call(this));e.attr("class",v);e.animate(u(h,r),{queue:false,duration:a,easding:b,complete:function(){f.each(q,function(w,i){c[i]&&e[i+"Class"](c[i])});if(typeof e.attr("style")=="object"){e.attr("style").cssText="";e.attr("style").cssText=g}else e.attr("style",g);d&&d.apply(this,arguments);f.dequeue(this)}})})};
f.fn.extend({_addClass:f.fn.addClass,addClass:function(c,a,b,d){return a?f.effects.animateClass.apply(this,[{add:c},a,b,d]):this._addClass(c)},_removeClass:f.fn.removeClass,removeClass:function(c,a,b,d){return a?f.effects.animateClass.apply(this,[{remove:c},a,b,d]):this._removeClass(c)},_toggleClass:f.fn.toggleClass,toggleClass:function(c,a,b,d,e){return typeof a=="boolean"||a===j?b?f.effects.animateClass.apply(this,[a?{add:c}:{remove:c},b,d,e]):this._toggleClass(c,a):f.effects.animateClass.apply(this,
[{toggle:c},a,b,d])},switchClass:function(c,a,b,d,e){return f.effects.animateClass.apply(this,[{add:a,remove:c},b,d,e])}});f.extend(f.effects,{version:"1.8.13",save:function(c,a){for(var b=0;b<a.length;b++)a[b]!==null&&c.data("ec.storage."+a[b],c[0].style[a[b]])},restore:function(c,a){for(var b=0;b<a.length;b++)a[b]!==null&&c.css(a[b],c.data("ec.storage."+a[b]))},setMode:function(c,a){if(a=="toggle")a=c.is(":hidden")?"show":"hide";return a},getBaseline:function(c,a){var b;switch(c[0]){case "top":b=
0;break;case "middle":b=0.5;break;case "bottom":b=1;break;default:b=c[0]/a.height}switch(c[1]){case "left":c=0;break;case "center":c=0.5;break;case "right":c=1;break;default:c=c[1]/a.width}return{x:c,y:b}},createWrapper:function(c){if(c.parent().is(".ui-effects-wrapper"))return c.parent();var a={width:c.outerWidth(true),height:c.outerHeight(true),"float":c.css("float")},b=f("<div></div>").addClass("ui-effects-wrapper").css({fontSize:"100%",background:"transparent",border:"none",margin:0,padding:0});
c.wrap(b);b=c.parent();if(c.css("position")=="static"){b.css({position:"relative"});c.css({position:"relative"})}else{f.extend(a,{position:c.css("position"),zIndex:c.css("z-index")});f.each(["top","left","bottom","right"],function(d,e){a[e]=c.css(e);if(isNaN(parseInt(a[e],10)))a[e]="auto"});c.css({position:"relative",top:0,left:0,right:"auto",bottom:"auto"})}return b.css(a).show()},removeWrapper:function(c){if(c.parent().is(".ui-effects-wrapper"))return c.parent().replaceWith(c);return c},setTransition:function(c,
a,b,d){d=d||{};f.each(a,function(e,g){unit=c.cssUnit(g);if(unit[0]>0)d[g]=unit[0]*b+unit[1]});return d}});f.fn.extend({effect:function(c){var a=k.apply(this,arguments),b={options:a[1],duration:a[2],callback:a[3]};a=b.options.mode;var d=f.effects[c];if(f.fx.off||!d)return a?this[a](b.duration,b.callback):this.each(function(){b.callback&&b.callback.call(this)});return d.call(this,b)},_show:f.fn.show,show:function(c){if(l(c))return this._show.apply(this,arguments);else{var a=k.apply(this,arguments);
a[1].mode="show";return this.effect.apply(this,a)}},_hide:f.fn.hide,hide:function(c){if(l(c))return this._hide.apply(this,arguments);else{var a=k.apply(this,arguments);a[1].mode="hide";return this.effect.apply(this,a)}},__toggle:f.fn.toggle,toggle:function(c){if(l(c)||typeof c==="boolean"||f.isFunction(c))return this.__toggle.apply(this,arguments);else{var a=k.apply(this,arguments);a[1].mode="toggle";return this.effect.apply(this,a)}},cssUnit:function(c){var a=this.css(c),b=[];f.each(["em","px","%",
"pt"],function(d,e){if(a.indexOf(e)>0)b=[parseFloat(a),e]});return b}});f.easing.jswing=f.easing.swing;f.extend(f.easing,{def:"easeOutQuad",swing:function(c,a,b,d,e){return f.easing[f.easing.def](c,a,b,d,e)},easeInQuad:function(c,a,b,d,e){return d*(a/=e)*a+b},easeOutQuad:function(c,a,b,d,e){return-d*(a/=e)*(a-2)+b},easeInOutQuad:function(c,a,b,d,e){if((a/=e/2)<1)return d/2*a*a+b;return-d/2*(--a*(a-2)-1)+b},easeInCubic:function(c,a,b,d,e){return d*(a/=e)*a*a+b},easeOutCubic:function(c,a,b,d,e){return d*
((a=a/e-1)*a*a+1)+b},easeInOutCubic:function(c,a,b,d,e){if((a/=e/2)<1)return d/2*a*a*a+b;return d/2*((a-=2)*a*a+2)+b},easeInQuart:function(c,a,b,d,e){return d*(a/=e)*a*a*a+b},easeOutQuart:function(c,a,b,d,e){return-d*((a=a/e-1)*a*a*a-1)+b},easeInOutQuart:function(c,a,b,d,e){if((a/=e/2)<1)return d/2*a*a*a*a+b;return-d/2*((a-=2)*a*a*a-2)+b},easeInQuint:function(c,a,b,d,e){return d*(a/=e)*a*a*a*a+b},easeOutQuint:function(c,a,b,d,e){return d*((a=a/e-1)*a*a*a*a+1)+b},easeInOutQuint:function(c,a,b,d,e){if((a/=
e/2)<1)return d/2*a*a*a*a*a+b;return d/2*((a-=2)*a*a*a*a+2)+b},easeInSine:function(c,a,b,d,e){return-d*Math.cos(a/e*(Math.PI/2))+d+b},easeOutSine:function(c,a,b,d,e){return d*Math.sin(a/e*(Math.PI/2))+b},easeInOutSine:function(c,a,b,d,e){return-d/2*(Math.cos(Math.PI*a/e)-1)+b},easeInExpo:function(c,a,b,d,e){return a==0?b:d*Math.pow(2,10*(a/e-1))+b},easeOutExpo:function(c,a,b,d,e){return a==e?b+d:d*(-Math.pow(2,-10*a/e)+1)+b},easeInOutExpo:function(c,a,b,d,e){if(a==0)return b;if(a==e)return b+d;if((a/=
e/2)<1)return d/2*Math.pow(2,10*(a-1))+b;return d/2*(-Math.pow(2,-10*--a)+2)+b},easeInCirc:function(c,a,b,d,e){return-d*(Math.sqrt(1-(a/=e)*a)-1)+b},easeOutCirc:function(c,a,b,d,e){return d*Math.sqrt(1-(a=a/e-1)*a)+b},easeInOutCirc:function(c,a,b,d,e){if((a/=e/2)<1)return-d/2*(Math.sqrt(1-a*a)-1)+b;return d/2*(Math.sqrt(1-(a-=2)*a)+1)+b},easeInElastic:function(c,a,b,d,e){c=1.70158;var g=0,h=d;if(a==0)return b;if((a/=e)==1)return b+d;g||(g=e*0.3);if(h<Math.abs(d)){h=d;c=g/4}else c=g/(2*Math.PI)*Math.asin(d/
h);return-(h*Math.pow(2,10*(a-=1))*Math.sin((a*e-c)*2*Math.PI/g))+b},easeOutElastic:function(c,a,b,d,e){c=1.70158;var g=0,h=d;if(a==0)return b;if((a/=e)==1)return b+d;g||(g=e*0.3);if(h<Math.abs(d)){h=d;c=g/4}else c=g/(2*Math.PI)*Math.asin(d/h);return h*Math.pow(2,-10*a)*Math.sin((a*e-c)*2*Math.PI/g)+d+b},easeInOutElastic:function(c,a,b,d,e){c=1.70158;var g=0,h=d;if(a==0)return b;if((a/=e/2)==2)return b+d;g||(g=e*0.3*1.5);if(h<Math.abs(d)){h=d;c=g/4}else c=g/(2*Math.PI)*Math.asin(d/h);if(a<1)return-0.5*
h*Math.pow(2,10*(a-=1))*Math.sin((a*e-c)*2*Math.PI/g)+b;return h*Math.pow(2,-10*(a-=1))*Math.sin((a*e-c)*2*Math.PI/g)*0.5+d+b},easeInBack:function(c,a,b,d,e,g){if(g==j)g=1.70158;return d*(a/=e)*a*((g+1)*a-g)+b},easeOutBack:function(c,a,b,d,e,g){if(g==j)g=1.70158;return d*((a=a/e-1)*a*((g+1)*a+g)+1)+b},easeInOutBack:function(c,a,b,d,e,g){if(g==j)g=1.70158;if((a/=e/2)<1)return d/2*a*a*(((g*=1.525)+1)*a-g)+b;return d/2*((a-=2)*a*(((g*=1.525)+1)*a+g)+2)+b},easeInBounce:function(c,a,b,d,e){return d-f.easing.easeOutBounce(c,
e-a,0,d,e)+b},easeOutBounce:function(c,a,b,d,e){return(a/=e)<1/2.75?d*7.5625*a*a+b:a<2/2.75?d*(7.5625*(a-=1.5/2.75)*a+0.75)+b:a<2.5/2.75?d*(7.5625*(a-=2.25/2.75)*a+0.9375)+b:d*(7.5625*(a-=2.625/2.75)*a+0.984375)+b},easeInOutBounce:function(c,a,b,d,e){if(a<e/2)return f.easing.easeInBounce(c,a*2,0,d,e)*0.5+b;return f.easing.easeOutBounce(c,a*2-e,0,d,e)*0.5+d*0.5+b}})}(jQuery);
;/*
 * jQuery UI Effects Blind 1.8.13
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Blind
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function(b){b.effects.blind=function(c){return this.queue(function(){var a=b(this),g=["position","top","bottom","left","right"],f=b.effects.setMode(a,c.options.mode||"hide"),d=c.options.direction||"vertical";b.effects.save(a,g);a.show();var e=b.effects.createWrapper(a).css({overflow:"hidden"}),h=d=="vertical"?"height":"width";d=d=="vertical"?e.height():e.width();f=="show"&&e.css(h,0);var i={};i[h]=f=="show"?d:0;e.animate(i,c.duration,c.options.easing,function(){f=="hide"&&a.hide();b.effects.restore(a,
g);b.effects.removeWrapper(a);c.callback&&c.callback.apply(a[0],arguments);a.dequeue()})})}})(jQuery);
;/*
 * jQuery UI Effects Bounce 1.8.13
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Bounce
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function(e){e.effects.bounce=function(b){return this.queue(function(){var a=e(this),l=["position","top","bottom","left","right"],h=e.effects.setMode(a,b.options.mode||"effect"),d=b.options.direction||"up",c=b.options.distance||20,m=b.options.times||5,i=b.duration||250;/show|hide/.test(h)&&l.push("opacity");e.effects.save(a,l);a.show();e.effects.createWrapper(a);var f=d=="up"||d=="down"?"top":"left";d=d=="up"||d=="left"?"pos":"neg";c=b.options.distance||(f=="top"?a.outerHeight({margin:true})/3:a.outerWidth({margin:true})/
3);if(h=="show")a.css("opacity",0).css(f,d=="pos"?-c:c);if(h=="hide")c/=m*2;h!="hide"&&m--;if(h=="show"){var g={opacity:1};g[f]=(d=="pos"?"+=":"-=")+c;a.animate(g,i/2,b.options.easing);c/=2;m--}for(g=0;g<m;g++){var j={},k={};j[f]=(d=="pos"?"-=":"+=")+c;k[f]=(d=="pos"?"+=":"-=")+c;a.animate(j,i/2,b.options.easing).animate(k,i/2,b.options.easing);c=h=="hide"?c*2:c/2}if(h=="hide"){g={opacity:0};g[f]=(d=="pos"?"-=":"+=")+c;a.animate(g,i/2,b.options.easing,function(){a.hide();e.effects.restore(a,l);e.effects.removeWrapper(a);
b.callback&&b.callback.apply(this,arguments)})}else{j={};k={};j[f]=(d=="pos"?"-=":"+=")+c;k[f]=(d=="pos"?"+=":"-=")+c;a.animate(j,i/2,b.options.easing).animate(k,i/2,b.options.easing,function(){e.effects.restore(a,l);e.effects.removeWrapper(a);b.callback&&b.callback.apply(this,arguments)})}a.queue("fx",function(){a.dequeue()});a.dequeue()})}})(jQuery);
;/*
 * jQuery UI Effects Clip 1.8.13
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Clip
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function(b){b.effects.clip=function(e){return this.queue(function(){var a=b(this),i=["position","top","bottom","left","right","height","width"],f=b.effects.setMode(a,e.options.mode||"hide"),c=e.options.direction||"vertical";b.effects.save(a,i);a.show();var d=b.effects.createWrapper(a).css({overflow:"hidden"});d=a[0].tagName=="IMG"?d:a;var g={size:c=="vertical"?"height":"width",position:c=="vertical"?"top":"left"};c=c=="vertical"?d.height():d.width();if(f=="show"){d.css(g.size,0);d.css(g.position,
c/2)}var h={};h[g.size]=f=="show"?c:0;h[g.position]=f=="show"?0:c/2;d.animate(h,{queue:false,duration:e.duration,easing:e.options.easing,complete:function(){f=="hide"&&a.hide();b.effects.restore(a,i);b.effects.removeWrapper(a);e.callback&&e.callback.apply(a[0],arguments);a.dequeue()}})})}})(jQuery);
;/*
 * jQuery UI Effects Drop 1.8.13
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Drop
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function(c){c.effects.drop=function(d){return this.queue(function(){var a=c(this),h=["position","top","bottom","left","right","opacity"],e=c.effects.setMode(a,d.options.mode||"hide"),b=d.options.direction||"left";c.effects.save(a,h);a.show();c.effects.createWrapper(a);var f=b=="up"||b=="down"?"top":"left";b=b=="up"||b=="left"?"pos":"neg";var g=d.options.distance||(f=="top"?a.outerHeight({margin:true})/2:a.outerWidth({margin:true})/2);if(e=="show")a.css("opacity",0).css(f,b=="pos"?-g:g);var i={opacity:e==
"show"?1:0};i[f]=(e=="show"?b=="pos"?"+=":"-=":b=="pos"?"-=":"+=")+g;a.animate(i,{queue:false,duration:d.duration,easing:d.options.easing,complete:function(){e=="hide"&&a.hide();c.effects.restore(a,h);c.effects.removeWrapper(a);d.callback&&d.callback.apply(this,arguments);a.dequeue()}})})}})(jQuery);
;/*
 * jQuery UI Effects Explode 1.8.13
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Explode
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function(j){j.effects.explode=function(a){return this.queue(function(){var c=a.options.pieces?Math.round(Math.sqrt(a.options.pieces)):3,d=a.options.pieces?Math.round(Math.sqrt(a.options.pieces)):3;a.options.mode=a.options.mode=="toggle"?j(this).is(":visible")?"hide":"show":a.options.mode;var b=j(this).show().css("visibility","hidden"),g=b.offset();g.top-=parseInt(b.css("marginTop"),10)||0;g.left-=parseInt(b.css("marginLeft"),10)||0;for(var h=b.outerWidth(true),i=b.outerHeight(true),e=0;e<c;e++)for(var f=
0;f<d;f++)b.clone().appendTo("body").wrap("<div></div>").css({position:"absolute",visibility:"visible",left:-f*(h/d),top:-e*(i/c)}).parent().addClass("ui-effects-explode").css({position:"absolute",overflow:"hidden",width:h/d,height:i/c,left:g.left+f*(h/d)+(a.options.mode=="show"?(f-Math.floor(d/2))*(h/d):0),top:g.top+e*(i/c)+(a.options.mode=="show"?(e-Math.floor(c/2))*(i/c):0),opacity:a.options.mode=="show"?0:1}).animate({left:g.left+f*(h/d)+(a.options.mode=="show"?0:(f-Math.floor(d/2))*(h/d)),top:g.top+
e*(i/c)+(a.options.mode=="show"?0:(e-Math.floor(c/2))*(i/c)),opacity:a.options.mode=="show"?1:0},a.duration||500);setTimeout(function(){a.options.mode=="show"?b.css({visibility:"visible"}):b.css({visibility:"visible"}).hide();a.callback&&a.callback.apply(b[0]);b.dequeue();j("div.ui-effects-explode").remove()},a.duration||500)})}})(jQuery);
;/*
 * jQuery UI Effects Fade 1.8.13
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Fade
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function(b){b.effects.fade=function(a){return this.queue(function(){var c=b(this),d=b.effects.setMode(c,a.options.mode||"hide");c.animate({opacity:d},{queue:false,duration:a.duration,easing:a.options.easing,complete:function(){a.callback&&a.callback.apply(this,arguments);c.dequeue()}})})}})(jQuery);
;/*
 * jQuery UI Effects Fold 1.8.13
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Fold
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function(c){c.effects.fold=function(a){return this.queue(function(){var b=c(this),j=["position","top","bottom","left","right"],d=c.effects.setMode(b,a.options.mode||"hide"),g=a.options.size||15,h=!!a.options.horizFirst,k=a.duration?a.duration/2:c.fx.speeds._default/2;c.effects.save(b,j);b.show();var e=c.effects.createWrapper(b).css({overflow:"hidden"}),f=d=="show"!=h,l=f?["width","height"]:["height","width"];f=f?[e.width(),e.height()]:[e.height(),e.width()];var i=/([0-9]+)%/.exec(g);if(i)g=parseInt(i[1],
10)/100*f[d=="hide"?0:1];if(d=="show")e.css(h?{height:0,width:g}:{height:g,width:0});h={};i={};h[l[0]]=d=="show"?f[0]:g;i[l[1]]=d=="show"?f[1]:0;e.animate(h,k,a.options.easing).animate(i,k,a.options.easing,function(){d=="hide"&&b.hide();c.effects.restore(b,j);c.effects.removeWrapper(b);a.callback&&a.callback.apply(b[0],arguments);b.dequeue()})})}})(jQuery);
;/*
 * jQuery UI Effects Highlight 1.8.13
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Highlight
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function(b){b.effects.highlight=function(c){return this.queue(function(){var a=b(this),e=["backgroundImage","backgroundColor","opacity"],d=b.effects.setMode(a,c.options.mode||"show"),f={backgroundColor:a.css("backgroundColor")};if(d=="hide")f.opacity=0;b.effects.save(a,e);a.show().css({backgroundImage:"none",backgroundColor:c.options.color||"#ffff99"}).animate(f,{queue:false,duration:c.duration,easing:c.options.easing,complete:function(){d=="hide"&&a.hide();b.effects.restore(a,e);d=="show"&&!b.support.opacity&&
this.style.removeAttribute("filter");c.callback&&c.callback.apply(this,arguments);a.dequeue()}})})}})(jQuery);
;/*
 * jQuery UI Effects Pulsate 1.8.13
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Pulsate
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function(d){d.effects.pulsate=function(a){return this.queue(function(){var b=d(this),c=d.effects.setMode(b,a.options.mode||"show");times=(a.options.times||5)*2-1;duration=a.duration?a.duration/2:d.fx.speeds._default/2;isVisible=b.is(":visible");animateTo=0;if(!isVisible){b.css("opacity",0).show();animateTo=1}if(c=="hide"&&isVisible||c=="show"&&!isVisible)times--;for(c=0;c<times;c++){b.animate({opacity:animateTo},duration,a.options.easing);animateTo=(animateTo+1)%2}b.animate({opacity:animateTo},duration,
a.options.easing,function(){animateTo==0&&b.hide();a.callback&&a.callback.apply(this,arguments)});b.queue("fx",function(){b.dequeue()}).dequeue()})}})(jQuery);
;/*
 * jQuery UI Effects Scale 1.8.13
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Scale
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function(c){c.effects.puff=function(b){return this.queue(function(){var a=c(this),e=c.effects.setMode(a,b.options.mode||"hide"),g=parseInt(b.options.percent,10)||150,h=g/100,i={height:a.height(),width:a.width()};c.extend(b.options,{fade:true,mode:e,percent:e=="hide"?g:100,from:e=="hide"?i:{height:i.height*h,width:i.width*h}});a.effect("scale",b.options,b.duration,b.callback);a.dequeue()})};c.effects.scale=function(b){return this.queue(function(){var a=c(this),e=c.extend(true,{},b.options),g=c.effects.setMode(a,
b.options.mode||"effect"),h=parseInt(b.options.percent,10)||(parseInt(b.options.percent,10)==0?0:g=="hide"?0:100),i=b.options.direction||"both",f=b.options.origin;if(g!="effect"){e.origin=f||["middle","center"];e.restore=true}f={height:a.height(),width:a.width()};a.from=b.options.from||(g=="show"?{height:0,width:0}:f);h={y:i!="horizontal"?h/100:1,x:i!="vertical"?h/100:1};a.to={height:f.height*h.y,width:f.width*h.x};if(b.options.fade){if(g=="show"){a.from.opacity=0;a.to.opacity=1}if(g=="hide"){a.from.opacity=
1;a.to.opacity=0}}e.from=a.from;e.to=a.to;e.mode=g;a.effect("size",e,b.duration,b.callback);a.dequeue()})};c.effects.size=function(b){return this.queue(function(){var a=c(this),e=["position","top","bottom","left","right","width","height","overflow","opacity"],g=["position","top","bottom","left","right","overflow","opacity"],h=["width","height","overflow"],i=["fontSize"],f=["borderTopWidth","borderBottomWidth","paddingTop","paddingBottom"],k=["borderLeftWidth","borderRightWidth","paddingLeft","paddingRight"],
p=c.effects.setMode(a,b.options.mode||"effect"),n=b.options.restore||false,m=b.options.scale||"both",l=b.options.origin,j={height:a.height(),width:a.width()};a.from=b.options.from||j;a.to=b.options.to||j;if(l){l=c.effects.getBaseline(l,j);a.from.top=(j.height-a.from.height)*l.y;a.from.left=(j.width-a.from.width)*l.x;a.to.top=(j.height-a.to.height)*l.y;a.to.left=(j.width-a.to.width)*l.x}var d={from:{y:a.from.height/j.height,x:a.from.width/j.width},to:{y:a.to.height/j.height,x:a.to.width/j.width}};
if(m=="box"||m=="both"){if(d.from.y!=d.to.y){e=e.concat(f);a.from=c.effects.setTransition(a,f,d.from.y,a.from);a.to=c.effects.setTransition(a,f,d.to.y,a.to)}if(d.from.x!=d.to.x){e=e.concat(k);a.from=c.effects.setTransition(a,k,d.from.x,a.from);a.to=c.effects.setTransition(a,k,d.to.x,a.to)}}if(m=="content"||m=="both")if(d.from.y!=d.to.y){e=e.concat(i);a.from=c.effects.setTransition(a,i,d.from.y,a.from);a.to=c.effects.setTransition(a,i,d.to.y,a.to)}c.effects.save(a,n?e:g);a.show();c.effects.createWrapper(a);
a.css("overflow","hidden").css(a.from);if(m=="content"||m=="both"){f=f.concat(["marginTop","marginBottom"]).concat(i);k=k.concat(["marginLeft","marginRight"]);h=e.concat(f).concat(k);a.find("*[width]").each(function(){child=c(this);n&&c.effects.save(child,h);var o={height:child.height(),width:child.width()};child.from={height:o.height*d.from.y,width:o.width*d.from.x};child.to={height:o.height*d.to.y,width:o.width*d.to.x};if(d.from.y!=d.to.y){child.from=c.effects.setTransition(child,f,d.from.y,child.from);
child.to=c.effects.setTransition(child,f,d.to.y,child.to)}if(d.from.x!=d.to.x){child.from=c.effects.setTransition(child,k,d.from.x,child.from);child.to=c.effects.setTransition(child,k,d.to.x,child.to)}child.css(child.from);child.animate(child.to,b.duration,b.options.easing,function(){n&&c.effects.restore(child,h)})})}a.animate(a.to,{queue:false,duration:b.duration,easing:b.options.easing,complete:function(){a.to.opacity===0&&a.css("opacity",a.from.opacity);p=="hide"&&a.hide();c.effects.restore(a,
n?e:g);c.effects.removeWrapper(a);b.callback&&b.callback.apply(this,arguments);a.dequeue()}})})}})(jQuery);
;/*
 * jQuery UI Effects Shake 1.8.13
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Shake
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function(d){d.effects.shake=function(a){return this.queue(function(){var b=d(this),j=["position","top","bottom","left","right"];d.effects.setMode(b,a.options.mode||"effect");var c=a.options.direction||"left",e=a.options.distance||20,l=a.options.times||3,f=a.duration||a.options.duration||140;d.effects.save(b,j);b.show();d.effects.createWrapper(b);var g=c=="up"||c=="down"?"top":"left",h=c=="up"||c=="left"?"pos":"neg";c={};var i={},k={};c[g]=(h=="pos"?"-=":"+=")+e;i[g]=(h=="pos"?"+=":"-=")+e*2;k[g]=
(h=="pos"?"-=":"+=")+e*2;b.animate(c,f,a.options.easing);for(e=1;e<l;e++)b.animate(i,f,a.options.easing).animate(k,f,a.options.easing);b.animate(i,f,a.options.easing).animate(c,f/2,a.options.easing,function(){d.effects.restore(b,j);d.effects.removeWrapper(b);a.callback&&a.callback.apply(this,arguments)});b.queue("fx",function(){b.dequeue()});b.dequeue()})}})(jQuery);
;/*
 * jQuery UI Effects Slide 1.8.13
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Slide
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function(c){c.effects.slide=function(d){return this.queue(function(){var a=c(this),h=["position","top","bottom","left","right"],f=c.effects.setMode(a,d.options.mode||"show"),b=d.options.direction||"left";c.effects.save(a,h);a.show();c.effects.createWrapper(a).css({overflow:"hidden"});var g=b=="up"||b=="down"?"top":"left";b=b=="up"||b=="left"?"pos":"neg";var e=d.options.distance||(g=="top"?a.outerHeight({margin:true}):a.outerWidth({margin:true}));if(f=="show")a.css(g,b=="pos"?isNaN(e)?"-"+e:-e:e);
var i={};i[g]=(f=="show"?b=="pos"?"+=":"-=":b=="pos"?"-=":"+=")+e;a.animate(i,{queue:false,duration:d.duration,easing:d.options.easing,complete:function(){f=="hide"&&a.hide();c.effects.restore(a,h);c.effects.removeWrapper(a);d.callback&&d.callback.apply(this,arguments);a.dequeue()}})})}})(jQuery);
;/*
 * jQuery UI Effects Transfer 1.8.13
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Transfer
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function(e){e.effects.transfer=function(a){return this.queue(function(){var b=e(this),c=e(a.options.to),d=c.offset();c={top:d.top,left:d.left,height:c.innerHeight(),width:c.innerWidth()};d=b.offset();var f=e('<div class="ui-effects-transfer"></div>').appendTo(document.body).addClass(a.options.className).css({top:d.top,left:d.left,height:b.innerHeight(),width:b.innerWidth(),position:"absolute"}).animate(c,a.duration,a.options.easing,function(){f.remove();a.callback&&a.callback.apply(b[0],arguments);
b.dequeue()})})}})(jQuery);
;
/*
 * ContextMenu - jQuery plugin for right-click context menus
 *
 * Author: Chris Domigan
 * Contributors: Dan G. Switzer, II
 * Parts of this plugin are inspired by Joern Zaefferer's Tooltip plugin
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Version: r2
 * Date: 16 July 2007
 *
 * For documentation visit http://www.trendskitchens.co.nz/jquery/contextmenu/
 *
 */


(function($) {

 	var menu, shadow, content, hash, currentTarget;
  var defaults = {
    menuStyle: {
      listStyle: 'none',
      padding: '1px',
      margin: '0px',
      backgroundColor: '#fff',
      border: '1px solid #999',
      width: '100px'
    },
    itemStyle: {
      margin: '0px',
      color: '#000',
      display: 'block',
      cursor: 'default',
      padding: '3px',
      border: '1px solid #fff',
      backgroundColor: 'transparent'
    },
    itemHoverStyle: {
      border: '1px solid #0a246a',
      backgroundColor: '#b6bdd2'
    },
    eventPosX: 'pageX',
    eventPosY: 'pageY',
    shadow : true,
    onContextMenu: null,
    onShowMenu: null
 	};

  $.fn.contextMenu = function(id, options) {
    if (!menu) {                                      // Create singleton menu
      menu = $('<div id="jqContextMenu"></div>')
               .hide()
               .css({position:'absolute', zIndex:'500'})
               .appendTo('body')
               .bind('click', function(e) {
                 e.stopPropagation();
               });
    }
    if (!shadow) {
      shadow = $('<div></div>')
                 .css({backgroundColor:'#000',position:'absolute',opacity:0.2,zIndex:499})
                 .appendTo('body')
                 .hide();
    }
    hash = hash || [];
    hash.push({
      id : id,
      menuStyle: $.extend({}, defaults.menuStyle, options.menuStyle || {}),
      itemStyle: $.extend({}, defaults.itemStyle, options.itemStyle || {}),
      itemHoverStyle: $.extend({}, defaults.itemHoverStyle, options.itemHoverStyle || {}),
      bindings: options.bindings || {},
      shadow: options.shadow || options.shadow === false ? options.shadow : defaults.shadow,
      onContextMenu: options.onContextMenu || defaults.onContextMenu,
      onShowMenu: options.onShowMenu || defaults.onShowMenu,
      eventPosX: options.eventPosX || defaults.eventPosX,
      eventPosY: options.eventPosY || defaults.eventPosY
    });

    var index = hash.length - 1;
    $(this).bind('contextmenu', function(e) {
      // Check if onContextMenu() defined
      var bShowContext = (!!hash[index].onContextMenu) ? hash[index].onContextMenu(e) : true;
	  currentTarget = e.target;
      if (bShowContext) {
		display(index, this, e );
		return false;
	  }
    });
    return this;
  };

  function display(index, trigger, e ) {
    var cur = hash[index];
    content = $('#'+cur.id).find('ul:first').clone(true);
    content.css(cur.menuStyle).find('li').css(cur.itemStyle).hover(
      function() {
        $(this).css(cur.itemHoverStyle);
      },
      function(){
        $(this).css(cur.itemStyle);
      }
    ).find('img').css({verticalAlign:'middle',paddingRight:'2px'});

    // Send the content to the menu
    menu.html(content);

    // if there's an onShowMenu, run it now -- must run after content has been added
		// if you try to alter the content variable before the menu.html(), IE6 has issues
		// updating the content
    if (!!cur.onShowMenu) menu = cur.onShowMenu(e, menu);

    $.each(cur.bindings, function(id, func) {
      $('#'+id, menu).bind('click', function() {
        hide();
        func(trigger, currentTarget);
      });
    });

    menu.css({'left':e[cur.eventPosX],'top':e[cur.eventPosY]}).show();
    if (cur.shadow) shadow.css({width:menu.width(),height:menu.height(),left:e.pageX+2,top:e.pageY+2}).show();
    $(document).one('click', hide);
  }

  function hide() {
    menu.hide();
    shadow.hide();
  }

  // Apply defaults
  $.contextMenu = {
    defaults : function(userDefaults) {
      $.each(userDefaults, function(i, val) {
        if (typeof val == 'object' && defaults[i]) {
          $.extend(defaults[i], val);
        }
        else defaults[i] = val;
      });
    }
  };

})(jQuery);

$(function() {
  $('div.contextMenu').hide();
});
/*
 * jquery.layout 1.2.0
 *
 * Copyright (c) 2008 
 *   Fabrizio Balliano (http://www.fabrizioballiano.net)
 *   Kevin Dalman (http://allpro.net)
 *
 * Dual licensed under the GPL (http://www.gnu.org/licenses/gpl.html)
 * and MIT (http://www.opensource.org/licenses/mit-license.php) licenses.
 *
 * $Date: 2008-12-27 02:17:22 +0100 (sab, 27 dic 2008) $
 * $Rev: 203 $
 * 
 * NOTE: For best code readability, view this with a fixed-space font and tabs equal to 4-chars
 */

(function($){$.fn.layout=function(opts){var
prefix="ui-layout-",defaults={paneClass:prefix+"pane",resizerClass:prefix+"resizer",togglerClass:prefix+"toggler",togglerInnerClass:prefix+"",buttonClass:prefix+"button",contentSelector:"."+prefix+"content",contentIgnoreSelector:"."+prefix+"ignore"};var options={name:"",scrollToBookmarkOnLoad:true,defaults:{applyDefaultStyles:false,closable:true,resizable:true,slidable:true,contentSelector:defaults.contentSelector,contentIgnoreSelector:defaults.contentIgnoreSelector,paneClass:defaults.paneClass,resizerClass:defaults.resizerClass,togglerClass:defaults.togglerClass,buttonClass:defaults.buttonClass,resizerDragOpacity:1,maskIframesOnResize:true,minSize:0,maxSize:0,spacing_open:6,spacing_closed:6,togglerLength_open:50,togglerLength_closed:50,togglerAlign_open:"center",togglerAlign_closed:"center",togglerTip_open:"Close",togglerTip_closed:"Open",resizerTip:"Resize",sliderTip:"Slide Open",sliderCursor:"pointer",slideTrigger_open:"click",slideTrigger_close:"mouseout",hideTogglerOnSlide:false,togglerContent_open:"",togglerContent_closed:"",showOverflowOnHover:false,enableCursorHotkey:true,customHotkeyModifier:"SHIFT",fxName:"slide",fxSpeed:null,fxSettings:{},initClosed:false,initHidden:false},north:{paneSelector:"."+prefix+"north",size:"auto",resizerCursor:"n-resize"},south:{paneSelector:"."+prefix+"south",size:"auto",resizerCursor:"s-resize"},east:{paneSelector:"."+prefix+"east",size:200,resizerCursor:"e-resize"},west:{paneSelector:"."+prefix+"west",size:200,resizerCursor:"w-resize"},center:{paneSelector:"."+prefix+"center"}};var effects={slide:{all:{duration:"fast"},north:{direction:"up"},south:{direction:"down"},east:{direction:"right"},west:{direction:"left"}},drop:{all:{duration:"slow"},north:{direction:"up"},south:{direction:"down"},east:{direction:"right"},west:{direction:"left"}},scale:{all:{duration:"fast"}}};var config={allPanes:"north,south,east,west,center",borderPanes:"north,south,east,west",zIndex:{resizer_normal:1,pane_normal:2,mask:4,sliding:100,resizing:10000,animation:10000},resizers:{cssReq:{position:"absolute",padding:0,margin:0,fontSize:"1px",textAlign:"left",overflow:"hidden",zIndex:1},cssDef:{background:"#DDD",border:"none"}},togglers:{cssReq:{position:"absolute",display:"block",padding:0,margin:0,overflow:"hidden",textAlign:"center",fontSize:"1px",cursor:"pointer",zIndex:1},cssDef:{background:"#AAA"}},content:{cssReq:{overflow:"auto"},cssDef:{}},defaults:{cssReq:{position:"absolute",margin:0,zIndex:2},cssDef:{padding:"10px",background:"#FFF",border:"1px solid #BBB",overflow:"auto"}},north:{edge:"top",sizeType:"height",dir:"horz",cssReq:{top:0,bottom:"auto",left:0,right:0,width:"auto"}},south:{edge:"bottom",sizeType:"height",dir:"horz",cssReq:{top:"auto",bottom:0,left:0,right:0,width:"auto"}},east:{edge:"right",sizeType:"width",dir:"vert",cssReq:{left:"auto",right:0,top:"auto",bottom:"auto",height:"auto"}},west:{edge:"left",sizeType:"width",dir:"vert",cssReq:{left:0,right:"auto",top:"auto",bottom:"auto",height:"auto"}},center:{dir:"center",cssReq:{left:"auto",right:"auto",top:"auto",bottom:"auto",height:"auto",width:"auto"}}};var state={id:Math.floor(Math.random()*10000),container:{},north:{},south:{},east:{},west:{},center:{}};var
altEdge={top:"bottom",bottom:"top",left:"right",right:"left"},altSide={north:"south",south:"north",east:"west",west:"east"};var isStr=function(o){if(typeof o=="string")return true;else if(typeof o=="object"){try{var match=o.constructor.toString().match(/string/i);return(match!==null);}catch(e){}}return false;};var str=function(o){if(typeof o=="string"||isStr(o))return $.trim(o);else return o;};var min=function(x,y){return Math.min(x,y);};var max=function(x,y){return Math.max(x,y);};var transformData=function(d){var json={defaults:{fxSettings:{}},north:{fxSettings:{}},south:{fxSettings:{}},east:{fxSettings:{}},west:{fxSettings:{}},center:{fxSettings:{}}};d=d||{};if(d.effects||d.defaults||d.north||d.south||d.west||d.east||d.center)json=$.extend(json,d);else
$.each(d,function(key,val){a=key.split("__");json[a[1]?a[0]:"defaults"][a[1]?a[1]:a[0]]=val;});return json;};var setFlowCallback=function(action,pane,param){var
cb=action+","+pane+","+(param?1:0),cP,cbPane;$.each(c.borderPanes.split(","),function(i,p){if(c[p].isMoving){bindCallback(p);return false;}});function bindCallback(p,test){cP=c[p];if(!cP.doCallback){cP.doCallback=true;cP.callback=cb;}else{cpPane=cP.callback.split(",")[1];if(cpPane!=p&&cpPane!=pane)bindCallback(cpPane,true);}}};var execFlowCallback=function(pane){var cP=c[pane];c.isLayoutBusy=false;delete cP.isMoving;if(!cP.doCallback||!cP.callback)return;cP.doCallback=false;var
cb=cP.callback.split(","),param=(cb[2]>0?true:false);if(cb[0]=="open")open(cb[1],param);else if(cb[0]=="close")close(cb[1],param);if(!cP.doCallback)cP.callback=null;};var execUserCallback=function(pane,v_fn){if(!v_fn)return;var fn;try{if(typeof v_fn=="function")fn=v_fn;else if(typeof v_fn!="string")return;else if(v_fn.indexOf(",")>0){var
args=v_fn.split(","),fn=eval(args[0]);if(typeof fn=="function"&&args.length>1)return fn(args[1]);}else
fn=eval(v_fn);if(typeof fn=="function")return fn(pane,$Ps[pane],$.extend({},state[pane]),$.extend({},options[pane]),options.name);}catch(ex){}};var cssNum=function($E,prop){var
val=0,hidden=false,visibility="";if(!$.browser.msie){if($.curCSS($E[0],"display",true)=="none"){hidden=true;visibility=$.curCSS($E[0],"visibility",true);$E.css({display:"block",visibility:"hidden"});}}val=parseInt($.curCSS($E[0],prop,true),10)||0;if(hidden){$E.css({display:"none"});if(visibility&&visibility!="hidden")$E.css({visibility:visibility});}return val;};var cssW=function(e,outerWidth){var $E;if(isStr(e)){e=str(e);$E=$Ps[e];}else
$E=$(e);if(outerWidth<=0)return 0;else if(!(outerWidth>0))outerWidth=isStr(e)?getPaneSize(e):$E.outerWidth();if(!$.boxModel)return outerWidth;else
return outerWidth
-cssNum($E,"paddingLeft")-cssNum($E,"paddingRight")-($.curCSS($E[0],"borderLeftStyle",true)=="none"?0:cssNum($E,"borderLeftWidth"))-($.curCSS($E[0],"borderRightStyle",true)=="none"?0:cssNum($E,"borderRightWidth"));};var cssH=function(e,outerHeight){var $E;if(isStr(e)){e=str(e);$E=$Ps[e];}else
$E=$(e);if(outerHeight<=0)return 0;else if(!(outerHeight>0))outerHeight=(isStr(e))?getPaneSize(e):$E.outerHeight();if(!$.boxModel)return outerHeight;else
return outerHeight
-cssNum($E,"paddingTop")-cssNum($E,"paddingBottom")-($.curCSS($E[0],"borderTopStyle",true)=="none"?0:cssNum($E,"borderTopWidth"))-($.curCSS($E[0],"borderBottomStyle",true)=="none"?0:cssNum($E,"borderBottomWidth"));};var cssSize=function(pane,outerSize){if(c[pane].dir=="horz")return cssH(pane,outerSize);else
return cssW(pane,outerSize);};var getPaneSize=function(pane,inclSpace){var
$P=$Ps[pane],o=options[pane],s=state[pane],oSp=(inclSpace?o.spacing_open:0),cSp=(inclSpace?o.spacing_closed:0);if(!$P||s.isHidden)return 0;else if(s.isClosed||(s.isSliding&&inclSpace))return cSp;else if(c[pane].dir=="horz")return $P.outerHeight()+oSp;else
return $P.outerWidth()+oSp;};var setPaneMinMaxSizes=function(pane){var
d=cDims,edge=c[pane].edge,dir=c[pane].dir,o=options[pane],s=state[pane],$P=$Ps[pane],$altPane=$Ps[altSide[pane]],paneSpacing=o.spacing_open,altPaneSpacing=options[altSide[pane]].spacing_open,altPaneSize=(!$altPane?0:(dir=="horz"?$altPane.outerHeight():$altPane.outerWidth())),containerSize=(dir=="horz"?d.innerHeight:d.innerWidth),limitSize=containerSize-paneSpacing-altPaneSize-altPaneSpacing,minSize=s.minSize||0,maxSize=Math.min(s.maxSize||9999,limitSize),minPos,maxPos;switch(pane){case"north":minPos=d.offsetTop+minSize;maxPos=d.offsetTop+maxSize;break;case"west":minPos=d.offsetLeft+minSize;maxPos=d.offsetLeft+maxSize;break;case"south":minPos=d.offsetTop+d.innerHeight-maxSize;maxPos=d.offsetTop+d.innerHeight-minSize;break;case"east":minPos=d.offsetLeft+d.innerWidth-maxSize;maxPos=d.offsetLeft+d.innerWidth-minSize;break;}$.extend(s,{minSize:minSize,maxSize:maxSize,minPosition:minPos,maxPosition:maxPos});};var getPaneDims=function(){var d={top:getPaneSize("north",true),bottom:getPaneSize("south",true),left:getPaneSize("west",true),right:getPaneSize("east",true),width:0,height:0};with(d){width=cDims.innerWidth-left-right;height=cDims.innerHeight-bottom-top;top+=cDims.top;bottom+=cDims.bottom;left+=cDims.left;right+=cDims.right;}return d;};var getElemDims=function($E){var
d={},e,b,p;$.each("Left,Right,Top,Bottom".split(","),function(){e=str(this);b=d["border"+e]=cssNum($E,"border"+e+"Width");p=d["padding"+e]=cssNum($E,"padding"+e);d["offset"+e]=b+p;if($E==$Container)d[e.toLowerCase()]=($.boxModel?p:0);});d.innerWidth=d.outerWidth=$E.outerWidth();d.innerHeight=d.outerHeight=$E.outerHeight();if($.boxModel){d.innerWidth-=(d.offsetLeft+d.offsetRight);d.innerHeight-=(d.offsetTop+d.offsetBottom);}return d;};var setTimer=function(pane,action,fn,ms){var
Layout=window.layout=window.layout||{},Timers=Layout.timers=Layout.timers||{},name="layout_"+state.id+"_"+pane+"_"+action;if(Timers[name])return;else Timers[name]=setTimeout(fn,ms);};var clearTimer=function(pane,action){var
Layout=window.layout=window.layout||{},Timers=Layout.timers=Layout.timers||{},name="layout_"+state.id+"_"+pane+"_"+action;if(Timers[name]){clearTimeout(Timers[name]);delete Timers[name];return true;}else
return false;};var create=function(){initOptions();initContainer();initPanes();initHandles();initResizable();sizeContent("all");if(options.scrollToBookmarkOnLoad)with(self.location)if(hash)replace(hash);initHotkeys();$(window).resize(function(){var timerID="timerLayout_"+state.id;if(window[timerID])clearTimeout(window[timerID]);window[timerID]=null;if(true||$.browser.msie)window[timerID]=setTimeout(resizeAll,100);else
resizeAll();});};var initContainer=function(){try{if($Container[0].tagName=="BODY"){$("html").css({height:"100%",overflow:"hidden"});$("body").css({position:"relative",height:"100%",overflow:"hidden",margin:0,padding:0,border:"none"});}else{var
CSS={overflow:"hidden"},p=$Container.css("position"),h=$Container.css("height");if(!$Container.hasClass("ui-layout-pane")){if(!p||"fixed,absolute,relative".indexOf(p)<0)CSS.position="relative";if(!h||h=="auto")CSS.height="100%";}$Container.css(CSS);}}catch(ex){}cDims=state.container=getElemDims($Container);};var initHotkeys=function(){$.each(c.borderPanes.split(","),function(i,pane){var o=options[pane];if(o.enableCursorHotkey||o.customHotkey){$(document).keydown(keyDown);return false;}});};var initOptions=function(){opts=transformData(opts);if(opts.effects){$.extend(effects,opts.effects);delete opts.effects;}$.each("name,scrollToBookmarkOnLoad".split(","),function(idx,key){if(opts[key]!==undefined)options[key]=opts[key];else if(opts.defaults[key]!==undefined){options[key]=opts.defaults[key];delete opts.defaults[key];}});$.each("paneSelector,resizerCursor,customHotkey".split(","),function(idx,key){delete opts.defaults[key];});$.extend(options.defaults,opts.defaults);c.center=$.extend(true,{},c.defaults,c.center);$.extend(options.center,opts.center);var o_Center=$.extend(true,{},options.defaults,opts.defaults,options.center);$.each("paneClass,contentSelector,contentIgnoreSelector,applyDefaultStyles,showOverflowOnHover".split(","),function(idx,key){options.center[key]=o_Center[key];});var defs=options.defaults;$.each(c.borderPanes.split(","),function(i,pane){c[pane]=$.extend(true,{},c.defaults,c[pane]);o=options[pane]=$.extend(true,{},options.defaults,options[pane],opts.defaults,opts[pane]);if(!o.paneClass)o.paneClass=defaults.paneClass;if(!o.resizerClass)o.resizerClass=defaults.resizerClass;if(!o.togglerClass)o.togglerClass=defaults.togglerClass;$.each(["_open","_close",""],function(i,n){var
sName="fxName"+n,sSpeed="fxSpeed"+n,sSettings="fxSettings"+n;o[sName]=opts[pane][sName]||opts[pane].fxName||opts.defaults[sName]||opts.defaults.fxName||o[sName]||o.fxName||defs[sName]||defs.fxName||"none";var fxName=o[sName];if(fxName=="none"||!$.effects||!$.effects[fxName]||(!effects[fxName]&&!o[sSettings]&&!o.fxSettings))fxName=o[sName]="none";var
fx=effects[fxName]||{},fx_all=fx.all||{},fx_pane=fx[pane]||{};o[sSettings]=$.extend({},fx_all,fx_pane,defs.fxSettings||{},defs[sSettings]||{},o.fxSettings,o[sSettings],opts.defaults.fxSettings,opts.defaults[sSettings]||{},opts[pane].fxSettings,opts[pane][sSettings]||{});o[sSpeed]=opts[pane][sSpeed]||opts[pane].fxSpeed||opts.defaults[sSpeed]||opts.defaults.fxSpeed||o[sSpeed]||o[sSettings].duration||o.fxSpeed||o.fxSettings.duration||defs.fxSpeed||defs.fxSettings.duration||fx_pane.duration||fx_all.duration||"normal";});});};var initPanes=function(){$.each(c.allPanes.split(","),function(){var
pane=str(this),o=options[pane],s=state[pane],fx=s.fx,dir=c[pane].dir,size=o.size=="auto"||isNaN(o.size)?0:o.size,minSize=o.minSize||1,maxSize=o.maxSize||9999,spacing=o.spacing_open||0,sel=o.paneSelector,isIE6=($.browser.msie&&$.browser.version<7),CSS={},$P,$C;$Cs[pane]=false;if(sel.substr(0,1)==="#")$P=$Ps[pane]=$Container.find(sel+":first");else{$P=$Ps[pane]=$Container.children(sel+":first");if(!$P.length)$P=$Ps[pane]=$Container.children("form:first").children(sel+":first");}if(!$P.length){$Ps[pane]=false;return true;}$P.attr("pane",pane).addClass(o.paneClass+" "+o.paneClass+"-"+pane);if(pane!="center"){s.isClosed=false;s.isSliding=false;s.isResizing=false;s.isHidden=false;s.noRoom=false;c[pane].pins=[];}CSS=$.extend({visibility:"visible",display:"block"},c.defaults.cssReq,c[pane].cssReq);if(o.applyDefaultStyles)$.extend(CSS,c.defaults.cssDef,c[pane].cssDef);$P.css(CSS);CSS={};switch(pane){case"north":CSS.top=cDims.top;CSS.left=cDims.left;CSS.right=cDims.right;break;case"south":CSS.bottom=cDims.bottom;CSS.left=cDims.left;CSS.right=cDims.right;break;case"west":CSS.left=cDims.left;break;case"east":CSS.right=cDims.right;break;case"center":}if(dir=="horz"){if(size===0||size=="auto"){$P.css({height:"auto"});size=$P.outerHeight();}size=max(size,minSize);size=min(size,maxSize);size=min(size,cDims.innerHeight-spacing);CSS.height=max(1,cssH(pane,size));s.size=size;s.maxSize=maxSize;s.minSize=max(minSize,size-CSS.height+1);$P.css(CSS);}else if(dir=="vert"){if(size===0||size=="auto"){$P.css({width:"auto",float:"left"});size=$P.outerWidth();$P.css({float:"none"});}size=max(size,minSize);size=min(size,maxSize);size=min(size,cDims.innerWidth-spacing);CSS.width=max(1,cssW(pane,size));s.size=size;s.maxSize=maxSize;s.minSize=max(minSize,size-CSS.width+1);$P.css(CSS);sizeMidPanes(pane,null,true);}else if(pane=="center"){$P.css(CSS);sizeMidPanes("center",null,true);}if(o.initClosed&&o.closable){$P.hide().addClass("closed");s.isClosed=true;}else if(o.initHidden||o.initClosed){hide(pane,true);s.isHidden=true;}else
$P.addClass("open");if(o.showOverflowOnHover)$P.hover(allowOverflow,resetOverflow);if(o.contentSelector){$C=$Cs[pane]=$P.children(o.contentSelector+":first");if(!$C.length){$Cs[pane]=false;return true;}$C.css(c.content.cssReq);if(o.applyDefaultStyles)$C.css(c.content.cssDef);$P.css({overflow:"hidden"});}});};var initHandles=function(){$.each(c.borderPanes.split(","),function(){var
pane=str(this),o=options[pane],s=state[pane],rClass=o.resizerClass,tClass=o.togglerClass,$P=$Ps[pane];$Rs[pane]=false;$Ts[pane]=false;if(!$P||(!o.closable&&!o.resizable))return;var
edge=c[pane].edge,isOpen=$P.is(":visible"),spacing=(isOpen?o.spacing_open:o.spacing_closed),_pane="-"+pane,_state=(isOpen?"-open":"-closed"),$R,$T;$R=$Rs[pane]=$("<span></span>");if(isOpen&&o.resizable);else if(!isOpen&&o.slidable)$R.attr("title",o.sliderTip).css("cursor",o.sliderCursor);$R.attr("id",(o.paneSelector.substr(0,1)=="#"?o.paneSelector.substr(1)+"-resizer":"")).attr("resizer",pane).css(c.resizers.cssReq).css(edge,cDims[edge]+getPaneSize(pane)).addClass(rClass+" "+rClass+_pane+" "+rClass+_state+" "+rClass+_pane+_state).appendTo($Container);if(o.applyDefaultStyles)$R.css(c.resizers.cssDef);if(o.closable){$T=$Ts[pane]=$("<div></div>");$T.attr("id",(o.paneSelector.substr(0,1)=="#"?o.paneSelector.substr(1)+"-toggler":"")).css(c.togglers.cssReq).attr("title",(isOpen?o.togglerTip_open:o.togglerTip_closed)).click(function(evt){toggle(pane);evt.stopPropagation();}).mouseover(function(evt){evt.stopPropagation();}).addClass(tClass+" "+tClass+_pane+" "+tClass+_state+" "+tClass+_pane+_state).appendTo($R);if(o.togglerContent_open)$("<span>"+o.togglerContent_open+"</span>").addClass("content content-open").css("display",s.isClosed?"none":"block").appendTo($T);if(o.togglerContent_closed)$("<span>"+o.togglerContent_closed+"</span>").addClass("content content-closed").css("display",s.isClosed?"block":"none").appendTo($T);if(o.applyDefaultStyles)$T.css(c.togglers.cssDef);if(!isOpen)bindStartSlidingEvent(pane,true);}});sizeHandles("all",true);};var initResizable=function(){var
draggingAvailable=(typeof $.fn.draggable=="function"),minPosition,maxPosition,edge;$.each(c.borderPanes.split(","),function(){var
pane=str(this),o=options[pane],s=state[pane];if(!draggingAvailable||!$Ps[pane]||!o.resizable){o.resizable=false;return true;}var
rClass=o.resizerClass,dragClass=rClass+"-drag",dragPaneClass=rClass+"-"+pane+"-drag",draggingClass=rClass+"-dragging",draggingPaneClass=rClass+"-"+pane+"-dragging",draggingClassSet=false,$P=$Ps[pane],$R=$Rs[pane];if(!s.isClosed)$R.attr("title",o.resizerTip).css("cursor",o.resizerCursor);$R.draggable({containment:$Container[0],axis:(c[pane].dir=="horz"?"y":"x"),delay:200,distance:1,helper:"clone",opacity:o.resizerDragOpacity,zIndex:c.zIndex.resizing,start:function(e,ui){if(false===execUserCallback(pane,o.onresize_start))return false;s.isResizing=true;clearTimer(pane,"closeSlider");$R.addClass(dragClass+" "+dragPaneClass);draggingClassSet=false;var resizerWidth=(pane=="east"||pane=="south"?o.spacing_open:0);setPaneMinMaxSizes(pane);s.minPosition-=resizerWidth;s.maxPosition-=resizerWidth;edge=(c[pane].dir=="horz"?"top":"left");$(o.maskIframesOnResize===true?"iframe":o.maskIframesOnResize).each(function(){$('<div class="ui-layout-mask"/>').css({background:"#fff",opacity:"0.001",zIndex:9,position:"absolute",width:this.offsetWidth+"px",height:this.offsetHeight+"px"}).css($(this).offset()).appendTo(this.parentNode);});},drag:function(e,ui){if(!draggingClassSet){$(".ui-draggable-dragging").addClass(draggingClass+" "+draggingPaneClass).children().css("visibility","hidden");draggingClassSet=true;if(s.isSliding)$Ps[pane].css("zIndex",c.zIndex.sliding);}if(ui.position[edge]<s.minPosition)ui.position[edge]=s.minPosition;else if(ui.position[edge]>s.maxPosition)ui.position[edge]=s.maxPosition;},stop:function(e,ui){var
dragPos=ui.position,resizerPos,newSize;$R.removeClass(dragClass+" "+dragPaneClass);switch(pane){case"north":resizerPos=dragPos.top;break;case"west":resizerPos=dragPos.left;break;case"south":resizerPos=cDims.outerHeight-dragPos.top-$R.outerHeight();break;case"east":resizerPos=cDims.outerWidth-dragPos.left-$R.outerWidth();break;}newSize=resizerPos-cDims[c[pane].edge];sizePane(pane,newSize);$("div.ui-layout-mask").remove();s.isResizing=false;}});});};var hide=function(pane,onInit){var
o=options[pane],s=state[pane],$P=$Ps[pane],$R=$Rs[pane];if(!$P||s.isHidden)return;if(false===execUserCallback(pane,o.onhide_start))return;s.isSliding=false;if($R)$R.hide();if(onInit||s.isClosed){s.isClosed=true;s.isHidden=true;$P.hide();sizeMidPanes(c[pane].dir=="horz"?"all":"center");execUserCallback(pane,o.onhide_end||o.onhide);}else{s.isHiding=true;close(pane,false);}};var show=function(pane,openPane){var
o=options[pane],s=state[pane],$P=$Ps[pane],$R=$Rs[pane];if(!$P||!s.isHidden)return;if(false===execUserCallback(pane,o.onshow_start))return;s.isSliding=false;s.isShowing=true;if($R&&o.spacing_open>0)$R.show();if(openPane===false)close(pane,true);else
open(pane);};var toggle=function(pane){var s=state[pane];if(s.isHidden)show(pane);else if(s.isClosed)open(pane);else
close(pane);};var close=function(pane,force,noAnimation){var
$P=$Ps[pane],$R=$Rs[pane],$T=$Ts[pane],o=options[pane],s=state[pane],doFX=!noAnimation&&!s.isClosed&&(o.fxName_close!="none"),edge=c[pane].edge,rClass=o.resizerClass,tClass=o.togglerClass,_pane="-"+pane,_open="-open",_sliding="-sliding",_closed="-closed",isShowing=s.isShowing,isHiding=s.isHiding;delete s.isShowing;delete s.isHiding;if(!$P||(!o.resizable&&!o.closable))return;else if(!force&&s.isClosed&&!isShowing)return;if(c.isLayoutBusy){setFlowCallback("close",pane,force);return;}if(!isShowing&&false===execUserCallback(pane,o.onclose_start))return;c[pane].isMoving=true;c.isLayoutBusy=true;s.isClosed=true;if(isHiding)s.isHidden=true;else if(isShowing)s.isHidden=false;syncPinBtns(pane,false);if(!s.isSliding)sizeMidPanes(c[pane].dir=="horz"?"all":"center");if($R){$R.css(edge,cDims[edge]).removeClass(rClass+_open+" "+rClass+_pane+_open).removeClass(rClass+_sliding+" "+rClass+_pane+_sliding).addClass(rClass+_closed+" "+rClass+_pane+_closed);if(o.resizable)$R.draggable("disable").css("cursor","default").attr("title","");if($T){$T.removeClass(tClass+_open+" "+tClass+_pane+_open).addClass(tClass+_closed+" "+tClass+_pane+_closed).attr("title",o.togglerTip_closed);}sizeHandles();}if(doFX){lockPaneForFX(pane,true);$P.hide(o.fxName_close,o.fxSettings_close,o.fxSpeed_close,function(){lockPaneForFX(pane,false);if(!s.isClosed)return;close_2();});}else{$P.hide();close_2();}function close_2(){bindStartSlidingEvent(pane,true);if(!isShowing)execUserCallback(pane,o.onclose_end||o.onclose);if(isShowing)execUserCallback(pane,o.onshow_end||o.onshow);if(isHiding)execUserCallback(pane,o.onhide_end||o.onhide);execFlowCallback(pane);}};var open=function(pane,slide,noAnimation){var
$P=$Ps[pane],$R=$Rs[pane],$T=$Ts[pane],o=options[pane],s=state[pane],doFX=!noAnimation&&s.isClosed&&(o.fxName_open!="none"),edge=c[pane].edge,rClass=o.resizerClass,tClass=o.togglerClass,_pane="-"+pane,_open="-open",_closed="-closed",_sliding="-sliding",isShowing=s.isShowing;delete s.isShowing;if(!$P||(!o.resizable&&!o.closable))return;else if(!s.isClosed&&!s.isSliding)return;if(s.isHidden&&!isShowing){show(pane,true);return;}if(c.isLayoutBusy){setFlowCallback("open",pane,slide);return;}if(false===execUserCallback(pane,o.onopen_start))return;c[pane].isMoving=true;c.isLayoutBusy=true;if(s.isSliding&&!slide)bindStopSlidingEvents(pane,false);s.isClosed=false;if(isShowing)s.isHidden=false;setPaneMinMaxSizes(pane);if(s.size>s.maxSize)$P.css(c[pane].sizeType,max(1,cssSize(pane,s.maxSize)));bindStartSlidingEvent(pane,false);if(doFX){lockPaneForFX(pane,true);$P.show(o.fxName_open,o.fxSettings_open,o.fxSpeed_open,function(){lockPaneForFX(pane,false);if(s.isClosed)return;open_2();});}else{$P.show();open_2();}function open_2(){if(!s.isSliding)sizeMidPanes(c[pane].dir=="vert"?"center":"all");if($R){$R.css(edge,cDims[edge]+getPaneSize(pane)).removeClass(rClass+_closed+" "+rClass+_pane+_closed).addClass(rClass+_open+" "+rClass+_pane+_open).addClass(!s.isSliding?"":rClass+_sliding+" "+rClass+_pane+_sliding);if(o.resizable)$R.draggable("enable").css("cursor",o.resizerCursor).attr("title",o.resizerTip);else
$R.css("cursor","default");if($T){$T.removeClass(tClass+_closed+" "+tClass+_pane+_closed).addClass(tClass+_open+" "+tClass+_pane+_open).attr("title",o.togglerTip_open);}sizeHandles("all");}sizeContent(pane);syncPinBtns(pane,!s.isSliding);execUserCallback(pane,o.onopen_end||o.onopen);if(isShowing)execUserCallback(pane,o.onshow_end||o.onshow);execFlowCallback(pane);}};var lockPaneForFX=function(pane,doLock){var $P=$Ps[pane];if(doLock){$P.css({zIndex:c.zIndex.animation});if(pane=="south")$P.css({top:cDims.top+cDims.innerHeight-$P.outerHeight()});else if(pane=="east")$P.css({left:cDims.left+cDims.innerWidth-$P.outerWidth()});}else{if(!state[pane].isSliding)$P.css({zIndex:c.zIndex.pane_normal});if(pane=="south")$P.css({top:"auto"});else if(pane=="east")$P.css({left:"auto"});}};var bindStartSlidingEvent=function(pane,enable){var
o=options[pane],$R=$Rs[pane],trigger=o.slideTrigger_open;if(!$R||!o.slidable)return;if(trigger!="click"&&trigger!="dblclick"&&trigger!="mouseover")trigger="click";$R
[enable?"bind":"unbind"](trigger,slideOpen).css("cursor",(enable?o.sliderCursor:"default")).attr("title",(enable?o.sliderTip:""));};var bindStopSlidingEvents=function(pane,enable){var
o=options[pane],s=state[pane],trigger=o.slideTrigger_close,action=(enable?"bind":"unbind"),$P=$Ps[pane],$R=$Rs[pane];s.isSliding=enable;clearTimer(pane,"closeSlider");$P.css({zIndex:(enable?c.zIndex.sliding:c.zIndex.pane_normal)});$R.css({zIndex:(enable?c.zIndex.sliding:c.zIndex.resizer_normal)});if(trigger!="click"&&trigger!="mouseout")trigger="mouseout";if(enable){$P.bind(trigger,slideClosed);$R.bind(trigger,slideClosed);if(trigger="mouseout"){$P.bind("mouseover",cancelMouseOut);$R.bind("mouseover",cancelMouseOut);}}else{$P.unbind(trigger);$R.unbind(trigger);if(trigger="mouseout"){$P.unbind("mouseover");$R.unbind("mouseover");clearTimer(pane,"closeSlider");}}function cancelMouseOut(evt){clearTimer(pane,"closeSlider");evt.stopPropagation();}};var slideOpen=function(){var pane=$(this).attr("resizer");if(state[pane].isClosed){bindStopSlidingEvents(pane,true);open(pane,true);}};var slideClosed=function(){var
$E=$(this),pane=$E.attr("pane")||$E.attr("resizer"),o=options[pane],s=state[pane];if(s.isClosed||s.isResizing)return;else if(o.slideTrigger_close=="click")close_NOW();else
setTimer(pane,"closeSlider",close_NOW,300);function close_NOW(){bindStopSlidingEvents(pane,false);if(!s.isClosed)close(pane);}};var sizePane=function(pane,size){var
edge=c[pane].edge,dir=c[pane].dir,o=options[pane],s=state[pane],$P=$Ps[pane],$R=$Rs[pane];setPaneMinMaxSizes(pane);s.minSize=max(s.minSize,o.minSize);if(o.maxSize>0)s.maxSize=min(s.maxSize,o.maxSize);size=max(size,s.minSize);size=min(size,s.maxSize);s.size=size;$R.css(edge,size+cDims[edge]);$P.css(c[pane].sizeType,max(1,cssSize(pane,size)));if(!s.isSliding)sizeMidPanes(dir=="horz"?"all":"center");sizeHandles();sizeContent(pane);execUserCallback(pane,o.onresize_end||o.onresize);};var sizeMidPanes=function(panes,overrideDims,onInit){if(!panes||panes=="all")panes="east,west,center";var d=getPaneDims();if(overrideDims)$.extend(d,overrideDims);$.each(panes.split(","),function(){if(!$Ps[this])return;var
pane=str(this),o=options[pane],s=state[pane],$P=$Ps[pane],$R=$Rs[pane],hasRoom=true,CSS={};if(pane=="center"){d=getPaneDims();CSS=$.extend({},d);CSS.width=max(1,cssW(pane,CSS.width));CSS.height=max(1,cssH(pane,CSS.height));hasRoom=(CSS.width>1&&CSS.height>1);if($.browser.msie&&(!$.boxModel||$.browser.version<7)){if($Ps.north)$Ps.north.css({width:cssW($Ps.north,cDims.innerWidth)});if($Ps.south)$Ps.south.css({width:cssW($Ps.south,cDims.innerWidth)});}}else{CSS.top=d.top;CSS.bottom=d.bottom;CSS.height=max(1,cssH(pane,d.height));hasRoom=(CSS.height>1);}if(hasRoom){$P.css(CSS);if(s.noRoom){s.noRoom=false;if(s.isHidden)return;else show(pane,!s.isClosed);}if(!onInit){sizeContent(pane);execUserCallback(pane,o.onresize_end||o.onresize);}}else if(!s.noRoom){s.noRoom=true;if(s.isHidden)return;if(onInit){$P.hide();if($R)$R.hide();}else hide(pane);}});};var sizeContent=function(panes){if(!panes||panes=="all")panes=c.allPanes;$.each(panes.split(","),function(){if(!$Cs[this])return;var
pane=str(this),ignore=options[pane].contentIgnoreSelector,$P=$Ps[pane],$C=$Cs[pane],e_C=$C[0],height=cssH($P);;$P.children().each(function(){if(this==e_C)return;var $E=$(this);if(!ignore||!$E.is(ignore))height-=$E.outerHeight();});if(height>0)height=cssH($C,height);if(height<1)$C.hide();else
$C.css({height:height}).show();});};var sizeHandles=function(panes,onInit){if(!panes||panes=="all")panes=c.borderPanes;$.each(panes.split(","),function(){var
pane=str(this),o=options[pane],s=state[pane],$P=$Ps[pane],$R=$Rs[pane],$T=$Ts[pane];if(!$P||!$R||(!o.resizable&&!o.closable))return;var
dir=c[pane].dir,_state=(s.isClosed?"_closed":"_open"),spacing=o["spacing"+_state],togAlign=o["togglerAlign"+_state],togLen=o["togglerLength"+_state],paneLen,offset,CSS={};if(spacing==0){$R.hide();return;}else if(!s.noRoom&&!s.isHidden)$R.show();if(dir=="horz"){paneLen=$P.outerWidth();$R.css({width:max(1,cssW($R,paneLen)),height:max(1,cssH($R,spacing)),left:cssNum($P,"left")});}else{paneLen=$P.outerHeight();$R.css({height:max(1,cssH($R,paneLen)),width:max(1,cssW($R,spacing)),top:cDims.top+getPaneSize("north",true)});}if($T){if(togLen==0||(s.isSliding&&o.hideTogglerOnSlide)){$T.hide();return;}else
$T.show();if(!(togLen>0)||togLen=="100%"||togLen>paneLen){togLen=paneLen;offset=0;}else{if(typeof togAlign=="string"){switch(togAlign){case"top":case"left":offset=0;break;case"bottom":case"right":offset=paneLen-togLen;break;case"middle":case"center":default:offset=Math.floor((paneLen-togLen)/2);}}else{var x=parseInt(togAlign);if(togAlign>=0)offset=x;else offset=paneLen-togLen+x;}}var
$TC_o=(o.togglerContent_open?$T.children(".content-open"):false),$TC_c=(o.togglerContent_closed?$T.children(".content-closed"):false),$TC=(s.isClosed?$TC_c:$TC_o);if($TC_o)$TC_o.css("display",s.isClosed?"none":"block");if($TC_c)$TC_c.css("display",s.isClosed?"block":"none");if(dir=="horz"){var width=cssW($T,togLen);$T.css({width:max(0,width),height:max(1,cssH($T,spacing)),left:offset});if($TC)$TC.css("marginLeft",Math.floor((width-$TC.outerWidth())/2));}else{var height=cssH($T,togLen);$T.css({height:max(0,height),width:max(1,cssW($T,spacing)),top:offset});if($TC)$TC.css("marginTop",Math.floor((height-$TC.outerHeight())/2));}}if(onInit&&o.initHidden){$R.hide();if($T)$T.hide();}});};var resizeAll=function(){var
oldW=cDims.innerWidth,oldH=cDims.innerHeight;cDims=state.container=getElemDims($Container);var
checkH=(cDims.innerHeight<oldH),checkW=(cDims.innerWidth<oldW),s,dir;if(checkH||checkW)$.each(["south","north","east","west"],function(i,pane){s=state[pane];dir=c[pane].dir;if(!s.isClosed&&((checkH&&dir=="horz")||(checkW&&dir=="vert"))){setPaneMinMaxSizes(pane);if(s.size>s.maxSize)sizePane(pane,s.maxSize);}});sizeMidPanes("all");sizeHandles("all");};function keyDown(evt){if(!evt)return true;var code=evt.keyCode;if(code<33)return true;var
PANE={38:"north",40:"south",37:"west",39:"east"},isCursorKey=(code>=37&&code<=40),ALT=evt.altKey,SHIFT=evt.shiftKey,CTRL=evt.ctrlKey,pane=false,s,o,k,m,el;if(!CTRL&&!SHIFT)return true;else if(isCursorKey&&options[PANE[code]].enableCursorHotkey)pane=PANE[code];else
$.each(c.borderPanes.split(","),function(i,p){o=options[p];k=o.customHotkey;m=o.customHotkeyModifier;if((SHIFT&&m=="SHIFT")||(CTRL&&m=="CTRL")||(CTRL&&SHIFT)){if(k&&code==(isNaN(k)||k<=9?k.toUpperCase().charCodeAt(0):k)){pane=p;return false;}}});if(!pane)return true;o=options[pane];s=state[pane];if(!o.enableCursorHotkey||s.isHidden||!$Ps[pane])return true;el=evt.target||evt.srcElement;if(el&&SHIFT&&isCursorKey&&(el.tagName=="TEXTAREA"||(el.tagName=="INPUT"&&(code==37||code==39))))return true;toggle(pane);evt.stopPropagation();evt.returnValue=false;return false;};function allowOverflow(elem){if(this&&this.tagName)elem=this;var $P;if(typeof elem=="string")$P=$Ps[elem];else{if($(elem).attr("pane"))$P=$(elem);else $P=$(elem).parents("div[pane]:first");}if(!$P.length)return;var
pane=$P.attr("pane"),s=state[pane];if(s.cssSaved)resetOverflow(pane);if(s.isSliding||s.isResizing||s.isClosed){s.cssSaved=false;return;}var
newCSS={zIndex:(c.zIndex.pane_normal+1)},curCSS={},of=$P.css("overflow"),ofX=$P.css("overflowX"),ofY=$P.css("overflowY");if(of!="visible"){curCSS.overflow=of;newCSS.overflow="visible";}if(ofX&&ofX!="visible"&&ofX!="auto"){curCSS.overflowX=ofX;newCSS.overflowX="visible";}if(ofY&&ofY!="visible"&&ofY!="auto"){curCSS.overflowY=ofX;newCSS.overflowY="visible";}s.cssSaved=curCSS;$P.css(newCSS);$.each(c.allPanes.split(","),function(i,p){if(p!=pane)resetOverflow(p);});};function resetOverflow(elem){if(this&&this.tagName)elem=this;var $P;if(typeof elem=="string")$P=$Ps[elem];else{if($(elem).hasClass("ui-layout-pane"))$P=$(elem);else $P=$(elem).parents("div[pane]:first");}if(!$P.length)return;var
pane=$P.attr("pane"),s=state[pane],CSS=s.cssSaved||{};if(!s.isSliding&&!s.isResizing)$P.css("zIndex",c.zIndex.pane_normal);$P.css(CSS);s.cssSaved=false;};function getBtn(selector,pane,action){var
$E=$(selector),err="Error Adding Button \n\nInvalid ";if(!$E.length)alert(err+"selector: "+selector);else if(c.borderPanes.indexOf(pane)==-1)alert(err+"pane: "+pane);else{var btn=options[pane].buttonClass+"-"+action;$E.addClass(btn+" "+btn+"-"+pane);return $E;}return false;};function addToggleBtn(selector,pane){var $E=getBtn(selector,pane,"toggle");if($E)$E.attr("title",state[pane].isClosed?"Open":"Close").click(function(evt){toggle(pane);evt.stopPropagation();});};function addOpenBtn(selector,pane){var $E=getBtn(selector,pane,"open");if($E)$E.attr("title","Open").click(function(evt){open(pane);evt.stopPropagation();});};function addCloseBtn(selector,pane){var $E=getBtn(selector,pane,"close");if($E)$E.attr("title","Close").click(function(evt){close(pane);evt.stopPropagation();});};function addPinBtn(selector,pane){var $E=getBtn(selector,pane,"pin");if($E){var s=state[pane];$E.click(function(evt){setPinState($(this),pane,(s.isSliding||s.isClosed));if(s.isSliding||s.isClosed)open(pane);else close(pane);evt.stopPropagation();});setPinState($E,pane,(!s.isClosed&&!s.isSliding));c[pane].pins.push(selector);}};function syncPinBtns(pane,doPin){$.each(c[pane].pins,function(i,selector){setPinState($(selector),pane,doPin);});};function setPinState($Pin,pane,doPin){var updown=$Pin.attr("pin");if(updown&&doPin==(updown=="down"))return;var
root=options[pane].buttonClass,class1=root+"-pin",class2=class1+"-"+pane,UP1=class1+"-up",UP2=class2+"-up",DN1=class1+"-down",DN2=class2+"-down";$Pin.attr("pin",doPin?"down":"up").attr("title",doPin?"Un-Pin":"Pin").removeClass(doPin?UP1:DN1).removeClass(doPin?UP2:DN2).addClass(doPin?DN1:UP1).addClass(doPin?DN2:UP2);};var
$Container=$(this).css({overflow:"hidden"}),$Ps={},$Cs={},$Rs={},$Ts={},c=config,cDims=state.container;create();return{options:options,state:state,panes:$Ps,toggle:toggle,open:open,close:close,hide:hide,show:show,resizeContent:sizeContent,sizePane:sizePane,resizeAll:resizeAll,addToggleBtn:addToggleBtn,addOpenBtn:addOpenBtn,addCloseBtn:addCloseBtn,addPinBtn:addPinBtn,allowOverflow:allowOverflow,resetOverflow:resetOverflow,cssWidth:cssW,cssHeight:cssH};}})(jQuery);
/**
 * TableDnD plug-in for JQuery, allows you to drag and drop table rows
 * You can set up various options to control how the system will work
 * Copyright (c) Denis Howlett <denish@isocra.com>
 * Licensed like jQuery, see http://docs.jquery.com/License.
 *
 * Configuration options:
 * 
 * onDragStyle
 *     This is the style that is assigned to the row during drag. There are limitations to the styles that can be
 *     associated with a row (such as you can't assign a border--well you can, but it won't be
 *     displayed). (So instead consider using onDragClass.) The CSS style to apply is specified as
 *     a map (as used in the jQuery css(...) function).
 * onDropStyle
 *     This is the style that is assigned to the row when it is dropped. As for onDragStyle, there are limitations
 *     to what you can do. Also this replaces the original style, so again consider using onDragClass which
 *     is simply added and then removed on drop.
 * onDragClass
 *     This class is added for the duration of the drag and then removed when the row is dropped. It is more
 *     flexible than using onDragStyle since it can be inherited by the row cells and other content. The default
 *     is class is tDnD_whileDrag. So to use the default, simply customise this CSS class in your
 *     stylesheet.
 * onDrop
 *     Pass a function that will be called when the row is dropped. The function takes 2 parameters: the table
 *     and the row that was dropped. You can work out the new order of the rows by using
 *     table.rows.
 * onDragStart
 *     Pass a function that will be called when the user starts dragging. The function takes 2 parameters: the
 *     table and the row which the user has started to drag.
 * onAllowDrop
 *     Pass a function that will be called as a row is over another row. If the function returns true, allow 
 *     dropping on that row, otherwise not. The function takes 2 parameters: the dragged row and the row under
 *     the cursor. It returns a boolean: true allows the drop, false doesn't allow it.
 * scrollAmount
 *     This is the number of pixels to scroll if the user moves the mouse cursor to the top or bottom of the
 *     window. The page should automatically scroll up or down as appropriate (tested in IE6, IE7, Safari, FF2,
 *     FF3 beta
 * dragHandle
 *     This is the name of a class that you assign to one or more cells in each row that is draggable. If you
 *     specify this class, then you are responsible for setting cursor: move in the CSS and only these cells
 *     will have the drag behaviour. If you do not specify a dragHandle, then you get the old behaviour where
 *     the whole row is draggable.
 * 
 * Other ways to control behaviour:
 *
 * Add class="nodrop" to any rows for which you don't want to allow dropping, and class="nodrag" to any rows
 * that you don't want to be draggable.
 *
 * Inside the onDrop method you can also call $.tableDnD.serialize() this returns a string of the form
 * <tableID>[]=<rowID1>&<tableID>[]=<rowID2> so that you can send this back to the server. The table must have
 * an ID as must all the rows.
 *
 * Other methods:
 *
 * $("...").tableDnDUpdate() 
 * Will update all the matching tables, that is it will reapply the mousedown method to the rows (or handle cells).
 * This is useful if you have updated the table rows using Ajax and you want to make the table draggable again.
 * The table maintains the original configuration (so you don't have to specify it again).
 *
 * $("...").tableDnDSerialize()
 * Will serialize and return the serialized string as above, but for each of the matching tables--so it can be
 * called from anywhere and isn't dependent on the currentTable being set up correctly before calling
 *
 * Known problems:
 * - Auto-scoll has some problems with IE7  (it scrolls even when it shouldn't), work-around: set scrollAmount to 0
 * 
 * Version 0.2: 2008-02-20 First public version
 * Version 0.3: 2008-02-07 Added onDragStart option
 *                         Made the scroll amount configurable (default is 5 as before)
 * Version 0.4: 2008-03-15 Changed the noDrag/noDrop attributes to nodrag/nodrop classes
 *                         Added onAllowDrop to control dropping
 *                         Fixed a bug which meant that you couldn't set the scroll amount in both directions
 *                         Added serialize method
 * Version 0.5: 2008-05-16 Changed so that if you specify a dragHandle class it doesn't make the whole row
 *                         draggable
 *                         Improved the serialize method to use a default (and settable) regular expression.
 *                         Added tableDnDupate() and tableDnDSerialize() to be called when you are outside the table
 */

jQuery.tableDnD = {
    /** Keep hold of the current table being dragged */
    currentTable : null,
    /** Keep hold of the current drag object if any */
    dragObject: null,
    /** The current mouse offset */
    mouseOffset: null,
    /** Remember the old value of Y so that we don't do too much processing */
    oldY: 0,

    /** Actually build the structure */
    build: function(options) {
        // Set up the defaults if any

        this.each(function() {
            // This is bound to each matching table, set up the defaults and override with user options
            this.tableDnDConfig = jQuery.extend({
                onDragStyle: null,
                onDropStyle: null,
				// Add in the default class for whileDragging
				onDragClass: "tDnD_whileDrag",
                onDrop: null,
                onDragStart: null,
                scrollAmount: 5,
				serializeRegexp: /[^\-]*$/, // The regular expression to use to trim row IDs
				serializeParamName: null, // If you want to specify another parameter name instead of the table ID
                dragHandle: null // If you give the name of a class here, then only Cells with this class will be draggable
            }, options || {});
            // Now make the rows draggable
            jQuery.tableDnD.makeDraggable(this);
        });

        // Now we need to capture the mouse up and mouse move event
        // We can use bind so that we don't interfere with other event handlers
        jQuery(document)
            .bind('mousemove', jQuery.tableDnD.mousemove)
            .bind('mouseup', jQuery.tableDnD.mouseup);

        // Don't break the chain
        return this;
    },

    /** This function makes all the rows on the table draggable apart from those marked as "NoDrag" */
    makeDraggable: function(table) {
        var config = table.tableDnDConfig;
		if (table.tableDnDConfig.dragHandle) {
			// We only need to add the event to the specified cells
			var cells = jQuery("td."+table.tableDnDConfig.dragHandle, table);
			cells.each(function() {
				// The cell is bound to "this"
                jQuery(this).mousedown(function(ev) {
                    jQuery.tableDnD.dragObject = this.parentNode;
                    jQuery.tableDnD.currentTable = table;
                    jQuery.tableDnD.mouseOffset = jQuery.tableDnD.getMouseOffset(this, ev);
                    if (config.onDragStart) {
                        // Call the onDrop method if there is one
                        config.onDragStart(table, this);
                    }
                    return false;
                });
			})
		} else {
			// For backwards compatibility, we add the event to the whole row
	        var rows = jQuery("tr", table); // get all the rows as a wrapped set
	        rows.each(function() {
				// Iterate through each row, the row is bound to "this"
				var row = jQuery(this);
				if (! row.hasClass("nodrag")) {
	                row.mousedown(function(ev) {
	                    if (ev.target.tagName == "TD") {
	                        jQuery.tableDnD.dragObject = this;
	                        jQuery.tableDnD.currentTable = table;
	                        jQuery.tableDnD.mouseOffset = jQuery.tableDnD.getMouseOffset(this, ev);
	                        if (config.onDragStart) {
	                            // Call the onDrop method if there is one
	                            config.onDragStart(table, this);
	                        }
	                        return false;
	                    }
	                }).css("cursor", "move"); // Store the tableDnD object
				}
			});
		}
	},

	updateTables: function() {
		this.each(function() {
			// this is now bound to each matching table
			if (this.tableDnDConfig) {
				jQuery.tableDnD.makeDraggable(this);
			}
		})
	},

    /** Get the mouse coordinates from the event (allowing for browser differences) */
    mouseCoords: function(ev){
        if(ev.pageX || ev.pageY){
            return {x:ev.pageX, y:ev.pageY};
        }
        return {
            x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
            y:ev.clientY + document.body.scrollTop  - document.body.clientTop
        };
    },

    /** Given a target element and a mouse event, get the mouse offset from that element.
        To do this we need the element's position and the mouse position */
    getMouseOffset: function(target, ev) {
        ev = ev || window.event;

        var docPos    = this.getPosition(target);
        var mousePos  = this.mouseCoords(ev);
        return {x:mousePos.x - docPos.x, y:mousePos.y - docPos.y};
    },

    /** Get the position of an element by going up the DOM tree and adding up all the offsets */
    getPosition: function(e){
        var left = 0;
        var top  = 0;
        /** Safari fix -- thanks to Luis Chato for this! */
        if (e.offsetHeight == 0) {
            /** Safari 2 doesn't correctly grab the offsetTop of a table row
            this is detailed here:
            http://jacob.peargrove.com/blog/2006/technical/table-row-offsettop-bug-in-safari/
            the solution is likewise noted there, grab the offset of a table cell in the row - the firstChild.
            note that firefox will return a text node as a first child, so designing a more thorough
            solution may need to take that into account, for now this seems to work in firefox, safari, ie */
            e = e.firstChild; // a table cell
        }
		if (e && e.offsetParent) {
        	while (e.offsetParent){
            	left += e.offsetLeft;
            	top  += e.offsetTop;
            	e     = e.offsetParent;
        	}

        	left += e.offsetLeft;
        	top  += e.offsetTop;
        }

        return {x:left, y:top};
    },

    mousemove: function(ev) {
        if (jQuery.tableDnD.dragObject == null) {
            return;
        }

        var dragObj = jQuery(jQuery.tableDnD.dragObject);
        var config = jQuery.tableDnD.currentTable.tableDnDConfig;
        var mousePos = jQuery.tableDnD.mouseCoords(ev);
        var y = mousePos.y - jQuery.tableDnD.mouseOffset.y;
        //auto scroll the window
	    var yOffset = window.pageYOffset;
	 	if (document.all) {
	        // Windows version
	        //yOffset=document.body.scrollTop;
	        if (typeof document.compatMode != 'undefined' &&
	             document.compatMode != 'BackCompat') {
	           yOffset = document.documentElement.scrollTop;
	        }
	        else if (typeof document.body != 'undefined') {
	           yOffset=document.body.scrollTop;
	        }

	    }
		    
		if (mousePos.y-yOffset < config.scrollAmount) {
	    	window.scrollBy(0, -config.scrollAmount);
	    } else {
            var windowHeight = window.innerHeight ? window.innerHeight
                    : document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight;
            if (windowHeight-(mousePos.y-yOffset) < config.scrollAmount) {
                window.scrollBy(0, config.scrollAmount);
            }
        }


        if (y != jQuery.tableDnD.oldY) {
            // work out if we're going up or down...
            var movingDown = y > jQuery.tableDnD.oldY;
            // update the old value
            jQuery.tableDnD.oldY = y;
            // update the style to show we're dragging
			if (config.onDragClass) {
				dragObj.addClass(config.onDragClass);
			} else {
	            dragObj.css(config.onDragStyle);
			}
            // If we're over a row then move the dragged row to there so that the user sees the
            // effect dynamically
            var currentRow = jQuery.tableDnD.findDropTargetRow(dragObj, y);
            if (currentRow) {
                // TODO worry about what happens when there are multiple TBODIES
                if (movingDown && jQuery.tableDnD.dragObject != currentRow) {
                    jQuery.tableDnD.dragObject.parentNode.insertBefore(jQuery.tableDnD.dragObject, currentRow.nextSibling);
                } else if (! movingDown && jQuery.tableDnD.dragObject != currentRow) {
                    jQuery.tableDnD.dragObject.parentNode.insertBefore(jQuery.tableDnD.dragObject, currentRow);
                }
            }
        }

        return false;
    },

    /** We're only worried about the y position really, because we can only move rows up and down */
    findDropTargetRow: function(draggedRow, y) {
        var rows = jQuery.tableDnD.currentTable.rows;
        for (var i=0; i<rows.length; i++) {
            var row = rows[i];
            var rowY    = this.getPosition(row).y;
            var rowHeight = parseInt(row.offsetHeight)/2;
            if (row.offsetHeight == 0) {
                rowY = this.getPosition(row.firstChild).y;
                rowHeight = parseInt(row.firstChild.offsetHeight)/2;
            }
            // Because we always have to insert before, we need to offset the height a bit
            if ((y > rowY - rowHeight) && (y < (rowY + rowHeight))) {
                // that's the row we're over
				// If it's the same as the current row, ignore it
				if (row == draggedRow) {return null;}
                var config = jQuery.tableDnD.currentTable.tableDnDConfig;
                if (config.onAllowDrop) {
                    if (config.onAllowDrop(draggedRow, row)) {
                        return row;
                    } else {
                        return null;
                    }
                } else {
					// If a row has nodrop class, then don't allow dropping (inspired by John Tarr and Famic)
                    var nodrop = jQuery(row).hasClass("nodrop");
                    if (! nodrop) {
                        return row;
                    } else {
                        return null;
                    }
                }
                return row;
            }
        }
        return null;
    },

    mouseup: function(e) {
        if (jQuery.tableDnD.currentTable && jQuery.tableDnD.dragObject) {
            var droppedRow = jQuery.tableDnD.dragObject;
            var config = jQuery.tableDnD.currentTable.tableDnDConfig;
            // If we have a dragObject, then we need to release it,
            // The row will already have been moved to the right place so we just reset stuff
			if (config.onDragClass) {
	            jQuery(droppedRow).removeClass(config.onDragClass);
			} else {
	            jQuery(droppedRow).css(config.onDropStyle);
			}
            jQuery.tableDnD.dragObject   = null;
            if (config.onDrop) {
                // Call the onDrop method if there is one
                config.onDrop(jQuery.tableDnD.currentTable, droppedRow);
            }
            jQuery.tableDnD.currentTable = null; // let go of the table too
        }
    },

    serialize: function() {
        if (jQuery.tableDnD.currentTable) {
            return jQuery.tableDnD.serializeTable(jQuery.tableDnD.currentTable);
        } else {
            return "Error: No Table id set, you need to set an id on your table and every row";
        }
    },

	serializeTable: function(table) {
        var result = "";
        var tableId = table.id;
        var rows = table.rows;
        for (var i=0; i<rows.length; i++) {
            if (result.length > 0) result += "&";
            var rowId = rows[i].id;
            if (rowId && rowId && table.tableDnDConfig && table.tableDnDConfig.serializeRegexp) {
                rowId = rowId.match(table.tableDnDConfig.serializeRegexp)[0];
            }

            result += tableId + '[]=' + rowId;
        }
        return result;
	},

	serializeTables: function() {
        var result = "";
        this.each(function() {
			// this is now bound to each matching table
			result += jQuery.tableDnD.serializeTable(this);
		});
        return result;
    }

}

jQuery.fn.extend(
	{
		tableDnD : jQuery.tableDnD.build,
		tableDnDUpdate : jQuery.tableDnD.updateTables,
		tableDnDSerialize: jQuery.tableDnD.serializeTables
	}
);
/*
 * jQuery UI Multiselect
 *
 * Authors:
 *  Michael Aufreiter (quasipartikel.at)
 *  Yanick Rochon (yanick.rochon[at]gmail[dot]com)
 * 
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * 
 * http://www.quasipartikel.at/multiselect/
 *
 * 
 * Depends:
 *	ui.core.js
 *	ui.sortable.js
 *
 * Optional:
 * localization (http://plugins.jquery.com/project/localisation)
 * scrollTo (http://plugins.jquery.com/project/ScrollTo)
 * 
 * Todo:
 *  Make batch actions faster
 *  Implement dynamic insertion through remote calls
 */



(function($) {

$.widget("ui.multiselect", {
	_init: function() {
		this.element.hide();
		this.id = this.element.attr("id");
		this.container = $('<div class="ui-multiselect ui-helper-clearfix ui-widget"></div>').insertAfter(this.element);
		this.count = 0; // number of currently selected options
		this.selectedContainer = $('<div class="selected"></div>').appendTo(this.container);
		this.availableContainer = $('<div class="available"></div>').appendTo(this.container);
		this.selectedActions = $('<div class="actions ui-widget-header ui-helper-clearfix"><span class="count">0 '+$.ui.multiselect.locale.itemsCount+'</span><a href="#" class="remove-all">'+$.ui.multiselect.locale.removeAll+'</a></div>').appendTo(this.selectedContainer);
		this.availableActions = $('<div class="actions ui-widget-header ui-helper-clearfix"><input type="text" class="search empty ui-widget-content ui-corner-all"/><a href="#" class="add-all">'+$.ui.multiselect.locale.addAll+'</a></div>').appendTo(this.availableContainer);
		this.selectedList = $('<ul class="selected connected-list"><li class="ui-helper-hidden-accessible"></li></ul>').bind('selectstart', function(){return false;}).appendTo(this.selectedContainer);
		this.availableList = $('<ul class="available connected-list"><li class="ui-helper-hidden-accessible"></li></ul>').bind('selectstart', function(){return false;}).appendTo(this.availableContainer);
		
		var that = this;

		// set dimensions
		this.container.width(this.element.width()+1);
		this.selectedContainer.width(Math.floor(this.element.width()*this.options.dividerLocation));
		this.availableContainer.width(Math.floor(this.element.width()*(1-this.options.dividerLocation)));

		// fix list height to match <option> depending on their individual header's heights
		this.selectedList.height(Math.max(this.element.height()-this.selectedActions.height(),1));
		this.availableList.height(Math.max(this.element.height()-this.availableActions.height(),1));
		
		if ( !this.options.animated ) {
			this.options.show = 'show';
			this.options.hide = 'hide';
		}
		
		// init lists
		this._populateLists(this.element.find('option'));
		
		// make selection sortable
		if (this.options.sortable) {
			$("ul.selected").sortable({
				placeholder: 'ui-state-highlight',
				axis: 'y',
				update: function(event, ui) {
					// apply the new sort order to the original selectbox
					that.selectedList.find('li').each(function() {
						if ($(this).data('optionLink'))
							$(this).data('optionLink').remove().appendTo(that.element);
					});
				},
				receive: function(event, ui) {
					ui.item.data('optionLink').attr('selected', true);
					// increment count
					that.count += 1;
					that._updateCount();
					// workaround, because there's no way to reference 
					// the new element, see http://dev.jqueryui.com/ticket/4303
					that.selectedList.children('.ui-draggable').each(function() {
						$(this).removeClass('ui-draggable');
						$(this).data('optionLink', ui.item.data('optionLink'));
						$(this).data('idx', ui.item.data('idx'));
						that._applyItemState($(this), true);
					});
			
					// workaround according to http://dev.jqueryui.com/ticket/4088
					setTimeout(function() { ui.item.remove(); }, 1);
				}
			});
		}
		
		// set up livesearch
		if (this.options.searchable) {
			this._registerSearchEvents(this.availableContainer.find('input.search'));
		} else {
			$('.search').hide();
		}
		
		// batch actions
		$(".remove-all").click(function() {
			that._populateLists(that.element.find('option').removeAttr('selected'));
			return false;
		});
		$(".add-all").click(function() {
			that._populateLists(that.element.find('option').attr('selected', 'selected'));
			return false;
		});
	},
	destroy: function() {
		this.element.show();
		this.container.remove();

		$.widget.prototype.destroy.apply(this, arguments);
	},
	_populateLists: function(options) {
		this.selectedList.children('.ui-element').remove();
		this.availableList.children('.ui-element').remove();
		this.count = 0;

		var that = this;
		var items = $(options.map(function(i) {
	      var item = that._getOptionNode(this).appendTo(this.selected ? that.selectedList : that.availableList).show();

			if (this.selected) that.count += 1;
			that._applyItemState(item, this.selected);
			item.data('idx', i);
			return item[0];
    }));
		
		// update count
		this._updateCount();
  },
	_updateCount: function() {
		this.selectedContainer.find('span.count').text(this.count+" "+$.ui.multiselect.locale.itemsCount);
	},
	_getOptionNode: function(option) {
		option = $(option);
		var node = $('<li class="ui-state-default ui-element" title="'+option.text()+'"><span class="ui-icon"/>'+option.text()+'<a href="#" class="action"><span class="ui-corner-all ui-icon"/></a></li>').hide();
		node.data('optionLink', option);
		return node;
	},
	// clones an item with associated data
	// didn't find a smarter away around this
	_cloneWithData: function(clonee) {
		var clone = clonee.clone();
		clone.data('optionLink', clonee.data('optionLink'));
		clone.data('idx', clonee.data('idx'));
		return clone;
	},
	_setSelected: function(item, selected) {
		item.data('optionLink').attr('selected', selected);

		if (selected) {
			var selectedItem = this._cloneWithData(item);
			item[this.options.hide](this.options.animated, function() { $(this).remove(); });
			selectedItem.appendTo(this.selectedList).hide()[this.options.show](this.options.animated);
			
			this._applyItemState(selectedItem, true);
			return selectedItem;
		} else {
			
			// look for successor based on initial option index
			var items = this.availableList.find('li'), comparator = this.options.nodeComparator;
			var succ = null, i = item.data('idx'), direction = comparator(item, $(items[i]));

			// TODO: test needed for dynamic list populating
			if ( direction ) {
				while (i>=0 && i<items.length) {
					direction > 0 ? i++ : i--;
					if ( direction != comparator(item, $(items[i])) ) {
						// going up, go back one item down, otherwise leave as is
						succ = items[direction > 0 ? i : i+1];
						break;
					}
				}
			} else {
				succ = items[i];
			}
			
			var availableItem = this._cloneWithData(item);
			succ ? availableItem.insertBefore($(succ)) : availableItem.appendTo(this.availableList);
			item[this.options.hide](this.options.animated, function() { $(this).remove(); });
			availableItem.hide()[this.options.show](this.options.animated);
			
			this._applyItemState(availableItem, false);
			return availableItem;
		}
	},
	_applyItemState: function(item, selected) {
		if (selected) {
			if (this.options.sortable)
				item.children('span').addClass('ui-icon-arrowthick-2-n-s').removeClass('ui-helper-hidden').addClass('ui-icon');
			else
				item.children('span').removeClass('ui-icon-arrowthick-2-n-s').addClass('ui-helper-hidden').removeClass('ui-icon');
			item.find('a.action span').addClass('ui-icon-minus').removeClass('ui-icon-plus');
			this._registerRemoveEvents(item.find('a.action'));
			
		} else {
			item.children('span').removeClass('ui-icon-arrowthick-2-n-s').addClass('ui-helper-hidden').removeClass('ui-icon');
			item.find('a.action span').addClass('ui-icon-plus').removeClass('ui-icon-minus');
			this._registerAddEvents(item.find('a.action'));
		}
		
		this._registerHoverEvents(item);
	},
	// taken from John Resig's liveUpdate script
	_filter: function(list) {
		var input = $(this);
		var rows = list.children('li'),
			cache = rows.map(function(){
				
				return $(this).text().toLowerCase();
			});
		
		var term = $.trim(input.val().toLowerCase()), scores = [];
		
		if (!term) {
			rows.show();
		} else {
			rows.hide();

			cache.each(function(i) {
				if (this.indexOf(term)>-1) { scores.push(i); }
			});

			$.each(scores, function() {
				$(rows[this]).show();
			});
		}
	},
	_registerHoverEvents: function(elements) {
		elements.removeClass('ui-state-hover');
		elements.mouseover(function() {
			$(this).addClass('ui-state-hover');
		});
		elements.mouseout(function() {
			$(this).removeClass('ui-state-hover');
		});
	},
	_registerAddEvents: function(elements) {
		var that = this;
		elements.click(function() {
			var item = that._setSelected($(this).parent(), true);
			that.count += 1;
			that._updateCount();
			return false;
		})
		// make draggable
		.each(function() {
			$(this).parent().draggable({
	      connectToSortable: 'ul.selected',
				helper: function() {
					var selectedItem = that._cloneWithData($(this)).width($(this).width() - 50);
					selectedItem.width($(this).width());
					return selectedItem;
				},
				appendTo: '.ui-multiselect',
				containment: '.ui-multiselect',
				revert: 'invalid'
	    });
		});
	},
	_registerRemoveEvents: function(elements) {
		var that = this;
		elements.click(function() {
			that._setSelected($(this).parent(), false);
			that.count -= 1;
			that._updateCount();
			return false;
		});
 	},
	_registerSearchEvents: function(input) {
		var that = this;

		input.focus(function() {
			$(this).addClass('ui-state-active');
		})
		.blur(function() {
			$(this).removeClass('ui-state-active');
		})
		.keypress(function(e) {
			if (e.keyCode == 13)
				return false;
		})
		.keyup(function() {
			that._filter.apply(this, [that.availableList]);
		});
	}
});
		
$.extend($.ui.multiselect, {
	defaults: {
		sortable: true,
		searchable: true,
		animated: 'fast',
		show: 'slideDown',
		hide: 'slideUp',
		dividerLocation: 0.6,
		nodeComparator: function(node1,node2) {
			var text1 = node1.text(),
			    text2 = node2.text();
			return text1 == text2 ? 0 : (text1 < text2 ? -1 : 1);
		}
	},
	locale: {
		addAll:'Add all',
		removeAll:'Remove all',
		itemsCount:'items selected'
	}
});

})(jQuery);
/* 
* jqGrid  4.4.0 - jQuery Grid 
* Copyright (c) 2008, Tony Tomov, tony@trirand.com 
* Dual licensed under the MIT and GPL licenses 
* http://www.opensource.org/licenses/mit-license.php 
* http://www.gnu.org/licenses/gpl-2.0.html 
* Date:2012-06-14 
* Modules: grid.base.js; jquery.fmatter.js; grid.custom.js; grid.common.js; grid.formedit.js; grid.filter.js; grid.inlinedit.js; grid.celledit.js; jqModal.js; jqDnR.js; grid.subgrid.js; grid.grouping.js; grid.treegrid.js; grid.import.js; JsonXml.js; grid.tbltogrid.js; grid.jqueryui.js; 
*/

(function(b){b.jgrid=b.jgrid||{};b.extend(b.jgrid,{version:"4.4.0",htmlDecode:function(b){return b&&("&nbsp;"==b||"&#160;"==b||1===b.length&&160===b.charCodeAt(0))?"":!b?b:(""+b).replace(/&gt;/g,">").replace(/&lt;/g,"<").replace(/&quot;/g,'"').replace(/&amp;/g,"&")},htmlEncode:function(b){return!b?b:(""+b).replace(/&/g,"&amp;").replace(/\"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")},format:function(f){var e=b.makeArray(arguments).slice(1);void 0===f&&(f="");return f.replace(/\{(\d+)\}/g,
function(b,d){return e[d]})},getCellIndex:function(f){f=b(f);if(f.is("tr"))return-1;f=(!f.is("td")&&!f.is("th")?f.closest("td,th"):f)[0];return b.browser.msie?b.inArray(f,f.parentNode.cells):f.cellIndex},stripHtml:function(b){var b=b+"",e=/<("[^"]*"|'[^']*'|[^'">])*>/gi;return b?(b=b.replace(e,""))&&"&nbsp;"!==b&&"&#160;"!==b?b.replace(/\"/g,"'"):"":b},stripPref:function(f,e){var c=b.type(f);if("string"==c||"number"==c)f=""+f,e=""!==f?(""+e).replace(""+f,""):e;return e},stringToDoc:function(b){var e;
if("string"!==typeof b)return b;try{e=(new DOMParser).parseFromString(b,"text/xml")}catch(c){e=new ActiveXObject("Microsoft.XMLDOM"),e.async=!1,e.loadXML(b)}return e&&e.documentElement&&"parsererror"!=e.documentElement.tagName?e:null},parse:function(f){"while(1);"==f.substr(0,9)&&(f=f.substr(9));"/*"==f.substr(0,2)&&(f=f.substr(2,f.length-4));f||(f="{}");return!0===b.jgrid.useJSON&&"object"===typeof JSON&&"function"===typeof JSON.parse?JSON.parse(f):eval("("+f+")")},parseDate:function(f,e){var c=
{m:1,d:1,y:1970,h:0,i:0,s:0,u:0},d,a,h;d=/[\\\/:_;.,\t\T\s-]/;if(e&&null!==e&&void 0!==e){e=b.trim(e);e=e.split(d);void 0!==b.jgrid.formatter.date.masks[f]&&(f=b.jgrid.formatter.date.masks[f]);var f=f.split(d),g=b.jgrid.formatter.date.monthNames,i=b.jgrid.formatter.date.AmPm,j=function(a,b){0===a?12===b&&(b=0):12!==b&&(b+=12);return b};d=0;for(a=f.length;d<a;d++)"M"==f[d]&&(h=b.inArray(e[d],g),-1!==h&&12>h&&(e[d]=h+1,c.m=e[d])),"F"==f[d]&&(h=b.inArray(e[d],g),-1!==h&&11<h&&(e[d]=h+1-12,c.m=e[d])),
"a"==f[d]&&(h=b.inArray(e[d],i),-1!==h&&2>h&&e[d]==i[h]&&(e[d]=h,c.h=j(e[d],c.h))),"A"==f[d]&&(h=b.inArray(e[d],i),-1!==h&&1<h&&e[d]==i[h]&&(e[d]=h-2,c.h=j(e[d],c.h))),void 0!==e[d]&&(c[f[d].toLowerCase()]=parseInt(e[d],10));c.m=parseInt(c.m,10)-1;d=c.y;70<=d&&99>=d?c.y=1900+c.y:0<=d&&69>=d&&(c.y=2E3+c.y);void 0!==c.j&&(c.d=c.j);void 0!==c.n&&(c.m=parseInt(c.n,10)-1)}return new Date(c.y,c.m,c.d,c.h,c.i,c.s,c.u)},jqID:function(b){return(""+b).replace(/[!"#$%&'()*+,.\/:;<=>?@\[\\\]\^`{|}~]/g,"\\$&")},
guid:1,uidPref:"jqg",randId:function(f){return(f?f:b.jgrid.uidPref)+b.jgrid.guid++},getAccessor:function(b,e){var c,d,a=[],h;if("function"===typeof e)return e(b);c=b[e];if(void 0===c)try{if("string"===typeof e&&(a=e.split(".")),h=a.length)for(c=b;c&&h--;)d=a.shift(),c=c[d]}catch(g){}return c},getXmlData:function(f,e,c){var d="string"===typeof e?e.match(/^(.*)\[(\w+)\]$/):null;if("function"===typeof e)return e(f);if(d&&d[2])return d[1]?b(d[1],f).attr(d[2]):b(f).attr(d[2]);f=b(e,f);return c?f:0<f.length?
b(f).text():void 0},cellWidth:function(){var f=b("<div class='ui-jqgrid' style='left:10000px'><table class='ui-jqgrid-btable' style='width:5px;'><tr class='jqgrow'><td style='width:5px;'></td></tr></table></div>"),e=f.appendTo("body").find("td").width();f.remove();return 5!==e},ajaxOptions:{},from:function(f){return new function(e,c){"string"==typeof e&&(e=b.data(e));var d=this,a=e,h=!0,f=!1,i=c,j=/[\$,%]/g,l=null,k=null,m=0,o=!1,p="",v=[],u=!0;if("object"==typeof e&&e.push)0<e.length&&(u="object"!=
typeof e[0]?!1:!0);else throw"data provides is not an array";this._hasData=function(){return null===a?!1:0===a.length?!1:!0};this._getStr=function(a){var b=[];f&&b.push("jQuery.trim(");b.push("String("+a+")");f&&b.push(")");h||b.push(".toLowerCase()");return b.join("")};this._strComp=function(a){return"string"==typeof a?".toString()":""};this._group=function(a,b){return{field:a.toString(),unique:b,items:[]}};this._toStr=function(a){f&&(a=b.trim(a));a=a.toString().replace(/\\/g,"\\\\").replace(/\"/g,
'\\"');return h?a:a.toLowerCase()};this._funcLoop=function(d){var c=[];b.each(a,function(a,b){c.push(d(b))});return c};this._append=function(a){var b;i=null===i?"":i+(""===p?" && ":p);for(b=0;b<m;b++)i+="(";o&&(i+="!");i+="("+a+")";o=!1;p="";m=0};this._setCommand=function(a,b){l=a;k=b};this._resetNegate=function(){o=!1};this._repeatCommand=function(a,b){return null===l?d:null!==a&&null!==b?l(a,b):null===k||!u?l(a):l(k,a)};this._equals=function(a,b){return 0===d._compare(a,b,1)};this._compare=function(a,
b,d){var c=Object.prototype.toString;void 0===d&&(d=1);void 0===a&&(a=null);void 0===b&&(b=null);if(null===a&&null===b)return 0;if(null===a&&null!==b)return 1;if(null!==a&&null===b)return-1;if("[object Date]"===c.call(a)&&"[object Date]"===c.call(b))return a<b?-d:a>b?d:0;!h&&"number"!==typeof a&&"number"!==typeof b&&(a=(""+a).toLowerCase(),b=(""+b).toLowerCase());return a<b?-d:a>b?d:0};this._performSort=function(){0!==v.length&&(a=d._doSort(a,0))};this._doSort=function(a,b){var c=v[b].by,f=v[b].dir,
h=v[b].type,e=v[b].datefmt;if(b==v.length-1)return d._getOrder(a,c,f,h,e);b++;c=d._getGroup(a,c,f,h,e);f=[];for(h=0;h<c.length;h++)for(var e=d._doSort(c[h].items,b),g=0;g<e.length;g++)f.push(e[g]);return f};this._getOrder=function(a,c,h,f,e){var g=[],i=[],l="a"==h?1:-1,k,m;void 0===f&&(f="text");m="float"==f||"number"==f||"currency"==f||"numeric"==f?function(a){a=parseFloat((""+a).replace(j,""));return isNaN(a)?0:a}:"int"==f||"integer"==f?function(a){return a?parseFloat((""+a).replace(j,"")):0}:"date"==
f||"datetime"==f?function(a){return b.jgrid.parseDate(e,a).getTime()}:b.isFunction(f)?f:function(a){a||(a="");return b.trim((""+a).toUpperCase())};b.each(a,function(a,d){k=""!==c?b.jgrid.getAccessor(d,c):d;void 0===k&&(k="");k=m(k,d);i.push({vSort:k,index:a})});i.sort(function(a,b){a=a.vSort;b=b.vSort;return d._compare(a,b,l)});for(var f=0,o=a.length;f<o;)h=i[f].index,g.push(a[h]),f++;return g};this._getGroup=function(a,c,f,h,e){var g=[],i=null,j=null,k;b.each(d._getOrder(a,c,f,h,e),function(a,f){k=
b.jgrid.getAccessor(f,c);void 0===k&&(k="");d._equals(j,k)||(j=k,null!==i&&g.push(i),i=d._group(c,k));i.items.push(f)});null!==i&&g.push(i);return g};this.ignoreCase=function(){h=!1;return d};this.useCase=function(){h=!0;return d};this.trim=function(){f=!0;return d};this.noTrim=function(){f=!1;return d};this.execute=function(){var c=i,f=[];if(null===c)return d;b.each(a,function(){eval(c)&&f.push(this)});a=f;return d};this.data=function(){return a};this.select=function(c){d._performSort();if(!d._hasData())return[];
d.execute();if(b.isFunction(c)){var f=[];b.each(a,function(a,b){f.push(c(b))});return f}return a};this.hasMatch=function(){if(!d._hasData())return!1;d.execute();return 0<a.length};this.andNot=function(a,b,c){o=!o;return d.and(a,b,c)};this.orNot=function(a,b,c){o=!o;return d.or(a,b,c)};this.not=function(a,b,c){return d.andNot(a,b,c)};this.and=function(a,b,c){p=" && ";return void 0===a?d:d._repeatCommand(a,b,c)};this.or=function(a,b,c){p=" || ";return void 0===a?d:d._repeatCommand(a,b,c)};this.orBegin=
function(){m++;return d};this.orEnd=function(){null!==i&&(i+=")");return d};this.isNot=function(a){o=!o;return d.is(a)};this.is=function(a){d._append("this."+a);d._resetNegate();return d};this._compareValues=function(a,c,f,h,e){var g;g=u?"jQuery.jgrid.getAccessor(this,'"+c+"')":"this";void 0===f&&(f=null);var i=f,k=void 0===e.stype?"text":e.stype;if(null!==f)switch(k){case "int":case "integer":i=isNaN(Number(i))||""===i?"0":i;g="parseInt("+g+",10)";i="parseInt("+i+",10)";break;case "float":case "number":case "numeric":i=
(""+i).replace(j,"");i=isNaN(Number(i))||""===i?"0":i;g="parseFloat("+g+")";i="parseFloat("+i+")";break;case "date":case "datetime":i=""+b.jgrid.parseDate(e.newfmt||"Y-m-d",i).getTime();g='jQuery.jgrid.parseDate("'+e.srcfmt+'",'+g+").getTime()";break;default:g=d._getStr(g),i=d._getStr('"'+d._toStr(i)+'"')}d._append(g+" "+h+" "+i);d._setCommand(a,c);d._resetNegate();return d};this.equals=function(a,b,c){return d._compareValues(d.equals,a,b,"==",c)};this.notEquals=function(a,b,c){return d._compareValues(d.equals,
a,b,"!==",c)};this.isNull=function(a,b,c){return d._compareValues(d.equals,a,null,"===",c)};this.greater=function(a,b,c){return d._compareValues(d.greater,a,b,">",c)};this.less=function(a,b,c){return d._compareValues(d.less,a,b,"<",c)};this.greaterOrEquals=function(a,b,c){return d._compareValues(d.greaterOrEquals,a,b,">=",c)};this.lessOrEquals=function(a,b,c){return d._compareValues(d.lessOrEquals,a,b,"<=",c)};this.startsWith=function(a,c){var h=void 0===c||null===c?a:c,h=f?b.trim(h.toString()).length:
h.toString().length;u?d._append(d._getStr("jQuery.jgrid.getAccessor(this,'"+a+"')")+".substr(0,"+h+") == "+d._getStr('"'+d._toStr(c)+'"')):(h=f?b.trim(c.toString()).length:c.toString().length,d._append(d._getStr("this")+".substr(0,"+h+") == "+d._getStr('"'+d._toStr(a)+'"')));d._setCommand(d.startsWith,a);d._resetNegate();return d};this.endsWith=function(a,c){var h=void 0===c||null===c?a:c,h=f?b.trim(h.toString()).length:h.toString().length;u?d._append(d._getStr("jQuery.jgrid.getAccessor(this,'"+a+
"')")+".substr("+d._getStr("jQuery.jgrid.getAccessor(this,'"+a+"')")+".length-"+h+","+h+') == "'+d._toStr(c)+'"'):d._append(d._getStr("this")+".substr("+d._getStr("this")+'.length-"'+d._toStr(a)+'".length,"'+d._toStr(a)+'".length) == "'+d._toStr(a)+'"');d._setCommand(d.endsWith,a);d._resetNegate();return d};this.contains=function(a,b){u?d._append(d._getStr("jQuery.jgrid.getAccessor(this,'"+a+"')")+'.indexOf("'+d._toStr(b)+'",0) > -1'):d._append(d._getStr("this")+'.indexOf("'+d._toStr(a)+'",0) > -1');
d._setCommand(d.contains,a);d._resetNegate();return d};this.groupBy=function(b,c,f,h){return!d._hasData()?null:d._getGroup(a,b,c,f,h)};this.orderBy=function(a,c,f,h){c=void 0===c||null===c?"a":b.trim(c.toString().toLowerCase());if(null===f||void 0===f)f="text";if(null===h||void 0===h)h="Y-m-d";if("desc"==c||"descending"==c)c="d";if("asc"==c||"ascending"==c)c="a";v.push({by:a,dir:c,type:f,datefmt:h});return d};return d}(f,null)},extend:function(f){b.extend(b.fn.jqGrid,f);this.no_legacy_api||b.fn.extend(f)}});
b.fn.jqGrid=function(f){if("string"==typeof f){var e=b.jgrid.getAccessor(b.fn.jqGrid,f);if(!e)throw"jqGrid - No such method: "+f;var c=b.makeArray(arguments).slice(1);return e.apply(this,c)}return this.each(function(){if(!this.grid){var d=b.extend(!0,{url:"",height:150,page:1,rowNum:20,rowTotal:null,records:0,pager:"",pgbuttons:!0,pginput:!0,colModel:[],rowList:[],colNames:[],sortorder:"asc",sortname:"",datatype:"xml",mtype:"GET",altRows:!1,selarrrow:[],savedRow:[],shrinkToFit:!0,xmlReader:{},jsonReader:{},
subGrid:!1,subGridModel:[],reccount:0,lastpage:0,lastsort:0,selrow:null,beforeSelectRow:null,onSelectRow:null,onSortCol:null,ondblClickRow:null,onRightClickRow:null,onPaging:null,onSelectAll:null,loadComplete:null,gridComplete:null,loadError:null,loadBeforeSend:null,afterInsertRow:null,beforeRequest:null,beforeProcessing:null,onHeaderClick:null,viewrecords:!1,loadonce:!1,multiselect:!1,multikey:!1,editurl:null,search:!1,caption:"",hidegrid:!0,hiddengrid:!1,postData:{},userData:{},treeGrid:!1,treeGridModel:"nested",
treeReader:{},treeANode:-1,ExpandColumn:null,tree_root_level:0,prmNames:{page:"page",rows:"rows",sort:"sidx",order:"sord",search:"_search",nd:"nd",id:"id",oper:"oper",editoper:"edit",addoper:"add",deloper:"del",subgridid:"id",npage:null,totalrows:"totalrows"},forceFit:!1,gridstate:"visible",cellEdit:!1,cellsubmit:"remote",nv:0,loadui:"enable",toolbar:[!1,""],scroll:!1,multiboxonly:!1,deselectAfterSort:!0,scrollrows:!1,autowidth:!1,scrollOffset:18,cellLayout:5,subGridWidth:20,multiselectWidth:20,gridview:!1,
rownumWidth:25,rownumbers:!1,pagerpos:"center",recordpos:"right",footerrow:!1,userDataOnFooter:!1,hoverrows:!0,altclass:"ui-priority-secondary",viewsortcols:[!1,"vertical",!0],resizeclass:"",autoencode:!1,remapColumns:[],ajaxGridOptions:{},direction:"ltr",toppager:!1,headertitles:!1,scrollTimeout:40,data:[],_index:{},grouping:!1,groupingView:{groupField:[],groupOrder:[],groupText:[],groupColumnShow:[],groupSummary:[],showSummaryOnHide:!1,sortitems:[],sortnames:[],summary:[],summaryval:[],plusicon:"ui-icon-circlesmall-plus",
minusicon:"ui-icon-circlesmall-minus"},ignoreCase:!1,cmTemplate:{},idPrefix:""},b.jgrid.defaults,f||{}),a=this,c={headers:[],cols:[],footers:[],dragStart:function(c,e,f){this.resizing={idx:c,startX:e.clientX,sOL:f[0]};this.hDiv.style.cursor="col-resize";this.curGbox=b("#rs_m"+b.jgrid.jqID(d.id),"#gbox_"+b.jgrid.jqID(d.id));this.curGbox.css({display:"block",left:f[0],top:f[1],height:f[2]});b(a).triggerHandler("jqGridResizeStart",[e,c]);b.isFunction(d.resizeStart)&&d.resizeStart.call(this,e,c);document.onselectstart=
function(){return!1}},dragMove:function(a){if(this.resizing){var b=a.clientX-this.resizing.startX,a=this.headers[this.resizing.idx],c="ltr"===d.direction?a.width+b:a.width-b,e;33<c&&(this.curGbox.css({left:this.resizing.sOL+b}),!0===d.forceFit?(e=this.headers[this.resizing.idx+d.nv],b="ltr"===d.direction?e.width-b:e.width+b,33<b&&(a.newWidth=c,e.newWidth=b)):(this.newWidth="ltr"===d.direction?d.tblwidth+b:d.tblwidth-b,a.newWidth=c))}},dragEnd:function(){this.hDiv.style.cursor="default";if(this.resizing){var c=
this.resizing.idx,e=this.headers[c].newWidth||this.headers[c].width,e=parseInt(e,10);this.resizing=!1;b("#rs_m"+b.jgrid.jqID(d.id)).css("display","none");d.colModel[c].width=e;this.headers[c].width=e;this.headers[c].el.style.width=e+"px";this.cols[c].style.width=e+"px";0<this.footers.length&&(this.footers[c].style.width=e+"px");!0===d.forceFit?(e=this.headers[c+d.nv].newWidth||this.headers[c+d.nv].width,this.headers[c+d.nv].width=e,this.headers[c+d.nv].el.style.width=e+"px",this.cols[c+d.nv].style.width=
e+"px",0<this.footers.length&&(this.footers[c+d.nv].style.width=e+"px"),d.colModel[c+d.nv].width=e):(d.tblwidth=this.newWidth||d.tblwidth,b("table:first",this.bDiv).css("width",d.tblwidth+"px"),b("table:first",this.hDiv).css("width",d.tblwidth+"px"),this.hDiv.scrollLeft=this.bDiv.scrollLeft,d.footerrow&&(b("table:first",this.sDiv).css("width",d.tblwidth+"px"),this.sDiv.scrollLeft=this.bDiv.scrollLeft));b(a).triggerHandler("jqGridResizeStop",[e,c]);b.isFunction(d.resizeStop)&&d.resizeStop.call(this,
e,c)}this.curGbox=null;document.onselectstart=function(){return!0}},populateVisible:function(){c.timer&&clearTimeout(c.timer);c.timer=null;var a=b(c.bDiv).height();if(a){var e=b("table:first",c.bDiv),f,G;if(e[0].rows.length)try{G=(f=e[0].rows[1])?b(f).outerHeight()||c.prevRowHeight:c.prevRowHeight}catch(g){G=c.prevRowHeight}if(G){c.prevRowHeight=G;var i=d.rowNum;f=c.scrollTop=c.bDiv.scrollTop;var j=Math.round(e.position().top)-f,k=j+e.height();G*=i;var y,z,B;if(k<a&&0>=j&&(void 0===d.lastpage||parseInt((k+
f+G-1)/G,10)<=d.lastpage))z=parseInt((a-k+G-1)/G,10),0<=k||2>z||!0===d.scroll?(y=Math.round((k+f)/G)+1,j=-1):j=1;0<j&&(y=parseInt(f/G,10)+1,z=parseInt((f+a)/G,10)+2-y,B=!0);if(z&&!(d.lastpage&&y>d.lastpage||1==d.lastpage||y===d.page&&y===d.lastpage))c.hDiv.loading?c.timer=setTimeout(c.populateVisible,d.scrollTimeout):(d.page=y,B&&(c.selectionPreserver(e[0]),c.emptyRows.call(e[0],!1,!1)),c.populate(z))}}},scrollGrid:function(a){if(d.scroll){var b=c.bDiv.scrollTop;void 0===c.scrollTop&&(c.scrollTop=
0);b!=c.scrollTop&&(c.scrollTop=b,c.timer&&clearTimeout(c.timer),c.timer=setTimeout(c.populateVisible,d.scrollTimeout))}c.hDiv.scrollLeft=c.bDiv.scrollLeft;d.footerrow&&(c.sDiv.scrollLeft=c.bDiv.scrollLeft);a&&a.stopPropagation()},selectionPreserver:function(a){var c=a.p,d=c.selrow,e=c.selarrrow?b.makeArray(c.selarrrow):null,f=a.grid.bDiv.scrollLeft,g=function(){var h;c.selrow=null;c.selarrrow=[];if(c.multiselect&&e&&0<e.length)for(h=0;h<e.length;h++)e[h]!=d&&b(a).jqGrid("setSelection",e[h],!1,null);
d&&b(a).jqGrid("setSelection",d,!1,null);a.grid.bDiv.scrollLeft=f;b(a).unbind(".selectionPreserver",g)};b(a).bind("jqGridGridComplete.selectionPreserver",g)}};if("TABLE"!=this.tagName.toUpperCase())alert("Element is not a table");else if(void 0!==document.documentMode&&5>=document.documentMode)alert("Grid can not be used in this ('quirks') mode!");else{b(this).empty().attr("tabindex","1");this.p=d;this.p.useProp=!!b.fn.prop;var e,i;if(0===this.p.colNames.length)for(e=0;e<this.p.colModel.length;e++)this.p.colNames[e]=
this.p.colModel[e].label||this.p.colModel[e].name;if(this.p.colNames.length!==this.p.colModel.length)alert(b.jgrid.errors.model);else{var j=b("<div class='ui-jqgrid-view'></div>"),l,k=b.browser.msie?!0:!1;a.p.direction=b.trim(a.p.direction.toLowerCase());-1==b.inArray(a.p.direction,["ltr","rtl"])&&(a.p.direction="ltr");i=a.p.direction;b(j).insertBefore(this);b(this).appendTo(j).removeClass("scroll");var m=b("<div class='ui-jqgrid ui-widget ui-widget-content ui-corner-all'></div>");b(m).insertBefore(j).attr({id:"gbox_"+
this.id,dir:i});b(j).appendTo(m).attr("id","gview_"+this.id);l=k&&6>=b.browser.version?'<iframe style="display:block;position:absolute;z-index:-1;filter:Alpha(Opacity=\'0\');" src="javascript:false;"></iframe>':"";b("<div class='ui-widget-overlay jqgrid-overlay' id='lui_"+this.id+"'></div>").append(l).insertBefore(j);b("<div class='loading ui-state-default ui-state-active' id='load_"+this.id+"'>"+this.p.loadtext+"</div>").insertBefore(j);b(this).attr({cellspacing:"0",cellpadding:"0",border:"0",role:"grid",
"aria-multiselectable":!!this.p.multiselect,"aria-labelledby":"gbox_"+this.id});var o=function(a,b){a=parseInt(a,10);return isNaN(a)?b?b:0:a},p=function(d,e,f,g,i,j){var K=a.p.colModel[d],k=K.align,y='style="',z=K.classes,B=K.name,q=[];k&&(y=y+("text-align:"+k+";"));K.hidden===true&&(y=y+"display:none;");if(e===0)y=y+("width: "+c.headers[d].width+"px;");else if(K.cellattr&&b.isFunction(K.cellattr))if((d=K.cellattr.call(a,i,f,g,K,j))&&typeof d==="string"){d=d.replace(/style/i,"style").replace(/title/i,
"title");if(d.indexOf("title")>-1)K.title=false;d.indexOf("class")>-1&&(z=void 0);q=d.split("style");if(q.length===2){q[1]=b.trim(q[1].replace("=",""));if(q[1].indexOf("'")===0||q[1].indexOf('"')===0)q[1]=q[1].substring(1);y=y+q[1].replace(/'/gi,'"')}else y=y+'"'}if(!q.length){q[0]="";y=y+'"'}y=y+((z!==void 0?' class="'+z+'"':"")+(K.title&&f?' title="'+b.jgrid.stripHtml(f)+'"':""));y=y+(' aria-describedby="'+a.p.id+"_"+B+'"');return y+q[0]},v=function(c){return c===void 0||c===null||c===""?"&#160;":
a.p.autoencode?b.jgrid.htmlEncode(c):c+""},u=function(c,d,e,f,g){var h=a.p.colModel[e];if(typeof h.formatter!=="undefined"){c={rowId:c,colModel:h,gid:a.p.id,pos:e};d=b.isFunction(h.formatter)?h.formatter.call(a,d,c,f,g):b.fmatter?b.fn.fmatter.call(a,h.formatter,d,c,f,g):v(d)}else d=v(d);return d},M=function(a,b,c,d,e){b=u(a,b,c,e,"add");return'<td role="gridcell" '+p(c,d,b,e,a,true)+">"+b+"</td>"},F=function(b,c,d){var e='<input role="checkbox" type="checkbox" id="jqg_'+a.p.id+"_"+b+'" class="cbox" name="jqg_'+
a.p.id+"_"+b+'"/>';return'<td role="gridcell" '+p(c,d,"",null,b,true)+">"+e+"</td>"},Z=function(a,b,c,d){c=(parseInt(c,10)-1)*parseInt(d,10)+1+b;return'<td role="gridcell" class="ui-state-default jqgrid-rownum" '+p(a,b,c,null,b,true)+">"+c+"</td>"},U=function(b){var c,d=[],e=0,f;for(f=0;f<a.p.colModel.length;f++){c=a.p.colModel[f];if(c.name!=="cb"&&c.name!=="subgrid"&&c.name!=="rn"){d[e]=b=="local"?c.name:b=="xml"||b==="xmlstring"?c.xmlmap||c.name:c.jsonmap||c.name;e++}}return d},V=function(c){var d=
a.p.remapColumns;if(!d||!d.length)d=b.map(a.p.colModel,function(a,b){return b});c&&(d=b.map(d,function(a){return a<c?null:a-c}));return d},N=function(a,c){var d;if(this.p.deepempty)b(this.rows).slice(1).remove();else{d=this.rows.length>0?this.rows[0]:null;b(this.firstChild).empty().append(d)}if(a&&this.p.scroll){b(this.grid.bDiv.firstChild).css({height:"auto"});b(this.grid.bDiv.firstChild.firstChild).css({height:0,display:"none"});if(this.grid.bDiv.scrollTop!==0)this.grid.bDiv.scrollTop=0}if(c===
true&&this.p.treeGrid){this.p.data=[];this.p._index={}}},S=function(){var c=a.p.data.length,d,e,f;d=a.p.rownumbers===true?1:0;e=a.p.multiselect===true?1:0;f=a.p.subGrid===true?1:0;d=a.p.keyIndex===false||a.p.loadonce===true?a.p.localReader.id:a.p.colModel[a.p.keyIndex+e+f+d].name;for(e=0;e<c;e++){f=b.jgrid.getAccessor(a.p.data[e],d);a.p._index[f]=e}},J=function(c,d,e,f,g){var h="-1",i="",j,d=d?"display:none;":"",e="ui-widget-content jqgrow ui-row-"+a.p.direction+e,f=b.isFunction(a.p.rowattr)?a.p.rowattr.call(a,
f,g):{};if(!b.isEmptyObject(f)){if(f.hasOwnProperty("id")){c=f.id;delete f.id}if(f.hasOwnProperty("tabindex")){h=f.tabindex;delete f.tabindex}if(f.hasOwnProperty("style")){d=d+f.style;delete f.style}if(f.hasOwnProperty("class")){e=e+(" "+f["class"]);delete f["class"]}try{delete f.role}catch(k){}for(j in f)f.hasOwnProperty(j)&&(i=i+(" "+j+"="+f[j]))}return'<tr role="row" id="'+c+'" tabindex="'+h+'" class="'+e+'"'+(d===""?"":' style="'+d+'"')+i+">"},$=function(c,d,e,f,g){var h=new Date,i=a.p.datatype!=
"local"&&a.p.loadonce||a.p.datatype=="xmlstring",j=a.p.xmlReader,k=a.p.datatype=="local"?"local":"xml";if(i){a.p.data=[];a.p._index={};a.p.localReader.id="_id_"}a.p.reccount=0;if(b.isXMLDoc(c)){if(a.p.treeANode===-1&&!a.p.scroll){N.call(a,false,true);e=1}else e=e>1?e:1;var z,B,q=0,l,s=a.p.multiselect===true?1:0,P=a.p.subGrid===true?1:0,m=a.p.rownumbers===true?1:0,o,p=[],u,n={},r,w,C=[],v=a.p.altRows===true?" "+a.p.altclass:"",A;j.repeatitems||(p=U(k));o=a.p.keyIndex===false?b.isFunction(j.id)?j.id.call(a,
c):j.id:a.p.keyIndex;if(p.length>0&&!isNaN(o)){a.p.remapColumns&&a.p.remapColumns.length&&(o=b.inArray(o,a.p.remapColumns));o=p[o]}k=(o+"").indexOf("[")===-1?p.length?function(a,c){return b(o,a).text()||c}:function(a,c){return b(j.cell,a).eq(o).text()||c}:function(a,b){return a.getAttribute(o.replace(/[\[\]]/g,""))||b};a.p.userData={};a.p.page=b.jgrid.getXmlData(c,j.page)||0;a.p.lastpage=b.jgrid.getXmlData(c,j.total);if(a.p.lastpage===void 0)a.p.lastpage=1;a.p.records=b.jgrid.getXmlData(c,j.records)||
0;b.isFunction(j.userdata)?a.p.userData=j.userdata.call(a,c)||{}:b.jgrid.getXmlData(c,j.userdata,true).each(function(){a.p.userData[this.getAttribute("name")]=b(this).text()});c=b.jgrid.getXmlData(c,j.root,true);(c=b.jgrid.getXmlData(c,j.row,true))||(c=[]);var t=c.length,H=0,Q=[],x=parseInt(a.p.rowNum,10);if(t>0&&a.p.page<=0)a.p.page=1;if(c&&t){var D=a.p.scroll?b.jgrid.randId():1;g&&(x=x*(g+1));for(var g=b.isFunction(a.p.afterInsertRow),E=a.p.grouping&&a.p.groupingView.groupCollapse===true;H<t;){r=
c[H];w=k(r,D+H);w=a.p.idPrefix+w;z=e===0?0:e+1;A=(z+H)%2==1?v:"";var I=C.length;C.push("");m&&C.push(Z(0,H,a.p.page,a.p.rowNum));s&&C.push(F(w,m,H));P&&C.push(b(a).jqGrid("addSubGridCell",s+m,H+e));if(j.repeatitems){u||(u=V(s+P+m));var L=b.jgrid.getXmlData(r,j.cell,true);b.each(u,function(b){var c=L[this];if(!c)return false;l=c.textContent||c.text;n[a.p.colModel[b+s+P+m].name]=l;C.push(M(w,l,b+s+P+m,H+e,r))})}else for(z=0;z<p.length;z++){l=b.jgrid.getXmlData(r,p[z]);n[a.p.colModel[z+s+P+m].name]=
l;C.push(M(w,l,z+s+P+m,H+e,r))}C[I]=J(w,E,A,n,r);C.push("</tr>");if(a.p.grouping){Q=b(a).jqGrid("groupingPrepare",C,Q,n,H);C=[]}if(i||a.p.treeGrid===true){n._id_=w;a.p.data.push(n);a.p._index[w]=a.p.data.length-1}if(a.p.gridview===false){b("tbody:first",d).append(C.join(""));b(a).triggerHandler("jqGridAfterInsertRow",[w,n,r]);g&&a.p.afterInsertRow.call(a,w,n,r);C=[]}n={};q++;H++;if(q==x)break}}if(a.p.gridview===true){B=a.p.treeANode>-1?a.p.treeANode:0;if(a.p.grouping){b(a).jqGrid("groupingRender",
Q,a.p.colModel.length);Q=null}else a.p.treeGrid===true&&B>0?b(a.rows[B]).after(C.join("")):b("tbody:first",d).append(C.join(""))}if(a.p.subGrid===true)try{b(a).jqGrid("addSubGrid",s+m)}catch(R){}a.p.totaltime=new Date-h;if(q>0&&a.p.records===0)a.p.records=t;C=null;if(a.p.treeGrid===true)try{b(a).jqGrid("setTreeNode",B+1,q+B+1)}catch(S){}if(!a.p.treeGrid&&!a.p.scroll)a.grid.bDiv.scrollTop=0;a.p.reccount=q;a.p.treeANode=-1;a.p.userDataOnFooter&&b(a).jqGrid("footerData","set",a.p.userData,true);if(i){a.p.records=
t;a.p.lastpage=Math.ceil(t/x)}f||a.updatepager(false,true);if(i)for(;q<t;){r=c[q];w=k(r,q+D);w=a.p.idPrefix+w;if(j.repeatitems){u||(u=V(s+P+m));var O=b.jgrid.getXmlData(r,j.cell,true);b.each(u,function(b){var c=O[this];if(!c)return false;l=c.textContent||c.text;n[a.p.colModel[b+s+P+m].name]=l})}else for(z=0;z<p.length;z++){l=b.jgrid.getXmlData(r,p[z]);n[a.p.colModel[z+s+P+m].name]=l}n._id_=w;a.p.data.push(n);a.p._index[w]=a.p.data.length-1;n={};q++}}},aa=function(c,d,e,f,g){d=new Date;if(c){if(a.p.treeANode===
-1&&!a.p.scroll){N.call(a,false,true);e=1}else e=e>1?e:1;var h,i,j=a.p.datatype!="local"&&a.p.loadonce||a.p.datatype=="jsonstring";if(j){a.p.data=[];a.p._index={};a.p.localReader.id="_id_"}a.p.reccount=0;if(a.p.datatype=="local"){h=a.p.localReader;i="local"}else{h=a.p.jsonReader;i="json"}var k=0,l,B,q=[],m,s=a.p.multiselect?1:0,o=a.p.subGrid?1:0,p=a.p.rownumbers===true?1:0,n,u,t={},v,r,w=[],C=a.p.altRows===true?" "+a.p.altclass:"",A;a.p.page=b.jgrid.getAccessor(c,h.page)||0;n=b.jgrid.getAccessor(c,
h.total);a.p.lastpage=n===void 0?1:n;a.p.records=b.jgrid.getAccessor(c,h.records)||0;a.p.userData=b.jgrid.getAccessor(c,h.userdata)||{};h.repeatitems||(m=q=U(i));i=a.p.keyIndex===false?b.isFunction(h.id)?h.id.call(a,c):h.id:a.p.keyIndex;if(q.length>0&&!isNaN(i)){a.p.remapColumns&&a.p.remapColumns.length&&(i=b.inArray(i,a.p.remapColumns));i=q[i]}(u=b.jgrid.getAccessor(c,h.root))||(u=[]);n=u.length;c=0;if(n>0&&a.p.page<=0)a.p.page=1;var x=parseInt(a.p.rowNum,10),D=a.p.scroll?b.jgrid.randId():1;g&&(x=
x*(g+1));for(var H=b.isFunction(a.p.afterInsertRow),Q=[],E=a.p.grouping&&a.p.groupingView.groupCollapse===true;c<n;){g=u[c];r=b.jgrid.getAccessor(g,i);if(r===void 0){r=D+c;if(q.length===0&&h.cell){l=b.jgrid.getAccessor(g,h.cell);r=l!==void 0?l[i]||r:r}}r=a.p.idPrefix+r;l=e===1?0:e;A=(l+c)%2==1?C:"";var I=w.length;w.push("");p&&w.push(Z(0,c,a.p.page,a.p.rowNum));s&&w.push(F(r,p,c));o&&w.push(b(a).jqGrid("addSubGridCell",s+p,c+e));if(h.repeatitems){h.cell&&(g=b.jgrid.getAccessor(g,h.cell));m||(m=V(s+
o+p))}for(B=0;B<m.length;B++){l=b.jgrid.getAccessor(g,m[B]);w.push(M(r,l,B+s+o+p,c+e,g));t[a.p.colModel[B+s+o+p].name]=l}w[I]=J(r,E,A,t,g);w.push("</tr>");if(a.p.grouping){Q=b(a).jqGrid("groupingPrepare",w,Q,t,c);w=[]}if(j||a.p.treeGrid===true){t._id_=r;a.p.data.push(t);a.p._index[r]=a.p.data.length-1}if(a.p.gridview===false){b("#"+b.jgrid.jqID(a.p.id)+" tbody:first").append(w.join(""));b(a).triggerHandler("jqGridAfterInsertRow",[r,t,g]);H&&a.p.afterInsertRow.call(a,r,t,g);w=[]}t={};k++;c++;if(k==
x)break}if(a.p.gridview===true){v=a.p.treeANode>-1?a.p.treeANode:0;a.p.grouping?b(a).jqGrid("groupingRender",Q,a.p.colModel.length):a.p.treeGrid===true&&v>0?b(a.rows[v]).after(w.join("")):b("#"+b.jgrid.jqID(a.p.id)+" tbody:first").append(w.join(""))}if(a.p.subGrid===true)try{b(a).jqGrid("addSubGrid",s+p)}catch(L){}a.p.totaltime=new Date-d;if(k>0&&a.p.records===0)a.p.records=n;if(a.p.treeGrid===true)try{b(a).jqGrid("setTreeNode",v+1,k+v+1)}catch(O){}if(!a.p.treeGrid&&!a.p.scroll)a.grid.bDiv.scrollTop=
0;a.p.reccount=k;a.p.treeANode=-1;a.p.userDataOnFooter&&b(a).jqGrid("footerData","set",a.p.userData,true);if(j){a.p.records=n;a.p.lastpage=Math.ceil(n/x)}f||a.updatepager(false,true);if(j)for(;k<n&&u[k];){g=u[k];r=b.jgrid.getAccessor(g,i);if(r===void 0){r=D+k;q.length===0&&h.cell&&(r=b.jgrid.getAccessor(g,h.cell)[i]||r)}if(g){r=a.p.idPrefix+r;if(h.repeatitems){h.cell&&(g=b.jgrid.getAccessor(g,h.cell));m||(m=V(s+o+p))}for(B=0;B<m.length;B++){l=b.jgrid.getAccessor(g,m[B]);t[a.p.colModel[B+s+o+p].name]=
l}t._id_=r;a.p.data.push(t);a.p._index[r]=a.p.data.length-1;t={}}k++}}},ma=function(){function c(d){var e=0,g,h,i,j,T;if(d.groups!==void 0){(h=d.groups.length&&d.groupOp.toString().toUpperCase()==="OR")&&s.orBegin();for(g=0;g<d.groups.length;g++){e>0&&h&&s.or();try{c(d.groups[g])}catch(k){alert(k)}e++}h&&s.orEnd()}if(d.rules!==void 0){if(e>0){h=s.select();s=b.jgrid.from(h);a.p.ignoreCase&&(s=s.ignoreCase())}try{(i=d.rules.length&&d.groupOp.toString().toUpperCase()==="OR")&&s.orBegin();for(g=0;g<d.rules.length;g++){T=
d.rules[g];j=d.groupOp.toString().toUpperCase();if(o[T.op]&&T.field){e>0&&j&&j==="OR"&&(s=s.or());s=o[T.op](s,j)(T.field,T.data,f[T.field])}e++}i&&s.orEnd()}catch(na){alert(na)}}}var d,e=false,f={},g=[],h=[],i,j,k;if(b.isArray(a.p.data)){var l=a.p.grouping?a.p.groupingView:false,m,q;b.each(a.p.colModel,function(){j=this.sorttype||"text";if(j=="date"||j=="datetime"){if(this.formatter&&typeof this.formatter==="string"&&this.formatter=="date"){i=this.formatoptions&&this.formatoptions.srcformat?this.formatoptions.srcformat:
b.jgrid.formatter.date.srcformat;k=this.formatoptions&&this.formatoptions.newformat?this.formatoptions.newformat:b.jgrid.formatter.date.newformat}else i=k=this.datefmt||"Y-m-d";f[this.name]={stype:j,srcfmt:i,newfmt:k}}else f[this.name]={stype:j,srcfmt:"",newfmt:""};if(a.p.grouping){q=0;for(m=l.groupField.length;q<m;q++)if(this.name==l.groupField[q]){var c=this.name;if(typeof this.index!="undefined")c=this.index;g[q]=f[c];h[q]=c}}if(!e&&(this.index==a.p.sortname||this.name==a.p.sortname)){d=this.name;
e=true}});if(a.p.treeGrid)b(a).jqGrid("SortTree",d,a.p.sortorder,f[d].stype,f[d].srcfmt);else{var o={eq:function(a){return a.equals},ne:function(a){return a.notEquals},lt:function(a){return a.less},le:function(a){return a.lessOrEquals},gt:function(a){return a.greater},ge:function(a){return a.greaterOrEquals},cn:function(a){return a.contains},nc:function(a,b){return b==="OR"?a.orNot().contains:a.andNot().contains},bw:function(a){return a.startsWith},bn:function(a,b){return b==="OR"?a.orNot().startsWith:
a.andNot().startsWith},en:function(a,b){return b==="OR"?a.orNot().endsWith:a.andNot().endsWith},ew:function(a){return a.endsWith},ni:function(a,b){return b==="OR"?a.orNot().equals:a.andNot().equals},"in":function(a){return a.equals},nu:function(a){return a.isNull},nn:function(a,b){return b==="OR"?a.orNot().isNull:a.andNot().isNull}},s=b.jgrid.from(a.p.data);a.p.ignoreCase&&(s=s.ignoreCase());if(a.p.search===true){var n=a.p.postData.filters;if(n){typeof n=="string"&&(n=b.jgrid.parse(n));c(n)}else try{s=
o[a.p.postData.searchOper](s)(a.p.postData.searchField,a.p.postData.searchString,f[a.p.postData.searchField])}catch(p){}}if(a.p.grouping)for(q=0;q<m;q++)s.orderBy(h[q],l.groupOrder[q],g[q].stype,g[q].srcfmt);d&&a.p.sortorder&&e&&(a.p.sortorder.toUpperCase()=="DESC"?s.orderBy(a.p.sortname,"d",f[d].stype,f[d].srcfmt):s.orderBy(a.p.sortname,"a",f[d].stype,f[d].srcfmt));var n=s.select(),u=parseInt(a.p.rowNum,10),t=n.length,v=parseInt(a.p.page,10),x=Math.ceil(t/u),r={},n=n.slice((v-1)*u,v*u),f=s=null;
r[a.p.localReader.total]=x;r[a.p.localReader.page]=v;r[a.p.localReader.records]=t;r[a.p.localReader.root]=n;r[a.p.localReader.userdata]=a.p.userData;n=null;return r}}},ca=function(){a.grid.hDiv.loading=true;if(!a.p.hiddengrid)switch(a.p.loadui){case "enable":b("#load_"+b.jgrid.jqID(a.p.id)).show();break;case "block":b("#lui_"+b.jgrid.jqID(a.p.id)).show();b("#load_"+b.jgrid.jqID(a.p.id)).show()}},O=function(){a.grid.hDiv.loading=false;switch(a.p.loadui){case "enable":b("#load_"+b.jgrid.jqID(a.p.id)).hide();
break;case "block":b("#lui_"+b.jgrid.jqID(a.p.id)).hide();b("#load_"+b.jgrid.jqID(a.p.id)).hide()}},I=function(c){if(!a.grid.hDiv.loading){var d=a.p.scroll&&c===false,e={},f,g=a.p.prmNames;if(a.p.page<=0)a.p.page=1;if(g.search!==null)e[g.search]=a.p.search;g.nd!==null&&(e[g.nd]=(new Date).getTime());if(g.rows!==null)e[g.rows]=a.p.rowNum;if(g.page!==null)e[g.page]=a.p.page;if(g.sort!==null)e[g.sort]=a.p.sortname;if(g.order!==null)e[g.order]=a.p.sortorder;if(a.p.rowTotal!==null&&g.totalrows!==null)e[g.totalrows]=
a.p.rowTotal;var h=b.isFunction(a.p.loadComplete),i=h?a.p.loadComplete:null,j=0,c=c||1;if(c>1)if(g.npage!==null){e[g.npage]=c;j=c-1;c=1}else i=function(b){a.p.page++;a.grid.hDiv.loading=false;h&&a.p.loadComplete.call(a,b);I(c-1)};else g.npage!==null&&delete a.p.postData[g.npage];if(a.p.grouping){b(a).jqGrid("groupingSetup");var k=a.p.groupingView,l,m="";for(l=0;l<k.groupField.length;l++)m=m+(k.groupField[l]+" "+k.groupOrder[l]+", ");e[g.sort]=m+e[g.sort]}b.extend(a.p.postData,e);var q=!a.p.scroll?
1:a.rows.length-1,e=b(a).triggerHandler("jqGridBeforeRequest");if(!(e===false||e==="stop"))if(b.isFunction(a.p.datatype))a.p.datatype.call(a,a.p.postData,"load_"+a.p.id);else{if(b.isFunction(a.p.beforeRequest)){e=a.p.beforeRequest.call(a);e===void 0&&(e=true);if(e===false)return}f=a.p.datatype.toLowerCase();switch(f){case "json":case "jsonp":case "xml":case "script":b.ajax(b.extend({url:a.p.url,type:a.p.mtype,dataType:f,data:b.isFunction(a.p.serializeGridData)?a.p.serializeGridData.call(a,a.p.postData):
a.p.postData,success:function(e,g,h){if(b.isFunction(a.p.beforeProcessing)&&a.p.beforeProcessing.call(a,e,g,h)===false)O();else{f==="xml"?$(e,a.grid.bDiv,q,c>1,j):aa(e,a.grid.bDiv,q,c>1,j);b(a).triggerHandler("jqGridLoadComplete",[e]);i&&i.call(a,e);b(a).triggerHandler("jqGridAfterLoadComplete",[e]);d&&a.grid.populateVisible();if(a.p.loadonce||a.p.treeGrid)a.p.datatype="local";c===1&&O()}},error:function(d,e,f){b.isFunction(a.p.loadError)&&a.p.loadError.call(a,d,e,f);c===1&&O()},beforeSend:function(c,
d){var e=true;b.isFunction(a.p.loadBeforeSend)&&(e=a.p.loadBeforeSend.call(a,c,d));e===void 0&&(e=true);if(e===false)return false;ca()}},b.jgrid.ajaxOptions,a.p.ajaxGridOptions));break;case "xmlstring":ca();e=b.jgrid.stringToDoc(a.p.datastr);$(e,a.grid.bDiv);b(a).triggerHandler("jqGridLoadComplete",[e]);h&&a.p.loadComplete.call(a,e);b(a).triggerHandler("jqGridAfterLoadComplete",[e]);a.p.datatype="local";a.p.datastr=null;O();break;case "jsonstring":ca();e=typeof a.p.datastr=="string"?b.jgrid.parse(a.p.datastr):
a.p.datastr;aa(e,a.grid.bDiv);b(a).triggerHandler("jqGridLoadComplete",[e]);h&&a.p.loadComplete.call(a,e);b(a).triggerHandler("jqGridAfterLoadComplete",[e]);a.p.datatype="local";a.p.datastr=null;O();break;case "local":case "clientside":ca();a.p.datatype="local";e=ma();aa(e,a.grid.bDiv,q,c>1,j);b(a).triggerHandler("jqGridLoadComplete",[e]);i&&i.call(a,e);b(a).triggerHandler("jqGridAfterLoadComplete",[e]);d&&a.grid.populateVisible();O()}}}},da=function(c){b("#cb_"+b.jgrid.jqID(a.p.id),a.grid.hDiv)[a.p.useProp?
"prop":"attr"]("checked",c);if(a.p.frozenColumns&&a.p.id+"_frozen")b("#cb_"+b.jgrid.jqID(a.p.id),a.grid.fhDiv)[a.p.useProp?"prop":"attr"]("checked",c)};l=function(c,e){var d="",f="<table cellspacing='0' cellpadding='0' border='0' style='table-layout:auto;' class='ui-pg-table'><tbody><tr>",g="",h,j,k,l,m=function(c){var e;b.isFunction(a.p.onPaging)&&(e=a.p.onPaging.call(a,c));a.p.selrow=null;if(a.p.multiselect){a.p.selarrrow=[];da(false)}a.p.savedRow=[];return e=="stop"?false:true},c=c.substr(1),e=
e+("_"+c);h="pg_"+c;j=c+"_left";k=c+"_center";l=c+"_right";b("#"+b.jgrid.jqID(c)).append("<div id='"+h+"' class='ui-pager-control' role='group'><table cellspacing='0' cellpadding='0' border='0' class='ui-pg-table' style='width:100%;table-layout:fixed;height:100%;' role='row'><tbody><tr><td id='"+j+"' align='left'></td><td id='"+k+"' align='center' style='white-space:pre;'></td><td id='"+l+"' align='right'></td></tr></tbody></table></div>").attr("dir","ltr");if(a.p.rowList.length>0){g="<td dir='"+
i+"'>";g=g+"<select class='ui-pg-selbox' role='listbox'>";for(j=0;j<a.p.rowList.length;j++)g=g+('<option role="option" value="'+a.p.rowList[j]+'"'+(a.p.rowNum==a.p.rowList[j]?' selected="selected"':"")+">"+a.p.rowList[j]+"</option>");g=g+"</select></td>"}i=="rtl"&&(f=f+g);a.p.pginput===true&&(d="<td dir='"+i+"'>"+b.jgrid.format(a.p.pgtext||"","<input class='ui-pg-input' type='text' size='2' maxlength='7' value='0' role='textbox'/>","<span id='sp_1_"+b.jgrid.jqID(c)+"'></span>")+"</td>");if(a.p.pgbuttons===
true){j=["first"+e,"prev"+e,"next"+e,"last"+e];i=="rtl"&&j.reverse();f=f+("<td id='"+j[0]+"' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-first'></span></td>");f=f+("<td id='"+j[1]+"' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-prev'></span></td>");f=f+(d!==""?"<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='ui-separator'></span></td>"+d+"<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='ui-separator'></span></td>":
"")+("<td id='"+j[2]+"' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-next'></span></td>");f=f+("<td id='"+j[3]+"' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-end'></span></td>")}else d!==""&&(f=f+d);i=="ltr"&&(f=f+g);f=f+"</tr></tbody></table>";a.p.viewrecords===true&&b("td#"+c+"_"+a.p.recordpos,"#"+h).append("<div dir='"+i+"' style='text-align:"+a.p.recordpos+"' class='ui-paging-info'></div>");b("td#"+c+"_"+a.p.pagerpos,"#"+h).append(f);g=b(".ui-jqgrid").css("font-size")||
"11px";b(document.body).append("<div id='testpg' class='ui-jqgrid ui-widget ui-widget-content' style='font-size:"+g+";visibility:hidden;' ></div>");f=b(f).clone().appendTo("#testpg").width();b("#testpg").remove();if(f>0){d!==""&&(f=f+50);b("td#"+c+"_"+a.p.pagerpos,"#"+h).width(f)}a.p._nvtd=[];a.p._nvtd[0]=f?Math.floor((a.p.width-f)/2):Math.floor(a.p.width/3);a.p._nvtd[1]=0;f=null;b(".ui-pg-selbox","#"+h).bind("change",function(){a.p.page=Math.round(a.p.rowNum*(a.p.page-1)/this.value-0.5)+1;a.p.rowNum=
this.value;a.p.pager&&b(".ui-pg-selbox",a.p.pager).val(this.value);a.p.toppager&&b(".ui-pg-selbox",a.p.toppager).val(this.value);if(!m("records"))return false;I();return false});if(a.p.pgbuttons===true){b(".ui-pg-button","#"+h).hover(function(){if(b(this).hasClass("ui-state-disabled"))this.style.cursor="default";else{b(this).addClass("ui-state-hover");this.style.cursor="pointer"}},function(){if(!b(this).hasClass("ui-state-disabled")){b(this).removeClass("ui-state-hover");this.style.cursor="default"}});
b("#first"+b.jgrid.jqID(e)+", #prev"+b.jgrid.jqID(e)+", #next"+b.jgrid.jqID(e)+", #last"+b.jgrid.jqID(e)).click(function(){var b=o(a.p.page,1),c=o(a.p.lastpage,1),d=false,f=true,g=true,h=true,i=true;if(c===0||c===1)i=h=g=f=false;else if(c>1&&b>=1)if(b===1)g=f=false;else{if(b===c)i=h=false}else if(c>1&&b===0){i=h=false;b=c-1}if(this.id==="first"+e&&f){a.p.page=1;d=true}if(this.id==="prev"+e&&g){a.p.page=b-1;d=true}if(this.id==="next"+e&&h){a.p.page=b+1;d=true}if(this.id==="last"+e&&i){a.p.page=c;d=
true}if(d){if(!m(this.id))return false;I()}return false})}a.p.pginput===true&&b("input.ui-pg-input","#"+h).keypress(function(c){if((c.charCode?c.charCode:c.keyCode?c.keyCode:0)==13){a.p.page=b(this).val()>0?b(this).val():a.p.page;if(!m("user"))return false;I();return false}return this})};var ja=function(c,e,d,f){if(a.p.colModel[e].sortable&&!(a.p.savedRow.length>0)){if(!d){if(a.p.lastsort==e)if(a.p.sortorder=="asc")a.p.sortorder="desc";else{if(a.p.sortorder=="desc")a.p.sortorder="asc"}else a.p.sortorder=
a.p.colModel[e].firstsortorder||"asc";a.p.page=1}if(f){if(a.p.lastsort==e&&a.p.sortorder==f&&!d)return;a.p.sortorder=f}d=a.grid.headers[a.p.lastsort].el;f=a.grid.headers[e].el;b("span.ui-grid-ico-sort",d).addClass("ui-state-disabled");b(d).attr("aria-selected","false");b("span.ui-icon-"+a.p.sortorder,f).removeClass("ui-state-disabled");b(f).attr("aria-selected","true");if(!a.p.viewsortcols[0]&&a.p.lastsort!=e){b("span.s-ico",d).hide();b("span.s-ico",f).show()}c=c.substring(5+a.p.id.length+1);a.p.sortname=
a.p.colModel[e].index||c;d=a.p.sortorder;if(b(a).triggerHandler("jqGridSortCol",[c,e,d])==="stop")a.p.lastsort=e;else if(b.isFunction(a.p.onSortCol)&&a.p.onSortCol.call(a,c,e,d)=="stop")a.p.lastsort=e;else{if(a.p.datatype=="local")a.p.deselectAfterSort&&b(a).jqGrid("resetSelection");else{a.p.selrow=null;a.p.multiselect&&da(false);a.p.selarrrow=[];a.p.savedRow=[]}if(a.p.scroll){d=a.grid.bDiv.scrollLeft;N.call(a,true,false);a.grid.hDiv.scrollLeft=d}a.p.subGrid&&a.p.datatype=="local"&&b("td.sgexpanded",
"#"+b.jgrid.jqID(a.p.id)).each(function(){b(this).trigger("click")});I();a.p.lastsort=e;if(a.p.sortname!=c&&e)a.p.lastsort=e}}},oa=function(c){var e,d={},f=b.jgrid.cellWidth()?0:a.p.cellLayout;for(e=d[0]=d[1]=d[2]=0;e<=c;e++)a.p.colModel[e].hidden===false&&(d[0]=d[0]+(a.p.colModel[e].width+f));a.p.direction=="rtl"&&(d[0]=a.p.width-d[0]);d[0]=d[0]-a.grid.bDiv.scrollLeft;b(a.grid.cDiv).is(":visible")&&(d[1]=d[1]+(b(a.grid.cDiv).height()+parseInt(b(a.grid.cDiv).css("padding-top"),10)+parseInt(b(a.grid.cDiv).css("padding-bottom"),
10)));if(a.p.toolbar[0]===true&&(a.p.toolbar[1]=="top"||a.p.toolbar[1]=="both"))d[1]=d[1]+(b(a.grid.uDiv).height()+parseInt(b(a.grid.uDiv).css("border-top-width"),10)+parseInt(b(a.grid.uDiv).css("border-bottom-width"),10));a.p.toppager&&(d[1]=d[1]+(b(a.grid.topDiv).height()+parseInt(b(a.grid.topDiv).css("border-bottom-width"),10)));d[2]=d[2]+(b(a.grid.bDiv).height()+b(a.grid.hDiv).height());return d},ka=function(c){var d,e=a.grid.headers,f=b.jgrid.getCellIndex(c);for(d=0;d<e.length;d++)if(c===e[d].el){f=
d;break}return f};this.p.id=this.id;-1==b.inArray(a.p.multikey,["shiftKey","altKey","ctrlKey"])&&(a.p.multikey=!1);a.p.keyIndex=!1;for(e=0;e<a.p.colModel.length;e++)a.p.colModel[e]=b.extend(!0,{},a.p.cmTemplate,a.p.colModel[e].template||{},a.p.colModel[e]),!1===a.p.keyIndex&&!0===a.p.colModel[e].key&&(a.p.keyIndex=e);a.p.sortorder=a.p.sortorder.toLowerCase();!0===a.p.grouping&&(a.p.scroll=!1,a.p.rownumbers=!1,a.p.treeGrid=!1,a.p.gridview=!0);if(!0===this.p.treeGrid){try{b(this).jqGrid("setTreeGrid")}catch(qa){}"local"!=
a.p.datatype&&(a.p.localReader={id:"_id_"})}if(this.p.subGrid)try{b(a).jqGrid("setSubGrid")}catch(ra){}this.p.multiselect&&(this.p.colNames.unshift("<input role='checkbox' id='cb_"+this.p.id+"' class='cbox' type='checkbox'/>"),this.p.colModel.unshift({name:"cb",width:b.jgrid.cellWidth()?a.p.multiselectWidth+a.p.cellLayout:a.p.multiselectWidth,sortable:!1,resizable:!1,hidedlg:!0,search:!1,align:"center",fixed:!0}));this.p.rownumbers&&(this.p.colNames.unshift(""),this.p.colModel.unshift({name:"rn",
width:a.p.rownumWidth,sortable:!1,resizable:!1,hidedlg:!0,search:!1,align:"center",fixed:!0}));a.p.xmlReader=b.extend(!0,{root:"rows",row:"row",page:"rows>page",total:"rows>total",records:"rows>records",repeatitems:!0,cell:"cell",id:"[id]",userdata:"userdata",subgrid:{root:"rows",row:"row",repeatitems:!0,cell:"cell"}},a.p.xmlReader);a.p.jsonReader=b.extend(!0,{root:"rows",page:"page",total:"total",records:"records",repeatitems:!0,cell:"cell",id:"id",userdata:"userdata",subgrid:{root:"rows",repeatitems:!0,
cell:"cell"}},a.p.jsonReader);a.p.localReader=b.extend(!0,{root:"rows",page:"page",total:"total",records:"records",repeatitems:!1,cell:"cell",id:"id",userdata:"userdata",subgrid:{root:"rows",repeatitems:!0,cell:"cell"}},a.p.localReader);a.p.scroll&&(a.p.pgbuttons=!1,a.p.pginput=!1,a.p.rowList=[]);a.p.data.length&&S();var x="<thead><tr class='ui-jqgrid-labels' role='rowheader'>",la,L,ea,ba,fa,A,n,W;L=W="";if(!0===a.p.shrinkToFit&&!0===a.p.forceFit)for(e=a.p.colModel.length-1;0<=e;e--)if(!a.p.colModel[e].hidden){a.p.colModel[e].resizable=
!1;break}"horizontal"==a.p.viewsortcols[1]&&(W=" ui-i-asc",L=" ui-i-desc");la=k?"class='ui-th-div-ie'":"";W="<span class='s-ico' style='display:none'><span sort='asc' class='ui-grid-ico-sort ui-icon-asc"+W+" ui-state-disabled ui-icon ui-icon-triangle-1-n ui-sort-"+i+"'></span>"+("<span sort='desc' class='ui-grid-ico-sort ui-icon-desc"+L+" ui-state-disabled ui-icon ui-icon-triangle-1-s ui-sort-"+i+"'></span></span>");for(e=0;e<this.p.colNames.length;e++)L=a.p.headertitles?' title="'+b.jgrid.stripHtml(a.p.colNames[e])+
'"':"",x+="<th id='"+a.p.id+"_"+a.p.colModel[e].name+"' role='columnheader' class='ui-state-default ui-th-column ui-th-"+i+"'"+L+">",L=a.p.colModel[e].index||a.p.colModel[e].name,x+="<div id='jqgh_"+a.p.id+"_"+a.p.colModel[e].name+"' "+la+">"+a.p.colNames[e],a.p.colModel[e].width=a.p.colModel[e].width?parseInt(a.p.colModel[e].width,10):150,"boolean"!==typeof a.p.colModel[e].title&&(a.p.colModel[e].title=!0),L==a.p.sortname&&(a.p.lastsort=e),x+=W+"</div></th>";W=null;b(this).append(x+"</tr></thead>");
b("thead tr:first th",this).hover(function(){b(this).addClass("ui-state-hover")},function(){b(this).removeClass("ui-state-hover")});if(this.p.multiselect){var ga=[],X;b("#cb_"+b.jgrid.jqID(a.p.id),this).bind("click",function(){a.p.selarrrow=[];var c=a.p.frozenColumns===true?a.p.id+"_frozen":"";if(this.checked){b(a.rows).each(function(d){if(d>0&&!b(this).hasClass("ui-subgrid")&&!b(this).hasClass("jqgroup")&&!b(this).hasClass("ui-state-disabled")){b("#jqg_"+b.jgrid.jqID(a.p.id)+"_"+b.jgrid.jqID(this.id))[a.p.useProp?
"prop":"attr"]("checked",true);b(this).addClass("ui-state-highlight").attr("aria-selected","true");a.p.selarrrow.push(this.id);a.p.selrow=this.id;if(c){b("#jqg_"+b.jgrid.jqID(a.p.id)+"_"+b.jgrid.jqID(this.id),a.grid.fbDiv)[a.p.useProp?"prop":"attr"]("checked",true);b("#"+b.jgrid.jqID(this.id),a.grid.fbDiv).addClass("ui-state-highlight")}}});X=true;ga=[]}else{b(a.rows).each(function(d){if(d>0&&!b(this).hasClass("ui-subgrid")&&!b(this).hasClass("ui-state-disabled")){b("#jqg_"+b.jgrid.jqID(a.p.id)+"_"+
b.jgrid.jqID(this.id))[a.p.useProp?"prop":"attr"]("checked",false);b(this).removeClass("ui-state-highlight").attr("aria-selected","false");ga.push(this.id);if(c){b("#jqg_"+b.jgrid.jqID(a.p.id)+"_"+b.jgrid.jqID(this.id),a.grid.fbDiv)[a.p.useProp?"prop":"attr"]("checked",false);b("#"+b.jgrid.jqID(this.id),a.grid.fbDiv).removeClass("ui-state-highlight")}}});a.p.selrow=null;X=false}b(a).triggerHandler("jqGridSelectAll",[X?a.p.selarrrow:ga,X]);b.isFunction(a.p.onSelectAll)&&a.p.onSelectAll.call(a,X?a.p.selarrrow:
ga,X)})}!0===a.p.autowidth&&(x=b(m).innerWidth(),a.p.width=0<x?x:"nw");(function(){var d=0,e=b.jgrid.cellWidth()?0:o(a.p.cellLayout,0),f=0,g,i=o(a.p.scrollOffset,0),j,k=false,l,m=0,n=0,p;b.each(a.p.colModel,function(){if(typeof this.hidden==="undefined")this.hidden=false;this.widthOrg=j=o(this.width,0);if(this.hidden===false){d=d+(j+e);this.fixed?m=m+(j+e):f++;n++}});if(isNaN(a.p.width))a.p.width=d+(a.p.shrinkToFit===false&&!isNaN(a.p.height)?i:0);c.width=a.p.width;a.p.tblwidth=d;if(a.p.shrinkToFit===
false&&a.p.forceFit===true)a.p.forceFit=false;if(a.p.shrinkToFit===true&&f>0){l=c.width-e*f-m;if(!isNaN(a.p.height)){l=l-i;k=true}d=0;b.each(a.p.colModel,function(b){if(this.hidden===false&&!this.fixed){this.width=j=Math.round(l*this.width/(a.p.tblwidth-e*f-m));d=d+j;g=b}});p=0;k?c.width-m-(d+e*f)!==i&&(p=c.width-m-(d+e*f)-i):!k&&Math.abs(c.width-m-(d+e*f))!==1&&(p=c.width-m-(d+e*f));a.p.colModel[g].width=a.p.colModel[g].width+p;a.p.tblwidth=d+p+e*f+m;if(a.p.tblwidth>a.p.width){a.p.colModel[g].width=
a.p.colModel[g].width-(a.p.tblwidth-parseInt(a.p.width,10));a.p.tblwidth=a.p.width}}})();b(m).css("width",c.width+"px").append("<div class='ui-jqgrid-resize-mark' id='rs_m"+a.p.id+"'>&#160;</div>");b(j).css("width",c.width+"px");var x=b("thead:first",a).get(0),R="";a.p.footerrow&&(R+="<table role='grid' style='width:"+a.p.tblwidth+"px' class='ui-jqgrid-ftable' cellspacing='0' cellpadding='0' border='0'><tbody><tr role='row' class='ui-widget-content footrow footrow-"+i+"'>");var j=b("tr:first",x),
Y="<tr class='jqgfirstrow' role='row' style='height:auto'>";a.p.disableClick=!1;b("th",j).each(function(d){ea=a.p.colModel[d].width;if(typeof a.p.colModel[d].resizable==="undefined")a.p.colModel[d].resizable=true;if(a.p.colModel[d].resizable){ba=document.createElement("span");b(ba).html("&#160;").addClass("ui-jqgrid-resize ui-jqgrid-resize-"+i);b.browser.opera||b(ba).css("cursor","col-resize");b(this).addClass(a.p.resizeclass)}else ba="";b(this).css("width",ea+"px").prepend(ba);var e="";if(a.p.colModel[d].hidden){b(this).css("display",
"none");e="display:none;"}Y=Y+("<td role='gridcell' style='height:0px;width:"+ea+"px;"+e+"'></td>");c.headers[d]={width:ea,el:this};fa=a.p.colModel[d].sortable;if(typeof fa!=="boolean")fa=a.p.colModel[d].sortable=true;e=a.p.colModel[d].name;e=="cb"||e=="subgrid"||e=="rn"||a.p.viewsortcols[2]&&b(">div",this).addClass("ui-jqgrid-sortable");if(fa)if(a.p.viewsortcols[0]){b("div span.s-ico",this).show();d==a.p.lastsort&&b("div span.ui-icon-"+a.p.sortorder,this).removeClass("ui-state-disabled")}else if(d==
a.p.lastsort){b("div span.s-ico",this).show();b("div span.ui-icon-"+a.p.sortorder,this).removeClass("ui-state-disabled")}a.p.footerrow&&(R=R+("<td role='gridcell' "+p(d,0,"",null,"",false)+">&#160;</td>"))}).mousedown(function(d){if(b(d.target).closest("th>span.ui-jqgrid-resize").length==1){var e=ka(this);if(a.p.forceFit===true){var f=a.p,g=e,i;for(i=e+1;i<a.p.colModel.length;i++)if(a.p.colModel[i].hidden!==true){g=i;break}f.nv=g-e}c.dragStart(e,d,oa(e));return false}}).click(function(c){if(a.p.disableClick)return a.p.disableClick=
false;var d="th>div.ui-jqgrid-sortable",e,f;a.p.viewsortcols[2]||(d="th>div>span>span.ui-grid-ico-sort");c=b(c.target).closest(d);if(c.length==1){d=ka(this);if(!a.p.viewsortcols[2]){e=true;f=c.attr("sort")}ja(b("div",this)[0].id,d,e,f);return false}});if(a.p.sortable&&b.fn.sortable)try{b(a).jqGrid("sortableColumns",j)}catch(sa){}a.p.footerrow&&(R+="</tr></tbody></table>");Y+="</tr>";this.appendChild(document.createElement("tbody"));b(this).addClass("ui-jqgrid-btable").append(Y);var Y=null,j=b("<table class='ui-jqgrid-htable' style='width:"+
a.p.tblwidth+"px' role='grid' aria-labelledby='gbox_"+this.id+"' cellspacing='0' cellpadding='0' border='0'></table>").append(x),D=a.p.caption&&!0===a.p.hiddengrid?!0:!1;e=b("<div class='ui-jqgrid-hbox"+("rtl"==i?"-rtl":"")+"'></div>");x=null;c.hDiv=document.createElement("div");b(c.hDiv).css({width:c.width+"px"}).addClass("ui-state-default ui-jqgrid-hdiv").append(e);b(e).append(j);j=null;D&&b(c.hDiv).hide();a.p.pager&&("string"==typeof a.p.pager?"#"!=a.p.pager.substr(0,1)&&(a.p.pager="#"+a.p.pager):
a.p.pager="#"+b(a.p.pager).attr("id"),b(a.p.pager).css({width:c.width+"px"}).appendTo(m).addClass("ui-state-default ui-jqgrid-pager ui-corner-bottom"),D&&b(a.p.pager).hide(),l(a.p.pager,""));!1===a.p.cellEdit&&!0===a.p.hoverrows&&b(a).bind("mouseover",function(a){n=b(a.target).closest("tr.jqgrow");b(n).attr("class")!=="ui-subgrid"&&b(n).addClass("ui-state-hover")}).bind("mouseout",function(a){n=b(a.target).closest("tr.jqgrow");b(n).removeClass("ui-state-hover")});var t,E,ha;b(a).before(c.hDiv).click(function(c){A=
c.target;n=b(A,a.rows).closest("tr.jqgrow");if(b(n).length===0||n[0].className.indexOf("ui-state-disabled")>-1||(b(A,a).closest("table.ui-jqgrid-btable").attr("id")||"").replace("_frozen","")!==a.id)return this;var d=b(A).hasClass("cbox"),e=b(a).triggerHandler("jqGridBeforeSelectRow",[n[0].id,c]);(e=e===false||e==="stop"?false:true)&&b.isFunction(a.p.beforeSelectRow)&&(e=a.p.beforeSelectRow.call(a,n[0].id,c));if(!(A.tagName=="A"||(A.tagName=="INPUT"||A.tagName=="TEXTAREA"||A.tagName=="OPTION"||A.tagName==
"SELECT")&&!d)&&e===true){t=n[0].id;E=b.jgrid.getCellIndex(A);ha=b(A).closest("td,th").html();b(a).triggerHandler("jqGridCellSelect",[t,E,ha,c]);b.isFunction(a.p.onCellSelect)&&a.p.onCellSelect.call(a,t,E,ha,c);if(a.p.cellEdit===true)if(a.p.multiselect&&d)b(a).jqGrid("setSelection",t,true,c);else{t=n[0].rowIndex;try{b(a).jqGrid("editCell",t,E,true)}catch(f){}}else if(a.p.multikey)if(c[a.p.multikey])b(a).jqGrid("setSelection",t,true,c);else{if(a.p.multiselect&&d){d=b("#jqg_"+b.jgrid.jqID(a.p.id)+"_"+
t).is(":checked");b("#jqg_"+b.jgrid.jqID(a.p.id)+"_"+t)[a.p.useProp?"prop":"attr"]("checked",d)}}else{if(a.p.multiselect&&a.p.multiboxonly&&!d){var g=a.p.frozenColumns?a.p.id+"_frozen":"";b(a.p.selarrrow).each(function(c,d){var e=a.rows.namedItem(d);b(e).removeClass("ui-state-highlight");b("#jqg_"+b.jgrid.jqID(a.p.id)+"_"+b.jgrid.jqID(d))[a.p.useProp?"prop":"attr"]("checked",false);if(g){b("#"+b.jgrid.jqID(d),"#"+b.jgrid.jqID(g)).removeClass("ui-state-highlight");b("#jqg_"+b.jgrid.jqID(a.p.id)+"_"+
b.jgrid.jqID(d),"#"+b.jgrid.jqID(g))[a.p.useProp?"prop":"attr"]("checked",false)}});a.p.selarrrow=[]}b(a).jqGrid("setSelection",t,true,c)}}}).bind("reloadGrid",function(c,d){if(a.p.treeGrid===true)a.p.datatype=a.p.treedatatype;d&&d.current&&a.grid.selectionPreserver(a);if(a.p.datatype=="local"){b(a).jqGrid("resetSelection");a.p.data.length&&S()}else if(!a.p.treeGrid){a.p.selrow=null;if(a.p.multiselect){a.p.selarrrow=[];da(false)}a.p.savedRow=[]}a.p.scroll&&N.call(a,true,false);if(d&&d.page){var e=
d.page;if(e>a.p.lastpage)e=a.p.lastpage;e<1&&(e=1);a.p.page=e;a.grid.bDiv.scrollTop=a.grid.prevRowHeight?(e-1)*a.grid.prevRowHeight*a.p.rowNum:0}if(a.grid.prevRowHeight&&a.p.scroll){delete a.p.lastpage;a.grid.populateVisible()}else a.grid.populate();a.p._inlinenav===true&&b(a).jqGrid("showAddEditButtons");return false}).dblclick(function(c){A=c.target;n=b(A,a.rows).closest("tr.jqgrow");if(b(n).length!==0){t=n[0].rowIndex;E=b.jgrid.getCellIndex(A);b(a).triggerHandler("jqGridDblClickRow",[b(n).attr("id"),
t,E,c]);b.isFunction(this.p.ondblClickRow)&&a.p.ondblClickRow.call(a,b(n).attr("id"),t,E,c)}}).bind("contextmenu",function(c){A=c.target;n=b(A,a.rows).closest("tr.jqgrow");if(b(n).length!==0){a.p.multiselect||b(a).jqGrid("setSelection",n[0].id,true,c);t=n[0].rowIndex;E=b.jgrid.getCellIndex(A);b(a).triggerHandler("jqGridRightClickRow",[b(n).attr("id"),t,E,c]);b.isFunction(this.p.onRightClickRow)&&a.p.onRightClickRow.call(a,b(n).attr("id"),t,E,c)}});c.bDiv=document.createElement("div");k&&"auto"===
(""+a.p.height).toLowerCase()&&(a.p.height="100%");b(c.bDiv).append(b('<div style="position:relative;'+(k&&8>b.browser.version?"height:0.01%;":"")+'"></div>').append("<div></div>").append(this)).addClass("ui-jqgrid-bdiv").css({height:a.p.height+(isNaN(a.p.height)?"":"px"),width:c.width+"px"}).scroll(c.scrollGrid);b("table:first",c.bDiv).css({width:a.p.tblwidth+"px"});k?(2==b("tbody",this).size()&&b("tbody:gt(0)",this).remove(),a.p.multikey&&b(c.bDiv).bind("selectstart",function(){return false})):
a.p.multikey&&b(c.bDiv).bind("mousedown",function(){return false});D&&b(c.bDiv).hide();c.cDiv=document.createElement("div");var ia=!0===a.p.hidegrid?b("<a role='link' href='javascript:void(0)'/>").addClass("ui-jqgrid-titlebar-close HeaderButton").hover(function(){ia.addClass("ui-state-hover")},function(){ia.removeClass("ui-state-hover")}).append("<span class='ui-icon ui-icon-circle-triangle-n'></span>").css("rtl"==i?"left":"right","0px"):"";b(c.cDiv).append(ia).append("<span class='ui-jqgrid-title"+
("rtl"==i?"-rtl":"")+"'>"+a.p.caption+"</span>").addClass("ui-jqgrid-titlebar ui-widget-header ui-corner-top ui-helper-clearfix");b(c.cDiv).insertBefore(c.hDiv);a.p.toolbar[0]&&(c.uDiv=document.createElement("div"),"top"==a.p.toolbar[1]?b(c.uDiv).insertBefore(c.hDiv):"bottom"==a.p.toolbar[1]&&b(c.uDiv).insertAfter(c.hDiv),"both"==a.p.toolbar[1]?(c.ubDiv=document.createElement("div"),b(c.uDiv).insertBefore(c.hDiv).addClass("ui-userdata ui-state-default").attr("id","t_"+this.id),b(c.ubDiv).insertAfter(c.hDiv).addClass("ui-userdata ui-state-default").attr("id",
"tb_"+this.id),D&&b(c.ubDiv).hide()):b(c.uDiv).width(c.width).addClass("ui-userdata ui-state-default").attr("id","t_"+this.id),D&&b(c.uDiv).hide());a.p.toppager&&(a.p.toppager=b.jgrid.jqID(a.p.id)+"_toppager",c.topDiv=b("<div id='"+a.p.toppager+"'></div>")[0],a.p.toppager="#"+a.p.toppager,b(c.topDiv).insertBefore(c.hDiv).addClass("ui-state-default ui-jqgrid-toppager").width(c.width),l(a.p.toppager,"_t"));a.p.footerrow&&(c.sDiv=b("<div class='ui-jqgrid-sdiv'></div>")[0],e=b("<div class='ui-jqgrid-hbox"+
("rtl"==i?"-rtl":"")+"'></div>"),b(c.sDiv).append(e).insertAfter(c.hDiv).width(c.width),b(e).append(R),c.footers=b(".ui-jqgrid-ftable",c.sDiv)[0].rows[0].cells,a.p.rownumbers&&(c.footers[0].className="ui-state-default jqgrid-rownum"),D&&b(c.sDiv).hide());e=null;if(a.p.caption){var pa=a.p.datatype;!0===a.p.hidegrid&&(b(".ui-jqgrid-titlebar-close",c.cDiv).click(function(d){var e=b.isFunction(a.p.onHeaderClick),f=".ui-jqgrid-bdiv, .ui-jqgrid-hdiv, .ui-jqgrid-pager, .ui-jqgrid-sdiv",g,i=this;if(a.p.toolbar[0]===
true){a.p.toolbar[1]=="both"&&(f=f+(", #"+b(c.ubDiv).attr("id")));f=f+(", #"+b(c.uDiv).attr("id"))}g=b(f,"#gview_"+b.jgrid.jqID(a.p.id)).length;a.p.gridstate=="visible"?b(f,"#gbox_"+b.jgrid.jqID(a.p.id)).slideUp("fast",function(){g--;if(g===0){b("span",i).removeClass("ui-icon-circle-triangle-n").addClass("ui-icon-circle-triangle-s");a.p.gridstate="hidden";b("#gbox_"+b.jgrid.jqID(a.p.id)).hasClass("ui-resizable")&&b(".ui-resizable-handle","#gbox_"+b.jgrid.jqID(a.p.id)).hide();b(a).triggerHandler("jqGridHeaderClick",
[a.p.gridstate,d]);e&&(D||a.p.onHeaderClick.call(a,a.p.gridstate,d))}}):a.p.gridstate=="hidden"&&b(f,"#gbox_"+b.jgrid.jqID(a.p.id)).slideDown("fast",function(){g--;if(g===0){b("span",i).removeClass("ui-icon-circle-triangle-s").addClass("ui-icon-circle-triangle-n");if(D){a.p.datatype=pa;I();D=false}a.p.gridstate="visible";b("#gbox_"+b.jgrid.jqID(a.p.id)).hasClass("ui-resizable")&&b(".ui-resizable-handle","#gbox_"+b.jgrid.jqID(a.p.id)).show();b(a).triggerHandler("jqGridHeaderClick",[a.p.gridstate,d]);
e&&(D||a.p.onHeaderClick.call(a,a.p.gridstate,d))}});return false}),D&&(a.p.datatype="local",b(".ui-jqgrid-titlebar-close",c.cDiv).trigger("click")))}else b(c.cDiv).hide();b(c.hDiv).after(c.bDiv).mousemove(function(a){if(c.resizing){c.dragMove(a);return false}});b(".ui-jqgrid-labels",c.hDiv).bind("selectstart",function(){return false});b(document).mouseup(function(){if(c.resizing){c.dragEnd();return false}return true});a.formatCol=p;a.sortData=ja;a.updatepager=function(c,d){var e,f,g,h,i,j,k,l="",
m=a.p.pager?"_"+b.jgrid.jqID(a.p.pager.substr(1)):"",n=a.p.toppager?"_"+a.p.toppager.substr(1):"";g=parseInt(a.p.page,10)-1;g<0&&(g=0);g=g*parseInt(a.p.rowNum,10);i=g+a.p.reccount;if(a.p.scroll){e=b("tbody:first > tr:gt(0)",a.grid.bDiv);g=i-e.length;a.p.reccount=e.length;if(f=e.outerHeight()||a.grid.prevRowHeight){e=g*f;f=parseInt(a.p.records,10)*f;b(">div:first",a.grid.bDiv).css({height:f}).children("div:first").css({height:e,display:e?"":"none"})}a.grid.bDiv.scrollLeft=a.grid.hDiv.scrollLeft}l=
a.p.pager?a.p.pager:"";if(l=l+(a.p.toppager?l?","+a.p.toppager:a.p.toppager:"")){k=b.jgrid.formatter.integer||{};e=o(a.p.page);f=o(a.p.lastpage);b(".selbox",l)[this.p.useProp?"prop":"attr"]("disabled",false);if(a.p.pginput===true){b(".ui-pg-input",l).val(a.p.page);h=a.p.toppager?"#sp_1"+m+",#sp_1"+n:"#sp_1"+m;b(h).html(b.fmatter?b.fmatter.util.NumberFormat(a.p.lastpage,k):a.p.lastpage)}if(a.p.viewrecords)if(a.p.reccount===0)b(".ui-paging-info",l).html(a.p.emptyrecords);else{h=g+1;j=a.p.records;if(b.fmatter){h=
b.fmatter.util.NumberFormat(h,k);i=b.fmatter.util.NumberFormat(i,k);j=b.fmatter.util.NumberFormat(j,k)}b(".ui-paging-info",l).html(b.jgrid.format(a.p.recordtext,h,i,j))}if(a.p.pgbuttons===true){e<=0&&(e=f=0);if(e==1||e===0){b("#first"+m+", #prev"+m).addClass("ui-state-disabled").removeClass("ui-state-hover");a.p.toppager&&b("#first_t"+n+", #prev_t"+n).addClass("ui-state-disabled").removeClass("ui-state-hover")}else{b("#first"+m+", #prev"+m).removeClass("ui-state-disabled");a.p.toppager&&b("#first_t"+
n+", #prev_t"+n).removeClass("ui-state-disabled")}if(e==f||e===0){b("#next"+m+", #last"+m).addClass("ui-state-disabled").removeClass("ui-state-hover");a.p.toppager&&b("#next_t"+n+", #last_t"+n).addClass("ui-state-disabled").removeClass("ui-state-hover")}else{b("#next"+m+", #last"+m).removeClass("ui-state-disabled");a.p.toppager&&b("#next_t"+n+", #last_t"+n).removeClass("ui-state-disabled")}}}c===true&&a.p.rownumbers===true&&b("td.jqgrid-rownum",a.rows).each(function(a){b(this).html(g+1+a)});d&&a.p.jqgdnd&&
b(a).jqGrid("gridDnD","updateDnD");b(a).triggerHandler("jqGridGridComplete");b.isFunction(a.p.gridComplete)&&a.p.gridComplete.call(a);b(a).triggerHandler("jqGridAfterGridComplete")};a.refreshIndex=S;a.setHeadCheckBox=da;a.constructTr=J;a.formatter=function(a,b,c,d,e){return u(a,b,c,d,e)};b.extend(c,{populate:I,emptyRows:N});this.grid=c;a.addXmlData=function(b){$(b,a.grid.bDiv)};a.addJSONData=function(b){aa(b,a.grid.bDiv)};this.grid.cols=this.rows[0].cells;I();a.p.hiddengrid=!1;b(window).unload(function(){a=
null})}}}})};b.jgrid.extend({getGridParam:function(b){var e=this[0];return!e||!e.grid?void 0:b?"undefined"!=typeof e.p[b]?e.p[b]:null:e.p},setGridParam:function(f){return this.each(function(){this.grid&&"object"===typeof f&&b.extend(!0,this.p,f)})},getDataIDs:function(){var f=[],e=0,c,d=0;this.each(function(){if((c=this.rows.length)&&0<c)for(;e<c;)b(this.rows[e]).hasClass("jqgrow")&&(f[d]=this.rows[e].id,d++),e++});return f},setSelection:function(f,e,c){return this.each(function(){var d,a,h,g,i,j;
if(void 0!==f&&(e=!1===e?!1:!0,(a=this.rows.namedItem(f+""))&&a.className&&!(-1<a.className.indexOf("ui-state-disabled"))))(!0===this.p.scrollrows&&(h=this.rows.namedItem(f).rowIndex,0<=h&&(d=b(this.grid.bDiv)[0].clientHeight,g=b(this.grid.bDiv)[0].scrollTop,i=this.rows[h].offsetTop,h=this.rows[h].clientHeight,i+h>=d+g?b(this.grid.bDiv)[0].scrollTop=i-(d+g)+h+g:i<d+g&&i<g&&(b(this.grid.bDiv)[0].scrollTop=i))),!0===this.p.frozenColumns&&(j=this.p.id+"_frozen"),this.p.multiselect)?(this.setHeadCheckBox(!1),
this.p.selrow=a.id,g=b.inArray(this.p.selrow,this.p.selarrrow),-1===g?("ui-subgrid"!==a.className&&b(a).addClass("ui-state-highlight").attr("aria-selected","true"),d=!0,this.p.selarrrow.push(this.p.selrow)):("ui-subgrid"!==a.className&&b(a).removeClass("ui-state-highlight").attr("aria-selected","false"),d=!1,this.p.selarrrow.splice(g,1),i=this.p.selarrrow[0],this.p.selrow=void 0===i?null:i),b("#jqg_"+b.jgrid.jqID(this.p.id)+"_"+b.jgrid.jqID(a.id))[this.p.useProp?"prop":"attr"]("checked",d),j&&(-1===
g?b("#"+b.jgrid.jqID(f),"#"+b.jgrid.jqID(j)).addClass("ui-state-highlight"):b("#"+b.jgrid.jqID(f),"#"+b.jgrid.jqID(j)).removeClass("ui-state-highlight"),b("#jqg_"+b.jgrid.jqID(this.p.id)+"_"+b.jgrid.jqID(f),"#"+b.jgrid.jqID(j))[this.p.useProp?"prop":"attr"]("checked",d)),b(this).triggerHandler("jqGridSelectRow",[a.id,d,c]),this.p.onSelectRow&&e&&this.p.onSelectRow.call(this,a.id,d,c)):"ui-subgrid"!==a.className&&(this.p.selrow!=a.id?(b(this.rows.namedItem(this.p.selrow)).removeClass("ui-state-highlight").attr({"aria-selected":"false",
tabindex:"-1"}),b(a).addClass("ui-state-highlight").attr({"aria-selected":"true",tabindex:"0"}),j&&(b("#"+b.jgrid.jqID(this.p.selrow),"#"+b.jgrid.jqID(j)).removeClass("ui-state-highlight"),b("#"+b.jgrid.jqID(f),"#"+b.jgrid.jqID(j)).addClass("ui-state-highlight")),d=!0):d=!1,this.p.selrow=a.id,b(this).triggerHandler("jqGridSelectRow",[a.id,d,c]),this.p.onSelectRow&&e&&this.p.onSelectRow.call(this,a.id,d,c))})},resetSelection:function(f){return this.each(function(){var e=this,c,d,a;!0===e.p.frozenColumns&&
(a=e.p.id+"_frozen");if("undefined"!==typeof f){d=f===e.p.selrow?e.p.selrow:f;b("#"+b.jgrid.jqID(e.p.id)+" tbody:first tr#"+b.jgrid.jqID(d)).removeClass("ui-state-highlight").attr("aria-selected","false");a&&b("#"+b.jgrid.jqID(d),"#"+b.jgrid.jqID(a)).removeClass("ui-state-highlight");if(e.p.multiselect){b("#jqg_"+b.jgrid.jqID(e.p.id)+"_"+b.jgrid.jqID(d),"#"+b.jgrid.jqID(e.p.id))[e.p.useProp?"prop":"attr"]("checked",!1);if(a)b("#jqg_"+b.jgrid.jqID(e.p.id)+"_"+b.jgrid.jqID(d),"#"+b.jgrid.jqID(a))[e.p.useProp?
"prop":"attr"]("checked",!1);e.setHeadCheckBox(!1)}d=null}else e.p.multiselect?(b(e.p.selarrrow).each(function(d,f){c=e.rows.namedItem(f);b(c).removeClass("ui-state-highlight").attr("aria-selected","false");b("#jqg_"+b.jgrid.jqID(e.p.id)+"_"+b.jgrid.jqID(f))[e.p.useProp?"prop":"attr"]("checked",!1);a&&(b("#"+b.jgrid.jqID(f),"#"+b.jgrid.jqID(a)).removeClass("ui-state-highlight"),b("#jqg_"+b.jgrid.jqID(e.p.id)+"_"+b.jgrid.jqID(f),"#"+b.jgrid.jqID(a))[e.p.useProp?"prop":"attr"]("checked",!1))}),e.setHeadCheckBox(!1),
e.p.selarrrow=[]):e.p.selrow&&(b("#"+b.jgrid.jqID(e.p.id)+" tbody:first tr#"+b.jgrid.jqID(e.p.selrow)).removeClass("ui-state-highlight").attr("aria-selected","false"),a&&b("#"+b.jgrid.jqID(e.p.selrow),"#"+b.jgrid.jqID(a)).removeClass("ui-state-highlight"),e.p.selrow=null);!0===e.p.cellEdit&&0<=parseInt(e.p.iCol,10)&&0<=parseInt(e.p.iRow,10)&&(b("td:eq("+e.p.iCol+")",e.rows[e.p.iRow]).removeClass("edit-cell ui-state-highlight"),b(e.rows[e.p.iRow]).removeClass("selected-row ui-state-hover"));e.p.savedRow=
[]})},getRowData:function(f){var e={},c,d=!1,a,h=0;this.each(function(){var g=this,i,j;if("undefined"==typeof f)d=!0,c=[],a=g.rows.length;else{j=g.rows.namedItem(f);if(!j)return e;a=2}for(;h<a;)d&&(j=g.rows[h]),b(j).hasClass("jqgrow")&&(b('td[role="gridcell"]',j).each(function(a){i=g.p.colModel[a].name;if("cb"!==i&&"subgrid"!==i&&"rn"!==i)if(!0===g.p.treeGrid&&i==g.p.ExpandColumn)e[i]=b.jgrid.htmlDecode(b("span:first",this).html());else try{e[i]=b.unformat.call(g,this,{rowId:j.id,colModel:g.p.colModel[a]},
a)}catch(c){e[i]=b.jgrid.htmlDecode(b(this).html())}}),d&&(c.push(e),e={})),h++});return c?c:e},delRowData:function(f){var e=!1,c,d;this.each(function(){if(c=this.rows.namedItem(f)){if(b(c).remove(),this.p.records--,this.p.reccount--,this.updatepager(!0,!1),e=!0,this.p.multiselect&&(d=b.inArray(f,this.p.selarrrow),-1!=d&&this.p.selarrrow.splice(d,1)),f==this.p.selrow)this.p.selrow=null}else return!1;if("local"==this.p.datatype){var a=this.p._index[b.jgrid.stripPref(this.p.idPrefix,f)];"undefined"!=
typeof a&&(this.p.data.splice(a,1),this.refreshIndex())}if(!0===this.p.altRows&&e){var h=this.p.altclass;b(this.rows).each(function(a){1==a%2?b(this).addClass(h):b(this).removeClass(h)})}});return e},setRowData:function(f,e,c){var d,a=!0,h;this.each(function(){if(!this.grid)return!1;var g=this,i,j,l=typeof c,k={};j=g.rows.namedItem(f);if(!j)return!1;if(e)try{if(b(this.p.colModel).each(function(a){d=this.name;void 0!==e[d]&&(k[d]=this.formatter&&"string"===typeof this.formatter&&"date"==this.formatter?
b.unformat.date.call(g,e[d],this):e[d],i=g.formatter(f,e[d],a,e,"edit"),h=this.title?{title:b.jgrid.stripHtml(i)}:{},!0===g.p.treeGrid&&d==g.p.ExpandColumn?b("td:eq("+a+") > span:first",j).html(i).attr(h):b("td:eq("+a+")",j).html(i).attr(h))}),"local"==g.p.datatype){var m=b.jgrid.stripPref(g.p.idPrefix,f),o=g.p._index[m];if(g.p.treeGrid)for(var p in g.p.treeReader)k.hasOwnProperty(g.p.treeReader[p])&&delete k[g.p.treeReader[p]];"undefined"!=typeof o&&(g.p.data[o]=b.extend(!0,g.p.data[o],k));k=null}}catch(v){a=
!1}a&&("string"===l?b(j).addClass(c):"object"===l&&b(j).css(c),b(g).triggerHandler("jqGridAfterGridComplete"))});return a},addRowData:function(f,e,c,d){c||(c="last");var a=!1,h,g,i,j,l,k,m,o,p="",v,u,M,F,Z,U;e&&(b.isArray(e)?(v=!0,c="last",u=f):(e=[e],v=!1),this.each(function(){var V=e.length;l=this.p.rownumbers===true?1:0;i=this.p.multiselect===true?1:0;j=this.p.subGrid===true?1:0;if(!v)if(typeof f!="undefined")f=f+"";else{f=b.jgrid.randId();if(this.p.keyIndex!==false){u=this.p.colModel[this.p.keyIndex+
i+j+l].name;typeof e[0][u]!="undefined"&&(f=e[0][u])}}M=this.p.altclass;for(var N=0,S="",J={},$=b.isFunction(this.p.afterInsertRow)?true:false;N<V;){F=e[N];g=[];if(v){try{f=F[u]}catch(aa){f=b.jgrid.randId()}S=this.p.altRows===true?(this.rows.length-1)%2===0?M:"":""}U=f;f=this.p.idPrefix+f;if(l){p=this.formatCol(0,1,"",null,f,true);g[g.length]='<td role="gridcell" class="ui-state-default jqgrid-rownum" '+p+">0</td>"}if(i){o='<input role="checkbox" type="checkbox" id="jqg_'+this.p.id+"_"+f+'" class="cbox"/>';
p=this.formatCol(l,1,"",null,f,true);g[g.length]='<td role="gridcell" '+p+">"+o+"</td>"}j&&(g[g.length]=b(this).jqGrid("addSubGridCell",i+l,1));for(m=i+j+l;m<this.p.colModel.length;m++){Z=this.p.colModel[m];h=Z.name;J[h]=F[h];o=this.formatter(f,b.jgrid.getAccessor(F,h),m,F);p=this.formatCol(m,1,o,F,f,true);g[g.length]='<td role="gridcell" '+p+">"+o+"</td>"}g.unshift(this.constructTr(f,false,S,J,J));g[g.length]="</tr>";if(this.rows.length===0)b("table:first",this.grid.bDiv).append(g.join(""));else switch(c){case "last":b(this.rows[this.rows.length-
1]).after(g.join(""));k=this.rows.length-1;break;case "first":b(this.rows[0]).after(g.join(""));k=1;break;case "after":(k=this.rows.namedItem(d))&&(b(this.rows[k.rowIndex+1]).hasClass("ui-subgrid")?b(this.rows[k.rowIndex+1]).after(g):b(k).after(g.join("")));k++;break;case "before":if(k=this.rows.namedItem(d)){b(k).before(g.join(""));k=k.rowIndex}k--}this.p.subGrid===true&&b(this).jqGrid("addSubGrid",i+l,k);this.p.records++;this.p.reccount++;b(this).triggerHandler("jqGridAfterInsertRow",[f,F,F]);$&&
this.p.afterInsertRow.call(this,f,F,F);N++;if(this.p.datatype=="local"){J[this.p.localReader.id]=U;this.p._index[U]=this.p.data.length;this.p.data.push(J);J={}}}this.p.altRows===true&&!v&&(c=="last"?(this.rows.length-1)%2==1&&b(this.rows[this.rows.length-1]).addClass(M):b(this.rows).each(function(a){a%2==1?b(this).addClass(M):b(this).removeClass(M)}));this.updatepager(true,true);a=true}));return a},footerData:function(f,e,c){function d(a){for(var b in a)if(a.hasOwnProperty(b))return!1;return!0}var a,
h=!1,g={},i;"undefined"==typeof f&&(f="get");"boolean"!=typeof c&&(c=!0);f=f.toLowerCase();this.each(function(){var j=this,l;if(!j.grid||!j.p.footerrow||"set"==f&&d(e))return!1;h=!0;b(this.p.colModel).each(function(d){a=this.name;"set"==f?void 0!==e[a]&&(l=c?j.formatter("",e[a],d,e,"edit"):e[a],i=this.title?{title:b.jgrid.stripHtml(l)}:{},b("tr.footrow td:eq("+d+")",j.grid.sDiv).html(l).attr(i),h=!0):"get"==f&&(g[a]=b("tr.footrow td:eq("+d+")",j.grid.sDiv).html())})});return"get"==f?g:h},showHideCol:function(f,
e){return this.each(function(){var c=this,d=!1,a=b.jgrid.cellWidth()?0:c.p.cellLayout,h;if(c.grid){"string"===typeof f&&(f=[f]);e="none"!=e?"":"none";var g=""===e?!0:!1,i=c.p.groupHeader&&("object"===typeof c.p.groupHeader||b.isFunction(c.p.groupHeader));i&&b(c).jqGrid("destroyGroupHeader",!1);b(this.p.colModel).each(function(i){if(-1!==b.inArray(this.name,f)&&this.hidden===g){if(!0===c.p.frozenColumns&&!0===this.frozen)return!0;b("tr",c.grid.hDiv).each(function(){b(this.cells[i]).css("display",e)});
b(c.rows).each(function(){b(this).hasClass("jqgroup")||b(this.cells[i]).css("display",e)});c.p.footerrow&&b("tr.footrow td:eq("+i+")",c.grid.sDiv).css("display",e);h=parseInt(this.width,10);c.p.tblwidth="none"===e?c.p.tblwidth-(h+a):c.p.tblwidth+(h+a);this.hidden=!g;d=!0;b(c).triggerHandler("jqGridShowHideCol",[g,this.name,i])}});!0===d&&(!0===c.p.shrinkToFit&&!isNaN(c.p.height)&&(c.p.tblwidth+=parseInt(c.p.scrollOffset,10)),b(c).jqGrid("setGridWidth",!0===c.p.shrinkToFit?c.p.tblwidth:c.p.width));
i&&b(c).jqGrid("setGroupHeaders",c.p.groupHeader)}})},hideCol:function(f){return this.each(function(){b(this).jqGrid("showHideCol",f,"none")})},showCol:function(f){return this.each(function(){b(this).jqGrid("showHideCol",f,"")})},remapColumns:function(f,e,c){function d(a){var c;c=a.length?b.makeArray(a):b.extend({},a);b.each(f,function(b){a[b]=c[this]})}function a(a,c){b(">tr"+(c||""),a).each(function(){var a=this,c=b.makeArray(a.cells);b.each(f,function(){var b=c[this];b&&a.appendChild(b)})})}var h=
this.get(0);d(h.p.colModel);d(h.p.colNames);d(h.grid.headers);a(b("thead:first",h.grid.hDiv),c&&":not(.ui-jqgrid-labels)");e&&a(b("#"+b.jgrid.jqID(h.p.id)+" tbody:first"),".jqgfirstrow, tr.jqgrow, tr.jqfoot");h.p.footerrow&&a(b("tbody:first",h.grid.sDiv));h.p.remapColumns&&(h.p.remapColumns.length?d(h.p.remapColumns):h.p.remapColumns=b.makeArray(f));h.p.lastsort=b.inArray(h.p.lastsort,f);h.p.treeGrid&&(h.p.expColInd=b.inArray(h.p.expColInd,f));b(h).triggerHandler("jqGridRemapColumns",[f,e,c])},setGridWidth:function(f,
e){return this.each(function(){if(this.grid){var c=this,d,a=0,h=b.jgrid.cellWidth()?0:c.p.cellLayout,g,i=0,j=!1,l=c.p.scrollOffset,k,m=0,o=0,p;"boolean"!=typeof e&&(e=c.p.shrinkToFit);if(!isNaN(f)){f=parseInt(f,10);c.grid.width=c.p.width=f;b("#gbox_"+b.jgrid.jqID(c.p.id)).css("width",f+"px");b("#gview_"+b.jgrid.jqID(c.p.id)).css("width",f+"px");b(c.grid.bDiv).css("width",f+"px");b(c.grid.hDiv).css("width",f+"px");c.p.pager&&b(c.p.pager).css("width",f+"px");c.p.toppager&&b(c.p.toppager).css("width",
f+"px");!0===c.p.toolbar[0]&&(b(c.grid.uDiv).css("width",f+"px"),"both"==c.p.toolbar[1]&&b(c.grid.ubDiv).css("width",f+"px"));c.p.footerrow&&b(c.grid.sDiv).css("width",f+"px");!1===e&&!0===c.p.forceFit&&(c.p.forceFit=!1);if(!0===e){b.each(c.p.colModel,function(){if(this.hidden===false){d=this.widthOrg;a=a+(d+h);this.fixed?m=m+(d+h):i++;o++}});if(0===i)return;c.p.tblwidth=a;k=f-h*i-m;if(!isNaN(c.p.height)&&(b(c.grid.bDiv)[0].clientHeight<b(c.grid.bDiv)[0].scrollHeight||1===c.rows.length))j=!0,k-=l;
var a=0,v=0<c.grid.cols.length;b.each(c.p.colModel,function(b){if(this.hidden===false&&!this.fixed){d=this.widthOrg;d=Math.round(k*d/(c.p.tblwidth-h*i-m));if(!(d<0)){this.width=d;a=a+d;c.grid.headers[b].width=d;c.grid.headers[b].el.style.width=d+"px";if(c.p.footerrow)c.grid.footers[b].style.width=d+"px";if(v)c.grid.cols[b].style.width=d+"px";g=b}}});if(!g)return;p=0;j?f-m-(a+h*i)!==l&&(p=f-m-(a+h*i)-l):1!==Math.abs(f-m-(a+h*i))&&(p=f-m-(a+h*i));c.p.colModel[g].width+=p;c.p.tblwidth=a+p+h*i+m;c.p.tblwidth>
f?(j=c.p.tblwidth-parseInt(f,10),c.p.tblwidth=f,d=c.p.colModel[g].width-=j):d=c.p.colModel[g].width;c.grid.headers[g].width=d;c.grid.headers[g].el.style.width=d+"px";v&&(c.grid.cols[g].style.width=d+"px");c.p.footerrow&&(c.grid.footers[g].style.width=d+"px")}c.p.tblwidth&&(b("table:first",c.grid.bDiv).css("width",c.p.tblwidth+"px"),b("table:first",c.grid.hDiv).css("width",c.p.tblwidth+"px"),c.grid.hDiv.scrollLeft=c.grid.bDiv.scrollLeft,c.p.footerrow&&b("table:first",c.grid.sDiv).css("width",c.p.tblwidth+
"px"))}}})},setGridHeight:function(f){return this.each(function(){if(this.grid){var e=b(this.grid.bDiv);e.css({height:f+(isNaN(f)?"":"px")});!0===this.p.frozenColumns&&b("#"+b.jgrid.jqID(this.p.id)+"_frozen").parent().height(e.height()-16);this.p.height=f;this.p.scroll&&this.grid.populateVisible()}})},setCaption:function(f){return this.each(function(){this.p.caption=f;b("span.ui-jqgrid-title, span.ui-jqgrid-title-rtl",this.grid.cDiv).html(f);b(this.grid.cDiv).show()})},setLabel:function(f,e,c,d){return this.each(function(){var a=
-1;if(this.grid&&"undefined"!=typeof f&&(b(this.p.colModel).each(function(b){if(this.name==f)return a=b,!1}),0<=a)){var h=b("tr.ui-jqgrid-labels th:eq("+a+")",this.grid.hDiv);if(e){var g=b(".s-ico",h);b("[id^=jqgh_]",h).empty().html(e).append(g);this.p.colNames[a]=e}c&&("string"===typeof c?b(h).addClass(c):b(h).css(c));"object"===typeof d&&b(h).attr(d)}})},setCell:function(f,e,c,d,a,h){return this.each(function(){var g=-1,i,j;if(this.grid&&(isNaN(e)?b(this.p.colModel).each(function(a){if(this.name==
e)return g=a,!1}):g=parseInt(e,10),0<=g&&(i=this.rows.namedItem(f)))){var l=b("td:eq("+g+")",i);if(""!==c||!0===h)i=this.formatter(f,c,g,i,"edit"),j=this.p.colModel[g].title?{title:b.jgrid.stripHtml(i)}:{},this.p.treeGrid&&0<b(".tree-wrap",b(l)).length?b("span",b(l)).html(i).attr(j):b(l).html(i).attr(j),"local"==this.p.datatype&&(i=this.p.colModel[g],c=i.formatter&&"string"===typeof i.formatter&&"date"==i.formatter?b.unformat.date.call(this,c,i):c,j=this.p._index[f],"undefined"!=typeof j&&(this.p.data[j][i.name]=
c));"string"===typeof d?b(l).addClass(d):d&&b(l).css(d);"object"===typeof a&&b(l).attr(a)}})},getCell:function(f,e){var c=!1;this.each(function(){var d=-1;if(this.grid&&(isNaN(e)?b(this.p.colModel).each(function(a){if(this.name===e)return d=a,!1}):d=parseInt(e,10),0<=d)){var a=this.rows.namedItem(f);if(a)try{c=b.unformat.call(this,b("td:eq("+d+")",a),{rowId:a.id,colModel:this.p.colModel[d]},d)}catch(h){c=b.jgrid.htmlDecode(b("td:eq("+d+")",a).html())}}});return c},getCol:function(f,e,c){var d=[],
a,h=0,g,i,j,e="boolean"!=typeof e?!1:e;"undefined"==typeof c&&(c=!1);this.each(function(){var l=-1;if(this.grid&&(isNaN(f)?b(this.p.colModel).each(function(a){if(this.name===f)return l=a,!1}):l=parseInt(f,10),0<=l)){var k=this.rows.length,m=0;if(k&&0<k){for(;m<k;){if(b(this.rows[m]).hasClass("jqgrow")){try{a=b.unformat.call(this,b(this.rows[m].cells[l]),{rowId:this.rows[m].id,colModel:this.p.colModel[l]},l)}catch(o){a=b.jgrid.htmlDecode(this.rows[m].cells[l].innerHTML)}c?(j=parseFloat(a),h+=j,0===
m?i=g=j:(g=Math.min(g,j),i=Math.max(i,j))):e?d.push({id:this.rows[m].id,value:a}):d.push(a)}m++}if(c)switch(c.toLowerCase()){case "sum":d=h;break;case "avg":d=h/k;break;case "count":d=k;break;case "min":d=g;break;case "max":d=i}}}});return d},clearGridData:function(f){return this.each(function(){if(this.grid){"boolean"!=typeof f&&(f=!1);if(this.p.deepempty)b("#"+b.jgrid.jqID(this.p.id)+" tbody:first tr:gt(0)").remove();else{var e=b("#"+b.jgrid.jqID(this.p.id)+" tbody:first tr:first")[0];b("#"+b.jgrid.jqID(this.p.id)+
" tbody:first").empty().append(e)}this.p.footerrow&&f&&b(".ui-jqgrid-ftable td",this.grid.sDiv).html("&#160;");this.p.selrow=null;this.p.selarrrow=[];this.p.savedRow=[];this.p.records=0;this.p.page=1;this.p.lastpage=0;this.p.reccount=0;this.p.data=[];this.p._index={};this.updatepager(!0,!1)}})},getInd:function(b,e){var c=!1,d;this.each(function(){(d=this.rows.namedItem(b))&&(c=!0===e?d:d.rowIndex)});return c},bindKeys:function(f){var e=b.extend({onEnter:null,onSpace:null,onLeftKey:null,onRightKey:null,
scrollingRows:!0},f||{});return this.each(function(){var c=this;b("body").is("[role]")||b("body").attr("role","application");c.p.scrollrows=e.scrollingRows;b(c).keydown(function(d){var a=b(c).find("tr[tabindex=0]")[0],f,g,i,j=c.p.treeReader.expanded_field;if(a)if(i=c.p._index[a.id],37===d.keyCode||38===d.keyCode||39===d.keyCode||40===d.keyCode){if(38===d.keyCode){g=a.previousSibling;f="";if(g)if(b(g).is(":hidden"))for(;g;){if(g=g.previousSibling,!b(g).is(":hidden")&&b(g).hasClass("jqgrow")){f=g.id;
break}}else f=g.id;b(c).jqGrid("setSelection",f,!0,d)}if(40===d.keyCode){g=a.nextSibling;f="";if(g)if(b(g).is(":hidden"))for(;g;){if(g=g.nextSibling,!b(g).is(":hidden")&&b(g).hasClass("jqgrow")){f=g.id;break}}else f=g.id;b(c).jqGrid("setSelection",f,!0,d)}37===d.keyCode&&(c.p.treeGrid&&c.p.data[i][j]&&b(a).find("div.treeclick").trigger("click"),b(c).triggerHandler("jqGridKeyLeft",[c.p.selrow]),b.isFunction(e.onLeftKey)&&e.onLeftKey.call(c,c.p.selrow));39===d.keyCode&&(c.p.treeGrid&&!c.p.data[i][j]&&
b(a).find("div.treeclick").trigger("click"),b(c).triggerHandler("jqGridKeyRight",[c.p.selrow]),b.isFunction(e.onRightKey)&&e.onRightKey.call(c,c.p.selrow))}else 13===d.keyCode?(b(c).triggerHandler("jqGridKeyEnter",[c.p.selrow]),b.isFunction(e.onEnter)&&e.onEnter.call(c,c.p.selrow)):32===d.keyCode&&(b(c).triggerHandler("jqGridKeySpace",[c.p.selrow]),b.isFunction(e.onSpace)&&e.onSpace.call(c,c.p.selrow))})})},unbindKeys:function(){return this.each(function(){b(this).unbind("keydown")})},getLocalRow:function(b){var e=
!1,c;this.each(function(){"undefined"!==typeof b&&(c=this.p._index[b],0<=c&&(e=this.p.data[c]))});return e}})})(jQuery);
(function(c){c.fmatter={};c.extend(c.fmatter,{isBoolean:function(a){return"boolean"===typeof a},isObject:function(a){return a&&("object"===typeof a||c.isFunction(a))||!1},isString:function(a){return"string"===typeof a},isNumber:function(a){return"number"===typeof a&&isFinite(a)},isNull:function(a){return null===a},isUndefined:function(a){return"undefined"===typeof a},isValue:function(a){return this.isObject(a)||this.isString(a)||this.isNumber(a)||this.isBoolean(a)},isEmpty:function(a){if(!this.isString(a)&&
this.isValue(a))return!1;if(!this.isValue(a))return!0;a=c.trim(a).replace(/\&nbsp\;/ig,"").replace(/\&#160\;/ig,"");return""===a}});c.fn.fmatter=function(a,b,f,d,e){var g=b,f=c.extend({},c.jgrid.formatter,f);try{g=c.fn.fmatter[a].call(this,b,f,d,e)}catch(h){}return g};c.fmatter.util={NumberFormat:function(a,b){c.fmatter.isNumber(a)||(a*=1);if(c.fmatter.isNumber(a)){var f=0>a,d=a+"",e=b.decimalSeparator?b.decimalSeparator:".",g;if(c.fmatter.isNumber(b.decimalPlaces)){var h=b.decimalPlaces,d=Math.pow(10,
h),d=Math.round(a*d)/d+"";g=d.lastIndexOf(".");if(0<h){0>g?(d+=e,g=d.length-1):"."!==e&&(d=d.replace(".",e));for(;d.length-1-g<h;)d+="0"}}if(b.thousandsSeparator){h=b.thousandsSeparator;g=d.lastIndexOf(e);g=-1<g?g:d.length;for(var e=d.substring(g),i=-1,j=g;0<j;j--){i++;if(0===i%3&&j!==g&&(!f||1<j))e=h+e;e=d.charAt(j-1)+e}d=e}d=b.prefix?b.prefix+d:d;return d=b.suffix?d+b.suffix:d}return a},DateFormat:function(a,b,f,d){var e=/^\/Date\((([-+])?[0-9]+)(([-+])([0-9]{2})([0-9]{2}))?\)\/$/,g="string"===
typeof b?b.match(e):null,e=function(a,b){a=""+a;for(b=parseInt(b,10)||2;a.length<b;)a="0"+a;return a},h={m:1,d:1,y:1970,h:0,i:0,s:0,u:0},i=0,j,k=["i18n"];k.i18n={dayNames:d.dayNames,monthNames:d.monthNames};a in d.masks&&(a=d.masks[a]);if(!isNaN(b-0)&&"u"==(""+a).toLowerCase())i=new Date(1E3*parseFloat(b));else if(b.constructor===Date)i=b;else if(null!==g)i=new Date(parseInt(g[1],10)),g[3]&&(a=60*Number(g[5])+Number(g[6]),a*="-"==g[4]?1:-1,a-=i.getTimezoneOffset(),i.setTime(Number(Number(i)+6E4*a)));
else{b=(""+b).split(/[\\\/:_;.,\t\T\s-]/);a=a.split(/[\\\/:_;.,\t\T\s-]/);g=0;for(j=a.length;g<j;g++)"M"==a[g]&&(i=c.inArray(b[g],k.i18n.monthNames),-1!==i&&12>i&&(b[g]=i+1)),"F"==a[g]&&(i=c.inArray(b[g],k.i18n.monthNames),-1!==i&&11<i&&(b[g]=i+1-12)),b[g]&&(h[a[g].toLowerCase()]=parseInt(b[g],10));h.f&&(h.m=h.f);if(0===h.m&&0===h.y&&0===h.d)return"&#160;";h.m=parseInt(h.m,10)-1;i=h.y;70<=i&&99>=i?h.y=1900+h.y:0<=i&&69>=i&&(h.y=2E3+h.y);i=new Date(h.y,h.m,h.d,h.h,h.i,h.s,h.u)}f in d.masks?f=d.masks[f]:
f||(f="Y-m-d");a=i.getHours();b=i.getMinutes();h=i.getDate();g=i.getMonth()+1;j=i.getTimezoneOffset();var l=i.getSeconds(),r=i.getMilliseconds(),n=i.getDay(),m=i.getFullYear(),o=(n+6)%7+1,p=(new Date(m,g-1,h)-new Date(m,0,1))/864E5,q={d:e(h),D:k.i18n.dayNames[n],j:h,l:k.i18n.dayNames[n+7],N:o,S:d.S(h),w:n,z:p,W:5>o?Math.floor((p+o-1)/7)+1:Math.floor((p+o-1)/7)||(4>((new Date(m-1,0,1)).getDay()+6)%7?53:52),F:k.i18n.monthNames[g-1+12],m:e(g),M:k.i18n.monthNames[g-1],n:g,t:"?",L:"?",o:"?",Y:m,y:(""+
m).substring(2),a:12>a?d.AmPm[0]:d.AmPm[1],A:12>a?d.AmPm[2]:d.AmPm[3],B:"?",g:a%12||12,G:a,h:e(a%12||12),H:e(a),i:e(b),s:e(l),u:r,e:"?",I:"?",O:(0<j?"-":"+")+e(100*Math.floor(Math.abs(j)/60)+Math.abs(j)%60,4),P:"?",T:((""+i).match(/\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g)||[""]).pop().replace(/[^-+\dA-Z]/g,""),Z:"?",c:"?",r:"?",U:Math.floor(i/1E3)};return f.replace(/\\.|[dDjlNSwzWFmMntLoYyaABgGhHisueIOPTZcrU]/g,
function(a){return a in q?q[a]:a.substring(1)})}};c.fn.fmatter.defaultFormat=function(a,b){return c.fmatter.isValue(a)&&""!==a?a:b.defaultValue?b.defaultValue:"&#160;"};c.fn.fmatter.email=function(a,b){return c.fmatter.isEmpty(a)?c.fn.fmatter.defaultFormat(a,b):'<a href="mailto:'+a+'">'+a+"</a>"};c.fn.fmatter.checkbox=function(a,b){var f=c.extend({},b.checkbox),d;void 0!==b.colModel&&!c.fmatter.isUndefined(b.colModel.formatoptions)&&(f=c.extend({},f,b.colModel.formatoptions));d=!0===f.disabled?'disabled="disabled"':
"";if(c.fmatter.isEmpty(a)||c.fmatter.isUndefined(a))a=c.fn.fmatter.defaultFormat(a,f);a=(a+"").toLowerCase();return'<input type="checkbox" '+(0>a.search(/(false|0|no|off)/i)?" checked='checked' ":"")+' value="'+a+'" offval="no" '+d+"/>"};c.fn.fmatter.link=function(a,b){var f={target:b.target},d="";void 0!==b.colModel&&!c.fmatter.isUndefined(b.colModel.formatoptions)&&(f=c.extend({},f,b.colModel.formatoptions));f.target&&(d="target="+f.target);return!c.fmatter.isEmpty(a)?"<a "+d+' href="'+a+'">'+
a+"</a>":c.fn.fmatter.defaultFormat(a,b)};c.fn.fmatter.showlink=function(a,b){var f={baseLinkUrl:b.baseLinkUrl,showAction:b.showAction,addParam:b.addParam||"",target:b.target,idName:b.idName},d="";void 0!==b.colModel&&!c.fmatter.isUndefined(b.colModel.formatoptions)&&(f=c.extend({},f,b.colModel.formatoptions));f.target&&(d="target="+f.target);f=f.baseLinkUrl+f.showAction+"?"+f.idName+"="+b.rowId+f.addParam;return c.fmatter.isString(a)||c.fmatter.isNumber(a)?"<a "+d+' href="'+f+'">'+a+"</a>":c.fn.fmatter.defaultFormat(a,
b)};c.fn.fmatter.integer=function(a,b){var f=c.extend({},b.integer);void 0!==b.colModel&&!c.fmatter.isUndefined(b.colModel.formatoptions)&&(f=c.extend({},f,b.colModel.formatoptions));return c.fmatter.isEmpty(a)?f.defaultValue:c.fmatter.util.NumberFormat(a,f)};c.fn.fmatter.number=function(a,b){var f=c.extend({},b.number);void 0!==b.colModel&&!c.fmatter.isUndefined(b.colModel.formatoptions)&&(f=c.extend({},f,b.colModel.formatoptions));return c.fmatter.isEmpty(a)?f.defaultValue:c.fmatter.util.NumberFormat(a,
f)};c.fn.fmatter.currency=function(a,b){var f=c.extend({},b.currency);void 0!==b.colModel&&!c.fmatter.isUndefined(b.colModel.formatoptions)&&(f=c.extend({},f,b.colModel.formatoptions));return c.fmatter.isEmpty(a)?f.defaultValue:c.fmatter.util.NumberFormat(a,f)};c.fn.fmatter.date=function(a,b,f,d){f=c.extend({},b.date);void 0!==b.colModel&&!c.fmatter.isUndefined(b.colModel.formatoptions)&&(f=c.extend({},f,b.colModel.formatoptions));return!f.reformatAfterEdit&&"edit"==d||c.fmatter.isEmpty(a)?c.fn.fmatter.defaultFormat(a,
b):c.fmatter.util.DateFormat(f.srcformat,a,f.newformat,f)};c.fn.fmatter.select=function(a,b){var a=a+"",f=!1,d=[],e,g;c.fmatter.isUndefined(b.colModel.formatoptions)?c.fmatter.isUndefined(b.colModel.editoptions)||(f=b.colModel.editoptions.value,e=void 0===b.colModel.editoptions.separator?":":b.colModel.editoptions.separator,g=void 0===b.colModel.editoptions.delimiter?";":b.colModel.editoptions.delimiter):(f=b.colModel.formatoptions.value,e=void 0===b.colModel.formatoptions.separator?":":b.colModel.formatoptions.separator,
g=void 0===b.colModel.formatoptions.delimiter?";":b.colModel.formatoptions.delimiter);if(f){var h=!0===b.colModel.editoptions.multiple?!0:!1,i=[];h&&(i=a.split(","),i=c.map(i,function(a){return c.trim(a)}));if(c.fmatter.isString(f))for(var j=f.split(g),k=0,l=0;l<j.length;l++)if(g=j[l].split(e),2<g.length&&(g[1]=c.map(g,function(a,b){if(b>0)return a}).join(e)),h)-1<c.inArray(g[0],i)&&(d[k]=g[1],k++);else{if(c.trim(g[0])==c.trim(a)){d[0]=g[1];break}}else c.fmatter.isObject(f)&&(h?d=c.map(i,function(a){return f[a]}):
d[0]=f[a]||"")}a=d.join(", ");return""===a?c.fn.fmatter.defaultFormat(a,b):a};c.fn.fmatter.rowactions=function(a,b,f,d){var e={keys:!1,onEdit:null,onSuccess:null,afterSave:null,onError:null,afterRestore:null,extraparam:{},url:null,restoreAfterError:!0,mtype:"POST",delOptions:{},editOptions:{}},a=c.jgrid.jqID(a),b=c.jgrid.jqID(b),d=c("#"+b)[0].p.colModel[d];c.fmatter.isUndefined(d.formatoptions)||(e=c.extend(e,d.formatoptions));c.fmatter.isUndefined(c("#"+b)[0].p.editOptions)||(e.editOptions=c("#"+
b)[0].p.editOptions);c.fmatter.isUndefined(c("#"+b)[0].p.delOptions)||(e.delOptions=c("#"+b)[0].p.delOptions);var g=c("#"+b)[0],d=function(d){c.isFunction(e.afterRestore)&&e.afterRestore.call(g,d);c("tr#"+a+" div.ui-inline-edit, tr#"+a+" div.ui-inline-del","#"+b+".ui-jqgrid-btable:first").show();c("tr#"+a+" div.ui-inline-save, tr#"+a+" div.ui-inline-cancel","#"+b+".ui-jqgrid-btable:first").hide()};if(c("#"+a,"#"+b).hasClass("jqgrid-new-row")){var h=g.p.prmNames;e.extraparam[h.oper]=h.addoper}h={keys:e.keys,
oneditfunc:e.onEdit,successfunc:e.onSuccess,url:e.url,extraparam:e.extraparam,aftersavefunc:function(d,f){c.isFunction(e.afterSave)&&e.afterSave.call(g,d,f);c("tr#"+a+" div.ui-inline-edit, tr#"+a+" div.ui-inline-del","#"+b+".ui-jqgrid-btable:first").show();c("tr#"+a+" div.ui-inline-save, tr#"+a+" div.ui-inline-cancel","#"+b+".ui-jqgrid-btable:first").hide()},errorfunc:e.onError,afterrestorefunc:d,restoreAfterError:e.restoreAfterError,mtype:e.mtype};switch(f){case "edit":c("#"+b).jqGrid("editRow",
a,h);c("tr#"+a+" div.ui-inline-edit, tr#"+a+" div.ui-inline-del","#"+b+".ui-jqgrid-btable:first").hide();c("tr#"+a+" div.ui-inline-save, tr#"+a+" div.ui-inline-cancel","#"+b+".ui-jqgrid-btable:first").show();c(g).triggerHandler("jqGridAfterGridComplete");break;case "save":c("#"+b).jqGrid("saveRow",a,h)&&(c("tr#"+a+" div.ui-inline-edit, tr#"+a+" div.ui-inline-del","#"+b+".ui-jqgrid-btable:first").show(),c("tr#"+a+" div.ui-inline-save, tr#"+a+" div.ui-inline-cancel","#"+b+".ui-jqgrid-btable:first").hide(),
c(g).triggerHandler("jqGridAfterGridComplete"));break;case "cancel":c("#"+b).jqGrid("restoreRow",a,d);c("tr#"+a+" div.ui-inline-edit, tr#"+a+" div.ui-inline-del","#"+b+".ui-jqgrid-btable:first").show();c("tr#"+a+" div.ui-inline-save, tr#"+a+" div.ui-inline-cancel","#"+b+".ui-jqgrid-btable:first").hide();c(g).triggerHandler("jqGridAfterGridComplete");break;case "del":c("#"+b).jqGrid("delGridRow",a,e.delOptions);break;case "formedit":c("#"+b).jqGrid("setSelection",a),c("#"+b).jqGrid("editGridRow",a,
e.editOptions)}};c.fn.fmatter.actions=function(a,b){var f={keys:!1,editbutton:!0,delbutton:!0,editformbutton:!1};c.fmatter.isUndefined(b.colModel.formatoptions)||(f=c.extend(f,b.colModel.formatoptions));var d=b.rowId,e="",g;if("undefined"==typeof d||c.fmatter.isEmpty(d))return"";f.editformbutton?(g="onclick=jQuery.fn.fmatter.rowactions('"+d+"','"+b.gid+"','formedit',"+b.pos+"); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ",e=e+"<div title='"+
c.jgrid.nav.edittitle+"' style='float:left;cursor:pointer;' class='ui-pg-div ui-inline-edit' "+g+"><span class='ui-icon ui-icon-pencil'></span></div>"):f.editbutton&&(g="onclick=jQuery.fn.fmatter.rowactions('"+d+"','"+b.gid+"','edit',"+b.pos+"); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover') ",e=e+"<div title='"+c.jgrid.nav.edittitle+"' style='float:left;cursor:pointer;' class='ui-pg-div ui-inline-edit' "+g+"><span class='ui-icon ui-icon-pencil'></span></div>");
f.delbutton&&(g="onclick=jQuery.fn.fmatter.rowactions('"+d+"','"+b.gid+"','del',"+b.pos+"); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ",e=e+"<div title='"+c.jgrid.nav.deltitle+"' style='float:left;margin-left:5px;' class='ui-pg-div ui-inline-del' "+g+"><span class='ui-icon ui-icon-trash'></span></div>");g="onclick=jQuery.fn.fmatter.rowactions('"+d+"','"+b.gid+"','save',"+b.pos+"); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ";
e=e+"<div title='"+c.jgrid.edit.bSubmit+"' style='float:left;display:none' class='ui-pg-div ui-inline-save' "+g+"><span class='ui-icon ui-icon-disk'></span></div>";g="onclick=jQuery.fn.fmatter.rowactions('"+d+"','"+b.gid+"','cancel',"+b.pos+"); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ";e=e+"<div title='"+c.jgrid.edit.bCancel+"' style='float:left;display:none;margin-left:5px;' class='ui-pg-div ui-inline-cancel' "+g+"><span class='ui-icon ui-icon-cancel'></span></div>";
return"<div style='margin-left:8px;'>"+e+"</div>"};c.unformat=function(a,b,f,d){var e,g=b.colModel.formatter,h=b.colModel.formatoptions||{},i=/([\.\*\_\'\(\)\{\}\+\?\\])/g,j=b.colModel.unformat||c.fn.fmatter[g]&&c.fn.fmatter[g].unformat;if("undefined"!==typeof j&&c.isFunction(j))e=j.call(this,c(a).text(),b,a);else if(!c.fmatter.isUndefined(g)&&c.fmatter.isString(g))switch(e=c.jgrid.formatter||{},g){case "integer":h=c.extend({},e.integer,h);b=h.thousandsSeparator.replace(i,"\\$1");b=RegExp(b,"g");
e=c(a).text().replace(b,"");break;case "number":h=c.extend({},e.number,h);b=h.thousandsSeparator.replace(i,"\\$1");b=RegExp(b,"g");e=c(a).text().replace(b,"").replace(h.decimalSeparator,".");break;case "currency":h=c.extend({},e.currency,h);b=h.thousandsSeparator.replace(i,"\\$1");b=RegExp(b,"g");e=c(a).text();h.prefix&&h.prefix.length&&(e=e.substr(h.prefix.length));h.suffix&&h.suffix.length&&(e=e.substr(0,e.length-h.suffix.length));e=e.replace(b,"").replace(h.decimalSeparator,".");break;case "checkbox":h=
b.colModel.editoptions?b.colModel.editoptions.value.split(":"):["Yes","No"];e=c("input",a).is(":checked")?h[0]:h[1];break;case "select":e=c.unformat.select(a,b,f,d);break;case "actions":return"";default:e=c(a).text()}return void 0!==e?e:!0===d?c(a).text():c.jgrid.htmlDecode(c(a).html())};c.unformat.select=function(a,b,f,d){f=[];a=c(a).text();if(!0===d)return a;var d=c.extend({},!c.fmatter.isUndefined(b.colModel.formatoptions)?b.colModel.formatoptions:b.colModel.editoptions),b=void 0===d.separator?
":":d.separator,e=void 0===d.delimiter?";":d.delimiter;if(d.value){var g=d.value,d=!0===d.multiple?!0:!1,h=[];d&&(h=a.split(","),h=c.map(h,function(a){return c.trim(a)}));if(c.fmatter.isString(g))for(var i=g.split(e),j=0,k=0;k<i.length;k++)if(e=i[k].split(b),2<e.length&&(e[1]=c.map(e,function(a,b){if(b>0)return a}).join(b)),d)-1<c.inArray(e[1],h)&&(f[j]=e[0],j++);else{if(c.trim(e[1])==c.trim(a)){f[0]=e[0];break}}else if(c.fmatter.isObject(g)||c.isArray(g))d||(h[0]=a),f=c.map(h,function(a){var b;c.each(g,
function(c,d){if(d==a){b=c;return false}});if(typeof b!="undefined")return b});return f.join(", ")}return a||""};c.unformat.date=function(a,b){var f=c.jgrid.formatter.date||{};c.fmatter.isUndefined(b.formatoptions)||(f=c.extend({},f,b.formatoptions));return!c.fmatter.isEmpty(a)?c.fmatter.util.DateFormat(f.newformat,a,f.srcformat,f):c.fn.fmatter.defaultFormat(a,b)}})(jQuery);
(function(a){a.jgrid.extend({getColProp:function(a){var d={},c=this[0];if(!c.grid)return!1;for(var c=c.p.colModel,e=0;e<c.length;e++)if(c[e].name==a){d=c[e];break}return d},setColProp:function(b,d){return this.each(function(){if(this.grid&&d)for(var c=this.p.colModel,e=0;e<c.length;e++)if(c[e].name==b){a.extend(this.p.colModel[e],d);break}})},sortGrid:function(a,d,c){return this.each(function(){var e=-1;if(this.grid){a||(a=this.p.sortname);for(var h=0;h<this.p.colModel.length;h++)if(this.p.colModel[h].index==
a||this.p.colModel[h].name==a){e=h;break}-1!=e&&(h=this.p.colModel[e].sortable,"boolean"!==typeof h&&(h=!0),"boolean"!==typeof d&&(d=!1),h&&this.sortData("jqgh_"+this.p.id+"_"+a,e,d,c))}})},GridDestroy:function(){return this.each(function(){if(this.grid){this.p.pager&&a(this.p.pager).remove();try{a("#gbox_"+a.jgrid.jqID(this.id)).remove()}catch(b){}}})},GridUnload:function(){return this.each(function(){if(this.grid){var b=a(this).attr("id"),d=a(this).attr("class");this.p.pager&&a(this.p.pager).empty().removeClass("ui-state-default ui-jqgrid-pager corner-bottom");
var c=document.createElement("table");a(c).attr({id:b});c.className=d;b=a.jgrid.jqID(this.id);a(c).removeClass("ui-jqgrid-btable");1===a(this.p.pager).parents("#gbox_"+b).length?(a(c).insertBefore("#gbox_"+b).show(),a(this.p.pager).insertBefore("#gbox_"+b)):a(c).insertBefore("#gbox_"+b).show();a("#gbox_"+b).remove()}})},setGridState:function(b){return this.each(function(){this.grid&&("hidden"==b?(a(".ui-jqgrid-bdiv, .ui-jqgrid-hdiv","#gview_"+a.jgrid.jqID(this.p.id)).slideUp("fast"),this.p.pager&&
a(this.p.pager).slideUp("fast"),this.p.toppager&&a(this.p.toppager).slideUp("fast"),!0===this.p.toolbar[0]&&("both"==this.p.toolbar[1]&&a(this.grid.ubDiv).slideUp("fast"),a(this.grid.uDiv).slideUp("fast")),this.p.footerrow&&a(".ui-jqgrid-sdiv","#gbox_"+a.jgrid.jqID(this.p.id)).slideUp("fast"),a(".ui-jqgrid-titlebar-close span",this.grid.cDiv).removeClass("ui-icon-circle-triangle-n").addClass("ui-icon-circle-triangle-s"),this.p.gridstate="hidden"):"visible"==b&&(a(".ui-jqgrid-hdiv, .ui-jqgrid-bdiv",
"#gview_"+a.jgrid.jqID(this.p.id)).slideDown("fast"),this.p.pager&&a(this.p.pager).slideDown("fast"),this.p.toppager&&a(this.p.toppager).slideDown("fast"),!0===this.p.toolbar[0]&&("both"==this.p.toolbar[1]&&a(this.grid.ubDiv).slideDown("fast"),a(this.grid.uDiv).slideDown("fast")),this.p.footerrow&&a(".ui-jqgrid-sdiv","#gbox_"+a.jgrid.jqID(this.p.id)).slideDown("fast"),a(".ui-jqgrid-titlebar-close span",this.grid.cDiv).removeClass("ui-icon-circle-triangle-s").addClass("ui-icon-circle-triangle-n"),
this.p.gridstate="visible"))})},filterToolbar:function(b){b=a.extend({autosearch:!0,searchOnEnter:!0,beforeSearch:null,afterSearch:null,beforeClear:null,afterClear:null,searchurl:"",stringResult:!1,groupOp:"AND",defaultSearch:"bw"},b||{});return this.each(function(){function d(b,c){var d=a(b);d[0]&&jQuery.each(c,function(){void 0!==this.data?d.bind(this.type,this.data,this.fn):d.bind(this.type,this.fn)})}var c=this;if(!this.ftoolbar){var e=function(){var d={},j=0,g,f,h={},m;a.each(c.p.colModel,function(){f=
this.index||this.name;m=this.searchoptions&&this.searchoptions.sopt?this.searchoptions.sopt[0]:"select"==this.stype?"eq":b.defaultSearch;if(g=a("#gs_"+a.jgrid.jqID(this.name),!0===this.frozen&&!0===c.p.frozenColumns?c.grid.fhDiv:c.grid.hDiv).val())d[f]=g,h[f]=m,j++;else try{delete c.p.postData[f]}catch(e){}});var e=0<j?!0:!1;if(!0===b.stringResult||"local"==c.p.datatype){var k='{"groupOp":"'+b.groupOp+'","rules":[',l=0;a.each(d,function(a,b){0<l&&(k+=",");k+='{"field":"'+a+'",';k+='"op":"'+h[a]+'",';
k+='"data":"'+(b+"").replace(/\\/g,"\\\\").replace(/\"/g,'\\"')+'"}';l++});k+="]}";a.extend(c.p.postData,{filters:k});a.each(["searchField","searchString","searchOper"],function(a,b){c.p.postData.hasOwnProperty(b)&&delete c.p.postData[b]})}else a.extend(c.p.postData,d);var p;c.p.searchurl&&(p=c.p.url,a(c).jqGrid("setGridParam",{url:c.p.searchurl}));var r="stop"===a(c).triggerHandler("jqGridToolbarBeforeSearch")?!0:!1;!r&&a.isFunction(b.beforeSearch)&&(r=b.beforeSearch.call(c));r||a(c).jqGrid("setGridParam",
{search:e}).trigger("reloadGrid",[{page:1}]);p&&a(c).jqGrid("setGridParam",{url:p});a(c).triggerHandler("jqGridToolbarAfterSearch");a.isFunction(b.afterSearch)&&b.afterSearch.call(c)},h=a("<tr class='ui-search-toolbar' role='rowheader'></tr>"),g;a.each(c.p.colModel,function(){var i=this,j,q,f,n;q=a("<th role='columnheader' class='ui-state-default ui-th-column ui-th-"+c.p.direction+"'></th>");j=a("<div style='width:100%;position:relative;height:100%;padding-right:0.3em;'></div>");!0===this.hidden&&
a(q).css("display","none");this.search=!1===this.search?!1:!0;"undefined"==typeof this.stype&&(this.stype="text");f=a.extend({},this.searchoptions||{});if(this.search)switch(this.stype){case "select":if(n=this.surl||f.dataUrl)a.ajax(a.extend({url:n,dataType:"html",success:function(c){if(f.buildSelect!==void 0)(c=f.buildSelect(c))&&a(j).append(c);else a(j).append(c);f.defaultValue!==void 0&&a("select",j).val(f.defaultValue);a("select",j).attr({name:i.index||i.name,id:"gs_"+i.name});f.attr&&a("select",
j).attr(f.attr);a("select",j).css({width:"100%"});f.dataInit!==void 0&&f.dataInit(a("select",j)[0]);f.dataEvents!==void 0&&d(a("select",j)[0],f.dataEvents);b.autosearch===true&&a("select",j).change(function(){e();return false});c=null}},a.jgrid.ajaxOptions,c.p.ajaxSelectOptions||{}));else{var m,o,k;i.searchoptions?(m=void 0===i.searchoptions.value?"":i.searchoptions.value,o=void 0===i.searchoptions.separator?":":i.searchoptions.separator,k=void 0===i.searchoptions.delimiter?";":i.searchoptions.delimiter):
i.editoptions&&(m=void 0===i.editoptions.value?"":i.editoptions.value,o=void 0===i.editoptions.separator?":":i.editoptions.separator,k=void 0===i.editoptions.delimiter?";":i.editoptions.delimiter);if(m){n=document.createElement("select");n.style.width="100%";a(n).attr({name:i.index||i.name,id:"gs_"+i.name});var l;if("string"===typeof m){m=m.split(k);for(var p=0;p<m.length;p++)l=m[p].split(o),k=document.createElement("option"),k.value=l[0],k.innerHTML=l[1],n.appendChild(k)}else if("object"===typeof m)for(l in m)m.hasOwnProperty(l)&&
(k=document.createElement("option"),k.value=l,k.innerHTML=m[l],n.appendChild(k));void 0!==f.defaultValue&&a(n).val(f.defaultValue);f.attr&&a(n).attr(f.attr);void 0!==f.dataInit&&f.dataInit(n);void 0!==f.dataEvents&&d(n,f.dataEvents);a(j).append(n);!0===b.autosearch&&a(n).change(function(){e();return false})}}break;case "text":o=void 0!==f.defaultValue?f.defaultValue:"",a(j).append("<input type='text' style='width:95%;padding:0px;' name='"+(i.index||i.name)+"' id='gs_"+i.name+"' value='"+o+"'/>"),
f.attr&&a("input",j).attr(f.attr),void 0!==f.dataInit&&f.dataInit(a("input",j)[0]),void 0!==f.dataEvents&&d(a("input",j)[0],f.dataEvents),!0===b.autosearch&&(b.searchOnEnter?a("input",j).keypress(function(a){if((a.charCode?a.charCode:a.keyCode?a.keyCode:0)==13){e();return false}return this}):a("input",j).keydown(function(a){switch(a.which){case 13:return false;case 9:case 16:case 37:case 38:case 39:case 40:case 27:break;default:g&&clearTimeout(g);g=setTimeout(function(){e()},500)}}))}a(q).append(j);
a(h).append(q)});a("table thead",c.grid.hDiv).append(h);this.ftoolbar=!0;this.triggerToolbar=e;this.clearToolbar=function(d){var j={},g=0,f,d="boolean"!=typeof d?!0:d;a.each(c.p.colModel,function(){var b;this.searchoptions&&void 0!==this.searchoptions.defaultValue&&(b=this.searchoptions.defaultValue);f=this.index||this.name;switch(this.stype){case "select":a("#gs_"+a.jgrid.jqID(this.name)+" option",!0===this.frozen&&!0===c.p.frozenColumns?c.grid.fhDiv:c.grid.hDiv).each(function(c){if(c===0)this.selected=
true;if(a(this).val()==b){this.selected=true;return false}});if(void 0!==b)j[f]=b,g++;else try{delete c.p.postData[f]}catch(d){}break;case "text":if(a("#gs_"+a.jgrid.jqID(this.name),!0===this.frozen&&!0===c.p.frozenColumns?c.grid.fhDiv:c.grid.hDiv).val(b),void 0!==b)j[f]=b,g++;else try{delete c.p.postData[f]}catch(e){}}});var h=0<g?!0:!1;if(!0===b.stringResult||"local"==c.p.datatype){var e='{"groupOp":"'+b.groupOp+'","rules":[',o=0;a.each(j,function(a,b){0<o&&(e+=",");e+='{"field":"'+a+'",';e+='"op":"eq",';
e+='"data":"'+(b+"").replace(/\\/g,"\\\\").replace(/\"/g,'\\"')+'"}';o++});e+="]}";a.extend(c.p.postData,{filters:e});a.each(["searchField","searchString","searchOper"],function(a,b){c.p.postData.hasOwnProperty(b)&&delete c.p.postData[b]})}else a.extend(c.p.postData,j);var k;c.p.searchurl&&(k=c.p.url,a(c).jqGrid("setGridParam",{url:c.p.searchurl}));var l="stop"===a(c).triggerHandler("jqGridToolbarBeforeClear")?!0:!1;!l&&a.isFunction(b.beforeClear)&&(l=b.beforeClear.call(c));l||d&&a(c).jqGrid("setGridParam",
{search:h}).trigger("reloadGrid",[{page:1}]);k&&a(c).jqGrid("setGridParam",{url:k});a(c).triggerHandler("jqGridToolbarAfterClear");a.isFunction(b.afterClear)&&b.afterClear()};this.toggleToolbar=function(){var b=a("tr.ui-search-toolbar",c.grid.hDiv),d=!0===c.p.frozenColumns?a("tr.ui-search-toolbar",c.grid.fhDiv):!1;"none"==b.css("display")?(b.show(),d&&d.show()):(b.hide(),d&&d.hide())}}})},destroyGroupHeader:function(b){"undefined"==typeof b&&(b=!0);return this.each(function(){var d,c,e,h,g,i;c=this.grid;
var j=a("table.ui-jqgrid-htable thead",c.hDiv),q=this.p.colModel;if(c){a(this).unbind(".setGroupHeaders");d=a("<tr>",{role:"rowheader"}).addClass("ui-jqgrid-labels");h=c.headers;c=0;for(e=h.length;c<e;c++){g=q[c].hidden?"none":"";g=a(h[c].el).width(h[c].width).css("display",g);try{g.removeAttr("rowSpan")}catch(f){g.attr("rowSpan",1)}d.append(g);i=g.children("span.ui-jqgrid-resize");0<i.length&&(i[0].style.height="");g.children("div")[0].style.top=""}a(j).children("tr.ui-jqgrid-labels").remove();a(j).prepend(d);
!0===b&&a(this).jqGrid("setGridParam",{groupHeader:null})}})},setGroupHeaders:function(b){b=a.extend({useColSpanStyle:!1,groupHeaders:[]},b||{});return this.each(function(){this.p.groupHeader=b;var d,c,e=0,h,g,i,j,q,f=this.p.colModel,n=f.length,m=this.grid.headers,o=a("table.ui-jqgrid-htable",this.grid.hDiv),k=o.children("thead").children("tr.ui-jqgrid-labels:last").addClass("jqg-second-row-header");h=o.children("thead");var l=o.find(".jqg-first-row-header");null===l.html()?l=a("<tr>",{role:"row",
"aria-hidden":"true"}).addClass("jqg-first-row-header").css("height","auto"):l.empty();var p,r=function(a,b){for(var c=0,d=b.length;c<d;c++)if(b[c].startColumnName===a)return c;return-1};a(this).prepend(h);h=a("<tr>",{role:"rowheader"}).addClass("ui-jqgrid-labels jqg-third-row-header");for(d=0;d<n;d++)if(i=m[d].el,j=a(i),c=f[d],g={height:"0px",width:m[d].width+"px",display:c.hidden?"none":""},a("<th>",{role:"gridcell"}).css(g).addClass("ui-first-th-"+this.p.direction).appendTo(l),i.style.width="",
g=r(c.name,b.groupHeaders),0<=g){g=b.groupHeaders[g];e=g.numberOfColumns;q=g.titleText;for(g=c=0;g<e&&d+g<n;g++)f[d+g].hidden||c++;g=a("<th>").attr({role:"columnheader"}).addClass("ui-state-default ui-th-column-header ui-th-"+this.p.direction).css({height:"22px","border-top":"0px none"}).html(q);0<c&&g.attr("colspan",""+c);this.p.headertitles&&g.attr("title",g.text());0===c&&g.hide();j.before(g);h.append(i);e-=1}else 0===e?b.useColSpanStyle?j.attr("rowspan","2"):(a("<th>",{role:"columnheader"}).addClass("ui-state-default ui-th-column-header ui-th-"+
this.p.direction).css({display:c.hidden?"none":"","border-top":"0px none"}).insertBefore(j),h.append(i)):(h.append(i),e--);f=a(this).children("thead");f.prepend(l);h.insertAfter(k);o.append(f);b.useColSpanStyle&&(o.find("span.ui-jqgrid-resize").each(function(){var b=a(this).parent();b.is(":visible")&&(this.style.cssText="height: "+b.height()+"px !important; cursor: col-resize;")}),o.find("div.ui-jqgrid-sortable").each(function(){var b=a(this),c=b.parent();c.is(":visible")&&c.is(":has(span.ui-jqgrid-resize)")&&
b.css("top",(c.height()-b.outerHeight())/2+"px")}));p=f.find("tr.jqg-first-row-header");a(this).bind("jqGridResizeStop.setGroupHeaders",function(a,b,c){p.find("th").eq(c).width(b)})})},setFrozenColumns:function(){return this.each(function(){if(this.grid){var b=this,d=b.p.colModel,c=0,e=d.length,h=-1,g=!1;if(!(!0===b.p.subGrid||!0===b.p.treeGrid||!0===b.p.cellEdit||b.p.sortable||b.p.scroll||b.p.grouping)){b.p.rownumbers&&c++;for(b.p.multiselect&&c++;c<e;){if(!0===d[c].frozen)g=!0,h=c;else break;c++}if(0<=
h&&g){d=b.p.caption?a(b.grid.cDiv).outerHeight():0;c=a(".ui-jqgrid-htable","#gview_"+a.jgrid.jqID(b.p.id)).height();b.p.toppager&&(d+=a(b.grid.topDiv).outerHeight());!0===b.p.toolbar[0]&&"bottom"!=b.p.toolbar[1]&&(d+=a(b.grid.uDiv).outerHeight());b.grid.fhDiv=a('<div style="position:absolute;left:0px;top:'+d+"px;height:"+c+'px;" class="frozen-div ui-state-default ui-jqgrid-hdiv"></div>');b.grid.fbDiv=a('<div style="position:absolute;left:0px;top:'+(parseInt(d,10)+parseInt(c,10)+1)+'px;overflow-y:hidden" class="frozen-bdiv ui-jqgrid-bdiv"></div>');
a("#gview_"+a.jgrid.jqID(b.p.id)).append(b.grid.fhDiv);d=a(".ui-jqgrid-htable","#gview_"+a.jgrid.jqID(b.p.id)).clone(!0);if(b.p.groupHeader){a("tr.jqg-first-row-header, tr.jqg-third-row-header",d).each(function(){a("th:gt("+h+")",this).remove()});var i=-1,j=-1;a("tr.jqg-second-row-header th",d).each(function(){var b=parseInt(a(this).attr("colspan"),10);b&&(i+=b,j++);if(i===h)return!1});i!==h&&(j=h);a("tr.jqg-second-row-header",d).each(function(){a("th:gt("+j+")",this).remove()})}else a("tr",d).each(function(){a("th:gt("+
h+")",this).remove()});a(d).width(1);a(b.grid.fhDiv).append(d).mousemove(function(a){if(b.grid.resizing)return b.grid.dragMove(a),!1});a(b).bind("jqGridResizeStop.setFrozenColumns",function(c,d,e){c=a(".ui-jqgrid-htable",b.grid.fhDiv);a("th:eq("+e+")",c).width(d);c=a(".ui-jqgrid-btable",b.grid.fbDiv);a("tr:first td:eq("+e+")",c).width(d)});a(b).bind("jqGridOnSortCol.setFrozenColumns",function(c,d){var e=a("tr.ui-jqgrid-labels:last th:eq("+b.p.lastsort+")",b.grid.fhDiv),g=a("tr.ui-jqgrid-labels:last th:eq("+
d+")",b.grid.fhDiv);a("span.ui-grid-ico-sort",e).addClass("ui-state-disabled");a(e).attr("aria-selected","false");a("span.ui-icon-"+b.p.sortorder,g).removeClass("ui-state-disabled");a(g).attr("aria-selected","true");!b.p.viewsortcols[0]&&b.p.lastsort!=d&&(a("span.s-ico",e).hide(),a("span.s-ico",g).show())});a("#gview_"+a.jgrid.jqID(b.p.id)).append(b.grid.fbDiv);jQuery(b.grid.bDiv).scroll(function(){jQuery(b.grid.fbDiv).scrollTop(jQuery(this).scrollTop())});!0===b.p.hoverrows&&a("#"+a.jgrid.jqID(b.p.id)).unbind("mouseover").unbind("mouseout");
a(b).bind("jqGridAfterGridComplete.setFrozenColumns",function(){a("#"+a.jgrid.jqID(b.p.id)+"_frozen").remove();jQuery(b.grid.fbDiv).height(jQuery(b.grid.bDiv).height()-16);var c=a("#"+a.jgrid.jqID(b.p.id)).clone(!0);a("tr",c).each(function(){a("td:gt("+h+")",this).remove()});a(c).width(1).attr("id",b.p.id+"_frozen");a(b.grid.fbDiv).append(c);!0===b.p.hoverrows&&(a("tr.jqgrow",c).hover(function(){a(this).addClass("ui-state-hover");a("#"+a.jgrid.jqID(this.id),"#"+a.jgrid.jqID(b.p.id)).addClass("ui-state-hover")},
function(){a(this).removeClass("ui-state-hover");a("#"+a.jgrid.jqID(this.id),"#"+a.jgrid.jqID(b.p.id)).removeClass("ui-state-hover")}),a("tr.jqgrow","#"+a.jgrid.jqID(b.p.id)).hover(function(){a(this).addClass("ui-state-hover");a("#"+a.jgrid.jqID(this.id),"#"+a.jgrid.jqID(b.p.id)+"_frozen").addClass("ui-state-hover")},function(){a(this).removeClass("ui-state-hover");a("#"+a.jgrid.jqID(this.id),"#"+a.jgrid.jqID(b.p.id)+"_frozen").removeClass("ui-state-hover")}));c=null});b.p.frozenColumns=!0}}}})},
destroyFrozenColumns:function(){return this.each(function(){if(this.grid&&!0===this.p.frozenColumns){a(this.grid.fhDiv).remove();a(this.grid.fbDiv).remove();this.grid.fhDiv=null;this.grid.fbDiv=null;a(this).unbind(".setFrozenColumns");if(!0===this.p.hoverrows){var b;a("#"+a.jgrid.jqID(this.p.id)).bind("mouseover",function(d){b=a(d.target).closest("tr.jqgrow");"ui-subgrid"!==a(b).attr("class")&&a(b).addClass("ui-state-hover")}).bind("mouseout",function(d){b=a(d.target).closest("tr.jqgrow");a(b).removeClass("ui-state-hover")})}this.p.frozenColumns=
!1}})}})})(jQuery);
(function(a){a.extend(a.jgrid,{showModal:function(a){a.w.show()},closeModal:function(a){a.w.hide().attr("aria-hidden","true");a.o&&a.o.remove()},hideModal:function(d,b){b=a.extend({jqm:!0,gb:""},b||{});if(b.onClose){var c=b.onClose(d);if("boolean"==typeof c&&!c)return}if(a.fn.jqm&&!0===b.jqm)a(d).attr("aria-hidden","true").jqmHide();else{if(""!==b.gb)try{a(".jqgrid-overlay:first",b.gb).hide()}catch(f){}a(d).hide().attr("aria-hidden","true")}},findPos:function(a){var b=0,c=0;if(a.offsetParent){do b+=
a.offsetLeft,c+=a.offsetTop;while(a=a.offsetParent)}return[b,c]},createModal:function(d,b,c,f,g,h,i){var e=document.createElement("div"),l,j=this,i=a.extend({},i||{});l="rtl"==a(c.gbox).attr("dir")?!0:!1;e.className="ui-widget ui-widget-content ui-corner-all ui-jqdialog";e.id=d.themodal;var k=document.createElement("div");k.className="ui-jqdialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix";k.id=d.modalhead;a(k).append("<span class='ui-jqdialog-title'>"+c.caption+"</span>");var n=a("<a href='javascript:void(0)' class='ui-jqdialog-titlebar-close ui-corner-all'></a>").hover(function(){n.addClass("ui-state-hover")},
function(){n.removeClass("ui-state-hover")}).append("<span class='ui-icon ui-icon-closethick'></span>");a(k).append(n);l?(e.dir="rtl",a(".ui-jqdialog-title",k).css("float","right"),a(".ui-jqdialog-titlebar-close",k).css("left","0.3em")):(e.dir="ltr",a(".ui-jqdialog-title",k).css("float","left"),a(".ui-jqdialog-titlebar-close",k).css("right","0.3em"));var m=document.createElement("div");a(m).addClass("ui-jqdialog-content ui-widget-content").attr("id",d.modalcontent);a(m).append(b);e.appendChild(m);
a(e).prepend(k);!0===h?a("body").append(e):"string"==typeof h?a(h).append(e):a(e).insertBefore(f);a(e).css(i);"undefined"===typeof c.jqModal&&(c.jqModal=!0);b={};if(a.fn.jqm&&!0===c.jqModal)0===c.left&&(0===c.top&&c.overlay)&&(i=[],i=a.jgrid.findPos(g),c.left=i[0]+4,c.top=i[1]+4),b.top=c.top+"px",b.left=c.left;else if(0!==c.left||0!==c.top)b.left=c.left,b.top=c.top+"px";a("a.ui-jqdialog-titlebar-close",k).click(function(){var b=a("#"+a.jgrid.jqID(d.themodal)).data("onClose")||c.onClose,e=a("#"+a.jgrid.jqID(d.themodal)).data("gbox")||
c.gbox;j.hideModal("#"+a.jgrid.jqID(d.themodal),{gb:e,jqm:c.jqModal,onClose:b});return false});if(0===c.width||!c.width)c.width=300;if(0===c.height||!c.height)c.height=200;c.zIndex||(f=a(f).parents("*[role=dialog]").filter(":first").css("z-index"),c.zIndex=f?parseInt(f,10)+2:950);f=0;l&&(b.left&&!h)&&(f=a(c.gbox).width()-(!isNaN(c.width)?parseInt(c.width,10):0)-8,b.left=parseInt(b.left,10)+parseInt(f,10));b.left&&(b.left+="px");a(e).css(a.extend({width:isNaN(c.width)?"auto":c.width+"px",height:isNaN(c.height)?
"auto":c.height+"px",zIndex:c.zIndex,overflow:"hidden"},b)).attr({tabIndex:"-1",role:"dialog","aria-labelledby":d.modalhead,"aria-hidden":"true"});"undefined"==typeof c.drag&&(c.drag=!0);"undefined"==typeof c.resize&&(c.resize=!0);if(c.drag)if(a(k).css("cursor","move"),a.fn.jqDrag)a(e).jqDrag(k);else try{a(e).draggable({handle:a("#"+a.jgrid.jqID(k.id))})}catch(o){}if(c.resize)if(a.fn.jqResize)a(e).append("<div class='jqResize ui-resizable-handle ui-resizable-se ui-icon ui-icon-gripsmall-diagonal-se ui-icon-grip-diagonal-se'></div>"),
a("#"+a.jgrid.jqID(d.themodal)).jqResize(".jqResize",d.scrollelm?"#"+a.jgrid.jqID(d.scrollelm):!1);else try{a(e).resizable({handles:"se, sw",alsoResize:d.scrollelm?"#"+a.jgrid.jqID(d.scrollelm):!1})}catch(p){}!0===c.closeOnEscape&&a(e).keydown(function(b){if(b.which==27){b=a("#"+a.jgrid.jqID(d.themodal)).data("onClose")||c.onClose;j.hideModal(this,{gb:c.gbox,jqm:c.jqModal,onClose:b})}})},viewModal:function(d,b){b=a.extend({toTop:!0,overlay:10,modal:!1,overlayClass:"ui-widget-overlay",onShow:a.jgrid.showModal,
onHide:a.jgrid.closeModal,gbox:"",jqm:!0,jqM:!0},b||{});if(a.fn.jqm&&!0===b.jqm)b.jqM?a(d).attr("aria-hidden","false").jqm(b).jqmShow():a(d).attr("aria-hidden","false").jqmShow();else{""!==b.gbox&&(a(".jqgrid-overlay:first",b.gbox).show(),a(d).data("gbox",b.gbox));a(d).show().attr("aria-hidden","false");try{a(":input:visible",d)[0].focus()}catch(c){}}},info_dialog:function(d,b,c,f){var g={width:290,height:"auto",dataheight:"auto",drag:!0,resize:!1,caption:"<b>"+d+"</b>",left:250,top:170,zIndex:1E3,
jqModal:!0,modal:!1,closeOnEscape:!0,align:"center",buttonalign:"center",buttons:[]};a.extend(g,f||{});var h=g.jqModal,i=this;a.fn.jqm&&!h&&(h=!1);d="";if(0<g.buttons.length)for(f=0;f<g.buttons.length;f++)"undefined"==typeof g.buttons[f].id&&(g.buttons[f].id="info_button_"+f),d+="<a href='javascript:void(0)' id='"+g.buttons[f].id+"' class='fm-button ui-state-default ui-corner-all'>"+g.buttons[f].text+"</a>";f=isNaN(g.dataheight)?g.dataheight:g.dataheight+"px";b="<div id='info_id'>"+("<div id='infocnt' style='margin:0px;padding-bottom:1em;width:100%;overflow:auto;position:relative;height:"+
f+";"+("text-align:"+g.align+";")+"'>"+b+"</div>");b+=c?"<div class='ui-widget-content ui-helper-clearfix' style='text-align:"+g.buttonalign+";padding-bottom:0.8em;padding-top:0.5em;background-image: none;border-width: 1px 0 0 0;'><a href='javascript:void(0)' id='closedialog' class='fm-button ui-state-default ui-corner-all'>"+c+"</a>"+d+"</div>":""!==d?"<div class='ui-widget-content ui-helper-clearfix' style='text-align:"+g.buttonalign+";padding-bottom:0.8em;padding-top:0.5em;background-image: none;border-width: 1px 0 0 0;'>"+
d+"</div>":"";b+="</div>";try{"false"==a("#info_dialog").attr("aria-hidden")&&a.jgrid.hideModal("#info_dialog",{jqm:h}),a("#info_dialog").remove()}catch(e){}a.jgrid.createModal({themodal:"info_dialog",modalhead:"info_head",modalcontent:"info_content",scrollelm:"infocnt"},b,g,"","",!0);d&&a.each(g.buttons,function(b){a("#"+a.jgrid.jqID(this.id),"#info_id").bind("click",function(){g.buttons[b].onClick.call(a("#info_dialog"));return!1})});a("#closedialog","#info_id").click(function(){i.hideModal("#info_dialog",
{jqm:h});return!1});a(".fm-button","#info_dialog").hover(function(){a(this).addClass("ui-state-hover")},function(){a(this).removeClass("ui-state-hover")});a.isFunction(g.beforeOpen)&&g.beforeOpen();a.jgrid.viewModal("#info_dialog",{onHide:function(a){a.w.hide().remove();a.o&&a.o.remove()},modal:g.modal,jqm:h});a.isFunction(g.afterOpen)&&g.afterOpen();try{a("#info_dialog").focus()}catch(l){}},createEl:function(d,b,c,f,g){function h(b,d){a.isFunction(d.dataInit)&&d.dataInit.call(l,b);d.dataEvents&&
a.each(d.dataEvents,function(){void 0!==this.data?a(b).bind(this.type,this.data,this.fn):a(b).bind(this.type,this.fn)});return d}function i(b,d,c){var e="dataInit dataEvents dataUrl buildSelect sopt searchhidden defaultValue attr".split(" ");"undefined"!=typeof c&&a.isArray(c)&&a.merge(e,c);a.each(d,function(d,c){-1===a.inArray(d,e)&&a(b).attr(d,c)});d.hasOwnProperty("id")||a(b).attr("id",a.jgrid.randId())}var e="",l=this;switch(d){case "textarea":e=document.createElement("textarea");f?b.cols||a(e).css({width:"98%"}):
b.cols||(b.cols=20);b.rows||(b.rows=2);if("&nbsp;"==c||"&#160;"==c||1==c.length&&160==c.charCodeAt(0))c="";e.value=c;i(e,b);b=h(e,b);a(e).attr({role:"textbox",multiline:"true"});break;case "checkbox":e=document.createElement("input");e.type="checkbox";b.value?(d=b.value.split(":"),c===d[0]&&(e.checked=!0,e.defaultChecked=!0),e.value=d[0],a(e).attr("offval",d[1])):(d=c.toLowerCase(),0>d.search(/(false|0|no|off|undefined)/i)&&""!==d?(e.checked=!0,e.defaultChecked=!0,e.value=c):e.value="on",a(e).attr("offval",
"off"));i(e,b,["value"]);b=h(e,b);a(e).attr("role","checkbox");break;case "select":e=document.createElement("select");e.setAttribute("role","select");f=[];!0===b.multiple?(d=!0,e.multiple="multiple",a(e).attr("aria-multiselectable","true")):d=!1;if("undefined"!=typeof b.dataUrl)a.ajax(a.extend({url:b.dataUrl,type:"GET",dataType:"html",context:{elem:e,options:b,vl:c},success:function(d){var b=[],c=this.elem,e=this.vl,f=a.extend({},this.options),g=f.multiple===true;a.isFunction(f.buildSelect)&&(d=f.buildSelect.call(l,
d));if(d=a(d).html()){a(c).append(d);i(c,f);f=h(c,f);if(typeof f.size==="undefined")f.size=g?3:1;if(g){b=e.split(",");b=a.map(b,function(b){return a.trim(b)})}else b[0]=a.trim(e);setTimeout(function(){a("option",c).each(function(d){if(d===0&&c.multiple)this.selected=false;a(this).attr("role","option");if(a.inArray(a.trim(a(this).text()),b)>-1||a.inArray(a.trim(a(this).val()),b)>-1)this.selected="selected"})},0)}}},g||{}));else if(b.value){var j;"undefined"===typeof b.size&&(b.size=d?3:1);d&&(f=c.split(","),
f=a.map(f,function(b){return a.trim(b)}));"function"===typeof b.value&&(b.value=b.value());var k,n,m=void 0===b.separator?":":b.separator,g=void 0===b.delimiter?";":b.delimiter;if("string"===typeof b.value){k=b.value.split(g);for(j=0;j<k.length;j++){n=k[j].split(m);2<n.length&&(n[1]=a.map(n,function(a,b){if(b>0)return a}).join(m));g=document.createElement("option");g.setAttribute("role","option");g.value=n[0];g.innerHTML=n[1];e.appendChild(g);if(!d&&(a.trim(n[0])==a.trim(c)||a.trim(n[1])==a.trim(c)))g.selected=
"selected";if(d&&(-1<a.inArray(a.trim(n[1]),f)||-1<a.inArray(a.trim(n[0]),f)))g.selected="selected"}}else if("object"===typeof b.value)for(j in m=b.value,m)if(m.hasOwnProperty(j)){g=document.createElement("option");g.setAttribute("role","option");g.value=j;g.innerHTML=m[j];e.appendChild(g);if(!d&&(a.trim(j)==a.trim(c)||a.trim(m[j])==a.trim(c)))g.selected="selected";if(d&&(-1<a.inArray(a.trim(m[j]),f)||-1<a.inArray(a.trim(j),f)))g.selected="selected"}i(e,b,["value"]);b=h(e,b)}break;case "text":case "password":case "button":j=
"button"==d?"button":"textbox";e=document.createElement("input");e.type=d;e.value=c;i(e,b);b=h(e,b);"button"!=d&&(f?b.size||a(e).css({width:"98%"}):b.size||(b.size=20));a(e).attr("role",j);break;case "image":case "file":e=document.createElement("input");e.type=d;i(e,b);b=h(e,b);break;case "custom":e=document.createElement("span");try{if(a.isFunction(b.custom_element))if(m=b.custom_element.call(l,c,b))m=a(m).addClass("customelement").attr({id:b.id,name:b.name}),a(e).empty().append(m);else throw"e2";
else throw"e1";}catch(o){"e1"==o&&a.jgrid.info_dialog(a.jgrid.errors.errcap,"function 'custom_element' "+a.jgrid.edit.msg.nodefined,a.jgrid.edit.bClose),"e2"==o?a.jgrid.info_dialog(a.jgrid.errors.errcap,"function 'custom_element' "+a.jgrid.edit.msg.novalue,a.jgrid.edit.bClose):a.jgrid.info_dialog(a.jgrid.errors.errcap,"string"===typeof o?o:o.message,a.jgrid.edit.bClose)}}return e},checkDate:function(a,b){var c={},f,a=a.toLowerCase();f=-1!=a.indexOf("/")?"/":-1!=a.indexOf("-")?"-":-1!=a.indexOf(".")?
".":"/";a=a.split(f);b=b.split(f);if(3!=b.length)return!1;f=-1;for(var g,h=-1,i=-1,e=0;e<a.length;e++)g=isNaN(b[e])?0:parseInt(b[e],10),c[a[e]]=g,g=a[e],-1!=g.indexOf("y")&&(f=e),-1!=g.indexOf("m")&&(i=e),-1!=g.indexOf("d")&&(h=e);g="y"==a[f]||"yyyy"==a[f]?4:"yy"==a[f]?2:-1;var e=function(a){for(var b=1;b<=a;b++){this[b]=31;if(4==b||6==b||9==b||11==b)this[b]=30;2==b&&(this[b]=29)}return this}(12),l;if(-1===f)return!1;l=c[a[f]].toString();2==g&&1==l.length&&(g=1);if(l.length!=g||0===c[a[f]]&&"00"!=
b[f]||-1===i)return!1;l=c[a[i]].toString();if(1>l.length||(1>c[a[i]]||12<c[a[i]])||-1===h)return!1;l=c[a[h]].toString();return 1>l.length||1>c[a[h]]||31<c[a[h]]||2==c[a[i]]&&c[a[h]]>(0===c[a[f]]%4&&(0!==c[a[f]]%100||0===c[a[f]]%400)?29:28)||c[a[h]]>e[c[a[i]]]?!1:!0},isEmpty:function(a){return a.match(/^\s+$/)||""===a?!0:!1},checkTime:function(d){var b=/^(\d{1,2}):(\d{2})([ap]m)?$/;if(!a.jgrid.isEmpty(d))if(d=d.match(b)){if(d[3]){if(1>d[1]||12<d[1])return!1}else if(23<d[1])return!1;if(59<d[2])return!1}else return!1;
return!0},checkValues:function(d,b,c,f,g){var h,i;if("undefined"===typeof f)if("string"==typeof b){f=0;for(g=c.p.colModel.length;f<g;f++)if(c.p.colModel[f].name==b){h=c.p.colModel[f].editrules;b=f;try{i=c.p.colModel[f].formoptions.label}catch(e){}break}}else 0<=b&&(h=c.p.colModel[b].editrules);else h=f,i=void 0===g?"_":g;if(h){i||(i=c.p.colNames[b]);if(!0===h.required&&a.jgrid.isEmpty(d))return[!1,i+": "+a.jgrid.edit.msg.required,""];f=!1===h.required?!1:!0;if(!0===h.number&&!(!1===f&&a.jgrid.isEmpty(d))&&
isNaN(d))return[!1,i+": "+a.jgrid.edit.msg.number,""];if("undefined"!=typeof h.minValue&&!isNaN(h.minValue)&&parseFloat(d)<parseFloat(h.minValue))return[!1,i+": "+a.jgrid.edit.msg.minValue+" "+h.minValue,""];if("undefined"!=typeof h.maxValue&&!isNaN(h.maxValue)&&parseFloat(d)>parseFloat(h.maxValue))return[!1,i+": "+a.jgrid.edit.msg.maxValue+" "+h.maxValue,""];if(!0===h.email&&!(!1===f&&a.jgrid.isEmpty(d))&&(g=/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,
!g.test(d)))return[!1,i+": "+a.jgrid.edit.msg.email,""];if(!0===h.integer&&!(!1===f&&a.jgrid.isEmpty(d))&&(isNaN(d)||0!==d%1||-1!=d.indexOf(".")))return[!1,i+": "+a.jgrid.edit.msg.integer,""];if(!0===h.date&&!(!1===f&&a.jgrid.isEmpty(d))&&(b=c.p.colModel[b].formatoptions&&c.p.colModel[b].formatoptions.newformat?c.p.colModel[b].formatoptions.newformat:c.p.colModel[b].datefmt||"Y-m-d",!a.jgrid.checkDate(b,d)))return[!1,i+": "+a.jgrid.edit.msg.date+" - "+b,""];if(!0===h.time&&!(!1===f&&a.jgrid.isEmpty(d))&&
!a.jgrid.checkTime(d))return[!1,i+": "+a.jgrid.edit.msg.date+" - hh:mm (am/pm)",""];if(!0===h.url&&!(!1===f&&a.jgrid.isEmpty(d))&&(g=/^(((https?)|(ftp)):\/\/([\-\w]+\.)+\w{2,3}(\/[%\-\w]+(\.\w{2,})?)*(([\w\-\.\?\\\/+@&#;`~=%!]*)(\.\w{2,})?)*\/?)/i,!g.test(d)))return[!1,i+": "+a.jgrid.edit.msg.url,""];if(!0===h.custom&&!(!1===f&&a.jgrid.isEmpty(d)))return a.isFunction(h.custom_func)?(d=h.custom_func.call(c,d,i),a.isArray(d)?d:[!1,a.jgrid.edit.msg.customarray,""]):[!1,a.jgrid.edit.msg.customfcheck,
""]}return[!0,"",""]}})})(jQuery);
(function(a){var c={};a.jgrid.extend({searchGrid:function(c){c=a.extend({recreateFilter:!1,drag:!0,sField:"searchField",sValue:"searchString",sOper:"searchOper",sFilter:"filters",loadDefaults:!0,beforeShowSearch:null,afterShowSearch:null,onInitializeSearch:null,afterRedraw:null,afterChange:null,closeAfterSearch:!1,closeAfterReset:!1,closeOnEscape:!1,searchOnEnter:!1,multipleSearch:!1,multipleGroup:!1,top:0,left:0,jqModal:!0,modal:!1,resize:!0,width:450,height:"auto",dataheight:"auto",showQuery:!1,
errorcheck:!0,sopt:null,stringResult:void 0,onClose:null,onSearch:null,onReset:null,toTop:!0,overlay:30,columns:[],tmplNames:null,tmplFilters:null,tmplLabel:" Template: ",showOnLoad:!1,layer:null},a.jgrid.search,c||{});return this.each(function(){function d(b){r=a(e).triggerHandler("jqGridFilterBeforeShow",[b]);"undefined"===typeof r&&(r=!0);r&&a.isFunction(c.beforeShowSearch)&&(r=c.beforeShowSearch.call(e,b));r&&(a.jgrid.viewModal("#"+a.jgrid.jqID(t.themodal),{gbox:"#gbox_"+a.jgrid.jqID(l),jqm:c.jqModal,
modal:c.modal,overlay:c.overlay,toTop:c.toTop}),a(e).triggerHandler("jqGridFilterAfterShow",[b]),a.isFunction(c.afterShowSearch)&&c.afterShowSearch.call(e,b))}var e=this;if(e.grid){var l="fbox_"+e.p.id,r=!0,t={themodal:"searchmod"+l,modalhead:"searchhd"+l,modalcontent:"searchcnt"+l,scrollelm:l},s=e.p.postData[c.sFilter];"string"===typeof s&&(s=a.jgrid.parse(s));!0===c.recreateFilter&&a("#"+a.jgrid.jqID(t.themodal)).remove();if(null!==a("#"+a.jgrid.jqID(t.themodal)).html())d(a("#fbox_"+a.jgrid.jqID(+e.p.id)));
else{var p=a("<div><div id='"+l+"' class='searchFilter' style='overflow:auto'></div></div>").insertBefore("#gview_"+a.jgrid.jqID(e.p.id)),g="left",f="";"rtl"==e.p.direction&&(g="right",f=" style='text-align:left'",p.attr("dir","rtl"));var n=a.extend([],e.p.colModel),w="<a href='javascript:void(0)' id='"+l+"_search' class='fm-button ui-state-default ui-corner-all fm-button-icon-right ui-reset'><span class='ui-icon ui-icon-search'></span>"+c.Find+"</a>",b="<a href='javascript:void(0)' id='"+l+"_reset' class='fm-button ui-state-default ui-corner-all fm-button-icon-left ui-search'><span class='ui-icon ui-icon-arrowreturnthick-1-w'></span>"+
c.Reset+"</a>",m="",h="",k,j=!1,o=-1;c.showQuery&&(m="<a href='javascript:void(0)' id='"+l+"_query' class='fm-button ui-state-default ui-corner-all fm-button-icon-left'><span class='ui-icon ui-icon-comment'></span>Query</a>");c.columns.length?n=c.columns:a.each(n,function(a,b){if(!b.label)b.label=e.p.colNames[a];if(!j){var c=typeof b.search==="undefined"?true:b.search,d=b.hidden===true;if(b.searchoptions&&b.searchoptions.searchhidden===true&&c||c&&!d){j=true;k=b.index||b.name;o=a}}});if(!s&&k||!1===
c.multipleSearch){var y="eq";0<=o&&n[o].searchoptions&&n[o].searchoptions.sopt?y=n[o].searchoptions.sopt[0]:c.sopt&&c.sopt.length&&(y=c.sopt[0]);s={groupOp:"AND",rules:[{field:k,op:y,data:""}]}}j=!1;c.tmplNames&&c.tmplNames.length&&(j=!0,h=c.tmplLabel,h+="<select class='ui-template'>",h+="<option value='default'>Default</option>",a.each(c.tmplNames,function(a,b){h=h+("<option value='"+a+"'>"+b+"</option>")}),h+="</select>");g="<table class='EditTable' style='border:0px none;margin-top:5px' id='"+
l+"_2'><tbody><tr><td colspan='2'><hr class='ui-widget-content' style='margin:1px'/></td></tr><tr><td class='EditButton' style='text-align:"+g+"'>"+b+h+"</td><td class='EditButton' "+f+">"+m+w+"</td></tr></tbody></table>";l=a.jgrid.jqID(l);a("#"+l).jqFilter({columns:n,filter:c.loadDefaults?s:null,showQuery:c.showQuery,errorcheck:c.errorcheck,sopt:c.sopt,groupButton:c.multipleGroup,ruleButtons:c.multipleSearch,afterRedraw:c.afterRedraw,_gridsopt:a.jgrid.search.odata,ajaxSelectOptions:e.p.ajaxSelectOptions,
groupOps:c.groupOps,onChange:function(){this.p.showQuery&&a(".query",this).html(this.toUserFriendlyString());a.isFunction(c.afterChange)&&c.afterChange.call(e,a("#"+l),c)},direction:e.p.direction});p.append(g);j&&(c.tmplFilters&&c.tmplFilters.length)&&a(".ui-template",p).bind("change",function(){var b=a(this).val();b=="default"?a("#"+l).jqFilter("addFilter",s):a("#"+l).jqFilter("addFilter",c.tmplFilters[parseInt(b,10)]);return false});!0===c.multipleGroup&&(c.multipleSearch=!0);a(e).triggerHandler("jqGridFilterInitialize",
[a("#"+l)]);a.isFunction(c.onInitializeSearch)&&c.onInitializeSearch.call(e,a("#"+l));c.gbox="#gbox_"+l;c.layer?a.jgrid.createModal(t,p,c,"#gview_"+a.jgrid.jqID(e.p.id),a("#gbox_"+a.jgrid.jqID(e.p.id))[0],"#"+a.jgrid.jqID(c.layer),{position:"relative"}):a.jgrid.createModal(t,p,c,"#gview_"+a.jgrid.jqID(e.p.id),a("#gbox_"+a.jgrid.jqID(e.p.id))[0]);(c.searchOnEnter||c.closeOnEscape)&&a("#"+a.jgrid.jqID(t.themodal)).keydown(function(b){var d=a(b.target);if(c.searchOnEnter&&b.which===13&&!d.hasClass("add-group")&&
!d.hasClass("add-rule")&&!d.hasClass("delete-group")&&!d.hasClass("delete-rule")&&(!d.hasClass("fm-button")||!d.is("[id$=_query]"))){a("#"+l+"_search").focus().click();return false}if(c.closeOnEscape&&b.which===27){a("#"+a.jgrid.jqID(t.modalhead)).find(".ui-jqdialog-titlebar-close").focus().click();return false}});m&&a("#"+l+"_query").bind("click",function(){a(".queryresult",p).toggle();return false});void 0===c.stringResult&&(c.stringResult=c.multipleSearch);a("#"+l+"_search").bind("click",function(){var b=
a("#"+l),d={},h,q=b.jqFilter("filterData");if(c.errorcheck){b[0].hideError();c.showQuery||b.jqFilter("toSQLString");if(b[0].p.error){b[0].showError();return false}}if(c.stringResult){try{h=xmlJsonClass.toJson(q,"","",false)}catch(f){try{h=JSON.stringify(q)}catch(g){}}if(typeof h==="string"){d[c.sFilter]=h;a.each([c.sField,c.sValue,c.sOper],function(){d[this]=""})}}else if(c.multipleSearch){d[c.sFilter]=q;a.each([c.sField,c.sValue,c.sOper],function(){d[this]=""})}else{d[c.sField]=q.rules[0].field;
d[c.sValue]=q.rules[0].data;d[c.sOper]=q.rules[0].op;d[c.sFilter]=""}e.p.search=true;a.extend(e.p.postData,d);a(e).triggerHandler("jqGridFilterSearch");a.isFunction(c.onSearch)&&c.onSearch.call(e);a(e).trigger("reloadGrid",[{page:1}]);c.closeAfterSearch&&a.jgrid.hideModal("#"+a.jgrid.jqID(t.themodal),{gb:"#gbox_"+a.jgrid.jqID(e.p.id),jqm:c.jqModal,onClose:c.onClose});return false});a("#"+l+"_reset").bind("click",function(){var b={},d=a("#"+l);e.p.search=false;c.multipleSearch===false?b[c.sField]=
b[c.sValue]=b[c.sOper]="":b[c.sFilter]="";d[0].resetFilter();j&&a(".ui-template",p).val("default");a.extend(e.p.postData,b);a(e).triggerHandler("jqGridFilterReset");a.isFunction(c.onReset)&&c.onReset.call(e);a(e).trigger("reloadGrid",[{page:1}]);return false});d(a("#"+l));a(".fm-button:not(.ui-state-disabled)",p).hover(function(){a(this).addClass("ui-state-hover")},function(){a(this).removeClass("ui-state-hover")})}}})},editGridRow:function(u,d){d=a.extend({top:0,left:0,width:300,height:"auto",dataheight:"auto",
modal:!1,overlay:30,drag:!0,resize:!0,url:null,mtype:"POST",clearAfterAdd:!0,closeAfterEdit:!1,reloadAfterSubmit:!0,onInitializeForm:null,beforeInitData:null,beforeShowForm:null,afterShowForm:null,beforeSubmit:null,afterSubmit:null,onclickSubmit:null,afterComplete:null,onclickPgButtons:null,afterclickPgButtons:null,editData:{},recreateForm:!1,jqModal:!0,closeOnEscape:!1,addedrow:"first",topinfo:"",bottominfo:"",saveicon:[],closeicon:[],savekey:[!1,13],navkeys:[!1,38,40],checkOnSubmit:!1,checkOnUpdate:!1,
_savedData:{},processing:!1,onClose:null,ajaxEditOptions:{},serializeEditData:null,viewPagerButtons:!0},a.jgrid.edit,d||{});c[a(this)[0].p.id]=d;return this.each(function(){function e(){a(j+" > tbody > tr > td > .FormElement").each(function(){var d=a(".customelement",this);if(d.length){var c=a(d[0]).attr("name");a.each(b.p.colModel,function(){if(this.name===c&&this.editoptions&&a.isFunction(this.editoptions.custom_value)){try{if(i[c]=this.editoptions.custom_value.call(b,a("#"+a.jgrid.jqID(c),j),"get"),
void 0===i[c])throw"e1";}catch(d){"e1"===d?a.jgrid.info_dialog(jQuery.jgrid.errors.errcap,"function 'custom_value' "+a.jgrid.edit.msg.novalue,jQuery.jgrid.edit.bClose):a.jgrid.info_dialog(jQuery.jgrid.errors.errcap,d.message,jQuery.jgrid.edit.bClose)}return!0}})}else{switch(a(this).get(0).type){case "checkbox":a(this).is(":checked")?i[this.name]=a(this).val():(d=a(this).attr("offval"),i[this.name]=d);break;case "select-one":i[this.name]=a("option:selected",this).val();B[this.name]=a("option:selected",
this).text();break;case "select-multiple":i[this.name]=a(this).val();i[this.name]=i[this.name]?i[this.name].join(","):"";var e=[];a("option:selected",this).each(function(b,d){e[b]=a(d).text()});B[this.name]=e.join(",");break;case "password":case "text":case "textarea":case "button":i[this.name]=a(this).val()}b.p.autoencode&&(i[this.name]=a.jgrid.htmlEncode(i[this.name]))}});return!0}function l(d,e,h,q){var i,f,g,k=0,j,o,l,p=[],n=!1,u="",m;for(m=1;m<=q;m++)u+="<td class='CaptionTD'>&#160;</td><td class='DataTD'>&#160;</td>";
"_empty"!=d&&(n=a(e).jqGrid("getInd",d));a(e.p.colModel).each(function(m){i=this.name;o=(f=this.editrules&&!0===this.editrules.edithidden?!1:!0===this.hidden?!0:!1)?"style='display:none'":"";if("cb"!==i&&"subgrid"!==i&&!0===this.editable&&"rn"!==i){if(!1===n)j="";else if(i==e.p.ExpandColumn&&!0===e.p.treeGrid)j=a("td:eq("+m+")",e.rows[n]).text();else{try{j=a.unformat.call(e,a("td:eq("+m+")",e.rows[n]),{rowId:d,colModel:this},m)}catch(r){j=this.edittype&&"textarea"==this.edittype?a("td:eq("+m+")",
e.rows[n]).text():a("td:eq("+m+")",e.rows[n]).html()}if(!j||"&nbsp;"==j||"&#160;"==j||1==j.length&&160==j.charCodeAt(0))j=""}var v=a.extend({},this.editoptions||{},{id:i,name:i}),s=a.extend({},{elmprefix:"",elmsuffix:"",rowabove:!1,rowcontent:""},this.formoptions||{}),t=parseInt(s.rowpos,10)||k+1,y=parseInt(2*(parseInt(s.colpos,10)||1),10);"_empty"==d&&v.defaultValue&&(j=a.isFunction(v.defaultValue)?v.defaultValue.call(b):v.defaultValue);this.edittype||(this.edittype="text");b.p.autoencode&&(j=a.jgrid.htmlDecode(j));
l=a.jgrid.createEl.call(b,this.edittype,v,j,!1,a.extend({},a.jgrid.ajaxOptions,e.p.ajaxSelectOptions||{}));""===j&&"checkbox"==this.edittype&&(j=a(l).attr("offval"));""===j&&"select"==this.edittype&&(j=a("option:eq(0)",l).text());if(c[b.p.id].checkOnSubmit||c[b.p.id].checkOnUpdate)c[b.p.id]._savedData[i]=j;a(l).addClass("FormElement");("text"==this.edittype||"textarea"==this.edittype)&&a(l).addClass("ui-widget-content ui-corner-all");g=a(h).find("tr[rowpos="+t+"]");s.rowabove&&(v=a("<tr><td class='contentinfo' colspan='"+
2*q+"'>"+s.rowcontent+"</td></tr>"),a(h).append(v),v[0].rp=t);0===g.length&&(g=a("<tr "+o+" rowpos='"+t+"'></tr>").addClass("FormData").attr("id","tr_"+i),a(g).append(u),a(h).append(g),g[0].rp=t);a("td:eq("+(y-2)+")",g[0]).html("undefined"===typeof s.label?e.p.colNames[m]:s.label);a("td:eq("+(y-1)+")",g[0]).append(s.elmprefix).append(l).append(s.elmsuffix);p[k]=m;k++}});if(0<k&&(m=a("<tr class='FormData' style='display:none'><td class='CaptionTD'></td><td colspan='"+(2*q-1)+"' class='DataTD'><input class='FormElement' id='id_g' type='text' name='"+
e.p.id+"_id' value='"+d+"'/></td></tr>"),m[0].rp=k+999,a(h).append(m),c[b.p.id].checkOnSubmit||c[b.p.id].checkOnUpdate))c[b.p.id]._savedData[e.p.id+"_id"]=d;return p}function r(d,e,h){var i,q=0,g,f,k,o,l;if(c[b.p.id].checkOnSubmit||c[b.p.id].checkOnUpdate)c[b.p.id]._savedData={},c[b.p.id]._savedData[e.p.id+"_id"]=d;var m=e.p.colModel;if("_empty"==d)a(m).each(function(){i=this.name;k=a.extend({},this.editoptions||{});if((f=a("#"+a.jgrid.jqID(i),"#"+h))&&f.length&&null!==f[0])if(o="",k.defaultValue?
(o=a.isFunction(k.defaultValue)?k.defaultValue.call(b):k.defaultValue,"checkbox"==f[0].type?(l=o.toLowerCase(),0>l.search(/(false|0|no|off|undefined)/i)&&""!==l?(f[0].checked=!0,f[0].defaultChecked=!0,f[0].value=o):(f[0].checked=!1,f[0].defaultChecked=!1)):f.val(o)):"checkbox"==f[0].type?(f[0].checked=!1,f[0].defaultChecked=!1,o=a(f).attr("offval")):f[0].type&&"select"==f[0].type.substr(0,6)?f[0].selectedIndex=0:f.val(o),!0===c[b.p.id].checkOnSubmit||c[b.p.id].checkOnUpdate)c[b.p.id]._savedData[i]=
o}),a("#id_g","#"+h).val(d);else{var n=a(e).jqGrid("getInd",d,!0);n&&(a('td[role="gridcell"]',n).each(function(f){i=m[f].name;if("cb"!==i&&"subgrid"!==i&&"rn"!==i&&!0===m[f].editable){if(i==e.p.ExpandColumn&&!0===e.p.treeGrid)g=a(this).text();else try{g=a.unformat.call(e,a(this),{rowId:d,colModel:m[f]},f)}catch(j){g="textarea"==m[f].edittype?a(this).text():a(this).html()}b.p.autoencode&&(g=a.jgrid.htmlDecode(g));if(!0===c[b.p.id].checkOnSubmit||c[b.p.id].checkOnUpdate)c[b.p.id]._savedData[i]=g;i=
a.jgrid.jqID(i);switch(m[f].edittype){case "password":case "text":case "button":case "image":case "textarea":if("&nbsp;"==g||"&#160;"==g||1==g.length&&160==g.charCodeAt(0))g="";a("#"+i,"#"+h).val(g);break;case "select":var k=g.split(","),k=a.map(k,function(b){return a.trim(b)});a("#"+i+" option","#"+h).each(function(){this.selected=!m[f].editoptions.multiple&&(a.trim(g)==a.trim(a(this).text())||k[0]==a.trim(a(this).text())||k[0]==a.trim(a(this).val()))?!0:m[f].editoptions.multiple?-1<a.inArray(a.trim(a(this).text()),
k)||-1<a.inArray(a.trim(a(this).val()),k)?!0:!1:!1});break;case "checkbox":g+="";m[f].editoptions&&m[f].editoptions.value?m[f].editoptions.value.split(":")[0]==g?(a("#"+i,"#"+h)[b.p.useProp?"prop":"attr"]("checked",!0),a("#"+i,"#"+h)[b.p.useProp?"prop":"attr"]("defaultChecked",!0)):(a("#"+i,"#"+h)[b.p.useProp?"prop":"attr"]("checked",!1),a("#"+i,"#"+h)[b.p.useProp?"prop":"attr"]("defaultChecked",!1)):(g=g.toLowerCase(),0>g.search(/(false|0|no|off|undefined)/i)&&""!==g?(a("#"+i,"#"+h)[b.p.useProp?
"prop":"attr"]("checked",!0),a("#"+i,"#"+h)[b.p.useProp?"prop":"attr"]("defaultChecked",!0)):(a("#"+i,"#"+h)[b.p.useProp?"prop":"attr"]("checked",!1),a("#"+i,"#"+h)[b.p.useProp?"prop":"attr"]("defaultChecked",!1)));break;case "custom":try{if(m[f].editoptions&&a.isFunction(m[f].editoptions.custom_value))m[f].editoptions.custom_value.call(b,a("#"+i,"#"+h),"set",g);else throw"e1";}catch(o){"e1"==o?a.jgrid.info_dialog(jQuery.jgrid.errors.errcap,"function 'custom_value' "+a.jgrid.edit.msg.nodefined,jQuery.jgrid.edit.bClose):
a.jgrid.info_dialog(jQuery.jgrid.errors.errcap,o.message,jQuery.jgrid.edit.bClose)}}q++}}),0<q&&a("#id_g",j).val(d))}}function t(){a.each(b.p.colModel,function(a,b){b.editoptions&&!0===b.editoptions.NullIfEmpty&&i.hasOwnProperty(b.name)&&""===i[b.name]&&(i[b.name]="null")})}function s(){var e,f=[!0,"",""],g={},q=b.p.prmNames,k,l,n,p,v,u=a(b).triggerHandler("jqGridAddEditBeforeCheckValues",[a("#"+h),z]);u&&"object"===typeof u&&(i=u);a.isFunction(c[b.p.id].beforeCheckValues)&&(u=c[b.p.id].beforeCheckValues.call(b,
i,a("#"+h),"_empty"==i[b.p.id+"_id"]?q.addoper:q.editoper))&&"object"===typeof u&&(i=u);for(n in i)if(i.hasOwnProperty(n)&&(f=a.jgrid.checkValues.call(b,i[n],n,b),!1===f[0]))break;t();f[0]&&(g=a(b).triggerHandler("jqGridAddEditClickSubmit",[c[b.p.id],i,z]),void 0===g&&a.isFunction(c[b.p.id].onclickSubmit)&&(g=c[b.p.id].onclickSubmit.call(b,c[b.p.id],i)||{}),f=a(b).triggerHandler("jqGridAddEditBeforeSubmit",[i,a("#"+h),z]),void 0===f&&(f=[!0,"",""]),f[0]&&a.isFunction(c[b.p.id].beforeSubmit)&&(f=c[b.p.id].beforeSubmit.call(b,
i,a("#"+h))));if(f[0]&&!c[b.p.id].processing){c[b.p.id].processing=!0;a("#sData",j+"_2").addClass("ui-state-active");l=q.oper;k=q.id;i[l]="_empty"==a.trim(i[b.p.id+"_id"])?q.addoper:q.editoper;i[l]!=q.addoper?i[k]=i[b.p.id+"_id"]:void 0===i[k]&&(i[k]=i[b.p.id+"_id"]);delete i[b.p.id+"_id"];i=a.extend(i,c[b.p.id].editData,g);if(!0===b.p.treeGrid)for(v in i[l]==q.addoper&&(p=a(b).jqGrid("getGridParam","selrow"),i["adjacency"==b.p.treeGridModel?b.p.treeReader.parent_id_field:"parent_id"]=p),b.p.treeReader)b.p.treeReader.hasOwnProperty(v)&&
(g=b.p.treeReader[v],i.hasOwnProperty(g)&&!(i[l]==q.addoper&&"parent_id_field"===v)&&delete i[g]);i[k]=a.jgrid.stripPref(b.p.idPrefix,i[k]);v=a.extend({url:c[b.p.id].url?c[b.p.id].url:a(b).jqGrid("getGridParam","editurl"),type:c[b.p.id].mtype,data:a.isFunction(c[b.p.id].serializeEditData)?c[b.p.id].serializeEditData.call(b,i):i,complete:function(g,n){i[k]=b.p.idPrefix+i[k];if(n!="success"){f[0]=false;f[1]=a(b).triggerHandler("jqGridAddEditErrorTextFormat",[g,z]);f[1]=a.isFunction(c[b.p.id].errorTextFormat)?
c[b.p.id].errorTextFormat.call(b,g):n+" Status: '"+g.statusText+"'. Error code: "+g.status}else{f=a(b).triggerHandler("jqGridAddEditAfterSubmit",[g,i,z]);f===void 0&&(f=[true,"",""]);f[0]&&a.isFunction(c[b.p.id].afterSubmit)&&(f=c[b.p.id].afterSubmit.call(b,g,i))}if(f[0]===false){a("#FormError>td",j).html(f[1]);a("#FormError",j).show()}else{a.each(b.p.colModel,function(){if(B[this.name]&&this.formatter&&this.formatter=="select")try{delete B[this.name]}catch(a){}});i=a.extend(i,B);b.p.autoencode&&
a.each(i,function(b,d){i[b]=a.jgrid.htmlDecode(d)});if(i[l]==q.addoper){f[2]||(f[2]=a.jgrid.randId());i[k]=f[2];if(c[b.p.id].closeAfterAdd){if(c[b.p.id].reloadAfterSubmit)a(b).trigger("reloadGrid");else if(b.p.treeGrid===true)a(b).jqGrid("addChildNode",f[2],p,i);else{a(b).jqGrid("addRowData",f[2],i,d.addedrow);a(b).jqGrid("setSelection",f[2])}a.jgrid.hideModal("#"+a.jgrid.jqID(o.themodal),{gb:"#gbox_"+a.jgrid.jqID(m),jqm:d.jqModal,onClose:c[b.p.id].onClose})}else if(c[b.p.id].clearAfterAdd){c[b.p.id].reloadAfterSubmit?
a(b).trigger("reloadGrid"):b.p.treeGrid===true?a(b).jqGrid("addChildNode",f[2],p,i):a(b).jqGrid("addRowData",f[2],i,d.addedrow);r("_empty",b,h)}else c[b.p.id].reloadAfterSubmit?a(b).trigger("reloadGrid"):b.p.treeGrid===true?a(b).jqGrid("addChildNode",f[2],p,i):a(b).jqGrid("addRowData",f[2],i,d.addedrow)}else{if(c[b.p.id].reloadAfterSubmit){a(b).trigger("reloadGrid");c[b.p.id].closeAfterEdit||setTimeout(function(){a(b).jqGrid("setSelection",i[k])},1E3)}else b.p.treeGrid===true?a(b).jqGrid("setTreeRow",
i[k],i):a(b).jqGrid("setRowData",i[k],i);c[b.p.id].closeAfterEdit&&a.jgrid.hideModal("#"+a.jgrid.jqID(o.themodal),{gb:"#gbox_"+a.jgrid.jqID(m),jqm:d.jqModal,onClose:c[b.p.id].onClose})}if(a.isFunction(c[b.p.id].afterComplete)){e=g;setTimeout(function(){a(b).triggerHandler("jqGridAddEditAfterComplete",[e,i,a("#"+h),z]);c[b.p.id].afterComplete.call(b,e,i,a("#"+h));e=null},500)}if(c[b.p.id].checkOnSubmit||c[b.p.id].checkOnUpdate){a("#"+h).data("disabled",false);if(c[b.p.id]._savedData[b.p.id+"_id"]!=
"_empty")for(var v in c[b.p.id]._savedData)i[v]&&(c[b.p.id]._savedData[v]=i[v])}}c[b.p.id].processing=false;a("#sData",j+"_2").removeClass("ui-state-active");try{a(":input:visible","#"+h)[0].focus()}catch(u){}}},a.jgrid.ajaxOptions,c[b.p.id].ajaxEditOptions);!v.url&&!c[b.p.id].useDataProxy&&(a.isFunction(b.p.dataProxy)?c[b.p.id].useDataProxy=!0:(f[0]=!1,f[1]+=" "+a.jgrid.errors.nourl));f[0]&&(c[b.p.id].useDataProxy?(g=b.p.dataProxy.call(b,v,"set_"+b.p.id),"undefined"==typeof g&&(g=[!0,""]),!1===g[0]?
(f[0]=!1,f[1]=g[1]||"Error deleting the selected row!"):(v.data.oper==q.addoper&&c[b.p.id].closeAfterAdd&&a.jgrid.hideModal("#"+a.jgrid.jqID(o.themodal),{gb:"#gbox_"+a.jgrid.jqID(m),jqm:d.jqModal,onClose:c[b.p.id].onClose}),v.data.oper==q.editoper&&c[b.p.id].closeAfterEdit&&a.jgrid.hideModal("#"+a.jgrid.jqID(o.themodal),{gb:"#gbox_"+a.jgrid.jqID(m),jqm:d.jqModal,onClose:c[b.p.id].onClose}))):a.ajax(v))}!1===f[0]&&(a("#FormError>td",j).html(f[1]),a("#FormError",j).show())}function p(a,b){var d=!1,
c;for(c in a)if(a[c]!=b[c]){d=!0;break}return d}function g(){var d=!0;a("#FormError",j).hide();if(c[b.p.id].checkOnUpdate&&(i={},B={},e(),F=a.extend({},i,B),M=p(F,c[b.p.id]._savedData)))a("#"+h).data("disabled",!0),a(".confirm","#"+o.themodal).show(),d=!1;return d}function f(){if("_empty"!==u&&"undefined"!==typeof b.p.savedRow&&0<b.p.savedRow.length&&a.isFunction(a.fn.jqGrid.restoreRow))for(var d=0;d<b.p.savedRow.length;d++)if(b.p.savedRow[d].id==u){a(b).jqGrid("restoreRow",u);break}}function n(b,
d){0===b?a("#pData",j+"_2").addClass("ui-state-disabled"):a("#pData",j+"_2").removeClass("ui-state-disabled");b==d?a("#nData",j+"_2").addClass("ui-state-disabled"):a("#nData",j+"_2").removeClass("ui-state-disabled")}function w(){var d=a(b).jqGrid("getDataIDs"),c=a("#id_g",j).val();return[a.inArray(c,d),d]}var b=this;if(b.grid&&u){var m=b.p.id,h="FrmGrid_"+m,k="TblGrid_"+m,j="#"+a.jgrid.jqID(k),o={themodal:"editmod"+m,modalhead:"edithd"+m,modalcontent:"editcnt"+m,scrollelm:h},y=a.isFunction(c[b.p.id].beforeShowForm)?
c[b.p.id].beforeShowForm:!1,A=a.isFunction(c[b.p.id].afterShowForm)?c[b.p.id].afterShowForm:!1,x=a.isFunction(c[b.p.id].beforeInitData)?c[b.p.id].beforeInitData:!1,E=a.isFunction(c[b.p.id].onInitializeForm)?c[b.p.id].onInitializeForm:!1,q=!0,v=1,H=0,i,B,F,M,z,h=a.jgrid.jqID(h);"new"===u?(u="_empty",z="add",d.caption=c[b.p.id].addCaption):(d.caption=c[b.p.id].editCaption,z="edit");!0===d.recreateForm&&null!==a("#"+a.jgrid.jqID(o.themodal)).html()&&a("#"+a.jgrid.jqID(o.themodal)).remove();var I=!0;
d.checkOnUpdate&&(d.jqModal&&!d.modal)&&(I=!1);if(null!==a("#"+a.jgrid.jqID(o.themodal)).html()){q=a(b).triggerHandler("jqGridAddEditBeforeInitData",[a("#"+a.jgrid.jqID(h))]);"undefined"==typeof q&&(q=!0);q&&x&&(q=x.call(b,a("#"+h)));if(!1===q)return;f();a(".ui-jqdialog-title","#"+a.jgrid.jqID(o.modalhead)).html(d.caption);a("#FormError",j).hide();c[b.p.id].topinfo?(a(".topinfo",j).html(c[b.p.id].topinfo),a(".tinfo",j).show()):a(".tinfo",j).hide();c[b.p.id].bottominfo?(a(".bottominfo",j+"_2").html(c[b.p.id].bottominfo),
a(".binfo",j+"_2").show()):a(".binfo",j+"_2").hide();r(u,b,h);"_empty"==u||!c[b.p.id].viewPagerButtons?a("#pData, #nData",j+"_2").hide():a("#pData, #nData",j+"_2").show();!0===c[b.p.id].processing&&(c[b.p.id].processing=!1,a("#sData",j+"_2").removeClass("ui-state-active"));!0===a("#"+h).data("disabled")&&(a(".confirm","#"+a.jgrid.jqID(o.themodal)).hide(),a("#"+h).data("disabled",!1));a(b).triggerHandler("jqGridAddEditBeforeShowForm",[a("#"+h),z]);y&&y.call(b,a("#"+h));a("#"+a.jgrid.jqID(o.themodal)).data("onClose",
c[b.p.id].onClose);a.jgrid.viewModal("#"+a.jgrid.jqID(o.themodal),{gbox:"#gbox_"+a.jgrid.jqID(m),jqm:d.jqModal,jqM:!1,overlay:d.overlay,modal:d.modal});I||a(".jqmOverlay").click(function(){if(!g())return false;a.jgrid.hideModal("#"+a.jgrid.jqID(o.themodal),{gb:"#gbox_"+a.jgrid.jqID(m),jqm:d.jqModal,onClose:c[b.p.id].onClose});return false});a(b).triggerHandler("jqGridAddEditAfterShowForm",[a("#"+h),z]);A&&A.call(b,a("#"+h))}else{var G=isNaN(d.dataheight)?d.dataheight:d.dataheight+"px",G=a("<form name='FormPost' id='"+
h+"' class='FormGrid' onSubmit='return false;' style='width:100%;overflow:auto;position:relative;height:"+G+";'></form>").data("disabled",!1),C=a("<table id='"+k+"' class='EditTable' cellspacing='0' cellpadding='0' border='0'><tbody></tbody></table>"),q=a(b).triggerHandler("jqGridAddEditBeforeInitData",[a("#"+h),z]);"undefined"==typeof q&&(q=!0);q&&x&&(q=x.call(b,a("#"+h)));if(!1===q)return;f();a(b.p.colModel).each(function(){var a=this.formoptions;v=Math.max(v,a?a.colpos||0:0);H=Math.max(H,a?a.rowpos||
0:0)});a(G).append(C);x=a("<tr id='FormError' style='display:none'><td class='ui-state-error' colspan='"+2*v+"'></td></tr>");x[0].rp=0;a(C).append(x);x=a("<tr style='display:none' class='tinfo'><td class='topinfo' colspan='"+2*v+"'>"+c[b.p.id].topinfo+"</td></tr>");x[0].rp=0;a(C).append(x);var q=(x="rtl"==b.p.direction?!0:!1)?"nData":"pData",D=x?"pData":"nData";l(u,b,C,v);var q="<a href='javascript:void(0)' id='"+q+"' class='fm-button ui-state-default ui-corner-left'><span class='ui-icon ui-icon-triangle-1-w'></span></a>",
D="<a href='javascript:void(0)' id='"+D+"' class='fm-button ui-state-default ui-corner-right'><span class='ui-icon ui-icon-triangle-1-e'></span></a>",J="<a href='javascript:void(0)' id='sData' class='fm-button ui-state-default ui-corner-all'>"+d.bSubmit+"</a>",K="<a href='javascript:void(0)' id='cData' class='fm-button ui-state-default ui-corner-all'>"+d.bCancel+"</a>",k="<table border='0' cellspacing='0' cellpadding='0' class='EditTable' id='"+k+"_2'><tbody><tr><td colspan='2'><hr class='ui-widget-content' style='margin:1px'/></td></tr><tr id='Act_Buttons'><td class='navButton'>"+
(x?D+q:q+D)+"</td><td class='EditButton'>"+J+K+"</td></tr>"+("<tr style='display:none' class='binfo'><td class='bottominfo' colspan='2'>"+c[b.p.id].bottominfo+"</td></tr>"),k=k+"</tbody></table>";if(0<H){var L=[];a.each(a(C)[0].rows,function(a,b){L[a]=b});L.sort(function(a,b){return a.rp>b.rp?1:a.rp<b.rp?-1:0});a.each(L,function(b,d){a("tbody",C).append(d)})}d.gbox="#gbox_"+a.jgrid.jqID(m);var N=!1;!0===d.closeOnEscape&&(d.closeOnEscape=!1,N=!0);k=a("<span></span>").append(G).append(k);a.jgrid.createModal(o,
k,d,"#gview_"+a.jgrid.jqID(b.p.id),a("#gbox_"+a.jgrid.jqID(b.p.id))[0]);x&&(a("#pData, #nData",j+"_2").css("float","right"),a(".EditButton",j+"_2").css("text-align","left"));c[b.p.id].topinfo&&a(".tinfo",j).show();c[b.p.id].bottominfo&&a(".binfo",j+"_2").show();k=k=null;a("#"+a.jgrid.jqID(o.themodal)).keydown(function(e){var f=e.target;if(a("#"+h).data("disabled")===true)return false;if(c[b.p.id].savekey[0]===true&&e.which==c[b.p.id].savekey[1]&&f.tagName!="TEXTAREA"){a("#sData",j+"_2").trigger("click");
return false}if(e.which===27){if(!g())return false;N&&a.jgrid.hideModal(this,{gb:d.gbox,jqm:d.jqModal,onClose:c[b.p.id].onClose});return false}if(c[b.p.id].navkeys[0]===true){if(a("#id_g",j).val()=="_empty")return true;if(e.which==c[b.p.id].navkeys[1]){a("#pData",j+"_2").trigger("click");return false}if(e.which==c[b.p.id].navkeys[2]){a("#nData",j+"_2").trigger("click");return false}}});d.checkOnUpdate&&(a("a.ui-jqdialog-titlebar-close span","#"+a.jgrid.jqID(o.themodal)).removeClass("jqmClose"),a("a.ui-jqdialog-titlebar-close",
"#"+a.jgrid.jqID(o.themodal)).unbind("click").click(function(){if(!g())return false;a.jgrid.hideModal("#"+a.jgrid.jqID(o.themodal),{gb:"#gbox_"+a.jgrid.jqID(m),jqm:d.jqModal,onClose:c[b.p.id].onClose});return false}));d.saveicon=a.extend([!0,"left","ui-icon-disk"],d.saveicon);d.closeicon=a.extend([!0,"left","ui-icon-close"],d.closeicon);!0===d.saveicon[0]&&a("#sData",j+"_2").addClass("right"==d.saveicon[1]?"fm-button-icon-right":"fm-button-icon-left").append("<span class='ui-icon "+d.saveicon[2]+
"'></span>");!0===d.closeicon[0]&&a("#cData",j+"_2").addClass("right"==d.closeicon[1]?"fm-button-icon-right":"fm-button-icon-left").append("<span class='ui-icon "+d.closeicon[2]+"'></span>");if(c[b.p.id].checkOnSubmit||c[b.p.id].checkOnUpdate)J="<a href='javascript:void(0)' id='sNew' class='fm-button ui-state-default ui-corner-all' style='z-index:1002'>"+d.bYes+"</a>",D="<a href='javascript:void(0)' id='nNew' class='fm-button ui-state-default ui-corner-all' style='z-index:1002'>"+d.bNo+"</a>",K="<a href='javascript:void(0)' id='cNew' class='fm-button ui-state-default ui-corner-all' style='z-index:1002'>"+
d.bExit+"</a>",k=d.zIndex||999,k++,a("<div class='ui-widget-overlay jqgrid-overlay confirm' style='z-index:"+k+";display:none;'>&#160;"+(a.browser.msie&&6==a.browser.version?'<iframe style="display:block;position:absolute;z-index:-1;filter:Alpha(Opacity=\'0\');" src="javascript:false;"></iframe>':"")+"</div><div class='confirm ui-widget-content ui-jqconfirm' style='z-index:"+(k+1)+"'>"+d.saveData+"<br/><br/>"+J+D+K+"</div>").insertAfter("#"+h),a("#sNew","#"+a.jgrid.jqID(o.themodal)).click(function(){s();
a("#"+h).data("disabled",false);a(".confirm","#"+a.jgrid.jqID(o.themodal)).hide();return false}),a("#nNew","#"+a.jgrid.jqID(o.themodal)).click(function(){a(".confirm","#"+a.jgrid.jqID(o.themodal)).hide();a("#"+h).data("disabled",false);setTimeout(function(){a(":input","#"+h)[0].focus()},0);return false}),a("#cNew","#"+a.jgrid.jqID(o.themodal)).click(function(){a(".confirm","#"+a.jgrid.jqID(o.themodal)).hide();a("#"+h).data("disabled",false);a.jgrid.hideModal("#"+a.jgrid.jqID(o.themodal),{gb:"#gbox_"+
a.jgrid.jqID(m),jqm:d.jqModal,onClose:c[b.p.id].onClose});return false});a(b).triggerHandler("jqGridAddEditInitializeForm",[a("#"+h),z]);E&&E.call(b,a("#"+h));"_empty"==u||!c[b.p.id].viewPagerButtons?a("#pData,#nData",j+"_2").hide():a("#pData,#nData",j+"_2").show();a(b).triggerHandler("jqGridAddEditBeforeShowForm",[a("#"+h),z]);y&&y.call(b,a("#"+h));a("#"+a.jgrid.jqID(o.themodal)).data("onClose",c[b.p.id].onClose);a.jgrid.viewModal("#"+a.jgrid.jqID(o.themodal),{gbox:"#gbox_"+a.jgrid.jqID(m),jqm:d.jqModal,
overlay:d.overlay,modal:d.modal});I||a(".jqmOverlay").click(function(){if(!g())return false;a.jgrid.hideModal("#"+a.jgrid.jqID(o.themodal),{gb:"#gbox_"+a.jgrid.jqID(m),jqm:d.jqModal,onClose:c[b.p.id].onClose});return false});a(b).triggerHandler("jqGridAddEditAfterShowForm",[a("#"+h),z]);A&&A.call(b,a("#"+h));a(".fm-button","#"+a.jgrid.jqID(o.themodal)).hover(function(){a(this).addClass("ui-state-hover")},function(){a(this).removeClass("ui-state-hover")});a("#sData",j+"_2").click(function(){i={};B=
{};a("#FormError",j).hide();e();if(i[b.p.id+"_id"]=="_empty")s();else if(d.checkOnSubmit===true){F=a.extend({},i,B);if(M=p(F,c[b.p.id]._savedData)){a("#"+h).data("disabled",true);a(".confirm","#"+a.jgrid.jqID(o.themodal)).show()}else s()}else s();return false});a("#cData",j+"_2").click(function(){if(!g())return false;a.jgrid.hideModal("#"+a.jgrid.jqID(o.themodal),{gb:"#gbox_"+a.jgrid.jqID(m),jqm:d.jqModal,onClose:c[b.p.id].onClose});return false});a("#nData",j+"_2").click(function(){if(!g())return false;
a("#FormError",j).hide();var c=w();c[0]=parseInt(c[0],10);if(c[0]!=-1&&c[1][c[0]+1]){a(b).triggerHandler("jqGridAddEditClickPgButtons",["next",a("#"+h),c[1][c[0]]]);a.isFunction(d.onclickPgButtons)&&d.onclickPgButtons.call(b,"next",a("#"+h),c[1][c[0]]);r(c[1][c[0]+1],b,h);a(b).jqGrid("setSelection",c[1][c[0]+1]);a(b).triggerHandler("jqGridAddEditAfterClickPgButtons",["next",a("#"+h),c[1][c[0]]]);a.isFunction(d.afterclickPgButtons)&&d.afterclickPgButtons.call(b,"next",a("#"+h),c[1][c[0]+1]);n(c[0]+
1,c[1].length-1)}return false});a("#pData",j+"_2").click(function(){if(!g())return false;a("#FormError",j).hide();var c=w();if(c[0]!=-1&&c[1][c[0]-1]){a(b).triggerHandler("jqGridAddEditClickPgButtons",["prev",a("#"+h),c[1][c[0]]]);a.isFunction(d.onclickPgButtons)&&d.onclickPgButtons.call(b,"prev",a("#"+h),c[1][c[0]]);r(c[1][c[0]-1],b,h);a(b).jqGrid("setSelection",c[1][c[0]-1]);a(b).triggerHandler("jqGridAddEditAfterClickPgButtons",["prev",a("#"+h),c[1][c[0]]]);a.isFunction(d.afterclickPgButtons)&&
d.afterclickPgButtons.call(b,"prev",a("#"+h),c[1][c[0]-1]);n(c[0]-1,c[1].length-1)}return false})}y=w();n(y[0],y[1].length-1)}})},viewGridRow:function(c,d){d=a.extend({top:0,left:0,width:0,height:"auto",dataheight:"auto",modal:!1,overlay:30,drag:!0,resize:!0,jqModal:!0,closeOnEscape:!1,labelswidth:"30%",closeicon:[],navkeys:[!1,38,40],onClose:null,beforeShowForm:null,beforeInitData:null,viewPagerButtons:!0},a.jgrid.view,d||{});return this.each(function(){function e(){(!0===d.closeOnEscape||!0===d.navkeys[0])&&
setTimeout(function(){a(".ui-jqdialog-titlebar-close","#"+a.jgrid.jqID(m.modalhead)).focus()},0)}function l(b,c,e,f){for(var g,h,k,j=0,o,m,l=[],n=!1,p="<td class='CaptionTD form-view-label ui-widget-content' width='"+d.labelswidth+"'>&#160;</td><td class='DataTD form-view-data ui-helper-reset ui-widget-content'>&#160;</td>",u="",s=["integer","number","currency"],r=0,t=0,y,x,w,A=1;A<=f;A++)u+=1==A?p:"<td class='CaptionTD form-view-label ui-widget-content'>&#160;</td><td class='DataTD form-view-data ui-widget-content'>&#160;</td>";
a(c.p.colModel).each(function(){h=this.editrules&&!0===this.editrules.edithidden?!1:!0===this.hidden?!0:!1;!h&&"right"===this.align&&(this.formatter&&-1!==a.inArray(this.formatter,s)?r=Math.max(r,parseInt(this.width,10)):t=Math.max(t,parseInt(this.width,10)))});y=0!==r?r:0!==t?t:0;n=a(c).jqGrid("getInd",b);a(c.p.colModel).each(function(b){g=this.name;x=!1;m=(h=this.editrules&&!0===this.editrules.edithidden?!1:!0===this.hidden?!0:!1)?"style='display:none'":"";w="boolean"!=typeof this.viewable?!0:this.viewable;
if("cb"!==g&&"subgrid"!==g&&"rn"!==g&&w){o=!1===n?"":g==c.p.ExpandColumn&&!0===c.p.treeGrid?a("td:eq("+b+")",c.rows[n]).text():a("td:eq("+b+")",c.rows[n]).html();x="right"===this.align&&0!==y?!0:!1;a.extend({},this.editoptions||{},{id:g,name:g});var d=a.extend({},{rowabove:!1,rowcontent:""},this.formoptions||{}),q=parseInt(d.rowpos,10)||j+1,p=parseInt(2*(parseInt(d.colpos,10)||1),10);if(d.rowabove){var r=a("<tr><td class='contentinfo' colspan='"+2*f+"'>"+d.rowcontent+"</td></tr>");a(e).append(r);
r[0].rp=q}k=a(e).find("tr[rowpos="+q+"]");0===k.length&&(k=a("<tr "+m+" rowpos='"+q+"'></tr>").addClass("FormData").attr("id","trv_"+g),a(k).append(u),a(e).append(k),k[0].rp=q);a("td:eq("+(p-2)+")",k[0]).html("<b>"+("undefined"===typeof d.label?c.p.colNames[b]:d.label)+"</b>");a("td:eq("+(p-1)+")",k[0]).append("<span>"+o+"</span>").attr("id","v_"+g);x&&a("td:eq("+(p-1)+") span",k[0]).css({"text-align":"right",width:y+"px"});l[j]=b;j++}});0<j&&(b=a("<tr class='FormData' style='display:none'><td class='CaptionTD'></td><td colspan='"+
(2*f-1)+"' class='DataTD'><input class='FormElement' id='id_g' type='text' name='id' value='"+b+"'/></td></tr>"),b[0].rp=j+99,a(e).append(b));return l}function r(b,c){var d,e,f=0,g,h;if(h=a(c).jqGrid("getInd",b,!0))a("td",h).each(function(b){d=c.p.colModel[b].name;e=c.p.colModel[b].editrules&&!0===c.p.colModel[b].editrules.edithidden?!1:!0===c.p.colModel[b].hidden?!0:!1;"cb"!==d&&("subgrid"!==d&&"rn"!==d)&&(g=d==c.p.ExpandColumn&&!0===c.p.treeGrid?a(this).text():a(this).html(),a.extend({},c.p.colModel[b].editoptions||
{}),d=a.jgrid.jqID("v_"+d),a("#"+d+" span","#"+n).html(g),e&&a("#"+d,"#"+n).parents("tr:first").hide(),f++)}),0<f&&a("#id_g","#"+n).val(b)}function t(b,c){0===b?a("#pData","#"+n+"_2").addClass("ui-state-disabled"):a("#pData","#"+n+"_2").removeClass("ui-state-disabled");b==c?a("#nData","#"+n+"_2").addClass("ui-state-disabled"):a("#nData","#"+n+"_2").removeClass("ui-state-disabled")}function s(){var b=a(p).jqGrid("getDataIDs"),c=a("#id_g","#"+n).val();return[a.inArray(c,b),b]}var p=this;if(p.grid&&
c){var g=p.p.id,f="ViewGrid_"+a.jgrid.jqID(g),n="ViewTbl_"+a.jgrid.jqID(g),w="ViewGrid_"+g,b="ViewTbl_"+g,m={themodal:"viewmod"+g,modalhead:"viewhd"+g,modalcontent:"viewcnt"+g,scrollelm:f},h=a.isFunction(d.beforeInitData)?d.beforeInitData:!1,k=!0,j=1,o=0;if(null!==a("#"+a.jgrid.jqID(m.themodal)).html()){h&&(k=h.call(p,a("#"+f)),"undefined"==typeof k&&(k=!0));if(!1===k)return;a(".ui-jqdialog-title","#"+a.jgrid.jqID(m.modalhead)).html(d.caption);a("#FormError","#"+n).hide();r(c,p);a.isFunction(d.beforeShowForm)&&
d.beforeShowForm.call(p,a("#"+f));a.jgrid.viewModal("#"+a.jgrid.jqID(m.themodal),{gbox:"#gbox_"+a.jgrid.jqID(g),jqm:d.jqModal,jqM:!1,overlay:d.overlay,modal:d.modal});e()}else{var y=isNaN(d.dataheight)?d.dataheight:d.dataheight+"px",w=a("<form name='FormPost' id='"+w+"' class='FormGrid' style='width:100%;overflow:auto;position:relative;height:"+y+";'></form>"),A=a("<table id='"+b+"' class='EditTable' cellspacing='1' cellpadding='2' border='0' style='table-layout:fixed'><tbody></tbody></table>");h&&
(k=h.call(p,a("#"+f)),"undefined"==typeof k&&(k=!0));if(!1===k)return;a(p.p.colModel).each(function(){var a=this.formoptions;j=Math.max(j,a?a.colpos||0:0);o=Math.max(o,a?a.rowpos||0:0)});a(w).append(A);l(c,p,A,j);b="rtl"==p.p.direction?!0:!1;h="<a href='javascript:void(0)' id='"+(b?"nData":"pData")+"' class='fm-button ui-state-default ui-corner-left'><span class='ui-icon ui-icon-triangle-1-w'></span></a>";k="<a href='javascript:void(0)' id='"+(b?"pData":"nData")+"' class='fm-button ui-state-default ui-corner-right'><span class='ui-icon ui-icon-triangle-1-e'></span></a>";
y="<a href='javascript:void(0)' id='cData' class='fm-button ui-state-default ui-corner-all'>"+d.bClose+"</a>";if(0<o){var x=[];a.each(a(A)[0].rows,function(a,b){x[a]=b});x.sort(function(a,b){return a.rp>b.rp?1:a.rp<b.rp?-1:0});a.each(x,function(b,c){a("tbody",A).append(c)})}d.gbox="#gbox_"+a.jgrid.jqID(g);var E=!1;!0===d.closeOnEscape&&(d.closeOnEscape=!1,E=!0);w=a("<span></span>").append(w).append("<table border='0' class='EditTable' id='"+n+"_2'><tbody><tr id='Act_Buttons'><td class='navButton' width='"+
d.labelswidth+"'>"+(b?k+h:h+k)+"</td><td class='EditButton'>"+y+"</td></tr></tbody></table>");a.jgrid.createModal(m,w,d,"#gview_"+a.jgrid.jqID(p.p.id),a("#gview_"+a.jgrid.jqID(p.p.id))[0]);b&&(a("#pData, #nData","#"+n+"_2").css("float","right"),a(".EditButton","#"+n+"_2").css("text-align","left"));d.viewPagerButtons||a("#pData, #nData","#"+n+"_2").hide();w=null;a("#"+m.themodal).keydown(function(b){if(b.which===27){E&&a.jgrid.hideModal(this,{gb:d.gbox,jqm:d.jqModal,onClose:d.onClose});return false}if(d.navkeys[0]===
true){if(b.which===d.navkeys[1]){a("#pData","#"+n+"_2").trigger("click");return false}if(b.which===d.navkeys[2]){a("#nData","#"+n+"_2").trigger("click");return false}}});d.closeicon=a.extend([!0,"left","ui-icon-close"],d.closeicon);!0===d.closeicon[0]&&a("#cData","#"+n+"_2").addClass("right"==d.closeicon[1]?"fm-button-icon-right":"fm-button-icon-left").append("<span class='ui-icon "+d.closeicon[2]+"'></span>");a.isFunction(d.beforeShowForm)&&d.beforeShowForm.call(p,a("#"+f));a.jgrid.viewModal("#"+
a.jgrid.jqID(m.themodal),{gbox:"#gbox_"+a.jgrid.jqID(g),jqm:d.jqModal,modal:d.modal});a(".fm-button:not(.ui-state-disabled)","#"+n+"_2").hover(function(){a(this).addClass("ui-state-hover")},function(){a(this).removeClass("ui-state-hover")});e();a("#cData","#"+n+"_2").click(function(){a.jgrid.hideModal("#"+a.jgrid.jqID(m.themodal),{gb:"#gbox_"+a.jgrid.jqID(g),jqm:d.jqModal,onClose:d.onClose});return false});a("#nData","#"+n+"_2").click(function(){a("#FormError","#"+n).hide();var b=s();b[0]=parseInt(b[0],
10);if(b[0]!=-1&&b[1][b[0]+1]){a.isFunction(d.onclickPgButtons)&&d.onclickPgButtons.call(p,"next",a("#"+f),b[1][b[0]]);r(b[1][b[0]+1],p);a(p).jqGrid("setSelection",b[1][b[0]+1]);a.isFunction(d.afterclickPgButtons)&&d.afterclickPgButtons.call(p,"next",a("#"+f),b[1][b[0]+1]);t(b[0]+1,b[1].length-1)}e();return false});a("#pData","#"+n+"_2").click(function(){a("#FormError","#"+n).hide();var b=s();if(b[0]!=-1&&b[1][b[0]-1]){a.isFunction(d.onclickPgButtons)&&d.onclickPgButtons.call(p,"prev",a("#"+f),b[1][b[0]]);
r(b[1][b[0]-1],p);a(p).jqGrid("setSelection",b[1][b[0]-1]);a.isFunction(d.afterclickPgButtons)&&d.afterclickPgButtons.call(p,"prev",a("#"+f),b[1][b[0]-1]);t(b[0]-1,b[1].length-1)}e();return false})}w=s();t(w[0],w[1].length-1)}})},delGridRow:function(u,d){d=a.extend({top:0,left:0,width:240,height:"auto",dataheight:"auto",modal:!1,overlay:30,drag:!0,resize:!0,url:"",mtype:"POST",reloadAfterSubmit:!0,beforeShowForm:null,beforeInitData:null,afterShowForm:null,beforeSubmit:null,onclickSubmit:null,afterSubmit:null,
jqModal:!0,closeOnEscape:!1,delData:{},delicon:[],cancelicon:[],onClose:null,ajaxDelOptions:{},processing:!1,serializeDelData:null,useDataProxy:!1},a.jgrid.del,d||{});c[a(this)[0].p.id]=d;return this.each(function(){var e=this;if(e.grid&&u){var l=a.isFunction(c[e.p.id].beforeShowForm),r=a.isFunction(c[e.p.id].afterShowForm),t=a.isFunction(c[e.p.id].beforeInitData)?c[e.p.id].beforeInitData:!1,s=e.p.id,p={},g=!0,f="DelTbl_"+a.jgrid.jqID(s),n,w,b,m,h="DelTbl_"+s,k={themodal:"delmod"+s,modalhead:"delhd"+
s,modalcontent:"delcnt"+s,scrollelm:f};jQuery.isArray(u)&&(u=u.join());if(null!==a("#"+a.jgrid.jqID(k.themodal)).html()){t&&(g=t.call(e,a("#"+f)),"undefined"==typeof g&&(g=!0));if(!1===g)return;a("#DelData>td","#"+f).text(u);a("#DelError","#"+f).hide();!0===c[e.p.id].processing&&(c[e.p.id].processing=!1,a("#dData","#"+f).removeClass("ui-state-active"));l&&c[e.p.id].beforeShowForm.call(e,a("#"+f));a.jgrid.viewModal("#"+a.jgrid.jqID(k.themodal),{gbox:"#gbox_"+a.jgrid.jqID(s),jqm:c[e.p.id].jqModal,jqM:!1,
overlay:c[e.p.id].overlay,modal:c[e.p.id].modal})}else{var j=isNaN(c[e.p.id].dataheight)?c[e.p.id].dataheight:c[e.p.id].dataheight+"px",h="<div id='"+h+"' class='formdata' style='width:100%;overflow:auto;position:relative;height:"+j+";'><table class='DelTable'><tbody><tr id='DelError' style='display:none'><td class='ui-state-error'></td></tr>"+("<tr id='DelData' style='display:none'><td >"+u+"</td></tr>"),h=h+('<tr><td class="delmsg" style="white-space:pre;">'+c[e.p.id].msg+"</td></tr><tr><td >&#160;</td></tr>"),
h=h+"</tbody></table></div>"+("<table cellspacing='0' cellpadding='0' border='0' class='EditTable' id='"+f+"_2'><tbody><tr><td><hr class='ui-widget-content' style='margin:1px'/></td></tr><tr><td class='DelButton EditButton'>"+("<a href='javascript:void(0)' id='dData' class='fm-button ui-state-default ui-corner-all'>"+d.bSubmit+"</a>")+"&#160;"+("<a href='javascript:void(0)' id='eData' class='fm-button ui-state-default ui-corner-all'>"+d.bCancel+"</a>")+"</td></tr></tbody></table>");d.gbox="#gbox_"+
a.jgrid.jqID(s);a.jgrid.createModal(k,h,d,"#gview_"+a.jgrid.jqID(e.p.id),a("#gview_"+a.jgrid.jqID(e.p.id))[0]);t&&(g=t.call(e,a("#"+f)),"undefined"==typeof g&&(g=!0));if(!1===g)return;a(".fm-button","#"+f+"_2").hover(function(){a(this).addClass("ui-state-hover")},function(){a(this).removeClass("ui-state-hover")});d.delicon=a.extend([!0,"left","ui-icon-scissors"],c[e.p.id].delicon);d.cancelicon=a.extend([!0,"left","ui-icon-cancel"],c[e.p.id].cancelicon);!0===d.delicon[0]&&a("#dData","#"+f+"_2").addClass("right"==
d.delicon[1]?"fm-button-icon-right":"fm-button-icon-left").append("<span class='ui-icon "+d.delicon[2]+"'></span>");!0===d.cancelicon[0]&&a("#eData","#"+f+"_2").addClass("right"==d.cancelicon[1]?"fm-button-icon-right":"fm-button-icon-left").append("<span class='ui-icon "+d.cancelicon[2]+"'></span>");a("#dData","#"+f+"_2").click(function(){var g=[true,""];p={};var h=a("#DelData>td","#"+f).text();a.isFunction(c[e.p.id].onclickSubmit)&&(p=c[e.p.id].onclickSubmit.call(e,c[e.p.id],h)||{});a.isFunction(c[e.p.id].beforeSubmit)&&
(g=c[e.p.id].beforeSubmit.call(e,h));if(g[0]&&!c[e.p.id].processing){c[e.p.id].processing=true;b=e.p.prmNames;n=a.extend({},c[e.p.id].delData,p);m=b.oper;n[m]=b.deloper;w=b.id;h=(""+h).split(",");if(!h.length)return false;for(var j in h)h.hasOwnProperty(j)&&(h[j]=a.jgrid.stripPref(e.p.idPrefix,h[j]));n[w]=h.join();a(this).addClass("ui-state-active");j=a.extend({url:c[e.p.id].url?c[e.p.id].url:a(e).jqGrid("getGridParam","editurl"),type:c[e.p.id].mtype,data:a.isFunction(c[e.p.id].serializeDelData)?
c[e.p.id].serializeDelData.call(e,n):n,complete:function(b,j){if(j!="success"){g[0]=false;g[1]=a.isFunction(c[e.p.id].errorTextFormat)?c[e.p.id].errorTextFormat.call(e,b):j+" Status: '"+b.statusText+"'. Error code: "+b.status}else a.isFunction(c[e.p.id].afterSubmit)&&(g=c[e.p.id].afterSubmit.call(e,b,n));if(g[0]===false){a("#DelError>td","#"+f).html(g[1]);a("#DelError","#"+f).show()}else{if(c[e.p.id].reloadAfterSubmit&&e.p.datatype!="local")a(e).trigger("reloadGrid");else{if(e.p.treeGrid===true)try{a(e).jqGrid("delTreeNode",
e.p.idPrefix+h[0])}catch(m){}else for(var l=0;l<h.length;l++)a(e).jqGrid("delRowData",e.p.idPrefix+h[l]);e.p.selrow=null;e.p.selarrrow=[]}a.isFunction(c[e.p.id].afterComplete)&&setTimeout(function(){c[e.p.id].afterComplete.call(e,b,h)},500)}c[e.p.id].processing=false;a("#dData","#"+f+"_2").removeClass("ui-state-active");g[0]&&a.jgrid.hideModal("#"+a.jgrid.jqID(k.themodal),{gb:"#gbox_"+a.jgrid.jqID(s),jqm:d.jqModal,onClose:c[e.p.id].onClose})}},a.jgrid.ajaxOptions,c[e.p.id].ajaxDelOptions);if(!j.url&&
!c[e.p.id].useDataProxy)if(a.isFunction(e.p.dataProxy))c[e.p.id].useDataProxy=true;else{g[0]=false;g[1]=g[1]+(" "+a.jgrid.errors.nourl)}if(g[0])if(c[e.p.id].useDataProxy){j=e.p.dataProxy.call(e,j,"del_"+e.p.id);typeof j=="undefined"&&(j=[true,""]);if(j[0]===false){g[0]=false;g[1]=j[1]||"Error deleting the selected row!"}else a.jgrid.hideModal("#"+a.jgrid.jqID(k.themodal),{gb:"#gbox_"+a.jgrid.jqID(s),jqm:d.jqModal,onClose:c[e.p.id].onClose})}else a.ajax(j)}if(g[0]===false){a("#DelError>td","#"+f).html(g[1]);
a("#DelError","#"+f).show()}return false});a("#eData","#"+f+"_2").click(function(){a.jgrid.hideModal("#"+a.jgrid.jqID(k.themodal),{gb:"#gbox_"+a.jgrid.jqID(s),jqm:c[e.p.id].jqModal,onClose:c[e.p.id].onClose});return false});l&&c[e.p.id].beforeShowForm.call(e,a("#"+f));a.jgrid.viewModal("#"+a.jgrid.jqID(k.themodal),{gbox:"#gbox_"+a.jgrid.jqID(s),jqm:c[e.p.id].jqModal,overlay:c[e.p.id].overlay,modal:c[e.p.id].modal})}r&&c[e.p.id].afterShowForm.call(e,a("#"+f));!0===c[e.p.id].closeOnEscape&&setTimeout(function(){a(".ui-jqdialog-titlebar-close",
"#"+a.jgrid.jqID(k.modalhead)).focus()},0)}})},navGrid:function(c,d,e,l,r,t,s){d=a.extend({edit:!0,editicon:"ui-icon-pencil",add:!0,addicon:"ui-icon-plus",del:!0,delicon:"ui-icon-trash",search:!0,searchicon:"ui-icon-search",refresh:!0,refreshicon:"ui-icon-refresh",refreshstate:"firstpage",view:!1,viewicon:"ui-icon-document",position:"left",closeOnEscape:!0,beforeRefresh:null,afterRefresh:null,cloneToTop:!1,alertwidth:200,alertheight:"auto",alerttop:null,alertleft:null,alertzIndex:null},a.jgrid.nav,
d||{});return this.each(function(){if(!this.nav){var p={themodal:"alertmod",modalhead:"alerthd",modalcontent:"alertcnt"},g=this,f;if(g.grid&&"string"==typeof c){null===a("#"+p.themodal).html()&&(!d.alerttop&&!d.alertleft&&("undefined"!=typeof window.innerWidth?(d.alertleft=window.innerWidth,d.alerttop=window.innerHeight):"undefined"!=typeof document.documentElement&&"undefined"!=typeof document.documentElement.clientWidth&&0!==document.documentElement.clientWidth?(d.alertleft=document.documentElement.clientWidth,
d.alerttop=document.documentElement.clientHeight):(d.alertleft=1024,d.alerttop=768),d.alertleft=d.alertleft/2-parseInt(d.alertwidth,10)/2,d.alerttop=d.alerttop/2-25),a.jgrid.createModal(p,"<div>"+d.alerttext+"</div><span tabindex='0'><span tabindex='-1' id='jqg_alrt'></span></span>",{gbox:"#gbox_"+a.jgrid.jqID(g.p.id),jqModal:!0,drag:!0,resize:!0,caption:d.alertcap,top:d.alerttop,left:d.alertleft,width:d.alertwidth,height:d.alertheight,closeOnEscape:d.closeOnEscape,zIndex:d.alertzIndex},"","",!0));
var n=1;d.cloneToTop&&g.p.toppager&&(n=2);for(var w=0;w<n;w++){var b=a("<table cellspacing='0' cellpadding='0' border='0' class='ui-pg-table navtable' style='float:left;table-layout:auto;'><tbody><tr></tr></tbody></table>"),m,h;0===w?(m=c,h=g.p.id,m==g.p.toppager&&(h+="_top",n=1)):(m=g.p.toppager,h=g.p.id+"_top");"rtl"==g.p.direction&&a(b).attr("dir","rtl").css("float","right");d.add&&(l=l||{},f=a("<td class='ui-pg-button ui-corner-all'></td>"),a(f).append("<div class='ui-pg-div'><span class='ui-icon "+
d.addicon+"'></span>"+d.addtext+"</div>"),a("tr",b).append(f),a(f,b).attr({title:d.addtitle||"",id:l.id||"add_"+h}).click(function(){a(this).hasClass("ui-state-disabled")||(a.isFunction(d.addfunc)?d.addfunc.call(g):a(g).jqGrid("editGridRow","new",l));return false}).hover(function(){a(this).hasClass("ui-state-disabled")||a(this).addClass("ui-state-hover")},function(){a(this).removeClass("ui-state-hover")}),f=null);d.edit&&(f=a("<td class='ui-pg-button ui-corner-all'></td>"),e=e||{},a(f).append("<div class='ui-pg-div'><span class='ui-icon "+
d.editicon+"'></span>"+d.edittext+"</div>"),a("tr",b).append(f),a(f,b).attr({title:d.edittitle||"",id:e.id||"edit_"+h}).click(function(){if(!a(this).hasClass("ui-state-disabled")){var b=g.p.selrow;if(b)a.isFunction(d.editfunc)?d.editfunc.call(g,b):a(g).jqGrid("editGridRow",b,e);else{a.jgrid.viewModal("#"+p.themodal,{gbox:"#gbox_"+a.jgrid.jqID(g.p.id),jqm:true});a("#jqg_alrt").focus()}}return false}).hover(function(){a(this).hasClass("ui-state-disabled")||a(this).addClass("ui-state-hover")},function(){a(this).removeClass("ui-state-hover")}),
f=null);d.view&&(f=a("<td class='ui-pg-button ui-corner-all'></td>"),s=s||{},a(f).append("<div class='ui-pg-div'><span class='ui-icon "+d.viewicon+"'></span>"+d.viewtext+"</div>"),a("tr",b).append(f),a(f,b).attr({title:d.viewtitle||"",id:s.id||"view_"+h}).click(function(){if(!a(this).hasClass("ui-state-disabled")){var b=g.p.selrow;if(b)a.isFunction(d.viewfunc)?d.viewfunc.call(g,b):a(g).jqGrid("viewGridRow",b,s);else{a.jgrid.viewModal("#"+p.themodal,{gbox:"#gbox_"+a.jgrid.jqID(g.p.id),jqm:true});a("#jqg_alrt").focus()}}return false}).hover(function(){a(this).hasClass("ui-state-disabled")||
a(this).addClass("ui-state-hover")},function(){a(this).removeClass("ui-state-hover")}),f=null);d.del&&(f=a("<td class='ui-pg-button ui-corner-all'></td>"),r=r||{},a(f).append("<div class='ui-pg-div'><span class='ui-icon "+d.delicon+"'></span>"+d.deltext+"</div>"),a("tr",b).append(f),a(f,b).attr({title:d.deltitle||"",id:r.id||"del_"+h}).click(function(){if(!a(this).hasClass("ui-state-disabled")){var b;if(g.p.multiselect){b=g.p.selarrrow;b.length===0&&(b=null)}else b=g.p.selrow;if(b)a.isFunction(d.delfunc)?
d.delfunc.call(g,b):a(g).jqGrid("delGridRow",b,r);else{a.jgrid.viewModal("#"+p.themodal,{gbox:"#gbox_"+a.jgrid.jqID(g.p.id),jqm:true});a("#jqg_alrt").focus()}}return false}).hover(function(){a(this).hasClass("ui-state-disabled")||a(this).addClass("ui-state-hover")},function(){a(this).removeClass("ui-state-hover")}),f=null);(d.add||d.edit||d.del||d.view)&&a("tr",b).append("<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='ui-separator'></span></td>");d.search&&(f=a("<td class='ui-pg-button ui-corner-all'></td>"),
t=t||{},a(f).append("<div class='ui-pg-div'><span class='ui-icon "+d.searchicon+"'></span>"+d.searchtext+"</div>"),a("tr",b).append(f),a(f,b).attr({title:d.searchtitle||"",id:t.id||"search_"+h}).click(function(){a(this).hasClass("ui-state-disabled")||(a.isFunction(d.searchfunc)?d.searchfunc.call(g,t):a(g).jqGrid("searchGrid",t));return false}).hover(function(){a(this).hasClass("ui-state-disabled")||a(this).addClass("ui-state-hover")},function(){a(this).removeClass("ui-state-hover")}),t.showOnLoad&&
!0===t.showOnLoad&&a(f,b).click(),f=null);d.refresh&&(f=a("<td class='ui-pg-button ui-corner-all'></td>"),a(f).append("<div class='ui-pg-div'><span class='ui-icon "+d.refreshicon+"'></span>"+d.refreshtext+"</div>"),a("tr",b).append(f),a(f,b).attr({title:d.refreshtitle||"",id:"refresh_"+h}).click(function(){if(!a(this).hasClass("ui-state-disabled")){a.isFunction(d.beforeRefresh)&&d.beforeRefresh.call(g);g.p.search=false;try{var b=g.p.id;g.p.postData.filters="";a("#fbox_"+a.jgrid.jqID(b)).jqFilter("resetFilter");
a.isFunction(g.clearToolbar)&&g.clearToolbar.call(g,false)}catch(c){}switch(d.refreshstate){case "firstpage":a(g).trigger("reloadGrid",[{page:1}]);break;case "current":a(g).trigger("reloadGrid",[{current:true}])}a.isFunction(d.afterRefresh)&&d.afterRefresh.call(g)}return false}).hover(function(){a(this).hasClass("ui-state-disabled")||a(this).addClass("ui-state-hover")},function(){a(this).removeClass("ui-state-hover")}),f=null);f=a(".ui-jqgrid").css("font-size")||"11px";a("body").append("<div id='testpg2' class='ui-jqgrid ui-widget ui-widget-content' style='font-size:"+
f+";visibility:hidden;' ></div>");f=a(b).clone().appendTo("#testpg2").width();a("#testpg2").remove();a(m+"_"+d.position,m).append(b);g.p._nvtd&&(f>g.p._nvtd[0]&&(a(m+"_"+d.position,m).width(f),g.p._nvtd[0]=f),g.p._nvtd[1]=f);b=f=f=null;this.nav=!0}}}})},navButtonAdd:function(c,d){d=a.extend({caption:"newButton",title:"",buttonicon:"ui-icon-newwin",onClickButton:null,position:"last",cursor:"pointer"},d||{});return this.each(function(){if(this.grid){"string"===typeof c&&0!==c.indexOf("#")&&(c="#"+a.jgrid.jqID(c));
var e=a(".navtable",c)[0],l=this;if(e&&!(d.id&&null!==a("#"+a.jgrid.jqID(d.id),e).html())){var r=a("<td></td>");"NONE"==d.buttonicon.toString().toUpperCase()?a(r).addClass("ui-pg-button ui-corner-all").append("<div class='ui-pg-div'>"+d.caption+"</div>"):a(r).addClass("ui-pg-button ui-corner-all").append("<div class='ui-pg-div'><span class='ui-icon "+d.buttonicon+"'></span>"+d.caption+"</div>");d.id&&a(r).attr("id",d.id);"first"==d.position?0===e.rows[0].cells.length?a("tr",e).append(r):a("tr td:eq(0)",
e).before(r):a("tr",e).append(r);a(r,e).attr("title",d.title||"").click(function(c){a(this).hasClass("ui-state-disabled")||a.isFunction(d.onClickButton)&&d.onClickButton.call(l,c);return!1}).hover(function(){a(this).hasClass("ui-state-disabled")||a(this).addClass("ui-state-hover")},function(){a(this).removeClass("ui-state-hover")})}}})},navSeparatorAdd:function(c,d){d=a.extend({sepclass:"ui-separator",sepcontent:""},d||{});return this.each(function(){if(this.grid){"string"===typeof c&&0!==c.indexOf("#")&&
(c="#"+a.jgrid.jqID(c));var e=a(".navtable",c)[0];if(e){var l="<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='"+d.sepclass+"'></span>"+d.sepcontent+"</td>";a("tr",e).append(l)}}})},GridToForm:function(c,d){return this.each(function(){var e=this;if(e.grid){var l=a(e).jqGrid("getRowData",c);if(l)for(var r in l)a("[name="+a.jgrid.jqID(r)+"]",d).is("input:radio")||a("[name="+a.jgrid.jqID(r)+"]",d).is("input:checkbox")?a("[name="+a.jgrid.jqID(r)+"]",d).each(function(){if(a(this).val()==
l[r])a(this)[e.p.useProp?"prop":"attr"]("checked",!0);else a(this)[e.p.useProp?"prop":"attr"]("checked",!1)}):a("[name="+a.jgrid.jqID(r)+"]",d).val(l[r])}})},FormToGrid:function(c,d,e,l){return this.each(function(){if(this.grid){e||(e="set");l||(l="first");var r=a(d).serializeArray(),t={};a.each(r,function(a,c){t[c.name]=c.value});"add"==e?a(this).jqGrid("addRowData",c,t,l):"set"==e&&a(this).jqGrid("setRowData",c,t)}})}})})(jQuery);
(function(a){a.fn.jqFilter=function(d){if("string"===typeof d){var n=a.fn.jqFilter[d];if(!n)throw"jqFilter - No such method: "+d;var u=a.makeArray(arguments).slice(1);return n.apply(this,u)}var o=a.extend(!0,{filter:null,columns:[],onChange:null,afterRedraw:null,checkValues:null,error:!1,errmsg:"",errorcheck:!0,showQuery:!0,sopt:null,ops:[{name:"eq",description:"equal",operator:"="},{name:"ne",description:"not equal",operator:"<>"},{name:"lt",description:"less",operator:"<"},{name:"le",description:"less or equal",
operator:"<="},{name:"gt",description:"greater",operator:">"},{name:"ge",description:"greater or equal",operator:">="},{name:"bw",description:"begins with",operator:"LIKE"},{name:"bn",description:"does not begin with",operator:"NOT LIKE"},{name:"in",description:"in",operator:"IN"},{name:"ni",description:"not in",operator:"NOT IN"},{name:"ew",description:"ends with",operator:"LIKE"},{name:"en",description:"does not end with",operator:"NOT LIKE"},{name:"cn",description:"contains",operator:"LIKE"},{name:"nc",
description:"does not contain",operator:"NOT LIKE"},{name:"nu",description:"is null",operator:"IS NULL"},{name:"nn",description:"is not null",operator:"IS NOT NULL"}],numopts:"eq ne lt le gt ge nu nn in ni".split(" "),stropts:"eq ne bw bn ew en cn nc nu nn in ni".split(" "),_gridsopt:[],groupOps:[{op:"AND",text:"AND"},{op:"OR",text:"OR"}],groupButton:!0,ruleButtons:!0,direction:"ltr"},a.jgrid.filter,d||{});return this.each(function(){if(!this.filter){this.p=o;if(null===this.p.filter||void 0===this.p.filter)this.p.filter=
{groupOp:this.p.groupOps[0].op,rules:[],groups:[]};var d,n=this.p.columns.length,f,t=/msie/i.test(navigator.userAgent)&&!window.opera;if(this.p._gridsopt.length)for(d=0;d<this.p._gridsopt.length;d++)this.p.ops[d].description=this.p._gridsopt[d];this.p.initFilter=a.extend(!0,{},this.p.filter);if(n){for(d=0;d<n;d++)if(f=this.p.columns[d],f.stype?f.inputtype=f.stype:f.inputtype||(f.inputtype="text"),f.sorttype?f.searchtype=f.sorttype:f.searchtype||(f.searchtype="string"),void 0===f.hidden&&(f.hidden=
!1),f.label||(f.label=f.name),f.index&&(f.name=f.index),f.hasOwnProperty("searchoptions")||(f.searchoptions={}),!f.hasOwnProperty("searchrules"))f.searchrules={};this.p.showQuery&&a(this).append("<table class='queryresult ui-widget ui-widget-content' style='display:block;max-width:440px;border:0px none;' dir='"+this.p.direction+"'><tbody><tr><td class='query'></td></tr></tbody></table>");var r=function(g,k){var b=[!0,""];if(a.isFunction(k.searchrules))b=k.searchrules(g,k);else if(a.jgrid&&a.jgrid.checkValues)try{b=
a.jgrid.checkValues(g,-1,null,k.searchrules,k.label)}catch(c){}b&&(b.length&&!1===b[0])&&(o.error=!b[0],o.errmsg=b[1])};this.onchange=function(){this.p.error=!1;this.p.errmsg="";return a.isFunction(this.p.onChange)?this.p.onChange.call(this,this.p):!1};this.reDraw=function(){a("table.group:first",this).remove();var g=this.createTableForGroup(o.filter,null);a(this).append(g);a.isFunction(this.p.afterRedraw)&&this.p.afterRedraw.call(this,this.p)};this.createTableForGroup=function(g,k){var b=this,c,
e=a("<table class='group ui-widget ui-widget-content' style='border:0px none;'><tbody></tbody></table>"),d="left";"rtl"==this.p.direction&&(d="right",e.attr("dir","rtl"));null===k&&e.append("<tr class='error' style='display:none;'><th colspan='5' class='ui-state-error' align='"+d+"'></th></tr>");var h=a("<tr></tr>");e.append(h);d=a("<th colspan='5' align='"+d+"'></th>");h.append(d);if(!0===this.p.ruleButtons){var i=a("<select class='opsel'></select>");d.append(i);var h="",f;for(c=0;c<o.groupOps.length;c++)f=
g.groupOp===b.p.groupOps[c].op?" selected='selected'":"",h+="<option value='"+b.p.groupOps[c].op+"'"+f+">"+b.p.groupOps[c].text+"</option>";i.append(h).bind("change",function(){g.groupOp=a(i).val();b.onchange()})}h="<span></span>";this.p.groupButton&&(h=a("<input type='button' value='+ {}' title='Add subgroup' class='add-group'/>"),h.bind("click",function(){if(g.groups===void 0)g.groups=[];g.groups.push({groupOp:o.groupOps[0].op,rules:[],groups:[]});b.reDraw();b.onchange();return false}));d.append(h);
if(!0===this.p.ruleButtons){var h=a("<input type='button' value='+' title='Add rule' class='add-rule ui-add'/>"),l;h.bind("click",function(){if(g.rules===void 0)g.rules=[];for(c=0;c<b.p.columns.length;c++){var a=typeof b.p.columns[c].search==="undefined"?true:b.p.columns[c].search,e=b.p.columns[c].hidden===true;if(b.p.columns[c].searchoptions.searchhidden===true&&a||a&&!e){l=b.p.columns[c];break}}g.rules.push({field:l.name,op:(l.searchoptions.sopt?l.searchoptions.sopt:b.p.sopt?b.p.sopt:l.searchtype===
"string"?b.p.stropts:b.p.numopts)[0],data:""});b.reDraw();return false});d.append(h)}null!==k&&(h=a("<input type='button' value='-' title='Delete group' class='delete-group'/>"),d.append(h),h.bind("click",function(){for(c=0;c<k.groups.length;c++)if(k.groups[c]===g){k.groups.splice(c,1);break}b.reDraw();b.onchange();return false}));if(void 0!==g.groups)for(c=0;c<g.groups.length;c++)d=a("<tr></tr>"),e.append(d),h=a("<td class='first'></td>"),d.append(h),h=a("<td colspan='4'></td>"),h.append(this.createTableForGroup(g.groups[c],
g)),d.append(h);void 0===g.groupOp&&(g.groupOp=b.p.groupOps[0].op);if(void 0!==g.rules)for(c=0;c<g.rules.length;c++)e.append(this.createTableRowForRule(g.rules[c],g));return e};this.createTableRowForRule=function(g,d){var b=this,c=a("<tr></tr>"),e,f,h,i,j="",l;c.append("<td class='first'></td>");var m=a("<td class='columns'></td>");c.append(m);var n=a("<select></select>"),p,q=[];m.append(n);n.bind("change",function(){g.field=a(n).val();h=a(this).parents("tr:first");for(e=0;e<b.p.columns.length;e++)if(b.p.columns[e].name===
g.field){i=b.p.columns[e];break}if(i){i.searchoptions.id=a.jgrid.randId();t&&"text"===i.inputtype&&!i.searchoptions.size&&(i.searchoptions.size=10);var c=a.jgrid.createEl(i.inputtype,i.searchoptions,"",!0,b.p.ajaxSelectOptions,!0);a(c).addClass("input-elm");f=i.searchoptions.sopt?i.searchoptions.sopt:b.p.sopt?b.p.sopt:"string"===i.searchtype?b.p.stropts:b.p.numopts;var d="",k=0;q=[];a.each(b.p.ops,function(){q.push(this.name)});for(e=0;e<f.length;e++)p=a.inArray(f[e],q),-1!==p&&(0===k&&(g.op=b.p.ops[p].name),
d+="<option value='"+b.p.ops[p].name+"'>"+b.p.ops[p].description+"</option>",k++);a(".selectopts",h).empty().append(d);a(".selectopts",h)[0].selectedIndex=0;a.browser.msie&&9>a.browser.version&&(d=parseInt(a("select.selectopts",h)[0].offsetWidth)+1,a(".selectopts",h).width(d),a(".selectopts",h).css("width","auto"));a(".data",h).empty().append(c);a(".input-elm",h).bind("change",function(c){var d=a(this).hasClass("ui-autocomplete-input")?200:0;setTimeout(function(){var d=c.target;g.data=d.nodeName.toUpperCase()===
"SPAN"&&i.searchoptions&&a.isFunction(i.searchoptions.custom_value)?i.searchoptions.custom_value(a(d).children(".customelement:first"),"get"):d.value;b.onchange()},d)});setTimeout(function(){g.data=a(c).val();b.onchange()},0)}});for(e=m=0;e<b.p.columns.length;e++){l="undefined"===typeof b.p.columns[e].search?!0:b.p.columns[e].search;var r=!0===b.p.columns[e].hidden;if(!0===b.p.columns[e].searchoptions.searchhidden&&l||l&&!r)l="",g.field===b.p.columns[e].name&&(l=" selected='selected'",m=e),j+="<option value='"+
b.p.columns[e].name+"'"+l+">"+b.p.columns[e].label+"</option>"}n.append(j);j=a("<td class='operators'></td>");c.append(j);i=o.columns[m];i.searchoptions.id=a.jgrid.randId();t&&"text"===i.inputtype&&!i.searchoptions.size&&(i.searchoptions.size=10);var m=a.jgrid.createEl(i.inputtype,i.searchoptions,g.data,!0,b.p.ajaxSelectOptions,!0),s=a("<select class='selectopts'></select>");j.append(s);s.bind("change",function(){g.op=a(s).val();h=a(this).parents("tr:first");var c=a(".input-elm",h)[0];if(g.op==="nu"||
g.op==="nn"){g.data="";c.value="";c.setAttribute("readonly","true");c.setAttribute("disabled","true")}else{c.removeAttribute("readonly");c.removeAttribute("disabled")}b.onchange()});f=i.searchoptions.sopt?i.searchoptions.sopt:b.p.sopt?b.p.sopt:"string"===i.searchtype?o.stropts:b.p.numopts;j="";a.each(b.p.ops,function(){q.push(this.name)});for(e=0;e<f.length;e++)p=a.inArray(f[e],q),-1!==p&&(l=g.op===b.p.ops[p].name?" selected='selected'":"",j+="<option value='"+b.p.ops[p].name+"'"+l+">"+b.p.ops[p].description+
"</option>");s.append(j);j=a("<td class='data'></td>");c.append(j);j.append(m);a(m).addClass("input-elm").bind("change",function(){g.data=i.inputtype==="custom"?i.searchoptions.custom_value(a(this).children(".customelement:first"),"get"):a(this).val();b.onchange()});j=a("<td></td>");c.append(j);!0===this.p.ruleButtons&&(m=a("<input type='button' value='-' title='Delete rule' class='delete-rule ui-del'/>"),j.append(m),m.bind("click",function(){for(e=0;e<d.rules.length;e++)if(d.rules[e]===g){d.rules.splice(e,
1);break}b.reDraw();b.onchange();return false}));return c};this.getStringForGroup=function(a){var d="(",b;if(void 0!==a.groups)for(b=0;b<a.groups.length;b++){1<d.length&&(d+=" "+a.groupOp+" ");try{d+=this.getStringForGroup(a.groups[b])}catch(c){alert(c)}}if(void 0!==a.rules)try{for(b=0;b<a.rules.length;b++)1<d.length&&(d+=" "+a.groupOp+" "),d+=this.getStringForRule(a.rules[b])}catch(e){alert(e)}d+=")";return"()"===d?"":d};this.getStringForRule=function(d){var f="",b="",c,e;for(c=0;c<this.p.ops.length;c++)if(this.p.ops[c].name===
d.op){f=this.p.ops[c].operator;b=this.p.ops[c].name;break}for(c=0;c<this.p.columns.length;c++)if(this.p.columns[c].name===d.field){e=this.p.columns[c];break}c=d.data;if("bw"===b||"bn"===b)c+="%";if("ew"===b||"en"===b)c="%"+c;if("cn"===b||"nc"===b)c="%"+c+"%";if("in"===b||"ni"===b)c=" ("+c+")";o.errorcheck&&r(d.data,e);return-1!==a.inArray(e.searchtype,["int","integer","float","number","currency"])||"nn"===b||"nu"===b?d.field+" "+f+" "+c:d.field+" "+f+' "'+c+'"'};this.resetFilter=function(){this.p.filter=
a.extend(!0,{},this.p.initFilter);this.reDraw();this.onchange()};this.hideError=function(){a("th.ui-state-error",this).html("");a("tr.error",this).hide()};this.showError=function(){a("th.ui-state-error",this).html(this.p.errmsg);a("tr.error",this).show()};this.toUserFriendlyString=function(){return this.getStringForGroup(o.filter)};this.toString=function(){function a(b){var c="(",e;if(void 0!==b.groups)for(e=0;e<b.groups.length;e++)1<c.length&&(c="OR"===b.groupOp?c+" || ":c+" && "),c+=a(b.groups[e]);
if(void 0!==b.rules)for(e=0;e<b.rules.length;e++){1<c.length&&(c="OR"===b.groupOp?c+" || ":c+" && ");var f=b.rules[e];if(d.p.errorcheck){for(var h=void 0,i=void 0,h=0;h<d.p.columns.length;h++)if(d.p.columns[h].name===f.field){i=d.p.columns[h];break}i&&r(f.data,i)}c+=f.op+"(item."+f.field+",'"+f.data+"')"}c+=")";return"()"===c?"":c}var d=this;return a(this.p.filter)};this.reDraw();if(this.p.showQuery)this.onchange();this.filter=!0}}})};a.extend(a.fn.jqFilter,{toSQLString:function(){var a="";this.each(function(){a=
this.toUserFriendlyString()});return a},filterData:function(){var a;this.each(function(){a=this.p.filter});return a},getParameter:function(a){return void 0!==a&&this.p.hasOwnProperty(a)?this.p[a]:this.p},resetFilter:function(){return this.each(function(){this.resetFilter()})},addFilter:function(a){"string"===typeof a&&(a=jQuery.jgrid.parse(a));this.each(function(){this.p.filter=a;this.reDraw();this.onchange()})}})})(jQuery);
(function(a){a.jgrid.inlineEdit=a.jgrid.inlineEdit||{};a.jgrid.extend({editRow:function(c,b,d,k,g,l,p,h,f){var j={},e=a.makeArray(arguments).slice(1);if("object"===a.type(e[0]))j=e[0];else if("undefined"!==typeof b&&(j.keys=b),a.isFunction(d)&&(j.oneditfunc=d),a.isFunction(k)&&(j.successfunc=k),"undefined"!==typeof g&&(j.url=g),"undefined"!==typeof l&&(j.extraparam=l),a.isFunction(p)&&(j.aftersavefunc=p),a.isFunction(h)&&(j.errorfunc=h),a.isFunction(f))j.afterrestorefunc=f;j=a.extend(!0,{keys:!1,
oneditfunc:null,successfunc:null,url:null,extraparam:{},aftersavefunc:null,errorfunc:null,afterrestorefunc:null,restoreAfterError:!0,mtype:"POST"},a.jgrid.inlineEdit,j);return this.each(function(){var b=this,f,d,e,g=0,h=null,l={},m,n;b.grid&&(m=a(b).jqGrid("getInd",c,!0),!1!==m&&(e=a(m).attr("editable")||"0","0"==e&&!a(m).hasClass("not-editable-row")&&(n=b.p.colModel,a('td[role="gridcell"]',m).each(function(e){f=n[e].name;var j=!0===b.p.treeGrid&&f==b.p.ExpandColumn;if(j)d=a("span:first",this).html();
else try{d=a.unformat.call(b,this,{rowId:c,colModel:n[e]},e)}catch(m){d=n[e].edittype&&"textarea"==n[e].edittype?a(this).text():a(this).html()}if("cb"!=f&&("subgrid"!=f&&"rn"!=f)&&(b.p.autoencode&&(d=a.jgrid.htmlDecode(d)),l[f]=d,!0===n[e].editable)){null===h&&(h=e);j?a("span:first",this).html(""):a(this).html("");var k=a.extend({},n[e].editoptions||{},{id:c+"_"+f,name:f});n[e].edittype||(n[e].edittype="text");if("&nbsp;"==d||"&#160;"==d||1==d.length&&160==d.charCodeAt(0))d="";k=a.jgrid.createEl.call(b,
n[e].edittype,k,d,!0,a.extend({},a.jgrid.ajaxOptions,b.p.ajaxSelectOptions||{}));a(k).addClass("editable");j?a("span:first",this).append(k):a(this).append(k);"select"==n[e].edittype&&("undefined"!==typeof n[e].editoptions&&!0===n[e].editoptions.multiple&&"undefined"===typeof n[e].editoptions.dataUrl&&a.browser.msie)&&a(k).width(a(k).width());g++}}),0<g&&(l.id=c,b.p.savedRow.push(l),a(m).attr("editable","1"),a("td:eq("+h+") input",m).focus(),!0===j.keys&&a(m).bind("keydown",function(e){if(27===e.keyCode){a(b).jqGrid("restoreRow",
c,j.afterrestorefunc);if(b.p._inlinenav)try{a(b).jqGrid("showAddEditButtons")}catch(d){}return!1}if(13===e.keyCode){if("TEXTAREA"==e.target.tagName)return!0;if(a(b).jqGrid("saveRow",c,j)&&b.p._inlinenav)try{a(b).jqGrid("showAddEditButtons")}catch(f){}return!1}}),a(b).triggerHandler("jqGridInlineEditRow",[c,j]),a.isFunction(j.oneditfunc)&&j.oneditfunc.call(b,c)))))})},saveRow:function(c,b,d,k,g,l,p){var h=a.makeArray(arguments).slice(1),f={};if("object"===a.type(h[0]))f=h[0];else if(a.isFunction(b)&&
(f.successfunc=b),"undefined"!==typeof d&&(f.url=d),"undefined"!==typeof k&&(f.extraparam=k),a.isFunction(g)&&(f.aftersavefunc=g),a.isFunction(l)&&(f.errorfunc=l),a.isFunction(p))f.afterrestorefunc=p;var f=a.extend(!0,{successfunc:null,url:null,extraparam:{},aftersavefunc:null,errorfunc:null,afterrestorefunc:null,restoreAfterError:!0,mtype:"POST"},a.jgrid.inlineEdit,f),j=!1,e=this[0],o,i={},u={},r={},t,s,q;if(!e.grid)return j;q=a(e).jqGrid("getInd",c,!0);if(!1===q)return j;h=a(q).attr("editable");
f.url=f.url?f.url:e.p.editurl;if("1"===h){var m;a('td[role="gridcell"]',q).each(function(b){m=e.p.colModel[b];o=m.name;if("cb"!=o&&"subgrid"!=o&&!0===m.editable&&"rn"!=o&&!a(this).hasClass("not-editable-cell")){switch(m.edittype){case "checkbox":var c=["Yes","No"];m.editoptions&&(c=m.editoptions.value.split(":"));i[o]=a("input",this).is(":checked")?c[0]:c[1];break;case "text":case "password":case "textarea":case "button":i[o]=a("input, textarea",this).val();break;case "select":if(m.editoptions.multiple){var c=
a("select",this),d=[];i[o]=a(c).val();i[o]=i[o]?i[o].join(","):"";a("select option:selected",this).each(function(b,c){d[b]=a(c).text()});u[o]=d.join(",")}else i[o]=a("select option:selected",this).val(),u[o]=a("select option:selected",this).text();m.formatter&&"select"==m.formatter&&(u={});break;case "custom":try{if(m.editoptions&&a.isFunction(m.editoptions.custom_value)){if(i[o]=m.editoptions.custom_value.call(e,a(".customelement",this),"get"),void 0===i[o])throw"e2";}else throw"e1";}catch(g){"e1"==
g&&a.jgrid.info_dialog(a.jgrid.errors.errcap,"function 'custom_value' "+a.jgrid.edit.msg.nodefined,a.jgrid.edit.bClose),"e2"==g?a.jgrid.info_dialog(a.jgrid.errors.errcap,"function 'custom_value' "+a.jgrid.edit.msg.novalue,a.jgrid.edit.bClose):a.jgrid.info_dialog(a.jgrid.errors.errcap,g.message,a.jgrid.edit.bClose)}}s=a.jgrid.checkValues(i[o],b,e);if(!1===s[0])return s[1]=i[o]+" "+s[1],!1;e.p.autoencode&&(i[o]=a.jgrid.htmlEncode(i[o]));"clientArray"!==f.url&&m.editoptions&&!0===m.editoptions.NullIfEmpty&&
""===i[o]&&(r[o]="null")}});if(!1===s[0]){try{var n=a.jgrid.findPos(a("#"+a.jgrid.jqID(c),e.grid.bDiv)[0]);a.jgrid.info_dialog(a.jgrid.errors.errcap,s[1],a.jgrid.edit.bClose,{left:n[0],top:n[1]})}catch(w){alert(s[1])}return j}var v,h=e.p.prmNames;v=h.oper;n=h.id;i&&(i[v]=h.editoper,i[n]=c,"undefined"==typeof e.p.inlineData&&(e.p.inlineData={}),i=a.extend({},i,e.p.inlineData,f.extraparam));if("clientArray"==f.url){i=a.extend({},i,u);e.p.autoencode&&a.each(i,function(b,c){i[b]=a.jgrid.htmlDecode(c)});
n=a(e).jqGrid("setRowData",c,i);a(q).attr("editable","0");for(h=0;h<e.p.savedRow.length;h++)if(e.p.savedRow[h].id==c){t=h;break}0<=t&&e.p.savedRow.splice(t,1);a(e).triggerHandler("jqGridInlineAfterSaveRow",[c,n,i,f]);a.isFunction(f.aftersavefunc)&&f.aftersavefunc.call(e,c,n);j=!0;a(q).unbind("keydown")}else a("#lui_"+a.jgrid.jqID(e.p.id)).show(),r=a.extend({},i,r),r[n]=a.jgrid.stripPref(e.p.idPrefix,r[n]),a.ajax(a.extend({url:f.url,data:a.isFunction(e.p.serializeRowData)?e.p.serializeRowData.call(e,
r):r,type:f.mtype,async:!1,complete:function(b,d){a("#lui_"+a.jgrid.jqID(e.p.id)).hide();if(d==="success"){var g=true,h;h=a(e).triggerHandler("jqGridInlineSuccessSaveRow",[b,c,f]);a.isArray(h)||(h=[true,i]);h[0]&&a.isFunction(f.successfunc)&&(h=f.successfunc.call(e,b));if(a.isArray(h)){g=h[0];i=h[1]?h[1]:i}else g=h;if(g===true){e.p.autoencode&&a.each(i,function(b,c){i[b]=a.jgrid.htmlDecode(c)});i=a.extend({},i,u);a(e).jqGrid("setRowData",c,i);a(q).attr("editable","0");for(g=0;g<e.p.savedRow.length;g++)if(e.p.savedRow[g].id==
c){t=g;break}t>=0&&e.p.savedRow.splice(t,1);a(e).triggerHandler("jqGridInlineAfterSaveRow",[c,b,i,f]);a.isFunction(f.aftersavefunc)&&f.aftersavefunc.call(e,c,b);j=true;a(q).unbind("keydown")}else{a(e).triggerHandler("jqGridInlineErrorSaveRow",[c,b,d,null,f]);a.isFunction(f.errorfunc)&&f.errorfunc.call(e,c,b,d,null);f.restoreAfterError===true&&a(e).jqGrid("restoreRow",c,f.afterrestorefunc)}}},error:function(b,d,g){a("#lui_"+a.jgrid.jqID(e.p.id)).hide();a(e).triggerHandler("jqGridInlineErrorSaveRow",
[c,b,d,g,f]);if(a.isFunction(f.errorfunc))f.errorfunc.call(e,c,b,d,g);else try{a.jgrid.info_dialog(a.jgrid.errors.errcap,'<div class="ui-state-error">'+b.responseText+"</div>",a.jgrid.edit.bClose,{buttonalign:"right"})}catch(h){alert(b.responseText)}f.restoreAfterError===true&&a(e).jqGrid("restoreRow",c,f.afterrestorefunc)}},a.jgrid.ajaxOptions,e.p.ajaxRowOptions||{}))}return j},restoreRow:function(c,b){var d=a.makeArray(arguments).slice(1),k={};"object"===a.type(d[0])?k=d[0]:a.isFunction(b)&&(k.afterrestorefunc=
b);k=a.extend(!0,a.jgrid.inlineEdit,k);return this.each(function(){var b=this,d,p,h={};if(b.grid){p=a(b).jqGrid("getInd",c,true);if(p!==false){for(var f=0;f<b.p.savedRow.length;f++)if(b.p.savedRow[f].id==c){d=f;break}if(d>=0){if(a.isFunction(a.fn.datepicker))try{a("input.hasDatepicker","#"+a.jgrid.jqID(p.id)).datepicker("hide")}catch(j){}a.each(b.p.colModel,function(){this.editable===true&&this.name in b.p.savedRow[d]&&(h[this.name]=b.p.savedRow[d][this.name])});a(b).jqGrid("setRowData",c,h);a(p).attr("editable",
"0").unbind("keydown");b.p.savedRow.splice(d,1);a("#"+a.jgrid.jqID(c),"#"+a.jgrid.jqID(b.p.id)).hasClass("jqgrid-new-row")&&setTimeout(function(){a(b).jqGrid("delRowData",c)},0)}a(b).triggerHandler("jqGridInlineAfterRestoreRow",[c]);a.isFunction(k.afterrestorefunc)&&k.afterrestorefunc.call(b,c)}}})},addRow:function(c){c=a.extend(!0,{rowID:"new_row",initdata:{},position:"first",useDefValues:!0,useFormatter:!1,addRowParams:{extraparam:{}}},c||{});return this.each(function(){if(this.grid){var b=this;
!0===c.useDefValues&&a(b.p.colModel).each(function(){if(this.editoptions&&this.editoptions.defaultValue){var d=this.editoptions.defaultValue,d=a.isFunction(d)?d.call(b):d;c.initdata[this.name]=d}});a(b).jqGrid("addRowData",c.rowID,c.initdata,c.position);c.rowID=b.p.idPrefix+c.rowID;a("#"+a.jgrid.jqID(c.rowID),"#"+a.jgrid.jqID(b.p.id)).addClass("jqgrid-new-row");if(c.useFormatter)a("#"+a.jgrid.jqID(c.rowID)+" .ui-inline-edit","#"+a.jgrid.jqID(b.p.id)).click();else{var d=b.p.prmNames;c.addRowParams.extraparam[d.oper]=
d.addoper;a(b).jqGrid("editRow",c.rowID,c.addRowParams);a(b).jqGrid("setSelection",c.rowID)}}})},inlineNav:function(c,b){b=a.extend({edit:!0,editicon:"ui-icon-pencil",add:!0,addicon:"ui-icon-plus",save:!0,saveicon:"ui-icon-disk",cancel:!0,cancelicon:"ui-icon-cancel",addParams:{useFormatter:!1,rowID:"new_row"},editParams:{},restoreAfterSelect:!0},a.jgrid.nav,b||{});return this.each(function(){if(this.grid){var d=this,k,g=a.jgrid.jqID(d.p.id);d.p._inlinenav=!0;if(!0===b.addParams.useFormatter){var l=
d.p.colModel,p;for(p=0;p<l.length;p++)if(l[p].formatter&&"actions"===l[p].formatter){l[p].formatoptions&&(l=a.extend({keys:!1,onEdit:null,onSuccess:null,afterSave:null,onError:null,afterRestore:null,extraparam:{},url:null},l[p].formatoptions),b.addParams.addRowParams={keys:l.keys,oneditfunc:l.onEdit,successfunc:l.onSuccess,url:l.url,extraparam:l.extraparam,aftersavefunc:l.afterSavef,errorfunc:l.onError,afterrestorefunc:l.afterRestore});break}}b.add&&a(d).jqGrid("navButtonAdd",c,{caption:b.addtext,
title:b.addtitle,buttonicon:b.addicon,id:d.p.id+"_iladd",onClickButton:function(){a(d).jqGrid("addRow",b.addParams);b.addParams.useFormatter||(a("#"+g+"_ilsave").removeClass("ui-state-disabled"),a("#"+g+"_ilcancel").removeClass("ui-state-disabled"),a("#"+g+"_iladd").addClass("ui-state-disabled"),a("#"+g+"_iledit").addClass("ui-state-disabled"))}});b.edit&&a(d).jqGrid("navButtonAdd",c,{caption:b.edittext,title:b.edittitle,buttonicon:b.editicon,id:d.p.id+"_iledit",onClickButton:function(){var c=a(d).jqGrid("getGridParam",
"selrow");c?(a(d).jqGrid("editRow",c,b.editParams),a("#"+g+"_ilsave").removeClass("ui-state-disabled"),a("#"+g+"_ilcancel").removeClass("ui-state-disabled"),a("#"+g+"_iladd").addClass("ui-state-disabled"),a("#"+g+"_iledit").addClass("ui-state-disabled")):(a.jgrid.viewModal("#alertmod",{gbox:"#gbox_"+g,jqm:!0}),a("#jqg_alrt").focus())}});b.save&&(a(d).jqGrid("navButtonAdd",c,{caption:b.savetext||"",title:b.savetitle||"Save row",buttonicon:b.saveicon,id:d.p.id+"_ilsave",onClickButton:function(){var c=
d.p.savedRow[0].id;if(c){var f=d.p.prmNames,j=f.oper;b.editParams.extraparam||(b.editParams.extraparam={});b.editParams.extraparam[j]=a("#"+a.jgrid.jqID(c),"#"+g).hasClass("jqgrid-new-row")?f.addoper:f.editoper;a(d).jqGrid("saveRow",c,b.editParams)&&a(d).jqGrid("showAddEditButtons")}else a.jgrid.viewModal("#alertmod",{gbox:"#gbox_"+g,jqm:!0}),a("#jqg_alrt").focus()}}),a("#"+g+"_ilsave").addClass("ui-state-disabled"));b.cancel&&(a(d).jqGrid("navButtonAdd",c,{caption:b.canceltext||"",title:b.canceltitle||
"Cancel row editing",buttonicon:b.cancelicon,id:d.p.id+"_ilcancel",onClickButton:function(){var c=d.p.savedRow[0].id;if(c){a(d).jqGrid("restoreRow",c,b.editParams);a(d).jqGrid("showAddEditButtons")}else{a.jgrid.viewModal("#alertmod",{gbox:"#gbox_"+g,jqm:true});a("#jqg_alrt").focus()}}}),a("#"+g+"_ilcancel").addClass("ui-state-disabled"));!0===b.restoreAfterSelect&&(k=a.isFunction(d.p.beforeSelectRow)?d.p.beforeSelectRow:!1,d.p.beforeSelectRow=function(c,f){var g=true;if(d.p.savedRow.length>0&&d.p._inlinenav===
true&&c!==d.p.selrow&&d.p.selrow!==null){d.p.selrow==b.addParams.rowID?a(d).jqGrid("delRowData",d.p.selrow):a(d).jqGrid("restoreRow",d.p.selrow,b.editParams);a(d).jqGrid("showAddEditButtons")}k&&(g=k.call(d,c,f));return g})}})},showAddEditButtons:function(){return this.each(function(){if(this.grid){var c=a.jgrid.jqID(this.p.id);a("#"+c+"_ilsave").addClass("ui-state-disabled");a("#"+c+"_ilcancel").addClass("ui-state-disabled");a("#"+c+"_iladd").removeClass("ui-state-disabled");a("#"+c+"_iledit").removeClass("ui-state-disabled")}})}})})(jQuery);
(function(b){b.jgrid.extend({editCell:function(d,f,a){return this.each(function(){var c=this,g,e,h,i;if(c.grid&&!0===c.p.cellEdit){f=parseInt(f,10);c.p.selrow=c.rows[d].id;c.p.knv||b(c).jqGrid("GridNav");if(0<c.p.savedRow.length){if(!0===a&&d==c.p.iRow&&f==c.p.iCol)return;b(c).jqGrid("saveCell",c.p.savedRow[0].id,c.p.savedRow[0].ic)}else window.setTimeout(function(){b("#"+b.jgrid.jqID(c.p.knv)).attr("tabindex","-1").focus()},0);i=c.p.colModel[f];g=i.name;if(!("subgrid"==g||"cb"==g||"rn"==g)){h=b("td:eq("+
f+")",c.rows[d]);if(!0===i.editable&&!0===a&&!h.hasClass("not-editable-cell")){0<=parseInt(c.p.iCol,10)&&0<=parseInt(c.p.iRow,10)&&(b("td:eq("+c.p.iCol+")",c.rows[c.p.iRow]).removeClass("edit-cell ui-state-highlight"),b(c.rows[c.p.iRow]).removeClass("selected-row ui-state-hover"));b(h).addClass("edit-cell ui-state-highlight");b(c.rows[d]).addClass("selected-row ui-state-hover");try{e=b.unformat.call(c,h,{rowId:c.rows[d].id,colModel:i},f)}catch(k){e=i.edittype&&"textarea"==i.edittype?b(h).text():b(h).html()}c.p.autoencode&&
(e=b.jgrid.htmlDecode(e));i.edittype||(i.edittype="text");c.p.savedRow.push({id:d,ic:f,name:g,v:e});if("&nbsp;"===e||"&#160;"===e||1===e.length&&160===e.charCodeAt(0))e="";if(b.isFunction(c.p.formatCell)){var j=c.p.formatCell.call(c,c.rows[d].id,g,e,d,f);void 0!==j&&(e=j)}var j=b.extend({},i.editoptions||{},{id:d+"_"+g,name:g}),n=b.jgrid.createEl.call(c,i.edittype,j,e,!0,b.extend({},b.jgrid.ajaxOptions,c.p.ajaxSelectOptions||{}));b(c).triggerHandler("jqGridBeforeEditCell",[c.rows[d].id,g,e,d,f]);
b.isFunction(c.p.beforeEditCell)&&c.p.beforeEditCell.call(c,c.rows[d].id,g,e,d,f);b(h).html("").append(n).attr("tabindex","0");window.setTimeout(function(){b(n).focus()},0);b("input, select, textarea",h).bind("keydown",function(a){a.keyCode===27&&(b("input.hasDatepicker",h).length>0?b(".ui-datepicker").is(":hidden")?b(c).jqGrid("restoreCell",d,f):b("input.hasDatepicker",h).datepicker("hide"):b(c).jqGrid("restoreCell",d,f));if(a.keyCode===13){b(c).jqGrid("saveCell",d,f);return false}if(a.keyCode===
9){if(c.grid.hDiv.loading)return false;a.shiftKey?b(c).jqGrid("prevCell",d,f):b(c).jqGrid("nextCell",d,f)}a.stopPropagation()});b(c).triggerHandler("jqGridAfterEditCell",[c.rows[d].id,g,e,d,f]);b.isFunction(c.p.afterEditCell)&&c.p.afterEditCell.call(c,c.rows[d].id,g,e,d,f)}else 0<=parseInt(c.p.iCol,10)&&0<=parseInt(c.p.iRow,10)&&(b("td:eq("+c.p.iCol+")",c.rows[c.p.iRow]).removeClass("edit-cell ui-state-highlight"),b(c.rows[c.p.iRow]).removeClass("selected-row ui-state-hover")),h.addClass("edit-cell ui-state-highlight"),
b(c.rows[d]).addClass("selected-row ui-state-hover"),e=h.html().replace(/\&#160\;/ig,""),b(c).triggerHandler("jqGridSelectCell",[c.rows[d].id,g,e,d,f]),b.isFunction(c.p.onSelectCell)&&c.p.onSelectCell.call(c,c.rows[d].id,g,e,d,f);c.p.iCol=f;c.p.iRow=d}}})},saveCell:function(d,f){return this.each(function(){var a=this,c;if(a.grid&&!0===a.p.cellEdit){c=1<=a.p.savedRow.length?0:null;if(null!==c){var g=b("td:eq("+f+")",a.rows[d]),e,h,i=a.p.colModel[f],k=i.name,j=b.jgrid.jqID(k);switch(i.edittype){case "select":if(i.editoptions.multiple){var j=
b("#"+d+"_"+j,a.rows[d]),n=[];(e=b(j).val())?e.join(","):e="";b("option:selected",j).each(function(a,c){n[a]=b(c).text()});h=n.join(",")}else e=b("#"+d+"_"+j+" option:selected",a.rows[d]).val(),h=b("#"+d+"_"+j+" option:selected",a.rows[d]).text();i.formatter&&(h=e);break;case "checkbox":var l=["Yes","No"];i.editoptions&&(l=i.editoptions.value.split(":"));h=e=b("#"+d+"_"+j,a.rows[d]).is(":checked")?l[0]:l[1];break;case "password":case "text":case "textarea":case "button":h=e=b("#"+d+"_"+j,a.rows[d]).val();
break;case "custom":try{if(i.editoptions&&b.isFunction(i.editoptions.custom_value)){e=i.editoptions.custom_value.call(a,b(".customelement",g),"get");if(void 0===e)throw"e2";h=e}else throw"e1";}catch(o){"e1"==o&&b.jgrid.info_dialog(jQuery.jgrid.errors.errcap,"function 'custom_value' "+b.jgrid.edit.msg.nodefined,jQuery.jgrid.edit.bClose),"e2"==o?b.jgrid.info_dialog(jQuery.jgrid.errors.errcap,"function 'custom_value' "+b.jgrid.edit.msg.novalue,jQuery.jgrid.edit.bClose):b.jgrid.info_dialog(jQuery.jgrid.errors.errcap,
o.message,jQuery.jgrid.edit.bClose)}}if(h!==a.p.savedRow[c].v){if(c=b(a).triggerHandler("jqGridBeforeSaveCell",[a.rows[d].id,k,e,d,f]))h=e=c;if(b.isFunction(a.p.beforeSaveCell)&&(c=a.p.beforeSaveCell.call(a,a.rows[d].id,k,e,d,f)))h=e=c;var p=b.jgrid.checkValues(e,f,a);if(!0===p[0]){c=b(a).triggerHandler("jqGridBeforeSubmitCell",[a.rows[d].id,k,e,d,f])||{};b.isFunction(a.p.beforeSubmitCell)&&((c=a.p.beforeSubmitCell.call(a,a.rows[d].id,k,e,d,f))||(c={}));0<b("input.hasDatepicker",g).length&&b("input.hasDatepicker",
g).datepicker("hide");if("remote"==a.p.cellsubmit)if(a.p.cellurl){var m={};a.p.autoencode&&(e=b.jgrid.htmlEncode(e));m[k]=e;l=a.p.prmNames;i=l.id;j=l.oper;m[i]=b.jgrid.stripPref(a.p.idPrefix,a.rows[d].id);m[j]=l.editoper;m=b.extend(c,m);b("#lui_"+b.jgrid.jqID(a.p.id)).show();a.grid.hDiv.loading=!0;b.ajax(b.extend({url:a.p.cellurl,data:b.isFunction(a.p.serializeCellData)?a.p.serializeCellData.call(a,m):m,type:"POST",complete:function(c,i){b("#lui_"+a.p.id).hide();a.grid.hDiv.loading=false;if(i=="success"){var j=
b(a).triggerHandler("jqGridAfterSubmitCell",[a,c,m.id,k,e,d,f])||[true,""];j[0]===true&&b.isFunction(a.p.afterSubmitCell)&&(j=a.p.afterSubmitCell.call(a,c,m.id,k,e,d,f));if(j[0]===true){b(g).empty();b(a).jqGrid("setCell",a.rows[d].id,f,h,false,false,true);b(g).addClass("dirty-cell");b(a.rows[d]).addClass("edited");b(a).triggerHandler("jqGridAfterSaveCell",[a.rows[d].id,k,e,d,f]);b.isFunction(a.p.afterSaveCell)&&a.p.afterSaveCell.call(a,a.rows[d].id,k,e,d,f);a.p.savedRow.splice(0,1)}else{b.jgrid.info_dialog(b.jgrid.errors.errcap,
j[1],b.jgrid.edit.bClose);b(a).jqGrid("restoreCell",d,f)}}},error:function(c,e,h){b("#lui_"+b.jgrid.jqID(a.p.id)).hide();a.grid.hDiv.loading=false;b(a).triggerHandler("jqGridErrorCell",[c,e,h]);b.isFunction(a.p.errorCell)?a.p.errorCell.call(a,c,e,h):b.jgrid.info_dialog(b.jgrid.errors.errcap,c.status+" : "+c.statusText+"<br/>"+e,b.jgrid.edit.bClose);b(a).jqGrid("restoreCell",d,f)}},b.jgrid.ajaxOptions,a.p.ajaxCellOptions||{}))}else try{b.jgrid.info_dialog(b.jgrid.errors.errcap,b.jgrid.errors.nourl,
b.jgrid.edit.bClose),b(a).jqGrid("restoreCell",d,f)}catch(q){}"clientArray"==a.p.cellsubmit&&(b(g).empty(),b(a).jqGrid("setCell",a.rows[d].id,f,h,!1,!1,!0),b(g).addClass("dirty-cell"),b(a.rows[d]).addClass("edited"),b(a).triggerHandler("jqGridAfterSaveCell",[a.rows[d].id,k,e,d,f]),b.isFunction(a.p.afterSaveCell)&&a.p.afterSaveCell.call(a,a.rows[d].id,k,e,d,f),a.p.savedRow.splice(0,1))}else try{window.setTimeout(function(){b.jgrid.info_dialog(b.jgrid.errors.errcap,e+" "+p[1],b.jgrid.edit.bClose)},
100),b(a).jqGrid("restoreCell",d,f)}catch(r){}}else b(a).jqGrid("restoreCell",d,f)}b.browser.opera?b("#"+b.jgrid.jqID(a.p.knv)).attr("tabindex","-1").focus():window.setTimeout(function(){b("#"+b.jgrid.jqID(a.p.knv)).attr("tabindex","-1").focus()},0)}})},restoreCell:function(d,f){return this.each(function(){var a=this,c;if(a.grid&&!0===a.p.cellEdit){c=1<=a.p.savedRow.length?0:null;if(null!==c){var g=b("td:eq("+f+")",a.rows[d]);if(b.isFunction(b.fn.datepicker))try{b("input.hasDatepicker",g).datepicker("hide")}catch(e){}b(g).empty().attr("tabindex",
"-1");b(a).jqGrid("setCell",a.rows[d].id,f,a.p.savedRow[c].v,!1,!1,!0);b(a).triggerHandler("jqGridAfterRestoreCell",[a.rows[d].id,a.p.savedRow[c].v,d,f]);b.isFunction(a.p.afterRestoreCell)&&a.p.afterRestoreCell.call(a,a.rows[d].id,a.p.savedRow[c].v,d,f);a.p.savedRow.splice(0,1)}window.setTimeout(function(){b("#"+a.p.knv).attr("tabindex","-1").focus()},0)}})},nextCell:function(d,f){return this.each(function(){var a=!1;if(this.grid&&!0===this.p.cellEdit){for(var c=f+1;c<this.p.colModel.length;c++)if(!0===
this.p.colModel[c].editable){a=c;break}!1!==a?b(this).jqGrid("editCell",d,a,!0):0<this.p.savedRow.length&&b(this).jqGrid("saveCell",d,f)}})},prevCell:function(d,f){return this.each(function(){var a=!1;if(this.grid&&!0===this.p.cellEdit){for(var c=f-1;0<=c;c--)if(!0===this.p.colModel[c].editable){a=c;break}!1!==a?b(this).jqGrid("editCell",d,a,!0):0<this.p.savedRow.length&&b(this).jqGrid("saveCell",d,f)}})},GridNav:function(){return this.each(function(){function d(c,d,e){if("v"==e.substr(0,1)){var f=
b(a.grid.bDiv)[0].clientHeight,g=b(a.grid.bDiv)[0].scrollTop,l=a.rows[c].offsetTop+a.rows[c].clientHeight,o=a.rows[c].offsetTop;"vd"==e&&l>=f&&(b(a.grid.bDiv)[0].scrollTop=b(a.grid.bDiv)[0].scrollTop+a.rows[c].clientHeight);"vu"==e&&o<g&&(b(a.grid.bDiv)[0].scrollTop=b(a.grid.bDiv)[0].scrollTop-a.rows[c].clientHeight)}"h"==e&&(e=b(a.grid.bDiv)[0].clientWidth,f=b(a.grid.bDiv)[0].scrollLeft,g=a.rows[c].cells[d].offsetLeft,a.rows[c].cells[d].offsetLeft+a.rows[c].cells[d].clientWidth>=e+parseInt(f,10)?
b(a.grid.bDiv)[0].scrollLeft=b(a.grid.bDiv)[0].scrollLeft+a.rows[c].cells[d].clientWidth:g<f&&(b(a.grid.bDiv)[0].scrollLeft=b(a.grid.bDiv)[0].scrollLeft-a.rows[c].cells[d].clientWidth))}function f(b,c){var d,e;if("lft"==c){d=b+1;for(e=b;0<=e;e--)if(!0!==a.p.colModel[e].hidden){d=e;break}}if("rgt"==c){d=b-1;for(e=b;e<a.p.colModel.length;e++)if(!0!==a.p.colModel[e].hidden){d=e;break}}return d}var a=this;if(a.grid&&!0===a.p.cellEdit){a.p.knv=a.p.id+"_kn";var c=b("<span style='width:0px;height:0px;background-color:black;' tabindex='0'><span tabindex='-1' style='width:0px;height:0px;background-color:grey' id='"+
a.p.knv+"'></span></span>"),g,e;b(c).insertBefore(a.grid.cDiv);b("#"+a.p.knv).focus().keydown(function(c){e=c.keyCode;"rtl"==a.p.direction&&(37===e?e=39:39===e&&(e=37));switch(e){case 38:0<a.p.iRow-1&&(d(a.p.iRow-1,a.p.iCol,"vu"),b(a).jqGrid("editCell",a.p.iRow-1,a.p.iCol,!1));break;case 40:a.p.iRow+1<=a.rows.length-1&&(d(a.p.iRow+1,a.p.iCol,"vd"),b(a).jqGrid("editCell",a.p.iRow+1,a.p.iCol,!1));break;case 37:0<=a.p.iCol-1&&(g=f(a.p.iCol-1,"lft"),d(a.p.iRow,g,"h"),b(a).jqGrid("editCell",a.p.iRow,g,
!1));break;case 39:a.p.iCol+1<=a.p.colModel.length-1&&(g=f(a.p.iCol+1,"rgt"),d(a.p.iRow,g,"h"),b(a).jqGrid("editCell",a.p.iRow,g,!1));break;case 13:0<=parseInt(a.p.iCol,10)&&0<=parseInt(a.p.iRow,10)&&b(a).jqGrid("editCell",a.p.iRow,a.p.iCol,!0);break;default:return!0}return!1})}})},getChangedCells:function(d){var f=[];d||(d="all");this.each(function(){var a=this,c;a.grid&&!0===a.p.cellEdit&&b(a.rows).each(function(g){var e={};b(this).hasClass("edited")&&(b("td",this).each(function(f){c=a.p.colModel[f].name;
if("cb"!==c&&"subgrid"!==c)if("dirty"==d){if(b(this).hasClass("dirty-cell"))try{e[c]=b.unformat.call(a,this,{rowId:a.rows[g].id,colModel:a.p.colModel[f]},f)}catch(i){e[c]=b.jgrid.htmlDecode(b(this).html())}}else try{e[c]=b.unformat.call(a,this,{rowId:a.rows[g].id,colModel:a.p.colModel[f]},f)}catch(k){e[c]=b.jgrid.htmlDecode(b(this).html())}}),e.id=this.id,f.push(e))})});return f}})})(jQuery);
(function(b){b.fn.jqm=function(a){var k={overlay:50,closeoverlay:!0,overlayClass:"jqmOverlay",closeClass:"jqmClose",trigger:".jqModal",ajax:d,ajaxText:"",target:d,modal:d,toTop:d,onShow:d,onHide:d,onLoad:d};return this.each(function(){if(this._jqm)return i[this._jqm].c=b.extend({},i[this._jqm].c,a);g++;this._jqm=g;i[g]={c:b.extend(k,b.jqm.params,a),a:d,w:b(this).addClass("jqmID"+g),s:g};k.trigger&&b(this).jqmAddTrigger(k.trigger)})};b.fn.jqmAddClose=function(a){return n(this,a,"jqmHide")};b.fn.jqmAddTrigger=
function(a){return n(this,a,"jqmShow")};b.fn.jqmShow=function(a){return this.each(function(){b.jqm.open(this._jqm,a)})};b.fn.jqmHide=function(a){return this.each(function(){b.jqm.close(this._jqm,a)})};b.jqm={hash:{},open:function(a,k){var c=i[a],e=c.c,l="."+e.closeClass,h=parseInt(c.w.css("z-index")),h=0<h?h:3E3,f=b("<div></div>").css({height:"100%",width:"100%",position:"fixed",left:0,top:0,"z-index":h-1,opacity:e.overlay/100});if(c.a)return d;c.t=k;c.a=!0;c.w.css("z-index",h);e.modal?(j[0]||setTimeout(function(){o("bind")},
1),j.push(a)):0<e.overlay?e.closeoverlay&&c.w.jqmAddClose(f):f=d;c.o=f?f.addClass(e.overlayClass).prependTo("body"):d;if(p&&(b("html,body").css({height:"100%",width:"100%"}),f)){var f=f.css({position:"absolute"})[0],g;for(g in{Top:1,Left:1})f.style.setExpression(g.toLowerCase(),"(_=(document.documentElement.scroll"+g+" || document.body.scroll"+g+"))+'px'")}e.ajax?(h=e.target||c.w,f=e.ajax,h="string"==typeof h?b(h,c.w):b(h),f="@"==f.substr(0,1)?b(k).attr(f.substring(1)):f,h.html(e.ajaxText).load(f,
function(){e.onLoad&&e.onLoad.call(this,c);l&&c.w.jqmAddClose(b(l,c.w));q(c)})):l&&c.w.jqmAddClose(b(l,c.w));e.toTop&&c.o&&c.w.before('<span id="jqmP'+c.w[0]._jqm+'"></span>').insertAfter(c.o);e.onShow?e.onShow(c):c.w.show();q(c);return d},close:function(a){a=i[a];if(!a.a)return d;a.a=d;j[0]&&(j.pop(),j[0]||o("unbind"));a.c.toTop&&a.o&&b("#jqmP"+a.w[0]._jqm).after(a.w).remove();if(a.c.onHide)a.c.onHide(a);else a.w.hide(),a.o&&a.o.remove();return d},params:{}};var g=0,i=b.jqm.hash,j=[],p=b.browser.msie&&
"6.0"==b.browser.version,d=!1,q=function(a){var d=b('<iframe src="javascript:false;document.write(\'\');" class="jqm"></iframe>').css({opacity:0});p&&(a.o?a.o.html('<p style="width:100%;height:100%"/>').prepend(d):b("iframe.jqm",a.w)[0]||a.w.prepend(d));r(a)},r=function(a){try{b(":input:visible",a.w)[0].focus()}catch(d){}},o=function(a){b(document)[a]("keypress",m)[a]("keydown",m)[a]("mousedown",m)},m=function(a){var d=i[j[j.length-1]];(a=!b(a.target).parents(".jqmID"+d.s)[0])&&r(d);return!a},n=function(a,
g,c){return a.each(function(){var a=this._jqm;b(g).each(function(){this[c]||(this[c]=[],b(this).click(function(){for(var a in{jqmShow:1,jqmHide:1})for(var b in this[a])if(i[this[a][b]])i[this[a][b]].w[a](this);return d}));this[c].push(a)})})}})(jQuery);
(function(b){b.fn.jqDrag=function(a){return h(this,a,"d")};b.fn.jqResize=function(a,b){return h(this,a,"r",b)};b.jqDnR={dnr:{},e:0,drag:function(a){"d"==d.k?e.css({left:d.X+a.pageX-d.pX,top:d.Y+a.pageY-d.pY}):(e.css({width:Math.max(a.pageX-d.pX+d.W,0),height:Math.max(a.pageY-d.pY+d.H,0)}),f&&g.css({width:Math.max(a.pageX-f.pX+f.W,0),height:Math.max(a.pageY-f.pY+f.H,0)}));return!1},stop:function(){b(document).unbind("mousemove",c.drag).unbind("mouseup",c.stop)}};var c=b.jqDnR,d=c.dnr,e=c.e,g,f,h=function(a,
c,h,l){return a.each(function(){c=c?b(c,a):a;c.bind("mousedown",{e:a,k:h},function(a){var c=a.data,i={};e=c.e;g=l?b(l):!1;if("relative"!=e.css("position"))try{e.position(i)}catch(h){}d={X:i.left||j("left")||0,Y:i.top||j("top")||0,W:j("width")||e[0].scrollWidth||0,H:j("height")||e[0].scrollHeight||0,pX:a.pageX,pY:a.pageY,k:c.k};f=g&&"d"!=c.k?{X:i.left||k("left")||0,Y:i.top||k("top")||0,W:g[0].offsetWidth||k("width")||0,H:g[0].offsetHeight||k("height")||0,pX:a.pageX,pY:a.pageY,k:c.k}:!1;if(b("input.hasDatepicker",
e[0])[0])try{b("input.hasDatepicker",e[0]).datepicker("hide")}catch(m){}b(document).mousemove(b.jqDnR.drag).mouseup(b.jqDnR.stop);return!1})})},j=function(a){return parseInt(e.css(a),10)||!1},k=function(a){return parseInt(g.css(a),10)||!1}})(jQuery);
(function(b){b.jgrid.extend({setSubGrid:function(){return this.each(function(){var e;this.p.subGridOptions=b.extend({plusicon:"ui-icon-plus",minusicon:"ui-icon-minus",openicon:"ui-icon-carat-1-sw",expandOnLoad:!1,delayOnLoad:50,selectOnExpand:!1,reloadOnExpand:!0},this.p.subGridOptions||{});this.p.colNames.unshift("");this.p.colModel.unshift({name:"subgrid",width:b.browser.safari?this.p.subGridWidth+this.p.cellLayout:this.p.subGridWidth,sortable:!1,resizable:!1,hidedlg:!0,search:!1,fixed:!0});e=this.p.subGridModel;
if(e[0]){e[0].align=b.extend([],e[0].align||[]);for(var c=0;c<e[0].name.length;c++)e[0].align[c]=e[0].align[c]||"left"}})},addSubGridCell:function(b,c){var a="",m,l;this.each(function(){a=this.formatCol(b,c);l=this.p.id;m=this.p.subGridOptions.plusicon});return'<td role="gridcell" aria-describedby="'+l+'_subgrid" class="ui-sgcollapsed sgcollapsed" '+a+"><a href='javascript:void(0);'><span class='ui-icon "+m+"'></span></a></td>"},addSubGrid:function(e,c){return this.each(function(){var a=this;if(a.grid){var m=
function(c,e,h){e=b("<td align='"+a.p.subGridModel[0].align[h]+"'></td>").html(e);b(c).append(e)},l=function(c,e){var h,f,n,d=b("<table cellspacing='0' cellpadding='0' border='0'><tbody></tbody></table>"),i=b("<tr></tr>");for(f=0;f<a.p.subGridModel[0].name.length;f++)h=b("<th class='ui-state-default ui-th-subgrid ui-th-column ui-th-"+a.p.direction+"'></th>"),b(h).html(a.p.subGridModel[0].name[f]),b(h).width(a.p.subGridModel[0].width[f]),b(i).append(h);b(d).append(i);c&&(n=a.p.xmlReader.subgrid,b(n.root+
" "+n.row,c).each(function(){i=b("<tr class='ui-widget-content ui-subtblcell'></tr>");if(!0===n.repeatitems)b(n.cell,this).each(function(a){m(i,b(this).text()||"&#160;",a)});else{var c=a.p.subGridModel[0].mapping||a.p.subGridModel[0].name;if(c)for(f=0;f<c.length;f++)m(i,b(c[f],this).text()||"&#160;",f)}b(d).append(i)}));h=b("table:first",a.grid.bDiv).attr("id")+"_";b("#"+b.jgrid.jqID(h+e)).append(d);a.grid.hDiv.loading=!1;b("#load_"+b.jgrid.jqID(a.p.id)).hide();return!1},p=function(c,e){var h,f,d,
g,i,k=b("<table cellspacing='0' cellpadding='0' border='0'><tbody></tbody></table>"),j=b("<tr></tr>");for(f=0;f<a.p.subGridModel[0].name.length;f++)h=b("<th class='ui-state-default ui-th-subgrid ui-th-column ui-th-"+a.p.direction+"'></th>"),b(h).html(a.p.subGridModel[0].name[f]),b(h).width(a.p.subGridModel[0].width[f]),b(j).append(h);b(k).append(j);if(c&&(g=a.p.jsonReader.subgrid,h=c[g.root],"undefined"!==typeof h))for(f=0;f<h.length;f++){d=h[f];j=b("<tr class='ui-widget-content ui-subtblcell'></tr>");
if(!0===g.repeatitems){g.cell&&(d=d[g.cell]);for(i=0;i<d.length;i++)m(j,d[i]||"&#160;",i)}else{var l=a.p.subGridModel[0].mapping||a.p.subGridModel[0].name;if(l.length)for(i=0;i<l.length;i++)m(j,d[l[i]]||"&#160;",i)}b(k).append(j)}f=b("table:first",a.grid.bDiv).attr("id")+"_";b("#"+b.jgrid.jqID(f+e)).append(k);a.grid.hDiv.loading=!1;b("#load_"+b.jgrid.jqID(a.p.id)).hide();return!1},t=function(c){var e,d,f,g;e=b(c).attr("id");d={nd_:(new Date).getTime()};d[a.p.prmNames.subgridid]=e;if(!a.p.subGridModel[0])return!1;
if(a.p.subGridModel[0].params)for(g=0;g<a.p.subGridModel[0].params.length;g++)for(f=0;f<a.p.colModel.length;f++)a.p.colModel[f].name===a.p.subGridModel[0].params[g]&&(d[a.p.colModel[f].name]=b("td:eq("+f+")",c).text().replace(/\&#160\;/ig,""));if(!a.grid.hDiv.loading)switch(a.grid.hDiv.loading=!0,b("#load_"+b.jgrid.jqID(a.p.id)).show(),a.p.subgridtype||(a.p.subgridtype=a.p.datatype),b.isFunction(a.p.subgridtype)?a.p.subgridtype.call(a,d):a.p.subgridtype=a.p.subgridtype.toLowerCase(),a.p.subgridtype){case "xml":case "json":b.ajax(b.extend({type:a.p.mtype,
url:a.p.subGridUrl,dataType:a.p.subgridtype,data:b.isFunction(a.p.serializeSubGridData)?a.p.serializeSubGridData.call(a,d):d,complete:function(c){a.p.subgridtype==="xml"?l(c.responseXML,e):p(b.jgrid.parse(c.responseText),e)}},b.jgrid.ajaxOptions,a.p.ajaxSubgridOptions||{}))}return!1},d,k,q,r=0,g,j;b.each(a.p.colModel,function(){(!0===this.hidden||"rn"===this.name||"cb"===this.name)&&r++});var s=a.rows.length,o=1;void 0!==c&&0<c&&(o=c,s=c+1);for(;o<s;)b(a.rows[o]).hasClass("jqgrow")&&b(a.rows[o].cells[e]).bind("click",
function(){var c=b(this).parent("tr")[0];j=c.nextSibling;if(b(this).hasClass("sgcollapsed")){k=a.p.id;d=c.id;if(a.p.subGridOptions.reloadOnExpand===true||a.p.subGridOptions.reloadOnExpand===false&&!b(j).hasClass("ui-subgrid")){q=e>=1?"<td colspan='"+e+"'>&#160;</td>":"";g=b(a).triggerHandler("jqGridSubGridBeforeExpand",[k+"_"+d,d]);(g=g===false||g==="stop"?false:true)&&b.isFunction(a.p.subGridBeforeExpand)&&(g=a.p.subGridBeforeExpand.call(a,k+"_"+d,d));if(g===false)return false;b(c).after("<tr role='row' class='ui-subgrid'>"+
q+"<td class='ui-widget-content subgrid-cell'><span class='ui-icon "+a.p.subGridOptions.openicon+"'></span></td><td colspan='"+parseInt(a.p.colNames.length-1-r,10)+"' class='ui-widget-content subgrid-data'><div id="+k+"_"+d+" class='tablediv'></div></td></tr>");b(a).triggerHandler("jqGridSubGridRowExpanded",[k+"_"+d,d]);b.isFunction(a.p.subGridRowExpanded)?a.p.subGridRowExpanded.call(a,k+"_"+d,d):t(c)}else b(j).show();b(this).html("<a href='javascript:void(0);'><span class='ui-icon "+a.p.subGridOptions.minusicon+
"'></span></a>").removeClass("sgcollapsed").addClass("sgexpanded");a.p.subGridOptions.selectOnExpand&&b(a).jqGrid("setSelection",d)}else if(b(this).hasClass("sgexpanded")){g=b(a).triggerHandler("jqGridSubGridRowColapsed",[k+"_"+d,d]);if((g=g===false||g==="stop"?false:true)&&b.isFunction(a.p.subGridRowColapsed)){d=c.id;g=a.p.subGridRowColapsed.call(a,k+"_"+d,d)}if(g===false)return false;a.p.subGridOptions.reloadOnExpand===true?b(j).remove(".ui-subgrid"):b(j).hasClass("ui-subgrid")&&b(j).hide();b(this).html("<a href='javascript:void(0);'><span class='ui-icon "+
a.p.subGridOptions.plusicon+"'></span></a>").removeClass("sgexpanded").addClass("sgcollapsed")}return false}),o++;!0===a.p.subGridOptions.expandOnLoad&&b(a.rows).filter(".jqgrow").each(function(a,c){b(c.cells[0]).click()});a.subGridXml=function(a,b){l(a,b)};a.subGridJson=function(a,b){p(a,b)}}})},expandSubGridRow:function(e){return this.each(function(){if((this.grid||e)&&!0===this.p.subGrid){var c=b(this).jqGrid("getInd",e,!0);c&&(c=b("td.sgcollapsed",c)[0])&&b(c).trigger("click")}})},collapseSubGridRow:function(e){return this.each(function(){if((this.grid||
e)&&!0===this.p.subGrid){var c=b(this).jqGrid("getInd",e,!0);c&&(c=b("td.sgexpanded",c)[0])&&b(c).trigger("click")}})},toggleSubGridRow:function(e){return this.each(function(){if((this.grid||e)&&!0===this.p.subGrid){var c=b(this).jqGrid("getInd",e,!0);if(c){var a=b("td.sgcollapsed",c)[0];a?b(a).trigger("click"):(a=b("td.sgexpanded",c)[0])&&b(a).trigger("click")}}})}})})(jQuery);
(function(b){b.extend(b.jgrid,{template:function(a){var d=b.makeArray(arguments).slice(1),e=1;void 0===a&&(a="");return a.replace(/\{([\w\-]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?\}/g,function(a,c){if(isNaN(parseInt(c,10))){for(var b=d[e],g=b.length;g--;)if(c===b[g].nm)return b[g].v;e++}else return e++,d[parseInt(c,10)]})}});b.jgrid.extend({groupingSetup:function(){return this.each(function(){var a=this.p.groupingView;if(null!==a&&("object"===typeof a||b.isFunction(a)))if(a.groupField.length){"undefined"===
typeof a.visibiltyOnNextGrouping&&(a.visibiltyOnNextGrouping=[]);a.lastvalues=[];a.groups=[];a.counters=[];for(var d=0;d<a.groupField.length;d++)a.groupOrder[d]||(a.groupOrder[d]="asc"),a.groupText[d]||(a.groupText[d]="{0}"),"boolean"!==typeof a.groupColumnShow[d]&&(a.groupColumnShow[d]=!0),"boolean"!==typeof a.groupSummary[d]&&(a.groupSummary[d]=!1),!0===a.groupColumnShow[d]?(a.visibiltyOnNextGrouping[d]=!0,b(this).jqGrid("showCol",a.groupField[d])):(a.visibiltyOnNextGrouping[d]=b("#"+b.jgrid.jqID(this.p.id+
"_"+a.groupField[d])).is(":visible"),b(this).jqGrid("hideCol",a.groupField[d]));a.summary=[];for(var d=this.p.colModel,e=0,f=d.length;e<f;e++)d[e].summaryType&&a.summary.push({nm:d[e].name,st:d[e].summaryType,v:"",sr:d[e].summaryRound,srt:d[e].summaryRoundType||"round"})}else this.p.grouping=!1;else this.p.grouping=!1})},groupingPrepare:function(a,d,e,f){this.each(function(){for(var c=this.p.groupingView,h=this,g=c.groupField.length,k,j,p=0,i=0;i<g;i++)k=c.groupField[i],j=e[k],void 0!==j&&(0===f?
(c.groups.push({idx:i,dataIndex:k,value:j,startRow:f,cnt:1,summary:[]}),c.lastvalues[i]=j,c.counters[i]={cnt:1,pos:c.groups.length-1,summary:b.extend(!0,[],c.summary)}):"object"!==typeof j&&c.lastvalues[i]!==j?(c.groups.push({idx:i,dataIndex:k,value:j,startRow:f,cnt:1,summary:[]}),c.lastvalues[i]=j,p=1,c.counters[i]={cnt:1,pos:c.groups.length-1,summary:b.extend(!0,[],c.summary)}):1===p?(c.groups.push({idx:i,dataIndex:k,value:j,startRow:f,cnt:1,summary:[]}),c.lastvalues[i]=j,c.counters[i]={cnt:1,pos:c.groups.length-
1,summary:b.extend(!0,[],c.summary)}):(c.counters[i].cnt+=1,c.groups[c.counters[i].pos].cnt=c.counters[i].cnt),b.each(c.counters[i].summary,function(){this.v=b.isFunction(this.st)?this.st.call(h,this.v,this.nm,e):b(h).jqGrid("groupingCalculations.handler",this.st,this.v,this.nm,this.sr,this.srt,e)}),c.groups[c.counters[i].pos].summary=c.counters[i].summary);d.push(a)});return d},groupingToggle:function(a){this.each(function(){var d=this.p.groupingView,e=a.split("_"),f=parseInt(e[e.length-2],10);e.splice(e.length-
2,2);var e=e.join("_"),c=d.minusicon,h=d.plusicon,g=b("#"+b.jgrid.jqID(a)),g=g.length?g[0].nextSibling:null,k=b("#"+b.jgrid.jqID(a)+" span.tree-wrap-"+this.p.direction),j=!1;if(k.hasClass(c)){if(d.showSummaryOnHide){if(g)for(;g&&!b(g).hasClass("jqfoot");)b(g).hide(),g=g.nextSibling}else if(g)for(;g&&!b(g).hasClass(e+"_"+(""+f))&&!b(g).hasClass(e+"_"+(""+(f-1)));)b(g).hide(),g=g.nextSibling;k.removeClass(c).addClass(h);j=!0}else{if(g)for(;g&&!b(g).hasClass(e+"_"+(""+f))&&!b(g).hasClass(e+"_"+(""+(f-
1)));)b(g).show(),g=g.nextSibling;k.removeClass(h).addClass(c)}b(this).triggerHandler("jqGridGroupingClickGroup",[a,j]);b.isFunction(this.p.onClickGroup)&&this.p.onClickGroup.call(this,a,j)});return!1},groupingRender:function(a,d){return this.each(function(){function e(a,c,b){if(0===c)return b[a];var d=b[a].idx;if(0===d)return b[a];for(;0<=a;a--)if(b[a].idx===d-c)return b[a]}var f=this,c=f.p.groupingView,h="",g="",k,j,p=c.groupCollapse?c.plusicon:c.minusicon,i,w=[],x=c.groupField.length,p=p+(" tree-wrap-"+
f.p.direction);b.each(f.p.colModel,function(a,b){for(var d=0;d<x;d++)if(c.groupField[d]===b.name){w[d]=a;break}});var s=0,y=c.groupSummary;y.reverse();b.each(c.groups,function(r,l){s++;j=f.p.id+"ghead_"+l.idx;k=j+"_"+r;g="<span style='cursor:pointer;' class='ui-icon "+p+"' onclick=\"jQuery('#"+b.jgrid.jqID(f.p.id)+"').jqGrid('groupingToggle','"+k+"');return false;\"></span>";try{i=f.formatter(k,l.value,w[l.idx],l.value)}catch(C){i=l.value}h+='<tr id="'+k+'" role="row" class= "ui-widget-content jqgroup ui-row-'+
f.p.direction+" "+j+'"><td style="padding-left:'+12*l.idx+'px;" colspan="'+d+'">'+g+b.jgrid.template(c.groupText[l.idx],i,l.cnt,l.summary)+"</td></tr>";if(x-1===l.idx){for(var m=c.groups[r+1],o=void 0!==m?c.groups[r+1].startRow:a.length,t=l.startRow;t<o;t++)h+=a[t].join("");var q;if(void 0!==m){for(q=0;q<c.groupField.length&&m.dataIndex!==c.groupField[q];q++);s=c.groupField.length-q}for(m=0;m<s;m++)if(y[m]){o="";c.groupCollapse&&!c.showSummaryOnHide&&(o=' style="display:none;"');h+="<tr"+o+' role="row" class="ui-widget-content jqfoot ui-row-'+
f.p.direction+'">';for(var o=e(r,m,c.groups),u=f.p.colModel,v,z=o.cnt,n=0;n<d;n++){var A="<td "+f.formatCol(n,1,"")+">&#160;</td>",B="{0}";b.each(o.summary,function(){if(this.nm===u[n].name){u[n].summaryTpl&&(B=u[n].summaryTpl);"avg"===this.st.toLowerCase()&&(this.v&&0<z)&&(this.v/=z);try{v=f.formatter("",this.v,n,this)}catch(a){v=this.v}A="<td "+f.formatCol(n,1,"")+">"+b.jgrid.format(B,v)+"</td>";return!1}});h+=A}h+="</tr>"}s=q}});b("#"+b.jgrid.jqID(f.p.id)+" tbody:first").append(h);h=null})},groupingGroupBy:function(a,
d){return this.each(function(){"string"===typeof a&&(a=[a]);var e=this.p.groupingView;this.p.grouping=!0;"undefined"===typeof e.visibiltyOnNextGrouping&&(e.visibiltyOnNextGrouping=[]);var f;for(f=0;f<e.groupField.length;f++)!e.groupColumnShow[f]&&e.visibiltyOnNextGrouping[f]&&b(this).jqGrid("showCol",e.groupField[f]);for(f=0;f<a.length;f++)e.visibiltyOnNextGrouping[f]=b("#"+b.jgrid.jqID(this.p.id)+"_"+b.jgrid.jqID(a[f])).is(":visible");this.p.groupingView=b.extend(this.p.groupingView,d||{});e.groupField=
a;b(this).trigger("reloadGrid")})},groupingRemove:function(a){return this.each(function(){"undefined"===typeof a&&(a=!0);this.p.grouping=!1;if(!0===a){for(var d=this.p.groupingView,e=0;e<d.groupField.length;e++)!d.groupColumnShow[e]&&d.visibiltyOnNextGrouping[e]&&b(this).jqGrid("showCol",d.groupField);b("tr.jqgroup, tr.jqfoot","#"+b.jgrid.jqID(this.p.id)+" tbody:first").remove();b("tr.jqgrow:hidden","#"+b.jgrid.jqID(this.p.id)+" tbody:first").show()}else b(this).trigger("reloadGrid")})},groupingCalculations:{handler:function(a,
b,e,f,c,h){var g={sum:function(){return parseFloat(b||0)+parseFloat(h[e]||0)},min:function(){return""===b?parseFloat(h[e]||0):Math.min(parseFloat(b),parseFloat(h[e]||0))},max:function(){return""===b?parseFloat(h[e]||0):Math.max(parseFloat(b),parseFloat(h[e]||0))},count:function(){""===b&&(b=0);return h.hasOwnProperty(e)?b+1:0},avg:function(){return g.sum()}};if(!g[a])throw"jqGrid Grouping No such method: "+a;a=g[a]();null!=f&&("fixed"==c?a=a.toFixed(f):(f=Math.pow(10,f),a=Math.round(a*f)/f));return a}}})})(jQuery);
(function(d){d.jgrid.extend({setTreeNode:function(a,c){return this.each(function(){var b=this;if(b.grid&&b.p.treeGrid)for(var e=b.p.expColInd,g=b.p.treeReader.expanded_field,h=b.p.treeReader.leaf_field,f=b.p.treeReader.level_field,l=b.p.treeReader.icon_field,j=b.p.treeReader.loaded,i,p,m,k;a<c;)k=b.p.data[b.p._index[b.rows[a].id]],"nested"==b.p.treeGridModel&&!k[h]&&(i=parseInt(k[b.p.treeReader.left_field],10),p=parseInt(k[b.p.treeReader.right_field],10),k[h]=p===i+1?"true":"false",b.rows[a].cells[b.p._treeleafpos].innerHTML=
k[h]),i=parseInt(k[f],10),0===b.p.tree_root_level?(m=i+1,p=i):(m=i,p=i-1),m="<div class='tree-wrap tree-wrap-"+b.p.direction+"' style='width:"+18*m+"px;'>",m+="<div style='"+("rtl"==b.p.direction?"right:":"left:")+18*p+"px;' class='ui-icon ",void 0!==k[j]&&(k[j]="true"==k[j]||!0===k[j]?!0:!1),"true"==k[h]||!0===k[h]?(m+=(void 0!==k[l]&&""!==k[l]?k[l]:b.p.treeIcons.leaf)+" tree-leaf treeclick",k[h]=!0,p="leaf"):(k[h]=!1,p=""),k[g]=("true"==k[g]||!0===k[g]?!0:!1)&&k[j],m=!1===k[g]?m+(!0===k[h]?"'":
b.p.treeIcons.plus+" tree-plus treeclick'"):m+(!0===k[h]?"'":b.p.treeIcons.minus+" tree-minus treeclick'"),m+="></div></div>",d(b.rows[a].cells[e]).wrapInner("<span class='cell-wrapper"+p+"'></span>").prepend(m),i!==parseInt(b.p.tree_root_level,10)&&((k=(k=d(b).jqGrid("getNodeParent",k))&&k.hasOwnProperty(g)?k[g]:!0)||d(b.rows[a]).css("display","none")),d(b.rows[a].cells[e]).find("div.treeclick").bind("click",function(a){a=d(a.target||a.srcElement,b.rows).closest("tr.jqgrow")[0].id;a=b.p._index[a];
if(!b.p.data[a][h])if(b.p.data[a][g]){d(b).jqGrid("collapseRow",b.p.data[a]);d(b).jqGrid("collapseNode",b.p.data[a])}else{d(b).jqGrid("expandRow",b.p.data[a]);d(b).jqGrid("expandNode",b.p.data[a])}return false}),!0===b.p.ExpandColClick&&d(b.rows[a].cells[e]).find("span.cell-wrapper").css("cursor","pointer").bind("click",function(a){var a=d(a.target||a.srcElement,b.rows).closest("tr.jqgrow")[0].id,c=b.p._index[a];if(!b.p.data[c][h])if(b.p.data[c][g]){d(b).jqGrid("collapseRow",b.p.data[c]);d(b).jqGrid("collapseNode",
b.p.data[c])}else{d(b).jqGrid("expandRow",b.p.data[c]);d(b).jqGrid("expandNode",b.p.data[c])}d(b).jqGrid("setSelection",a);return false}),a++})},setTreeGrid:function(){return this.each(function(){var a=this,c=0,b,e=!1,g,h=[];if(a.p.treeGrid){a.p.treedatatype||d.extend(a.p,{treedatatype:a.p.datatype});a.p.subGrid=!1;a.p.altRows=!1;a.p.pgbuttons=!1;a.p.pginput=!1;a.p.gridview=!0;null===a.p.rowTotal&&(a.p.rowNum=1E4);a.p.multiselect=!1;a.p.rowList=[];a.p.expColInd=0;b="ui-icon-triangle-1-"+("rtl"==a.p.direction?
"w":"e");a.p.treeIcons=d.extend({plus:b,minus:"ui-icon-triangle-1-s",leaf:"ui-icon-radio-off"},a.p.treeIcons||{});"nested"==a.p.treeGridModel?a.p.treeReader=d.extend({level_field:"level",left_field:"lft",right_field:"rgt",leaf_field:"isLeaf",expanded_field:"expanded",loaded:"loaded",icon_field:"icon"},a.p.treeReader):"adjacency"==a.p.treeGridModel&&(a.p.treeReader=d.extend({level_field:"level",parent_id_field:"parent",leaf_field:"isLeaf",expanded_field:"expanded",loaded:"loaded",icon_field:"icon"},
a.p.treeReader));for(g in a.p.colModel)if(a.p.colModel.hasOwnProperty(g)){b=a.p.colModel[g].name;b==a.p.ExpandColumn&&!e&&(e=!0,a.p.expColInd=c);c++;for(var f in a.p.treeReader)a.p.treeReader[f]==b&&h.push(b)}d.each(a.p.treeReader,function(b,e){if(e&&d.inArray(e,h)===-1){if(b==="leaf_field")a.p._treeleafpos=c;c++;a.p.colNames.push(e);a.p.colModel.push({name:e,width:1,hidden:true,sortable:false,resizable:false,hidedlg:true,editable:true,search:false})}})}})},expandRow:function(a){this.each(function(){var c=
this;if(c.grid&&c.p.treeGrid){var b=d(c).jqGrid("getNodeChildren",a),e=c.p.treeReader.expanded_field,g=c.rows;d(b).each(function(){var a=d.jgrid.getAccessor(this,c.p.localReader.id);d(g.namedItem(a)).css("display","");this[e]&&d(c).jqGrid("expandRow",this)})}})},collapseRow:function(a){this.each(function(){var c=this;if(c.grid&&c.p.treeGrid){var b=d(c).jqGrid("getNodeChildren",a),e=c.p.treeReader.expanded_field,g=c.rows;d(b).each(function(){var a=d.jgrid.getAccessor(this,c.p.localReader.id);d(g.namedItem(a)).css("display",
"none");this[e]&&d(c).jqGrid("collapseRow",this)})}})},getRootNodes:function(){var a=[];this.each(function(){var c=this;if(c.grid&&c.p.treeGrid)switch(c.p.treeGridModel){case "nested":var b=c.p.treeReader.level_field;d(c.p.data).each(function(){parseInt(this[b],10)===parseInt(c.p.tree_root_level,10)&&a.push(this)});break;case "adjacency":var e=c.p.treeReader.parent_id_field;d(c.p.data).each(function(){(null===this[e]||"null"==(""+this[e]).toLowerCase())&&a.push(this)})}});return a},getNodeDepth:function(a){var c=
null;this.each(function(){if(this.grid&&this.p.treeGrid)switch(this.p.treeGridModel){case "nested":c=parseInt(a[this.p.treeReader.level_field],10)-parseInt(this.p.tree_root_level,10);break;case "adjacency":c=d(this).jqGrid("getNodeAncestors",a).length}});return c},getNodeParent:function(a){var c=null;this.each(function(){if(this.grid&&this.p.treeGrid)switch(this.p.treeGridModel){case "nested":var b=this.p.treeReader.left_field,e=this.p.treeReader.right_field,g=this.p.treeReader.level_field,h=parseInt(a[b],
10),f=parseInt(a[e],10),l=parseInt(a[g],10);d(this.p.data).each(function(){if(parseInt(this[g],10)===l-1&&parseInt(this[b],10)<h&&parseInt(this[e],10)>f)return c=this,!1});break;case "adjacency":var j=this.p.treeReader.parent_id_field,i=this.p.localReader.id;d(this.p.data).each(function(){if(this[i]==a[j])return c=this,!1})}});return c},getNodeChildren:function(a){var c=[];this.each(function(){if(this.grid&&this.p.treeGrid)switch(this.p.treeGridModel){case "nested":var b=this.p.treeReader.left_field,
e=this.p.treeReader.right_field,g=this.p.treeReader.level_field,h=parseInt(a[b],10),f=parseInt(a[e],10),l=parseInt(a[g],10);d(this.p.data).each(function(){parseInt(this[g],10)===l+1&&(parseInt(this[b],10)>h&&parseInt(this[e],10)<f)&&c.push(this)});break;case "adjacency":var j=this.p.treeReader.parent_id_field,i=this.p.localReader.id;d(this.p.data).each(function(){this[j]==a[i]&&c.push(this)})}});return c},getFullTreeNode:function(a){var c=[];this.each(function(){var b;if(this.grid&&this.p.treeGrid)switch(this.p.treeGridModel){case "nested":var e=
this.p.treeReader.left_field,g=this.p.treeReader.right_field,h=this.p.treeReader.level_field,f=parseInt(a[e],10),l=parseInt(a[g],10),j=parseInt(a[h],10);d(this.p.data).each(function(){parseInt(this[h],10)>=j&&(parseInt(this[e],10)>=f&&parseInt(this[e],10)<=l)&&c.push(this)});break;case "adjacency":if(a){c.push(a);var i=this.p.treeReader.parent_id_field,p=this.p.localReader.id;d(this.p.data).each(function(a){b=c.length;for(a=0;a<b;a++)if(c[a][p]==this[i]){c.push(this);break}})}}});return c},getNodeAncestors:function(a){var c=
[];this.each(function(){if(this.grid&&this.p.treeGrid)for(var b=d(this).jqGrid("getNodeParent",a);b;)c.push(b),b=d(this).jqGrid("getNodeParent",b)});return c},isVisibleNode:function(a){var c=!0;this.each(function(){if(this.grid&&this.p.treeGrid){var b=d(this).jqGrid("getNodeAncestors",a),e=this.p.treeReader.expanded_field;d(b).each(function(){c=c&&this[e];if(!c)return!1})}});return c},isNodeLoaded:function(a){var c;this.each(function(){if(this.grid&&this.p.treeGrid){var b=this.p.treeReader.leaf_field;
c=void 0!==a?void 0!==a.loaded?a.loaded:a[b]||0<d(this).jqGrid("getNodeChildren",a).length?!0:!1:!1}});return c},expandNode:function(a){return this.each(function(){if(this.grid&&this.p.treeGrid){var c=this.p.treeReader.expanded_field,b=this.p.treeReader.parent_id_field,e=this.p.treeReader.loaded,g=this.p.treeReader.level_field,h=this.p.treeReader.left_field,f=this.p.treeReader.right_field;if(!a[c]){var l=d.jgrid.getAccessor(a,this.p.localReader.id),j=d("#"+d.jgrid.jqID(l),this.grid.bDiv)[0],i=this.p._index[l];
d(this).jqGrid("isNodeLoaded",this.p.data[i])?(a[c]=!0,d("div.treeclick",j).removeClass(this.p.treeIcons.plus+" tree-plus").addClass(this.p.treeIcons.minus+" tree-minus")):this.grid.hDiv.loading||(a[c]=!0,d("div.treeclick",j).removeClass(this.p.treeIcons.plus+" tree-plus").addClass(this.p.treeIcons.minus+" tree-minus"),this.p.treeANode=j.rowIndex,this.p.datatype=this.p.treedatatype,"nested"==this.p.treeGridModel?d(this).jqGrid("setGridParam",{postData:{nodeid:l,n_left:a[h],n_right:a[f],n_level:a[g]}}):
d(this).jqGrid("setGridParam",{postData:{nodeid:l,parentid:a[b],n_level:a[g]}}),d(this).trigger("reloadGrid"),a[e]=!0,"nested"==this.p.treeGridModel?d(this).jqGrid("setGridParam",{postData:{nodeid:"",n_left:"",n_right:"",n_level:""}}):d(this).jqGrid("setGridParam",{postData:{nodeid:"",parentid:"",n_level:""}}))}}})},collapseNode:function(a){return this.each(function(){if(this.grid&&this.p.treeGrid){var c=this.p.treeReader.expanded_field;a[c]&&(a[c]=!1,c=d.jgrid.getAccessor(a,this.p.localReader.id),
c=d("#"+d.jgrid.jqID(c),this.grid.bDiv)[0],d("div.treeclick",c).removeClass(this.p.treeIcons.minus+" tree-minus").addClass(this.p.treeIcons.plus+" tree-plus"))}})},SortTree:function(a,c,b,e){return this.each(function(){if(this.grid&&this.p.treeGrid){var g,h,f,l=[],j=this,i;g=d(this).jqGrid("getRootNodes");g=d.jgrid.from(g);g.orderBy(a,c,b,e);i=g.select();g=0;for(h=i.length;g<h;g++)f=i[g],l.push(f),d(this).jqGrid("collectChildrenSortTree",l,f,a,c,b,e);d.each(l,function(a){var b=d.jgrid.getAccessor(this,
j.p.localReader.id);d("#"+d.jgrid.jqID(j.p.id)+" tbody tr:eq("+a+")").after(d("tr#"+d.jgrid.jqID(b),j.grid.bDiv))});l=i=g=null}})},collectChildrenSortTree:function(a,c,b,e,g,h){return this.each(function(){if(this.grid&&this.p.treeGrid){var f,l,j,i;f=d(this).jqGrid("getNodeChildren",c);f=d.jgrid.from(f);f.orderBy(b,e,g,h);i=f.select();f=0;for(l=i.length;f<l;f++)j=i[f],a.push(j),d(this).jqGrid("collectChildrenSortTree",a,j,b,e,g,h)}})},setTreeRow:function(a,c){var b=!1;this.each(function(){this.grid&&
this.p.treeGrid&&(b=d(this).jqGrid("setRowData",a,c))});return b},delTreeNode:function(a){return this.each(function(){var c=this.p.localReader.id,b=this.p.treeReader.left_field,e=this.p.treeReader.right_field,g,h,f;if(this.grid&&this.p.treeGrid){var l=this.p._index[a];if(void 0!==l){g=parseInt(this.p.data[l][e],10);h=g-parseInt(this.p.data[l][b],10)+1;l=d(this).jqGrid("getFullTreeNode",this.p.data[l]);if(0<l.length)for(var j=0;j<l.length;j++)d(this).jqGrid("delRowData",l[j][c]);if("nested"===this.p.treeGridModel){c=
d.jgrid.from(this.p.data).greater(b,g,{stype:"integer"}).select();if(c.length)for(f in c)c.hasOwnProperty(f)&&(c[f][b]=parseInt(c[f][b],10)-h);c=d.jgrid.from(this.p.data).greater(e,g,{stype:"integer"}).select();if(c.length)for(f in c)c.hasOwnProperty(f)&&(c[f][e]=parseInt(c[f][e],10)-h)}}}})},addChildNode:function(a,c,b){var e=this[0];if(b){var g=e.p.treeReader.expanded_field,h=e.p.treeReader.leaf_field,f=e.p.treeReader.level_field,l=e.p.treeReader.parent_id_field,j=e.p.treeReader.left_field,i=e.p.treeReader.right_field,
p=e.p.treeReader.loaded,m,k,q,s,o;m=0;var r=c,t;if("undefined"===typeof a||null===a){o=e.p.data.length-1;if(0<=o)for(;0<=o;)m=Math.max(m,parseInt(e.p.data[o][e.p.localReader.id],10)),o--;a=m+1}var u=d(e).jqGrid("getInd",c);t=!1;if(void 0===c||null===c||""===c)r=c=null,m="last",s=e.p.tree_root_level,o=e.p.data.length+1;else if(m="after",k=e.p._index[c],q=e.p.data[k],c=q[e.p.localReader.id],s=parseInt(q[f],10)+1,o=d(e).jqGrid("getFullTreeNode",q),o.length?(r=o=o[o.length-1][e.p.localReader.id],o=d(e).jqGrid("getInd",
r)+1):o=d(e).jqGrid("getInd",c)+1,q[h])t=!0,q[g]=!0,d(e.rows[u]).find("span.cell-wrapperleaf").removeClass("cell-wrapperleaf").addClass("cell-wrapper").end().find("div.tree-leaf").removeClass(e.p.treeIcons.leaf+" tree-leaf").addClass(e.p.treeIcons.minus+" tree-minus"),e.p.data[k][h]=!1,q[p]=!0;k=o+1;b[g]=!1;b[p]=!0;b[f]=s;b[h]=!0;"adjacency"===e.p.treeGridModel&&(b[l]=c);if("nested"===e.p.treeGridModel){var n;if(null!==c){h=parseInt(q[i],10);f=d.jgrid.from(e.p.data);f=f.greaterOrEquals(i,h,{stype:"integer"});
f=f.select();if(f.length)for(n in f)f.hasOwnProperty(n)&&(f[n][j]=f[n][j]>h?parseInt(f[n][j],10)+2:f[n][j],f[n][i]=f[n][i]>=h?parseInt(f[n][i],10)+2:f[n][i]);b[j]=h;b[i]=h+1}else{h=parseInt(d(e).jqGrid("getCol",i,!1,"max"),10);f=d.jgrid.from(e.p.data).greater(j,h,{stype:"integer"}).select();if(f.length)for(n in f)f.hasOwnProperty(n)&&(f[n][j]=parseInt(f[n][j],10)+2);f=d.jgrid.from(e.p.data).greater(i,h,{stype:"integer"}).select();if(f.length)for(n in f)f.hasOwnProperty(n)&&(f[n][i]=parseInt(f[n][i],
10)+2);b[j]=h+1;b[i]=h+2}}if(null===c||d(e).jqGrid("isNodeLoaded",q)||t)d(e).jqGrid("addRowData",a,b,m,r),d(e).jqGrid("setTreeNode",o,k);q&&!q[g]&&d(e.rows[u]).find("div.treeclick").click()}}})})(jQuery);
(function(c){c.jgrid.extend({jqGridImport:function(a){a=c.extend({imptype:"xml",impstring:"",impurl:"",mtype:"GET",impData:{},xmlGrid:{config:"roots>grid",data:"roots>rows"},jsonGrid:{config:"grid",data:"data"},ajaxOptions:{}},a||{});return this.each(function(){var d=this,b=function(a,b){var e=c(b.xmlGrid.config,a)[0],h=c(b.xmlGrid.data,a)[0],f;if(xmlJsonClass.xml2json&&c.jgrid.parse){var e=xmlJsonClass.xml2json(e," "),e=c.jgrid.parse(e),g;for(g in e)e.hasOwnProperty(g)&&(f=e[g]);h?(h=e.grid.datatype,
e.grid.datatype="xmlstring",e.grid.datastr=a,c(d).jqGrid(f).jqGrid("setGridParam",{datatype:h})):c(d).jqGrid(f)}else alert("xml2json or parse are not present")},g=function(a,b){if(a&&"string"==typeof a){var e=!1;c.jgrid.useJSON&&(c.jgrid.useJSON=!1,e=!0);var f=c.jgrid.parse(a);e&&(c.jgrid.useJSON=!0);e=f[b.jsonGrid.config];if(f=f[b.jsonGrid.data]){var g=e.datatype;e.datatype="jsonstring";e.datastr=f;c(d).jqGrid(e).jqGrid("setGridParam",{datatype:g})}else c(d).jqGrid(e)}};switch(a.imptype){case "xml":c.ajax(c.extend({url:a.impurl,
type:a.mtype,data:a.impData,dataType:"xml",complete:function(f,g){"success"==g&&(b(f.responseXML,a),c(d).triggerHandler("jqGridImportComplete",[f,a]),c.isFunction(a.importComplete)&&a.importComplete(f))}},a.ajaxOptions));break;case "xmlstring":if(a.impstring&&"string"==typeof a.impstring){var f=c.jgrid.stringToDoc(a.impstring);f&&(b(f,a),c(d).triggerHandler("jqGridImportComplete",[f,a]),c.isFunction(a.importComplete)&&a.importComplete(f),a.impstring=null);f=null}break;case "json":c.ajax(c.extend({url:a.impurl,
type:a.mtype,data:a.impData,dataType:"json",complete:function(b){try{g(b.responseText,a),c(d).triggerHandler("jqGridImportComplete",[b,a]),c.isFunction(a.importComplete)&&a.importComplete(b)}catch(f){}}},a.ajaxOptions));break;case "jsonstring":a.impstring&&"string"==typeof a.impstring&&(g(a.impstring,a),c(d).triggerHandler("jqGridImportComplete",[a.impstring,a]),c.isFunction(a.importComplete)&&a.importComplete(a.impstring),a.impstring=null)}})},jqGridExport:function(a){var a=c.extend({exptype:"xmlstring",
root:"grid",ident:"\t"},a||{}),d=null;this.each(function(){if(this.grid){var b=c.extend(!0,{},c(this).jqGrid("getGridParam"));b.rownumbers&&(b.colNames.splice(0,1),b.colModel.splice(0,1));b.multiselect&&(b.colNames.splice(0,1),b.colModel.splice(0,1));b.subGrid&&(b.colNames.splice(0,1),b.colModel.splice(0,1));b.knv=null;if(b.treeGrid)for(var g in b.treeReader)b.treeReader.hasOwnProperty(g)&&(b.colNames.splice(b.colNames.length-1),b.colModel.splice(b.colModel.length-1));switch(a.exptype){case "xmlstring":d=
"<"+a.root+">"+xmlJsonClass.json2xml(b,a.ident)+"</"+a.root+">";break;case "jsonstring":d="{"+xmlJsonClass.toJson(b,a.root,a.ident,!1)+"}",void 0!==b.postData.filters&&(d=d.replace(/filters":"/,'filters":'),d=d.replace(/}]}"/,"}]}"))}}});return d},excelExport:function(a){a=c.extend({exptype:"remote",url:null,oper:"oper",tag:"excel",exportOptions:{}},a||{});return this.each(function(){if(this.grid){var d;"remote"==a.exptype&&(d=c.extend({},this.p.postData),d[a.oper]=a.tag,d=jQuery.param(d),d=-1!=a.url.indexOf("?")?
a.url+"&"+d:a.url+"?"+d,window.location=d)}})}})})(jQuery);
var xmlJsonClass={xml2json:function(a,b){9===a.nodeType&&(a=a.documentElement);var g=this.toJson(this.toObj(this.removeWhite(a)),a.nodeName,"\t");return"{\n"+b+(b?g.replace(/\t/g,b):g.replace(/\t|\n/g,""))+"\n}"},json2xml:function(a,b){var g=function(a,b,e){var d="",f,i;if(a instanceof Array)if(0===a.length)d+=e+"<"+b+">__EMPTY_ARRAY_</"+b+">\n";else{f=0;for(i=a.length;f<i;f+=1)var l=e+g(a[f],b,e+"\t")+"\n",d=d+l}else if("object"===typeof a){f=!1;d+=e+"<"+b;for(i in a)a.hasOwnProperty(i)&&("@"===
i.charAt(0)?d+=" "+i.substr(1)+'="'+a[i].toString()+'"':f=!0);d+=f?">":"/>";if(f){for(i in a)a.hasOwnProperty(i)&&("#text"===i?d+=a[i]:"#cdata"===i?d+="<![CDATA["+a[i]+"]]\>":"@"!==i.charAt(0)&&(d+=g(a[i],i,e+"\t")));d+=("\n"===d.charAt(d.length-1)?e:"")+"</"+b+">"}}else"function"===typeof a?d+=e+"<"+b+"><![CDATA["+a+"]]\></"+b+">":(void 0===a&&(a=""),d='""'===a.toString()||0===a.toString().length?d+(e+"<"+b+">__EMPTY_STRING_</"+b+">"):d+(e+"<"+b+">"+a.toString()+"</"+b+">"));return d},f="",e;for(e in a)a.hasOwnProperty(e)&&
(f+=g(a[e],e,""));return b?f.replace(/\t/g,b):f.replace(/\t|\n/g,"")},toObj:function(a){var b={},g=/function/i;if(1===a.nodeType){if(a.attributes.length){var f;for(f=0;f<a.attributes.length;f+=1)b["@"+a.attributes[f].nodeName]=(a.attributes[f].nodeValue||"").toString()}if(a.firstChild){var e=f=0,h=!1,c;for(c=a.firstChild;c;c=c.nextSibling)1===c.nodeType?h=!0:3===c.nodeType&&c.nodeValue.match(/[^ \f\n\r\t\v]/)?f+=1:4===c.nodeType&&(e+=1);if(h)if(2>f&&2>e){this.removeWhite(a);for(c=a.firstChild;c;c=
c.nextSibling)3===c.nodeType?b["#text"]=this.escape(c.nodeValue):4===c.nodeType?g.test(c.nodeValue)?b[c.nodeName]=[b[c.nodeName],c.nodeValue]:b["#cdata"]=this.escape(c.nodeValue):b[c.nodeName]?b[c.nodeName]instanceof Array?b[c.nodeName][b[c.nodeName].length]=this.toObj(c):b[c.nodeName]=[b[c.nodeName],this.toObj(c)]:b[c.nodeName]=this.toObj(c)}else a.attributes.length?b["#text"]=this.escape(this.innerXml(a)):b=this.escape(this.innerXml(a));else if(f)a.attributes.length?b["#text"]=this.escape(this.innerXml(a)):
(b=this.escape(this.innerXml(a)),"__EMPTY_ARRAY_"===b?b="[]":"__EMPTY_STRING_"===b&&(b=""));else if(e)if(1<e)b=this.escape(this.innerXml(a));else for(c=a.firstChild;c;c=c.nextSibling)if(g.test(a.firstChild.nodeValue)){b=a.firstChild.nodeValue;break}else b["#cdata"]=this.escape(c.nodeValue)}!a.attributes.length&&!a.firstChild&&(b=null)}else 9===a.nodeType?b=this.toObj(a.documentElement):alert("unhandled node type: "+a.nodeType);return b},toJson:function(a,b,g,f){void 0===f&&(f=!0);var e=b?'"'+b+'"':
"",h="\t",c="\n";f||(c=h="");if("[]"===a)e+=b?":[]":"[]";else if(a instanceof Array){var j,d,k=[];d=0;for(j=a.length;d<j;d+=1)k[d]=this.toJson(a[d],"",g+h,f);e+=(b?":[":"[")+(1<k.length?c+g+h+k.join(","+c+g+h)+c+g:k.join(""))+"]"}else if(null===a)e+=(b&&":")+"null";else if("object"===typeof a){j=[];for(d in a)a.hasOwnProperty(d)&&(j[j.length]=this.toJson(a[d],d,g+h,f));e+=(b?":{":"{")+(1<j.length?c+g+h+j.join(","+c+g+h)+c+g:j.join(""))+"}"}else e="string"===typeof a?e+((b&&":")+'"'+a.replace(/\\/g,
"\\\\").replace(/\"/g,'\\"')+'"'):e+((b&&":")+a.toString());return e},innerXml:function(a){var b="";if("innerHTML"in a)b=a.innerHTML;else for(var g=function(a){var b="",h;if(1===a.nodeType){b+="<"+a.nodeName;for(h=0;h<a.attributes.length;h+=1)b+=" "+a.attributes[h].nodeName+'="'+(a.attributes[h].nodeValue||"").toString()+'"';if(a.firstChild){b+=">";for(h=a.firstChild;h;h=h.nextSibling)b+=g(h);b+="</"+a.nodeName+">"}else b+="/>"}else 3===a.nodeType?b+=a.nodeValue:4===a.nodeType&&(b+="<![CDATA["+a.nodeValue+
"]]\>");return b},a=a.firstChild;a;a=a.nextSibling)b+=g(a);return b},escape:function(a){return a.replace(/[\\]/g,"\\\\").replace(/[\"]/g,'\\"').replace(/[\n]/g,"\\n").replace(/[\r]/g,"\\r")},removeWhite:function(a){a.normalize();var b;for(b=a.firstChild;b;)if(3===b.nodeType)if(b.nodeValue.match(/[^ \f\n\r\t\v]/))b=b.nextSibling;else{var g=b.nextSibling;a.removeChild(b);b=g}else 1===b.nodeType&&this.removeWhite(b),b=b.nextSibling;return a}};
function tableToGrid(j,k){jQuery(j).each(function(){if(!this.grid){jQuery(this).width("99%");var b=jQuery(this).width(),c=jQuery("tr td:first-child input[type=checkbox]:first",jQuery(this)),a=jQuery("tr td:first-child input[type=radio]:first",jQuery(this)),c=0<c.length,a=!c&&0<a.length,i=c||a,d=[],e=[];jQuery("th",jQuery(this)).each(function(){0===d.length&&i?(d.push({name:"__selection__",index:"__selection__",width:0,hidden:!0}),e.push("__selection__")):(d.push({name:jQuery(this).attr("id")||jQuery.trim(jQuery.jgrid.stripHtml(jQuery(this).html())).split(" ").join("_"),
index:jQuery(this).attr("id")||jQuery.trim(jQuery.jgrid.stripHtml(jQuery(this).html())).split(" ").join("_"),width:jQuery(this).width()||150}),e.push(jQuery(this).html()))});var f=[],g=[],h=[];jQuery("tbody > tr",jQuery(this)).each(function(){var b={},a=0;jQuery("td",jQuery(this)).each(function(){if(0===a&&i){var c=jQuery("input",jQuery(this)),e=c.attr("value");g.push(e||f.length);c.is(":checked")&&h.push(e);b[d[a].name]=c.attr("value")}else b[d[a].name]=jQuery(this).html();a++});0<a&&f.push(b)});
jQuery(this).empty();jQuery(this).addClass("scroll");jQuery(this).jqGrid(jQuery.extend({datatype:"local",width:b,colNames:e,colModel:d,multiselect:c},k||{}));for(b=0;b<f.length;b++)a=null,0<g.length&&(a=g[b])&&a.replace&&(a=encodeURIComponent(a).replace(/[.\-%]/g,"_")),null===a&&(a=b+1),jQuery(this).jqGrid("addRowData",a,f[b]);for(b=0;b<h.length;b++)jQuery(this).jqGrid("setSelection",h[b])}})};
(function(b){b.browser.msie&&8==b.browser.version&&(b.expr[":"].hidden=function(b){return 0===b.offsetWidth||0===b.offsetHeight||"none"==b.style.display});b.jgrid._multiselect=!1;if(b.ui&&b.ui.multiselect){if(b.ui.multiselect.prototype._setSelected){var m=b.ui.multiselect.prototype._setSelected;b.ui.multiselect.prototype._setSelected=function(a,e){var c=m.call(this,a,e);if(e&&this.selectedList){var d=this.element;this.selectedList.find("li").each(function(){b(this).data("optionLink")&&b(this).data("optionLink").remove().appendTo(d)})}return c}}b.ui.multiselect.prototype.destroy&&
(b.ui.multiselect.prototype.destroy=function(){this.element.show();this.container.remove();b.Widget===void 0?b.widget.prototype.destroy.apply(this,arguments):b.Widget.prototype.destroy.apply(this,arguments)});b.jgrid._multiselect=!0}b.jgrid.extend({sortableColumns:function(a){return this.each(function(){function e(){c.p.disableClick=true}var c=this,d=b.jgrid.jqID(c.p.id),d={tolerance:"pointer",axis:"x",scrollSensitivity:"1",items:">th:not(:has(#jqgh_"+d+"_cb,#jqgh_"+d+"_rn,#jqgh_"+d+"_subgrid),:hidden)",
placeholder:{element:function(a){return b(document.createElement(a[0].nodeName)).addClass(a[0].className+" ui-sortable-placeholder ui-state-highlight").removeClass("ui-sortable-helper")[0]},update:function(b,a){a.height(b.currentItem.innerHeight()-parseInt(b.currentItem.css("paddingTop")||0,10)-parseInt(b.currentItem.css("paddingBottom")||0,10));a.width(b.currentItem.innerWidth()-parseInt(b.currentItem.css("paddingLeft")||0,10)-parseInt(b.currentItem.css("paddingRight")||0,10))}},update:function(a,
g){var d=b(g.item).parent(),d=b(">th",d),e={},i=c.p.id+"_";b.each(c.p.colModel,function(b){e[this.name]=b});var h=[];d.each(function(){var a=b(">div",this).get(0).id.replace(/^jqgh_/,"").replace(i,"");a in e&&h.push(e[a])});b(c).jqGrid("remapColumns",h,true,true);b.isFunction(c.p.sortable.update)&&c.p.sortable.update(h);setTimeout(function(){c.p.disableClick=false},50)}};if(c.p.sortable.options)b.extend(d,c.p.sortable.options);else if(b.isFunction(c.p.sortable))c.p.sortable={update:c.p.sortable};
if(d.start){var g=d.start;d.start=function(b,a){e();g.call(this,b,a)}}else d.start=e;if(c.p.sortable.exclude)d.items=d.items+(":not("+c.p.sortable.exclude+")");a.sortable(d).data("sortable").floating=true})},columnChooser:function(a){function e(a,c){a&&(typeof a=="string"?b.fn[a]&&b.fn[a].apply(c,b.makeArray(arguments).slice(2)):b.isFunction(a)&&a.apply(c,b.makeArray(arguments).slice(2)))}var c=this;if(!b("#colchooser_"+b.jgrid.jqID(c[0].p.id)).length){var d=b('<div id="colchooser_'+c[0].p.id+'" style="position:relative;overflow:hidden"><div><select multiple="multiple"></select></div></div>'),
g=b("select",d),a=b.extend({width:420,height:240,classname:null,done:function(b){b&&c.jqGrid("remapColumns",b,true)},msel:"multiselect",dlog:"dialog",dialog_opts:{minWidth:470},dlog_opts:function(a){var c={};c[a.bSubmit]=function(){a.apply_perm();a.cleanup(false)};c[a.bCancel]=function(){a.cleanup(true)};return b.extend(true,{buttons:c,close:function(){a.cleanup(true)},modal:a.modal?a.modal:false,resizable:a.resizable?a.resizable:true,width:a.width+20},a.dialog_opts||{})},apply_perm:function(){b("option",
g).each(function(){this.selected?c.jqGrid("showCol",k[this.value].name):c.jqGrid("hideCol",k[this.value].name)});var d=[];b("option:selected",g).each(function(){d.push(parseInt(this.value,10))});b.each(d,function(){delete f[k[parseInt(this,10)].name]});b.each(f,function(){var b=parseInt(this,10);var a=d,c=b;if(c>=0){var g=a.slice(),e=g.splice(c,Math.max(a.length-c,c));if(c>a.length)c=a.length;g[c]=b;d=g.concat(e)}else d=void 0});a.done&&a.done.call(c,d)},cleanup:function(b){e(a.dlog,d,"destroy");
e(a.msel,g,"destroy");d.remove();b&&a.done&&a.done.call(c)},msel_opts:{}},b.jgrid.col,a||{});if(b.ui&&b.ui.multiselect&&a.msel=="multiselect"){if(!b.jgrid._multiselect){alert("Multiselect plugin loaded after jqGrid. Please load the plugin before the jqGrid!");return}a.msel_opts=b.extend(b.ui.multiselect.defaults,a.msel_opts)}a.caption&&d.attr("title",a.caption);if(a.classname){d.addClass(a.classname);g.addClass(a.classname)}if(a.width){b(">div",d).css({width:a.width,margin:"0 auto"});g.css("width",
a.width)}if(a.height){b(">div",d).css("height",a.height);g.css("height",a.height-10)}var k=c.jqGrid("getGridParam","colModel"),p=c.jqGrid("getGridParam","colNames"),f={},j=[];g.empty();b.each(k,function(b){f[this.name]=b;this.hidedlg?this.hidden||j.push(b):g.append("<option value='"+b+"' "+(this.hidden?"":"selected='selected'")+">"+jQuery.jgrid.stripHtml(p[b])+"</option>")});var i=b.isFunction(a.dlog_opts)?a.dlog_opts.call(c,a):a.dlog_opts;e(a.dlog,d,i);i=b.isFunction(a.msel_opts)?a.msel_opts.call(c,
a):a.msel_opts;e(a.msel,g,i)}},sortableRows:function(a){return this.each(function(){var e=this;if(e.grid&&!e.p.treeGrid&&b.fn.sortable){a=b.extend({cursor:"move",axis:"y",items:".jqgrow"},a||{});if(a.start&&b.isFunction(a.start)){a._start_=a.start;delete a.start}else a._start_=false;if(a.update&&b.isFunction(a.update)){a._update_=a.update;delete a.update}else a._update_=false;a.start=function(c,d){b(d.item).css("border-width","0px");b("td",d.item).each(function(b){this.style.width=e.grid.cols[b].style.width});
if(e.p.subGrid){var g=b(d.item).attr("id");try{b(e).jqGrid("collapseSubGridRow",g)}catch(k){}}a._start_&&a._start_.apply(this,[c,d])};a.update=function(c,d){b(d.item).css("border-width","");e.p.rownumbers===true&&b("td.jqgrid-rownum",e.rows).each(function(a){b(this).html(a+1+(parseInt(e.p.page,10)-1)*parseInt(e.p.rowNum,10))});a._update_&&a._update_.apply(this,[c,d])};b("tbody:first",e).sortable(a);b("tbody:first",e).disableSelection()}})},gridDnD:function(a){return this.each(function(){function e(){var a=
b.data(c,"dnd");b("tr.jqgrow:not(.ui-draggable)",c).draggable(b.isFunction(a.drag)?a.drag.call(b(c),a):a.drag)}var c=this;if(c.grid&&!c.p.treeGrid&&b.fn.draggable&&b.fn.droppable){b("#jqgrid_dnd").html()===null&&b("body").append("<table id='jqgrid_dnd' class='ui-jqgrid-dnd'></table>");if(typeof a=="string"&&a=="updateDnD"&&c.p.jqgdnd===true)e();else{a=b.extend({drag:function(a){return b.extend({start:function(d,e){if(c.p.subGrid){var f=b(e.helper).attr("id");try{b(c).jqGrid("collapseSubGridRow",f)}catch(j){}}for(f=
0;f<b.data(c,"dnd").connectWith.length;f++)b(b.data(c,"dnd").connectWith[f]).jqGrid("getGridParam","reccount")=="0"&&b(b.data(c,"dnd").connectWith[f]).jqGrid("addRowData","jqg_empty_row",{});e.helper.addClass("ui-state-highlight");b("td",e.helper).each(function(b){this.style.width=c.grid.headers[b].width+"px"});a.onstart&&b.isFunction(a.onstart)&&a.onstart.call(b(c),d,e)},stop:function(d,e){if(e.helper.dropped&&!a.dragcopy){var f=b(e.helper).attr("id");f===void 0&&(f=b(this).attr("id"));b(c).jqGrid("delRowData",
f)}for(f=0;f<b.data(c,"dnd").connectWith.length;f++)b(b.data(c,"dnd").connectWith[f]).jqGrid("delRowData","jqg_empty_row");a.onstop&&b.isFunction(a.onstop)&&a.onstop.call(b(c),d,e)}},a.drag_opts||{})},drop:function(a){return b.extend({accept:function(a){if(!b(a).hasClass("jqgrow"))return a;a=b(a).closest("table.ui-jqgrid-btable");if(a.length>0&&b.data(a[0],"dnd")!==void 0){a=b.data(a[0],"dnd").connectWith;return b.inArray("#"+b.jgrid.jqID(this.id),a)!=-1?true:false}return false},drop:function(d,e){if(b(e.draggable).hasClass("jqgrow")){var f=
b(e.draggable).attr("id"),f=e.draggable.parent().parent().jqGrid("getRowData",f);if(!a.dropbyname){var j=0,i={},h,n=b("#"+b.jgrid.jqID(this.id)).jqGrid("getGridParam","colModel");try{for(var o in f){h=n[j].name;h=="cb"||(h=="rn"||h=="subgrid")||f.hasOwnProperty(o)&&n[j]&&(i[h]=f[o]);j++}f=i}catch(m){}}e.helper.dropped=true;if(a.beforedrop&&b.isFunction(a.beforedrop)){h=a.beforedrop.call(this,d,e,f,b("#"+b.jgrid.jqID(c.p.id)),b(this));typeof h!="undefined"&&(h!==null&&typeof h=="object")&&(f=h)}if(e.helper.dropped){var l;
if(a.autoid)if(b.isFunction(a.autoid))l=a.autoid.call(this,f);else{l=Math.ceil(Math.random()*1E3);l=a.autoidprefix+l}b("#"+b.jgrid.jqID(this.id)).jqGrid("addRowData",l,f,a.droppos)}a.ondrop&&b.isFunction(a.ondrop)&&a.ondrop.call(this,d,e,f)}}},a.drop_opts||{})},onstart:null,onstop:null,beforedrop:null,ondrop:null,drop_opts:{activeClass:"ui-state-active",hoverClass:"ui-state-hover"},drag_opts:{revert:"invalid",helper:"clone",cursor:"move",appendTo:"#jqgrid_dnd",zIndex:5E3},dragcopy:false,dropbyname:false,
droppos:"first",autoid:true,autoidprefix:"dnd_"},a||{});if(a.connectWith){a.connectWith=a.connectWith.split(",");a.connectWith=b.map(a.connectWith,function(a){return b.trim(a)});b.data(c,"dnd",a);c.p.reccount!="0"&&!c.p.jqgdnd&&e();c.p.jqgdnd=true;for(var d=0;d<a.connectWith.length;d++)b(a.connectWith[d]).droppable(b.isFunction(a.drop)?a.drop.call(b(c),a):a.drop)}}}})},gridResize:function(a){return this.each(function(){var e=this,c=b.jgrid.jqID(e.p.id);if(e.grid&&b.fn.resizable){a=b.extend({},a||
{});if(a.alsoResize){a._alsoResize_=a.alsoResize;delete a.alsoResize}else a._alsoResize_=false;if(a.stop&&b.isFunction(a.stop)){a._stop_=a.stop;delete a.stop}else a._stop_=false;a.stop=function(d,g){b(e).jqGrid("setGridParam",{height:b("#gview_"+c+" .ui-jqgrid-bdiv").height()});b(e).jqGrid("setGridWidth",g.size.width,a.shrinkToFit);a._stop_&&a._stop_.call(e,d,g)};a.alsoResize=a._alsoResize_?eval("("+("{'#gview_"+c+" .ui-jqgrid-bdiv':true,'"+a._alsoResize_+"':true}")+")"):b(".ui-jqgrid-bdiv","#gview_"+
c);delete a._alsoResize_;b("#gbox_"+c).resizable(a)}})}})})(jQuery);
(function() {
  var errorTextFormat;

  jQuery(function() {
    var gridOptions;
    gridOptions = {
      datatype: "json",
      restful: true,
      rowNum: 20,
      viewrecords: true,
      multiselect: false,
      height: '450',
      rowList: [20, 40, 80],
      pager: '#pager',
      sortname: 'id',
      sortorder: "desc",
      caption: "User Management",
      editurl: '/users/post_data.json',
      colNames: ['id', 'Email', 'Username', 'First Name', 'Last Name', 'Roles', 'Edit roles', 'Action'],
      colModel: [
        {
          name: 'id',
          index: 'users.id',
          width: 55
        }, {
          name: 'user[email]',
          index: 'users.email',
          width: 200,
          editable: true,
          editrules: {
            required: true,
            email: true
          }
        }, {
          name: 'user[username]',
          index: 'users.username',
          width: 110,
          editable: true,
          editrules: {
            required: true
          }
        }, {
          name: 'user[first_name]',
          index: 'users.first_name',
          width: 100,
          editable: true,
          editrules: {
            required: true
          }
        }, {
          name: 'user[last_name]',
          index: 'users.last_name',
          width: 120,
          editable: true,
          editrules: {
            required: true
          }
        }, {
          name: "roles.name",
          index: 'roles.name',
          width: 120,
          search: true
        }, {
          name: "Edit roles",
          width: 120,
          formatter: "link",
          search: false,
          sortable: false
        }, {
          name: 'action',
          index: 'action',
          width: 150,
          sortable: false,
          formatter: 'actions',
          formatoptions: {
            keys: true
          },
          search: false
        }
      ]
    };
    $("#user_list").jqGrid(gridOptions);
    $("#user_list").jqGrid('navGrid', '#pager', {
      edit: false,
      add: true,
      del: false,
      search: false
    });
    return $("#user_list").jqGrid('filterToolbar', {
      stringResult: true,
      searchOnEnter: false
    });
  });

  errorTextFormat = function(data) {
    var reponse, res;
    reponse = jQuery.parseJSON(data.responseText);
    res = "This form has following errors: <br />";
    return res += reponse.status;
  };

  $.extend(jQuery.jgrid.edit, {
    errorTextFormat: errorTextFormat
  });

}).call(this);
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//










;
