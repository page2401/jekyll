---
title: "04. 目录结构与路由取舍"
description: "实测 Jekyll 下划线系统目录约定（.nojekyll 的历史根源）、_data/nav.yml 数据文件侧边栏与 {% link %} 编译期死链校验。"
---

# 04. 目录结构与路由取舍（`_data/nav.yml` + `{% raw %}{% link %}{% endraw %}`）

作为 2008 年诞生的静态网站生成器鼻祖，Jekyll 定义了深刻影响整个 GitHub Pages 生态的**“根目录扫描 + 下划线 `_` 私有系统目录”**模型。将母版 `docs/04-directory/` 派生至 Jekyll 4.4 时呈现出以下标志性工程特征：

1. **为什么现代框架都必须放置 `.nojekyll`？**：Jekyll 默认把仓库根目录视为站点源，并将一切以下划线 `_` 开头的路径（`_layouts/`、`_includes/`、`_data/`、`_posts/`、`_site/`）当作内部编译源码而拒绝作为静态文件发布——这正是 Astro（`/_astro/`）、Next.js（`/_next/`）与 Docsify（`_sidebar.md`）在 GitHub Pages 部署时一旦漏放 `.nojekyll` 就会全站 404 的历史根源！
2. **根级混居与 `exclude` 黑名单**：由于文档直接平铺在仓库根目录，必须在 `_config.yml` 的 `exclude` 数组中显式屏蔽 `README.md`、`Gemfile`、`Gemfile.lock` 与本地 `vendor/`，否则这些工程文件会被误编译进最终发布的 `_site/`。
3. **`_data/nav.yml` 数据驱动侧边栏与 `{% raw %}{% link %}{% endraw %}` 标签**：
   - Jekyll 核心不内置文档侧边栏自动生成，最地道的做法是在 `_data/nav.yml` 中维护结构化 YAML 导航树（通过 `site.data.nav` 注入模板），既能自由赋予 `nested/` 中文分组标题，又避免在文档目录内散落元数据文件；
   - 原生 Kramdown 不会自动将 `[...](./nested/01-order-and-url.md)` 重写为网页路由，改用 Jekyll 4 内置的 `{% raw %}{% link 04-directory/nested/01-order-and-url.md %}{% endraw %}` 标签后，编译器不仅会自动拼接 `baseurl`（`/jekyll`）与 `permalink: pretty` 路径，还会在目标文件改名缺失时直接中断构建报错（代价是离线编辑器无法直接点击跳转）。

## 嵌套子文档入口（经 `{% raw %}{% link %}{% endraw %}` 编译期死链校验）

- [进入子文档 A：排序前缀与 URL 纯净度权衡]({% link 04-directory/nested/01-order-and-url.md %})
- [进入子文档 B：多级子目录与侧边栏同步机制]({% link 04-directory/nested/02-sidebar-sync.md %})
