// src/Pages/Products.tsx
import React, { useEffect, useRef, useState } from "react";

/**
 * API base:
 * - If you proxy /api to backend via Nginx in prod, set API = "" (same origin).
 * - For local dev with backend on 8000, use: "http://localhost:8000".
 */
const API = "http://localhost:8000";

type Question = {
  _id: string;
  domain?: string;
  questionNo?: number;
  text: string;
  type: "mcq" | "text" | "boolean";
  options?: string[] | string;
};

export default function Products() {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [uploading, setUploading] = useState(false);
  const [loadingDomains, setLoadingDomains] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  const [error, setError] = useState<string>("");
  const [domains, setDomains] = useState<string[]>([]);
  const [activeDomain, setActiveDomain] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // qid -> answer

  // ---------- Helpers ----------
  const parseOptions = (opts: Question["options"]): string[] => {
    if (!opts) return [];
    if (Array.isArray(opts)) return opts.filter(Boolean).map((s) => String(s).trim());
    return String(opts)
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean);
  };

  const setAnswer = (qid: string, value: string) =>
    setAnswers((prev) => ({ ...prev, [qid]: value }));

  const sortQuestions = (list: Question[]): Question[] => {
    return [...list].sort((a, b) => {
      const na = a.questionNo ?? (parseInt(String(a.text).replace(/[^0-9]/g, "")) || 0);
      const nb = b.questionNo ?? (parseInt(String(b.text).replace(/[^0-9]/g, "")) || 0);
      if (na !== nb) return na - nb;
      return String(a.text).localeCompare(String(b.text));
    });
  };

  // ---------- Data loaders ----------
  const loadDomains = async () => {
    setLoadingDomains(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/questions/domains`);
      if (!res.ok) throw new Error(`Domains request failed (${res.status})`);
      const list: string[] = await res.json();
      const final = list.length ? list : ["Domain1"];
      setDomains(final);
      setActiveDomain((prev) => (prev ? prev : final[0]));
    } catch (e: any) {
      const fallback = ["Domain1"];
      setDomains(fallback);
      setActiveDomain((prev) => (prev ? prev : fallback[0]));
      setError(e?.message || "Failed to load domains");
    } finally {
      setLoadingDomains(false);
    }
  };

  const loadQuestions = async (domain?: string) => {
    if (!domain) return;
    setLoadingQuestions(true);
    setError("");
    try {
      const q = `?domain=${encodeURIComponent(domain)}`;
      const res = await fetch(`${API}/api/questions${q}`);
      if (!res.ok) throw new Error(`Questions request failed (${res.status})`);
      const data = await res.json();
      const list: Question[] = Array.isArray(data) ? data : [];
      setQuestions(sortQuestions(list));
    } catch (e: any) {
      setError(e?.message || "Failed to load questions");
      setQuestions([]);
    } finally {
      setLoadingQuestions(false);
    }
  };

  useEffect(() => {
    loadDomains();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeDomain) loadQuestions(activeDomain);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDomain]);

  // ---------- Upload ----------
  const handlePick = () => fileRef.current?.click();

  const handleUpload: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", f);
      const res = await fetch(`${API}/api/questions/upload`, { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || data?.success === false) throw new Error(data?.error || "Upload failed");

      await loadDomains();
      if (activeDomain) await loadQuestions(activeDomain);
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // ---------- Submit ----------
  const submitAll = () => {
    const unanswered = questions.filter(
      (q) => (q.type === "mcq" || q.type === "boolean") && !answers[q._id]
    );
    if (unanswered.length) {
      alert("Please answer all MCQ/Boolean questions.");
      return;
    }
    console.log("Submitting ALL answers:", { domain: activeDomain, answers });
    alert("Submitted all answers. Check console for payload.");
  };

  // ---------- UI ----------
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h1 className="text-2xl font-semibold">Questions</h1>
        <div className="flex items-center gap-3">
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={handleUpload}
          />
          <button
            onClick={handlePick}
            className="px-4 py-2 rounded-xl border hover:shadow disabled:opacity-50"
            disabled={uploading}
          >
            {uploading ? "Uploading…" : "Add Excel"}
          </button>
        </div>
      </div>

      {/* Content area: left = vertical sheets, right = questions */}
      <div className="px-6 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
          {/* Left: vertical domain buttons */}
          <aside className="md:sticky md:top-20 h-fit">
            {loadingDomains ? (
              <div className="text-sm text-gray-500">Loading domains…</div>
            ) : (
              <div className="flex flex-col gap-2 w-full">
                {domains.map((d) => (
                  <button
                    key={d}
                    onClick={() => setActiveDomain(d)}
                    className={`px-3 py-2 rounded-lg border text-left ${
                      d === activeDomain ? "bg-gray-900 text-white" : "bg-white"
                    }`}
                  >
                    {d}
                  </button>
                ))}
                <button
                  onClick={() => loadDomains()}
                  className="px-3 py-2 rounded-lg border bg-white text-left"
                  title="Refresh domains"
                >
                  ↻ Refresh
                </button>
              </div>
            )}
          </aside>

          {/* Right: questions */}
          <section className="max-w-3xl">
            {error && (
              <div className="mb-4 rounded-lg border border-red-300 p-3 text-red-700 flex items-center justify-between">
                <span>{error}</span>
                <button
                  className="underline text-sm"
                  onClick={() => (activeDomain ? loadQuestions(activeDomain) : loadDomains())}
                >
                  Retry
                </button>
              </div>
            )}

            {loadingQuestions ? (
              <div className="text-sm text-gray-500">Loading questions…</div>
            ) : questions.length === 0 ? (
              <div className="text-gray-500">
                No questions in <b>{activeDomain || "Domain1"}</b>. Upload an Excel/CSV with
                columns <b>questionNo</b>, <b>question/text</b>, <b>type</b>, <b>options</b>.
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitAll();
                }}
                className="space-y-6"
              >
                {questions.map((q, i) => {
                  const opts = parseOptions(q.options);
                  const qLabel = `Q${q.questionNo != null ? q.questionNo : i + 1}: `;

                  return (
                    <div key={q._id} className="border rounded-2xl p-4 shadow-sm">
                      {/* MCQ + Text keep the header above */}
                      {(q.type === "mcq" || q.type === "text") && (
                        <div className="text-lg font-medium mb-3">
                          {qLabel}
                          {q.text}
                        </div>
                      )}

                      {/* MCQ → dropdown */}
                      {q.type === "mcq" && (
                        <select
                          className="w-full max-w-xl border rounded-xl p-2"
                          value={answers[q._id] ?? ""}
                          onChange={(e) => setAnswer(q._id, e.target.value)}
                        >
                          <option value="" disabled>
                            -- Select an answer --
                          </option>
                          {opts.map((opt, idx) => (
                            <option key={idx} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      )}

                      {/* Text → textarea */}
                      {q.type === "text" && (
                        <textarea
                          rows={3}
                          className="w-full border rounded-xl p-3"
                          placeholder="Your answer"
                          value={answers[q._id] || ""}
                          onChange={(e) => setAnswer(q._id, e.target.value)}
                        />
                      )}

                      {/* Boolean → inline question text + radios */}
                      {q.type === "boolean" && (
                        <div className="flex flex-wrap items-center gap-6">
                          <span className="text-lg font-medium">
                            {qLabel}
                            {q.text}
                          </span>
                          {(opts.length === 2 ? opts : ["True", "False"]).map((label, idx) => (
                            <label key={idx} className="inline-flex items-center gap-2">
                              <input
                                type="radio"
                                name={q._id}
                                value={label}
                                checked={answers[q._id] === label}
                                onChange={(e) => setAnswer(q._id, e.target.value)}
                              />
                              <span>{label}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                <div className="pt-2 flex justify-center">
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Submit All
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
