var __$injectStyle = (function () {
  var context = (function () { return this || (1, eval)('this'); })();
  var exportObject = {};
  var injectObject = {};
  function injectStyle(cssText, context) {
  if (!cssText || context.window !== context) {
    return;
  }

  var doc = context.document;
  var head = doc.head || doc.getElementsByTagName('head')[0];
  var style = doc.createElement('style');

  style.setAttribute('media', 'screen');
  style.setAttribute('type', 'text/css');

  if (style.styleSheet) {
    style.styleSheet.cssText = cssText;
  } else {
    style.appendChild(doc.createTextNode(cssText));
  }

  head.appendChild(style);
}
  return function (hash) {
    injectStyle(injectObject[hash], context);
    return exportObject[hash];
  };
}());

import React from 'react';

var Component1 = function Component1(props) {
  return React.createElement("div", {
    style: {
      fontSize: 24,
      width: 100,
      height: 100,
      backgroundColor: 'aquamarine',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }
  }, "\u6D4B\u8BD5\u5916\u90E8\u901A\u8BAF: ", props.number);
};

export default Component1;
//# sourceMappingURL=index.js.map
