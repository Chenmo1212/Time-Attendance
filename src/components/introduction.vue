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
        <!--<img src="../png/1.png" alt="">-->
        <ul class="direction">
          <li class="left" @click="move(1300, 1, speed)">
            <!--<img src="../png/check.png" alt="">-->
          </li>
          <li class="right" @click="move(1300, -1, speed)">
            <!--<img src="../png/change.png" alt="">-->
          </li>
        </ul>
      </div>

    <div class="direction">
      <div class="begin">
        <button>开始引导</button>
        <span @click="cancel">跳过直接使用</span>
      </div>
      <div class="left">

      </div>
      <div class="right"></div>
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
    name: "introduction",
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
        imgWidth: 1300,
        currentIndex: 1,
        distance: -1300,
        transitionEnd: true,
        speed: this.initialSpeed
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
      console.log('mounted:currentIndex',this.currentIndex);
      // this.init()
    },
    methods: {
      // init() {
      //   this.play();
      //   window.onblur = function () {
      //     this.stop()
      //   }.bind(this);
      //   window.onfocus = function () {
      //     this.play()
      //   }.bind(this)
      // },
      move(offset, direction, speed) {

        // if (!this.transitionEnd) return
        // this.transitionEnd = false;
        direction === -1 ? this.currentIndex += offset / 1300 : this.currentIndex -= offset / 1300;
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
            if (des < -1300 * 6) this.distance = -1300;
            if (des > -1300) this.distance = -1300 * 6
          }
        }, 20)
      },
      cancel(){
        this.$router.push({name:'home'})
      }

      // play() {
        // if (this.timer) {
        //   window.clearInterval(this.timer);
        //   this.timer = null
        // }
        // this.timer = window.setInterval(() => {
        //   this.move(600, -1, this.speed)
        // }, this.interval)
      // },
      // stop() {
        // window.clearInterval(this.timer);
        // this.timer = null
      // }
    }
  }
</script>

<style scoped>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  ol, ul {
    list-style: none;
  }

  .window {
    position: relative;
    top: 10px;
    width: 1300px;
    height: 550px;
    margin: 0 auto 0;
    overflow: hidden;
  }

  .container {
    display: flex;
    position: absolute;
  }

  .left, .right {
    position: absolute;
    bottom: 0;
    transform: translateY(-50%);
    border-radius: 50%;
    cursor: pointer;
  }
  .left img, .right img {
    width: 50px;
    height: 50px;
  }
  .left {
    left: 45%;
    padding-left: 12px;
    padding-top: 10px;
  }

  .right {
    right: 45%;
    padding-right: 12px;
    padding-top: 10px;
  }

  img {
    user-select: none;
    -webkit-background-size: 100%;
    background-size: 100%;
  }

  #introduction {
    text-align: center;
    background-color: rgba(0,0,0,0.8);
  }
  .begin button {
    margin-top: 40px;
    width: 145px;
    height: 40px;
    border-radius: 3px;
    color: #fff;
    font-size: 18px;
    background-color: #1AAD19;
  }
  .begin span {
    margin-top: 10px;
    padding-bottom: 11px;
    display: block;
    color: #fff;
  }
</style>
