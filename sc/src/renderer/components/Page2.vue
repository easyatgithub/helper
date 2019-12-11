<template>
<div>


 <el-col  :span="2" class="list">
<div class="list">
          <div  :class="activeClass == index ? 'active':''"  v-for="(e ,index) in list" v-on:click='folder(index)'>
                <i class="custom-icon el-icon-folder-checked"></i>
                <span class="path" title="e.src"> {{e.forderName}} </span> 
            </div>  
              </div>              
</el-col>


 <el-col  :span="18">
<!--flow -->
 

  </el-popover>
          <div class="overflow-auto">
          <div class="waterfall">

            <div v-for="(e ,index) in itemList">
                      <div class="item">
                          <div class="item-content">
                            <img :src="e.path + '\\' +e.filename"  :data-text="e.filename"  v-on:click='chooseImg(index)' />
                          </div>
                        </div> 
            </div>

           </div>
          </div>
          <viewer :images="fullScreenImgs" style="height: 300px;"  v-if="isFullScreen">
             <img v-for="item in fullScreenImgs"  :src="item.path + '\\' +item.filename"   :key="item.index" height="100">
          </viewer> 

          <!--/flow -->
          </el-col>

          <el-col  :span="4">
           <el-button plain circle icon="custom-icon el-icon-refresh" v-on:click='test()'></el-button>
           <div> 
              {{ curImg.text}}
              <el-input
  type="textarea"
  :rows="20"
  placeholder="请输入内容"
  v-model="curImg.text">
</el-input>
           </div>
           </el-col>

  </div>

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
        data :this.$store.state,
        activeClass :0,
        list : this.$store.state.folders,
        itemList:[],
        isFullScreen:false,
        fullScreenImgs:[],
        input: 'first',
        curImg: {},
      };
    },
      
    methods: {
      test(tab, event) {
      console.log()
      console.log(this.data,)
       
        
      },
      chooseImg(index){
       console.log(this.itemList)
       this.curImg = this.itemList[index]
       console.log(this.itemList[index].text)
       console.log(index)
       this.isFullScreen = true;
        // this.fullScreenImgs =this.itemList
       this.fullScreenImgs = this.itemList.slice(index,this.itemList.length).concat(this.itemList.slice(0,index))


      },
      folder(index){
       console.log(index)
       this.activeClass = index;
       this.itemList = this.list[index].items
       console.log( this.itemList)
        this.isFullScreen = false;
      },

      
    },
     mounted() {
       
       console.log("page2") 
    console.log(this.list,)
        
       this.itemList = this.list[0].items
           console.log(this.itemList,)
     }
  };
</script>
<style lang="scss" scoped>
  .waterfall {
    column-count: 4;
    column-gap: 0;
  }
  .item {
    break-inside: avoid;
    padding: 10px;
  }

  .item-content {
    /* padding: 10px; */
    font-size: 20px;
    text-align: center;
    color: #686868;
    border: 1px solid #ccc;
  }
  img {
    max-width: 100%;
    max-height: 100%;
  }
  .overflow-auto{
    overflow :auto;
     max-width: 100%;
    height: 500px;
  }
</style>
