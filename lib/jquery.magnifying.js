/* eslint-disable no-undef */
(function ($){
    var Utils = {
        /**
         * 获取鼠标坐标
         * @param e
         * @returns {{clientX: *, clientY: *}}
         */
        getMouseLocation : function (e){
            e = this.getEvent(e);
            var clientX;
            var clientY;
            var body = document.body;
            if (e.pageX || e.pageY){
                clientX = e.pageX;
                clientY = e.pageY;
            } else {
                clientX = e.clientX + body.scrollLeft - body.clientLeft;
                clientY = e.clientY + body.scrollTop - body.clientLeft;
            }
            return {
                clientX : clientX,
                clientY : clientY,
            };
        },
        
        /**
         * 获取元素坐标
         * @param ele
         * @returns {{offsetLeft: (*|Number|number), offsetTop: (*|Number|number)}}
         */
        getEleLocation : function (ele){
            if (this.validator.isHtmlEle(ele)){
                var offsetLeft = ele.offsetLeft;
                var offsetTop = ele.offsetTop;
            
                while (ele.offsetParent){
                    ele = ele.offsetParent;
                    offsetLeft += ele.offsetLeft;
                    offsetTop += ele.offsetTop;
                }
                return {
                    offsetLeft : offsetLeft,
                    offsetTop : offsetTop,
                };
            }
            throw Error(ele + "不是HTML元素");
        },
        
        /**
         * 获取当前事件对象
         * @param e
         * @returns {*|Event}
         */
        getEvent : function (e){
            return e || window.event;
        },
        
        /**
         * 构建鼠标悬浮图片上的正方形
         * @returns {*}
         */
        buildSquare : function (){
            var ele = $("<div />").css({
                display : "none",
                backgroundImage : "url('img/square.png')",
                cursor : "move",
                position : "absolute",
                width : squareSize,
                height : squareSize,
            });
            $("body").append(ele);
            return ele;
        },
        
        /**
         * 构建图片同等大小的遮罩层
         * @returns {*}
         */
        buildShade : function (){
            var ele = $("<div/>").css({
                position : "absolute",
                backgroundColor : "transparent",
                cursor : "move",
            });
            $("body").append(ele);
            return ele;
        },
        
        buildMagnifying : function (){
            var img = $("<img id='a'/>").css({
                position : "relative",
            });
            var ele = $("<div/>").css({
                position : "absolute",
                overflow : "hidden",
                display : "none",
                width : 400,
                height : 400,
                border : "1px solid rgb(206, 202, 202)",
            }).append(img);
            $("body").append(ele);
            return ele;
        },
        
        /**
         * 校验器
         */
        validator : {
            isHtmlEle : function (ele){
                return ele && ele instanceof HTMLElement;
            },
        },
        
        /**
         * 计算悬浮放大区坐标
         * @param mouseLocation
         * @param shade
         * @param shadeLocation
         * @returns {{top: number, left: number}}
         */
        calSquareLocation : function (mouseLocation, shade, shadeLocation){
            var top = mouseLocation.clientY - squareSize / 2,
                left = mouseLocation.clientX - squareSize / 2,
                body = document.body,
                shadeWidth = shade.offsetWidth,
                shadeHeight = shade.offsetWidth;
            if (!shadeLocation){
                shadeLocation = this.getEleLocation(shade);
            }
            
            //超过左边
            if (left < shadeLocation.offsetLeft){
                left = shadeLocation.offsetLeft;
                //超过右边
            } else if (left > shadeLocation.offsetLeft + shadeWidth - squareSize){
                left = shadeLocation.offsetLeft + shadeWidth - squareSize;
            }
            
            //超过顶部
            if (top < shadeLocation.offsetTop){
                top = shadeLocation.offsetTop;
                //超过底部
            } else if (top > shadeLocation.offsetTop + shadeHeight - squareSize){
                top = shadeLocation.offsetTop + shadeHeight - squareSize;
            }
            return {
                top : top + body.clientLeft,
                left : left + body.clientTop,
            };
        },
        
        calMagnifyingImgLocation : function (squareLocation){
            var h = squareLocation.top - imageLocation.offsetTop,
                w = squareLocation.left - imageLocation.offsetLeft;
            return {
                top : -h * currentImage.offsetWidth / squareSize,
                left : -w * currentImage.offsetHeight / squareSize
            };
        },
        
        setShadeLocation : function (){
            shade.css({
                width : currentImage.width,
                height : currentImage.height,
                top : imageLocation.offsetTop,
                left : imageLocation.offsetLeft,
            }).show();
        },
        
        setMagnifying : function (){
            var width = currentImage.clientWidth,
                height = currentImage.clientHeight;
            magnifying.css({
                width : width,
                height : height,
                top : imageLocation.offsetTop,
                left : imageLocation.offsetLeft + width + 20,
            }).show();
            magnifyingImg.attr("src", currentImage.src);
            magnifyingImg.css({
                width : width * width / squareSize,
                height : height * height / squareSize
            });
        },
    };
    var squareSize = 100,
        magnifying = Utils.buildMagnifying(),
        magnifyingImg = magnifying.children(),
        square = Utils.buildSquare(),
        shade = Utils.buildShade(),
        currentImage,
        imageLocation;
    
    shade.on("mousemove", function (e){
        Utils.setShadeLocation();
        Utils.setMagnifying();
        var mouseLocation = Utils.getMouseLocation(e);
        var squareLocation = Utils.calSquareLocation(mouseLocation, this);
    
        square.css({
            top : squareLocation.top,
            left : squareLocation.left,
        }).show();
        
        var magnImgLocation = Utils.calMagnifyingImgLocation(squareLocation);
        
        magnifyingImg.css({
            top : magnImgLocation.top,
            left : magnImgLocation.left
        });
    });
    
    shade.on("mouseout", function (){
        square.hide();
        magnifying.hide();
    });
    
    $.fn.magnifying = function (){
        this.on("mouseover", function (){
            currentImage = this;
            imageLocation = Utils.getEleLocation(currentImage);
            shade.mousemove();
        });
    };
})(jQuery);

