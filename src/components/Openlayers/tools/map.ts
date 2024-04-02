import { Map, Overlay, View } from 'ol';
import { Draw, Snap, } from 'ol/interaction';
import { Circle as CircleStyle } from 'ol/style.js';
import { unByKey } from 'ol/Observable';
import { Vector as VectorSource } from 'ol/source.js';//TileWMS,
import { Vector as VectorLayer } from 'ol/layer.js';
import { defaults } from 'ol/control/defaults'
import { Modify } from 'ol/interaction.js';
import { LineString, Polygon } from 'ol/geom';
import { Style, Stroke, Fill } from 'ol/style';
// import { fromLonLat, transform } from 'ol/proj';
import { formatLength, formatArea } from './openlayers.ts'
import { TiandiMap_vec, TiandiMap_cva, } from './layerDatas.ts'//TiandiMap_img, TiandiMap_cia, GaodeLayer, BaiduLayer, geoq
import { reactive } from 'vue';

let draw: Draw ;
let snap: Snap;
let map: Map;
let view: View;
let source: VectorSource;
let vector: VectorLayer<VectorSource>;
// 根据测量类型不同提示信息不同
const continuePolygonMsg: string = 'Click to continue drawing the polygon';
const continueLineStringMsg: string = 'Click to continue drawing the LineString';
let measureToolPops:any[]=[];
const state = reactive<any>({
    shapeType: 'Point',
    // 信息提示：HTML、value
    helpTooltip: '',
    helpTooltipElement: null,
    // 测量结果显示：HTML、value
    measureTooltipElement: null,
    measureTooltip: null,
    sketch: null,
    listener: null,
})
let typeSelect: string = "";
export function useMap() {
    return map
}
export function iniMap(
    target: HTMLElement | string,
    center: number[],
) {
    const modify = initVector();
    view = new View({
        center: center,
        zoom: 8,
    })
    map = new Map({
        target: target,
        layers: [
            TiandiMap_vec,
            TiandiMap_cva,
            // TiandiMap_img,
            // TiandiMap_cia,
            // GaodeLayer,
            // BaiduLayer,
            // geoq,

            // geoserver数据
            // china,
            // fence, railway, station,
            // earthquakeVector,

            //绘制图层
            vector

        ],
        view: view,
        controls: defaults({
            zoom: false,
            rotate: false
        }),
        // interactions:defaultInteractions().extend([
        //   new Select({
        //     condition:function(evt:any){
        //       return  evt.type=='singleclick';//evt.type=='pointermove'||
        //     },
        //     style:selectStyleFunction,
        //   }),
        // ]),
    });
    // 绘制要素
    map.addInteraction(modify);
    // map = map;
    return map;
}

export function buttonChange(type: string) {
    console.log('点击了')
    typeSelect = type;
    state.shapeType = typeSelect;
    map.removeInteraction(draw);
    map.removeInteraction(snap);
    // addInteractions();

    if ((typeSelect == "Area") || (typeSelect == "Length")) {
        measure();
    } else {
        state.shapeType = typeSelect;
        addInteractions();
    }
}
// 点、线、面绘画
export function addInteractions() {
    // 定义画笔
    draw = new Draw({
        source: source,
        type: state.shapeType,
    });
    // 在图上绘制
    map.addInteraction(draw);
    // 捕抓要素
    snap = new Snap({ source: source });
    map.addInteraction(snap);
}
const pointMoveHandler = function (evt: any) {
    if (evt.dragging) {
        return;//??
    }
    // 初始信息提示
    let helpMsg = 'click to start drawing';
    if (state.sketch) {
        // console.log(state.sketch)
        const geom = state.sketch.getGeometry();
        if (geom instanceof Polygon) {
            helpMsg = continuePolygonMsg;
        } else if (geom instanceof LineString) {
            helpMsg = continueLineStringMsg;
        }
    }
    // 将HTML放入到HTML中
    // HTML内容设置
    state.helpTooltipElement.innerHTML = helpMsg;
    // HTML位置设置
    state.helpTooltip.setPosition(evt.coordinate);
    state.helpTooltipElement.classList.remove('hidden');
}

const initVector = () => {
    source = new VectorSource();
    vector = new VectorLayer({
        source: source,
        style: {
            "fill-color": 'rgba(255,255,255,0.2)',
            "stroke-color": '#ffcc33',
            "stroke-width": 2,
            "circle-radius": 7,
            "circle-fill-color": '#ffcc33',
        }
    });
    // 绘制要素
    const modify = new Modify({ source: source });
    return modify;
}

// 测量绘画
export function measure() {

    map.on('pointermove', pointMoveHandler);
    // map.getViewport().addEventListener('mouseout', function () {
    //   state.helpTooltipElement.classList.add('hidden');
    // })
    const type = state.shapeType == 'Area' ? 'Polygon' : 'LineString';
    console.log("画", type)
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
    createMeasureTooltip();
    createHelpTooltip();
    draw.on('drawstart', changeToolHtml);
    draw.on('drawend', function () {
        map.un('pointermove', pointMoveHandler);
        state.helpTooltipElement.innerHTML=null;
        map.removeInteraction(draw);
        map.removeInteraction(snap);
        measureToolPops.push(state.measureTooltip);
        console.log("measureToolPops",measureToolPops)
        state.measureHelpElement = null;
        state.measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
        state.measureTooltip.setOffset([0, -7]);
        state.sketch = null;
        state.measureTooltipElement = null;
        state.measureHelpElement = null;
        console.log(state.measureTooltipElement);
        unByKey(state.listener);
    })
    function changeToolHtml(evt: any) {
        state.sketch = evt.feature;
        // console.log("state.sketch",state.sketch);
        // console.log("evt",evt);
        // console.log("evt.feature",evt.feature);
        // console.log("evt.target",evt.target);
        let tooltipCoord = evt.coordinate;
        state.listener = state.sketch.on('change', function (evt: any) {
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
            state.measureTooltipElement.innerHTML = output;
            state.measureTooltip.setPosition(tooltipCoord);
        });
        // console.log('listener:' + state.listener);
    }
}
export function clear(){
    map.removeInteraction(draw);
    map.removeInteraction(snap);
    source.clear();
    if(measureToolPops.length!==0){
        console.log('1',measureToolPops)
        measureToolPops.map((item:any)=>{
            item.setPosition(undefined);
        })
    }
    measureToolPops=[];
}
// 创建HTML
function createHelpTooltip() {
    if (state.helpTooltip) {
        state.helpTooltipElement.parentNode.remove(state.helpTooltipElement);
    }
    state.helpTooltipElement = document.createElement('div');
    state.helpTooltipElement.className = 'ol-tooltip hidden';
    state.helpTooltip = new Overlay({
        element: state.helpTooltipElement,
        offset: [15, 0],
        positioning: 'center-left',
    });
    // console.log(state.helpTooltip)
    map.addOverlay(state.helpTooltip);
}

function createMeasureTooltip() {
    // 创建结果显示HTML
    if (state.measureTooltipElement) {
        state.measureTooltipElement.parentNode.remove(state.measureTooltipElement);
    }
    state.measureTooltipElement = document.createElement('div');
    state.measureTooltipElement.className = 'ol-tooltip hidden';
    state.measureTooltip = new Overlay({
        element: state.measureTooltipElement,
        offset: [15, 0],
        positioning: 'center-left',
    });
    map.addOverlay(state.measureTooltip);
}

/**
 * 缩小
 * @param map 地图对象
 */
export function zoomOut() {
    let view: View = map.getView();
    let zoom: number = view.getZoom()!;
    view.setZoom(zoom - 1)

}

/**
 * 放大
 * @param map 地图对象
 */
export function zoomIn() {

    let view: View = map.getView();
    let zoom: number = view.getZoom()!;
    view.setZoom(zoom + 1)

}

/**
 * 切换地图函数
 * @param map 地图对象
 * @param name 切换到的图层名字
 */
export function showMap(
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
 */
export function reShow() {
    let layers = map.getLayers();
    //最后一个为绘画要素图层、前两个为默认显示的矢量以及标记天地图
    for (let i = 2; i < layers.getLength() - 2; i++) {
        let layer = layers.item(i)
        layer.setVisible(false);
    }
}
