<template>
<div>

<el-col  :span="2">
     <div class="forder">
                        <button> <i class="glyphicon glyphicon-folder-open"></i> FF</button><br>
                        <span class="path">D://PATH</span>
                     </div>
</el-col>

 <el-col  :span="18">
<!--ppt -->
           
<div class="scroll" @mouseenter="on_top_enter" @mouseleave="on_top_leave">
    <swiper :options="swiperOption" ref="mySwiper">
      <!-- slides -->
         <swiper-slide v-for="(e ,index) in list">
		        <img :src="e.src" alt="banner" v-on:click='chooseImg(index)' />
		    </swiper-slide>
       
      <!-- Optional controls -->
      <div class="swiper-pagination "  slot="pagination"></div>
      <div class="swiper-button-prev swiper-button-black" slot="button-prev"></div>
      <div class="swiper-button-next swiper-button-black" slot="button-next"></div>
      <!-- <div class="swiper-scrollbar"   slot="scrollbar"></div> -->
    </swiper> 

     </div>
          <!--/ppt -->
          </el-col>

          <el-col  :span="4">
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
import './css.css' /*引入公共样式*/
import './swiper.min.css' /*引入公共样式*/

import { swiper, swiperSlide } from 'vue-awesome-swiper'  

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
  export default {
     components: {  
      swiper,  
      swiperSlide  
  },  
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
        swiperOption: {  
          _this :this,
          autoplay: {
              autoplay: 1500,
              disableOnInteraction: false,//放置触摸后自动轮播停止
          },
          notNextTick: true,
          //循环
          loop:true,
          //设定初始化时slide的索引
          initialSlide:0,
          //自动播放 
          
          autoplay: {
              delay: 1000,
              stopOnLastSlide: false,
              disableOnInteraction: false, //放置触摸后自动轮播停止
          },
          autoplayDisableOnInteraction: false,
           mousewheelControl: true,
          // 设置轮播
          effect : 'flip',
          //滑动速度
          speed:800,
          //滑动方向
          direction : 'horizontal',
          //小手掌抓取滑动
          grabCursor : true,
          //滑动之后回调函数
          on: {
              slideChangeTransitionEnd:  ()=>{
                if( this.swiper){
                  this.curImg = this.list[ this.swiper.activeIndex]
                } 
              },
          },
          //左右点击
          navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
          },
          //分页器设置         
          pagination: {
              el: '.swiper-pagination',
              clickable :true
          }
        },
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
      //通过获得的swiper对象来暂停自动播放
            on_top_enter() { 
                this.swiper.autoplay.stop()
            },
            on_top_leave() { 
                this.swiper.autoplay.start()
            }
      
    },
    computed: {  
    swiper() {  
      return this.$refs.mySwiper.swiper;  
    }  ,
            myBotSwiper() {
                return this.$refs.myBotSwiper.swiper
            } 
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

   img{
        height: 100%;
        width: 100%;
    }
 
.swiper-slide{
  height:500px;
    overflow :auto;
     max-width: 100%;
    height: 500px;
}

 .overflow-auto{
    overflow :auto;
     max-width: 100%;
    height: 500px;
  }
</style>
