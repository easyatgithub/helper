<script type="text/javascript">
    // 定义一些公共的属性和方法
    var httpUrl = 'http://ip.cn'
    var data ={

    }
    function commonFun() {
        console.log("公共方法")
    }
    // 暴露出这些属性和方法
    export default {
        data,
        httpUrl,
        commonFun
    }
</script>