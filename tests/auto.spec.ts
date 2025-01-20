import { test, expect } from '@playwright/test';
import { AutoCommand } from '../src/auto/autoCommand';
import { startServer } from '../DemoServer/startServer';

const TEST_PORT = 3001;

test.describe('Auto Command Tests', () => {
    let closeServer: () => void;
    let server: any;

    test.beforeEach(async () => {
        try {
            server = await startServer(TEST_PORT);
            closeServer = server.close;
        } catch (error) {
            console.error('Error starting server:', error);
            // If there's an existing server, wait a bit and try again
            await new Promise(resolve => setTimeout(resolve, 1000));
            server = await startServer(TEST_PORT);
            closeServer = server.close;
        }
    });

    test.afterEach(async () => {
        if (closeServer) {
            closeServer();
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for port to be released
        }
    });

    test('should identify counter button locator', async ({ page }) => {
        await page.goto(`http://localhost:${TEST_PORT}`);
        
        const autoCommand = new AutoCommand(page);
        await autoCommand.auto('Click on counter button');
        // await page.waitForTimeout(3000); // 3 second pause, just for preview
        await autoCommand.auto('Type HELLO in search input');
        // await page.waitForTimeout(3000); // 3 second pause agai ;-)
    });
});
