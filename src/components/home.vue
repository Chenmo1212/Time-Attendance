<template>
  <div id="app">
    <!--section-->
    <section>
      <div class="sec">
        <div class="tip">

          <span>Tip：默认一次仅支持一个班级进行考勤，多个班级考勤时请点击“+”增加考勤班级</span>

          <!--开始签到-->
          <div class="submit">
            <input type="button" value="开始签到" @click="toAttendance">
          </div>

          <!--增减按钮-->
          <div class="change">
            <input class="add" type="button" @click="addList">
            <input class="reduce" type="button" @click="reduceList(list)">
          </div>

        </div>

        <!--输入框-->
        <div class="input">
          <ol>
            <li v-for="list in lists">
              <input type="number" v-model="list.class_id" placeholder="请输入班级号">
              <input type="number" v-model="list.input1" placeholder="第一位同学学号" @change="saveList()"
                     @keyup.enter="toAttendance"> -
              <input type="number" v-model="list.input2" placeholder="最后一位同学学号" @change="saveList()"
                     @keyup.enter="toAttendance">
            </li>
          </ol>
        </div>

      </div>
    </section>

  </div>
</template>

<script>
  export default {
    name: 'app',
    data() {
      return {
        lists: [
          {
            class_id: '',
            input1: '1',
            input2: '',
            student: [],
          },
        ],

        class_lists: []
      }
    },
    methods: {

      // 本地存储
      saveList() {
        localStorage.setItem("lists", JSON.stringify(this.lists));
      },

      // 增加班级
      addList() {
        this.lists.push({input1: '1', input2: '', total: ''});
        localStorage.setItem("lists", JSON.stringify(this.lists));
        // saveList();
      },

      // 减少班级
      reduceList(list) {
        if (this.lists.length === 1)
          alert("只有一个了，不能再减少了");
        else {
          this.lists.splice(this.lists.length - 1, 1);
          localStorage.setItem("lists", JSON.stringify(this.lists));
          // saveList();
        }
      },


      // 跳转开始签到界面
      toAttendance() {


        // 班级的个数
        console.log('班级的个数:', this.lists.length);
        for (var i = 0; i < this.lists.length; i++){

          if(this.lists[i].input1 === '' || this.lists[i].input2 === '' ,this.lists[i].class_id === ''){
            this.$store.commit('SET_LOADING', {isLoading:true, warning:'请将信息填写完整'});
            setTimeout(() => {
              this.$store.commit('SET_LOADING', false);
            }, 1000);

            return 0;
          }


          // 新建一个对象，用来push进入数组
          var obj = {students:[]};

          // 班级学号赋值
          obj.class_id = this.lists[i].class_id;

          // 班级人数总数
          obj.total = this.lists[i].input2 - this.lists[i].input1 + 1;

          // 班级未签到人数
          obj.noSign = obj.total;

          // 给对象中的数组赋值
          for (var j = 0; j < obj.total; j++) {
            obj.students.push({id: j+1, isSign: false, ifshowMenu: false});
          }

          // 将对象push进入数组
          this.class_lists.push(obj);
          console.log(obj.class_id,':',obj);
        }

        // 将数据传入仓库
        console.log('class_list:',this.class_lists);
        this.$store.commit('change', this.class_lists);

        // 将班级数据保存在本地
        localStorage.setItem("class_lists", JSON.stringify(this.class_lists));

        // 本地存储
        localStorage.setItem("lists", JSON.stringify(this.lists));
        console.log('存储的数据为',JSON.parse(localStorage.getItem('lists')));

        // 跳转路由
        this.$router.push({name: 'attendance'});
      }
    },

    mounted() {
      // 本地存储
      let lists = JSON.parse(localStorage.getItem('lists'));
      if (lists) {
        this.lists = lists;
      }

      // 清除本地数据
      // window.onbeforeunload = function (e) {
      //   var storage = window.localStorage;
      //   storage.clear()
      // }
    }

  }
</script>

<style>

  /*去掉一大堆的预设begin*/
  ul, li {
    padding: 0;
    margin: 0;
    list-style: none
  }

  ol, li {
    padding: 0;
    margin: 0;
    list-style: none
  }

  h1, h2, h3, h4, h5, h6, p, li, label, td, th {
    cursor: text;
  }

  a:link, a:visited, a:hover, a:active {
    cursor: pointer;
  }

  body {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    font-size: 14px;
    font-family: "微软雅黑", Arial, Helvetica, sans-serif;
    color: #333;
  }

  div, p, ul, ol, li, dl, dt, dd, h1, h2, h3, h4, h5, h6, form, input, select, textarea, table, td {
    margin: 0;
    padding: 0;
  }

  h1, h2, h3, h4, h5, h6 {
    font-size: 100%;
    font-weight: normal;
  }

  area {
    outline: none;
  }

  img {
    border: 0;
    outline: none;
  }

  ol, ul {
    list-style: none;
  }

  a {
    font-family: "微软雅黑", Arial, Helvetica, sans-serif;
    text-decoration: none;
    outline: none;
  }

  a:hover {
    text-decoration: none;
  }

  .clearfix:after {
    content: "";
    display: block;
    height: 0;
    clear: both;
  }

  .clearfix {
    zoom: 1;
  }

  button:focus {
    outline: none;
  }
  /*去掉一大堆预设end*/

  body, html {
    margin: 0;
    padding: 0;
    font-size: 16px;
    /*background: #f6f8f9;*/
    /*background: #f6f8f9 url(../png/home1.gif) no-repeat;*/
    /*background-position: center 500px;*/
  }

  #app {
    position: relative;
  }

  /*section-begin*/
  .sec {
    position: absolute;
    width: 500px;
    /*background-color: #fff;*/
    margin: 10% 0 0 50%;
    left: -250px;
  }

  /*tip*/
  .sec .tip {
    text-align: center;
    font-size: 14px;
    cursor: pointer;
  }

  /*增减按钮begin*/
  .change input {
    margin: 15px 10px 0;
    border: none;
    width: 20px;
    height: 20px;
    /*background-color: #fff;*/
    background-size: 100%;
    outline: none;
  }

  .add {
    background: url(../png/add.png);
  }

  .reduce {
    background: url(../png/reduce.png);
  }

  /*增减按钮end*/

  .sec ol li {
    padding-top: 10px;
    text-align: center;
  }

  /*开始签到按钮*/
  .submit input {
    border: none;
    height: 22px;
    color: #fff;
    line-height: 22px;
    width: 100px;
    background: #1aad19;
    margin-top: 20px;
    border-radius: 3px;
    /*border-left: 5px solid #629A9C;*/
    box-shadow: 0 2px 2px #9EFABC;
  }

  /*输入框*/
  .input input {
    width: 30%;
    height: 24px;
    margin-top: 10px;
    text-indent: 10px;
    border-radius: 5px;
    box-shadow: 0 1px 0 rgba(255, 255, 255, 0.24), 0 1px 6px rgba(0, 0, 0, 0.45) inset;
    border: none;
    outline: none;
  }

</style>
