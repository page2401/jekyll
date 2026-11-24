(function () {
  var ESCAPED_DOLLAR_TOKEN = '\uE000';
  var lastMermaidDark = null;

  function isDarkTheme() {
    var root = document.documentElement;
    return (
      root.getAttribute('data-theme') === 'dark' ||
      root.classList.contains('dark')
    );
  }

  function buildToc() {
    var prose = document.getElementById('jekyll-prose');
    var list = document.getElementById('jekyll-toc-list');
    var aside = document.getElementById('jekyll-toc-aside');
    if (!prose || !list || !aside) return;

    var headings = prose.querySelectorAll('h2[id], h3[id]');
    if (!headings.length) {
      aside.style.display = 'none';
      return;
    }

    headings.forEach(function (h) {
      var li = document.createElement('li');
      if (h.tagName.toLowerCase() === 'h3') {
        li.className = 'toc-h3';
      }
      var a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent || '';
      li.appendChild(a);
      list.appendChild(li);
    });
  }

  function replaceInTextNodes(root, fromPattern, replacement) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var node;
    while ((node = walker.nextNode())) {
      var parent = node.parentElement;
      if (!parent || parent.closest('code, pre, script, style, textarea, .katex')) {
        continue;
      }
      if (node.nodeValue && fromPattern.test(node.nodeValue)) {
        fromPattern.lastIndex = 0;
        node.nodeValue = node.nodeValue.replace(fromPattern, replacement);
      }
    }
  }

  function renderMath() {
    if (typeof window.renderMathInElement !== 'function') return;
    var prose = document.getElementById('jekyll-prose') || document.body;

    replaceInTextNodes(prose, /\\\$/g, ESCAPED_DOLLAR_TOKEN);

    window.renderMathInElement(prose, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '\\[', right: '\\]', display: true },
        { left: '\\(', right: '\\)', display: false },
        { left: '$', right: '$', display: false }
      ],
      ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
      throwOnError: false
    });

    replaceInTextNodes(prose, /\uE000/g, '$');
  }

  function prepareMermaidContainers() {
    var codeBlocks = document.querySelectorAll(
      'pre > code.language-mermaid, div.language-mermaid pre > code'
    );
    codeBlocks.forEach(function (codeEl) {
      var wrapperTarget = codeEl.closest('div.language-mermaid') || codeEl.closest('pre');
      if (!wrapperTarget || wrapperTarget.dataset.mermaidPrepared === '1') return;
      var src = (codeEl.textContent || '').trim();
      if (!src) return;
      var container = document.createElement('div');
      container.className = 'jekyll-mermaid-wrap';
      container.setAttribute('data-mermaid-src', src);
      wrapperTarget.replaceWith(container);
    });
  }

  async function renderMermaid(force) {
    if (!window.mermaid) return;
    prepareMermaidContainers();
    var containers = document.querySelectorAll('.jekyll-mermaid-wrap[data-mermaid-src]');
    if (!containers.length) return;

    var dark = isDarkTheme();
    if (!force && lastMermaidDark === dark && containers[0].querySelector('svg')) {
      return;
    }
    lastMermaidDark = dark;

    window.mermaid.initialize({
      startOnLoad: false,
      theme: dark ? 'dark' : 'default',
      securityLevel: 'loose'
    });

    for (var i = 0; i < containers.length; i++) {
      var wrap = containers[i];
      var src = wrap.getAttribute('data-mermaid-src');
      if (!src) continue;
      try {
        var id = 'jekyll-mermaid-' + Date.now() + '-' + i;
        var out = await window.mermaid.render(id, src);
        wrap.innerHTML = out.svg;
      } catch (err) {
        console.error('Mermaid render error:', err);
      }
    }
  }

  function init() {
    buildToc();
    renderMath();
    void renderMermaid(true);

    var btn = document.getElementById('jekyll-theme-toggle');
    if (btn) {
      btn.addEventListener('click', function () {
        var nextDark = !isDarkTheme();
        document.documentElement.classList.toggle('dark', nextDark);
        document.documentElement.setAttribute('data-theme', nextDark ? 'dark' : 'light');
        try {
          localStorage.setItem('jekyll-benchmark-theme', nextDark ? 'dark' : 'light');
        } catch (_) {}
        void renderMermaid(true);
      });
    }

    var lastAttr = document.documentElement.getAttribute('data-theme');
    new MutationObserver(function () {
      var cur = document.documentElement.getAttribute('data-theme');
      if (cur && cur !== lastAttr) {
        lastAttr = cur;
        document.documentElement.classList.toggle('dark', cur === 'dark');
        void renderMermaid(true);
      }
    }).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
