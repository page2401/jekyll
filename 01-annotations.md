---
title: "01. 专属标注与元数据"
description: "测试 Jekyll 4.4 的 _config.yml Frontmatter Defaults、Kramdown {: .callout} 属性列表、Liquid include 组件与 GFM Alerts 退化表现。"
---

# 01. 专属标注与元数据（Kramdown `{: .callout}` + Liquid Include）

不同静态网站生成器对“提示框 / 标注（Callouts / Admonitions）”和页面元数据的语法约定存在显著分歧。本文件由标准 GFM 母版派生适配至 **Jekyll (`jekyll@4.4.1` + `kramdown@2.6.1`)**。

## 1. Frontmatter 元数据与 `defaults` 作用域机制

Jekyll 是历史上第一个将 **YAML Frontmatter（三短横线 `---` 头信息）** 引入静态网站领域的开山鼻祖。通过在全局 `_config.yml` 中配置 `defaults` 作用域规则自动注入 `layout: "default"`，单篇文档得以保持与母版完全一致的极简双字段头信息：

- **当前页标题字段**：`title: "01. 专属标注与元数据"`
- **页面摘要字段**：`description: "..."`
- **派生观察点**：Jekyll 不强制任何 Schema 校验；需要注意的是，任何文件只要顶部带有两行空的 `---` 头信息（例如 `assets/css/style.scss`），就会被纳入 Liquid + Sass 编译管线，反之则作为纯静态文件原样拷贝。

## 2. 标准提示语义块（Kramdown IAL 属性列表 vs Liquid 组件）

Jekyll 生态不存在 `::: warning` 三冒号容器语法，而是形成了极具辨识度的两套经典原生方案：**Kramdown 行内属性列表（Inline Attribute Lists, `{: .class}`）** 与 **Shopify Liquid 局部模板（`{% raw %}{% include callout.html %}{% endraw %}`）**：

> **默认信息提示块（Kramdown IAL 属性列表）**：在标准引用块紧邻下一行追加 `{: .callout .callout-info}`，Kramdown 解析器即可在不写任何 HTML 标签的前提下直接向生成的 `<blockquote>` 注入语义类名；静态站点对比平台的每个子模块均独立维护 `main`（源码）与 `page`（构建产物）双分支。
{: .callout .callout-info}

> **性能优化建议（Kramdown `{: .callout-tip}` 零运行时修饰）**：Kramdown IAL 属性列表语法简洁且 100% 在 Ruby 构建期完成 AST 属性挂载，内部可自由混排 `行内代码`、**加粗强调**与链接，无需像短代码那样担心多行字符串转义。
{: .callout .callout-tip}

{% include callout.html
  type="warning"
  title="Liquid 模板预处理器边界注意（_includes/callout.html 组件）"
  content="Jekyll 在调用 Kramdown 前会先对正文执行 **Shopify Liquid** 求值，并通过 `markdownify` 过滤器渲染参数内容。若要在文档或代码块中原样展示双花括号或百分号指令，必须使用 `raw` / `endraw` 原生块包裹防提前解析！"
%}

{% include callout.html
  type="danger"
  title="不可逆分支覆盖警告"
  content="自动化流水线在向 `page` 分支推送构建产物时会启用 `force_orphan: true`，切勿在 `page` 分支直接手工修改代码！"
%}

## 3. 可折叠详情容器（Kramdown `markdown="1"` 块级开关）

实测发现 Kramdown 的一个经典边界：**默认 `parse_block_html: false` 会忽略原生 HTML `<details>` 内部的围栏代码块，而全局开启 `parse_block_html: true` 又会导致 `<summary>` 标签闭合异常吞噬后续章节**。最地道的 Kramdown 解法是在标签上显式声明 `markdown="1"` 属性（构建后自动剥离该属性）：

<details markdown="1">
<summary>点击展开查看 Kramdown IAL 与 Liquid Include 折叠容器源码结构</summary>

{% raw %}
```markdown
> Kramdown 招牌行内属性列表（IAL）提示框。
{: .callout .callout-tip}

{% include callout.html type="warning" title="Liquid 组件标题" content="支持 **Markdown** 内联语法" %}
```
{% endraw %}

除了 Rouge 语法高亮代码块，声明 `markdown="1"` 后的折叠容器内同样支持列表、表格与数学公式 $f(x) = x^2 + 1$。

</details>

## 4. GitHub 风格引用警报（GFM Alerts）跨框架直通测试

以下三段**保持母版原文一字不改**！实测可见：尽管启用了官方 `kramdown-parser-gfm@1.1.0`，但由于该解析器发布于 2019 年（早于 GitHub 2023 年推出的 Alerts 语法规范），Jekyll 会将其**退化为普通 `<blockquote>` 引用块并原样露出 `[!NOTE]` / `[!CAUTION]` 字符串**：

> [!NOTE]
> 这是一段标准的 GitHub Flavored Markdown `[!NOTE]` 警报文本，用于检验各生成器对母版语法的零改造直通能力。

> [!IMPORTANT]
> 跨平台迁移 Markdown 文档时，是否原生兼容 `> [!IMPORTANT]` 与 `> [!WARNING]` 直接决定了母版文档的派生改造成本。

> [!CAUTION]
> 若目标生成器未内置 GFM Alert 解析器（如 VuePress v1、Starlight 默认配置、Docsify v4 旧插件），上方标记会退化为普通引用块并原样露出 `[!CAUTION]` 字符串。
