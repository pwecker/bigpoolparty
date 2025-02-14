(async (type) => {
  const { default: Creative } = await import('/public/lib/creative.js');
  let Extended = Creative;
  const module = await import(`/public/lib/${type.toLowerCase()}.js`);
  const extendFnc = module[`extend${type}`];
  Extended = extendFnc(Creative);
  const creative = new Extended();
  creative.init(type);
})(document.currentScript.getAttribute('data-type'));