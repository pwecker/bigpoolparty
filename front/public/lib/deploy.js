(async (types) => {
  if (window.injectedJson) {
    jsonToDom(window.injectedJson, document.body);
  }

  const type = types.shift();
  const { default: Creative } = await import('/lib/creative.js');
  const base = new Creative();
  await base.init(type);
  await base.depends;
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

  return new Extended();
})(document.currentScript.getAttribute('data-type').split('-'));

function jsonToDom(jsonArray, parentElement = document.body) {
  if (!Array.isArray(jsonArray)) {
    // console.error("Expected an array of elements, but received:", jsonArray);
    return null;
  }

  jsonArray.forEach(json => {
    if (json.tag === "style" && json.text) {
      const styleElement = document.createElement("style");
      styleElement.textContent = json.text.join("\n");
      document.head.appendChild(styleElement);
    }
  });

  jsonArray.forEach(json => {
    let existingElement = findExistingElement(parentElement, json);

    if (existingElement || json.tag === 'body') {
      // console.log(`Skipping existing element: <${json.tag}>`);
      if (json.children) json.children.forEach(childJson => jsonToDom([childJson], existingElement));
    } else {
      const newElement = createElementFromJson(json);

      if (json.styles) {
        newElement.setAttribute("style", json.styles);
      }

      if (newElement && !parentElement.contains(newElement) && parentElement !== newElement) {
        parentElement.appendChild(newElement);
      } else {
        // console.warn(`Skipping append to prevent hierarchy issues: <${json.tag}>`);
      }
    }
  });

  return parentElement;
}

function createElementFromJson(json) {
  if (!json || !json.tag) return null;

  const element = document.createElement(json.tag);

  if (json.attributes) {
    for (let [key, value] of Object.entries(json.attributes)) {
      element.setAttribute(key, value);
    }
  }

  if (json.text) {
    element.textContent = json.text;
  }

  if (json.children && json.children.length) {
    json.children.forEach(childJson => {
      const childElement = createElementFromJson(childJson);
      if (childElement) element.appendChild(childElement);
    });
  }

  return element;
}

function findExistingElement(parent, json) {
  return Array.from(parent.children).find(child => {
    if (child.tagName.toLowerCase() !== json.tag) return false;
    const attributesMatch = Object.entries(json.attributes || {}).every(
      ([key, value]) => child.getAttribute(key) === value
    );

    return attributesMatch;
  });
}

