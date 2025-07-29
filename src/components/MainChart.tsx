import { useTheme } from "../hooks/useTheme";

const MainChart = () => {
  const { theme } = useTheme();

  return (
    <div
      style={{
        height: "300px",
        marginTop: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: `1px solid ${theme.colors.borderColor}`,
        borderRadius: "8px",
        backgroundColor: theme.isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)"
      }}
    >
      <div style={{ textAlign: "center" }}>
        <p style={{ color: theme.colors.secondary, fontSize: "16px", marginBottom: "8px" }}>
          Chart functionality temporarily disabled
        </p>
        <p style={{ color: theme.colors.secondary, fontSize: "14px" }}>
          Main chart will be restored soon
        </p>
      </div>
    </div>
  );
};

export default MainChart;
