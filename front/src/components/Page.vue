<template>
	<!-- <Device></Device> -->
	<div class="h-full w-full flex flex-col gap-y-5 justify-center items-center">
		<div style="cursor:pointer" @click="_click">Tag</div>
		<iframe width="300" height="250" src="/public/demo/map/index.html"></iframe>
	  <iframe width="970" height="250" src="/public/demo/map/index.html"></iframe>
  </div>
</template>
<script>
// import Device from '@/components/Device.vue';
export default {
	name : 'Page',
	// components: { Device },
	methods: {
		_tojson: function(dom) {
      if (!dom) return null;

      let obj = {
        tag: dom.tagName.toLowerCase(),
        attributes: {},
        children: [],
      };

      for (let attr of dom.attributes) {
        obj.attributes[attr.name] = attr.value;
      }

      if (dom.childNodes.length === 1 && dom.childNodes[0].nodeType === Node.TEXT_NODE) {
        obj.text = dom.childNodes[0].textContent.trim();
      } else {
        for (let child of dom.children) {
          obj.children.push(this._tojson(child));
        }
      }

      return obj;
    },
		_click:function() {
			const demo = window.document.querySelector('IFRAME');
			const iframe = demo.contentDocument || demo.contentWindow.document;
			const dom = iframe.body;
			const json = this._tojson(dom)
			console.log(JSON.stringify(json, null, 2))
		}
	}
}
</script>