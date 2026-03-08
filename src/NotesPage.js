import React, { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "./config";

const API_URL = `${API_BASE_URL}/notes/`;
const CURRENT_USER_ID = 1;

const courseLabels = {
  CS101: "CS 101",
  MATH241: "MATH 241",
  ENG101: "ENG 101",
  HIST100: "HIST 100",
};

function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [course, setCourse] = useState("CS101");
  const [filterCourse, setFilterCourse] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [sortOption, setSortOption] = useState("newest");

  const fetchNotes = async (selectedCourse = "") => {
    let url = API_URL;
    if (selectedCourse) {
      url += `?course=${selectedCourse}`;
    }

    const res = await fetch(url);
    const data = await res.json();
    setNotes(data);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setCourse("CS101");
    setEditingId(null);
  };

  const showTemporaryMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const payload = {
      title,
      content,
      course,
      author: CURRENT_USER_ID,
    };
  
    let res;
    if (editingId) {
      res = await fetch(`${API_URL}${editingId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } else {
      res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    }
  
    if (res.ok) {
      const wasEditing = Boolean(editingId);
      resetForm();
      fetchNotes(filterCourse);
      showTemporaryMessage(
        wasEditing ? "Note updated successfully." : "Note added successfully."
      );
    } else {
      const errorData = await res.json().catch(() => null);
      console.log("Submit error:", errorData);
      showTemporaryMessage("Something went wrong.");
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`${API_URL}${id}/`, {
      method: "DELETE",
    });

    if (res.ok) {
      if (editingId === id) {
        resetForm();
      }
      if (selectedNote?.id === id) {
        setSelectedNote(null);
      }
      fetchNotes(filterCourse);
      showTemporaryMessage("Note deleted.");
    } else {
      showTemporaryMessage("Could not delete note.");
    }
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setCourse(note.course);
    setEditingId(note.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleFilterChange = (e) => {
    const selected = e.target.value;
    setFilterCourse(selected);
    fetchNotes(selected);
  };

  const previewText = (text, maxLength = 160) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const filteredNotes = useMemo(() => {
    let result = notes.filter((note) => {
      const combinedText = `${note.title} ${note.content}`.toLowerCase();
      return combinedText.includes(searchTerm.toLowerCase());
    });

    result.sort((a, b) => {
      if (sortOption === "newest") {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      if (sortOption === "oldest") {
        return new Date(a.created_at) - new Date(b.created_at);
      }
      if (sortOption === "title-asc") {
        return a.title.localeCompare(b.title);
      }
      if (sortOption === "title-desc") {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });

    return result;
  }, [notes, searchTerm, sortOption]);

  const totalCourses = new Set(notes.map((note) => note.course)).size;

  return (
    <div style={styles.page}>
      {/* <nav style={styles.navbar}>
        <div style={styles.navbarContent}>
          <div style={styles.brand}>
            <img
              src="favicon.ico"
              alt="StudySync Logo"
              style={styles.brandLogo}
            />
            <div>
              <h1 style={styles.logo}>StudySync Lite</h1>
              <span style={styles.tagline}>
                Centralized course notes for students
              </span>
            </div>
          </div>
        </div>
      </nav> */}

      <section style={styles.heroWrapper}>
        <div style={styles.hero}>
          <div>
            <h2 style={styles.heroTitle}>Smarter note sharing for students</h2>
            <p style={styles.heroText}>
              Create, organize, search, and manage course notes in one clean
              place. StudySync Lite helps students catch up faster and keep
              important class material easy to find.
            </p>
          </div>
        </div>
      </section>

      <section style={styles.statsWrapper}>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Total Notes</p>
            <h3 style={styles.statValue}>{notes.length}</h3>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Visible Notes</p>
            <h3 style={styles.statValue}>{filteredNotes.length}</h3>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Courses Active</p>
            <h3 style={styles.statValue}>{totalCourses}</h3>
          </div>
        </div>
      </section>

      <main style={styles.container}>
        <section style={styles.leftPanel}>
          <div style={styles.panel}>
            <h2 style={styles.sectionTitle}>
              {editingId ? "Edit Your Note" : "Create a New Note"}
            </h2>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Note title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={styles.input}
              />

              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                style={styles.input}
              >
                <option value="CS101">CS 101</option>
                <option value="MATH241">MATH 241</option>
                <option value="ENG101">ENG 101</option>
                <option value="HIST100">HIST 100</option>
              </select>

              <textarea
                placeholder="Write your notes here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows="6"
                maxLength="500"
                style={styles.textarea}
              />

              <p style={styles.counter}>{content.length}/500 characters</p>

              <div style={styles.formButtons}>
                <button type="submit" style={styles.primaryButton}>
                  {editingId ? "Update Note" : "Add Note"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    style={styles.secondaryButton}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {message && <p style={styles.message}>{message}</p>}
          </div>
        </section>

        <section style={styles.rightPanel}>
          <div style={styles.toolbar}>
            <div style={{ marginBottom: "4px" }}>
              <h2 style={styles.sectionTitle}>Browse Notes</h2>
              <p style={styles.noteCount}>
                Showing {filteredNotes.length} note
                {filteredNotes.length !== 1 ? "s" : ""} • Sorted by{" "}
                {sortOption === "newest" && "newest"}
                {sortOption === "oldest" && "oldest"}
                {sortOption === "title-asc" && "title A–Z"}
                {sortOption === "title-desc" && "title Z–A"}
              </p>
            </div>

            <div style={styles.filters}>
              <input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />

              <select
                value={filterCourse}
                onChange={handleFilterChange}
                style={styles.filterSelect}
              >
                <option value="">All Courses</option>
                <option value="CS101">CS 101</option>
                <option value="MATH241">MATH 241</option>
                <option value="ENG101">ENG 101</option>
                <option value="HIST100">HIST 100</option>
              </select>

              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                style={styles.filterSelect}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title-asc">Title A–Z</option>
                <option value="title-desc">Title Z–A</option>
              </select>
            </div>
          </div>

          {filteredNotes.length === 0 ? (
            <div style={styles.emptyState}>
              <h3 style={{ marginTop: 0, marginBottom: "8px" }}>No notes found</h3>
              <p style={{ margin: 0, color: "#64748b" }}>
                Try a different search term, switch the course filter, or add a
                new note.
              </p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div key={note.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div style={{ flex: 1 }}>
                    <h3 style={styles.cardTitle}>{note.title}</h3>
                    <p style={styles.cardSubtext}>
                    Posted by <strong>{note.author_username}</strong> · {note.author_role}
                    </p>

                    <div style={styles.metaRow}>
                      <span style={styles.badge}>{courseLabels[note.course]}</span>
                      <span style={styles.timestamp}>
                        {new Date(note.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div style={styles.cardActions}>
                    <button
                      onClick={() => setSelectedNote(note)}
                      style={styles.viewButton}
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(note)}
                      style={styles.editButton}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      style={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <p style={styles.cardContent}>{previewText(note.content)}</p>
              </div>
            ))
          )}
        </section>
      </main>

      {selectedNote && (
        <div style={styles.modalOverlay} onClick={() => setSelectedNote(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginTop: 0, marginBottom: "10px" }}>
              {selectedNote.title}
            </h2>
            <div style={styles.metaRow}>
              <span style={styles.badge}>{courseLabels[selectedNote.course]}</span>
              <span style={styles.timestamp}>
                {new Date(selectedNote.created_at).toLocaleString()}
              </span>
            </div>
            <p style={styles.fullNoteContent}>{selectedNote.content}</p>
            <button
              onClick={() => setSelectedNote(null)}
              style={styles.primaryButton}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%)",
    fontFamily: "Inter, Arial, sans-serif",
    color: "#14213d",
  },

  navbar: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    backdropFilter: "blur(12px)",
    backgroundColor: "rgba(255, 255, 255, 0.82)",
    borderBottom: "1px solid rgba(20, 33, 61, 0.08)",
    padding: "16px 28px",
  },

  navbarContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  brandLogo: {
    width: "56px",
    height: "56px",
    objectFit: "contain",
    borderRadius: "14px",
    boxShadow: "0 8px 20px rgba(31, 60, 136, 0.14)",
    backgroundColor: "white",
    padding: "4px",
  },

  logo: {
    margin: 0,
    fontSize: "28px",
    fontWeight: 800,
    letterSpacing: "-0.02em",
    color: "#14213d",
  },

  tagline: {
    fontSize: "14px",
    color: "#5b6780",
    display: "block",
    marginTop: "2px",
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

  statsWrapper: {
    maxWidth: "1200px",
    margin: "20px auto 0",
    padding: "0 24px",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "16px",
  },

  statCard: {
    backgroundColor: "rgba(255,255,255,0.82)",
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
    fontSize: "28px",
    fontWeight: 800,
    letterSpacing: "-0.03em",
    color: "#14213d",
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "32px 24px 40px",
    display: "grid",
    gridTemplateColumns: "360px 1fr",
    gap: "24px",
  },

  leftPanel: {},

  rightPanel: {},

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

  formButtons: {
    display: "flex",
    gap: "10px",
  },

  primaryButton: {
    flex: 1,
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

  secondaryButton: {
    flex: 1,
    padding: "13px 16px",
    border: "1px solid #d7e0f2",
    borderRadius: "14px",
    backgroundColor: "white",
    color: "#334155",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "14px",
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
    transition: "transform 0.15s ease, box-shadow 0.15s ease",
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

  cardActions: {
    display: "flex",
    gap: "8px",
    flexShrink: 0,
    flexWrap: "wrap",
  },

  viewButton: {
    backgroundColor: "#edf7ff",
    color: "#0f5c91",
    border: "1px solid #cfe9fb",
    padding: "10px 14px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "13px",
  },

  editButton: {
    backgroundColor: "#f3f0ff",
    color: "#5a36d6",
    border: "1px solid #ddd3ff",
    padding: "10px 14px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "13px",
  },

  deleteButton: {
    backgroundColor: "#fff1f2",
    color: "#c2410c",
    border: "1px solid #ffd5da",
    padding: "10px 14px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "13px",
  },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    zIndex: 1000,
    backdropFilter: "blur(6px)",
  },

  modal: {
    backgroundColor: "white",
    borderRadius: "24px",
    padding: "28px",
    width: "100%",
    maxWidth: "760px",
    maxHeight: "82vh",
    overflowY: "auto",
    boxShadow: "0 24px 60px rgba(15, 23, 42, 0.28)",
    border: "1px solid rgba(20, 33, 61, 0.08)",
  },

  fullNoteContent: {
    whiteSpace: "pre-wrap",
    lineHeight: 1.75,
    color: "#334155",
    marginBottom: "20px",
    fontSize: "15px",
  },
};

export default NotesPage;