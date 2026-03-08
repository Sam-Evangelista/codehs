import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "./config";

const CURRENT_USER_ID = 1;
const USER_URL = `${API_BASE_URL}/users/${CURRENT_USER_ID}/`;
const NOTES_URL = `${API_BASE_URL}/notes/?author=${CURRENT_USER_ID}`;
const QUESTIONS_URL = `${API_BASE_URL}/questions/?author=${CURRENT_USER_ID}`;

const courseLabels = {
  CS101: "CS 101",
  MATH241: "MATH 241",
  ENG101: "ENG 101",
  HIST100: "HIST 100",
};

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      const [userRes, notesRes, questionsRes] = await Promise.all([
        fetch(USER_URL),
        fetch(NOTES_URL),
        fetch(QUESTIONS_URL),
      ]);

      const userData = await userRes.json();
      const notesData = await notesRes.json();
      const questionsData = await questionsRes.json();

      setUser(userData);
      setNotes(notesData);
      setQuestions(questionsData);
    };

    fetchProfileData();
  }, []);

  if (!user) {
    return (
      <div style={styles.page}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
          <div style={styles.loadingCard}>Loading profile...</div>
        </div>
      </div>
    );
  }

  const userInitial = user.username?.charAt(0).toUpperCase() || "U";

  return (
    <div style={styles.page}>
      <section style={styles.heroWrapper}>
        <div style={styles.hero}>
          <h1 style={styles.heroTitle}>Your Profile</h1>
          <p style={styles.heroText}>
            View your account, track your academic contributions, and manage the
            notes and questions you have shared with the community.
          </p>
        </div>
      </section>

      <main style={styles.container}>
        <section style={styles.profileGrid}>
          <div style={styles.profileCard}>
            <div style={styles.profileHeader}>
              <div style={styles.avatar}>{userInitial}</div>

              <div>
                <h2 style={styles.username}>{user.username}</h2>
                <div style={{ marginBottom: "10px" }}>
                  <span style={roleBadge(user.role)}>{user.role}</span>
                </div>
                <p style={styles.bio}>
                  {user.bio || "No bio added yet."}
                </p>
              </div>
            </div>
          </div>

          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>Notes Shared</p>
              <h3 style={styles.statValue}>{notes.length}</h3>
            </div>

            <div style={styles.statCard}>
              <p style={styles.statLabel}>Questions Posted</p>
              <h3 style={styles.statValue}>{questions.length}</h3>
            </div>

            <div style={styles.statCard}>
              <p style={styles.statLabel}>Account Role</p>
              <h3 style={styles.statValueSmall}>
                {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Student"}
              </h3>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>My Notes</h2>
            <p style={styles.sectionSubtext}>
              {notes.length} note{notes.length !== 1 ? "s" : ""} shared
            </p>
          </div>

          {notes.length === 0 ? (
            <div style={styles.emptyState}>
              <h3 style={{ marginTop: 0, marginBottom: "8px" }}>No notes yet</h3>
              <p style={{ margin: 0, color: "#64748b" }}>
                Start contributing by creating your first study note.
              </p>
            </div>
          ) : (
            notes.map((note) => (
              <div key={note.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div style={{ flex: 1 }}>
                    <h3 style={styles.cardTitle}>{note.title}</h3>
                    <p style={styles.cardSubtext}>Shared study note</p>

                    <div style={styles.metaRow}>
                      <span style={styles.badge}>
                        {courseLabels[note.course]}
                      </span>
                      {note.created_at && (
                        <span style={styles.timestamp}>
                          {new Date(note.created_at).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <p style={styles.cardContent}>{note.content}</p>
              </div>
            ))
          )}
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>My Questions</h2>
            <p style={styles.sectionSubtext}>
              {questions.length} question{questions.length !== 1 ? "s" : ""} posted
            </p>
          </div>

          {questions.length === 0 ? (
            <div style={styles.emptyState}>
              <h3 style={{ marginTop: 0, marginBottom: "8px" }}>No questions yet</h3>
              <p style={{ margin: 0, color: "#64748b" }}>
                Ask your first course question to start engaging with the platform.
              </p>
            </div>
          ) : (
            questions.map((question) => (
              <div key={question.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div style={{ flex: 1 }}>
                    <h3 style={styles.cardTitle}>{question.title}</h3>
                    <p style={styles.cardSubtext}>Community question</p>

                    <div style={styles.metaRow}>
                      <span style={styles.badge}>
                        {courseLabels[question.course]}
                      </span>
                      {question.created_at && (
                        <span style={styles.timestamp}>
                          {new Date(question.created_at).toLocaleString()}
                        </span>
                      )}
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
    maxWidth: "720px",
    lineHeight: 1.6,
    color: "rgba(255,255,255,0.9)",
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "32px 24px 0",
  },

  loadingCard: {
    backgroundColor: "rgba(255,255,255,0.86)",
    border: "1px solid rgba(20, 33, 61, 0.08)",
    borderRadius: "24px",
    padding: "28px",
    boxShadow: "0 16px 40px rgba(31, 60, 136, 0.08)",
    fontWeight: 600,
  },

  profileGrid: {
    display: "grid",
    gridTemplateColumns: "1.4fr 1fr",
    gap: "24px",
    marginBottom: "28px",
  },

  profileCard: {
    backgroundColor: "rgba(255,255,255,0.86)",
    border: "1px solid rgba(20, 33, 61, 0.08)",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 16px 40px rgba(31, 60, 136, 0.08)",
  },

  profileHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: "18px",
  },

  avatar: {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontWeight: 800,
    flexShrink: 0,
    boxShadow: "0 12px 24px rgba(37, 99, 235, 0.22)",
  },

  username: {
    margin: "0 0 8px 0",
    fontSize: "28px",
    fontWeight: 800,
    letterSpacing: "-0.03em",
    color: "#14213d",
  },

  bio: {
    margin: 0,
    color: "#475569",
    lineHeight: 1.6,
    fontSize: "15px",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "16px",
  },

  statCard: {
    backgroundColor: "rgba(255,255,255,0.86)",
    border: "1px solid rgba(20, 33, 61, 0.08)",
    borderRadius: "20px",
    padding: "20px",
    boxShadow: "0 12px 28px rgba(31, 60, 136, 0.07)",
  },

  statLabel: {
    margin: "0 0 6px 0",
    fontSize: "13px",
    color: "#64748b",
    fontWeight: 600,
  },

  statValue: {
    margin: 0,
    fontSize: "30px",
    fontWeight: 800,
    letterSpacing: "-0.03em",
    color: "#14213d",
  },

  statValueSmall: {
    margin: 0,
    fontSize: "22px",
    fontWeight: 800,
    letterSpacing: "-0.02em",
    color: "#14213d",
  },

  section: {
    marginBottom: "28px",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "16px",
    marginBottom: "16px",
    flexWrap: "wrap",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "24px",
    fontWeight: 700,
    color: "#14213d",
    letterSpacing: "-0.02em",
  },

  sectionSubtext: {
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
  padding: "5px 12px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: 700,
  textTransform: "capitalize",
  backgroundColor: role === "teacher" ? "#e0f2fe" : "#ecfdf5",
  color: role === "teacher" ? "#075985" : "#166534",
});

export default ProfilePage;