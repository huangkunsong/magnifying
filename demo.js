/* eslint-disable no-undef,no-extra-semi */
/**
 * Created by rookie on 2017/10/4.
 * All copyright belongs to rookie.
 */
;(function (){
    var Config = {
        imges : [
            "img/1.jpg",
            "img/2.jpg",
            "img/3.jpg",
            "img/4.jpg",
            "img/5.jpg",
            "img/6.jpg",
        ],
    };
    var build = {
        init : function (){
            var images = Config.imges;
            this.buildMainPic(images[0]);
            this.buildImages(images);
            this.imgsBindMouseover();
            
            $("#a").magnifying();
        },
        loadImage : function (path, callback){
            var img = new Image();
            img.src = path;
            img.onload = callback;
        },
        buildMainPic : function (path){
            this.loadImage(path, function (){
                var mainPic = $(".mainPic");
                //图片添加放大效果
                $(this).magnifying();
                mainPic.append(this);
            });
        },
        buildImages : function (images){
            var imgs = $(".imgs");
            for (var i = 0; i < images.length; i++){
                imgs.append(
                    "<li>" +
                        "<img src='" + images[i] + "' />" +
                    "</li>"
                );
            }
            imgs.children()[0].classList.add("current");
        },
        imgsBindMouseover : function (){
            $(".imgs li").on("mouseover", function (){
                $(".current").removeClass("current");
                this.classList.add("current");
                $(".mainPic img").attr("src", this.children[0].src);
            });
        },
        
    };
    
    build.init();
}());

