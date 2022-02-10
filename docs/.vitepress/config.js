module.exports = {
  // 站点配置
  lang: 'zh-CN',
  title: '知识总结',
  description: 'vitepress站点总结知识',
  // 主题和它的配置
  theme: '@vuepress/theme-default',
  themeConfig: {
    logo: '/static/img/logo.png',
    nav: [
      { text: '首页', link: '/' },
      { text: '构建', link: '/build/' },
      { text: 'vue', link: '/vue/' },
    ],
  },
  head: [['link', { rel: 'icon', href: '/static/img/logo.png' }]],
  markdown: {
    lineNumbers: true,
  },
}
