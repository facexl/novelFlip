import { defineConfig,loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import UnoCSS from 'unocss/vite'
import path  from 'path'

// https://vitejs.dev/config/
export default defineConfig(({command, mode})=>{
  console.log(command,mode)
  return {
    plugins: [
      vue(),
      AutoImport({
        imports: ['vue','vue-router'],
      }),
      Components({ 
        dts: true,
      }),
      UnoCSS(),
    ],
    envDir:'./envs',
    //    base:mode==='development'?'./':'/admin/',
    // base:mode==='production'?'/':`./`,
    base:'/',
    resolve:{
      alias:{
        '@': path.resolve(__dirname,'src'),
      },
      extensions:['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
    },
    build: {
      target: 'modules',
      outDir: 'dist', //指定输出路径
      minify: 'terser', // 混淆器，terser构建后文件体积更小
        
      brotliSize: true, /* 压缩大型输出文件可能会很慢，因此禁用该功能可能会提高大型项目的构建性能 */
      cssCodeSplit: false, /* 整个项目中的所有 CSS 将被提取到一个 CSS 文件中 */
      chunkSizeWarningLimit: 1500, /* chunk 大小警告的限制（以 kbs 为单位） */
      sourcemap: false, /* 构建后是否生成 source map 文件 */
      assetsDir: 'resource', /* 指定生成静态资源的存放路径 */
      emptyOutDir: true, /* 默认情况下，若 outDir 在 root 目录下，则 Vite 会在构建时清空该目录 */
    }
  }})

