import axios from 'axios';

interface OllamaResponse {
    response: string;
}

export class OllamaService {
    private readonly baseUrl: string;
    private readonly model: string;

    constructor(baseUrl: string = 'http://localhost:11434', model: string = 'codellama') {
        this.baseUrl = baseUrl;
        this.model = model;
    }

    async generateResponse(prompt: string): Promise<string> {
        try {
            const response = await axios.post(`${this.baseUrl}/api/generate`, {
                model: this.model,
                prompt: prompt,
                stream: false
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            return response.data.response;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(`Ollama API error: ${error.response?.statusText || error.message}`);
            }
            throw error;
        }
    }
}
