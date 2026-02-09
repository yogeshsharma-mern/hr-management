import JobOpenings from "../pages/jobopnenings/JobOpenings";

const apiPath = Object.freeze({
  hrLogin: "/hr/login",
  JobOpenings: "/job-openings",
  AddCandidates: "/candidates",
  editCandidate: "/candidates",
  jobopeningToggleStatus: "/job-openings",
  CANDIDATES: "candidates",
  candidateDetails: "/candidates",
  scheduleInterview: "/interviews/schedule",
  interviewList: "/interviews",
  updateInterviewStatus: "/interviews/status",
  updateScheduleInterview:"/interviews/assign",
  offerLetters:"/offer-letters",
  updateOfferStatus:"/offer-letters/status",
  offerLetterPdf:"/offer-letters"

});

export default apiPath; 
