import { getUserInfo, getNavData, layoutView, getStationDataNew } from "@/api/stationList"
import { ref } from "vue"

// // 获取用户信息
// const getUserConfigure = async () => {
//   const userInfo = await getUserInfo()
//   console.log('userInfo', userInfo);
//   localStorage.setItem('userInfo', JSON.stringify(userInfo))
//   localStorage.setItem('customerName', userInfo.customerName)
// }
// getUserConfigure();
// const menuData = await getNavData({
//   systemId: 1484711447743365121
// })
// console.log('menuData', menuData);
//获取左中右数据
const leftList = ref(<any[]>[])
const centerList = ref(<any[]>[])
const rightList = ref(<any[]>[])
const getStationList = (val: any) => {
    console.log('val', val)
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
    console.log('res', res);
    setTimeout(() => {
        leftList.value = getStationList(res.left)
        centerList.value = getStationList(res.center)
        rightList.value = getStationList(res.right)
    }, 100)
}
getPosition();
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
    console.log('_data', _data)
}
getData();