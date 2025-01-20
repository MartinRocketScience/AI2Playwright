import { Page } from '@playwright/test';
import type { AriaRole } from '@playwright/test';
import { OllamaService } from '../services/ollamaService';
import { LocatorResult } from '../locators/locatorIdentifier';

export interface ActionCommand {
    action: 'click' | 'fill' | 'select' | 'check' | 'uncheck' | 'press' | 'hover';
    value?: string; // For fill and select actions
}

export class ActionExecutor {
    private ollamaService: OllamaService;

    constructor() {
        this.ollamaService = new OllamaService();
    }

    async determineAction(command: string): Promise<ActionCommand> {
        const prompt = `You are an action detector for web automation. Your task is to analyze the command and determine what action should be performed.
IMPORTANT: You must ONLY return a valid JSON object with no additional text or explanations.
The JSON must follow this exact structure:
{
    "action": "click" | "fill" | "select" | "check" | "uncheck" | "press" | "hover",
    "value": "value to input (only for fill/select actions)"
}

Examples:
Command: "Click the submit button"
{"action": "click"}

Command: "Fill the email field with test@example.com"
{"action": "fill", "value": "test@example.com"}

Command: "Select option 'Blue' from the color dropdown"
{"action": "select", "value": "Blue"}

Analyze this command: ${command}`;

        const response = await this.ollamaService.generateResponse(prompt);
        console.log('Action Detection Response:', response);
        return JSON.parse(response);
    }

    async executeAction(page: Page, locator: LocatorResult, action: ActionCommand): Promise<void> {
        // Create the Playwright locator based on the type
        let playwrightLocator;
        let locatorCommand: string;

        switch (locator.type) {
            case 'id':
                locatorCommand = `page.locator('#${locator.value}')`;
                playwrightLocator = page.locator(`#${locator.value}`);
                break;
            case 'testid':
                locatorCommand = `page.getByTestId('${locator.value}')`;
                playwrightLocator = page.getByTestId(locator.value);
                break;
            case 'name':
                locatorCommand = `page.locator('[name="${locator.value}"]')`;
                playwrightLocator = page.locator(`[name="${locator.value}"]`);
                break;
            case 'text':
                locatorCommand = `page.getByText('${locator.value}')`;
                playwrightLocator = page.getByText(locator.value);
                break;
            case 'role':
                locatorCommand = `page.getByRole('${locator.value}')`;
                playwrightLocator = page.getByRole(locator.value as AriaRole);
                break;
            case 'class':
                locatorCommand = `page.locator('.${locator.value}')`;
                playwrightLocator = page.locator(`.${locator.value}`);
                break;
            case 'xpath':
                locatorCommand = `page.locator('xpath=${locator.value}')`;
                playwrightLocator = page.locator(`xpath=${locator.value}`);
                break;
            case 'css':
                locatorCommand = `page.locator('${locator.value}')`;
                playwrightLocator = page.locator(locator.value);
                break;
            default:
                throw new Error(`Unsupported locator type: ${locator.type}`);
        }

        // Execute the appropriate action
        let actionCommand: string;
        switch (action.action) {
            case 'click':
                actionCommand = `${locatorCommand}.click()`;
                console.log('Executing Playwright command:', actionCommand);
                await playwrightLocator.click();
                break;
            case 'fill':
                actionCommand = `${locatorCommand}.fill('${action.value}')`;
                console.log('Executing Playwright command:', actionCommand);
                if (!action.value) throw new Error('Value is required for fill action');
                await playwrightLocator.fill(action.value);
                break;
            case 'select':
                actionCommand = `${locatorCommand}.selectOption('${action.value}')`;
                console.log('Executing Playwright command:', actionCommand);
                if (!action.value) throw new Error('Value is required for select action');
                await playwrightLocator.selectOption(action.value);
                break;
            case 'check':
                actionCommand = `${locatorCommand}.check()`;
                console.log('Executing Playwright command:', actionCommand);
                await playwrightLocator.check();
                break;
            case 'uncheck':
                actionCommand = `${locatorCommand}.uncheck()`;
                console.log('Executing Playwright command:', actionCommand);
                await playwrightLocator.uncheck();
                break;
            case 'press':
                actionCommand = `${locatorCommand}.press('${action.value}')`;
                console.log('Executing Playwright command:', actionCommand);
                if (!action.value) throw new Error('Value is required for press action');
                await playwrightLocator.press(action.value);
                break;
            case 'hover':
                actionCommand = `${locatorCommand}.hover()`;
                console.log('Executing Playwright command:', actionCommand);
                await playwrightLocator.hover();
                break;
            default:
                throw new Error(`Unsupported action: ${action.action}`);
        }
    }
}
