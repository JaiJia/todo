/* jshint esversion: 6 */

// 页面初始化
function init(spaceName) {
    localDB.createSpace(spaceName);
    if (!getData(spaceName)[0]) {
        setData(spaceName, [{ name: "IFE项目", value: [] }]);
    }

    renderClassify(spaceName);
    addClass($(".classify-project")[0], "pro-selected project-selected");
}


// 新增分类
function addCategory() {
    var currentEle = $(".pro-selected")[0];
    var newData = {};
    var categoryName = window.prompt("Please enter the name of the new category:");

    var strJson = {
        name: categoryName,
        value: []
    };

    if (hasClass(currentEle, "classify-menu")) {
        localDB.insert("todo", strJson);
        renderClassify("todo");
        console.log("新建目录成功");
    } else if (hasClass(currentEle, "classify-project")) {
        var currentName = currentEle.innerText.split(" ")[0];
        newData = getData("todo").find((item) => {
            return item.name === currentName;
        });
        newData.value.push(strJson);
        localDB.update("todo", currentName, newData);
        renderClassify("todo");
        console.log("新建目录成功");
    }
}

// 渲染分类列表
function renderClassify(categoryName) {
    var dataList = getData(categoryName);
    var str = "";
    str += '<div class="classify-menu">分类列表</div>';
    str += '<ul class="classify-projects">';
    for (var i = 0; i < dataList.length; i++) {
        str += '<li>';
        str += '<div class="classify-project">' + dataList[i].name + ' （<span>' + 0 + '</span>）';
        str += '<img class="del-icon" src="images/delete.png" alt="delete">';
        str += '</div>';
        str += '<ul class="classify-tasks">';
        if (dataList[i].value[0]) {
            for (var j = 0; j < dataList[i].value.length; j++) {
                str += '<li>';
                str += '<div class="classify-task">' + dataList[i].value[j].name + ' （<span>' + 0 + '</span>）';
                str += '<img class="del-icon" src="images/delete.png" alt="delete">';
                str += '</div>';
                str += '</li>';
            }
        }
        str += '</ul>';
        str += '</li>';
    }
    str += '</ul>';
    $(".classify-list")[0].innerHTML = str;
}

// 点击切换样式
function tranClass(e) {
    enumChildNodes($(".classify-list")[0]).forEach((item) => {
        removeClass(item, "pro-selected");
        if (hasClass(e.target, "classify-project")) {
            removeClass(item, "project-selected");
        }
    });
    addClass(e.target, "pro-selected");
    if (hasClass(e.target, "classify-project")) {
        addClass(e.target, "project-selected");
    }
    return null;
}

function transferClass(parentEle, className, e) {
    enumChildNodes(parentEle).forEach((item) => {
        removeClass(item, className);
    });
    addClass(e.target, className);
    return null;
}

// 执行初始化
init("todo");

$.click($(".new-class")[0], addCategory);
$.delegate($(".classify-list")[0], "div", "click", tranClass);
