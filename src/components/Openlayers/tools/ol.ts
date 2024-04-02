import {Map,Overlay,View} from'ol'
import { Draw,Snap } from 'ol/interaction';
import { TiandiMap_vec, TiandiMap_cva, } from './layerDatas.ts'
import { Vector as VectorSource } from 'ol/source.js';//TileWMS,
import { Vector as VectorLayer } from 'ol/layer.js';
import { Type } from 'ol/geom/Geometry';
import { Style, Stroke, Fill } from 'ol/style';
import { Circle as CircleStyle } from 'ol/style.js';
import { LineString, Polygon } from 'ol/geom';
import { getArea, getLength } from 'ol/sphere.js';
/**
 * 定义一个类初始化地图，默认加载天地图矢量地图以及天地图矢量标记地图
 */
export class MapLoader{
    public map:Map;
    constructor(target:HTMLElement | string,center:number[]){
        this.map=new Map({
            target:target,
            layers:[
                TiandiMap_vec,
                TiandiMap_cva
            ],
            view:new View({
                center:center,
                zoom:8
            })
        })
    }
}
/**
 * 定义一个类，用来绘画、测量以及清除绘制要素
 */
export class OlDrawTool{
    public map:Map;
    private source:VectorSource;
    private vector: VectorLayer<VectorSource>;
    private draw:Draw|null=null;
    private snap:Snap|null=null;
    private measureTooltipElement:HTMLElement|null=null;
    private measureTooltip:Overlay|null=null;
    constructor(map:Map){
        this.map=map;
        this.source=new VectorSource();
        this.vector=new VectorLayer({
            source: this.source,
            style: {
                "fill-color": 'rgba(255,255,255,0.2)',
                "stroke-color": '#ffcc33',
                "stroke-width": 2,
                "circle-radius": 7,
                "circle-fill-color": '#ffcc33',
            }
        });
        this.map.addLayer(this.vector);
    }
    /**
     * 清除绘制矢量图层以及移除画笔
     */
    public clearAll(){
        this.map.removeInteraction(this.draw as Draw);
        this.map.removeInteraction(this.snap as Snap);
        this.draw=null;
        this.snap=null;
        this.source.clear();

    }
    /**
     * 绘制点、线、面工具
     * @param type 绘制类型， "Point" | "LineString" | "LinearRing" | "Polygon" | "MultiPoint" | "MultiLineString" | "MultiPolygon" | "GeometryCollection" | "Circle"
     */
    public addInteractions(type:String){
        this.draw=new Draw({
            source:this.source,
            type:type as Type
        });
        this.snap=new Snap({
            source:this.source
        })
        this.map.addInteraction(this.draw);
        this.map.addInteraction(this.snap);
    }
    /**
     * 清除绘制要素
     */
    public clearDraw(){
        this.map.removeInteraction(this.draw as Draw);
        this.map.removeInteraction(this.snap as Snap);
        this.draw=null;
        this.snap=null;
    }
    /**
     * 测量工具
     * @param type 测量类型 LineString或者Polygon
     */
    public measure(type:String){
        this.removeDraw(type);
        this.map.addInteraction(this.draw as Draw);
        this.createMeasureTooltip();
        this.draw?.on('drawstart',(evt: any)=> {
            let sketch = evt.feature;
            let tooltipCoord = evt.coordinate;
            sketch.on('change', (evt: any)=> {
                const geom = evt.target.values_.geometry;
                let output: string = "";
                if (geom instanceof Polygon) {
                    output = this.formatArea(geom);
                    tooltipCoord = geom.getInteriorPoint().getCoordinates();
                } else if (geom instanceof LineString) {
                    output = this.formatLength(geom);
                    tooltipCoord = geom.getLastCoordinate();
                }
                // console.log(output);
                this.measureTooltipElement!.innerHTML = output;
                this.measureTooltip!.setPosition(tooltipCoord);
            }); 
        });
        this.draw?.on('drawend',()=>{
            this.clearDraw();
            (this.measureTooltipElement as HTMLElement).className = 'ol-tooltip ol-tooltip-static';
            (this.measureTooltip as Overlay).setOffset([0, -7]);
            this.measureTooltipElement=null;
            this.measureTooltip=null;
        })

    }
    /**
     * 测量工具-测量前清除绘制要素并新建测量画笔
     * @param type 绘制类型
     */
    private removeDraw(type:String){
        this.clearDraw();
        this.draw=new Draw({
            source: this.source,
            type:type as Type,
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
    }
    /**
     * 测量工具-创建measureOverlay 此处注意可以自定义样式 ol-tooltip ol-tooltip-measure
     */
    private createMeasureTooltip(){
        if(this.measureTooltipElement!==null){
            (this.measureTooltipElement.parentNode as HTMLElement).parentNode?.removeChild(this.measureTooltipElement);
        }
        this.measureTooltipElement=document.createElement('div');
        this.measureTooltipElement.className='ol-tooltip ol-tooltip-measure';
        this.measureTooltip=new Overlay({
            element:this.measureTooltipElement,
            offset:[0,-15],
            positioning:'bottom-center',
            stopEvent:false,
            insertFirst:false,
        })
        this.map.addOverlay(this.measureTooltip);
    }
    /**
     * 测量工具-格式化面积测量结果
     * @param polygon 类型为Polygon
     * @returns  返回对象为string类型
     */
    private formatArea = function (polygon: Polygon): string {
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
     * 测量工具-格式化长度测量结果
     * @param line 类型为LineString
     * @returns 返回对象为string类型
     */
    private formatLength = function (line: LineString): string {
        const length: number = getLength(line);
        let output: string;
        if (length > 100) {
            output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
        } else {
            output = Math.round(length * 100) / 100 + ' ' + 'm';
        }
        return output;
    };
}