import { useParams } from "react-router-dom";
import CampusDetails from "./CampusDetails";

const CampusView = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="p-2">
      <CampusDetails campusId={id} inTabView={false} />
    </div>
  );
};

export default CampusView;
