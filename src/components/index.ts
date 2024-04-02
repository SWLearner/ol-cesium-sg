import myMap from "./MyMap/MyMap.vue";

const components=[myMap];

const install=function(App:any){
    components.forEach((component)=>{
        App.component(component.name,component);
    });
}

// 批量导出
export default install