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
    bg: "#f4f5f7",
    text: "#676d70",
    label: "Other",
  } as ChipStyle,
};

const userMessageReasons: Matcher[] = [
  { labels: ["harassment", "threat"], bg: "#fee8d6", text: "#b45b1c" },
  {
    labels: ["made me uncomfortable", "made_me_uncomfortable", "uncomfortable"],
    bg: "#f3dcff",
    text: "#7a2bb5",
  },
  {
    labels: ["explicit", "nudity", "inappropriate"],
    bg: "#e6edff",
    text: "#1b4f9c",
  },
  {
    labels: ["self", "harmful behavior", "self-injury"],
    bg: "#ffe7f3",
    text: "#b5126b",
  },
  {
    labels: ["spam", "fake profile", "misuse"],
    bg: "#fff6e0",
    text: "#a36b00",
  },
  { labels: ["underage", "policy violation"], bg: "#e9f0ff", text: "#3452c4" },
];

const eventReasons: Matcher[] = [
  {
    labels: ["explicit", "nudity", "inappropriate"],
    bg: "#e6edff",
    text: "#1b4f9c",
  },
  { labels: ["harmful", "unsafe behavior"], bg: "#ffe8e1", text: "#c45516" },
  {
    labels: ["spam", "fake profile", "misuse"],
    bg: "#fff6e0",
    text: "#a36b00",
  },
  { labels: ["hate speech", "offensive"], bg: "#ffe3e3", text: "#b12929" },
  {
    labels: ["discriminatory", "exclusionary"],
    bg: "#e7e4ff",
    text: "#4b3baa",
  },
  { labels: ["duplicate"], bg: "#e9f5ec", text: "#2e7d32" },
];

const ideaReasons: Matcher[] = [
  { labels: ["harassment", "threat"], bg: "#fee8d6", text: "#b45b1c" },
  {
    labels: ["spam", "fake profile", "misuse"],
    bg: "#fff6e0",
    text: "#a36b00",
  },
  { labels: ["harmful", "dangerous"], bg: "#e6f3ff", text: "#0a4e8c" },
  {
    labels: ["self", "harmful behavior", "self-injury"],
    bg: "#ffe7f3",
    text: "#b5126b",
  },
  {
    labels: ["discriminatory", "exclusionary"],
    bg: "#e7e4ff",
    text: "#4b3baa",
  },
  { labels: ["intellectual"], bg: "#fff3d6", text: "#8f5400" },
];

const spaceReasons: Matcher[] = [
  { labels: ["inappropriate", "offensive"], bg: "#e6edff", text: "#1b4f9c" },
  {
    labels: ["misinformation", "false", "misleading"],
    bg: "#eaf5ff",
    text: "#0a4e8c",
  },
  { labels: ["hate speech", "discrimination"], bg: "#ffe3e3", text: "#b12929" },
  { labels: ["unsafe", "harmful"], bg: "#fff4e1", text: "#b45b1c" },
  { labels: ["solicitation", "sales"], bg: "#e6edff", text: "#3452c4" },
  {
    labels: ["duplicate", "unauthorized", "impersonation"],
    bg: "#f2e5ff",
    text: "#7a2bb5",
  },
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
      bg: "#eef0f1",
      text: "#5b6168",
      fallbackLabel: "Pending Review",
      padding: "4px 10px",
      size: "compact",
    },
    {
      labels: ["active"],
      bg: "#e6f7eb",
      text: "#00c943",
      padding: "4px 10px",
      size: "compact",
    },
    {
      labels: ["banned"],
      bg: "#ffe3de",
      text: "#d9381e",
      padding: "4px 10px",
      size: "compact",
    },
    {
      labels: ["deactivated", "inactive"],
      bg: "#e7e6e8",
      text: "#1d1b20",
      padding: "4px 10px",
      size: "compact",
    },
    {
      labels: ["not reported"],
      bg: "#eef0f1",
      text: "#5b6168",
      padding: "4px 10px",
      size: "compact",
    },
    {
      labels: ["reported"],
      bg: "#fff4d6",
      text: "#ebb129",
      padding: "4px 10px",
      size: "compact",
    },
    {
      labels: ["pending"],
      bg: "#fff4d6",
      text: "#ebb129",
      padding: "4px 10px",
      size: "compact",
    },
    {
      labels: ["under", "evaluation"],
      bg: "#eef0f1",
      text: "#5b6168",
      fallbackLabel: "Under Evaluation",
      padding: "4px 10px",
      size: "compact",
    },
    {
      labels: ["resolved"],
      bg: "#eef0f1",
      text: "#5b6168",
      padding: "4px 10px",
      size: "compact",
    },
    {
      labels: ["dismiss"],
      bg: "#eef0f1",
      text: "#5b6168",
      padding: "4px 10px",
      size: "compact",
    },
  ];

  const defaultStyle: ChipStyle = {
    bg: "#eef0f1",
    text: "#5b6168",
    label: formatChipLabel(status) || "Status",
    padding: "4px 10px",
    size: "compact",
  };

  return firstMatchingStyle(status, entries, defaultStyle);
};

const getSpaceCategoryChipStyle = (space?: string): ChipStyle => {
  const entries: Matcher[] = [
    { labels: ["clubs"], bg: "#e9f0ff", text: "#3452c4" },
    { labels: ["fraternit"], bg: "#fdf0dc", text: "#b26a00" },
    { labels: ["sororit"], bg: "#fce2ef", text: "#b82c70" },
    { labels: ["academics", "honors"], bg: "#f6f1ff", text: "#6b2fb3" },
    { labels: ["leadership", "government"], bg: "#f2f5ff", text: "#2949c7" },
    { labels: ["club sports", "sports"], bg: "#fff3e1", text: "#b45b1c" },
    { labels: ["im teams"], bg: "#e7f7ff", text: "#0a6c9a" },
    { labels: ["volunteer"], bg: "#fff4d6", text: "#b17800" },
    { labels: ["cultural", "diversity"], bg: "#e6f7f3", text: "#0f7a63" },
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
    { labels: ["school admin"], bg: "#e9f0ff", text: "#3452c4" },
    { labels: ["campus admin"], bg: "#e6f7eb", text: "#1a7f49" },
    { labels: ["moderator"], bg: "#fff4d6", text: "#b17800" },
    { labels: ["walky admin"], bg: "#f6f1ff", text: "#6b2fb3" },
    { labels: ["walky internal"], bg: "#e7f7ff", text: "#0a6c9a" },
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
