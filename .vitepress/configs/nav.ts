/* configs/nav.ts */
import type { DefaultTheme } from 'vitepress'

export const nav: DefaultTheme.Config['nav'] = [
  { text: '首页', link: '/' },
  { text: 'MacroSTAR', link: 'https://macrostar.top/' },
  {
    text: '3.0.0',
    items: [
      { text: 'README', link: 'https://github.com/MacroSTAR-MS/Lunar_Bot/blob/main/README.md' },
      ],
  },
]