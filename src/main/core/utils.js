import fs from 'fs';
import path from 'path';
import url from 'url';

import handlebars from 'handlebars';


/**
 * This constant allows to define the supported image extensions.
 * 
 * @see https://developer.mozilla.org/fr/docs/Web/HTML/Element/Img#Formats_dimage_pris_en_charge for format availables
 */
const IMAGE_EXT = [
    'apng',
    'png',
    'bmp',
    'gif',
    'ico',
    'cur',
    'jpg', 
    'jpeg', 
    'jfif', 
    'pjpeg', 
    'pjp',
    'svg',
    'tif',
    'tiff',
    'webp',
];


/**
 * The method allows to get the resource path without the '/' first character.
 *
 * @param {express.request} req the express request provided by the express application 
 */
export function getResourcePath(req) {
    return req.path.substring(1, req.path.length)
}


/**
 * This method allows to detect if the request url is the root url or not.
 *
 * @param {express.request} req the express request provided by the express application
 * @returns {boolean} true if the path is a resource from root like '/', '/index.html' 
 */
export function isRoot(req) {
    return /^\/[^/]*$/.test(req.path)
} 


/**
 * This method allows to resolve url to create the new url from the 2 url segments.
 * 
 * @param {string} baseUrl the base url to use to concat the resource path
 * @param {string} resourcePath the path (not from the root '/') to the resource
 */
export function urlResolve(baseUrl, resourcePath) {
    if (baseUrl.match(/.*[^/]$/)) {
        baseUrl = baseUrl + '/';
    }

    return url.resolve(baseUrl || '/', resourcePath);
}


/**
 * This method allows to render a breadcrumb as a simple path.
 * 
 * @param {string} rootUrl the baseUrl to use as a root for the breadcrumb exposing markdown files
 * @param {string[]} segments the list of segments as path
 */
export function breadcrumb(rootUrl, segments) {
    if (!/^\/.*/.test(rootUrl)) {
        throw new Error("The base url must be an url from the root of the website.");
    }

    // Set the home fragment
    const items = [{
        url: (rootUrl + '/').replace(/\/+/, '/'),
        name: 'home',
    }];
    
    // Add items to the breadcrumb
    const accumulatedSegments = [];
    for (const segment of segments) {
        accumulatedSegments.push(segment);
        items.push({
            url: path.join(rootUrl, ...accumulatedSegments) + '/',
            name: segment,
        });
    }

    // Render the template
    return handlebars.compile(`<ul class="breadcrumb">
    {{#each items}}
    <li class="breadcrumb-item"><a href="{{ this.url }}">{{ this.name }}</a></li>
    {{/each}}
</ul>`)({ items });
}


/**
 * This method indicate if the file is a valid image type and if the image file exists.
 *
 * @param {string} path The path to the image to serach in the file system
 */
export function isValidImage(path) {
    const match = path.match(/^.*\.([a-z]+)$/i);

    let valid = false;
    if (match) {
        const ext = match[1].toLowerCase();

        valid = IMAGE_EXT.includes(ext)         // vérifier que l'extension est autorisée
            && fs.existsSync(path)              // vérfiier que le fichier existe
            && fs.statSync(path).isFile();
    }

    return valid;
}
