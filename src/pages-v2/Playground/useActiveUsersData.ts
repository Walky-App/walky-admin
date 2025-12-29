import { useEffect, useState } from "react";
import { apiClient } from "../../API";

export type TimePeriod = "month" | "week" | "day";
export type ActiveDatum = { label: string; count: number };

const fallbackData: ActiveDatum[] = [
  { label: "Mon", count: 32 },
  { label: "Tue", count: 44 },
  { label: "Wed", count: 28 },
  { label: "Thu", count: 36 },
  { label: "Fri", count: 48 },
  { label: "Sat", count: 18 },
  { label: "Sun", count: 22 },
];

export function useActiveUsersData(period: TimePeriod) {
  const [data, setData] = useState<ActiveDatum[]>(fallbackData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await (
          apiClient as any
        )?.analytics?.usersMonthlyActiveList?.({ period });
        const payload: any = res?.data ?? res;
        const monthlyData: ActiveDatum[] =
          payload?.monthlyData
            ?.filter((d: any) => d && typeof d.count === "number")
            ?.map((d: any) => ({ label: d.label ?? "", count: d.count })) ?? [];
        const chartData: ActiveDatum[] = Array.isArray(payload?.chartData)
          ? payload.chartData.map((count: number, idx: number) => ({
              label: payload.chartLabels?.[idx] ?? `#${idx + 1}`,
              count,
            }))
          : [];
        const combined = monthlyData.length ? monthlyData : chartData;
        if (!ignore && combined.length) {
          setData(combined);
        }
      } catch (err: any) {
        console.error("Failed to load active users", err);
        if (!ignore) setError(err?.message ?? "Failed to load data");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [period]);

  return { data, loading, error };
}
