import SingleRepository from "./SingleRepository";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { getRepos } from "../features/search/searchSlice";
import { SingleRepositoryProps } from "./SingleRepository";

const RepositoriesList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { repositories, query, totalPages, currentPage, isLoading } =
    useSelector((store: RootState) => store.search);
  if (!repositories.length && query.length > 0) {
    return <h2>No repositories found. Enter valid query.</h2>;
  }
  return (
    <>
      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => dispatch(getRepos({ query, page: index + 1 }))}
              className={
                currentPage === index + 1
                  ? "pagination__button active"
                  : "pagination__button"
              }
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
      <div className="repo__container">
        {isLoading ? (
          <div className="repo__container">
            <h2>Loading...</h2>
          </div>
        ) : (
          repositories.map((repo: SingleRepositoryProps) => {
            return <SingleRepository key={repo.id} {...repo} />;
          })
        )}
      </div>
    </>
  );
};
export default RepositoriesList;
