/*jshint esversion: 6 */


// 判断arr是否为一个数组，返回一个bool值
function isArray(arr) {
    if (Array.isArray) {
        return Array.isArray(arr);
    } else {
        Array.isArray = function(arg) {
            return Object.prototype.toString.call(arg) === '[object Array]';
        };
        return Array.isArray(arr);
    }
}

// 类数组转换数组
function toArray(arg) {
    return Array.prototype.slice.call(arg);
}

// 判断fn是否为一个函数，返回一个bool值
function isFunction(fn) {
    return Object.prototype.toString.call(fn) === '[object Function]';
}

// 使用递归来实现一个深度克隆，可以复制一个目标对象，返回一个完整拷贝
// 被复制的对象类型会被限制为数字、字符串、布尔、日期、数组、Object对象。不会包含函数、正则对象等
function deepClone(obj) {
    if (typeof obj !== "object" && typeof obj !== 'function') {
        return obj; //原始类型直接返回
    }
    var o = isArray(obj) ? [] : {};
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            o[i] = typeof obj[i] === "object" ? deepClone(obj[i]) : obj[i];
        }
    }
    return o;
}

// 对数组进行去重操作，只考虑数组中元素为数字或字符串，返回一个去重后的数组
function uniqArray(arr) {
    if (new Set()) {
        return [...new Set(arr)];
    } else {
        var res = [];
        for (var i = 0; i < arr.length; i++) {
            if (res.indexOf(arr[i]) == -1) {
                res[res.length] = arr[i];
            }
        }
        return res;
    }
}

// 对字符串头尾进行空格字符的去除、包括全角半角空格、Tab等，返回一个字符串
// 尝试使用一行简洁的正则表达式完成该题目
function trim(str) {
    return str.replace(/\s+/g, "");
}

// 实现一个遍历数组的方法，针对数组中每一个元素执行fn函数，并将数组索引和元素作为参数传递
function each(arr, fn) {
    arr.forEach(fn);
}

// 获取一个对象里面第一层元素的数量，返回一个整数
function getObjectLength(obj) {
    var n = 0;
    for (var i in obj) {
        n++;
    }
    return n;
}
// 邮箱验证
function isEmail(str) {
    var reg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
    return reg.test(str);
}

// 为element增加一个样式名为newClassName的新样式
function addClass(element, newClassName) {
    if (!element.className) {
        element.className = newClassName;
    } else {
        element.className += newClassName;
    }
    return true;
}

// 移除element中的样式oldClassName
function removeClass(element, oldClassName) {
    var str = element.className,
        arr = str.split(" "),
        index = arr.indexOf(oldClassName);
    if (index === -1) {
        console.warn(element + "中没有Class" + oldClassName);
        return false;
    } else {
        arr.splice(index, 1);
        element.className = arr.join(" ");
        return true;
    }
}

// 判断siblingNode和element是否为同一个父元素下的同一级的元素，返回bool值
function isSiblingNode(element, siblingNode) {
    var arr = element.parentNode.childNodes;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === siblingNode) {
            return true;
        }
    }
    return false;
}

// 获取element相对于浏览器窗口的位置，返回一个对象{x, y}
function getPosition(element) {
    var actualLeft = element.offsetLeft;
    var actualTop = element.offsetTop;
    var current = element.offsetParent;

    while (current !== null) {
        actualLeft += current.offsetLeft;
        actualTop += current.offsetTop;
        current = current.offsetParent;
    }
    return {
        X: actualLeft,
        Y: actualTop
    };
}

// 实现一个mini $，它和之前的$是不兼容的
function $(selector) {
    if (!selector) { return null; }
    selector = selector.trim();
    var arr = selector.split(" ");
    var len = arr.length;
    var i;
    item = arguments[1] || document;
    if (len > 1) {
        for (i = 0; i < $(arr[i]).length; i++) {
            // 递归解析 ".fir #sec thi []"
            return ($(arr.slice(1).toString(), $(arr[0])[i]));
        }
    } else {
        switch (selector[0]) {
            case ".":
                {
                    return item.getElementsByClassName(selector.slice(1));
                }
            case "#":
                {
                    return item.getElementById(selector.slice(1));
                }
            case "[":
                {
                    if (/^\[[A-Za-z0-9_-\S]+\]$/.test(selector)) {
                        selector = selector.slice(1, selector.length - 1);
                        selector = selector.split("=");
                        var eles = item.getElementsByTagName("*");
                        var att = selector[0];
                        var val = selector[1];
                        if (val) {
                            for (i = 0; i < eles.length; i++) {
                                if (eles[i].getAttribute(att) === val) {
                                    return eles[i];
                                }
                            }
                        } else {
                            for (i = 0; i < eles.length; i++) {
                                if (eles[i].getAttribute(att)) {
                                    return eles[i];
                                }
                            }
                        }
                    }
                    break;
                }
            default:
                {
                    return item.getElementsByTagName(selector);
                }
        }
    }
}

// 封装事件函数
$.on = function addEvent(selector, event, listener) {
    selector.addEventListener(event, listener);
};
$.un = function removeEvent(selector, event, listener) {
    selector.removeEventListener(event, listener);
};
$.click = function addClickEvent(selector, listener) {
    selector.addEventListener("click", listener);
};
$.enter = function addEnterEvent(selector, listener) {
    selector.addEventListener((e) => {
        if (e.keyword === 13) {
            listener.call(item, e);
        }
    });
};

// 事件代理
$.delegate = function(selector, tag, event, listener) {
    selector.addEventListener(event, function(event) {
        if (event.target.nodeName.toLowerCase() === tag.toLowerCase()) {
            listener.call(tag, event);
        }
    });
};
