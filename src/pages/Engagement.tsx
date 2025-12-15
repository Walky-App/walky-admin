import { useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CBadge,
  CSpinner,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilCompass,
  cilCalendar,
  cilLightbulb,
  cilChartLine,
  cilPeople,
  cilLocationPin,
  cilCheckCircle,
  cilRunning,
} from "@coreui/icons";
import { useTheme } from "../hooks/useTheme";
import { useSchool } from "../contexts/SchoolContext";
import { useSchoolFilter } from "../hooks/useSchoolFilter";
import { apiClient } from "../API";

// Modern Stat Card Component
const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  color,
  percentage,
  trend,
  loading = false,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string | string[];
  color: string;
  percentage?: number;
  trend?: "up" | "down" | "neutral";
  loading?: boolean;
}) => {
  const { theme } = useTheme();
  const isDark = theme.isDark;

  const trendColors = {
    up: "#34C759",
    down: "#FF3B30",
    neutral: "#8E8E93",
  };

  return (
    <CCard
      className="h-100"
      style={{
        background: isDark ? "var(--modern-card-bg)" : "#FFFFFF",
        border: `1px solid ${isDark ? "var(--modern-border-primary)" : "#E5E7EB"
          }`,
        borderRadius: "12px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
        transition: "all 0.2s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.05)";
      }}
    >
      <CCardBody className="p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div
            style={{
              width: "48px",
              height: "48px",
              background: `linear-gradient(135deg, ${color}15, ${color}25)`,
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CIcon icon={icon} size="lg" style={{ color }} />
          </div>
          {percentage !== undefined && trend && (
            <CBadge
              style={{
                backgroundColor: `${trendColors[trend]}15`,
                color: trendColors[trend],
                padding: "4px 8px",
                fontSize: "0.75rem",
                fontWeight: "600",
              }}
            >
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {percentage}
              %
            </CBadge>
          )}
        </div>

        <div>
          <div
            style={{
              fontSize: "0.75rem",
              color: isDark ? "#9CA3AF" : "#6B7280",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontWeight: "600",
              marginBottom: "4px",
            }}
          >
            {title}
          </div>
          {loading ? (
            <CSpinner size="sm" />
          ) : (
            <div
              style={{
                fontSize: "2rem",
                fontWeight: "700",
                color: isDark ? "#FFFFFF" : "#111827",
                lineHeight: "1.2",
              }}
            >
              {value}
            </div>
          )}
          {subtitle && (
            <div
              style={{
                fontSize: "0.875rem",
                color: isDark ? "#9CA3AF" : "#6B7280",
                marginTop: "4px",
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
      </CCardBody>
    </CCard>
  );
};

// Progress Card Component
const ProgressCard = ({
  title,
  items,
  color,
  icon,
}: {
  title: string;
  items: Array<{ label: string; value: number; color?: string }>;
  color: string;
  icon: string | string[];
}) => {
  const { theme } = useTheme();
  const isDark = theme.isDark;
  const total = items.reduce((sum, item) => sum + item.value, 0);

  return (
    <CCard
      style={{
        background: isDark ? "var(--modern-card-bg)" : "#FFFFFF",
        border: `1px solid ${isDark ? "var(--modern-border-primary)" : "#E5E7EB"
          }`,
        borderRadius: "12px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
      }}
    >
      <CCardHeader
        style={{
          background: "transparent",
          borderBottom: `1px solid ${isDark ? "var(--modern-border-primary)" : "#E5E7EB"
            }`,
          padding: "1.25rem",
        }}
      >
        <div className="d-flex align-items-center gap-3">
          <div
            style={{
              width: "40px",
              height: "40px",
              background: `linear-gradient(135deg, ${color}15, ${color}25)`,
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CIcon icon={icon} size="lg" style={{ color }} />
          </div>
          <div>
            <h5 className="mb-0" style={{ fontWeight: "600" }}>
              {title}
            </h5>
            <small style={{ color: isDark ? "#9CA3AF" : "#6B7280" }}>
              Total: {total.toLocaleString()}
            </small>
          </div>
        </div>
      </CCardHeader>
      <CCardBody className="p-4">
        <div className="space-y-4">
          {items.map((item, index) => {
            const percentage = total > 0 ? (item.value / total) * 100 : 0;
            return (
              <div key={index} className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: isDark ? "#E5E7EB" : "#374151",
                    }}
                  >
                    {item.label}
                  </span>
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: item.color || color,
                    }}
                  >
                    {item.value.toLocaleString()} ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "8px",
                    backgroundColor: theme.colors.borderColor,
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${percentage}%`,
                      height: "100%",
                      backgroundColor: item.color || color,
                      transition: "width 1s ease-in-out",
                      borderRadius: "4px",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CCardBody>
    </CCard>
  );
};

// Main Engagement Dashboard
const Engagement = () => {
  const { selectedSchool } = useSchool();
  useSchoolFilter(); // Enable school filtering interceptor
  const [loading, setLoading] = useState(true);
  const [walks, setWalks] = useState({
    total: 0,
    pending: 0,
    active: 0,
    completed: 0,
    cancelled: 0,
  });

  const [events, setEvents] = useState({
    total: 0,
    outdoor: 0,
    indoor: 0,
    public: 0,
    private: 0,
  });

  const [ideas, setIdeas] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    collaborated: 0,
  });

  const [walksDistribution, setWalksDistribution] = useState<{
    chartLabels: string[];
    chartData: number[];
    totalWalksCreated: number;
  }>({
    chartLabels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    chartData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    totalWalksCreated: 0,
  });

  // Fetch walks distribution when school changes
  useEffect(() => {
    const fetchWalksDistribution = async () => {
      try {
        const response = await apiClient.api.adminAnalyticsWalksDistributionList() as any;
        console.log("📊 Walks Distribution Response:", response.data);
        setWalksDistribution(response.data);
      } catch (err) {
        console.error("Failed to fetch walks distribution:", err);
        // Set default data on error
        setWalksDistribution({
          chartLabels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          chartData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          totalWalksCreated: 0,
        });
      }
    };

    fetchWalksDistribution();
  }, [selectedSchool?._id]);

  useEffect(() => {
    const fetchAllData = async () => {
      console.log(
        "📊 Engagement: Fetching data for school:",
        selectedSchool?._id || "all schools"
      );
      setLoading(true);

      // Fetch Walks from admin analytics endpoints
      try {
        const [totalRes, pendingRes, activeRes, completedRes, cancelledRes] =
          await Promise.all([
            apiClient.api.adminAnalyticsWalksCountList() as any,
            apiClient.api.adminAnalyticsWalksPendingList() as any,
            apiClient.api.adminAnalyticsWalksActiveList() as any,
            apiClient.api.adminAnalyticsWalksCompletedList() as any,
            apiClient.api.adminAnalyticsWalksCancelledList() as any,
          ]);

        setWalks({
          total: totalRes.data.totalWalksCreated || 0,
          pending: pendingRes.data.pending_count || 0,
          active: activeRes.data.active_count || 0,
          completed: completedRes.data.completed_count || 0,
          cancelled: cancelledRes.data.cancelled_count || 0,
        });
      } catch (err) {
        console.error("Failed to fetch walks data:", err);
      }

      // Fetch Events from admin analytics endpoints
      try {
        const [total, outdoor, indoor, publicEvt, privateEvt] =
          await Promise.all([
            apiClient.api.adminAnalyticsEventsCountList({ filter: "total" } as any) as any,
            apiClient.api.adminAnalyticsEventsCountList({ filter: "outdoor" } as any) as any,
            apiClient.api.adminAnalyticsEventsCountList({ filter: "indoor" } as any) as any,
            apiClient.api.adminAnalyticsEventsCountList({ filter: "public" } as any) as any,
            apiClient.api.adminAnalyticsEventsCountList({ filter: "private" } as any) as any,
          ]);

        setEvents({
          total: total.data.count || 0,
          outdoor: outdoor.data.count || 0,
          indoor: indoor.data.count || 0,
          public: publicEvt.data.count || 0,
          private: privateEvt.data.count || 0,
        });
      } catch (err) {
        console.error("Failed to fetch events:", err);
      }

      // Fetch Ideas from admin analytics endpoints
      try {
        const [total, active, inactive, collaborated] = await Promise.all([
          apiClient.api.adminAnalyticsIdeasCountList({ type: "total" } as any) as any,
          apiClient.api.adminAnalyticsIdeasCountList({ type: "active" } as any) as any,
          apiClient.api.adminAnalyticsIdeasCountList({ type: "inactive" } as any) as any,
          apiClient.api.adminAnalyticsIdeasCountList({ type: "collaborated" } as any) as any,
        ]);

        setIdeas({
          total: total.data.totalIdeasCreated || 0,
          active: active.data.activeIdeasCount || 0,
          inactive: inactive.data.inactiveIdeasCount || 0,
          collaborated: collaborated.data.collaboratedIdeasCount || 0,
        });
      } catch (err) {
        console.error("Failed to fetch ideas:", err);
      }
      setLoading(false);
    };

    fetchAllData();
  }, [selectedSchool?._id]);

  const calcTrend = (
    value: number,
    total: number
  ): "up" | "down" | "neutral" => {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    if (percentage > 50) return "up";
    if (percentage < 30) return "down";
    return "neutral";
  };

  return (
    <div style={{ padding: "2rem", background: "transparent" }}>
      {/* Page Header */}
      <div className="mb-4">
        <h2 style={{ fontWeight: "700", marginBottom: "0.5rem" }}>
          Engagement Dashboard
        </h2>
        <p style={{ color: "#6B7280", marginBottom: "2rem" }}>
          Track user engagement metrics across walks, events, and ideas
        </p>
      </div>

      {/* Top Stats Grid */}
      <CRow className="g-4 mb-4">
        <CCol xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Walks"
            value={walks.total.toLocaleString()}
            icon={cilCompass}
            color="#5E5CE6"
            percentage={
              walks.active > 0
                ? Math.round((walks.active / walks.total) * 100)
                : 0
            }
            trend={calcTrend(walks.active, walks.total)}
            subtitle={`${walks.active} active now`}
            loading={loading}
          />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Events"
            value={events.total.toLocaleString()}
            icon={cilCalendar}
            color="#007AFF"
            percentage={
              events.public > 0
                ? Math.round((events.public / events.total) * 100)
                : 0
            }
            trend="up"
            subtitle={`${events.public} public events`}
            loading={loading}
          />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Ideas"
            value={ideas.total.toLocaleString()}
            icon={cilLightbulb}
            color="#FF9500"
            percentage={
              ideas.active > 0
                ? Math.round((ideas.active / ideas.total) * 100)
                : 0
            }
            trend={calcTrend(ideas.active, ideas.total)}
            subtitle={`${ideas.active} active ideas`}
            loading={loading}
          />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <StatCard
            title="Engagement Rate"
            value={`${Math.round(
              ((walks.active + ideas.active) / (walks.total + ideas.total)) *
              100
            )}%`}
            icon={cilChartLine}
            color="#34C759"
            trend="up"
            percentage={12.5}
            subtitle="vs last month"
            loading={loading}
          />
        </CCol>
      </CRow>

      {/* Detailed Progress Cards */}
      <CRow className="g-4 mb-4">
        <CCol lg={4}>
          <ProgressCard
            title="Walks Breakdown"
            icon={cilCompass}
            color="#5E5CE6"
            items={[
              { label: "Active", value: walks.active, color: "#34C759" },
              { label: "Pending", value: walks.pending, color: "#FF9500" },
              { label: "Completed", value: walks.completed, color: "#007AFF" },
              { label: "Cancelled", value: walks.cancelled, color: "#FF3B30" },
            ]}
          />
        </CCol>
        <CCol lg={4}>
          <ProgressCard
            title="Events Distribution"
            icon={cilCalendar}
            color="#007AFF"
            items={[
              { label: "Outdoor", value: events.outdoor, color: "#34C759" },
              { label: "Indoor", value: events.indoor, color: "#5E5CE6" },
              { label: "Public", value: events.public, color: "#007AFF" },
              { label: "Private", value: events.private, color: "#FF9500" },
            ]}
          />
        </CCol>
        <CCol lg={4}>
          <ProgressCard
            title="Ideas Status"
            icon={cilLightbulb}
            color="#FF9500"
            items={[
              { label: "Active", value: ideas.active, color: "#34C759" },
              { label: "Inactive", value: ideas.inactive, color: "#8E8E93" },
              {
                label: "Collaborated",
                value: ideas.collaborated,
                color: "#5E5CE6",
              },
            ]}
          />
        </CCol>
      </CRow>

      {/* Walks Distribution Chart */}
      <CRow className="g-4 mb-4">
        <CCol xs={12}>
          <CCard
            style={{
              borderRadius: "12px",
              border: "1px solid #E5E7EB",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
              overflow: "hidden",
            }}
          >
            <CCardHeader
              style={{
                background: "transparent",
                borderBottom: "1px solid #E5E7EB",
                padding: "1.25rem",
              }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      background:
                        "linear-gradient(135deg, #5E5CE615, #5E5CE625)",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <CIcon
                      icon={cilChartLine}
                      size="lg"
                      style={{ color: "#5E5CE6" }}
                    />
                  </div>
                  <div>
                    <h5 className="mb-0" style={{ fontWeight: "600" }}>
                      Walks Distribution
                    </h5>
                    <small style={{ color: "#6B7280" }}>
                      Monthly walk activity over the past year
                    </small>
                  </div>
                </div>
                <CBadge
                  color="primary"
                  style={{
                    padding: "8px 12px",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    flexShrink: 0,
                  }}
                >
                  Total: {walksDistribution.totalWalksCreated.toLocaleString()}
                </CBadge>
              </div>
            </CCardHeader>
            <CCardBody className="p-4">
              {/* Simple Custom Bar Chart */}
              <div style={{ position: "relative", width: "100%" }}>
                {/* Y-axis labels */}
                <div
                  style={{
                    position: "absolute",
                    left: "-40px",
                    top: "0",
                    height: "250px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    fontSize: "0.75rem",
                    color: "#6B7280",
                    width: "35px",
                    textAlign: "right",
                  }}
                >
                  <div>400</div>
                  <div>300</div>
                  <div>200</div>
                  <div>100</div>
                  <div>0</div>
                </div>

                {/* Chart Container */}
                <div
                  style={{
                    height: "250px",
                    borderLeft: "2px solid #E5E7EB",
                    borderBottom: "2px solid #E5E7EB",
                    position: "relative",
                    marginBottom: "40px",
                    background:
                      "linear-gradient(180deg, transparent 0%, transparent 24.9%, #F3F4F6 25%, transparent 25.1%, transparent 49.9%, #F3F4F6 50%, transparent 50.1%, transparent 74.9%, #F3F4F6 75%, transparent 75.1%)",
                    overflow: "hidden",
                  }}
                >
                  {/* Bars */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      height: "100%",
                      paddingLeft: "20px",
                      paddingRight: "20px",
                      gap: "10px",
                    }}
                  >
                    {walksDistribution.chartData.map((value, index) => {
                      const maxValue = 400; // Fixed max for consistency
                      const height = Math.min((value / maxValue) * 100, 100); // Cap at 100%
                      const label = walksDistribution.chartLabels[index];

                      return (
                        <div
                          key={index}
                          style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            position: "relative",
                            height: "100%",
                            justifyContent: "flex-end",
                          }}
                        >
                          {/* Bar */}
                          <div
                            style={{
                              backgroundColor:
                                value ===
                                  Math.max(...walksDistribution.chartData)
                                  ? "#5E5CE6"
                                  : "rgba(94, 92, 230, 0.7)",
                              borderRadius: "8px 8px 0 0",
                              width: "100%",
                              maxWidth: "60px",
                              height: `${height}%`,
                              minHeight: value > 0 ? "2px" : "0",
                              transition: "all 0.3s ease",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "flex-start",
                              justifyContent: "center",
                              paddingTop: "8px",
                              position: "relative",
                            }}
                            title={`${label}: ${value} walks`}
                          >
                            {value > 0 && height > 10 && (
                              <span
                                style={{
                                  color: "white",
                                  fontSize: "0.7rem",
                                  fontWeight: "600",
                                }}
                              >
                                {value}
                              </span>
                            )}
                          </div>

                          {/* Month label */}
                          <div
                            style={{
                              position: "absolute",
                              bottom: "-30px",
                              fontSize: "0.75rem",
                              color: "#6B7280",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Stats Summary */}
                <div className="d-flex justify-content-around pt-3 border-top">
                  <div className="text-center">
                    <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                      Peak Month
                    </div>
                    <div
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: "700",
                        color: "#5E5CE6",
                      }}
                    >
                      {(() => {
                        const maxValue = Math.max(
                          ...walksDistribution.chartData
                        );
                        const maxIndex =
                          walksDistribution.chartData.indexOf(maxValue);
                        const peakMonth =
                          maxIndex >= 0 &&
                            maxIndex < walksDistribution.chartLabels.length
                            ? walksDistribution.chartLabels[maxIndex]
                            : "-";
                        return `${peakMonth}: ${maxValue || 0}`;
                      })()}
                    </div>
                  </div>
                  <div className="text-center">
                    <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                      Average
                    </div>
                    <div
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: "700",
                        color: "#5E5CE6",
                      }}
                    >
                      {walksDistribution.chartData.length > 0
                        ? Math.round(
                          walksDistribution.totalWalksCreated /
                          walksDistribution.chartData.length
                        )
                        : 0}
                    </div>
                  </div>
                  <div className="text-center">
                    <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                      Total Walks
                    </div>
                    <div
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: "700",
                        color: "#5E5CE6",
                      }}
                    >
                      {walksDistribution.totalWalksCreated || 0}
                    </div>
                  </div>
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Quick Stats Grid */}
      <CRow className="g-3">
        <CCol xs={6} md={3}>
          <CCard
            style={{
              borderRadius: "12px",
              border: "1px solid #E5E7EB",
              textAlign: "center",
              padding: "1.5rem",
            }}
          >
            <CIcon
              icon={cilRunning}
              size="xl"
              style={{ color: "#34C759", marginBottom: "0.5rem" }}
            />
            <h6 style={{ marginBottom: "0.25rem" }}>Active Now</h6>
            <h3 style={{ fontWeight: "700", color: "#34C759" }}>
              {walks.active}
            </h3>
          </CCard>
        </CCol>
        <CCol xs={6} md={3}>
          <CCard
            style={{
              borderRadius: "12px",
              border: "1px solid #E5E7EB",
              textAlign: "center",
              padding: "1.5rem",
            }}
          >
            <CIcon
              icon={cilCheckCircle}
              size="xl"
              style={{ color: "#007AFF", marginBottom: "0.5rem" }}
            />
            <h6 style={{ marginBottom: "0.25rem" }}>Completed</h6>
            <h3 style={{ fontWeight: "700", color: "#007AFF" }}>
              {walks.completed}
            </h3>
          </CCard>
        </CCol>
        <CCol xs={6} md={3}>
          <CCard
            style={{
              borderRadius: "12px",
              border: "1px solid #E5E7EB",
              textAlign: "center",
              padding: "1.5rem",
            }}
          >
            <CIcon
              icon={cilLocationPin}
              size="xl"
              style={{ color: "#5E5CE6", marginBottom: "0.5rem" }}
            />
            <h6 style={{ marginBottom: "0.25rem" }}>Outdoor Events</h6>
            <h3 style={{ fontWeight: "700", color: "#5E5CE6" }}>
              {events.outdoor}
            </h3>
          </CCard>
        </CCol>
        <CCol xs={6} md={3}>
          <CCard
            style={{
              borderRadius: "12px",
              border: "1px solid #E5E7EB",
              textAlign: "center",
              padding: "1.5rem",
            }}
          >
            <CIcon
              icon={cilPeople}
              size="xl"
              style={{ color: "#FF9500", marginBottom: "0.5rem" }}
            />
            <h6 style={{ marginBottom: "0.25rem" }}>Collaborated</h6>
            <h3 style={{ fontWeight: "700", color: "#FF9500" }}>
              {ideas.collaborated}
            </h3>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default Engagement;
