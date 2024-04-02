import { Feature } from 'ol';
import { Vector as VectorLayer } from 'ol/layer.js';
// import { Vector as VectorSource,VectorSourceEvent } from 'ol/source.js';
import VectorSource, { VectorSourceEvent } from 'ol/source/Vector'
import { Style, Icon, Text, Stroke, Fill } from 'ol/style';
import GeoJSON from 'ol/format/GeoJSON';
import Point from 'ol/geom/Point'
//station
import { getStationDataNew, getAllIcon } from '@/api/stationList'
import { fromLonLat } from 'ol/proj';
import { easeOut } from 'ol/easing'
import CircleStyle from 'ol/style/Circle'
import { getVectorContext } from 'ol/render'
import VRSOnlineIcon from '@/assets/imgs/vrsOnline.svg'
import VRSOfflineIcon from '@/assets/imgs/vrsOffline.svg'
const windowHost =
    window.location.host.indexOf('localhost') != -1
        ? 'http://10.6.2.204'
        : window.location.protocol + '//' + window.location.host
// import { ref } from 'vue'
//弹窗
import Overlay from 'ol/Overlay'
import { Coordinate } from 'ol/coordinate'
//监测点数据图层

const createLabelStyle: any = function (feature: Feature) {
    return new Style({
        image: new Icon(

            {
                //设置图标点
                anchor: [0.5, 60],
                //图标起点
                anchorOrigin: 'top-right',
                //指定x值为图标点的x值
                anchorXUnits: 'fraction',
                //指定Y值为像素的值
                anchorYUnits: 'pixels',
                //偏移
                offsetOrigin: 'top-right',
                // offset:[0,10],
                //图标缩放比例
                scale: 0.6,
                //透明度
                opacity: 0.75,
                //图标的url
                src: '../poi.png',
            }),
        text: new Text({
            //位置
            textAlign: 'center',
            //基准线
            textBaseline: 'middle',
            //文字样式
            font: 'normal 14px 微软雅黑',
            //文本内容
            text: feature.get('stationName'),
            //文本填充样式（即文字颜色）
            fill: new Fill({ color: '#aa3300' }),
            stroke: new Stroke({ color: '#ffcc33', width: 2 })
        })
    });
}

export const pointLayer = new VectorLayer({
    source: new VectorSource({
        url: "../data.geojson",
        format: new GeoJSON(),
    }),
    style: createLabelStyle
});

//stations数据
let vectorSource: any = null
let vectorLayer: any = null
export const getstationStatus2d = async (map: any) => {
    if (!map) return
    //获取基站数据
    let _data: any = await getStationDataNew({
        groupName: '',
        stationName: '',
        stationType: '',
    })
    let features = _data.data.data;
    // console.log('features', features[0])
    // console.log('positionWkt',changeText(features[0].positionWkt))
    // console.log('tempPoints', tempPoints[0])
    //将矢量点要素添加到数据源中
    vectorSource = new VectorSource({
        loader: () => {
            //根据坐标构造几何点
            const tempPoints = features.map(({
                positionWkt,
                id,
                stationName,
                groupName,
                description,
                status,
                stationType,
                sn,
                keeperNames,
                netPhone
            }) => {
                const feature = new Feature({


                    geometry: new Point(fromLonLat(changeText(positionWkt))),
                    id,
                    stationName,
                    groupName,
                    description,
                    status,
                    stationType,
                    sn,
                    keeperNames,
                    netPhone,
                    positionWkt,
                    stationPoint: 'stationPoint'
                })
                feature.setId(id)
                return feature
            })
            vectorSource.addFeatures(tempPoints);
            vectorSource.dispatchEvent(new VectorSourceEvent('featuresloadend'))
        }
    });
    //矢量标注图层

    // 获取所有图标
    let res = await getAllIcon()
    const allIconData = res.data.data
    //从allIconData过滤出基站图标
    const icons = allIconData.filter((item: any) => {
        return item.name === 'baseStation';
    })[0]?.icons
    // console.log('图标', icons)
    vectorLayer = new VectorLayer({
        source: vectorSource,
        style: (feature, resolution) => {
            const { status, description } = feature.getProperties()
            const scale = map.getView().getZoomForResolution(resolution) / 10
            return new Style({
                image: new Icon({
                    src:
                        status === 1
                            ? icons[0]?.iconUrl
                                ? windowHost + icons[0]?.iconUrl
                                : VRSOnlineIcon
                            : icons[1]?.iconUrl
                                ? windowHost + icons[1]?.iconUrl
                                : VRSOfflineIcon,
                    anchor: [0.5, 1],
                    scale: (32 / 24) * scale // SVG 图标默认为 24x24
                }),
                text: new Text({
                    text: description || '',
                    textAlign: 'center',
                    font: '16px sans-serif',
                    fill: new Fill({ color: 'white' }),
                    stroke: new Stroke({ color: '#0c0b0b' }),
                    // fill: new Fill({ color: '#0c0b0b' }),
                    offsetY: 8 * scale,
                    scale
                })
            })
        }
    });
    map.addLayer(vectorLayer);

    //绘制闪烁动画
    const duration = 3000
    const startRadius = 1
    const endRadius = 20
    const initTime = new Date().getTime()
    const fps = 3
    let isFreeze = false
    let renderListener: any = null
    renderListener = vectorLayer.on('prerender', (event: any) => {
        // 切换页面后终止动效
        const elapsed = (event.frameState.time - initTime) % duration
        const elapsedRatio = elapsed / duration
        const opacity = easeOut(1 - elapsedRatio)
        const vectorContext = getVectorContext(event)
        const scale = map.getView().getZoom() / 8
        const width = 1 + opacity
        const radius = (startRadius + (endRadius - startRadius) * easeOut(elapsedRatio)) * scale
        const onlineStyle = new Style({
            image: new CircleStyle({
                radius,
                stroke: new Stroke({
                    color: `rgba(25, 174, 0, ${opacity})`,
                    width
                })
            })
        })

        const offlineStyle = new Style({
            image: new CircleStyle({
                radius,
                stroke: new Stroke({
                    // color: `rgba(255, 51, 14, ${opacity})`,
                    color: `rgba(220, 221, 224, ${opacity})`,

                    width
                })
            })
        })
        vectorSource.getFeatures().forEach(feature => {
            const { status } = feature.getProperties()
            vectorContext.setStyle(status === 1 ? onlineStyle : offlineStyle)
            vectorContext.drawGeometry(feature.getGeometry())
        });
        if (!isFreeze) {
            setTimeout(() => {
                isFreeze = false
                map.render()
            }, (1000 / fps));
            isFreeze = true
        }

    })
}

//从数据中提取点坐标
function changeText(positionWkt: any) {
    let arr = positionWkt.slice(6, positionWkt.length - 1).split(' ')
    return [arr[0] * 1, arr[1] * 1]
}
/**
 * 缩放类型
 * @enum {number}
 */
const ZoomTypes = {
    /**
     * 缩放至全图
     */
    FULL: 0,
    /**
     * 缩放至单个基站
     */
    SINGLE: 1
}
/**
* 默认范围
*/
const defaultExtent = [73, 3, 135, 53]
/**
 * Determine if an extent is empty.
 * @param {Extent} extent Extent.
 * @return {boolean} Is empty.
 * @api
 */
export function isEmpty(extent: any) {
    return extent[2] < extent[0] || extent[3] < extent[1];
}
export function zoomTo(zoomType = ZoomTypes.FULL, id: any, map: any) {
    if (zoomType === ZoomTypes.FULL) {
        const extent = isEmpty(vectorSource.getExtent()) ? defaultExtent : vectorSource.getExtent()
        map.getView().fit(extent, {
            padding: [64, 64, 64, 64]
        })
    } else if (zoomType === ZoomTypes.SINGLE) {
        const feature = vectorSource.getFeatureById(id)
        // 如果存在该基站要素，才缩放至基站，若无，则缩放至全图
        if (feature) {
            map.getView().fit(feature.getGeometry(), { maxZoom: 10 })
        } else {
            zoomTo(ZoomTypes.FULL, '', map)
        }
    }
}

//添加弹窗
export function setFeaOverlayerPos(coord: Coordinate,  map: any,id: string='ol-popup',) {
    if (!coord || coord.length == 0) {
        return 
    }
    let userAtrrOverlay: any
    let container: any
    if (!map.getOverlayById(id)) {
        container = document.getElementById(id)
        userAtrrOverlay = new Overlay({
            element: container,
            autoPan: false,
            //  positioning: 'top-right',
            offset: [20, -50],
            //   stopEvent:true,
            //  offset: offset,
            autoPanAnimation: {
                duration: 250
            }
        })
        map.addOverlay(userAtrrOverlay)
    }
    userAtrrOverlay.setPosition(coord)
    //  coord = transform(coord, 'EPSG:3857', 'EPSG:4326');
    //  console.log('coord',coord);
    
}