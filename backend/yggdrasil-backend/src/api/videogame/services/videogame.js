'use strict';

/**
 * videogame service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::videogame.videogame');
