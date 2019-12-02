const { remote, ipcRenderer } = window.require("electron");

const fs = require("fs");
const sizeOf = require("image-size");


ipcRenderer.on("selected-directory", function(event, path) {
  console.log(path);
  const name = path[0].slice(path[0].lastIndexOf("/") + 1);
  console.log(name);
});

function domo(){
     ///////////////////////////////////
 ipcRenderer.on("selected-directory", function(event, path) {
    console.log(path);
    const name = path[0].slice(path[0].lastIndexOf("/") + 1);
    $(".typeForlder").append('    <div class="type">' + name + "</div>");

    console.log(name);
    var items = UI.getFileList(name);
    for (e in items) {
      $(".itemList").append(
        '    <div class="item"><img  src="' +
          e.path +
          "/" +
          e.filename +
          '"/> </div>'
      );
    }
    // 遍历获取路径下的资源
    console.log(items);
    db.find({ objName: "folder" }, function(err, data) {
      console.log("查看全局文件夹");

      var forderValue = data[0].objValue;
      var firstTime = null;
      console.log(data[0], forderValue.hasOwnProperty(name));
      if (forderValue.hasOwnProperty(name)) {
        console.log("再次打开这个文件夹");
        firstTime = forderValue[name].firstTime;
        console.log(firstTime);
      }
      forderValue[name] = {
        firstTime: firstTime || Date.now(),
        lasrTime: Date.now(),
        items: items
      };
      console.log("新的值");
      forderValue = JSON.parse(JSON.stringify(forderValue)); // nedb 的bug 不能使用原对象需要 深拷贝
      console.log(forderValue);

      db.update(
        { objName: "folder" },
        { $set: { objValue: forderValue } },
        { multi: true },
        function(err, data) {
          console.log("更新的情况");
          console.log(data);
          db.find({ objName: "folder" }, function(err, data) {
            console.log(data[0]);
          });
        }
      );
      console.log(forderValue);
    });
  });
}
  //////////////////////////////////

  function readFileList(path, filesList) {
    var files = fs.readdirSync(path);
    console.log(files);
    files.forEach(function(itm, index) {
      var stat = fs.statSync(path + "/" + itm);
      if (stat.isDirectory()) {
        readFileList(path + "/" + itm + "/", filesList);
      } else {
        var obj = {}; //定义一个对象存放文件的路径和名字
        obj.path = path; //路径
        obj.filename = itm; //名字

        var suffix = itm.substr(itm.length - 4).toLowerCase();
        if (
          suffix === ".png" ||
          suffix === ".png" ||
          suffix === ".ico" ||
          suffix === ".jpg"
        ) {
          var dimensions = sizeOf(obj.path + "/" + obj.filename);

          obj.width = dimensions.width;
          obj.height = dimensions.height;
          obj.type = "img";
          filesList.push(obj);
        }
      }
    });
  }