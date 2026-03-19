import { useState, useRef, useEffect } from "react";

const TAG_COLORS = [
  { color: "#D4E6F8", textColor: "#0C447C" },
  { color: "#FAE9C8", textColor: "#633806" },
  { color: "#E8E7FD", textColor: "#3C3489" },
  { color: "#FCE8E8", textColor: "#791F1F" },
  { color: "#DFF3E8", textColor: "#27500A" },
  { color: "#F5E6FA", textColor: "#5B1A7A" },
];

let tagRegistry = [
  { id: 1, name: "Test tag", color: "#D4E6F8", textColor: "#0C447C", automation: null },
  { id: 2, name: "testing tag 2", color: "#FAE9C8", textColor: "#633806", automation: "Testing Tag 2 automation" },
  { id: 3, name: "VIP client", color: "#E8E7FD", textColor: "#3C3489", automation: null },
  { id: 4, name: "Needs follow-up", color: "#FCE8E8", textColor: "#791F1F", automation: null },
  { id: 5, name: "Venue lead", color: "#DFF3E8", textColor: "#27500A", automation: null },
];
let nextTagId = 6;

// Keep TAGS as a reference that components can access — updated via addNewTag
function getTagRegistry() { return tagRegistry; }
function addNewTag(name) {
  const colorSet = TAG_COLORS[(nextTagId - 1) % TAG_COLORS.length];
  const newTag = { id: nextTagId++, name, ...colorSet, automation: null };
  tagRegistry = [...tagRegistry, newTag];
  return newTag;
}

const PROJECTS = [
  { id: 1, name: "Bob Bobbington's Project", date: "Fri, May 30, 2025", tagIds: new Set(), stageMoved: "a year ago", recentActivity: "Contract signed" },
  { id: 2, name: "Legacy File Edit", date: "Thu, Dec 21, 2023", tagIds: new Set(), stageMoved: "3 years ago", recentActivity: null },
  { id: 3, name: "Hermione Granger's Project", date: "Thu, Nov 16, 2023", tagIds: new Set(), stageMoved: "2 years ago", recentActivity: null },
  { id: 4, name: "Fix It Felix's Project", date: "TBD", tagIds: new Set(), stageMoved: "a month ago", recentActivity: "Contract signed" },
  { id: 5, name: "Acme Corp Shoot", date: "Mon, Jan 6, 2025", tagIds: new Set(), stageMoved: "2 years ago", recentActivity: null },
];

function TagPill({ tag, onRemove }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "2px 8px", borderRadius: 99, fontSize: 11, fontWeight: 500,
      background: tag.color, color: tag.textColor, whiteSpace: "nowrap",
    }}>
      {tag.name}
      {onRemove && (
        <span
          onClick={e => { e.stopPropagation(); onRemove(tag.id); }}
          style={{ cursor: "pointer", opacity: 0.5, fontSize: 10, lineHeight: 1 }}
        >✕</span>
      )}
    </span>
  );
}

function UnsavedChangesModal({ onSave, onDiscard }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(26,25,23,0.45)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        background: "white", borderRadius: 14, width: 360,
        boxShadow: "0 8px 40px rgba(0,0,0,0.18)", overflow: "hidden",
      }}>
        <div style={{ padding: "24px 24px 20px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <div style={{
            width: 36, height: 36, borderRadius: 9,
            background: "#FAEEDA", display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 14,
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="7" stroke="#854F0B" strokeWidth="1.3"/>
              <path d="M9 5.5v4" stroke="#854F0B" strokeWidth="1.4" strokeLinecap="round"/>
              <circle cx="9" cy="12.5" r="0.8" fill="#854F0B"/>
            </svg>
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#1A1917", marginBottom: 8 }}>
            Unsaved changes
          </div>
          <div style={{ fontSize: 13, color: "#5F5E5A", lineHeight: 1.6 }}>
            Your tag change has not been saved. Would you like to apply the changes or discard?
          </div>
        </div>
        <div style={{ borderTop: "0.5px solid #F0EEE9" }} />
        <div style={{ display: "flex", gap: 8, padding: 16 }}>
          <button
            onClick={onDiscard}
            style={{
              flex: 1, padding: "8px 0", borderRadius: 8, fontSize: 13, fontWeight: 500,
              border: "0.5px solid #D8D6D0", background: "white", cursor: "pointer", color: "#444441",
            }}
          >
            Discard
          </button>
          <button
            onClick={onSave}
            style={{
              flex: 1, padding: "8px 0", borderRadius: 8, fontSize: 13, fontWeight: 500,
              border: "none", cursor: "pointer", background: "#185FA5", color: "white",
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

const COLOR_SWATCHES = [
  { color: "#D4E6F8", textColor: "#0C447C" },
  { color: "#9FE1CB", textColor: "#085041" },
  { color: "#B5D4F4", textColor: "#0C447C" },
  { color: "#F4C0D1", textColor: "#72243E" },
  { color: "#FAC775", textColor: "#633806" },
  { color: "#C0DD97", textColor: "#27500A" },
  { color: "#E8E7FD", textColor: "#3C3489" },
  { color: "#F7C1C1", textColor: "#791F1F" },
  { color: "#F0997B", textColor: "#4A1B0C" },
  { color: "#D3D1C7", textColor: "#2C2C2A" },
];

function ManageTagsModal({ onClose, onRegistryChange }) {
  const [tags, setTags] = useState(getTagRegistry());
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [creatingNew, setCreatingNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(COLOR_SWATCHES[0]);

  function startCreate() {
    setCreatingNew(true);
    setNewName("");
    setNewColor(COLOR_SWATCHES[0]);
    setEditingId(null);
  }

  function saveNew() {
    const trimmed = newName.trim();
    if (!trimmed) return;
    addNewTag(trimmed);
    tagRegistry[tagRegistry.length - 1] = {
      ...tagRegistry[tagRegistry.length - 1],
      color: newColor.color,
      textColor: newColor.textColor,
    };
    setTags(getTagRegistry());
    setCreatingNew(false);
    if (onRegistryChange) onRegistryChange("Changes applied");
  }

  function startEdit(tag) {
    setEditingId(tag.id);
    setEditName(tag.name);
    setEditColor({ color: tag.color, textColor: tag.textColor });
    setDeleteConfirmId(null);
  }

  function saveEdit() {
    tagRegistry = tagRegistry.map(t =>
      t.id === editingId
        ? { ...t, name: editName.trim() || t.name, ...editColor }
        : t
    );
    setTags(getTagRegistry());
    setEditingId(null);
    if (onRegistryChange) onRegistryChange();
  }

  function deleteTag(id) {
    const tag = tagRegistry.find(t => t.id === id);
    tagRegistry = tagRegistry.filter(t => t.id !== id);
    setTags(getTagRegistry());
    setEditingId(null);
    setDeleteConfirmId(null);
    if (onRegistryChange) onRegistryChange(`"${tag.name}" tag deleted`);
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 2000,
      background: "rgba(26,25,23,0.45)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {/* Delete confirmation — nested on top */}
      {deleteConfirmId && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 3000,
          background: "rgba(26,25,23,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            background: "white", borderRadius: 12, width: 320,
            boxShadow: "0 8px 40px rgba(0,0,0,0.22)",
          }}>
            <div style={{ padding: "24px 24px 16px", textAlign: "center" }}>
              {(() => {
                const tag = tags.find(t => t.id === deleteConfirmId);
                const name = tag?.name || "";
                const label = /tag$/i.test(name.trim()) ? `"${name}"` : `"${name}" tag`;
                return (
                  <>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#1A1917", marginBottom: 8 }}>
                      Delete {label}?
                    </div>
                    <div style={{ fontSize: 13, color: "#5F5E5A", lineHeight: 1.6 }}>
                      {label.charAt(0).toUpperCase() + label.slice(1)} will be permanently deleted from all previously tagged contacts or projects
                    </div>
                  </>
                );
              })()}
            </div>
            <div style={{ borderTop: "0.5px solid #F0EEE9" }} />
            <div style={{ display: "flex", gap: 8, padding: 16 }}>
              <button
                onClick={() => setDeleteConfirmId(null)}
                style={{
                  flex: 1, padding: "8px 0", borderRadius: 8, fontSize: 13, fontWeight: 500,
                  border: "0.5px solid #D8D6D0", background: "white", cursor: "pointer", color: "#444441",
                }}
              >Cancel</button>
              <button
                onClick={() => deleteTag(deleteConfirmId)}
                style={{
                  flex: 1, padding: "8px 0", borderRadius: 8, fontSize: 13, fontWeight: 500,
                  border: "none", cursor: "pointer", background: "#E24B4A", color: "white",
                }}
              >Delete</button>
            </div>
          </div>
        </div>
      )}

      <div style={{
        background: "white", borderRadius: 14, width: 420,
        boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
        overflow: "visible",
        position: "relative",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 24px 0", position: "relative" }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: "#1A1917" }}>Manage tags</span>
          <span
            onClick={onClose}
            style={{ position: "absolute", right: 24, cursor: "pointer", color: "#A09E98", fontSize: 18, lineHeight: 1 }}
          >✕</span>
        </div>

        <div style={{ padding: "14px 24px 20px" }}>
          <p style={{ fontSize: 13, color: "#5F5E5A", lineHeight: 1.6, marginBottom: 16 }}>
            Add, edit, or remove tags; changes will apply to all previously tagged contacts or projects. Tags are visible only to you.
          </p>

          {/* Tag pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            {tags.map(tag => (
              <div key={tag.id} style={{ position: "relative" }}>
                <div
                  onMouseEnter={() => setHoveredId(tag.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{ position: "relative", display: "inline-flex", alignItems: "center" }}
                >
                  <TagPill tag={tag} />
                  {hoveredId === tag.id && editingId !== tag.id && (
                    <div
                      onClick={() => startEdit(tag)}
                      style={{
                        position: "absolute", right: -2, top: -2,
                        width: 16, height: 16, borderRadius: "50%",
                        background: "#1A1917", display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M1 6L5.5 1.5l1 1L2 7H1V6z" stroke="white" strokeWidth="0.8" fill="white"/>
                      </svg>
                    </div>
                  )}
                </div>

                {/* Inline editor popover */}
                {editingId === tag.id && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 6px)", left: 0,
                    background: "white", border: "0.5px solid #E2E0DC",
                    borderRadius: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                    zIndex: 100, padding: 12, width: 200,
                  }}>
                    <input
                      autoFocus
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      style={{
                        width: "100%", padding: "6px 8px", borderRadius: 6,
                        border: "0.5px solid #D8D6D0", fontSize: 12, color: "#2C2C2A",
                        outline: "none", marginBottom: 10, boxSizing: "border-box",
                      }}
                    />
                    {/* Color swatches */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
                      {COLOR_SWATCHES.map((swatch, i) => (
                        <div
                          key={i}
                          onClick={() => setEditColor(swatch)}
                          style={{
                            width: 18, height: 18, borderRadius: "50%",
                            background: swatch.color, cursor: "pointer",
                            border: editColor?.color === swatch.color ? "2px solid #1A1917" : "1.5px solid transparent",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "border 0.1s",
                          }}
                        >
                          {editColor?.color === swatch.color && (
                            <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                              <path d="M1 3L3 5L7 1" stroke={swatch.textColor} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                      ))}
                    </div>
                    <div style={{ borderTop: "0.5px solid #F0EEE9", paddingTop: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <button
                        onClick={() => { setDeleteConfirmId(tag.id); setEditingId(null); }}
                        style={{
                          display: "flex", alignItems: "center", gap: 4,
                          background: "none", border: "none", cursor: "pointer",
                          fontSize: 12, color: "#E24B4A", padding: 0,
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 3h8M4 3V2h4v1M3 3l.6 7a.5.5 0 00.5.45h3.8a.5.5 0 00.5-.45L9 3M4.5 5.5v3M7.5 5.5v3" stroke="#E24B4A" strokeWidth="1" strokeLinecap="round"/>
                        </svg>
                        Delete
                      </button>
                      <button
                        onClick={saveEdit}
                        style={{
                          padding: "4px 12px", borderRadius: 6, fontSize: 12, fontWeight: 500,
                          border: "none", background: "#185FA5", color: "white", cursor: "pointer",
                        }}
                      >Save</button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Create new tag + button */}
            <div style={{ position: "relative" }}>
              <div
                onClick={startCreate}
                title="Create tag"
                style={{
                  width: 26, height: 26, borderRadius: "50%",
                  border: "1.5px dashed #C8C6C0", display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "#888780", fontSize: 16, transition: "border-color 0.1s",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#185FA5"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#C8C6C0"}
              >+</div>

              {creatingNew && (
                <div style={{
                  position: "absolute", top: "calc(100% + 6px)", left: 0,
                  background: "white", border: "0.5px solid #E2E0DC",
                  borderRadius: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                  zIndex: 100, padding: 12, width: 200,
                }}>
                  <input
                    autoFocus
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") saveNew(); if (e.key === "Escape") setCreatingNew(false); }}
                    placeholder="Name your tag..."
                    style={{
                      width: "100%", padding: "6px 8px", borderRadius: 6,
                      border: "0.5px solid #D8D6D0", fontSize: 12, color: "#2C2C2A",
                      outline: "none", marginBottom: 10, boxSizing: "border-box",
                    }}
                  />
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
                    {COLOR_SWATCHES.map((swatch, i) => (
                      <div
                        key={i}
                        onClick={() => setNewColor(swatch)}
                        style={{
                          width: 18, height: 18, borderRadius: "50%",
                          background: swatch.color, cursor: "pointer",
                          border: newColor?.color === swatch.color ? "2px solid #1A1917" : "1.5px solid transparent",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "border 0.1s",
                        }}
                      >
                        {newColor?.color === swatch.color && (
                          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                            <path d="M1 3L3 5L7 1" stroke={swatch.textColor} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                      onClick={saveNew}
                      disabled={!newName.trim()}
                      style={{
                        padding: "4px 12px", borderRadius: 6, fontSize: 12, fontWeight: 500,
                        border: "none",
                        background: newName.trim() ? "#185FA5" : "#E8E7E2",
                        color: newName.trim() ? "white" : "#A09E98",
                        cursor: newName.trim() ? "pointer" : "default",
                        transition: "all 0.15s",
                      }}
                    >Save</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <a href="#" style={{ fontSize: 12, color: "#185FA5", textDecoration: "none" }}>Learn more about tags.</a>
        </div>

        <div style={{ borderTop: "0.5px solid #F0EEE9", display: "flex", justifyContent: "flex-end", padding: "12px 24px", borderRadius: "0 0 14px 14px", background: "white" }}>
          <button
            onClick={onClose}
            style={{
              padding: "8px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600,
              border: "none", background: "#1A1917", color: "white", cursor: "pointer",
            }}
          >Done</button>
        </div>
      </div>
    </div>
  );
}

function TagDropdown({ appliedIds, onApply, onClose, tableRef, onTagCreated, onManageTags }) {
  const [staged, setStaged] = useState(new Set(appliedIds));
  const [showUnsaved, setShowUnsaved] = useState(false);
  const [search, setSearch] = useState("");
  const [tags, setTags] = useState(getTagRegistry());
  const ref = useRef();

  const hasChanges = [...staged].some(id => !appliedIds.has(id)) ||
    [...appliedIds].some(id => !staged.has(id));

  useEffect(() => {
    function handleClick(e) {
      const clickedInsideDropdown = ref.current && ref.current.contains(e.target);
      if (!clickedInsideDropdown) {
        if (hasChanges) {
          setShowUnsaved(true);
        } else {
          onClose();
        }
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose, hasChanges, tableRef]);

  function toggle(id) {
    setStaged(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleCreateTag() {
    const trimmed = search.trim();
    if (!trimmed) return;
    const newTag = addNewTag(trimmed);
    setTags(getTagRegistry());
    setStaged(prev => new Set([...prev, newTag.id]));
    setSearch("");
    if (onTagCreated) onTagCreated();
  }

  const filtered = tags.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));
  const showCreateOption = search.trim().length > 0 &&
    !tags.some(t => t.name.toLowerCase() === search.trim().toLowerCase());

  return (
    <>
      {showUnsaved && (
        <UnsavedChangesModal
          onSave={() => { setShowUnsaved(false); onApply(staged); }}
          onDiscard={() => { setShowUnsaved(false); onClose(); }}
        />
      )}

      <div ref={ref} style={{
        position: "absolute",
        top: "calc(100% + 4px)",
        left: 0,
        minWidth: 220,
        background: "white",
        border: "0.5px solid #E2E0DC",
        borderRadius: 10,
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        zIndex: 200,
        overflow: "hidden",
      }}>
        <div style={{ padding: "8px 10px", borderBottom: "0.5px solid #F0EEE9" }}>
          <input
            autoFocus
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search tags..."
            style={{
              width: "100%", border: "none", outline: "none",
              fontSize: 12, background: "transparent", color: "#2C2C2A",
            }}
          />
        </div>

        {filtered.length === 0 && !showCreateOption ? (
          <div style={{ padding: "10px 12px", fontSize: 12, color: "#A09E98" }}>No tags found</div>
        ) : filtered.map(tag => {
          const isStaged = staged.has(tag.id);
          return (
            <div
              key={tag.id}
              onClick={() => toggle(tag.id)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "8px 12px", cursor: "pointer",
                background: "white", borderBottom: "0.5px solid #F5F4F0",
                transition: "background 0.1s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#FAFAF8"}
              onMouseLeave={e => e.currentTarget.style.background = "white"}
            >
              <div style={{
                width: 14, height: 14, borderRadius: 3, flexShrink: 0,
                border: isStaged ? "none" : "0.5px solid #C8C6C0",
                background: isStaged ? "#185FA5" : "white",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.1s",
              }}>
                {isStaged && (
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                    <path d="M1 3L3 5.5L7 1" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <TagPill tag={tag} />
              {appliedIds.has(tag.id) && !isStaged ? null : appliedIds.has(tag.id) && (
                <span style={{ marginLeft: "auto", fontSize: 10, color: "#A09E98" }}>applied</span>
              )}
            </div>
          );
        })}

        {/* Add as new option */}
        {showCreateOption && (
          <div
            onClick={handleCreateTag}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "9px 12px", cursor: "pointer",
              borderTop: filtered.length > 0 ? "0.5px solid #F0EEE9" : "none",
              background: "white", transition: "background 0.1s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#F0F7FF"}
            onMouseLeave={e => e.currentTarget.style.background = "white"}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
              <path d="M6 2v8M2 6h8" stroke="#185FA5" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            <span style={{ fontSize: 12, color: "#185FA5" }}>
              Add <strong style={{ fontWeight: 600 }}>"{search.trim()}"</strong> as new option
            </span>
          </div>
        )}

        <div style={{ padding: "8px 10px", borderTop: "0.5px solid #F0EEE9", background: "#FAFAF8", display: "flex", gap: 6 }}>
          <button
            onClick={() => { if (hasChanges) onApply(staged); }}
            disabled={!hasChanges}
            style={{
              flex: 1, padding: "6px 0", borderRadius: 6, fontSize: 12, fontWeight: 500,
              border: "none", cursor: hasChanges ? "pointer" : "default",
              background: hasChanges ? "#185FA5" : "#E8E7E2",
              color: hasChanges ? "white" : "#A09E98",
              transition: "all 0.15s",
            }}
          >
            Apply
          </button>
          <button
            onClick={onClose}
            style={{
              padding: "6px 10px", borderRadius: 6, fontSize: 12, fontWeight: 500,
              border: "0.5px solid #D8D6D0", background: "white", cursor: "pointer", color: "#444441",
            }}
          >
            Cancel
          </button>
        </div>

        <div style={{ padding: "6px 12px", borderTop: "0.5px solid #F0EEE9" }}>
          <a
            href="#"
            onClick={e => { e.preventDefault(); onManageTags(); }}
            style={{ fontSize: 11, color: "#185FA5", textDecoration: "none" }}
          >Manage company tags</a>
        </div>
      </div>
    </>
  );
}

function TagCell({ project, onUpdateTags, onToast }) {
  const [open, setOpen] = useState(false);
  const [managingTags, setManagingTags] = useState(false);
  const cellRef = useRef();

  const appliedTags = getTagRegistry().filter(t => project.tagIds.has(t.id));

  function handleApply(staged) {
    onUpdateTags(project.id, staged);
    setOpen(false);
    onToast(project.name);
  }

  return (
    <div ref={cellRef} style={{ position: "relative", minWidth: 160 }}>
      {managingTags && (
        <ManageTagsModal
          onClose={() => setManagingTags(false)}
          onRegistryChange={(msg) => { if (msg) onToast(msg); }}
        />
      )}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", flexWrap: "wrap", gap: 4,
          padding: "4px 6px", borderRadius: 6, cursor: "pointer", minHeight: 28,
          background: open ? "#F7F6F2" : "transparent",
          border: open ? "0.5px solid #D8D6D0" : "0.5px solid transparent",
          transition: "all 0.1s",
        }}
        onMouseEnter={e => {
          if (!open) {
            e.currentTarget.style.background = "#F7F6F2";
            e.currentTarget.style.border = "0.5px solid #D8D6D0";
          }
        }}
        onMouseLeave={e => {
          if (!open) {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.border = "0.5px solid transparent";
          }
        }}
      >
        {appliedTags.length > 0 ? (
          appliedTags.map(tag => <TagPill key={tag.id} tag={tag} />)
        ) : (
          <span style={{ fontSize: 12, color: "#C8C6C0" }}>Add tags</span>
        )}
      </div>

      {open && (
        <TagDropdown
          appliedIds={project.tagIds}
          onApply={handleApply}
          onClose={() => setOpen(false)}
          tableRef={cellRef}
          onManageTags={() => { setOpen(false); setManagingTags(true); }}
        />
      )}
    </div>
  );
}

function BulkTagDropdown({ mode, selectedCount, existingTagIds, onConfirm, onClose, onToast }) {
  const isAdd = mode === "add";
  const [staged, setStaged] = useState(new Set());
  const [showUnsaved, setShowUnsaved] = useState(false);
  const [search, setSearch] = useState("");
  const [tags, setTags] = useState(getTagRegistry());
  const [managingTags, setManagingTags] = useState(false);
  const ref = useRef();

  const availableTags = isAdd
    ? tags
    : tags.filter(t => existingTagIds.has(t.id));

  const hasChanges = staged.size > 0;

  const confirmLabel = isAdd
    ? `Add to ${selectedCount} project${selectedCount > 1 ? "s" : ""}`
    : `Remove from ${selectedCount} project${selectedCount > 1 ? "s" : ""}`;

  useEffect(() => {
    function handleClick(e) {
      if (managingTags) return;
      if (ref.current && !ref.current.contains(e.target)) {
        if (hasChanges) setShowUnsaved(true);
        else onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose, hasChanges, managingTags]);

  function toggle(id) {
    setStaged(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleCreateTag() {
    const trimmed = search.trim();
    if (!trimmed) return;
    const newTag = addNewTag(trimmed);
    setTags(getTagRegistry());
    setStaged(prev => new Set([...prev, newTag.id]));
    setSearch("");
  }

  function handleConfirm() {
    if (!hasChanges) return;
    onConfirm(staged, mode);
  }

  const filtered = availableTags.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );
  const showCreateOption = isAdd && search.trim().length > 0 &&
    !tags.some(t => t.name.toLowerCase() === search.trim().toLowerCase());

  return (
    <>
      {showUnsaved && (
        <UnsavedChangesModal
          onSave={() => { setShowUnsaved(false); handleConfirm(); }}
          onDiscard={() => { setShowUnsaved(false); onClose(); }}
        />
      )}
      {managingTags && (
        <ManageTagsModal
          onClose={() => { setManagingTags(false); setTags(getTagRegistry()); }}
          onRegistryChange={(msg) => { setTags(getTagRegistry()); if (msg && onToast) onToast(msg); }}
        />
      )}

      <div ref={ref} style={{
        position: "absolute", top: "calc(100% + 4px)", right: 0,
        background: "white", border: "0.5px solid #E2E0DC",
        borderRadius: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        zIndex: 300, overflow: "hidden", minWidth: 260,
      }}>
        {/* Context label */}
        <div style={{
          padding: "9px 12px 6px",
          borderBottom: "0.5px solid #F0EEE9",
          fontSize: 11, fontWeight: 600, color: "#888780", letterSpacing: "0.04em",
        }}>
          {isAdd
            ? `ADD TAGS — ${selectedCount} PROJECT${selectedCount > 1 ? "S" : ""}`
            : `REMOVE TAGS — ${selectedCount} PROJECT${selectedCount > 1 ? "S" : ""}`}
        </div>

        {/* Body copy for remove mode */}
        {!isAdd && (
          <div style={{ padding: "8px 12px 4px", fontSize: 12, color: "#5F5E5A", lineHeight: 1.5 }}>
            Choose which tags to remove from all the projects selected.
          </div>
        )}

        {/* Search — add mode only */}
        {isAdd && (
          <div style={{ padding: "8px 10px", borderBottom: "0.5px solid #F0EEE9" }}>
            <input
              autoFocus
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search tags..."
              style={{
                width: "100%", border: "none", outline: "none",
                fontSize: 12, background: "transparent", color: "#2C2C2A",
              }}
            />
          </div>
        )}

        {/* Tag list */}
        {filtered.length === 0 && !showCreateOption ? (
          <div style={{ padding: "12px", fontSize: 12, color: "#A09E98", textAlign: "center" }}>
            {isAdd ? "No tags found" : "No tags on selected projects"}
          </div>
        ) : filtered.map(tag => {
          const isChecked = staged.has(tag.id);
          return (
            <div
              key={tag.id}
              onClick={() => toggle(tag.id)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "8px 12px", cursor: "pointer",
                background: "white", borderBottom: "0.5px solid #F5F4F0",
                transition: "background 0.1s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#FAFAF8"}
              onMouseLeave={e => e.currentTarget.style.background = "white"}
            >
              <div style={{
                width: 14, height: 14, borderRadius: 3, flexShrink: 0,
                border: isChecked ? "none" : "0.5px solid #C8C6C0",
                background: isChecked ? "#185FA5" : "white",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.1s",
              }}>
                {isChecked && (
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                    <path d="M1 3L3 5.5L7 1" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <TagPill tag={tag} />
            </div>
          );
        })}

        {/* Add as new option — add mode only */}
        {showCreateOption && (
          <div
            onClick={handleCreateTag}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "9px 12px", cursor: "pointer",
              borderTop: filtered.length > 0 ? "0.5px solid #F0EEE9" : "none",
              background: "white", transition: "background 0.1s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#F0F7FF"}
            onMouseLeave={e => e.currentTarget.style.background = "white"}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
              <path d="M6 2v8M2 6h8" stroke="#185FA5" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            <span style={{ fontSize: 12, color: "#185FA5" }}>
              Add <strong style={{ fontWeight: 600 }}>"{search.trim()}"</strong> as new option
            </span>
          </div>
        )}

        {/* Footer — Apply/Cancel */}
        <div style={{ padding: "8px 10px", borderTop: "0.5px solid #F0EEE9", background: "#FAFAF8", display: "flex", gap: 6 }}>
          <button
            onClick={handleConfirm}
            disabled={!hasChanges}
            style={{
              flex: 1, padding: "6px 0", borderRadius: 6, fontSize: 12, fontWeight: 500,
              border: "none", cursor: hasChanges ? "pointer" : "default",
              background: hasChanges ? "#185FA5" : "#E8E7E2",
              color: hasChanges ? "white" : "#A09E98",
              transition: "all 0.15s",
            }}
          >
            {confirmLabel}
          </button>
          <button
            onClick={onClose}
            style={{
              padding: "6px 10px", borderRadius: 6, fontSize: 12, fontWeight: 500,
              border: "0.5px solid #D8D6D0", background: "white", cursor: "pointer", color: "#444441",
            }}
          >
            Cancel
          </button>
        </div>

        {/* Manage company tags — add mode only */}
        {isAdd && (
          <div style={{ padding: "6px 12px", borderTop: "0.5px solid #F0EEE9" }}>
            <a
              href="#"
              onClick={e => { e.preventDefault(); setManagingTags(true); }}
              style={{ fontSize: 11, color: "#185FA5", textDecoration: "none" }}
            >Manage company tags</a>
          </div>
        )}
      </div>
    </>
  );
}

function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div style={{
      position: "fixed", top: 16, right: 16, zIndex: 2000,
      background: "white", borderRadius: 10,
      border: "0.5px solid #E2E0DC",
      boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
      display: "flex", alignItems: "center", gap: 10,
      padding: "12px 16px", minWidth: 260, maxWidth: 340,
      animation: "slideIn 0.2s ease-out",
    }}>
      <style>{`@keyframes slideIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <div style={{
        width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
        border: "2px solid #22C55E",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1 4L3.5 6.5L9 1" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <span style={{ fontSize: 13, color: "#2C2C2A", flex: 1, lineHeight: 1.4 }}>{message}</span>
      <span
        onClick={onClose}
        style={{ fontSize: 16, color: "#A09E98", cursor: "pointer", lineHeight: 1, flexShrink: 0 }}
      >✕</span>
    </div>
  );
}


export default function App() {
  const [projects, setProjects] = useState(PROJECTS.map(p => ({ ...p, tagIds: new Set(p.tagIds) })));
  const [activeStage, setActiveStage] = useState("Contract Signed");
  const [toast, setToast] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkMode, setBulkMode] = useState(null); // "add" | "remove" | null
  const [tagSubmenu, setTagSubmenu] = useState(false);
  const tagSubmenuRef = useRef();

  useEffect(() => {
    function handleClick(e) {
      if (tagSubmenuRef.current && !tagSubmenuRef.current.contains(e.target)) {
        setTagSubmenu(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function updateTags(projectId, newTagIds) {
    setProjects(prev => prev.map(p =>
      p.id === projectId ? { ...p, tagIds: new Set(newTagIds) } : p
    ));
  }

  function showToast(msg) {
    setToast(msg);
  }

  function toggleSelect(id) {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedIds.size === projects.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(projects.map(p => p.id)));
    }
  }

  function handleBulkConfirm(tagIds, mode) {
    setProjects(prev => prev.map(p => {
      if (!selectedIds.has(p.id)) return p;
      const next = new Set(p.tagIds);
      tagIds.forEach(id => mode === "add" ? next.add(id) : next.delete(id));
      return { ...p, tagIds: next };
    }));
    const count = selectedIds.size;
    showToast(mode === "add" ? `Tags added to ${count} project${count > 1 ? "s" : ""}` : `Tags removed from ${count} project${count > 1 ? "s" : ""}`);
    setBulkMode(null);
    setSelectedIds(new Set());
    setTagSubmenu(false);
  }

  const stages = [
    { label: "Active", count: 0, type: "opportunity" },
    { label: "Inquiry", count: 44, type: "opportunity" },
    { label: "Follow-up", count: 9, type: "project" },
    { label: "Proposal Sent", count: 3, type: "project" },
    { label: "Example of New Step", count: 0, type: "project" },
    { label: "Contract Signed", count: 6, type: "project", active: true },
    { label: "Retainer Paid", count: 6, type: "project" },
    { label: "Planning", count: 0, type: "project" },
    { label: "Completed", count: 2, type: "project" },
    { label: "Archived", count: 1, type: "archived" },
  ];

  return (
    <div style={{
      fontFamily: "'DM Sans', system-ui, sans-serif",
      background: "#F5F4F0",
      minHeight: "100vh",
      display: "flex", flexDirection: "column",
    }}>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      {/* Top nav */}
      <div style={{
        height: 48, background: "#1A1917", display: "flex", alignItems: "center",
        paddingInline: 16, gap: 12, flexShrink: 0,
      }}>
        <div style={{
          width: 30, height: 30, background: "#C9FF57", borderRadius: 6,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 700, color: "#1A1917", letterSpacing: "-0.5px"
        }}>HB</div>
        <div style={{
          flex: 1, maxWidth: 220, background: "#2C2C2A", borderRadius: 7, padding: "6px 10px",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="5" cy="5" r="3.5" stroke="#888780" strokeWidth="1.2"/>
            <path d="M8 8L10.5 10.5" stroke="#888780" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <span style={{ fontSize: 12, color: "#888780" }}>Search</span>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12, color: "#C9FF57", fontWeight: 500 }}>Refer & Earn</span>
          <div style={{
            width: 30, height: 30, borderRadius: "50%", background: "#C9FF57",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, color: "#1A1917"
          }}>A</div>
        </div>
      </div>

      {/* Page content */}
      <div style={{ padding: "28px 28px 0", flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#1A1917", margin: 0 }}>Projects</h1>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button style={{
              padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500,
              border: "0.5px solid #D8D6D0", background: "white", cursor: "pointer", color: "#444441",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6h8M6 2l4 4-4 4" stroke="#444441" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Import
            </button>
            <button style={{
              padding: "7px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600,
              border: "none", background: "#1A1917", cursor: "pointer", color: "white",
            }}>
              Create new
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: "1px solid #E2E0DC" }}>
          {["Main view", "Lead view"].map((tab, i) => (
            <div key={tab} style={{
              padding: "8px 16px", fontSize: 13, fontWeight: i === 0 ? 600 : 400,
              color: i === 0 ? "#185FA5" : "#888780", cursor: "pointer",
              borderBottom: i === 0 ? "2px solid #185FA5" : "2px solid transparent",
              marginBottom: -1,
            }}>{tab}</div>
          ))}
          <div style={{ padding: "8px 10px", color: "#C8C6C0", cursor: "pointer", fontSize: 16, marginBottom: -1 }}>+</div>
        </div>

        {/* Filter row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{
              width: 30, height: 30, borderRadius: 7, border: "0.5px solid #D8D6D0",
              background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 3h8M4 6h4M6 9h0" stroke="#444441" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </button>
            <button style={{
              width: 30, height: 30, borderRadius: 7, border: "0.5px solid #D8D6D0",
              background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 4l2 2 2-2M2 8h4M7 3l3 3-3 3" stroke="#444441" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 4,
              padding: "4px 10px", borderRadius: 20, background: "white",
              border: "0.5px solid #D8D6D0", fontSize: 12, color: "#444441"
            }}>
              <span>All</span>
              <div style={{
                width: 20, height: 20, borderRadius: "50%", background: "#C9FF57",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 9, fontWeight: 700, color: "#1A1917"
              }}>AS</div>
              <span>SS</span>
            </div>
            <button style={{
              padding: "6px 12px", borderRadius: 7, border: "0.5px solid #D8D6D0",
              background: "white", cursor: "pointer", fontSize: 12, color: "#444441",
              display: "flex", alignItems: "center", gap: 5,
            }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 3h8M3 6h6M4 9h4" stroke="#444441" strokeWidth="1.1" strokeLinecap="round"/>
              </svg>
              Customize
            </button>
            <div style={{ display: "flex", gap: 4 }}>
              <button style={{ width: 28, height: 28, borderRadius: 6, border: "0.5px solid #D8D6D0", background: "white", cursor: "pointer" }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ display: "block", margin: "auto" }}>
                  <rect x="1" y="1" width="4" height="4" rx="1" stroke="#444441" strokeWidth="1"/>
                  <rect x="7" y="1" width="4" height="4" rx="1" stroke="#444441" strokeWidth="1"/>
                  <rect x="1" y="7" width="4" height="4" rx="1" stroke="#444441" strokeWidth="1"/>
                  <rect x="7" y="7" width="4" height="4" rx="1" stroke="#444441" strokeWidth="1"/>
                </svg>
              </button>
              <button style={{ width: 28, height: 28, borderRadius: 6, border: "0.5px solid #D8D6D0", background: "white", cursor: "pointer" }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ display: "block", margin: "auto" }}>
                  <path d="M1 2h10M1 6h10M1 10h10" stroke="#444441" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Stage bar */}
        <div style={{ display: "flex", gap: 0, marginBottom: 16, overflowX: "auto" }}>
          {/* All count */}
          <div style={{ padding: "8px 16px 8px 0", flexShrink: 0 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#1A1917" }}>70</div>
            <div style={{ fontSize: 11, color: "#888780" }}>All</div>
          </div>

          {stages.map((stage, i) => (
            <div
              key={stage.label}
              onClick={() => setActiveStage(stage.label)}
              style={{
                padding: "8px 16px", cursor: "pointer", flexShrink: 0, minWidth: 80,
                background: activeStage === stage.label ? "#1A1917" : "white",
                borderRadius: 6, marginRight: 4,
                borderTop: `3px solid ${stage.type === "opportunity" ? "#9F97DD" : stage.type === "archived" ? "#D3D1C7" : "#22C55E"}`,
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 700, color: activeStage === stage.label ? "white" : "#1A1917" }}>{stage.count}</div>
              <div style={{ fontSize: 11, color: activeStage === stage.label ? "rgba(255,255,255,0.7)" : "#888780", lineHeight: 1.3 }}>{stage.label}</div>
            </div>
          ))}
        </div>

        {/* Bulk actions bar / Column headers */}
        {selectedIds.size > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "32px 1fr",
            alignItems: "center",
            padding: "6px 4px",
            marginBottom: 4,
            background: "#F5F4F0",
            borderRadius: 8,
          }}>
            <div style={{ padding: "0 12px" }}>
              <input
                type="checkbox"
                checked={selectedIds.size === projects.length}
                onChange={toggleSelectAll}
                style={{ cursor: "pointer" }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#444441", marginRight: 8, letterSpacing: "0.04em" }}>
                {selectedIds.size} SELECTED: BULK ACTIONS
              </span>

              {/* Other bulk action icons */}
              {[
                "M2 7h7M6 4l3 3-3 3M10 3h1a1 1 0 011 1v6a1 1 0 01-1 1h-1",
                "M2 4h10v1.5H2V4zm1 1.5h8V11a1 1 0 01-1 1H4a1 1 0 01-1-1V5.5zm3 2h2",
                "M2 4.5h10a.5.5 0 01.5.5v5a.5.5 0 01-.5.5H2a.5.5 0 01-.5-.5V5a.5.5 0 01.5-.5zm0 0l5 4 5-4",
                "M3 4h8M5 4V3h4v1M4 4l.7 7.3a.5.5 0 00.5.45h4.6a.5.5 0 00.5-.45L11 4M5.5 6.5v3.5M8.5 6.5v3.5",
                "M9 7a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm-6.5 5.5a3.5 3.5 0 017 0M1 5l2 2 2-2M3 3v4",
              ].map((d, i) => (
                <div key={i} style={{
                  width: 28, height: 28, borderRadius: 6,
                  border: "0.5px solid #D8D6D0", background: "white",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d={d} stroke="#444441" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              ))}

              {/* Tag icon — rightmost */}
              <div ref={tagSubmenuRef} style={{ position: "relative" }}>
                <div
                  title="Add or remove tags"
                  onClick={() => { if (!bulkMode) setTagSubmenu(o => !o); }}
                  style={{
                    width: 28, height: 28, borderRadius: 6,
                    border: `0.5px solid ${bulkMode || tagSubmenu ? "#185FA5" : "#D8D6D0"}`,
                    background: bulkMode || tagSubmenu ? "#E6F1FB" : "white",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 2h5.5l4.5 4.5-5 5L2.5 7 2 2z" stroke={bulkMode || tagSubmenu ? "#185FA5" : "#444441"} strokeWidth="1.1" strokeLinejoin="round"/>
                    <circle cx="6.5" cy="5" r="1" fill={bulkMode || tagSubmenu ? "#185FA5" : "#444441"}/>
                  </svg>
                </div>

                {/* Step 1: add/remove submenu */}
                {tagSubmenu && !bulkMode && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 4px)", right: 0,
                    background: "white", border: "0.5px solid #E2E0DC",
                    borderRadius: 10, boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                    zIndex: 300, overflow: "hidden", minWidth: 220,
                  }}>
                    {[
                      { mode: "add", label: "Choose which tags to add..." },
                      { mode: "remove", label: "Choose which tags to remove..." },
                    ].map(item => (
                      <div
                        key={item.mode}
                        onClick={() => { setBulkMode(item.mode); setTagSubmenu(false); }}
                        style={{
                          display: "flex", alignItems: "center", gap: 10,
                          padding: "10px 14px", cursor: "pointer", fontSize: 13, color: "#2C2C2A",
                          borderBottom: item.mode === "add" ? "0.5px solid #F0EEE9" : "none",
                          background: "white", transition: "background 0.1s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "#FAFAF8"}
                        onMouseLeave={e => e.currentTarget.style.background = "white"}
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M2 2h5.5l4.5 4.5-5 5L2.5 7 2 2z" stroke="#444441" strokeWidth="1.1" strokeLinejoin="round"/>
                          <circle cx="6.5" cy="5" r="1" fill="#444441"/>
                        </svg>
                        {item.label}
                      </div>
                    ))}
                  </div>
                )}

                {/* Step 2: inline tag dropdown */}
                {bulkMode && (
                  <BulkTagDropdown
                    mode={bulkMode}
                    selectedCount={selectedIds.size}
                    existingTagIds={new Set(
                      projects
                        .filter(p => selectedIds.has(p.id))
                        .flatMap(p => [...p.tagIds])
                    )}
                    onConfirm={handleBulkConfirm}
                    onClose={() => setBulkMode(null)}
                    onToast={showToast}
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "32px 1fr 130px 200px 120px 160px 80px",
            alignItems: "center",
            padding: "0 4px",
            marginBottom: 4,
          }}>
            <div style={{ padding: "0 12px" }}>
              <input
                type="checkbox"
                checked={selectedIds.size === projects.length && projects.length > 0}
                onChange={toggleSelectAll}
                style={{ cursor: "pointer" }}
              />
            </div>
            {["NAME", "DATE", "TAGS", "STAGE MOVED", "RECENT ACTIVITY"].map(col => (
              <div key={col} style={{
                padding: "6px 12px",
                fontSize: 11, fontWeight: 600, color: "#888780", letterSpacing: "0.04em",
                whiteSpace: "nowrap",
              }}>
                {col}{col === "DATE" && <span style={{ marginLeft: 4, color: "#C8C6C0" }}>↕</span>}
              </div>
            ))}
            <div />
          </div>
        )}

        {/* Project cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, overflowY: "auto", flex: 1, paddingBottom: 16 }}>
          {projects.map((project, i) => (
            <div
              key={project.id}
              style={{
                display: "grid",
                gridTemplateColumns: "32px 1fr 130px 200px 120px 160px 80px",
                alignItems: "center",
                background: "white",
                borderRadius: 10,
                border: "0.5px solid #E8E6E1",
                padding: "2px 4px",
                transition: "box-shadow 0.1s, border-color 0.1s",
                cursor: "default",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = "0 1px 6px rgba(0,0,0,0.06)";
                e.currentTarget.style.borderColor = "#D3D1CA";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "#E8E6E1";
              }}
            >
              <div style={{ padding: "12px 12px" }}>
                <input
                  type="checkbox"
                  checked={selectedIds.has(project.id)}
                  onChange={() => toggleSelect(project.id)}
                  style={{ cursor: "pointer" }}
                />
              </div>
              <div style={{ padding: "12px 12px", fontWeight: 500, color: "#2C2C2A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: 13 }}>
                {project.name}
              </div>
              <div style={{ padding: "12px 12px", color: "#888780", whiteSpace: "nowrap", fontSize: 13 }}>
                {project.date}
              </div>
              <div style={{ padding: "6px 12px" }}>
                <TagCell project={project} onUpdateTags={updateTags} onToast={(name) => showToast(`Tags updated on ${name}`)} />
              </div>
              <div style={{ padding: "12px 12px", color: "#888780", whiteSpace: "nowrap", fontSize: 13 }}>
                {project.stageMoved}
              </div>
              <div style={{ padding: "12px 12px", whiteSpace: "nowrap", fontSize: 13 }}>
                {project.recentActivity && (
                  <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#444441" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", flexShrink: 0 }} />
                    {project.recentActivity}
                  </span>
                )}
              </div>
              <div style={{ padding: "12px 12px", display: "flex", gap: 6, justifyContent: "flex-end", alignItems: "center" }}>
                {i === 0 && (
                  <div style={{
                    width: 24, height: 24, borderRadius: 6, background: "#EEF2FF",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 1l1.5 3 3.5.5-2.5 2.5.6 3.5L6 9l-3.1 1.5.6-3.5L1 4.5 4.5 4z" fill="#7C86FF"/>
                    </svg>
                  </div>
                )}
                <div style={{
                  width: 24, height: 24, borderRadius: 6,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "#A09E98", fontSize: 16, fontWeight: 700, lineHeight: 1,
                }}>⋯</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
