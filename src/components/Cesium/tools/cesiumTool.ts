import * as Cesium from 'cesium';

export class CesiumDrawTool{
    public viewer:Cesium.Viewer;
    private handler:Cesium.ScreenSpaceEventHandler|null=null;
    private drawEntities: Cesium.Entity[]=[];
    constructor(viewer:Cesium.Viewer){
        this.viewer=viewer;
    }
    public draw(type:string){
        if(this.handler) this.removeHandler();
        let myPosition: Cesium.Cartesian3|undefined;
        this.viewer.scene.globe.depthTestAgainstTerrain = true;
        this.handler=new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
        if(type=='Point'){
            this.handler.setInputAction((event: Cesium.ScreenSpaceEventHandler.PositionedEvent)=>{
                let ray= this.viewer.camera.getPickRay(event.position);
                myPosition = this.viewer.scene.globe.pick(ray!, this.viewer.scene)!;
                let entity=this.drawPoint(myPosition);
                this.drawEntities.push(entity);
            },Cesium.ScreenSpaceEventType.LEFT_CLICK);
            this.handler.setInputAction(()=>{
                this.handler?.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
		        this.handler?.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            },Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
            this.handler.setInputAction(()=>{
                this.handler?.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
		        this.handler?.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            },Cesium.ScreenSpaceEventType.RIGHT_CLICK);
            this.stopDraw();
        }else if(type=='LineString'){
            let lines:Cesium.Cartesian3[]=[];
            let line:Cesium.Entity|undefined=undefined;
            this.handler.setInputAction((event: Cesium.ScreenSpaceEventHandler.PositionedEvent)=>{
                let ray:Cesium.Ray= this.viewer.camera.getPickRay(event.position)!;
                myPosition = this.viewer.scene.globe.pick(ray, this.viewer.scene)!;
                lines.push(myPosition);
                if(line==undefined){
                    line=this.drawPolyline(lines);
                    this.drawEntities.push(line!);
                }
            },Cesium.ScreenSpaceEventType.LEFT_CLICK);
            this.handler?.setInputAction((event:Cesium.ScreenSpaceEventHandler.MotionEvent)=>{
                let ray:Cesium.Ray= this.viewer.camera.getPickRay(event.endPosition)!;
                myPosition = this.viewer.scene.globe.pick(ray, this.viewer.scene)!;
                if(lines.length>=1){
                    lines.pop();
                }
                lines.push(myPosition);
            },Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            this.stopDraw();
        }else if(type=='Polygon'){
            let  polygons:Cesium.Cartesian3[]=[];
            let polygon:Cesium.Entity|undefined=undefined;
            this.handler.setInputAction((event: Cesium.ScreenSpaceEventHandler.PositionedEvent)=>{
                let ray = this.viewer.camera.getPickRay(event.position);
                myPosition = this.viewer.scene.globe.pick(ray!, this.viewer.scene)!;
                polygons.push(myPosition);
                if(polygon==undefined){
                    polygon=this.drawPolygon(polygons);
                    this.drawEntities.push(polygon);
                }
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
            this.handler?.setInputAction((event:Cesium.ScreenSpaceEventHandler.MotionEvent)=>{
                let ray:Cesium.Ray= this.viewer.camera.getPickRay(event.endPosition)!;
                myPosition = this.viewer.scene.globe.pick(ray, this.viewer.scene)!;
                if(polygons.length>=1){
                    polygons.pop();
                }
                polygons.push(myPosition);
            },Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            this.handler.setInputAction
            this.handler?.setInputAction(()=>{
                polygons.push(polygons[0]);
                this.handler?.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
                this.handler?.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            },Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
            this.handler?.setInputAction(()=>{
                polygons.push(polygons[0]);
                this.handler?.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
                this.handler?.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            },Cesium.ScreenSpaceEventType.RIGHT_CLICK)
        }
    }
    private drawPoint(position: Cesium.Cartesian3){
        return this.viewer.entities.add({
            name: "点几何对象",
            show:true,
            position: position,
            point: {
                show: true,
                color: Cesium.Color.GOLD,
                pixelSize: 10,
                outlineColor: Cesium.Color.YELLOW,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                // heightReference:Cesium.HeightReference.RELATIVE_TO_GROUND
            }
        });
    }
    private drawPolyline(positions: Cesium.Cartesian3[]){
        if(positions.length<1) return;
        return this.viewer.entities.add({
            name:"线几何对象",
            polyline:{
                positions:new Cesium.CallbackProperty(()=>{
                    return positions
                },false),
                width:3.0,
                material:new Cesium.PolylineGlowMaterialProperty({
                    color: Cesium.Color.GOLD,
                }),
                depthFailMaterial: new Cesium.PolylineGlowMaterialProperty({
                    color: Cesium.Color.GOLD,
                }),
                clampToGround: true
            }
        })
    }
    private drawPolygon(positions: Cesium.Cartesian3[]){
        return this.viewer.entities.add({
            polygon:{
                hierarchy: new Cesium.CallbackProperty(()=>{
                    return new Cesium.PolygonHierarchy(positions);
                },false),
                material: Cesium.Color.fromCssColorString("#FFD700").withAlpha(.2),
            },
            polyline: {
                positions:new Cesium.CallbackProperty(()=>{
                    return positions
                },false),
                width:3.0,
                material:new Cesium.PolylineGlowMaterialProperty({
                    color: Cesium.Color.GOLD,
                }),
                depthFailMaterial: new Cesium.PolylineGlowMaterialProperty({
                    color: Cesium.Color.GOLD,
                }),
                clampToGround: true
            }
        })
    }
    private removeHandler(){
        this.handler?.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
		this.handler?.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
		this.handler?.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }
    private stopDraw(){
        this.handler?.setInputAction(()=>{
            this.handler?.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
            this.handler?.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        },Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        this.handler?.setInputAction(()=>{
            this.handler?.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
            this.handler?.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        },Cesium.ScreenSpaceEventType.RIGHT_CLICK)
    }
}