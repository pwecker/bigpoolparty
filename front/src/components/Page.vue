<template>
	<!-- <Device></Device> -->
	<div class="h-full w-full flex flex-col gap-y-5 justify-center items-center">
		<div style="cursor:pointer" @click="_click">Tag</div>
		<iframe width="300" height="250" src="/public/demo/map/index.html"></iframe>
	  <iframe width="970" height="250" src="/public/demo/map/index.html"></iframe>
  </div>
</template>
<script>
function domToJson(dom) {
  const json = [];
  const styles = captureInlineStyles(dom);
  if (styles.length) {
    json.push({
      "tag": "style",
      "text": styles
    });
  }

  function processElement(el) {
    if (el.nodeType === Node.TEXT_NODE || el.tagName.toLowerCase() === 'script') {
      return null;
    }

    const elementJson = {
      tag: el.tagName.toLowerCase(),
      attributes: getAttributes(el),
      children: [],
    };

    const inlineStyles = el.getAttribute("style");
    if (inlineStyles) {
      elementJson.styles = inlineStyles;
    }

    Array.from(el.children).forEach(child => {
      const childJson = processElement(child);
      if (childJson) {
        elementJson.children.push(childJson);
      }
    });

    return elementJson;
  }

  if (dom !== dom.body) {
    json.push(processElement(dom));
  } else {
    Array.from(dom.children).forEach(child => {
      const childJson = processElement(child);
      if (childJson) {
        json.push(childJson);
      }
    });
  }

  return json;
}

function captureInlineStyles(dom) {
  const styles = [];

  dom.querySelectorAll('style[data-include]').forEach(styleElement => {
    styles.push(styleElement.innerHTML);
  });

  return styles;
}

function getAttributes(el) {
  const attributes = {};
  Array.from(el.attributes).forEach(attr => {
    attributes[attr.name] = attr.value;
  });
  return attributes;
}

export default {
	name : 'Page',
	methods: {
		_click:function() {
			const demo = window.document.querySelector('IFRAME');
			const iframe = demo.contentDocument || demo.contentWindow.document;
			const dom = iframe.body;
			const type = dom.querySelector('SCRIPT[data-type]').getAttribute('data-type');
			const json = domToJson(dom);
			const string = JSON.stringify(json, null, 2);
			const prefix = '<div id="loading" class="lds-ripple"><div></div><div></div></div><script>window.injectedJson=';
    const appendix = '</' + 'script><' + 'script src="/lib/deploy.js" data-type="' + type + '"></' + 'script>';
    console.log(prefix + string + appendix)
		}
	}
}
</script>