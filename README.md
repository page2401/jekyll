# Jekyll (`v4.4.1`) 静态网站生成基准子站

本仓库为 [`page2401.github.io`](https://github.com/page2401/page2401.github.io) 多生成器横向对比工作台的 **Jekyll (`4.4.1` · Ruby + Liquid + Kramdown + Rouge)** 派生子模块（挂载路径 `/jekyll/`）。

## 核心栈与精确锁定版本 (`Gemfile`)

- **核心生成器**：`jekyll` `4.4.1`
- **Markdown 解析器**：`kramdown` `2.6.1` + `kramdown-parser-gfm` `1.1.0`
- **语法高亮与模板引擎**：`rouge` `4.7.0` + `liquid` `4.0.4` + `jekyll-sass-converter` `3.1.0`
- **本地离线前端资源**：`assets/vendor/` 内置 `katex@0.19.1`（含 `auto-render.min.js` 与 `woff2` 字体）与 `mermaid@12.3.0`，零外部 CDN 请求

## 本地构建与预览

```bash
bundle config set --local path 'vendor/bundle'
bundle install
bundle exec jekyll build
```

构建产物输出至 `_site/`，线上由 `.github/workflows/deploy-page.yml` 自动构建并强制推送至孤儿分支 `page`。
