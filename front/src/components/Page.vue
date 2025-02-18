<template>
	<div class="w-full flex-col flex gap-y-5 justify-center items-center">
    <div @click="_tag" class="fixed top-0 left-[0] bg-zinc-100 z-1 pr-2 pl-2 rounded-lg m-4 border-1 border-solid cursor-pointer hover:bg-white">Download Tag</div>
    <ul class="w-[100vw] flex flex-col items-center gap-8 justify-center">
      <li v-for="[iab] in iabs.map(Object.entries)" :key="iab[0]" :class="iab[0] + ' border-2 border-solid border-zinc-400 rounded-lg relative'">
      <div class="absolute bg-white top-[-1em] right-2 flex justify-end pr-2 pl-2 text-zinc-800">
        {{iab[0] + ': ' + iab[1][0] + ' x ' + iab[1][1]}}
        <div class="ml-1 cursor-pointer" @click="_refresh(iab[0])">♻</div>
      </div>
      <iframe :ref="iab[0]" class="m-2" :width="iab[1][0]" :height="iab[1][1]" :src="'/demo/map/index.html'"></iframe>
    </li>
    <li class="responsive w-[calc(100vw-1em)] h-[35vh] border-2 border-solid border-zinc-400 rounded-lg relative p-2">
      <div class="absolute bg-white top-[-1em] right-2 flex justify-end pr-2 pl-2 text-zinc-800">
        {{'responsive : 100vw x 35vh'}}
        <div class="ml-1 cursor-pointer" @click="_refresh('responsive')">♻</div>
      </div>
      <iframe :ref="'responsive'" width="100%" height="100%" :src="'/demo/map/index.html'"></iframe>
    </li>
    </ul>
  </div>
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
  data() {
    return {
      iabs: [
        {'billboard':['970px','250px']},
        {'rectangle':['300px','250px']},
        {'skyscraper':['300px','600px']},
        // {'responsive':['100%','100%']}
      ]
    }
  },
	methods: {
    _refresh: function(name) {
      const ref = this.$refs[name][0] || this.$refs[name];
      ref.contentWindow.location.reload();
    },
		_tag:function() {
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
<style scoped>
@media (max-width: 969px) {
  .billboard {
    display: none;
  }
}
</style>