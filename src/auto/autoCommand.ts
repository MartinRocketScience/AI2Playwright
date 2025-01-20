import { Page } from '@playwright/test';
import { LocatorIdentifier } from '../locators/locatorIdentifier';
import { ActionExecutor } from '../actions/actionExecutor';

export class AutoCommand {
    private locatorIdentifier: LocatorIdentifier;
    private actionExecutor: ActionExecutor;
    private page: Page;

    constructor(page: Page) {
        this.locatorIdentifier = new LocatorIdentifier();
        this.actionExecutor = new ActionExecutor();
        this.page = page;
    }

    async auto(command: string): Promise<void> {
        try {
            console.log('Executing auto command:', command);
            
            // First, identify the locator
            const locator = await this.locatorIdentifier.identifyLocator(command, this.page);
            console.log('Identified locator:', locator);
            
            // Then, identify the action
            const action = await this.actionExecutor.determineAction(command);
            console.log('Identified action:', action);
            
            // Finally, execute the action
            await this.actionExecutor.executeAction(this.page, locator, action);
        } catch (error) {
            console.error('Error executing auto command:', error);
            throw error;
        }
    }
}
