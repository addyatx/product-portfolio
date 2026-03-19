export const entries = [
  {
    id: "tag-trigger-logic",
    title: "Tag Trigger Logic",
    subtitle: "AND/OR Conditions + Apply Flow",
    area: "Automations",
    status: "In Review",
    statusColor: "#F59E0B",
    date: "March 2026",
    description: "Redesigned the automation trigger panel to support multi-tag logic with explicit AND/OR conditions and a staged apply flow — preventing accidental automation triggers.",
    tags: ["Automations", "Triggers", "UX Consistency"],
    startHere: "Open the 'Add tags...' dropdown in the right panel and select 2+ tags to see the AND/OR toggle appear between them.",
    brief: {
      problem: [
        "Tags applied instantly on click in the trigger setup panel — any accidental selection could immediately fire an automation mid-configuration.",
        "There was no way to express multi-tag logic, collapsing meaningfully different trigger behaviors ('Tag A AND B' vs 'Tag A OR B') into a single ambiguous selection.",
        "The pattern was inconsistent with how Smart Files and automation templates already handled staged changes elsewhere in HoneyBook.",
      ],
      signal: [
        "JP flagged the UX inconsistency during an automation trigger review — tags were the only place in the product where changes committed without confirmation.",
        "Carmel's team identified that the missing AND/OR logic was causing members to build redundant automation stacks to approximate conditional behavior.",
      ],
      solution: [
        "Tag selections are now held in a pending state until the member clicks Apply — an Unsaved Changes modal intercepts accidental exits.",
        "AND/OR logic is toggled inline between tag chips, so the operator reads naturally as part of the tag chain rather than a separate config step.",
        "Helper text below the chips dynamically describes what the current logic will actually do, in plain English.",
      ],
    },
    whatChanged: [
      {
        step: 1,
        label: "Before: instant apply",
        description: "Clicking a tag immediately committed it to the trigger — no confirmation, no staging. One accidental click could activate an automation.",
        after: "Now: tags are staged first. Nothing commits until you click Apply.",
      },
      {
        step: 2,
        label: "New: AND/OR toggle between chips",
        description: "When 2+ tags are selected, a small 'and'/'or' pill appears inline between each chip. Click it to toggle the logic mode for the whole trigger.",
        after: "The helper text below updates in real time to describe exactly what the automation will do.",
      },
      {
        step: 3,
        label: "New: Unsaved changes modal",
        description: "If you click outside the tag panel with unapplied changes, a modal intercepts — giving you the choice to Apply or Discard rather than silently losing your work.",
        after: "Consistent with the same pattern already used in Smart Files and automation templates.",
      },
    ],
    tryThese: [
      "Open 'Add tags...' and select 2 or more tags",
      "Click the 'and' pill between tag chips — it toggles to 'or' and the helper text updates",
      "Stage some tags, then click away — the Unsaved Changes modal appears",
      "Click 'Update' with no tags selected to see the validation error state",
    ],
  },
  {
    id: "pipeline-tag-actions",
    title: "Pipeline Tag Actions",
    subtitle: "Per-Project + Bulk Tagging Flows",
    area: "Pipeline",
    status: "In Review",
    statusColor: "#F59E0B",
    date: "March 2026",
    description: "End-to-end redesign of how tags are applied, removed, and managed from the pipeline view — with staged apply patterns, bulk add/remove flows, and full tag lifecycle management.",
    tags: ["Pipeline", "Tags", "Bulk Actions"],
    startHere: "Click any 'Add tags' cell in the Tags column to open the tag dropdown for that project.",
    brief: {
      problem: [
        "Tags applied instantly on click in the pipeline table — an accidental click on a project with tag-based automations could silently fire a workflow.",
        "There was no bulk tagging — members with large project lists had to tag projects one at a time.",
        "Manage Tags was only accessible through account settings, disconnected from the point of use.",
      ],
      signal: [
        "Support ticket patterns showed members confused about automations triggering unexpectedly after editing tags from the pipeline.",
        "Community threads listed bulk tagging as a top pipeline workflow request.",
        "Carmel's team surfaced the accidental-trigger risk directly during automation QA testing.",
      ],
      solution: [
        "Per-project tagging now uses the same Apply/Cancel staging pattern as the trigger panel — an Unsaved Changes modal catches accidental exits.",
        "Bulk tagging introduces a two-step flow: select projects → choose Add or Remove → pick tags. The Remove flow pre-filters to only tags already on the selected projects.",
        "Manage Company Tags is now accessible directly from any tag dropdown, with inline create, rename, recolor, and delete.",
      ],
    },
    whatChanged: [
      {
        step: 1,
        label: "Before: instant apply on click",
        description: "Clicking a tag in any dropdown immediately applied it with no confirmation — identical problem to the trigger panel.",
        after: "Now: tags are staged with Apply/Cancel buttons. Changes don't commit until you confirm.",
      },
      {
        step: 2,
        label: "New: Unsaved changes modal",
        description: "Clicking outside a dropdown with staged (unapplied) changes now shows a modal — Apply or Discard. Previously those changes were silently lost.",
        after: "Consistent with Smart Files and automation template patterns.",
      },
      {
        step: 3,
        label: "New: Bulk add flow",
        description: "Select 2+ projects → click the tag icon in the bulk toolbar → choose 'Add tags'. Works like the individual dropdown with search and 'Add as new option'.",
        after: "A toast confirms how many projects were updated.",
      },
      {
        step: 4,
        label: "New: Bulk remove flow",
        description: "Same bulk toolbar → 'Remove tags' — but the tag list is pre-filtered to only show tags that exist on at least one selected project. No noise.",
        after: "Reduces cognitive load vs. showing the full tag list when removing.",
      },
      {
        step: 5,
        label: "New: Manage tags from the dropdown",
        description: "A 'Manage company tags' link now lives at the bottom of every tag dropdown — no more navigating to account settings to rename or delete a tag.",
        after: "Inline edit popover supports rename, recolor, and delete with a smart confirmation that avoids 'tag tag' phrasing.",
      },
    ],
    tryThese: [
      "Click any 'Add tags' cell in the Tags column to open the per-project dropdown",
      "Stage some tags, then click outside — the Unsaved Changes modal intercepts",
      "Check 2+ project rows → bulk toolbar appears → click the tag icon (rightmost)",
      "In the bulk submenu, choose 'Add tags' → select tags → apply to selected projects",
      "Click 'Manage company tags' inside any dropdown → hover a tag to edit or delete",
    ],
  },
];
