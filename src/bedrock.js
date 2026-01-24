import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

/**
 * Sleep for a given number of milliseconds
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Creates a Bedrock client wrapper with retry logic
 */
export function createBedrockClient(config) {
  const client = new BedrockRuntimeClient({ region: config.region });
  const modelId = config.modelId;

  /**
   * Invokes Claude with the given prompt, with retry logic
   * @param {string} prompt - The user prompt
   * @param {string} systemPrompt - Optional system prompt
   * @returns {string} - The model's response text
   */
  async function invoke(prompt, systemPrompt = '') {
    const maxRetries = 3;
    const baseDelay = 1000; // 1 second

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const body = {
          anthropic_version: 'bedrock-2023-05-31',
          max_tokens: 32000,
          messages: [
            { role: 'user', content: prompt }
          ]
        };

        if (systemPrompt) {
          body.system = systemPrompt;
        }

        const command = new InvokeModelCommand({
          modelId,
          contentType: 'application/json',
          accept: 'application/json',
          body: JSON.stringify(body)
        });

        const response = await client.send(command);
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        
        return responseBody.content[0].text;
      } catch (error) {
        const isLastAttempt = attempt === maxRetries;
        
        if (isLastAttempt) {
          throw new Error(`Bedrock API failed after ${maxRetries + 1} attempts: ${error.message}`);
        }

        // Exponential backoff: 1s, 2s, 4s
        const delay = baseDelay * Math.pow(2, attempt);
        console.warn(`Bedrock API error (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delay}ms:`, error.message);
        await sleep(delay);
      }
    }
  }

  return { invoke, modelId };
}
