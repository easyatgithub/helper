<template>
<div>
4


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
