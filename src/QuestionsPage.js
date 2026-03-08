import React, { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "./config";

const API_URL = `${API_BASE_URL}/questions/`;
const CURRENT_USER_ID = 1;


const courseLabels = {
  CS101: "CS 101",
  MATH241: "MATH 241",
  ENG101: "ENG 101",
  HIST100: "HIST 100",
};

function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [course, setCourse] = useState("CS101");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [message, setMessage] = useState("");

  const fetchQuestions = async (selectedCourse = "") => {
    let url = API_URL;
    if (selectedCourse) {
      url += `?course=${selectedCourse}`;
    }

    const res = await fetch(url);
    const data = await res.json();
    setQuestions(data);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title,
      content,
      course,
      author: CURRENT_USER_ID,
    };

    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setTitle("");
      setContent("");
      setCourse("CS101");
      setMessage("Question posted.");
      fetchQuestions(filterCourse);
      setTimeout(() => setMessage(""), 2000);
    } else {
      setMessage("Could not post question.");
    }
  };

  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      const combined = `${question.title} ${question.content}`.toLowerCase();
      return combined.includes(searchTerm.toLowerCase());
    });
  }, [questions, searchTerm]);

  return (
    <div style={styles.page}>
      <section style={styles.heroWrapper}>
        <div style={styles.hero}>
          <h1 style={styles.heroTitle}>Course Questions</h1>
          <p style={styles.heroText}>
            Ask course-related questions, browse discussion posts, and get help
            from students and teachers in one place.
          </p>
        </div>
      </section>

      <main style={styles.container}>
        <section>
          <div style={styles.panel}>
            <h2 style={styles.sectionTitle}>Ask a Question</h2>

            <form onSubmit={handleSubmit}>
              <input
                style={styles.input}
                type="text"
                placeholder="Question title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <select
                style={styles.input}
                value={course}
                onChange={(e) => setCourse(e.target.value)}
              >
                <option value="CS101">CS 101</option>
                <option value="MATH241">MATH 241</option>
                <option value="ENG101">ENG 101</option>
                <option value="HIST100">HIST 100</option>
              </select>

              <textarea
                style={styles.textarea}
                placeholder="Describe your question..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                maxLength="500"
              />

              <p style={styles.counter}>{content.length}/500 characters</p>

              <button style={styles.primaryButton} type="submit">
                Post Question
              </button>
            </form>

            {message && <p style={styles.message}>{message}</p>}
          </div>
        </section>

        <section>
          <div style={styles.toolbar}>
            <div>
              <h2 style={styles.sectionTitle}>Browse Questions</h2>
              <p style={styles.noteCount}>
                Showing {filteredQuestions.length} question
                {filteredQuestions.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div style={styles.filters}>
              <input
                style={styles.searchInput}
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <select
                style={styles.filterSelect}
                value={filterCourse}
                onChange={(e) => {
                  const value = e.target.value;
                  setFilterCourse(value);
                  fetchQuestions(value);
                }}
              >
                <option value="">All Courses</option>
                <option value="CS101">CS 101</option>
                <option value="MATH241">MATH 241</option>
                <option value="ENG101">ENG 101</option>
                <option value="HIST100">HIST 100</option>
              </select>
            </div>
          </div>

          {filteredQuestions.length === 0 ? (
            <div style={styles.emptyState}>
              <h3 style={{ marginTop: 0, marginBottom: "8px" }}>
                No questions yet
              </h3>
              <p style={{ margin: 0, color: "#64748b" }}>
                Ask the first question for this course.
              </p>
            </div>
          ) : (
            filteredQuestions.map((question) => (
              <div key={question.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div style={{ flex: 1 }}>
                    <h3 style={styles.cardTitle}>{question.title}</h3>
                    <p style={styles.cardSubtext}>
                      Asked by <strong>{question.author_username}</strong> ·{" "}
                      <span
                        style={roleBadge(question.author_role || "student")}
                      >
                        {question.author_role || "student"}
                      </span>
                    </p>

                    <div style={styles.metaRow}>
                      <span style={styles.badge}>
                        {courseLabels[question.course]}
                      </span>
                      <span style={styles.timestamp}>
                        {new Date(question.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <p style={styles.cardContent}>{question.content}</p>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%)",
    fontFamily: "Inter, Arial, sans-serif",
    color: "#14213d",
    paddingBottom: "40px",
  },

  heroWrapper: {
    maxWidth: "1200px",
    margin: "24px auto 0",
    padding: "0 24px",
  },

  hero: {
    background: "linear-gradient(135deg, #1f3c88 0%, #315efb 100%)",
    color: "white",
    borderRadius: "28px",
    padding: "32px",
    boxShadow: "0 20px 50px rgba(31, 60, 136, 0.22)",
  },

  heroTitle: {
    margin: "0 0 10px 0",
    fontSize: "32px",
    fontWeight: 800,
    letterSpacing: "-0.03em",
  },

  heroText: {
    margin: 0,
    fontSize: "16px",
    maxWidth: "700px",
    lineHeight: 1.6,
    color: "rgba(255,255,255,0.9)",
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "32px 24px 0",
    display: "grid",
    gridTemplateColumns: "360px 1fr",
    gap: "24px",
  },

  panel: {
    backgroundColor: "rgba(255,255,255,0.82)",
    border: "1px solid rgba(20, 33, 61, 0.08)",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 16px 40px rgba(31, 60, 136, 0.08)",
    position: "sticky",
    top: "96px",
  },

  sectionTitle: {
    marginTop: 0,
    marginBottom: "16px",
    fontSize: "22px",
    fontWeight: 700,
    color: "#14213d",
    letterSpacing: "-0.02em",
  },

  input: {
    width: "100%",
    padding: "14px 16px",
    marginBottom: "12px",
    borderRadius: "14px",
    border: "1px solid #d7e0f2",
    boxSizing: "border-box",
    fontSize: "14px",
    backgroundColor: "#f9fbff",
    outline: "none",
  },

  textarea: {
    width: "100%",
    padding: "14px 16px",
    marginBottom: "6px",
    borderRadius: "14px",
    border: "1px solid #d7e0f2",
    boxSizing: "border-box",
    resize: "vertical",
    fontSize: "14px",
    backgroundColor: "#f9fbff",
    outline: "none",
    minHeight: "140px",
  },

  counter: {
    marginTop: 0,
    marginBottom: "16px",
    fontSize: "12px",
    color: "#6b7280",
    textAlign: "right",
  },

  primaryButton: {
    width: "100%",
    padding: "13px 16px",
    border: "none",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #315efb 0%, #1f3c88 100%)",
    color: "white",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "14px",
    boxShadow: "0 10px 20px rgba(49, 94, 251, 0.22)",
  },

  message: {
    marginTop: "14px",
    color: "#167c4d",
    fontWeight: 700,
    fontSize: "14px",
  },

  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px",
    gap: "16px",
    flexWrap: "wrap",
  },

  filters: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },

  searchInput: {
    padding: "13px 16px",
    borderRadius: "14px",
    border: "1px solid #d7e0f2",
    minWidth: "230px",
    fontSize: "14px",
    backgroundColor: "rgba(255,255,255,0.9)",
  },

  filterSelect: {
    padding: "13px 16px",
    borderRadius: "14px",
    border: "1px solid #d7e0f2",
    fontSize: "14px",
    backgroundColor: "rgba(255,255,255,0.9)",
  },

  noteCount: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
  },

  emptyState: {
    backgroundColor: "rgba(255,255,255,0.86)",
    border: "1px solid rgba(20, 33, 61, 0.08)",
    borderRadius: "24px",
    padding: "36px",
    textAlign: "center",
    boxShadow: "0 16px 40px rgba(31, 60, 136, 0.08)",
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.9)",
    border: "1px solid rgba(20, 33, 61, 0.08)",
    borderRadius: "24px",
    padding: "20px",
    marginBottom: "16px",
    boxShadow: "0 14px 30px rgba(31, 60, 136, 0.08)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
  },

  cardTitle: {
    margin: "0 0 6px 0",
    fontSize: "20px",
    fontWeight: 700,
    color: "#14213d",
    letterSpacing: "-0.02em",
  },

  cardSubtext: {
    margin: "0 0 10px 0",
    color: "#64748b",
    fontSize: "13px",
  },

  metaRow: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: "12px",
  },

  badge: {
    background: "linear-gradient(135deg, #e8f0ff 0%, #dce8ff 100%)",
    color: "#1f3c88",
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 700,
    border: "1px solid #cbd9ff",
  },

  timestamp: {
    fontSize: "12px",
    color: "#6b7280",
  },

  cardContent: {
    marginTop: "8px",
    lineHeight: 1.65,
    color: "#334155",
    whiteSpace: "pre-wrap",
    fontSize: "15px",
  },
};

const roleBadge = (role) => ({
  display: "inline-block",
  padding: "4px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: 700,
  textTransform: "capitalize",
  backgroundColor: role === "teacher" ? "#e0f2fe" : "#ecfdf5",
  color: role === "teacher" ? "#075985" : "#166534",
});

export default QuestionsPage;