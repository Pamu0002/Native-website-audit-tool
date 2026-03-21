import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOGS_DIR = path.join(__dirname, '../../logs');
const PROMPT_LOG_FILE = path.join(LOGS_DIR, 'prompt-trace.jsonl');

export const logPrompt = async (logData) => {
  try {
    // Ensure logs directory exists
    await fs.mkdir(LOGS_DIR, { recursive: true });

    // Create log entry
    const logEntry = {
      timestamp: new Date().toISOString(),
      provider: logData.provider,
      model: logData.model,
      systemPrompt: logData.systemPrompt,
      userPrompt: logData.userPrompt,
      auditData: logData.auditData,
      context: logData.context,
      rawResponse: logData.rawResponse
    };

    // Append to JSONL file
    await fs.appendFile(
      PROMPT_LOG_FILE,
      JSON.stringify(logEntry) + '\n'
    );

    console.log('✅ Prompt logged');
  } catch (error) {
    console.error('Error logging prompt:', error.message);
  }
};

export const getPromptLogs = async () => {
  try {
    const content = await fs.readFile(PROMPT_LOG_FILE, 'utf-8');
    const lines = content.trim().split('\n');
    return lines.map(line => JSON.parse(line));
  } catch (error) {
    return [];
  }
};
