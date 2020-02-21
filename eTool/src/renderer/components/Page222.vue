<template>
  <div>
    文章:
    <textarea class="content" readonly v-model="content"></textarea>

    <BR />
    <el-button type="primary" plain @click="changeLine">换一句</el-button>
    <BR />
    <textarea class="line" v-model="line"></textarea>
    <BR />
    <div class="lineWords" v-for="(item, index) in lineWords" :key="index">
      <el-button type="primary" plain @click="transfer(item)">{{
        item
      }}</el-button>
    </div>
    <textarea class="line" readonly v-model="transferWord"></textarea>

    <BR />
    <el-button type="success" plain @click="save">加入收藏</el-button>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";

import eTool from "../../utils/eTool.js";

import "./css.css"; /*引入公共样式*/

const { remote, ipcRenderer } = window.require("electron");
ipcRenderer.on("broadcasting", function(event, arg) {
  console.log(this);
  console.log(arg);
  // event.sender.send("broadcasting", arg);  //  死循环
});

const DATE_FORMAT = "YYYY-MM-DD HH:mm:ss";

export default {
  name: "Page222",
  data() {
    return {
      content: "",
      line: "",
      lineWords: [],
      transferWord: "",
      input: "first"
    };
  },
  mounted() {
    this.test();
  },
  methods: {
    changeLine() {
      this.line = this.content.split(".")[-~(Math.random() * 10)];
      this.splitLine();
    },
    splitLine() {
      this.lineWords = this.line
        .replace(/[a-z]+[\-|\']+[a-z]+/gi, "")
        .match(/([a-z]+)/gi);
      this.lineWords = this.lineWords.filter(e => {
        return e.length > 3;
      });
    },

    save() {},
    async transfer(item) {
      console.log(item);
      this.transferWord = await eTool.transfer(item);
    },
    async test(tab, event) {
      console.log(eTool);
      var url = await eTool.getArticleUrl();
      this.content = await eTool.getArticle(url);
    },

    handleClick(tab, event) {
      console.log(tab, event);
    }
  },
  watch: {
    line: {
      handler(val, oldVal) {
        this.splitLine(val);
        this.transfer(this.lineWords[0]);
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  height: 300px;
}
.line {
  width: 100%;
  height: 100px;
}
.lineWords {
  display: inline;
  margin: 3px;
}

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
