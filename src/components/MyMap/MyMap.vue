<script setup lang="ts" name="myMap">
import { ref, reactive, shallowRef, markRaw } from 'vue'
import OpenlayersMap from '../Openlayers/OpenlayersMap.vue'
import CesiumMap from '../Cesium/CesiumMap.vue'
import SG from '../Sg/SgMap.vue'
const comId = shallowRef(CesiumMap) 
const active = ref(1)
const data = reactive([
  {
    name: 'Openlayers',
    com: markRaw(OpenlayersMap)
  },
  {
    name: 'Cesium',
    com: markRaw(CesiumMap)
  },
  {
    name: 'SG',
    com: markRaw(SG)
  },
])

const switchCom = (item: any, index: number) => {
  comId.value = item.com;
  active.value = index;
}

</script>
<template>
  <el-header>
    <div class="header-container">
      <div class="logo">
        <span>Openlayers_Cesium_SG</span>
      </div>
      <div class="header-menu">
        <div class="header-menu-wrap">
          <div id="btn" @click="switchCom(item, index)" :class="[active == index ? 'active' : '']" class="header-menu-btn"
            v-for="(item, index) in data">
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </el-header>
  <div class="show-bg"></div>
  <div class="map">
      <component :is="comId">
      </component>
  </div>
</template>

<style lang="scss" scoped>
html {
  overflow: hidden;
}

#app {
  width: 100%;
  height: 100%;
  min-width: 1024px;

  .el-header {
    position: absolute;
    width: 100%;
    height: 60px;
    z-index: 9999;
    display: block;
    padding: 0;
    margin: 0;

    .header-container {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 0;
      min-width: 1024px;
      background-image: linear-gradient(to bottom, rgba(1, 27, 58, 0.8), rgba(1, 27, 58, 0));

      .logo {
        width: 666px;
        height: 88px;
        position: absolute;
        left: 50%;
        top: 0;
        margin-left: -333px;
        // margin: 0 auto;
        background: url('@/assets/imgs/bj.png') no-repeat;
        background-size: 100% auto;
        font-size: 30px;
        color: #ffffff;
        line-height: 70px;
        text-align: center;
      }

      .header-menu {
        position: absolute;
        top: 0;
        left: 50%;
        height: 88px;

        .header-menu-wrap {
          position: relative;

          .header-menu-btn {
            position: absolute;
            top: 37px;
            left: 0;
            width: 130px;
            height: 35px;

            span {
              display: block;
              width: 130px;
              height: 35px;
              text-decoration: none;
              background: url('@/assets/imgs/btn-left.png') no-repeat;
              background-size: 100% auto;
              text-align: center;
              color: #ffffff;
              line-height: 35px;
              cursor: pointer;
              margin-left: 10px;
              z-index:9999;

              &:hover,
              &.on {
                background: url('@/assets/imgs/btn-left-on.png') no-repeat;
                background-size: 100% auto;
                color: #000;
              }
            }

            &:nth-child(even) span {
              background: url('@/assets/imgs/btn-right.png') no-repeat;
              background-size: 100% auto;

              &:hover,
              &.on {
                background: url('@/assets/imgs/btn-right-on.png') no-repeat;
                background-size: 100% auto;
              }
            }

            &:nth-child(1) {
              left: -470px;
            }

            &:nth-child(2) {
              left: 320px;
            }

            &:nth-child(3) {
              left: -610px;
            }

            &:nth-child(4) {
              left: 460px;
            }

            &:nth-child(5) {
              left: -750px;
            }

            &:nth-child(6) {
              left: 600px;
            }

            &:nth-child(7) {
              left: -890px;
            }

            &:nth-child(8) {
              left: 740px;
            }
          }
        }
      }

      .header-left {
        position: absolute;
        left: 20px;
        top: 36px;
        font-size: 16px;
        color: #fff;
        line-height: 36px;
      }

      .header-right {
        position: absolute;
        top: 26px;
        right: 10px;

        .header-right-info {
          position: relative;
          display: inline-block;
          font-size: 16px;
          line-height: 60px;
          color: #ffffff;
          cursor: pointer;
          padding: 0 10px 0 0;
          vertical-align: middle;
        }
      }
    }

    @media screen and (max-width: 1500px) {
      .header-container {
        .logo {
          width: 400px;
          margin-left: -200px;
          font-size: 20px;
          line-height: 40px;
        }

        .header-menu {
          .header-menu-wrap {
            .header-menu-btn {
              position: absolute;
              top: 17px;
              left: 0;
              width: 100px;
              height: 30px;

              span {
                display: block;
                width: 100px;
                height: 30px;
                line-height: 28px;
                font-size: 13px;
              }

              &:nth-child(1) {
                left: -300px;
              }

              &:nth-child(2) {
                left: 180px;
              }

              &:nth-child(3) {
                left: -400px;
              }

              &:nth-child(4) {
                left: 280px;
              }

              &:nth-child(5) {
                left: -500px;
              }

              &:nth-child(6) {
                left: 380px;
              }

              &:nth-child(7) {
                left: -600px;
              }

              &:nth-child(8) {
                left: 480px;
              }
            }
          }
        }
      }
    }
  }

  .show-bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 80px;
    z-index: 9998;
    min-width: 1024px;
    background-image: linear-gradient(rgba(1, 27, 58, 0.8) 0%,
        rgba(1, 27, 58, 0.5) 60%,
        rgba(1, 27, 58, 0) 100%);
  }
}
</style>
