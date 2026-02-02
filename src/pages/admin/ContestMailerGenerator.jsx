/**
 * Contest Mailer Generator - Enhanced
 * Generate and download communication templates based on contest theme
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { X, Download, Copy, Check, Mail, MessageSquare, Smartphone, FileText, Image } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

const ContestMailerGenerator = ({ isOpen, onClose, contest }) => {
  const [selectedTemplate, setSelectedTemplate] = useState("email");
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen || !contest) return null;

  const daysRemaining = Math.ceil(
    (new Date(contest.endDate) - new Date(contest.startDate)) / (1000 * 60 * 60 * 24)
  );

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (content, filename, type = 'text/plain') => {
    setDownloading(true);
    const element = document.createElement("a");
    const blob = new Blob([content], { type });
    element.href = URL.createObjectURL(blob);
    element.download = filename;
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(element.href);
    setTimeout(() => setDownloading(false), 1000);
  };

  const emailTemplate = `
Subject: 🎯 ${contest.name} - Join the Competition!

Hi [Recipient Name],

We're thrilled to announce the launch of ${contest.name}!

This is your opportunity to showcase your excellence and compete with the best in your team.

📋 CONTEST DETAILS:
  • Duration: ${contest.startDate} to ${contest.endDate}
  • Performance Metrics: ${contest.metrics?.length || 0} key indicators
  • Reward Tiers: ${contest.rewards?.length || 0} levels

🏆 WHAT YOU'RE COMPETING FOR:
${
  contest.rewards
    ?.slice(0, 3)
    .map((r) => `  • ${r.position}: ${r.title} (${r.points} points)`)
    .join("\n") || "  • Exclusive prizes for top performers"
}

📈 PERFORMANCE METRICS:
${
  contest.metrics
    ?.slice(0, 5)
    .map((m) => `  • ${m.name}: ${m.target} (${m.weightage}% weightage)`)
    .join("\n") || "  • Quality, efficiency, and customer satisfaction"
}

🚀 HOW TO PARTICIPATE:
1. Log in to your gaMEtrix dashboard
2. Navigate to the "Contests" section
3. Find "${contest.name}" and click "Register"
4. Monitor your performance in real-time
5. Climb the leaderboard and win!

💡 PRO TIP: Focus on achieving the metrics with highest weightage for maximum points.

Questions? Reach out to our support team at support@gameprix.com

Good luck and may the best performer win! 🎉

Best regards,
The gaMEtrix Team

---
This is an automated message. Please do not reply to this email.
`.trim();

  const smsTemplate = `
🎯 ${contest.name} is LIVE!

Compete now & win amazing rewards. Duration: ${daysRemaining} days.

${contest.metrics?.length || 0} metrics | ${contest.rewards?.length || 0} reward tiers

Dashboard: [App Link]

🏆 Top performers get exclusive prizes!

Reply HELP for support.
`.trim();

  const slackTemplate = `
🎯 *${contest.name} Launch Announcement* 🎯

We're excited to announce the start of *${contest.name}*!

*📋 Duration:* ${contest.startDate} to ${contest.endDate}
*📊 Metrics:* ${contest.metrics?.length || 0} performance indicators
*🏆 Rewards:* ${contest.rewards?.length || 0} exclusive tiers

*Performance Metrics:*
${
  contest.metrics
    ?.slice(0, 3)
    .map((m) => `• ${m.name} (${m.weightage}% weight)`)
    .join("\n") || "• Quality, Efficiency & Customer Satisfaction"
}

*Reward Highlights:*
${
  contest.rewards
    ?.slice(0, 3)
    .map((r) => `• ${r.position}: ${r.title}`)
    .join("\n") || "• 1st Place: Premium Rewards\n• 2nd Place: Exclusive Gift Card\n• 3rd Place: Recognition Badge"
}

*Ready to compete?* :rocket:
Visit your dashboard now and register for the contest!

Good luck everyone! 🎉
`.trim();

  const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${contest.name}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: #0a0a0f;
            color: #ffffff;
        }
        .container { max-width: 600px; margin: 0 auto; background: #12121a; }
        .header { 
            background: linear-gradient(135deg, ${contest.theme?.primary || '#8B5CF6'} 0%, ${contest.theme?.accent || '#EC4899'} 100%);
            padding: 50px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></svg>') repeat;
            opacity: 0.3;
        }
        .header h1 { 
            font-size: 32px; 
            font-weight: 700;
            margin-bottom: 10px;
            position: relative;
            text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
        .header p { 
            font-size: 16px;
            opacity: 0.9;
            position: relative;
        }
        .badge {
            display: inline-block;
            background: rgba(255,255,255,0.2);
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 1px;
            margin-bottom: 15px;
        }
        .content { padding: 40px 30px; }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin: 25px 0;
        }
        .stat-card {
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%);
            border: 1px solid rgba(139, 92, 246, 0.2);
            border-radius: 12px;
            padding: 20px;
            text-align: center;
        }
        .stat-card .value {
            font-size: 28px;
            font-weight: 700;
            color: ${contest.theme?.primary || '#8B5CF6'};
            margin-bottom: 5px;
        }
        .stat-card .label {
            font-size: 11px;
            color: #888;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        h2 { 
            font-size: 18px; 
            margin-bottom: 20px;
            color: #fff;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .metric { 
            background: rgba(255,255,255,0.05);
            border-left: 3px solid ${contest.theme?.primary || '#8B5CF6'};
            padding: 15px 20px;
            margin: 12px 0;
            border-radius: 0 8px 8px 0;
        }
        .metric strong { 
            color: #fff;
            font-size: 14px;
        }
        .metric span {
            display: block;
            color: #888;
            font-size: 12px;
            margin-top: 4px;
        }
        .rewards-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin: 20px 0;
        }
        .reward-card {
            background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 12px;
            padding: 20px;
            text-align: center;
        }
        .reward-card.gold { border-color: #FFD700; background: linear-gradient(135deg, rgba(255,215,0,0.1) 0%, rgba(255,215,0,0.02) 100%); }
        .reward-card.silver { border-color: #C0C0C0; background: linear-gradient(135deg, rgba(192,192,192,0.1) 0%, rgba(192,192,192,0.02) 100%); }
        .reward-card.bronze { border-color: #CD7F32; background: linear-gradient(135deg, rgba(205,127,50,0.1) 0%, rgba(205,127,50,0.02) 100%); }
        .reward-card .position {
            font-size: 24px;
            margin-bottom: 8px;
        }
        .reward-card .title {
            font-size: 14px;
            font-weight: 600;
            color: #fff;
        }
        .reward-card .points {
            font-size: 12px;
            color: #888;
            margin-top: 5px;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, ${contest.theme?.primary || '#8B5CF6'} 0%, ${contest.theme?.accent || '#EC4899'} 100%);
            color: white;
            padding: 16px 40px;
            border-radius: 30px;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            letter-spacing: 0.5px;
            margin-top: 30px;
            box-shadow: 0 10px 30px -10px ${contest.theme?.primary || '#8B5CF6'};
        }
        .cta-section {
            text-align: center;
            padding: 40px 30px;
            background: rgba(139, 92, 246, 0.05);
            border-top: 1px solid rgba(139, 92, 246, 0.1);
        }
        .footer { 
            background: #0a0a0f;
            padding: 30px;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
        .footer a { color: ${contest.theme?.primary || '#8B5CF6'}; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="badge">🎯 NEW CONTEST</div>
            <h1>${contest.name}</h1>
            <p>${contest.bannerText || contest.description || 'Join the competition and showcase your excellence!'}</p>
        </div>
        
        <div class="content">
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="value">${daysRemaining}</div>
                    <div class="label">Days</div>
                </div>
                <div class="stat-card">
                    <div class="value">${contest.metrics?.length || 0}</div>
                    <div class="label">Metrics</div>
                </div>
                <div class="stat-card">
                    <div class="value">${contest.rewards?.length || 0}</div>
                    <div class="label">Rewards</div>
                </div>
            </div>

            <h2>📊 Performance Metrics</h2>
            ${
              contest.metrics
                ?.map(
                  (m) =>
                    `<div class="metric"><strong>${m.name}</strong><span>Target: ${m.target} • Weight: ${m.weightage}%</span></div>`
                )
                .join("") || "<p style='color:#888'>Quality, Efficiency, and Customer Satisfaction</p>"
            }
            
            <h2 style="margin-top: 35px;">🏆 Reward Tiers</h2>
            <div class="rewards-grid">
                <div class="reward-card gold">
                    <div class="position">🥇</div>
                    <div class="title">${contest.rewards?.[0]?.title || '1st Place'}</div>
                    <div class="points">${contest.rewards?.[0]?.points || 5000}+ pts</div>
                </div>
                <div class="reward-card silver">
                    <div class="position">🥈</div>
                    <div class="title">${contest.rewards?.[1]?.title || '2nd Place'}</div>
                    <div class="points">${contest.rewards?.[1]?.points || 3000}+ pts</div>
                </div>
                <div class="reward-card bronze">
                    <div class="position">🥉</div>
                    <div class="title">${contest.rewards?.[2]?.title || '3rd Place'}</div>
                    <div class="points">${contest.rewards?.[2]?.points || 1000}+ pts</div>
                </div>
            </div>
        </div>
        
        <div class="cta-section">
            <p style="color: #888; margin-bottom: 10px; font-size: 14px;">Ready to compete?</p>
            <a href="[Dashboard Link]" class="button">REGISTER & JOIN NOW</a>
        </div>
        
        <div class="footer">
            <p>© 2026 gaMEtrix. All rights reserved.</p>
            <p style="margin-top: 10px;">
                <a href="#">Privacy Policy</a> • <a href="#">Terms of Service</a> • <a href="#">Unsubscribe</a>
            </p>
        </div>
    </div>
</body>
</html>
`.trim();

  const templates = [
    {
      id: "email",
      name: "Email Campaign",
      icon: Mail,
      content: emailTemplate,
      description: "Professional email to notify contestants",
      fileExt: "txt",
      mimeType: "text/plain",
    },
    {
      id: "sms",
      name: "SMS Notification",
      icon: MessageSquare,
      content: smsTemplate,
      description: "Quick mobile notification",
      fileExt: "txt",
      mimeType: "text/plain",
    },
    {
      id: "slack",
      name: "Slack Message",
      icon: Smartphone,
      content: slackTemplate,
      description: "Team channel announcement",
      fileExt: "txt",
      mimeType: "text/plain",
    },
    {
      id: "html",
      name: "HTML Email",
      icon: FileText,
      content: htmlTemplate,
      description: "Designed HTML email template",
      fileExt: "html",
      mimeType: "text/html",
    },
  ];

  const currentTemplate = templates.find((t) => t.id === selectedTemplate);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl glass-card border border-border/50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50 bg-card/50">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Communication Templates
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Download customized mailer templates for <span className="text-primary font-medium">{contest.name}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Template Selector */}
        <div className="px-6 py-4 border-b border-border/50 bg-muted/20">
          <p className="text-sm font-medium text-foreground mb-3">Select Template Type</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all text-left group",
                  selectedTemplate === template.id
                    ? "border-primary bg-primary/10 scale-[1.02]"
                    : "border-border/50 hover:border-primary/50"
                )}
              >
                <template.icon 
                  className={cn(
                    "w-6 h-6 mb-2 transition-colors",
                    selectedTemplate === template.id ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                  )} 
                />
                <p className="font-medium text-sm text-foreground">
                  {template.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {template.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Content Preview */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-foreground">Preview</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(currentTemplate.content)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  copied ? "bg-success/20 text-success" : "bg-primary/20 text-primary hover:bg-primary/30"
                )}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Text
                  </>
                )}
              </button>
              <button
                onClick={() =>
                  handleDownload(
                    currentTemplate.content,
                    `${contest.name.replace(/\s+/g, '_')}_${selectedTemplate}.${currentTemplate.fileExt}`,
                    currentTemplate.mimeType
                  )
                }
                disabled={downloading}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  downloading ? "bg-muted text-muted-foreground" : "bg-secondary/20 text-secondary hover:bg-secondary/30"
                )}
              >
                <Download className={cn("w-4 h-4", downloading && "animate-bounce")} />
                {downloading ? "Downloading..." : "Download"}
              </button>
            </div>
          </div>

          {selectedTemplate === "html" ? (
            <div className="rounded-xl overflow-hidden border border-border/50">
              <div className="bg-muted/30 px-4 py-2 border-b border-border/50 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">HTML Preview</span>
                <span className="text-xs text-muted-foreground font-mono">index.html</span>
              </div>
              <iframe
                srcDoc={htmlTemplate}
                title="Email Preview"
                className="w-full h-[500px] bg-white"
              />
            </div>
          ) : (
            <GlassCard className="p-6">
              <pre className="text-sm text-muted-foreground whitespace-pre-wrap break-words font-mono max-h-[400px] overflow-y-auto">
                {currentTemplate.content}
              </pre>
            </GlassCard>
          )}
        </div>

        {/* Tips Section */}
        <div className="px-6 py-4 border-t border-border/50 bg-muted/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground">Subject Line Tips</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Use power words like "Join", "Compete", "Win". Include emoji for higher open rates.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center shrink-0">
                <Image className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground">Best Practices</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Send at peak hours, include clear CTA, and highlight top rewards prominently.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border/50 bg-card/50">
          <p className="text-xs text-muted-foreground">
            💡 Replace [Dashboard Link] and [Recipient Name] placeholders in your email system
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ContestMailerGenerator;
