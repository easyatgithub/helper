<template>
  <div>
    <el-col
      :span="8"
      class="days"
    >
      历史旗号
      <el-input
        placeholder="添加新一期"
        v-model="input2"
      >
        <template slot="append">添加</template>
      </el-input>

      <el-table
        :data="history"
        style="width: 100%"
        @row-click="openDetails"
      >
        <el-table-column
          prop="id"
          label="次数"
        ></el-table-column>
        <el-table-column
          prop="code"
          label="code"
        ></el-table-column>
      </el-table>
    </el-col>
    <el-col
      :span="8"
      class="days"
    >
      我的期号
      <el-table
        :data="myhistory"
        style="width: 100%"
        @row-click="openmyDetails"
      >
        <el-table-column
          prop="id"
          label="次数"
        ></el-table-column>
        <el-table-column
          prop="code"
          label="code"
        ></el-table-column>
      </el-table>
    </el-col>

    <el-col :span="8">
      {{this.day}}
      <el-input
        type="textarea"
        :rows="5"
        placeholder="请输入内容"
        v-model="text"
      ></el-input>
      <el-button
        type="primary"
        @click="clear"
      >清除</el-button>
      <el-button
        type="primary"
        @click="save"
      >保存</el-button>

      <el-button
        type="primary"
        @click="randomssq"
      >随机</el-button>

      <el-button
        type="primary"
        @click="systemssq"
      >机选</el-button>
      <hr />红球
      <div
        :class="e.choose  ==true  ? 'redball':'ball'"
        v-for="(e ,index) in redlist"
        v-on:click="chooseRed(index)"
      >{{e.index}}</div>
      <br />蓝球
      <div
        :class="e.choose ==true ? 'blueball':'ball'"
        v-for="(e ,index) in bluelist"
        v-on:click="chooseBlue(index)"
      >{{e.index}}</div>
      <br />期号故事
      <el-input
        type="textarea"
        :rows="5"
        placeholder="请输入内容"
        v-model="text"
      ></el-input>
    </el-col>
  </div>
</template>

<script>
import axios from "axios"
import moment from "moment"
import "./css.css" /*引入公共样式*/
import "./swiper.min.css" /*引入公共样式*/

import { FullCalendar } from "vue-fullcalendar"

const DATE_FORMAT = "YYYY-MM-DD HH:mm:ss"
export default {
  components: {},
  data() {
    return {
      redlist: [],
      bluelist: [],
      curRed: [],
      curBlue: {},
      input2: "",
      // data: this.$store.state.data,
      random: [],
      system: [],
      history: this.$store.state.data.history,
      curHistoryIndex: 0,
      myhistory: [],
      day: "",
      text: ""
    }
  },

  methods: {
    openDetails(row, index) {
      console.log(row, index)
      this.myhistory = row.myhistory
      this.curHistoryIndex = row.id
    },
    openmyDetails(row) {
      console.log(row)
      this.input2 = row.code
    },

    clear() {
      this.text = ""
    },
    save() {
      const result = this.history.map(item => {
        if (item.id === this.curHistoryIndex) {
          item.myhistory = this.myhistory
        }
        return item
      })
      // 不要去更新 地址 只更新 值
      this.history = result
      // this.history.length = 0
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>.")
      console.log(result)

      this.$store.state.save()
    },
    chooseRed(index) {
      this.redlist[index].choose = !this.redlist[index].choose
      // this.curRed.push(this.redlist[index])
      this.curRed = this.redlist.filter(function(item) {
        if (item.choose) {
          return item
        }
      })
      console.log(this.curRed)
    },
    chooseBlue(index) {
      for (var i = 0; i < this.bluelist.length; i++) {
        this.bluelist[i].choose = false
      }
      this.bluelist[index].choose = !this.bluelist[index].choose
      this.curBlue = this.bluelist[index]
    },
    ssq() {
      var x = []
      var arr = []
      for (var i = 0; i < 33; i++) {
        arr[i] = i + 1
      }

      while (x.length < 6) {
        var index = -~(Math.random() * arr.length)
        if (arr[index]) {
          x.push(arr[index])
          delete arr[index]
        }
      }
      x.push(-~(Math.random() * 16))
      return x
    },
    randomssq() {
      this.random = this.ssq()
      this.text = JSON.stringify(this.random)
      this.myhistory.push({
        id: Date.now(),
        code: JSON.stringify(this.random),
        story: ""
      })
    },
    systemssq() {
      this.system = []
      for (var i = 0; i < 5; i++) {
        var x = this.ssq()
        this.system.push(x)
        this.myhistory.push({
          id: i,
          code: JSON.stringify(x),
          story: ""
        })
      }
      this.text = JSON.stringify(this.system)
    }
  },
  components: {
    "full-calendar": require("vue-fullcalendar")
  },
  computed: {},
  mounted() {
    for (var i = 1; i <= 33; i++) {
      this.redlist.push({
        index: i,
        choose: false
      })
    }
    for (var i = 1; i <= 16; i++) {
      this.bluelist.push({
        index: i,
        choose: false
      })
    }
    console.log(".------------------------------PAGE2")
    console.log(this.history)

    // this.$store.state.save()
  }
}
</script>

 

<style lang="scss" scoped>
.redball {
  color: red;
  width: 25px;
  height: 25px;
  line-height: 25px;
  border: 1px solid;
  border-radius: 50%;
  font-size: 10px;
  font-weight: 100;
  display: inline-block;
  text-align: center;
}
.blueball {
  color: blue;
  width: 25px;
  height: 25px;
  line-height: 25px;
  border: 1px solid;
  border-radius: 50%;
  font-size: 10px;
  font-weight: 100;
  display: inline-block;
  text-align: center;
}
.ball {
  width: 25px;
  height: 25px;
  line-height: 25px;
  border: 1px solid;
  border-radius: 50%;
  font-size: 10px;
  font-weight: 100;
  display: inline-block;
  text-align: center;
}
</style>
