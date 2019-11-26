<template>
<div>
 <div class="pptView">
                        <div class="swiper-container gallery-top">
                          <div class="swiper-wrapper">
                            <div class="swiper-slide" style="background-image:url(https://iph.href.lu/679x600)"></div> 
                            <div class="swiper-slide" style="background-image:url(https://iph.href.lu/179x600)"></div> 
                            <div class="swiper-slide" style="background-image:url(https://iph.href.lu/279x200)"></div> 
                          </div> 
                          <div class="swiper-button-next swiper-button-white"></div>
                          <div class="swiper-button-prev swiper-button-white"></div>
                        </div>
                        <div class="swiper-container gallery-thumbs">
                          <div class="swiper-wrapper">
                            <div class="swiper-slide" style="background-image:url(https://iph.href.lu/679x600)"></div> 
                            <div class="swiper-slide" style="background-image:url(https://iph.href.lu/179x600)"></div> 
                            <div class="swiper-slide" style="background-image:url(https://iph.href.lu/279x200)"></div> 
                          </div>
                        </div>
                     </div end="pptView">

  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment'; 
import Swiper from 'swiper';
import { initTable } from '../../utils/nedb'
import './css.css' /*引入公共样式*/
import './swiper.min.css' /*引入公共样式*/
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

   var galleryThumbs = new Swiper('.gallery-thumbs', {
          spaceBetween: 10,
          slidesPerView: 10,
          freeMode: true,
          watchSlidesVisibility: true,
          watchSlidesProgress: true,
        });
        var galleryTop = new Swiper('.gallery-top', {
          spaceBetween: 10,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          thumbs: {
            swiper: galleryThumbs
          }
        });

</script>

 

<style lang="scss" scoped>
 /*PPT CSS*/
  
  .pptView {
      background: #000;
      font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
      font-size: 14px;
      color:#000;
      margin: 0;
      padding: 0;
      width: 100%;
      height: 850px;
    }
    .swiper-container {
      width: 100%;
      height: 300px;
      margin-left: auto;
      margin-right: auto;
    }
    .swiper-slide {
      background-size: cover;
      background-position: center;
    }
    .gallery-top {
      height: 80%;
      width: 100%;
    }
    .gallery-thumbs {
      height: 20%;
      box-sizing: border-box;
      padding: 10px 0;
    }
    .gallery-thumbs .swiper-slide {
      width: 25%;
      height: 100%;
      opacity: 0.4;
    }
    .gallery-thumbs .swiper-slide-thumb-active {
      opacity: 1;
    }
</style>
