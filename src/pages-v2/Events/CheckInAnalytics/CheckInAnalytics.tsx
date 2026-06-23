import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CRow, CCol } from "@coreui/react";
import API from "../../../API";
import { AssetIcon } from "../../../components-v2";
import { StatsCard, LineChart } from "../../Dashboard/components";
import { useTheme } from "../../../hooks/useTheme";

type Period = "week" | "month" | "all";

interface CheckInMetrics {
  period: string;
  totalConfirmed: number;
  totalCheckedIn: number;
  noShowCount: number;
  showUpRate: number;
  checkedInByDate: Array<{ date: string; checkedIn: number }>;
  topEvents: Array<{
    name: string;
    confirmed: number;
    checkedIn: number;
    showUpRate: number;
  }>;
}

// The endpoint isn't in the generated Swagger client yet, so call it directly via the axios
// instance (baseURL already includes /api and attaches the Bearer token).
const fetchCheckIn = async (period: Period): Promise<CheckInMetrics> => {
  const res = await API.get("/admin/analytics/events/check-in", {
    params: { period },
  });
  return res.data;
};

const PERIODS: { label: string; value: Period }[] = [
  { label: "Last Week", value: "week" },
  { label: "Last Month", value: "month" },
  { label: "All Time", value: "all" },
];

export const CheckInAnalytics: React.FC = () => {
  const { theme } = useTheme();
  const [period, setPeriod] = useState<Period>("month");

  const { data, isLoading } = useQuery({
    queryKey: ["eventCheckInAnalytics", period],
    queryFn: () => fetchCheckIn(period),
  });

  const checkedInByDate = data?.checkedInByDate ?? [];
  const topEvents = data?.topEvents ?? [];

  // Show-up rate and no-shows are only meaningful once at least one attendee has been
  // scanned in. Until then (a brand-new feature with no check-ins, or before doors open)
  // show a "No data yet" placeholder instead of a misleading 0% / full no-show count.
  const hasCheckIns = (data?.totalCheckedIn ?? 0) > 0;
  const showUpRateDisplay = isLoading
    ? "—"
    : hasCheckIns
    ? `${(data?.showUpRate ?? 0).toFixed(1)}%`
    : "No data yet";
  const noShowDisplay = isLoading
    ? "—"
    : hasCheckIns
    ? (data?.noShowCount ?? 0).toLocaleString()
    : "No data yet";

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h2 style={{ color: theme.colors.bodyColor, margin: 0 }}>
            Event Check-in
          </h2>
          <p style={{ color: theme.colors.textMuted, margin: "4px 0 0" }}>
            Real attendance from ticket check-ins — who actually showed up vs. who RSVP&apos;d
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {PERIODS.map((p) => (
            <button
              key={p.value}
              type="button"
              data-testid={`check-in-period-${p.value}`}
              onClick={() => setPeriod(p.value)}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                border: `1px solid ${theme.colors.borderColor}`,
                cursor: "pointer",
                background:
                  period === p.value ? theme.colors.iconBlue : theme.colors.cardBg,
                color: period === p.value ? "#fff" : theme.colors.bodyColor,
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <CRow className="g-3">
        <CCol xs={12} sm={6} lg={3}>
          <StatsCard
            title="Show-up Rate"
            value={showUpRateDisplay}
            icon={<AssetIcon name="calendar-icon" color={theme.colors.iconOrange} />}
            iconBgColor="#ffded1"
          />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <StatsCard
            title="Checked In"
            value={(data?.totalCheckedIn ?? 0).toLocaleString()}
            icon={<AssetIcon name="double-users-icon" color="#198754" />}
            iconBgColor="#d1e7dd"
          />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <StatsCard
            title="Confirmed RSVPs"
            value={(data?.totalConfirmed ?? 0).toLocaleString()}
            icon={<AssetIcon name="double-users-icon" color={theme.colors.iconBlue} />}
            iconBgColor="#d9e3f7"
          />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <StatsCard
            title="No-shows"
            value={noShowDisplay}
            icon={<AssetIcon name="arrow-down" color="#dc3545" />}
            iconBgColor="#f8d7da"
          />
        </CCol>
      </CRow>

      <div style={{ marginTop: 24 }}>
        <LineChart
          title="Check-ins over time"
          data={checkedInByDate.map((d) => d.checkedIn)}
          labels={checkedInByDate.map((d) =>
            new Date(d.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          )}
          color={theme.colors.iconBlue}
          backgroundColor={theme.colors.cardBg}
        />
      </div>

      <div
        style={{
          marginTop: 24,
          background: theme.colors.cardBg,
          border: `1px solid ${theme.colors.borderColor}`,
          borderRadius: 12,
          padding: 20,
        }}
      >
        <h3
          style={{
            color: theme.colors.bodyColor,
            marginTop: 0,
            marginBottom: 16,
          }}
        >
          Top events by turnout
        </h3>
        {topEvents.length > 0 ? (
          topEvents.map((event, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 0",
                borderBottom:
                  index < topEvents.length - 1
                    ? `1px solid ${theme.colors.borderColor}`
                    : "none",
              }}
            >
              <div style={{ minWidth: 0, flex: 1 }}>
                <p
                  style={{
                    margin: 0,
                    color: theme.colors.bodyColor,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {event.name || "Untitled event"}
                </p>
                <p
                  style={{
                    margin: "2px 0 0",
                    color: theme.colors.textMuted,
                    fontSize: 12,
                  }}
                >
                  {event.checkedIn} / {event.confirmed} checked in
                </p>
              </div>
              <div style={{ textAlign: "right", marginLeft: 16 }}>
                <p
                  style={{
                    margin: 0,
                    color: theme.colors.bodyColor,
                    fontWeight: 600,
                  }}
                >
                  {event.showUpRate.toFixed(1)}%
                </p>
                <p
                  style={{
                    margin: "2px 0 0",
                    color: theme.colors.textMuted,
                    fontSize: 12,
                  }}
                >
                  show-up
                </p>
              </div>
            </div>
          ))
        ) : (
          <p
            style={{
              color: theme.colors.textMuted,
              textAlign: "center",
              padding: "24px 0",
            }}
          >
            {isLoading ? "Loading…" : "No check-in data for this period yet."}
          </p>
        )}
      </div>
    </div>
  );
};

export default CheckInAnalytics;
