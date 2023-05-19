import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { SingleRepositoryProps } from "../../components/SingleRepository";

interface SearchState {
  repositories: SingleRepositoryProps[];
  query: string;
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  requestError: string;
}

const url = "https://api.github.com/search/repositories?q=";

const getLocalStorageData = (): SearchState => {
  const repositoriesString: string | null =
    localStorage.getItem("repositories");
  const repositories: SingleRepositoryProps[] = repositoriesString
    ? JSON.parse(repositoriesString)
    : [];

  const query: string = localStorage.getItem("query") || "";
  const isLoading = false;
  const totalPages =
    JSON.parse(localStorage.getItem("totalPages") as string) || 1;
  const currentPage = JSON.parse(localStorage.getItem("currentPage") as string);
  const requestError = "";
  return {
    repositories,
    query,
    isLoading,
    currentPage,
    totalPages,
    requestError,
  };
};
type saveToLocalStorageType = {
  repositories: SingleRepositoryProps[];
  currentPage: number;
  totalPages: number;
};
const saveToLocalStorage = ({
  repositories,
  currentPage,
  totalPages,
}: saveToLocalStorageType) => {
  localStorage.setItem("repositories", JSON.stringify(repositories));
  localStorage.setItem("currentPage", JSON.stringify(currentPage));
  localStorage.setItem("totalPages", JSON.stringify(totalPages));
};

const initialState: SearchState = getLocalStorageData();

if (initialState.repositories.length > 0) {
  initialState.isLoading = false;
}

export const getRepos = createAsyncThunk(
  "search/getRepos",
  async ({ query, page }: { query: string; page: number }, thunkAPI) => {
    try {
      const numberOfPages = 10;
      const response = await axios(`${url}${query}&per_page=30&page=${page}`);
      let totalPages = Math.ceil(response.data.total_count / 30);
      if (totalPages > numberOfPages) totalPages = numberOfPages;

      return {
        repositories: response.data.items,
        totalPages: totalPages,
        currentPage: page,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        "Number of requests exceeded, please try again later."
      );
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setQuery(state, action) {
      state.query = action.payload;
      localStorage.setItem("query", action.payload);
    },
    setRepos(state, action) {
      state.repositories = action.payload;
      localStorage.setItem(
        "repositories",
        action.payload ? JSON.stringify(action.payload) : ""
      );
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
    setTotalPages(state, action) {
      state.totalPages = action.payload;
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRepos.pending, (state) => {
        state.requestError = "";
        state.isLoading = true;
      })
      .addCase(getRepos.fulfilled, (state, action) => {
        state.requestError = "";
        state.isLoading = false;
        state.repositories = action.payload.repositories;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        if (action.payload.repositories.length === 0)
          state.requestError = "No repositories found. Enter valid query.";
        saveToLocalStorage(action.payload);
      })
      .addCase(getRepos.rejected, (state, action) => {
        console.log(action);
        state.isLoading = false;
        state.requestError =
          "Number of requests exceeded, please try again later.";
      });
  },
});

export const { setQuery, setRepos, setIsLoading, setCurrentPage } =
  searchSlice.actions;

export default searchSlice.reducer;
