// "use client";
// import React, { useState, useEffect, useMemo, Suspense } from "react";
// import {
//   ChevronDown,
//   Filter,
//   ChevronLeft,
//   ChevronRight, 
//   X,
// } from "lucide-react";
// import { Info } from "lucide-react";
// import Header from "@/app/navbar/page"; // Adjust the import path as necessary
// import { Amplify } from "aws-amplify";
// import { generateClient } from "aws-amplify/data";
// import type { Schema } from "@/amplify/data/resource"; 
// import outputs from "@/amplify_outputs.json";
// import { Listbox } from "@headlessui/react";
// import {
//   sendApprovalEmail,
//   sendRejectionEmail,
//   sendRevokeEmail,
//   sendGrantAccessEmail,
// } from "@/utils/email";
// import { useSearchParams } from "next/navigation";
// import { useRouter } from "next/navigation";

// import { checkAuth } from "@/utils/auth";

// Amplify.configure(outputs);
// const client = generateClient<Schema>();

// function DGXDashboard() {
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState<any | null>(null);
//   const [status, setStatus] = useState<any[]>([]);
//   const [requests, setRequests] = useState<any[]>([]);
//   const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
//   const [users, setUsers] = useState<any[]>([]);
//   const [institutes, setInstitutes] = useState<any[]>([]);

//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [dateError, setDateError] = useState("");
//   const [sortConfig, setSortConfig] = useState({
//     key: "createdAt", // Changed from "created_by" to "createdAt"
//     direction: "desc",
//   });

//   // Popup state
//   const [selectedRequest, setSelectedRequest] = useState<any>(null);
//   const [isPopupOpen, setIsPopupOpen] = useState(false);

//   // Filter validation popup state
//   const [isFilterValidationPopupOpen, setIsFilterValidationPopupOpen] =
//     useState(false);

//   // Confirmation popup state
//   const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
//   const [confirmationAction, setConfirmationAction] = useState<
//     "approve" | "reject" | "revoke" | "grant" | null
//   >(null);

//   // Credentials form state
//   const [isCredentialsFormOpen, setIsCredentialsFormOpen] = useState(false);
//   const [credentialsData, setCredentialsData] = useState({
//     loginId: "",
//     password: "",
//     additionalInfo: "",
//   });

//   // Validation errors state - UPDATED TO MATCH REGISTRATION STYLE
//   const [credentialsErrors, setCredentialsErrors] = useState({
//     loginId: "",
//     password: "",
//     additionalInfo: "",
//   });
//   const [loading, setLoading] = useState(true);

//   // NEW: Add state for time slots and date/time details
//   const [timeSlots, setTimeSlots] = useState<any[]>([]);
//   const [userTimeSlots, setUserTimeSlots] = useState<any[]>([]);
//   const [selectedRequestTimeDetails, setSelectedRequestTimeDetails] =
//     useState<any>(null);
//   const [remarksError, setRemarksError] = useState("");
//   const [userInstituteAssociation, setUserInstituteAssociation] = useState<
//     any[]
//   >([]);
//   const [userInstitutes, setUserInstitutes] = useState<any[]>([]);
//   const [selectedInstitute, setSelectedInstitute] = useState<any | null>(null);
//   const [currentFilteredInstitute, setCurrentFilteredInstitute] =
//     useState<any>(null);
//   // ✅ ADD THIS: Track if filters are actively applied
//   const [areFiltersApplied, setAreFiltersApplied] = useState(false);
//   // Remarks modal state
//   const [isRemarksModalOpen, setIsRemarksModalOpen] = useState(false);
//   const [remarksText, setRemarksText] = useState("");

//   // Snackbar state
//   const [snackbar, setSnackbar] = useState<{
//     show: boolean;
//     message: string;
//     type: "success" | "error";
//   }>({
//     show: false,
//     message: "",
//     type: "success",
//   });

//   // Email loading state
//   const [isEmailSending, setIsEmailSending] = useState(false);
//   const [departments, setDepartments] = useState<any[]>([]);
//   const [userTypes, setUserTypes] = useState<any[]>([]);
//   const [cpuList, setCpuList] = useState<any[]>([]);
//   const [ramList, setRamList] = useState<any[]>([]);
//   const [gpuPartitions, setGpuPartitions] = useState<any[]>([]);
//   const [gpuVendors, setGpuVendors] = useState<any[]>([]);
//   const [image, setImage] = useState<any[]>([]);
//   const [authLoading, setAuthLoading] = useState(true);

//   const admin = "Technical";

//   const searchParams = useSearchParams();
//   const loggedInUserId = searchParams.get("userId") || "";
//   const loggedInUserName = decodeURIComponent(
//     searchParams.get("userName") || ""
//   );

//    const router = useRouter();
//     useEffect(() => {
//       const verifyUser = async () => {
//         const result = await checkAuth(["Technical Admin"],[]); 
//         if (!result.authorized) {
//           router.replace(result.redirect || "/login");
//         } else {
//           setAuthLoading(false);
//         }
//       };

//       verifyUser();
//     }, [router]);

//   // Validation functions - SIMPLIFIED TO MATCH REGISTRATION APPROACH
//   const validateLoginId = (value: string) => {
//     if (!value || typeof value !== "string" || !value.trim()) {
//       return "User ID is required";
//     }

//     return "";
//   };

//   const validatePassword = (value: string) => {
//     if (!value || typeof value !== "string" || !value.trim()) {
//       return "Password is required";
//     }
//     return "";
//   };

//   const validateAdditionalInfo = (value: string) => {
//     if (value.length > 500) {
//       return "Additional information cannot exceed 500 characters";
//     }
//     return "";
//   };

//   // ✅ ADD THIS NEW FUNCTION: Re-apply current filters
//   const reapplyCurrentFilters = async () => {
//     // If no filters are applied, just show all requests
//     if (!areFiltersApplied) {
//       setFilteredRequests(requests);
//       return;
//     }

//     try {
//       // Fetch fresh associations data
//       const allAssociationsResult =
//         await client.models.userInstituteAssociation.list();

//       let filtered = [...requests];

//       // INSTITUTE FILTER
//       if (selectedInstitute) {
//         let selectedInstituteAssociations = [];

//         if (selectedInstitute.id === "all") {
//           const userAssociations = allAssociationsResult.data.filter(
//             (assoc) => assoc.user_id === loggedInUserId
//           );

//           const userInstituteIds = userAssociations.map(
//             (assoc) => assoc.institute_id
//           );

//           selectedInstituteAssociations = allAssociationsResult.data.filter(
//             (assoc) => userInstituteIds.includes(assoc.institute_id)
//           );
//         } else {
//           selectedInstituteAssociations = allAssociationsResult.data.filter(
//             (assoc) => assoc.institute_id === selectedInstitute.id
//           );
//         }

//         const selectedInstituteUserIds = selectedInstituteAssociations.map(
//           (assoc) => assoc.user_id
//         );

//         filtered = filtered.filter((request) =>
//           selectedInstituteUserIds.includes(request.user_id)
//         );
//       }

//       // DATE FILTER
//       if (fromDate) {
//         const beforeDateFilter = filtered.length;

//         filtered = filtered.filter((request) => {
//           const requestTimeSlots = userTimeSlots.filter(
//             (uts) => uts.instance_request_id === request.id
//           );

//           // ✅ NEW: If no timeslots exist, check if request has date info directly
//           if (requestTimeSlots.length === 0) {
//             // Check if the request itself has a date field
//             // Replace 'selected_date' with your actual field name (e.g., 'date', 'request_date', 'created_at', etc.)
//             if (!request.selected_date) {
//               return false;
//             }

//             // Filter by the request's date field
//             const requestDate = new Date(request.selected_date);
//             const requestDateOnly = new Date(
//               requestDate.getFullYear(),
//               requestDate.getMonth(),
//               requestDate.getDate()
//             );

//             const fromDateOnly = new Date(fromDate);
//             fromDateOnly.setHours(0, 0, 0, 0);
//             const fromDateOnlyNormalized = new Date(
//               fromDateOnly.getFullYear(),
//               fromDateOnly.getMonth(),
//               fromDateOnly.getDate()
//             );

//             if (!toDate) {
//               return requestDateOnly >= fromDateOnlyNormalized;
//             }

//             const toDateOnly = new Date(toDate);
//             toDateOnly.setHours(23, 59, 59, 999);
//             const toDateOnlyNormalized = new Date(
//               toDateOnly.getFullYear(),
//               toDateOnly.getMonth(),
//               toDateOnly.getDate()
//             );

//             return (
//               requestDateOnly >= fromDateOnlyNormalized &&
//               requestDateOnly <= toDateOnlyNormalized
//             );
//           }

//           // ✅ Existing logic for when timeslots exist
//           return requestTimeSlots.some((uts) => {
//             if (!uts.selected_date) return false;

//             const selectedDate = new Date(uts.selected_date);
//             const selectedDateOnly = new Date(
//               selectedDate.getFullYear(),
//               selectedDate.getMonth(),
//               selectedDate.getDate()
//             );

//             const fromDateOnly = new Date(fromDate);
//             fromDateOnly.setHours(0, 0, 0, 0);
//             const fromDateOnlyNormalized = new Date(
//               fromDateOnly.getFullYear(),
//               fromDateOnly.getMonth(),
//               fromDateOnly.getDate()
//             );

//             if (!toDate) {
//               return selectedDateOnly >= fromDateOnlyNormalized;
//             }

//             const toDateOnly = new Date(toDate);
//             toDateOnly.setHours(23, 59, 59, 999);
//             const toDateOnlyNormalized = new Date(
//               toDateOnly.getFullYear(),
//               toDateOnly.getMonth(),
//               toDateOnly.getDate()
//             );

//             return (
//               selectedDateOnly >= fromDateOnlyNormalized &&
//               selectedDateOnly <= toDateOnlyNormalized
//             );
//           });
//         });
//       }
//       // STATUS FILTER
//       if (selectedStatus) {
//         if (selectedStatus.id !== "all") {
//           filtered = filtered.filter((request) => {
//             const requestStatusName = getStatusName(request.status_id ?? "");
//             return requestStatusName === selectedStatus.status_name;
//           });
//         }
//       }

//       setFilteredRequests(filtered);
//     } catch (error) {
//       console.error("❌ Error reapplying filters:", error);
//     }
//   };

//   // ✅ ADD THIS: Update this useEffect to reapply filters when requests change
//   useEffect(() => {
//     if (areFiltersApplied) {
//       reapplyCurrentFilters();
//     } else {
//       setFilteredRequests(requests);
//     }
//   }, [requests]);

//   // Handle input changes with validation - ADDED
//   const handleCredentialsChange = (field: string, value: string) => {
//     // Update the form data
//     setCredentialsData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));

//     // On change: only clear error if valid
//     setCredentialsErrors((prev) => {
//       let error = prev[field as keyof typeof prev];

//       if (field === "loginId") {
//         if (value.trim()) {
//           error = ""; // clear error when valid
//         }
//       } else if (field === "password") {
//         if (value.trim()) {
//           error = "";
//         }
//       } else if (field === "additionalInfo") {
//         if ((!value.trim() || value.length >= 10) && value.length <= 500) {
//           error = "";
//         }
//       }

//       return {
//         ...prev,
//         [field]: error,
//       };
//     });
//   };

//   const fetchTimeData = async () => {
//     try {
//       const [timeSlotsResult, userTimeSlotsResult] = await Promise.all([
//         client.models.timeSlot.list(),
//         client.models.userTimeSlot.list(),
//       ]);

//       setTimeSlots(timeSlotsResult.data || []);
//       setUserTimeSlots(userTimeSlotsResult.data || []);
//     } catch (err) {
//       console.error("Error fetching time data:", err);
//     }
//   };

//   // NEW: Fetch time slots and user at time slots
//   useEffect(() => {
//     fetchTimeData();
//   }, []);

//   // NEW: Function to get time details for a specific request with improved formatting and debugging
//   const getTimeDetailsForRequest = (instanceRequestId: string) => {
//     try {
//       const allUserTimeSlotsForRequest = userTimeSlots.filter(
//         (uts) => uts.instance_request_id === instanceRequestId
//       );

//       // ✅ Fallback: find instanceRequest for this ID
//       const relatedRequest = requests.find(
//         (req: { id: string }) => req.id === instanceRequestId
//       );

//       // ✅ Case 1: No user time slots found — fallback to instanceRequest date
//       if (
//         !allUserTimeSlotsForRequest ||
//         allUserTimeSlotsForRequest.length === 0
//       ) {
//         const fallbackDate =
//           relatedRequest?.selected_date || relatedRequest?.date;

//         if (fallbackDate) {
//           const formattedFallbackDate = new Date(
//             fallbackDate
//           ).toLocaleDateString("en-GB");

//           return {
//             date: "1 date selected",
//             time: "No time slots",
//             formatted: `${formattedFallbackDate.replace(/\//g, "-")} / No time slots`,
//           };
//         }

//         // If no date anywhere
//         return {
//           date: "No date available",
//           time: "No time available",
//           formatted: "Date and time not available",
//         };
//       }

//       // ✅ Group slots by date
//       const groupedDetails: Record<string, string[]> = {};

//       for (const userTimeSlot of allUserTimeSlotsForRequest) {
//         const timeSlotId = userTimeSlot.time_slot_id;
//         const timeSlot = timeSlots.find((ts) => ts.id === timeSlotId);
//         const date = userTimeSlot.selected_date;
//         const timeSlotValue = timeSlot ? timeSlot.time_slot : "Time not found";

//         if (date) {
//           const formattedDate = new Date(date).toLocaleDateString("en-GB");

//           if (!groupedDetails[formattedDate]) {
//             groupedDetails[formattedDate] = [];
//           }
//           groupedDetails[formattedDate].push(timeSlotValue);
//         }
//       }

//       // ✅ Sort dates ascending
//       const sortedDates = Object.keys(groupedDetails).sort((a, b) => {
//         const [dayA, monthA, yearA] = a.split("/").map(Number);
//         const [dayB, monthB, yearB] = b.split("/").map(Number);
//         return (
//           new Date(yearA, monthA - 1, dayA).getTime() -
//           new Date(yearB, monthB - 1, dayB).getTime()
//         );
//       });

//       // ✅ Helpers
//       const extractStartTime = (timeSlotStr: string): string => {
//         if (!timeSlotStr) return "";
//         if (timeSlotStr.includes("-")) return timeSlotStr.split("-")[0].trim();
//         if (timeSlotStr.includes(" to "))
//           return timeSlotStr.split(" to ")[0].trim();
//         return timeSlotStr.trim();
//       };

//       const timeToMinutes = (timeStr: string): number => {
//         const cleanTime = extractStartTime(timeStr);
//         const [hours, minutes] = cleanTime.split(":").map(Number);
//         return hours * 60 + minutes;
//       };

//       const formatTimeRanges = (times: string[]): string => {
//         if (times.length === 0) return "No time slots";
//         const timeObjects = times
//           .map((time) => ({
//             original: extractStartTime(time),
//             minutes: timeToMinutes(time),
//           }))
//           .sort((a, b) => a.minutes - b.minutes);

//         const ranges: string[] = [];
//         let currentRangeStart = timeObjects[0];
//         let currentRangeEnd = timeObjects[0];

//         for (let i = 1; i < timeObjects.length; i++) {
//           const currentTime = timeObjects[i];
//           if (currentTime.minutes - currentRangeEnd.minutes === 30) {
//             currentRangeEnd = currentTime;
//           } else {
//             ranges.push(
//               currentRangeStart.minutes === currentRangeEnd.minutes
//                 ? currentRangeStart.original
//                 : `${currentRangeStart.original} - ${currentRangeEnd.original}`
//             );
//             currentRangeStart = currentTime;
//             currentRangeEnd = currentTime;
//           }
//         }

//         ranges.push(
//           currentRangeStart.minutes === currentRangeEnd.minutes
//             ? currentRangeStart.original
//             : `${currentRangeStart.original} - ${currentRangeEnd.original}`
//         );

//         return ranges.join(" , ");
//       };

//       // ✅ Build formatted output
//       let formattedOutput = "";

//       for (let i = 0; i < sortedDates.length; i++) {
//         const date = sortedDates[i];
//         const times = groupedDetails[date];

//         const formattedDate = date.replace(/\//g, "-");
//         const formattedTimeRanges =
//           times && times.length > 0 ? formatTimeRanges(times) : "No time slots";

//         formattedOutput += `${formattedDate}\n[${formattedTimeRanges}]`;
//         if (i < sortedDates.length - 1) formattedOutput += "\n";
//       }

//       return {
//         date: `${sortedDates.length} date${
//           sortedDates.length > 1 ? "s" : ""
//         } selected`,
//         time: "Multiple time slots",
//         formatted: formattedOutput,
//       };
//     } catch (err) {
//       console.error("Error in getTimeDetailsForRequest:", err);
//       return {
//         date: "Error",
//         time: "Error",
//         formatted: "Unable to load date/time",
//       };
//     }
//   };

//   useEffect(() => {
//     const fetchMasters = async () => {
//       try {
//         const deptResult = await client.models.department.list();
//         const userTypeResult = await client.models.userType.list();
//         const cpuResult = await client.models.cpu.list();
//         const ramResult = await client.models.ram.list();
//         const gpuPartitionResult = await client.models.gpuPartition.list();
//         const gpuVendorResult = await client.models.gpuVendor.list();
//         const customImage = await client.models.image.list();

//         setDepartments(deptResult.data || []);
//         setUserTypes(userTypeResult.data || []);
//         setCpuList(cpuResult.data || []);
//         setRamList(ramResult.data || []);
//         setGpuPartitions(gpuPartitionResult.data || []);
//         setGpuVendors(gpuVendorResult.data || []);
//         setImage(customImage.data || []);
//       } catch (err) {
//         console.error("Error fetching master tables", err);
//       }
//     };

//     fetchMasters();
//   }, []);

//   const getDepartmentName = (userId: string): string => {
//     if (!userId) return "Not Assigned";

//     // Find the user
//     const user = users.find((u) => u.id === userId);
//     if (!user) return `Unknown User (${userId})`;

//     // Find the user's association (this table has department_id)
//     const association = userInstituteAssociation.find(
//       (assoc) => assoc.user_id === userId
//     );
//     if (!association) return "No Department Assigned";

//     // Find the actual department
//     const department = departments.find(
//       (dept) => dept.id === association.department_id
//     );

//     return department?.department_name ?? "";
//   };

//   const getUserTypeName = (userTypeId: string) => {
//     const type = userTypes.find((t) => t.id === userTypeId);
//     return type?.user_type || "";
//   };

//   const getCpuName = (cpuId: string) => {
//     const cpu = cpuList.find((c) => c.id === cpuId);
//     return cpu?.number_of_cpu?.toString() || "";
//   };

//   const getRamName = (ramId: string) => {
//     const ram = ramList.find((r) => r.id === ramId);
//     return ram?.ram ? `${ram.ram} GB` : "";
//   };

//   const getGpuPartitionName = (partitionId: string) => {
//     const partition = gpuPartitions.find((p) => p.id === partitionId);
//     return partition?.gpu_partition || "";
//   };

//   const getGpuVendorName = (vendorId: string) => {
//     const vendor = gpuVendors.find((v) => v.id === vendorId);
//     return vendor?.gpu_vendor || "";
//   };

//   const getCustomImageName = (imageId: string) => {
//     const img = image.find((i) => i.id === imageId);
//     return img?.image_name || "";
//   };

//   // Show snackbar
//   const showSnackbar = (
//     message: string,
//     type: "success" | "error" = "success"
//   ) => {
//     setSnackbar({ show: true, message, type });
//     setTimeout(() => {
//       setSnackbar({ show: false, message: "", type: "success" });
//     }, 3000);
//   };

//   const validateAndFilter = async () => {
//     // Check if no filter criteria is selected
//     if (!fromDate && !toDate && !selectedStatus && !selectedInstitute) {
//       setIsFilterValidationPopupOpen(true);
//       return;
//     }

//     // Check if from date is selected
//     if (!fromDate && toDate) {
//       setDateError("Please select From Date.");
//       return;
//     }

//     // Check if to date is less than from date
//     if (fromDate && toDate && new Date(toDate) < new Date(fromDate)) {
//       setDateError("To Date cannot be earlier than From Date.");
//       return;
//     }

//     // Clear any previous errors
//     setDateError("");

//     try {
//       setLoading(true);

//       // Fetch ALL fresh data from database

//       const [allRequestsResult, allAssociationsResult] = await Promise.all([
//         client.models.instanceRequest.list(),
//         client.models.userInstituteAssociation.list(),
//       ]);

//       let filtered = [...allRequestsResult.data];

//       // INSTITUTE FILTER
//       if (selectedInstitute) {
//         let selectedInstituteAssociations = [];

//         if (selectedInstitute.id === "all") {
//           // ✅ Include all institutes associated with the logged-in user
//           const userAssociations = allAssociationsResult.data.filter(
//             (assoc) => assoc.user_id === loggedInUserId
//           );

//           const userInstituteIds = userAssociations.map(
//             (assoc) => assoc.institute_id
//           );

//           selectedInstituteAssociations = allAssociationsResult.data.filter(
//             (assoc) => userInstituteIds.includes(assoc.institute_id)
//           );
//         } else {
//           // ✅ Filter for the specific institute
//           selectedInstituteAssociations = allAssociationsResult.data.filter(
//             (assoc) => assoc.institute_id === selectedInstitute.id
//           );
//         }

//         if (selectedInstituteAssociations.length === 0) {
//           setFilteredRequests([]);
//           setCurrentPage(1);
//           setCurrentFilteredInstitute(selectedInstitute);
//           setAreFiltersApplied(true); // ✅ ADD THIS LINE
//           setLoading(false);
//           return;
//         }

//         // Log users in this institute
//         selectedInstituteAssociations.forEach((assoc, index) => {
//           const user = users.find((u) => u.id === assoc.user_id);
//           console.log(
//             `   ${index + 1}. ${user?.firstname} ${user?.lastname} (ID: ${assoc.user_id})`
//           );
//         });

//         // Get all user IDs from the selected institute(s)
//         const selectedInstituteUserIds = selectedInstituteAssociations.map(
//           (assoc) => assoc.user_id
//         );

//         // Filter requests by those user IDs
//         filtered = filtered.filter((request) =>
//           selectedInstituteUserIds.includes(request.user_id)
//         );

//         if (filtered.length === 0) {
//           setFilteredRequests([]);
//           setCurrentPage(1);
//           setCurrentFilteredInstitute(selectedInstitute);
//           setAreFiltersApplied(true); // ✅ ADD THIS LINE
//           setLoading(false);
//           return;
//         }
//       }

//       // DATE FILTER
//       if (fromDate) {
//         const beforeDateFilter = filtered.length;

//         filtered = filtered.filter((request) => {
//           const requestTimeSlots = userTimeSlots.filter(
//             (uts) => uts.instance_request_id === request.id
//           );

//           // ✅ NEW: If no timeslots exist, check if request has date info directly
//           if (requestTimeSlots.length === 0) {
//             if (!request.selected_date) {
//               return false;
//             }

//             // Filter by the request's date field
//             const requestDate = new Date(request.selected_date);
//             const requestDateOnly = new Date(
//               requestDate.getFullYear(),
//               requestDate.getMonth(),
//               requestDate.getDate()
//             );

//             const fromDateOnly = new Date(fromDate);
//             fromDateOnly.setHours(0, 0, 0, 0);
//             const fromDateOnlyNormalized = new Date(
//               fromDateOnly.getFullYear(),
//               fromDateOnly.getMonth(),
//               fromDateOnly.getDate()
//             );

//             if (!toDate) {
//               return requestDateOnly >= fromDateOnlyNormalized;
//             }

//             const toDateOnly = new Date(toDate);
//             toDateOnly.setHours(23, 59, 59, 999);
//             const toDateOnlyNormalized = new Date(
//               toDateOnly.getFullYear(),
//               toDateOnly.getMonth(),
//               toDateOnly.getDate()
//             );

//             return (
//               requestDateOnly >= fromDateOnlyNormalized &&
//               requestDateOnly <= toDateOnlyNormalized
//             );
//           }

//           // ✅ Existing logic for when timeslots exist
//           return requestTimeSlots.some((uts) => {
//             if (!uts.selected_date) return false;

//             const selectedDate = new Date(uts.selected_date);
//             const selectedDateOnly = new Date(
//               selectedDate.getFullYear(),
//               selectedDate.getMonth(),
//               selectedDate.getDate()
//             );

//             const fromDateOnly = new Date(fromDate);
//             fromDateOnly.setHours(0, 0, 0, 0);
//             const fromDateOnlyNormalized = new Date(
//               fromDateOnly.getFullYear(),
//               fromDateOnly.getMonth(),
//               fromDateOnly.getDate()
//             );

//             if (!toDate) {
//               return selectedDateOnly >= fromDateOnlyNormalized;
//             }

//             const toDateOnly = new Date(toDate);
//             toDateOnly.setHours(23, 59, 59, 999);
//             const toDateOnlyNormalized = new Date(
//               toDateOnly.getFullYear(),
//               toDateOnly.getMonth(),
//               toDateOnly.getDate()
//             );

//             return (
//               selectedDateOnly >= fromDateOnlyNormalized &&
//               selectedDateOnly <= toDateOnlyNormalized
//             );
//           });
//         });
//       }
//       // STATUS FILTER
//       if (selectedStatus) {
//         if (selectedStatus.id !== "all") {
//           // Apply specific status filter
//           filtered = filtered.filter((request) => {
//             const requestStatusName = getStatusName(request.status_id ?? "");
//             return requestStatusName === selectedStatus.status_name;
//           });
//         } else {
//           console.log("✅ 'All' selected — showing requests of all statuses");
//           // Do nothing — keep all statuses
//         }
//       }

//       setFilteredRequests(filtered);
//       setCurrentPage(1);
//       setCurrentFilteredInstitute(selectedInstitute); // 👈 SET FILTERED INSTITUTE
//       setAreFiltersApplied(true); // ✅ ADD THIS LINE
//     } catch (error) {
//       console.error("❌ Error filtering data:", error);
//       showSnackbar("Error filtering data. Please try again.", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle from date change
//   const handleFromDateChange = (value: string) => {
//     setFromDate(value);
//     // Clear error when from date is selected
//     if (value && dateError.includes("From Date")) {
//       setDateError("");
//     }
//   };

//   // Handle to date change
//   const handleToDateChange = (value: string) => {
//     setToDate(value);
//   };

//   // Convert yyyy-mm-dd to dd/mm/yyyy for display
//   const formatDateForDisplay = (dateString: string) => {
//     if (!dateString) return "";
//     const [year, month, day] = dateString.split("-");
//     return `${day}/${month}/${year}`;
//   };

//   // Close filter validation popup
//   const closeFilterValidationPopup = () => {
//     setIsFilterValidationPopupOpen(false);
//   };

//   // Sorting logic
//   const sortedRequests = useMemo(() => {
//     let sortable = [...filteredRequests];

//     if (
//       !sortConfig.key ||
//       sortConfig.key === "id" ||
//       sortConfig.key === "createdAt"
//     ) {
//       sortable.sort((a, b) => {
//         const dateA = new Date(a.createdAt || a.created_at || 0);
//         const dateB = new Date(b.createdAt || b.created_at || 0);

//         if (sortConfig.direction === "desc") {
//           return dateB.getTime() - dateA.getTime(); // Most recent first
//         } else {
//           return dateA.getTime() - dateB.getTime(); // Oldest first
//         }
//       });
//     } else {
//       sortable.sort((a, b) => {
//         let valA, valB;

//         // Handle special sorting cases for the new keys
//         switch (sortConfig.key) {
//           case "user_name":
//             valA = getUserName(a.user_id);
//             valB = getUserName(b.user_id);
//             break;
//           case "institute_name":
//             valA = getInstituteName(a.user_id);
//             valB = getInstituteName(b.user_id);
//             break;
//           default:
//             valA = a[sortConfig.key] ?? "";
//             valB = b[sortConfig.key] ?? "";
//         }

//         // Convert to string and compare
//         const strA = String(valA).toLowerCase();
//         const strB = String(valB).toLowerCase();

//         if (strA < strB) return sortConfig.direction === "asc" ? -1 : 1;
//         if (strA > strB) return sortConfig.direction === "asc" ? 1 : -1;
//         return 0;
//       });
//     }

//     return sortable;
//   }, [filteredRequests, sortConfig, users, institutes, status]);

//   // Pagination logic
//   const totalPages = Math.ceil(sortedRequests.length / rowsPerPage);
//   const paginatedRequests = sortedRequests.slice(
//     (currentPage - 1) * rowsPerPage,
//     currentPage * rowsPerPage
//   );

//   const requestRangeStart = (currentPage - 1) * rowsPerPage + 1;
//   const requestRangeEnd = Math.min(
//     currentPage * rowsPerPage,
//     sortedRequests.length
//   );

//   // Handle sorting toggle
//   const handleSort = (key: any) => {
//     setSortConfig((prev) => {
//       if (prev.key === key && prev.direction === "asc") {
//         return { key, direction: "desc" };
//       }
//       return { key, direction: "asc" };
//     });
//   };

//   // UPDATED: Handle row click to open popup and fetch time details
//   const handleRowClick = (request: any) => {
//     setSelectedRequest(request);

//     // Get time details for this request
//     const timeDetails = getTimeDetailsForRequest(request.id);
//     setSelectedRequestTimeDetails(timeDetails);

//     setIsPopupOpen(true);
//   };

//   // Close popup
//   const closePopup = () => {
//     setIsPopupOpen(false);
//     setSelectedRequest([]);
//     setSelectedRequestTimeDetails(null); // Clear time details
//   };

//   // Handle approve button click
//   const handleApprove = () => {
//     setIsPopupOpen(true); // Close the instance request modal
//     setConfirmationAction("approve");
//     setIsConfirmationOpen(true);
//   };

//   // Handle reject button click
//   const handleReject = () => {
//     setIsPopupOpen(true); // Close the instance request modal
//     setConfirmationAction("reject");
//     setIsConfirmationOpen(true);
//   };

//   // Handle revoke access button click
//   const handleRevokeAccess = () => {
//     setIsPopupOpen(true); // Close the instance request modal
//     setConfirmationAction("revoke");
//     setIsConfirmationOpen(true);
//   };

//   const handleGrantAccess = () => {
//     setIsPopupOpen(true); // Close the instance request modal
//     setConfirmationAction("grant");
//     setIsConfirmationOpen(true);
//   };

//   // Close confirmation popup
//   const closeConfirmation = () => {
//     setIsConfirmationOpen(false);
//     setConfirmationAction(null);
//   };

//   // Close credentials form - UPDATED
//   const closeCredentialsForm = () => {
//     setIsCredentialsFormOpen(false);
//     setCredentialsData({
//       loginId: "",
//       password: "",
//       additionalInfo: "",
//     });
//     setCredentialsErrors({
//       loginId: "",
//       password: "",
//       additionalInfo: "",
//     });
//   };

//   // Close remarks modal
//   const closeRemarksModal = () => {
//     setIsRemarksModalOpen(false);
//     setRemarksText("");
//     setRemarksError(""); // reset error
//     setIsConfirmationOpen(true);
//   };

//   // OPTIMIZED VERSION - Replace your existing handleConfirmationYes function:
//   const handleConfirmationYes = async () => {
//     if (!selectedRequest || !confirmationAction) return;

//     if (confirmationAction === "reject") {
//       setIsConfirmationOpen(false);
//       setIsRemarksModalOpen(true);
//       return;
//     }

//     if (confirmationAction === "approve") {
//       setIsConfirmationOpen(true);
//       setIsCredentialsFormOpen(true);
//       return;
//     }

//     if (confirmationAction === "revoke") {
//       setIsConfirmationOpen(false);
//       setIsRemarksModalOpen(true);
//       return;
//     }

//     // OPTIMIZED: Handle grant access case with reduced delay
//     if (confirmationAction === "grant") {
//       try {
//         // Update database first (this is fast)
//         const updateResult = await client.models.instanceRequest.update({
//           id: selectedRequest.id,
//           is_access_granted: true,
//           updated_by: loggedInUserId,
//         });

//         if (updateResult.data) {
//           // Update UI state immediately (this is instant)
//           setRequests((prevRequests) =>
//             prevRequests.map((req) =>
//               req.id === selectedRequest.id
//                 ? { ...req, is_access_granted: true }
//                 : req
//             )
//           );

//           setFilteredRequests((prevFiltered) =>
//             prevFiltered.map((req) =>
//               req.id === selectedRequest.id
//                 ? { ...req, is_access_granted: true }
//                 : req
//             )
//           );

//           // Close modal and show success immediately
//           setIsConfirmationOpen(false);
//           setSelectedRequest(null);
//           showSnackbar("Access granted successfully!", "success");

//           // Send email in background (non-blocking)
//           const timeDetails = getTimeDetailsForRequest(selectedRequest.id);
//           const userDetails = users.find(
//             (u) => u.id === selectedRequest.user_id
//           );

//           const emailData = {
//             ...selectedRequest,
//             admin,
//             loggedInUserName,
//             user: userDetails,
//             date_time: timeDetails.formatted,
//             userTypeName: getUserTypeName(selectedRequest.user_type_id),
//             customImageName: getCustomImageName(selectedRequest.image_id),
//             cpuName: getCpuName(selectedRequest.cpu_id),
//             ramName: getRamName(selectedRequest.ram_id),
//             gpuPartitionName: getGpuPartitionName(
//               selectedRequest.gpu_partition_id
//             ),
//             gpuVendorName: getGpuVendorName(selectedRequest.gpu_vendor_id),
//           };

//           // Send email asynchronously without blocking UI
//           sendGrantAccessEmail(emailData).catch((emailError) => {
//             console.error("Error sending grant access email:", emailError);
//             // Show a subtle notification for email failure
//             setTimeout(() => {
//               showSnackbar(
//                 "Note: There was an issue sending the notification email.",
//                 "error"
//               );
//             }, 2000);
//           });
//         }
//       } catch (error) {
//         console.error(`Error granting access:`, error);
//         showSnackbar("Error granting access. Please try again.", "error");
//       }
//     }
//   };

//   // OPTIMIZED VERSION - Replace your existing handleCredentialsSubmit function:
//   const handleCredentialsSubmit = async (e: { preventDefault: () => void }) => {
//     e?.preventDefault?.();

//     // Validate all fields
//     const loginIdError = validateLoginId(credentialsData.loginId);
//     const passwordError = validatePassword(credentialsData.password);
//     const additionalInfoError = validateAdditionalInfo(
//       credentialsData.additionalInfo
//     );

//     setCredentialsErrors({
//       loginId: loginIdError,
//       password: passwordError,
//       additionalInfo: additionalInfoError,
//     });

//     if (loginIdError || passwordError || additionalInfoError) {
//       return;
//     }

//     if (!selectedRequest) {
//       showSnackbar("No request selected.", "error");
//       return;
//     }

//     try {
//       // Show minimal loading (shorter duration)
//       setIsEmailSending(true);

//       const approvedTechnicalStatus = status.find(
//         (s) => s.status_name === "Approved-Technical"
//       );
//       if (!approvedTechnicalStatus) {
//         showSnackbar("Error: Approved-Technical status not found.", "error");
//         setIsEmailSending(false);
//         return;
//       }

//       const newStatusId = approvedTechnicalStatus.id;

//       // Update database (this is fast)
//       const updateResult = await client.models.instanceRequest.update({
//         id: selectedRequest.id,
//         status_id: newStatusId,
//         login_id: credentialsData.loginId,
//         password: credentialsData.password,
//         additional_information: credentialsData.additionalInfo,
//         is_access_granted: true,
//         updated_by: loggedInUserId,
//       });

//       if (updateResult.data) {
//         // Update UI state immediately
//         setRequests((prevRequests) =>
//           prevRequests.map((req) =>
//             req.id === selectedRequest.id
//               ? {
//                   ...req,
//                   status_id: newStatusId,
//                   login_id: credentialsData.loginId,
//                   password: credentialsData.password,
//                   additional_information: credentialsData.additionalInfo,
//                   is_access_granted: true,
//                 }
//               : req
//           )
//         );

//         setFilteredRequests((prevFiltered) =>
//           prevFiltered.map((req) =>
//             req.id === selectedRequest.id
//               ? {
//                   ...req,
//                   status_id: newStatusId,
//                   login_id: credentialsData.loginId,
//                   password: credentialsData.password,
//                   additional_information: credentialsData.additionalInfo,
//                   is_access_granted: true,
//                 }
//               : req
//           )
//         );

//         // fetchData()
//         // Close form and show success immediately
//         setIsEmailSending(false);
//         closeCredentialsForm();
//         setIsConfirmationOpen(false);
//         setConfirmationAction(null);
//         setSelectedRequest(null);
//         showSnackbar("Request approved successfully!", "success");

//         // Send email in background (non-blocking)
//         const timeDetails = getTimeDetailsForRequest(selectedRequest.id);
//         const userDetails = users.find((u) => u.id === selectedRequest.user_id);

//         const emailData = {
//           ...selectedRequest,
//           admin,
//           loggedInUserName,
//           user: userDetails,
//           date_time: timeDetails.formatted,
//           userTypeName: getUserTypeName(selectedRequest.user_type_id),
//           customImageName: getCustomImageName(selectedRequest.image_id),
//           cpuName: getCpuName(selectedRequest.cpu_id),
//           ramName: getRamName(selectedRequest.ram_id),
//           gpuPartitionName: getGpuPartitionName(
//             selectedRequest.gpu_partition_id
//           ),
//           gpuVendorName: getGpuVendorName(selectedRequest.gpu_vendor_id),
//         };

//         // Send email asynchronously without blocking UI
//         sendApprovalEmail(emailData, credentialsData).catch((emailError) => {
//           console.error("Error sending email:", emailError);
//           // Show a subtle notification for email failure
//           setTimeout(() => {
//             showSnackbar(
//               "Note: There was an issue sending the notification email.",
//               "error"
//             );
//           }, 2000);
//         });
//       }
//     } catch (error) {
//       console.error(`Error approving request:`, error);
//       showSnackbar("Error approving request. Please try again.", "error");
//       setIsEmailSending(false);
//     }
//   };

//   const handleRemarksSubmit = async () => {
//     if (!selectedRequest) return;

//     if (!remarksText.trim()) {
//       setRemarksError("Please enter remarks before submitting.");
//       return;
//     }

//     try {
//       // Show minimal loading
//       setIsEmailSending(true);

//       if (confirmationAction === "reject") {
//         const rejectedStatus = status.find((s) => s.status_name === "Rejected");
//         if (!rejectedStatus) {
//           showSnackbar("Error: Rejected status not found.", "error");
//           setIsEmailSending(false);
//           return;
//         }

//         const newStatusId = rejectedStatus.id;

//         // 🔹 Step 1: Update instance request as Rejected
//         const updateResult = await client.models.instanceRequest.update({
//           id: selectedRequest.id,
//           status_id: newStatusId,
//           remarks: remarksText.trim(),
//           updated_by: loggedInUserId,
//         });

//         if (updateResult.data) {
//           // 🔹 Step 2: Delete all time slots for this user
//           try {
//             const userTimeSlots = await client.models.userTimeSlot.list({
//               filter: { instance_request_id: { eq: selectedRequest.id } },
//             });

//             if (userTimeSlots.data?.length > 0) {
//               // Delete each user time slot
//               await Promise.all(
//                 userTimeSlots.data.map((slot) =>
//                   client.models.userTimeSlot.delete({ id: slot.id })
//                 )
//               );
//               console.log(
//                 "✅ All user time slots deleted for:",
//                 selectedRequest.user_id
//               );
//             }
//             fetchTimeData(); // Refresh time slots after deletion
//           } catch (timeSlotError) {
//             console.error("Error deleting user time slots:", timeSlotError);
//             showSnackbar("Note: Error deleting user's time slots.", "error");
//           }

//           // 🔹 Step 3: Update UI
//           setRequests((prevRequests) =>
//             prevRequests.map((req) =>
//               req.id === selectedRequest.id
//                 ? {
//                     ...req,
//                     status_id: newStatusId,
//                     remarks: remarksText.trim(),
//                     is_access_granted: false,
//                   }
//                 : req
//             )
//           );

//           setFilteredRequests((prevFiltered) =>
//             prevFiltered.map((req) =>
//               req.id === selectedRequest.id
//                 ? {
//                     ...req,
//                     status_id: newStatusId,
//                     remarks: remarksText.trim(),
//                     is_access_granted: false,
//                   }
//                 : req
//             )
//           );

//           // 🔹 Step 4: Close modal & show success
//           setIsEmailSending(false);
//           closeRemarksModal();
//           setSelectedRequest(null);
//           setConfirmationAction(null);
//           setIsConfirmationOpen(false);
//           showSnackbar("Request rejected successfully!", "success");

//           // 🔹 Step 5: Send email in background
//           const timeDetails = getTimeDetailsForRequest(selectedRequest.id);
//           const userDetails = users.find(
//             (u) => u.id === selectedRequest.user_id
//           );

//           const emailData = {
//             ...selectedRequest,
//             admin,
//             loggedInUserName,
//             user: userDetails,
//             date_time: timeDetails.formatted,
//             userTypeName: getUserTypeName(selectedRequest.user_type_id),
//             customImageName: getCustomImageName(selectedRequest.image_id),
//             cpuName: getCpuName(selectedRequest.cpu_id),
//             ramName: getRamName(selectedRequest.ram_id),
//             gpuPartitionName: getGpuPartitionName(
//               selectedRequest.gpu_partition_id
//             ),
//             gpuVendorName: getGpuVendorName(selectedRequest.gpu_vendor_id),
//           };

//           sendRejectionEmail(emailData, remarksText.trim()).catch(
//             (emailError) => {
//               console.error("Error sending rejection email:", emailError);
//               setTimeout(() => {
//                 showSnackbar(
//                   "Note: There was an issue sending the notification email.",
//                   "error"
//                 );
//               }, 2000);
//             }
//           );
//         }
//       } else if (confirmationAction === "revoke") {
//         // Update database (this is fast)
//         const updateResult = await client.models.instanceRequest.update({
//           id: selectedRequest.id,
//           is_access_granted: false,
//           remarks: remarksText.trim(),
//           updated_by: loggedInUserId,
//         });

//         if (updateResult.data) {
//           // Update UI state immediately
//           setRequests((prevRequests) =>
//             prevRequests.map((req) =>
//               req.id === selectedRequest.id
//                 ? {
//                     ...req,
//                     is_access_granted: false,
//                     remarks: remarksText.trim(),
//                   }
//                 : req
//             )
//           );

//           setFilteredRequests((prevFiltered) =>
//             prevFiltered.map((req) =>
//               req.id === selectedRequest.id
//                 ? {
//                     ...req,
//                     is_access_granted: false,
//                     remarks: remarksText.trim(),
//                   }
//                 : req
//             )
//           );

//           // Close modal and show success immediately
//           setIsEmailSending(false);
//           closeRemarksModal();
//           setSelectedRequest(null);
//           setIsConfirmationOpen(false);
//           setConfirmationAction(null);
//           showSnackbar("Access revoked successfully!", "success");

//           // Send email in background (non-blocking)
//           const timeDetails = getTimeDetailsForRequest(selectedRequest.id);
//           const userDetails = users.find(
//             (u) => u.id === selectedRequest.user_id
//           );

//           const emailData = {
//             ...selectedRequest,
//             admin,
//             loggedInUserName,
//             user: userDetails,
//             date_time: timeDetails.formatted,
//             userTypeName: getUserTypeName(selectedRequest.user_type_id),
//             customImageName: getCustomImageName(selectedRequest.image_id),
//             cpuName: getCpuName(selectedRequest.cpu_id),
//             ramName: getRamName(selectedRequest.ram_id),
//             gpuPartitionName: getGpuPartitionName(
//               selectedRequest.gpu_partition_id
//             ),
//             gpuVendorName: getGpuVendorName(selectedRequest.gpu_vendor_id),
//           };

//           sendRevokeEmail(emailData, remarksText.trim()).catch((emailError) => {
//             console.error("Error sending revocation email:", emailError);
//             setTimeout(() => {
//               showSnackbar(
//                 "Note: There was an issue sending the notification email.",
//                 "error"
//               );
//             }, 2000);
//           });
//         }
//       }
//     } catch (error) {
//       console.error(`Error processing request:`, error);
//       showSnackbar("Error processing request. Please try again.", "error");
//       setIsEmailSending(false);
//     }
//   };

//   // Get status name by ID
//   const getStatusName = (statusId: string): string => {
//     const statusItem = status.find((s) => s.id === statusId);
//     return statusItem?.status_name || "Unknown Status";
//   };

//   // Get user object
//   const getUser = (userId: string) => {
//     return users.find((u) => u.id === userId);
//   };

//   // Fetch status from backend
//   useEffect(() => {
//     const fetchStatus = async () => {
//       try {
//         const result = await client.models.status.list();

//         if (!result.data?.length) return;

//         // ✅ Add "All" option at the top
//         const allOption = { id: "all", status_name: "All" };
//         const updatedStatusList = [allOption, ...result.data];

//         // ✅ Update the status list
//         setStatus(updatedStatusList);

//         // ✅ Set "All" as default selected status
//         setSelectedStatus(allOption);

//         console.log("Default status set: All (showing all statuses)");
//       } catch (error) {
//         console.error("Error fetching status:", error);
//       }
//     };

//     fetchStatus();
//   }, []);

//   useEffect(() => {
//     const fetchInstitutes = async () => {
//       try {
//         const associations = await client.models.userInstituteAssociation.list({
//           filter: { user_id: { eq: loggedInUserId } },
//         });

//         if (!associations.data?.length) return;

//         const institutes = await client.models.institute.list();

//         const userInstitutesList = institutes.data.filter((inst) =>
//           associations.data.some((assoc) => assoc.institute_id === inst.id)
//         );

//         // ✅ Add "All" option
//         const allOption = { id: "all", institute_name: "All" };
//         const updatedList = [allOption, ...userInstitutesList];

//         setUserInstitutes(updatedList);

//         // ✅ Set "All" as default selection
//         setSelectedInstitute(allOption);

//         console.log("Default institute set: All (all associated institutes)");
//       } catch (error) {
//         console.error("Error fetching institutes:", error);
//       }
//     };

//     fetchInstitutes();
//   }, [loggedInUserId]);

// const fetchData = async () => {
//   try {
//     setLoading(true);

//     // Fetch everything in parallel
//     const reqPromise = client.models.instanceRequest.list();
//     const userPromise = client.models.user.list();
//     const assocPromise = client.models.userInstituteAssociation.list();
//     const instPromise = client.models.institute.list();

//     const [users, associations] = await Promise.all([userPromise, assocPromise]);
//     setUsers(users.data);
//     setUserInstituteAssociation(associations.data);

//     const [requests, institutes] = await Promise.all([reqPromise, instPromise]);
//     setInstitutes(institutes.data);

//     // ✅ All institutes linked to the logged-in user
//     const userAllAssociations = associations.data.filter(
//       (assoc) => assoc.user_id === loggedInUserId
//     );

//     if (userAllAssociations.length === 0) {
//       setRequests([]);
//       return;
//     }

//     // Extract all institute IDs the logged-in user belongs to
//     const loggedInInstituteIds = userAllAssociations.map((a) => a.institute_id);

//     // ✅ CASE 1: On first load (no selected institute)
//     // ✅ CASE 2: If "All" selected
//     // ✅ CASE 3: If specific institute selected
//     const selectedInstituteIds =
//       !selectedInstitute || selectedInstitute?.id === "all"
//         ? loggedInInstituteIds
//         : [selectedInstitute.id];

//     // ✅ Get all users who share at least one of those institutes
//     const sharedInstituteUsers = associations.data
//       .filter((assoc) =>
//         selectedInstituteIds.some((instId) => assoc.institute_id === instId)
//       )
//       .map((assoc) => assoc.user_id);

//     // ✅ Filter all requests made by those users
//     const filteredRequests = requests.data.filter((req) =>
//       sharedInstituteUsers.includes(req.user_id)
//     );

//     // ✅ Update requests state
//     setRequests(filteredRequests);

//     // ✅ Update current filtered institute for UI
//     if (!selectedInstitute || selectedInstitute?.id === "all") {
//       setCurrentFilteredInstitute({ id: "all", institute_name: "All" });
//     } else {
//       const defaultInstitute = institutes.data.find(
//         (inst) => inst.id === selectedInstitute?.id
//       );
//       setCurrentFilteredInstitute(defaultInstitute || null);
//     }
//   } catch (err) {
//     console.error("❌ ERROR:", err);
//   } finally {
//     setLoading(false);
//   }
// };


//   useEffect(() => {
//     fetchData();
//   }, [loggedInUserId]); // ✅ Add dependency for dropdown changes

//   // Get Full User Name
//   const getUserName = (userId: string): string => {
//     if (!userId) return "";

//     const user = users.find((u) => u.id === userId);
//     if (!user) return `Unknown User (${userId})`;

//     const fullName = `${user.firstname ?? ""} ${user.lastname ?? ""}`.trim();
//     return fullName || "No Name";
//   };

//   // Updated getInstituteName to show the correct filtered institute
//   const getInstituteName = (userId: string): string => {
//     if (!userId) return "Not Assigned";

//     const user = users.find((u) => u.id === userId);
//     if (!user) return `Unknown User (${userId})`;

//     // If we're viewing filtered results, use the filtered institute
//     if (currentFilteredInstitute) {
//       // Check if this user is associated with the filtered institute
//       const hasAssociation = userInstituteAssociation.some(
//         (assoc) =>
//           assoc.user_id === userId &&
//           assoc.institute_id === currentFilteredInstitute.id
//       );

//       if (hasAssociation) {
//         return currentFilteredInstitute.institute_name;
//       }
//     }

//     // Otherwise, find the user's default or first association
//     const association = userInstituteAssociation.find(
//       (assoc) => assoc.user_id === userId
//     );

//     if (!association) return "No Institute Assigned";

//     const institute = institutes.find(
//       (inst) => inst.id === association.institute_id
//     );

//     return (
//       institute?.institute_name ??
//       `Unknown Institute (${association.institute_id})`
//     );
//   };

//   // Updated function to check status by name instead of ID
//   const getAccessStatusIcon = (statusId: string) => {
//     const statusName = getStatusName(statusId);

//     switch (statusName) {
//       case "Pending":
//         return (
//           <div className="w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center text-black text-xs">
//             !
//           </div>
//         );
//       case "Approved-Functional":
//         return (
//           <div className="w-5 h-5 rounded-full bg-orange-400 flex items-center justify-center text-white text-xs">
//             ✓
//           </div>
//         );
//       case "Approved-Technical":
//         return (
//           <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
//             ✓
//           </div>
//         );
//       case "Rejected":
//         return (
//           <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
//             ✕
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//    if (authLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500 mx-auto mb-4"></div>
//           <p className="text-gray-600">Verifying access...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <Header />

//       <div className="p-8">
//         {/* Dashboard Title */}
//         <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
//           Technical Admin Dashboard
//         </h2>

//         {/* Search Filters */}
//         <div className="mb-2">
//           {/* <h3 className="text-sm font-medium text-gray-600 mb-2 ">
//             Search Criteria
//           </h3> */}

//           <div className="flex gap-4 items-start flex-wrap">
//             {/* Date Range */}
//             <div className="flex space-x-4">
//               {/* From Date */}
//               <div className="relative flex items-center w-52">
//                 <input
//                   type="date"
//                   id="fromDatePicker"
//                   value={fromDate}
//                   onChange={(e) => handleFromDateChange(e.target.value)}
//                   className="absolute opacity-0 w-full h-10 cursor-pointer pointer-events-none"
//                 />
//                 <label
//                   htmlFor="fromDatePicker"
//                   className={`w-full h-10 px-3 border border-gray-300 rounded-sm text-sm 
//          text-gray-700 bg-gray-100 hover:bg-gray-200 hover:border-black
//          focus-within:outline-none focus-within:ring-2 focus-within:ring-lime-500 focus-within:border-transparent 
//          cursor-pointer flex items-center justify-between
//          ${dateError ? "border-red-300" : ""}`}
//                   onClick={() => {
//                     const input = document.getElementById(
//                       "fromDatePicker"
//                     ) as HTMLInputElement;
//                     input?.showPicker?.();
//                   }}
//                 >
//                   <span className="text-gray-700">
//                     {fromDate ? (
//                       <>
//                         <span className="text-gray-500">From</span>
//                         <span className="ml-3">
//                           {formatDateForDisplay(fromDate)}
//                         </span>
//                       </>
//                     ) : (
//                       <>
//                         <span className="text-gray-500">From</span>
//                         <span className="text-gray-700 ml-3">dd/mm/yyyy</span>
//                       </>
//                     )}
//                   </span>
//                   <svg
//                     className="w-4 h-4 text-gray-700 flex-shrink-0"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
//                     />
//                   </svg>
//                 </label>
//               </div>

//               {/* To Date */}
//               <div className="relative flex items-center w-52">
//                 <input
//                   type="date"
//                   id="toDatePicker"
//                   value={toDate}
//                   onChange={(e) => handleToDateChange(e.target.value)}
//                   className="absolute opacity-0 w-full h-10 cursor-pointer pointer-events-none"
//                 />
//                 <label
//                   htmlFor="toDatePicker"
//                   className={`w-full h-10 px-3 border border-gray-300 rounded-sm text-sm 
//          text-gray-700 bg-gray-100 hover:bg-gray-200 hover:border-black
//          focus-within:outline-none focus-within:ring-2 focus-within:ring-lime-500 focus-within:border-transparent 
//          cursor-pointer flex items-center justify-between
//          ${dateError ? "border-red-300" : ""}`}
//                   onClick={() => {
//                     const input = document.getElementById(
//                       "toDatePicker"
//                     ) as HTMLInputElement;
//                     input?.showPicker?.();
//                   }}
//                 >
//                   <span className="text-gray-700">
//                     {toDate ? (
//                       <>
//                         <span className="text-gray-500">To</span>
//                         <span className="ml-3">
//                           {formatDateForDisplay(toDate)}
//                         </span>
//                       </>
//                     ) : (
//                       <>
//                         <span className="text-gray-500">To</span>
//                         <span className="text-gray-700 ml-3">dd/mm/yyyy</span>
//                       </>
//                     )}
//                   </span>
//                   <svg
//                     className="w-4 h-4 text-gray-700 flex-shrink-0"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
//                     />
//                   </svg>
//                 </label>
//               </div>
//             </div>
//             {/* Status Dropdown */}
//             <div className="relative w-52">
//               <Listbox value={selectedStatus} onChange={setSelectedStatus}>
//                 <div className="relative">
//                   {/* Floating Label */}
//                   <label
//                     className={`absolute left-3 transition-all duration-200 pointer-events-none z-20
//           ${selectedStatus ? "text-xs -top-2 px-1" : "top-1/2 -translate-y-1/2 text-sm"}
//           ${selectedStatus ? "text-[#5A8F00] font-medium" : "text-gray-500"}
//         `}
//                     style={{
//                       backgroundColor: selectedStatus
//                         ? "#ffffff"
//                         : "transparent",
//                     }}
//                   >
//                     {selectedStatus ? "Status" : "Select Status"}
//                   </label>

//                   <Listbox.Button
//                     className="w-full h-10 flex justify-between items-center px-3 border border-gray-300
//                    rounded-sm text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 hover:border-black
//                    focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent truncate"
//                   >
//                     <span className="truncate mr-2">
//                       {selectedStatus ? selectedStatus.status_name : ""}
//                     </span>
//                     <ChevronDown className="w-4 h-4 text-gray-700 flex-shrink-0 cursor-pointer" />
//                   </Listbox.Button>

//                   <Listbox.Options
//                     className="absolute mt-1 w-full min-w-max bg-white border border-lime-200 rounded-sm shadow-lg z-30
//                    focus:outline-none focus:border-none"
//                   >
//                     {status.map((statusItem) => (
//                       <Listbox.Option
//                         key={statusItem.id}
//                         value={statusItem}
//                         className="cursor-pointer px-3 py-0.5 text-sm text-gray-700 hover:bg-gray-100 whitespace-nowrap"
//                       >
//                         {statusItem.status_name}
//                       </Listbox.Option>
//                     ))}
//                   </Listbox.Options>
//                 </div>
//               </Listbox>
//             </div>

//             {/* Institute Dropdown */}
//             <div className="relative w-90">
//               <Listbox
//                 value={selectedInstitute}
//                 onChange={setSelectedInstitute}
//               >
//                 <div className="relative">
//                   {/* Floating Label */}
//                   <label
//                     className={`absolute left-3 transition-all duration-200 pointer-events-none z-20
//           ${selectedInstitute ? "text-xs -top-2 px-1" : "top-1/2 -translate-y-1/2 text-sm"}
//           ${selectedInstitute ? "text-[#5A8F00] font-medium" : "text-gray-500"}
//         `}
//                     style={{
//                       backgroundColor: selectedInstitute
//                         ? "#ffffff"
//                         : "transparent",
//                     }}
//                   >
//                     {selectedInstitute ? "Institute" : "Select Institute"}
//                   </label>

//                   <Listbox.Button
//                     className="w-full h-10 flex justify-between items-center px-3 border border-gray-300
//                    rounded-sm text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 hover:border-black
//                    focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent truncate"
//                   >
//                     <span className="truncate mr-2">
//                       {selectedInstitute
//                         ? selectedInstitute.institute_name
//                         : ""}
//                     </span>

//                     <ChevronDown className="w-4 h-4 text-gray-700 flex-shrink-0 cursor-pointer" />
//                   </Listbox.Button>

//                   <Listbox.Options
//                     className="absolute mt-1 w-full min-w-max bg-white border border-lime-200 rounded-sm shadow-lg z-30
//                    focus:outline-none focus:border-none"
//                   >
//                     {userInstitutes.map((instituteItem) => (
//                       <Listbox.Option
//                         key={instituteItem.id}
//                         value={instituteItem}
//                         className="cursor-pointer px-3 py-0.5 text-sm text-gray-700 hover:bg-gray-100 whitespace-nowrap"
//                       >
//                         {instituteItem.institute_name}
//                       </Listbox.Option>
//                     ))}
//                   </Listbox.Options>
//                 </div>
//               </Listbox>
//             </div>

//             {/* Filter Button */}
//             <button
//               onClick={validateAndFilter}
//               className="flex items-center justify-center gap-2 w-24 h-10 px-3 border border-gray-300 rounded-sm text-sm 
//                  text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors hover:border-black
//                  focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent cursor-pointer"
//             >
//               <Filter className="w-4 h-4 text-gray-700 cursor-pointer" />
//               Filter
//             </button>
//           </div>

//           {/* Error Message */}
//           {dateError && (
//             <div className="mt-2 text-red-600 text-sm font-medium">
//               {dateError}
//             </div>
//           )}
//         </div>

//         {/* Data Table */}
//         <div className="bg-white rounded-lg shadow-sm relative">
//           <div className="overflow-x-auto overflow-hidden relative z-0">
//             <table className="w-full relative">
//               <thead className="bg-lime-500 text-white">
//                 <tr>
//                   {[
//                     { key: "id", label: "Request Id" },
//                     { key: "user_id", label: "User Name" },
//                     { key: "status_id", label: "Institute Name" },
//                     { key: "createdAt", label: "Requested Date/Time" },
//                     { key: "work_description", label: "Description" },
//                     { key: "status", label: "Status" },
//                     { key: "accessStatus", label: "Access Status" },
//                     { key: "remarks", label: "Remarks" },
//                   ].map((col) => (
//                     <th
//                       key={col.key}
//                       className="px-4 py-4 text-left text-sm font-semibold cursor-pointer select-none"
//                       onClick={() => handleSort(col.key)}
//                     >
//                       {col.label}
//                       {sortConfig.key === col.key && (
//                         <span className="ml-1">
//                           {sortConfig.direction === "asc" ? "▲" : "▼"}
//                         </span>
//                       )}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-gray-200">
//                 {loading || !loggedInUserId ? (
//                   <tr>
//                     <td colSpan={8} className="text-center py-6">
//                       <div className="flex items-center justify-center space-x-3">
//                         {/* Small spinner */}
//                         <div className="animate-spin h-5 w-5 border-2 border-lime-500 border-t-transparent rounded-full"></div>
//                         <span className="text-gray-600 text-sm">
//                           Loading data...
//                         </span>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   paginatedRequests.map((request, index) => (
//                     <tr
//                       key={request.id}
//                       className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 cursor-pointer`}
//                       onClick={() => handleRowClick(request)}
//                     >
//                       {/* Request ID */}
//                       <td className="px-4 py-4 text-sm font-medium text-gray-700">
//                         {request.id}
//                       </td>

//                       {/* User Name */}
//                       <td className="px-4 py-4 text-sm text-gray-700">
//                         {getUserName(request.user_id)}
//                       </td>

//                       {/* Institute Name */}
//                       <td className="px-4 py-4 text-sm text-gray-700">
//                         {getInstituteName(request.user_id)}
//                       </td>

//                       {/* Requested Date */}
//                       <td className="px-4 py-4 text-sm">
//                         <div className="flex items-center gap-2">
//                           <span className="text-gray-700">
//                             {(() => {
//                               const requestTimeSlots = userTimeSlots.filter(
//                                 (uts) => uts.instance_request_id === request.id
//                               );

//                               if (requestTimeSlots.length === 0) {
//                                 return request.selected_date
//                                   ? new Date(request.selected_date)
//                                       .toLocaleDateString("en-GB", {
//                                         day: "2-digit",
//                                         month: "2-digit",
//                                         year: "numeric",
//                                       })
//                                       .replace(/\//g, "-")
//                                   : "No date available";
//                               }

//                               // ✅ Extract unique formatted dates safely
//                               const formattedDates = requestTimeSlots.map(
//                                 (uts) => {
//                                   const date = uts?.selected_date;
//                                   if (!date) return "No date";
//                                   const formatted = new Date(
//                                     date
//                                   ).toLocaleDateString("en-GB", {
//                                     day: "2-digit",
//                                     month: "2-digit",
//                                     year: "numeric",
//                                   });
//                                   return formatted.replace(/\//g, "-");
//                                 }
//                               );

//                               const uniqueDates = Array.from(
//                                 new Set(formattedDates)
//                               );

//                               // Sort dates chronologically
//                               const sortedDates = uniqueDates.sort((a, b) => {
//                                 if (a === "No date" || b === "No date")
//                                   return 0;
//                                 const [dayA, monthA, yearA] = a
//                                   .split("-")
//                                   .map(Number);
//                                 const [dayB, monthB, yearB] = b
//                                   .split("-")
//                                   .map(Number);
//                                 return (
//                                   new Date(yearA, monthA - 1, dayA).getTime() -
//                                   new Date(yearB, monthB - 1, dayB).getTime()
//                                 );
//                               });

//                               // If multiple dates, show range
//                               if (sortedDates.length > 1) {
//                                 return `${sortedDates[0]} - ${
//                                   sortedDates[sortedDates.length - 1]
//                                 }`;
//                               } else {
//                                 return sortedDates[0];
//                               }
//                             })()}
//                           </span>

//                           {/* Info icon with tooltip */}
//                           <div className="relative group flex-shrink-0">
//                             <Info className="w-4 h-4 text-[#76B900] cursor-pointer hover:opacity-80" />
//                             <div className="absolute left-5 top-1/2 -translate-y-1/2 hidden group-hover:block bg-white border border-lime-500 rounded-lg shadow-lg z-[100] before:content-[''] before:absolute before:-left-5 before:top-0 before:w-5 before:h-full before:bg-transparent transition-opacity duration-200">
//                               {/* Tooltip content wrapper (auto width) */}
//                               <div className="min-w-[200px] max-w-[400px] w-max max-h-15 overflow-y-auto pt-1 px-2 whitespace-normal break-words">
//                                 <div className="text-xs text-gray-900 leading-relaxed">
//                                   {(() => {
//                                     const requestTimeSlots =
//                                       userTimeSlots.filter(
//                                         (uts) =>
//                                           uts.instance_request_id === request.id
//                                       );

//                                     if (requestTimeSlots.length === 0) {
//                                       return (
//                                         <div className="text-center">
//                                           <div className="font-medium text-gray-900">
//                                             {request.selected_date
//                                               ? new Date(request.selected_date)
//                                                   .toLocaleDateString("en-GB", {
//                                                     day: "2-digit",
//                                                     month: "2-digit",
//                                                     year: "numeric",
//                                                   })
//                                                   .replace(/\//g, "-")
//                                               : "No date available"}
//                                           </div>
//                                           <div className="text-xs text-gray-600">
//                                             Time Slots : N/A
//                                           </div>
//                                         </div>
//                                       );
//                                     }

//                                     // Group time slots by date
//                                     const groupedByDate =
//                                       requestTimeSlots.reduce((groups, uts) => {
//                                         const dateKey = uts.selected_date
//                                           ? new Date(uts.selected_date)
//                                               .toLocaleDateString("en-GB", {
//                                                 day: "2-digit",
//                                                 month: "2-digit",
//                                                 year: "numeric",
//                                               })
//                                               .replace(/\//g, "-")
//                                           : "No date";

//                                         if (!groups[dateKey]) {
//                                           groups[dateKey] = [];
//                                         }
//                                         groups[dateKey].push(uts);
//                                         return groups;
//                                       }, {});

//                                     // Sort date keys
//                                     const sortedDates = Object.keys(
//                                       groupedByDate
//                                     ).sort((a, b) => {
//                                       if (a === "No date" || b === "No date")
//                                         return 0;
//                                       const [dayA, monthA, yearA] = a
//                                         .split("-")
//                                         .map(Number);
//                                       const [dayB, monthB, yearB] = b
//                                         .split("-")
//                                         .map(Number);
//                                       return (
//                                         new Date(
//                                           yearA,
//                                           monthA - 1,
//                                           dayA
//                                         ).getTime() -
//                                         new Date(
//                                           yearB,
//                                           monthB - 1,
//                                           dayB
//                                         ).getTime()
//                                       );
//                                     });

//                                     // Helper to get start time from slot string
//                                     const extractStartTime = (
//                                       timeSlotStr: string
//                                     ) => {
//                                       if (!timeSlotStr) return "";
//                                       if (timeSlotStr.includes("-")) {
//                                         return timeSlotStr.split("-")[0].trim();
//                                       } else if (timeSlotStr.includes(" to ")) {
//                                         return timeSlotStr
//                                           .split(" to ")[0]
//                                           .trim();
//                                       }
//                                       return timeSlotStr.trim();
//                                     };

//                                     const timeToMinutes = (timeStr: string) => {
//                                       const [h, m] = extractStartTime(timeStr)
//                                         .split(":")
//                                         .map(Number);
//                                       return h * 60 + m;
//                                     };

//                                     const formatTimeRanges = (times: any[]) => {
//                                       if (times.length === 0)
//                                         return "No times available";
//                                       const sorted = times
//                                         .map((t) => ({
//                                           original: extractStartTime(t),
//                                           minutes: timeToMinutes(t),
//                                         }))
//                                         .sort((a, b) => a.minutes - b.minutes);

//                                       const ranges = [];
//                                       let start = sorted[0];
//                                       let end = sorted[0];

//                                       for (let i = 1; i < sorted.length; i++) {
//                                         const current = sorted[i];
//                                         if (
//                                           current.minutes - end.minutes ===
//                                           30
//                                         ) {
//                                           end = current;
//                                         } else {
//                                           ranges.push(
//                                             start.minutes === end.minutes
//                                               ? start.original
//                                               : `${start.original} - ${end.original}`
//                                           );
//                                           start = end = current;
//                                         }
//                                       }

//                                       ranges.push(
//                                         start.minutes === end.minutes
//                                           ? start.original
//                                           : `${start.original} - ${end.original}`
//                                       );

//                                       return ranges.join(", ");
//                                     };

//                                     return (
//                                       <div className="space-y-2">
//                                         {sortedDates.map((date, index) => {
//                                           const slots = groupedByDate[date];
//                                           const times = slots
//                                             .map(
//                                               (uts: { time_slot_id: any }) => {
//                                                 const timeSlot = timeSlots.find(
//                                                   (ts) =>
//                                                     ts.id === uts.time_slot_id
//                                                 );
//                                                 return (
//                                                   timeSlot?.time_slot || null
//                                                 );
//                                               }
//                                             )
//                                             .filter(Boolean);

//                                           return (
//                                             <div key={index}>
//                                               <div className="font-medium text-gray-900 mb-1">
//                                                 {date} / {formatTimeRanges(times)}
//                                               </div>
//                                               {/* <div className="text-xs text-gray-600">
//                                                 {formatTimeRanges(times)}
//                                               </div> */}
//                                             </div>
//                                           );
//                                         })}
//                                       </div>
//                                     );
//                                   })()}
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </td>

//                       {/* Description */}
//                       <td className="px-4 py-4 text-sm">
//                         <div className="flex items-center gap-2">
//                           {request.work_description && (
//                             <>
//                               {/* Truncated text */}
//                               <span className="text-gray-700 truncate max-w-[150px]">
//                                 {request.work_description.length > 30
//                                   ? `${request.work_description.substring(0, 30)}...`
//                                   : request.work_description}
//                               </span>

//                               {/* ✅ Show info icon only if description is longer than 30 chars */}
//                               {request.work_description.length > 30 && (
//                                 <div className="relative group flex-shrink-0">
//                                   <Info className="w-4 h-4 text-[#76B900] cursor-pointer hover:opacity-80" />
//                                   <div className="absolute left-5 top-1/2 -translate-y-1/2 hidden group-hover:block bg-white border border-lime-500 rounded-lg shadow-lg z-[100] min-w-max">
//                                     <div className="max-w-79 max-h-15 overflow-y-auto pt-1 px-2">
//                                       <div className="text-xs text-gray-900 break-words leading-relaxed">
//                                         {request.work_description}
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </div>
//                               )}
//                             </>
//                           )}
//                         </div>
//                       </td>

//                       {/* Access Status Icon */}
//                       <td className="px-4 py-4 text-sm">
//                         <div className="relative group">
//                           {getAccessStatusIcon(request.status_id)}
//                           <div className="absolute left-0 bottom-1/2 -translate-y-1/2 mr-2 hidden group-hover:block bg-white border border-lime-500 rounded-lg shadow-md px-3 py-2 text-center whitespace-nowrap z-50 min-w-max">
//                             <div className="text-sm font-medium text-gray-900">
//                               {getStatusName(request.status_id)}
//                             </div>
//                           </div>
//                         </div>
//                       </td>
//                       {/* Access Granted */}
//                       <td className="px-4 py-4 text-sm text-gray-700">
//                         {getStatusName(request.status_id) === "Rejected"
//                           ? "" // show nothing if status is Rejected
//                           : request.is_access_granted
//                             ? "Access Granted"
//                             : getStatusName(request.status_id) ===
//                                   "Approved-Functional" ||
//                                 getStatusName(request.status_id) === "Pending"
//                               ? ""
//                               : "Access Denied"}
//                       </td>

//                       {/* Remarks */}
//                       <td className="px-4 py-4 text-sm text-gray-700">
//                         {request.remarks}
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination Footer */}
//           <div className="bg-lime-500 px-6 py-2 flex justify-end items-center relative z-10">
//             {/* Left side: Rows per page */}
//             <div className="flex items-center space-x-2">
//               {/* Keep label white */}
//               <span className="text-white text-sm font-medium">
//                 Rows per page:
//               </span>

//               <div className="relative">
//                 {/* Dropdown text black */}
//                 <select
//                   value={rowsPerPage}
//                   onChange={(e) => {
//                     setRowsPerPage(Number(e.target.value));
//                     setCurrentPage(1);
//                   }}
//                   className="px-3 py-2 pr-8 text-sm shadow appearance-none text-white rounded
//              focus:outline-none focus:ring-2 focus:ring-white focus:border-white bg-white-500 cursor-pointer"
//                 >
//                   <option value={5} className="text-black">
//                     5
//                   </option>
//                   <option value={10} className="text-black">
//                     10
//                   </option>
//                   <option value={20} className="text-black">
//                     20
//                   </option>
//                 </select>

//                 {/* Chevron stays white for consistency */}
//                 <ChevronDown className="w-4 h-4 cursor-pointer text-white absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
//               </div>
//             </div>

//             {/* Right side: range info + controls */}
//             <div className="flex items-center space-x-4">
//               <span className="text-white text-sm font-medium">
//                 {requestRangeStart}–{requestRangeEnd} of {sortedRequests.length}
//               </span>

//               {/* Pagination controls */}
//               <div className="flex items-center space-x-3">
//                 {/* Prev Arrow */}
//                 <ChevronLeft
//                   onClick={() =>
//                     currentPage > 1 && setCurrentPage((p) => p - 1)
//                   }
//                   className={`w-5 h-5 cursor-pointer 
//           ${currentPage === 1 ? "text-white opacity-50 cursor-not-allowed" : "text-white hover:text-gray-200"}`}
//                 />

//                 {/* Next Arrow */}
//                 <ChevronRight
//                   onClick={() =>
//                     currentPage < totalPages && setCurrentPage((p) => p + 1)
//                   }
//                   className={`w-5 h-5 cursor-pointer 
//           ${currentPage === totalPages ? "text-white opacity-50 cursor-not-allowed" : "text-white hover:text-gray-200"}`}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* Legend */}
//         <div className="mt-6 text-xs">
//           {/* First row */}
//           <div className="flex flex-wrap gap-6">
//             <div className="flex items-center space-x-3">
//               <div className="w-4 h-4 rounded-full bg-gray-400 flex items-center justify-center text-black text-xs">
//                 !
//               </div>
//               <span className="font-medium text-gray-700">Pending</span>
//             </div>
//             <div className="flex items-center space-x-3">
//               <div className="w-4 h-4 rounded-full bg-orange-400 flex items-center justify-center text-white text-xs">
//                 ✓
//               </div>
//               <span className="font-medium text-gray-700">
//                 Approved-Functional
//               </span>
//             </div>
//             <div className="flex items-center space-x-3">
//               <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
//                 ✓
//               </div>
//               <span className="font-medium text-gray-700">
//                 Approved-Technical
//               </span>
//             </div>
//             <div className="flex items-center space-x-3">
//               <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
//                 ✕
//               </div>
//               <span className="font-medium text-gray-700">Rejected</span>
//             </div>
//           </div>

//           {/* Second row */}
//           <div className="flex flex-wrap gap-6 mt-3">
//             <div className="flex items-center space-x-3">
//               <Info className="w-4 h-4 text-[#76B900]" />
//               <span className="font-medium text-gray-700">
//                 Hover to view Datetime / Description details
//               </span>
//             </div>
//           </div>

//           <div className="flex flex-wrap gap-6 mt-0 ml-1">
//             <div className="flex items-center space-x-3.5">
//               <div className="text-gray-700 text-xl font-semibold mt-1">*</div>
//               <span className="font-medium text-gray-700">
//                 Click on row for Instance Request details
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Filter Validation Popup */}
//       {isFilterValidationPopupOpen && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-1">
//           {" "}
//           {/* reduced side spacing */}
//           <div className="bg-white rounded-md shadow-md w-full max-w-sm">
//             {/* Content */}
//             <div className="py-6 text-center">
//               {" "}
//               {/* kept same inner spacing */}
//               <h3 className="text-base font-medium text-lime-600 mb-4 leading-snug">
//                 Please select at least one filter criteria
//                 <br />
//                 <span className="text-base font-medium text-lime-600 leading-snug">
//                   (Date Range or Status).
//                 </span>
//               </h3>
//               {/* Action Button */}
//               <div className="flex justify-center mt-2">
//                 <button
//                   onClick={closeFilterValidationPopup}
//                   className="bg-lime-600 text-white px-4 py-1 rounded-sm text-sm font-semibold hover:bg-lime-700 cursor-pointer"
//                 >
//                   OK
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Snackbar */}
//       {snackbar.show && snackbar.type === "success" && (
//         <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[70]">
//           <div
//             className="px-6 py-3 rounded-lg shadow-lg text-white text-sm font-medium"
//             style={{ backgroundColor: "#76B900" }}
//           >
//             {snackbar.message}
//           </div>
//         </div>
//       )}

//       {/* Error Snackbar */}
//       {snackbar.show && snackbar.type === "error" && (
//         <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[70]">
//           <div className="px-6 py-3 rounded-lg shadow-lg text-white text-sm font-medium bg-red-500">
//             {snackbar.message}
//           </div>
//         </div>
//       )}

//       {/* Request Details Popup Modal */}

//       {isPopupOpen && selectedRequest && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 relative max-h-[90vh] flex flex-col">
//             {/* Header */}
//             <div className="text-center py-4 border-b border-gray-400">
//               <h3 className="text-xl font-semibold text-gray-800">
//                 Instance Request Details
//               </h3>
//             </div>

//             {/* Close Button */}
//             <button
//               onClick={closePopup}
//               className="absolute top-3 right-4 text-gray-400 hover:text-gray-600"
//             >
//               <X className="w-5 h-5 cursor-pointer" />
//             </button>

//             {/* Content */}
//             <div className="p-6 text-sm space-y-8 flex-1 overflow-y-auto flex flex-col items-center">
//               {/* PERSONAL INFORMATION BOX */}
//               <div className="relative border border-gray-300 rounded-lg p-4 shadow-sm w-[90%] max-w-lg mx-auto">
//                 {/* Box Title aligned to the right side of border */}
//                 <div className="absolute -top-3 left-2 bg-white px-4">
//                   <h4 className="text-md font-semibold text-gray-700">
//                     Personal Information
//                   </h4>
//                 </div>

//                 <div className="mt-2">
//                   {[
//                     { label: "Request Id", value: selectedRequest.id },
//                     {
//                       label: "User Name",
//                       value: getUserName(selectedRequest.user_id),
//                     },
//                     {
//                       label: "Institute",
//                       value: getInstituteName(selectedRequest.user_id),
//                     },
//                     {
//                       label: "Department",
//                       value: getDepartmentName(selectedRequest.user_id),
//                     },
//                     {
//                       label: "Email Id",
//                       value: getUser(selectedRequest.user_id)?.email_id,
//                     },
//                      ...(getStatusName(selectedRequest.status_id) ===
//                     "Approved-Technical"
//                       ? [
//                           {
//                             label: "User ID",
//                             value: selectedRequest.login_id || "",
//                           },
//                           {
//                             label: "Password",
//                             value: selectedRequest.password || "",
//                           },

                         
//                           {
//                             label: "Access Link",
//                             value: (
//                               <a
//                                 href={`http://${"45.120.59.148:32243"}`}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="text-blue-600 underline hover:text-blue-800"
//                               >
//                                 45.120.59.148:32243
//                               </a>
//                             ),
//                           },
//                            ...(selectedRequest.additional_information
//                             ? [
//                                 {
//                                   label: "Additional Information",
//                                   value: selectedRequest.additional_information,
//                                 },
//                               ]
//                             : []),
//                         ]
//                       : []),
//                   ].map((item, idx) => (
//                     <div
//                       key={idx}
//                       className="grid grid-cols-[150px_20px_1fr] w-full"
//                     >
//                       <span className="font-medium text-gray-700 text-right">
//                         {item.label}
//                       </span>
//                       <span className="text-gray-700 text-center">:</span>
//                       <span className="text-gray-900 text-left break-words">
//                         {item.value}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* TECHNICAL INFORMATION BOX */}
//               <div className="relative border border-gray-300 rounded-lg p-4 shadow-sm w-[90%] max-w-lg mx-auto">
//                 {/* Box Title aligned to the right side of border */}
//                 <div className="absolute -top-3 left-2 bg-white px-4">
//                   <h4 className="text-md font-semibold text-gray-700">
//                     Technical Information
//                   </h4>
//                 </div>

//                 <div className="mt-2">
//                   {[
//                     {
//                       label: "User Type",
//                       value: getUserTypeName(selectedRequest.user_type_id),
//                     },
                   
                   
//                     {
//                       label: "Image",
//                       value: getCustomImageName(selectedRequest.image_id),
//                     },
//                     {
//                       label: "Requested CPUs",
//                       value: `${getCpuName(selectedRequest.cpu_id)} + 1 (${
//                         Number(getCpuName(selectedRequest.cpu_id)) + 1
//                       })`,
//                     },
//                     {
//                       label: "Requested RAM in GB",
//                       value: `${parseInt(getRamName(selectedRequest.ram_id))} + 1 (${
//                         parseInt(getRamName(selectedRequest.ram_id)) + 1
//                       }) GB`,
//                     },
//                     {
//                       label: "Number of GPU",
//                       value: getGpuPartitionName(
//                         selectedRequest.gpu_partition_id
//                       ),
//                     },
//                     {
//                       label: "GPU Vendor",
//                       value: getGpuVendorName(selectedRequest.gpu_vendor_id),
//                     },
//                      {
//                       label: "Selected Date / Time",
//                       value: (
//                         <span className="whitespace-pre-wrap text-gray-900 text-left block break-words">
//                           {selectedRequestTimeDetails?.formatted ||
//                             "Date and time not available"}
//                         </span>
//                       ),
//                     },

//                      {
//                       label: "Status",
//                       value: getStatusName(selectedRequest.status_id),
//                     },
                  
//                     ...(getStatusName(selectedRequest.status_id) ===
//                       "Approved-Functional" ||
//                     getStatusName(selectedRequest.status_id) ===
//                       "Approved-Technical"
//                       ? [
//                           {
//                             label: "Approved By",
//                             value: getUserName(selectedRequest.updated_by),
//                           },
//                         ]
//                       : getStatusName(selectedRequest.status_id) === "Rejected"
//                         ? [
//                             {
//                               label: "Rejected By",
//                               value: getUserName(selectedRequest.updated_by),
//                             },
//                           ]
//                         : []),
//                     // ✅ Remarks only for Rejected or Revoked
//                     ...(["Rejected"].includes(
//                       getStatusName(selectedRequest.status_id)
//                     )
//                       ? [
//                           {
//                             label: "Remarks",
//                             value: selectedRequest.remarks || "",
//                           },
//                         ]
//                       : []),

//                     {
//                       label: "Work Description",
//                       value: (
//                         <span className="block break-words">
//                           {selectedRequest.work_description}
//                         </span>
//                       ),
//                     },
//                   ].map((item, idx) => (
//                     <div
//                       key={idx}
//                       className="grid grid-cols-[150px_20px_1fr] w-full"
//                     >
//                       <span className="font-medium text-gray-700 text-right">
//                         {item.label}
//                       </span>
//                       <span className="text-gray-700 text-center">:</span>
//                       <span className="text-gray-900 text-left break-words">
//                         {item.value}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Action Buttons - unchanged */}
//             <div className="flex justify-center gap-3 py-4 border-t border-gray-400">
//               {getStatusName(selectedRequest.status_id) ===
//               "Approved-Functional" ? (
//                 <>
//                   <button
//                     onClick={handleApprove}
//                     className="bg-lime-500 text-white py-2 px-6 rounded hover:bg-lime-600 transition-colors text-sm font-medium cursor-pointer font-semibold"
//                   >
//                     Approve
//                   </button>
//                   <button
//                     onClick={handleReject}
//                     className="bg-lime-500 text-white py-2 px-6 rounded hover:bg-lime-600 transition-colors text-sm font-medium cursor-pointer font-semibold"
//                   >
//                     Reject
//                   </button>
//                 </>
//               ) : getStatusName(selectedRequest.status_id) ===
//                 "Approved-Technical" ? (
//                 selectedRequest.is_access_granted ? (
//                   <button
//                     onClick={handleRevokeAccess}
//                     className="bg-lime-500 text-white py-2 px-6 rounded hover:bg-lime-600 transition-colors text-sm font-medium cursor-pointer font-semibold"
//                   >
//                     Revoke Access
//                   </button>
//                 ) : (
//                   <button
//                     onClick={handleGrantAccess}
//                     className="bg-lime-500 text-white py-2 px-6 rounded hover:bg-lime-600 transition-colors text-sm font-medium cursor-pointer font-semibold"
//                   >
//                     Grant Access
//                   </button>
//                 )
//               ) : (
//                 <button
//                   onClick={closePopup}
//                   className="bg-lime-500 text-white py-2 px-6 rounded hover:bg-lime-600 transition-colors text-sm font-medium cursor-pointer font-semibold"
//                 >
//                   OK
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Confirmation Popup Modal */}
//       {isConfirmationOpen && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-md shadow-md w-full max-w-sm mx-4">
//             {/* Content */}
//             <div className="p-6 text-center">
//               <h3 className="text-base font-medium text-lime-600 mb-6">
//                 Are you sure you want to{" "}
//                 {confirmationAction === "revoke"
//                   ? "revoke access for"
//                   : confirmationAction === "grant"
//                     ? "grant access for"
//                     : confirmationAction}{" "}
//                 this request ID({selectedRequest?.id})?
//               </h3>

//               {/* Action Buttons */}
//               <div className="flex justify-center gap-2">
//                 <button
//                   onClick={handleConfirmationYes}
//                   className="bg-lime-600 text-white px-4 py-1 rounded-sm text-sm font-semibold hover:bg-lime-700 cursor-pointer"
//                 >
//                   Yes
//                 </button>
//                 <button
//                   onClick={closeConfirmation}
//                   className="bg-lime-600 text-white px-4 py-1 rounded-sm text-sm font-semibold hover:bg-lime-700 cursor-pointer"
//                 >
//                   No
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Credentials Form Modal (for approve) - UPDATED WITH REGISTRATION-STYLE VALIDATION */}
//       {isCredentialsFormOpen && (
//         <div className="fixed inset-0  flex items-center justify-center z-60 p-4">
//           <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 relative">
//             {/* Close Button */}
//             <button
//               onClick={closeCredentialsForm}
//               className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 z-10"
//             >
//               <X className="w-5 h-5 cursor-pointer" />
//             </button>

//             {/* Content */}
//             <div className="p-6">
//               {/* Header */}
//               <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">
//                 Enter Credentials
//               </h3>

//               {/* Login ID */}
//               <div className="relative w-full mb-4">
//                 <label
//                   className={`absolute left-3 transition-all duration-200 pointer-events-none z-10
//               ${credentialsData.loginId || credentialsErrors.loginId ? "text-xs -top-2 px-1" : "top-3"}
//               ${
//                 credentialsErrors.loginId
//                   ? "text-red-500"
//                   : credentialsData.loginId
//                     ? "text-[#5a8f00] font-medium"
//                     : "text-gray-500"
//               }
//             `}
//                   style={{
//                     backgroundColor:
//                       credentialsData.loginId || credentialsErrors.loginId
//                         ? "#ffffff"
//                         : "transparent",
//                   }}
//                 >
//                   {credentialsErrors.loginId || "User ID*"}
//                 </label>

//                 <input
//                   maxLength={50}
//                   type="email"
//                   value={credentialsData.loginId}
//                   onChange={(e) =>
//                     handleCredentialsChange("loginId", e.target.value)
//                   }
//                   className={`w-full text-gray-700 px-3 pt-4 pb-2 rounded-lg text-sm focus:outline-none transition-all duration-200
//               ${
//                 credentialsErrors.loginId
//                   ? "border-2 border-red-500 focus:border-red-500"
//                   : "border-2 border-[#e8f5d0] hover:[#e8f5d0]"
//               }
//             `}
//                   onFocus={(e) => {
//                     e.target.style.borderColor = "#76B900";
//                     e.target.style.boxShadow =
//                       "0 0 0 3px rgba(118, 185, 0, 0.1)";
//                   }}
//                   style={{
//                     color: "#2d4a00",
//                     boxShadow: credentialsErrors.loginId
//                       ? "0 0 0 3px rgba(239, 68, 68, 0.1)"
//                       : "none",
//                   }}
//                 />
//               </div>

//               {/* Password */}
//               <div className="relative w-full mb-4">
//                 <label
//                   className={`absolute left-3 transition-all duration-200 pointer-events-none z-10
//               ${credentialsData.password || credentialsErrors.password ? "text-xs -top-2 px-1" : "top-3"}
//               ${
//                 credentialsErrors.password
//                   ? "text-red-500"
//                   : credentialsData.password
//                     ? "text-[#5a8f00] font-medium"
//                     : "text-gray-500"
//               }
//             `}
//                   style={{
//                     backgroundColor:
//                       credentialsData.password || credentialsErrors.password
//                         ? "#ffffff"
//                         : "transparent",
//                   }}
//                 >
//                   {credentialsErrors.password || "Password*"}
//                 </label>

//                 <input
//                   maxLength={50}
//                   type="text"
//                   value={credentialsData.password}
//                   onChange={(e) =>
//                     handleCredentialsChange("password", e.target.value)
//                   }
//                   className={`w-full text-gray-700 px-3 pt-4 pb-2 rounded-lg text-sm focus:outline-none transition-all duration-200
//               ${
//                 credentialsErrors.password
//                   ? "border-2 border-red-500 focus:border-red-500"
//                   : "border-2 border-[#e8f5d0] hover:border-[#e8f5d0]"
//               }
//             `}
//                   onFocus={(e) => {
//                     e.target.style.borderColor = "#76B900";
//                     e.target.style.boxShadow =
//                       "0 0 0 3px rgba(118, 185, 0, 0.1)";
//                   }}
//                   style={{
//                     color: "#2d4a00",
//                     boxShadow: credentialsErrors.password
//                       ? "0 0 0 3px rgba(239, 68, 68, 0.1)"
//                       : "none",
//                   }}
//                 />
//               </div>

//               {/* Additional Info */}
//               <div className="relative w-full mb-1">
//                 <label
//                   className={`absolute left-3 transition-all duration-200 pointer-events-none z-10
//               ${credentialsData.additionalInfo || credentialsErrors.additionalInfo ? "text-xs -top-2 px-1" : "top-3"}
//               ${
//                 credentialsErrors.additionalInfo
//                   ? "text-red-500"
//                   : credentialsData.additionalInfo
//                     ? "text-[#5a8f00] font-medium"
//                     : "text-gray-500"
//               }
//             `}
//                   style={{
//                     backgroundColor:
//                       credentialsData.additionalInfo ||
//                       credentialsErrors.additionalInfo
//                         ? "#ffffff"
//                         : "transparent",
//                   }}
//                 >
//                   {credentialsErrors.additionalInfo || "Additional Information"}
//                 </label>

//                 <textarea
//                   value={credentialsData.additionalInfo}
//                   onChange={(e) =>
//                     handleCredentialsChange("additionalInfo", e.target.value)
//                   }
//                   className={`w-full text-gray-700 px-3 pt-4 pb-2 rounded-lg text-sm h-20 resize-none focus:outline-none transition-all duration-200
//               ${
//                 credentialsErrors.additionalInfo
//                   ? "border-2 border-red-500 focus:border-red-500"
//                   : "border-2 border-[#e8f5d0] hover:border-[#e8f5d0]"
//               }
//             `}
//                   onFocus={(e) => {
//                     e.target.style.borderColor = "#76B900";
//                     e.target.style.boxShadow =
//                       "0 0 0 3px rgba(118, 185, 0, 0.1)";
//                   }}
//                   style={{
//                     color: "#2d4a00",
//                     boxShadow: credentialsErrors.additionalInfo
//                       ? "0 0 0 3px rgba(239, 68, 68, 0.1)"
//                       : "none",
//                   }}
//                 />
//                 <div className="text-gray-400 text-xs mt-1 text-right">
//                   {credentialsData.additionalInfo.length}/500 characters
//                 </div>
//               </div>

//               {/* Submit Button */}
//               <div className="flex justify-center mt-4">
//                 <button
//                   onClick={handleCredentialsSubmit}
//                   disabled={isEmailSending}
//                   className="bg-lime-500 text-white py-2 px-6 rounded hover:bg-lime-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-semibold"
//                   style={{
//                     backgroundColor: isEmailSending ? "#9ca3af" : "#76B900",
//                   }}
//                 >
//                   {isEmailSending ? "Submitting..." : "Submit"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Remarks Modal (for reject and revoke) */}
//       {isRemarksModalOpen && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-60 p-4">
//           <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 relative">
//             {/* Close Button */}
//             <button
//               onClick={closeRemarksModal}
//               className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 z-10"
//             >
//               <X className="w-5 h-5 cursor-pointer" />
//             </button>

//             {/* Content */}
//             <div className="p-6">
//               <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">
//                 {confirmationAction === "revoke"
//                   ? "Reason for Revoking Access"
//                   : "Remarks"}
//               </h3>

//               {/* Remarks Input */}
//               <div className="relative w-full">
//                 <label
//                   className={`absolute left-3 transition-all duration-200 pointer-events-none z-10
//               ${remarksText || remarksError ? "text-xs -top-2 px-1" : "top-3"}
//               ${
//                 remarksError
//                   ? "text-red-500"
//                   : remarksText
//                     ? "text-[#5a8f00] font-medium"
//                     : "text-gray-500"
//               }
//             `}
//                   style={{
//                     backgroundColor:
//                       remarksText || remarksError ? "#ffffff" : "transparent",
//                   }}
//                 >
//                   {remarksError ||
//                     (confirmationAction === "revoke"
//                       ? "Reason for Revoking Access*"
//                       : "Remarks*")}
//                 </label>

//                 <textarea
//                   value={remarksText}
//                   onChange={(e) => {
//                     setRemarksText(e.target.value);
//                     if (e.target.value.trim() !== "") setRemarksError(""); // Clear error on typing
//                   }}
//                   className={`w-full text-gray-700 h-24 p-3 rounded-lg text-sm resize-none focus:outline-none transition-all duration-200
//               ${
//                 remarksError
//                   ? "border-2 border-red-500 focus:border-red-500"
//                   : "border-2 border-[#e8f5d0] hover:border-[#e8f5d0]"
//               }
//             `}
//                   onFocus={(e) => {
//                     e.target.style.borderColor = "#76B900";
//                     e.target.style.boxShadow =
//                       "0 0 0 3px rgba(118, 185, 0, 0.1)";
//                   }}
//                   style={{
//                     color: "#2d4a00",
//                     boxShadow: remarksError
//                       ? "0 0 0 3px rgba(239, 68, 68, 0.1)"
//                       : "none",
//                   }}
//                 />
//               </div>

//               {/* Action Button */}
//               <div className="flex justify-center mt-4">
//                 <button
//                   onClick={handleRemarksSubmit}
//                   disabled={isEmailSending}
//                   className="bg-lime-500 text-white py-2 px-6 rounded hover:bg-lime-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-semibold"
//                   style={{
//                     backgroundColor: isEmailSending ? "#9ca3af" : "#76B900",
//                   }}
//                 >
//                   {isEmailSending ? "Submitting..." : "Submit"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ------------------ Export with Suspense Wrapper ------------------
// export default function TechnicalDashboard() {
//   return (
//     <Suspense fallback={<div></div>}>
//       <DGXDashboard />
//     </Suspense>
//   );
// }