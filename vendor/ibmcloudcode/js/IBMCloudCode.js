/*!
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2014. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *
 *  IBM Mobile Cloud Services, 
 *  CloudCode Service JavaScript SDK v1.0.0.20141113-1411
 *
 */

 
// Generated by IBMCloudCode SDK v0.6.13-01 - template: 'combined' 
// Combined template optimized with RequireJS/r.js v2.1.11 & almond.
(function (global, window){
  
var __isAMD = !!(typeof define === 'function' && define.amd),
    __isNode = (typeof exports === 'object'),
    __isWeb = !__isNode;

  var __nodeRequire = (__isNode ? require :
      function(dep){
        throw new Error("IBMCloudCode SDK detected missing dependency: '" + dep + "' - in a non-nodejs runtime. All it's binding variables were 'undefined'.")
      });
var bundleFactory = function() {/**
 * @license almond 0.2.9 Copyright (c) 2011-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
/* istanbul ignore next */
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice,
        jsSuffixRegExp = /\.js$/;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseParts = baseParts.slice(0, baseParts.length - 1);
                name = name.split('/');
                lastIndex = name.length - 1;

                // Node .js allowance:
                if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                    name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
                }

                name = baseParts.concat(name);

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            return req.apply(undef, aps.call(arguments, 0).concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        return req(cfg);
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define("almond", function(){});

define('ibm/mobile/service/cloudcode/IBMCloudCodeService', ['require','exports','module'],function (require, exports, module) {
  

function IBMCloudCodeService(requester) {
    this.logger = IBMLogger.getLogger();
    this.requester = requester;
  }
  ;
  var SLASH = "/";
  IBMCloudCodeService.prototype = {
    METHOD_GET: "GET",
    METHOD_POST: "POST",
    METHOD_DELETE: "DELETE",
    METHOD_PUT: "PUT",
    hostName: null,
    logger: null,
    requester: null,
    setBaseUrl: function (baseUrl) {
      if (!_.isString(baseUrl)) {
        throw new Error("The base Url has not been passed to the method");
      }
      return this.requester.setBaseUrl(baseUrl);
    },
    getBaseUrl: function () {
      return this.requester.getBaseUrl();
    },
    get: function (resource, options) {
      return this._callHttpRequest(this.METHOD_GET, resource, null, options);
    },
    post: function (resource, payload, options) {
      return this._callHttpRequest(this.METHOD_POST, resource, payload, options);
    },
    put: function (resource, payload, options) {
      return this._callHttpRequest(this.METHOD_PUT, resource, payload, options);
    },
    del: function (resource, options) {
      return this._callHttpRequest(this.METHOD_DELETE, resource, null, options);
    },
    request: function (type, url, payload, options) {
      if (_.isUndefined(options) || _.isNull(options)) {
        options = {};
      }
      var type = type.toUpperCase();
      if (!_.contains([
          "GET",
          "POST",
          "PUT",
          "DELETE"
        ], type)) {
        throw new Error("Unsupported request type: " + type);
      }
      return this._callHttpRequest(type, url, payload, options);
    },
    _callHttpRequest: function (type, resource, payload, options) {
      if (_.isUndefined(options) || _.isNull(options)) {
        options = {};
      }
      return this.requester.send(type, resource, payload, options, this);
    }
  };
  return IBMCloudCodeService;


});
define('ibm/mobile/service/_IBMCloudCode', ['require', 'exports', 'module', './cloudcode/IBMCloudCodeService'], function (require, exports, module, IBMCloudCodeService) {
  

var _IBMCloudCode = {
      VERSION: "1.0.0.20141113-1411",
      _cc: null,
      logger: null,
      initializeService: function () {
        return this._init();
      },
      _init: function () {
        throw new TypeError("Unimplemented _IBMCloudCode._init()");
      },
      getVersion: function () {
        return this.VERSION;
      },
      getService: function () {
        if (!_.isObject(this._cc)) {
          throw new Error("CloudCode Service not initialized. Call initializeService()");
        }
        return this._cc;
      }
    };
  return _IBMCloudCode;


});
define('ibm/mobile/service/cloudcode/request/_CloudCodeRequest', ['require','exports','module'],function (require, exports, module) {
  

var _CloudCodeRequest = {
      send: function () {
        return Q.reject("_CloudCodeRequest.send() Not implemented");
      }
    };
  return _CloudCodeRequest;


});
define('ibm/mobile/service/cloudcode/request/RestRequest', ['require', 'exports', 'module', './_CloudCodeRequest'], function (require, exports, module, _CloudCodeRequest) {
  

if (typeof IBMBluemix == "undefined" || typeof Q == "undefined" || typeof _ == "undefined" || typeof IBMLogger == "undefined" || typeof IBMHttpRequest == "undefined") {
    throw new Error("IBMBluemix has not been initialised");
  }
  var CC_URL = "$hostName/v1/apps/$appId/$uri", SLASH = "/", logger = IBMBluemix.getLogger();
  var RestRequest = _.extend({}, _CloudCodeRequest, {
      baseUrl: null,
      setBaseUrl: function (baseUrl) {
        if (baseUrl.lastIndexOf(SLASH, 0) === 0) {
          baseUrl = baseUrl.substring(1);
        }
        if (baseUrl.indexOf(SLASH, baseUrl.length - SLASH.length) !== -1) {
          baseUrl = baseUrl.substring(0, baseUrl.length - 1);
        }
        this.baseUrl = baseUrl;
      },
      getBaseUrl: function () {
        return this.baseUrl;
      },
      send: function (type, resource, payload, options, caller) {
        options = options || {};
        if (_.isUndefined(IBMBluemix)) {
          throw new Error("IBM Bluemix has not been initialized or loaded");
        }
        if (!_.isString(resource)) {
          throw new Error("Invalid resource name passed to the method");
        }
        var baseUrl = this.getBaseUrl();
        if (baseUrl == null) {
          baseUrl = IBMBluemix.getConfig().getBaaSURL();
        }
        var hostName = IBMBluemix.getConfig().getApplicationHostName();
        appId = IBMBluemix.getConfig().getApplicationId(), type = type;
        var actualUri = resource;
        if (actualUri.lastIndexOf(SLASH, 0) === 0) {
          actualUri = actualUri.substring(1);
        }
        if (actualUri.indexOf(SLASH, actualUri.length - SLASH.length) !== -1) {
          actualUri = actualUri.substring(0, actualUri.length - 1);
        }
        var url = new IBMUriBuilder(baseUrl).append(IBMUtils.replace(CC_URL, {
            hostName: hostName,
            appId: appId,
            uri: actualUri
          })).toString();
        console.log("CloudCode URL:" + url);
        if (payload) {
          var data;
          if (_.isString(payload)) {
            data = payload;
          } else {
            if (!options.contentType) {
              options.contentType = "json";
            }
            data = JSON.stringify(payload);
          }
          options = _.extend(options, { data: data });
        }
        options.method = type;
        options.url = url;
        options.rewriteDomain = false;
        logger.info("IBM CloudCode Call");
        logger.info(JSON.stringify(options));
        return IBMHttpRequest(options, caller);
      }
    });
  return RestRequest;


});
define('ibm/mobile/service/IBMCloudCode', ['require', 'exports', 'module', './_IBMCloudCode', './cloudcode/IBMCloudCodeService', './cloudcode/request/RestRequest'], function (require, exports, module, _IBMCloudCode, IBMCloudCodeService, RestRequest) {
  var __umodule__ = (function (require, exports, module, _IBMCloudCode, IBMCloudCodeService, RestRequest) {
  

var IBMCloudCode = _.extend({}, _IBMCloudCode, {
      _init: function () {
        if (typeof IBMBluemix == "undefined" || typeof Q == "undefined" || typeof _ == "undefined" || typeof IBMLogger == "undefined" || typeof IBMHttpRequest == "undefined") {
          throw new Error("IBMBluemix has not been initialised");
        }
        this.logger = IBMLogger.getLogger();
        this.logger.debug("IBMCloudCode: initializing version: " + this.getVersion());
        this._cc = new IBMCloudCodeService(RestRequest);
        if (!_.isObject(this._cc)) {
          throw new Error("Failed to create an IBM CloudCode Service Object");
        }
        return this._cc;
      }
    });
  return IBMCloudCode;


}).call(this, require, exports, module, _IBMCloudCode, IBMCloudCodeService, RestRequest);
var __old__ibmcloud_code0 = window['IBMCloudCode'];
window['IBMCloudCode'] = __umodule__;

__umodule__.noConflict = function () {
  window['IBMCloudCode'] = __old__ibmcloud_code0;
return __umodule__;
};
return __umodule__;
});
    return require('ibm/mobile/service/IBMCloudCode');
  };
if (__isAMD) {
  return define(bundleFactory);
} else {
    if (__isNode) {
        return module.exports = bundleFactory();
    } else {
        return bundleFactory();
    }
}
}).call(this, (typeof exports === 'object' ? global : window),
              (typeof exports === 'object' ? global : window))