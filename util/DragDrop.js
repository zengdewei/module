/**
 * Created by Administrator on 2018/9/19.
 */
 var DragDrop = function(){

    var dragdrop = new EventTarget(),
        dragging = null,
        diffX = 0,
        diffY = 0;

    function handleEvent(event){

        //获取事件和目标
        event = EventUtil.getEvent(event);
        var target = EventUtil.getTarget(event);

        //确定事件类型
        switch(event.type){
            case "mousedown":
                if(target.className.indexOf("draggable") > -1){
                    dragging = target;
                    diffX = event.clientX - target.offsetLeft;
                    diffY = event.clientY - target.offsetTop;
                    dragdrop.fire({type:"dragstart", target: dragging,x: event.clientX, y: event.clientY})
                }
                break;
            case "mousemove":
                if(dragging !== null){

                    //指定位置
                    dragging.style.left = (event.clientX - diffX) + "px";
                    dragging.style.top = (event.clientY - diffY) + "px";

                    //触发自定义事件
                    dragdrop.fire({type:"drag", target: dragging, x: event.clientX, y: event.clientY});
                }
                break;

            case "mouseup":
                dragdrop.fire({type:"dragend", target: dragging, x: event.clientX, y: event.clientY});
                dragging = null;
                break;
        }
    }

    //公共接口
    dragdrop.enable = function(){
        EventUtil.addHandler(document, "mousedown", handleEvent);
        EventUtil.addHandler(document, "mousemove", handleEvent);
        EventUtil.addHandler(document, "mouseup", handleEvent);
    };

    dragdrop.disable = function(){
        EventUtil.removeHandler(document, "mousedown", handleEvent);
        EventUtil.removeHandler(document, "mousemove", handleEvent);
        EventUtil.removeHandler(document, "mouseup", handleEvent);
    };

    return dragdrop;
}();