<template>
<div>
 


 <el-col  :span="2">
     <div class="forder">
                        <button> <i class="glyphicon glyphicon-folder-open"></i> FF</button><br>
                        <span class="path">D://PATH</span>
                     </div>
</el-col>
 <el-col  :span="4">
        
        <div class="list2">
       <div class="imglist" v-for="(e ,index) in list">
                      <div class="item">
                          <div class="item-content">
                            <img :src="e.src"  :data-text="e.text"  v-on:click='chooseImg(index)' />
                          </div>
                        </div> 
            </div>
           </div>    
</el-col>

 <el-col  :span="13">
<!--cur -->
            <div class="curImg">
                     <img :src="curImg.src"  :data-text="curImg.text"/>
              </div>
          <!--/cur -->
          </el-col>

          <el-col  :span="4">
          <el-button
            type="primary"
            @click="test"
          >test</el-button>

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
</template>

<script>
import axios from 'axios';
import moment from 'moment';  
import './css.css' /*引入公共样式*/

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
   export default {
    data() {
      return {
        list :[
         {
           src:'https://picjumbo.com/wp-content/uploads/modern-laptop-and-watches_free_stock_photos_picjumbo_DSC05387-2210x1473.jpg',
           text:"1",
         },
         {
           src:'https://picjumbo.com/wp-content/uploads/lago-di-braies-morning-2210x1473.jpg',
           text:"2",
         },
         {
           src:'https://picjumbo.com/wp-content/uploads/modern-laptop-and-watches_free_stock_photos_picjumbo_DSC05387-2210x1473.jpg',
           text:"3",
         },
         {
           src:'https://picjumbo.com/wp-content/uploads/lago-di-braies-morning-2210x1473.jpg',
           text:"124",
         },
        ],
        input: 'first',
        curImg: {},
      };
    },
      
    methods: {
      test(tab, event) {
      
      },
      chooseImg(index){
       console.log()
       this.curImg = this.list[index]
       console.log(this.list[index].text)
       console.log(index)
      },
      
    },
     mounted() {
       console.log("page1",this.globalData)
       this.list = this.list.concat(this.list)
       this.list = this.list.concat(this.list)
       this.list = this.list.concat(this.list)
       this.curImg = this.list[0]
     }
  };
</script>

 

<style lang="scss" scoped>
.list2{
    overflow :auto;
     max-width: 100%;
    height: 500px;
}
.forder{ width: 100px;height: 70px;margin: 5px; border: #000 1px solid; border-radius: 5px;}
.imglist{ width: 100%;height: 70px;}
   img {
    max-width: 100%;
    max-height: 100%;
  }
</style>
