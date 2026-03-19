import { useState, useEffect, useRef } from "react";

const AVAILABLE_TAGS = [
  { id: 1, label: "Test tag" },
  { id: 2, label: "testing tag 2" },
  { id: 3, label: "VIP Client" },
  { id: 4, label: "Wedding" },
  { id: 5, label: "Follow-up" },
  { id: 6, label: "Corporate" },
  { id: 7, label: "Venue" },
  { id: 8, label: "Referred" },
];

const PROJECT_TYPES = [
  "Any project type", "Branding", "Business Funding", "Coaching",
  "Consulting", "Corporate Events", "Photography", "Wedding",
];

const font = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;

const c = {
  white: "#FFFFFF", bg: "#F7F6F4", canvasBg: "#FBFAF8",
  border: "#E5E2DC", borderLight: "#EDEBE7", borderFocus: "#222222", borderError: "#E8956A",
  text: "#222222", textSecondary: "#6B6B6B", textTertiary: "#9B9B9B",
  blue: "#4B7BF5", tagBg: "#FDF6E3", tagBorder: "#F0E4C0", tagText: "#6B5D2F",
  checkBlue: "#4B7BF5", triggerBorderDashed: "#E8956A", actionBorder: "#E5E2DC",
  nodeIcon: "#F0A878", actionIcon: "#7B8FD4", greenPlus: "#7BC47F", bluePlus: "#6B8FE8",
  warnOrange: "#E8956A",
  andText: "#3B5FCC", andBg: "#EEF2FF",
  orText: "#C26A20", orBg: "#FFF8F0",
  conditionIcon: "#E8956A", waitIcon: "#6B6B6B", actionArrow: "#6B8FE8",
  selectedRow: "#F5F4F2",
};

/* ─── Dropdown ─── */
function Dropdown({ value, options, open, onToggle, onSelect, error }) {
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onToggle(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onToggle]);
  return (
    <div style={{ position: "relative" }} ref={ref}>
      <div onClick={() => onToggle(!open)} style={{
        padding: "10px 14px", borderRadius: "8px",
        border: `1.5px solid ${error ? c.borderError : open ? c.borderFocus : c.border}`,
        fontSize: "13px", color: value ? c.text : c.textTertiary,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        cursor: "pointer", transition: "border-color 0.12s ease", background: c.white,
      }}>{value}<span style={{ fontSize: "10px", color: c.textTertiary }}>▾</span></div>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 2px)", left: 0, right: 0,
          background: c.white, border: `1px solid ${c.border}`, borderRadius: "8px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)", zIndex: 10, overflow: "hidden",
        }}>
          {options.map((opt) => (
            <div key={opt.value} onClick={() => { onSelect(opt.value); onToggle(false); }}
              style={{ padding: "10px 14px", cursor: "pointer", fontSize: "13px", color: c.text, transition: "background 0.1s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = c.selectedRow; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Checkbox Dropdown ─── */
function CheckboxDropdown({ selectedIds, allItems, onToggle, open, onOpenChange, placeholder, error }) {
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onOpenChange(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onOpenChange]);
  const selectedLabels = allItems.filter(i => selectedIds.includes(i.id)).map(i => i.label);
  return (
    <div style={{ position: "relative" }} ref={ref}>
      <div onClick={() => onOpenChange(!open)} style={{
        padding: "10px 14px", borderRadius: "8px",
        border: `1.5px solid ${error ? c.borderError : open ? c.borderFocus : c.border}`,
        fontSize: "13px", color: selectedLabels.length > 0 ? c.text : c.textTertiary,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        cursor: "pointer", background: c.white,
      }}>{selectedLabels.length > 0 ? selectedLabels.join(", ") : placeholder}<span style={{ fontSize: "10px", color: c.textTertiary }}>▾</span></div>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 2px)", left: 0, right: 0,
          background: c.white, border: `1px solid ${c.border}`, borderRadius: "8px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)", zIndex: 10, maxHeight: "240px", overflowY: "auto",
        }}>
          {allItems.map((item) => {
            const checked = selectedIds.includes(item.id);
            return (
              <div key={item.id} onClick={() => onToggle(item.id)} style={{
                display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px",
                cursor: "pointer", background: checked ? "#FAFAF8" : "transparent",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = c.selectedRow; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = checked ? "#FAFAF8" : "transparent"; }}>
                <Checkbox checked={checked} />
                <span style={{ fontSize: "13px", color: c.text }}>{item.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Tag Chip ─── */
function TagChip({ label, onRemove }) {
  const [hoverX, setHoverX] = useState(false);
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "4px",
      padding: "3px 8px 3px 10px", borderRadius: "4px",
      background: c.tagBg, border: `1px solid ${c.tagBorder}`,
      fontFamily: font, fontSize: "13px", fontWeight: 500, color: c.tagText, whiteSpace: "nowrap",
    }}>
      {label}
      <button onClick={onRemove} onMouseEnter={() => setHoverX(true)} onMouseLeave={() => setHoverX(false)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "none", border: "none", cursor: "pointer", padding: "0 1px",
          color: hoverX ? c.text : c.tagText, fontSize: "15px", lineHeight: 1, fontWeight: 400, transition: "color 0.1s",
        }}>×</button>
    </span>
  );
}

/* ─── Inline Logic Toggle (the "or" / "and" between chips) ─── */
function InlineLogicToggle({ mode, onToggle }) {
  const [hovered, setHovered] = useState(false);
  const isAnd = mode === "all";
  return (
    <button
      onClick={onToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        padding: "2px 8px", borderRadius: "4px",
        background: hovered
          ? (isAnd ? c.andBg : c.orBg)
          : "transparent",
        border: `1px dashed ${isAnd ? c.andText : c.orText}`,
        fontFamily: font, fontSize: "11px", fontWeight: 600,
        color: isAnd ? c.andText : c.orText,
        cursor: "pointer", transition: "all 0.15s ease",
        textTransform: "lowercase", letterSpacing: "0.02em",
        outline: "none", lineHeight: "18px",
        minWidth: "28px",
      }}
    >
      {isAnd ? "and" : "or"}
    </button>
  );
}

function Checkbox({ checked }) {
  return (
    <div style={{
      width: "18px", height: "18px", borderRadius: "4px",
      border: checked ? "none" : `1.5px solid ${c.border}`,
      background: checked ? c.checkBlue : c.white,
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>
      {checked && (
        <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
          <path d="M1 4.5L3.5 7L9.5 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

function WarnIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2L18.66 17H1.34L10 2Z" stroke={c.warnOrange} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      <path d="M10 8V11" stroke={c.warnOrange} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="14" r="0.8" fill={c.warnOrange} />
    </svg>
  );
}

function ConnectorWithMenu({ color }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const menuItems = [
    { icon: "→", iconColor: c.actionArrow, label: "Action", desc: "Add an action to the automation workflow." },
    { icon: "◷", iconColor: c.waitIcon, label: "Wait", desc: "Set a wait time or wait until a specific event occurs." },
    { icon: "◇", iconColor: c.conditionIcon, label: "Condition", desc: "Select a condition and set what happens if it is met or not." },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }} ref={ref}>
      <div style={{ width: "1.5px", height: "24px", background: c.border }} />
      <div onClick={() => setOpen(!open)} style={{
        width: "22px", height: "22px", borderRadius: "50%", background: c.white,
        border: `1.5px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "14px", color: color, fontWeight: 400, lineHeight: 1, cursor: "pointer",
      }}>+</div>
      {open && (
        <div style={{
          position: "absolute", top: "50px", left: "50%", transform: "translateX(-50%)",
          background: c.white, borderRadius: "12px", border: `1px solid ${c.borderLight}`,
          boxShadow: "0 8px 30px rgba(0,0,0,0.1)", zIndex: 30, width: "280px", overflow: "hidden",
        }}>
          {menuItems.map((item, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start", gap: "12px", padding: "14px 16px",
              cursor: "pointer", transition: "background 0.1s",
              borderBottom: i < menuItems.length - 1 ? `1px solid ${c.borderLight}` : "none",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#FAFAF8"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "50%", background: c.bg,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                fontSize: "16px", color: item.iconColor,
              }}>{item.icon}</div>
              <div>
                <div style={{ fontFamily: font, fontSize: "14px", fontWeight: 600, color: c.text }}>{item.label}</div>
                <div style={{ fontFamily: font, fontSize: "12px", color: c.textSecondary, lineHeight: 1.4, marginTop: "2px" }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{ width: "1.5px", height: "24px", background: c.border }} />
    </div>
  );
}

function TriggerNode({ label, showWarning }) {
  return (
    <div style={{
      padding: "20px 28px", borderRadius: "12px", border: `2px dashed ${c.triggerBorderDashed}`,
      background: c.white, display: "flex", alignItems: "center", gap: "14px", width: "340px",
    }}>
      <div style={{
        width: "40px", height: "40px", borderRadius: "10px", background: "#FFF0E8",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M3 3L10 1L17 3V9C17 13.5 10 19 10 19C10 19 3 13.5 3 9V3Z" stroke={c.nodeIcon} strokeWidth="1.8" fill="none" />
          <path d="M7 9L9 11L13 7" stroke={c.nodeIcon} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: font, fontSize: "14px", fontWeight: 600, color: c.text }}>{label}</div>
        <div style={{ fontFamily: font, fontSize: "12px", color: c.textTertiary, marginTop: "2px" }}>Trigger</div>
      </div>
      {showWarning && <WarnIcon />}
    </div>
  );
}

function ActionNode({ label, desc }) {
  return (
    <div style={{
      padding: "20px 28px", borderRadius: "12px", border: `1px solid ${c.actionBorder}`,
      background: c.white, display: "flex", alignItems: "center", gap: "14px", width: "340px",
    }}>
      <div style={{
        width: "40px", height: "40px", borderRadius: "10px", background: "#EEF0FA",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="2" y="2" width="14" height="14" rx="2" stroke={c.actionIcon} strokeWidth="1.5" fill="none" />
          <path d="M5 6H13M5 9H13M5 12H10" stroke={c.actionIcon} strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <div style={{ fontFamily: font, fontSize: "14px", fontWeight: 600, color: c.text }}>{label}</div>
        <div style={{ fontFamily: font, fontSize: "12px", color: c.textTertiary, marginTop: "2px" }}>{desc}</div>
      </div>
    </div>
  );
}

/* ═══════ MAIN ═══════ */
export default function HoneyBookAutomation() {
  const [tagMode, setTagMode] = useState("specific");
  const [tagModeDropOpen, setTagModeDropOpen] = useState(false);
  const [selectedTagIds, setSelectedTagIds] = useState([1, 2]);
  const [addTagsOpen, setAddTagsOpen] = useState(false);
  const [matchMode, setMatchMode] = useState("any");

  const [projTypeMode, setProjTypeMode] = useState("any");
  const [projTypeModeDropOpen, setProjTypeModeDropOpen] = useState(false);
  const [projTypeSelectorOpen, setProjTypeSelectorOpen] = useState(false);
  const [selectedProjTypeIds, setSelectedProjTypeIds] = useState([]);

  const addTagsRef = useRef(null);

  const selectedTags = AVAILABLE_TAGS.filter((t) => selectedTagIds.includes(t.id));
  const toggleTag = (id) => setSelectedTagIds((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  const removeTag = (id) => setSelectedTagIds((p) => p.filter((x) => x !== id));
  const toggleProjType = (id) => setSelectedProjTypeIds((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  const toggleMatchMode = () => setMatchMode((m) => m === "any" ? "all" : "any");

  const projTypeItems = PROJECT_TYPES.filter(t => t !== "Any project type").map((t, i) => ({ id: i + 1, label: t }));

  const needsTags = tagMode === "specific" && selectedTagIds.length === 0;
  const needsProjType = projTypeMode === "specific" && selectedProjTypeIds.length === 0;
  const showWarning = needsTags || needsProjType;

  useEffect(() => {
    const handler = (e) => { if (addTagsRef.current && !addTagsRef.current.contains(e.target)) setAddTagsOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const triggerLabel =
    tagMode === "any_tag" ? "Tags added to project"
    : selectedTags.length === 0 ? "Tags added to project"
    : selectedTags.length === 1 ? `"${selectedTags[0].label}" added to project`
    : matchMode === "any" ? `Any of ${selectedTags.length} tags added to project`
    : `All ${selectedTags.length} tags added to project`;

  // Helper text based on mode
  const helperText = selectedTags.length < 2
    ? "If one or more of these tags are added, the step will be triggered."
    : matchMode === "any"
    ? "This automation will trigger separately each time one of these tags is added."
    : "This automation will trigger once, only after all of these tags are on the project.";

  return (
    <div style={{ fontFamily: font, display: "flex", flexDirection: "column", height: "100%", background: c.canvasBg, overflow: "hidden", position: "relative" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Top bar */}
      <div style={{
        position: "sticky", top: 0, left: 0, right: 0, height: "52px", flexShrink: 0,
        background: c.white, borderBottom: `1px solid ${c.borderLight}`,
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", zIndex: 20,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "18px", color: c.textTertiary, cursor: "pointer" }}>←</span>
          <span style={{ fontSize: "15px", fontWeight: 600, color: c.text }}>New automation</span>
          <div style={{
            display: "flex", alignItems: "center", gap: "6px", padding: "3px 10px",
            borderRadius: "12px", background: "#E8F5E9", fontSize: "12px", fontWeight: 500, color: "#2E7D32",
          }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#4CAF50" }} />Active
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button style={{
            padding: "7px 16px", borderRadius: "6px", border: `1px solid ${c.border}`,
            background: c.white, fontFamily: font, fontSize: "13px", fontWeight: 500, color: c.text, cursor: "pointer",
          }}>Test run</button>
          <button style={{
            padding: "7px 20px", borderRadius: "6px", border: "none",
            background: c.text, fontFamily: font, fontSize: "13px", fontWeight: 600, color: c.white, cursor: "pointer",
          }}>Update</button>
        </div>
      </div>

      {/* Body row: canvas + right panel */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

      {/* Canvas */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", paddingRight: 0, overflow: "auto",
      }}>
        <TriggerNode label={triggerLabel} showWarning={showWarning} />
        <ConnectorWithMenu color={c.greenPlus} />
        <ActionNode label="Create task" desc="Created a task based on the session..." />
        <ConnectorWithMenu color={c.bluePlus} />
        <div style={{ fontFamily: font, fontSize: "13px", color: c.textTertiary, marginTop: "4px" }}>End automation</div>
      </div>

      {/* ─── Right Panel ─── */}
      <div style={{
        width: "380px", flexShrink: 0,
        background: c.white, borderLeft: `1px solid ${c.borderLight}`, overflowY: "auto", zIndex: 10,
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 24px", borderBottom: `1px solid ${c.borderLight}`,
        }}>
          <span style={{ fontSize: "16px", color: c.textTertiary, cursor: "pointer", lineHeight: 1 }}>✕</span>
          <span style={{ fontSize: "15px", fontWeight: 600, color: c.text }}>Trigger</span>
          <span style={{ fontSize: "13px", fontWeight: 500, color: c.blue, cursor: "pointer" }}>Change</span>
        </div>

        <div style={{ padding: "24px" }}>
          {/* Trigger type */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{ fontSize: "14px", fontWeight: 600, color: c.text, marginBottom: "4px" }}>Trigger</div>
            <div style={{ fontSize: "13px", color: c.textSecondary, marginBottom: "10px", lineHeight: 1.45 }}>
              Set what should cause the automation to start running.
            </div>
            <div style={{
              padding: "10px 14px", borderRadius: "8px", border: `1px solid ${c.border}`,
              fontSize: "13px", color: c.text, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer",
            }}>Tags added to project<span style={{ fontSize: "10px", color: c.textTertiary }}>▾</span></div>
          </div>

          {/* ─── Select project tags ─── */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "14px", fontWeight: 600, color: c.text, marginBottom: "10px" }}>Select project tags</div>

            <Dropdown
              value={tagMode === "any_tag" ? "Any tag in the project" : "Specific tags"}
              options={[
                { value: "any_tag", label: "Any tag in the project" },
                { value: "specific", label: "Specific tags" },
              ]}
              open={tagModeDropOpen}
              onToggle={setTagModeDropOpen}
              onSelect={(val) => setTagMode(val)}
            />

            {tagMode === "specific" && (
              <div style={{ marginTop: "12px" }}>

                {/* ─── Tag chips with inline AND/OR toggles ─── */}
                {selectedTags.length > 0 && (
                  <div style={{
                    display: "flex", flexWrap: "wrap", alignItems: "center",
                    gap: "6px", marginBottom: "12px",
                  }}>
                    {selectedTags.map((tag, i) => (
                      <span key={tag.id} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <TagChip label={tag.label} onRemove={() => removeTag(tag.id)} />
                        {i < selectedTags.length - 1 && selectedTags.length >= 2 && (
                          <InlineLogicToggle mode={matchMode} onToggle={toggleMatchMode} />
                        )}
                      </span>
                    ))}
                  </div>
                )}

                {/* Add tags dropdown */}
                <div style={{ position: "relative" }} ref={addTagsRef}>
                  <div onClick={() => setAddTagsOpen(!addTagsOpen)} style={{
                    padding: "10px 14px", borderRadius: "8px",
                    border: `1.5px solid ${needsTags ? c.borderError : addTagsOpen ? c.borderFocus : c.border}`,
                    fontSize: "13px", color: c.textTertiary,
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    cursor: "pointer", transition: "border-color 0.12s ease",
                  }}>Add tags...<span style={{ fontSize: "10px", color: c.textTertiary }}>▾</span></div>
                  {addTagsOpen && (
                    <div style={{
                      position: "absolute", top: "calc(100% + 2px)", left: 0, right: 0,
                      background: c.white, border: `1px solid ${c.border}`, borderRadius: "8px",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.08)", zIndex: 10, maxHeight: "200px", overflowY: "auto",
                    }}>
                      {AVAILABLE_TAGS.map((tag) => (
                        <div key={tag.id} onClick={() => toggleTag(tag.id)} style={{
                          display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px",
                          cursor: "pointer", background: selectedTagIds.includes(tag.id) ? "#FAFAF8" : "transparent",
                        }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = c.selectedRow; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = selectedTagIds.includes(tag.id) ? "#FAFAF8" : "transparent"; }}>
                          <Checkbox checked={selectedTagIds.includes(tag.id)} />
                          <span style={{ fontSize: "13px", color: c.text }}>{tag.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Dynamic helper text */}
                {selectedTags.length > 0 && (
                  <div style={{
                    fontSize: "13px",
                    color: selectedTags.length >= 2
                      ? (matchMode === "all" ? c.andText : c.orText)
                      : c.textSecondary,
                    lineHeight: 1.5, marginTop: "12px",
                    transition: "color 0.2s ease",
                  }}>
                    {helperText}
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={{ height: "1px", background: c.borderLight, margin: "4px 0 20px" }} />

          {/* ─── Select project type ─── */}
          <div>
            <div style={{ fontSize: "14px", fontWeight: 600, color: c.text, marginBottom: "10px" }}>Select project type</div>
            <Dropdown
              value={projTypeMode === "any" ? "Any project type" : "Specific project types"}
              options={[
                { value: "any", label: "Any project type" },
                { value: "specific", label: "Specific project types" },
              ]}
              open={projTypeModeDropOpen}
              onToggle={setProjTypeModeDropOpen}
              onSelect={(val) => { setProjTypeMode(val); if (val === "any") setSelectedProjTypeIds([]); }}
            />
            {projTypeMode === "specific" && (
              <div style={{ marginTop: "12px" }}>
                <CheckboxDropdown
                  selectedIds={selectedProjTypeIds}
                  allItems={projTypeItems}
                  onToggle={toggleProjType}
                  open={projTypeSelectorOpen}
                  onOpenChange={setProjTypeSelectorOpen}
                  placeholder="Select project type"
                  error={needsProjType}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      </div>{/* end body row */}
    </div>
  );
}
