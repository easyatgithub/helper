<template>
<div>
<el-row style="padding-right:10px">
 
 
  <el-col :span="23"> 
   
 
    <el-tabs style="height: 200px;">
    <el-tab-pane label="文件夹风格">
      <Page3/>
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
const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
  export default {
    data() {
      return {
         drawer: false,
        activeName: 'first',
        input: 'first',
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
      },
      async test(tab, event) {
          const { remote } = window.require('electron')
       
       var db = remote.app.db
       db.find({n:1}, function (err, newDoc) {   // Callback is optional
         console.log(newDoc)
        });
      },
      async test1( ) {
       
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
