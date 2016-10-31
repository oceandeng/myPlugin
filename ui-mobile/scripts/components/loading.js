/* 
* @Author: ocean
* @Date:   2015-06-29 10:16:24
* @Last Modified by:   denghaiyang
* @Last Modified time: 2016-10-20 17:17:13
*/

'use strict';


var loading = function(arg){
	var isEmpty = function(obj){
		var name;
		for(name in obj){
			return false;
		}
		return true;
	};
	var pathRoundRect = function(ctx, width, height, radius){
        ctx.beginPath();
        ctx.arc(width - radius, height - radius, radius, 0, Math.PI / 2);
        ctx.lineTo(radius, height);
        ctx.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);
        ctx.lineTo(0, radius);
        ctx.arc(radius, radius, radius, Math.PI, Math.PI * 3 / 2);
        ctx.lineTo(width - radius, 0);
        ctx.arc(width - radius, radius, radius, Math.PI * 3 / 2, Math.PI * 2);
        ctx.closePath();
	};
    var fillRoundRect = function (ctx, x, y, width, height, radius, /*optional*/fillColor){
        if(2*radius > width || 2*radius > height){
            return;
        }
        ctx.save();
        ctx.translate(x, y);
        pathRoundRect(ctx, width, height,radius);
        ctx.fillStyle = fillColor || "black";
        ctx.globalAlpha = 0.5;
        ctx.fill();
        ctx.restore();
    };

	function LoadingImg(arg){
		this.page_body = document.getElementsByTagName("body")[0];
	    this.init(arg);
	}

	LoadingImg.prototype = {
	    constructor:LoadingImg,
	    init: function (arg) {

	        var isConsist = !isEmpty(arg);
	        this.id = isConsist ? arg.id ? arg.id : 'loading' : 'loading';
	        this.block = isConsist ? arg.block ? arg.block : 12 : 12;
	        this.height = isConsist ? arg.height ? arg.height : 15 : 15;
	        this.width = isConsist ? arg.width ? arg.width : 3 : 3;
	        this.time = isConsist ? arg.time ? arg.time : 100 : 100;
	        this.full = arg.full || false;

	    },
	    start: function(){

	    	var flag = true;
	    	var childs = this.page_body.childNodes;

			for(var i = 0, l = childs.length; i < l; i ++){
				if(childs[i].nodeName.toLowerCase() == "canvas" && childs[i].id == 'loading'){
					flag = false;
				}else{
					flag = true;
				}
			}

			if(flag){
		    	this.createDom();
		    	this.setStyle();
		    	this.draw();
			}

	    },
	    createDom: function(){
			this.canvas = document.createElement('canvas');
			this.offcanvas = document.createElement('canvas');

			if(this.full){
				this.fullBg = document.createElement('div');
	       	 	this.fullBg.appendChild(this.canvas);
				this.page_body.appendChild(this.fullBg);
			}else{
		        this.page_body.appendChild(this.canvas);
			}


	    },
	    setStyle: function(){
	    	if(this.fullBg){
	    		this.fullBg.style.backgroundColor = 'rgba(0, 0, 0, .6)';
	    		this.fullBg.style.position = 'fixed';
	    		this.fullBg.style.top = '0';
	    		this.fullBg.style.zIndex = 99;
	    		this.fullBg.style.width = '100%';
	    		this.fullBg.style.height = '100%';
	    	}

	    	this.canvas.id = this.id;
	        this.canvas.width = this.offcanvas.width = 160;
	        this.canvas.height = this.offcanvas.height = 160;
	        this.canvas.style.width = this.offcanvas.style.width = "80px";
	        this.canvas.style.height = this.offcanvas.style.height = "80px";
	        this.canvas.style.position = 'fixed';
	    	this.canvas.style.zIndex = 999;
	        this.canvas.style.top = '30%';
	        this.canvas.style.left = '50%';
	        this.canvas.style.marginLeft = '-40px';
	    },
	    draw: function(){
	    	this.ctx = this.canvas.getContext("2d");

	        this.offctx = this.offcanvas.getContext("2d");
	        this.offctx.width = this.height*6;
	        this.offctx.height = this.height*6;

	        this.offctx.translate(this.offctx.width/1.5, this.offctx.height/1.5);
	        var radius = 2;

	        this.view(radius);
	  
	    },
	    loop: function(alpha){
	        this.offctx.rotate(Math.PI*2/this.block);
	        this.offctx.beginPath();
	        this.offctx.fillStyle = "rgba(255,255,255,"+alpha+")";
	        this.offctx.arc(0, this.offctx.width/2-this.height*2,this.width/2, 0 ,Math.PI, true);
	        this.offctx.arc(0, this.offctx.width/2-this.height, this.width/2, Math.PI, 0, true);
	        this.offctx.closePath();
	        this.offctx.fill();
	    },
	    view: function(radius){
	        var that = this;
	        this.offctx.rotate(Math.PI*2/this.block);

			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

	        if(!this.full){
				fillRoundRect(this.ctx, 0, 0, this.canvas.width, this.canvas.height, 10);
			}
            this.ctx.drawImage(this.offcanvas, 0, 0);
            this.offctx.clearRect(-this.offctx.width/2, -this.offctx.height/2, this.offctx.width, this.offctx.height);

            radius >= this.block? radius = 1:radius += 1;

	        for(var i = 1; i <= this.block; i ++){
	            this.loop(i/this.block);
	        };

	        this.timeout = setTimeout(function(){
	            that.view(radius);
	        }, that.time);

	    },
	    removeDom: function(){
	    	var that = this;
			var flag = true;
	    	var childs = this.page_body.childNodes;

			for(var i = 0, l = childs.length; i < l; i ++){
				if(childs[i].nodeName.toLowerCase() == "canvas" && childs[i].id == 'loading'){
					flag = false;
				}

				if(childs[i].childNodes[0]){
					if(childs[i].childNodes[0].nodeName.toLowerCase() == "canvas" && childs[i].childNodes[0].id == 'loading'){
						flag = false;
					}
				}
			}

			if(!flag){
	            this.canvas.parentNode.removeChild(this.canvas);
	            clearTimeout(that.timeout);
			}
			if(!flag && this.full){
				this.fullBg.parentNode.removeChild(this.fullBg);
	            clearTimeout(that.timeout);
			}
	    },
	    close: function(){
	    	this.removeDom();
	    }
	}
	return new LoadingImg(arg);
};

/********************************************
// -- 调用DEMO 
*********************************************/

// $('#demo').on('click', function(){
// 	load.start();
// });

// $('#menu').on('click', function(){
// 	load && load.close();
// });
