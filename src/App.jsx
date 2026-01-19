import React from 'react';
// import Sidebar from './components/Sidebar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import PublicRoute from './routes/PulicRoutes';
import ProtectedRoute from './routes/ProtectedRoutes';
import Sidebar from './components/Sidebar.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import Example from './pages/Example.jsx';
import Dashboard from './pages/Dashboard.jsx';
import JobOpenings from './pages/JobOpenings.jsx';
import Candidates from './pages/Candidates/Candidates.jsx';
import AddCandidate from './pages/Candidates/AddCandidate.jsx';


export default function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Routes>
        <Route element={<PublicRoute />}>

        </Route>
        <Route element={<ProtectedRoute/>}>
          <Route path="/hr" element={<DashboardLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="job-openings" element={<JobOpenings />} />
            <Route path="candidates" element={<Candidates />} />
            <Route path="candidates/add" element={<AddCandidate />} />

          </Route>
        </Route>
      </Routes>

    </QueryClientProvider>
  )
}

