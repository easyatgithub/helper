<template>
<div>
4

  <el-button
            type="primary"
            @click="test"
          >test</el-button>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment'; 
 
import './css.css' /*引入公共样式*/

import db from "../../utils/db";
const { remote, ipcRenderer } = window.require("electron");
ipcRenderer.on("broadcasting", function(event,arg) {
  console.log(this);
  console.log(arg);
   // event.sender.send("broadcasting", arg);  //  死循环
});

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
  export default {
    data() {
      return {
        
        input: 'first',
      };
    },
      
    methods: {
     async test(tab, event) { 
         this.COMMON.httpUrl = this.COMMON.httpUrl+"ok"
         ipcRenderer.send("broadcasting",{s: this.COMMON.httpUrl})


      },
      
      async insert(){
        var s = await db.insert({s:'123'})
        console.log(s)
      },
      async find(){
        var s = await db.find({ number: { $gt: 12 } });
        console.log(s)
      },
      async update(){
        var s = await db.insert({s:'123'})
        console.log(s)
      },
      async remove(){
        var s = await db.remove({s:'123'})
        console.log(s)
      },
    
       handleClick(tab, event) {
        console.log(tab, event);
      },
    }
  };
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
</style>
