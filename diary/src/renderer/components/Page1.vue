<template>
  <div> 
    <el-col :span="8" class="days" >
       <div>
   <full-calendar :events="data" class="my-full-calendar"
                     first-day='1' locale="fr"
                     @changeMonth="changeMonth"    
                     @eventClick="eventClick"       
                     @dayClick="dayClick"           
                     @moreClick="moreClick"></full-calendar>     
</div>

    </el-col>

    <el-col :span="16">
       
         {{this.day}}
       <el-input type="textarea":rows="20" placeholder="请输入内容" v-model="text" > </el-input>
       <el-button type="primary" @click="clear" > 清除</el-button> 
       <el-button type="primary"  @click="save"  > 保存</el-button> 
    </el-col>
 
    
    

  </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import "./css.css"; /*引入公共样式*/
import "./swiper.min.css"; /*引入公共样式*/

import { FullCalendar } from 'vue-fullcalendar'

const DATE_FORMAT = "YYYY-MM-DD HH:mm:ss";
export default {
  components: {
   
  },
  data() {
    return {
       

       /*
         {
      title : 'eeeeeeeee',  // 事件内容
      start : '2019-12-11', // 事件开始时间
      end : '2019-12-11',   // 事件结束时间
      cssClass: 'red'     ,  // 事件的样式   class名（由后台返回数据）  red为自己定义的class名
      text:"111111111333333333333333",
    },
       */
       data: this.$store.state.data.my,
       day :"",
       text:"",
    };
  },

  methods: {
    // 选择月份
      changeMonth (start, end, current) {
       console.log('changeMonth', start, end, current)
      },
      // 点击事件
      eventClick (event, jsEvent, pos) {
        console.log('eventClick', event, jsEvent, pos)
        this.text = event.text
      },
      // 点击当天
      dayClick (day, jsEvent) {
         console.log('dayClick', day, jsEvent)
         this.day =   moment(day).format("YYYY-MM-DD")
         for(var e in this.data){
           console.log('dayClick', e,this.data[e].start, moment(day).format("YYYY-MM-DD"), this.data[e].start  === moment(day).format("YYYY-MM-DD"))
           if( this.data[e].start=== moment(day).format("YYYY-MM-DD")){
             this.text = this.data[e].text
             break
           }else{
             this.text =""
           }
         }
      },

      // 查看更多
      moreClick (day, events, jsEvent) {
        console.log('moreCLick', day, events, jsEvent)
      },
      clear(){
        this.text =""
      },
      save(){
         
        this.data.push({
           title : this.text,
           start : this.day,
           end :  this.day,
           cssClass: 'blue', 
           text: this.text,
        })
        this.$store.state.save()
      },
  },
  components: {
      'full-calendar': require('vue-fullcalendar')
  },
  computed: {
     
  },
  mounted() {
    console.log(".------------------------------")
    this.$store.state.init()
     
   // this.$store.state.save()

  }
};
</script>

 

<style lang="scss" scoped>
 
 
</style>
