---
title: "05. 高阶代码块与语法高亮"
description: "实测 Jekyll 4.4.1 + Rouge 4.7.0 的 Liquid {% highlight %} 行号/行高亮标签、Kramdown 围栏代码块与标准 diff 补丁着色。"
---

# 05. 高阶代码块与语法高亮（Jekyll Liquid `highlight` + Rouge `4.7.0`）

技术文档中超过 40% 的篇幅由代码块构成，但标准 CommonMark / GitHub Flavored Markdown **仅定义了围栏语言标识（```` ```ts ````）**，并未定义文件名标题栏、指定行高亮、带语法着色的行级 Diff 以及多语言 Tab 代码组。本文件由标准 GFM 母版派生适配至 **Jekyll (`jekyll@4.4.1` + `kramdown@2.6.1` + `rouge@4.7.0`)**。

## 1. 代码块文件名标题栏与基础语法高亮（Liquid `highlight` vs 围栏块）

Jekyll 使用纯 Ruby 编写的 **Rouge**（复用 Pygments 经典 `.k` / `.nf` / `.s2` CSS Token 类名规范）完成零运行时服务端语法高亮，并同时支持两套入口：

1. **标准 GFM 三反引号围栏（```` ```ts ````）**：经 `kramdown-parser-gfm` 解析输出 `<div class="language-ts highlighter-rouge"><div class="highlight"><pre>...</pre></div></div>`，不支持在围栏首行追加 `title="..."` 或 `{1,3}` 元数据；若需文件名角标，可利用 Kramdown `{: .code-filename}` 行内属性列表修饰紧邻上方的文件名段落。
2. **经典 Liquid 标签 `{% raw %}{% highlight typescript linenos %}{% endraw %}`**：Jekyll 自 2008 年延续至今的招牌语法，构建期直出 `<figure class="highlight">` 与双列 `<table class="rouge-table">` 行号结构（注意：若该代码块内部包含双花括号或百分号模板语法，内部还须套一层 `{% raw %}{% raw %}{% endraw %}` 防求值！）：

`scripts/resolve-route.ts`
{: .code-filename}

{% highlight typescript linenos %}
export interface RouteContext {
  basePath: string
  slug: string
  cleanUrls: boolean
}

export function formatDocRoute(ctx: RouteContext): string {
  const prefix = ctx.basePath.endsWith('/') ? ctx.basePath : `${ctx.basePath}/`
  const normalized = ctx.slug.replace(/^\/+|\/+$/g, '')
  if (!normalized || normalized === 'index') return prefix
  return ctx.cleanUrls ? `${prefix}${normalized}/` : `${prefix}${normalized}.html`
}
{% endhighlight %}

对比下方保持母版纯净写法的标准 ```` ```ts ```` 围栏块（同样由 Rouge 静态分词，但不生成行号表格）：

```ts
export function isCleanDirectoryRoute(route: string): boolean {
  return route.endsWith('/') && !route.endsWith('/index.html')
}
```

## 2. 关键行聚焦与高亮（Jekyll 4 `mark_lines` 参数）

Jekyll 4 为内置 `{% raw %}{% highlight %}{% endraw %}` 标签新增了原生 `mark_lines="3 7 8 9"` 参数（注意：**不支持 `7-9` 连字符简写**，需逐行以空格列出 `3 7 8 9`），底层调用 `Rouge::Formatters::HTMLHighlightLines` 为目标行包裹 `<span class="hll">`：

`bench.config.json`
{: .code-filename}

{% highlight json linenos mark_lines="3 7 8 9" %}
{
  "id": "ssg-benchmark",
  "routeStyle": "clean",
  "strictZeroCdn": true,
  "markdown": {
    "mathEngine": "katex",
    "diagramEngine": "mermaid",
    "lineHighlight": true,
    "codeTransformers": ["diff", "focus"]
  }
}
{% endhighlight %}

## 3. 代码增删对比着色（Rouge `diff` 词法分析器）

与 Pygments 高度同源，Rouge 内置 `Rouge::Lexers::Diff` 处理标准 ```` ```diff ```` 围栏块，将删除行包裹为 `<span class="gd">`、新增行包裹为 `<span class="gi">`（兼容 GitHub 原版写法，但不保留底层 TypeScript 语法高亮）：

```diff
 export function mountSubsite(baseDir: string, subPath: string): string | null {
-  const cleanRel = decodeURIComponent(subPath).replace(/\.\./g, '')
-  return `${baseDir}/${cleanRel}`
+  const resolvedBase = path.resolve(baseDir)
+  const target = path.resolve(resolvedBase, decodeURIComponent(subPath).replace(/^\/+/, ''))
+  return target.startsWith(`${resolvedBase}${path.sep}`) ? target : null
 }
```

## 4. 多语言运行时命令组（Kramdown `<details markdown="1">` 零脚本折叠组）

Jekyll 核心与 Kramdown 均未内置多语言横向 Tab 语法（亦无法像 MDX 框架那样直接在 Markdown 中 `import <Tabs>` 组件）；在不引入客户端切换脚本的前提下，最地道的原生做法是使用声明了 `markdown="1"` 的语义化 `<details>` 折叠组：

<details markdown="1" open>
<summary>Node.js (<code>package.json</code>)</summary>

```bash
npm ci && npm run build
```

</details>

<details markdown="1">
<summary>Deno 2 (<code>deno.json</code>)</summary>

```bash
deno task build
```

</details>

<details markdown="1">
<summary>Python (<code>requirements.txt</code>)</summary>

```bash
pip install -r requirements.txt && sphinx-build -b dirhtml . _build/dirhtml
```

</details>

<details markdown="1">
<summary>Ruby (<code>Gemfile</code>)</summary>

```bash
bundle install && bundle exec jekyll build
```

</details>

## 5. 四大底层高亮引擎能力对照小结

| 高亮引擎代表 | 典型采用框架 | 构建期零运行时 JS | 原生行号 / 行高亮 | 保留词法着色的 Diff |
| :--- | :--- | :--- | :--- | :--- |
| **Shiki / Expressive Code** | VitePress、Starlight、Fumadocs、Nextra、Rspress、Nuxt、Quartz | ✅ 纯静态内联样式 | ✅ `{1,3-5}` / `[!code highlight]` | ✅ `// [!code ++]` |
| **Prism.js** | Docusaurus、VuePress、Eleventy (plugin)、Gatsby | ✅ 静态 Token 类名 | ✅ `{1,3-5}` / 魔法注释 | ⚠️ 需配 diff-highlight 插件 |
| **Pygments / Rouge** | MkDocs Material、Sphinx、Pelican、Jekyll | ✅ Python/Ruby 编译直出 | ✅ `hl_lines` / `emphasize-lines` | ⚠️ 仅标准 `diff` 块红绿 |
| **Chroma / Giallo / hljs** | Hugo (Go Chroma)、Zola (Rust Giallo)、mdBook (hljs) | ✅ (mdBook 为客户端 hljs) | ✅ Hugo/Zola 原生 `hl_lines` | ⚠️ 仅标准 `diff` 块红绿 |
