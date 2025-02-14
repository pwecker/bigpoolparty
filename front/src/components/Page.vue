<template>
	<!-- <Device></Device> -->
	<div class="h-full w-full flex flex-col gap-y-5 justify-center items-center">
		<iframe width="300" height="250" src="/public/demo/map/index.html"></iframe>
	  <iframe width="970" height="250" src="/public/demo/map/index.html"></iframe>
  </div>
</template>
<script>
import Device from '@/components/Device.vue';
export default {
	name : 'Page',
	components: { Device }
}
</script>