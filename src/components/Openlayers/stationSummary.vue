<template>
    <!-- 右边统计面板 -->
    <div class="station-right">
        <div class="station-collect">
            <div class="station-collect-item">
                <h2>{{ totalJson.total }} <span>个</span></h2>
                <p>基站总数</p>
            </div>
            <div class="station-collect-item">
                <h2>{{ totalJson.onlineNum }} <span>个</span></h2>
                <p>在线基站数</p>
            </div>
            <div class="station-collect-item">
                <h2>{{ totalJson.offlineNum }} <span>个</span></h2>
                <p>离线基站数</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getStationTotal } from '@/api/stationList'
let totalJson:any=ref({});
const getStationTotalFn = async () => {
    let _data = await getStationTotal({
        groupName: '',
        stationName: '',
        stationType: '',
    })
    let res = _data.data.data;
    totalJson.value = res;
}
getStationTotalFn();
</script>

<style lang="scss" scoped>
.station-right {
    position: absolute;
    top: 90px;
    right: 0px;
    writing-mode: vertical-rl;
    width: 0;
    max-height: calc(100vh - 90px);
    z-index: 9999;
    .btnClose {
        position: absolute;
        left: -16px;
        top: 50%;
        width: 16px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        background-color: #939399;
        border-radius: 6px 0 0 6px;
        margin-top: -25px;
        cursor: pointer;

        .el-icon {
            color: #fff;
            vertical-align: middle;

            svg:nth-child(2) {
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
        right: 0;
        z-index: 11;
        width: 16px;
        writing-mode: horizontal-tb;

        .receive-btn {
            display: block;
            width: 110px;
            height: 50px;
            line-height: 50px;
            background-color: #939399;
            border-radius: 6px 0 0 6px;
            margin-bottom: 5px;
            overflow: hidden;
            padding-left: 2px;
            color: #fff;
            cursor: pointer;
            text-align: left;
            margin-left: 0px;

            .el-icon {
                color: #fff;
                vertical-align: middle;
            }

            &:hover {
                animation: btnRightShow 0.5s;
                animation-iteration-count: 1;
                animation-fill-mode: forwards;
            }

            @keyframes btnRightShow {
                from {
                    margin-left: 0px;
                    background-color: #939399;
                }

                to {
                    margin-left: -94px;
                    background-color: #0c0c66;
                }
            }
        }
    }

    &.fadein {
        animation: move_back_right 1s normal forwards ease-in-out;
    }

    @-webkit-keyframes move_back_right {
        from {
            margin-right: -410px;
        }

        to {
            margin-right: 0px;
        }
    }

    @keyframes move_back_right {
        from {
            margin-right: -410px;
        }

        to {
            margin-right: 0px;
        }
    }
}
.station-collect {
    display: inline-block;
    vertical-align: top;
    background-color: #58585e;
    width: 480px;
    height: 72px;
    box-shadow: 0 0 20px var(--color) inset;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    overflow: hidden;
    margin: 0 10px;
    writing-mode: horizontal-tb;

    .station-collect-item {
        width: 160px;
        height: 72px;
        float: left;
        text-align: center;

        h2 {
            padding: 6px 0 0 0;
            margin: 0;
            font-size: 32px;
            color: #ffffff;
            display: block;
            line-height: 36px;

            span {
                font-size: 18px;
                font-weight: normal;
            }
        }

        p {
            padding: 0;
            margin: 0;
            font-size: 14px;
            color: #ffffff;
        }

        &:first-child {
            background-color: #0f0f80;

            h2 {
                color: #006aff;
            }
        }

        &:nth-child(2) {
            h2 {
                color: #1eb358;
            }
        }

        &:nth-child(3) {
            h2 {
                color: #dcdde0;
            }
        }
    }
}
</style>
