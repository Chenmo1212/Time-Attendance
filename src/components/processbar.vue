<template>
  <div class="processbar">
    <div class="table">
      <div class="progress-bar">
        <div id='loader'>
          <div class='clip' id="loaded">
          </div>
        </div>
      </div>
      <button @click="processbar" id="textbtn">进度条测试</button>
    </div>

  </div>
</template>

<script>
  export default {
    name: 'processbar',
    data() {
      return {
        loader_width: 500,    // 进度条盒子宽度
        loader_height: 10,    // 进度条盒子高度
        loaded_width: 0,      // 进度条内容宽度——初始宽度
        loaded_height: 10,    // 进度条内容高度
        loader_speed: 5000,  // 进度条速度(ms)
      }
    },
    mounted() {
      // 获取元素
      var loader = document.getElementById("loader"); // 获取进度条盒子
      var loaded = document.getElementById("loaded"); // 获取进度条内容
      // 设置宽高
      loader.style.width = this.loader_width + 'px';  // 设置盒子宽度
      loader.style.height = this.loader_height + 'px'; // 设置盒子高度
      loaded.style.width = this.loaded_width + 'px';  // 设置内容宽度
      loaded.style.height = this.loaded_height + 'px'; // 设置内容高度
      console.log("盒子当前设置宽度为:", loader.style.width);
    },
    methods: {
      processbar() {
        var count = (this.loader_width * 20) / this.loader_speed; // 进度条单次增加宽度（px）
        var total = 0; // 进度条累加总宽度
        var width = this.loader_width;
        setInterval(function () { // 定义计时器
          total += count;
          loaded.style.width = total + 'px';
          var d_width = loaded.style.width;
          if (parseInt(d_width) >= width) {
            var myDate = new Date(); // 显示当前日期时间
            console.log("当前时间：",myDate.toLocaleString());
            console.log("进度条满了，重置！");
            total = 0;
            loaded.style.width = total + 'px';
          }
        }, 20);
      },
    }
  }
</script>

<style type="text/css" scoped>


  .table {
    margin: 100px auto;
    width: 1300px;
  }
  .progress-bar {
    display: inline-block;
  }
  .progress-bar span {
    font-size: 12px;
    vertical-align: middle;
    color: #3385ff;
  }

  #loader {
    border-radius: 30px;
    margin-left: 300px;
    background-color: #f9f7f7;
    border: 1px solid #f1f0f0;
    padding: 0px 2px;
    display: inline-block;
  }

  .clip {
    /* Safari 5.1 - 6.0 */
    background: -webkit-linear-gradient(left, #f9f586, #96fbc4);
    /* Opera 11.1 - 12.0 */
    background: -o-linear-gradient(left, #f9f586, #96fbc4);
    /* Firefox 3.6 - 15 */
    background: -moz-linear-gradient(left, #f9f586, #96fbc4);
    /* 标准的语法 */
    background: linear-gradient(to right, #f9f586, #96fbc4);
    width: 10px;
    margin: 1px 0px;
    box-shadow: 0px 0px 2px #0dd2ea;
    height: 8px;
    border-radius: 20px;
  }

  #context {
    height: 10px;
  }
</style>
