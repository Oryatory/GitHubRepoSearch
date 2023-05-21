import SearchInput from "./components/SearchInput";
import Repositories from "./components/Repositories";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./store";

const scrollbarWidth = window.innerWidth - document.body.offsetWidth;

const App = () => {
  const { isLoading, requestError, query, repositories } = useSelector(
    (store: RootState) => store.search
  );

  useEffect(() => {
    const bodyStyles = document.body.style;
    console.log(
      isLoading || query === "" || requestError || repositories.length === 0
    );

    bodyStyles.paddingRight =
      isLoading || query === "" || requestError || repositories.length === 0
        ? `${scrollbarWidth}px`
        : "0px";
  }, [isLoading, query, requestError, repositories]);

  return (
    <Router>
      <main>
        <div className="title">Git-Hub repo search</div>

        <SearchInput />
        <Routes>
          <Route path="/" element={<Repositories />} />
          <Route path="/:repoId" element={<Repositories />} />
        </Routes>
      </main>
    </Router>
  );
};
export default App;
