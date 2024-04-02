import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
// import './assets/styles/index.scss'
// import './assets/styles/public.scss'
// import './assets/styles/iconfont.css'
// import './components/openlayers.ts'

const app=createApp(App);
app.mount('#app')
// app.use((req,res,next)=>{
//     res.setHeader('Access-Control-Allow-Origin','https://t0.tianditu.gov.cn/vec_c/wmts?tk=f47da4a06995b322a237c9278a84f12c');
//     next();
// })