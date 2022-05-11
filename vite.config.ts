import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// vite 提供的操作env配置变量的方法loadEnv
import { loadEnv } from "vite";
const Version = new Date().getTime();
// nodejs写法，获取项目目录
const path = require("path");
export default ({ command, mode }) => {
  return defineConfig({
    plugins: [vue()],

    base: "./",
    // 服务器配置
    server: {
      host: "0.0.0.0",
      port: Number(loadEnv(mode, process.cwd()).VITE_APP_PORT),
      strictPort: true, // 端口被占用直接退出
      https: false, // 默认用http方式
      open: true, // 在开发服务器启动时自动在浏览器中打开应用程序
      cors: true,
      proxy: {
        // 代理配置
        // 字符串简写写法
        "/api-src/hhxs-ssc": {
          // target: loadEnv(mode, process.cwd()).VITE_APP_BASE_URL,
          target: "https://testxr.piesat.cn/hhxs-ssc",
          // "http://10.1.40.25:8808/hhxs-ssc" #厚琛版本
          // target: "http://10.1.40.48:9025/hhxs-ssc", //#亚敏
          // target: 'http://10.1.40.24:8801/hhxs-ssc', //马哲
          changeOrigin: true, // 跨域配置
          rewrite: (path) => path.replace(/^\/api-src\/hhxs-ssc/, ""),
          ws: true,
          secure: true,
        },
        "/api-src/space/square": {
          // target: "http://10.1.40.48:8803/square", //#亚敏
          target: "https://testxr.piesat.cn/space/square", //测试的
          changeOrigin: true, // 跨域配置
          rewrite: (path) => path.replace(/^\/api-src\/space\/square/, ""),
          ws: true,
          secure: true,
        },
        "/api-src/space/message": {
          // target: "http://10.1.40.24:8810/message", //马哲
          // target: "http://10.1.40.48:8815", //亚敏
          target: "https://testxr.piesat.cn/space/message", //测试的
          changeOrigin: true, // 跨域配置
          rewrite: (path) => path.replace(/^\/api-src\/space\/message/, ""),
          ws: true,
          secure: true,
        },
      },
      hmr: {
        overlay: true, // 屏蔽服务器报错
      },
    },
    resolve: {
      // 设置项目文件导入路径
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    css: {
      // css预处理器
      preprocessorOptions: {
        // 引入 var.scss 这样就可以在全局中使用 var.scss中预定义的变量了
        // 给导入的路径最后加上 ;
        scss: {
          additionalData: `
            @import "@/assets/scss/common.scss"; 
            @import "@/assets/scss/reset.scss"; 
            @import "//at.alicdn.com/t/font_3351290_79as25rri25.css";
            `,
        },
      },
      postcss: {
        plugins: [require("autoprefixer")],
      },
    },
    build: {
      outDir: "social-contact",
      // 分块打包配置
      chunkSizeWarningLimit: 1500, // 分块打包，分解块，将大块分解成更小的块
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return id
                .toString()
                .split("node_modules/")[1]
                .split("/")[0]
                .toString();
            }
          },
          entryFileNames: `assets/[name].${Version}.js`,
          chunkFileNames: `assets/[name].${Version}.js`,
          assetFileNames: `assets/[name].${Version}.[ext]`,
        },
      },
    },
  });
};
