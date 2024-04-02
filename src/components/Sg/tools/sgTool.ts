/**
 * 先声明SGMap对象存在，因为没有提供声明文件，因此用 any 
 */
declare const SGMap: any;

/**
 * 定义一个类-初始化思极地图
 */
export class InitSgMap{
    public map:any;
    constructor(target:string){
        //创建地图，指定底图样式类型
        this.map = new SGMap.Map({
        container: target,
        style: "aegis://styles/aegis/Streets",
        zoom: 7.5,
        center: [120.716667, 28.866667],
        localIdeographFontFamily: 'Microsoft YoHei'
    });
    }
}
/**
 * 定义一个类-思极地图的绘画和测量
 */
export class SgDrawTool{
    private map:any;
    private type:string|null=null;
    private point:any=null;
    private line: any = null;
    private polygon: any = null;
    private mLinePolygon:any[]=[];
    private mPopup: any[] = [];
    constructor(map:any){
        this.map=map
    }
    /**
     * 清空绘画图层
     */
    public clear() {
        // 清除绘画点线面工具
        if (this.point) this.point.clearData();
        if (this.line) this.line.clearData();
        if (this.polygon) this.polygon.clearData();
        // 清除测量画线画面工具
        if (this.mLinePolygon.length !== 0) {
            this.mLinePolygon.map((item) => {
                item.clearData();
            })
            this.mLinePolygon=[];
        }
        // 清除测量弹窗
        if (this.mPopup.length !== 0) {
            this.mPopup.map((item) => {
                item.remove();
            })
            this.mPopup=[];
        }
    }
    /**
     * 按类型绘画
     */
    public draw(type:string){
        this.type=type;
        if (this.type == 'point') {
            if (this.point) {
                this.point.startDraw();
            } else {
                this.point = new SGMap.DrawPointHandler({
                    map: this.map,
                    enableEdit: true,
                });
                this.point.startDraw();
            }
        }
        else if (this.type == 'line') {
            /**
             * 倘若在绘画点事件时没有双击清除点画笔，则将其state置为init消除点画笔影响(此为本人自己根据范例找的特点，可信可不信，可用亦可不用)
             */
            if(this.point){
                if(this.point.state!=="init") this.point.state="init";
            }
            if (this.line) {
                this.line.startDraw();
            } else {
                this.line = new SGMap.DrawPolylineHandler({
                    map: this.map,
                    enableEdit: true,
                });
                this.line.startDraw();
            }
        }
        else if (this.type == 'polygon') {
            /**
             * 倘若在绘画点事件时没有双击清除点画笔，则将其state置为init消除点画笔影响(此为本人自己根据范例找的特点，可信可不信，可用亦可不用)
             */
            if(this.point){
                if(this.point.state!=="init") this.point.state="init";
            }
            if (this.polygon) {
                this.polygon.startDraw();
            } else {
                this.polygon = new SGMap.DrawPolygonHandler({
                    map: this.map,
                    enableEdit: true,
                });
                this.polygon.startDraw();
            }
        } 
    }
    /**
     * 测量线
     */
    public  measureLine() {
        /**
             * 倘若在绘画点事件时没有双击清除点画笔，则将其state置为init消除点画笔影响(此为本人自己根据范例找的特点，可信可不信，可用亦可不用)
        */
        if(this.point){
            if(this.point.state!=="init") this.point.state="init";
        }
        //实例化面积测量插件
        let geometryUtil = new SGMap.GeometryUtil();
        //初始化popup
        let helpPopup: any;
        helpPopup = this.createPopup(helpPopup);
        let measurePopup: any;
        const mouseMove = (e: any)=>{
            let tempPoint:any=[];
            Line._data.features[0].geometry.coordinates.map((item:any)=>{
                tempPoint.push(item)
            });
            tempPoint.push([e.lngLat.lng,e.lngLat.lat]);
            let tempDistance=geometryUtil.distanceOfLine(tempPoint);
            tempDistance=this.formatLength(tempDistance);
            helpPopup
                .setLngLat(e.lngLat)
                .setHTML("<div>" + tempDistance + "</div>")
                .addTo(this.map);
        }
        //画笔-开始画面
        let Line = new SGMap.DrawPolylineHandler({
            map: this.map,
            enableEdit: false,
        });
        //mLinePolygon存储测量线面，方便清除
        this.mLinePolygon.push(Line);
        Line.startDraw();
        //监听开始画面事件
        Line.on("draw.polyline.addPoint", ()=>{
            //鼠标移动事件
            this.map.on("mousemove", mouseMove)
        })
        //监听结束画面事件
        Line.on("draw.polyline.end", (data: any)=>{
            // 返回feature：绘图数据集合，lastPoint：前一个节点，currentPoint：当前节点
            let feature = data.features[0].geometry.coordinates;
            //传入polygon闭合坐标数组
            let distance = geometryUtil.distanceOfLine(feature);
            distance = this.formatLength(distance);
            //获取最后一个点的坐标
            let position = feature.slice(-1)[0];
            //创建弹窗并设置各个属性
            measurePopup = this.createPopup(measurePopup)
            measurePopup
                .setLngLat(position)
                .setHTML("<div>" + distance + "</div>")
                .addTo(this.map);
            //mPopup存储线面弹窗，方便清除 
            this.mPopup.push(measurePopup);
            helpPopup.remove();
            this.map.off("mousemove", mouseMove);
        })
    }
    /**
     * 测量面
     */
    public measurePolygon() {
        /**
             * 倘若在绘画点事件时没有双击清除点画笔，则将其state置为init消除点画笔影响(此为本人自己根据范例找的特点，可信可不信，可用亦可不用)
        */
        if(this.point){
            if(this.point.state!=="init") this.point.state="init";
        }
        //实例化面积测量插件
        let geometryUtil = new SGMap.GeometryUtil();
        //初始化popup
        let helpPopup: any;
        helpPopup = this.createPopup(helpPopup);
        let measurePopup: any;
        //鼠标移动事件
        const mouseMove = (e: any)=>{
            let tempPoint:any=Polygon.getFeatures()[0].geometry.coordinates[0]
            tempPoint.splice(-1,0,[e.lngLat.lng,e.lngLat.lat])
            let tempArea=geometryUtil.ringArea(tempPoint);
            tempArea=this.formatArea(tempArea);
            helpPopup
                .setLngLat(e.lngLat)
                .setHTML("<div>" + tempArea + "</div>")
                .addTo(this.map);
        }
        //新建测量面画笔-开始画面
    
        let Polygon = new SGMap.DrawPolygonHandler({
            map: this.map,
            enableEdit: false,
        });
        //mLinePolygon存储测量线面，方便清除
        this.mLinePolygon.push(Polygon);
        Polygon.startDraw();
        //监听开始画面事件
        let num=0;
        Polygon.on("draw.polygon.addPoint", ()=>{
            num++;
            if(num>=2){
                this.map.on("mousemove", mouseMove)
            }
        })
        //监听结束画面事件
        Polygon.on("draw.polygon.end", (data: any)=>{
            // 返回feature：绘图数据集合，lastPoint：前一个节点，currentPoint：当前节点
            let feature = data.features[0].geometry.coordinates[0];
            //传入polygon闭合坐标数组
            let area = geometryUtil.ringArea(feature);
            area = this.formatArea(area);
            //获取最后一个点的坐标
            let position = feature.slice(-1)[0];
            //创建弹窗并设置各个属性
            measurePopup = this.createPopup(measurePopup)
            measurePopup
                .setLngLat(position)
                .setHTML("<div>" + area + "</div>")
                .addTo(this.map);
            //mPopup存储线面弹窗，方便清除
            this.mPopup.push(measurePopup);
            helpPopup.remove();
            this.map.off("mousemove", mouseMove);
        })
    }
    /**
     * 
     * @param popup 存储弹窗的变量
     * @returns 返回创建的思极地图弹窗
     */
    private createPopup(popup: any) {
        popup = new SGMap.Popup({
            closeOnClick: false,
            offset: {
                bottom: [0, -10],
            }
        });
        return popup
    }
    /**
     * 
     * @param line 线长度
     * @returns 格式化的线长度
     */
    private formatLength(line: any): string {
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
     * @param polygon 面积大小
     * @returns 格式化的面积大小值
     */
    private formatArea(polygon: any): string {
        const area: number = polygon;
        let output: string;
        if (area > 10000) {
            output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2<sup>';
        } else {
            output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2<sup>';
        }
        return output;
    }
}