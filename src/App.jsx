import React from 'react';
// import Sidebar from './components/Sidebar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import PublicRoute from './routes/PulicRoutes';
import ProtectedRoute from './routes/ProtectedRoutes';
import Sidebar from './components/Sidebar.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import Example from './pages/Example.jsx';
import Dashboard from './pages/Dashboard.jsx';
import JobOpenings from './pages/jobopnenings/JobOpenings.jsx';
import Candidates from './pages/Candidates/Candidates.jsx';
import AddCandidate from './pages/Candidates/AddCandidate.jsx';
import Login from './pages/auth/Login.jsx';
import HomePage from './pages/HomePage.jsx';
import EditCandidate from './pages/Candidates/EditCandidate.jsx';
import ViewCandidate from './pages/Candidates/ViewCandidate.jsx';
import ScheduleInterview from './pages/interview/ScheduleInterview.jsx';
import OfferLetter from './pages/offerletter/OfferLetter.jsx';
import InterviewList from './pages/interview/InterviewList.jsx';
import AppoinmentLetter from './pages/appoinmentletter/AppoinmentLetter.jsx';
import Joining from './pages/joining/Joining.jsx';
import Document from './pages/documents/Document.jsx';
import HrProfile from './pages/profile/HrProfile.jsx';
import ScheduleInterviewtechManagerial from "../src/pages/interview/ScheduleInterviewtechManagerial.jsx";
import OfferLetterList from './pages/offerletter/OfferLetterList.jsx';


export default function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
   <Toaster
  // position="top-right"
  containerStyle={{
    zIndex: 9999999,
  }}
/>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          {/* <Route path="/" element={<HomePage />} /> */}f

        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/hr" element={<DashboardLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="job-openings" element={<JobOpenings />} />
            <Route path="candidates" element={<Candidates />} />
            <Route path="candidates/add" element={<AddCandidate />} />
            <Route path="candidates/edit/:id" element={<EditCandidate />} />
            <Route path="candidates/view/:id" element={<ViewCandidate />} />
            <Route path="interviews/schedule/:id" element={<ScheduleInterview />} />
            <Route path="offer-letter" element={<OfferLetterList />} />
            <Route path="interviews" element={<InterviewList />} />
            <Route path="appointment-letter/:id" element={<AppoinmentLetter />} />
            <Route path="joining" element={<Joining />} />
            <Route path="documents" element={<Document />} />
            <Route path="profile" element={<HrProfile />} />
            <Route path="interview/schedule/:id" element={<ScheduleInterviewtechManagerial />} />
            <Route path="offer-letter/add" element={<OfferLetter />} />









    

          </Route>
        </Route>
      </Routes>

    </QueryClientProvider>
  )
}

