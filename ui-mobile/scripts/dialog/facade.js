/*
* @Author: ocean_deng
* @Date:   2016-09-26 11:15:29
* @Last Modified by:   denghaiyang
* @Last Modified time: 2016-10-20 17:17:21
*/

'use strict';

(function(G){
	
	var publicDialog = publicDialog || {};

	publicDialog.confirm = function(obj){
		var dialog = new Dialog({
		    'type': 'alert',
		    'icon': obj.iconPath,
		    'msg': obj.msg,
		    'width': '90%',
		    'top': '30%',
		    'lock': true,
		    'lockClose': false,
		    'showButtons': true,
		    'submitButton': obj.submitButton,
		    'cancelButton': obj.cancelButton,
		    'contentStyle': {
		        'background': 'rgba(255, 255, 255, 1)',
		        'color': '#555',
		        'border-radius': '3px'
		    },
		    'animation':'animated bounceInDown',
		    'onSubmit': function(){
		    	return obj.submit && obj.submit();
		    },
		    'onCancel': function() {
		    	obj.cancel && obj.cancel();
		    }
		});
	};

	publicDialog.input = function(obj){
		var dialog = new Dialog({
		    'type': 'input',
		    'adviceVal': obj.adviceVal,
		    'icon': obj.iconPath,
		    'lock': true,
		    'lockClose': false,
		    'closeButton': false,
		    'showButtons': true,
		    'width':'90%',
		    'top': '30%',
		    'animation':'animated bounceInDown',
		    'contentStyle': {
		        'background': 'rgba(255, 255, 255, 1)',
		        'color': '#555',
		        'border-radius': '3px'
		    },
		    'onSubmit': function(){
		    	return obj.submit && obj.submit.call(this);
		    },
		    'onCancel': function() {
		    	obj.cancel && obj.cancel();
		    }
		});
	};

	publicDialog.selector = function(obj){
		var dialog = new Dialog({
		    'type': 'select',
		    'selectItems': obj.selectItems,
		    'lock': true,
		    'lockClose': false,
		    'closeButton': false,
		    'showButtons': true,
		    'width':'90%',
		    'top': '30%',
		    'animation':'animated bounceInDown',
		    'contentStyle': {
		        'background': 'rgba(255, 255, 255, 1)',
		        'color': '#555',
		        'border-radius': '3px'
		    },
		    'onReady': function(){
		    	obj.ready && obj.ready.call(this);
		    },
		    'onSubmit': function(){
		    	return obj.submit && obj.submit.call(this);
		    },
		    'onCancel': function() {
		    	obj.cancel && obj.cancel();
		    }
		});
	};

	publicDialog.fullLoading = loading({
		'width': 5,
		'height': 20,
		'full': true
	});

	G.publicDialog = publicDialog

})(window);
