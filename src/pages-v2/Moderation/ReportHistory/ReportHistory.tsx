import React, { useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
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
import ReportsTable, { ReportRow } from "../components/ReportsTable";
import "./ReportHistory.css";

interface HistoryReportData {
  id: string;
  description: string;
  studentId: string;
  reportDate: string;
  resolvedAt: string | null;
  type: string;
  reasonTag: string;
  status: string;
}

const ReportHistory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
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
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    ],
    queryFn: () =>
      apiClient.api.adminV2ReportsList({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearchQuery,
        type: selectedTypes.join(","),
        status: selectedStatus,
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

  const historyReports: HistoryReportData[] = useMemo(
    () =>
      (reportsData?.data.data || []).map((report: any) => ({
        id: report.id,
        description: report.description,
        studentId: report.studentId,
        reportDate: report.reportDate,
        resolvedAt: report.resolvedAt || null,
        type: report.type,
        reasonTag: report.reasonTag,
        status: report.status,
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
      })),
    [historyReports]
  );

  const totalEntries = reportsData?.data.total || 0;
  const totalPages = Math.ceil(totalEntries / itemsPerPage) || 1;

  const stats = {
    total: statsData?.data.total || 0,
    resolved: statsData?.data.resolved || 0,
    dismissed: statsData?.data.dismissed || 0,
  };

  const handleStatusChange = async (reportId: string, newStatus: string) => {
    await apiClient.api.adminV2ReportsStatusPartialUpdate(reportId, {
      status: newStatus,
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
                onChange={setSelectedTypes}
                options={[
                  { value: "User", label: "User" },
                  { value: "Message", label: "Message" },
                  { value: "Event", label: "Event" },
                  { value: "Idea", label: "Idea" },
                  { value: "Space", label: "Space" },
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
                  { value: "Resolved,Dismissed", label: "All history" },
                  { value: "Resolved", label: "Resolved" },
                  { value: "Dismissed", label: "Dismissed" },
                ]}
                placeholder="All history"
                testId="status-filter"
                ariaLabel="Filter by status"
              />
            </div>
          </div>

          <ExportButton />
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
                setIsFlagModalOpen(true);
              }
            }}
            getReasonColor={getReasonColor}
            formatDate={formatReportDateParts}
            actionTestId="report-history-options"
            getStatusTestId={(row) => `status-dropdown-${row.id}`}
            showResolutionDate={true}
          />
        </div>
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

      <WriteNoteModal
        isOpen={isNoteModalOpen}
        onClose={handleNoteClose}
        onConfirm={handleNoteConfirm}
      />

      {selectedReport && isDetailModalOpen && (
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
              name: reportDetails?.reporter?.name || "Unknown",
              id: reportDetails?.reporter?.id || "N/A",
              avatar: reportDetails?.reporter?.avatar || "",
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
                        content.space?.category || content.category || "Other",
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
                      ideaBy: reportDetails?.reportedUser?.name || "Unknown",
                      avatar: reportDetails?.reportedUser?.avatar || "",
                    }
                  : undefined;

              const messageContent =
                mappedType === "Message"
                  ? {
                      text: content.text,
                      timestamp: content.timestamp || content.createdAt,
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
              banHistory: reportDetails?.reportedUser?.banHistory || [],
              reportHistory: [],
              blockHistory: [],
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
            setIsDetailModalOpen(false);
            setIsDeactivateModalOpen(true);
          }}
          onBanUser={() => {
            setIsDetailModalOpen(false);
            setIsBanModalOpen(true);
          }}
        />
      )}

      <FlagModal
        isOpen={isFlagModalOpen}
        onClose={() => setIsFlagModalOpen(false)}
        onConfirm={(reason) => {
          if (selectedReport) {
            setToastMessage(`Flag requested: ${reason}`);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            setIsFlagModalOpen(false);
          }
        }}
        itemName={selectedReport?.description || ""}
        type="event"
      />

      {selectedReport && reportDetails && (
        <BanUserModal
          visible={isBanModalOpen}
          onClose={() => {
            setIsBanModalOpen(false);
            // restore detail modal so user can continue
            setIsDetailModalOpen(true);
          }}
          onConfirm={async (_duration, reason) => {
            const userId = reportDetails?.reportedUser?.id;
            if (!userId) return;

            await apiClient.api.adminV2StudentsLockSettingsUpdate(userId, {
              lockReason: reason,
              isLocked: true,
            });
            setToastMessage("User banned successfully");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            setIsBanModalOpen(false);
            // keep detail modal closed after confirm
            refetch();
            refetchStats();
          }}
          userName={reportDetails?.reportedUser?.name}
        />
      )}

      {selectedReport && reportDetails && (
        <DeactivateUserModal
          visible={isDeactivateModalOpen}
          onClose={() => {
            setIsDeactivateModalOpen(false);
            setIsDetailModalOpen(true);
          }}
          onConfirm={async () => {
            const userId = reportDetails?.reportedUser?.id;
            if (!userId) return;
            await apiClient.api.adminV2StudentsDelete(userId);
            setToastMessage("User deactivated successfully");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            setIsDeactivateModalOpen(false);
            // keep detail modal closed after confirm
            refetch();
            refetchStats();
          }}
          userName={reportDetails?.reportedUser?.name || ""}
        />
      )}

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
