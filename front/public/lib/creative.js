export default class Creative {
  constructor() {
    this.depends = null;
  }
  
  set css(styles) {
    styles.forEach(style => {
      const key = style[0];
      let value = style[1];
      value = key.indexOf('-img') >= 0 ? 'url(' + value + ')' : value;
      document.documentElement.style.setProperty('--' + key, value);
    });
  }
  link(href) {
    return new Promise((resolve, reject) => {
      const link = document.createElement('LINK');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = resolve;
      document.head.appendChild(link);
    });
  }
  script(href) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${href}"]`)) {
        return resolve();
      }
      const script = document.createElement('SCRIPT');
      script.src = href;
      script.type = 'text/javascript';
      script.async = true;
      script.onload = resolve;
      document.head.appendChild(script);
    });
  }

  preload(imgs) {
    let i = 0;
    imgs.forEach((src) => {
      var img = new Image();
      img.onload = function() {
        i++;
        if (i === imgs.length) {
          this.ready();
        }
      }.bind(this);
      img.src = src;
    })
  }

  async dependencies(deps) {
    const promises = [];
    for (const dep of deps) {
      try {
        for (const [key, value] of Object.entries(dep)) {
          if (key === 'css') {
            promises.push(this.link(value));
          } else {
            promises.push(this.script(value));
          }
        }
      } catch(e) {}
    }

    return Promise.all(promises);
  }

  async load(creative) {
    let imgs = [];
    let deps = [];
    let css = [];
    for (var k in creative.params) {
      if (k === 'dep') {
        creative.params[k].forEach(dep => {
          deps = deps.concat(dep.map(src => {
            const type = src.split('.')[1];
            return {
              [type]: src
            }
          }));
        })
      } else {
        if (creative.params[k].split(/\.jpg|\.png|\.webp/).length > 1) {
          imgs.push(creative.params[k]);
        }
        
        css.push([k, creative.params[k]]);
      }
    }

    this.css = css;
    this.preload(imgs);
    return this.dependencies(deps);
  }

  async init(type) {
    try {
      const { API_URL } = await import('/src/config.js');
      const response = await fetch(`${API_URL}/api/creatives?filters[type]=${type}`);
      if (response.ok) {
        const json = await response.json();
        const r = Math.floor(Math.random() * json.data.length);
        this.depends = this.load(json.data[r]);
      } else {}
    } catch(e) {}
  }
  ready() {
    const loader = window.document.getElementById('loading');
    loader.parentNode.removeChild(loader);
  }
}