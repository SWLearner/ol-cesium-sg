<template>
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
</template>

<script setup lang="ts">
//监测点数据接口
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
type Props = {
    proList: Data,
    show:boolean
}
const{proList,show}=defineProps<Props>();
const emit = defineEmits(['update:show'])
function cancel() {
    emit('update:show',false)
}
</script>

<style scoped>
/* 属性框 */
.itemCount {
  position: absolute;
  top: 59%;
  right: 0px;
  background: #0c0c66;
  background-size: 100% auto;
  height: 360px;
  padding: 10px;
  width: 230px;
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
</style>
