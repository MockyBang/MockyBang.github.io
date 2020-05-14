---
title: hexo 添加 mermaid 支持
top: false
cover: false
toc: true
mathjax: true
date: 2020-05-12 10:17:08
password:
summary:
tags:
categories:
---

## 前言

本文讲述如何在 Hexo 博客中添加对 **Mermaid** 画图工具的支持。

## 步骤


### 添加 Mermaid 加载代码到 Hexo 主题的 footer 布局文件

直接使用在网页中嵌入的方式运行 **Mermaid** 插件。

<img src="image-20200513200617770.png" alt="footer.ejs" style="zoom:73%;" />

本主题中，footer.ejs 是 footer 布局文件。

添加如下代码：

```js
<% if (theme.mermaid.enable) { %>
<script src='https://unpkg.com/mermaid@<%- theme.mermaid.version %>/dist/mermaid.min.js'></script>
<% var options = theme.mermaid.options; %>
<script>
    if (window.mermaid) {
        mermaid.initialize(<%- JSON.stringify(options) %>);
    }
</script>
<% } %>
```

### 添加 Mermaid 配置到 Hexo 主题的配置文件

上述操作完之后，还要在 Hexo 主题的配置文件添加相关配置信息。

<img src="image-20200513201141924.png" alt="_config.yml" style="zoom:73%;" />

添加如下配置：

```yml
# mermaid chart
mermaid: ## mermaid url https://github.com/knsv/mermaid
  enable: true      ## default true
  version: "8.5.0" # default v7.1.2
  options:  ## find more api options from https://github.com/knsv/mermaid/blob/master/src/mermaidAPI.js
    startOnLoad: true   ## default true
```

这样，就会在页面载入时加载 **Mermaid** 的代码了。



> 如果你不想浪费时间，下面的东西可以不用看了。

以下是自定义 **Mermaid** 用法。

## 自定义加载 Mermaid

有些时候如果整篇文章用到大量的 **Mermaid** 代码，那么页面加载的时候会因为渲染大量 **Mermaid** 代码导致加载过慢。这个时候可以设置页面加载时不渲染 **Mermaid** 代码，只有当我们点击 **Mermaid** 代码展示的时候才去渲染 **Mermaid** 代码。

### 关闭页面加载时渲染 Mermaid 代码

修改 Hexo 主题配置文件中 Mermaid 配置

```yml
# mermaid chart
mermaid: ## mermaid url https://github.com/knsv/mermaid
  enable: true      ## default true
  version: "8.5.0" # default v7.1.2
  options:  ## find more api options from https://github.com/knsv/mermaid/blob/master/src/mermaidAPI.js
    startOnLoad: false   ## default true
```

仅仅将 `startOnLoad` 改为 `false`。

### 修改 Hexo 主题文件中代码折叠的 JS 文件

可以使用这个 Hexo 主题来进行操作，该主题包含代码折叠功能。

[hexo-theme-matery](https://github.com/blinkfox/hexo-theme-matery)

<img src="image-20200513203146150.png" alt="codeBlock" style="zoom:67%;" />

<img src="image-20200513203255872.png" alt="codeShrink" style="zoom:67%;" />

只需要修改 **codeShrink.js** 文件。

修改为如下代码：

```js
// 代码块收缩

$(function () {
  var $code_expand = $('<i class="fa fa-chevron-down code-expand" title="折叠代码" aria-hidden="true"></i>');
  $('.code-area').prepend($code_expand);
  
  $('.code_lang').each(function (index, item) {
    if ($(item).text() === 'Mermaid') {
      // hide mermaid code.
      $(item).siblings('.code-expand').siblings('pre').find('code').hide();
      $(item).siblings('.code-expand').parent().addClass('code-closed');
    }
  })
  var preNumIndex;
  var graphDefinitionList = new Array();
  $('.code-expand').on('click', function () {

    if ($(this).parent().hasClass('code-closed')) {
      if (!$(this).parent().hasClass('code-rendered') && $(this).siblings('.code_lang').text() === 'Mermaid') {
        // not rendered
        graphDefinition = renderMermaid(this);
      }
      $(this).parent().addClass('code-rendered');
      $(this).siblings('pre').find('code').show();
      $(this).parent().removeClass('code-closed');
    } else {
      $(this).siblings('pre').find('code').hide();
      $(this).parent().addClass('code-closed');
    }

    if ($(this).siblings('.code_lang').text() === 'Mermaid') {
      // mermaid
      var graphDefinitionJson = new Object();
      var max = 10000
      var numIndex = String(Math.ceil(Math.random()*max))
      
      if ($(this).attr('numIndex')) {
        var pos;
        for (let i in graphDefinitionList) {
          if (graphDefinitionList[i].numIndex === $(this).attr('numIndex')) {
            pos = i;
          }
        }

        if ($(this).attr('numIndex') === graphDefinitionList[pos]['numIndex']) {
          // have the numIndex attr and equal to the preNumIndex
          // console.log("同一个元素")
          // render again
          if ($(this).parent().hasClass('code-rendered') && $(this).siblings('.code_lang').text() === 'Mermaid') {
            // rendered
            $(this).siblings('pre').find('code').text(graphDefinitionList[pos]['graphDef']);
            $(this).parent().removeClass('code-rendered');
          }
        }
      
        graphDefinitionList.splice(pos, 1);
        $(this).removeAttr('numIndex')
      } else {
        // add graphDef
        graphDefinitionJson['numIndex'] = numIndex;
        graphDefinitionJson['graphDef'] = graphDefinition
        graphDefinitionList.push(graphDefinitionJson);

        $(this).attr('numIndex', numIndex)
        preNumIndex = numIndex;
        // console.log("不是同一个元素")
      }
    }
  });

  function renderMermaid (element) {
    // get the nearest '.code-area' of current '.code-expand' and find the code tags in it.
    var graphDefinition = $(element).closest('.code-area').find('code').text();
    var insertSvg = function(svgCode, bindFunctions){
        $(element).closest('.code-area').find('code').html(svgCode)
    };
    var max = 1000000000
    var nameId = 'mermaid' + String(Math.ceil(Math.random()*max))
    mermaid.mermaidAPI.render(nameId, graphDefinition, insertSvg);
    return graphDefinition
  }
});

```

其中原因暂不讲解，想知道的自然知道。

自此，就可以实现页面加载后所有的 **Mermaid** 代码块都是折叠的，且都没有进行渲染。只有当去点击展示 **Mermaid** 代码块时才会触发 **Mermaid** 渲染。

感谢主题作者提供的代码折叠 JS 文件。如果你觉得有用，请给我打赏，谢谢。