<template>
    <!-- 左边面板 -->
    <div class="station-left fadein" ref="menuLeftPage">
        <div class="station-list-wrap1" v-show="state">
            <div class="btnClose" @click="showBox">
                <el-icon>
                    <ArrowRight />
                    <ArrowLeft />
                </el-icon>
            </div>
            <div class="station-list">
                <div class="title">基站列表</div>
                <div class="station-content">
                    <div class="form-item">
                        <el-select v-model="typeValue" clearable class="m-2" placeholder="请选择基站类型">
                            <el-option v-for="item in typeOptions" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                        <el-select v-model="grouping" clearable class="m-2" placeholder="请选择分组">
                            <el-option v-for="item in groupingOptions" :key="item" :value="item" :label="item">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="form-item">
                        <el-input v-model="stationName" class="name-input" clearable placeholder="请输入基站名称"
                            maxlength="32"></el-input>
                        <el-button type="info" plain @click="submitSearch">搜索</el-button>
                    </div>
                    <div class="stat-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th width="100">基站名称</th>
                                    <th width="100">分组名称</th>
                                    <th width="100">S/N号</th>
                                    <th width="80">类型</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in stationList" :key="'station' + index"
                                    @click="locateToMap(item)">
                                    <td width="100">
                                        <div class="station-name" :title="item.stationName">
                                            <b :class="item.status === 1 ? 'greem' : 'red'">●</b>
                                            {{ item.stationName }}
                                        </div>
                                    </td>
                                    <td width="100">
                                        <div class="station-group" :title="item.groupName">
                                            {{ item.groupName }}
                                        </div>
                                    </td>
                                    <td width="100">
                                        <div class="station-type" :title="item.sn">
                                            {{ item.sn }}
                                        </div>
                                    </td>
                                    <td width="80">
                                        <div>
                                            {{ item.stationType }}
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="station-tips"><b>●</b>在线 <b>●</b>离线</div>
                </div>
            </div>
        </div>
        <!-- 收起来的按钮 -->
        <div class="receive-btns">
            <div class="receive-btn" v-for="(item, index) in popHideList" :key="'leftBtn' + index"
                v-show="item.position === 'left'" @click="showPopBox">
                {{ item.resourceName }}<el-icon>
                    <ArrowRight />
                </el-icon>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
// import '@/assets/styles/var.scss'
import { ArrowRight, ArrowLeft } from '@element-plus/icons-vue'
//获取基站数据接口
import { layoutView, getStationDataNew, getGroupNameList } from "@/api/stationList"
import { setFeaOverlayerPos } from './tools/pointsData'
import { Map } from 'ol'
import { mitter } from '@/utils/mitt'
//地图对象
import { Coordinate } from 'ol/coordinate'
import { fromLonLat } from 'ol/proj';
import {useMap} from './tools/map'
let map:Map;
const state = ref(true)
//基站数据
const stationList: any = ref([])
//基站类型
const typeOptions: any = ref([])
typeOptions.value = ['vnet8']
//基站分组
const groupingOptions: any = ref([])

/*以下获取左中右面板数据*/
const leftList = ref(<any[]>[])
const centerList = ref(<any[]>[])
const rightList = ref(<any[]>[])
const getStationList = (val: any) => {
    let _list: any = []
    if (val && val.length > 0) {
        for (let i = 0; i < val.length; i++) {
            if (val[i].resourceCode) {
                val[i].component =
                    val[i].resourceCode === 'v-baseStation-user'
                        ? 'station-list'
                        : val[i].resourceCode === 'v-baseStation-online'
                            ? 'station-summary'
                            : ''
                _list.push(val[i])
            }
        }
    }
    return _list
}
const getPosition = async () => {
    let data = await layoutView('1525299095885848578')
    let res = data.data.data
    setTimeout(() => {
        leftList.value = getStationList(res.left)
        centerList.value = getStationList(res.center)
        rightList.value = getStationList(res.right)
    }, 100)
}
getPosition();

/*以下实现数据面板隐藏*/
// 隐藏数据面板
const popHideList: any = ref('[]')

const showBox = () => {
    state.value = false
    console.log('leftList.value', leftList.value)
    popHideList.value = leftList.value

    console.log('popHideList.value', popHideList.value)
}
const showPopBox = () => {
    state.value = true
    popHideList.value = [];
    console.log('popHideList.value2', popHideList.value)
}

/*以下实现表格数据展示*/

// 获取基站数据
const typeValue = ref('')
const grouping = ref('')
const stationName = ref('')
const getData = async () => {
    let _data: any = await getStationDataNew({
        groupName: grouping.value,
        stationName: stationName.value,
        stationType: typeValue.value,
    })
    let res = _data.data.data;
    //存储基站数据
    stationList.value = res
}
getData();

// 获取分组列表
const getGroupNameListFn = async () => {
    let _data: any = await getGroupNameList();
    let res = _data.data.data;
    groupingOptions.value = res
}
getGroupNameListFn()
//搜索按钮实现———根据条件再次获取数据
const submitSearch = () => {
    getData();
}

/*点击表格数据定位到相应的监测点*/

const locateToMap = (item: any) => {
    //根据监测点坐标定位
    let arr = item.positionWkt.slice(6, item.positionWkt.length - 1).split(' ')
    let arr2 = [arr[0] * 1, arr[1] * 1]
    //根据监测点坐标显示弹窗
    let temp = [{
        type: 2,
        content: {
            userId: item.id,
            url: '',
            online: item.status === 1 ? true : false,
            name: item.stationName,
            label: {
                stationName: item.stationName,
                groupName: item.groupName,
                sn: item.sn,
                staType: item.stationType,
                description: item.description,
            }
        }
    },
    ]
    mitter.emit('station', temp);
    map=useMap();
    locateByPoint(arr2, map,14);
    console.log('item',item)
    setFeaOverlayerPos(fromLonLat(arr2), map);
}

function locateByPoint(coordinate: Coordinate, map: Map, Zoom?: number): void {
    let realzoom
    if (Zoom) {
        map.getView().getZoom()! > Zoom ? (realzoom = map.getView().getZoom()) : (realzoom = Zoom)
    } else {
        realzoom = map.getView().getZoom()
    }
    map.getView().animate({ center: fromLonLat(coordinate), duration: 2000 }, { zoom: realzoom })
    // map.getView().animate({
    //   zoom: Zoom,
    //   center: coordinate, //动画结尾的视图中心
    //   duration: 2000 //动画的持续时间
    // })
    //map.getView().setCenter(coordinate)
}
</script>

<style lang="scss" scoped>
.station-left {
    position: absolute;
    top: 90px;
    left: 0px;
    width: 0;
    max-height: calc(100vh - 90px);
    writing-mode: vertical-lr;
    z-index: 999999;

    .btnClose {
        position: absolute;
        right: -16px;
        top: 50%;
        width: 16px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        background-color: #939399;
        border-radius: 0 6px 6px 0;
        margin-top: -25px;
        cursor: pointer;

        .el-icon {
            color: #fff;
            vertical-align: middle;

            svg:first-child {
                display: none;
            }
        }

        &:hover {
            background-color: #0c0c66;
        }
    }


    .receive-btns {
        position: absolute;
        top: 100px;
        left: 0;
        z-index: 11;
        writing-mode: horizontal-tb;

        .receive-btn {
            display: block;
            width: 110px;
            height: 50px;
            line-height: 50px;
            text-align: right;
            background-color: #939399;
            border-radius: 0 6px 6px 0;
            padding-right: 2px;
            overflow: hidden;
            color: #fff;
            margin-bottom: 5px;
            margin-left: -94px;
            cursor: pointer;

            .el-icon {
                color: #fff;
                vertical-align: middle;
            }

            &:hover {
                animation: btnLeftShow 0.5s;
                animation-iteration-count: 1;
                animation-fill-mode: forwards;
            }

            @keyframes btnLeftShow {
                from {
                    margin-left: -94px;
                    background-color: #939399;
                }

                to {
                    margin-left: 0;
                    background-color: #0c0c66;
                }
            }
        }
    }
}

.station-list-wrap1 {
    display: inline-block;
    vertical-align: top;
    writing-mode: horizontal-tb;
    position: relative;
    width: 400px;
    z-index: 10001;
    margin: 0 10px;

    .station-list {
        width: 400px;
        height: calc(100vh - 100px);
        background-color: #68666b;
        // 
        box-shadow: 0 0 20px rgb(12, 12, 102) inset, 0 0 10px rgba(0, 0, 0, 0.3);
        -webkit-box-shadow: 0 0 20px rgb(12, 12, 102) inset, 0 0 10px rgba(0, 0, 0, 0.3);
        border-radius: 10px;

        .title {
            border-radius: 10px 10px 0 0;
            height: 40px;
            color: #ffffff;
            font-size: 16px;
            line-height: 40px;
            padding: 0 16px;
            text-align: left;
            background-color: rgb(12, 12, 102);

        }

        .station-content {
            .form-item {
                .el-select {
                    width: 186px;
                    padding-right: 2px;
                    margin: 6px;
                }

                .name-input {
                    width: 308px;
                    margin: 0 14px 0 7px;
                }

                .el-button--info {
                    margin-right: 10px;
                }
            }

            .stat-wrap {
                margin: 6px 7px 0 7px;

                .station-name {
                    width: 90px;
                    text-align: left;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    padding-left: 10px;
                }

                .station-group,
                .station-type {
                    width: 80px;
                    text-align: center;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .station-group {
                    width: 100px;
                }

                .greem {
                    color: #1eb358;
                }

                .red {
                    color: #dcdde0;
                }

                table {
                    width: 100%;
                    padding: 0;
                    margin: 0;
                    border: 0;
                    text-align: center;
                    border-collapse: separate;
                    border-spacing: 0px 2px;

                    thead {
                        display: block;
                        width: 100%;
                        table-layout: fixed;
                        background-color: #fff;
                        border-radius: 3px;
                        line-height: 30px;

                        tr {
                            display: table;
                            width: 100%;
                            height: 30px;
                            line-height: 30px;
                        }
                    }

                    tbody {
                        display: block;
                        width: 100%;
                        table-layout: fixed;
                        height: calc(100vh - 280px);
                        overflow-y: auto;

                        tr {
                            display: table;
                            width: 100%;
                            height: 30px;
                            line-height: 30px;
                            border-radius: 3px;
                            cursor: pointer;
                            color: #ffffff;

                            td {
                                background-color: rgba(97, 97, 97, 0.5);

                                b {
                                    display: inline-block;
                                    font-size: 22px;
                                    vertical-align: middle;
                                    margin: -6px 5px 0 0;
                                }
                            }

                            &:hover {
                                color: #333333;

                                td {
                                    background-color: rgba(255, 255, 255, 0.5);
                                }
                            }
                        }
                    }
                }
            }

            .station-tips {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 400px;
                line-height: 32px;
                text-align: center;
                color: #ffffff;

                b {
                    font-size: 22px;
                    display: inline-block;
                    padding: 0 5px;
                    vertical-align: middle;
                    margin-top: -5px;
                    color: #dcdde0;

                    &:first-child {
                        color: #1eb358;
                    }
                }
            }
        }
    }
}
</style>
