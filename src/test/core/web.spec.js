import fs from 'fs';

import * as web from '../../main/core/web';


jest.mock('fs');


describe('Test Web', () => {

    let res;

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
            end: jest.fn().mockReturnThis(),
        };
    })

    test('Test send404', () => {
        res.status = (status) => {
            expect(status).toEqual(404);
            return res;
        }

        web.send404(null, res);

        expect(res.end).toHaveBeenCalled();
    });

    test('Test getMarkdownFile file not found', () => {
        res.status = (status) => {
            expect(status).toEqual(404);
            return res;
        }

        fs.existsSync.mockReturnValue(false);

        web.getMarkdownFile('fake path', null, res);
    });

    test('Test getMarkdownFile file is found', () => {
        fs.existsSync.mockReturnValue(true);
        fs.readFileSync.mockReturnValue('');

        web.getMarkdownFile('fake/path', { baseUrl: '/', path: '/test/file.md' }, res);

        expect(res.send).toHaveBeenCalled();
    });

    test('Test getLocalIndex file not found', () => {
        fs.existsSync.mockReturnValue(false);

        expect(web.getLocalIndex('fake/path/')).toBeUndefined();
    })

    test('Test getLocalIndex file not found when dir exists', () => {
        fs.existsSync.mockReturnValue(true);
        fs.readdirSync.mockReturnValue(['index.html', 'README.rst']);

        expect(web.getLocalIndex('fake/path/')).toBeUndefined();
    })

    test('Test getLocalIndex file found', () => {
        fs.existsSync.mockReturnValue(true);
        fs.readdirSync.mockReturnValue(['index.html', 'README.rst', 'README.md']);

        expect(web.getLocalIndex('/')).toEqual('/README.md');
    })

    test('Test staticMarkdown generate middleware', () => {
        expect(typeof(web.staticMarkdown('any/path'))).toEqual('function'); 
    });

    test('Test staticMarkdown to force to find an index', () => {
        const req = { path: '/data/' }

        // mock fs
        fs.existsSync.mockReturnValue(true);
        fs.statSync.mockReturnValue({ isFile: () => true });
        fs.readFileSync.mockImplementation((filePath, _) => {
            if (/.*\.hbs/.test(filePath)) {
                return '{{{ markdown }}}';
            } else {
                return '# Title test';
            }
        });
        fs.readdirSync.mockReturnValue(['README.md']);

        // Generate middleware
        const middleware = web.staticMarkdown('/');

        middleware(
            req, 
            {
                send: (html) => {
                    // When response is sent test
                    expect(html).toEqual('<h1>Title test</h1>\n');
                    // assert.equal(html, '<h1>Title test</h1>\n')
                }
            }, 
            () => {}
        );
    });

    test('Test staticMarkdown middleware call next', () => {
        fs.existsSync.mockReturnValue(false);
        fs.statSync.mockReturnValue({ isFile: () => true });

        // Generate middleware
        const middleware = web.staticMarkdown('/');

        const next = jest.fn();

        middleware({ path: '/data/file.md' }, { send: () => {} }, next);

        expect(next).toHaveBeenCalled();
    });

});
