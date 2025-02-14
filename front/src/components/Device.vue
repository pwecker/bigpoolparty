<template>
<span style="position:fixed;top:0px;color:#000">{{v}}</span>
	<div class="w-[100vw] md:w-[60vw] max-w-[600px] h-[60vh] perspective-[1000px]">

		<div class="flex justify-end w-full h-full transform-3d transition-transform duration-1000" :style="{transform: 'rotateY(' + deg + 'deg) translateZ(250px)'}">
			<div class="w-full h-full bg-cyan-500 absolute flex justify-end md:justify-center items-center">
				<div style="border: 1px solid #000" class="w-100 max-w-[69vw] h-80 max-h-[69vh]" :style="{maxWidth:(v.w < 400 && v.h > 400) ? '9vw' : '90vh'}"></div>
			</div>
			<div class="w-full h-full bg-pink-500 absolute" :style="{transform: 'rotateY(60deg) translateZ(250px) translateX(' + (v.w < 768 ? '92%' : '50%') + ')'}">
				<div class="w-100 max-w-[57vw] h-full bg-black"></div>
			</div>
		</div>
	</div>
	
	<div @click="_rotate('n')" class="next z-9">Next</div>
	<div @click="_rotate('p')" class="prev z-9">Prev</div>

</template>
<script>
export default {
	name: 'Device',
	data() {
		return {
			deg: 0,
			v: {},
		}
	},
	mounted() {
		window.addEventListener('resize', this._viewport);
	  this._viewport();
	},
	methods: {
		_viewport: function() {
			this.v = {w: window.innerWidth, h: window.innerHeight}
		},
		_rotate: function(d) {
			this.deg = d === 'n' ? -60 : 0;
		}
	}
}
</script>
<!-- <style scoped>
  @import "@/components/Device.css"
</style> -->