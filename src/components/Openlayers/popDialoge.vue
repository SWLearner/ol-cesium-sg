<template>
  <section v-show="dialogVisible" class="people-dialog normal-box ol-popup" id="ol-popup" >
    <!-- :id="'peo-dia-' + item.userId" -->
    <!-- 表头 -->
    <section class="secur-title noUserSelect">
      <!-- 弹窗名 -->
      <div v-for="(item, index) in title" v-show="item.isShow" :key="item.name + index" class="title">
        {{ item.name }}
       
        <!-- 弹窗关闭按钮 -->
        <span v-for="(itemIcon, indexIcon) in item.icon" :key="indexIcon + itemIcon" @click="item.onClick[indexIcon]">
          <el-icon class="icon iconfont icon-diy"><Close /></el-icon>
        </span>
      </div>
    </section>
    <!-- 多要素切换栏 -->
    <el-tabs v-if="featureArr.length > 1" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane :label="item.content.name" :name="index" v-for="(item, index) in featureArr"></el-tab-pane>
    </el-tabs>
    <!-- 表内容 -->
    <p class="infoTitle">
          <span style="padding-left:27px;">
            <img src="@/assets/imgs/jizhan1.png" class="jizhanOnline" v-if="item.online" />
            <img src="@/assets/imgs/jizhan2.png" class="jizhanOnline" v-else />
            <i></i>{{ item.online ? '在线' : '离线' }}
          </span>
        </p>
    <section class="img-content content">
      <div class="left" :class="{ width100: !item.url }">
        <p v-for="(val, key) in item.label" :key="key + val" v-show="val && FILED_TYPE[key]">
          <span class="name">{{ FILED_TYPE[key] }}</span>
          <span class="val" :title="key">{{ val }}</span>
        </p>
      </div>
      <!-- <div class="right" v-show="item.url"><img v-show="item.url" :src="item.url" alt="" /></div> -->
    </section>

  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { Close } from '@element-plus/icons-vue'
import { FILED_TYPE } from './tools/config'
import { mitter } from '@/utils/mitt'
// const featureArr = ['BLZZ01', 'LHJZ01', 'DZJZ01']
const dialogVisible = ref(false)
const title = ref([
  {
    isShow: true,
    name: '基站信息',
    icon: ['icon-guanbi'],
    onClick: [
      () => {
        dialogVisible.value = false
      }
    ]
  }
])
// const item = {
//   userId: "1669603714958487601",
//   url: '',
//   online: true,   //或者为 false,
//   name: "八百里",
//   label: {
//     status: 1,
//     stationName: 'BLZZ01',
//     groupName: '北京市',
//     sn: '237',
//     staType: 'vnet8',
//     description: '八里庄',
//   }

// }
let item = ref({})
let featureArr = ref([])
// 点击切换tab页
const handleClick = (tab: any) => {
  // 解决类型“never”上不存在属性‘xxx‘问题:
  //1.直接在后面加上["xxx"]这样的属性名进行调用
  //2.直接指定数据类型为 any
  item.value = featureArr.value[tab.index]["content"]
}


onMounted(() => {
  mitter.on('station', (temp:any) => {
    if (temp) {
      dialogVisible.value = true
      if (temp.length === 1) {
        featureArr.value=[]
        item.value = temp[0].content
      }
      if (temp.length > 1) {
        featureArr.value = temp
        item.value = temp[0].content
      }
    }
  }
  )
})
</script>

<style lang="scss" scoped>
.noUserSelect {
  user-select: none;
}

.people-dialog {
  // position: absolute;
  // left: 0;
  // top: 0;
  z-index: 10000;
  width: 400px;
  background: rgb(101, 99, 107);

  // pointer-events: none !important;
  :deep(.el-dialog) {
    pointer-events: auto;

    &.el-dialog-people {
      // top: 9vh;
      // position: absolute;
      // left: 9vh;
    }

    .el-dialog__body {
      padding-top: 5px;
      padding-bottom: 15px;
    }
  }

  :deep(.el-tabs__item) {
    color: #fff !important;
  }

  .el-tabs.el-tabs--top.demo-tabs {
    padding: 0 20px;

    :deep(.el-tabs__header) {
      margin: 0 !important;
    }
  }

  .secur-title {
    .title {
      border-radius: 10px 10px 0 0;
      height: 40px;
      color: #ffffff;
      font-size: 18px;
      line-height: 40px;
      padding: 0 16px;
      text-align: left;
      background-color: rgb(12, 12, 102);

      .icon-diy {
        width: 1em;
        height: 1em;
        margin-right: 0px;
        cursor: pointer;
        background: #0f0f80;
        // background: black;
        padding: 5px 16px;
        vertical-align: sub;
        float: right;
        margin-top: 7px;
        border-radius: 3px;
        margin-left: 12px;
        text-align: left;
        line-height: 1em;
      }
    }
  }

  .content {
    padding: 0 20px;
    //  user-select: none;
  }

  .infoTitle {
    position: absolute;
    // top: 0;
    // right: 40px;
    top: 12px;
    right: 58px;

    span {
      padding: 5px 10px;
      background: #0f0f80;
      // background: black;
      border-radius: 3px;
      vertical-align: middle;
      /* line-height: 17px; */
      text-align: center;
      color: #fff;
      cursor: pointer;
      margin-right: 15px;

      svg {
        color: #fff;
        font-size: 15px;
      }

      .icon-a-zu2212 {
        color: #f70000;
        text-shadow: 0px 0px 1px #fff;
      }

      .icon-a-zu2213 {
        color: #ffc500;
      }

      .icon-a-zu2214 {
        color: #1eb358;
        text-shadow: 0px 0px 1px #fff;
      }

      .icon-a-zu378 {
        color: #aeaeae;
        font-size: 23px;
        vertical-align: sub;
        margin-right: 3px;

        &.online {
          color: #1eb358;
        }
      }
    }
  }

  .content {
    .alertState {
      background: #e13434;
      color: #fff;
    }

    .name {
      padding: 6px 30px;
      background: #d2d3d9;
      border-radius: 3px;
      color: #000;
      vertical-align: middle;
      user-select: none;
    }

    .val {
      background: #d2d3d9;
      border-radius: 3px;
      color: #000;
      display: inline-block;
      height: 31px;
      line-height: 31px;
      vertical-align: middle;
      margin-left: 10px;
      padding-left: 16px;
      width: 239px;
      // overflow: auto;
      overflow-x: auto;
      overflow-y: hidden;
    }

    .btns {
      text-align: center;

      .btn {
        cursor: pointer;
        background: #d2d3d9;
        border-radius: 3px;
      }
    }
  }

  .img-content {
    .left {
      display: inline-block;
      width: 50%;

      &.width100 {
        width: 100%;
      }

      .name {
        width: 80px;
        padding: 6px 0;
        display: inline-block;
        text-align: center;
      }

      .val {
        overflow: hidden;
        width: 240px;
        text-align: center;
        padding: 0 10px;
        margin: 10px;
      }
    }

    .right {
      display: inline-block;
      width: 49%;
      vertical-align: top;
      text-align: center;
      padding-top: 15px;

      img {
        width: 150px;
        height: 150px;
      }
    }
  }
}

.ol-popup {
  //  user-select: none;
  position: absolute;
  -webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  //  height:200px;
  //  width:200px;
  bottom: 12px;
  left: -50px;
  min-width: 150px;
  color: white;
  border-radius: 5px;
}

.ol-popup:after,
.ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: ' ';
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}

.ol-popup:after {
  border-top-color: #161e1e;
  border-width: 10px;
  left: 28px;
  margin-left: -10px;
}

.ol-popup:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 28px;
  margin-left: -11px;
}

.ol-popup.active:after,
.ol-popup.active:before {
  top: 100%;
  border: solid transparent;
  content: ' ';
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
  display: none;
}

.ol-popup.active:after {
  border-top-color: #161e1e;
  border-width: 10px;
  left: 28px;
  margin-left: -10px;
  display: none;
}

.ol-popup.active:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 28px;
  margin-left: -11px;
  display: none;
}

.jizhanOnline {
  width: 20px;
  position: absolute;
  left: 5px;
  top: -2px;
}
</style>