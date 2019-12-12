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

 <el-col  :span="4">        
         <div class="list2">
         <div class="imglist" v-for="(e ,index) in itemList">
                      <div class="item">
                          <div class="item-content"> 
                            <img  :src="e.path + '\\' +e.filename"   :data-text="e.text"  v-on:click='chooseImg(index,1)'  @mouseenter="chooseImg(index,0)"/>
                          </div>
                        </div> 
            </div>
           </div>    
</el-col>


          <el-col  :span="13">
          <!--cur -->
             <div class="curImg">
                     <img   :src="curImg.path + '\\' +curImg.filename"  :data-text="curImg.text"/>
              </div>
          <!--/cur -->
          </el-col>

          <el-col  :span="4">
          <el-button type="primary"@click="openHover">开启hover</el-button>
          <el-button type="primary"@click="test">滚动播放</el-button>
          <el-button type="primary"@click="test">{{switchName}}</el-button>
  
                <el-switch class="switchStyle" v-model="hover" active-color="#7958b5" active-text="开" 
                 inactive-color="#e8e4f3" inactive-text="关">
                </el-switch> 

           <div>  {{ curImg.text}}
              <el-input type="textarea" :rows="20" placeholder="请输入内容" v-model="curImg.text"> </el-input>
           </div>
           </el-col>



  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';  
import './css.css' /*引入公共样式*/

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
   export default {
    data() {
      return {
        hover:true,
        switchName: '12' ,
        activeClass :0,
        list : this.$store.state.folders,
        itemList:[],
        curImg: {},
        input: 'first',
        
      };
    },
      
    methods: {
      test(tab, event) {
      this.switchName="111111111111111"
      },
      openHover(tab, event) {
      this.hover = !this.hover ;
      },
        showName() {
      return this.switchName === '1' ? '开启' : '关闭'
    },
       
      folder(index){
       console.log()
       this.activeClass = index;
       this.itemList = this.list[index].items
       console.log( this.itemList)
      },

      chooseImg(index,kind){
       console.log()
       if(kind){
         this.curImg = this.itemList[index]
       } else{
         if(this.hover){
            this.curImg = this.itemList[index]
         }
       }


       console.log(this.itemList[index].text)
       console.log(index)
      },
      
    },
     mounted() {
      console.log("page1",this.globalData)
      //  this.list = this.list.concat(this.list)
      //  this.list = this.list.concat(this.list)
      //  this.list = this.list.concat(this.list)
        this.itemList = this.list[0].items
        console.log(this.itemList,)
       this.curImg = this.itemList[0]
     }
  };
</script>

 

<style lang="scss" scoped>
.path{
  width:50px;
     display: inline-block; overflow: hidden; text-overflow:ellipsis; white-space: nowrap;
}

.forder{ width: 100px;height: 70px;margin: 5px; border: #000 1px solid; border-radius: 5px;}
.imglist{ width: 100%;height: 70px;}
   img {
    max-width: 100%;
    max-height: 100%;
  }

 .switchStyle .el-switch__label {
  position: absolute;
  display: none;
  color: #fff;
}
.switchStyle .el-switch__label--left {
  z-index: 9;
  left: 6px;
}
.switchStyle .el-switch__label--right {
  z-index: 9;
  left: -14px;
}
.switchStyle .el-switch__label.is-active {
  display: block;
}
.switchStyle.el-switch .el-switch__core,
.el-switch .el-switch__label {
  width: 50px !important;
}


</style>
