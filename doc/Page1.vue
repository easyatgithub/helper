<template>
<div>
 <div class="forder">
                        <button> <i class="glyphicon glyphicon-folder-open"></i> FF</button><br>
                        <span class="path">D://PATH</span>
                     </div>
                     <div class="forder">
                        <button> <i class="glyphicon glyphicon-folder-open"></i> FF</button><br>
                        <span class="path">D://PATH</span>
                     </div>
<el-button
            type="primary"
            @click="test"
          >test</el-button>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment'; 
import { initTable } from '../../utils/nedb'
import './css.css' /*引入公共样式*/

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
  export default {
    data() {
      return {
        
        input: 'first',
      };
    },
      
    methods: {
      test(tab, event) {
        console.log(tab, event);
        const { remote } = window.require('electron')
       
       var db = remote.app.db
       db.find({objName:'folder'}, function (err, data) {   // Callback is optional
         console.log(data[0])
         var tmp = {bobi:1}
          
          db.update(
            { objName: "folder" },
            { $set: { objValue: tmp } },
            { multi: true },
            function(err, data) {
              console.log("更新的情况");
              console.log(data);
              db.find({ objName: "folder" }, function(err, data) {
                console.log(data[0]);
              });
            }
          ); 

        });
      },
      
    }
  };
</script>

 

<style lang="scss" scoped>
.forder{ width: 100px;height: 70px;margin: 5px; border: #000 1px solid; border-radius: 5px;}

 
</style>
