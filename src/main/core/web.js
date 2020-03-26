import fs from 'fs';
import path from 'path';

import express from 'express';
import hbs from 'handlebars';
import markdownIt from 'markdown-it';
import markdownItMermaid from 'markdown-it-mermaid';

import { getResourcePath, breadcrumb, isValidImage } from './utils';


// Prepare markdown renferer
const mdi = markdownIt()
mdi.use(markdownItMermaid)


/**
 * This method return always 404.
 * 
 * @param {express.request} _ the express request if is necessary to provide to express app method.
 * @param {express.response} res the response provided by the express application to responde to client
 */
export function send404(_, res) {
    res.status(404).end();
}


/**
 * The method allows to find the file in file system to render in markdown syntaxt.
 * 
 * @param {string} filePath the file path to search in the static folder
 * @param {express.request} req the express request provided by application
 * @param {express.response} res the express response provided by application
 */
export function getMarkdownFile(filePath, req, res) {
    if (fs.existsSync(filePath)) {
        // Load hbs template to add style, js and page structure
        const template = hbs.compile(
            fs.readFileSync(
                path.resolve(__dirname, '..', 'template.hbs')
            ).toString('utf-8')
        );

        hbs.registerHelper('breadcrumb', breadcrumb);
        
        // Prepare context to render the markdown pages
        const ctx = {
            title: path.basename(filePath),
            markdown: mdi.render(
                fs.readFileSync(filePath, { encoding: 'utf-8' }),
            ),
            breadcrumb: {
                rootUrl: req.baseUrl || '/',
                segments: req.path.match(/(.*\/)[^/]*$/)[1]
                    .split('/').filter((item) => item),
            }
        };

        // Send the template rendered
        res.send(template(ctx));
    } else {
        // if file is not found -> send 404
        send404(req, res);
    }
}


/**
 * This method try to find index.md or readme.md in the static path to serve.
 * Test on file name is with ignore case.
 */
export function getLocalIndex(dirPath) {
    let fileName;

    if (fs.existsSync(dirPath)) {
        // list the directory when exists
        const index = fs.readdirSync(dirPath)
            .find(item => /^(readme|index)\.md$/i.test(item));

        if (index) {
            fileName = path.join(dirPath, index);
        }
    }

    return fileName;
};


/**
 * This method generate a middleware for express that serve md files
 * 
 * @param {string} mdPath the path of the directory that contains md files
 */
export function staticMarkdown(mdPath) {
    /**
     * This method is a middleware that try to find .md files and serve them.
     * 
     * @param {express.request} req the express request provided by application
     * @param {express.response} res the express response provided by application
     * @param {Function} next the next callback provided by application
     */
    return (req, res, next) => {
        let resourcePath = path.resolve(mdPath, getResourcePath(req));

        if (/.*\/$/i.test(req.path)) {
            // When is a path search the index of the folder index.md or readme.md
            resourcePath = getLocalIndex(resourcePath)
        }

        if (/.*.md$/i.test(resourcePath) 
                && fs.existsSync(resourcePath) 
                && fs.statSync(resourcePath).isFile()) {
            // In that case the file is an existing md file
            getMarkdownFile(resourcePath, req, res);
        } else if (isValidImage(resourcePath)) {
            // When the file is an image
            res.sendFile(resourcePath);
        } else {
            // In other case not override
            next();
        }
    };
}
