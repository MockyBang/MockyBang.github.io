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
