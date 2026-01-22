import { useState, useRef, useEffect, useMemo } from 'react';
import { Layout } from '../components/layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useRiskIntelligence } from '../stores/RiskIntelligenceStore';
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
  Database,
  TrendingDown,
  Activity,
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
  'What are my top risks that need immediate attention?',
  'Give me an executive risk briefing',
  'Which risks are deteriorating and why?',
  'What KRIs are breaching thresholds?',
  'What should I escalate to the board?',
  'Run a concentration risk analysis',
  'What controls need strengthening?',
  'Generate a systemic risk assessment',
  'What risks are outside appetite?',
  'Brief me on operational risk exposure',
];

const aiCapabilities = [
  { icon: Brain, title: 'Risk Analysis', description: 'Deep analysis of risk patterns and trends' },
  { icon: Target, title: 'Mitigation Planning', description: 'AI-powered treatment recommendations' },
  { icon: BarChart3, title: 'Quantitative Modeling', description: 'Monte Carlo and scenario analysis' },
  { icon: FileText, title: 'Report Generation', description: 'Automated summaries and presentations' },
  { icon: Shield, title: 'Control Assessment', description: 'Evaluate control effectiveness' },
  { icon: BookOpen, title: 'Best Practices', description: 'Industry standards and frameworks' },
];

const conversationHistory = [
  { id: '1', title: 'Supply Chain Risk Analysis', date: 'Today', messages: 8 },
  { id: '2', title: 'Q4 Risk Report Draft', date: 'Yesterday', messages: 12 },
  { id: '3', title: 'Compliance Gap Assessment', date: 'Jan 14', messages: 6 },
  { id: '4', title: 'Monte Carlo Simulation', date: 'Jan 12', messages: 15 },
];

export function AICoach() {
  const { risks, kris, events, controls, intelligence, isLoaded } = useRiskIntelligence();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'insights' | 'history'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Generate initial message using live data context
  const initialMessage = useMemo((): Message => {
    if (!isLoaded || risks.length === 0) {
      return {
        id: '1',
        role: 'assistant',
        content: `**Lumina R AI Risk Advisor**

I'm your Chief Risk Officer-grade AI assistant, ready to help you navigate your organization's risk landscape.

**To get started:**
1. Upload risk data via the **Data Analysis** module
2. Return here for intelligent, data-driven insights

**What I can help with:**
• Executive risk briefings with live data
• Cross-pillar risk correlation analysis
• KRI breach impact assessment
• Board-ready risk summaries
• Mitigation strategy recommendations

Once data is loaded, I'll speak directly from your risk register—citing specific risks, KRIs, and providing actionable CRO-level guidance.

**Upload your data to unlock my full capabilities.**`,
        timestamp: new Date(),
      };
    }

    // Generate data-aware introduction
    const criticalRisks = risks.filter(r => r.residualScore >= 15 || r.isEscalated);
    const outsideAppetite = risks.filter(r => r.appetiteAlignment === 'Outside Appetite');
    const deteriorating = risks.filter(r => r.riskTrend === 'Deteriorating');
    const kriBreaches = kris.filter(k => k.status === 'Red');
    const systemicScore = intelligence?.systemicIndicator?.score || 0;

    return {
      id: '1',
      role: 'assistant',
      content: `**Lumina R AI Risk Advisor — LIVE DATA MODE**

I'm connected to your risk intelligence platform and ready to provide CRO-grade guidance based on your actual data.

**Current Risk Posture:**
• **Systemic Risk Indicator:** ${systemicScore}/100 ${systemicScore >= 70 ? '🔴 Critical' : systemicScore >= 50 ? '🟠 Elevated' : '🟢 Manageable'}
• **Total Risks Tracked:** ${risks.length}
• **Critical/Escalated:** ${criticalRisks.length}
• **Outside Appetite:** ${outsideAppetite.length}
• **Deteriorating Risks:** ${deteriorating.length}
• **KRI Breaches:** ${kriBreaches.length}

${criticalRisks.length > 0 ? `**⚠️ Priority Alert:** You have ${criticalRisks.length} risk(s) requiring immediate executive attention.` : ''}
${kriBreaches.length > 0 ? `**📊 KRI Alert:** ${kriBreaches.length} Key Risk Indicator(s) are currently in breach.` : ''}

**I can help you with:**
• "What should I escalate to the board?"
• "Give me an executive risk briefing"
• "Which risks are deteriorating and why?"
• "What KRIs need immediate attention?"

**Ask me anything about your risks.** I'll cite specific data points and never contradict your dashboards.`,
      timestamp: new Date(),
    };
  }, [risks, kris, intelligence, isLoaded]);

  // Initialize messages on mount or when data loads
  useEffect(() => {
    setMessages([initialMessage]);
  }, [initialMessage]);

  // Generate dynamic AI insights from live data
  const riskInsights = useMemo((): RiskInsight[] => {
    if (!isLoaded || risks.length === 0) {
      return [
        {
          id: '1',
          type: 'action',
          title: 'No Data Loaded',
          description: 'Upload risk data via Data Analysis to enable AI insights.',
          priority: 'high',
        },
      ];
    }

    const insights: RiskInsight[] = [];

    // Check for critical risks
    const criticalRisks = risks.filter(r => r.residualScore >= 15);
    if (criticalRisks.length > 0) {
      insights.push({
        id: 'critical',
        type: 'warning',
        title: `${criticalRisks.length} Critical Risk${criticalRisks.length > 1 ? 's' : ''} Active`,
        description: `${criticalRisks[0].description.substring(0, 60)}...`,
        priority: 'high',
      });
    }

    // Check for escalated risks
    const escalated = risks.filter(r => r.isEscalated);
    if (escalated.length > 0) {
      insights.push({
        id: 'escalated',
        type: 'action',
        title: `${escalated.length} Risk${escalated.length > 1 ? 's' : ''} Require Escalation`,
        description: `Including: ${escalated[0].category} risk`,
        priority: 'high',
      });
    }

    // Check for deteriorating trends
    const deteriorating = risks.filter(r => r.riskTrend === 'Deteriorating');
    if (deteriorating.length > 0) {
      insights.push({
        id: 'deteriorating',
        type: 'trend',
        title: `${deteriorating.length} Risk${deteriorating.length > 1 ? 's' : ''} Deteriorating`,
        description: 'Negative trend detected. Review mitigation effectiveness.',
        priority: 'high',
      });
    }

    // Check for KRI breaches
    const kriBreaches = kris.filter(k => k.status === 'Red');
    if (kriBreaches.length > 0) {
      insights.push({
        id: 'kri-breach',
        type: 'warning',
        title: `${kriBreaches.length} KRI Breach${kriBreaches.length > 1 ? 'es' : ''}`,
        description: kriBreaches[0].indicator,
        priority: 'high',
      });
    }

    // Check for concentration risk
    const highConcentration = intelligence?.concentrationRisks?.filter(c => c.isConcentrated) || [];
    if (highConcentration.length > 0) {
      insights.push({
        id: 'concentration',
        type: 'warning',
        title: 'Concentration Risk Detected',
        description: `${highConcentration[0].value}: ${highConcentration[0].percentage.toFixed(0)}% of risks`,
        priority: 'medium',
      });
    }

    // Check for weak controls
    const weakControls = controls.filter(c => c.effectiveness === 'Low');
    if (weakControls.length > 0) {
      insights.push({
        id: 'controls',
        type: 'opportunity',
        title: `${weakControls.length} Control${weakControls.length > 1 ? 's' : ''} Need Strengthening`,
        description: 'Low effectiveness controls identified for improvement.',
        priority: 'medium',
      });
    }

    // Add improvement opportunity if risks are improving
    const improving = risks.filter(r => r.riskTrend === 'Improving');
    if (improving.length > 0) {
      insights.push({
        id: 'improving',
        type: 'opportunity',
        title: `${improving.length} Risk${improving.length > 1 ? 's' : ''} Improving`,
        description: 'Mitigation efforts showing positive results.',
        priority: 'low',
      });
    }

    return insights.slice(0, 4); // Return top 4 insights
  }, [risks, kris, controls, intelligence, isLoaded]);

  // Calculate live stats
  const liveStats = useMemo(() => {
    if (!isLoaded || risks.length === 0) {
      return { highPriority: 0, overdueActions: 0, resolvedThisWeek: 0 };
    }

    const highPriority = risks.filter(r => r.residualScore >= 15 || r.isEscalated).length;
    const overdueActions = risks.filter(r => r.status === 'Open' && r.appetiteAlignment === 'Outside Appetite').length;
    const resolvedThisWeek = risks.filter(r => r.status === 'Closed' && r.riskTrend === 'Improving').length;

    return { highPriority, overdueActions, resolvedThisWeek };
  }, [risks, isLoaded]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Generate CRO-grade response using live data
  const generateLiveResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();

    // No data loaded
    if (!isLoaded || risks.length === 0) {
      return `**Data Required**

I don't have access to your risk data yet. To provide CRO-grade insights:

1. Go to **Data Analysis** in the sidebar
2. Upload your risk register, KRI data, or loss events
3. Return here for data-driven guidance

Without live data, I can only offer generic risk management advice. With your data, I'll cite specific risks, trends, and provide actionable recommendations.`;
    }

    const criticalRisks = risks.filter(r => r.residualScore >= 15 || r.isEscalated);
    const outsideAppetite = risks.filter(r => r.appetiteAlignment === 'Outside Appetite');
    const deteriorating = risks.filter(r => r.riskTrend === 'Deteriorating');
    const kriBreaches = kris.filter(k => k.status === 'Red');
    const weakControls = controls.filter(c => c.effectiveness === 'Low');
    const systemicScore = intelligence?.systemicIndicator?.score || 0;
    const categories = [...new Set(risks.map(r => r.category))];

    // Executive briefing
    if (lowerInput.includes('executive') || lowerInput.includes('briefing') || lowerInput.includes('summary') || lowerInput.includes('overview')) {
      const categoryBreakdown = categories.map(cat => {
        const catRisks = risks.filter(r => r.category === cat);
        const critical = catRisks.filter(r => r.residualScore >= 15).length;
        return `• **${cat}:** ${catRisks.length} risks (${critical} critical)`;
      }).join('\n');

      return `## Executive Risk Briefing
**As of ${new Date().toLocaleDateString()}**

### Overall Risk Posture
**Systemic Risk Indicator: ${systemicScore}/100** ${systemicScore >= 70 ? '— ELEVATED CONCERN' : systemicScore >= 50 ? '— REQUIRES ATTENTION' : '— MANAGEABLE'}

### Portfolio Summary
• **Total Risks:** ${risks.length}
• **Critical/Escalated:** ${criticalRisks.length}
• **Outside Risk Appetite:** ${outsideAppetite.length}
• **Deteriorating Trends:** ${deteriorating.length}
• **KRI Breaches:** ${kriBreaches.length}

### Risk Distribution by Category
${categoryBreakdown}

### Board-Level Concerns
${criticalRisks.length > 0 ? `🔴 **${criticalRisks.length} risk(s) require board visibility** — these have residual scores ≥15 or have been flagged for escalation.` : '✅ No immediate board-level escalations required.'}

${deteriorating.length > 0 ? `⚠️ **${deteriorating.length} risk(s) showing deteriorating trends** — mitigation effectiveness should be reviewed.` : ''}

${kriBreaches.length > 0 ? `📊 **${kriBreaches.length} KRI(s) in breach status** — early warning indicators triggered.` : ''}

### CRO Recommendation
${systemicScore >= 70 ? 'Recommend an emergency risk committee meeting within 48 hours to address systemic concerns.' : systemicScore >= 50 ? 'Schedule a risk review within the next week to address emerging concerns.' : 'Current posture is manageable. Continue regular monitoring cadence.'}

*This briefing was generated from live platform data. All figures are current as of this moment.*`;
    }

    // Top risks / immediate attention
    if (lowerInput.includes('top') || lowerInput.includes('priority') || lowerInput.includes('immediate') || lowerInput.includes('urgent') || lowerInput.includes('focus')) {
      if (criticalRisks.length === 0) {
        return `**Good News: No Critical Risks Currently Active**

Based on your risk register, all risks are within acceptable thresholds. However, I recommend monitoring:

${deteriorating.length > 0 ? `• ${deteriorating.length} risks showing deteriorating trends` : ''}
${kriBreaches.length > 0 ? `• ${kriBreaches.length} KRI breaches that could escalate` : ''}
${outsideAppetite.length > 0 ? `• ${outsideAppetite.length} risks outside appetite boundaries` : ''}

Continue proactive monitoring and maintain current controls.`;
      }

      const topRisksDetail = criticalRisks.slice(0, 5).map((r, i) => {
        return `### ${i + 1}. ${r.category} — ${r.description.substring(0, 50)}...
• **Residual Score:** ${r.residualScore}/25 ${r.residualScore >= 20 ? '🔴' : r.residualScore >= 15 ? '🟠' : '🟡'}
• **Trend:** ${r.riskTrend === 'Deteriorating' ? '↗️ Deteriorating' : r.riskTrend === 'Improving' ? '↘️ Improving' : '→ Stable'}
• **Appetite Status:** ${r.appetiteAlignment}
• **Owner:** ${r.owner}
• **Escalation Reasons:** ${r.escalationReasons.length > 0 ? r.escalationReasons.join(', ') : 'Score threshold'}`;
      }).join('\n\n');

      return `## Top Priority Risks Requiring Immediate Attention

**${criticalRisks.length} Critical Risk(s) Identified**

${topRisksDetail}

### Recommended Actions
1. Schedule immediate review meetings with risk owners
2. Validate control effectiveness for each critical risk
3. Prepare board escalation memo for risks with score ≥20
4. Review linked KRIs for early warning signs

*Based on live data from your risk register.*`;
    }

    // Board escalation
    if (lowerInput.includes('board') || lowerInput.includes('escalat')) {
      const escalatedRisks = risks.filter(r => r.isEscalated || r.residualScore >= 20);

      if (escalatedRisks.length === 0) {
        return `**No Immediate Board Escalations Required**

Current risk posture does not warrant emergency board communication. However, the following should be included in your regular board risk report:

• Overall systemic risk indicator: ${systemicScore}/100
• Risks outside appetite: ${outsideAppetite.length}
• KRI breaches: ${kriBreaches.length}
• Deteriorating trends: ${deteriorating.length}

Schedule these items for the next regular board meeting.`;
      }

      const boardItems = escalatedRisks.slice(0, 3).map((r, i) => {
        return `**${i + 1}. ${r.category}: ${r.description.substring(0, 60)}...**
   - Residual Score: ${r.residualScore}/25
   - Escalation Triggers: ${r.escalationReasons.join(', ') || 'High score threshold'}
   - Velocity: ${r.velocity}
   - Recommended Board Action: ${r.residualScore >= 20 ? 'Approve emergency mitigation budget' : 'Review and acknowledge'}`;
      }).join('\n\n');

      return `## Board Escalation Memo

**${escalatedRisks.length} Risk(s) Require Board Attention**

${boardItems}

### Supporting Data
• Systemic Risk Indicator: ${systemicScore}/100
• KRI Breaches Supporting Escalation: ${kriBreaches.length}
• Total Risks Outside Appetite: ${outsideAppetite.length}

### Recommended Board Actions
1. Acknowledge awareness of escalated risks
2. Approve additional mitigation resources if requested
3. Set expectations for follow-up reporting timeline
4. Consider risk committee deep-dive session

*This escalation memo is generated from live platform data and reflects current risk posture.*`;
    }

    // Deteriorating risks
    if (lowerInput.includes('deteriorat') || lowerInput.includes('wors') || lowerInput.includes('getting worse') || lowerInput.includes('increas')) {
      if (deteriorating.length === 0) {
        return `**No Deteriorating Risk Trends Detected**

All tracked risks are either stable or improving. This indicates:
• Effective mitigation strategies in place
• Controls performing as expected
• No emerging threats requiring immediate attention

Continue monitoring KRIs for early warning signs of trend changes.`;
      }

      const detailedList = deteriorating.slice(0, 5).map((r, i) => {
        return `### ${i + 1}. ${r.category} Risk
**${r.description.substring(0, 80)}...**
• Current Score: ${r.residualScore}/25
• Control Effectiveness: ${r.controlEffectiveness}
• Velocity: ${r.velocity}
• Owner: ${r.owner}
• **Why Deteriorating:** ${r.controlEffectiveness === 'Low' ? 'Weak control effectiveness' : r.velocity === 'Fast' ? 'Fast-moving risk, controls not keeping pace' : 'External factors or control gaps'}`;
      }).join('\n\n');

      return `## Deteriorating Risk Analysis

**${deteriorating.length} Risk(s) Showing Negative Trends**

${detailedList}

### Root Cause Analysis
${weakControls.length > 0 ? `• **${weakControls.length} controls rated as low effectiveness** — primary driver of deterioration` : ''}
${risks.filter(r => r.velocity === 'Fast').length > 0 ? `• **${risks.filter(r => r.velocity === 'Fast').length} fast-velocity risks** — outpacing control response` : ''}
${outsideAppetite.length > 0 ? `• **${outsideAppetite.length} risks outside appetite** — tolerance boundaries breached` : ''}

### CRO Recommendations
1. Immediate control effectiveness review for deteriorating risks
2. Consider accelerating mitigation timelines
3. Increase monitoring frequency for at-risk categories
4. Evaluate additional resource allocation

*Analysis based on trend data in your risk register.*`;
    }

    // KRI analysis
    if (lowerInput.includes('kri') || lowerInput.includes('indicator') || lowerInput.includes('metric') || lowerInput.includes('threshold')) {
      if (kris.length === 0) {
        return `**No KRI Data Available**

I don't have Key Risk Indicator data loaded. To enable KRI analysis:
1. Upload KRI data via Data Analysis
2. Ensure columns include: indicator name, current value, threshold, status

With KRI data, I can provide early warning analysis and breach impact assessment.`;
      }

      const breached = kris.filter(k => k.status === 'Red');
      const approaching = kris.filter(k => k.status === 'Amber');
      const normal = kris.filter(k => k.status === 'Green');

      const breachDetails = breached.slice(0, 5).map((k, i) => {
        return `**${i + 1}. ${k.indicator}**
   - Current Value: ${k.currentValue}
   - Threshold: ${k.threshold}
   - Breach %: ${k.breachPercentage.toFixed(0)}%
   - Trend: ${k.trend}
   - Related Risk ID: ${k.riskId}`;
      }).join('\n\n');

      return `## KRI Status Report

### Summary
• **Total KRIs Tracked:** ${kris.length}
• 🔴 **Breached (Red):** ${breached.length}
• 🟠 **Warning (Amber):** ${approaching.length}
• 🟢 **Normal (Green):** ${normal.length}

${breached.length > 0 ? `### KRI Breaches Requiring Attention\n\n${breachDetails}` : '### ✅ No KRI Breaches'}

${approaching.length > 0 ? `\n### ⚠️ KRIs Approaching Threshold\n${approaching.map(k => `• ${k.indicator}: ${k.currentValue} (threshold: ${k.threshold})`).join('\n')}` : ''}

### Recommended Actions
${breached.length > 0 ? '1. Investigate root cause of each KRI breach\n2. Assess impact on linked risks\n3. Escalate if breach persists >24 hours' : '1. Continue regular monitoring\n2. Review thresholds for relevance'}

*KRI data reflects current uploaded indicators.*`;
    }

    // Concentration risk
    if (lowerInput.includes('concentration') || lowerInput.includes('concentrated') || lowerInput.includes('diversif')) {
      const categoryConcentration = categories.map(cat => {
        const count = risks.filter(r => r.category === cat).length;
        const percentage = Math.round((count / risks.length) * 100);
        return { category: cat, count, percentage };
      }).sort((a, b) => b.percentage - a.percentage);

      const concentrationRisks = intelligence?.concentrationRisks?.filter(c => c.isConcentrated) || [];

      return `## Concentration Risk Analysis

### Risk Distribution by Category
${categoryConcentration.map(c => `• **${c.category}:** ${c.count} risks (${c.percentage}%) ${c.percentage > 40 ? '⚠️ HIGH CONCENTRATION' : ''}`).join('\n')}

${concentrationRisks.length > 0 ? `### ⚠️ Concentration Warnings\n${concentrationRisks.map((c) => `• ${c.type}: ${c.value} — ${c.percentage.toFixed(0)}% (${c.count} risks)`).join('\n')}` : '### ✅ No Concentration Concerns'}

### Regional Distribution
${(() => {
  const regions = [...new Set(risks.map(r => r.region))];
  return regions.map(region => {
    const count = risks.filter(r => r.region === region).length;
    const pct = Math.round((count / risks.length) * 100);
    return `• **${region}:** ${count} risks (${pct}%)`;
  }).join('\n');
})()}

### CRO Perspective
${categoryConcentration[0]?.percentage > 40 ?
  `Your portfolio shows concentration in ${categoryConcentration[0].category} (${categoryConcentration[0].percentage}%). Consider diversifying risk mitigation investments across categories.` :
  'Risk distribution appears balanced across categories. Continue monitoring for emerging concentration patterns.'}

*Concentration analysis based on current risk register data.*`;
    }

    // Controls analysis
    if (lowerInput.includes('control') || lowerInput.includes('mitigat') || lowerInput.includes('treatment')) {
      if (controls.length === 0) {
        const riskControls = risks.filter(r => r.controlEffectiveness);
        const lowEff = riskControls.filter(r => r.controlEffectiveness === 'Low').length;
        const medEff = riskControls.filter(r => r.controlEffectiveness === 'Medium').length;
        const highEff = riskControls.filter(r => r.controlEffectiveness === 'High').length;

        return `## Control Effectiveness Analysis (From Risk Register)

### Effectiveness Distribution
• 🔴 **Low Effectiveness:** ${lowEff} risks
• 🟠 **Medium Effectiveness:** ${medEff} risks
• 🟢 **High Effectiveness:** ${highEff} risks

### Risks with Weak Controls
${risks.filter(r => r.controlEffectiveness === 'Low').slice(0, 3).map(r => `• ${r.category}: ${r.description.substring(0, 50)}...`).join('\n') || 'None identified'}

### Recommendations
${lowEff > 0 ? `1. Prioritize control strengthening for ${lowEff} low-effectiveness areas\n2. Review control design vs. operating effectiveness\n3. Consider automated controls where applicable` : 'Current control effectiveness is acceptable. Maintain regular testing cadence.'}

*For detailed control analysis, upload dedicated control assessment data.*`;
      }

      const lowControls = controls.filter(c => c.effectiveness === 'Low');
      const medControls = controls.filter(c => c.effectiveness === 'Medium');
      const highControls = controls.filter(c => c.effectiveness === 'High');

      return `## Control Assessment Summary

### Control Effectiveness Distribution
• 🔴 **Low:** ${lowControls.length} controls
• 🟠 **Medium:** ${medControls.length} controls
• 🟢 **High:** ${highControls.length} controls

${lowControls.length > 0 ? `### Controls Requiring Attention\n${lowControls.slice(0, 5).map(c => `• **${c.name}** (${c.type})\n  - Effectiveness: Low\n  - Mapped to ${c.mappedRiskIds.length} risk(s)`).join('\n\n')}` : ''}

### Recommendations
1. Conduct root cause analysis on low-effectiveness controls
2. Evaluate control automation opportunities
3. Ensure adequate testing frequency
4. Consider compensating controls where primary controls are weak

*Control data reflects uploaded assessment information.*`;
    }

    // Default intelligent response
    return `## Risk Intelligence Response

Based on your current risk data:

### Current Posture
• **Systemic Risk Indicator:** ${systemicScore}/100
• **Total Active Risks:** ${risks.length}
• **Critical Risks:** ${criticalRisks.length}
• **KRI Breaches:** ${kriBreaches.length}

### Key Observations
${criticalRisks.length > 0 ? `• ${criticalRisks.length} critical risk(s) require immediate attention` : '• No critical risks currently active'}
${deteriorating.length > 0 ? `• ${deteriorating.length} risk(s) showing deteriorating trends` : ''}
${outsideAppetite.length > 0 ? `• ${outsideAppetite.length} risk(s) operating outside appetite` : ''}
${intelligence?.concentrationRisks?.some(c => c.isConcentrated) ? `• Concentration concerns detected` : ''}

### How I Can Help
Try asking me:
• "What are my top priority risks?"
• "Give me an executive briefing"
• "What should I escalate to the board?"
• "Which risks are deteriorating?"
• "Run a KRI analysis"
• "Analyze concentration risk"

I'll provide data-driven insights using your actual risk register.

*All responses cite your live platform data and never contradict your dashboards.*`;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setIsTyping(true);

    // Generate response using live data
    setTimeout(() => {
      const responseContent = generateLiveResponse(userInput);

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
    <Layout title="AI Risk Advisor" subtitle="CRO-grade intelligence powered by live platform data">
      {/* Live Data Status Bar */}
      {isLoaded && risks.length > 0 && (
        <div className="mb-4 flex items-center gap-3 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <Database className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
            Connected to Live Data: {risks.length} risks, {kris.length} KRIs, {events.length} events tracked
          </span>
          <div className="ml-auto flex items-center gap-2">
            <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
            <span className="text-xs text-emerald-600 dark:text-emerald-500">Real-time</span>
          </div>
        </div>
      )}

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
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Analyzing your risk data...</p>
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
                    onKeyPress={handleKeyPress}
                    placeholder={isLoaded && risks.length > 0
                      ? "Ask about your risks... (try 'executive briefing' or 'top risks')"
                      : "Upload risk data to enable live insights..."
                    }
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
                Lumina R AI Risk Advisor • {isLoaded && risks.length > 0 ? 'Responses cite live platform data' : 'Upload data to enable live insights'}
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
                {isLoaded && risks.length > 0 ? 'Live AI Insights' : 'AI Insights'}
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

          {/* Quick Stats - Now using live data */}
          <Card>
            <h3 className="font-medium text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              {isLoaded && risks.length > 0 && <Activity className="w-3 h-3 text-emerald-500" />}
              Risk Snapshot
              {isLoaded && risks.length > 0 && <span className="text-xs text-emerald-500 ml-auto">LIVE</span>}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  High Priority
                </span>
                <span className="text-sm font-bold text-red-600">{liveStats.highPriority}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  Outside Appetite
                </span>
                <span className="text-sm font-bold text-amber-600">{liveStats.overdueActions}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Improving Trend
                </span>
                <span className="text-sm font-bold text-emerald-600">{liveStats.resolvedThisWeek}</span>
              </div>
              {isLoaded && risks.length > 0 && intelligence && (
                <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      {intelligence.systemicIndicator.score >= 70 ? (
                        <TrendingUp className="w-4 h-4 text-red-500" />
                      ) : intelligence.systemicIndicator.score >= 50 ? (
                        <TrendingUp className="w-4 h-4 text-amber-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-emerald-500" />
                      )}
                      Systemic Risk
                    </span>
                    <span className={`text-sm font-bold ${
                      intelligence.systemicIndicator.score >= 70 ? 'text-red-600' :
                      intelligence.systemicIndicator.score >= 50 ? 'text-amber-600' : 'text-emerald-600'
                    }`}>
                      {intelligence.systemicIndicator.score}/100
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* New Chat */}
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => setMessages([initialMessage])}
          >
            <RefreshCw className="w-4 h-4" />
            New Conversation
          </Button>
        </div>
      </div>
    </Layout>
  );
}
