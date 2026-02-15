"use client";

import { useState, useRef } from "react";

const STOIC_THEMES = [
  "the impermanence of all things and finding peace in transience",
  "the discipline of desire and wanting only what is within your control",
  "the morning practice of preparing the mind for difficulty",
  "the evening reflection on what was done well and what can improve",
  "death as a companion that gives urgency and meaning to life",
  "the difference between what happens to you and your judgment of it",
  "finding freedom through the acceptance of fate",
  "the duty to serve others as a rational, social being",
  "anger as a poison to the one who holds it",
  "the vastness of time and the smallness of human affairs",
  "how obstacles become the path forward",
  "the practice of negative visualization to cultivate gratitude",
  "silence and economy of words as virtues",
  "the cosmopolitan ideal — belonging to the whole world",
  "distinguishing between what is up to us and what is not",
  "the inner citadel that no external force can breach",
  "living according to nature and reason",
  "the briefness of life and the waste of procrastination",
  "wealth and poverty as indifferent things",
  "the philosopher's response to insult and injury",
  "how character is revealed in small daily choices",
  "the river of time carrying all things away",
  "finding joy in simplicity and modest living",
  "the practice of viewing events from the cosmic perspective",
  "how suffering is created by resistance to what is",
  "the fellowship of all rational beings",
  "preparing for loss so that it does not destroy you",
  "the quiet power of self-mastery over mastery of others",
  "how virtue alone is sufficient for a good life",
  "the present moment as the only thing we truly possess",
  "courage not as the absence of fear but as acting rightly despite it",
];

const PHILOSOPHERS = [
  "Marcus Aurelius",
  "Epictetus",
  "Seneca",
  "Cleanthes",
  "Chrysippus",
  "Musonius Rufus",
  "Hierocles",
  "Cato",
];

function getDayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getFormattedDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function romanNumeral() {
  const day = getDayOfYear();
  const vals = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let result = "";
  let num = day;
  for (const [value, numeral] of vals) {
    while (num >= value) {
      result += numeral;
      num -= value;
    }
  }
  return result;
}

export default function Home() {
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const quoteRef = useRef(null);

  const theme = STOIC_THEMES[getDayOfYear() % STOIC_THEMES.length];
  const philosopher = PHILOSOPHERS[getDayOfYear() % PHILOSOPHERS.length];

  const generateQuote = async () => {
    setLoading(true);
    setError(null);
    setRevealed(false);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme, philosopher }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate reflection.");
      }

      const data = await response.json();
      setQuote(data.text);
      setTimeout(() => setRevealed(true), 300);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const splitQuote = (text) => {
    const lines = text.trim().split("\n").filter(Boolean);
    if (lines.length <= 1) return { reflection: text, practice: null };
    const practice = lines[lines.length - 1];
    const reflection = lines.slice(0, -1).join("\n");
    return { reflection, practice };
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a08",
        color: "#c8c0b0",
        fontFamily: "'EB Garamond', 'Georgia', serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle texture overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: `radial-gradient(ellipse at 30% 20%, rgba(180,160,120,0.03) 0%, transparent 60%),
                       radial-gradient(ellipse at 70% 80%, rgba(120,100,70,0.02) 0%, transparent 50%)`,
          pointerEvents: "none",
        }}
      />

      {/* Decorative border */}
      <div
        style={{
          position: "fixed",
          top: "1.5rem",
          left: "1.5rem",
          right: "1.5rem",
          bottom: "1.5rem",
          border: "1px solid rgba(180,160,120,0.08)",
          pointerEvents: "none",
        }}
      />

      {/* Top ornament */}
      <div
        style={{
          position: "absolute",
          top: "2.5rem",
          letterSpacing: "1.2em",
          fontSize: "0.6rem",
          color: "rgba(220,210,195,0.55)",
          fontFamily: "'Cormorant', serif",
          fontWeight: 300,
        }}
      >
        · · · ·
      </div>

      {/* Main content */}
      <div style={{ maxWidth: "640px", width: "100%", textAlign: "center", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div
          style={{
            marginBottom: "3rem",
            opacity: revealed && quote ? 0.5 : 1,
            transition: "opacity 1.5s ease",
          }}
        >
          <div
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.5em",
              textTransform: "uppercase",
              color: "rgba(220,210,195,0.7)",
              fontFamily: "'Cormorant', serif",
              fontWeight: 400,
              marginBottom: "1rem",
            }}
          >
            Day {romanNumeral()}
          </div>

          <h1
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              fontWeight: 400,
              color: "#ebe6dc",
              margin: 0,
              lineHeight: 1.2,
              fontFamily: "'Cormorant', serif",
              letterSpacing: "0.04em",
            }}
          >
            Stoic Reflections
          </h1>

          <div
            style={{
              fontSize: "0.75rem",
              color: "rgba(220,210,195,0.6)",
              marginTop: "0.75rem",
              letterSpacing: "0.15em",
              fontFamily: "'Cormorant', serif",
              fontWeight: 300,
            }}
          >
            {getFormattedDate()}
          </div>
        </div>

        {/* Pre-generate state */}
        {!quote && !loading && (
          <div style={{ animation: "fadeIn 1s ease" }}>
            <div
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "rgba(220,210,195,0.55)",
                marginBottom: "2rem",
                fontFamily: "'Cormorant', serif",
              }}
            >
              Today&apos;s meditation on
            </div>
            <div
              style={{
                fontSize: "clamp(1.1rem, 2.5vw, 1.35rem)",
                color: "rgba(235,230,220,0.65)",
                fontStyle: "italic",
                lineHeight: 1.7,
                marginBottom: "3rem",
                fontFamily: "'EB Garamond', serif",
              }}
            >
              {theme}
            </div>
            <div
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.25em",
                color: "rgba(220,210,195,0.55)",
                marginBottom: "1.5rem",
                fontFamily: "'Cormorant', serif",
                textTransform: "uppercase",
              }}
            >
              In the voice of {philosopher}
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div style={{ padding: "4rem 0", animation: "fadeIn 0.5s ease" }}>
            <div
              style={{
                width: "2px",
                height: "40px",
                background: "rgba(220,210,195,0.55)",
                margin: "0 auto 1.5rem",
                animation: "pulse 2s ease-in-out infinite",
              }}
            />
            <div
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "rgba(220,210,195,0.55)",
                fontFamily: "'Cormorant', serif",
              }}
            >
              Contemplating...
            </div>
          </div>
        )}

        {/* Generated quote */}
        {quote &&
          !loading &&
          (() => {
            const { reflection, practice } = splitQuote(quote);
            return (
              <div
                ref={quoteRef}
                style={{
                  opacity: revealed ? 1 : 0,
                  transform: revealed ? "translateY(0)" : "translateY(12px)",
                  transition: "all 1.5s cubic-bezier(0.25, 0.1, 0.25, 1)",
                }}
              >
                <div
                  style={{
                    fontSize: "1.2rem",
                    color: "rgba(180,160,120,0.15)",
                    marginBottom: "2rem",
                    fontFamily: "'Cormorant', serif",
                  }}
                >
                  ※
                </div>

                <blockquote
                  style={{
                    fontSize: "clamp(1.25rem, 3vw, 1.6rem)",
                    lineHeight: 1.85,
                    color: "#ebe6dc",
                    margin: 0,
                    padding: "0 1rem",
                    fontFamily: "'EB Garamond', serif",
                    fontWeight: 400,
                  }}
                >
                  {reflection}
                </blockquote>

                {practice && (
                  <div
                    style={{
                      marginTop: "2.5rem",
                      padding: "1.25rem 1.5rem",
                      borderLeft: "1px solid rgba(200,192,176,0.25)",
                      textAlign: "left",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.7rem",
                        letterSpacing: "0.3em",
                        textTransform: "uppercase",
                        color: "rgba(200,192,176,0.4)",
                        marginBottom: "0.6rem",
                        fontFamily: "'Cormorant', serif",
                      }}
                    >
                      Practice
                    </div>
                    <div
                      style={{
                        fontSize: "1.1rem",
                        color: "rgba(235,230,220,0.7)",
                        lineHeight: 1.65,
                        fontFamily: "'EB Garamond', serif",
                        fontStyle: "italic",
                      }}
                    >
                      {practice}
                    </div>
                  </div>
                )}

                {/* Source attribution */}
                <div
                  style={{
                    marginTop: "3rem",
                    paddingTop: "1.5rem",
                    borderTop: "1px solid rgba(200,192,176,0.1)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.7rem",
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      color: "rgba(200,192,176,0.4)",
                      marginBottom: "0.75rem",
                      fontFamily: "'Cormorant', serif",
                    }}
                  >
                    Source
                  </div>
                  <div
                    style={{
                      fontSize: "1.15rem",
                      color: "#ebe6dc",
                      fontFamily: "'Cormorant', serif",
                      fontWeight: 500,
                      letterSpacing: "0.05em",
                      marginBottom: "0.4rem",
                    }}
                  >
                    {philosopher}
                  </div>
                  <div
                    style={{
                      fontSize: "0.95rem",
                      color: "rgba(200,192,176,0.5)",
                      fontFamily: "'EB Garamond', serif",
                      fontStyle: "italic",
                    }}
                  >
                    {philosopher === "Marcus Aurelius" && "Meditations"}
                    {philosopher === "Epictetus" && "Discourses & Enchiridion"}
                    {philosopher === "Seneca" && "Letters to Lucilius & On the Shortness of Life"}
                    {philosopher === "Cleanthes" && "Hymn to Zeus"}
                    {philosopher === "Chrysippus" && "On the Passions & On Providence"}
                    {philosopher === "Musonius Rufus" && "Lectures & Fragments"}
                    {philosopher === "Hierocles" && "Elements of Ethics"}
                    {philosopher === "Cato" && "As recorded by Plutarch & Cicero"}
                  </div>
                 
                </div>
              </div>
            );
          })()}

        {/* Error */}
        {error && (
          <div
            style={{
              color: "rgba(200,140,120,0.6)",
              fontSize: "0.85rem",
              marginBottom: "2rem",
              fontFamily: "'EB Garamond', serif",
              fontStyle: "italic",
            }}
          >
            {error}
          </div>
        )}

        {/* Button */}
        <div style={{ marginTop: quote ? "3.5rem" : "1rem" }}>
          <button
            onClick={generateQuote}
            disabled={loading}
            style={{
              background: "transparent",
              border: "1px solid rgba(200,192,176,0.25)",
              color: "rgba(235,230,220,0.6)",
              padding: "0.85rem 2.5rem",
              fontSize: "0.7rem",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              cursor: loading ? "wait" : "pointer",
              fontFamily: "'Cormorant', serif",
              fontWeight: 500,
              transition: "all 0.4s ease",
              opacity: loading ? 0.3 : 1,
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.borderColor = "rgba(200,192,176,0.45)";
                e.target.style.color = "rgba(235,230,220,0.9)";
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = "rgba(200,192,176,0.25)";
              e.target.style.color = "rgba(235,230,220,0.6)";
            }}
          >
            {quote ? "Generate Another" : "Receive Today's Reflection"}
          </button>
        </div>
      </div>

      {/* Bottom */}
      <div
        style={{
          position: "absolute",
          bottom: "2.5rem",
          fontSize: "0.55rem",
          letterSpacing: "0.2em",
          color: "rgba(180,160,120,0.12)",
          fontFamily: "'Cormorant', serif",
          textTransform: "uppercase",
        }}
      >
        Memento Mori
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.5; }
        }
        * { box-sizing: border-box; }
        body { margin: 0; }
        button:focus { outline: 1px solid rgba(220,210,195,0.55); outline-offset: 3px; }
        ::selection { background: rgba(220,210,195,0.55); }
      `}</style>
    </div>
  );
}
