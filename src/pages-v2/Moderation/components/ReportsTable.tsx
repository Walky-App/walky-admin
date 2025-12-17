import React from "react";
import {
  ActionDropdown,
  AssetIcon,
  CopyableId,
  Divider,
  NoData,
  StatusDropdown,
} from "../../../components-v2";
import { ReportStatus, IconName } from "../../../components-v2";
import {
  formatChipLabel,
  getReasonChipStyle,
  getUserReasonChipStyle,
  getEventReasonChipStyle,
  getIdeaReasonChipStyle,
  getSpaceReasonChipStyle,
} from "../../../components-v2/utils/chipStyles";
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

  const getReasonStyleByType = (reason: string, type: string) => {
    const normalizedType = type.toLowerCase();
    if (normalizedType.includes("event"))
      return getEventReasonChipStyle(reason);
    if (normalizedType.includes("idea")) return getIdeaReasonChipStyle(reason);
    if (normalizedType.includes("space"))
      return getSpaceReasonChipStyle(reason);
    return getUserReasonChipStyle(reason);
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
                  name={sortOrder === "asc" ? "arrow-up" : "arrow-down"}
                  size={16}
                  color="#1d1b20"
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
                  <tr>
                    <td>
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
                      {(() => {
                        const style =
                          getReasonStyleByType(report.reasonTag, report.type) ||
                          getReasonChipStyle(report.reasonTag);
                        const label =
                          style.label || formatChipLabel(report.reasonTag);
                        return (
                          <div
                            className="reason-badge"
                            style={{
                              background: style.bg,
                              color: style.text,
                              padding: style.padding || "10px",
                            }}
                          >
                            <span>{label}</span>
                          </div>
                        );
                      })()}
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
                                  label: "Flag",
                                  icon: "flag-icon" as const,
                                  iconSize: 18,
                                  onClick: (e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    onFlag(report);
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
