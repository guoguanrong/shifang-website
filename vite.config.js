import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Font from 'vite-plugin-font'

export default defineConfig({
  plugins: [
    vue(),
    Font.vite({
      // 官网极简模式：仅打包源码和语言包中实际出现的字符。
      scanFiles: ['src/**/*.{vue,js,json}'],
      // 字体源文件来自 @fontpkg，允许插件处理该 node_modules 资源。
      exclude: [],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    // 开发环境跨域代理：/api 转发到 api2 网关；后端接口本身带 /api 前缀，因此不做 rewrite。
    proxy: {
      '/api': {
        target: 'https://api2.shifangtemple.org',
        changeOrigin: true,
      },
    },
  },
  build: {
    // 锁定到 ES2019：内嵌 WebView（旧版 Chromium）不支持可选链/空值合并/顶层 await 等
    // 新语法，锁低目标让 esbuild 自动转译，避免运行期 SyntaxError 白屏。
    target: 'es2019',
    rollupOptions: {
      output: {
        entryFileNames: 'js/[name]-[hash].js',
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: ({ name }) => {
          const assetName = name || ''

          if (assetName.endsWith('.css')) {
            return 'css/[name]-[hash][extname]'
          }

          if (/\.(png|jpe?g|gif|svg|webp|avif)$/i.test(assetName)) {
            return 'images/[name]-[hash][extname]'
          }

          return 'assets/[name]-[hash][extname]'
        }
      }
    }
  }
})
