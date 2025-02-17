<template>
	<!-- <Device></Device>  -->
	<div class="h-full w-full flex-col flex gap-y-5 justify-center items-center">
		<div style="cursor:pointer" @click="_click">Tag</div>
		<iframe width="300" height="250" src="/demo/map/index.html"></iframe>
	  <iframe width="970" height="250" src="/demo/map/index.html"></iframe>
  </div>
 
  <!-- <div class="h-dvh w-full bg-cyan-100 flex flex-col items-center">
    <div class="w-full grow-1">
      <div class="w-full h-[250px] bg-rose-100"></div>
      <div class="w-full grow-1 flex overflow-y-hidden p-3 gap-3 flex-col sm:flex-row">
        <div class="h-[3em] grow-1 bg-red-100"></div>
        <div class="h-[3em] w-[300px] bg-blue-100"></div>
      </div>
    </div>
    <div class="w-full h-[3em] bg-rose-300"></div>
  </div> -->
</template>
<script>
// import pako from 'pako';

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

    if (el.getAttribute('data-dynamic') === null) {
      Array.from(el.children).forEach(child => {
        const childJson = processElement(child);
        if (childJson) {
          elementJson.children.push(childJson);
        }
      });
    }

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

function min(str) {
	return str
	  .replace(/\s+/g, ' ')
	  .replace(/>\s+</g, '><')
	  .replace(/\s*{\s*/g, '{')
	  .replace(/\s*}\s*/g, '}')
	  .replace(/\s*;\s*/g, ';')
	  .replace(/\s*:\s*/g, ':')
	  .replace(/;\}/g, '}');
}

function dl(str) {
	// const comp = pako.gzip(str);
	const blob = new Blob([str], {type:'text/plain'});
	const a = document.createElement('a');
	a.href = URL.createObjectURL(blob);
	a.download = 'tag.' + (+new Date()) + '.txt';
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
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
    const appendix = '</' + 'script><' + 'script src="https://bigpoolparty.com/lib/deploy.js" data-type="' + type + '"></' + 'script>';
    dl(min(prefix + string + appendix))
		}
	}
}
</script>