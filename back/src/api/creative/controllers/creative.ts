/**
 * creative controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::creative.creative', ({ strapi }) => ({
  async find(ctx) {
    const { query } = ctx;
    const results = await strapi.entityService.findMany('api::creative.creative', {
      ...query,
      populate: query.populate || '*'
    });

    if (!results.length) {
      return { data: null, meta: {} };
    }

    const rn = Math.floor(Math.random() * results.length);
    const rr = results[rn];
    const cdn = process.env.CDN || '';
    let jsonStr = JSON.stringify(rr);
    jsonStr = jsonStr.replace(/"\/(img|dep|lib)\/(.*?)"/g, `"${cdn}/$1/$2"`);
    return { data: [JSON.parse(jsonStr)] };
  }
}));
