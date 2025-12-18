import React from "react";
import { CTooltip } from "@coreui/react";
import {
  ActionDropdown,
  AssetIcon,
  Chip,
  CopyableId,
  Divider,
  NoData,
  StatusDropdown,
} from "../../../components-v2";
import { useTheme } from "../../../hooks/useTheme";
import { ReportStatus, IconName } from "../../../components-v2";
import { getReportTypeIcon } from "../../../components-v2/utils/reportTypeIcon";

export type ReportRow = {
  id: string;
  description: string;
  studentId: string;
  reportDate: string;
  resolvedAt?: string | null;
  type: string;
  reasonTag: string;
  status: string;
  isFlagged?: boolean;
  flagReason?: string | null;
};

interface EmptyStateProps {
  message: string;
  iconName: IconName;
  iconColor: string;
  iconSize?: number;
  padding?: string;
}

interface ReportsTableProps {
  rows: ReportRow[];
  loading?: boolean;
  renderSkeletonRows?: () => React.ReactNode;
  emptyState: EmptyStateProps;
  onRowClick: (row: ReportRow) => void;
  onStatusChange: (id: string, newStatus: string) => void;
  onNoteRequired?: (id: string, newStatus: string) => void;
  onFlag: (row: ReportRow) => void;
  onUnflag?: (row: ReportRow) => void;
  getReasonColor: (reason: string) => { bg: string; text: string };
  formatDate?: (value: string) => { date: string; time?: string | null };
  statusOptions?: ReportStatus[] | string[];
  actionTestId?: string;
  statusTestIdPrefix?: string;
  getStatusTestId?: (row: ReportRow) => string;
  hideDividerWhenFlagged?: boolean;
  sortOrder?: "asc" | "desc";
  onSort?: () => void;
  showResolutionDate?: boolean;
  canChangeStatus?: boolean;
  canFlag?: boolean;
}

export const ReportsTable: React.FC<ReportsTableProps> = ({
  rows,
  loading = false,
  renderSkeletonRows,
  emptyState,
  onRowClick,
  onStatusChange,
  onNoteRequired,
  onFlag,
  onUnflag,
  getReasonColor: _getReasonColor,
  formatDate,
  statusOptions = [
    "Pending review",
    "Under evaluation",
    "Resolved",
    "Dismissed",
  ],
  actionTestId = "report-options",
  statusTestIdPrefix = "report",
  getStatusTestId,
  hideDividerWhenFlagged = false,
  sortOrder,
  onSort,
  showResolutionDate = false,
  canChangeStatus = true,
  canFlag = true,
}) => {
  const columnCount = showResolutionDate ? 7 : 6;
  const { theme } = useTheme();

  const getReasonChipType = (type: string) => {
    const normalizedType = type.toLowerCase();
    if (normalizedType.includes("event")) return "eventReason" as const;
    if (normalizedType.includes("idea")) return "ideaReason" as const;
    if (normalizedType.includes("space")) return "spaceReason" as const;
    return "userReason" as const;
  };

  return (
    <div className="reports-table-wrapper">
      <table className="reports-table">
        <thead
          style={{
            opacity: !loading && rows.length === 0 ? 0.4 : 1,
          }}
        >
          <tr>
            <th>Report description</th>
            <th>
              <div
                className="sortable-header"
                onClick={onSort}
                style={{ cursor: onSort ? "pointer" : "default" }}
                role="button"
                tabIndex={onSort ? 0 : undefined}
                onKeyDown={(e) => {
                  if (onSort && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    onSort();
                  }
                }}
              >
                Report date
                <AssetIcon
                  name="swap-arrows-icon"
                  size={14}
                  color={theme.colors.bodyColor}
                  style={{
                    transform: sortOrder === "asc" ? "rotate(180deg)" : "none",
                    transition: "transform 0.2s ease",
                  }}
                />
              </div>
            </th>
            <th>Type</th>
            <th>Reason</th>
            {showResolutionDate && <th>Resolution date</th>}
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <div className="content-space-divider" />

        <tbody>
          {loading ? (
            renderSkeletonRows ? (
              renderSkeletonRows()
            ) : null
          ) : rows.length === 0 ? (
            <tr>
              <td
                colSpan={columnCount}
                style={{
                  padding: emptyState.padding || "32px 24px",
                  textAlign: "center",
                }}
              >
                <NoData
                  iconName={emptyState.iconName}
                  iconColor={emptyState.iconColor}
                  iconSize={emptyState.iconSize ?? 28}
                  message={emptyState.message}
                />
              </td>
            </tr>
          ) : (
            rows.map((report, index) => {
              const formattedDate = formatDate
                ? formatDate(report.reportDate)
                : { date: report.reportDate, time: null };

              return (
                <React.Fragment key={report.id}>
                  <tr className={report.isFlagged ? "report-row-flagged" : ""}>
                    <td>
                      {report.isFlagged && (
                        <CTooltip
                          content={report.flagReason || "Flagged"}
                          placement="top"
                        >
                          <div className="report-flag-icon">
                            <AssetIcon
                              name="flag-icon"
                              size={16}
                              color="#d32f2f"
                            />
                          </div>
                        </CTooltip>
                      )}
                      <div className="report-description-cell">
                        <div className="report-content-wrapper">
                          <p
                            className="report-description"
                            onClick={() => onRowClick(report)}
                          >
                            {report.description}
                          </p>
                          <CopyableId
                            id={report.studentId}
                            label="Student ID"
                            variant="primary"
                            iconColor="#6366F1"
                            testId="copy-student-id"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="report-date">
                      {formattedDate.time ? (
                        <div className="report-date-cell">
                          <div>{formattedDate.date}</div>
                          <div className="report-time">
                            {formattedDate.time}
                          </div>
                        </div>
                      ) : (
                        formattedDate.date
                      )}
                    </td>
                    <td className="report-type">
                      <div className="report-type-cell">
                        <AssetIcon
                          name={getReportTypeIcon(report.type)}
                          size={20}
                          color="#1D1B20"
                        />
                      </div>
                    </td>
                    <td>
                      <Chip
                        value={report.reasonTag}
                        type={getReasonChipType(report.type)}
                      />
                    </td>
                    {showResolutionDate && (
                      <td className="report-date">
                        {report.resolvedAt
                          ? (() => {
                              const resolvedDate = formatDate
                                ? formatDate(report.resolvedAt)
                                : { date: report.resolvedAt, time: null };
                              return resolvedDate.time ? (
                                <div className="report-date-cell">
                                  <div>{resolvedDate.date}</div>
                                  <div className="report-time">
                                    {resolvedDate.time}
                                  </div>
                                </div>
                              ) : (
                                resolvedDate.date
                              );
                            })()
                          : "-"}
                      </td>
                    )}
                    <td>
                      <StatusDropdown
                        value={report.status}
                        onChange={(newStatus) =>
                          onStatusChange(report.id, newStatus)
                        }
                        onNoteRequired={(newStatus) =>
                          onNoteRequired?.(report.id, newStatus)
                        }
                        options={statusOptions}
                        testId={
                          getStatusTestId
                            ? getStatusTestId(report)
                            : `${statusTestIdPrefix}-status-dropdown-${report.id}`
                        }
                        disabled={!canChangeStatus}
                      />
                    </td>
                    <td>
                      <ActionDropdown
                        testId={actionTestId}
                        items={[
                          {
                            label: "Report details",
                            onClick: (e) => {
                              e.stopPropagation();
                              onRowClick(report);
                            },
                          },
                          ...(canFlag
                            ? [
                                {
                                  label: report.isFlagged ? "Unflag" : "Flag",
                                  icon: "flag-icon" as const,
                                  iconSize: 18,
                                  variant: report.isFlagged
                                    ? ("danger" as const)
                                    : undefined,
                                  onClick: (e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    if (report.isFlagged && onUnflag) {
                                      onUnflag(report);
                                    } else {
                                      onFlag(report);
                                    }
                                  },
                                },
                              ]
                            : []),
                        ]}
                      />
                    </td>
                  </tr>
                  {index < rows.length - 1 &&
                    !(hideDividerWhenFlagged && report.isFlagged) && (
                      <tr className="report-divider-row">
                        <td colSpan={columnCount - 1}>
                          <Divider />
                        </td>
                      </tr>
                    )}
                </React.Fragment>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReportsTable;
