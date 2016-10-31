/*
* @Author: denghaiyang
* @Date:   2016-10-08 15:55:43
* @Last Modified by:   denghaiyang
* @Last Modified time: 2016-10-12 14:11:52
*/

'use strict';

(function(G){
	var publicDialog = publicDialog || {};

	publicDialog.confirm = function(obj){
		$.ligerDialog.confirm(obj);
	}
	publicDialog.popup = function(obj){
		$.ligerDialog.open({
            id: obj.id,
            title: obj.title,
            target: obj.target,
            wrap: obj.wrap,
            width: obj.width
        });
	}
	publicDialog.close = function(id){
        $.ligerDialog.closeId(id);
	}

	G.publicDialog = publicDialog;
})(window);