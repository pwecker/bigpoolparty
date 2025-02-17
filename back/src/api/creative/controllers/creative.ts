/**
 * creative controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::creative.creative', ({ strapi }) => ({
  async find(ctx) {
    const { data, meta } = await super.find(ctx);
    const cdn = process.env.CDN || '';
    let jsonStr = JSON.stringify(data);

    jsonStr = jsonStr.replace(/"\/(img|dep|lib)\/(.*?)"/g, `"${cdn}/$1/$2"`);
    return { data: JSON.parse(jsonStr), meta};
  }
}));
