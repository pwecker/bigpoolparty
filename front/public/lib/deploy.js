
(async (types) => {
  const type = types.shift();
  const { default: Creative } = await import('/lib/creative.js');
  let Extended = Creative;
  const mod = await import(`/lib/${type.toLowerCase()}.js`);
  const extendFnc = mod[`extend${type}`];
  if (extendFnc) {
    Extended = extendFnc(Creative);
    for (const ext of types) {
      try{
        const extMod = await import(`/lib/${ext.toLowerCase()}.js`);
        const extModFnc = extMod[`extend${ext}`];
        if (extModFnc) {
          Extended = extModFnc(Extended);
        }
      }catch(e){}
    }
  }

  const creative = new Extended();
  creative.init(type);
})(document.currentScript.getAttribute('data-type').split('-'));