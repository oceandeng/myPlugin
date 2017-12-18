/*
* @Author: ocean_deng
* @Date:   2016-09-04 16:09:31
* @Last Modified by:   ocean_deng
* @Last Modified time: 2016-09-25 19:53:39
*/

'use strict';

var Quintus = function(opts){

	// 基本引擎API
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

	// 游戏循环系统
	Q.gameLoop = function(callback){
		Q.lastGameLoopFrame = new Date().getTime();
		Q.gameLoopCallbackWrapper = function(now){

			Q.loop = requestAnimationFrame(Q.gameLoopCallbackWrapper);
			var dt = now - Q.lastGameLoopFrame;
			if(dt > 100 || dt < 0){dt = 100;}
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

	// 事件系统 绑定、触发、解绑、释放
	Q.Evented = Class.extend({
		bind: function(event, target, callback){
			if(!callback){
				callback = target;
				target = null;
			}

			if(_.isString(callback)){
				callback = target[callback];
			}

			this.listeners = this.listeners || {};
			this.listeners[event] = this.listeners[event] || [];
			this.listeners[event].push([target || this, callback]);
			if(target){
				if(!target.binds){
					target.binds = [];
				}
				target.binds.push([this, event, callback]);
			}

		},
		trigger: function(event, data){
			if(this.listeners && this.listeners[event]){
				for(var i = 0, len = this.listeners[event].length; i < len; i++){
					var listeners = this.listeners[event][i];
					listeners[1].call(listeners[0], data);
				}
			}
		},
		unbind: function(event, target, callback){
			if(!target){
				if(this.listeners[event]){
					delete this.listeners[event];
				}
			}else{
				var l = this.listeners && this.listeners[event];
				if(l){
					for(var i = l.length - 1; i >=0; i--){
						if(l[i][0] == target){
							if(!callback || callback == l[i][1]);
							this.listeners[event].splice(i, 1);
						}
					}
				}
			}
		},
		debind: function(){
			if(this.binds){
				for(var i = 0, len = this.binds.length; i < len; i++){
					var boundEvent = this.binds[i],
						source = boundEvent[0],
						event = boundEvent[1];
					source.unbind(event, this);
				}
			}
		}
	})

	// 组件系统 注册、添加、删除、扩充
	Q.components = {};
	Q.register = function(name, methods){
		methods.name = name;
		Q.components[name] = Q.components.extend(methods);
	}
	Q.component = Q.Evented.extend({
		init: function(entity){
			this.entity = entity;
			if(this.extend){
				_.extend(entity, this.extend);
			}
			entity[this.name] = this;
			entity.activeComponents.push(this.name);
			if(this.added){
				this.added();
			}
		},
		destroy: function(){
			if(this.extend){
				var extensions = _.keys(this.extend);
				for(var i = 0, len = extensions.length; i < len; i++){
					delete this.entity[extensions[i]];
				}

			}
			delete this.entity[this.name];
			var idx = this.entity.activeComponents.indexOf(this.name);
			if(idx != -1){
				this.entity.activeComponents.splice(idx, 1);
			}
			this.debind();
			if(this.destroyed){
				this.destroyed();
			}
		}
	})

	Q.GameObject = Q.Evented.extend({
		has: function(component){
			return this[component] ? true : false;
		},
		add: function(components){
			components = Q._normalizeArg(components);
			if(!this.activeComponents){
				this.activeComponents = [];
			}
			for(var i = 0, len = components.length; i < len; i++){
				var name = components[i],
					comp = components[name];
				if(!this.has(name) && comp){
					var c = new comp(this);
					this.trigger('addComponent', c);
				}
			}
			return this;
		},
		del: function(components){
			components = Q._normalizeArg(components);
			for(var i = 0, len = components.length; i < len; i++){
				var name = components[i];
				if(name && this.has(name)){
					this.trigger('delComponent', this[name]);
					this[name].destroy();
				}
			}
			return this;
		},
		destroy: function(){
			if(this.destroyed){
				return;
			}
			this.debind();
			if(this.parent && this.parent.remove){
				this.parent.remove(this);
			}
			this.trigger('removed');
			this.destroyed = true;
		}
	});


	// TODO: Additional Quintus Code goes here
	return Q;
}
