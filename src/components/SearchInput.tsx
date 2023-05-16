import { useSelector, useDispatch } from "react-redux";
import { setQuery, setRepos } from "../features/search/searchSlice";
import { AppDispatch, RootState } from "../store";
import { getRepos } from "../features/search/searchSlice";
import { useEffect } from "react";

const SearchInput = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { query } = useSelector((store: RootState) => store.search);
  useEffect(() => {
    query === "" && dispatch(setRepos([]));
  }, [query]);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setQuery(event.target.value));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    query !== ""
      ? dispatch(getRepos({ query, page: 1 }))
      : dispatch(setRepos([]));
  };

  return (
    <div className="search">
      <div className="search__wrapper">
        <form className="search__form" action="submit" onSubmit={handleSubmit}>
          <input
            className="search__input"
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="Enter your query..."
          />
          <button className="search__btn" type="submit">
            Search
          </button>
        </form>
      </div>
    </div>
  );
};
export default SearchInput;
