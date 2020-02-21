var request = require("request");
var cheerio = require("cheerio");
var headers = {
  authority: "www.shanbay.com",
  method: "GET",
  path: "/api/v1/bdc/search/?version=2&word=NICE&_=1582194438657",
  scheme: "https",
  accept: " application/json, text/javascript, */*; q=0.01",
  "accept-encoding": " utf-8, deflate, br",
  "accept-language": "en-US,en;q=0.9",
  // cookie: "__utma=183787513.1046935061.1582194293.1582194293.1582194293.1; __utmc=183787513; __utmz=183787513.1582194293.1.1.utmcsr=cnblogs.com|utmccn=(referral)|utmcmd=referral|utmcct=/; __utmt=1; __utmb=183787513.4.10.1582194293",
  referer: "https://www.shanbay.com/help/intro/we_can_help/",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin"
};
async function myRequest(url) {
  return new Promise(function(resolve, reject) {
    request.get(
      {
        url: url,
        headers: headers
      },
      function(error, response, body) {
        resolve(body);
      }
    );
  });
}

export default {
  name: "eTool",
  async getArticleUrl() {
    var data = await myRequest("https://www.51voa.com/");
    const $ = cheerio.load(data, {
      xmlMode: true
    });
    console.log(data);
    const transactions = $("#list > ul>li>a:nth-child(4)");
    var arc = transactions["0"].attribs.href;
    var url = "https://www.51voa.com" + arc;
    console.log(url);
    return url;
  },
  async getArticle(url) {
    var data = await myRequest(url);
    const $ = cheerio.load(data, {
      xmlMode: true
    });
    var article = $("div.Content").text();
    return article;
  },
  async transfer(word) {
    var url =
      "https://www.shanbay.com/api/v1/bdc/search/?version=2&word=" +
      word +
      "&_=" +
      Date.now();
    var data = await myRequest(url);

    // definitions.cn.defn
    // uncode 转中文
    var res = JSON.parse(data);
    console.log(res.msg, res.data.definitions);
    if (res.msg === "SUCCESS") {
      var list = res.data.definitions.cn;
      var s = "";
      for (var i = 0; i < list.length; i++) {
        s += list[i].pos + "   " + list[i].defn;
      }
      return s;
    } else {
      return "暂无翻译";
    }
  }
};
