module.exports = {
  // 站点配置
  lang: 'zh-CN',
  title: '知识总结',
  description: 'vitepress站点总结知识',
  theme: '@vitepress/theme-default',
  themeConfig: {
    logo: '/images/logo.png',
    nav: [
      { text: '首页', link: '/', sidebar: false },
      {
        text: '面试题',
        items: [
          {
            text: '面试一',
            link: '/interview/'
          },
          {
            text: '面试二',
            link: '/interview/second'
          }
        ]
      },
      { text: '概念', link: '/node/' },
      { text: '构建', link: '/build/' },
      { text: 'vue', link: '/vue/' },
      { text: 'react', link: '/react/' },
      { text: 'PDF知识点', link: '/docs/2022.pdf' }
    ]
  },

  head: [['link', { rel: 'icon', href: '/images/logo.png' }]],
  markdown: {
    lineNumbers: true
  }
}
