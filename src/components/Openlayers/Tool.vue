<template>
    <!-- 工具集 -->
    <div class="tool">
        <el-popover class='popover' placement="left" width=280px trigger="click">
            <template #reference>
                <el-button class="edit" size="large" type="primary" circle><icon-gis-globe /></el-button>
            </template>
            <div>
                <!-- :icon="EarthAsia"  -->
                <el-button size="large" type="primary" name="Point" @click="reShow()" circle>矢量</el-button>
                <el-button size="large" type="primary" name="Point" @click="showMap(['tdmImg', 'tdmCia'])"
                    circle>影像</el-button>
                <el-button size="large" type="primary" name="Point" @click="showMap(['gaodeLayer'])"
                    circle>高德</el-button>
                <el-button size="large" type="primary" name="Point" @click="showMap(['baiduLayer'])"
                    circle>百度</el-button>
                <el-button size="large" type="primary" name="Point" @click="showMap(['geoq'])" circle>智图</el-button>
            </div>
        </el-popover>
        <el-popover class='popover' placement="left" width=180px trigger="click">
            <template #reference>
                <!-- :icon="Edit" -->
                <el-button class="edit" size="large" type="primary" :icon="Edit" circle></el-button>
            </template>
            <div>
                <el-button size="large" type="primary" name="Point" @click="buttonChange('Point')"
                    circle><icon-gis-poi-map /></el-button>
                <el-button size="large" type="primary" name="LineString" @click="buttonChange('LineString')"
                    circle><icon-gis-polyline-pt /></el-button>
                <el-button size="large" type="primary" name="Polygon" @click="buttonChange('Polygon')"
                    circle><icon-gis-polygon-pt /></el-button>
            </div>
        </el-popover>
        <el-popover class='popover' placement="left" width=120px trigger="click">
            <template #reference>
                <el-button class="edit" size="large" type="primary" circle><icon-gis-measure /></el-button>
            </template>
            <div>
                <el-button size="large" type="primary" name="Length" @click="buttonChange('Length')"
                    circle><icon-gis-measure-line /></el-button>
                <el-button size="large" type="primary" name="Area" @click="buttonChange('Area')"
                    circle><icon-gis-measure-area /></el-button>
            </div>
        </el-popover>
        <el-button class="edit" size="large" type="primary" @click="clear()" circle><icon-icon-park-outline-clear-format /></el-button>
        <el-button class="edit" size="large" type="primary" @click="zoomIn()" circle><icon-gis-zoom-in /></el-button>
        <el-button class="edit" size="large" type="primary" @click="zoomOut()" circle><icon-gis-zoom-out /></el-button>
    </div>
</template>

<script setup lang="ts">
import { Edit } from '@element-plus/icons-vue'
import { showMap, reShow} from './tools/map.ts'
import {buttonChange,clear,zoomOut, zoomIn} from './tools/map.ts'
</script>

<style scoped>
.tool {
  position: absolute;
  margin-left: 0 auto;
  margin-top: 180px;
  right: 40px;
  width: 40px;
  height: 120px;
  z-index: 2001;
}

.el-button {
  background: #0c0c66;
}

.edit {
  margin-left: 0px;
  margin-top: 12px;
}

.ol-rotate-reset {
  float: right;
}

/* 测量消息提示样式 */
.ol-tooltip {
  position: relative;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  color: white;
  padding: 4px 8px;
  opacity: 0.7;
  white-space: nowrap;
  font-size: 12px;
  cursor: default;
  user-select: none;
}

.ol-tooltip-measure {
  opacity: 1;
  font-weight: bold;
}

.ol-tooltip-static {
  background-color: #ffcc33;
  color: black;
  border: 1px solid white;
}

.ol-tooltip-measure:before,
.ol-tooltip-static:before {
  border-top: 6px solid rgba(0, 0, 0, 0.5);
  border-right: 6px solid transparent;
  border-left: 6px solid transparent;
  content: "";
  position: absolute;
  bottom: -6px;
  margin-left: -7px;
  left: 50%;
}

.ol-tooltip-static:before {
  border-top-color: #ffcc33;
}

.hidden {
  display: none;
}

</style>
