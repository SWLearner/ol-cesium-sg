/*
 * @Author: hjw
 * @Date: 2022-05-26 15:20:54
 * @LastEditTime: 2022-05-26 15:49:58
 * @LastEditors: hjw
 * @Description:
 * @FilePath: \mtxy-web-view-bigdata\src\utils\config.ts
 */
const FILED_TYPE = {
  name: '名称',
  id: '编号',
  // version: '版本',
  railwayname: '轨道名',
  railway_name: '轨道名',
  linedes: '方向',
  // priority: '级别',
  location: '位置',
  // bianhao: '编号',
  // createtime: '创建时间',
  // lastupdatetime: '更新时间',
  // createuserid: '创建人员编号',
  // lastupdateuserid: '更新人员编号',
  // remark: '备注',
  layername: '类型',
  layerName: '类型',
  //gxrq: '更新时间',
  qdlc: '区段里程',
  jsdwz: '接收端位置',
  fsdwz: '发送端位置',
  zp: '载频',
  cd: '长度',
  // jlx: '状态',
  gzmxb: '工作门行别',
  gzmlc: '工作面里程',
  doorname: '名称',
  stationName: '基站名称',
  groupName: '分组名称',
  sn: 'S/N号',
  staType: '类型',
  keeperNames: '保管人员',
  netPhone: '联系电话',
  description: '站点描述',
  planBeginTime: '开始',
  planEndTime: '结束',
  usersName: '人员',
  room_name: '机房名称',
  route_des: '线路',
  address_des: '机房位置',
  longitude: '经度',
  latitude: '维度',
  show_name: '名称'
}
interface staDataType{
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
export { FILED_TYPE,staDataType }
