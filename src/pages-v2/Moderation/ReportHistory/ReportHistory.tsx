import React, { useMemo, useState } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { apiClient } from "../../../API";
import {
  AssetIcon,
  ExportButton,
  SearchInput,
  FilterDropdown,
  MultiSelectFilterDropdown,
  Pagination,
  WriteNoteModal,
  ReportDetailModal,
  FlagModal,
  CustomToast,
  SkeletonLoader,
  BanUserModal,
  DeactivateUserModal,
  ReportStatus,
  ReportType,
} from "../../../components-v2";
import { useDebounce } from "../../../hooks/useDebounce";
import { usePermissions } from "../../../hooks/usePermissions";
import ReportsTable, { ReportRow } from "../components/ReportsTable";
import "./ReportHistory.css";

interface HistoryReportData {
  id: string;
  description: string;
  studentId: string;
  reportedItemId?: string;
  reportDate: string;
  resolvedAt: string | null;
  type: string;
  reasonTag: string;
  status: string;
  isFlagged?: boolean;
  flagReason?: string | null;
}

const ReportHistory: React.FC = () => {
  const queryClient = useQueryClient();
  const { canExport, canUpdate } = usePermissions();

  // Check permissions for this page
  const showExport = canExport("report_history");
  const canChangeReportStatus = canUpdate("report_history");
  const canFlagReportedItems = canUpdate("report_history");

  const [searchQuery, setSearchQuery] = useState("");
  const [flagModalType, setFlagModalType] = useState<
    "event" | "idea" | "space" | "user"
  >("event");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
  };
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] =
    useState<string>("Resolved,Dismissed");
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    reportId: string;
    newStatus: string;
  } | null>(null);
  const [shouldReopenDetailsAfterNote, setShouldReopenDetailsAfterNote] =
    useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] =
    useState<HistoryReportData | null>(null);
  const [reportDetails, setReportDetails] = useState<any>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [banUserData, setBanUserData] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [deactivateUserData, setDeactivateUserData] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const normalizeFlagType = (value?: string) => {
    const t = (value || "").toLowerCase();
    if (t.includes("user") || t.includes("student")) return "user" as const;
    if (t.includes("idea")) return "idea" as const;
    if (t.includes("space")) return "space" as const;
    return "event" as const;
  };

  const {
    data: reportsData,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: [
      "history-reports",
      currentPage,
      debouncedSearchQuery,
      selectedTypes,
      selectedStatus,
      sortOrder,
    ],
    queryFn: () =>
      apiClient.api.adminV2ReportsList({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearchQuery,
        type: selectedTypes.join(","),
        status: selectedStatus,
        sortBy: "reportDate",
        sortOrder,
      }),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const { data: statsData, refetch: refetchStats } = useQuery({
    queryKey: ["history-report-stats"],
    queryFn: () => apiClient.api.adminV2ReportsStatsList(),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const flagMutation = useMutation({
    mutationFn: (data: { id: string; type: string; reason: string }) => {
      switch (data.type.toLowerCase()) {
        case "user":
          return apiClient.api.adminV2StudentsFlagCreate(data.id, {
            reason: data.reason,
          });
        case "event":
          return apiClient.api.adminV2EventsFlagCreate(data.id, {
            reason: data.reason,
          });
        case "idea":
          return apiClient.api.adminV2IdeasFlagCreate(data.id, {
            reason: data.reason,
          });
        case "space":
          return apiClient.api.adminV2SpacesFlagCreate(data.id, {
            reason: data.reason,
          });
        default:
          throw new Error(`Cannot flag type: ${data.type}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history-reports"] });
      setToastMessage("Item flagged successfully");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setIsFlagModalOpen(false);
    },
    onError: () => {
      setToastMessage("Error flagging item");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    },
  });

  const unflagMutation = useMutation({
    mutationFn: (data: { id: string; type: string }) => {
      switch (data.type.toLowerCase()) {
        case "user":
          return apiClient.api.adminV2StudentsUnflagCreate(data.id);
        case "event":
          return apiClient.api.adminV2EventsUnflagCreate(data.id);
        case "idea":
          return apiClient.api.adminV2IdeasUnflagCreate(data.id);
        case "space":
          return apiClient.api.adminV2SpacesUnflagCreate(data.id);
        default:
          throw new Error(`Cannot unflag type: ${data.type}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history-reports"] });
      setToastMessage("Item unflagged successfully");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    },
    onError: () => {
      setToastMessage("Error unflagging item");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    },
  });

  const historyReports: HistoryReportData[] = useMemo(
    () =>
      (reportsData?.data.data || []).map((report: any) => ({
        id: report.id,
        description: report.description,
        studentId: report.studentId,
        reportedItemId: report.reportedItemId,
        reportDate: report.reportDate,
        resolvedAt: report.resolvedAt || null,
        type: report.type,
        reasonTag: report.reasonTag,
        status: report.status,
        isFlagged: report.isFlagged,
        flagReason: report.flagReason,
      })),
    [reportsData]
  );

  const tableRows: ReportRow[] = useMemo(
    () =>
      historyReports.map((report) => ({
        id: report.id,
        description: report.description,
        studentId: report.studentId,
        reportDate: report.reportDate,
        resolvedAt: report.resolvedAt,
        type: report.type,
        reasonTag: report.reasonTag,
        status: report.status,
        isFlagged: report.isFlagged,
        flagReason: report.flagReason,
      })),
    [historyReports]
  );

  const totalEntries = reportsData?.data.total || 0;
  const totalPages = Math.ceil(totalEntries / itemsPerPage) || 1;

  const stats = {
    resolved: statsData?.data.resolved || 0,
    dismissed: statsData?.data.dismissed || 0,
    // History total should be resolved + dismissed, not ALL reports
    total: (statsData?.data.resolved || 0) + (statsData?.data.dismissed || 0),
  };

  const formatBanDate = (value?: string) => {
    if (!value) return "Unknown date";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const mapBanHistory = (banHistory: any[] = []) =>
    banHistory.map((ban) => {
      const bannedAt =
        ban.banned_at || ban.bannedAt || ban.date || ban.timestamp;

      return {
        duration: ban.duration || ban.length || "—",
        reason: ban.reason || "Not provided",
        bannedOn: formatBanDate(bannedAt),
        bannedBy: ban.banned_by || ban.bannedBy || ban.admin || "Unknown",
        expiresIn: ban.expires_in || ban.expiresIn,
      };
    });

  const handleStatusChange = async (reportId: string, newStatus: string) => {
    const apiStatus = newStatus === "Reopen" ? "Under evaluation" : newStatus;
    await apiClient.api.adminV2ReportsStatusPartialUpdate(reportId, {
      status: apiStatus,
    });
    refetch();
    refetchStats();
  };

  const handleNoteRequired = (reportId: string, newStatus: string) => {
    setShouldReopenDetailsAfterNote(isDetailModalOpen);
    if (isDetailModalOpen) {
      setIsDetailModalOpen(false);
    }

    setPendingStatusChange({ reportId, newStatus });
    setIsNoteModalOpen(true);
  };

  const handleNoteConfirm = async (note: string) => {
    if (pendingStatusChange) {
      await apiClient.api.adminV2ReportsNoteCreate(
        pendingStatusChange.reportId,
        { note }
      );
      await handleStatusChange(
        pendingStatusChange.reportId,
        pendingStatusChange.newStatus
      );
      setPendingStatusChange(null);
    }
  };

  const handleNoteClose = () => {
    setIsNoteModalOpen(false);
    setPendingStatusChange(null);

    if (shouldReopenDetailsAfterNote && selectedReport) {
      setIsDetailModalOpen(true);
    }

    setShouldReopenDetailsAfterNote(false);
  };

  const handleViewReportDetails = async (report: HistoryReportData) => {
    setSelectedReport(report);
    setIsDetailModalOpen(true);
    setDetailsLoading(true);
    setReportDetails(null);

    try {
      const res = (await apiClient.api.adminV2ReportsDetail(report.id)) as any;
      setReportDetails(res.data);
    } catch (error) {
      console.error("Failed to fetch report details:", error);
    } finally {
      setDetailsLoading(false);
    }
  };

  const getReasonColor = (reason: string) => {
    const palette = {
      pinkBg: "#ffe2fa",
      pinkText: "#91127c",
      redBg: "#ffe5e4",
      redText: "#a4181a",
      blueBg: "#e5f2ff",
      blueText: "#0a4e8c",
      orangeBg: "#fff4e4",
      orangeText: "#8c4b0a",
      grayBg: "#f3f4f6",
      grayText: "#374151",
    };

    const normalized = reason.toLowerCase();

    if (
      normalized.includes("harassment") ||
      normalized.includes("threat") ||
      normalized.includes("bullying")
    ) {
      return { bg: palette.pinkBg, text: palette.pinkText };
    }

    if (
      normalized.includes("violence") ||
      normalized.includes("self-harm") ||
      normalized.includes("suicide") ||
      normalized.includes("explicit") ||
      normalized.includes("adult") ||
      normalized.includes("sexual")
    ) {
      return { bg: palette.redBg, text: palette.redText };
    }

    if (
      normalized.includes("spam") ||
      normalized.includes("misinformation") ||
      normalized.includes("scam")
    ) {
      return { bg: palette.orangeBg, text: palette.orangeText };
    }

    if (normalized.includes("safety") || normalized.includes("harm")) {
      return { bg: palette.blueBg, text: palette.blueText };
    }

    return { bg: palette.grayBg, text: palette.grayText };
  };

  const formatReportDateParts = (value?: string | null) => {
    if (!value) return { date: "-", time: null as string | null };

    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return {
        date: new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          timeZone: "UTC",
        }).format(parsed),
        time: new Intl.DateTimeFormat("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
          timeZone: "UTC",
        }).format(parsed),
      };
    }

    return { date: value, time: null };
  };

  const mapReportType = (type: string): ReportType => {
    const normalized = type?.toLowerCase();

    switch (normalized) {
      case "event":
        return "Event";
      case "event of space":
        return "Event of Space";
      case "space":
        return "Space";
      case "idea":
        return "Idea";
      case "message":
        return "Message";
      case "user":
        return "User";
      default:
        return "User";
    }
  };

  const renderTableSkeletonRows = () => (
    <>
      <tr>
        <td colSpan={7}>
          <SkeletonLoader height="64px" />
        </td>
      </tr>
      <tr>
        <td colSpan={7}>
          <SkeletonLoader height="64px" />
        </td>
      </tr>
      <tr>
        <td colSpan={7}>
          <SkeletonLoader height="64px" />
        </td>
      </tr>
    </>
  );

  return (
    <main className="report-history-page">
      <div className="info-banner">
        <div className="info-banner-content">
          <div className="info-icon-wrapper">
            <AssetIcon name="tooltip-icon" size={24} color="#546fd9" />
          </div>
          <div className="info-text">
            <h2 className="info-title">Need Direct Support?</h2>
            <p className="info-description">
              For urgent safety concerns or complex cases, contact Walky support
              directly at
              <a href="mailto:support@walkyapp.com" className="info-link">
                {" "}
                support@walkyapp.com
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="stats-cards-row">
        <div className="stats-card">
          <div className="stats-card-header">
            <h3 className="stats-card-title">History total</h3>
            <div className="stats-card-icon" style={{ background: "#e5e4ff" }}>
              <AssetIcon name="mod-table-icon" size={30} color="#8280FF" />
            </div>
          </div>
          <p className="stats-card-value">{isLoading ? "..." : stats.total}</p>
        </div>

        <div className="stats-card">
          <div className="stats-card-header">
            <h3 className="stats-card-title">Resolved</h3>
            <div className="stats-card-icon" style={{ background: "#e9fcf4" }}>
              <AssetIcon name="check-icon" size={30} color="#00c48c" />
            </div>
          </div>
          <p className="stats-card-value">
            {isLoading ? "..." : stats.resolved}
          </p>
        </div>

        <div className="stats-card">
          <div className="stats-card-header">
            <h3 className="stats-card-title">Dismissed</h3>
            <div className="stats-card-icon" style={{ background: "#eef0f1" }}>
              <AssetIcon
                name="mod-empty-table-icon"
                size={30}
                color="#5b6168"
              />
            </div>
          </div>
          <p className="stats-card-value">
            {isLoading ? "..." : stats.dismissed}
          </p>
        </div>
      </div>

      <div className="reports-container">
        <div className="reports-header">
          <div className="reports-title-section">
            <h2 className="reports-title">
              History of reported users & content
            </h2>
            <div className="reports-filters">
              <SearchInput
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search"
                variant="secondary"
                className="bounce-search"
              />

              <MultiSelectFilterDropdown
                selectedValues={selectedTypes}
                onChange={(values) => {
                  setSelectedTypes(values);
                  setCurrentPage(1);
                }}
                options={[
                  { value: "user", label: "User" },
                  { value: "message", label: "Message" },
                  { value: "event", label: "Event" },
                  { value: "idea", label: "Idea" },
                  { value: "space", label: "Space" },
                ]}
                placeholder="Filter by type"
                icon="mod-filter-icon"
                testId="type-filter"
                ariaLabel="Filter by type"
              />

              <FilterDropdown
                value={selectedStatus}
                onChange={setSelectedStatus}
                options={[
                  { value: "Resolved,Dismissed", label: "All status" },
                  { value: "Resolved", label: "Resolved" },
                  { value: "Dismissed", label: "Dismissed" },
                ]}
                placeholder="All status"
                testId="status-filter"
                ariaLabel="Filter by status"
              />
            </div>
          </div>

          {showExport && <ExportButton />}
        </div>

        <div className="reports-table-wrapper">
          <ReportsTable
            rows={tableRows}
            loading={isFetching || isLoading}
            renderSkeletonRows={renderTableSkeletonRows}
            emptyState={{
              message: "No history of reported users or content.",
              iconName: "nd-report-icon",
              iconColor: "#546fd9",
              iconSize: 28,
              padding: "32px 24px",
            }}
            statusOptions={["Reopen"]}
            onRowClick={(row) => {
              const matched = historyReports.find((r) => r.id === row.id);
              if (matched) handleViewReportDetails(matched);
            }}
            onStatusChange={handleStatusChange}
            onNoteRequired={handleNoteRequired}
            onFlag={(row) => {
              const matched = historyReports.find((r) => r.id === row.id);
              if (matched) {
                setSelectedReport(matched);
                setFlagModalType(normalizeFlagType(matched.type));
                setIsFlagModalOpen(true);
              }
            }}
            onUnflag={(row) => {
              const matched = historyReports.find((r) => r.id === row.id);
              if (matched && matched.reportedItemId) {
                unflagMutation.mutate({
                  id: matched.reportedItemId,
                  type: normalizeFlagType(matched.type),
                });
              }
            }}
            getReasonColor={getReasonColor}
            formatDate={formatReportDateParts}
            actionTestId="report-history-options"
            getStatusTestId={(row) => `status-dropdown-${row.id}`}
            showResolutionDate={true}
            sortOrder={sortOrder}
            onSort={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            canChangeStatus={canChangeReportStatus}
            canFlag={canFlagReportedItems}
          />
        </div>

        {totalEntries > 0 && (
          <div className="pagination-wrapper">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalEntries={totalEntries}
              entriesPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      <WriteNoteModal
        isOpen={isNoteModalOpen}
        onClose={handleNoteClose}
        onConfirm={handleNoteConfirm}
      />

      {selectedReport &&
        isDetailModalOpen &&
        (() => {
          const reporter = reportDetails?.reporter || {};
          const reporterName =
            reporter.name ||
            reporter.fullName ||
            reporter.full_name ||
            reporter.username ||
            reporter.email ||
            reportDetails?.reportedBy ||
            reportDetails?.reported_by ||
            reportDetails?.reported_by_name ||
            reportDetails?.reported_by_email ||
            "Unknown";

          const reporterId =
            reporter.id ||
            reporter.userId ||
            reporter.user_id ||
            reportDetails?.reporterId ||
            reportDetails?.reportedById ||
            reportDetails?.reported_by_id ||
            "N/A";

          const reporterAvatar =
            reporter.avatar ||
            reporter.profileImage ||
            reporter.profile_image ||
            reporter.photo ||
            reporter.picture ||
            "";

          return (
            <ReportDetailModal
              isOpen={isDetailModalOpen}
              onClose={() => {
                setIsDetailModalOpen(false);
                setSelectedReport(null);
                setReportDetails(null);
              }}
              reportType={mapReportType(selectedReport.type)}
              reportData={{
                associatedUser: {
                  name: reportDetails?.reportedUser?.name || "Unknown",
                  id:
                    reportDetails?.reportedUser?.id ||
                    selectedReport.studentId ||
                    "N/A",
                  avatar: reportDetails?.reportedUser?.avatar || "",
                  email:
                    reportDetails?.reportedUser?.email ||
                    reportDetails?.reportedUser?.emailAddress ||
                    reportDetails?.reportedUser?.mail ||
                    "",
                  isBanned: reportDetails?.reportedUser?.isBanned || false,
                  isDeactivated:
                    reportDetails?.reportedUser?.isDeactivated || false,
                },
                status: selectedReport.status as ReportStatus,
                reason: selectedReport.reasonTag,
                reasonColor: "red",
                reportDate: selectedReport.reportDate,
                contentId: selectedReport.id,
                description: selectedReport.description,
                reportingUser: {
                  name: reporterName,
                  id: reporterId,
                  avatar: reporterAvatar,
                },
                content: (() => {
                  const content = reportDetails?.content || {};
                  const imageCandidate =
                    content.image_url ||
                    content.imageUrl ||
                    content.image ||
                    content.coverImage ||
                    content.cover_image ||
                    "";

                  const mappedType = mapReportType(selectedReport.type);

                  const eventContent =
                    mappedType === "Event" || mappedType === "Event of Space"
                      ? {
                          image: imageCandidate,
                          date:
                            content.date ||
                            content.startDate ||
                            content.start_time ||
                            content.createdAt,
                          title: content.name || content.title || "",
                          location:
                            content.location ||
                            content.address ||
                            content.place ||
                            "",
                        }
                      : undefined;

                  const spaceContent =
                    mappedType === "Space" || mappedType === "Event of Space"
                      ? {
                          title:
                            content.space?.name ||
                            content.space_name ||
                            content.spaceName ||
                            content.name ||
                            "",
                          description:
                            content.space?.description ||
                            content.space_description ||
                            content.description ||
                            "",
                          image:
                            content.space?.image_url ||
                            content.space?.imageUrl ||
                            content.space?.image ||
                            content.space_image_url ||
                            content.spaceImageUrl ||
                            content.spaceImage ||
                            imageCandidate ||
                            "",
                          category:
                            content.space?.category ||
                            content.category ||
                            "Other",
                          memberCount: String(
                            content.space?.memberCount ||
                              content.space_member_count ||
                              content.memberCount ||
                              "0"
                          ),
                        }
                      : undefined;

                  const ideaContent =
                    mappedType === "Idea"
                      ? {
                          title: content.title,
                          tag: content.looking_for || content.tag || "N/A",
                          description: content.description,
                          ideaBy:
                            reportDetails?.reportedUser?.name || "Unknown",
                          avatar: reportDetails?.reportedUser?.avatar || "",
                        }
                      : undefined;

                  const messageContent =
                    mappedType === "Message"
                      ? {
                          text:
                            content.message?.text ||
                            content.text ||
                            content.message_text ||
                            "",
                          timestamp:
                            content.message?.timestamp ||
                            content.timestamp ||
                            content.message_timestamp ||
                            content.createdAt,
                        }
                      : undefined;

                  return {
                    event: eventContent,
                    space: spaceContent,
                    idea: ideaContent,
                    message: messageContent,
                  };
                })(),
                safetyRecord: {
                  banHistory: mapBanHistory(
                    reportDetails?.safetyRecord?.banHistory ||
                      reportDetails?.reportedUser?.banHistory ||
                      []
                  ),
                  reportHistory:
                    reportDetails?.safetyRecord?.reportHistory || [],
                  blockHistory:
                    reportDetails?.safetyRecord?.blockHistory || [],
                },
                notes: reportDetails?.notes || [],
              }}
              isLoading={detailsLoading}
              onStatusChange={(newStatus) => {
                if (selectedReport) {
                  handleStatusChange(selectedReport.id, newStatus);
                }
              }}
              onNoteRequired={(newStatus) => {
                if (selectedReport) {
                  handleNoteRequired(selectedReport.id, newStatus);
                }
              }}
              onDeactivateUser={() => {
                if (reportDetails?.reportedUser?.id) {
                  // Save user data BEFORE closing detail modal (which clears reportDetails)
                  setDeactivateUserData({
                    id: reportDetails.reportedUser.id,
                    name: reportDetails.reportedUser.name || "Unknown",
                  });
                  setIsDetailModalOpen(false);
                  setIsDeactivateModalOpen(true);
                }
              }}
              onBanUser={() => {
                if (reportDetails?.reportedUser?.id) {
                  // Save user data BEFORE closing detail modal (which clears reportDetails)
                  setBanUserData({
                    id: reportDetails.reportedUser.id,
                    name: reportDetails.reportedUser.name || "Unknown",
                  });
                  setIsDetailModalOpen(false);
                  setIsBanModalOpen(true);
                }
              }}
            />
          );
        })()}

      <FlagModal
        isOpen={isFlagModalOpen}
        onClose={() => setIsFlagModalOpen(false)}
        onConfirm={(reason) => {
          if (selectedReport) {
            const itemId = selectedReport.reportedItemId;
            if (!itemId) {
              setToastMessage("Cannot flag: missing item ID");
              setShowToast(true);
              setTimeout(() => setShowToast(false), 3000);
              setIsFlagModalOpen(false);
              return;
            }
            flagMutation.mutate({
              id: itemId,
              type: flagModalType,
              reason,
            });
          }
        }}
        itemName={selectedReport?.description || ""}
        type={flagModalType}
      />

      <BanUserModal
        visible={isBanModalOpen}
        onClose={() => {
          setIsBanModalOpen(false);
          setBanUserData(null);
          // restore detail modal so user can continue
          if (selectedReport) {
            setIsDetailModalOpen(true);
          }
        }}
        onConfirm={async (duration, reason) => {
          if (!banUserData?.id) {
            console.error("❌ Cannot ban user: banUserData.id is missing");
            setToastMessage("Error: User ID not found");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            return;
          }

          // Modal sends: "1 Day", "3 Days", "7 Days", "14 Days", "30 Days", "90 Days"
          const durationMap: Record<string, number> = {
            "1 Day": 1,
            "3 Days": 3,
            "7 Days": 7,
            "14 Days": 14,
            "30 Days": 30,
            "90 Days": 90,
            Permanent: 36500,
          };
          const durationDays = durationMap[duration] || parseInt(duration) || 7;

          try {
            await apiClient.api.adminV2StudentsLockSettingsUpdate(
              banUserData.id,
              {
                lockReason: reason,
                isLocked: true,
                lockDuration: durationDays,
              }
            );
            setToastMessage("User banned successfully");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            setIsBanModalOpen(false);
            setBanUserData(null);
            // keep detail modal closed after confirm
            refetch();
            refetchStats();
          } catch (error) {
            console.error("Error banning user:", error);
            setToastMessage("Error banning user");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
          }
        }}
        userName={banUserData?.name}
      />

      <DeactivateUserModal
        visible={isDeactivateModalOpen}
        onClose={() => {
          setIsDeactivateModalOpen(false);
          setDeactivateUserData(null);
          // restore detail modal so user can continue
          if (selectedReport) {
            setIsDetailModalOpen(true);
          }
        }}
        onConfirm={async () => {
          if (!deactivateUserData?.id) {
            setToastMessage("Error: User ID not found");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            return;
          }

          try {
            await apiClient.api.adminV2StudentsDelete(deactivateUserData.id);
            setToastMessage("User deactivated successfully");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            setIsDeactivateModalOpen(false);
            setDeactivateUserData(null);
            // keep detail modal closed after confirm
            refetch();
            refetchStats();
          } catch (error) {
            console.error("Error deactivating user:", error);
            setToastMessage("Error deactivating user");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
          }
        }}
        userName={deactivateUserData?.name || ""}
      />

      {showToast && (
        <CustomToast
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}
    </main>
  );
};

export default ReportHistory;
export { ReportHistory };
