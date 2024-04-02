
import * as Cesium from 'cesium'
import { Ref } from 'vue'


/**
 * 3dtile 属性获取
 * @param viewer Cesium三维地球查看器
 * @param proList 信息框数据
 * @param show 是否显示信息框 注意传入的参数为ref对象
 */

/**
 * 存储信息框数据的接口
 */
interface Data {
    Bin: string
    DOITT_ID: string,
    SOURCE_ID: string,
    Lng: string,
    Lat: string,
    Height: string,
    ter_Height: string
}
export function getFeature(viewer: Cesium.Viewer, proList: Data, show: Ref<boolean>) {
    //加载3dtiles数据
    let data: Cesium.Cesium3DTileset;
    loadTile();
    async function loadTile() {
        data = await Cesium.Cesium3DTileset.fromIonAssetId(75343, {})
        viewer.scene.primitives.add(data);
        console.log("3dtile数据" ,data)
        viewer.flyTo(data);
    }
    viewer.scene.globe.depthTestAgainstTerrain = true;

    // 保存当前所选元素的信息：要素、原始颜色
    const selected = {
        feature: undefined,
        originalColor: new Cesium.Color(),
    };

    // 获取默认的左键单击事件，当要素未被选择时
    const clickHandler = viewer.screenSpaceEventHandler.getInputAction(
        Cesium.ScreenSpaceEventType.LEFT_CLICK
    );


    // 如果能识别轮廓，鼠标移到要素上的时候是轮廓是蓝色，点击为绿色
    // 如果不能识别论阔，就改变要素的颜色，鼠标移到要素上的时候是轮廓是黄色，点击为绿色
    if (
        Cesium.PostProcessStageLibrary.isSilhouetteSupported(viewer.scene)
    ) {
        // 如果能识别轮廓

        //创建边缘检测-蓝色
        const silhouetteBlue = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
        silhouetteBlue.uniforms.color = Cesium.Color.BLUE;
        silhouetteBlue.uniforms.length = 0.01;
        silhouetteBlue.selected = [];
        //创建边缘检测-蓝色
        const silhouetteGreen = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
        silhouetteGreen.uniforms.color = Cesium.Color.LIME;
        silhouetteGreen.uniforms.length = 0.01;
        silhouetteGreen.selected = [];
        //将以上床间的边缘检测加入场景中
        viewer.scene.postProcessStages.add(
            Cesium.PostProcessStageLibrary.createSilhouetteStage([
                silhouetteBlue,
                silhouetteGreen,
            ])
        );

        // 当鼠标移动到要素上时 蓝色
        viewer.screenSpaceEventHandler.setInputAction(function onMouseMove(
            movement: Cesium.ScreenSpaceEventHandler.MotionEvent
        ) {
            // 如果有要素被选，先清空selected，再赋色
            silhouetteBlue.selected = [];

            // 选择新的要素
            const pickedFeature = viewer.scene.pick(movement.endPosition);

            if (!Cesium.defined(pickedFeature)) {
                return;
            }
            // 高亮显示
            if (pickedFeature !== selected.feature) {
                silhouetteBlue.selected = [pickedFeature];

            }
        },
            Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        // 点击选择要素时，显示绿色并显示信息框
        viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(
            movement: Cesium.ScreenSpaceEventHandler.PositionedEvent
        ) {
            // 先清除之前的选择，再赋色
            silhouetteGreen.selected = [];

            // 选择新的要素
            const pickedFeature = viewer.scene.pick(movement.position);
            if (!Cesium.defined(pickedFeature)) {
                clickHandler(movement);
                return;
            }

            console.log("silhouetteGreen.selected", silhouetteGreen.selected);
            if (silhouetteGreen.selected[0] === pickedFeature) {
                return;
            }

            // 先保存移动到要素上时蓝色selected保存的要素
            const highlightedFeature = silhouetteBlue.selected[0];
            if (pickedFeature === highlightedFeature) {
                silhouetteBlue.selected = [];
            }

            // 将点击所选要素加入绿色selected
            silhouetteGreen.selected = [pickedFeature];

            // 创建展示所选要素信息的信息框
            show.value = true
            console.log(show)
            proList.Bin = pickedFeature.getProperty("BIN")
            proList.ter_Height = pickedFeature.getProperty("TerrainHeight")
            proList.DOITT_ID = pickedFeature.getProperty("DOITT_ID")
            proList.SOURCE_ID = pickedFeature.getProperty("SOURCE_ID")
            proList.Lng = pickedFeature.getProperty("Longitude")
            proList.Lat = pickedFeature.getProperty("Latitude")
            proList.Height = pickedFeature.getProperty("Height")
        },
            Cesium.ScreenSpaceEventType.LEFT_CLICK);
    } else {
        // 如果不能识别论阔，就改变要素的颜色，鼠标移到要素上的时候是轮廓是黄色，点击为绿色

        // 保存当前高亮显示要素信息
        const highlighted = {
            feature: undefined,
            originalColor: new Cesium.Color(),
        };

        // 移动到要素上时显示为黄色
        viewer.screenSpaceEventHandler.setInputAction(function onMouseMove(
            movement: Cesium.ScreenSpaceEventHandler.MotionEvent
        ) {
            // 先清除之前的选择再赋色
            // if (Cesium.defined(highlighted.feature)) {
            //     highlighted.feature.color = highlighted.originalColor;
            //     highlighted.feature = undefined;
            // }
            // 选择新的要素
            const pickedFeature = viewer.scene.pick(movement.endPosition);

            if (!Cesium.defined(pickedFeature)) {
                return;
            }

            // 所选元素不是当前被选元素即赋色
            if (pickedFeature !== selected.feature) {
                highlighted.feature = pickedFeature;
                Cesium.Color.clone(
                    pickedFeature.color,
                    highlighted.originalColor
                );
                pickedFeature.color = Cesium.Color.YELLOW;
            }
        },
            Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        // 点击选择要素时，显示绿色并显示信息框
        viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(
            movement: Cesium.ScreenSpaceEventHandler.PositionedEvent
        ) {
            // 先清除之前的选择，再赋色
            // if (Cesium.defined(selected.feature)) {
            //     selected.feature.color = selected.originalColor;
            //     selected.feature = undefined;
            // }
            // 选择新的要素
            const pickedFeature = viewer.scene.pick(movement.position);
            if (!Cesium.defined(pickedFeature)) {
                clickHandler(movement);
                return;
            }

            if (selected.feature === pickedFeature) {
                return;
            }
            selected.feature = pickedFeature;
            // 保存所选要素颜色
            if (pickedFeature === highlighted.feature) {
                //克隆颜色对象
                Cesium.Color.clone(
                    highlighted.originalColor,
                    selected.originalColor
                );
                highlighted.feature = undefined;
            } else {
                Cesium.Color.clone(pickedFeature.color, selected.originalColor);
            }
            // 高亮显示要素
            pickedFeature.color = Cesium.Color.LIME;

            // 创建展示所选要素信息的信息框
            show.value = true;
            console.log(show);
            proList.Bin = pickedFeature.getProperty("BIN");
            proList.DOITT_ID = pickedFeature.getProperty("DOITT_ID");
            proList.SOURCE_ID = pickedFeature.getProperty("SOURCE_ID");
            proList.Lng = pickedFeature.getProperty("Longitude");
            proList.Lat = pickedFeature.getProperty("Latitude");
            proList.Height = pickedFeature.getProperty("Height");
            proList.ter_Height = pickedFeature.getProperty("TerrainHeight");

        },
            Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

}
// 绘画
/**
 * 
 * @param viewer Cesium三维地球查看器
 * @param type 绘画类型
 */
export function draw(viewer: Cesium.Viewer, type: string) {
    let myPosition: Cesium.Cartesian3|undefined;
    let tempPoints: Cesium.Cartesian3[] = [];
    //开启深度监听
    viewer.scene.globe.depthTestAgainstTerrain = true;
    let handler: Cesium.ScreenSpaceEventHandler|null = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    if (type == 'Point') {
        // if (handler) {
        //     handler.destroy();
        // }
        tempPoints = [];
        handler.setInputAction(function (click: Cesium.ScreenSpaceEventHandler.PositionedEvent	) {
            let ray= viewer.camera.getPickRay(click.position);
            myPosition = viewer.scene.globe.pick(ray!, viewer.scene)!;
            drawPoint(viewer, myPosition);
            console.log("posi",myPosition);
            // tempEntities.push(point);
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        //左键双击停止绘制
        handler.setInputAction(function () {
            //关闭事件
            handler?.destroy();
            handler = null;
            console.log("handler1", handler);
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        //右击停止绘制
        handler.setInputAction(function () {
            handler?.destroy();
            handler = null;
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }
    if (type == "LineString") {
        tempPoints = [];
        handler.setInputAction(function (click: Cesium.ScreenSpaceEventHandler.PositionedEvent	) {
            // console.log('click2',click)
            let ray: Cesium.Ray|undefined = viewer.camera.getPickRay(click.position);
            myPosition = viewer.scene.globe.pick(ray!, viewer.scene);
            //加入第一点
            tempPoints.push(myPosition!);
            let tempLength = tempPoints.length;
            drawPoint(viewer, tempPoints[tempLength - 1]);
            // tempEntities.push(point);
            if (tempLength > 1) {
                drawPolyline(viewer, [tempPoints[tempLength - 2], tempPoints[tempLength - 1]]);
                console.log("viewer.entities", viewer.entities);
                // tempEntities.push(pointline);
            } else {
                //请绘制下一个点
            }
            //左键双击停止绘制
            handler!.setInputAction(function () {
                handler?.destroy();
                handler = null;
                console.log("handler2", handler);


            }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
            //右击停止绘制
            handler!.setInputAction(function () {
                handler?.destroy();
                handler = null;
                console.log("handler2", handler);

            }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
    if (type == "Polygon") {
        handler.setInputAction(function (click: Cesium.ScreenSpaceEventHandler.PositionedEvent	) {
            // console.log('click3', click)
            let ray = viewer.camera.getPickRay(click.position);
            myPosition = viewer.scene.globe.pick(ray!, viewer.scene);
            tempPoints.push(myPosition!);
            let tempLength = tempPoints.length;
            // 绘制点
            drawPoint(viewer, myPosition!);
            // tempEntities.push(point)
            if (tempLength > 1) {
                drawPolyline(viewer, [tempPoints[tempLength - 2], tempPoints[tempLength - 1]]);
                // tempEntities.push(pointline);
            } else {
                //请绘制下一个点
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        //右键点击操作
        handler.setInputAction(function (click: Cesium.ScreenSpaceEventHandler.PositionedEvent	) {
            let cartesian = viewer.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid);
            if (cartesian) {
                let tempLength = tempPoints.length;
                if (tempLength < 3) {
                    alert('请选择3个以上的点进行绘制');
                } else {
                    //闭合最后一条线
                    drawPolyline(viewer, [tempPoints[tempLength - 1], tempPoints[0]]);
                    // tempEntities.push(pointline);
                    drawPolygon(viewer, tempPoints);
                    // tempEntities.push(tempPoints);
                    // 面结束绘制后需要关闭handler
                    handler?.destroy();
                    handler = null;
                    console.log("handler3", handler);

                }
            }
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }
}

export function editEntity(viewer: Cesium.Viewer) {
    let isEditting = false;//是否处于编辑状态
    let pickedEntity:Cesium.Entity|null = null;//被选中的实体-点
    // let currentPoint =null;//当前编辑点
    let gon:Cesium.Entity;//保存实体对象
    let pointsId= [];//清空编辑点id
    // 左键单击使用scene.pick方法获取Entity实体
    // 当有多个Entity覆盖时，选中最上层实体
    // let picked = viewer.scene.pick(click.position);
    // 当有多个Entity覆盖时，选中全部实体
    // let pickedArray = viewer.scene.dillPick(windowPosition);
    viewer.screenSpaceEventHandler.setInputAction((e:Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
        leftDown(e);
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

    viewer.screenSpaceEventHandler.setInputAction((e:Cesium.ScreenSpaceEventHandler.MotionEvent) => {
        mouseMove(e);
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    viewer.screenSpaceEventHandler.setInputAction((e:Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
        leftUp(e);
    }, Cesium.ScreenSpaceEventType.LEFT_UP);
    //移动实体-鼠标左键按下
    function leftDown(e:Cesium.ScreenSpaceEventHandler.PositionedEvent) {
        let picked = viewer.scene.pick(e.position);
        // console.log("picked", picked);
        // console.log('面几何对象','shiyi',viewer.entities)
        if (Cesium.defined(picked)) {
            //开启编辑模式
            isEditting = true;
            // 禁止地球体的旋转与缩放
            viewer.scene.screenSpaceCameraController.enableRotate = false;
            viewer.scene.screenSpaceCameraController.enableZoom = false;

            let entity = picked.id
            if (entity.name === "面几何对象") {
                
                gon = entity;
                for (let cartesian of gon.polygon.hierarchy._value.positions) {
                    let point = viewer.entities.add({
                        name: "点几何对象",
                        position: cartesian,
                        point: {
                            color: Cesium.Color.YELLOW,
                            pixelSize: 8,
                            outlineColor: Cesium.Color.BLUE
                        }
                    })
                    pointsId.push(point.id)
                }
            } else if (entity.name === "点几何对象") {
                pickedEntity = entity;
            }
        }
        // if (picked) {
        //     document.body.style.curse = 'move';
        //     pickedEntity = Cesium.defaultValue(picked.id, picked.primitive.id);
        //     if (pickedEntity instanceof Cesium.Entity && pickedEntity.model) {
        //         //锁定相机
        //         viewer.scene.screenSpaceCameraController.enableRotate = false;
        //         viewer.scene.screenSpaceCameraController.enableZoom = false;
        //     }
        // }
    }
    // 移动实体-鼠标移动
    function mouseMove(e:Cesium.ScreenSpaceEventHandler.MotionEvent) {
        if (isEditting && pickedEntity) {
            let cartesian = viewer.scene.camera.pickEllipsoid(
                e.endPosition,
                viewer.scene.globe.ellipsoid
            );
            pickedEntity.position = cartesian;

            // // 面几何对象
            // // if(pointsId.length!==0){
            //     console.log('shiti1',viewer.entities)
            // let points = [];
            // for (let id of pointsId) {
            //     points.push(viewer.entities.getById(id).position._value)
            // }
            // console.log('gon2',gon)
            // // 更新面标的位置数组
            // gon.polygon.hierarchy._value.positions= new Cesium. CallbackProperty(()=>{
            //     console.log('length',points.length)
            //     return points;
            // }, false);
            // console.log('shiti2',viewer.entities)
            // }
        }
    }
    // 移动实体-左键抬起
    function leftUp(e:Cesium.ScreenSpaceEventHandler.PositionedEvent) {
        // document.body.style.curse = 'default';
        isEditting = false;
        pickedEntity = null;
        // gon=null;
        // handler=new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        // if (handler !== null && !handler.isDestroyed()) {
        //     handler.destroy();
        // }
        // // 移除编辑点，清空编辑点数组
        // for (let id of pointsId) {
        //     viewer.entities.removeById(id);
        // }
        // pointsId=[];
        // 解除相机锁定
        viewer.scene.screenSpaceCameraController.enableRotate = true;
        viewer.scene.screenSpaceCameraController.enableZoom = true;
    }
}
/**
 * 画点函数
 * @param viewer Cesium三维地球查看器
 * @param position 点的坐标
 * @returns 返回点实体
 */
function drawPoint(viewer: Cesium.Viewer, position: Cesium.Cartesian3): Cesium.Entity {
    return viewer.entities.add({
        name: "点几何对象",
        position: position,
        point: {
            color: Cesium.Color.SKYBLUE,
            pixelSize: 10,
            outlineColor: Cesium.Color.YELLOW,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            // heightReference:Cesium.HeightReference.RELATIVE_TO_GROUND
        }
    });
}

/**
 * 画线函数
 * @param viewer Cesium三维地球查看器
 * @param positions 点数组
 * @returns 返回线实体
 */
function drawPolyline(viewer: Cesium.Viewer, positions: Cesium.Cartesian3[]): Cesium.Entity | undefined {
    if (positions.length < 1) return;
    return viewer.entities.add({
        name: "线几何对象",
        polyline: {
            positions: positions,
            width: 5.0,
            material: new Cesium.PolylineGlowMaterialProperty({
                color: Cesium.Color.GOLD,
            }),
            depthFailMaterial: new Cesium.PolylineGlowMaterialProperty({
                color: Cesium.Color.GOLD,
            }),
            clampToGround: true,
        }
    })
}

/**
 * 画面函数
 * @param viewer Cesium三维地球查看器
 * @param positions 点二维闭合数组
 * @returns 返回面实体
 */
function drawPolygon(viewer: Cesium.Viewer, positions: Cesium.Cartesian3[]): Cesium.Entity | undefined {
    if (positions.length < 2) return;
    return viewer.entities.add({
        name: "面几何对象",
        polygon: {
            hierarchy: positions,
            material: Cesium.Color.fromCssColorString("#FFD700").withAlpha(.2),
        }
    })
}

// 测量
/**
 * 长度测量
 * @param viewer Cesium三维地球查看器
 */
export function measurePolyline(viewer: Cesium.Viewer,) {
    let lableEntity: Cesium.Entity|null = null;
    let points: Cesium.Cartesian3[] = [];
    let handler: Cesium.ScreenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(function (click: Cesium.ScreenSpaceEventHandler.PositionedEvent) {
        //空间坐标
        let myPosition: Cesium.Cartesian3 = viewer.scene.pickPosition(click.position);
        if (!myPosition) {
            return false;
        }
        if (points.length == 0) {
            points.push(myPosition.clone());
            drawPoint(viewer, myPosition);
            handler.setInputAction((moveEvent: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
                // let ray: Cesium.Ray = viewer.camera.getPickRay(moveEvent.endPosition);
                // let movePosition: Cesium.Cartesian3 = viewer.scene.globe.pick(ray, viewer.scene);
                let movePosition: Cesium.Cartesian3 = viewer.scene.pickPosition(moveEvent.endPosition);
                if (!movePosition) {
                    return false;
                }
                if (points.length == 2) {
                    points.pop();
                    points.push(movePosition);
                    if (lableEntity) {
                        viewer.entities.remove(lableEntity);
                        // Cesium.EntityCollection.splice(Cesium.EntityCollection.indexof(lableEntity),1);
                    }
                    let centerPoint: Cesium.Cartesian3 = Cesium.Cartesian3.midpoint(points[0], points[1], new Cesium.Cartesian3());
                    let lengthText = "距离：" + getSpaceDistance(points[0], points[1]);
                    lableEntity = addLable(viewer, centerPoint, lengthText);
                    // Cesium.EntityCollection.push(lableEntity);
                } else {
                    points.push(movePosition);
                    drawPolyline(viewer, points);
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
        } else {
            points.pop();
            points.push(myPosition);
            drawPoint(viewer, myPosition);
            drawPolyline(viewer, points);
            handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
            handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    handler.setInputAction(function () {
        handler.destroy(); //关闭事件句柄
        points.pop(); //最后一个点无效
        // viewer.entities.remove(floatingPoint);
        // tooltip.style.display = "none";
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

}

/**
 * 面积测量
 * @param viewer Cesium三维地球查看器
 */
export function measurePolygon(viewer: Cesium.Viewer,) {
    var positions: Cesium.Cartesian3[] = [];
    var clickStatus = false;
    var labelEntity: Cesium.Entity|null = null;
    let handler: Cesium.ScreenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction((clickEvent: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
        clickStatus = true;
        var cartesian = viewer.scene.globe.pick(viewer.camera.getPickRay(clickEvent.position)!, viewer.scene);
        if (!cartesian) {
            return false
        }
        if (positions.length == 0) {
            positions.push(cartesian.clone()); //鼠标左击 添加第1个点
            drawPoint(viewer, cartesian);
        } else if (positions.length >= 2) {
            if (!cartesian) {
                return false
            }
            positions.pop();
            positions.push(cartesian.clone()); // 鼠标左击 添加第3个点
            drawPoint(viewer, cartesian);
            drawPolyline(viewer, positions);
        } else if (positions.length >= 3) {
            if (!cartesian) {
                return false
            }
            positions.pop();
            positions.push(cartesian.clone()); // 鼠标左击 添加第3个点
            drawPoint(viewer, cartesian);
        }

    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    //移动事件
    handler.setInputAction((moveEvent: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
        var movePosition = viewer.scene.globe.pick(viewer.camera.getPickRay(moveEvent.endPosition)!, viewer.scene);
        if (!movePosition) {
            return false;
        }
        if (positions.length == 1) {
            positions.push(movePosition);
            // drawPolyline(viewer, positions);
        }
        else {
            if (clickStatus) {
                positions.push(movePosition);
            }
            //else {
            //     positions.pop();
            //     positions.push(movePosition);
            // }
        }
        if (positions.length >= 3) {

            // 绘制label
            if (labelEntity) {
                viewer.entities.remove(labelEntity);
            }
            var text = "面积：" + getSpaceArea(positions);
            var centerPoint: Cesium.Cartesian3 = Cesium.BoundingSphere.fromPoints(positions).center;
            labelEntity = addLable(viewer, centerPoint, text);

        }
        clickStatus = false;
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    // 右击结束
    handler.setInputAction((clickEvent: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {

        var clickPosition = viewer.scene.globe.pick(viewer.camera.getPickRay(clickEvent.position)!, viewer.scene);
        if (!clickPosition) {
            return false;
        }
        positions.pop();
        positions.push(clickPosition);
        positions.push(positions[0]); // 闭合
        drawPoint(viewer, clickPosition);
        drawPolyline(viewer, positions);
        drawPolygon(viewer, positions)
        // 绘制label
        if (labelEntity) {
            viewer.entities.remove(labelEntity);
        }

        var text = "面积：" + getSpaceArea(positions);
        var centerPoint: Cesium.Cartesian3 = Cesium.BoundingSphere.fromPoints(positions).center;
        labelEntity = addLable(viewer, centerPoint, text);
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
};

/**
 * 计算贴面的面积
 * @param points 点坐标数组
 * @returns 返回计算得到的面积值
 */
function getSpaceArea(points: Cesium.Cartesian3[]) {
    let degreesPerRation = 180.0 / Math.PI;
    function Angle(p1: Cesium.Cartesian3, p2: Cesium.Cartesian3, p3: Cesium.Cartesian3) {
        let bearing21 = Bearing(p2, p1);
        let bearing23 = Bearing(p2, p3);
        let angle = bearing21 - bearing23;
        if (angle < 0) {
            angle += 360;
        }
        return angle;
    }

    /**
     * 计算两点的角度
     * @param from 起点坐标
     * @param to 终点坐标
     * @returns 
     */
    function Bearing(from: Cesium.Cartesian3, to: Cesium.Cartesian3) {
        let myfrom = Cesium.Cartographic.fromCartesian(from);
        let myto = Cesium.Cartographic.fromCartesian(to);
        console.log('ffrom',from,to)
        let lat1 = myfrom.latitude;
        let lon1 = myfrom.longitude;
        let lat2 = myto.latitude;
        let lon2 = myto.longitude;
        let angle = -Math.atan2(Math.sin(lon1 - lon2) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2));
        if (angle < 0) {
            angle += Math.PI * 2.0;
        }
        angle = angle * degreesPerRation
        return angle;
    }
    let res = 0;
    for (let i = 0; i < points.length - 2; i++) {
        let j = (i + 1) % points.length;
        let k = (i + 1) % points.length;
        let totalAngle = Angle(points[i], points[j], points[k]);
        let dis1 = distance(points[j], points[0]);
        let dis2 = distance(points[k], points[0]);
        res += dis1 * dis2 * Math.sin(totalAngle) / 2;
    }
    let output: string
    if (res < 10000) {
        output = Math.abs(res).toFixed(4) + " 平方米";
    } else {
        output = Math.abs((res / 1000000.0)).toFixed(4) + " 平方公里";
    }

    return output;
}

/**
 * 计算两点的距离
 * @param point1 第一点
 * @param point2 第二点
 * @returns 返回两点的距离
 */
function distance(point1: Cesium.Cartesian3, point2: Cesium.Cartesian3) {
    let length: number = Cesium.Cartesian3.distance(point1, point2);
    return length;
}


/**
 * 测量线的长度
 * @param firstPoint 第一点
 * @param secondPoint 第二点
 * @returns 返回两点的长度
 */
function getSpaceDistance(firstPoint: Cesium.Cartesian3, secondPoint: Cesium.Cartesian3) {
    let point1cartographic = Cesium.Cartographic.fromCartesian(firstPoint);
    let point2cartographic = Cesium.Cartographic.fromCartesian(secondPoint);
    //返回两点之间的距离
    let distance: number = Math.sqrt(
        Math.pow(point2cartographic.longitude - point1cartographic.longitude, 2) +
        Math.pow(point2cartographic.latitude - point1cartographic.latitude, 2) +
        Math.pow(point2cartographic.height - point1cartographic.height, 2));
    let output: string;
    if (distance > 100) {
        output = Math.round((distance / 1000) * 100) / 100 + ' ' + 'km';
    } else {
        output = Math.round(distance * 100) / 100 + ' ' + 'm';
    }
    return output;
}

/**
 * 创建显示弹窗
 * @param viewer Cesium三维地球查看器
 * @param centerPoint 面的中心点
 * @param text 要展示的信息
 * @returns 返回创建的标签
 */
function addLable(viewer: Cesium.Viewer, centerPoint: Cesium.Cartesian3, text: string) {
    return viewer.entities.add(new Cesium.Entity({
        position: centerPoint,
        label: {
            text: text,
            font: "14px,sans-serif",
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            fillColor: Cesium.Color.YELLOW,
            //指定标签后面背景的可见性
            showBackground: true,
            //背景颜色
            backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 0.8),
            //指定以像素为单位的水平和垂直背景填充padding
            backgroundPadding: new Cesium.Cartesian2(6, 6),
            pixelOffset: new Cesium.Cartesian2(0, -25),
            disableDepthTestDistance: Number.POSITIVE_INFINITY

        }
    }));
}
/**
 * 清除实体
 * @param viewer 
 */
export function clear(viewer: Cesium.Viewer) {
    console.log("全部实体", viewer.entities)
    // 清除全部实体
    viewer.entities.removeAll()
}
