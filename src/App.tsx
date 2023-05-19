import SearchInput from "./components/SearchInput";
import Repositories from "./components/Repositories";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./store";

const App = () => {
  const { isLoading, requestError, query } = useSelector(
    (store: RootState) => store.search
  );
  const scrollbarWidth = window.innerWidth - document.body.offsetWidth;
  useEffect(() => {
    const bodyStyles = document.body.style;
    bodyStyles.paddingRight =
      isLoading || query === "" || requestError ? `${scrollbarWidth}px` : "0px";
  }, [isLoading, query, requestError]);

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
