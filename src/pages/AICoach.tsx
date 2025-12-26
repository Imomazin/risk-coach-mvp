import { useState, useRef, useEffect } from 'react';
import { Layout } from '../components/layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  Sparkles,
  Send,
  Lightbulb,
  RefreshCw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Mic,
  Paperclip,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const suggestedPrompts = [
  'What are my top 3 risks to focus on this week?',
  'Suggest mitigation strategies for supply chain risks',
  'Generate a risk summary for the board meeting',
  'Which risks have increased in severity this month?',
  'Help me assess a new technology risk',
  'What compliance gaps should I address?',
];

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: `Hello! I'm your AI Risk Coach, powered by Lumina Intelligence. I can help you:

• **Analyze risks** - Understand patterns and trends in your risk data
• **Suggest mitigations** - Get AI-powered recommendations for risk treatment
• **Generate reports** - Create summaries and presentations
• **Answer questions** - Ask anything about risk management best practices

How can I help you today?`,
    timestamp: new Date(),
  },
];

export function AICoach() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        default: `Based on your risk register, here's my analysis:

**Key Observations:**
1. You have 3 high-priority risks that need immediate attention
2. The "Cybersecurity Breach" risk has the highest risk score (15)
3. 2 mitigation actions are overdue

**Recommendations:**
• Schedule a review meeting for the cybersecurity risk with your IT team
• Update the supply chain risk assessment with recent vendor data
• Consider escalating the compliance gap to senior management

Would you like me to elaborate on any of these points?`,
        risks: `Based on your current risk landscape, here are your **top 3 priority risks** this week:

1. **Cybersecurity Breach** (Score: 15 - Critical)
   - Status: Actively mitigating
   - Action needed: Review penetration test results by Friday

2. **Supply Chain Disruption** (Score: 20 - High)
   - Status: Being assessed
   - Action needed: Contact backup suppliers

3. **Market Share Erosion** (Score: 16 - High)
   - Status: Under review
   - Action needed: Competitive analysis update

Should I draft a mitigation plan for any of these?`,
        mitigation: `Here are **AI-suggested mitigation strategies** for supply chain risks:

**Short-term (1-4 weeks):**
• Identify and qualify 2-3 backup suppliers for critical components
• Increase safety stock levels by 20% for high-risk items
• Establish direct communication channels with key suppliers

**Medium-term (1-3 months):**
• Implement supplier risk monitoring dashboard
• Negotiate flexible contract terms with key vendors
• Develop regional sourcing alternatives

**Long-term (3-12 months):**
• Diversify supplier base across geographic regions
• Invest in supply chain visibility technology
• Build strategic inventory reserves

Want me to create a detailed action plan for any of these strategies?`,
      };

      const lowerInput = input.toLowerCase();
      let responseContent = responses.default;
      if (lowerInput.includes('top') || lowerInput.includes('priority') || lowerInput.includes('focus')) {
        responseContent = responses.risks;
      } else if (lowerInput.includes('mitigation') || lowerInput.includes('supply chain')) {
        responseContent = responses.mitigation;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Layout title="AI Risk Coach" subtitle="Intelligent guidance for your risk decisions">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
        {/* Chat Area */}
        <div className="lg:col-span-3 flex flex-col">
          <Card padding="none" className="flex-1 flex flex-col overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                      message.role === 'assistant'
                        ? 'bg-gradient-to-br from-lumina-500 to-lumina-700'
                        : 'bg-slate-200'
                    }`}
                  >
                    {message.role === 'assistant' ? (
                      <Sparkles className="w-4 h-4 text-white" />
                    ) : (
                      <span className="text-sm font-medium text-slate-600">JD</span>
                    )}
                  </div>

                  {/* Content */}
                  <div
                    className={`flex-1 max-w-2xl ${
                      message.role === 'user' ? 'text-right' : ''
                    }`}
                  >
                    <div
                      className={`inline-block text-left px-4 py-3 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-lumina-600 text-white'
                          : 'bg-slate-100 text-slate-900'
                      }`}
                    >
                      <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: message.content
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\n/g, '<br />'),
                        }}
                      />
                    </div>

                    {/* Actions for assistant messages */}
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mt-2">
                        <button className="p-1 text-slate-400 hover:text-slate-600">
                          <Copy className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-slate-400 hover:text-emerald-600">
                          <ThumbsUp className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-slate-400 hover:text-red-600">
                          <ThumbsDown className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-lumina-500 to-lumina-700 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-slate-100">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-100">
              <div className="flex items-end gap-3">
                <div className="flex-1 relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask anything about your risks..."
                    rows={1}
                    className="w-full px-4 py-3 pr-20 rounded-xl border border-slate-200 bg-white
                             text-sm text-slate-900 placeholder-slate-400 resize-none
                             focus:outline-none focus:ring-2 focus:ring-lumina-500/20 focus:border-lumina-500"
                  />
                  <div className="absolute right-2 bottom-2 flex items-center gap-1">
                    <button className="p-1.5 text-slate-400 hover:text-slate-600">
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-slate-600">
                      <Mic className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <Button variant="primary" onClick={handleSend} disabled={!input.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 text-center">
                AI responses are suggestions only. Always verify with your risk management policies.
              </p>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Suggested Prompts */}
          <Card>
            <h3 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Suggested Questions
            </h3>
            <div className="space-y-2">
              {suggestedPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => setInput(prompt)}
                  className="w-full text-left p-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </Card>

          {/* Quick Stats */}
          <Card>
            <h3 className="font-medium text-slate-900 mb-3">Risk Snapshot</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">High Priority</span>
                <span className="text-sm font-medium text-red-600">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Overdue Actions</span>
                <span className="text-sm font-medium text-amber-600">2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">This Week's Reviews</span>
                <span className="text-sm font-medium text-slate-900">5</span>
              </div>
            </div>
          </Card>

          {/* New Chat */}
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => setMessages(initialMessages)}
          >
            <RefreshCw className="w-4 h-4" />
            New Conversation
          </Button>
        </div>
      </div>
    </Layout>
  );
}
