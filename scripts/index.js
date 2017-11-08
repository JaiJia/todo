/* jshint esversion: 6 */

// 页面初始化
function init(spaceName) {
    localDB.createSpace(spaceName);
    if (!getData(spaceName)[0]) {
        setData(spaceName, [{ name: "IFE项目", value: [] }]);
    }

    renderClassify(spaceName);
    addClass($(".classify-project")[0], "pro-selected project-selected");

    // 删除分类
    $.delegate($(".classify-projects")[0], "img", "click", deleteCategory);
}

// 读取深层数据
function readData(currentName) {
    var resData;
    var parData = getData("todo").find((item) => {
        resData = item.value.find((cur) => {
            return cur.name === currentName;
        });
        if (!!resData) {
            return true;
        }
    });
    return {
        resData: resData,
        parData: parData
    };
}


// 新增分类
function addCategory(categoryName) {
    var currentEle = $(".pro-selected")[0];
    var resData = {};

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
        resData = getData("todo").find((item) => {
            return item.name === currentName;
        });
        resData.value.push(strJson);
        localDB.update("todo", currentName, resData);
        renderClassify("todo");
        console.log("新建目录成功");
    }
}

function deleteCategory(e) {
    var isSure = window.confirm("Are you sure to delete this category?");
    if (isSure) {
        localDB.delete("todo", e.target.parentNode.innerText.split(" ")[0]);
        init("todo");
    }
}

// 切换display
function toggleDetail() {
    toggleShow($(".detail-show")[0]);
    toggleShow($(".detail-edit")[0]);
}

// 新增任务
function addTask(taskName) {
    toggleDetail();
}

// 保存任务编辑
function saveTask() {

    var taskDetail = {
        title: $(".task-name")[1].value,
        date: $(".item-date")[1].value,
        particulars: $(".detail-value")[0].value,
        status: "ever"
    };
    var currentEle = $(".pro-selected")[0];
    var currentName = currentEle.innerText.split(" ")[0];
    var totalData = readData(currentName);
    var resData = totalData.resData;
    var parData = totalData.parData;
    var ind = parData.value.findIndex((item) => {
        return item.name === resData.name;
    });
    resData.value.push(taskDetail);
    parData.value.splice(ind, 1, resData);
    localDB.update("todo", parData.name, parData);
    $(".task-name")[0].innerText = $(".task-name")[1].value;
    $(".task-date")[0].innerText = $(".task-date")[1].value;
    $(".detail-content")[0].innerText = $(".detail-value")[0].value;
    toggleDetail();
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

// 渲染任务列表
function renderTask(taskName) {}

// 渲染详情域
function renderDetail() {
    $(".task-name")[1].value = $(".task-name")[0].innerText;
    $(".item-date")[1].value = $(".item-date")[0].innerText;
    $(".detail-value")[0].value = $(".detail-content")[0].innerText;
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


// 执行初始化
init("todo");

// 新增分类
$.click($(".new-class")[0], function() {
    var categoryName = window.prompt("Please enter the name of the new category:");
    if (categoryName) {
        addCategory(categoryName);
        init("todo");
    }

});


// 选择分类
$.delegate($(".classify-list")[0], "div", "click", tranClass);

// 新增任务
$.click($(".new-task")[0], function(taskName) {
    addTask(taskName);
});

// 保存任务编辑
$.click($(".status-edit")[0], saveTask);
$.click($(".status-edit")[1], saveTask);

// 选择任务状态
$.delegate($(".task-ul")[0], "li", "click", function(e) {
    transferClass($(".task-ul")[0], "status-selected", e);
});

// 选择任务日期
$.delegate($(".task-dates")[0], "li", "click", function(e) {
    transferClass($(".task-dates")[0], "task-selected", e);
});
