<template>
  <div id="introduction">
    <div class="window">
      <ul class="container" :style="containerStyle">
        <li>
          <img :style="{width:imgWidth+'px'}" :src="sliders[sliders.length - 1].img" alt="">
        </li>
        <li v-for="(item, index) in sliders" :key="index">
          <img :style="{width:imgWidth+'px'}" :src="item.img" alt="">
        </li>
        <li>
          <img :style="{width:imgWidth+'px'}" :src="sliders[0].img" alt="">
        </li>
      </ul>
      <div class="win-bottom">
        <div class="direction">
          <div class="begin" v-if="showBegin">
            <button class="toIntro dt-bt" @click="move(1200, -1, speed, 'begin')">开始引导</button>
            <br>
            <button class="end-Intro" @click="EndIntro">跳过直接使用</button>
          </div>
          <div class="middle" v-if="showMiddle">
            <div class="left dt-bt" @click="move(1200, 1, speed, 'middle')">上一步</div>
            <div class="right dt-bt" @click="move(1200, -1, speed, 'middle')">下一步</div>
          </div>
          <div class="end" v-if="showEnd">
            <div class="left dt-bt" @click="jump(1)">再看一遍</div>
            <div class="right dt-bt" @click="EndIntro">开始体验</div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import pic1 from '../png/01.jpg';
  import pic2 from '../png/02.jpg';
  import pic3 from '../png/03.jpg';
  import pic4 from '../png/04.jpg';
  import pic5 from '../png/05.jpg';
  import pic6 from '../png/06.jpg';

  export default {
    name: 'introduction',
    props: {
      initialSpeed: {
        type: Number,
        default: 30
      },
      initialInterval: {
        type: Number,
        default: 3
      }
    },
    data() {
      return {
        sliders: [
          {
            img: pic1,
          }, {
            img: pic2,
          }, {
            img: pic3,
          }, {
            img: pic4,
          }, {
            img: pic5,
          }, {
            img: pic6,
          }
        ],
        imgWidth: 1200,
        currentIndex: 1,
        distance: -1200,
        transitionEnd: true,
        speed: this.initialSpeed,
        showBegin: true,
        showMiddle: false,
        showEnd: false,
      }
    },
    computed: {
      containerStyle() {
        return {
          transform: `translate3d(${this.distance}px, 0, 0)`
        }
      },
      interval() {
        return this.initialInterval * 1000
      }
    },
    mounted() {
      console.log('mounted:currentIndex', this.currentIndex);
      this.init()
    },
    methods: {
      init() {
        this.play();
        window.onblur = function () {
          this.stop()
        }.bind(this);
        window.onfocus = function () {
          this.play()
        }.bind(this)
      },
      move(offset, direction, speed, item) {
        if (item === 'begin') {
          this.showBegin = false;
          this.showMiddle = true;
        } else if (item === 'middle') {
          if (this.currentIndex === 5) {
            this.showMiddle = false;
            this.showEnd = true;
          }
        }
        direction === -1 ? this.currentIndex += offset / 1200 : this.currentIndex -= offset / 1200;
        if (this.currentIndex === 1) {
          this.showBegin = true;
          this.showMiddle = false;
        }
        if (this.currentIndex > 6) this.currentIndex = 1;
        if (this.currentIndex < 1) this.currentIndex = 6;
        const destination = this.distance + offset * direction;
        this.animate(destination, direction, speed)
      },
      animate(des, direc, speed) {
        if (this.temp) {
          window.clearInterval(this.temp);
          this.temp = null;
        }
        this.temp = window.setInterval(() => {
          if ((direc === -1 && des < this.distance) || (direc === 1 && des > this.distance)) {
            this.distance += speed * direc
          } else {
            this.transitionEnd = true;
            window.clearInterval(this.temp);
            this.distance = des;
            if (des < -1200 * 6) this.distance = -1200;
            if (des > -1200) this.distance = -1200 * 6
          }
        }, 20)
      },
      jump(index) {
        const direction = index - this.currentIndex >= 0 ? -1 : 1;
        const offset = Math.abs(index - this.currentIndex) * 1200;
        const jumpSpeed = Math.abs(index - this.currentIndex) === 0 ? this.speed : Math.abs(index - this.currentIndex) * this.speed;
        this.move(offset, direction, jumpSpeed);
        console.log(this.currentIndex);
        this.showBegin = true;
        this.showMiddle = false;
        this.showEnd = false;
      },
      play() {
        // if (this.timer) {
        //   window.clearInterval(this.timer);
        //   this.timer = null
        // }
        // this.timer = window.setInterval(() => {
        //   this.move(600, -1, this.speed)
        // }, this.interval)
      },
      stop() {
        // window.clearInterval(this.timer);
        // this.timer = null
      },
      EndIntro() {
        this.$router.push({name: 'home'})
      }
    }
  }
</script>

<style scoped>
  button {
    background: none;
    border: none;
    color: #fff;
    cursor: pointer;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  ol, ul {
    list-style: none;
  }

  #introduction {
    width: 100%;
    background-color: #333333;
    text-align: center;
  }

  .window {
    position: relative;
    width: 1200px;
    height: 665px;
    margin: 0 auto;
    overflow: hidden;
  }

  .container {
    margin-top: 20px;
    display: flex;
    position: absolute;
  }

  img {
    user-select: none;
  }

  .win-bottom {
    height: 75px;
    width: 1200px;
    position: absolute;
    bottom: 0;
    /*background-color: #fff;*/
  }

  .direction {
    position: relative;
  }

  .dt-bt {
    font-size: 18px;
    width: 145px;
    height: 30px;
    line-height: 30px;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 3px;
    text-align: center;
    color: #fff;
    cursor: pointer;
  }

  .begin .toIntro {
    background-color: #1AAD19;
  }

  .begin .end-Intro {
    margin-top: 10px;
    font-size: 12px;
  }

  .begin .end-Intro:hover {
    text-decoration: underline;
  }

  .left {
    border: 1px solid #fff;
    position: absolute;
    left: 35%;
  }

  .right {
    background-color: #1AAD19;
    position: absolute;
    right: 35%;
  }
</style>
