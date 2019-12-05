<template>
<div>

<el-col  :span="2">
     <div class="forder">
                        <button> <i class="glyphicon glyphicon-folder-open"></i> FF</button><br>
                        <span class="path">D://PATH</span>
                     </div>
</el-col>

 <el-col  :span="18">
<!--flow -->
          <div class="overflow-auto">
          <div class="waterfall">

    <div class="item">
                <div class="item-content">
                  <img
                    src="https://picjumbo.com/wp-content/uploads/modern-laptop-and-watches_free_stock_photos_picjumbo_DSC05387-2210x1473.jpg"
                  />
                </div>
              </div>           

            <div v-for="(e ,index) in list">
                      <div class="item">
                          <div class="item-content">
                            <img :src="e.src"  :data-text="e.text"  v-on:click='chooseImg(index)' />
                          </div>
                        </div> 
            </div>

           </div>
          </div>
          <!--/flow -->
          </el-col>

          <el-col  :span="4">
           <el-button plain circle icon="custom-icon el-icon-refresh"></el-button>
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
        list :[
         {
           src:'https://picjumbo.com/wp-content/uploads/modern-laptop-and-watches_free_stock_photos_picjumbo_DSC05387-2210x1473.jpg',
           text:"1",
         },
         {
           src:'https://picjumbo.com/wp-content/uploads/modern-laptop-and-watches_free_stock_photos_picjumbo_DSC05387-2210x1473.jpg',
           text:"2",
         },
         {
           src:'https://picjumbo.com/wp-content/uploads/modern-laptop-and-watches_free_stock_photos_picjumbo_DSC05387-2210x1473.jpg',
           text:"3",
         },
         {
           src:'https://picjumbo.com/wp-content/uploads/modern-laptop-and-watches_free_stock_photos_picjumbo_DSC05387-2210x1473.jpg',
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
       this.list = this.list.concat(this.list)
       this.list = this.list.concat(this.list)
       this.list = this.list.concat(this.list)
       this.curImg = this.list[0]
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
