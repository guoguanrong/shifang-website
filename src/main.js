import { createApp } from 'vue'
import { i18n, setupI18n } from './i18n'
import './styles/index.css'
import App from './App.vue'
import router from './router'
import { css as huiwenFont } from '@fontpkg/huiwen-mincho/Huiwen-mincho.otf?subsets'

// 将构建工具生成的字体名称写入 CSS 变量，供所有页面统一使用。
// 构建时由 vite-plugin-font 生成本站所需字符的汇文明朝体子集。
document.documentElement.style.setProperty(
  '--font-calligraphy',
  `"${huiwenFont.family}", "STKaiti", "KaiTi", serif`,
)

// 不使用顶层 await：部分内嵌 WebView / 旧版浏览器不支持，会抛 SyntaxError 导致白屏。
setupI18n()
  .catch((error) => {
    console.error('[i18n] 初始化失败，使用默认语言兜底', error)
  })
  .finally(() => {
    // 无论语言包是否加载成功都挂载应用，避免初始化异常导致整页白屏。
    const app = createApp(App)

    app.use(router).use(i18n).mount('#app')
  })
