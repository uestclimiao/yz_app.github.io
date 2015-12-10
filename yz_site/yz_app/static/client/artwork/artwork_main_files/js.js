// JavaScript Document

$(function(){
	$(".welcome_text").click(function(){
		$(this).addClass("off");
		setTimeout(function(){
			$("body").removeClass("welcome");
		},300)
	})
	$(".idx_boxback").load(function(){
		$(this).fadeIn(500)
	})
	
	//弹出url 
	$('.popurl').click(function() {
		//alert("dffgbgf");return false;
		var url = $(this).attr("href");
		var msg = $(this).attr("msg");
		if (msg == undefined) { 
			msg = "";
		}
		layer.open({
			type: 2,
			title: '查看详情',
			area: [$(this).data('width') ? $(this).data('width') : '485px', $(this).data('height') ? $(this).data('height') : '536px'],
			skin: 'layui-layer-rim', //加上边框
			content: url
		}); 
		return false;
	});
	
	//删除确认
    
	$('.confirm').on('click',function(){
		var url = $(this).attr("href");
		var msg = $(this).data("msg");
		var refer = $(this).attr("refer");
		if (msg == undefined) { 
			msg = "";
		}
		var callback = $(this).data("callback");
		var obj = $(this); //得到当前对象，供后面使用

		layer.confirm(msg ? msg : '确实要删除吗？', {
			btn: ['确定','取消'], //按钮
			shade: false //不显示遮罩
		}, function(){
			//location.href = url;
			$.get(url, function(data){
					layer.msg('操作成功！');
					if (refer != undefined) {
						window.setTimeout("location.href='"+refer+"'",1000);
					} else {
						
						//判断有无回调
						if (callback != undefined) {
							eval(callback);
						} else {
							window.setTimeout("window.location.reload();",1000);
						}
					}
				});

		}, function(index){
			layer.close(index);
			return false;
		});

		return false;
	});
	
	$(window).resize(function() {
		brand_anime_width = $(".brand_imgbox .brand_anime ul").width();
	})
	
	var img_show_width = 390;
	var img_show_height = 580;
	
	$(".designer_ul li").mouseover(function(){
		$(this).addClass("li").siblings().removeClass("li");
	})
	$(".designer_info .right_img .right_ul li").mouseover(function(){
		$(this).addClass("li").siblings().removeClass("li");
	})
	
	
//	$(".news_imglist li").mouseover(function(){
//		$(".news .news_focus").attr("src",$(this).find("img").eq(0).attr("src"));
//		$(".news .news_focus").fadeIn(200);
//	})
//	
	var designers = true;
	$(".designers").click(function(){
		var index = $(this).index();
		if(designers) $(".designers_box").animate({marginTop:-$(".designers").height()*index},400);
		else $(".designers_box").animate({marginTop:0},400);
		$(this).find(".designers_ul").slideToggle(400);
		designers = !designers;
	})
	
	//详细页面切换 switch
	$(".right_text .text_box.switch").click(function(){
		
		if($(this).find("div").is(":hidden")){
			$(this).siblings(".switch").find("div").slideUp();
		}else{
			$(this).siblings(".switch").find("div").slideDown();
		}
		$(this).find("div").slideToggle();
	})
	
	//首页nav 导航
	$(".nav .navs").hover(function(){
		$(this).children(".brand_select").show();
//		$(".brand_select .left_nav li h3").html(e.pageY);
	},function(e){
//		alert(e.pageY)
		$(this).children(".brand_select").hide();

	})
	var brand_anime_width = $(".brand_imgbox .brand_anime ul").width();
	var brand_anime_index = $(".brand_imgbox .brand_anime ul").index();
	var brand = 0;
	function brand_anime(){
		$(".brand_box .brand_imgbox .brand_anime").animate({marginLeft:-brand_anime_width*brand},600);
	}
	$(".brand_box .right_btn img:last-child").click(function(){
		if(brand < brand_anime_index) 	brand++;
		else brand = 0;
		brand_anime()
	})
	$(".brand_box .right_btn img:first-child").click(function(){
		if(brand > 0) 	brand--;
		brand_anime();
	})
	
	$(".orders h4 span").click(function(){
		$(this).addClass("on").siblings().removeClass("on");
		$(".order_form").eq($(this).index()).show().siblings(".order_form").hide();
	})
	$(".info_img .img_box ul li img").click(function(){
		$(".info_img .img_box ul li img").removeClass("on");
		$(this).addClass("	on");
		var this_src = $(this).data("src")
		$(".info_img .img").prop("src",this_src);
		$(".info_img .img").prop("alt",$(this).data("src2"));
	})
	
	var info_imgliH =  $(".info_img .img_box ul li").outerHeight(true);
	var info_li_index = $(".info_img .img_box ul li").index()-2;
	//alert(info_imgliH);
	//alert(info_li_index);
	var info_img = 0;
	function info_img_anime(){
		$(".info_img .img_box ul").animate({marginTop:-info_imgliH*info_img},600);
	}
	$(".info_img .img_box .bottom").click(function(){
		if(info_img < info_li_index) 	info_img++;
		else info_img = 0;
		info_img_anime()
	})
	$(".info_img .img_box .top").click(function(){
		if(info_img > 0) 	info_img--;
		info_img_anime();
	})
	$(".input_che").click(function(){
		var _this = $(this);
		$(".address_box .right_top").find("span").removeClass("on");
		if(_this.hasClass("radio")){
			$(".input_che.radio").each(function(){
				if(_this.data("radio_name") == $(this).data("radio_name")){
					$(this).find("span").removeClass("on");
					$(this).find("input").val(2);
				}
			})
		}
		$(".address_box .right_top").find("input").val(2);
		if(!_this.find("span").hasClass("on")){
			_this.find("span").addClass("on");
			_this.find("input").val(1);
		}else{
			_this.find("span").removeClass("on");
			_this.find("input").val(2);
		}
	})
	
	$(".art_show_class .fl_open").click(function(){
		$('.art_show_class .nav').css('left','0');
	})
	$(".art_show_class .nav .fr_clr").click(function(){
		$('.art_show_class .nav').css('left','-110%');
	})
	function banck_000(){
		$(".banck_000").fadeToggle('slow');
	}
//	$(".art_list li").live("click",function(){
//		//$(".pop_box").show();
//		//$(".art_infor").eq($(this).index()).addClass('on');
//		$(".art_infor").addClass('on');
//		banck_000();
//	})
	$(".clear_box").live("click",function(){
		$(this).parents(".art_infor").removeClass('on');
		banck_000()
	})
	
	
	$(".art_infor .left ul li img").click(function(){
		$(".art_infor .content_img img").prop("src",$(this).data('src'));
	})
/*	$(".tx_cont .right_list li").eq(0).css("margin-left","0px");
	$(".tx_cont .right_list li").each(function(){
		if(($(this).index()+1) % 3 == 0){
			$(this).next().css("margin-left","0px");
		}
	})*/
	
	var opt={
	  getResource:function(index,render){ 
		  if(index>=7) index=index%7+1;
		  var html='';
		  for(var i=20*(index-1);i<20*(index-1)+20;i++){
			 var k='';
			 for(var ii=0;ii<3-i.toString().length;ii++){
				k+='0';
			 }
			 k+=i;
			 var src="http://cued.xunlei.com/demos/publ/img/P_"+k+".jpg";
			 html+='<li class="cell"><a href="#"><img src="'+src+'" /><p>'+k+'</p></a></li>';
		  }
		  return $(html);
	  },
	  auto_imgHeight:true,
	  insert_type:1
	}
	$('#content').waterfall(opt);
	$(".sj_box a").hover(function(){
		$(this).find("em").fadeIn(200);
	},function(){
		$(this).find("em").fadeOut(200);
	})
	
	/*会员登录顶部步骤设置*/
	$(".step span:first-child").css({marginLeft:"-5px"});
	$(".step span:last-child").css({position:"absolute",right:"-10px",top:"0px",marginRight:"0px"});	
	$("td").each(function(){
		if($(this).html() == "") $(this).html("&nbsp;");
	})
});

(function($){
   var 
   
   setting={
      column_width:370,
	  column_className:'waterfall_column',
	  column_space:10,
	  cell_selector:'.cell',
	  img_selector:'img',
	  auto_imgHeight:true,
	  fadein:true,
	  fadein_speed:600,
	  insert_type:1,
	  getResource:function(index){ } 
   },
   //
   waterfall=$.waterfall={},
   $container=null;
   waterfall.load_index=0, 
   $.fn.extend({
       waterfall:function(opt){
		  opt=opt||{};  
	      setting=$.extend(setting,opt);
		  $container=waterfall.$container=$(this);
		  waterfall.$columns=creatColumn();
		  render($(this).find(setting.cell_selector).detach(),false); 
		  waterfall._scrollTimer2=null;
		  $(window).bind('scroll',function(){
		     clearTimeout(waterfall._scrollTimer2);
			 waterfall._scrollTimer2=setTimeout(onScroll,300);
		  });
		  waterfall._scrollTimer3=null;
		  $(window).bind('resize',function(){
		     clearTimeout(waterfall._scrollTimer3);
			 waterfall._scrollTimer3=setTimeout(onResize,300);
		  });
	   }
   });
   function creatColumn(){
      waterfall.column_num=calculateColumns();
	  
	  var html='';
	 /* for(var i=0;i<waterfall.column_num;i++){
	     html+='<div class="'+setting.column_className+'" style="width:'+setting.column_width+'px; display:inline-block; *display:inline;zoom:1; margin-left:'+setting.column_space/2+'px;margin-right:'+setting.column_space/2+'px; vertical-align:top; "></div>';
	  }*/
	   for(var i=0;i<waterfall.column_num;i++){
	     html+='<div class="'+setting.column_className+'" style="width:'+setting.column_width+'px; display:inline-block; *display:inline;zoom:1;margin-right:40px;  vertical-align:top; "></div>';
	  }
	  $container.prepend(html);
	  return $('.'+setting.column_className,$container);
   }
   function calculateColumns(){ 
      var num=Math.floor(($container.innerWidth())/(setting.column_width+setting.column_space));
	  if(num<1){ num=1; } 
	  return num;
   }
   function render(elements,fadein){ 
      if(!$(elements).length) return;
      var $columns = waterfall.$columns;
      $(elements).each(function(i){										
		  if(!setting.auto_imgHeight||setting.insert_type==2){
		     if(setting.insert_type==1){ 
			    insert($(elements).eq(i),setting.fadein&&fadein);
			 }else if(setting.insert_type==2){
			    insert2($(elements).eq(i),i,setting.fadein&&fadein);
		     }
			 return true;
		  }						
		  if($(this)[0].nodeName.toLowerCase()=='img'||$(this).find(setting.img_selector).length>0){
		      var image=new Image;
			  var src=$(this)[0].nodeName.toLowerCase()=='img'?$(this).attr('src'):$(this).find(setting.img_selector).attr('src');
			  image.onload=function(){ 
			      image.onreadystatechange=null;
				  if(setting.insert_type==1){ 
				     insert($(elements).eq(i),setting.fadein&&fadein);
				  }else if(setting.insert_type==2){
					 insert2($(elements).eq(i),i,setting.fadein&&fadein);
				  }
				  image=null;
			  }
			  image.onreadystatechange=function(){ 
			      if(image.readyState == "complete"){
					 image.onload=null;
					 if(setting.insert_type==1){ 
					    insert($(elements).eq(i),setting.fadein&&fadein);
					 }else if(setting.insert_type==2){
					    insert2($(elements).eq(i),i,setting.fadein&&fadein);
					 }
					 image=null;
				  }
			  }
			  image.src=src;
		  }else{
		      if(setting.insert_type==1){ 
				 insert($(elements).eq(i),setting.fadein&&fadein);
			  }else if(setting.insert_type==2){
				 insert2($(elements).eq(i),i,setting.fadein&&fadein);
			  }
		  }						
	  });
   }
   function public_render(elems){ 
   	  render(elems,true);	
   }
   function insert($element,fadein){ 
      if(fadein){
	     $element.css('opacity',0).appendTo(waterfall.$columns.eq(calculateLowest())).fadeTo(setting.fadein_speed,1);
	  }else{
         $element.appendTo(waterfall.$columns.eq(calculateLowest()));
	  }
   }
   function insert2($element,i,fadein){
      if(fadein){
	     $element.css('opacity',0).appendTo(waterfall.$columns.eq(i%waterfall.column_num)).fadeTo(setting.fadein_speed,1);
	  }else{
         $element.appendTo(waterfall.$columns.eq(i%waterfall.column_num));
	  }
   }
   function calculateLowest(){ 
      var min=waterfall.$columns.eq(0).outerHeight(),min_key=0;
	  waterfall.$columns.each(function(i){						   
		 if($(this).outerHeight()<min){
		    min=$(this).outerHeight();
			min_key=i;
		 }							   
	  });
	  return min_key;
   }
   function getElements(){ 
      $.waterfall.load_index++;
      return setting.getResource($.waterfall.load_index,public_render);
   }
   waterfall._scrollTimer=null;
   function onScroll(){
      clearTimeout(waterfall._scrollTimer);
	  waterfall._scrollTimer=setTimeout(function(){
	      var $lowest_column=waterfall.$columns.eq(calculateLowest());
		  var bottom=$lowest_column.offset().top+$lowest_column.outerHeight();
		  var scrollTop=document.documentElement.scrollTop||document.body.scrollTop||0;
		  var windowHeight=document.documentElement.clientHeight||document.body.clientHeight||0;
		  if(scrollTop>=bottom-windowHeight){
			 render(getElements(),true);
		  }
	  },100);
   }
   function onResize(){
      if(calculateColumns()==waterfall.column_num) return; 
      var $cells=waterfall.$container.find(setting.cell_selector);
	  waterfall.$columns.remove();
	  waterfall.$columns=creatColumn();
      render($cells,false); 
   }
})(jQuery);
