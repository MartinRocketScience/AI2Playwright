# AI2Playwright

AI2Playwright is an innovative tool that combines the power of Playwright automation with AI-driven element locator identification. It allows you to write automated tests using natural language commands, which are then interpreted and executed using Playwright.

## Features

- 🤖 Natural Language Processing for test commands
- 🎯 Smart element locator identification
- 🔄 Dynamic HTML context analysis
- 🎭 Playwright-based automation
- 🧠 Ollama AI integration

## Prerequisites

- Node.js (v16 or higher)
- Ollama installed and running locally
- Playwright Test dependencies

## Ollama Installation and Setup

### Windows Installation

1. Download Ollama for Windows:
   - Visit [Ollama Releases](https://github.com/jmorganca/ollama/releases)
   - Download the latest Windows release

2. Install Ollama:
   - Run the downloaded installer
   - Follow the installation wizard
   - Ollama will be installed as a Windows service

### Linux Installation

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### MacOS Installation

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### Running Ollama

1. Start Ollama service:
   - Windows: The service starts automatically after installation
   - Linux/MacOS: Run `ollama serve`

2. Pull and run the required model:
```bash
# For CPU-only usage (recommended for most users)
ollama pull codellama
ollama run codellama

# For GPU usage (NVIDIA GPUs, better performance)
ollama pull codellama:7b-code-q4_K_M
ollama run codellama:7b-code-q4_K_M
```

### Model Configuration

In `src/services/ollamaService.ts`, you can configure which model to use:

```typescript
// Default configuration (CPU)
constructor(
    baseUrl: string = 'http://localhost:11434',
    model: string = 'codellama'  // Using CodeLlama for better code understanding
) {
    this.baseUrl = baseUrl;
    this.model = model;
}

// For GPU usage, change the model to:
constructor(
    baseUrl: string = 'http://localhost:11434',
    model: string = 'codellama:7b-code-q4_K_M'
) {
    this.baseUrl = baseUrl;
    this.model = model;
}
```

### Why CodeLlama?

We use CodeLlama instead of the standard Llama2 because:
- It's specifically trained on code and programming tasks
- Better understanding of HTML/CSS/JavaScript syntax
- More accurate element locator identification
- Improved code-related reasoning abilities

### Performance Considerations

- GPU Setup (NVIDIA):
  - Requirements: NVIDIA GPU with CUDA support
  - Memory: 8GB+ VRAM recommended
  - Performance: Much faster inference
  - Model: Use `codellama:7b-code-q4_K_M`

- CPU Setup:
  - Requirements: No special hardware needed
  - Memory: 8GB+ RAM recommended
  - Performance: Slower but works everywhere
  - Model: Use `codellama`

### Troubleshooting

1. If you see errors about the model not being found:
```bash
# Check if the model is installed
ollama list

# If not, pull it again
ollama pull codellama
```

2. For GPU users, verify CUDA is working:
```bash
# Should show Ollama process when running
nvidia-smi
```

3. If the model is too slow:
- GPU users: Make sure you're using the quantized version (`codellama:7b-code-q4_K_M`)
- CPU users: Consider using a smaller model or upgrading RAM

4. If you get poor locator identification:
- Make sure you're using CodeLlama, not the standard Llama2
- The model is specifically trained for code understanding

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/AI2Playwright.git
cd AI2Playwright
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

4. Make sure Ollama is running locally with the default settings.

## Project Structure

```
AI2Playwright/
├── src/
│   ├── actions/
│   │   └── actionExecutor.ts    # Handles execution of identified actions
│   ├── auto/
│   │   └── autoCommand.ts       # Main command processor
│   ├── locators/
│   │   └── locatorIdentifier.ts # AI-powered element identification
│   └── services/
│       └── ollamaService.ts     # Ollama AI service integration
├── tests/
│   ├── auto.spec.ts             # Example test cases
│   └── server.spec.ts           # Server test utilities
└── DemoServer/
    └── startServer.ts           # Demo server for testing
```

## Usage

### Basic Example

```typescript
import { test } from '@playwright/test';
import { AutoCommand } from '../src/auto/autoCommand';

test('example test', async ({ page }) => {
    const autoCommand = new AutoCommand(page);
    
    // Use natural language commands
    await autoCommand.auto('Click on counter button');
    await autoCommand.auto('Type HELLO in search input');
});
```

### Supported Locator Types

- `id` - Element IDs
- `testid` - Test attributes (data-testid)
- `name` - Name attributes
- `text` - Visible text content
- `role` - ARIA roles
- `class` - CSS classes
- `xpath` - XPath expressions
- `css` - CSS selectors

### Running Tests

Run tests in headless mode:
```bash
npm test
```

Run tests with browser visible:
```bash
npx playwright test --headed
```

Run tests in debug mode:
```bash
npx playwright test --debug
```

## How It Works

1. **Command Processing**: When you send a natural language command, it's processed by the `AutoCommand` class.

2. **Locator Identification**: The `LocatorIdentifier` class:
   - Captures the current page HTML
   - Sends the command and HTML context to Ollama
   - Receives and processes AI suggestions for element location

3. **Action Execution**: The `ActionExecutor` class:
   - Determines the appropriate Playwright action
   - Executes the action using the identified locator
   - Handles various action types (click, type, etc.)

## Configuration

The system uses default configurations for:
- Server port: 3001 (configurable in tests)
- Ollama endpoint: http://localhost:11434 (configurable in OllamaService)

## Best Practices

1. **Element Identification**:
   - Prefer unique IDs when available
   - Use data-testid for testing-specific attributes
   - Fallback to other locators when needed

2. **Commands**:
   - Use clear, descriptive commands
   - Include the target element in the command
   - Specify the action clearly

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Playwright team for the excellent browser automation framework
- Ollama team for the local AI model support
