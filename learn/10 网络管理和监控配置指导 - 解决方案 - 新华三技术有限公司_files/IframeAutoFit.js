 
    function iframeAutoFit()
    {
        try
        {
            if(window!=parent)
            {	
				
				var a = parent.document.getElementsByTagName("IFRAME");
                for(var i=0; i<a.length; i++) //author:meizz
                {
                    if(a[i].contentWindow==window)
                    {
                        var h1=0, h2=0;
                        a[i].parentNode.style.height = a[i].offsetHeight +"px";
                        a[i].style.height = "10px";
                        if(document.documentElement&&document.documentElement.scrollHeight)
                        {
                            h1=document.documentElement.scrollHeight;
                        }
                        if(document.body) h2=document.body.scrollHeight;

                        var h=Math.max(h1, h2);
                        if(document.all) {h += 4;}
                        if(window.opera) {h += 1;}
                        a[i].style.height = a[i].parentNode.style.height = h+10 +"px";
                    }
                }
				if(arr=document.cookie.match(/scrollTop=([^;]+)(;|$)/))
				{
					document.body.scrollTop=parseInt(arr[1],10); 
                }
            }
        }
        catch (ex){}
    }
    if(window.attachEvent)
    {
        window.attachEvent("onload",  iframeAutoFit);
        //window.attachEvent("onresize",  iframeAutoFit);
    }
    else if(window.addEventListener)
    {
        window.addEventListener('load',  iframeAutoFit,  false);
        //window.addEventListener('resize',  iframeAutoFit,  false);
    }
 
