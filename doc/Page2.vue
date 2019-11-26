<template>
<div>
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
  <div v-for="e in list">
             <div class="item">
                <div class="item-content">
                  <img :src="e"/>
                </div>
              </div> 
  </div>

           </div>
          </div>
          <!--/flow -->
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
         'https://picjumbo.com/wp-content/uploads/modern-laptop-and-watches_free_stock_photos_picjumbo_DSC05387-2210x1473.jpg',
         'https://picjumbo.com/wp-content/uploads/modern-laptop-and-watches_free_stock_photos_picjumbo_DSC05387-2210x1473.jpg',
         'https://picjumbo.com/wp-content/uploads/modern-laptop-and-watches_free_stock_photos_picjumbo_DSC05387-2210x1473.jpg',
         'https://picjumbo.com/wp-content/uploads/modern-laptop-and-watches_free_stock_photos_picjumbo_DSC05387-2210x1473.jpg',
        ],
        input: 'first',
      };
    },
      
    methods: {
      test(tab, event) {
      
      },
      
    },
     mounted() {
       this.list = this.list.concat(this.list)
       this.list = this.list.concat(this.list)
       this.list = this.list.concat(this.list)
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
</style>
