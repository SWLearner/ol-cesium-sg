<script setup lang="ts">
import { onMounted, Ref } from 'vue';
import * as Cesium from 'cesium'
import { ref } from 'vue'
import { Edit } from '@element-plus/icons-vue'
import { tdtImg, tdtCia, tdtVec, tdtCva, gaodeLayer, gdzjLayer, geoq} from './tools/cesiumDatas'
import { getFeature,measurePolyline, measurePolygon,editEntity,clear } from "./tools/cesium"
import {CesiumDrawTool} from './tools/cesiumTool.ts'
let tool:CesiumDrawTool;
let viewer: Cesium.Viewer;
//是否展示信息框数据
let myShow: Ref<boolean> = ref(false);
//是否显示3dtile
let show: boolean = false;
// 存储信息框数据
interface Data {
    Bin: string,
    DOITT_ID: string,
    SOURCE_ID: string,
    Lng: string,
    Lat: string,
    Height: string,
    ter_Height: string
}
let proList = ref<Data>(
    {
        Bin: "339249",
        DOITT_ID: "412492",
        SOURCE_ID: "19210033463",
        Lng: "-74.01",
        Lat: "40.65",
        Height: "11.71",
        ter_Height: "-12.28"
    }
);
//
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5ZDljOTg3Yy03ZDkxLTRkNTAtODhhYy03ZDIzNTU0YzgxZjYiLCJpZCI6MTMxNzg4LCJpYXQiOjE2ODA0ODg3NzB9.BK0bnFs_lhI-RLOZNMBxiOyGI8ZOGwG7Cok07TECti0'
onMounted(() => {
    iniMap();
})
function iniMap() {
    viewer = new Cesium.Viewer('cesiumContainer', {
        animation: false,//左下角的仪表，动画小控件
        baseLayerPicker: true,//图层选择器
        fullscreenButton: true,//全屏显示
        vrButton: false,//
        geocoder: true,//查询控件
        homeButton: true,
        infoBox: false,//显示信息框
        sceneModePicker: true,//3D/2D选择器
        terrain: Cesium.Terrain.fromWorldTerrain(),
        //显示模型阴影
        shadows: true
    });
    viewer.scene.skyAtmosphere=new Cesium.SkyAtmosphere();
    viewer.scene.fog=new Cesium.Fog();
    viewer.scene.sun=new Cesium.Sun();
    // viewer.scene.skyBox=new Cesium.SkyBox();
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(112.96,
            28.13,
            753), //设置位置
    });
    tool=new CesiumDrawTool(viewer);
}

function cancel() {
    myShow.value = !myShow.value;
}
function showTile() {
    show = !show;
    // console.log("3",viewer.scene.primitives.show)
    // console.log("1",viewer.scene.primitives)
    if (show === true) {
        if (viewer.scene.primitives.show === false) {
            viewer.scene.primitives.show = true
        } else {
            getFeature(viewer, proList.value, myShow);
        }
    }
    if (show === false) {
        viewer.scene.primitives.show = false
        myShow.value = false
    }
}
function showLayers(name: any[]) {
    for (let i = 0; i < name.length; i++) {
        viewer.imageryLayers.addImageryProvider(name[i]);
    }
}
function removeLayers() {
    // console.log(viewer.imageryLayers)
    for (let i = 1; i < viewer.imageryLayers.length; i++) {
        viewer.imageryLayers._layers[i].show = false
    }
}
function zoomIn() {
    let position = viewer.camera.position;
    let cameraHeight = viewer.scene.globe.ellipsoid.cartesianToCartographic(position).height;
    // 每次放大 20 倍，参数可改  
    let moveRate = cameraHeight / 3.0;
    viewer.camera.moveForward(moveRate);
}
function zoomOut() {
    let position = viewer.camera.position;
    let cameraHeight = viewer.scene.globe.ellipsoid.cartesianToCartographic(position).height;
    // 每次缩小 20 倍，参数可改  
    let moveRate = cameraHeight / 3.0;
    viewer.camera.moveBackward(moveRate);
}
</script>

<template>
    <div class="map">
        <div id="cesiumContainer" class="cesiumMap">
            <div class="tool">
                <el-popover class='popover' placement="left" width=280px trigger="click">
                    <template #reference>
                        <el-button class="edit" size="large" type="primary" circle><icon-gis-globe /></el-button>
                    </template>
                    <div>
                        <!-- :icon="EarthAsia"  -->
                        <el-button size="large" type="primary" name="Point" @click="showLayers([tdtVec, tdtCva])"
                            circle>矢量</el-button>
                        <el-button size="large" type="primary" name="Point" @click="showLayers([tdtImg, tdtCia])"
                            circle>影像</el-button>
                        <el-button size="large" type="primary" name="Point" @click="showLayers([gaodeLayer, gdzjLayer])"
                            circle>高德</el-button>
                        <!-- <el-button size="large" type="primary" name="Point" @click="showLayers([bdLayer])"
                            circle>百度</el-button> -->
                        <el-button size="large" type="primary" name="Point" @click="showLayers([geoq])"
                            circle>智图</el-button>
                        <el-button size="large" type="primary" name="Point" @click="removeLayers()" circle>原图</el-button>
                    </div>
                </el-popover>
                <el-button class="edit" size="large" type="primary" @click="showTile()"
                    circle><icon-gis-layer-stack /></el-button>
                <el-popover class='popover' placement="left" width=240px trigger="click">
                    <template #reference>
                        <el-button class="edit" size="large" type="primary" :icon="Edit" circle />
                    </template>
                    <div>
                        <el-button size="large" type="primary" name="Point" @click="tool.draw('Point')"
                            circle><icon-gis-poi-map /></el-button>
                        <el-button size="large" type="primary" name="LineString" @click="tool.draw('LineString')"
                            circle><icon-gis-polyline-pt /></el-button>
                        <el-button size="large" type="primary" name="Polygon" @click="tool.draw('Polygon')"
                            circle><icon-gis-polygon-pt /></el-button>
                        <el-button size="large" type="primary" name="move" @click="editEntity(viewer)"
                            circle><icon-tabler-hand-move/></el-button>
                    </div>
                </el-popover>
                <el-popover class='popover' placement="left" width=120px trigger="click">
                    <template #reference>
                        <el-button class="edit" size="large" type="primary" circle><icon-gis-measure /></el-button>
                    </template>
                    <div>
                        <el-button size="large" type="primary" name="Length" @click="measurePolyline(viewer)"
                            circle><icon-gis-measure-line /></el-button>
                        <el-button size="large" type="primary" name="Area" @click="measurePolygon(viewer)"
                            circle><icon-gis-measure-area /></el-button>
                    </div>
                </el-popover>
                <el-button class="edit" size="large" type="primary" @click="clear(viewer)" circle><icon-icon-park-outline-clear-format /></el-button>
                <el-button class="edit" size="large" type="primary" @click="zoomIn()"
                    circle><icon-gis-zoom-in /></el-button>
                <el-button class="edit" size="large" type="primary" @click="zoomOut()"
                    circle><icon-gis-zoom-out /></el-button>
            </div>
            <!-- 信息弹窗 -->
            <div :class='{ "itemCount": true, }' v-show="myShow">
                <a href="#" id="close" class="closer" @click="cancel">×</a>
                <table class="cesium-infoBox-defaultTable">
                    <thead>
                        <tr>
                            <th colspan="2">各监测点数据</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>BIN</td>
                            <td>{{ proList.Bin }}</td>
                        </tr>
                        <tr>
                            <td>DOITT ID</td>
                            <td>{{ proList.DOITT_ID }}</td>
                        </tr>
                        <tr>
                            <td>SOURCE ID</td>
                            <td>{{ proList.SOURCE_ID }}</td>
                        </tr>
                        <tr>
                            <td>Longitude</td>
                            <td>{{ proList.Lng }}</td>
                        </tr>
                        <tr>
                            <td>Latitude</td>
                            <td>{{ proList.Lat }}</td>
                        </tr>
                        <tr>
                            <td>Height</td>
                            <td>{{ proList.Height }}</td>
                        </tr>
                        <tr>
                            <td>Terrain Height</td>
                            <td>{{ proList.ter_Height }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<style scoped>
html,
body,
.map {
    position: relative;
    width: 100%;
    height: 100%;
}

.cesiumMap {
    position: absolute;
    text-decoration-style: none;
    width: 100vw;
    height: 100vh;
    margin: 0;
}

.tool {
    position: absolute;
    margin-left: 0 auto;
    margin-top: 50px;
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
    top: 68%;
    right: 0px;
    background: #0c0c66;
    background-size: 100% auto;
    height: 250px;
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
    width: 160px;
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
</style>
./cesium