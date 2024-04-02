import { Map, Overlay, View } from 'ol';
import { Draw, Snap } from 'ol/interaction';
import { Vector as VectorSource } from 'ol/source.js';
import { getArea, getLength } from 'ol/sphere.js';
import { LineString, Polygon } from 'ol/geom';
import { Ref } from 'vue';
// import { getAllIcon,getStationArea, } from '@/api/stationList'
// import { Point,Circle,LineString,Polygon,MultiPoint,MultiLineString,MultiPolygon,GeometryCollection } from 'ol/geom';

// type myType=Point|Circle|LineString|Polygon|MultiPoint|MultiLineString|MultiPolygon|GeometryCollection|string

// 点、线、面绘画
/**
 * 
 * @param map 地图对象
 * @param draw 画笔
 * @param Type 绘画类型
 * @param source 绘画数据源
 * @param snap 捕捉手
 */
export function addInteractions(
    map: Map,
    draw: Ref<Draw>,
    Type: any,
    source: VectorSource,
    snap: Snap,
) {
    // 定义画笔
    draw.value = new Draw({
        source: source,
        type: Type
    });
    console.log('画', Type)
    // 在图上绘制
    map.addInteraction(draw.value);
    // 捕抓要素
    snap = new Snap({ source: source });
    map.addInteraction(snap);
}

/**
 * 
 * @param evt 事件
 * @param sketch 捕捉事件
 * @param helpTooltip 测量绘制提示Overlay
 * @param helpTooltipElement 量绘制提示HTML
 * @returns 
 */


/**
 * 
 * @param map 地图对象
 * @param draw 画笔
 * @param source 绘画数据源
 * @param sketch 捕捉事件
 * @param listener 监听事件
 * @param shapeType 绘画类型
 * @param helpTooltip 测量绘制提示Overlay
 * @param helpTooltipElement 测量绘制提示HTML
 * @param measureTooltip 测量结果显示Overlay
 * @param measureTooltipElement 测量结果显示HTML
 */
// 测量绘画
/*export function measure(
    map: Map,
    draw: Draw,
    source: VectorSource,
    sketch: any,
    listener: any,
    shapeType: string,
    helpTooltip: Overlay,
    helpTooltipElement: HTMLElement,
    measureTooltip: Overlay,
    measureTooltipElement: HTMLElement,
) {
    const type = shapeType == 'Area' ? 'Polygon' : 'LineString';
    draw = new Draw({
        source: source,
        type: type,
        style: new Style({
            fill: new Fill({
                color: 'rgba(255, 255, 255, 0.2)',
            }),
            stroke: new Stroke({
                color: 'rgba(0,0,0,0.5)',
                lineDash: [10, 10],
                width: 2,
            }),
            image: new CircleStyle({
                radius: 5,
                stroke: new Stroke({
                    color: 'rgba(0,0,0,0.7)',
                }),
                fill: new Fill({
                    color: 'rgba(255,255,255,0.25)',
                }),
            }),
        }),
    });
    map.addInteraction(draw);
    createMeasureTooltip(map, measureTooltip, measureTooltipElement);
    createHelpTooltip(map, helpTooltip, helpTooltipElement);


    draw.on('drawstart', function (evt: any) {
        sketch = evt.feature;
        // console.log("sketch",sketch);
        console.log("evt1",evt);
        // console.log("evt.feature",evt.feature);
        // console.log("evt.target",evt.target);
        let tooltipCoord = evt.coordinate;
        listener = sketch.on('change', function (evt: any) {
            console.log("evt2",evt);
            const geom = evt.target.values_.geometry;
            let output: string = "";
            if (geom instanceof Polygon) {
                output = formatArea(geom);
                tooltipCoord = geom.getInteriorPoint().getCoordinates();
            } else if (geom instanceof LineString) {
                output = formatLength(geom);
                tooltipCoord = geom.getLastCoordinate();
            }
            // console.log(output);
            measureTooltipElement.innerHTML = output;
            measureTooltip.setPosition(tooltipCoord);
        });
        // console.log('listener:' + listener);
    });
    draw.on('drawend', function () {
        measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
        measureTooltip.setOffset([0, -7]);
        sketch = null;
        measureTooltipElement.parentNode?.removeChild(measureTooltipElement);
        createMeasureTooltip(map, measureTooltip, measureTooltipElement);
        unByKey(listener);
    })
}*/

/**
 * 
 * @param map 地图对象
 * @param helpTooltip 测量绘制提示Overlay
 * @param helpTooltipElement 测量绘制提示HTML
 */
// 创建HTML
export function createTooltip(
    map: Map,
    helpTooltip: Overlay,
    helpTooltipElement: HTMLElement,
) {
    if (helpTooltip) {
        helpTooltipElement.parentNode?.removeChild(helpTooltipElement);
    }
    helpTooltipElement = document.createElement('div');
    helpTooltipElement.className = 'ol-tooltip hidden';
    helpTooltip = new Overlay({
        element: helpTooltipElement,
        offset: [15, 0],
        positioning: 'center-left',
    });
    // console.log(helpTooltip)
    map.addOverlay(helpTooltip);
}

/**
 * 
 * @param line 类型为LineString
 * @returns 返回对象为string类型
 */
// 长度单位换算
export const formatLength = function (line: LineString): string {
    const length: number = getLength(line);
    let output: string;
    if (length > 100) {
        output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
    } else {
        output = Math.round(length * 100) / 100 + ' ' + 'm';
    }
    return output;
};
/**
 * 
 * @param polygon 类型为Polygon
 * @returns  返回对象为string类型
 */
// 面积单位换算
export const formatArea = function (polygon: Polygon): string {
    const area: number = getArea(polygon);
    let output: string;
    if (area > 10000) {
        output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2<sup>';
    } else {
        output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2<sup>';
    }
    return output;
}

/**
 * 缩小
 * @param map 地图对象
 */
export function zoomOut(
    map: Map,
) {
    let view: View = map.getView();
    let zoom: any = view.getZoom();
    view.setZoom(zoom - 1)

}

/**
 * 放大
 * @param map 地图对象
 */
export function zoomIn(
    map: Map,
) {

    let view: View = map.getView();
    let zoom: any = view.getZoom();
    view.setZoom(zoom + 1)

}

/**
 * 切换地图函数
 * @param map 地图对象
 * @param name 切换到的图层名字
 */
export function showMap(
    map: Map,
    name: string[]
) {
    let layers = map.getLayers();
    console.log(layers);
    //最后两个分别为监测点数据图层、绘画要素图层,前两个为天地图图层，默认为显示
    for (let i = 2; i < layers.getLength() - 2; i++) {
        let layer = layers.item(i)
        layer.setVisible(false);
        let layerName = layer.getClassName();
        for (let j = 0; j < name.length; j++) {
            if (layerName == name[j]) {
                layer.setVisible(true);
            }
        }
    }
}

/**
 * 恢复显示天地图矢量图层，其他显示均设置为false
 * @param map 地图对象
 */
export function reShow(
    map: Map,
) {
    let layers = map.getLayers();
    //最后一个为绘画要素图层、前两个为默认显示的矢量以及标记天地图
    for (let i = 2; i < layers.getLength() - 2; i++) {
        let layer = layers.item(i)
        layer.setVisible(false);
    }
}



