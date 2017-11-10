/* jshint esversion: 6 */



// 页面初始化
function init(spaceName) {
    localDB.createSpace(spaceName);
    if (!getData(spaceName)[0]) {
        setData(spaceName, [{ name: "IFE项目", value: [{ name: "task01", value: [] }] }]);
    }


    renderClassify(spaceName);
    addClass($(".classify-project")[0], "project-selected");
    addClass($(".classify-task")[0], "pro-selected");
    renderCount();
    renderTask();
    if ($(".task-item")[0]) {
        addClass($(".task-item")[0], "task-selected");
    }
    renderDetail();
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

// 删除分类
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

// 新增，编辑任务
function editTask(e) {

    // 检测是否为二级目录
    var currentEle = $(".pro-selected")[0];
    if (!hasClass(currentEle, "classify-task")) {
        console.warn("请选择二级目录");
        return false;
    }
    if (hasClass(e.target, "status-edit")) {
        $(".task-name")[1].value = $(".task-name")[0].innerText;
        $(".item-date")[1].value = $(".item-date")[0].innerText;
        $(".detail-value")[0].value = $(".detail-content")[0].innerText;
    }

    toggleDetail();
}

// 保存任务编辑
function saveTask() {
    var taskDetail = {
        title: $(".task-name")[1].value.trim(),
        date: $(".item-date")[1].value,
        particulars: $(".detail-value")[0].value,
        status: "ever"
    };
    if (!taskDetail.title || !taskDetail.date || !taskDetail.particulars.trim()) {
        console.log("请填写完整");
        return false;
    }

    var currentEle = $(".pro-selected")[0];
    var currentName = currentEle.innerText.split(" ")[0];
    var totalData = readData(currentName);
    var resData = totalData.resData;
    var parData = totalData.parData;
    var inx = parData.value.findIndex((item) => {
        return item.name === resData.name;
    });


    // 判断新加还是修改
    var isNew = resData.value.findIndex((item) => {
        return item.title === taskDetail.title;
    });
    if (isNew === -1) {
        resData.value.push(taskDetail);
        resData.value.sort((previous, current) => {
            return new Date(previous.date) < new Date(current.date);
        });
    } else {
        resData.value[isNew] = taskDetail;
    }
    parData.value.splice(inx, 1, resData);
    localDB.update("todo", parData.name, parData);

    renderTask();
    renderCount();

    addClass(toArray($(".task-item")).find((item) => {
        return item.innerText === taskDetail.title;
    }), "task-selected");

    renderDetail();
    toggleDetail();
}

// 渲染分类列表
function renderClassify(spaceName) {
    var categoryList = getData(spaceName);
    var str = "";
    str += '<div class="classify-menu">分类列表</div>';
    str += '<ul class="classify-projects">';
    for (var i = 0; i < categoryList.length; i++) {
        str += '<li>';
        str += '<div class="classify-project">' + categoryList[i].name + ' （<span>' + 0 + '</span>）';
        str += '<img class="del-icon" src="images/delete.png" alt="delete">';
        str += '</div>';
        str += '<ul class="classify-tasks">';
        if (categoryList[i].value[0]) {
            for (var j = 0; j < categoryList[i].value.length; j++) {
                str += '<li>';
                str += '<div class="classify-task">' + categoryList[i].value[j].name + ' （<span>' + 0 + '</span>）';
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
function renderTask() {
    var currentEle = $(".pro-selected")[0];
    var currentName = currentEle.innerText.split(" ")[0];
    var totalData = readData(currentName);
    var resData = totalData.resData;

    var taskList = !!resData ? resData.value : [];
    var str = "";
    var dateArr = [];
    var childEle;
    $(".task-dates")[0].innerHTML = "";
    for (var i = 0; i < taskList.length; i++) {
        var ind = dateArr.indexOf(taskList[i].date);
        if (ind === -1) {
            dateArr.push(taskList[i].date);
            str = "";
            str += '<li>';
            str += '<div class="task-date">' + taskList[i].date + '</div>';
            str += '<ul class="task-items">';
            str += '<li class="task-item item-ever">' + taskList[i].title + '</li>';
            str += '</ul>';
            str += '</li>';
            $(".task-dates")[0].innerHTML += str;
        } else {
            childEle = document.createElement("li");
            childEle.setAttribute("class", "task-item");
            childEle.innerText = taskList[i].title;
            $(".task-items")[ind].appendChild(childEle);
        }
    }
    // 给"已完成"添加Class
    var doneEle = taskList.filter((item) => {
        return item.status === "done";
    });
    for (let i = 0; i < doneEle.length; i++) {
        removeClass(toArray($(".task-item")).find((item) => {
            return item.innerText === doneEle[i].title;
        }), "item-ever");
        addClass(toArray($(".task-item")).find((item) => {
            return item.innerText === doneEle[i].title;
        }), "item-done");
    }

    if ($(".task-item")[0]) {
        addClass($(".task-item")[0], "task-selected");
    }
    renderDetail();
}

// 渲染详情域
function renderDetail() {
    var currentTask = $(".pro-selected")[0];
    var currentDetail = $(".task-selected")[0];
    var currentName = currentTask.innerText.split(" ")[0];
    var totalData = readData(currentName);
    var resData = totalData.resData;
    var parData = totalData.parData;
    var detailObj;

    if (!!resData) {
        detailObj = resData.value.find((item) => {
            return item.title === $(".task-selected")[0].innerText;
        });
    }
    if (detailObj) {
        $(".task-name")[0].innerText = detailObj.title;
        $(".item-date")[0].innerText = detailObj.date;
        $(".detail-content")[0].innerText = detailObj.particulars;
    } else {
        $(".task-name")[0].innerText = "";
        $(".item-date")[0].innerText = "";
        $(".detail-content")[0].innerText = "";
    }

    $(".task-name")[1].value = "";
    $(".item-date")[1].value = "";
    $(".detail-value")[0].value = "";
}

function renderCount() {
    var numThis;
    var allSum = 0;
    toArray($(".classify-project")).forEach((item) => {
        var countSum = 0;
        toArray(item.nextSibling.children).forEach((cur) => {
            numThis = toArray(readData(cur.firstChild.innerText.split(" ")[0]).resData.value)
                .filter((cur) => {
                    return cur.status === "ever";
                }).length;
            cur.firstChild.children[0].innerText = numThis;
            countSum += numThis;
        });
        item.children[0].innerText = countSum;
        numThis = 0;
    });
    toArray($(".classify-project")).forEach((item) => {
        allSum += +item.children[0].innerText;
    });
    $(".classify-sum")[0].children[0].innerText = allSum;
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
$.delegate($(".classify-list")[0], "div", "click", function(e) {
    tranClass(e);
    renderTask();
});

// 新增任务
$.click($(".new-task")[0], editTask);

// 保存任务编辑
$.click($(".status-edit")[0], editTask);
$.click($(".status-edit")[1], saveTask);
$.click($(".status-save")[0], function() {

    var currentEle = $(".pro-selected")[0];
    var currentName = $(".pro-selected")[0].innerText.split(" ")[0];
    var totalData = readData($(".pro-selected")[0].innerText.split(" ")[0]);
    var resData = totalData.resData;
    var parData = totalData.parData;
    var inx = parData.value.findIndex((item) => {
        return item.name === resData.name;
    });

    var isNew = resData.value.findIndex((item) => {
        return item.title === $(".task-name")[0].innerText || $(".task-name")[1].value;
    });
    resData.value[isNew].status = "done";
    parData.value.splice(inx, 1, resData);
    localDB.update("todo", parData.name, parData);

    renderTask();
    renderCount();
});

// 选择任务状态
$.delegate($(".task-ul")[0], "li", "click", function(e) {
    transferClass($(".task-ul")[0], "status-selected", e);
    var targetEle = e.target;
    if (hasClass(targetEle, "task-all")) {
        toArray($(".task-item")).forEach((item) => {
            item.style.display = "block";
            item.parentNode.previousSibling.style.display = "block";
        });
    } else if (hasClass(targetEle, "task-ever")) {
        toArray($(".task-item")).forEach((item) => {

            item.style.display = "block";
            item.parentNode.previousSibling.style.display = "block";
            toArray($(".item-done")).forEach((cur) => {
                cur.style.display = "none";
                var ind = toArray(cur.parentNode.children).findIndex((cur) => {
                    return cur.style.display === "block";
                });
                if (ind === -1) {
                    cur.parentNode.previousSibling.style.display = "none";
                }
            });
        });
    } else if (hasClass(targetEle, "task-done")) {
        toArray($(".task-item")).forEach((item) => {

            item.style.display = "block";
            item.parentNode.previousSibling.style.display = "block";
            toArray($(".item-ever")).forEach((cur) => {
                cur.style.display = "none";
                var ind = toArray(cur.parentNode.children).findIndex((cur) => {
                    return cur.style.display === "block";
                });
                if (ind === -1) {
                    cur.parentNode.previousSibling.style.display = "none";
                }
            });
        });
    }
});

// 选择任务日期
if (!!$(".task-dates")[0].children[0]) {
    $.delegate($(".task-dates")[0], "li", "click", function(e) {
        transferClass($(".task-dates")[0], "task-selected", e);
        renderDetail();
    });
}

// 编辑状态点击面板自动退出
$.click(document.body, function(e) {
    if (!hasClass(e.target, "new-task") && $(".detail-edit")[0].style.display === "block") {
        var ind = toArray(e.path).findIndex((item) => {
            return item.className && hasClass(item, "detail");
        });
        if (ind === -1) {
            toggleDetail();
        }
    }
});
