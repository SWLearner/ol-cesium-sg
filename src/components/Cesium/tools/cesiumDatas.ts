import * as Cesium from 'cesium'

const TDU_Key = "f47da4a06995b322a237c9278a84f12c"//天地图申请的密钥

//在线天地图影像服务地址(墨卡托投影)
export const TDT_IMG_W = "http://{s}.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0" +
    "&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
    "&style=default&format=tiles&tk=" + TDU_Key;
//在线天地图矢量地图服务(墨卡托投影) 
export const TDT_VEC_W = "http://{s}.tianditu.gov.cn/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0" +
    "&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
    "&style=default&format=tiles&tk=" + TDU_Key;
//在线天地图影像中文标记服务(墨卡托投影)  
export const TDT_CIA_W = "http://{s}.tianditu.gov.cn/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0" +
    "&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
    "&style=default.jpg&tk=" + TDU_Key
//在线天地图矢量中文标记服务(墨卡托投影)            
export const TDT_CVA_W = "http://{s}.tianditu.gov.cn/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0" +
    "&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
    "&style=default.jpg&tk=" + TDU_Key;
//提供由符合 WMTS 1.0.0 的服务器提供的切片影像。
export const tdtVec = new Cesium.WebMapTileServiceImageryProvider({   //调用影像中文服务
    url: TDT_VEC_W,//url地址
    layer: "vec_w",	//WMTS请求的层名称
    style: "default",//WMTS请求的样式名称
    format: "tiles",//MIME类型，用于从服务器检索图像
    tileMatrixSetID: "GoogleMapsCompatible",//	用于WMTS请求的TileMatrixSet的标识符
    subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],//天地图8个服务器
    // minimumLevel: 0,//最小层级
    // maximumLevel: 18,//最大层级
})
//提供由 Web 地图服务 （WMS） 服务器托管的切片影像。
export const tdtCva = new Cesium.WebMapTileServiceImageryProvider({   //调用影像中文注记服务
    url: TDT_CVA_W,
    layer: "cva_w",
    style: "default",
    format: "tiles",
    tileMatrixSetID: "GoogleMapsCompatible",
    subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],//天地图8个服务器
    // minimumLevel: 0,
    // maximumLevel: 18,
})
//提供由符合 WMTS 1.0.0 的服务器提供的切片影像。
export const tdtImg = new Cesium.WebMapTileServiceImageryProvider({   //调用影像中文服务
    url: TDT_IMG_W,//url地址
    layer: "img_w",	//WMTS请求的层名称
    style: "default",//WMTS请求的样式名称
    format: "tiles",//MIME类型，用于从服务器检索图像
    tileMatrixSetID: "GoogleMapsCompatible",//	用于WMTS请求的TileMatrixSet的标识符
    subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],//天地图8个服务器
    // minimumLevel: 0,//最小层级
    // maximumLevel: 18,//最大层级
})
//提供由 Web 地图服务 （WMS） 服务器托管的切片影像。
export const tdtCia = new Cesium.WebMapTileServiceImageryProvider({   //调用影像中文注记服务
    url: TDT_CIA_W,
    layer: "cia_w",
    style: "default",
    format: "tiles",
    tileMatrixSetID: "GoogleMapsCompatible",
    subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],//天地图8个服务器
    // minimumLevel: 0,
    // maximumLevel: 18,
})

//高德地图以及注记
export const gaodeLayer = new Cesium.UrlTemplateImageryProvider({
    url: "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
    // minimumLevel: 3,
    // maximumLevel: 18
})
export const gdzjLayer = new Cesium.UrlTemplateImageryProvider({
    url: "http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",
    // minimumLevel: 3,
    // maximumLevel: 18
})

//智图
export const geoq = new Cesium.UrlTemplateImageryProvider({
    url: "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}",
    // minimumLevel: 3,
    // maximumLevel: 18
})
//百度地图
export const bdLayer = getBd()

async function getBd() {
    const bd = await Cesium.BingMapsImageryProvider.fromUrl(
        "https://api.map.baidu.com/api?v=3.0", {
        key: "IFapMVrArkLIMEILg215jvakhST5csSA"
    }
    )
    return bd
} 
