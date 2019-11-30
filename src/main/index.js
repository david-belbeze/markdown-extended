import path from 'path';

import '@babel/polyfill';
import express from 'express';

import { urlResolve } from './core/utils';
import { staticMarkdown } from './core/web';


/**
 * This method allows to initialize an express instance to serve under the baseUrl the
 * serveur markdown. 
 * 
 * @param {express.Application} app the application express instance to intialize
 * @param {string} baseUrl the base url path where is exposed the markdown server
 * @param {string} markdownPath the path where markdown files must be found
 */
export function initExpressApplication(app, baseUrl, markdownPath) {
    // Define the static path to style and js script
    app.use(urlResolve(baseUrl, 'css'), express.static(path.join(__dirname, 'static', 'css')));
    app.use(urlResolve(baseUrl, 'js'), express.static(path.join(__dirname, 'static', 'js')));
    app.use('/', express.static(path.join(__dirname, 'static'), { extensions: ['ico'] }));

    // apply middleware to serve static markdown
    app.use(baseUrl, staticMarkdown(markdownPath));
}
