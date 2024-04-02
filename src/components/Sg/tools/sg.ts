/**
 * 先声明SGMap对象存在，因为没有提供声明文件，因此用 any 
 */
declare const SGMap: any;
let point: any = null;
let line: any = null;
let polygon: any = null;
let mLinePolygon: any[] = [];
let mPopup: any[] = [];
/**
 * 初始化地图
 * @returns 思极地图实例
 */
export function initSgMap() {

    //创建地图，指定底图样式类型
    const sgmap = new SGMap.Map({
        container: 'map',
        style: "aegis://styles/aegis/Streets",
        zoom: 7.5,
        center: [120.716667, 28.866667],
        localIdeographFontFamily: 'Microsoft YoHei'
    });
    return sgmap
}
/**
 * 按类型绘画
 * @param map 思极地图实例
 * @param type 绘画类型
 */
export function draw(map: any, type: string) {
    if (type == 'point') {
        if (point) {
            point.startDraw();
            point.on("edit.point.end", function () {
                point.remove();
            });
        } else {
            point = new SGMap.DrawPointHandler({
                map: map,
                enableEdit: true,
            });
            point.startDraw();
        }
    }
    else if (type == 'line') {
        if (line) {
            line.startDraw();
        } else {
            line = new SGMap.DrawPolylineHandler({
                map: map,
                enableEdit: true,
            });
            line.startDraw();
        }
    }
    else if (type == 'polygon') {
        if (polygon) {
            polygon.startDraw();
        } else {
            polygon = new SGMap.DrawPolygonHandler({
                map: map,
                enableEdit: true,
            });
            polygon.startDraw();
        }
    }
}
/**
 * 测量长度
 * @param map 思极地图实例
 */

export function measureLine(map: any) {
    let helpMsg: string = '单击开始测量长度';
    //实例化面积测量插件
    let geometryUtil = new SGMap.GeometryUtil();
    //初始化popup
    let helpPopup: any;
    helpPopup = createPopup(helpPopup);
    let measurePopup: any;
    //鼠标移动事件
    const mouseMove = function (e: any) {
        helpPopup
            .setLngLat(e.lngLat)
            .setHTML("<div>" + helpMsg + "</div>")
            .addTo(map);
    }
    map.on("mousemove", mouseMove)
    //鼠标按下事件
    map.on("mousedown", function () {
        helpMsg = '单击继续添加节点或者双击结束长度测量绘画';
    })

    //画笔-开始画面
    let Line = new SGMap.DrawPolylineHandler({
        map: map,
        enableEdit: false,
    });
    //mLinePolygon存储测量线面，方便清除
    mLinePolygon.push(Line);
    Line.startDraw();
    //监听开始画面事件
    Line.on("draw.polyline.addPoint", function (data: any) {
        // 返回data lastPoint: 前一个节点，currentPoint：当前节点
        var position = data.currentPoint
        helpPopup
            .setLngLat(position)
            .setHTML("<div>" + helpMsg + "</div>")
            .addTo(map);
    })
    //监听结束画面事件
    Line.on("draw.polyline.end", function (data: any) {
        // 返回feature：绘图数据集合，lastPoint：前一个节点，currentPoint：当前节点
        let feature = data.features[0].geometry.coordinates;
        //传入polygon闭合坐标数组
        let distance = geometryUtil.distanceOfLine(feature);
        distance = formatLength(distance);
        //获取最后一个点的坐标
        let position = feature.slice(-1)[0];
        //创建弹窗并设置各个属性
        measurePopup = createPopup(measurePopup)
        measurePopup
            .setLngLat(position)
            .setHTML("<div>" + distance + "</div>")
            .addTo(map);
        //mPopup存储线面弹窗，方便清除 
        mPopup.push(measurePopup);
        helpPopup.remove();
        helpMsg = '单击开始长度测量';
        map.off("mousemove", mouseMove);
    })
}

/**
 * 测量面积
 * @param map 思极地图实例
 */
export function measurePolygon(map: any) {
    let helpMsg: string = '单击开始测量';
    //实例化面积测量插件
    let geometryUtil = new SGMap.GeometryUtil();
    //初始化popup
    let helpPopup: any;
    helpPopup = createPopup(helpPopup);
    let measurePopup: any;
    //鼠标移动事件
    const mouseMove = function (e: any) {
        helpPopup
            .setLngLat(e.lngLat)
            .setHTML("<div>" + helpMsg + "</div>")
            .addTo(map);
    }
    map.on("mousemove", mouseMove)
    //鼠标按下事件
    map.on("mousedown", function () {
        helpMsg = '单击继续添加节点或者双击结束绘画';
    })

    //新建测量面画笔-开始画面

    let Polygon = new SGMap.DrawPolygonHandler({
        map: map,
        enableEdit: false,
    });
    //mLinePolygon存储测量线面，方便清除
    mLinePolygon.push(Polygon);
    Polygon.startDraw();
    //监听开始画面事件
    Polygon.on("draw.polygon.addPoint", function (data: any) {
        // 返回data lastPoint: 前一个节点，currentPoint：当前节点
        var position = data.currentPoint
        helpPopup
            .setLngLat(position)
            .setHTML("<div>" + helpMsg + "</div>")
            .addTo(map);
    })
    //监听结束画面事件
    Polygon.on("draw.polygon.end", function (data: any) {
        // 返回feature：绘图数据集合，lastPoint：前一个节点，currentPoint：当前节点
        let feature = data.features[0].geometry.coordinates[0];
        //传入polygon闭合坐标数组
        let area = geometryUtil.ringArea(feature);
        area = formatArea(area);
        //获取最后一个点的坐标
        let position = feature.slice(-1)[0];
        //创建弹窗并设置各个属性
        measurePopup = createPopup(measurePopup)
        measurePopup
            .setLngLat(position)
            .setHTML("<div>" + area + "</div>")
            .addTo(map);
        //mPopup存储线面弹窗，方便清除
        mPopup.push(measurePopup);
        helpPopup.remove();
        helpMsg = '单击开始测量';
        map.off("mousemove", mouseMove);
    })
}

// 长度单位换算
export const formatLength = function (line: any): string {
    const length: number = line;
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
export const formatArea = function (polygon: any): string {
    const area: number = polygon;
    let output: string;
    if (area > 10000) {
        output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2<sup>';
    } else {
        output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2<sup>';
    }
    return output;
}
function createPopup(popup: any) {
    popup = new SGMap.Popup({
        closeOnClick: false,
        offset: {
            bottom: [0, -10],
        }
    });
    return popup
}


/**
 * 清除画板
 */
export function clear() {
    // 清除绘画点线面工具
    if (point) point.clearData();
    if (line) line.clearData();
    if (polygon) polygon.clearData();
    // 清除测量画线画面工具
    if (mLinePolygon.length !== 0) {
        mLinePolygon.map((item) => {
            item.clearData();
        })
        mLinePolygon=[];
    }
    // 清除测量弹窗
    if (mPopup.length !== 0) {
        mPopup.map((item) => {
            item.remove();
        })
        mPopup=[];
    }
}
/**
 * 加载geojson数据并获取属性进行展示
 * @param map 思极地图实例
 */
export function looaGeojson(map: any) {
    //加载图标图像
    map.loadImage(
        "../poi.png",
        function (error: any, image: any) {
            map.addImage("poi", image);
            console.log(error);
        }
    )
    //将geojson数据加载进地图中
    map.addLayer({
        id: "jsonData",
        type: "symbol",
        source: {
            type: "geojson",
            data: "../data.geojson",
        },
        layout: {
            "icon-image": "poi",
            "icon-size": 1,
            "icon-ignore-placement": true,
            "text-ignore-placement": false,
            "text-field": "{站名}",
            "text-size": 12,
            "text-anchor": "top",
            "text-allow-overlap": false,
            "icon-anchor": "bottom",
            "text-offset": [0, 0],
            "text-max-width": 8,
            "text-font": ["Microsoft YaHei Regular"]
        },
        paint: {
            "text-color": "#ff0000",
            "text-halo-color": "#FFFFFF",
            "text-halo-width": 1.33333,
        },
    });
}


/**
 * 缩小
 * @param map 地图对象
 */
export function zoomOut(
    map: any,
) {
    let zoom: number = map.getZoom();
    map.setZoom(zoom - 1)
}

/**
 * 放大
 * @param map 地图对象
 */
export function zoomIn(
    map: any,
) {
    let zoom: number = map.getZoom();
    map.setZoom(zoom + 1)
}

