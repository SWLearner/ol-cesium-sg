<script setup lang="ts">
import { Map, } from 'ol';
import { onMounted, ref } from 'vue';
import { getstationStatus2d } from './tools/pointsData.ts'
import {  earthquakeVector } from './tools/earthquakesData.ts'
import { iniMap } from './tools/map'
import { fromLonLat } from 'ol/proj';
// import MapBrowserEvent from 'ol/MapBrowserEvent'
//工具栏
import Tool from './Tool.vue'
import dataBox from './dataBox.vue'
const target = "map";
//station
import stationList from './stationList.vue'
import stationSummary from './stationSummary.vue'
import popDialoge from './popDialoge.vue';
import { setFeaOverlayerPos } from './tools/pointsData'
import { mitter } from '@/utils/mitt';
//将4326转为3857
const center = fromLonLat([116.48, 39.62]);
let map: Map;

//监测点数据接口
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

// 该对象用于存储监测点数据
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
  map = iniMap(target, center);
  //要素加载
  // map.addLayer(pointLayer);
  map.addLayer(earthquakeVector);
  // map.on('singleclick', pointHandler);
  map.on('singleclick', singleHandler);
  getstationStatus2d(map)
})

interface staDataType{
  type:number,
  content:{
    label:{
      description:string,
      groupName:string,
      sn:string,
      staType:string,
      stationName:string
    },
    name:string,
    online:boolean,
    url:string,
    userId:string
  }
}

//单击获取监测点要素属性
function singleHandler(evt:any) {
  let pixel = map.getEventPixel(evt.originalEvent);
  let features: Array<staDataType> = [];
  let realcoordinate!: Array<number>;
  map.getFeaturesAtPixel(pixel, { hitTolerance: 1 }).map((item) => {
    let feature = item.getProperties()
    console.log('feature', feature)
    features.push({
      type: 2,
      content: {
        userId: feature.id,
        url: '',
        online: feature.status === 1 ? true : false,
        name: feature.stationName,
        label: {
          stationName: feature.stationName,
          groupName: feature.groupName,
          sn: feature.sn,
          staType: feature.stationType,
          description: feature.description,
        }
      }
    })
    if (!realcoordinate) {
     
      let arr = feature.positionWkt.slice(6, feature.positionWkt.length - 1).split(' ')
      let arr2 = [arr[0] * 1, arr[1] * 1]
      realcoordinate = arr2;
    }
  })
  mitter.emit('station', features);
  setFeaOverlayerPos(fromLonLat(realcoordinate), map);
}
// function dbHandler(evt: any) {
//   console.log('evt',evt)
//   let pixel = map.getEventPixel(evt.originalEvent);
//   // console.log("pixel",pixel)
//   map.forEachFeatureAtPixel(pixel, function (feature) {
//     // console.log(feature)
//     // console.log(layer)
//     const features = feature.getProperties();
//     console.log("ATTR", features);
//     const coordinate = evt.coordinate;
//     console.log("evt.coordinate", evt.coordinate);
//     const lngLat = transform(coordinate, 'EPSG:3857', 'EPSG:4326');
//     proList.value.name = features['站名'];
//     proList.value.station = features['区站号'];
//     proList.value.lng = Number(lngLat[0]).toFixed(2);
//     proList.value.lat = Number(lngLat[1]).toFixed(2);
//     proList.value.height = features['海拔'];
//     proList.value.year = features['年份'];
//     proList.value.Jan = features['1月'];
//     proList.value.Feb = features['2月'];
//     proList.value.Mar = features['3月'];
//     proList.value.Apr = features['4月'];
//     proList.value.May = features['5月'];
//     proList.value.Jun = features['6月'];
//     show.value = true;
//     // console.log("show.value", show.value)
//   })
// }


// function pointHandler(evt: any) {
//   const view = map.getView();
//   const viewResolution: any = view.getResolution();
//   const wmsLayers: TileLayer<TileWMS>[] = [china, station, railway, fence];

//   for (let i = 0; i < wmsLayers.length; i++) {
//     const url = wmsLayers[i].getSource()!.getFeatureInfoUrl(
//       evt.coordinate,
//       viewResolution,
//       'EPSG:3857',
//       {
//         'INFO_FORMAT': 'application/json',
//         'FEATURE_COUNT': '4',
//         // 'QUERY_LAYERS':china,railway,station,fence,
//       }
//     );
//     if (url) {
//       fetch(url)
//         .then(function (res) {
//           return res.json();
//         })
//         .then(function (data) {
//           console.log('i', i, data)
//           if (data.features.length !== 0) {
//             console.log(data.features.length)
//             console.log('features', data.features);
//           }
//         })
//     }
//   }

// }

</script>

<template>
  <div id="mymap">
    <div id="map" class="map">
      <Tool></Tool>
      <dataBox :proList="proList" v-model:show="show"></dataBox>
      <stationList></stationList>
      <stationSummary></stationSummary>
      <popDialoge></popDialoge>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* ol-zoom ol-unselectable ol-control
ol-rotate ol-unselectable ol-control ol-hidden
 */
 #mymap{
  width: 100%;
  height: 100%;
 }
.map {
  margin: 0;
  position: relative;
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  text-align: center;
  z-index: 2000;
}

svg {
  pointer-events: none;
}

.header {
  position: relative;
  width: 100%;
  height: 50px;
  background-color: rgb(12, 30, 95, 0.3);
  z-index: 1;
}

.center {
  position: absolute;
  margin-top: 0px;
  right: 45%;
  width: 300px;
  height: 50px;
  line-height: 150px;
  /* 颜色渐变设置梯形 */
  background: linear-gradient(289deg, transparent 10%, rgb(12, 30, 95, 0.7) 10%) 100% 0,
    linear-gradient(-289deg, transparent 10%, rgb(12, 30, 95, 0.7) 10%) 0 0;
  background-size: 50% 100%;
  background-repeat: no-repeat;
  line-height: 50px;
  overflow: hidden;
  font-style: normal;
  color: white;
  font-size: 20px;
  font-weight: bold;
  z-index: 2001;
  display: inline-block;
}
</style>