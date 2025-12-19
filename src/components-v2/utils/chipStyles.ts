export interface ChipStyle {
  bg: string;
  text: string;
  label: string;
  padding?: string;
  size?: "compact" | "regular";
}

type Matcher = {
  labels: string[];
  bg: string;
  text: string;
  fallbackLabel?: string;
  padding?: string;
  size?: "compact" | "regular";
};

const formatChipLabel = (value?: string): string => {
  if (!value) return "";

  return value
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const normalize = (value?: string) => (value || "").toLowerCase();

const firstMatchingStyle = (
  value: string | undefined,
  entries: Matcher[],
  defaultStyle: ChipStyle
): ChipStyle => {
  const normalized = normalize(value);
  for (const entry of entries) {
    if (entry.labels.some((label) => normalized.includes(label))) {
      return {
        bg: entry.bg,
        text: entry.text,
        label: entry.fallbackLabel || formatChipLabel(value) || "",
        padding: entry.padding,
        size: entry.size,
      };
    }
  }
  return defaultStyle;
};

const reasonBase = {
  defaultStyle: {
    bg: "#f7f7f7",
    text: "#6a6a6a",
    label: "Other",
  } as ChipStyle,
};

const typeStyles = {
  type1: { bg: "#fff4e4", text: "#8f5400" },
  type2: { bg: "#ffe2fa", text: "#91127c" },
  type3: { bg: "#e5f2ff", text: "#0a4e8c" },
  type4: { bg: "#ffe5e4", text: "#a4181a" },
  type5: { bg: "#fcffe5", text: "#7c670a" },
  type6: { bg: "#f2e5ff", text: "#5a1a8c" },
  type7: { bg: "#f7f7f7", text: "#6a6a6a" },
};

const userMessageReasons: Matcher[] = [
  {
    labels: ["harassment", "threat"],
    ...typeStyles.type1,
    fallbackLabel: "Harassment\n/ Threats",
  },
  {
    labels: ["made me uncomfortable", "made_me_uncomfortable", "uncomfortable"],
    ...typeStyles.type2,
    fallbackLabel: "Made Me\nUncomfortable",
  },
  {
    labels: ["explicit", "nudity", "inappropriate"],
    ...typeStyles.type3,
    fallbackLabel: "Explicit / Nudity\n/ Inappropriate",
  },
  {
    labels: ["self", "harmful behavior", "self-injury"],
    ...typeStyles.type4,
    fallbackLabel: "Self-Injury /\nHarmful Behavior",
  },
  {
    labels: ["spam", "fake profile", "misuse"],
    ...typeStyles.type5,
    fallbackLabel: "Spam, Fake Profile,\nor Misuse",
  },
  {
    labels: ["underage", "policy violation"],
    ...typeStyles.type6,
    fallbackLabel: "Underage User or\nPolicy Violation",
  },
  { labels: ["other"], ...typeStyles.type7, fallbackLabel: "Other" },
];

const eventReasons: Matcher[] = [
  {
    labels: ["explicit", "nudity", "inappropriate"],
    ...typeStyles.type3,
    fallbackLabel: "Explicit / Nudity\n/ Inappropriate",
  },
  {
    labels: ["harmful", "unsafe behavior"],
    ...typeStyles.type4,
    fallbackLabel: "Harmful /\nUnsafe Behavior",
  },
  {
    labels: ["spam", "fake profile", "misuse"],
    ...typeStyles.type5,
    fallbackLabel: "Spam, Fake Profile,\nor Misuse",
  },
  {
    labels: ["hate speech", "offensive"],
    ...typeStyles.type2,
    fallbackLabel: "Hate Speech /\nOffensive",
  },
  {
    labels: ["discriminatory", "exclusionary"],
    ...typeStyles.type6,
    fallbackLabel: "Discriminatory /\nExclusionary",
  },
  {
    labels: ["duplicate"],
    ...typeStyles.type1,
    fallbackLabel: "Duplicate Event",
  },
  { labels: ["other"], ...typeStyles.type7, fallbackLabel: "Other" },
];

const ideaReasons: Matcher[] = [
  {
    labels: ["harassment", "threat"],
    ...typeStyles.type2,
    fallbackLabel: "Harassment /\nThreats",
  },
  {
    labels: ["spam", "fake profile", "misuse"],
    ...typeStyles.type5,
    fallbackLabel: "Spam, Fake Profile,\nor Misuse",
  },
  {
    labels: ["self", "harmful behavior", "self-injury"],
    ...typeStyles.type4,
    fallbackLabel: "Self-Injury /\nHarmful Behavior",
  },
  {
    labels: ["harmful", "dangerous"],
    ...typeStyles.type3,
    fallbackLabel: "Harmful /\nDangerous Content",
  },
  {
    labels: ["discriminatory", "exclusionary"],
    ...typeStyles.type6,
    fallbackLabel: "Discriminatory /\nExclusionary",
  },
  {
    labels: ["intellectual"],
    ...typeStyles.type1,
    fallbackLabel: "Intellectual\nproperty",
  },
  { labels: ["other"], ...typeStyles.type7, fallbackLabel: "Other" },
];

const spaceReasons: Matcher[] = [
  {
    labels: ["inappropriate", "offensive"],
    ...typeStyles.type1,
    fallbackLabel: "Inappropriate\nor offensive",
  },
  {
    labels: ["underage", "policy violation"],
    ...typeStyles.type6,
    fallbackLabel: "Underage User or\nPolicy Violation",
  },
  {
    labels: ["misinformation", "false", "misleading"],
    ...typeStyles.type2,
    fallbackLabel: "Misinformation\n(false or misleading)",
  },
  {
    labels: ["hate speech", "discrimination"],
    ...typeStyles.type4,
    fallbackLabel: "Hate speech\nor discrimination",
  },
  {
    labels: ["unsafe", "harmful"],
    ...typeStyles.type5,
    fallbackLabel: "Unsafe or harmful\nbehavior",
  },
  {
    labels: ["solicitation", "sales"],
    ...typeStyles.type3,
    fallbackLabel: "Solicitation or sales",
  },
  {
    labels: ["duplicate", "unauthorized", "impersonation"],
    ...typeStyles.type6,
    fallbackLabel: "Duplicate, unauthorized,\nor impersonation",
  },
  { labels: ["other"], ...typeStyles.type7, fallbackLabel: "Other" },
];

const getReasonChipStyle = (reason?: string): ChipStyle =>
  firstMatchingStyle(
    reason,
    [...userMessageReasons, ...eventReasons, ...ideaReasons, ...spaceReasons],
    {
      ...reasonBase.defaultStyle,
      label: formatChipLabel(reason) || "Other",
    }
  );

const getUserReasonChipStyle = (reason?: string): ChipStyle =>
  firstMatchingStyle(reason, userMessageReasons, {
    ...reasonBase.defaultStyle,
    label: formatChipLabel(reason) || "Other",
  });

const getEventReasonChipStyle = (reason?: string): ChipStyle =>
  firstMatchingStyle(reason, eventReasons, {
    ...reasonBase.defaultStyle,
    label: formatChipLabel(reason) || "Other",
  });

const getIdeaReasonChipStyle = (reason?: string): ChipStyle =>
  firstMatchingStyle(reason, ideaReasons, {
    ...reasonBase.defaultStyle,
    label: formatChipLabel(reason) || "Other",
  });

const getSpaceReasonChipStyle = (reason?: string): ChipStyle =>
  firstMatchingStyle(reason, spaceReasons, {
    ...reasonBase.defaultStyle,
    label: formatChipLabel(reason) || "Other",
  });

const getStatusChipStyle = (status?: string): ChipStyle => {
  const entries: Matcher[] = [
    {
      labels: ["pending review", "under review", "review"],
      bg: "#e7ecef",
      text: "#4f565d",
      fallbackLabel: "Pending Review",
      padding: "8px 16px",
      size: "regular",
    },
    {
      labels: ["active"],
      bg: "#edffed",
      text: "#18682c",
      padding: "8px 16px",
      size: "regular",
    },
    {
      labels: ["banned"],
      bg: "#d53425",
      text: "#ffffff",
      padding: "8px 16px",
      size: "regular",
    },
    {
      labels: ["deactivated", "inactive"],
      bg: "#1d1b20",
      text: "#ffffff",
      padding: "8px 16px",
      size: "regular",
    },
    {
      labels: ["not reported"],
      bg: "#eef0f1",
      text: "#5b6168",
      padding: "8px 18px",
      size: "regular",
    },
    {
      labels: ["reported"],
      bg: "#ffe5e4",
      text: "#a4181a",
      padding: "8px 16px",
      size: "regular",
    },
    {
      labels: ["pending"],
      bg: "#e7ecef",
      text: "#4f565d",
      padding: "8px 16px",
      size: "regular",
    },
    {
      labels: ["under", "evaluation"],
      bg: "#e7ecef",
      text: "#4f565d",
      fallbackLabel: "Under Evaluation",
      padding: "8px 16px",
      size: "regular",
    },
    {
      labels: ["resolved"],
      bg: "#e7ecef",
      text: "#4f565d",
      padding: "8px 16px",
      size: "regular",
    },
    {
      labels: ["dismiss"],
      bg: "#e7ecef",
      text: "#4f565d",
      padding: "8px 16px",
      size: "regular",
    },
  ];

  const defaultStyle: ChipStyle = {
    bg: "#e7ecef",
    text: "#4f565d",
    label: formatChipLabel(status) || "Status",
    padding: "8px 16px",
    size: "regular",
  };

  return firstMatchingStyle(status, entries, defaultStyle);
};

const getSpaceCategoryChipStyle = (space?: string): ChipStyle => {
  const entries: Matcher[] = [
    {
      labels: ["clubs"],
      bg: "#e2e0f2",
      text: "#5f56a9",
      fallbackLabel: "Clubs",
    },
    {
      labels: ["fraternit"],
      bg: "#fbf1df",
      text: "#896726",
      fallbackLabel: "Fraternities",
    },
    {
      labels: ["sororit"],
      bg: "#fbf6f3",
      text: "#816651",
      fallbackLabel: "Sororities",
    },
    {
      labels: ["academics", "honors"],
      bg: "#ffe3de",
      text: "#ad411e",
      fallbackLabel: "Academics\n& Honors",
    },
    {
      labels: ["leadership", "government"],
      bg: "#d5c0ab",
      text: "#502c11",
      fallbackLabel: "Leadership &\nGovernment",
    },
    {
      labels: ["club sports", "sports"],
      bg: "#f9d9be",
      text: "#873511",
      fallbackLabel: "Club Sports",
    },
    {
      labels: ["im teams"],
      bg: "#e0e1e2",
      text: "#464a51",
      fallbackLabel: "IM Teams",
    },
    {
      labels: ["volunteer"],
      bg: "#fce3bd",
      text: "#a34007",
      fallbackLabel: "Volunteer",
    },
    {
      labels: ["cultural", "diversity"],
      bg: "#c1e5ff",
      text: "#234798",
      fallbackLabel: "Cultural\n& Diversity",
    },
  ];

  const defaultStyle: ChipStyle = {
    bg: "#eef0f1",
    text: "#5b6168",
    label: formatChipLabel(space) || "Space",
  };

  return firstMatchingStyle(space, entries, defaultStyle);
};

const getAdminRoleChipStyle = (role?: string): ChipStyle => {
  const entries: Matcher[] = [
    { labels: ["school admin"], bg: "#cacaee", text: "#1c1cd3" },
    { labels: ["campus admin"], bg: "#cae1ee", text: "#0e4c6f" },
    { labels: ["moderator"], bg: "#f0e3c4", text: "#5f470b" },
    { labels: ["walky admin"], bg: "#eed8ca", text: "#74370e" },
    { labels: ["walky internal"], bg: "#ffe2fa", text: "#91127c" },
  ];

  const defaultStyle: ChipStyle = {
    bg: "#eef0f1",
    text: "#5b6168",
    label: formatChipLabel(role) || "Role",
  };

  return firstMatchingStyle(role, entries, defaultStyle);
};

export {
  formatChipLabel,
  getReasonChipStyle,
  getUserReasonChipStyle,
  getEventReasonChipStyle,
  getIdeaReasonChipStyle,
  getSpaceReasonChipStyle,
  getStatusChipStyle,
  getSpaceCategoryChipStyle,
  getAdminRoleChipStyle,
};
