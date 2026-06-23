import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "./test/test-utils";
import { useTheme } from "./hooks/useTheme";
import { useSchool } from "./contexts/SchoolContext";
import { useCampus } from "./contexts/CampusContext";
import { useDashboard } from "./contexts/DashboardContext";
import { useDeactivatedUser } from "./contexts/DeactivatedUserContext";

/**
 * Foundation smoke test: proves `renderWithProviders` supplies every context
 * the app depends on. If a provider is dropped from the wrapper (or a context's
 * shape changes), the relevant hook throws "must be used within a Provider" and
 * this fails — surfacing harness breakage before it cascades into every other
 * test.
 */
function ContextProbe() {
  const { theme } = useTheme();
  const { selectedSchool } = useSchool();
  const { selectedCampus } = useCampus();
  const { timePeriod } = useDashboard();
  const { isDeactivated } = useDeactivatedUser();

  return (
    <div data-testid="probe">
      {`theme:${theme ? "ok" : "missing"}|`}
      {`school:${selectedSchool ? "set" : "none"}|`}
      {`campus:${selectedCampus ? "set" : "none"}|`}
      {`period:${timePeriod}|`}
      {`deactivated:${isDeactivated}`}
    </div>
  );
}

describe("test harness", () => {
  it("supplies the full provider stack via renderWithProviders", () => {
    renderWithProviders(<ContextProbe />);
    const probe = screen.getByTestId("probe");
    expect(probe).toHaveTextContent("theme:ok");
    expect(probe).toHaveTextContent("school:none");
    expect(probe).toHaveTextContent("campus:none");
    expect(probe).toHaveTextContent("period:month");
    expect(probe).toHaveTextContent("deactivated:false");
  });

  it("renders at a custom route without throwing", () => {
    expect(() =>
      renderWithProviders(<ContextProbe />, { route: "/events" })
    ).not.toThrow();
  });
});
