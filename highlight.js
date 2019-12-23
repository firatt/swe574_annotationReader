function _x(STR_XPATH) {
  var xresult = document.evaluate(STR_XPATH, document, null, XPathResult.ANY_TYPE, null);
  var xnodes = [];
  var xres;
  while (xres = xresult.iterateNext()) {
    xnodes.push(xres);
  }
  return xnodes;
}

chrome.runtime.onMessage.addListener(msgObj => {
  if (msgObj.action == "getData") {
    var annotations = msgObj.annotations;
    var annotationObjs = Object.values(annotations);

    var exacts = [];
    for (let i = 0; i < annotationObjs.length; i++) {
      if (annotationObjs[i].target.source === location.href) {
        const element = {
          selectedText: annotationObjs[i].target.selector[1].exact,
          xpath: annotationObjs[i].target.selector[0].value
        };
        exacts.push(element);
      }
    }

    var $context = $("body");
    $context.removeHighlight();
    for (let i = 0; i < exacts.length; i++) {
      $xpath = $(_x(exacts[i].xpath));
      const element = exacts[i].selectedText;
      if (element.includes("\n")) {
        var displaying = element.split('\n');
        for (let j = 0; j < displaying.length; j++) {
          const element = displaying[j];
          $xpath.highlight(element);
          // $context.highlight(element);
        }
      }
      $xpath.highlight(element);
      // $context.highlight(element);
    }

    // var $context = $("body");
    // var searchTerm = exacts[0];
    // $context.removeHighlight();
    // $context.highlight(searchTerm);
  }

  if (msgObj.action == "hideData") {
    var $context = $("body");
    $context.removeHighlight();
  }

});