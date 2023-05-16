import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { SingleRepositoryProps } from "../../components/SingleRepository";

interface SearchState {
  repositories: SingleRepositoryProps[];
  query: string;
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
}

const url = "https://api.github.com/search/repositories?q=";
const accessToken =
  "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";

const getLocalStorageData = (): SearchState => {
  const repositoriesString: string | null =
    localStorage.getItem("repositories");
  const repositories: SingleRepositoryProps[] = repositoriesString
    ? JSON.parse(repositoriesString)
    : [];

  const query: string = localStorage.getItem("query") || "";
  const isLoading = true;
  const totalPagesString = localStorage.getItem("totalPages");
  const totalPages = totalPagesString ? JSON.parse(totalPagesString) : 1;
  const currentPage = JSON.parse(localStorage.getItem("currentPage") as string);
  return {
    repositories,
    query,
    isLoading,
    currentPage,
    totalPages,
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
      return thunkAPI.rejectWithValue("something went wrong");
    }
  }
);

export const getUserRepos = createAsyncThunk(
  "search/getUserRepos",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("https://api.github.com/user/repos", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("something went wrong");
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRepos.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRepos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.repositories = action.payload.repositories;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        saveToLocalStorage(action.payload);
      })
      .addCase(getRepos.rejected, (state, action) => {
        console.log(action);
        state.isLoading = false;
      })
      .addCase(getUserRepos.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserRepos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.repositories = action.payload;
        state.totalPages = 1;
        localStorage.setItem("repositories", JSON.stringify(action.payload));
      })
      .addCase(getUserRepos.rejected, (state, action) => {
        console.log(action);
        state.isLoading = false;
      });
  },
});

export const { setQuery, setRepos, setIsLoading } = searchSlice.actions;

export default searchSlice.reducer;
