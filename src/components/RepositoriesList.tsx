import SingleRepository from "./SingleRepository";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import {
  getRepos,
  setCurrentPage,
  setRepos,
} from "../features/search/searchSlice";
import { SingleRepositoryProps } from "./SingleRepository";
import { useEffect } from "react";
import { motion } from "framer-motion";
import Loading from "./Loading";

const RepositoriesList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    repositories,
    query,
    totalPages,
    currentPage,
    isLoading,
    requestError,
  } = useSelector((store: RootState) => store.search);

  useEffect(() => {
    if (query.length === 0) dispatch(setRepos([]));
  }, [query]);

  if (requestError) {
    return <h2>{requestError}</h2>;
  }

  return (
    <>
      {totalPages > 1 && repositories.length > 0 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                dispatch(setCurrentPage(index + 1));
                dispatch(getRepos({ query, page: index + 1 }));
              }}
              className="pagination__button"
              animate={{
                backgroundColor:
                  currentPage === index + 1 ? "#6495ed" : "#ffffff",
                color: currentPage === index + 1 ? "#ffffff" : "#000000",
              }}
              transition={{ duration: 0.8 }}
            >
              {index + 1}
            </motion.button>
          ))}
        </div>
      )}
      <div className="repo__container">
        {isLoading ? (
          <Loading />
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
