export interface WeekData {
  label: string;
  dateRange: string;
}

export interface BarDataItem {
  [key: string]: number;
}

export interface LegendItem {
  key: string;
  label: string;
  color: string;
}

export interface StackedBarChartProps {
  title: string;
  weeks: WeekData[];
  data: BarDataItem[];
  legend: LegendItem[];
  onBarClick?: (legendKey: string, legendLabel: string) => void;
}
