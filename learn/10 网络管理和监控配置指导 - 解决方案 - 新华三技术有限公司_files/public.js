$(function(){
	dailiForm();
	kodistsys();
	timeLine();
	slideBox();
    videoSlide();
    switchaccordion();
    righton();
    banon();
    righthelp();
    ko0414();
    responsivetable();
});
// responsivetable
function responsivetable() {
    $('table').each(function(){
        //嵌套table的情况下table不增加div
        if($(this).parent()[0].tagName.toLowerCase()!='td'){
            $(this).addClass('table').wrap('<div class="table-responsive"></div>');
        }
        else{
           $(this).removeClass('Table'); 
        }
    })
}

// ko0414
function ko0414(){
    $('.ko0414D').click(function(){
        var koimg = $(this).html();
        $('body').append('<div class="ko0414F">'+koimg+'<div class="ko0414close"></div></div>');
        $('.ko0414F').click(function(){
            $(this).remove();
        })
    })
}

//或作伙伴 - 代理表单
function dailiForm(){
	var _wrap = $('.normal_form');
	var _select = _wrap.find('.btn-group');
	_select.each(function(e){
		$(this).children('.dropdown-menu').children('li').children('a').click(function(){
			_select.eq(e).children().eq(0).text($(this).text());
			_select.eq(e).children('input').text($(this).text());
		})
	})
}

//渠道系统说明弹出
function kodistsys(){
	$(".ko-distsys h5 button").popover(); 
}

// 关于我们 - timeline
function timeLine(){
	var _wrap = $('.timeline');
	var _year = _wrap.find('a.year');
	var _mon = _wrap.find('a.month');
    _wrap.each(function(){
        $(this).children('ul').children('li').eq(0).addClass('first').addClass('on');
    })
	_year.each(function(){
		$(this).click(function(){
			_year.parent().removeClass('on');
			// $(this).parent().addClass('on').children('dl').children('dd').removeClass('on').eq(0).addClass('on');
            $(this).parent().addClass('on');
		})
	})
	// _mon.each(function(){
	// 	$(this).click(function(){
	// 		_mon.parent().removeClass('on');
	// 		$(this).parent().addClass('on');
	// 	})
	// })
}

//带缩略图的轮播
function slideBox(){
    var _bloor = false;
    if($('#slide_box').length>0){
        _bloor = true;
    }
    if(_bloor){
        vSide();
    }
    function vSide(){
        var mask = $('.slide_box').children('.tFocus');
        var mask_ = $('.slide_box').children('.tFocusBtn');
        var tips = $('.slide_box').children('.tips')
        var ul = $('.tFocus-btn ul',mask_);
        var li = ul.children('li').length;
        var _width = ul.children('li:first').outerWidth(true);
        var _just = true;
        // var sum = $('.slide_box').attr('visible-num');
        // sum = sum-1;

        var _widwrap = $('.slide_box').outerWidth()-80;
        
        var sum = parseInt(_widwrap / 151)-1;
        var timebox = tips.find('.time');
        var myDate = new Date();
        var _year = myDate.getFullYear();
        var _month = myDate.getMonth()+1;
        var _date = myDate.getDate();
        var _hour = myDate.getHours();
        var _minute = myDate.getMinutes();
        timebox.text(_year+'年'+_month+'月'+_date+'日'+_hour+':'+_minute);

        var _now = tips.find('.now');
        var _all = tips.find('.all');
        _all.text(li);

        ul.children('li').hover(function(){
            _just = false;
        });
        ul.on('mouseleave',function(){
            _just = true;
        })
        
        $('.slide_box').slide({
            titCell:'.tFocus-btn ul li',
            effect:'leftLoop',
            prevCell:'.prev',
            nextCell:'.next',
            mainCell:'.tFocus-pic',
            titOnClassName:'active',
            trigger:"click",
            startFun:function(i){
                if(_just){
                    var t = i>sum?i-sum:0;
                    ul.stop(true,true).animate({left:'-'+_width*t+'px'},400);
                }
                _now.text(i+1);
            }
        })

        _bloor = false;

        jQuery(document).ready(function($){
            if($.support.fullscreen){
            $('#fullscreen').click(function(e){
                $('.tFocus2').show();
                $('.tFocus2').fullScreen();
                e.preventDefault();
                var newpht = $(window).height() - $('.tFocus:eq(0)').outerHeight(true);
                $('.tFocus2').css("margin-top",newpht/3);
                $('.tFocus2').css("background","#000");

                var oldwidth = $('.tFocus-pic:eq(0) li:eq(0)').outerWidth(true);
                var newwidth = $(window).width();
                $('.tFocus2 .tempWrap').css("width",newwidth);
                $('.tFocus2 .tFocus-pic li').css("width",newwidth);
                $('.tFocus2 .tFocus-pic li a').removeClass('col-sm-8').removeClass('col-sm-offset-2').addClass('col-sm-10').addClass('col-sm-offset-1');
                $('.tFocus2 .tFocus-pic').css("width",newwidth*(li+2));
                var oldsum = - $('.tips .now').text();
                $('.tFocus2 .tFocus-pic').css("left",newwidth*oldsum+"px");
                // next
                $('.tFocus2 .next').css("margin-right","20px");
                $('.tFocus2 .next').unbind();
                $('.tFocus2 .next').bind("click",function(){
                    oldsum = oldsum-1;
                    if(oldsum >= -li){
                        $('.tFocus2 .tFocus-pic').stop(true,true).animate({left:newwidth*oldsum+"px"});
                    }else{
                        oldsum = -1;
                        $('.tFocus2 .tFocus-pic').stop(true,true).css("left",0);
                        $('.tFocus2 .tFocus-pic').stop(true,true).animate({left:newwidth*oldsum+"px"});
                    }
                });
                // prev
                $('.tFocus2 .prev').css("margin-left","20px");
                $('.tFocus2 .prev').unbind();
                $('.tFocus2 .prev').bind("click",function(){
                    oldsum = oldsum+1;
                    if(oldsum <= -1){
                        $('.tFocus2 .tFocus-pic').stop(true,true).animate({left:newwidth*oldsum+"px"});
                    }else{
                        oldsum = -li;
                        $('.tFocus2 .tFocus-pic').stop(true,true).css("left",newwidth*(-li-1)+"px");
                        $('.tFocus2 .tFocus-pic').stop(true,true).animate({left:newwidth*oldsum+"px"});
                    }
                });
                
            }); 
            }else{
                $('#fullscreen').click(function(e){
                    $('.tFocus2').show();
                    $('.tFocus2').css({"position":"fixed","z-index":"99999","top":"0","left":"0","height":"100%"});
                    $('.tFocus2').css("padding-top","20px");
                    $('.tFocus2').css("background","#000");

                    var oldwidth = $('.tFocus-pic:eq(0) li:eq(0)').outerWidth(true);
                    var newwidth = $(window).width();
                    $('.tFocus2 .tempWrap').css("width",newwidth);
                    $('.tFocus2 .tFocus-pic li').css("width",newwidth);
                    $('.tFocus2 .tFocus-pic li a').removeClass('col-sm-8').removeClass('col-sm-offset-2').addClass('col-sm-10').addClass('col-sm-offset-1');
                    $('.tFocus2 .tFocus-pic').css("width",newwidth*(li+2));
                    var oldsum = - $('.tips .now').text();
                    $('.tFocus2 .tFocus-pic').css("left",newwidth*oldsum+"px");
                    // next
                    $('.tFocus2 .next').css("margin-right","20px");
                    $('.tFocus2 .next').unbind();
                    $('.tFocus2 .next').bind("click",function(){
                        oldsum = oldsum-1;
                        if(oldsum >= -li){
                            $('.tFocus2 .tFocus-pic').stop(true,true).animate({left:newwidth*oldsum+"px"});
                        }else{
                            oldsum = -1;
                            $('.tFocus2 .tFocus-pic').stop(true,true).css("left",0);
                            $('.tFocus2 .tFocus-pic').stop(true,true).animate({left:newwidth*oldsum+"px"});
                        }
                    });
                    // prev
                    $('.tFocus2 .prev').css("margin-left","20px");
                    $('.tFocus2 .prev').unbind();
                    $('.tFocus2 .prev').bind("click",function(){
                        oldsum = oldsum+1;
                        if(oldsum <= -1){
                            $('.tFocus2 .tFocus-pic').stop(true,true).animate({left:newwidth*oldsum+"px"});
                        }else{
                            oldsum = -li;
                            $('.tFocus2 .tFocus-pic').stop(true,true).css("left",newwidth*(-li-1)+"px");
                            $('.tFocus2 .tFocus-pic').stop(true,true).animate({left:newwidth*oldsum+"px"});
                        }
                    });
                })
            }        
        });
        $(document).keyup(function(event){
             switch(event.keyCode) {
             case 27:
             $('.tFocus2').hide();
             $.fullscreen.exit();
             return false;
             }
        });
    }
}

function videoSlide(){
    var _wrap = $('.slide-video');
    var matchbox = $('.matchbox',_wrap);
    matchbox.each(function(){
        $(this).mouseenter(function(){
            $(this).children('.shadow').stop(true,true).animate({
                top: 0
            });
        })
        $(this).mouseleave(function(){
            $(this).children('.shadow').stop(true,true).animate({
                top: '80%'
            });
        })
    })
}

function switchaccordion(){
    var _wrap = $('.accordion');
    _wrap.children('.switch').click(function(){
            if ($(this).hasClass("on")) {
                $(this).removeClass("on");
                $(this).next('.jt-ul').hide();
            }else{
                $(this).addClass("on");
                $(this).next('.jt-ul').show();
            }
    })
}

// 带右侧栏自动加on
function righton(){
    var _nowpage = $('.crumbs .nowpage');
    var nolinkT = _nowpage.children('.nolink').text();

    var rightmenuT = $('.rightmenu ul li a');

    rightmenuT.each(function(){
        if($(this).text() == nolinkT){
            $(this).parent('li').addClass("on");
        }        
    })
}

// 带版自动加on
function banon(){
    var _nowpage = $('.crumbs .nowpage');
    var nolinkT = _nowpage.children('.nolink').text();

    var banmenuT = $('.edi .ver');

    banmenuT.each(function(){
        if($(this).children('a').text() == nolinkT){
            $(this).addClass("on");
        }        
    })
}

// 右侧帮助咨询
function righthelp(){
    // var top = $(document).scrollTop();
    // if( top > 300){
    //     $(".righthelp").fadeIn(200);
    // }
    // $(function(){
    //     $(".tabhelp").click(function(){
    //         if($(this).hasClass("off")){
    //             $(".righthelp").animate({right:"0px",height:"390px"});
    //             $(this).removeClass("off");
    //         }else{
    //             $(".righthelp").animate({right:"-240px",height:"200px"});
    //             $(this).addClass("off");
    //         }
            
    //     });
    // })
}

    $(function(){
        $(".tabhelp").click(function(){
            if($(this).hasClass("off")){
                $(".righthelp").animate({right:"0px",height:"390px"});
                $(this).removeClass("off");
            }else{
                $(".righthelp").animate({right:"-240px",height:"200px"});
                $(this).addClass("off");
            }
            
        });
    })