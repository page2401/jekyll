---
title: "嵌套子页 A：排序前缀与 URL 纯净度权衡"
---

# 嵌套子页 A：排序前缀与 URL 纯净度权衡

在 Jekyll 中开启 `permalink: pretty` 后，`04-directory/nested/01-order-and-url.md` 会被编译为 `_site/04-directory/nested/01-order-and-url/index.html`（对应路由 `/jekyll/04-directory/nested/01-order-and-url/`）。保留 `01-` 文件名前缀能够让本地 IDE 与 Git 仓库按阅读顺序直观排列，但序号也会原样进入线上 URL（除非逐篇在 Frontmatter 手写 `permalink:` 覆盖）。

- [返回上级：《04. 目录结构与路由取舍》]({% link 04-directory/index.md %})
- [下一篇：《嵌套子页 B：多级子目录与侧边栏同步机制》]({% link 04-directory/nested/02-sidebar-sync.md %})
