import SearchInput from "./components/SearchInput";
import Repositories from "./components/Repositories";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <main>
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
