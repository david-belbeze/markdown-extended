import fs from 'fs';

import { getResourcePath, isRoot, urlResolve, breadcrumb, isValidImage } from '../../main/core/utils';


describe('Test utils', () => {

    test('Test getResourcePath classic path', () => {
        expect(getResourcePath({ path: '/path/to/resource' })).toEqual('path/to/resource');
    });

    test('Test getResourcePath /', () => {
        expect(getResourcePath({ path: '/' })).toEqual('');
    });

    test('Test getResourcePath empty', () => {
        expect(getResourcePath({ path: '' })).toEqual('');
    });

    test('Test is root true', () => {
        expect(isRoot({path:'/index.html'}));
        expect(isRoot({path:'/'}));
    });

    test('Test is not root true', () => {
        expect(!isRoot({path:'/test/index.html'}));
        expect(!isRoot({path:'/test/path/'}));
    });

    test('Test urlResolve with base url', () => {
        expect(urlResolve('/doc', 'css/style.css')).toEqual('/doc/css/style.css');
    });

    test('Test urlResolve with empty base url', () => {
        expect(urlResolve('', 'css/style.css')).toEqual('/css/style.css');
    });

    test('Test valid breadcrumb', () => {
        expect(breadcrumb('/doc', ['fake', 'path', 'to'])).toEqual(
            `<ul class="breadcrumb">
    <li class="breadcrumb-item"><a href="/doc/">home</a></li>
    <li class="breadcrumb-item"><a href="/doc/fake/">fake</a></li>
    <li class="breadcrumb-item"><a href="/doc/fake/path/">path</a></li>
    <li class="breadcrumb-item"><a href="/doc/fake/path/to/">to</a></li>
</ul>`);
    });

    test('Test breadcrumb from non root base url', () => {
        expect(
            () => {
                breadcrumb(
                    'doc',
                    ['fake', 'path', 'to'],
                )
            }
        ).toThrow(Error);
    })

    test('Test isValidImage valid', () => {
        fs.existsSync = jest.fn().mockReturnValue(true);
        fs.statSync = jest.fn()
            .mockReturnValue({
                isFile: jest.fn().mockReturnValue(true),
            });

        expect(isValidImage('path/to/image.jpg')).toEqual(true);
    });

    test('Test isValidImage invalid', () => {
        expect(isValidImage('path/to/imagepng')).toEqual(false);
    });

});
