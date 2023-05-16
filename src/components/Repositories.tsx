import { useLocation } from "react-router-dom";
import RepositoriesList from "./RepositoriesList";
import SingleRepoPage from "./SingleRepoPage";

const Repositories = () => {
  const location = useLocation();

  return (
    <>{location.pathname === "/" ? <RepositoriesList /> : <SingleRepoPage />}</>
  );
};
export default Repositories;
