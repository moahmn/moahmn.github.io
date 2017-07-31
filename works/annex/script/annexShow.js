(function(){
	function AnnneShow(options){
		this.init(options);
		this.annnexEvent();
	}	
	AnnneShow.prototype = {
		init : function(options){
			this.options = {
				'showImgName':true,
				'showImgDesc':true,
				'clickMaskClose':true,
				'highLightHtmlPath':'./',
				'keyWordParticipleUrl':'',//关键词分词接口
				'participleDataKey':'',//关键词分词接口传递关键字的key
				'annexSlickLayer':{'width': 600,'height':'auto'},
				'annexAudioLayer':{'width': 400,'height':'auto'},
				'annexVideoLayer':{'width': 600,'height':'auto'},
				'annexHtmlLayer':{'width':'60%','height':'auto'}
			};
			this.slickImagesLen = 0;
			this.count = 0;
			this.imageDesc = [];
			this.maxImgHeight = 0;
			$.extend(true,this.options,options);
		},
		AutoResizeImage:function(maxWidth,maxHeight,objImg){
			var me = this;
	        objImg.onload = function(){
	        	 
	            var hRatio;  
	            var wRatio;  
	            var Ratio = 1;  
	            var w = this.width;  
	            var h = this.height;  
	            wRatio = maxWidth / w;  
	            hRatio = maxHeight / h;
	            if (maxWidth == 0 && maxHeight == 0){  
	                Ratio = 1;  
	            }else if (maxWidth == 0){ 
	                if (hRatio < 1) Ratio = hRatio;  
	            }else if (maxHeight == 0){  
	                if (wRatio<1) Ratio = wRatio;  
	            }else if (wRatio < 1 || hRatio < 1){  
	                Ratio = ( wRatio <= hRatio? wRatio :hRatio);  
	            }  
	            if (Ratio<1){  
	                w = w * Ratio;  
	                h = h * Ratio;  
	            }

	            this.style.height = h+'px';  
	            this.style.width = w+'px';
	            me.count++;
	            if(me.maxImgHeight < h){
	            	me.maxImgHeight = h;
	            } 
	            if(me.count === me.slickImagesLen){
	            	
		 			$('.annex-item-slick').slick({});
		 			$('.imgAnnexOuterLayter').css({'height':me.maxImgHeight});
		 			$('.annex-item-slick').find('img , .annex-toolbar').show();
		 			$('.atlasDesc').attr('desc-show',me.options.showImgDesc);
		 			$('.slick-image-name').attr('img-show',me.options.showImgName);	

			 		$('.annex-item-slick').on('afterChange',function(){
						var index = $(this).slick('slickCurrentSlide');
			 			if(me.options.showImgDesc === true){
							$('.atlasDesc').html('');
							if(me.imageDesc[index] !== undefined){
								$('.atlasDesc').html(me.imageDesc[index]);
							}
			 			}
					})		            	
	            }
	            
	        }
		},
		annnexEvent : function(){
		var me = this;
		var $body = $('body');
		function closeHandler(){
			$('.annex-mask').remove();
 			 $('#annexPopUp').html('').removeClass('annex-video-layer annex-audio-layer annex-slick-layer annex-html-layer');			
		}

 		$body.on('click','.closePop',function(){
 			 closeHandler();
 		});

 		if(me.options.clickMaskClose === true){
	 		$body.on('click','.annex-mask',function(){
	 			 closeHandler();
	 		});
 		}

 		$('#annexPopUp').on('dblclick','.annex-resource-link',function(){
 			var target = null;
 			var url = $(this).attr('data-url');
 			var type = $(this).attr('data-type');
 			if(type === 'html'){
	 			 $.get(url,function(data){
	 			 	$('#annexHtmlContent').html(data);
	 			 })
 		 	}
 		 	$(this).addClass('annex-active').siblings().removeClass('annex-active');
 		 	if(type === '音频' || type === '视频'){
 		 		if(type === '音频'){target = $('#annexAudio')[0]}
 		 		if(type === '视频'){target = $('#annexVideo')[0]}
 		 		target.setAttribute('src',url);
 		 		target.play();
 		 	}
 		})
 		$('#annexShowWrapper').on('click','li',function(){
 			var targetText = $(this).attr('data-txt');
 			var $popUp = $('#annexPopUp');
 			var resourceInfo = null;
 			var imageUrl = [];
 			var imageNode = '';
 			var imageName = '';
 			var imageNames = [];
 			$popUp.attr('style','');
  			if(targetText){
 				$body.append('<div class="annex-mask"></div>');
 				$('.annex-mask').css({'height':$(document).height()});
 				$popUp.addClass('annex-pop').show();
 				if(targetText === '视频'){
 					resourceInfo = getResourceInfo($(this),'视频');
 		 			$popUp.addClass('annex-video-layer').css(me.options['annexVideoLayer']).append('<div class="annex-top clearfix"><div class="annex-toolbar" style="display:block"><a href="javascript:void(0)" class="close closePop"></a></div></div><video controls="controls" src='+resourceInfo.firstLink+' autoplay="autoplay" id="annexVideo"></video><nav><ul>'+resourceInfo.linksNode+'</ul></nav>')
 				
 				}else if(targetText === '音频'){

 					resourceInfo = getResourceInfo($(this),'音频');
 					$popUp.addClass('annex-audio-layer').css(me.options['annexAudioLayer']).append('<div class="annex-top clearfix"><div class="annex-toolbar" style="display:block"><a href="javascript:void(0)" class="close closePop"></a></div></div><audio controls="controls" src='+resourceInfo.firstLink+'  id="annexAudio" autoplay="autoplay"></audio><nav><ul>'+resourceInfo.linksNode+'</ul></nav>')
 				
 				}else if(targetText === '图片'){
 					me.count = 0;
 					if($(this).attr('data-url') === undefined){
 						throw new Error('请传递图片的data-url');
 						return;
 					}else{
 						imageUrl = $(this).attr('data-url').length > 0 ? $(this).attr('data-url').split(',') : [];
 						me.slickImagesLen = imageUrl.length;
 						console.log(me.slickImagesLen)
 					}
 				 	

 				 	if($(this).attr('data-names') !== undefined && $(this).attr('data-names').length > 0){
 				 		imageNames = $(this).attr('data-names').split(',');
 				 	}

 				 	if($(this).attr('data-desc') !== undefined && $(this).attr('data-desc').length > 0){
 				 		me.imageDesc = $(this).attr('data-desc').split(',');
 				 	}
 				 	 
					for(var i = 0 , len = imageUrl.length ; i < len ;i++){
						if(imageNames[i] !== undefined){
							imageName = imageNames[i];
						}else{
							imageName = imageUrl[i].substring(imageUrl[i].lastIndexOf('/')+1);
						}
		 				imageNode += '<div><div class="clearfix"><span img-show="false" class="slick-image-name">'+imageName+'</span><div class="annex-toolbar" ><a href="'+imageUrl[i]+'" class="open" target="_blank" title="在新页面打开"></a><a href="javascript:void(0)" class="close closePop"></a></div></div><div class="imgAnnexOuterLayter"><img src='+imageUrl[i]+' style="display:none;"></img></div></div>'
		 			}
		 			
 					 
		 			if(me.slickImagesLen > 0){

			 			$popUp.addClass('annex-slick-layer').css(me.options['annexSlickLayer']).append('<div style="position:relative;"><div class="atlasDesc" desc-show="false"></div><div class="annex-item-slick">'+imageNode+'</div></div>').find('img').each(function(i){
			 				me.AutoResizeImage(me.options['annexSlickLayer']['width'],0,$(this)[0]);
			 			});
			 			$('.atlasDesc').html(me.imageDesc.length > 0 ? me.imageDesc[0] : '');		 				
		 			}
 
 				}else if(targetText === 'HTML'){
 					resourceInfo = getResourceInfo($(this),'html');
 					 
 					$.get(me.options.highLightHtmlPath+'highLightHtml.html',function(data){
						 window.annexKeyWordInfo = resourceInfo.firstLink + '&keyWordParticipleUrl=' + me.options.keyWordParticipleUrl;
						 $popUp.addClass('annex-html-layer').css(me.options['annexHtmlLayer']).append('<div class="annex-top clearfix"><div class="annex-toolbar" style="display:block"><a href="javascript:void(0)" class="close closePop"></a></div>'+resourceInfo.linksNode+'</div><div id="annexHtmlContent">'+data+'</div>');					
 					})			
 				}	
 			}
 		});



 		/**
 		 * [getResourceInfo 获取资源信息]
 		 * @param  {[type]} context [上下文对象]
 		 * @param  {[type]} type    [音频/视频]
 		 * @return {[type]}         [返回链接节点、第一个资源地址]
 		 */
 		function getResourceInfo(context,type){
 			var resourceUrl = [],
 				resourceNames = context.attr('data-names') !== undefined && context.attr('data-names').length > 0 ? context.attr('data-names').split(',') : [],
 			  	urlList = '',
 			  	resourceName = '';
 			if(context.attr('data-url') === undefined){
 				throw new Error('请传递data-txt类型为'+type+'的data-url参数');
 				return;
 			}else{
 				resourceUrl = context.attr('data-url').length > 0 ? context.attr('data-url').split(',') : [];
 			}

 		 
 			for(var i = 0 , len = resourceUrl.length; i < len ;i++){
				 if(resourceNames[i] !== undefined){
				 	resourceName = resourceNames[i]
				 }else{
				 	resourceName = resourceUrl[i].substring(resourceUrl[i].lastIndexOf('/')+1);
				 }
				 urlList += '<li class="annex-resource-link annex-ellipsis '+(i === 0 ? 'annex-active' : '')+'" data-url='+resourceUrl[i]+' data-type='+type+'>'+resourceName+'</li>'
			}				
			 
			return {linksNode:urlList,firstLink:resourceUrl[0]}
 		}
	}
}

	window.AnnneShow = AnnneShow
}())
