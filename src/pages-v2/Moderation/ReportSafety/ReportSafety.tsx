import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  WriteNoteModal,
  ReportDetailModal,
  FlagModal,
  CustomToast,
  BanUserModal,
  DeactivateUserModal,
  Pagination,
  SkeletonLoader,
} from "../../../components-v2";
import { ReportStatus, ReportType } from "../../../components-v2";
import { useDebounce } from "../../../hooks/useDebounce";
import { usePermissions } from "../../../hooks/usePermissions";
import ReportsTable, { ReportRow } from "../components/ReportsTable";
import "./ReportSafety.css";

interface ReportData {
  id: string;
  description: string;
  studentId: string;
  reportedItemId?: string;
  reportDate: string;
  type: string;
  reason: string;
  reasonTag: string;
  status: string;
  isFlagged?: boolean;
}

const ReportSafety: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { canExport, canUpdate } = usePermissions();

  // Check permissions for this page
  const showExport = canExport("report_safety");
  const canChangeReportStatus = canUpdate("report_safety");
  const canFlagReportedItems = canUpdate("report_safety");

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
  };
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>(
    "Pending review,Under evaluation"
  );
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    reportId: string;
    newStatus: string;
  } | null>(null);
  const [shouldReopenDetailsAfterNote, setShouldReopenDetailsAfterNote] =
    useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [selectedReportDetails, setSelectedReportDetails] = useState<any>(null);
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
  const [flagModalType, setFlagModalType] = useState<
    "event" | "idea" | "space" | "user"
  >("event");
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [banUserData, setBanUserData] = useState<{ id: string; name: string } | null>(null);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [deactivateUserData, setDeactivateUserData] = useState<{ id: string; name: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
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
    isLoading: isReportsLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: [
      "reports",
      currentPage,
      debouncedSearchQuery,
      selectedTypes,
      selectedStatus,
      sortOrder,
    ],
    queryFn: () =>
      apiClient.api.adminV2ReportsList({
        page: currentPage,
        limit: 10,
        search: debouncedSearchQuery,
        type: selectedTypes.join(","),
        status: selectedStatus,
        sortBy: "reportDate",
        sortOrder: sortOrder,
      }),
    placeholderData: keepPreviousData,
  });

  const { data: statsData } = useQuery({
    queryKey: ["reportStats"],
    queryFn: () => apiClient.api.adminV2ReportsStatsList(),
    placeholderData: keepPreviousData,
  });

  const deleteStudentMutation = useMutation({
    mutationFn: (id: string) => apiClient.api.adminV2StudentsDelete(id),
    onSuccess: () => {
      setToastMessage("User deactivated successfully");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setIsDeactivateModalOpen(false);
      refetch();
    },
  });

  const banStudentMutation = useMutation({
    mutationFn: (payload: { id: string; duration: number; reason: string }) =>
      apiClient.api.adminV2StudentsLockSettingsUpdate(payload.id, {
        lockReason: payload.reason,
        isLocked: true,
        lockDuration: payload.duration,
      }),
    onSuccess: () => {
      setToastMessage("User banned successfully");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setIsBanModalOpen(false);
      refetch();
    },
    onError: (error) => {
      console.error("Error banning user:", error);
      setToastMessage("Error banning user");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    },
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
      queryClient.invalidateQueries({ queryKey: ["reports"] });
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

  const reports: ReportData[] = useMemo(
    () =>
      (reportsData?.data.data || []).map((report: any) => ({
        id: report.id,
        description: report.description,
        studentId: report.studentId,
        reportedItemId: report.reportedItemId,
        reportDate: report.reportDate,
        type: report.type,
        reason: report.reason,
        reasonTag: report.reasonTag,
        status: report.status,
        isFlagged: report.isFlagged,
      })),
    [reportsData]
  );

  const tableRows: ReportRow[] = useMemo(
    () =>
      reports.map((report) => ({
        id: report.id,
        description: report.description,
        studentId: report.studentId,
        reportDate: report.reportDate,
        type: report.type,
        reasonTag: report.reasonTag,
        status: report.status,
        isFlagged: report.isFlagged,
      })),
    [reports]
  );

  const totalEntries = reportsData?.data.total || 0;
  const totalPages = Math.ceil(totalEntries / 10) || 1;

  const totalReports = statsData?.data.total || 0;
  const pendingReports = statsData?.data.pending || 0;
  const underEvaluationReports = statsData?.data.underEvaluation || 0;

  const handleStatusChange = async (reportId: string, newStatus: string) => {
    await apiClient.api.adminV2ReportsStatusPartialUpdate(reportId, {
      status: newStatus,
    });

    // Update local state if this is the selected report
    if (selectedReport && selectedReport.id === reportId) {
      setSelectedReport({
        ...selectedReport,
        status: newStatus,
      });
    }

    refetch();
  };

  const handleNoteRequired = (reportId: string, newStatus: string) => {
    setShouldReopenDetailsAfterNote(isDetailModalOpen);
    // Close detail modal first, then open note modal after a brief delay
    // to prevent overlay issues
    if (isDetailModalOpen) {
      setIsDetailModalOpen(false);
    }

    setPendingStatusChange({ reportId, newStatus });
    // Use setTimeout to ensure detail modal is fully closed before opening note modal
    setTimeout(() => {
      setIsNoteModalOpen(true);
    }, 100);
  };

  const handleNoteConfirm = async (note: string) => {
    if (pendingStatusChange) {
      const currentPendingChange = pendingStatusChange;

      // Clear pending state first to prevent handleNoteClose from reopening detail modal
      setPendingStatusChange(null);
      setShouldReopenDetailsAfterNote(false);

      await apiClient.api.adminV2ReportsNoteCreate(
        currentPendingChange.reportId,
        { note }
      );
      await handleStatusChange(
        currentPendingChange.reportId,
        currentPendingChange.newStatus
      );

      // Show success message
      const statusMessage =
        currentPendingChange.newStatus === "Resolved"
          ? "Report resolved successfully"
          : "Report dismissed successfully";
      setToastMessage(statusMessage);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);

      // Clean up - close everything after successful resolution
      setSelectedReport(null);
      setSelectedReportDetails(null);
    }
  };

  const handleNoteClose = () => {
    setIsNoteModalOpen(false);

    // Only reopen detail modal if user cancelled (didn't confirm)
    // pendingStatusChange will still exist if user cancelled
    if (shouldReopenDetailsAfterNote && selectedReport && pendingStatusChange) {
      setTimeout(() => {
        setIsDetailModalOpen(true);
      }, 100);
    }

    setPendingStatusChange(null);
    setShouldReopenDetailsAfterNote(false);
  };

  const handleViewReportDetails = async (report: ReportData) => {
    setSelectedReport(report);
    setIsDetailModalOpen(true);
    setSelectedReportDetails(null);

    try {
      const res = (await apiClient.api.adminV2ReportsDetail(report.id)) as any;
      setSelectedReportDetails(res.data);
    } catch (error) {
      console.error("Failed to fetch report details:", error);
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

  const renderTableSkeletonRows = () => (
    <>
      <tr>
        <td colSpan={6}>
          <SkeletonLoader height="64px" />
        </td>
      </tr>
      <tr>
        <td colSpan={6}>
          <SkeletonLoader height="64px" />
        </td>
      </tr>
      <tr>
        <td colSpan={6}>
          <SkeletonLoader height="64px" />
        </td>
      </tr>
    </>
  );

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

  return (
    <main className="report-safety-page">
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
            <h3 className="stats-card-title">Total</h3>
            <div className="stats-card-icon" style={{ background: "#e5e4ff" }}>
              <AssetIcon name="mod-table-icon" size={30} color="#8280FF" />
            </div>
          </div>
          <p className="stats-card-value">
            {isReportsLoading ? "..." : totalReports}
          </p>
        </div>

        <div className="stats-card">
          <div className="stats-card-header">
            <h3 className="stats-card-title">Pending review</h3>
            <div className="stats-card-icon" style={{ background: "#EEF0F1" }}>
              <AssetIcon name="pending-review-icon" size={30} color="#5B6168" />
            </div>
          </div>
          <p className="stats-card-value">
            {isReportsLoading ? "..." : pendingReports}
          </p>
        </div>

        <div className="stats-card">
          <div className="stats-card-header">
            <h3 className="stats-card-title">Under evaluation</h3>
            <div className="stats-card-icon" style={{ background: "#FFF3D6" }}>
              <AssetIcon
                name="under-evaluation-icon"
                size={30}
                color="#EBB129"
              />
            </div>
          </div>
          <p className="stats-card-value">
            {isReportsLoading ? "..." : underEvaluationReports}
          </p>
        </div>
      </div>

      <div className="reports-container">
        <div className="reports-header">
          <div className="reports-title-section">
            <h2 className="reports-title">Reported users & content</h2>
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
                onChange={(value) => {
                  setSelectedStatus(value);
                  setCurrentPage(1);
                }}
                options={[
                  {
                    value: "Pending review,Under evaluation",
                    label: "All pending",
                  },
                  { value: "Pending review", label: "Pending review" },
                  { value: "Under evaluation", label: "Under evaluation" },
                ]}
                placeholder="Status"
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
            loading={isFetching || isReportsLoading}
            renderSkeletonRows={renderTableSkeletonRows}
            emptyState={{
              message: "No reported users or content",
              iconName: "nd-report-icon",
              iconColor: "#546fd9",
              iconSize: 28,
              padding: "32px 24px",
            }}
            onRowClick={(row) => {
              const matched = reports.find((r) => r.id === row.id);
              if (matched) handleViewReportDetails(matched);
            }}
            onStatusChange={(id, newStatus) =>
              handleStatusChange(id, newStatus)
            }
            onNoteRequired={(id, newStatus) =>
              handleNoteRequired(id, newStatus)
            }
            onFlag={(row) => {
              const matched = reports.find((r) => r.id === row.id);
              if (matched) {
                setSelectedReport(matched);
                setFlagModalType(normalizeFlagType(matched.type));
                setIsFlagModalOpen(true);
              }
            }}
            getReasonColor={getReasonColor}
            formatDate={formatReportDateParts}
            actionTestId="report-options"
            getStatusTestId={(row) => `status-dropdown-${row.id}`}
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
              entriesPerPage={10}
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
        selectedReportDetails &&
        (() => {
          // Check if this is an event from a space
          const isEventFromSpace =
            selectedReport.type?.toLowerCase() === "event" &&
            selectedReportDetails.content?.isFromSpace;

          const mappedType = isEventFromSpace
            ? ("Event of Space" as ReportType)
            : mapReportType(selectedReport.type);

          const reporter = selectedReportDetails.reporter || {};
          const reporterName =
            reporter.name ||
            reporter.fullName ||
            reporter.full_name ||
            reporter.username ||
            reporter.email ||
            selectedReportDetails.reportedBy ||
            selectedReportDetails.reported_by ||
            selectedReportDetails.reported_by_name ||
            selectedReportDetails.reported_by_email ||
            "Unknown";

          const reporterId =
            reporter.id ||
            reporter.userId ||
            reporter.user_id ||
            selectedReportDetails.reporterId ||
            selectedReportDetails.reportedById ||
            selectedReportDetails.reported_by_id ||
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
                setSelectedReportDetails(null);
              }}
              reportType={mappedType}
              reportData={{
                associatedUser: {
                  name: selectedReportDetails.reportedUser?.name || "Unknown",
                  id: selectedReportDetails.reportedUser?.id || "N/A",
                  avatar: selectedReportDetails.reportedUser?.avatar,
                  email:
                    selectedReportDetails.reportedUser?.email ||
                    selectedReportDetails.reportedUser?.emailAddress ||
                    selectedReportDetails.reportedUser?.mail ||
                    "",
                  isBanned:
                    selectedReportDetails.reportedUser?.isBanned || false,
                  isDeactivated:
                    selectedReportDetails.reportedUser?.isDeactivated || false,
                },
                status: selectedReport.status as ReportStatus,
                reason: selectedReport.reason,
                reasonColor: "red",
                reportDate: selectedReport.reportDate,
                contentId: selectedReport.id,
                description: selectedReport.description,
                reportingUser: {
                  name: reporterName,
                  id: reporterId,
                  avatar: reporterAvatar,
                },
                content: {
                  event:
                    mappedType === "Event" || mappedType === "Event of Space"
                      ? {
                          image: selectedReportDetails.content?.image_url,
                          date: selectedReportDetails.content?.date,
                          title: selectedReportDetails.content?.name,
                          location: selectedReportDetails.content?.location,
                        }
                      : undefined,
                  idea:
                    mappedType === "Idea"
                      ? {
                          title: selectedReportDetails.content?.title,
                          tag:
                            selectedReportDetails.content?.looking_for || "N/A",
                          description:
                            selectedReportDetails.content?.description,
                          ideaBy:
                            selectedReportDetails.reportedUser?.name ||
                            "Unknown",
                          avatar:
                            selectedReportDetails.reportedUser?.avatar || "",
                        }
                      : undefined,
                  space:
                    mappedType === "Space"
                      ? {
                          id: selectedReportDetails.content?.id,
                          title: selectedReportDetails.content?.name,
                          description:
                            selectedReportDetails.content?.description,
                          image: selectedReportDetails.content?.image_url,
                          category: "Other",
                          memberCount: "0",
                        }
                      : mappedType === "Event of Space" &&
                        selectedReportDetails.content?.space
                      ? {
                          id: selectedReportDetails.content.space.id,
                          title: selectedReportDetails.content.space.name,
                          description:
                            selectedReportDetails.content.space.description,
                          image: selectedReportDetails.content.space.image,
                          category:
                            selectedReportDetails.content.space.category ||
                            "Space",
                          memberCount:
                            selectedReportDetails.content.space.memberCount ||
                            "0 members",
                        }
                      : undefined,
                },
                safetyRecord: {
                  banHistory:
                    selectedReportDetails.reportedUser?.banHistory || [],
                  reportHistory: [],
                  blockHistory: [],
                },
                notes: selectedReportDetails.notes || [],
              }}
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
                if (selectedReportDetails?.reportedUser?.id) {
                  // Save user data BEFORE closing detail modal
                  setDeactivateUserData({
                    id: selectedReportDetails.reportedUser.id,
                    name: selectedReportDetails.reportedUser.name || "Unknown",
                  });
                  setIsDetailModalOpen(false);
                  setIsDeactivateModalOpen(true);
                }
              }}
              onBanUser={() => {
                if (selectedReportDetails?.reportedUser?.id) {
                  // Save user data BEFORE closing detail modal (which clears selectedReportDetails)
                  setBanUserData({
                    id: selectedReportDetails.reportedUser.id,
                    name: selectedReportDetails.reportedUser.name || "Unknown",
                  });
                  setIsDetailModalOpen(false);
                  setIsBanModalOpen(true);
                }
              }}
              onSpaceClick={(spaceId) => {
                setIsDetailModalOpen(false);
                navigate(`/spaces?spaceId=${spaceId}`);
              }}
            />
          );
        })()}

      <BanUserModal
        visible={isBanModalOpen}
        onClose={() => {
          setIsBanModalOpen(false);
          setBanUserData(null);
          if (selectedReport) {
            setIsDetailModalOpen(true);
          }
        }}
        onConfirm={(duration, reason) => {
          if (banUserData?.id) {
            // Modal sends: "1 Day", "3 Days", "7 Days", "14 Days", "30 Days", "90 Days"
            const durationMap: Record<string, number> = {
              "1 Day": 1,
              "3 Days": 3,
              "7 Days": 7,
              "14 Days": 14,
              "30 Days": 30,
              "90 Days": 90,
              "Permanent": 36500,
            };
            const durationDays = durationMap[duration] || parseInt(duration) || 7;

            banStudentMutation.mutate({
              id: banUserData.id,
              duration: durationDays,
              reason,
            });
            setIsBanModalOpen(false);
            setBanUserData(null);
          } else {
            console.error("❌ Cannot ban user: banUserData.id is missing");
            setToastMessage("Error: User ID not found");
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
          if (selectedReport) {
            setIsDetailModalOpen(true);
          }
        }}
        onConfirm={() => {
          if (deactivateUserData?.id) {
            deleteStudentMutation.mutate(deactivateUserData.id);
            setDeactivateUserData(null);
          }
          setIsDeactivateModalOpen(false);
        }}
        userName={deactivateUserData?.name || ""}
      />

      <FlagModal
        isOpen={isFlagModalOpen}
        onClose={() => setIsFlagModalOpen(false)}
        onConfirm={(reason) => {
          if (selectedReport && selectedReport.reportedItemId) {
            flagMutation.mutate({
              id: selectedReport.reportedItemId,
              type: flagModalType,
              reason,
            });
          } else {
            setToastMessage("Unable to flag: missing item ID");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            setIsFlagModalOpen(false);
          }
        }}
        itemName={selectedReport?.description || ""}
        type={flagModalType}
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

export default ReportSafety;
export { ReportSafety };
