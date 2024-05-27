import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define Job type
interface Job {
  city: string[] | null;
  company: string;
  job_link: string;
  job_title: string;
  remote: string[];
  id: string; // assuming id is a string, change if needed
  // Add other job properties here
}

// Define the initial state type
interface JobsState {
  jobs: Job[];
  total: number;
  totalJobs: number;
  totalCompany: number;
  loading: boolean;
}

// Define initial state
const initialState: JobsState = {
  jobs: [],
  total: 0,
  totalJobs: 0,
  totalCompany: 0,
  loading: true
};

// Create slice
const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setJobs(state, action: PayloadAction<Job[]>) {
      // Filter out duplicates before adding new jobs
      const uniqueJobs = action.payload.filter(
        (job) => !state.jobs.some((existingJob) => existingJob.id === job.id)
      );
      state.jobs = [...state.jobs, ...uniqueJobs];
    },
    clearJobs(state) {
      state.jobs = [];
    },
    setTotal(state, action: PayloadAction<number>) {
      state.total = action.payload;
    },
    clearTotal(state) {
      state.total = 0;
    },
    setLoading(state) {
      state.loading = true;
    },
    setNumberOfJobs(state, action: PayloadAction<number>) {
      state.totalJobs = action.payload;
    },
    setNumberOfCompany(state, action: PayloadAction<number>) {
      state.totalCompany = action.payload;
    }
  }
});

// Export actions
export const {
  setJobs,
  setTotal,
  clearJobs,
  clearTotal,
  setLoading,
  setNumberOfJobs,
  setNumberOfCompany
} = jobsSlice.actions;

// Export reducer
export default jobsSlice.reducer;
