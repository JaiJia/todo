/*jshint esversion: 6 */



// 异步文件上传组件 只支持单文件上传
/*
   obj: {
        url: "www.xxx.com",
        file: $(button),
        filename: "file",
        success: function(data) {
            ...
        }
    }
*/
function fileupload(obj) {
    if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
        req = new XMLHttpRequest();
    } else if (window.ActiveXObject) { // IE 6 and older
        req = new ActiveXObject("Microsoft.XMLHTTP");
    }
    var url = obj.url;
    var formdata = new FormData();
    formdata.append(obj.filename, this.file);
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (req.readyState === 4) {
            if (req.status === 200) {
                obj.success();
            }
        }
    };
    req.open("POST", obj.url);
    req.send(formdata);
}
