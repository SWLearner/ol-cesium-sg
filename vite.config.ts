import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
//element plus
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
//图标
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
//cdn资源引入
// import { Plugin as importToCDN } from 'vite-plugin-cdn-import'
import { visualizer } from 'rollup-plugin-visualizer';
import externalGlobals from "rollup-plugin-external-globals";
// https://vitejs.dev/config/

//接口url
const urlIP = 'http://10.6.2.204/api'
export default defineConfig({
  plugins: [
    vue(),
    //element plus
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver(), IconsResolver({ prefix: 'icon' })],
    }),
    //命名插件
    VueSetupExtend(),
    //图标插件
    Icons({
      compiler: 'vue3',
      autoInstall: true
    }),
    //cdn
    visualizer({ open: true }),
    externalGlobals({
      "sgmap": "SGMap",
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  //配置scss
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       additionalData: `
	// 	      @import "@/assets/styles/var.scss";
  //         `,
  //       // @import "@/assets/styles/element-theme.scss";
  //       // @import "@/assets/styles/element-plus.scss";
  //       // additionalData: '@use "@/assets/scss/global.scss" as *;'
  //     },
  //   }
  // },
  //跨域请求
  // 线上接口
  server: {
    //配置此处会暴露网络网址以访问
    host: '0.0.0.0',
    port: 8081,
    // 是否自动启动
    open: true,
    proxy: {
      '/api': {
        //代理服务地址
        target: 'http://localhost:8080/',
        //是否改变原域名；是否允许跨域
        changeOrigin: true,
        //如果是https接口需要配置此参数
        // secure:false,
        //
        rewrite: (path) => path.replace(/^\/tdt/, ''),
      },
      '/mtxy-system-service': {
        target: `${urlIP}`,
        changeOrigin: true,
      },
      '/mtxy-statistics-service': {
        target: `${urlIP}`,
        changeOrigin: true //是否跨域
      },
      '/mtxy-regulate-service': {
        // target: 'http://10.6.4.74:8888',
        // target: 'http://10.6.2.66:8081',
        target: `${urlIP}`,
        changeOrigin: true //是否跨域
      },
      '/oss/system/default_icon': {
        // target: 'http://10.6.4.74:8888',
        // target: 'http://10.6.2.66:8081',
        target: `${urlIP}`,
        changeOrigin: true //是否跨域
      },
    },
  },
  //打包配置
  build: {
    lib: {
      // 入口文件，因为库模式不能用html页面作为入口
      entry: resolve(__dirname, 'src/components/index.ts'),
      // 库名称
      name: 'mycomap',
      // 打包后文件的名称
      fileName: ((format) => `mycomap.${format}.ts`),
      // 不写也可以，默认就是['es','umd']
      formats: ['es', 'umd']
    },
    // 自定义底层的 Rollup 打包配置
    rollupOptions: {
      // 确保某些库不进行打包，作为外部依赖
      external: ['vue'],
      output: {
        // 打包时全局变量Vue就是vue
        globals: {
          vue: 'Vue',

        }
      },

    }
  },

})
