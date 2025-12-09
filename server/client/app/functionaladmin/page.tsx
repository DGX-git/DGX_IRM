"use client";
import React, { useState, useEffect, useMemo, Suspense } from "react";
import {
  ChevronDown,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Info } from "lucide-react";
import Header from "@/app/navbar/page"; // Adjust the import path as necessary
import { Listbox } from "@headlessui/react";
import { sendRejectionEmail } from "@/utils/email";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { log } from "console";

// Define proper types that match the database schema
interface Department {
  department_id: number;
  department_name: string | null;
  institute_id: number | null;
}

interface UserType {
  user_type_id: number;
  user_type: string | null;
}

interface CPU {
  cpu_id: number;
  number_of_cpu: number | null;
}

interface RAM {
  ram_id: number;
  ram: number | null;
}

interface GPUPartition {
  gpu_partition_id: number;
  gpu_partition: string | null;
}

interface GPU {
  gpu_id: number;
  gpu_vendor: string | null;
}

interface Image {
  image_id: number;
  image_name: string | null;
}

interface User {
  user_id: number;
  first_name?: string | null;
  last_name?: string | null;
  email_id?: string | null;
  role_id?: number | null;
  contact_no?: string | null;
  created_timestamp?: string;
  updated_timestamp?: string;
  created_by?: number | null;
  updated_by?: number | null;
}

interface Institute {
  institute_id: number | string;
  institute_name: string | null;
}

interface Status {
  status_id: number | string;
  status_name: string | null;
}

interface TimeSlot {
  time_slot_id: number;
  time_slot: string | null;
}

interface UserTimeSlot {
  user_time_slot_id: number;
  instance_request_id: number;
  time_slot_id: number;
  selected_date: string;
  created_timestamp?: string;
  updated_timestamp?: string;
  created_by?: number | null;
  updated_by?: number | null;
}

interface InstanceRequest {
  instance_request_id: number;
  user_id: number;
  remarks?: string | null;
  image_id: number;
  cpu_id: number;
  gpu_id: number;
  gpu_partition_id: number;
  ram_id: number;
  work_description?: string | null;
  status_id?: number | null;
  storage_volume?: number | null;
  user_type_id: number;
  login_id?: string | null;
  password?: string | null;
  access_link?: string | null;
  is_access_granted?: boolean | null;
  additional_information?: string | null;
  created_timestamp?: string;
  updated_timestamp?: string;
  created_by?: number | null;
  updated_by?: number | null;
  selected_date?: string | null; // For compatibility
}

interface UserInstituteAssociation {
  user_institute_association_id: number;
  user_id: number;
  institute_id: number;
  department_id?: number | null;
  is_reg_institute?: boolean | null;
  created_timestamp?: string;
  updated_timestamp?: string;
  created_by?: number | null;
  updated_by?: number | null;
}

interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

function DGXDashboard() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
  const [status, setStatus] = useState<Status[]>([]);
  const [requests, setRequests] = useState<InstanceRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<InstanceRequest[]>(
    []
  );
  const [users, setUsers] = useState<User[]>([]);
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateError, setDateError] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "created_timestamp",
    direction: "desc",
  });

  // Popup state
  const [selectedRequest, setSelectedRequest] =
    useState<InstanceRequest | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Filter validation popup state
  const [isFilterValidationPopupOpen, setIsFilterValidationPopupOpen] =
    useState(false);

  // Confirmation popup state
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<
    "approve" | "reject" | null
  >(null);

  // Remarks modal state
  const [isRemarksModalOpen, setIsRemarksModalOpen] = useState(false);
  const [remarksText, setRemarksText] = useState("");
  const [loading, setLoading] = useState(false);

  // Email sending state
  const [isEmailSending, setIsEmailSending] = useState(false);

  // Time slots and date/time details
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [userTimeSlots, setUserTimeSlots] = useState<UserTimeSlot[]>([]);
  const [selectedRequestTimeDetails, setSelectedRequestTimeDetails] =
    useState<any>(null);
  const [remarksError, setRemarksError] = useState("");

  // Snackbar state
  const [snackbar, setSnackbar] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  const [departments, setDepartments] = useState<Department[]>([]);
  const [userTypes, setUserTypes] = useState<UserType[]>([]);
  const [cpuList, setCpuList] = useState<CPU[]>([]);
  const [ramList, setRamList] = useState<RAM[]>([]);
  const [gpuPartitions, setGpuPartitions] = useState<GPUPartition[]>([]);
  const [gpuVendors, setGpuVendors] = useState<GPU[]>([]);
  const [imageList, setImageList] = useState<Image[]>([]);
  const [userInstituteAssociation, setUserInstituteAssociation] = useState<
    UserInstituteAssociation[]
  >([]);
  const [userInstitutes, setUserInstitutes] = useState<Institute[]>([]);
  const [selectedInstitute, setSelectedInstitute] = useState<Institute | null>(
    null
  );
  const [currentFilteredInstitute, setCurrentFilteredInstitute] =
    useState<Institute | null>(null);
  const [areFiltersApplied, setAreFiltersApplied] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  const admin = "Functional";

  const searchParams = useSearchParams();
  const loggedInUserId = searchParams.get("userId") || "";
  const loggedInUserName = decodeURIComponent(
    searchParams.get("userName") || ""
  );

  // Fetch user's institutes from Supabase
  useEffect(() => {
    const fetchInstitutes = async () => {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_DGX_API_URL +
            "/technicaladmin//user-institutes/" +
            loggedInUserId, // direct URL
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        console.log("Fetched institutes:", data);

        if (!data || data.length === 0) return;

        const allOption = { institute_id: "all", institute_name: "All" };
        const updatedList = [allOption, ...data];

        setUserInstitutes(updatedList);
        setSelectedInstitute(allOption);
      } catch (error) {
        console.error("Error fetching institutes:", error);
      }
    };

    fetchInstitutes();
  }, [loggedInUserId]);

  // Update this useEffect to reapply filters when requests change
  useEffect(() => {
    if (areFiltersApplied) {
      reapplyCurrentFilters();
    } else {
      setFilteredRequests(requests);
    }
  }, [requests]);

  // Fetch time slots and user time slots
  const fetchTimeData = async () => {
    try {
      // Fetch time slots
      const timeSlotRes = await fetch(
        process.env.NEXT_PUBLIC_DGX_API_URL + "/technicaladmin/time-slots"
      );
      const timeSlotsData = await timeSlotRes.json();

      // Fetch user time slots
      const userTimeSlotRes = await fetch(
        process.env.NEXT_PUBLIC_DGX_API_URL + "/technicaladmin/user-time-slots"
      );
      const userTimeSlotsData = await userTimeSlotRes.json();

      setTimeSlots(timeSlotsData || []);
      setUserTimeSlots(userTimeSlotsData || []);
    } catch (err) {
      console.error("Error fetching time data:", err);
    }
  };

  useEffect(() => {
    fetchTimeData();
  }, []);

  // Function to get time details for a specific request
  const getTimeDetailsForRequest = (instanceRequestId: number) => {
    try {
      const allUserTimeSlotsForRequest = userTimeSlots.filter(
        (uts) => uts.instance_request_id === instanceRequestId
      );

      // Fallback: find instanceRequest for this ID
      const relatedRequest = requests.find(
        (req) => req.instance_request_id === instanceRequestId
      );

      // Case 1: No user time slots found — fallback to instanceRequest date
      if (
        !allUserTimeSlotsForRequest ||
        allUserTimeSlotsForRequest.length === 0
      ) {
        const fallbackDate = relatedRequest?.selected_date;

        if (fallbackDate) {
          const formattedFallbackDate = new Date(
            fallbackDate
          ).toLocaleDateString("en-GB");
          return {
            date: "1 date selected",
            time: "No time slots",
            formatted: `${formattedFallbackDate.replace(
              /\//g,
              "-"
            )} / No time slots`,
          };
        }

        return {
          date: "No date available",
          time: "No time available",
          formatted: "Date and time not available",
        };
      }

      // Group slots by date
      const groupedDetails: Record<string, string[]> = {};

      for (const userTimeSlot of allUserTimeSlotsForRequest) {
        const timeSlotId = userTimeSlot.time_slot_id;
        const timeSlot = timeSlots.find((ts) => ts.time_slot_id === timeSlotId);
        const date = userTimeSlot.selected_date;
        const timeSlotValue = timeSlot ? timeSlot.time_slot : "Time not found";

        if (date) {
          const formattedDate = new Date(date).toLocaleDateString("en-GB");

          if (!groupedDetails[formattedDate]) {
            groupedDetails[formattedDate] = [];
          }
          groupedDetails[formattedDate].push(timeSlotValue || "");
        }
      }

      // Sort dates ascending
      const sortedDates = Object.keys(groupedDetails).sort((a, b) => {
        const [dayA, monthA, yearA] = a.split("/").map(Number);
        const [dayB, monthB, yearB] = b.split("/").map(Number);
        return (
          new Date(yearA, monthA - 1, dayA).getTime() -
          new Date(yearB, monthB - 1, dayB).getTime()
        );
      });

      // Helpers
      const extractStartTime = (timeSlotStr: string): string => {
        if (!timeSlotStr) return "";
        if (timeSlotStr.includes("-")) return timeSlotStr.split("-")[0].trim();
        if (timeSlotStr.includes(" to "))
          return timeSlotStr.split(" to ")[0].trim();
        return timeSlotStr.trim();
      };

      const timeToMinutes = (timeStr: string): number => {
        const cleanTime = extractStartTime(timeStr);
        const [hours, minutes] = cleanTime.split(":").map(Number);
        return hours * 60 + minutes;
      };

      const formatTimeRanges = (times: string[]): string => {
        if (times.length === 0) return "No time slots";
        const timeObjects = times
          .map((time) => ({
            original: extractStartTime(time),
            minutes: timeToMinutes(time),
          }))
          .sort((a, b) => a.minutes - b.minutes);

        const ranges: string[] = [];
        let currentRangeStart = timeObjects[0];
        let currentRangeEnd = timeObjects[0];

        for (let i = 1; i < timeObjects.length; i++) {
          const currentTime = timeObjects[i];
          if (currentTime.minutes - currentRangeEnd.minutes === 30) {
            currentRangeEnd = currentTime;
          } else {
            ranges.push(
              currentRangeStart.minutes === currentRangeEnd.minutes
                ? currentRangeStart.original
                : `${currentRangeStart.original} - ${currentRangeEnd.original}`
            );
            currentRangeStart = currentTime;
            currentRangeEnd = currentTime;
          }
        }

        ranges.push(
          currentRangeStart.minutes === currentRangeEnd.minutes
            ? currentRangeStart.original
            : `${currentRangeStart.original} - ${currentRangeEnd.original}`
        );

        return ranges.join(" , ");
      };

      // Build formatted output
      let formattedOutput = "";

      for (let i = 0; i < sortedDates.length; i++) {
        const date = sortedDates[i];
        const times = groupedDetails[date];

        const formattedDate = date.replace(/\//g, "-");
        const formattedTimeRanges =
          times && times.length > 0 ? formatTimeRanges(times) : "No time slots";

        formattedOutput += `${formattedDate}\n[${formattedTimeRanges}]`;
        if (i < sortedDates.length - 1) formattedOutput += "\n";
      }

      return {
        date: `${sortedDates.length} date${
          sortedDates.length > 1 ? "s" : ""
        } selected`,
        time: "Multiple time slots",
        formatted: formattedOutput,
      };
    } catch (err) {
      console.error("Error in getTimeDetailsForRequest:", err);
      return {
        date: "Error",
        time: "Error",
        formatted: "Unable to load date/time",
      };
    }
  };

  // Fetch master tables
  useEffect(() => {
    const fetchMasters = async () => {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_DGX_API_URL + "/technicaladmin/masters"
        );
        const data = await response.json();

        setDepartments(data.departments || []);
        setUserTypes(data.userTypes || []);
        setCpuList(data.cpuList || []);
        setRamList(data.ramList || []);
        setGpuPartitions(data.gpuPartitions || []);
        setGpuVendors(data.gpuVendors || []);
        setImageList(data.imageList || []);
      } catch (err) {
        console.error("Error fetching master tables", err);
      }
    };

    fetchMasters();
  }, []);

  // Helper functions
  const getDepartmentName = (userId: number): string => {
    if (!userId) return "Not Assigned";

    const user = users.find((u) => u.user_id === userId);
    if (!user) return `Unknown User (${userId})`;

    const association = userInstituteAssociation.find(
      (assoc) => assoc.user_id === userId
    );
    if (!association) return "No Department Assigned";

    const department = departments.find(
      (dept) => dept.department_id === association.department_id
    );

    return department?.department_name ?? "";
  };

  const getUserTypeName = (userTypeId: number) => {
    const type = userTypes.find((t) => t.user_type_id === userTypeId);
    return type?.user_type || "";
  };

  const getCpuName = (cpuId: number) => {
    const cpu = cpuList.find((c) => c.cpu_id === cpuId);
    return cpu?.number_of_cpu?.toString() || "";
  };

  const getRamName = (ramId: number) => {
    const ram = ramList.find((r) => r.ram_id === ramId);
    return ram?.ram ? `${ram.ram} GB` : "";
  };

  const getGpuPartitionName = (partitionId: number) => {
    const partition = gpuPartitions.find(
      (p) => p.gpu_partition_id === partitionId
    );
    return partition?.gpu_partition || "";
  };

  const getGpuName = (gpuId: number) => {
    const vendor = gpuVendors.find((v) => v.gpu_id === gpuId);
    return vendor?.gpu_vendor || "";
  };

  const getCustomImageName = (imageId: number) => {
    const img = imageList.find((i) => i.image_id === imageId);
    return img?.image_name || "";
  };

  // Show snackbar
  const showSnackbar = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setSnackbar({ show: true, message, type });
    setTimeout(() => {
      setSnackbar({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  // Handle from date change
  const handleFromDateChange = (value: string) => {
    setFromDate(value);
    if (value && dateError.includes("From Date")) {
      setDateError("");
    }
  };

  // Handle to date change
  const handleToDateChange = (value: string) => {
    setToDate(value);
  };

  // Close filter validation popup
  const closeFilterValidationPopup = () => {
    setIsFilterValidationPopupOpen(false);
  };

  const sortedRequests = useMemo(() => {
    let sortable = [...filteredRequests];

    if (
      !sortConfig.key ||
      sortConfig.key === "instance_request_id" ||
      sortConfig.key === "created_timestamp"
    ) {
      sortable.sort((a, b) => {
        const dateA = new Date(a.created_timestamp || 0);
        const dateB = new Date(b.created_timestamp || 0);

        if (sortConfig.direction === "desc") {
          return dateB.getTime() - dateA.getTime();
        } else {
          return dateA.getTime() - dateB.getTime();
        }
      });
    } else {
      sortable.sort((a, b) => {
        let valA, valB;

        switch (sortConfig.key) {
          case "user_name":
            valA = getUserName(a.user_id);
            valB = getUserName(b.user_id);
            break;
          case "institute_name":
            valA = getInstituteName(a.user_id);
            valB = getInstituteName(b.user_id);
            break;
          default:
            valA = (a as any)[sortConfig.key] ?? "";
            valB = (b as any)[sortConfig.key] ?? "";
        }

        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();

        if (strA < strB) return sortConfig.direction === "asc" ? -1 : 1;
        if (strA > strB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return sortable;
  }, [filteredRequests, sortConfig, users, institutes, status]);

  // Pagination logic
  const totalPages = Math.ceil(sortedRequests.length / rowsPerPage);
  const paginatedRequests = sortedRequests.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const requestRangeStart = (currentPage - 1) * rowsPerPage + 1;
  const requestRangeEnd = Math.min(
    currentPage * rowsPerPage,
    sortedRequests.length
  );

  // Handle sorting toggle
  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev.key === key && prev.direction === "asc") {
        return { key, direction: "desc" };
      }
      return { key, direction: "asc" };
    });
  };

  // Handle row click to open popup
  const handleRowClick = (request: InstanceRequest) => {
    setSelectedRequest(request);
    const timeDetails = getTimeDetailsForRequest(request.instance_request_id);
    setSelectedRequestTimeDetails(timeDetails);
    setIsPopupOpen(true);
  };

  // Close popup
  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedRequest(null);
    setSelectedRequestTimeDetails(null);
  };

  // Handle approve button click
  const handleApprove = () => {
    setIsPopupOpen(true);
    setConfirmationAction("approve");
    setIsConfirmationOpen(true);
  };

  // Handle reject button click
  const handleReject = () => {
    setIsPopupOpen(true);
    setConfirmationAction("reject");
    setIsConfirmationOpen(true);
  };

  // Close confirmation popup
  const closeConfirmation = () => {
    setIsConfirmationOpen(false);
    setConfirmationAction(null);
  };

  // Close remarks modal
  const closeRemarksModal = () => {
    setIsRemarksModalOpen(false);
    setRemarksText("");
    setRemarksError("");
    setIsConfirmationOpen(true);
  };

  const handleConfirmationYes = async () => {
    if (!selectedRequest || !confirmationAction) return;

    // If rejecting, open remarks modal
    if (confirmationAction === "reject") {
      setIsConfirmationOpen(false);
      setIsRemarksModalOpen(true);
      return;
    }

    try {
      // Call backend API
      const response = await fetch(
        process.env.NEXT_PUBLIC_DGX_API_URL +
          "/functionaladmin/approve-functional",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            //   instance_request_id: selectedRequest.instance_request_id,
            //   updated_by: loggedInUserId,
            instance_request_id: Number(selectedRequest.instance_request_id),
            //   updated_by: Number(loggedInUserId),
            updated_by: loggedInUserId,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        showSnackbar(result.message || "Error approving request", "error");
        return;
      }

      const newStatusId = result.data.status_id;

      // Update local state
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.instance_request_id === selectedRequest.instance_request_id
            ? { ...req, status_id: newStatusId }
            : req
        )
      );

      setFilteredRequests((prevFiltered) =>
        prevFiltered.map((req) =>
          req.instance_request_id === selectedRequest.instance_request_id
            ? { ...req, status_id: newStatusId }
            : req
        )
      );

      closeConfirmation();
      setSelectedRequest(null);
      showSnackbar("Request approved successfully!", "success");
      fetchData();
    } catch (error) {
      console.error("Error approving request:", error);
      showSnackbar("Error approving request. Please try again.", "error");
    }
  };

  // Handle remarks submit (for reject) with email functionality
  const handleRemarksSubmit = async () => {
    if (!selectedRequest || !remarksText.trim()) {
      setRemarksError("Please enter remarks before submitting.");
      return;
    }

    try {
      setIsEmailSending(true);

      const rejectedStatus = status.find((s) => s.status_name === "Rejected");
      if (!rejectedStatus) {
        setRemarksError("Error: Rejected status not found");
        setIsEmailSending(false);
        return;
      }

      const newStatusId = Number(rejectedStatus.status_id);

      // 1️⃣ CALL BACKEND API
      const res = await fetch(
        process.env.NEXT_PUBLIC_DGX_API_URL + "/functionaladmin/reject-request",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            instance_request_id: selectedRequest.instance_request_id,
            remarks: remarksText.trim(),
            new_status_id: newStatusId,
            // logged_in_user_id: Number(loggedInUserId),
            logged_in_user_id: loggedInUserId,
          }),
        }
      );

      const result = await res.json();

      if (!result.success) {
        setRemarksError(result.message);
        setIsEmailSending(false);
        return;
      }

      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.instance_request_id === selectedRequest.instance_request_id
            ? {
                ...req,
                status_id: newStatusId,
                remarks: remarksText.trim(),
              }
            : req
        )
      );

      setFilteredRequests((prevFiltered) =>
        prevFiltered.map((req) =>
          req.instance_request_id === selectedRequest.instance_request_id
            ? {
                ...req,
                status_id: newStatusId,
                remarks: remarksText.trim(),
              }
            : req
        )
      );

      setIsEmailSending(false);
      closeRemarksModal();
      setSelectedRequest(null);
      setConfirmationAction(null);
      setIsConfirmationOpen(false);
      showSnackbar("Request rejected successfully!", "success");
      fetchData();

      // Send email asynchronously
      const timeDetails = getTimeDetailsForRequest(
        selectedRequest.instance_request_id
      );
      const userDetails = users.find(
        (u) => u.user_id === selectedRequest.user_id
      );

      const emailData = {
        ...selectedRequest,
        id: selectedRequest.instance_request_id, // ✅ ADD THIS LINE
        admin,
        loggedInUserName,
        user: userDetails,
        date_time: timeDetails.formatted,
        userTypeName: getUserTypeName(selectedRequest.user_type_id),
        customImageName: getCustomImageName(selectedRequest.image_id),
        cpuName: getCpuName(selectedRequest.cpu_id),
        ramName: getRamName(selectedRequest.ram_id),
        gpuPartitionName: getGpuPartitionName(selectedRequest.gpu_partition_id),
        gpuVendorName: getGpuName(selectedRequest.gpu_id),
      };

      sendRejectionEmail(emailData, remarksText.trim()).catch((emailError) => {
        console.error("Error sending rejection email:", emailError);
        setTimeout(() => {
          showSnackbar(
            "Note: There was an issue sending the notification email.",
            "error"
          );
        }, 2000);
      });
    } catch (error) {
      console.error(`Error rejecting request:`, error);
      setRemarksError("Error rejecting request. Please try again.");
      setIsEmailSending(false);
    }
  };

  // Get status name by ID
  const getStatusName = (statusId: number): string => {
    const statusItem = status.find((s) => s.status_id === statusId);
    return statusItem?.status_name || "Unknown Status";
  };

  // Get user object
  const getUser = (userId: number): User | undefined => {
    return users.find((u) => u.user_id === userId);
  };

  // Fetch status from Supabase
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_DGX_API_URL + "/technicaladmin/status", // direct URL
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        if (!data || data.length === 0) return;

        // Add "All" option
        const allOption = { status_id: "all", status_name: "All" };
        const updatedStatusList = [allOption, ...data];

        setStatus(updatedStatusList);
        setSelectedStatus(allOption);
      } catch (error) {
        console.error("Error fetching status:", error);
      }
    };

    fetchStatus();
  }, []);

  // Replace your existing fetchData function with this:

  const fetchData = async () => {
    try {
      setLoading(true);

      const [userRes, assocRes, instRes] = await Promise.all([
        fetch(process.env.NEXT_PUBLIC_DGX_API_URL + "/technicaladmin/users"),
        fetch(
          process.env.NEXT_PUBLIC_DGX_API_URL + "/technicaladmin/associations"
        ),
        fetch(
          process.env.NEXT_PUBLIC_DGX_API_URL + "/technicaladmin/institutes"
        ),
      ]);

      const users = await userRes.json();
      const associations = await assocRes.json();
      const institutes = await instRes.json();

      setUsers(users);
      setUserInstituteAssociation(associations);
      setInstitutes(institutes);

      const body = {
        logged_in_user_id: loggedInUserId,
        from_date_param: null,
        to_date_param: null,
        status_id_param: null,
        institute_id_param:
          selectedInstitute?.institute_id === "all"
            ? null
            : selectedInstitute?.institute_id || null,
      };

      const reqRes = await fetch(
        process.env.NEXT_PUBLIC_DGX_API_URL +
          "/technicaladmin/filtered-requests",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const requests = await reqRes.json();

      // ✅ Ensure it's always an array
      const requestsArray = Array.isArray(requests) ? requests : [];
      setRequests(requestsArray);
      console.log("Fetched requests:", requestsArray);
      setFilteredRequests(requestsArray); // ✅ Add this line
    } catch (error) {
      console.error("Error fetching data:", error);
      showSnackbar("Error fetching data.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [loggedInUserId]);

  // Replace your validateAndFilter function with this:

  const validateAndFilter = async () => {
    if (!fromDate && !toDate && !selectedStatus && !selectedInstitute) {
      setIsFilterValidationPopupOpen(true);
      return;
    }

    if (!fromDate && toDate) {
      setDateError("Please select From Date.");
      return;
    }

    if (fromDate && toDate && new Date(toDate) < new Date(fromDate)) {
      setDateError("To Date cannot be earlier than From Date.");
      return;
    }

    setDateError("");

    try {
      setLoading(true);

      const body = {
        logged_in_user_id: loggedInUserId,
        from_date_param: fromDate || null,
        to_date_param: toDate || null,
        status_id_param:
          selectedStatus?.status_id === "all"
            ? null
            : selectedStatus?.status_id,
        institute_id_param:
          selectedInstitute?.institute_id === "all"
            ? null
            : selectedInstitute?.institute_id,
      };

      const response = await fetch(
        process.env.NEXT_PUBLIC_DGX_API_URL +
          "/technicaladmin/filtered-requests",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const filtered = await response.json();

      // ✅ Ensure it's always an array
      const filteredArray = Array.isArray(filtered) ? filtered : [];
      setFilteredRequests(filteredArray);
      setCurrentPage(1);
      setCurrentFilteredInstitute(selectedInstitute);
      setAreFiltersApplied(true);
    } catch (error) {
      console.error("❌ Error filtering data:", error);
      showSnackbar("Error filtering data. Please try again.", "error");
      setFilteredRequests([]);
    } finally {
      setLoading(false);
    }
  };

  // Update reapplyCurrentFilters to use the function:

  const reapplyCurrentFilters = async () => {
    if (!areFiltersApplied) {
      setFilteredRequests(requests);
      return;
    }

    try {
      const body = {
        logged_in_user_id: loggedInUserId,
        from_date_param: fromDate || null,
        to_date_param: toDate || null,
        status_id_param:
          selectedStatus?.status_id === "all"
            ? null
            : selectedStatus?.status_id,
        institute_id_param:
          selectedInstitute?.institute_id === "all"
            ? null
            : selectedInstitute?.institute_id,
      };

      const response = await fetch(
        process.env.NEXT_PUBLIC_DGX_API_URL +
          "/technicaladmin/filtered-requests",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const filtered = await response.json();
      // ✅ Ensure it's always an array
      const filteredArray = Array.isArray(filtered) ? filtered : [];
      setFilteredRequests(filteredArray);
    } catch (error) {
      console.error("❌ Error reapplying filters:", error);
      setFilteredRequests([]);
    }
  };

  // Get Full User Name
  const getUserName = (userId: number): string => {
    if (!userId) return "";

    const user = users.find((u) => u.user_id === userId);
    if (!user) return `Unknown User (${userId})`;

    const first = user.first_name?.trim() ?? "";
    const last = user.last_name?.trim() ?? "";

    const fullName = `${first} ${last}`.trim();
    return fullName || "No Name";
  };

  // Get Institute Name (Based on user_id)
  const getInstituteName = (userId: number): string => {
    if (!userId) return "Not Assigned";

    const user = users.find((u) => u.user_id === userId);
    if (!user) return `Unknown User (${userId})`;

    // If table is filtered by a specific institute
    if (
      currentFilteredInstitute &&
      currentFilteredInstitute.institute_id !== "all"
    ) {
      const hasAssociation = userInstituteAssociation.some(
        (assoc) =>
          assoc.user_id === userId &&
          assoc.institute_id === currentFilteredInstitute.institute_id
      );

      if (hasAssociation) {
        return currentFilteredInstitute.institute_name || "";
      }
    }

    // Otherwise → find user's first/default institute
    const association = userInstituteAssociation.find(
      (assoc) => assoc.user_id === userId
    );

    if (!association) return "No Institute Assigned";

    // Match institute details
    const institute = institutes.find(
      (inst) => inst.institute_id === association.institute_id
    );

    return (
      institute?.institute_name ??
      `Unknown Institute (${association.institute_id})`
    );
  };

  // Updated function to check status by name instead of ID
  const getAccessStatusIcon = (statusId: number) => {
    const statusName = getStatusName(statusId);

    switch (statusName) {
      case "Pending":
        return (
          <div className="w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center text-black text-xs">
            !
          </div>
        );
      case "Approved-Functional":
        return (
          <div className="w-5 h-5 rounded-full bg-orange-400 flex items-center justify-center text-white text-xs">
            ✓
          </div>
        );
      case "Approved-Technical":
        return (
          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
            ✓
          </div>
        );
      case "Rejected":
        return (
          <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
            ✕
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      <div className="p-8">
        {/* Dashboard Title */}
        <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
          Functional Admin Dashboard
        </h2>

        {/* Search Filters */}
        <div className="mb-2">
          <div className="flex gap-4 items-start flex-wrap">
            {/* Date Range */}
            <div className="flex space-x-4">
              {/* From Date */}
              <div className="relative flex items-center w-52">
                <input
                  type="date"
                  id="fromDatePicker"
                  value={fromDate}
                  onChange={(e) => handleFromDateChange(e.target.value)}
                  className="absolute opacity-0 w-full h-10 cursor-pointer pointer-events-none"
                />
                <label
                  htmlFor="fromDatePicker"
                  className={`w-full h-10 px-3 border border-gray-300 rounded-sm text-sm 
                  text-gray-700 bg-gray-100 hover:bg-gray-200 hover:border-black
                  focus-within:outline-none focus-within:ring-2 focus-within:ring-lime-500 focus-within:border-transparent 
                  cursor-pointer flex items-center justify-between
                  ${dateError ? "border-red-300" : ""}`}
                  onClick={() => {
                    const input = document.getElementById(
                      "fromDatePicker"
                    ) as HTMLInputElement;
                    input?.showPicker?.();
                  }}
                >
                  <span className="text-gray-700">
                    {fromDate ? (
                      <>
                        <span className="text-gray-500">From</span>
                        <span className="ml-3">
                          {formatDateForDisplay(fromDate)}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-gray-500">From</span>
                        <span className="text-gray-700 ml-3">dd/mm/yyyy</span>
                      </>
                    )}
                  </span>
                  <svg
                    className="w-4 h-4 text-gray-700 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </label>
              </div>

              {/* To Date */}
              <div className="relative flex items-center w-52">
                <input
                  type="date"
                  id="toDatePicker"
                  value={toDate}
                  onChange={(e) => handleToDateChange(e.target.value)}
                  className="absolute opacity-0 w-full h-10 cursor-pointer pointer-events-none"
                />
                <label
                  htmlFor="toDatePicker"
                  className={`w-full h-10 px-3 border border-gray-300 rounded-sm text-sm 
                  text-gray-700 bg-gray-100 hover:bg-gray-200 hover:border-black
                  focus-within:outline-none focus-within:ring-2 focus-within:ring-lime-500 focus-within:border-transparent 
                  cursor-pointer flex items-center justify-between
                  ${dateError ? "border-red-300" : ""}`}
                  onClick={() => {
                    const input = document.getElementById(
                      "toDatePicker"
                    ) as HTMLInputElement;
                    input?.showPicker?.();
                  }}
                >
                  <span className="text-gray-700">
                    {toDate ? (
                      <>
                        <span className="text-gray-500">To</span>
                        <span className="ml-3">
                          {formatDateForDisplay(toDate)}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-gray-500">To</span>
                        <span className="text-gray-700 ml-3">dd/mm/yyyy</span>
                      </>
                    )}
                  </span>
                  <svg
                    className="w-4 h-4 text-gray-700 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </label>
              </div>
            </div>

            {/* Status Dropdown */}
            <div className="relative w-52">
              <Listbox value={selectedStatus} onChange={setSelectedStatus}>
                <div className="relative">
                  <label
                    className={`absolute left-3 transition-all duration-200 pointer-events-none z-20
                   ${
                     selectedStatus
                       ? "text-xs -top-2 px-1"
                       : "top-1/2 -translate-y-1/2 text-sm"
                   }
                   ${
                     selectedStatus
                       ? "text-[#5A8F00] font-medium"
                       : "text-gray-500"
                   }
                 `}
                    style={{
                      backgroundColor: selectedStatus
                        ? "#ffffff"
                        : "transparent",
                    }}
                  >
                    {selectedStatus ? "Status" : "Select Status"}
                  </label>

                  <Listbox.Button
                    className="w-full h-10 flex justify-between items-center px-3 border border-gray-300
                            rounded-sm text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 hover:border-black
                            focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent truncate"
                  >
                    <span className="truncate mr-2">
                      {selectedStatus ? selectedStatus.status_name : ""}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-700 flex-shrink-0 cursor-pointer" />
                  </Listbox.Button>

                  <Listbox.Options
                    className="absolute mt-1 w-full min-w-max bg-white border border-lime-200 rounded-sm shadow-lg z-30
                            focus:outline-none focus:border-none"
                  >
                    {status.map((statusItem) => (
                      <Listbox.Option
                        key={statusItem.status_id}
                        value={statusItem}
                        className="cursor-pointer px-3 py-0.5 text-sm text-gray-700 hover:bg-gray-100 whitespace-nowrap"
                      >
                        {statusItem.status_name}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>

            {/* Institute Dropdown */}
            <div className="relative w-90">
              <Listbox
                value={selectedInstitute}
                onChange={setSelectedInstitute}
              >
                <div className="relative">
                  <label
                    className={`absolute left-3 transition-all duration-200 pointer-events-none z-20
                   ${
                     selectedInstitute
                       ? "text-xs -top-2 px-1"
                       : "top-1/2 -translate-y-1/2 text-sm"
                   }
                   ${
                     selectedInstitute
                       ? "text-[#5A8F00] font-medium"
                       : "text-gray-500"
                   }
                 `}
                    style={{
                      backgroundColor: selectedInstitute
                        ? "#ffffff"
                        : "transparent",
                    }}
                  >
                    {selectedInstitute ? "Institute" : "Select Institute"}
                  </label>

                  <Listbox.Button
                    className="w-full h-10 flex justify-between items-center px-3 border border-gray-300
                            rounded-sm text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 hover:border-black
                            focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent truncate"
                  >
                    <span className="truncate mr-2">
                      {selectedInstitute
                        ? selectedInstitute.institute_name
                        : ""}
                    </span>

                    <ChevronDown className="w-4 h-4 text-gray-700 flex-shrink-0 cursor-pointer" />
                  </Listbox.Button>

                  <Listbox.Options
                    className="absolute mt-1 w-full min-w-max bg-white border border-lime-200 rounded-sm shadow-lg z-30
                            focus:outline-none focus:border-none"
                  >
                    {userInstitutes.map((instituteItem) => (
                      <Listbox.Option
                        key={instituteItem.institute_id}
                        value={instituteItem}
                        className="cursor-pointer px-3 py-0.5 text-sm text-gray-700 hover:bg-gray-100 whitespace-nowrap"
                      >
                        {instituteItem.institute_name}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>

            {/* Filter Button */}
            <button
              onClick={validateAndFilter}
              className="flex items-center justify-center gap-2 w-24 h-10 px-3 border border-gray-300 rounded-sm text-sm 
                          text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors hover:border-black
                          focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent cursor-pointer"
            >
              <Filter className="w-4 h-4 text-gray-700 cursor-pointer" />
              Filter
            </button>
          </div>

          {/* Error Message */}
          {dateError && (
            <div className="mt-2 text-red-600 text-sm font-medium">
              {dateError}
            </div>
          )}
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="overflow-x-auto overflow-hidden">
            <table className="w-full">
              <thead className="bg-lime-500 text-white">
                <tr>
                  {[
                    { key: "instance_request_id", label: "Request Id" },
                    { key: "user_name", label: "User Name" },
                    { key: "institute_name", label: "Institute Name" },
                    { key: "created_timestamp", label: "Requested Date/Time" },
                    { key: "work_description", label: "Description" },
                    { key: "", label: "" },
                    { key: "", label: "" },
                    { key: "status", label: "Status" },
                    { key: "", label: "" },
                    { key: "remarks", label: "Remarks" },
                  ].map((col) => (
                    <th
                      key={col.key}
                      className="px-4 py-4 text-left text-sm font-semibold cursor-pointer select-none"
                      onClick={() => col.key && handleSort(col.key)}
                    >
                      {col.label}
                      {sortConfig.key === col.key && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              {loading ? (
                <tbody>
                  <tr>
                    <td colSpan={10} className="text-center py-6">
                      <div className="flex items-center justify-center space-x-3">
                        <div className="animate-spin h-5 w-5 border-2 border-lime-500 border-t-transparent rounded-full"></div>
                        <span className="text-gray-600 text-sm">
                          Loading data...
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody className="divide-y divide-gray-200">
                  {paginatedRequests.map((request, index) => (
                    <tr
                      key={request.instance_request_id}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-blue-50 cursor-pointer`}
                      onClick={() => handleRowClick(request)}
                    >
                      {/* Request ID */}
                      <td className="px-4 py-4 text-sm font-medium text-gray-700">
                        {request.instance_request_id}
                      </td>

                      {/* User Name */}
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {getUserName(request.user_id)}
                      </td>

                      {/* Institute Name */}
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {getInstituteName(request.user_id)}
                      </td>

                      {/* Requested Date */}
                      <td className="px-4 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-700">
                            {(() => {
                              const requestTimeSlots = userTimeSlots.filter(
                                (uts) =>
                                  uts.instance_request_id ===
                                  request.instance_request_id
                              );

                              if (requestTimeSlots.length === 0) {
                                return request.selected_date
                                  ? new Date(request.selected_date)
                                      .toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                      })
                                      .replace(/\//g, "-")
                                  : "No date available";
                              }

                              const formattedDates = requestTimeSlots.map(
                                (uts) => {
                                  const date = uts?.selected_date;
                                  if (!date) return "No date";
                                  const formatted = new Date(
                                    date
                                  ).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  });
                                  return formatted.replace(/\//g, "-");
                                }
                              );

                              const uniqueDates = Array.from(
                                new Set(formattedDates)
                              );

                              const sortedDates = uniqueDates.sort((a, b) => {
                                if (a === "No date" || b === "No date")
                                  return 0;
                                const [dayA, monthA, yearA] = a
                                  .split("-")
                                  .map(Number);
                                const [dayB, monthB, yearB] = b
                                  .split("-")
                                  .map(Number);
                                return (
                                  new Date(yearA, monthA - 1, dayA).getTime() -
                                  new Date(yearB, monthB - 1, dayB).getTime()
                                );
                              });

                              if (sortedDates.length > 1) {
                                return `${sortedDates[0]} - ${
                                  sortedDates[sortedDates.length - 1]
                                }`;
                              } else {
                                return sortedDates[0];
                              }
                            })()}
                          </span>

                          {/* Info icon with tooltip */}
                          <div className="relative group flex-shrink-0">
                            <Info className="w-4 h-4 text-[#76B900] cursor-pointer hover:opacity-80" />
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 hidden group-hover:block bg-white border border-lime-500 rounded-lg shadow-lg z-[100] before:content-[''] before:absolute before:-left-5 before:top-0 before:w-5 before:h-full before:bg-transparent transition-opacity duration-200">
                              <div className="min-w-[200px] max-w-[400px] w-max max-h-15 overflow-y-auto pt-1 px-2 whitespace-normal break-words">
                                <div className="text-xs text-gray-900 leading-relaxed">
                                  {(() => {
                                    const requestTimeSlots =
                                      userTimeSlots.filter(
                                        (uts) =>
                                          uts.instance_request_id ===
                                          request.instance_request_id
                                      );

                                    if (requestTimeSlots.length === 0) {
                                      return (
                                        <div className="text-center min-w-[150px]">
                                          <div className="font-medium text-gray-900">
                                            {request.selected_date
                                              ? new Date(request.selected_date)
                                                  .toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                  })
                                                  .replace(/\//g, "-")
                                              : "No date available"}
                                          </div>
                                          <div className="text-xs text-gray-600">
                                            Time Slots : N/A
                                          </div>
                                        </div>
                                      );
                                    }

                                    const groupedByDate =
                                      requestTimeSlots.reduce(
                                        (groups: any, uts) => {
                                          const dateKey = uts.selected_date
                                            ? new Date(uts.selected_date)
                                                .toLocaleDateString("en-GB", {
                                                  day: "2-digit",
                                                  month: "2-digit",
                                                  year: "numeric",
                                                })
                                                .replace(/\//g, "-")
                                            : "No date";

                                          if (!groups[dateKey]) {
                                            groups[dateKey] = [];
                                          }
                                          groups[dateKey].push(uts);
                                          return groups;
                                        },
                                        {}
                                      );

                                    const sortedDates = Object.keys(
                                      groupedByDate
                                    ).sort((a, b) => {
                                      if (a === "No date" || b === "No date")
                                        return 0;
                                      const [dayA, monthA, yearA] = a
                                        .split("-")
                                        .map(Number);
                                      const [dayB, monthB, yearB] = b
                                        .split("-")
                                        .map(Number);
                                      return (
                                        new Date(
                                          yearA,
                                          monthA - 1,
                                          dayA
                                        ).getTime() -
                                        new Date(
                                          yearB,
                                          monthB - 1,
                                          dayB
                                        ).getTime()
                                      );
                                    });

                                    const extractStartTime = (
                                      timeSlotStr: string
                                    ) => {
                                      if (!timeSlotStr) return "";
                                      if (timeSlotStr.includes("-")) {
                                        return timeSlotStr.split("-")[0].trim();
                                      } else if (timeSlotStr.includes(" to ")) {
                                        return timeSlotStr
                                          .split(" to ")[0]
                                          .trim();
                                      }
                                      return timeSlotStr.trim();
                                    };

                                    const timeToMinutes = (timeStr: string) => {
                                      const [h, m] = extractStartTime(timeStr)
                                        .split(":")
                                        .map(Number);
                                      return h * 60 + m;
                                    };

                                    const formatTimeRanges = (times: any[]) => {
                                      if (times.length === 0)
                                        return "No times available";
                                      const sorted = times
                                        .map((t) => ({
                                          original: extractStartTime(t),
                                          minutes: timeToMinutes(t),
                                        }))
                                        .sort((a, b) => a.minutes - b.minutes);

                                      const ranges = [];
                                      let start = sorted[0];
                                      let end = sorted[0];

                                      for (let i = 1; i < sorted.length; i++) {
                                        const current = sorted[i];
                                        if (
                                          current.minutes - end.minutes ===
                                          30
                                        ) {
                                          end = current;
                                        } else {
                                          ranges.push(
                                            start.minutes === end.minutes
                                              ? start.original
                                              : `${start.original} - ${end.original}`
                                          );
                                          start = end = current;
                                        }
                                      }

                                      ranges.push(
                                        start.minutes === end.minutes
                                          ? start.original
                                          : `${start.original} - ${end.original}`
                                      );

                                      return ranges.join(", ");
                                    };

                                    return (
                                      <div className="space-y-2">
                                        {sortedDates.map((date, index) => {
                                          const slots = groupedByDate[date];
                                          const times = slots
                                            .map((uts: any) => {
                                              const timeSlot = timeSlots.find(
                                                (ts) =>
                                                  ts.time_slot_id ===
                                                  uts.time_slot_id
                                              );
                                              return (
                                                timeSlot?.time_slot || null
                                              );
                                            })
                                            .filter(Boolean);

                                          return (
                                            <div key={index}>
                                              <div className="font-medium text-gray-900 mb-1">
                                                {date} /{" "}
                                                {formatTimeRanges(times)}
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    );
                                  })()}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="px-4 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          {request.work_description && (
                            <>
                              <span className="text-gray-700 truncate max-w-[150px]">
                                {request.work_description.length > 15
                                  ? `${request.work_description.substring(
                                      0,
                                      15
                                    )}...`
                                  : request.work_description}
                              </span>

                              {request.work_description.length > 15 && (
                                <div className="relative group flex-shrink-0">
                                  <Info className="w-4 h-4 text-[#76B900] cursor-pointer hover:opacity-80" />
                                  <div className="absolute left-5 top-1/2 -translate-y-1/2 hidden group-hover:block bg-white border border-lime-500 rounded-lg shadow-lg z-[100] min-w-max">
                                    <div className="max-w-79 max-h-15 overflow-y-auto pt-1 px-2">
                                      <div className="text-xs text-gray-900 break-words leading-relaxed">
                                        {request.work_description}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </td>

                      <td>{""}</td>
                      <td>{""}</td>

                      {/* Access Status Icon */}
                      <td className="px-4 py-4 text-sm">
                        <div className="relative group">
                          {getAccessStatusIcon(request.status_id || 0)}
                          <div className="absolute left-0 bottom-1/2 -translate-y-1/2 mr-2 hidden group-hover:block bg-white border border-lime-500 rounded-lg shadow-md px-3 py-2 text-center whitespace-nowrap z-50 min-w-max">
                            <div className="text-sm font-medium text-gray-900">
                              {getStatusName(request.status_id || 0)}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>{""}</td>

                      {/* Remarks */}
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {request.remarks}
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="bg-lime-500 px-6 py-2 flex justify-end items-center">
            <div className="flex items-center space-x-2">
              <span className="text-white text-sm font-medium">
                Rows per page:
              </span>

              <div className="relative">
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 pr-8 text-sm shadow appearance-none text-white rounded
             focus:outline-none focus:ring-2 focus:ring-white focus:border-white bg-white-500 cursor-pointer"
                >
                  <option value={5} className="text-black">
                    5
                  </option>
                  <option value={10} className="text-black">
                    10
                  </option>
                  <option value={20} className="text-black">
                    20
                  </option>
                </select>

                <ChevronDown className="w-4 h-4 text-white absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-white text-sm font-medium">
                {requestRangeStart}–{requestRangeEnd} of {sortedRequests.length}
              </span>

              <div className="flex items-center space-x-3">
                <ChevronLeft
                  onClick={() =>
                    currentPage > 1 && setCurrentPage((p) => p - 1)
                  }
                  className={`w-5 h-5 cursor-pointer 
          ${
            currentPage === 1
              ? "text-white opacity-50 cursor-not-allowed"
              : "text-white hover:text-gray-200"
          }`}
                />

                <ChevronRight
                  onClick={() =>
                    currentPage < totalPages && setCurrentPage((p) => p + 1)
                  }
                  className={`w-5 h-5 cursor-pointer 
          ${
            currentPage === totalPages
              ? "text-white opacity-50 cursor-not-allowed"
              : "text-white hover:text-gray-200"
          }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 text-xs">
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full bg-gray-400 flex items-center justify-center text-black text-xs">
                !
              </div>
              <span className="font-medium text-gray-700">Pending</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full bg-orange-400 flex items-center justify-center text-white text-xs">
                ✓
              </div>
              <span className="font-medium text-gray-700">
                Approved-Functional
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
                ✓
              </div>
              <span className="font-medium text-gray-700">
                Approved-Technical
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
                ✕
              </div>
              <span className="font-medium text-gray-700">Rejected</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 mt-3">
            <div className="flex items-center space-x-3">
              <Info className="w-4 h-4 text-[#76B900]" />
              <span className="font-medium text-gray-700">
                Hover to view Datetime / Description details
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 mt-0 ml-1">
            <div className="flex items-center space-x-3.5">
              <div className="text-gray-700 text-xl font-semibold mt-1">*</div>
              <span className="font-medium text-gray-700">
                Click on row for Instance Request details
              </span>
            </div>
          </div>
        </div>

        {/* EMAIL SENDING LOADING INDICATOR */}
        {isEmailSending && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-60 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-6 h-6 border-2 border-lime-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-lg font-medium text-gray-800">
                  Sending Email...
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Please wait while we send the notification email.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Filter Validation Popup */}
      {isFilterValidationPopupOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-1">
          <div className="bg-white rounded-md shadow-md w-full max-w-sm">
            <div className="py-6 text-center">
              <h3 className="text-base font-medium text-lime-600 mb-4 leading-snug">
                Please select at least one filter criteria
                <br />
                <span className="text-base font-medium text-lime-600 leading-snug">
                  (Date Range or Status).
                </span>
              </h3>
              <div className="flex justify-center mt-2">
                <button
                  onClick={closeFilterValidationPopup}
                  className="bg-lime-600 text-white px-4 py-1 rounded-sm text-sm font-semibold hover:bg-lime-700 cursor-pointer"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Snackbar */}
      {snackbar.show && snackbar.type === "success" && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[70]">
          <div
            className="px-6 py-3 rounded-lg shadow-lg text-white text-sm font-medium"
            style={{ backgroundColor: "#76B900" }}
          >
            {snackbar.message}
          </div>
        </div>
      )}

      {snackbar.show && snackbar.type === "error" && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[70]">
          <div className="px-6 py-3 rounded-lg shadow-lg text-white text-sm font-medium bg-red-500">
            {snackbar.message}
          </div>
        </div>
      )}

      {/* Request Details Popup Modal */}
      {isPopupOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 relative max-h-[90vh] flex flex-col">
            <div className="text-center py-4 border-b border-gray-300">
              <h3 className="text-xl font-semibold text-gray-800">
                Instance Request Details
              </h3>
            </div>

            <button
              onClick={closePopup}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 text-sm space-y-8 flex-1 overflow-y-auto flex flex-col items-center">
              {/* PERSONAL INFORMATION BOX */}
              <div className="relative border border-gray-300 rounded-lg p-4 shadow-sm w-[90%] max-w-lg mx-auto">
                <div className="absolute -top-3 left-2 bg-white px-4">
                  <h4 className="text-md font-semibold text-gray-700">
                    Personal Information
                  </h4>
                </div>

                <div className="mt-2">
                  {[
                    {
                      label: "Request Id",
                      value: selectedRequest.instance_request_id,
                    },
                    {
                      label: "User Name",
                      value: getUserName(selectedRequest.user_id),
                    },
                    {
                      label: "Institute",
                      value: getInstituteName(selectedRequest.user_id),
                    },
                    {
                      label: "Department",
                      value: getDepartmentName(selectedRequest.user_id),
                    },
                    {
                      label: "Email Id",
                      value: getUser(selectedRequest.user_id)?.email_id,
                    },
                    ...(getStatusName(selectedRequest.status_id || 0) ===
                    "Approved-Technical"
                      ? [
                          {
                            label: "User ID",
                            value: selectedRequest.login_id || "",
                          },
                          {
                            label: "Password",
                            value: selectedRequest.password || "",
                          },
                          {
                            label: "Access Link",
                            value: (
                              <a
                                href={`http://45.120.59.148:32243`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline hover:text-blue-800"
                              >
                                45.120.59.148:32243
                              </a>
                            ),
                          },
                          ...(selectedRequest.additional_information
                            ? [
                                {
                                  label: "Additional Information",
                                  value: selectedRequest.additional_information,
                                },
                              ]
                            : []),
                        ]
                      : []),
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-[150px_20px_1fr] w-full"
                    >
                      <span className="font-medium text-gray-700 text-right">
                        {item.label}
                      </span>
                      <span className="text-gray-700 text-center">:</span>
                      <span className="text-gray-900 text-left break-words">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* TECHNICAL INFORMATION BOX */}
              <div className="relative border border-gray-300 rounded-lg p-4 shadow-sm w-[90%] max-w-lg mx-auto">
                <div className="absolute -top-3 left-2 bg-white px-4">
                  <h4 className="text-md font-semibold text-gray-700">
                    Technical Information
                  </h4>
                </div>

                <div className="mt-2">
                  {[
                    {
                      label: "User Type",
                      value: getUserTypeName(selectedRequest.user_type_id),
                    },
                    {
                      label: "Image",
                      value: getCustomImageName(selectedRequest.image_id),
                    },
                    {
                      label: "Requested CPUs",
                      value: `${getCpuName(selectedRequest.cpu_id)} + 1 (${
                        Number(getCpuName(selectedRequest.cpu_id)) + 1
                      })`,
                    },
                    {
                      label: "Requested RAM in GB",
                      value: `${parseInt(
                        getRamName(selectedRequest.ram_id)
                      )} + 1 (${
                        parseInt(getRamName(selectedRequest.ram_id)) + 1
                      }) GB`,
                    },
                    {
                      label: "Number of GPU",
                      value: getGpuPartitionName(
                        selectedRequest.gpu_partition_id
                      ),
                    },
                    {
                      label: "GPU Vendor",
                      value: getGpuName(selectedRequest.gpu_id),
                    },
                    {
                      label: "Selected Date / Time",
                      value: (
                        <span className="whitespace-pre-wrap text-gray-900 text-left block break-words">
                          {selectedRequestTimeDetails?.formatted ||
                            "Date and time not available"}
                        </span>
                      ),
                    },
                    {
                      label: "Status",
                      value: getStatusName(selectedRequest.status_id || 0),
                    },
                    ...(getStatusName(selectedRequest.status_id || 0) ===
                      "Approved-Functional" ||
                    getStatusName(selectedRequest.status_id || 0) ===
                      "Approved-Technical"
                      ? [
                          {
                            label: "Approved By",
                            value: getUserName(selectedRequest.updated_by || 0),
                          },
                        ]
                      : getStatusName(selectedRequest.status_id || 0) ===
                        "Rejected"
                      ? [
                          {
                            label: "Rejected By",
                            value: getUserName(selectedRequest.updated_by || 0),
                          },
                        ]
                      : []),
                    ...(["Rejected"].includes(
                      getStatusName(selectedRequest.status_id || 0)
                    )
                      ? [
                          {
                            label: "Remarks",
                            value: selectedRequest.remarks || "",
                          },
                        ]
                      : []),
                    {
                      label: "Work Description",
                      value: (
                        <span className="block break-words">
                          {selectedRequest.work_description}
                        </span>
                      ),
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-[150px_20px_1fr] w-full"
                    >
                      <span className="font-medium text-gray-700 text-right">
                        {item.label}
                      </span>
                      <span className="text-gray-700 text-center">:</span>
                      <span className="text-gray-900 text-left break-words">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-3 py-4 border-t border-gray-300">
              {getStatusName(selectedRequest.status_id || 0) === "Pending" ? (
                <>
                  <button
                    onClick={handleApprove}
                    className="bg-lime-500 text-white py-2 px-6 rounded hover:bg-lime-600 transition-colors text-sm font-medium cursor-pointer font-semibold"
                  >
                    Approve
                  </button>
                  <button
                    onClick={handleReject}
                    className="bg-lime-500 text-white py-2 px-6 rounded hover:bg-lime-600 transition-colors text-sm font-medium cursor-pointer font-semibold"
                  >
                    Reject
                  </button>
                </>
              ) : (
                <button
                  onClick={closePopup}
                  className="bg-lime-500 text-white py-2 px-6 rounded hover:bg-lime-600 transition-colors text-sm font-medium cursor-pointer font-semibold"
                >
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Popup Modal */}
      {isConfirmationOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-md shadow-md w-full max-w-sm mx-4">
            <div className="p-6 text-center">
              <h3 className="text-base font-medium text-lime-600 mb-6">
                Are you sure you want to {confirmationAction} this request ID (
                {selectedRequest?.instance_request_id})?
              </h3>

              <div className="flex justify-center gap-2">
                <button
                  onClick={handleConfirmationYes}
                  className="bg-lime-600 text-white px-4 py-1 rounded-sm text-sm font-semibold hover:bg-lime-700 cursor-pointer"
                >
                  Yes
                </button>
                <button
                  onClick={closeConfirmation}
                  className="bg-lime-600 text-white px-4 py-1 rounded-sm text-sm font-semibold hover:bg-lime-700 cursor-pointer"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Remarks Modal (for reject) */}
      {isRemarksModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 relative">
            <button
              onClick={closeRemarksModal}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 z-10"
            >
              <X className="w-5 h-5 cursor-pointer" />
            </button>

            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">
                Remarks
              </h3>

              <div className="relative w-full">
                <label
                  className={`absolute left-3 transition-all duration-200 pointer-events-none z-10
              ${remarksText || remarksError ? "text-xs -top-2 px-1" : "top-3"}
              ${
                remarksError
                  ? "text-red-500"
                  : remarksText
                  ? "text-[#5a8f00] font-medium"
                  : "text-gray-500"
              }
            `}
                  style={{
                    backgroundColor:
                      remarksText || remarksError ? "#ffffff" : "transparent",
                  }}
                >
                  {remarksError || "Remarks*"}
                </label>

                <textarea
                  value={remarksText}
                  onChange={(e) => {
                    setRemarksText(e.target.value);
                    if (e.target.value.trim() !== "") setRemarksError("");
                  }}
                  className={`w-full text-gray-700 h-24 p-3 rounded-lg text-sm resize-none focus:outline-none transition-all duration-200
              ${
                remarksError
                  ? "border-2 border-red-500 focus:border-red-500"
                  : "border-2 border-[#e8f5d0] hover:border-[#e8f5d0]"
              }
            `}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#76B900";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(118, 185, 0, 0.1)";
                  }}
                  style={{
                    color: "#2d4a00",
                    boxShadow: remarksError
                      ? "0 0 0 3px rgba(239, 68, 68, 0.1)"
                      : "none",
                  }}
                />
              </div>

              <div className="flex justify-center mt-4">
                <button
                  onClick={handleRemarksSubmit}
                  disabled={isEmailSending}
                  className="bg-lime-500 text-white py-2 px-6 rounded hover:bg-lime-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-semibold"
                  style={{
                    backgroundColor: isEmailSending ? "#9ca3af" : "#76B900",
                  }}
                  onMouseEnter={(e) => {
                    if (!isEmailSending) {
                      e.currentTarget.style.backgroundColor = "#5a8f00";
                      e.currentTarget.style.transform = "translateY(0px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isEmailSending) {
                      e.currentTarget.style.backgroundColor = "#76B900";
                      e.currentTarget.style.transform = "translateY(0)";
                    }
                  }}
                >
                  {isEmailSending ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Export with Suspense Wrapper
export default function FunctionalDashboard() {
  return (
    <Suspense fallback={<div></div>}>
      <DGXDashboard />
    </Suspense>
  );
}
