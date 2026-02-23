import { useState, useEffect, useRef } from "react";

const NAVY = "#1B2A4A";
const NAVY_LIGHT = "#243656";
const NAVY_DEEP = "#0F1B30";
const GOLD = "#D4A843";
const GOLD_LIGHT = "#E8BC5A";
const BLUE = "#2E5090";
const LIGHT_BLUE = "#E8EFF7";
const RED = "#C0392B";
const GREEN = "#27AE60";
const DARK_GRAY = "#333333";
const MED_GRAY = "#666666";
const LIGHT_GRAY = "#F5F5F5";
const WARNING_BG = "#FFF3E0";

const questions = [
  {
    id: "who",
    question: "Did this happen to you or someone you know?",
    subtext: "Either way, you're in the right place.",
    options: [
      { value: "me", label: "Me" },
      { value: "someone_else", label: "Someone I know" },
    ],
  },
  {
    id: "situation",
    question: "What best describes the situation?",
    subtext: "Take your time. There's no wrong answer.",
    options: [
      { value: "sent_money", label: "Money was sent to someone who turned out to be a scammer" },
      { value: "account_access", label: "Someone gained access to accounts or devices" },
      { value: "gave_info", label: "Personal information was shared that shouldn't have been" },
      { value: "threatened", label: "Someone is threatening and demanding payment" },
      { value: "unsure", label: "Something feels wrong but we're not sure yet" },
    ],
  },
  {
    id: "feeling",
    question: "How are you feeling right now?",
    subtext: "Be honest. This helps us guide you better.",
    options: [
      { value: "panicked", label: "Panicked — I need to act NOW" },
      { value: "angry", label: "Angry — I want to fight back" },
      { value: "ashamed", label: "Ashamed — I can't believe this happened" },
      { value: "overwhelmed", label: "Overwhelmed — I don't know where to start" },
      { value: "numb", label: "Numb — still processing what happened" },
    ],
  },
  {
    id: "timing",
    question: "When did this happen?",
    subtext: "Timing affects which steps to prioritize in your Protocol.",
    options: [
      { value: "hours", label: "Within the last few hours" },
      { value: "today", label: "Today" },
      { value: "days", label: "In the last few days" },
      { value: "week_plus", label: "More than a week ago" },
    ],
  },
  {
    id: "locked_down",
    question: "Have you locked down your accounts yet?",
    subtext: "Changed passwords, frozen cards, secured email.",
    options: [
      { value: "yes", label: "Yes — I've changed passwords and frozen cards" },
      { value: "partial", label: "I've done some of it but not everything" },
      { value: "no", label: "No — I don't know where to start" },
      { value: "unsure", label: "I'm not sure what I should be doing" },
    ],
  },
  {
    id: "bank_contact",
    question: "Have you contacted your bank yet?",
    subtext: "What you say on this call matters more than you think. Your Protocol will prepare you.",
    options: [
      { value: "yes", label: "Yes, I already called them" },
      { value: "no", label: "No, I haven't called yet" },
      { value: "didnt_know", label: "I didn't know I should" },
    ],
  },
  {
    id: "payment",
    question: "How were you asked to pay?",
    subtext: "Each payment type has different protections and deadlines. Your Protocol will cover yours.",
    options: [
      { value: "credit", label: "Credit card" },
      { value: "debit", label: "Debit card" },
      { value: "zelle_venmo", label: "Zelle, Venmo, or Cash App" },
      { value: "wire", label: "Wire transfer" },
      { value: "gift_cards", label: "Gift cards" },
      { value: "crypto", label: "Cryptocurrency" },
      { value: "none", label: "I didn't send money" },
      { value: "multiple", label: "Multiple methods" },
    ],
  },
  {
    id: "amount",
    question: "Approximately how much was involved?",
    subtext: "This helps us prioritize your next steps. No judgment.",
    options: [
      { value: "under_1k", label: "Under $1,000" },
      { value: "1k_5k", label: "$1,000 – $5,000" },
      { value: "over_5k", label: "Over $5,000" },
      { value: "prefer_not", label: "I'd rather not say right now" },
    ],
  },
];

const protocolTeases = [
  null,
  null,
  "Your Protocol is being customized based on your answers...",
  "We're prioritizing the most time-sensitive steps for you...",
  "Your Protocol will include specific guidance for your situation...",
  "Almost there — we're preparing your personalized action plan...",
  "Your Protocol will include the exact scripts and deadlines for your payment type...",
  "Last question — then we'll have everything we need to build your plan.",
];

function getPersonalizedResponse(answers) {
  const { who, feeling, timing, locked_down, bank_contact, payment } = answers;
  const isThirdParty = who === "someone_else";

  const emotionalOpeners = {
    panicked: isThirdParty
      ? "Take a breath. You're doing the right thing by looking for help. The fact that you're here means they have someone in their corner — and that matters more than you know."
      : "First — take a breath. You're in the right place, and we're going to walk you through this step by step. The fact that you're here and acting fast is already working in your favor.",
    angry: isThirdParty
      ? "That anger means you care. Let's channel it into the steps that will actually help them — starting with knowing what to do and what to say."
      : "Good. That anger means you're ready to fight back. Let's channel that energy into the steps that actually protect you and strengthen your case.",
    ashamed: isThirdParty
      ? "If they're feeling ashamed, that's normal — but it's not their fault. Scammers are professionals who do this 40+ hours a week. The best thing you can do is help them see that."
      : "Stop right there. This is not your fault. Scammers are professionals who do this 40+ hours a week. They fool doctors, lawyers, engineers, and cybersecurity experts. You were targeted because you're human — not because you're naive.",
    overwhelmed: isThirdParty
      ? "It's overwhelming to watch someone you care about go through this. But you don't need to figure everything out — you just need the right steps. We'll give them to you."
      : "That's completely normal. You don't need to figure everything out right now. You just need to do the next right thing — and we're going to tell you exactly what that is.",
    numb: isThirdParty
      ? "That's understandable. Shock affects everyone involved. The most important thing right now is making sure the right steps happen — and we'll walk you through them."
      : "That's okay. Shock is a normal response. You don't need to feel ready to start — you just need to start. The steps are simple, and we'll walk you through each one.",
  };

  const defaultOpener = isThirdParty
    ? "You're in the right place. Helping someone through this can feel overwhelming, but the right steps make all the difference. We'll walk you through what to do."
    : "You're in the right place. Whatever happened, the steps you take next are what matter most — and we're going to walk you through them.";

  const timingNotes = {
    hours: "You're acting fast — that's your biggest advantage right now. Every hour matters, and your Lockdown Protocol is built for exactly this window.",
    today: "You're still within a critical window. The steps you take today can significantly impact your outcome.",
    days: "You still have time, but some deadlines may be approaching. Your Protocol will flag the urgent ones.",
    week_plus: "Some windows may have narrowed, but there are still important steps you can take. Your Protocol will prioritize what still applies.",
  };

  const paymentNotes = {
    credit: "Credit cards offer strong consumer protection — you have 60 days to dispute. But how you present your case matters. Your Protocol includes the exact language to use.",
    debit: "Debit card timing is critical. Report within 2 days and your liability caps at $50. After 60 days, you could owe everything. Your Protocol has the scripts for this call.",
    zelle_venmo: "Zelle and peer-to-peer apps are harder to recover — but not impossible. How you present your case to your bank is everything. Your Protocol covers the exact words to use.",
    wire: "Wire transfers are the most time-sensitive. Recall requests need to happen immediately. Your Protocol will walk you through the emergency steps.",
    gift_cards: "Contact the retailers directly with your card numbers. Some can freeze remaining funds — but only if you act quickly. Your Protocol lists exactly who to call.",
    crypto: "Cryptocurrency is difficult to recover, but report to the FBI IC3 immediately and save all wallet addresses. Do NOT pay anyone who promises to recover it — that's a recovery scam.",
    none: "Good news — no money has left your accounts yet. Your Protocol will make sure it stays that way.",
    multiple: "Multiple payment methods means multiple recovery processes — each with different rules and deadlines. Your Protocol will prioritize them in the right order.",
  };

  const bankNotes = {
    yes: "You've already called your bank — good. But what you said matters. If you didn't use specific fraud classification language, your Protocol will show you how to call back and re-present your case the right way.",
    no: "You haven't called your bank yet — and that's actually okay. What you say on that call is critical. Your Protocol will prepare you with the exact words to use before you pick up the phone.",
    didnt_know: "Most people don't realize how important this call is — or how much the words matter. Your Protocol will make sure you're fully prepared before you dial.",
  };

  const lockdownNotes = {
    yes: "You've started locking things down — great. Your Protocol will help you verify you haven't missed anything. Most people miss 2-3 critical steps, like email forwarding rules and trusted devices.",
    partial: "You've done some of it — your Protocol will walk you through the rest so nothing gets missed.",
    no: "That's exactly why we built the Protocol. It walks you through everything — step by step, in the right order — starting the moment you open it.",
    unsure: "That's completely okay. Your Protocol tells you what to do, in what order, one step at a time. No guessing.",
  };

  return {
    opener: emotionalOpeners[feeling] || defaultOpener,
    timingNote: timing ? (timingNotes[timing] || null) : null,
    paymentNote: payment ? (paymentNotes[payment] || null) : null,
    bankNote: bank_contact ? (bankNotes[bank_contact] || null) : null,
    lockdownNote: locked_down ? (lockdownNotes[locked_down] || null) : null,
  };
}

function ProgressBar({ current, total }) {
  const pct = ((current) / total) * 100;
  return (
    <div style={{ width: "100%", marginBottom: 28 }}>
      <div style={{ width: "100%", height: 4, background: "#E8E8E8", borderRadius: 2, overflow: "hidden" }}>
        <div style={{
          width: `${pct}%`, height: "100%",
          background: `linear-gradient(90deg, ${BLUE}, ${GOLD})`,
          borderRadius: 2, transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        }} />
      </div>
    </div>
  );
}

function QuestionCard({ question, onSelect, selectedValue }) {
  return (
    <div style={{ animation: "fadeSlideIn 0.4s ease-out" }}>
      <h2 style={{
        fontFamily: "'Libre Caslon Text', 'Georgia', serif", fontSize: 26, fontWeight: 700,
        color: NAVY, margin: "0 0 8px 0", lineHeight: 1.3,
      }}>
        {question.question}
      </h2>
      <p style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: MED_GRAY,
        margin: "0 0 24px 0", lineHeight: 1.5,
      }}>
        {question.subtext}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {question.options.map((opt) => {
          const isSelected = selectedValue === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onSelect(opt.value)}
              style={{
                display: "block", width: "100%", textAlign: "left",
                padding: "15px 18px",
                border: `2px solid ${isSelected ? GOLD : "#E4E4E4"}`,
                borderLeftWidth: isSelected ? "4px" : "2px",
                borderLeftColor: isSelected ? GOLD : "#E4E4E4",
                borderRadius: 10, cursor: "pointer",
                background: isSelected ? `${GOLD}0D` : "white",
                fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: DARK_GRAY,
                transition: "all 0.25s ease",
                outline: "none",
                boxShadow: isSelected ? `0 2px 8px rgba(212,168,67,0.15)` : "0 1px 3px rgba(0,0,0,0.04)",
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = GOLD;
                  e.currentTarget.style.borderLeftWidth = "4px";
                  e.currentTarget.style.borderLeftColor = GOLD;
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = "#E4E4E4";
                  e.currentTarget.style.borderLeftWidth = "2px";
                  e.currentTarget.style.borderLeftColor = "#E4E4E4";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
                }
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ResultsPage({ answers, onEmailSubmit }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const response = getPersonalizedResponse(answers);
  const isThirdParty = answers.who === "someone_else";

  const handleSubmit = () => {
    if (email && email.includes("@")) {
      setSubmitted(true);
      if (onEmailSubmit) onEmailSubmit(email, answers);
    }
  };

  if (submitted) {
    return (
      <div style={{ animation: "fadeSlideIn 0.4s ease-out", textAlign: "center", padding: "40px 0" }}>
        <div style={{
          width: 70, height: 70, borderRadius: "50%", background: GREEN,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 24px", fontSize: 32, color: "white",
        }}>✓</div>
        <h2 style={{
          fontFamily: "'Libre Caslon Text', 'Georgia', serif", fontSize: 26, color: NAVY, margin: "0 0 12px 0",
        }}>Check Your Inbox</h2>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: MED_GRAY,
          maxWidth: 420, margin: "0 auto 20px", lineHeight: 1.6,
        }}>
          Your <strong>Scam Emergency Lockdown Protocol</strong> is on its way to <strong>{email}</strong>.
        </p>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#999",
        }}>
          Don't see it? Check your spam folder.
        </p>
        <div style={{
          marginTop: 32, padding: "22px 24px", background: WARNING_BG,
          borderRadius: 12, borderLeft: `4px solid ${GOLD}`, textAlign: "left",
        }}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: DARK_GRAY, margin: "0 0 6px 0", fontWeight: 700,
          }}>⚡ While you wait — do these 3 things:</p>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: MED_GRAY, margin: 0, lineHeight: 1.7,
          }}>
            1. Do NOT call your bank yet (your Protocol will prepare you first)<br />
            2. Do NOT respond to the scammer<br />
            3. Do NOT delete any messages, emails, or transaction records
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ animation: "fadeSlideIn 0.4s ease-out" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{
          display: "inline-block", padding: "5px 14px", background: `${GREEN}15`,
          border: `1px solid ${GREEN}30`, borderRadius: 20, color: GREEN,
          fontSize: 12, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
          letterSpacing: "0.5px", marginBottom: 14,
        }}>ASSESSMENT COMPLETE</div>
        <h2 style={{
          fontFamily: "'Libre Caslon Text', 'Georgia', serif", fontSize: 26, color: NAVY,
          margin: "0 0 6px 0",
        }}>Here's What We Found</h2>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: MED_GRAY, margin: 0,
        }}>Based on your answers, here's a preview of your personalized plan.</p>
      </div>

      <div style={{
        padding: "22px 24px", background: WARNING_BG, borderRadius: 12,
        borderLeft: `4px solid ${GOLD}`, marginBottom: 16,
      }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: DARK_GRAY,
          margin: 0, lineHeight: 1.7, fontWeight: 500,
        }}>{response.opener}</p>
      </div>

      {response.timingNote && (
        <div style={{ padding: "18px 22px", background: LIGHT_GRAY, borderRadius: 10, marginBottom: 12 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: DARK_GRAY, margin: 0, lineHeight: 1.7 }}>
            <strong style={{ color: NAVY }}>⏱ Timing:</strong> {response.timingNote}
          </p>
        </div>
      )}
      {response.paymentNote && (
        <div style={{ padding: "18px 22px", background: LIGHT_GRAY, borderRadius: 10, marginBottom: 12 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: DARK_GRAY, margin: 0, lineHeight: 1.7 }}>
            <strong style={{ color: NAVY }}>💳 Payment:</strong> {response.paymentNote}
          </p>
        </div>
      )}
      {response.bankNote && (
        <div style={{ padding: "18px 22px", background: LIGHT_GRAY, borderRadius: 10, marginBottom: 12 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: DARK_GRAY, margin: 0, lineHeight: 1.7 }}>
            <strong style={{ color: NAVY }}>🏦 Your bank:</strong> {response.bankNote}
          </p>
        </div>
      )}
      {response.lockdownNote && (
        <div style={{ padding: "18px 22px", background: LIGHT_GRAY, borderRadius: 10, marginBottom: 12 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: DARK_GRAY, margin: 0, lineHeight: 1.7 }}>
            <strong style={{ color: NAVY }}>🔒 Security:</strong> {response.lockdownNote}
          </p>
        </div>
      )}

      {/* Bridge — transition from info to action */}
      <div style={{
        margin: "24px 0 8px", padding: "22px 24px",
        background: `linear-gradient(135deg, ${RED}10, ${WARNING_BG})`,
        borderRadius: 12, borderLeft: `4px solid ${RED}`,
      }}>
        <p style={{
          fontFamily: "'Libre Caslon Text', 'Georgia', serif", fontSize: 18, fontWeight: 700,
          color: NAVY, margin: "0 0 10px 0",
        }}>This is your situation. Now you need the playbook.</p>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: DARK_GRAY,
          margin: "0 0 10px 0", lineHeight: 1.7,
        }}>
          What you just read is a snapshot — enough to understand where you stand, but not enough to protect yourself. You need the exact steps, in the exact order, right now.
        </p>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: DARK_GRAY,
          margin: 0, lineHeight: 1.7, fontWeight: 600,
        }}>
          Don't call your bank yet. Don't take any action yet. Get the Protocol first — because what you do in the next few hours matters, and the order you do it in matters even more.
        </p>
      </div>

      {/* Protocol tease - create the gap */}
      <div style={{
        margin: "24px 0", padding: "20px 22px",
        background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY_LIGHT} 100%)`,
        borderRadius: 12, textAlign: "center",
      }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: GOLD,
          margin: "0 0 6px 0", fontWeight: 600,
        }}>Your full Lockdown Protocol includes:</p>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#BBBBBB",
          margin: 0, lineHeight: 1.9, textAlign: "left", maxWidth: 380, marginLeft: "auto", marginRight: "auto",
        }}>
          ✓ Step-by-step lockdown checklist (15+ steps most people miss)<br />
          ✓ The exact order to secure every account<br />
          ✓ What to do about email forwarding rules & trusted devices<br />
          ✓ How to prepare before you call your bank<br />
          ✓ What NOT to say on your first bank call
        </p>
      </div>

      {/* Email capture */}
      <div style={{
        padding: "28px 24px", borderRadius: 14, textAlign: "center",
        background: `linear-gradient(135deg, ${NAVY} 0%, #162240 100%)`,
        boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
      }}>
        <h3 style={{
          fontFamily: "'Libre Caslon Text', 'Georgia', serif", fontSize: 20, color: "white",
          margin: "0 0 6px 0",
        }}>Get Your Personalized Lockdown Protocol</h3>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#AAAAAA",
          margin: "0 0 18px 0", lineHeight: 1.5,
        }}>
          {isThirdParty
            ? "We'll send it to you so you can share it with them. Free. Instant."
            : "Free. Instant delivery. Built for your specific situation."
          }
        </p>
        <div style={{ display: "flex", gap: 8, maxWidth: 400, margin: "0 auto" }}>
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            style={{
              flex: 1, padding: "13px 16px", borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.08)", color: "white", fontSize: 14,
              fontFamily: "'DM Sans', sans-serif", outline: "none",
              transition: "border-color 0.3s ease",
            }}
            onFocus={(e) => { e.target.style.borderColor = `${GOLD}60`; }}
            onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.15)"; }}
          />
          <button
            onClick={handleSubmit}
            className="cta-pulse"
            style={{
              padding: "13px 22px", borderRadius: 8, border: "none",
              background: GOLD, color: NAVY, fontSize: 14, fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
              transition: "all 0.3s ease", whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = GOLD_LIGHT;
              e.target.style.transform = "translateY(-1px) scale(1.03)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = GOLD;
              e.target.style.transform = "translateY(0) scale(1)";
            }}
          >
            Send It →
          </button>
        </div>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.35)",
          margin: "10px 0 0 0",
        }}>
          No spam. Unsubscribe anytime. We never share your email.
        </p>
      </div>
    </div>
  );
}

export default function ScamEmergencyAssessment() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const containerRef = useRef(null);

  const handleSelect = (value) => {
    const qId = questions[currentQ].id;
    setAnswers((prev) => ({ ...prev, [qId]: value }));
    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ(currentQ + 1);
      } else {
        setIsComplete(true);
      }
    }, 300);
  };

  const handleEmailSubmit = async (email, allAnswers) => {
    try {
      await fetch("https://services.leadconnectorhq.com/hooks/OI1J52iL4W67IzzVEN0Y/webhook-trigger/cc34b41a-d268-4832-88b2-fd03ab4b03e3", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: "no-cors",
        body: JSON.stringify({
          email: email,
          who_affected: allAnswers.who || "",
          scam_type: allAnswers.situation || "",
          feeling: allAnswers.feeling || "",
          timing: allAnswers.timing || "",
          locked_down: allAnswers.locked_down || "",
          bank_contacted: allAnswers.bank_contact || "",
          payment_method: allAnswers.payment || "",
          amount: allAnswers.amount || "",
          source: "scam-emergency-assessment",
        }),
      });
    } catch (err) {
      console.error("Webhook error:", err);
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentQ, isComplete]);

  return (
    <div style={{
      minHeight: "100vh",
      background: `radial-gradient(ellipse at center, ${NAVY_LIGHT} 0%, ${NAVY_DEEP} 70%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Libre+Caslon+Text:wght@400;700&display=swap');
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shieldGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(212,168,67,0.25), 0 0 40px rgba(212,168,67,0.1); }
          50% { box-shadow: 0 0 30px rgba(212,168,67,0.4), 0 0 60px rgba(212,168,67,0.15); }
        }
        @keyframes ctaPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(212,168,67,0.35); }
          50% { box-shadow: 0 0 0 8px rgba(212,168,67,0); }
        }
        .cta-pulse { animation: ctaPulse 2s ease-in-out infinite; }
        .cta-pulse:hover { animation: none; }
        input::placeholder { color: rgba(255,255,255,0.4); }
      `}</style>

      <div
        ref={containerRef}
        style={{
          width: "100%", maxWidth: 560,
          background: "white", borderRadius: 20,
          boxShadow: "0 30px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.05)",
          overflow: "hidden",
        }}
      >
        {/* Thin top accent bar */}
        <div style={{
          height: 3,
          background: `linear-gradient(90deg, ${BLUE}, ${GOLD}, ${BLUE})`,
        }} />

        {/* HERO — Full on Q1 */}
        {currentQ === 0 && !isComplete && (
          <div style={{
            background: `radial-gradient(ellipse at 50% 30%, ${NAVY_LIGHT} 0%, ${NAVY} 60%, ${NAVY_DEEP} 100%)`,
            padding: "36px 28px 0", textAlign: "center",
            position: "relative", overflow: "hidden",
          }}>
            {/* Subtle mesh overlay */}
            <div style={{
              position: "absolute", inset: 0, opacity: 0.035,
              backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.8) 1px, transparent 1px),
                radial-gradient(circle at 80% 20%, rgba(255,255,255,0.6) 1px, transparent 1px),
                radial-gradient(circle at 40% 80%, rgba(255,255,255,0.5) 1px, transparent 1px)`,
              backgroundSize: "60px 60px, 80px 80px, 100px 100px",
              pointerEvents: "none",
            }} />

            {/* Logo with glow */}
            <div style={{
              width: 110, height: 110, margin: "0 auto 22px",
              borderRadius: "50%",
              animation: "shieldGlow 3.5s ease-in-out infinite",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "default",
              transition: "transform 0.3s ease",
              position: "relative",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.08)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              <img
                src="/logo.png"  /* Place your logo as public/logo.png */
                alt="The Scam Hotline"
                style={{
                  width: 110, height: 110, objectFit: "contain",
                  filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.3))",
                }}
              />
            </div>

            <h1 style={{
              fontFamily: "'Libre Caslon Text', 'Georgia', serif", fontSize: 30, fontWeight: 700,
              color: "white", margin: "0 0 12px 0", lineHeight: 1.25,
              textShadow: "0 0 24px rgba(255,255,255,0.08)",
              position: "relative",
            }}>
              If something feels wrong,<br />you're in the right place.
            </h1>

            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#B0B8C8",
              margin: "0 auto 24px", lineHeight: 1.65, maxWidth: 400,
              position: "relative",
            }}>
              Tell us a little about what happened. We'll send you
              the <strong style={{ color: GOLD }}>Scam Emergency Lockdown Protocol</strong> —
              a step-by-step plan personalized to your situation.
            </p>

            {/* Trust pills */}
            <div style={{
              display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap",
              marginBottom: 28, position: "relative",
            }}>
              {["Free & confidential", "Instant delivery", "No account needed"].map((t) => (
                <span key={t} style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: GOLD,
                  fontWeight: 500, letterSpacing: "0.2px",
                  padding: "6px 14px", borderRadius: 20,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  transition: "all 0.3s ease",
                  cursor: "default",
                }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = `${GOLD}40`;
                    e.target.style.background = "rgba(255,255,255,0.07)";
                    e.target.style.boxShadow = `0 0 12px ${GOLD}15`;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = "rgba(255,255,255,0.1)";
                    e.target.style.background = "rgba(255,255,255,0.04)";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  ✓ {t}
                </span>
              ))}
            </div>

            {/* Wave divider */}
            <svg viewBox="0 0 560 32" preserveAspectRatio="none" style={{
              display: "block", width: "100%", height: 32, marginBottom: -1,
            }}>
              <path d="M0,16 C140,32 420,0 560,16 L560,32 L0,32 Z" fill="white" />
            </svg>
          </div>
        )}

        {/* Collapsed hero for Q2+ */}
        {currentQ > 0 && !isComplete && (
          <div style={{
            background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY_LIGHT} 100%)`,
            padding: "14px 24px", textAlign: "center",
          }}>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: GOLD,
              margin: 0, fontWeight: 500,
            }}>
              {protocolTeases[currentQ] || "Building your personalized Lockdown Protocol..."}
            </p>
          </div>
        )}

        {/* Question Content */}
        <div style={{ padding: "28px 28px 32px" }}>
          {currentQ >= 0 && !isComplete && (
            <>
              <ProgressBar current={currentQ} total={questions.length} />
              <QuestionCard
                key={currentQ}
                question={questions[currentQ]}
                selectedValue={answers[questions[currentQ].id]}
                onSelect={handleSelect}
              />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18 }}>
                {currentQ > 0 ? (
                  <button
                    onClick={() => setCurrentQ(currentQ - 1)}
                    style={{
                      padding: "8px 14px", border: "none",
                      background: "transparent", color: MED_GRAY, fontSize: 13,
                      fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) => { e.target.style.color = DARK_GRAY; }}
                    onMouseLeave={(e) => { e.target.style.color = MED_GRAY; }}
                  >
                    ← Back
                  </button>
                ) : <div />}
                <button
                  onClick={() => {
                    if (currentQ < questions.length - 1) setCurrentQ(currentQ + 1);
                    else setIsComplete(true);
                  }}
                  style={{
                    padding: "8px 14px", border: "none",
                    background: "transparent", color: "#CCC", fontSize: 12,
                    fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) => { e.target.style.color = MED_GRAY; }}
                  onMouseLeave={(e) => { e.target.style.color = "#CCC"; }}
                >
                  Skip for now →
                </button>
              </div>
            </>
          )}

          {isComplete && (
            <ResultsPage answers={answers} onEmailSubmit={handleEmailSubmit} />
          )}
        </div>

        {/* Footer */}
        <div style={{
          background: LIGHT_GRAY, padding: "12px 24px", textAlign: "center",
          borderTop: "1px solid #EBEBEB",
        }}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: "#AAA",
            margin: 0, letterSpacing: "0.3px",
          }}>
            TheScamHotline.org &nbsp;•&nbsp; Learn &nbsp;•&nbsp; Protect &nbsp;•&nbsp; Recover — Together
          </p>
        </div>
      </div>
    </div>
  );
}
