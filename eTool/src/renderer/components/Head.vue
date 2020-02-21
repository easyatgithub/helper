<template>
  <div>
    <el-row style="padding-right:10px">
      <el-col :span="23">
        <el-tabs
          style="height: 200px;"
          @tab-click="handleClick"
        >
          <el-tab-pane label="首页">
            <Page222 />
          </el-tab-pane>

          <el-tab-pane label="今日推荐">
            <Page221 />
          </el-tab-pane>
          <el-tab-pane label="管理">
            <Page223 />
          </el-tab-pane>
        </el-tabs>
      </el-col>

      <el-col :span="1">
        <el-button
          @click="drawer = true"
          type="primary"
          style="margin-left: 16px;"
        >
          <i class="el-icon-share"></i>
        </el-button>
      </el-col>
    </el-row>

    <el-drawer
      title="关于"
      :visible.sync="drawer"
    >
      <div class="rightArea">
        <el-row :gutter="10">简单开发</el-row>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import axios from "axios"
import moment from "moment"
import Page1 from "@/components/Page1"
import Page2 from "@/components/Page2"
import Page3 from "@/components/Page3"
import Page4 from "@/components/Page4"

import Page221 from "@/components/Page221"
import Page222 from "@/components/Page222"
import Page223 from "@/components/Page223"
import "./css.css" /*引入公共样式*/

import globalData from "../globalData"
const { remote, ipcRenderer } = window.require("electron")

const fs = require("fs")
const sizeOf = require("image-size")

const DATE_FORMAT = "YYYY-MM-DD HH:mm:ss"
export default {
  data() {
    return {
      drawer: false,
      activeName: "first",
      input: "",
      activeClass: 0,
      list: [
        { src: "111", name: "111" },
        { src: "1112222", name: "222" },
        { src: "11122233333", name: "333" }
      ]
    }
  },
  components: {
    Page1,
    Page2,
    Page3,
    Page4,
    Page221,
    Page222,
    Page223
  },
  methods: {
    // tab 切换的的时候会从全局数据里面更新文件夹
    handleClick(tab, event) {
      console.log(tab, event)
      var all = JSON.parse(localStorage.getItem("all"))
      console.log("all")
      console.log(all)
      this.COMMON.data = all
    },
    async test(tab, event) {
      ipcRenderer.send("open-file-dialog")
    },
    choose(index) {
      console.log("choose()", index)
      this.activeClass = index
    },
    async test1() {}
  }
}

/////////////////////

ipcRenderer.on("selected-directory", async (event, path) => {
  const name = path[0].slice(path[0].lastIndexOf("/") + 1)
  var items = getFileList(name)
  var data = await db.find({ objName: "folder" })
  var forderValue = data[0].objValue
  var firstTime = Date.now()
  //
  console.log(data[0]._id, forderValue.hasOwnProperty(name))
  if (forderValue.hasOwnProperty(name)) {
    console.log("再次打开这个文件夹")
    firstTime = forderValue[name].firstTime
  }
  // for forder update items
  forderValue[name] = {
    firstTime: firstTime,
    lasrTime: Date.now(),
    items: items
  }
  console.log("新的值")
  forderValue = JSON.parse(JSON.stringify(forderValue)) // nedb 的bug 不能使用原对象需要 深拷贝
  localStorage.setItem(
    "all",
    JSON.stringify({ objName: "folder", objValue: forderValue })
  )
  data = await db.update(
    { _id: data[0]._id },
    { $set: { objValue: forderValue } },
    { multi: false }
  )
})

/////////////////
function getFileList(path) {
  var s = []
  readFileList(path, s)
  return s
}

function readFileList(path, filesList) {
  var files = fs.readdirSync(path)
  files.forEach(function(itm, index) {
    var stat = fs.statSync(path + "/" + itm)
    if (stat.isDirectory()) {
      readFileList(path + "/" + itm + "/", filesList)
    } else {
      var obj = {} //定义一个对象存放文件的路径和名字
      obj.path = path //路径
      obj.filename = itm //名字

      var suffix = itm.substr(itm.length - 4).toLowerCase()
      if (
        suffix === ".png" ||
        suffix === ".png" ||
        suffix === ".ico" ||
        suffix === ".gif" ||
        suffix === ".jpg"
      ) {
        var dimensions = sizeOf(obj.path + "/" + obj.filename)
        obj.width = dimensions.width
        obj.height = dimensions.height
        obj.type = "img"
        filesList.push(obj)
      }
    }
  })
}
</script>

 

<style lang="scss" scoped>
.function-row {
  margin: 14px 0;
  .el-input {
    width: 95%;
  }
  .el-select {
    width: 95%;
  }
}

.info-row {
  margin: 2px 0;
}

.el-button {
  width: 100%;
}

.el-alert {
  margin: 16px 0;
}

.el-row {
  margin: 10px;
}
</style>
