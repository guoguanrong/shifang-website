# shifang-website

十方殿官方网站前端。基于 Vue 3 + Vite 的多语言响应式站点，包含首页、文化溯源、神祇百科、参拜礼仪、道法养生、道会活动、共建十方、云端共筑、祈福纳祥与社区资讯等板块。

## 技术栈

| 类别 | 选型 |
|------|------|
| 框架 | Vue 3（`<script setup>` 组合式 API） |
| 路由 | Vue Router 5（HTML5 History 模式） |
| 构建 | Vite 8（Rolldown）+ `@vitejs/plugin-vue` |
| 国际化 | vue-i18n 11（简体中文随首包，English / 繁體中文 按需加载） |
| 字体 | `vite-plugin-font` + `@fontpkg/huiwen-mincho`（按实际字符子集化） |
| HTTP | axios（`src/api/http.js` 统一实例） |

## 快速开始

```bash
npm install        # 安装依赖
npm run dev        # 开发服务器 http://localhost:5173（监听 0.0.0.0）
npm run build      # 生产构建，产物输出到 dist/
npm run preview    # 本地预览构建产物 http://localhost:4173
```

环境变量：`VITE_API_BASE_URL` —— 接口域名，缺省为空字符串（见 `src/api/http.js`）。注册短信验证还需要配置 `VITE_FIREBASE_API_KEY`、`VITE_FIREBASE_AUTH_DOMAIN`、`VITE_FIREBASE_PROJECT_ID`、`VITE_FIREBASE_APP_ID`，示例见 `.env.example`。这些是 Firebase Web 客户端配置，不要在前端放置服务账号私钥。

短信验证码通过 Firebase `RecaptchaVerifier` 获取 reCAPTCHA token，再提交给 `/sms/sendCode`。上线前需在 Firebase Authentication 启用电话验证，并将当前网站域名加入授权域名；后端应使用同一个 Identity Platform 项目校验 token，并在发送成功后返回 `sessionInfo`。

## 路由一览

除首页外全部为路由级懒加载；未匹配的地址由 catch-all 重定向回 `/`。二级页面通过 `meta.navigation` 声明所属板块，供顶部导航高亮。

| 板块 | 路径 | 页面 |
|------|------|------|
| 首页 | `/` | 首页（站点唯一入口，静态引入随首包） |
| 文化 | `/culture-origins` | 文化渊源 |
| 神祇 | `/deities` | 神祇百科 |
| 神祇 | `/deities/doumu` | 神祇详情 · 斗姆元君（静态路径版） |
| 神祇 | `/deities/:deityId` | 神祇详情（枚举 `beidou` `taisui` `sanguan` `wenchang` `kuixing` `zhaogongming` `wanglingguan` `guansheng` `dongyue` `leizun` `fanli` `tudigong`） |
| 神祇 | `/deities/offering` | 神像供奉 |
| 礼仪 | `/etiquette` | 参拜礼仪 |
| 养生 | `/wellness` | 道法养生 |
| 活动 | `/events` | 道会活动 |
| 共建 | `/co-build` | 共建十方 |
| 共建 | `/co-build/donation` | 随喜捐赠 |
| 云端共筑 | `/cloud-build` | 云端共筑（云监工 / 修缮直播） |
| 云端共筑 | `/cloud-build/fund-details` | 资金明细 |
| 祈福 | `/blessings` | 祈福纳祥 |
| 祈福 | `/blessings/lamps` | 供灯祈福 |
| 祈福 | `/blessings/lamps/:lampId` | 灯供详情（`guangming` `taisui` `wenchang`） |
| 祈福 | `/blessings/talisman` | 电子护身符 |
| 祈福 | `/blessings/seasonal-reminders` | 节气提醒 |
| 祈福 | `/blessings/taoist-lots` | 道教抽签 |
| 祈福 | `/blessings/five-elements` | 五行人格测试 |
| 祈福 | `/blessings/taoist-zodiac` | 中国道教星座（本命星次） |
| 祈福 | `/blessings/fortune-review` | 运势评测 |
| 社区 | `/testimonials` | 信众实录 |
| 社区 | `/messages` | 各界寄语 |
| 社区 | `/messages/video` `/messages/article` | 寄语详情（视频 / 图文） |
| 社区 | `/news` `/news/detail` | 最新动态 / 动态详情 |

`scrollBehavior`：路由带 hash 时平滑滚动到锚点（首页模块导航依赖此行为），否则回到顶部；捐赠页内部的 query 切换不触发滚动。

## 目录结构

```
shifang-website/
├── index.html
├── vite.config.js               # @ 别名、字体子集化、ES2019 目标、产物分类输出
├── public/favicon.svg
└── src/
    ├── api/http.js              # axios 实例（含拦截器示例）
    ├── assets/                  # 按业务分目录的图片资源（blessings/ deities/ offerings/ …）
    ├── components/
    │   ├── home/                # 首页各区块（导航、主视觉、内容模块、页脚）
    │   ├── common/              # 跨页复用：仪式感按钮、小标题、返回顶部、页面背景
    │   ├── community/           # 社区资讯外壳：列表页 / 详情页
    │   ├── blessings/           # 祈福测算：布局外壳、签筒动画、结果弹窗、生辰滚轮
    │   ├── offerings/           # 供奉/点灯：页面外壳、下单表单、确认弹窗、须知
    │   ├── co-build/ cloud-build/ deities/ etiquette/ events/ wellness/ auth/
    ├── composables/useAuthModal.js   # 登录/注册弹窗的全局开关状态
    ├── i18n/
    │   ├── index.js             # 语言懒加载、localStorage 持久化、布局标记、文案编译兜底
    │   └── locales/             # zh-CN.js / zh-TW.js / en.js + 19 个按业务拆分的分册
    ├── router/index.js          # 路由表、锚点滚动、catch-all
    ├── styles/
    │   ├── index.css            # 样式入口：字体变量 → 设计令牌 → reset → 多语言布局
    │   ├── base/                # variables.css（设计令牌）、reset.css（全局重置）
    │   ├── locale-layouts.css   # 国际版排版覆盖
    │   └── *.css                # 各业务页样式（祈福、捐赠、供灯、资金明细…）
    ├── utils/lunar-birthday.js  # 农历日期换算（本命星次的生辰选择）
    ├── views/                   # 27 个路由页面
    ├── App.vue
    └── main.js                  # 字体注入 + i18n 初始化后挂载
```

## 关键设计说明

**多语言**：简体中文随首包，`en` / `zh-TW` 为异步 chunk，首次切换时加载并缓存。用户选择写入 `localStorage`（`shifang-locale-v2`），刷新后保持；`html[data-locale-layout]` 区分中文紧凑排版与国际版可扩展排版，组件内无需写语言分支。

**文案编译兜底**：vue-i18n 会把 `{}` `@` `|` 当作模板语法，运营文案撞上时（如 `contact@shifang.org`）会抛错并导致整页白屏。`i18n/index.js` 的 `safeMessageCompiler` 在编译失败时按纯文本渲染并打日志；写文案仍建议用字面量转义，如 `contact{'@'}shifang.org`。

**字体子集化**：`vite-plugin-font` 扫描 `src/**/*.{vue,js,json}`，只打包源码与语言包中实际出现的字符；`main.js` 把生成的字体族写入 `--font-calligraphy` 供全站使用。

**构建目标锁定 ES2019**：站点需运行在内嵌 WebView（旧版 Chromium）中，锁定低目标让 esbuild 自动转译可选链、空值合并等新语法；同时代码里避免使用顶层 `await`（含 i18n 初始化），否则旧内核会抛 `SyntaxError` 白屏。

**产物按类型分目录**：输出为 `js/`、`css/`、`images/`、`assets/` 四类并带 hash，便于缓存与部署。

**祈福互动的状态机**：以抽签为例 —— 点击「抽签」随机取签并进入 `drawing`（签筒摇晃），动画结束时 `LotVessel` 抛出 `draw-end` 进入 `revealing`（签支升起），`reveal-end` 后才打开结果弹窗；期间按钮禁用并置 `aria-busy`，切换签筒会重置全部状态。五行测试、运势评测、本命星次复用同一套结果弹窗组件。

**弹窗与无障碍**：弹窗统一使用原生 `<dialog>` + `Teleport`，打开时锁定 `body` 滚动、关闭后把焦点还给触发元素；选项类按钮用 `aria-pressed` 标记选中态；`prefers-reduced-motion` 下关闭位移与缩放动画。

**登录弹窗**：`useAuthModal()` 是模块级单例，对外只暴露只读 ref 与打开/关闭/切换模式三个方法，任意组件都可唤起登录。

## 常见改动

- **新增页面**：在 `views/` 建组件 → 在 `router/index.js` 加懒加载路由（需要导航高亮时补 `meta.navigation`）→ 文案写进三份语言包 → 样式放 `styles/` 或组件内 scoped。
- **新增语言**：在 `i18n/locales/` 增加聚合文件与业务分册 → 在 `i18n/index.js` 的 `localeOptions`（选择器数据源）与 `localeLoaders`（按需加载）中注册；国际版排版由 `data-locale-layout` 自动生效。
- **接入接口**：复用 `api/http.js` 的 `apiClient`，域名通过 `VITE_API_BASE_URL` 配置，拦截器的登录态与错误提示示例已在文件中给出。

## 个人设置、实名认证与政策页面

- `/account/certificates`：设计稿证书样例，WebP 预览与 PNG 原图下载分开加载。
- `/account/settings`：昵称、电话与邮箱表单；使用现有演示会话保存，退出登录时清除，不代表服务端资料已更新。
- `/account/verification`：身份证、护照与驾照三种认证方式，支持双面图片选择、预览、删除和校验。草稿仅留在当前页面内存中，不持久化证件号码或照片；离开页面或登录状态变化时清除。认证接口尚未接入，提交仅检查填写内容，不模拟审核成功。
- `/contact`、`/legal`、`/privacy`、`/compliance`：页脚信息页面，政策正文与链接支持语言切换。

上述页面复用 `AccountPageShell`、`OrnateSectionHeading` 和 `CeremonialButton`。证件图片交互封装于 `components/account/VerificationUpload.vue`；类型和素材映射放在 `data/verification.js`；文案分别放在 `account-details.*.js` 与 `policy-pages.*.js` 的简体、繁体和英文语言包中。样式沿用项目的业务 CSS 与 `data-locale-layout` 约定，不依赖固定画布尺寸。

实名认证提交通过前端检查后会打开 `VerificationResultDialog`，默认明确标注成功样式演示，不改变实名状态。未来只有收到服务端确认后才传入 `verified` 展示正式成功文案。个人设置保存后回显实际保存的昵称、邮箱及存储结果；两个弹窗共用 `AccountResultDialog`，支持键盘、焦点恢复及三语响应式布局。

## 全站快捷入口与太岁生肖

`App.vue` 统一挂载 `SiteQuickActions`，各页无需重复添加返回顶部按钮。三个入口使用设计稿切图：太岁生肖进入 `/tai-sui-zodiac`，加入义工进入现有 `/account/volunteer`，返回顶部兼容减少动态效果的系统偏好。

太岁轮盘支持每次顺／逆时针旋转 30°，点击可放大并缩放查看。界面文案位于 `site-tools.*.js` 三种语言包，轮盘保留设计稿原始中文图文。移动端缩小快捷入口并适配安全区。

## 部署

```bash
npm run build   # 产出 dist/：index.html + js/ css/ images/ assets/
```

使用 HTML5 History 模式，服务端需把未匹配的路径回退到 `index.html`，否则刷新二级页面会 404。产物目标为 ES2019，部署环境无需额外 polyfill。
