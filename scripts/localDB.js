/* jshint esversion:6*/


// 从localstorage获取数据
function getData(str) {
    return JSON.parse(localStorage.getItem(str));
}

// 设置localstorage数据
function setData(spaceName, data) {
    return localStorage.setItem(spaceName, JSON.stringify(data));
}

window.localDB = (new(function() {
    //创建一个空间，参数为空间名
    this.createSpace = function(spaceName) {
        if (typeof spaceName !== "string") {
            console.error("空间名需要是字符串类型");
            return false;
        }

        //如果还没有数据库空间管理器，新建一个，否则检测空间管理器中是否已存在同名的空间
        if (!localStorage.getItem("localSpaceDB")) {
            var spaceObj = [];
            var spaceJson = JSON.stringify(spaceObj);
            localStorage.setItem("localSpaceDB", spaceJson);
            console.log("新建存储空间成功");
        }

        //取出所有空间名，空间名存在JSON中，所以需要转化成JS对象
        var spaceObj = JSON.parse(localStorage.getItem("localSpaceDB"));
        //检查对象是否存在空间名
        for (var i in spaceObj) {
            if (spaceObj[i].spaceName === spaceName) {
                console.warn("命名空间已存在");
                return false;
            }
        }
        //空间管理器localSpaceDB登记新空间
        var newObj = {
            spaceName: spaceName
        };
        spaceObj.push(newObj);
        var newSpaceJson = JSON.stringify(spaceObj);
        localStorage.setItem("localSpaceDB", newSpaceJson);

        //新建一个变量名为spaceName的值的空间
        var dataObj = [];
        var dataJson = JSON.stringify(dataObj);
        localStorage.setItem(spaceName, dataJson);
        console.log("新建命名空间成功");
        return true;
    };

    //插入数据，参数分别为空间名、插入的对象（不单纯用值来表示，用对象来表示数据）
    this.insert = function(spaceName, data) {
        var allData = localStorage.getItem(spaceName);
        if (allData) {
            var dataObj = JSON.parse(allData);
            dataObj.push(data);
            localStorage.setItem(spaceName, JSON.stringify(dataObj));
            console.log("已插入数据");
            console.dir(dataObj);
        } else {
            console.error("命名空间不存在");
            return false;
        }
    };
    this.update = function(spaceName, categoryName, newData) {
        if (!newData) { return false; }
        var allData = getData(spaceName);
        allData[allData.findIndex((item) => {
            return item.name === categoryName;
        })] = newData;
        setData(spaceName, allData);
        return false;
    };
})());
