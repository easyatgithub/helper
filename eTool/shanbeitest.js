/*
npm i request cheerio
 
*/
var request = require('request');
var cheerio = require('cheerio');
 
 function articDemo(){
	 return new Promise(function (resolve, reject) {
request.get({
	    url:"https://www.51voa.com/",
	    headers: {
			"authority":"www.shanbay.com",
'method':'GET',
'path':'/api/v1/bdc/search/?version=2&word=NICE&_=1582194438657',
'scheme':'https',
'accept':' application/json, text/javascript, */*; q=0.01',
'accept-encoding':' utf-8, deflate, br',
'accept-language':'en-US,en;q=0.9',
'cookie':'__utma=183787513.1046935061.1582194293.1582194293.1582194293.1; __utmc=183787513; __utmz=183787513.1582194293.1.1.utmcsr=cnblogs.com|utmccn=(referral)|utmcmd=referral|utmcct=/; __utmt=1; __utmb=183787513.4.10.1582194293',
'referer':'https://www.shanbay.com/help/intro/we_can_help/',
'sec-fetch-mode':'cors',
'sec-fetch-site':'same-origin',

		},

}, function(error, response, body){ 
     resolve(body);
}); 
 });
}

  articDemo().then(function(data){
	   
	    const $ = cheerio.load(data, {
        xmlMode: true
      });

      const transactions = $("#list > ul>li>a:nth-child(4)");
      var arc = transactions["0"].attribs.href;
      var url = "https://www.51voa.com" + arc;
      console.log(url);
  })

function transferDemo(){
	// cookie 的话就用selenium 去取一次
// https://www.shanbay.com/help/intro/we_can_help/
request.get({
	    url:     'https://www.shanbay.com/api/v1/bdc/search/?version=2&word=NICE&_=1582194438657',     
	    headers: {
			"authority":"www.shanbay.com",
'method':'GET',
'path':'/api/v1/bdc/search/?version=2&word=NICE&_=1582194438657',
'scheme':'https',
'accept':' application/json, text/javascript, */*; q=0.01',
'accept-encoding':' utf-8, deflate, br',
'accept-language':'en-US,en;q=0.9',
//'cookie':'__utma=183787513.1046935061.1582194293.1582194293.1582194293.1; __utmc=183787513; __utmz=183787513.1582194293.1.1.utmcsr=cnblogs.com|utmccn=(referral)|utmcmd=referral|utmcct=/; __utmt=1; __utmb=183787513.4.10.1582194293',
'referer':'https://www.shanbay.com/help/intro/we_can_help/',
'sec-fetch-mode':'cors',
'sec-fetch-site':'same-origin',

		},

}, function(error, response, body){ 
  console.log(body);
  // definitions.cn.defn
  // uncode 转中文
}); 
}
 // transferDemo()
/*
{"pronunciations": {"uk": "naɪs", "us": "naɪs"}, "a
udio_addresses": {"uk": ["https://media-audio1.baydn.com/uk/n/ni/nice_v3.mp3", "http://media-audio1.
qiniu.baydn.com/uk/n/ni/nice_v3.mp3"], "us": ["https://media-audio1.baydn.com/us/n/ni/nice_v3.mp3",
"http://media-audio1.qiniu.baydn.com/us/n/ni/nice_v3.mp3"]}, "audio_name": "nice_v3", "num_sense": 2, "sen
se_id": 0, "id": 4213, "has_collins_defn": true, "has_oxford_defn": true, "url": "https://www.shanbay.com/
bdc/mobile/preview/word?word=nice", "content": "nice", "id_str": "iihdg", "definitions": {"en": [{"pos": "
n.", "defn": "a city in southeastern France on the Mediterranean; the leading resort on the French Riviera
"}, {"pos": "adj.", "defn": "pleasant or pleasing or agreeable in nature or appearance"}], "cn": [{"pos":
"adj.", "defn": "美好的,令人愉快的,漂亮的,善意的"}
]}}}
*/