import { useState, useRef } from "react";
import { api } from "../utils/api";

const LEVEL_BADGES = {
  Beginner: {
    bg: "rgba(59,130,246,0.1)",
    border: "rgba(59,130,246,0.3)",
    color: "#3b82f6",
  },
  Intermediate: {
    bg: "rgba(124,58,237,0.1)",
    border: "rgba(124,58,237,0.3)",
    color: "#8b5cf6",
  },
  Advanced: {
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.3)",
    color: "#10b981",
  },
};

export default function ResumeUploadCard({ userSkills, onSkillsAdded }) {
  const [file, setFile] = useState(null);
  const [pasteText, setPasteText] = useState("");
  const [activeTab, setActiveTab] = useState("file"); // 'file' | 'paste'

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [targetLevel, setTargetLevel] = useState("ai"); // 'ai' | 'Beginner' | 'Intermediate' | 'Advanced'
  const [importSuccess, setImportSuccess] = useState("");

  const fileInputRef = useRef(null);

  // Set of existing skill names normalized
  const existingSet = new Set(
    userSkills.map((s) => s.name.toLowerCase().trim())
  );

  function handleFileChange(e) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    validateAndSetFile(selected);
  }

  function validateAndSetFile(f) {
    setError("");
    setResult(null);
    setImportSuccess("");
    const validExtensions = ["pdf", "docx", "doc", "txt", "md"];
    const ext = f.name.toLowerCase().split(".").pop();
    if (!validExtensions.includes(ext)) {
      setError("Please upload a PDF, DOCX, or TXT file.");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit.");
      return;
    }
    setFile(f);
  }

  function handleDrop(e) {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) validateAndSetFile(dropped);
  }

  async function handleAnalyze() {
    setError("");
    setResult(null);
    setImportSuccess("");
    setLoading(true);

    try {
      let data;
      if (activeTab === "file") {
        if (!file) {
          setError("Please select a resume file first.");
          setLoading(false);
          return;
        }
        const formData = new FormData();
        formData.append("resume", file);
        data = await api.skills.uploadResume(formData);
      } else {
        if (!pasteText.trim() || pasteText.trim().length < 30) {
          setError(
            "Please paste a comprehensive resume snippet (at least 30 characters)."
          );
          setLoading(false);
          return;
        }
        data = await api.skills.parseResumeText(pasteText.trim());
      }

      setResult(data);

      // Auto-select all new skills that are not already in profile
      const newSkills = (data.detectedSkills || [])
        .filter((s) => !existingSet.has(s.name.toLowerCase().trim()))
        .map((s) => s.name);
      setSelectedSkills(newSkills);
    } catch (err) {
      console.error("Resume analysis failed:", err);
      setError(err.message || "Failed to analyze resume. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function toggleSkillSelection(skillName) {
    setSelectedSkills((prev) =>
      prev.includes(skillName)
        ? prev.filter((s) => s !== skillName)
        : [...prev, skillName]
    );
  }

  function handleSelectAllNew() {
    if (!result?.detectedSkills) return;
    const newOnes = result.detectedSkills
      .filter((s) => !existingSet.has(s.name.toLowerCase().trim()))
      .map((s) => s.name);
    setSelectedSkills(newOnes);
  }

  function handleDeselectAll() {
    setSelectedSkills([]);
  }

  async function handleImportSelected() {
    if (selectedSkills.length === 0) return;
    setError("");

    try {
      const payload = selectedSkills.map((name) => {
        const detected = result.detectedSkills.find((d) => d.name === name);
        const finalLevel =
          targetLevel === "ai"
            ? detected?.level || "Intermediate"
            : targetLevel;
        return { name, level: finalLevel };
      });

      await onSkillsAdded(payload);
      setImportSuccess(
        `🎉 Successfully imported ${payload.length} skill${
          payload.length > 1 ? "s" : ""
        } into your profile!`
      );
      // Deselect all imported ones
      setSelectedSkills([]);
    } catch (err) {
      console.error("Failed to import skills:", err);
      setError("Failed to add skills to profile: " + err.message);
    }
  }

  return (
    <div
      className="p-8 space-y-6 rounded-3xl transition-all shadow-sm"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--bd-default)",
      }}
    >
      {/* ── Top Header ───────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, rgba(37,99,235,0.9), rgba(124,58,237,0.9))",
            }}
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3
                className="text-xl font-bold"
                style={{ color: "var(--tx-primary)" }}
              >
                Upload & Scan Resume
              </h3>
              <span
                className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full"
                style={{
                  background: "rgba(124,58,237,0.12)",
                  color: "#8b5cf6",
                  border: "1px solid rgba(124,58,237,0.25)",
                }}
              >
                Groq AI Powered
              </span>
            </div>
            <p className="text-xs mt-0.5" style={{ color: "var(--tx-secondary)" }}>
              Upload your resume (PDF, DOCX, TXT) to automatically detect and import your skills.
            </p>
          </div>
        </div>
      </div>

      {/* ── Tabs (File Upload / Paste Text) ───────────────────── */}
      <div className="flex gap-2 border-b pb-3" style={{ borderColor: "var(--bd-default)" }}>
        <button
          type="button"
          onClick={() => setActiveTab("file")}
          className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${
            activeTab === "file"
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
              : "btn-ghost"
          }`}
        >
          📄 Upload Document
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("paste")}
          className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${
            activeTab === "paste"
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
              : "btn-ghost"
          }`}
        >
          ✏️ Paste Resume Text
        </button>
      </div>

      {/* ── Tab Content: Upload Document ──────────────────────── */}
      {activeTab === "file" ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer border-2 border-dashed rounded-2xl p-8 text-center transition-all hover:border-blue-500 group"
          style={{
            borderColor: file ? "#3b82f6" : "var(--bd-default)",
            background: file ? "rgba(59,130,246,0.04)" : "var(--bg-surface)",
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc,.txt,.md"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center gap-3">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105"
              style={{
                background: file
                  ? "rgba(59,130,246,0.15)"
                  : "var(--bg-card)",
                border: "1px solid var(--bd-default)",
              }}
            >
              <svg
                className="w-7 h-7"
                style={{ color: file ? "#3b82f6" : "var(--tx-muted)" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>

            {file ? (
              <div>
                <p className="text-sm font-bold text-blue-500">{file.name}</p>
                <p className="text-xs" style={{ color: "var(--tx-muted)" }}>
                  {(file.size / 1024).toFixed(1)} KB • Click or drop another file to replace
                </p>
              </div>
            ) : (
              <div>
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--tx-primary)" }}
                >
                  Drag and drop your resume here, or{" "}
                  <span className="text-blue-500 font-bold hover:underline">
                    browse
                  </span>
                </p>
                <p
                  className="text-xs mt-1"
                  style={{ color: "var(--tx-secondary)" }}
                >
                  Supports PDF (.pdf), Word (.docx), or Text (.txt) up to 10MB
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ── Tab Content: Paste Resume Text ──────────────────── */
        <div className="space-y-2">
          <textarea
            rows={6}
            value={pasteText}
            onChange={(e) => {
              setPasteText(e.target.value);
              setError("");
            }}
            placeholder="Paste your resume contents or experience details here..."
            className="w-full rounded-2xl p-4 text-sm outline-none transition-all resize-none shadow-inner"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--bd-default)",
              color: "var(--tx-primary)",
            }}
          />
          <p className="text-[11px] text-right" style={{ color: "var(--tx-muted)" }}>
            {pasteText.length} characters
          </p>
        </div>
      )}

      {/* ── Error Banner ─────────────────────────────────────── */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center gap-2">
          <svg
            className="w-4 h-4 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="space-y-0.5">
            <span className="font-semibold">{error}</span>
          </div>
        </div>
      )}

      {/* ── Success Banner ───────────────────────────────────── */}
      {importSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <svg
              className="w-4 h-4 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>{importSuccess}</span>
          </div>
          <button
            type="button"
            onClick={() => setImportSuccess("")}
            className="text-emerald-500 hover:text-emerald-400 text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ── Analyze Action Button ────────────────────────────── */}
      <div className="flex justify-end">
        <button
          type="button"
          disabled={loading || (activeTab === "file" ? !file : !pasteText.trim())}
          onClick={handleAnalyze}
          className="btn-primary rounded-xl px-6 py-3 text-sm flex items-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              <span>Analyzing with Groq AI…</span>
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span>Scan Resume with Groq AI</span>
            </>
          )}
        </button>
      </div>

      {/* ── Analysis Results & Skill Picker ──────────────────── */}
      {result && (
        <div
          className="mt-6 pt-6 border-t space-y-6 animate-in"
          style={{ borderColor: "var(--bd-default)" }}
        >
          {/* AI Summary Card */}
          {result.summary && (
            <div
              className="p-4 rounded-2xl flex items-start gap-3"
              style={{
                background: "rgba(124,58,237,0.06)",
                border: "1px solid rgba(124,58,237,0.18)",
              }}
            >
              <span className="text-xl">💡</span>
              <div className="space-y-1">
                <div className="text-xs font-bold text-violet-400 uppercase tracking-wider">
                  AI Profile Assessment
                </div>
                <p
                  className="text-xs leading-relaxed font-medium"
                  style={{ color: "var(--tx-primary)" }}
                >
                  {result.summary}
                </p>
              </div>
            </div>
          )}

          {/* Action header with selection tools */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4
                className="text-sm font-bold flex items-center gap-2"
                style={{ color: "var(--tx-primary)" }}
              >
                <span>Detected Skills</span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-extrabold"
                  style={{
                    background: "rgba(59,130,246,0.15)",
                    color: "#3b82f6",
                  }}
                >
                  {result.detectedSkills?.length || 0} Found
                </span>
              </h4>
              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--tx-secondary)" }}
              >
                Click skills to select/deselect them for addition to your profile.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSelectAllNew}
                className="text-xs px-3 py-1.5 rounded-xl border transition-all hover:bg-blue-500/10 hover:text-blue-500"
                style={{
                  borderColor: "var(--bd-default)",
                  color: "var(--tx-secondary)",
                }}
              >
                Select All New
              </button>
              <button
                type="button"
                onClick={handleDeselectAll}
                className="text-xs px-3 py-1.5 rounded-xl border transition-all hover:bg-rose-500/10 hover:text-rose-500"
                style={{
                  borderColor: "var(--bd-default)",
                  color: "var(--tx-secondary)",
                }}
              >
                Deselect All
              </button>
            </div>
          </div>

          {/* Skills Grid */}
          <div className="flex flex-wrap gap-2.5">
            {result.detectedSkills && result.detectedSkills.length > 0 ? (
              result.detectedSkills.map((skill) => {
                const isExisting = existingSet.has(
                  skill.name.toLowerCase().trim()
                );
                const isSelected = selectedSkills.includes(skill.name);
                const badge =
                  LEVEL_BADGES[skill.level] || LEVEL_BADGES.Intermediate;

                return (
                  <button
                    key={skill.name}
                    type="button"
                    disabled={isExisting}
                    onClick={() => toggleSkillSelection(skill.name)}
                    className={`group inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-semibold border transition-all duration-200 ${
                      isExisting
                        ? "opacity-45 cursor-not-allowed"
                        : isSelected
                        ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/25 scale-[1.02]"
                        : "hover:border-blue-400"
                    }`}
                    style={
                      !isSelected
                        ? {
                            background: "var(--bg-surface)",
                            borderColor: "var(--bd-default)",
                            color: "var(--tx-primary)",
                          }
                        : {}
                    }
                  >
                    <span>{skill.name}</span>

                    {/* Level Pill */}
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={
                        isSelected
                          ? {
                              background: "rgba(255,255,255,0.25)",
                              color: "#fff",
                            }
                          : {
                              background: badge.bg,
                              color: badge.color,
                              border: `1px solid ${badge.border}`,
                            }
                      }
                    >
                      {skill.level}
                    </span>

                    {isExisting && (
                      <span className="text-[10px] text-emerald-500 font-bold ml-1">
                        ✓ Added
                      </span>
                    )}
                  </button>
                );
              })
            ) : (
              <div
                className="text-xs italic py-4"
                style={{ color: "var(--tx-muted)" }}
              >
                No matching skills found in this resume.
              </div>
            )}
          </div>

          {/* Import Controls & Final CTA */}
          {result.detectedSkills && result.detectedSkills.length > 0 && (
            <div
              className="p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--bd-default)",
              }}
            >
              <div className="flex items-center gap-3">
                <label
                  className="text-xs font-bold"
                  style={{ color: "var(--tx-secondary)" }}
                >
                  Proficiency to Assign:
                </label>
                <select
                  value={targetLevel}
                  onChange={(e) => setTargetLevel(e.target.value)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-xl outline-none"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--bd-default)",
                    color: "var(--tx-primary)",
                  }}
                >
                  <option value="ai">Auto (AI Detected Level)</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <button
                type="button"
                disabled={selectedSkills.length === 0}
                onClick={handleImportSelected}
                className="btn-primary rounded-xl px-6 py-2.5 text-xs font-bold shadow-md shadow-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Add {selectedSkills.length} Selected Skills to Profile →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
