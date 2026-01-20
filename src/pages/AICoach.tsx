import { useState, useRef, useEffect } from 'react';
import { Layout } from '../components/layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { generateAIResponse, type AIMessage } from '../services/openai';
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
  Brain,
  Target,
  TrendingUp,
  AlertTriangle,
  Shield,
  FileText,
  BarChart3,
  Zap,
  CheckCircle2,
  Clock,
  ArrowRight,
  BookOpen,
  History,
  MessageSquare,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface RiskInsight {
  id: string;
  type: 'warning' | 'opportunity' | 'trend' | 'action';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

const suggestedPrompts = [
  'What are my top 3 risks to focus on this week?',
  'Suggest mitigation strategies for supply chain risks',
  'Generate a risk summary for the board meeting',
  'Run a Monte Carlo simulation on project risks',
  'Which risks have increased in severity this month?',
  'Help me assess a new technology risk',
  'What compliance gaps should I address?',
  'Create a bow-tie analysis for cybersecurity',
  'Compare our risk profile to industry benchmarks',
  'Draft a risk appetite statement',
];

const aiCapabilities = [
  { icon: Brain, title: 'Risk Analysis', description: 'Deep analysis of risk patterns and trends' },
  { icon: Target, title: 'Mitigation Planning', description: 'AI-powered treatment recommendations' },
  { icon: BarChart3, title: 'Quantitative Modeling', description: 'Monte Carlo and scenario analysis' },
  { icon: FileText, title: 'Report Generation', description: 'Automated summaries and presentations' },
  { icon: Shield, title: 'Control Assessment', description: 'Evaluate control effectiveness' },
  { icon: BookOpen, title: 'Best Practices', description: 'Industry standards and frameworks' },
];

const riskInsights: RiskInsight[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Cybersecurity Risk Escalating',
    description: 'Risk score increased 20% this month. Immediate review recommended.',
    priority: 'high',
  },
  {
    id: '2',
    type: 'action',
    title: '3 Overdue Mitigations',
    description: 'Supply chain and compliance actions past due date.',
    priority: 'high',
  },
  {
    id: '3',
    type: 'trend',
    title: 'Operational Risk Declining',
    description: 'Process improvements showing positive impact.',
    priority: 'low',
  },
  {
    id: '4',
    type: 'opportunity',
    title: 'Control Optimization',
    description: '4 redundant controls identified for consolidation.',
    priority: 'medium',
  },
];

const conversationHistory = [
  { id: '1', title: 'Supply Chain Risk Analysis', date: 'Today', messages: 8 },
  { id: '2', title: 'Q4 Risk Report Draft', date: 'Yesterday', messages: 12 },
  { id: '3', title: 'Compliance Gap Assessment', date: 'Jan 14', messages: 6 },
  { id: '4', title: 'Monte Carlo Simulation', date: 'Jan 12', messages: 15 },
];

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: `Hello! I'm **Lumina R AI Risk Advisor**, your intelligent partner for risk management. I'm trained on industry best practices, regulatory frameworks, and your organization's risk data.

**What I can help you with:**

📊 **Risk Analysis** - Identify patterns, trends, and emerging risks
🎯 **Mitigation Strategies** - AI-powered recommendations tailored to your context
📈 **Quantitative Modeling** - Monte Carlo simulations, scenario analysis, VaR calculations
📋 **Report Generation** - Board summaries, compliance reports, risk assessments
🛡️ **Framework Guidance** - ISO 31000, COSO ERM, Basel III, and more
🔍 **Control Assessment** - Evaluate effectiveness and identify gaps

**Quick Actions:**
• Type "analyze [risk name]" for deep analysis
• Type "simulate" for Monte Carlo modeling
• Type "report" for auto-generated summaries
• Type "benchmark" to compare with industry

How can I assist you today?`,
    timestamp: new Date(),
  },
];

export function AICoach() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'insights' | 'history'>('chat');
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
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      // Convert messages to AIMessage format for the API
      const conversationHistory: AIMessage[] = messages
        .filter((msg) => msg.role !== 'assistant' || msg.id !== '1') // Exclude initial greeting
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

      // Call OpenAI API
      const responseContent = await generateAIResponse(currentInput, conversationHistory);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again or check your API configuration.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'opportunity': return <Lightbulb className="w-4 h-4 text-emerald-500" />;
      case 'trend': return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case 'action': return <Zap className="w-4 h-4 text-amber-500" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <Layout title="AI Risk Advisor" subtitle="Intelligent guidance powered by Lumina Intelligence">
      {/* AI Capabilities Bar */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-4 min-w-max pb-2">
          {aiCapabilities.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <div key={idx} className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <Icon className="w-5 h-5 text-lumina-600 dark:text-lumina-400" />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{cap.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{cap.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-16rem)]">
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
                    className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${
                      message.role === 'assistant'
                        ? 'bg-gradient-to-br from-lumina-500 to-lumina-700'
                        : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  >
                    {message.role === 'assistant' ? (
                      <Sparkles className="w-5 h-5 text-white" />
                    ) : (
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">JD</span>
                    )}
                  </div>

                  {/* Content */}
                  <div
                    className={`flex-1 max-w-3xl ${
                      message.role === 'user' ? 'text-right' : ''
                    }`}
                  >
                    <div
                      className={`inline-block text-left px-5 py-4 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-lumina-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                      }`}
                    >
                      <div
                        className="prose prose-sm dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: message.content
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/### (.*?)(\n|$)/g, '<h4 class="font-semibold mt-4 mb-2">$1</h4>')
                            .replace(/## (.*?)(\n|$)/g, '<h3 class="font-bold text-lg mt-4 mb-2">$1</h3>')
                            .replace(/\n/g, '<br />'),
                        }}
                      />
                    </div>

                    {/* Actions for assistant messages */}
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mt-2">
                        <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                          <Copy className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                          <ThumbsUp className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                          <ThumbsDown className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-lumina-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lumina-500 to-lumina-700 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white animate-pulse" />
                  </div>
                  <div className="px-5 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 bg-lumina-400 rounded-full animate-bounce" />
                      <span className="w-2.5 h-2.5 bg-lumina-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                      <span className="w-2.5 h-2.5 bg-lumina-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">AI is analyzing your request...</p>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-end gap-3">
                <div className="flex-1 relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything about your risks... (try 'simulate', 'benchmark', or 'report')"
                    rows={1}
                    className="w-full px-4 py-3 pr-24 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800
                             text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 resize-none
                             focus:outline-none focus:ring-2 focus:ring-lumina-500/20 focus:border-lumina-500"
                  />
                  <div className="absolute right-2 bottom-2 flex items-center gap-1">
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                      <Mic className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <Button variant="primary" onClick={handleSend} disabled={!input.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 text-center">
                Lumina R AI Risk Advisor • Responses are AI-generated suggestions. Always verify with your risk policies.
              </p>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Sidebar Tabs */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
            {[
              { id: 'chat', label: 'Prompts', icon: MessageSquare },
              { id: 'insights', label: 'Insights', icon: Lightbulb },
              { id: 'history', label: 'History', icon: History },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {activeTab === 'chat' && (
            <Card>
              <h3 className="font-medium text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-lumina-500" />
                Quick Prompts
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {suggestedPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(prompt)}
                    className="w-full text-left p-2.5 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <ArrowRight className="w-3 h-3 flex-shrink-0" />
                    <span className="line-clamp-2">{prompt}</span>
                  </button>
                ))}
              </div>
            </Card>
          )}

          {activeTab === 'insights' && (
            <Card>
              <h3 className="font-medium text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Brain className="w-4 h-4 text-lumina-500" />
                AI Insights
              </h3>
              <div className="space-y-3">
                {riskInsights.map((insight) => (
                  <div
                    key={insight.id}
                    className={`p-3 rounded-lg cursor-pointer hover:shadow-sm transition-shadow ${
                      insight.priority === 'high' ? 'bg-red-50 dark:bg-red-900/20' :
                      insight.priority === 'medium' ? 'bg-amber-50 dark:bg-amber-900/20' :
                      'bg-slate-50 dark:bg-slate-800'
                    }`}
                    onClick={() => setInput(`Tell me more about: ${insight.title}`)}
                  >
                    <div className="flex items-start gap-2">
                      {getInsightIcon(insight.type)}
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{insight.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{insight.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === 'history' && (
            <Card>
              <h3 className="font-medium text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <History className="w-4 h-4 text-lumina-500" />
                Recent Chats
              </h3>
              <div className="space-y-2">
                {conversationHistory.map((conv) => (
                  <button
                    key={conv.id}
                    className="w-full text-left p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{conv.title}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                      <span>{conv.date}</span>
                      <span>•</span>
                      <span>{conv.messages} messages</span>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          )}

          {/* Quick Stats */}
          <Card>
            <h3 className="font-medium text-slate-900 dark:text-white mb-3">Risk Snapshot</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  High Priority
                </span>
                <span className="text-sm font-bold text-red-600">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  Overdue Actions
                </span>
                <span className="text-sm font-bold text-amber-600">2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Resolved This Week
                </span>
                <span className="text-sm font-bold text-emerald-600">5</span>
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
