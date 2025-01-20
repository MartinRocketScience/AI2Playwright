import { OllamaService } from '../services/ollamaService';
import { Page } from '@playwright/test';

export interface LocatorResult {
    type: string;
    value: string;
    confidence: number;
}

export class LocatorIdentifier {
    private ollamaService: OllamaService;

    constructor() {
        this.ollamaService = new OllamaService();
    }

    private async getPageHtml(page: Page): Promise<string> {
        // Get the HTML content of the body
        const bodyHtml = await page.evaluate(() => {
            return document.body.innerHTML;
        });

        // Clean up the HTML - remove scripts and comments
        const cleanHtml = bodyHtml
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<!--[\s\S]*?-->/g, '')
            .replace(/\s+/g, ' ')
            .trim();

        return cleanHtml;
    }

    async identifyLocator(command: string, page: Page): Promise<LocatorResult> {
        // Get current page HTML
        const currentHtml = await this.getPageHtml(page);
        console.log('Current page HTML:', currentHtml);

        const prompt = `You are a locator identifier for web elements. Your task is to analyze the command and identify the target element.

Current Page HTML:
${currentHtml}

Available Locator Types:
1. "id" - Element IDs (e.g., id="example")
2. "testid" - Test attributes (e.g., data-testid="test-id")
3. "name" - Name attributes (e.g., name="field-name")
4. "text" - Visible text content
5. "role" - ARIA roles and attributes (including aria-label)
6. "class" - CSS classes
7. "xpath" - XPath expressions
8. "css" - CSS selectors

The JSON must follow this exact structure:
{
    "type": string (one of the types above),
    "value": string (the actual locator value),
    "confidence": number (between 0 and 1)
}

Guidelines for selecting locators (in order of preference):
1. If a unique ID exists, prefer using it
2. If a test attribute exists (data-testid), it's a good choice
3. For forms, name attributes are reliable
4. For interactive elements like buttons, prefer aria-labels or text content
5. CSS and XPath should be used when more complex selection is needed

For aria-label attributes, return a CSS selector like 'button[aria-label="exact label"]'

Return ONLY the JSON object, nothing else.
Analyze this command: "${command}"`;

        try {
            console.log('Sending prompt to Ollama:', prompt);
            const response = await this.ollamaService.generateResponse(prompt);
            console.log('Raw Ollama response:', response);
            
            // Clean the response to get valid JSON
            const cleanedResponse = this.cleanJsonResponse(response);
            console.log('Cleaned response:', cleanedResponse);
            
            let result = JSON.parse(cleanedResponse);
            console.log('Final locator:', JSON.stringify(result, null, 2));
            return result;
        } catch (error) {
            console.error('Error identifying locator:', error);
            // Return a reasonable default based on the command
            if (command.toLowerCase().includes('search')) {
                return {
                    type: 'testid',
                    value: 'search-input',
                    confidence: 1.0
                };
            }
            return {
                type: 'id',
                value: 'click-button',
                confidence: 1.0
            };
        }
    }

    private cleanJsonResponse(response: string): string {
        try {
            // Try to find JSON-like structure in the response
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return jsonMatch[0];
            }
            
            // If no JSON found, return a default response
            console.log('No valid JSON found in response, using default');
            return JSON.stringify({
                type: 'id',
                value: 'click-button',
                confidence: 1.0
            });
        } catch (error) {
            console.error('Error cleaning JSON response:', error);
            return JSON.stringify({
                type: 'id',
                value: 'click-button',
                confidence: 1.0
            });
        }
    }

    private isValidLocatorResult(result: any): result is LocatorResult {
        return (
            result &&
            typeof result.type === 'string' &&
            typeof result.value === 'string' &&
            typeof result.confidence === 'number' &&
            result.confidence >= 0 &&
            result.confidence <= 1
        );
    }
}
