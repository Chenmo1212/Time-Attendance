<template>
  <div id="Attendance">
    <div class="box">
      <qr_code class="left"></qr_code><classMsg class="right"></classMsg>
    </div>
  </div>
</template>

<script>
  // 引入子组件
  import qr_code from './qr_code';
  import classMsg from './classMsg';
export default {
    name: "Attendance",
    data() {
      return {
        
      }
    },
    methods: {

    },

    // 声明子组件
    components: {
      qr_code,
      classMsg,
    }
  }
</script>

<style scoped>
  body, html {
    margin: 0;
    padding: 0;
    font-size: 16px;
    /*background: #f6f8f9;*/
  }
  .box {
    height: 90.74vh;
    width: 100vw;
    display: flex;
    flex-direction: row;
  }
  .left {
    width: 38.2%;
    /*background-color: #aaa;*/
  }
  .right {
    width: 61.8%;
    /*background-color: #ddd;*/
  }

  /*.left, .right{*/
    /*height: 95vw;*/
    /*display: inline-block;*/
    /*vertical-align: top;*/
  /*}*/
  /*.left {*/
    /*background-color: #aaa;*/
    /*width: 49vw;*/
  /*}*/
</style>
