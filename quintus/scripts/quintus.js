/*
* @Author: ocean_deng
* @Date:   2016-09-04 16:09:31
* @Last Modified by:   ocean_deng
* @Last Modified time: 2016-09-04 22:04:23
*/

'use strict';

/* requestAnimationFrame.js
 * by zhangxinxu 2013-09-30
*/
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||    // name has changed in Webkit
                                      window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
})();


var Quintus = function(opts){
	var Q = {};

	// Some base optins to be filled in later
	Q.options = {
		// TODO: set some sensible defaults
	};
	if(opts){
		_(Q.options).extend(opts);
	}

	Q._normalizeArg = function(arg){
		if(_.isString(arg)){
			arg = arg.replace(/\s+/g, '').split(',');
		}
		if(!_.isArray(arg)){
			arg = [arg];
		}
		return arg;
	}

	// Shortcut to extend Quints width new functionality
	// binding the methods to Q
	Q.extend = function(obj){
		_(Q).extend(obj);
		return Q;
	}

	// Syntax for including other modules into quintus
	Q.include = function(mod){
		_.each(Q._normalizeArg(mod), function(m){
			m = Quintus[m] || m;
			m(Q);
 		});
 		return Q;
	}


	Q.gameLoop = function(callback){
		Q.lastGameLoopFrame = new Date().getTime();

		Q.gameLoopCallbackWrapper = function(now){

			Q.loop = requestAnimationFrame(Q.gameLoopCallbackWrapper);
			var dt = now - Q.lastGameLoopFrame;

			if(dt > 100){dt = 100;}
			callback.apply(Q, [dt / 1000]);
			Q.lastGameLoopFrame = now;
		}

		requestAnimationFrame(Q.gameLoopCallbackWrapper);
	};

	Q.pauseGame = function(){
		if(Q.loop){
			cancelAnimationFrame(Q.loop);
		}
		Q.loop = null;
	}
	Q.unpauseGame = function(){
		if(!Q.loop){
			Q.lastGameLoopFrame = new Date().getTime();
			Q.loop = requestAnimationFrame(Q.gameLoopCallbackWrapper);
		}
	}

	// TODO: Additional Quintus Code goes here
	return Q;
}