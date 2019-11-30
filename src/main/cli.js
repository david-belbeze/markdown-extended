#!/usr/bin/env node

import path from 'path';
import fs from 'fs';

import express from 'express';
import open from 'open';
import { ArgumentParser } from 'argparse';
import githubMarkdownCss from 'generate-github-markdown-css';

import { initExpressApplication } from './index';


/**
 * This method must be called to prepare and launch the application.
 * 
 * @param {object} args the argument parsed from command line
 */
async function main(args) {
    if (!fs.existsSync(args.directory) || !fs.statSync(args.directory).isDirectory()) {
        throw new Error(`The directory ${staticPath} not exists.`);
    }

    const root = path.resolve(args.directory)


    // Create the express application
    const app = express();

    // Basic logger middleware
    app.use('*', (req, _, next) => {
        console.log(Date(), req.originalUrl);

        next();
    });

    // Initialize the markdown server part
    initExpressApplication(app, '/', root);


    // Regenerate the markdown css when is necessary
    const stylePath = path.resolve(path.join(path.resolve(__dirname), 'static', 'css'), 'markdown.css');
    if (!fs.existsSync(stylePath)) {
        const styles = await githubMarkdownCss();
        fs.writeFileSync(stylePath, styles);
    }

    // start application
    app.listen(args.port, () => {
        const appUrl = `http://localhost:${args.port}/`;

        console.log(`Application is running on http://localhost:${args.port}/`);

        if (args.open) {
            open(appUrl);
        }
    });
}


// Prepare the argument parser basic informations from the package json file
const parser = new ArgumentParser({
    version: process.env.npm_package_version,
    addHelp: true,
    description: process.env.npm_package_description,
});

parser.addArgument(
    ['-d', '--directory'],
    {
        help: 'The directory containing markdown data to serve',
        defaultValue: './',
    }
);
parser.addArgument(
    ['-p', '--port'],
    {
        help: 'Set the port of the server that render the markdown files',
        defaultValue: 3000,
    }
);
parser.addArgument(
    ['--open'],
    {
        help: 'Use this flag to force to open the link in new browser tab',
        action: 'storeTrue',
    },
);


// Start the application
main(parser.parseArgs());
