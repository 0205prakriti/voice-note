const FOLDERS = ["All", "Work", "Personal", "Ideas", "Health", "Finance", "General"];

const COLORS = {
  Work: { bg: "#eff6ff", color: "#3b82f6" },
  Personal: { bg: "#f0fdf4", color: "#22c55e" },
  Ideas: { bg: "#fefce8", color: "#eab308" },
  Health: { bg: "#fff1f2", color: "#f43f5e" },
  Finance: { bg: "#f5f3ff", color: "#8b5cf6" },
  General: { bg: "#f4f4f5", color: "#71717a" },
  All: { bg: "#111", color: "#fff" },
};

export default function FolderTabs({ active, onChange, notes }) {
  // Count notes per folder
  const counts = notes.reduce((acc, n) => {
    acc[n.folder] = (acc[n.folder] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{
      display: "flex",
      gap: "8px",
      flexWrap: "wrap",
      marginBottom: "1.25rem",
    }}>
      {FOLDERS.map((folder) => {
        const isActive = active === folder;
        const count = folder === "All" ? notes.length : (counts[folder] || 0);
        if (folder !== "All" && count === 0) return null; // hide empty folders

        return (
          <button
            key={folder}
            onClick={() => onChange(folder)}
            style={{
              padding: "6px 14px",
              borderRadius: "99px",
              border: "1px solid",
              borderColor: isActive ? "transparent" : "#e4e4e7",
              background: isActive ? COLORS[folder].bg : "#fff",
              color: isActive ? COLORS[folder].color : "#888",
              fontSize: "0.82rem",
              fontWeight: isActive ? 600 : 400,
              cursor: "pointer",
              transition: "all 0.15s",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            {folder}
            <span style={{
              background: isActive ? COLORS[folder].color : "#f4f4f5",
              color: isActive ? "#fff" : "#aaa",
              borderRadius: "99px",
              padding: "1px 7px",
              fontSize: "0.75rem",
              fontWeight: 600,
            }}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}