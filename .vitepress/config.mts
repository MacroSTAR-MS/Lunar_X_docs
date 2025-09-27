import { defineConfig } from 'vitepress'
import { nav } from './configs'
import { generateSidebar } from 'vitepress-sidebar'
const sidebarOptions = {
  documentRootPath: '/', // 根据您的项目结构调整
  collapsed: false,
  capitalizeFirst: true,
  debugPrint: false, // 调试时启用，查看控制台输出
  // 其他可选配置...
}

export default defineConfig({
  title: "Lunar  X Docs",
  description: "您的下一个选择",
  lastUpdated: true,
  base: '/',
  head: [
      ['link', { rel: 'icon', href: '/logo.png' }]
  ],
  themeConfig: {
    nav,
    logo: '/logo.png',
     footer: { 
      message: 'Released under the GPL 3 License.', 
      copyright: 'Copyright © 2021-2025 MacroSTAR Studio'
    }, 
    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换'
                },
              },
            },
          },
        },
      },
    },
    // editLink: {
    //   pattern: ''
    // },
    sidebar: generateSidebar(sidebarOptions),
    socialLinks: [
      { icon: 'github', link: 'https://github.com/MacroSTAR-Studio/Lunar_Bot' }
    ]      
  },

   markdown: {
    image: {
     // 开启图片懒加载
      lazyLoading: true
    },
    config: (md) => {

      // 代码组中添加图片
      md.use((md) => {
        const defaultRender = md.render
        md.render = (...args) => {
          const [content, env] = args
          const currentLang = env?.localeIndex || 'root'
          const isHomePage = env?.path === '/' || env?.relativePath === 'index.md'  // 判断是否是首页

          if (isHomePage) {
            return defaultRender.apply(md, args) // 如果是首页，直接渲染内容
          }
          // 调用原始渲染
          let defaultContent = defaultRender.apply(md, args)
          // 替换内容
          if (currentLang === 'root') {
            defaultContent = defaultContent.replace(/提醒/g, '提醒')
              .replace(/建议/g, '建议')
              .replace(/重要/g, '重要')
              .replace(/警告/g, '警告')
              .replace(/注意/g, '注意')
          } else if (currentLang === 'ko') {
            // 韩文替换
            defaultContent = defaultContent.replace(/提醒/g, '알림')
              .replace(/建议/g, '팁')
              .replace(/重要/g, '중요')
              .replace(/警告/g, '경고')
              .replace(/注意/g, '주의')
          }
          // 返回渲染的内容
          return defaultContent
        }

        // 获取原始的 fence 渲染规则
        const defaultFence = md.renderer.rules.fence?.bind(md.renderer.rules) ?? ((...args) => args[0][args[1]].content);

        // 重写 fence 渲染规则
        md.renderer.rules.fence = (tokens, idx, options, env, self) => {
          const token = tokens[idx];
          const info = token.info.trim();

          // 判断是否为 md:img 类型的代码块
          if (info.includes('md:img')) {
            // 只渲染图片，不再渲染为代码块
            return `<div class="rendered-md">${md.render(token.content)}</div>`;
          }

          // 其他代码块按默认规则渲染（如 java, js 等）
          return defaultFence(tokens, idx, options, env, self);
        };
      })

    }
  },
})
