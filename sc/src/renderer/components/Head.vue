<template>
<div>
<el-row style="padding-right:10px">
 
 
  <el-col :span="23"> 
   
 
    <el-tabs style="height: 200px;" @tab-click="handleClick">
    <el-tab-pane label="文件夹风格">
      <Page1/>
    </el-tab-pane>
    <el-tab-pane label="瀑布流风格">
      <Page2/>
    </el-tab-pane>
    <el-tab-pane label="幻灯片风格"> 
    <Page3/>
    </el-tab-pane>
    <el-tab-pane label="管理界面"> 
    <Page4/>
    </el-tab-pane>
  </el-tabs>
 
 
  </el-col>

    <el-col :span="1">   <el-button @click="drawer = true" type="primary" style="margin-left: 16px;">
      <i class="el-icon-share"></i>
  </el-button>
 </el-col>

</el-row>



 <el-drawer title="提示模块" :visible.sync="drawer">
    <el-row :gutter="20">
        <el-col :span="12">  <el-button  @click="test">打开文件夹</el-button> </el-col> </BR>
    </el-row>
    <el-row :gutter="20">
        <el-input placeholder="请输入内容" v-model="input" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
    </el-row>
    
    
</el-drawer>


  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';  
import Page1 from '@/components/Page1';
import Page2 from '@/components/Page2';
import Page3 from '@/components/Page3';
import Page4 from '@/components/Page4';
import './css.css' /*引入公共样式*/

import db from "../../utils/db";
import globalData from "../globalData";
const { remote, ipcRenderer } = window.require("electron");

      const fs = require("fs");
      const sizeOf = require("image-size");

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
  export default {
    data() {
      return {
         drawer: false,
        activeName: 'first',
        input: 'first',
        list:[]
      };
    },
      components: {
      Page1,
      Page2,
      Page3,
      Page4,
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
        var all = JSON.parse(localStorage.getItem('all'));
        console.log("all")
        console.log(all)
        console.log(all,this.globalData)
        this.globalData.setData(all)
        console.log(all,this.globalData)
      },
      async test(tab, event) {
       ipcRenderer.send("open-file-dialog");
       
      },
      async test1( ) {
       
      },
    }
  };

  /////////////////////

ipcRenderer.on("selected-directory", async (event, path) => {
  console.log(path);
    const name = path[0].slice(path[0].lastIndexOf("/") + 1);
    var items = getFileList(name);
    console.log(items);
    var data = await db.find({ objName: "folder" })
    console.log(data);
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
      console.log(forderValue, this); 
      localStorage.setItem('all',JSON.stringify({ objName: "folder", objValue: forderValue}));
     data = await db.update(  { objName: "folder" },{ $set: { objValue: forderValue } },{ multi: true },)
    console.log(data);

})

  /////////////////
  function getFileList(path){
    var s=[]
   readFileList (path,s) 
   return s
  }
  

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
          suffix === ".gif" ||
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
.el-tab-pane{
  overflow:auto
}
.el-row{
  margin:10px
}
</style>
