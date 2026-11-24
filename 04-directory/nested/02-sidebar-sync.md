---
title: "嵌套子页 B：多级子目录与侧边栏同步机制"
---

# 嵌套子页 B：多级子目录与侧边栏同步机制

在 Jekyll 经典工程实践中，多级文档侧边栏统一收敛在 `_data/nav.yml` 数据文件中，由 `_layouts/default.html` 通过 `site.data.nav` 循环渲染。这种方式让 `04-directory/nested/` 目录保持 100% 纯净（无需放置 `_index.md`、`_category_.json` 或 `_meta.js`），并为英文目录 `nested` 优雅指定中文分组标题，但每新增一篇文档也必须同步在 `_data/nav.yml` 中登记路由。

- [返回上一篇：《嵌套子页 A：排序前缀与 URL 纯净度权衡》]({% link 04-directory/nested/01-order-and-url.md %})
- [返回上级：《04. 目录结构与路由取舍》]({% link 04-directory/index.md %})
