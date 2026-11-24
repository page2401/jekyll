---
title: "00. 概览与版本档案 (Jekyll v4.4)"
description: "静态网站生成器开山鼻祖 Jekyll (v4.4.1 · Ruby + Liquid + Kramdown + Rouge) 基准实测子站。"
---

# Jekyll (`4.4.1` · Ruby + Kramdown) 基准实测子站

本子模块由主仓 `page2401.github.io/docs/` 标准 GFM 母版**最小化派生适配**而来，实测静态网站生成器开山鼻祖与 GitHub Pages 历史默认引擎 **Jekyll (`jekyll@4.4.1`)** 在 **Ruby 3.2 + Bundler**、**Shopify Liquid (`4.0.4`) 模板管线**、**Kramdown (`2.6.1`) 行内属性列表 `{: .class}`** 以及 `_layouts/` / `_includes/` / `_data/` 下划线系统目录体系下的真实工程表现。

<div class="hero-grid">
  <div class="hero-card">
    <h3><a href="{% link 01-annotations.md %}">01. 专属标注与元数据 →</a></h3>
    <p>双轨实测 Kramdown 招牌 <code>{: .callout}</code> 属性列表、Liquid <code>{% raw %}{% include callout.html %}{% endraw %}</code> 与 <code>kramdown-parser-gfm</code> 对 GFM 警报的退化表现。</p>
  </div>
  <div class="hero-card">
    <h3><a href="{% link 02-diagrams.md %}">02. 流程图与时序图 →</a></h3>
    <p>母版三段 Mermaid 围栏块零改动直通，经 Kramdown 输出 <code>code.language-mermaid</code> 并挂载本地 <code>mermaid@12.3.0</code>。</p>
  </div>
  <div class="hero-card">
    <h3><a href="{% link 03-math.md %}">03. 数学公式排版 →</a></h3>
    <p>Kramdown 内置 <code>math_engine</code> 原生保护块级 <code>$$...$$</code> 为 <code>\[...\]</code>，配合本地 <code>katex@0.19.1</code> 检验单 <code>\$</code> 转义边界。</p>
  </div>
  <div class="hero-card">
    <h3><a href="{% link 04-directory/index.md %}">04. 目录结构与路由取舍 →</a></h3>
    <p>溯源 <code>_layouts/</code>、<code>_data/nav.yml</code> 下划线目录约定（<code>.nojekyll</code> 的历史由来）与编译期死链校验标签 <code>{% raw %}{% link %}{% endraw %}</code>。</p>
  </div>
  <div class="hero-card">
    <h3><a href="{% link 05-code-blocks.md %}">05. 高阶代码块与语法高亮 →</a></h3>
    <p>并列实测纯 Ruby 引擎 <strong>Rouge 4.7</strong> 在 Liquid <code>{% raw %}{% highlight typescript linenos %}{% endraw %}</code> 与 Kramdown GFM 围栏下的表现。</p>
  </div>
</div>

## 精确锁定版本档案（`Gemfile` + 本地静态资源）

实测发现：**RubyGems 上游 `liquid`（`5.14.0`）与 `rouge`（`5.1.0`）均已演进至 v5 大版本，而 `jekyll@4.4.1` 仍锁死在 `liquid ~> 4.0` 与 `rouge < 5.0`**（若在 `Gemfile` 中不锁版本同时声明 `jekyll`、`liquid`、`rouge`，Bundler 依赖求解器甚至会将 `jekyll` 回退至 2011 年的 `0.11.0`！）；此外针对 Ruby 3.2–3.4 标准库 Gem 化拆分，须显式声明 `csv`、`logger`、`base64` 与 `webrick`。全站公式字体与图表脚本均托管于 `assets/vendor/`，零外部 CDN 请求：

| 依赖包 / 资源名称 | 精确锁定版本 | 在本子站中的职责与实测边界 |
| :--- | :--- | :--- |
| `jekyll` | `4.4.1` | 2008 年创立的 Ruby 静态站点生成器鼻祖（开启 `permalink: pretty` 干净目录路由） |
| `kramdown` | `2.6.1` | 纯 Ruby Markdown 超集解析器，独创 `{: .class}` 行内属性列表（IAL）与 `markdown="1"` 块解析 |
| `kramdown-parser-gfm` | `1.1.0` | GFM 兼容层（停更于 2019 年，早于 2023 GitHub Alerts 规范，不支持 `> [!NOTE]`） |
| `rouge` | `4.7.0` | 纯 Ruby 构建期代码语法高亮器（受 Jekyll 4 约束上限锁定在 `< 5.0` 的 `4.7.0`） |
| `liquid` | `4.0.4` | Shopify 开源无逻辑安全模板引擎（提供 `{% raw %}{% include %}{% endraw %}`、`{% raw %}{% link %}{% endraw %}` 与 `relative_url` 过滤器） |
| `jekyll-sass-converter` | `3.1.0` | 内置 Dart Sass (`sass-embedded@1.108.2`) 管线，将带空 Frontmatter 的 `style.scss` 编译为 CSS |
| `csv` / `logger` / `base64` / `webrick` | `3.3.7` / `1.7.0` / `0.3.0` / `1.9.2` | 适配现代 Ruby 3.2+ 标准库外迁（Stdlib Gemification）的显式运行时依赖 |
| `katex` / `mermaid` (本地 `assets/vendor/`) | `0.19.1` / `12.3.0` | 同源离线托管 `katex.min.js`、`auto-render.min.js`、`woff2` 字体与 `mermaid.min.js` |

## 六大标准基准章节对照

| 章节路径 | 测试维度 | 相对母版 `docs/*.md` 的核心派生改造点 |
| :--- | :--- | :--- |
| [`01-annotations.md`]({% link 01-annotations.md %}) | 专属标注与元数据 | 第 2 节对比 Kramdown `{: .callout}` 属性列表与 Liquid `{% raw %}{% include callout.html %}{% endraw %}`；`<details>` 须补 `markdown="1"`；第 4 节原样保留验证 `> [!NOTE]` 退化 |
| [`02-diagrams.md`]({% link 02-diagrams.md %}) | 流程图与时序图 | 正文三段 Mermaid 代码块一字不改；Rouge 对未知语言回退输出 `<code class="language-mermaid">` 由客户端接管 |
| [`03-math.md`]({% link 03-math.md %}) | 数学公式排版 | 4 组 `$$...$$` 多行公式零反斜杠改动直出 `\[...\]`；仅第 5 节字面量 `\$29` 因 Kramdown 消费转义须改写为 `\\$29` |
| [`04-directory/`]({% link 04-directory/index.md %}) | 目录结构与路由取舍 | 根目录平铺 + `_config.yml` `exclude` 隔离工程文件 + `_data/nav.yml` 数据驱动侧边栏 + `{% raw %}{% link %}{% endraw %}` 内链校验 |
| [`05-code-blocks.md`]({% link 05-code-blocks.md %}) | 高阶代码块与语法高亮 | 对比 Liquid `{% raw %}{% highlight typescript linenos mark_lines="..." %}{% endraw %}` 与 Kramdown 围栏 ```` ```ts ```` / ```` ```diff ```` 在 Rouge 下的输出差异 |
