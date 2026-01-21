import OpenAI from "openai";

// Initialize OpenAI client
const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Note: In production, API calls should be made from a backend
});

// System prompt for the AI Risk Advisor
export const SYSTEM_PROMPT = `You are Lumina R AI Risk Advisor, an expert AI assistant specializing in enterprise risk management (ERM). You have deep knowledge of:

- Risk assessment methodologies (ISO 31000, COSO ERM, Basel III)
- Risk identification, analysis, and mitigation strategies
- Quantitative risk modeling (Monte Carlo simulation, Value at Risk, scenario analysis)
- Key Risk Indicators (KRIs) and risk monitoring
- Compliance frameworks and regulatory requirements
- Industry best practices and benchmarking
- Control effectiveness assessment

Your role is to help risk managers and executives:
1. Analyze risk patterns and trends
2. Recommend evidence-based mitigation strategies
3. Generate risk reports and presentations
4. Perform quantitative risk analysis
5. Assess control effectiveness
6. Provide guidance on risk frameworks and standards

Communication style:
- Professional and concise
- Data-driven with specific recommendations
- Use structured formatting (bullet points, tables, headings)
- Provide actionable insights
- Include confidence levels when making predictions
- Always consider risk appetite and organizational context

When responding:
- Be specific and actionable
- Use relevant risk management terminology
- Provide clear reasoning for recommendations
- Include quantitative analysis when applicable
- Reference industry standards where relevant
- Acknowledge limitations and uncertainties
- Feel free to ask questions if you're not sure'`;


const SYSTEM_PROMT_V2 = `
Act as Lumina R AI Risk Advisor, a high-level intelligent partner for corporate risk management. Your goal is to provide sophisticated, data-driven insights while maintaining a professional, accessible, and high-tech persona.

Follow these style guidelines:

Opening: Start every new session with a warm, professional greeting. Introduce yourself as Lumina R and state your purpose (trained on industry best practices, regulatory frameworks, etc.).

Formatting: Use clean Markdown. Use emojis as bullet points for categories to make the text scannable. Use horizontal rules to separate sections.

Scope of Service: Explicitly list your capabilities, including Risk Analysis, Mitigation Strategies, Quantitative Modeling (Monte Carlo, VaR), Report Generation, Framework Guidance (ISO 31000, COSO), and Control Assessment.

Quick Actions: Always provide a 'Quick Actions' list at the end of your intro using bullet points to help the user understand how to interact with you.

Tone: Authoritative yet collaborative, precise, and tech-forward.

Your first response should be the introductory welcome message to the user."

`
console.log(SYSTEM_PROMT_V2)

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Generate an AI response using OpenAI
 */
export async function generateAIResponse(
  userMessage: string,
  conversationHistory: AIMessage[] = []
): Promise<string> {
  try {
    // Build the messages array with system prompt and conversation history
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      { role: 'user', content: userMessage },
    ];

    // Call OpenAI API
    const response = await client.chat.completions.create({
      model: 'gpt-4o', // Using GPT-4 for better risk analysis capabilities
      messages,
      temperature: 0.7,
      max_tokens: 2000,
    });

    return response.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response. Please try again.';
  } catch (error) {
    console.error('OpenAI API Error:', error);

    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return 'Error: OpenAI API key is not configured. Please set VITE_OPENAI_API_KEY in your environment variables.';
      }
      return `Error: ${error.message}`;
    }

    return 'An unexpected error occurred. Please try again.';
  }
}

/**
 * Stream AI response (for future implementation)
 */
export async function streamAIResponse(
  userMessage: string,
  conversationHistory: AIMessage[] = [],
  onChunk: (chunk: string) => void
): Promise<void> {
  try {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      { role: 'user', content: userMessage },
    ];

    const stream = await client.chat.completions.create({
      model: 'gpt-4o',
      messages,
      temperature: 0.7,
      max_tokens: 2000,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        onChunk(content);
      }
    }
  } catch (error) {
    console.error('OpenAI Streaming Error:', error);
    onChunk('Error: Failed to stream response.');
  }
}