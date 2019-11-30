import { initExpressApplication } from '../main/index';

describe('Test index.js', () => {
    
    test('Test initExpressApplication', () => {
        const app = {
            use: jest.fn(),
        }

        initExpressApplication(app, '/', '/doc')

        expect(app.use).toHaveBeenCalledTimes(4);
    });

});
