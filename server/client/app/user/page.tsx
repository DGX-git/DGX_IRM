// "use client";
// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import {
//   ChevronDown,
//   Filter,
//   ChevronLeft,
//   ChevronRight,
//   X,
//   Info,
//   Trash2,
// } from "lucide-react";

// import Header from "@/app/navbar/page"; // Adjust the import path as necessary
// // import { Amplify } from "aws-amplify";
// // import { generateClient } from "aws-amplify/data";
// // import type { Schema } from "@/amplify/data/resource";
// // import outputs from "@/amplify_outputs.json";
// import { Listbox } from "@headlessui/react";
// import { useRouter } from "next/navigation";
// // import { getCurrentUser } from "aws-amplify/auth"; // AWS Amplify Auth
// import { checkAuth } from "@/utils/auth";

// // Amplify.configure(outputs);
// // const client = generateClient<Schema>();

// // Define proper types for the data
// type InstanceRequest = {
//   id: string;
//   instance_request_id?: string;
//   user_id: string;
//   status_id: string;
//   createdAt?: string;
//   created_at?: string;
//   work_description?: string;
//   remarks?: string;
//   user_type?: string;
//   date_time?: string;
//   custom_image?: string;
//   cpus?: string;
//   ram?: string;
//   gpu_partition?: string;
//   gpu_slots?: string;
//   storage_volume?: string;
//   [key: string]: string | undefined; // For dynamic property access
// };

// type User = {
//   id: string;
//   firstname?: string;
//   lastname?: string;
//   email_id?: string;
//   username?: string;
//   institute_id?: string;
//   department_id?: string;
// };

// type Institute = {
//   id: string;
//   institute_name?: string;
// };

// type Status = {
//   id: string;
//   status_name: string;
// };

// type SortConfig = {
//   key: string;
//   direction: "asc" | "desc";
// };

// type SnackbarState = {
//   show: boolean;
//   message: string;
//   type: "success" | "error";
// };

// const DGXDashboard = () => {
//   // Dynamic user ID state
//   const [currentUserId, setCurrentUserId] = useState<string | null>(null);
//   const [isLoadingUser, setIsLoadingUser] = useState(true);

//   // Dashboard states
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState<any | null>(null);
//   const [status, setStatus] = useState<any[]>([]);
//   const [requests, setRequests] = useState<InstanceRequest[]>([]);
//   const [filteredRequests, setFilteredRequests] = useState<InstanceRequest[]>(
//     []
//   );
//   const [users, setUsers] = useState<User[]>([]);
//   const [institutes, setInstitutes] = useState<Institute[]>([]);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [dateError, setDateError] = useState("");
//   const [sortConfig, setSortConfig] = useState({
//     key: "createdAt", // Changed from "created_by" to "createdAt"
//     direction: "desc",
//   });
//   // Popup states
//   const [selectedRequest, setSelectedRequest] = useState<any>(null);
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [isFilterValidationPopupOpen, setIsFilterValidationPopupOpen] =
//     useState(false);

//   // Delete confirmation popup state
//   const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
//   const [requestToDelete, setRequestToDelete] = useState<any>(null);

//   // Snackbar state
//   const [snackbar, setSnackbar] = useState<SnackbarState>({
//     show: false,
//     message: "",
//     type: "success",
//   });
//   const [loading, setLoading] = useState(true);

//   const router = useRouter();

//   const [departments, setDepartments] = useState<any[]>([]);
//   const [userTypes, setUserTypes] = useState<any[]>([]);
//   const [cpuList, setCpuList] = useState<any[]>([]);
//   const [ramList, setRamList] = useState<any[]>([]);
//   const [gpuPartitions, setGpuPartitions] = useState<any[]>([]);
//   const [gpuVendors, setGpuVendors] = useState<any[]>([]);
//   const [image, setImage] = useState<any[]>([]);

//   // NEW: Add state for time slots and date/time details
//   const [timeSlots, setTimeSlots] = useState<any[]>([]);
//   const [userTimeSlots, setUserTimeSlots] = useState<any[]>([]);
//   const [selectedRequestTimeDetails, setSelectedRequestTimeDetails] =
//     useState<any>(null);
//   const [userInstituteAssociation, setUserInstituteAssociation] = useState<
//     any[]
//   >([]);
//   const [authLoading, setAuthLoading] = useState(true);
//   const [hasActiveFilters, setHasActiveFilters] = useState(false);

//     useEffect(() => {
//       const verifyUser = async () => {
//         const result = await checkAuth(["User"],[]); // ✅ Only allow 'User' role here
//         if (!result.authorized) {
//           router.replace(result.redirect || "/login");
//         } else {
//           setAuthLoading(false);
//         }
//       };

//       verifyUser();
//     }, [router]);

//   // NEW: Fetch time slots and user at time slots
//   useEffect(() => {
//     const fetchTimeData = async () => {
//       try {
//         const [timeSlotsResult, userTimeSlotsResult] = await Promise.all([
//           client.models.timeSlot.list(),
//           client.models.userTimeSlot.list(),
//         ]);

//         setTimeSlots(timeSlotsResult.data || []);
//         setUserTimeSlots(userTimeSlotsResult.data || []);
//       } catch (err) {
//         console.error("Error fetching time data:", err);
//       }
//     };

//     fetchTimeData();
//   }, []);

//   // NEW: Function to get time details for a specific request with improved formatting and debugging
//   const getTimeDetailsForRequest = (instanceRequestId: string) => {
//     try {
//       const allUserTimeSlotsForRequest = userTimeSlots.filter(
//         (uts) => uts.instance_request_id === instanceRequestId
//       );

//       if (
//         !allUserTimeSlotsForRequest ||
//         allUserTimeSlotsForRequest.length === 0
//       ) {
//         return {
//           date: "No date available",
//           time: "No time available",
//           formatted: "Date and time not available",
//         };
//       }

//       // Group slots by date
//       const groupedDetails: Record<string, string[]> = {};

//       for (const userTimeSlot of allUserTimeSlotsForRequest) {
//         const timeSlotId = userTimeSlot.time_slot_id;
//         const timeSlot = timeSlots.find((ts) => ts.id === timeSlotId);
//         const date = userTimeSlot.selected_date;
//         const timeSlotValue = timeSlot ? timeSlot.time_slot : "Time not found";

//         // Debug: Log the raw time slot value

//         if (date) {
//           const formattedDate = new Date(date).toLocaleDateString("en-GB");

//           if (!groupedDetails[formattedDate]) {
//             groupedDetails[formattedDate] = [];
//           }
//           groupedDetails[formattedDate].push(timeSlotValue);
//         }
//       }

//       // Sort dates ascending
//       const sortedDates = Object.keys(groupedDetails).sort((a, b) => {
//         const [dayA, monthA, yearA] = a.split("/").map(Number);
//         const [dayB, monthB, yearB] = b.split("/").map(Number);
//         return (
//           new Date(yearA, monthA - 1, dayA).getTime() -
//           new Date(yearB, monthB - 1, dayB).getTime()
//         );
//       });

//       // Helper function to extract start time from different time slot formats
//       const extractStartTime = (timeSlotStr: string): string => {
//         if (!timeSlotStr) return "";

//         // Handle different formats like "15:00-15:30", "15:00 to 15:30", "15:00"
//         let startTime = timeSlotStr;

//         if (timeSlotStr.includes("-")) {
//           startTime = timeSlotStr.split("-")[0];
//         } else if (timeSlotStr.includes(" to ")) {
//           startTime = timeSlotStr.split(" to ")[0];
//         }

//         return startTime.trim();
//       };

//       // Helper function to parse time and convert to minutes for comparison
//       const timeToMinutes = (timeStr: string): number => {
//         const cleanTime = extractStartTime(timeStr);
//         const [hours, minutes] = cleanTime.split(":").map(Number);
//         return hours * 60 + minutes;
//       };

//       // Helper function to format continuous time ranges
//       const formatTimeRanges = (times: string[]): string => {
//         if (times.length === 0) return "No times available";

//         // Extract start times and create objects for sorting
//         const timeObjects = times
//           .map((time) => {
//             const startTime = extractStartTime(time);
//             return {
//               original: startTime, // Use only the start time (like "15:00")
//               minutes: timeToMinutes(time),
//             };
//           })
//           .sort((a, b) => a.minutes - b.minutes);

//         const ranges: string[] = [];
//         let currentRangeStart = timeObjects[0];
//         let currentRangeEnd = timeObjects[0];

//         for (let i = 1; i < timeObjects.length; i++) {
//           const currentTime = timeObjects[i];

//           // Check if current time is continuous with the previous one (30-minute slots)
//           if (currentTime.minutes - currentRangeEnd.minutes === 30) {
//             // Extend the current range
//             currentRangeEnd = currentTime;
//           } else {
//             // End current range and start a new one
//             if (currentRangeStart.minutes === currentRangeEnd.minutes) {
//               // Single time slot
//               ranges.push(currentRangeStart.original);
//             } else {
//               // Time range - show from start to actual end slot
//               ranges.push(
//                 `${currentRangeStart.original} - ${currentRangeEnd.original}`
//               );
//             }

//             currentRangeStart = currentTime;
//             currentRangeEnd = currentTime;
//           }
//         }

//         // Handle the last range
//         if (currentRangeStart.minutes === currentRangeEnd.minutes) {
//           // Single time slot
//           ranges.push(currentRangeStart.original);
//         } else {
//           // Time range - show from start to actual end slot
//           ranges.push(
//             `${currentRangeStart.original} - ${currentRangeEnd.original}`
//           );
//         }

//         const result = ranges.join(" , ");

//         return result;
//       };

//       // Build formatted output with improved time range formatting
//       let formattedOutput = "";

//       for (let i = 0; i < sortedDates.length; i++) {
//         const date = sortedDates[i];
//         const times = groupedDetails[date];

//         // Format date as DD-MM-YYYY
//         const formattedDate = date.replace(/\//g, "-");

//         // Format time ranges
//         const formattedTimeRanges = formatTimeRanges(times);

//         // Create formatted line: "21-09-2025 : 15:00 - 15:30"
//         formattedOutput += `${formattedDate}\n[${formattedTimeRanges}]`;

//         // Add newline only if there are more dates
//         if (i < sortedDates.length - 1) {
//           formattedOutput += "\n";
//         }
//       }

//       return {
//         date: `${sortedDates.length} dates selected`,
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

//   // Function to get current user dynamically
//   const fetchCurrentUser = useCallback(async () => {
//     try {
//       setIsLoadingUser(true);

//       // Option 1: Using AWS Amplify Auth
//       const user = await getCurrentUser();
//       setCurrentUserId(user.userId);
//     } catch (error) {
//       console.error("Error fetching current user:", error);
//       showSnackbar("Error fetching user information", "error");
//       // Fallback to the hardcoded ID if needed
//       setCurrentUserId("d55dedea-b393-4577-9ccd-9a8567c61601");
//     } finally {
//       setIsLoadingUser(false);
//     }
//   }, []);

//   // Show snackbar
//   const showSnackbar = useCallback(
//     (message: string, type: "success" | "error" = "success") => {
//       setSnackbar({ show: true, message, type });
//       setTimeout(() => {
//         setSnackbar({ show: false, message: "", type: "success" });
//       }, 3000);
//     },
//     []
//   );

//   // Delete handler functions
//   const handleDeleteClick = (e: React.MouseEvent, request: any) => {
//     e.stopPropagation(); // Prevent row click event
//     setRequestToDelete(request);
//     setIsDeletePopupOpen(true);
//   };

//   const closeDeletePopup = () => {
//     setIsDeletePopupOpen(false);
//     setRequestToDelete(null);
//   };

//  const handleDeleteConfirm = async () => {
//   if (!requestToDelete) return;

//   try {
//     const instanceRequestId = requestToDelete.id;

//     // Step 1: Delete userTimeSlots associated with the request
//     const associatedUserTimeSlots = userTimeSlots.filter(
//       (uts) => uts.instance_request_id === instanceRequestId
//     );

//     const deleteUserTimeSlotsPromises = associatedUserTimeSlots.map((uts) =>
//       client.models.userTimeSlot.delete({ id: uts.id })
//     );

//     await Promise.all(deleteUserTimeSlotsPromises);

//     // Step 2: Delete the main instanceRequest
//     await client.models.instanceRequest.delete({ id: instanceRequestId });

//     // Step 3: Create updated arrays
//     const updatedRequests = requests.filter(
//       (req) => req.id !== instanceRequestId
//     );
    
//     const updatedUserTimeSlots = userTimeSlots.filter(
//       (uts) => uts.instance_request_id !== instanceRequestId
//     );

//     // Step 4: Determine if we need to reapply filters
//     const hasDateFilter = fromDate || toDate;
//     const hasStatusFilter = selectedStatus && selectedStatus.id !== "all";
    
//     let filtered;
    
//     if (hasDateFilter || hasStatusFilter) {
//       // Filters are active - reapply them
//       filtered = updatedRequests.filter((req) => req.user_id === currentUserId);

//       // Apply date filter
//       if (fromDate) {
//         filtered = filtered.filter((request) => {
//           const requestTimeSlots = updatedUserTimeSlots.filter(
//             (uts) => uts.instance_request_id === request.id
//           );

//           if (requestTimeSlots.length === 0) {
//             if (!request.selected_date) {
//               return false;
//             }

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

//       // Apply status filter
//       if (hasStatusFilter) {
//         filtered = filtered.filter((request) => {
//           const requestStatusName = getStatusName(request.status_id ?? "");
//           return requestStatusName === selectedStatus.status_name;
//         });
//       }
//     } else {
//       // No filters active - show all user requests
//       filtered = updatedRequests.filter((req) => req.user_id === currentUserId);
//     }

//     // Step 5: Update all states
//     setRequests(updatedRequests);
//     setUserTimeSlots(updatedUserTimeSlots);
//     setFilteredRequests(filtered);
    
//     // Reset to page 1 and adjust if needed
//     const newTotalPages = Math.ceil(filtered.length / rowsPerPage);
//     if (currentPage > newTotalPages && newTotalPages > 0) {
//       setCurrentPage(newTotalPages);
//     } else if (newTotalPages === 0) {
//       setCurrentPage(1);
//     }

//     showSnackbar("Request deleted successfully", "success");
//     closeDeletePopup();
//   } catch (error) {
//     console.error("Error deleting request:", error);
//     showSnackbar("Failed to delete request. Please try again.", "error");
//   }
// };

//   // Add this new useEffect to try alternative user matching after data is loaded
//   useEffect(() => {
//     const tryAlternativeUserMatching = async () => {
//       if (users.length > 0 && requests.length > 0) {
//         try {
//           const user = await getCurrentUser();

//           // Method 1: Try to match by email if available
//           if (user.signInDetails?.loginId) {
//             const emailMatch = users.find(
//               (u) => u.email_id === user.signInDetails?.loginId
//             );
//             if (emailMatch) {
//               setCurrentUserId(emailMatch.id);
//               return;
//             }
//           }

//           // Method 2: Try to match by username
//           if (user.username) {
//             const usernameMatch = users.find(
//               (u) => u.username === user.username
//             );
//             if (usernameMatch) {
//               setCurrentUserId(usernameMatch.id);
//               return;
//             }
//           }

//           // Method 3: Check if any user_id in requests matches currentUserId
//           const hasMatchingRequests = requests.some(
//             (req) => req.user_id === currentUserId
//           );
//           if (!hasMatchingRequests) {
//             console.log("No matching requests found for current user ID");
//             console.log(
//               "Available user_ids in requests:",
//               Array.from(new Set(requests.map((r) => r.user_id)))
//             );
//             console.log("Current user ID:", currentUserId);

//             // For debugging - temporarily use the first available user_id
//             // Remove this in production!
//             console.log("WARNING: Using first available user_id for debugging");
//             const firstUserId = requests[0]?.user_id;
//             if (firstUserId) {
//               setCurrentUserId(firstUserId);
//             }
//           }
//         } catch (error) {
//           console.log("Error in alternative matching:", error);
//         }

//         console.log("=== END ALTERNATIVE MATCHING ===");
//       }
//     };

//     // Only run this if we have data but no matching requests
//     if (users.length > 0 && requests.length > 0 && currentUserId) {
//       const hasMatchingRequests = requests.some(
//         (req) => req.user_id === currentUserId
//       );
//       if (!hasMatchingRequests) {
//         tryAlternativeUserMatching();
//       }
//     }
//   }, [users, requests, currentUserId]);

//   // Fetch current user on component mount
//   useEffect(() => {
//     fetchCurrentUser();
//   }, [fetchCurrentUser]);

//   const handleRequestInstanceClick = () => {
//     router.push("/user/instanceaccessrequest");
//   };

//   // Filter user's requests only - now uses dynamic currentUserId
//  // Filter user's requests only - now uses dynamic currentUserId
// // Only runs on initial load, NOT when requests change due to deletion
// useEffect(() => {
//   if (currentUserId && requests.length > 0 && filteredRequests.length === 0) {
//     const userRequests = requests.filter((req) => {
//       console.log(
//         `Comparing req.user_id (${req.user_id}) with currentUserId (${currentUserId})`
//       );
//       return req.user_id === currentUserId;
//     });

//     setFilteredRequests(userRequests);
//   } else if (currentUserId && filteredRequests.length === 0) {
//     console.log("No filtering applied - missing currentUserId or requests");
//     setFilteredRequests([]);
//   }
// }, [currentUserId]); // ✅ REMOVED 'requests' from dependencies

//   const validateAndFilter = () => {
//     // 🟡 1. Basic validation checks
//     if (!fromDate && !toDate && !selectedStatus) {
//       setIsFilterValidationPopupOpen(true);
//       return;
//     }

//     if (!fromDate && toDate) {
//       setDateError("Please select From Date.");
//       return;
//     }

//     if (fromDate && toDate && new Date(toDate) < new Date(fromDate)) {
//       setDateError("To Date cannot be earlier than From Date.");
//       return;
//     }

//     // Clear any previous errors
//     setDateError("");

//     // 🟡 2. Start with current user's requests
//     let filtered = requests.filter((req) => req.user_id === currentUserId);

//     console.log("After user filter:", filtered.length);

//     // DATE FILTER
//     if (fromDate) {
//       const beforeDateFilter = filtered.length;

//       filtered = filtered.filter((request) => {
//         const requestTimeSlots = userTimeSlots.filter(
//           (uts) => uts.instance_request_id === request.id
//         );

//         // ✅ NEW: If no timeslots exist, check if request has date info directly
//         if (requestTimeSlots.length === 0) {
//           // Check if the request itself has a date field
//           // Replace 'selected_date' with your actual field name (e.g., 'date', 'request_date', 'created_at', etc.)
//           if (!request.selected_date) {
//             return false;
//           }

//           // Filter by the request's date field
//           const requestDate = new Date(request.selected_date);
//           const requestDateOnly = new Date(
//             requestDate.getFullYear(),
//             requestDate.getMonth(),
//             requestDate.getDate()
//           );

//           const fromDateOnly = new Date(fromDate);
//           fromDateOnly.setHours(0, 0, 0, 0);
//           const fromDateOnlyNormalized = new Date(
//             fromDateOnly.getFullYear(),
//             fromDateOnly.getMonth(),
//             fromDateOnly.getDate()
//           );

//           if (!toDate) {
//             return requestDateOnly >= fromDateOnlyNormalized;
//           }

//           const toDateOnly = new Date(toDate);
//           toDateOnly.setHours(23, 59, 59, 999);
//           const toDateOnlyNormalized = new Date(
//             toDateOnly.getFullYear(),
//             toDateOnly.getMonth(),
//             toDateOnly.getDate()
//           );

//           return (
//             requestDateOnly >= fromDateOnlyNormalized &&
//             requestDateOnly <= toDateOnlyNormalized
//           );
//         }

//         // ✅ Existing logic for when timeslots exist
//         return requestTimeSlots.some((uts) => {
//           if (!uts.selected_date) return false;

//           const selectedDate = new Date(uts.selected_date);
//           const selectedDateOnly = new Date(
//             selectedDate.getFullYear(),
//             selectedDate.getMonth(),
//             selectedDate.getDate()
//           );

//           const fromDateOnly = new Date(fromDate);
//           fromDateOnly.setHours(0, 0, 0, 0);
//           const fromDateOnlyNormalized = new Date(
//             fromDateOnly.getFullYear(),
//             fromDateOnly.getMonth(),
//             fromDateOnly.getDate()
//           );

//           if (!toDate) {
//             return selectedDateOnly >= fromDateOnlyNormalized;
//           }

//           const toDateOnly = new Date(toDate);
//           toDateOnly.setHours(23, 59, 59, 999);
//           const toDateOnlyNormalized = new Date(
//             toDateOnly.getFullYear(),
//             toDateOnly.getMonth(),
//             toDateOnly.getDate()
//           );

//           return (
//             selectedDateOnly >= fromDateOnlyNormalized &&
//             selectedDateOnly <= toDateOnlyNormalized
//           );
//         });
//       });
//     }

//     // 🟡 4. Apply Status Filter
//     if (selectedStatus) {
//       if (selectedStatus.id !== "all") {
//         filtered = filtered.filter((request) => {
//           const requestStatusName = getStatusName(request.status_id ?? "");
//           return requestStatusName === selectedStatus.status_name;
//         });
//       } else {
//         console.log("✅ 'All' selected — showing requests of all statuses");
//       }
//     }

//     // 🟡 5. Update state
//     setFilteredRequests(filtered);
//     setCurrentPage(1);
//   };

//   // Convert yyyy-mm-dd to dd/mm/yyyy for display
//   const formatDateForDisplay = (dateString: string) => {
//     if (!dateString) return "";
//     const [year, month, day] = dateString.split("-");
//     return `${day}/${month}/${year}`;
//   };

//   // Date handlers
//   const handleFromDateChange = (value: string) => {
//     setFromDate(value);
//     if (value && dateError.includes("From Date")) {
//       setDateError("");
//     }
//   };

//   const handleToDateChange = (value: string) => {
//     setToDate(value);
//   };

//   const closeFilterValidationPopup = () => {
//     setIsFilterValidationPopupOpen(false);
//   };

//   const fetchData = useCallback(async () => {
//     try {
//       setLoading(true); // start loading
//       const [reqResult, userResult, instResult, allUserInstAssoc] =
//         await Promise.all([
//           client.models.instanceRequest.list(),
//           client.models.user.list(),
//           client.models.institute.list(),
//           client.models.userInstituteAssociation.list(),
//         ]);

//       setRequests((reqResult.data as unknown as InstanceRequest[]) || []);
//       setUsers((userResult.data as User[]) || []);
//       setInstitutes((instResult.data as Institute[]) || []);
//       // setStatus((statusResult.data as Status[]) || []);
//       setUserInstituteAssociation(allUserInstAssoc.data);
//     } catch (err) {
//       console.error("Error fetching data:", err);
//       showSnackbar("Error fetching data", "error");
//     } finally {
//       setLoading(false); // stop loading
//     }
//   }, [showSnackbar]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

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
//       } catch (error) {
//         console.error("Error fetching status:", error);
//       }
//     };

//     fetchStatus();
//   }, []);

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

//   const handleSort = (key: string) => {
//     setSortConfig((prev) => {
//       if (prev.key === key && prev.direction === "asc") {
//         return { key, direction: "desc" };
//       }
//       return { key, direction: "asc" };
//     });
//   };

//   const handleRowClick = (request: any) => {
//     // Check if the status is "Pending" before opening the popup
//     const statusName = getStatusName(request.status_id);

//     if (statusName !== "Pending") {
//       // Optionally show a message or just return without opening popup
//       // showSnackbar("Details can only be viewed for pending requests", "error");
//       // router.push(`/user/instanceaccessrequest?id=${request.id}`);
//       setIsPopupOpen(true);
//       setSelectedRequest(request);

//       // Get time details for this request
//       const timeDetails = getTimeDetailsForRequest(request.id);
//       setSelectedRequestTimeDetails(timeDetails);
//       return;
//     }

//     if (statusName == "Pending") {
//       // Optionally show a message or just return without opening popup
//       // showSnackbar("Details can only be viewed for pending requests", "error");
//       router.push(`/user/instanceaccessrequest?id=${request.id}`);
//       return;
//     }

//     // setSelectedRequest(request);

//     // // Get time details for this request
//     // const timeDetails = getTimeDetailsForRequest(request.id);
//     // setSelectedRequestTimeDetails(timeDetails);

//     //

//     // setIsPopupOpen(true);
//   };

//   const closePopup = () => {
//     setIsPopupOpen(false);
//     setSelectedRequest(null);
//     setSelectedRequestTimeDetails(null); // Clear time details
//   };

//   // Helper functions
//   const getStatusName = (statusId: string): string => {
//     const statusItem = status.find((s) => s.id === statusId);
//     return statusItem?.status_name || "Unknown Status";
//   };

//   // Get user object
//   const getUser = (userId: string) => {
//     return users.find((u) => u.id === userId);
//   };

//   const getUserName = (userId: string): string => {
//     if (!userId) return "Not Assigned";
//     const user = users.find((u) => u.id === userId);
//     if (!user) return `Unknown User (${userId})`;
//     const fullName = `${user.firstname ?? ""} ${user.lastname ?? ""}`.trim();
//     return fullName || "No Name";
//   };

//   const getInstituteName = (userId: string): string => {
//     if (!userId) return "Not Assigned";

//     // Find the association for the user
//     const association = userInstituteAssociation.find(
//       (assoc) => assoc.user_id === userId && assoc.is_reg_institute === true
//     );

//     if (!association) return "No Registered Institute";

//     // Try to get institute name if relation is populated
//     if (association.institute && association.institute.institute_name) {
//       return association.institute.institute_name;
//     }

//     // Fallback: find institute by ID (if not auto-populated)
//     const institute = institutes.find(
//       (inst) => inst.id === association.institute_id
//     );

//     return institute
//       ? institute.institute_name || "No Name"
//       : "Unknown Institute";
//   };

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

//   // Get count of users "in line" - requests with same status and same date
//  const getUsersInLineCount = (currentRequest: InstanceRequest): number => {
//   try {
//     // Get the status name for the current request
//     const currentStatusName = getStatusName(currentRequest.status_id);

//     // Only calculate if status is "Pending" or "Approved-Functional"
//     if (currentStatusName !== "Pending" && currentStatusName !== "Approved-Functional") {
//       return 0; // or return null if you don't want to display anything
//     }

//     // Get time slots for the current request
//     const currentRequestTimeSlots = userTimeSlots.filter(
//       (uts) => uts.instance_request_id === currentRequest.id
//     );

//     if (currentRequestTimeSlots.length === 0) {
//       // If no time slots, just count requests with same status
//       return requests.filter(
//         (req) => getStatusName(req.status_id) === currentStatusName
//       ).length;
//     }

//     // Create a set of date-time combinations for the current request
//     const currentDateTimes = new Set(
//       currentRequestTimeSlots.map(
//         (uts) => `${uts.selected_date}_${uts.time_slot_id}`
//       )
//     );

//     // Count requests that have the same status AND overlapping time slots
//     const count = requests.filter((req) => {
//       // Check if status matches
//       if (getStatusName(req.status_id) !== currentStatusName) {
//         return false;
//       }

//       // Get time slots for this request
//       const reqTimeSlots = userTimeSlots.filter(
//         (uts) => uts.instance_request_id === req.id
//       );

//       // Check if any time slot overlaps
//       return reqTimeSlots.some((uts) => {
//         const dateTime = `${uts.selected_date}_${uts.time_slot_id}`;
//         return currentDateTimes.has(dateTime);
//       });
//     }).length;

//     return count;
//   } catch (error) {
//     console.error("Error calculating users in line:", error);
//     return 0;
//   }
// };

//   if (authLoading) {
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
//           User Dashboard
//         </h2>

//         {/* Search Filters */}
//         {/* Search Filters */}
//         <div className="mb-2">
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
//                     text-gray-700 bg-gray-100 hover:bg-gray-200 hover:border-black
//                     focus-within:outline-none focus-within:ring-2 focus-within:ring-lime-500 focus-within:border-transparent 
//                     cursor-pointer flex items-center justify-between
//                     ${dateError ? "border-red-300" : ""}`}
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
//                     text-gray-700 bg-gray-100 hover:bg-gray-200 hover:border-black
//                     focus-within:outline-none focus-within:ring-2 focus-within:ring-lime-500 focus-within:border-transparent 
//                     cursor-pointer flex items-center justify-between
//                     ${dateError ? "border-red-300" : ""}`}
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
//                      ${selectedStatus ? "text-xs -top-2 px-1" : "top-1/2 -translate-y-1/2 text-sm"}
//                      ${selectedStatus ? "text-[#5A8F00] font-medium" : "text-gray-500"}
//                    `}
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
//                               rounded-sm text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 hover:border-black
//                               focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent truncate"
//                   >
//                     <span className="truncate mr-2">
//                       {selectedStatus ? selectedStatus.status_name : ""}
//                     </span>
//                     <ChevronDown className="w-4 h-4 text-gray-700 flex-shrink-0 cursor-pointer" />
//                   </Listbox.Button>

//                   <Listbox.Options
//                     className="absolute mt-1 w-full min-w-max bg-white border border-lime-200 rounded-sm shadow-lg z-30
//                               focus:outline-none focus:border-none"
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

//             {/* Request Instance Button - Now aligned with other elements */}
//             <button
//               onClick={handleRequestInstanceClick}
//               className="px-6 py-2 bg-lime-500 text-white rounded-sm font-semibold hover:bg-lime-600 transition-colors ml-auto cursor-pointer flex-shrink-0"
//             >
//               Request Instance
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
//         <div className="bg-white rounded-lg shadow-sm">
//           <div className="overflow-x-auto overflow-hidden">
//             <table className="w-full">
//               <thead className="bg-lime-500 text-white">
//                 <tr>
//                   {[
//                     { key: "id", label: "Request Id" },
//                     { key: "user_id", label: "User Name" },
//                     { key: "status_id", label: "Institute Name" },
//                     { key: "createdAt", label: "Requested Date/Time" },
//                     { key: "work_description", label: "Description" },
//                     { key: "status", label: "Status" },
//                     { key: "remarks", label: "Remarks" },
//                     { key: "", label: "Users in Line" },
//                     { key: "actions", label: "Actions" },
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
//                 {loading ? (
//                   <tr>
//                     <td colSpan={9} className="text-center py-6">
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
//                       key={request.id || index}
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
//                               <div className="min-w-[200px] max-w-[400px] w-max max-h-15 overflow-y-auto pt-1 px-2 whitespace-normal break-word">
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
//                                                 {date} /  {formatTimeRanges(times)}
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

//                       {/* Remarks */}
//                       <td className="px-4 py-4 text-sm text-gray-700">
//                         {request.remarks || ""}
//                       </td>

//                       {/* Users in line - placeholder */}
//                       {/* <td className="px-4 py-4 text-sm text-center">{request.date_time}</td> */}
//                       <td className="px-4 py-4 text-sm">
//                         <div className="relative group">
//                           {getUsersInLineCount(request)}
//                           {/* {getAccessStatusNumber(request.status_id, request.date_time)} */}
//                           {/* <div className="absolute left-0 bottom-1/2 -translate-y-1/2 mr-2 hidden group-hover:block bg-white border border-lime-500 rounded-lg shadow-md px-3 py-2 text-center whitespace-nowrap z-50 min-w-max">
//                             <div className="text-sm font-medium text-gray-900">
//                               {getStatusName(request.status_id)}
//                             </div>
//                           </div> */}
//                         </div>
//                       </td>

//                       {/* Actions Column - Delete Button for Pending Status */}
//                       <td className="px-4 py-4 text-sm text-center">
//                         {getStatusName(request.status_id) === "Pending" && (
//                           <button
//                             onClick={(e) => handleDeleteClick(e, request)}
//                             className="text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-colors cursor-pointer"
//                           >
//                             <Trash2 className="w-5 h-5" />
//                           </button>
//                         )}
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination Footer */}
//           <div className="bg-lime-500 px-6 py-2 flex justify-end items-center">
//             <div className="flex items-center space-x-2">
//               <span className="text-white text-sm font-medium">
//                 Rows per page:
//               </span>
//               <div className="relative">
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
//                 <ChevronDown className="w-4 h-4 text-white absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
//               </div>
//             </div>

//             <div className="flex items-center space-x-4">
//               <span className="text-white text-sm font-medium">
//                 {sortedRequests.length === 0
//                   ? "0–0 of 0"
//                   : `${requestRangeStart}–${requestRangeEnd} of ${sortedRequests.length}`}
//               </span>

//               <div className="flex items-center space-x-3">
//                 <ChevronLeft
//                   onClick={() =>
//                     currentPage > 1 && setCurrentPage((p) => p - 1)
//                   }
//                   className={`w-5 h-5 cursor-pointer 
//                     ${currentPage === 1 ? "text-white opacity-50 cursor-not-allowed" : "text-white hover:text-gray-200"}`}
//                 />

//                 <ChevronRight
//                   onClick={() =>
//                     currentPage < totalPages && setCurrentPage((p) => p + 1)
//                   }
//                   className={`w-5 h-5 cursor-pointer 
//                     ${currentPage === totalPages ? "text-white opacity-50 cursor-not-allowed" : "text-white hover:text-gray-200"}`}
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

//       {/* Delete Confirmation Popup */}
//       {isDeletePopupOpen && requestToDelete && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-md shadow-md w-full max-w-sm mx-4">
//             <div className="p-6 text-center">
//               <h3 className="text-base font-medium text-lime-600 mb-4">
//                 Are you sure you want to delete this request ID(
//                 {requestToDelete.id})?
//               </h3>

//               <div className="flex justify-center gap-2">
//                 <button
//                   onClick={handleDeleteConfirm}
//                   className="bg-lime-600 text-white px-4 py-1 rounded-sm text-sm font-semibold hover:bg-lime-700 cursor-pointer"
//                 >
//                   Yes
//                 </button>
//                 <button
//                   onClick={closeDeletePopup}
//                   className="bg-lime-600 text-white px-4 py-1 rounded-sm text-sm font-semibold hover:bg-lime-700 cursor-pointer"
//                 >
//                   No
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Snackbar */}
//       {snackbar.show && (
//         <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[70]">
//           <div
//             className={`px-6 py-3 rounded-lg shadow-lg text-white text-sm font-medium ${
//               snackbar.type === "success" ? "bg-[#76B900]" : "bg-red-500"
//             }`}
//           >
//             {snackbar.message}
//           </div>
//         </div>
//       )}

//       {/* Request Details Popup Modal */}
//       {isPopupOpen && selectedRequest && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 relative max-h-[90vh] flex flex-col">
//             <div className="text-center py-4 border-b border-gray-400">
//               <h3 className="text-xl font-semibold text-gray-800">
//                 Instance Request Details
//               </h3>
//             </div>

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
//                   <h4 className="text-md font-semibold text-gray-800">
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
//                     ...(getStatusName(selectedRequest.status_id) === "Approved-Technical"
//   ? [
//       {
//         label: "User ID",
//         value: selectedRequest.login_id || "",
//       },
//       {
//         label: "Password",
//         value: selectedRequest.password || "",
//       },
    

//            {
//   label: "Access Link",
//   value: (
//     <a
//       href={`http://${"45.120.59.148:32243"}`}
//       target="_blank"
//       rel="noopener noreferrer"
//       className="text-blue-600 underline hover:text-blue-800"
//     >
//       45.120.59.148:32243
//     </a>
//   ),
// },
//       ...(selectedRequest.additional_information
//         ? [
//             {
//               label: "Additional Information",
//               value: selectedRequest.additional_information,
//             },
//           ]
//         : []),

//     ]
//   : []),
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
//                   <h4 className="text-md font-semibold text-gray-800">
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
//                       value: getCpuName(selectedRequest.cpu_id),
//                     },
//                     {
//                       label: "Requested RAM in GB",
//                       value: getRamName(selectedRequest.ram_id),
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

//                       {
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

//             <div className="flex justify-center gap-3 py-4 border-t border-gray-400">
//               <button
//                 onClick={closePopup}
//                 className="bg-lime-500 text-white py-2 px-6 rounded hover:bg-lime-600 transition-colors text-sm font-medium cursor-pointer font-semibold"
//               >
//                 OK
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DGXDashboard;