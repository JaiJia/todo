// 页面初始化
function init(spaceName) {
    var totalData = getData(spaceName);
    if (!totalData) {
        localDB.createSpace(spaceName);
    } else {

    }
}

// 从localstorage获取数据
function getData(str) {
    return JSON.parse(localStorage.getItem(str));
}

// 设置localstorage数据
function setData(spaceName, data) {
    return localStorage.setItem(spaceName, JSON.stringify(data));
}

// 新增分类
function addCategory() {
    var categoryName = window.prompt("Please enter the name of the new category:");
    localStorage.setItem("todo", categoryName);
}

// 执行初始化
init("todo");
