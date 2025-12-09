"use client";
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  Suspense,
} from "react";
import {
  ChevronDown,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  Info,
  Trash2,
} from "lucide-react";
import { Listbox } from "@headlessui/react";
import { useRouter } from "next/navigation";
import Header from "../navbar/page";
import { useSearchParams } from "next/navigation";

// Define proper types for the data
type InstanceRequest = {
  instance_request_id: number;
  user_id: number;
  status_id: number;
  created_timestamp: string;
  work_description?: string;
  remarks?: string;
  user_type_id?: number;
  image_id?: number;
  cpu_id?: number;
  ram_id?: number;
  gpu_partition_id?: number; // Note: typo in DB
  gpu_id?: number;
  selected_date?: string;
  login_id?: string;
  password?: string;
  additional_information?: string;
  is_access_granted?: boolean;
  updated_by?: number;
  [key: string]: any;
};

type User = {
  user_id: number;
  first_name?: string;
  last_name?: string;
  email_id?: string;
  username?: string;
};

type Institute = {
  institute_id: number;
  institute_name?: string;
};

type Status = {
  status_id: number | string;
  status_name: string;
};

type SnackbarState = {
  show: boolean;
  message: string;
  type: "success" | "error";
};

function DGXDashboard() {
  // Dynamic user ID state
  // const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // Dashboard states
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
  const [sortConfig, setSortConfig] = useState({
    key: "created_timestamp",
    direction: "desc",
  });

  // Popup states
  const [selectedRequest, setSelectedRequest] =
    useState<InstanceRequest | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isFilterValidationPopupOpen, setIsFilterValidationPopupOpen] =
    useState(false);

  // Delete confirmation popup state
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] =
    useState<InstanceRequest | null>(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    show: false,
    message: "",
    type: "success",
  });
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const [departments, setDepartments] = useState<any[]>([]);
  const [userTypes, setUserTypes] = useState<any[]>([]);
  const [cpuList, setCpuList] = useState<any[]>([]);
  const [ramList, setRamList] = useState<any[]>([]);
  const [gpuPartitions, setGpuPartitions] = useState<any[]>([]);
  const [gpuVendors, setGpuVendors] = useState<any[]>([]);
  const [image, setImage] = useState<any[]>([]);

  // Time slots state
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [userTimeSlots, setUserTimeSlots] = useState<any[]>([]);
  const [selectedRequestTimeDetails, setSelectedRequestTimeDetails] =
    useState<any>(null);
  const [userInstituteAssociation, setUserInstituteAssociation] = useState<
    any[]
  >([]);
  const [authLoading, setAuthLoading] = useState(true);

  const searchParams = useSearchParams();
  const currentUserId = Number(searchParams.get("userId") || "");

  // const currentUserId = 8; // <---- HARD-CODED

  // Fetch time data
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

      if (
        !allUserTimeSlotsForRequest ||
        allUserTimeSlotsForRequest.length === 0
      ) {
        return {
          date: "No date available",
          time: "No time available",
          formatted: "Date and time not available",
        };
      }

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
          groupedDetails[formattedDate].push(timeSlotValue);
        }
      }

      const sortedDates = Object.keys(groupedDetails).sort((a, b) => {
        const [dayA, monthA, yearA] = a.split("/").map(Number);
        const [dayB, monthB, yearB] = b.split("/").map(Number);
        return (
          new Date(yearA, monthA - 1, dayA).getTime() -
          new Date(yearB, monthB - 1, dayB).getTime()
        );
      });

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
        if (times.length === 0) return "No times available";

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

      let formattedOutput = "";
      for (let i = 0; i < sortedDates.length; i++) {
        const date = sortedDates[i];
        const times = groupedDetails[date];
        const formattedDate = date.replace(/\//g, "-");
        const formattedTimeRanges = formatTimeRanges(times);
        formattedOutput += `${formattedDate}\n[${formattedTimeRanges}]`;
        if (i < sortedDates.length - 1) {
          formattedOutput += "\n";
        }
      }

      return {
        date: `${sortedDates.length} dates selected`,
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

  // Fetch master data
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
        setImage(data.imageList || []);
      } catch (err) {
        console.error("Error fetching master tables", err);
      }
    };

    fetchMasters();
  }, []);

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

  const getGpuVendorName = (vendorId: number) => {
    const vendor = gpuVendors.find((v) => v.gpu_id === vendorId);
    return vendor?.gpu_vendor || "";
  };

  const getCustomImageName = (imageId: number) => {
    const img = image.find((i) => i.image_id === imageId);
    return img?.image_name || "";
  };

  // Show snackbar
  const showSnackbar = useCallback(
    (message: string, type: "success" | "error" = "success") => {
      setSnackbar({ show: true, message, type });
      setTimeout(() => {
        setSnackbar({ show: false, message: "", type: "success" });
      }, 3000);
    },
    []
  );

  // Delete handler functions
  const handleDeleteClick = (e: React.MouseEvent, request: InstanceRequest) => {
    e.stopPropagation();
    setRequestToDelete(request);
    setIsDeletePopupOpen(true);
  };

  const closeDeletePopup = () => {
    setIsDeletePopupOpen(false);
    setRequestToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!requestToDelete) return;

    try {
      const instanceRequestId = requestToDelete.instance_request_id;

      // Call backend delete API
      const res = await fetch(
        process.env.NEXT_PUBLIC_DGX_API_URL +
          `/users/delete/${instanceRequestId}`,
        {
          method: "DELETE",
        }
      );

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Delete failed");

      // Refetch with filters
      const hasDateFilter = fromDate || toDate;
      const hasStatusFilter =
        selectedStatus && selectedStatus.status_id !== "all";
      let statusIdToFilter;

      if (hasStatusFilter) {
        statusIdToFilter = Number(selectedStatus.status_id);
      }

      if (hasDateFilter || hasStatusFilter) {
        await fetchFilteredRequests(fromDate, toDate, statusIdToFilter);
      } else {
        await fetchFilteredRequests();
      }

      // Remove from local userTimeSlots state
      const updatedUserTimeSlots = userTimeSlots.filter(
        (uts) => uts.instance_request_id !== instanceRequestId
      );
      setUserTimeSlots(updatedUserTimeSlots);

      showSnackbar("Request deleted successfully", "success");
      closeDeletePopup();
    } catch (error) {
      console.error("Error deleting request:", error);
      showSnackbar("Failed to delete request. Please try again.", "error");
    }
  };

  const handleRequestInstanceClick = () => {
    router.push("/user/instanceaccessrequest");
  };

  // Filter user's requests only
  useEffect(() => {
    if (currentUserId && requests.length > 0 && filteredRequests.length === 0) {
      const userRequests = requests.filter(
        (req) => req.user_id === currentUserId
      );
      setFilteredRequests(userRequests);
    } else if (currentUserId && filteredRequests.length === 0) {
      setFilteredRequests([]);
    }
  }, [currentUserId]);

  // Convert yyyy-mm-dd to dd/mm/yyyy for display
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  // Date handlers
  const handleFromDateChange = (value: string) => {
    setFromDate(value);
    if (value && dateError.includes("From Date")) {
      setDateError("");
    }
  };

  const handleToDateChange = (value: string) => {
    setToDate(value);
  };

  const closeFilterValidationPopup = () => {
    setIsFilterValidationPopupOpen(false);
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const [usersRes, instRes, assocRes] = await Promise.all([
        fetch(process.env.NEXT_PUBLIC_DGX_API_URL + "/technicaladmin/users"),
        fetch(
          process.env.NEXT_PUBLIC_DGX_API_URL + "/technicaladmin/institutes"
        ),
        fetch(
          process.env.NEXT_PUBLIC_DGX_API_URL + "/technicaladmin/associations"
        ),
      ]);

      const usersData = await usersRes.json();
      const institutesData = await instRes.json();
      const assocData = await assocRes.json();

      // Check if data is nested in a 'data' property
      const users = usersData.data || usersData || [];
      const institutes = institutesData.data || institutesData || [];
      const associations = assocData.data || assocData || [];

      setUsers(users);
      setInstitutes(institutes);
      setUserInstituteAssociation(associations);

      // Now call fetchFilteredRequests
      if (currentUserId) {
        await fetchFilteredRequests();
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      showSnackbar("Error fetching data", "error");
    } finally {
      setLoading(false);
    }
  }, [currentUserId, showSnackbar]);

  // New function to fetch filtered requests

  const fetchFilteredRequests = useCallback(
    async (
      filterFromDate?: string,
      filterToDate?: string,
      filterStatusId?: number
    ) => {
      // if (!currentUserId) return;
      // const currentUserId = 8;   // <---- HARD-CODED

      try {
        setLoading(true);

        const params = new URLSearchParams({
          user_id: currentUserId.toString(),
          from_date: filterFromDate || "",
          to_date: filterToDate || "",
          status_id: filterStatusId?.toString() || "",
        });

        const res = await fetch(
          process.env.NEXT_PUBLIC_DGX_API_URL +
            `/users/get-user?${params.toString()}`
        );
        const data = await res.json();

        setRequests(data || []);
        setFilteredRequests(data || []);
        setCurrentPage(1);
      } catch (err) {
        console.error("Error fetching filtered requests:", err);
        showSnackbar("Error fetching requests", "error");
      } finally {
        setLoading(false);
      }
    },
    [currentUserId, showSnackbar]
  );
  // }, [showSnackbar]);

  // Updated validateAndFilter function
  const validateAndFilter = async () => {
    if (!fromDate && !toDate && !selectedStatus) {
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

    // Determine status ID to pass
    let statusIdToFilter: number | undefined = undefined;
    if (selectedStatus && selectedStatus.status_id !== "all") {
      statusIdToFilter = Number(selectedStatus.status_id);
    }

    // Call the RPC function with filters
    await fetchFilteredRequests(fromDate, toDate, statusIdToFilter);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  // Sorting logic
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
            valB = getUserName(b.user_id);
            break;
          default:
            valA = a[sortConfig.key] ?? "";
            valB = b[sortConfig.key] ?? "";
        }

        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();

        if (strA < strB) return sortConfig.direction === "asc" ? -1 : 1;
        if (strA > strB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return sortable;
  }, [filteredRequests, sortConfig]);

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

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev.key === key && prev.direction === "asc") {
        return { key, direction: "desc" };
      }
      return { key, direction: "asc" };
    });
  };

  const handleRowClick = (request: InstanceRequest) => {
    const statusName = getStatusName(request.status_id);

    if (statusName !== "Pending") {
      setIsPopupOpen(true);
      setSelectedRequest(request);

      const timeDetails = getTimeDetailsForRequest(request.instance_request_id);
      setSelectedRequestTimeDetails(timeDetails);
      return;
    }

    if (statusName === "Pending") {
      router.push(
        `/user/instanceaccessrequest?id=${request.instance_request_id}`
      );
      return;
    }
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedRequest(null);
    setSelectedRequestTimeDetails(null);
  };

  // Helper functions
  const getStatusName = (statusId: number): string => {
    const statusItem = status.find((s) => s.status_id === statusId);
    return statusItem?.status_name || "Unknown Status";
  };

  const getUser = (userId: number) => {
    return users.find((u) => u.user_id === userId);
  };

  const getUserName = (userId: number): string => {
    if (!userId) return "Not Assigned";
    const user = users.find((u) => u.user_id === userId);
    if (!user) return `Unknown User (${userId})`;
    const fullName = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();
    return fullName || "No Name";
  };

  const getInstituteName = (userId: number): string => {
    if (!userId) return "Not Assigned";

    const association = userInstituteAssociation.find(
      (assoc: any) =>
        assoc.user_id === userId && assoc.is_reg_institute === true
    );

    if (!association) return "No Registered Institute";

    const institute = institutes.find(
      (inst) => inst.institute_id === association.institute_id
    );

    return institute?.institute_name || "Unknown Institute";
  };

  const getDepartmentName = (userId: number): string => {
    if (!userId) return "Not Assigned";

    const user = users.find((u) => u.user_id === userId);
    if (!user) return `Unknown User (${userId})`;

    const association = userInstituteAssociation.find(
      (assoc: any) => assoc.user_id === userId
    );
    if (!association) return "No Department Assigned";

    const department = departments.find(
      (dept) => dept.department_id === association.department_id
    );

    return department?.department_name ?? "";
  };

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

  // Get count of users "in line"
  const getUsersInLineCount = (currentRequest: InstanceRequest): number => {
    try {
      const currentStatusName = getStatusName(currentRequest.status_id);

      if (
        currentStatusName !== "Pending" &&
        currentStatusName !== "Approved-Functional"
      ) {
        return 0;
      }

      const currentRequestTimeSlots = userTimeSlots.filter(
        (uts) => uts.instance_request_id === currentRequest.instance_request_id
      );

      if (currentRequestTimeSlots.length === 0) {
        return requests.filter(
          (req) => getStatusName(req.status_id) === currentStatusName
        ).length;
      }

      const currentDateTimes = new Set(
        currentRequestTimeSlots.map(
          (uts) => `${uts.selected_date}_${uts.time_slot_id}`
        )
      );

      const count = requests.filter((req) => {
        if (getStatusName(req.status_id) !== currentStatusName) {
          return false;
        }

        const reqTimeSlots = userTimeSlots.filter(
          (uts) => uts.instance_request_id === req.instance_request_id
        );

        return reqTimeSlots.some((uts) => {
          const dateTime = `${uts.selected_date}_${uts.time_slot_id}`;
          return currentDateTimes.has(dateTime);
        });
      }).length;

      return count;
    } catch (error) {
      console.error("Error calculating users in line:", error);
      return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
          User Dashboard
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

            {/* Request Instance Button */}
            <button
              onClick={handleRequestInstanceClick}
              className="px-6 py-2 bg-lime-500 text-white rounded-sm font-semibold hover:bg-lime-600 transition-colors ml-auto cursor-pointer flex-shrink-0"
            >
              Request Instance
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
                    { key: "user_id", label: "User Name" },
                    { key: "status_id", label: "Institute Name" },
                    { key: "created_timestamp", label: "Requested Date/Time" },
                    { key: "work_description", label: "Description" },
                    { key: "status", label: "Status" },
                    { key: "remarks", label: "Remarks" },
                    { key: "", label: "Users in Line" },
                    { key: "actions", label: "Actions" },
                  ].map((col) => (
                    <th
                      key={col.key}
                      className="px-4 py-4 text-left text-sm font-semibold cursor-pointer select-none"
                      onClick={() => handleSort(col.key)}
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

              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="text-center py-6">
                      <div className="flex items-center justify-center space-x-3">
                        <div className="animate-spin h-5 w-5 border-2 border-lime-500 border-t-transparent rounded-full"></div>
                        <span className="text-gray-600 text-sm">
                          Loading data...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedRequests.map((request, index) => (
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
                            {((): React.ReactNode => {
                              const slots = request.time_slots || [];

                              // If no time slots -> show selected_date or fallback
                              if (slots.length === 0) {
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

                              // Extract unique dates and ensure typed as string[]
                              const formattedDates: string[] = Array.from(
                                new Set(
                                  slots.map(
                                    (s: {
                                      selected_date: string | number | Date;
                                    }) =>
                                      new Date(s.selected_date)
                                        .toLocaleDateString("en-GB")
                                        .replace(/\//g, "-")
                                  )
                                )
                              ) as string[];

                              // Sort dates (DD-MM-YYYY) with typed parameters
                              formattedDates.sort((a: string, b: string) => {
                                const [dA, mA, yA] = a.split("-").map(Number);
                                const [dB, mB, yB] = b.split("-").map(Number);
                                return (
                                  new Date(yA, mA - 1, dA).getTime() -
                                  new Date(yB, mB - 1, dB).getTime()
                                );
                              });

                              // If multiple dates -> show range
                              if (formattedDates.length > 1) {
                                return `${formattedDates[0]} - ${
                                  formattedDates[formattedDates.length - 1]
                                }`;
                              }

                              return formattedDates[0];
                            })()}
                          </span>

                          {/* Info icon + tooltip */}
                          <div className="relative group flex-shrink-0">
                            <Info className="w-4 h-4 text-[#76B900] cursor-pointer hover:opacity-80" />

                            <div className="absolute left-5 top-1/2 -translate-y-1/2 hidden group-hover:block bg-white border border-lime-500 rounded-lg shadow-lg z-[100] before:content-[''] before:absolute before:-left-5 before:top-0 before:w-5 before:h-full before:bg-transparent transition-opacity duration-200">
                              <div className="min-w-[200px] max-w-[400px] w-max max-h-15 overflow-y-auto pt-1 px-2 whitespace-normal break-word text-xs text-gray-900 leading-relaxed">
                                {(() => {
                                  const slots = request.time_slots || [];

                                  if (slots.length === 0) {
                                    return (
                                      <div className="text-center">
                                        <div className="font-medium text-gray-900">
                                          {request.selected_date
                                            ? new Date(request.selected_date)
                                                .toLocaleDateString("en-GB")
                                                .replace(/\//g, "-")
                                            : "No date available"}
                                        </div>
                                        <div className="text-xs text-gray-600">
                                          Time Slots : N/A
                                        </div>
                                      </div>
                                    );
                                  }

                                  // Group by date
                                  const grouped = slots.reduce(
                                    (
                                      acc: { [x: string]: any[] },
                                      s: {
                                        selected_date: string | number | Date;
                                        time_slot: any;
                                      }
                                    ) => {
                                      const date = new Date(s.selected_date)
                                        .toLocaleDateString("en-GB")
                                        .replace(/\//g, "-");

                                      if (!acc[date]) acc[date] = [];
                                      acc[date].push(s.time_slot);
                                      return acc;
                                    },
                                    {}
                                  );

                                  const extractStartTime = (slot: string) =>
                                    slot.includes("-")
                                      ? slot.split("-")[0].trim()
                                      : slot.trim();

                                  const toMinutes = (t: string) => {
                                    const [h, m] = extractStartTime(t)
                                      .split(":")
                                      .map(Number);
                                    return h * 60 + m;
                                  };

                                  const formatRanges = (times: any[]) => {
                                    const sorted = times
                                      .map((t) => ({
                                        original: extractStartTime(t),
                                        minutes: toMinutes(t),
                                      }))
                                      .sort((a, b) => a.minutes - b.minutes);

                                    const ranges = [];
                                    let start = sorted[0];
                                    let end = sorted[0];

                                    for (let i = 1; i < sorted.length; i++) {
                                      const cur = sorted[i];
                                      if (cur.minutes - end.minutes === 30) {
                                        end = cur;
                                      } else {
                                        ranges.push(
                                          start.minutes === end.minutes
                                            ? start.original
                                            : `${start.original} - ${end.original}`
                                        );
                                        start = cur;
                                        end = cur;
                                      }
                                    }

                                    ranges.push(
                                      start.minutes === end.minutes
                                        ? start.original
                                        : `${start.original} - ${end.original}`
                                    );

                                    return ranges.join(", ");
                                  };

                                  const sortedDates = Object.keys(grouped).sort(
                                    (a, b) => {
                                      const [dA, mA, yA] = a
                                        .split("-")
                                        .map(Number);
                                      const [dB, mB, yB] = b
                                        .split("-")
                                        .map(Number);
                                      return (
                                        new Date(yA, mA - 1, dA).getTime() -
                                        new Date(yB, mB - 1, dB).getTime()
                                      );
                                    }
                                  );

                                  return (
                                    <div className="space-y-2">
                                      {sortedDates.map((date) => (
                                        <div key={date}>
                                          <div className="font-medium text-gray-900 mb-1">
                                            {date} /{" "}
                                            {formatRanges(grouped[date])}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  );
                                })()}
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
                                {request.work_description.length > 30
                                  ? `${request.work_description.substring(
                                      0,
                                      30
                                    )}...`
                                  : request.work_description}
                              </span>

                              {request.work_description.length > 30 && (
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

                      {/* Status Icon */}
                      <td className="px-4 py-4 text-sm">
                        <div className="relative group">
                          {getAccessStatusIcon(request.status_id)}
                          <div className="absolute left-0 bottom-1/2 -translate-y-1/2 mr-2 hidden group-hover:block bg-white border border-lime-500 rounded-lg shadow-md px-3 py-2 text-center whitespace-nowrap z-50 min-w-max">
                            <div className="text-sm font-medium text-gray-900">
                              {getStatusName(request.status_id)}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Remarks */}
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {request.remarks || ""}
                      </td>

                      {/* Users in line */}
                      <td className="px-4 py-4 text-sm">
                        <div className="relative group">
                          {getUsersInLineCount(request)}
                        </div>
                      </td>

                      {/* Actions - Delete Button for Pending */}
                      <td className="px-4 py-4 text-sm text-center">
                        {getStatusName(request.status_id) === "Pending" && (
                          <button
                            onClick={(e) => handleDeleteClick(e, request)}
                            className="text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
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
                {sortedRequests.length === 0
                  ? "0–0 of 0"
                  : `${requestRangeStart}–${requestRangeEnd} of ${sortedRequests.length}`}
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

      {/* Delete Confirmation Popup */}
      {isDeletePopupOpen && requestToDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-md shadow-md w-full max-w-sm mx-4">
            <div className="p-6 text-center">
              <h3 className="text-base font-medium text-lime-600 mb-4">
                Are you sure you want to delete this request ID(
                {requestToDelete.instance_request_id})?
              </h3>

              <div className="flex justify-center gap-2">
                <button
                  onClick={handleDeleteConfirm}
                  className="bg-lime-600 text-white px-4 py-1 rounded-sm text-sm font-semibold hover:bg-lime-700 cursor-pointer"
                >
                  Yes
                </button>
                <button
                  onClick={closeDeletePopup}
                  className="bg-lime-600 text-white px-4 py-1 rounded-sm text-sm font-semibold hover:bg-lime-700 cursor-pointer"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Snackbar */}
      {snackbar.show && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[70]">
          <div
            className={`px-6 py-3 rounded-lg shadow-lg text-white text-sm font-medium ${
              snackbar.type === "success" ? "bg-[#76B900]" : "bg-red-500"
            }`}
          >
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
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5 cursor-pointer" />
            </button>

            {/* Content */}
            <div className="p-6 text-sm space-y-8 flex-1 overflow-y-auto flex flex-col items-center">
              {/* PERSONAL INFORMATION BOX */}
              <div className="relative border border-gray-300 rounded-lg p-4 shadow-sm w-[90%] max-w-lg mx-auto">
                <div className="absolute -top-3 left-2 bg-white px-4">
                  <h4 className="text-md font-semibold text-gray-800">
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
                    ...(getStatusName(selectedRequest.status_id) ===
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
                  <h4 className="text-md font-semibold text-gray-800">
                    Technical Information
                  </h4>
                </div>

                <div className="mt-2">
                  {[
                    {
                      label: "User Type",
                      value: getUserTypeName(selectedRequest.user_type_id || 0),
                    },
                    {
                      label: "Image",
                      value: getCustomImageName(selectedRequest.image_id || 0),
                    },
                    {
                      label: "Requested CPUs",
                      value: getCpuName(selectedRequest.cpu_id || 0),
                    },
                    {
                      label: "Requested RAM in GB",
                      value: getRamName(selectedRequest.ram_id || 0),
                    },
                    {
                      label: "Number of GPU",
                      value: getGpuPartitionName(
                        selectedRequest.gpu_partition_id || 0
                      ),
                    },
                    {
                      label: "GPU Vendor",
                      value: getGpuVendorName(selectedRequest.gpu_id || 0),
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
                      value: getStatusName(selectedRequest.status_id),
                    },
                    ...(getStatusName(selectedRequest.status_id) ===
                      "Approved-Functional" ||
                    getStatusName(selectedRequest.status_id) ===
                      "Approved-Technical"
                      ? [
                          {
                            label: "Approved By",
                            value: getUserName(selectedRequest.updated_by || 0),
                          },
                        ]
                      : getStatusName(selectedRequest.status_id) === "Rejected"
                      ? [
                          {
                            label: "Rejected By",
                            value: getUserName(selectedRequest.updated_by || 0),
                          },
                        ]
                      : []),
                    ...(["Rejected"].includes(
                      getStatusName(selectedRequest.status_id)
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
              <button
                onClick={closePopup}
                className="bg-lime-500 text-white py-2 px-6 rounded hover:bg-lime-600 transition-colors text-sm font-medium cursor-pointer font-semibold"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Export with Suspense Wrapper
export default function UserDashboard() {
  return (
    <Suspense fallback={<div></div>}>
      <DGXDashboard />
    </Suspense>
  );
}
