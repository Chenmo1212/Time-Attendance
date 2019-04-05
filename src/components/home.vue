<template>
  <div id="app">

    <div class="sign-box w">
      <h4>Tip:默认一次仅支持一个班级进行考勤，多个班级考勤时请点击“+”增加考勤班级</h4>
      <button class="sign-bt" @click="toAttendance">开始签到</button>
      <div class="change">
        <i class="iconfont" @click="addList" title="添加班级">&#xe66b;</i>
        <i class="iconfont" @click="reduceList()" title="减少班级">&#xe603;</i>
      </div>
      <div class="msg">
        <ul>
          <li v-for="list in lists">
            <input type="number" v-model="list.class_id" placeholder="请输入班级号">
            <input type="number" v-model="list.firstStu_id" placeholder="第一位同学学号" @change="saveList()"
                   @keyup.enter="toAttendance"> -
            <input type="number" v-model="list.lastStu_id" placeholder="最后一位同学学号" @change="saveList()"
                   @keyup.enter="toAttendance">
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script>

  import {postList, anonymous} from '../axios/api'
  import {mapState} from 'vuex'

  export default {
    name: 'app',
    data() {
      return {
        lists: [],

        class_lists: [],
        post_list: []
      }
    },
    created() {
      let lists = JSON.parse(localStorage.getItem('lists'));
      if (lists) {
        this.lists = lists;
      } else {
        this.addList();
      }
    },
    methods: {
      // 本地存储
      saveList() {
        localStorage.setItem("lists", JSON.stringify(this.lists));
      },

      restoreList() {
        return localStorage.getItem('lists');
      },

      // 增加班级
      addList() {
        this.lists.push({class_id: '', firstStu_id: '1', lastStu_id: '', total: ''});
        this.saveList();
      },

      // 减少班级
      reduceList() {
        if (this.lists.length === 1)
          alert("只有一个了，不能再减少了");
        else {
          this.lists.splice(this.lists.length - 1, 1);
          this.saveList();
        }
      },

      // 跳转开始签到界面
      toAttendance() {
        // 班级的个数
        // console.log('班级的个数:', this.lists.length);
        for (let i = 0; i < this.lists.length; i++) {

          if (this.lists[i].firstStu_id === '' || this.lists[i].lastStu_id === '' , this.lists[i].class_id === '') {
            this.$store.commit('SET_LOADING', {isLoading: true, warning: '请将信息填写完整'});
            setTimeout(() => {
              this.$store.commit('SET_LOADING', false);
            }, 1000);
            return 0;
          }

          // 新建一个对象，用来push进入数组
          const obj = {students: []};
          const list = this.lists[i];
          // 班级学号赋值
          obj.class_id = list.class_id;
          // 班级人数总数
          obj.total = list.lastStu_id - list.firstStu_id + 1;
          // 班级未签到人数
          obj.noSign = obj.total;
          // 给对象中的数组赋值
          for (var j = 0; j < obj.total; j++) {
            obj.students.push({id: j + 1, isSign: false, Late: true, Truancy: false});
          }
          // 将对象push进入数组
          this.class_lists.push(obj);
          // console.log(obj.class_id, ':', obj);
        }
        // 将数据传入仓库
        // console.log('class_list:', this.class_lists);
        this.$store.commit('change', this.class_lists);
        // 将班级数据保存在本地
        localStorage.setItem("class_lists", JSON.stringify(this.class_lists));
        // 本地存储
        this.saveList();
        // console.log('存储的数据为', JSON.parse(localStorage.getItem('lists')));

        //注册匿名用户
        this.getAnonyMous();
        // 跳转路由
        this.$router.push({name: 'attendance'});
      },

      //注册匿名用户
      getAnonyMous() {
        anonymous().then(result => {
          console.log('匿名用户信息', result);
          localStorage.setItem('creatListKey', result.data.body.key);
          // localStorage.setItem('getChickId', result.data.body.id);
          this.getList();
        }).catch(error => {
          console.log(error)

        });
      },

      //整理班级信息post
      getList() {
        let a = {};
        //遍历
        for (let i = 0; i < this.class_lists.length; i++) {
          let gid = this.class_lists[i].class_id;
          a[gid] = {from: 1, to: this.class_lists[i].students.length, exclude: []}
        }
        //a为给后端的数组
        this.postListTo(a);
      },

      //postarry接口
      postListTo(a) {
        const creatListKey =  localStorage.getItem('creatListKey');
        console.log('给后端的array', a);
        console.log(creatListKey);
          postList(a,creatListKey).then(res => {
            console.log('postarray',res);
            //存seed  messionId
            localStorage.setItem('seed',res.data.body.seed);
            localStorage.setItem('messionId',res.data.body.id);
          })
      },



    },

    mounted() {
      // 本地存储
      // let lists = JSON.parse(localStorage.getItem('lists'));
      // console.log('mounted',lists);
      // if (lists) {
      //   this.lists = lists;
      // }
      // console.log('mounted',this.lists);
      // 清除本地数据
      // window.onbeforeunload = function (e) {
      //   var storage = window.localStorage;
      //   storage.clear()
      // }
    }

  }
</script>

<style>

  .sign-box {
    width: 1000px;
    margin: 150px auto;
    text-align: center;
  }

  .sign-box h4 {
    font-weight: 400;
    font-size: 14px;
    height: 54px;
  }

  .sign-bt {
    height: 22px;
    color: #fff;
    line-height: 22px;
    width: 100px;
    background: #1aad19;
    border-radius: 5px;
    box-shadow: 0 2px 2px #9EFABC;
    font-size: 14px;
    margin-bottom: 20px;
  }

  .change {
    margin-bottom: 10px;
  }

  .sign-box .change i {
    font-size: 20px;
    color: #8d8a8a;
    margin: 0 5px;
    box-shadow: 0 0 0 rgba(255, 255, 255, 0.24), 0 1px 6px rgba(0, 0, 0, 0.45);
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    cursor: pointer;
  }

  .sign-box .msg input {
    height: 24px;
    margin-top: 10px;
    text-indent: 10px;
    border-radius: 5px;
    box-shadow: 0 1px 0 rgba(255, 255, 255, 0.24), 0 1px 6px rgba(0, 0, 0, 0.45) inset;
    font-size: 12px;
  }


</style>
