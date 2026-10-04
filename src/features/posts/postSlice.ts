import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiHelper } from "@/helpers/apiHelper";

export interface Post {
  id: string | number;
  title: string;
  content: string;
  user?: {
    name: string;
  };
  createdAt?: string;
}

interface PostState {
  posts: Post[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: PostState = {
  posts: [],
  status: "idle",
  error: null,
};

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const token = state.auth.token;

      const response = await apiHelper.get("/posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data.posts || response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Gagal memuat postingan");
    }
  }
);

export const createPost = createAsyncThunk(
  "posts/createPost",
  async ({ title, content, token }: { title: string; content: string; token: string }, { rejectWithValue }) => {
    try {
      const response = await apiHelper.post(
        "/posts",
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Gagal membuat postingan");
    }
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        if (action.payload) {
          state.posts.unshift(action.payload.data || action.payload);
        }
      });
  },
});

export default postSlice.reducer;