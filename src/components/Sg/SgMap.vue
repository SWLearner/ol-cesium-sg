<script setup lang="ts">
import { onMounted, ref } from "vue";
import { initSgMap,looaGeojson, zoomOut, zoomIn,clear } from "./tools/sg"
import { SgDrawTool } from "./tools/sgTool"

//图标
import { Edit } from '@element-plus/icons-vue'
declare const SGMap: any;
let sgMap: any;
let sgTool:SgDrawTool
let show = ref<boolean>(false);

interface Data {
  name: string,
  station: string,
  year: string,
  lng: string,
  lat: string,
  height: string,
  Jan: string,
  Feb: string,
  Mar: string,
  Apr: string,
  May: string,
  Jun: string,
}

let proList = ref<Data>(
  {
    name: "仙居",
    station: "58652",
    year: "2020",
    lng: "120.75",
    lat: "28.91",
    height: "83",
    Jan: "317.16",
    Feb: "44933.92",
    Mar: "351",
    Apr: "738",
    May: "558",
    Jun: "507.6",
  }
);
onMounted(() => {

  SGMap.tokenTask
    .login("83157937b22837dc8e0e774eca8dd053", "5d8ad60384a23acab950817a779bcc59")
    .then(function () {
      SGMap.plugin([
        "SGMap.DrawPointHandler",
        "SGMap.DrawPolylineHandler",
        "SGMap.DrawPolygonHandler",
        "SGMap.GeometryUtil",
        "SGMap.EleSymbolLayer",
        "SGMap.VectorDynamicLayer"
      ]).then(function () {
        sgMap=initSgMap();
        sgTool=new SgDrawTool(sgMap);
        //加载geojson数据
        sgMap.on("load", function () {
          looaGeojson(sgMap);
        })
        //获取属性数据
        sgMap.on("click", "jsonData", function (e: any) {
          console.log(e)
          console.log(Number(e.lngLat.lng).toFixed(2), Number(e.lngLat.lat).toFixed(2))
          const features = e.features[0].properties;
          proList.value.name = features['站名'];
          proList.value.station = features['区站号'];
          proList.value.lng = Number(e.lngLat.lng).toFixed(2);
          proList.value.lat = Number(e.lngLat.lat).toFixed(2);
          proList.value.height = features['海拔'];
          proList.value.year = features['年份'];
          proList.value.Jan = features['1月'];
          proList.value.Feb = features['2月'];
          proList.value.Mar = features['3月'];
          proList.value.Apr = features['4月'];
          proList.value.May = features['5月'];
          proList.value.Jun = features['6月'];
          show.value = true;
          console.log("show.value", show.value)
          // console.log("proList",  proList);
          // console.log(proList.value)

        })
      });
    });

})

function cancel() {
  show.value = false;
}

</script>

<template>
  <div id="map" class="map">
    <div class="tool">
      <el-popover class='popover' placement="left" width=180px trigger="click">
        <template #reference>
          <el-button class="edit" size="large" type="primary" :icon="Edit" circle />
        </template>
        <div>
          <el-button size="large" type="primary" name="Point" @click="sgTool.draw('point')"
            circle><icon-gis-poi-map /></el-button>
          <el-button size="large" type="primary" name="LineString" @click="sgTool.draw('line')"
            circle><icon-gis-polyline-pt /></el-button>
          <el-button size="large" type="primary" name="Polygon" @click="sgTool.draw('polygon')"
            circle><icon-gis-polygon-pt /></el-button>
        </div>
      </el-popover>
      <el-popover class='popover' placement="left" width=100px trigger="click">
        <template #reference>
          <el-button class="edit" size="large" type="primary" circle><icon-gis-measure /></el-button>
        </template>
        <div>
          <el-button size="large" type="primary" name="Length" @click="sgTool.measureLine()"
            circle><icon-gis-measure-line /></el-button>
          <el-button size="large" type="primary" name="Area" @click="sgTool.measurePolygon()"
            circle><icon-gis-measure-area /></el-button>
        </div>
      </el-popover>
      <el-button class="edit" size="large" type="primary" @click="clear()" circle><icon-icon-park-outline-clear-format /></el-button>
      <el-button class="edit" size="large" type="primary" @click="zoomIn(sgMap)" circle><icon-gis-zoom-in /></el-button>
      <el-button class="edit" size="large" type="primary" @click="zoomOut(sgMap)" circle><icon-gis-zoom-out /></el-button>
    </div>
    <!-- 抽屉弹窗 -->
    <div :class='{ "itemCount": true, }' v-show="show">
      <a href="#" id="close" class="closer" @click="cancel">×</a>
      <table style="width: 100%" height="100">
        <thead>
          <tr>
            <th colspan="2">各监测点数据</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Name</td>
            <td>{{ proList.name }}</td>
          </tr>
          <tr>
            <td>Station</td>
            <td>{{ proList.station }}</td>
          </tr>
          <tr>
            <td>Lng.</td>
            <td>{{ proList.lng }}</td>
          </tr>
          <tr>
            <td>Lat.</td>
            <td>{{ proList.lat }}</td>
          </tr>
          <tr>
            <td>Height</td>
            <td>{{ proList.height }}</td>
          </tr>
          <tr>
            <td>Jan.</td>
            <td>{{ proList.year }}</td>
          </tr>
          <tr>
            <td>Jan.</td>
            <td>{{ proList.Jan }}</td>
          </tr>
          <tr>
            <td>Feb.</td>
            <td>{{ proList.Feb }}</td>
          </tr>
          <tr>
            <td>Mar.</td>
            <td>{{ proList.Mar }}</td>
          </tr>
          <tr>
            <td>Apr.</td>
            <td>{{ proList.Apr }}</td>
          </tr>
          <tr>
            <td>May</td>
            <td>{{ proList.May }}</td>
          </tr>
          <tr>
            <td>Jun.</td>
            <td>{{ proList.Jun }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
html,
body,
.map {
  position: relative;
  width: 100%;
  height: 100vh;
  margin: 0;
}

.tool {
  position: absolute;
  margin-left: 0 auto;
  margin-top: 90px;
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

/* 属性框 */
.itemCount {
  position: absolute;
  top: 59%;
  right: 0px;
  background: #0c0c66;
  background-size: 100% auto;
  height: 360px;
  padding: 10px;
  width: 300px;
  z-index: 2;
  font-style: normal;
  color: white;
  font-size: 13px;
  font-weight: bold;
}

th {
  font-size: 18px;
  text-align: center;
  vertical-align: top;
  height: 30px;
}

td {
  height: 28px;
  text-align: center;
  vertical-align: middle;

}

.closer {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
  color: white;
}
</style>./tools/sg