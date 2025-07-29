import { useParams } from "react-router-dom";
import AmbassadorDetails from "./AmbassadorDetails";

const AmbassadorView = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="p-2" data-testid="ambassador-view-wrapper">
      <AmbassadorDetails ambassadorId={id} inTabView={false} />
    </div>
  );
};

export default AmbassadorView;
