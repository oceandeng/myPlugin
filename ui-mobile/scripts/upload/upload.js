/*
* @Author: ocean_deng
* @Date:   2016-09-27 16:04:44
* @Last Modified by:   ocean_deng
* @Last Modified time: 2016-09-30 14:59:26
*/

'use strict';

;(function($){

	$.fn.uploadimg = function(options){

		var config = $.extend({}, $.fn.uploadimg.defaults, options || {});
		// 加载
	    var load = loading({
	        'width': 5,
	        'height': 20
	    });
		return $(this).each(function(){
			var _this = this;

			this.filterFile = function(files) {       //选择文件的过滤方法
		        return _this.funFilterEligibleFile(files); 
		    };
			/*********************************
			 * 功能：过滤上传的文件格式等
			 * 返回: 通过的文件
			 **********************************/
			this.funFilterEligibleFile = function(files){
				var arrFiles = [];
				for(var i = 0, file; file = files[i]; i++){
					if(file.size >= 51200000){
						oTools.alertmess('您这个"'+ file.name +'"文件大小过大');	
					}else{
						arrFiles.push(file)
					}
				}
				return arrFiles;
			};
			// 获取文件
			this.funGetFiles = function(e){

				// 从事件中获取选中的所有文件
				var files = e.target.files || e.dataTransfer.files;
				config.uploadFiles = _this.filterFile(files);

				_this.funDealtFiles();
			};
			// 为每个上传文件添加唯一标示
			this.funDealtFiles = function(){
				$.each(config.uploadFiles, function(k, v){
					var _name = 'img-' + v.name.split('.')[0];
					v.index = _name + config.fileNum;
					config.fileNum++;
				});

				// 调用对文件处理的方法
				_this.fileSelected(config.uploadFiles);
				_this.uploadFile();
			}
		    this.uploadFile = function () {
		    	load.start();
		        var xhr = new XMLHttpRequest();
		        xhr.addEventListener("load", _this.uploadComplete, false);
		        xhr.addEventListener("progress", _this.uploadProgress, false);
		        xhr.addEventListener("error", _this.uploadFailed, false);
		        xhr.addEventListener("abort", _this.uploadCanceled, false);
		        xhr.open("POST", config.url, true);
		        var fd = new FormData();
		        fd.append($(_this).attr('name'), config.uploadFiles[config.index]);

		        xhr.send(fd);
		        xhr.onreadystatechange=function(){
		        	if(xhr.readyState == 2){
		        		return;
		        	}
		            if(xhr.readyState == 4){
		                if(xhr.status == 200){
				            config.success && config.success(xhr.responseText, config.uploadFiles[config.index].index);
				        }else{
				            console.log("获取数据错误！错误代号："+ xhr.status +"错误信息："+ xhr.statusText);
				        }
		            }
		        }
		    };
		    this.uploadComplete = function(){
		    	if(config.index == config.uploadFiles.length - 1){
		    		console.log('all done');
		    		config.index = 0;
		    		_this.emptyDel(config.uploadFiles);
					load && load.close();
					return;
		    	}
		    	config.index++;
		    	_this.uploadFile();
		    };
			this.fileSelected = function(selectFiles){
			    var fs = selectFiles,
			    	path = [],
			    	imgSize = {
			    		_w: 0,
			    		_h: 0
			    	},
			    	calcH = config.size.width;

			    if(fs.length > 0 && fs.length <= config.uplimit){
			    	for(var i = 0, len = fs.length; i < len; i++){
						(function(i){
				    		path[i] = _this.getBlobURL(fs[i]);
				    		var html = '';
							var img = new Image();
							var timestamp = Date.now();

							img.onload = function(){
								imgSize._w = img.width;
								imgSize._h = img.height;
						
								html += '<div id="' + fs[i].index + '" class="img-item" style="height:' + calcH + 'px">';
								html += '<div class="preview" data-index="queue-' + i + '"' +
								                '<div class="img-box">';
								html += '<img id="img' + timestamp + i + '" src="' + path[i] + '"/>'
								html += '</div><div class="remove">x</div></div></div>';
								$(config.previewWrap).append(html);
								var $img = $('#img' + timestamp + i),
									ratio = imgSize._w / imgSize._h;
								if(imgSize._w > calcH){
									$img.css({
										width: calcH,
										height: calcH / ratio
									})
									var cH = calcH / ratio;

									if(cH < calcH){
										$img.css({
											width: calcH * ratio,
											height: calcH,
											marginLeft: -(calcH * ratio - calcH) / 2
										})
									}else if(cH > calcH){
										$img.css({
											marginTop: -(calcH / ratio - calcH) / 2
										})
									}
								}
							}
							img.src = path[i];
						})(i)
			    	}
			    }else{
					if(fs.length == config.uplimit){
						_this.minlimit();
					};
				}
			};

//删除对应的文件
			this.funDeleteFile = function(delFileIndex, isCb){
				var self = this;  // 在each中this指向每个v  所以先将this保留

				$.each(config.uploadFile, function(k, v){
					if(delFile != v){
						// 如果不是删除的那个文件 就放到临时数组中
						tmpFile.push(v);
					}else{

					};
				});
				config.uploadFile = tmpFile;

				return true;
			};
			this.uploadProgress = function(evt) {
			    if (evt.lengthComputable) {
			        var percentComplete = Math.round(evt.loaded * 100 / evt.total) +'%';
			    }
			};
			this.uploadFailed = function(evt) {
				load && load.close();
			    oTools.alertmess("网络超时!请重新选择图片！");
			};
			this.minlimit = function(){
				oTools.alertmess('不能上传超过' + config.uplimit + '张图片')
			}
			this.uploadCanceled = function(evt) {
				load && load.close();
			    oTools.alertmess("上传已由用户或浏览器连接被取消掉了!");
			};
			this.emptyDel = function(arr){
				arr.splice(0, arr.length);
				return arr;
			};
			this.getBlobURL = (window.URL && URL.createObjectURL.bind(URL)) ||
				(window.webkitURL && webkitURL.createObjectURL.bind(webkitURL)) ||
				window.createObjectURL;
			this.revokeBlobURL = (window.URL && URL.revokeObjectURL.bind(URL)) ||
				(window.webkitURL && webkitURL.revokeObjectURL.bind(webkitURL)) ||
				window.revokeObjectURL;

			//插件调用执行部分
			$(_this).change(function(e){
				_this.funGetFiles(e);
			});

	    	$(config.previewWrap).on('click', '.remove', function(){
	    		var $_this = $(this);

	    		$_this.parents('.img-item').remove();

	    	});

		});
	};

	$.fn.uploadimg.defaults = {
		uploadFiles: null,		// 需要上传的文件数组
		index: 0,
		fileNum: 0,
		previewWrap: '',
		uplimit: 9
	};

})(Zepto);