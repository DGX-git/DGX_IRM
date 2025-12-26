"use client";

import React, { useCallback, useEffect, useState } from "react";
import { ChevronDown, CheckCircle, AlertCircle, X } from "lucide-react";
import Header from "@/app/navbar/page";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ArrowRightIcon } from "lucide-react";
import { checkAuth } from "@/utils/auth";

function DGXInstanceRequestFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  let instance_id: any = searchParams.get("id");

  // const searchParams = useSearchParams();
  const loggedInUserId: any = searchParams.get("userId");
  console.log("Logged in User ID=", loggedInUserId);

  let user_time_slot_id_id: any = null;

  useEffect(() => {
    if (instance_id) {
      // getInstanceRequestByUserId();
    }
  }, [instance_id]);

  // Form data interface
  interface FormData {
    userTypeId: string;
    selectedDate: string;
    dateTimeSlots: DateTimeSlots;
    selectedDates: string[];
    customImageId: string;
    cpuId: string;
    statusId: string;
    gpuPartitionId: string;
    storageVolume: string;
    ramId: string;
    gpuSlotId: string;
    workDescription: string;
    selectedSlots: string[];
  }

  type ErrorsType = Partial<Record<keyof FormData, string>>;
  type TouchedType = Partial<Record<keyof FormData, boolean>>;

  // Validation states
  const [errors, setErrors] = useState<ErrorsType>({});
  const [touched, setTouched] = useState<TouchedType>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Snackbar states
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userId, setUserId] = useState("" as string);
  const [selectedDate, setSelectedDate] = useState("" as string);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [initiallyLoadedSlots, setInitiallyLoadedSlots] = useState<string[]>([]);
  const [dragMode, setDragMode] = useState<"select" | "unselect" | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  // Add this state
  const [successMessage, setSuccessMessage] = useState("");
  // Add these near the top with other state declarations
  const [showReplicatePopup, setShowReplicatePopup] = useState(false);
  const [previousDate, setPreviousDate] = useState<string | null>(null);
  const [replicateSourceDate, setReplicateSourceDate] = useState<string | null>(null);

  // Add these new state variables at the top of your component (after existing useState declarations)
  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [successSnackbar, setSuccessSnackbar] = useState(false);
  const [isReplicating, setIsReplicating] = useState(false);
  const [replicateChecked, setReplicateChecked] = useState<boolean>(false);

  const [userType, setUserType] = useState<userType[]>([]);
  const [customImage, setCustomImage] = useState<customImage[]>([]);
  const [timeSlot, setTimeSlot] = useState<timeSlot[]>([]);
  const [userTimeSlot, setUserTimeSlot] = useState<any[]>([]);
  const [cpu, setCpu] = useState<cpu[]>([]);
  const [status, setStatus] = useState<status[]>([]);
  const [gpuPartition, setGpuPartition] = useState<gpuPartition[]>([]);
  const [ram, setRam] = useState<ram[]>([]);
  const [gpuSlot, setGpuSlot] = useState<gpuSlot[]>([]);

  // setUserId(loggedInUserId);


  useEffect(() => {
    const verifyUser = async () => {
      const result = await checkAuth(["User"]); // ✅ Only allow 'User' role here
      if (!result.authorized) {
        router.replace(result.redirect || "/login");
      } else {
        setAuthLoading(false);
      }
    };

    verifyUser();
  }, [router]);

  // API Base URL
  // const API_BASE_URL = `${process.env.NEXT_PUBLIC_DGX_API_URL} + /instancerequest`;
  const API_BASE_URL = `${process.env.NEXT_PUBLIC_DGX_API_URL}/instancerequest`;


  const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  };

  const getInstanceRequests = async () => {
    try {
      // const data = await fetchAPI('/getInstanceRequests');
      console.log("Instance Request=");
    } catch (error) {
      console.error("Error fetching instance requests:", error);
    }
  };

  const getUserTypes = async () => {
    try {
      const data = await fetchAPI("/getUserTypes");
      setUserType(data);
    } catch (error) {
      console.error("Error fetching user types:", error);
      showErrorSnackbarFunc("Failed to load user types");
    }
  };

  const getTimeSlots = async () => {
    try {
      const data = await fetchAPI("/getTimeSlots");
      setTimeSlot(data);
    } catch (error) {
      console.error("Error fetching time slots:", error);
      showErrorSnackbarFunc("Failed to load time slots");
    }
  };

  const getImages = async () => {
    try {
      const data = await fetchAPI("/getImages");
      setCustomImage(data);
    } catch (error) {
      console.error("Error fetching images:", error);
      showErrorSnackbarFunc("Failed to load images");
    }
  };

  const getCPUs = async () => {
    try {
      const data = await fetchAPI("/getCpus");
      setCpu(data);
    } catch (error) {
      console.error("Error fetching CPUs:", error);
      showErrorSnackbarFunc("Failed to load CPUs");
    }
  };

  const getStatus = async () => {
    try {
      // const data = await fetchAPI('/getStatuses');
      console.log("Status=");
      // setStatus(data);
      // for (let i = 0; i < data.length; i++) {
      //   if (data[i].status_name === "Pending") {
      //     formData.statusId = data[i].id.toString();
      //     break;
      //   }
      // }
    } catch (error) {
      console.error("Error fetching statuses:", error);
      showErrorSnackbarFunc("Failed to load statuses");
    }
  };

  const getGPUSlots = async () => {
    try {
      const data = await fetchAPI("/getGpus");
      setGpuSlot(data);
    } catch (error) {
      console.error("Error fetching GPU partitions:", error);
      showErrorSnackbarFunc("Failed to load GPU partitions");
    }
  };

  const getRam = async () => {
    try {
      const data = await fetchAPI("/getRams");
      setRam(data);
    } catch (error) {
      console.error("Error fetching RAM options:", error);
      showErrorSnackbarFunc("Failed to load RAM options");
    }
  };

  const getGPUPartition = async () => {
    try {
      const data = await fetchAPI("/getGpuPartition");
      setGpuPartition(data);
    } catch (error) {
      console.error("Error fetching GPU vendors:", error);
      showErrorSnackbarFunc("Failed to load GPU vendors");
    }
  };

  const fetchUserProfile = useCallback(async () => {
    try {
      // const data = await fetchAPI('/users/getProfile');
      // setUserId(data.id);
      // console.log("✅ User Profile:", data.id);
    } catch (err) {
      console.error("❌ Error fetching user profile:", err);
      showErrorSnackbarFunc("Failed to load user profile");
    }
  }, []);



  const saveInstanceRequest = async () => {
    try {
      /* -------------------- VALIDATE TIME SLOTS -------------------- */
      for (const date of formData.selectedDates) {
        const slots =
          formData.dateTimeSlots?.[date]?.selectedSlots || [];

        if (slots.length === 0) {
          throw new Error(
            // `Please select time slots for ${new Date(
            //   date
            // ).toLocaleDateString()}`
            `Please select time slots for ${formatDateDDMMYYYY(date)}`
          );
        }
      }

      /* -------------------- REQUIRED FIELD VALIDATION -------------------- */
      if (
        // !userId ||
        !formData.cpuId ||
        !formData.ramId ||
        !formData.userTypeId ||
        !formData.gpuPartitionId
      ) {
        throw new Error("Please fill all required configuration fields");
      }

      /* -------------------- PAYLOAD -------------------- */
      const payload = {
        user_id: loggedInUserId,
        remarks: "",
        image_id: Number(formData.customImageId) || 1,
        cpu_id: Number(formData.cpuId),
        gpu_partition_id: Number(formData.gpuPartitionId),
        ram_id: Number(formData.ramId),
        gpu_vendor_id: Number(formData.gpuSlotId) || 1,
        gpu_id: 1,
        selected_date:
          formData.selectedDates?.[0]?.split("T")[0] ||
          new Date().toISOString().split("T")[0],
        work_description: formData.workDescription || "",
        status_id: Number(formData.statusId) || 1,
        storage_volume: Number(formData.storageVolume) || 10,
        user_type_id: Number(formData.userTypeId),
        login_id: "",
        password: "",
        access_link: "",
        is_access_granted: false,
        additional_information: "",
        created_by: loggedInUserId,
      };

      console.log("Instance Request Payload:", payload);

      /* -------------------- API CALL -------------------- */
      // const response = await fetchAPI("/saveInstanceRequest", {
      //   method: "POST",
      //   body: JSON.stringify(payload),
      // });

      const response = await fetchAPI("/instanceRequests", {  // Changed from "/saveInstanceRequest"
        method: "POST",
        body: JSON.stringify(payload),
      });

      console.log("Save response:", response);

      /* -------------------- SUCCESS HANDLING -------------------- */
      if (!response?.instance_request_id) {
        throw new Error("Instance request ID not returned from server");
      }

      await saveUserTimeSlots(response.instance_request_id);
      showSuccessSnackbar();
      handleReset();
    } catch (error: any) {
      console.error("Create Instance Request Error:", error);
      showErrorSnackbarFunc(
        error.message || "Failed to submit instance request"
      );
    }
  };



  const floatCondition = (name: keyof FormData, value: any) =>
    value || (errors[name] && focusedField === name);

  interface userType {
    user_type_id: number | string;
    user_type: string;
  }

  interface customImage {
    image_id: number | string;
    image_name: string;
  }

  interface timeSlot {
    time_slot_id: number | string;
    time_slot: string;
  }

  interface cpu {
    cpu_id: number | string;
    number_of_cpu: string;
  }

  interface status {
    status_id: number | string;
    status_name: string;
  }

  interface gpuPartition {
    gpu_partition_id: number | string;
    gpu_partition: string;
  }

  interface ram {
    ram_id: number | string;
    ram: string;
  }

  interface gpuSlot {
    gpu_id: number | string;
    gpu_vendor: string;
  }

  // Validation function
  const validateField = (name: keyof FormData, value: any) => {
    console.log("Validating field:", name, "with value:", value);
    let error = "";

    switch (name) {
      case "userTypeId":
        if (!value || value === "") {
          error = "Please select a User Type";
        }
        break;


      case "selectedDates":
  const dates = formData.selectedDates || [];
  if (dates.length === 0) {
    error = " ";
  } else {
    // Skip past date validation in edit mode (when instance_id is present in URL)
    const isEditMode = !!searchParams.get("id");
    if (!isEditMode) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const hasPastDate = dates.some((date) => {
        const dateObj = new Date(date);
        return dateObj < today;
      });

      if (hasPastDate) {
        error = "One or more dates are in the past";
      }
    }
  }
  break;

      case "customImageId":
        if (!value || value === "") {
          error = "Please select an Image";
        }
        break;

      case "cpuId":
        if (!value || value === "") {
          error = "Please select CPU";
        }
        break;

      case "gpuPartitionId":
        if (!value || value === "") {
          error = "Please select Number of GPUs";
        }
        break;

      case "storageVolume":
        if (!value || value === "") {
          // error = 'Storage Volume is required';
          setFormData((prev) => ({ ...prev, [name]: "10" }));
        } else {
          const numValue = parseInt(value);
          if (isNaN(numValue) || numValue < 10 || numValue > 150) {
            error = "Storage Volume range 10GB-150GB";
          }
        }
        break;

      case "ramId":
        if (!value || value === "") {
          error = "Please select RAM";
        }
        break;

      case "gpuSlotId":
        if (!value || value === "") {
          error = "Please select GPU Vendor";
        }
        break;

      case "workDescription":
        if (!value || value.trim() === "") {
          error = "Work Description is required";
        }
        break;

      case "selectedSlots":
        if (!value || value.length === 0) {
          error = "Please select time slot";
        } else {
          // Reconstruct ranges from the current value being validated
          // const indices = value
          //   .map((id: string) => getSlotIndex(id))
          //   .sort((a: number, b: number) => a - b);
          const indices = value
            .map((id: string) => getSlotIndex(id))
            .filter((index: number) => index !== -1)
            .sort((a: number, b: number) => a - b);
          const ranges: TimeSlotRange[] = [];
          if (indices.length > 0) {
            let rangeStart = indices[0];
            let rangeEnd = indices[0];
            for (let i = 1; i < indices.length; i++) {
              if (indices[i] === rangeEnd + 1) {
                rangeEnd = indices[i];
              } else {
                ranges.push({ start: rangeStart, end: rangeEnd });
                rangeStart = indices[i];
                rangeEnd = indices[i];
              }
            }
            ranges.push({ start: rangeStart, end: rangeEnd });
          }
          // Check if all ranges have at least 2 consecutive slots
          const hasSingleSlotRange = ranges.some(
            (range) => range.start === range.end
          );
          if (hasSingleSlotRange) {
            error =
              "Each time slot range must have at least 2 consecutive slots";
          }
        }
        break;

      default:
        break;
    }

    return error;
  };

  // Handle input changes with validation
  const handleInputChange = (name: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error if field is being corrected
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleBlur = (name: keyof FormData) => {
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Validate field on blur
    const error = validateField(name, formData[name]);
    if (error) {
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };


  const validateForm = () => {
    const newErrors: ErrorsType = {};
    let isValid = true;

    // First validate non-time-slot fields
    (Object.keys(formData) as Array<keyof FormData>).forEach((field) => {
      if (field !== "selectedSlots" && field !== "selectedRanges") {
        const error = validateField(field, formData[field]);
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      }
    });

    // Then validate time slots for each selected date
    if (formData.selectedDates.length === 0) {
      newErrors.selectedDates = " ";
      isValid = false;
    } else {
      for (const date of formData.selectedDates) {
        const dateSlots = formData.dateTimeSlots[date]?.selectedSlots || [];
        if (dateSlots.length === 0) {
          // newErrors.selectedSlots = `Please select time slots for ${new Date(
          //   date
          // ).toLocaleDateString()}`;
          newErrors.selectedSlots = `Please select time slots for ${formatDateDDMMYYYY(date)}`;
          isValid = false;
          break;
        }



        // Validate that slots form consecutive ranges (each range is consecutive, but multiple ranges are allowed)
        const indices = dateSlots
          .map((id) => getSlotIndex(id))
          .filter((index) => index !== -1) // Filter out invalid indices
          .sort((a, b) => a - b);

        // Build ranges from indices
        const ranges: TimeSlotRange[] = [];
        if (indices.length > 0) {
          let rangeStart = indices[0];
          let rangeEnd = indices[0];

          for (let i = 1; i < indices.length; i++) {
            if (indices[i] === rangeEnd + 1) {
              rangeEnd = indices[i];
            } else {
              ranges.push({ start: rangeStart, end: rangeEnd });
              rangeStart = indices[i];
              rangeEnd = indices[i];
            }
          }
          ranges.push({ start: rangeStart, end: rangeEnd });
        }

        // Check if any range has only a single slot (not allowed)
        const hasSingleSlotRange = ranges.some(range => range.start === range.end);
        if (hasSingleSlotRange) {
          // newErrors.selectedSlots = `Time slots for ${new Date(
          //   date
          // ).toLocaleDateString()} must have at least 2 consecutive slots in each range`;
          newErrors.selectedSlots = `Time slots for ${formatDateDDMMYYYY(date)} must have at least 2 consecutive slots in each range`;
          isValid = false;
          break;
        }

        // if (hasGap) {
        //   newErrors.selectedSlots = `Time slots for ${new Date(
        //     date
        //   ).toLocaleDateString()} must be consecutive without gaps`;
        //   isValid = false;
        //   break;
        // }
      }
    }

    setErrors(newErrors);
    setTouched(
      (Object.keys(formData) as Array<keyof FormData>).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {} as Record<keyof FormData, boolean>
      )
    );

    return isValid;
  };


  const validateDateRange = () => {
    const errors: { start?: string; end?: string } = {};

    if (dateSelectionMode === "range") {
      if (!dateRange.start) {
        errors.start = "Start date is required";
      }
      if (!dateRange.end) {
        errors.end = "End date is required";
      }
      if (dateRange.start && dateRange.end && new Date(dateRange.end) < new Date(dateRange.start)) {
        errors.end = "End date must be after start date";
      }
    }

    setDateRangeErrors(errors);
    return Object.keys(errors).length === 0;
  };


  const showSuccessSnackbar = () => {
    setShowSnackbar(true);
    setTimeout(() => {
      setShowSnackbar(false);
    }, 1000); // Keep visible for 1 second
    setTimeout(() => {
      router.push("/user");
    }, 1200); // Redirect after 1.2 seconds total
  };

  useEffect(() => {
    getInstanceRequests();
    getStatus();
    getUserTypes();
    getTimeSlots();
    getImages();
    getCPUs();
    getGPUPartition();
    getRam();
    getGPUSlots();
  }, []);



  const isSlotSelected = (slotId: string) => {
    return formData.selectedSlots.includes(slotId);
  };

  // Replace the existing state for selectedSlots with this structure:
  interface TimeSlotRange {
    start: number;
    end: number;
  }

  // Update FormData interface:
  interface FormData {
    userTypeId: string;
    selectedDate: string;
    customImageId: string;
    cpuId: string;
    statusId: string;
    gpuPartitionId: string;
    storageVolume: string;
    ramId: string;
    gpuSlotId: string;
    workDescription: string;
    selectedSlots: string[]; // Keep as array of slot IDs
    selectedRanges: TimeSlotRange[]; // Add this for tracking ranges
  }

  // const handleReset = () => {
  //   if (instance_id) {
  //     getInstanceRequestByUserId();
  //     return;
  //   }

  //   if (!instance_id) {
  //     setFormData({
  //       userTypeId: "",
  //       selectedDate: "",
  //       dateTimeSlots: {},
  //       selectedDates: [],
  //       customImageId: "",
  //       cpuId: "",
  //       statusId: "",
  //       gpuPartitionId: "",
  //       storageVolume: "10",
  //       ramId: "",
  //       gpuSlotId: "",
  //       workDescription: "",
  //       selectedSlots: [],
  //       selectedRanges: [],
  //     });
  //     setSelectedDate("");
  //     setErrors({});
  //     setTouched({});
  //   }
  // };

  const handleReset = () => {
    if (instance_id) {
      getInstanceRequestByUserId();
      return;
    }

    if (!instance_id) {
      setFormData({
        userTypeId: "",
        selectedDate: "",
        dateTimeSlots: {},
        selectedDates: [],
        customImageId: "",
        cpuId: "",
        statusId: "",
        gpuPartitionId: "",
        storageVolume: "10",
        ramId: "",
        gpuSlotId: "",
        workDescription: "",
        selectedSlots: [],
        selectedRanges: [],
      });
      setSelectedDate("");
      setErrors({});
      setTouched({});

      // ✅ Clear booked slots on reset
      setUserTimeSlot([]);
    }
  };

  // Replace the useEffect that handles instance_id with this:

  useEffect(() => {
    if (instance_id && timeSlot.length > 0) {
      // Only fetch instance data after timeSlot is loaded
      getInstanceRequestByUserId();
    }
  }, [instance_id, timeSlot.length]); // Add timeSlot.length as dependency


  // Update FormData interface:
  interface FormData {
    userTypeId: string;
    selectedDate: string;
    customImageId: string;
    cpuId: string;
    statusId: string;
    gpuPartitionId: string;
    storageVolume: string;
    ramId: string;
    gpuSlotId: string;
    workDescription: string;
    selectedSlots: string[]; // Keep as array of slot IDs
    selectedRanges: TimeSlotRange[]; // Add this for tracking ranges
  }


  // Update initial form state:
  const [formData, setFormData] = useState<FormData>({
    userTypeId: "",
    selectedDate: "",
    selectedDates: [],
    customImageId: "",
    cpuId: "",
    dateTimeSlots: {},
    statusId: "",
    gpuPartitionId: "",
    storageVolume: "10",
    ramId: "",
    gpuSlotId: "",
    workDescription: "",
    selectedSlots: [],
    selectedRanges: [],
  });



  // Update selectedSlots and selectedRanges when selectedDate changes
  useEffect(() => {
    console.log(`📅 selectedDate changed to: ${selectedDate}`);
    console.log(`📅 formData.dateTimeSlots:`, formData.dateTimeSlots);

    if (selectedDate && formData.dateTimeSlots && Object.keys(formData.dateTimeSlots).length > 0) {
      const dateSlots = formData.dateTimeSlots[selectedDate];
      if (dateSlots) {
        console.log(`✅ Syncing slots for ${selectedDate}:`, dateSlots);
        setFormData(prev => ({
          ...prev,
          selectedSlots: dateSlots.selectedSlots || [],
          selectedRanges: dateSlots.selectedRanges || []
        }));
      } else {
        console.warn(`⚠️ No slots found for date ${selectedDate}`);
      }
    }
  }, [selectedDate, formData.dateTimeSlots]);

  // Success Snackbar Component
  const SuccessSnackbar = () => (
    <div
      className={`fixed inset-x-0 bottom-5 flex justify-center z-50 transition-all duration-500 ${showSnackbar
        ? "transform translate-y-0 opacity-100"
        : "transform translate-y-full opacity-0"
        }`}
    >
      <div
        className="rounded-lg shadow-lg px-5 py-3 flex items-center space-x-3 text-sm font-medium"
        style={{ backgroundColor: "#76B900", color: "white" }}
      >
        <CheckCircle className="w-6 h-4" style={{ color: "white" }} />
        <div>
          {instance_id ? (
            <p className=" text-sm font-medium">Request Updated Successfully</p>
          ) : (
            <p className="text-sm font-medium">
              Request Submitted Successfully
            </p>
          )}
        </div>
      </div>
    </div>
  );

  // Add this useEffect for global mouse up handling (after existing useEffects)
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        setDragStart(null);
        setDragEnd(null);
        setDragMode(null); // Reset drag mode
      }
    };

    document.addEventListener("mouseup", handleGlobalMouseUp);
    return () => document.removeEventListener("mouseup", handleGlobalMouseUp);
  }, [isDragging]);

  // Helper functions (add these before your existing functions)
  // const getSlotIndex = (slotId: any) => {
  //   return timeSlot.findIndex((slot) => slot.time_slot_id === slotId);
  // };

  const getSlotIndex = (slotId: any) => {
    return timeSlot.findIndex((slot) => String(slot.time_slot_id) === String(slotId));
  };

  // Helper function to format date as dd-mm-yyyy
  const formatDateDDMMYYYY = (date: string | Date): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const areSlotsConsecutive = (slots: any) => {
    if (slots.length <= 1) return true;

    // const indices = slots
    //   .map((slotId: any) => getSlotIndex(slotId))
    //   .sort((a: number, b: number) => a - b);

    const indices = slots
      .map((slotId: any) => getSlotIndex(slotId))
      .filter((index: number) => index !== -1)
      .sort((a: number, b: number) => a - b);

    for (let i = 1; i < indices.length; i++) {
      if (indices[i] !== indices[i - 1] + 1) {
        return false;
      }
    }
    return true;
  };

  const getContinuousRange = (startSlotId: string, endSlotId: string) => {
    const startIndex = getSlotIndex(startSlotId);
    const endIndex = getSlotIndex(endSlotId);

    const minIndex = Math.min(startIndex, endIndex);
    const maxIndex = Math.max(startIndex, endIndex);

    const range = [];
    for (let i = minIndex; i <= maxIndex; i++) {
      if (timeSlot[i] && !isSlotBooked(timeSlot[i].time_slot_id.toString())) {
        range.push(timeSlot[i].time_slot_id);
      }
    }
    return range;
  };

  // Replace the existing state for selectedSlots with this structure:
  interface TimeSlotRange {
    start: number;
    end: number;
  }





  // Helper function to convert ranges to slot IDs
  const rangesToSlotIds = (ranges: TimeSlotRange[]): string[] => {
    const slotIds: string[] = [];
    ranges.forEach((range) => {
      for (let i = range.start; i <= range.end; i++) {
        if (timeSlot[i]) {
          slotIds.push(timeSlot[i].time_slot_id.toString());
        }
      }
    });
    return slotIds;
  };

  // Helper function to check if ranges overlap
  const rangesOverlap = (
    range1: TimeSlotRange,
    range2: TimeSlotRange
  ): boolean => {
    return range1.start <= range2.end && range2.start <= range1.end;
  };

  // Helper function to merge overlapping or adjacent ranges
  const mergeRanges = (ranges: TimeSlotRange[]): TimeSlotRange[] => {
    if (ranges.length === 0) return [];

    const sorted = [...ranges].sort((a, b) => a.start - b.start);
    const merged: TimeSlotRange[] = [sorted[0]];

    for (let i = 1; i < sorted.length; i++) {
      const current = sorted[i];
      const lastMerged = merged[merged.length - 1];

      if (current.start <= lastMerged.end + 1) {
        lastMerged.end = Math.max(lastMerged.end, current.end);
      } else {
        merged.push(current);
      }
    }

    return merged;
  };


  



  const handleDateAdd = (dateValue: string) => {
  if (!dateValue) return;

  const dateObj = new Date(dateValue);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Skip past date validation in edit mode (when instance_id is set)
  if (!instance_id && dateObj < today) {
    setErrors((prev) => ({
      ...prev,
      selectedDates: "Date cannot be in the past",
    }));
    return;
  }

  const currentDates = formData.selectedDates || [];

  if (currentDates.includes(dateValue)) {
    setErrors((prev) => ({
      ...prev,
      selectedDates: "This date is already selected",
    }));
    return;
  }

  const updatedDateTimeSlots = {
    ...formData.dateTimeSlots,
    [dateValue]: {
      selectedSlots: [],
      selectedRanges: []
    }
  };

  setFormData(prev => ({
    ...prev,
    selectedDates: [...currentDates, dateValue].sort(),
    dateTimeSlots: updatedDateTimeSlots,
    selectedSlots: [],
    selectedRanges: []
  }));

  setErrors((prev) => ({ ...prev, selectedDates: "" }));
  setSelectedDate(dateValue);
};



  const handleDateRemove = (dateToRemove: string) => {
    const updatedDates = formData.selectedDates.filter(
      (date) => date !== dateToRemove
    );
    const updatedDateTimeSlots = { ...formData.dateTimeSlots };
    delete updatedDateTimeSlots[dateToRemove];

    setFormData((prev) => ({
      ...prev,
      selectedDates: updatedDates,
      dateTimeSlots: updatedDateTimeSlots,
      selectedSlots: selectedDate === dateToRemove ? [] : prev.selectedSlots,
      selectedRanges: selectedDate === dateToRemove ? [] : prev.selectedRanges,
    }));

    // ✅ Clear booked slots when no dates are selected
    if (updatedDates.length === 0) {
      setUserTimeSlot([]);
    }
  };

  // Update the submit function
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();


    // Validate date range if in range mode
    if (dateSelectionMode === "range") {
      if (!validateDateRange()) {
        return;
      }
    }

    if (!validateForm()) {
      return;
    }

    // Check for conflicts on all selected dates before submission
    for (const date of formData.selectedDates) {
      const conflicts = await checkTimeSlotConflicts(
        date,
        formData.selectedSlots
      );
      if (conflicts.length > 0) {
        showErrorSnackbarFunc(
          `Some time slots are already booked for date ${formatDateDDMMYYYY(date)}`
        );
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (instance_id) {
        await updateInstanceRequest();
      } else {
        await saveInstanceRequest();
      }
    } catch (error) {
      console.error("Submission failed:", error);
      showErrorSnackbarFunc(
        "Error submitting request. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };


  // First, update the DateTimeSlots interface to track slots per date
  interface DateTimeSlots {
    [date: string]: {
      selectedSlots: string[];
      selectedRanges: TimeSlotRange[];
    };
  }

  // Add this component to display selected slots for each date
  const SelectedDateSlots = () => {
    return (
      <div className="mt-4">
        <h3 className="text-sm font-small mb-2 text-gray-700">
          Selected Time Slots by Date:
        </h3>
        {formData.selectedDates.map((date) => {
          const dateSlots = formData.dateTimeSlots[date]?.selectedSlots || [];
          const isCurrentDate = date === selectedDate;

          return (
            <div
              key={date}
              className={`mb-1 p-1 border rounded-sm transition-all ${isCurrentDate
                ? "border-green-500 bg-green-50"
                : "border-gray-200"
                }`}
              onClick={() => setSelectedDate(date)}
              style={{ cursor: "pointer" }}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="font-small text-sm text-gray-700">
                  {/* {new Date(date).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })} */}
                  {formatDateDDMMYYYY(date)}
                </div>
                <div className="text-xs text-gray-500">
                  {dateSlots.length} slots selected
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {dateSlots.map((slotId) => {
                  const slot = timeSlot.find(
                    (ts) => ts.time_slot_id.toString() === slotId
                  );
                  return (
                    <span
                      key={slotId}
                      className={`px-1 py-1 rounded-sm text-xs ${isCurrentDate
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {slot?.time_slot}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };



  // useEffect(() => {
  //   if (selectedDate) {
  //     // Load existing slots for the selected date
  //     const dateSlots = formData.dateTimeSlots[selectedDate];
  //     console.log(`📅 Date switched to ${selectedDate}, loading slots:`, dateSlots?.selectedSlots);

  //     setFormData((prev) => ({
  //       ...prev,
  //       selectedSlots: dateSlots?.selectedSlots || [],
  //       selectedRanges: dateSlots?.selectedRanges || [],
  //     }));

  //     // Also load booked slots for this date
  //     getUserTimeSlots();
  //   }
  // }, [selectedDate, instance_id]);


  //   useEffect(() => {
  //   if (selectedDate) {
  //     // Load existing slots for the selected date
  //     const dateSlots = formData.dateTimeSlots[selectedDate];
  //     console.log(`📅 Date switched to ${selectedDate}, loading slots:`, dateSlots?.selectedSlots);

  //     setFormData((prev) => ({
  //       ...prev,
  //       selectedSlots: dateSlots?.selectedSlots || [],
  //       selectedRanges: dateSlots?.selectedRanges || [],
  //     }));

  //     // ✅ Use getUserTimeSlotsForDate instead of getUserTimeSlots
  //     getUserTimeSlotsForDate(selectedDate);
  //   }
  // }, [selectedDate, instance_id]);

  useEffect(() => {
    if (selectedDate) {
      // Load existing slots for the selected date
      const dateSlots = formData.dateTimeSlots[selectedDate];
      console.log(`📅 Date switched to ${selectedDate}, loading slots:`, dateSlots?.selectedSlots);

      setFormData((prev) => ({
        ...prev,
        selectedSlots: dateSlots?.selectedSlots || [],
        selectedRanges: dateSlots?.selectedRanges || [],
      }));

      // ✅ Use getUserTimeSlotsForDate instead of getUserTimeSlots
      getUserTimeSlotsForDate(selectedDate);
    } else {
      // ✅ Clear booked slots when no date is selected
      setUserTimeSlot([]);
    }
  }, [selectedDate, instance_id]);


  // New function to fetch user time slots with proper date parameter
  // const getUserTimeSlotsForDate = async (date: string) => {
  //   try {
  //     const params = new URLSearchParams();
  //     if (date) params.append('selectedDate', date);
  //     if (instance_id) params.append('excludeInstanceId', instance_id);

  //     const data = await fetchAPI(`/userTimeSlots?${params.toString()}`);
  //     setUserTimeSlot(data);
  //     console.log("📋 Booked slots for", date, ":", data);
  //   } catch (error) {
  //     console.error('Error fetching user time slots:', error);
  //     showErrorSnackbarFunc('Failed to load time slots');
  //   }
  // };

  const getUserTimeSlotsForDate = async (date: string) => {
    try {
      const params = new URLSearchParams();
      if (date) params.append('selectedDate', date);
      if (instance_id) params.append('excludeInstanceId', instance_id);

      const data = await fetchAPI(`/userTimeSlots?${params.toString()}`);

      // Ensure time_slot_id is properly typed
      const processedData = data.map((slot: any) => ({
        ...slot,
        time_slot_id: String(slot.time_slot_id) // Convert to string for consistency
      }));

      setUserTimeSlot(processedData);
      console.log("📋 Booked slots for", date, ":", processedData);
    } catch (error) {
      console.error('Error fetching user time slots:', error);
      showErrorSnackbarFunc('Failed to load time slots');
    }
  };




  // Update handleMouseDown function
  const handleMouseDown = (slotId: any, mode: any) => {
    if (formData.selectedDates.length === 0) {
      showErrorSnackbarFunc(
        "Please add at least one date before selecting time slots"
      );
      return;
    }

    if (!selectedDate || !formData.selectedDates.includes(selectedDate)) {
      showErrorSnackbarFunc("Please select a date first");
      return;
    }
    setDragStart(slotId);
    setDragMode(mode);
    setIsDragging(true);
  };

  // Update handleMouseEnter function
  const handleMouseEnter = async (slotId: any) => {
    if (!isDragging || isSlotBooked(slotId) || !dragMode || !selectedDate)
      return;

    setDragEnd(slotId);

    if (dragStart && dragStart !== slotId) {
      const startIndex = getSlotIndex(dragStart);
      const endIndex = getSlotIndex(slotId);
      const minIndex = Math.min(startIndex, endIndex);
      const maxIndex = Math.max(startIndex, endIndex);

      const draggedSlots: string[] = [];
      for (let i = minIndex; i <= maxIndex; i++) {
        if (timeSlot[i] && !isSlotBooked(timeSlot[i].time_slot_id.toString())) {
          draggedSlots.push(timeSlot[i].time_slot_id.toString());
        }
      }

      // Check for conflicts on the current working date
      const conflicts = await checkTimeSlotConflicts(
        selectedDate,
        draggedSlots
      );
      if (conflicts.length > 0) {
        setErrors((prev) => ({
          ...prev,
          selectedSlots: `Some selected time slots are already booked for ${new Date(
            selectedDate
          ).toLocaleDateString()}`,
        }));
        return;
      }

      // Get current slots for selected date
      const currentDateSlots =
        formData.dateTimeSlots[selectedDate]?.selectedSlots || [];
      let updatedSlots: string[];

      if (dragMode === "select") {
        updatedSlots = Array.from(
          new Set([...currentDateSlots, ...draggedSlots])
        );
      } else {
        updatedSlots = currentDateSlots.filter(
          (id) => !draggedSlots.includes(id)
        );
      }

      // Calculate new ranges
      // const indices = updatedSlots
      //   .map((id) => getSlotIndex(id))
      //   .sort((a, b) => a - b);



      const indices = updatedSlots
        .map((id) => getSlotIndex(id))
        .filter((index) => index !== -1)
        .sort((a, b) => a - b);



      const ranges: TimeSlotRange[] = [];

      if (indices.length > 0) {
        let rangeStart = indices[0];
        let rangeEnd = indices[0];

        for (let i = 1; i < indices.length; i++) {
          if (indices[i] === rangeEnd + 1) {
            rangeEnd = indices[i];
          } else {
            ranges.push({ start: rangeStart, end: rangeEnd });
            rangeStart = indices[i];
            rangeEnd = indices[i];
          }
        }
        ranges.push({ start: rangeStart, end: rangeEnd });
      }

      // Update formData with new selections for current date
      setFormData((prev) => ({
        ...prev,
        selectedSlots: updatedSlots,
        selectedRanges: ranges,
        dateTimeSlots: {
          ...prev.dateTimeSlots,
          [selectedDate]: {
            selectedSlots: updatedSlots,
            selectedRanges: ranges,
          },
        },
      }));
    }
  };

  // Update handleMouseUp function
  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
    setDragEnd(null);
    setDragMode(null);
  };

  const [dateRangeErrors, setDateRangeErrors] = useState<{
    start?: string;
    end?: string;
  }>({});

  // Add this helper function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };



  // const isSlotBooked = (slotId: string) => {
  //   // If in edit mode, don't consider slots from the current instance as booked
  //   return userTimeSlot.some(
  //     (uslot) =>
  //       uslot.time_slot_id === slotId &&
  //       (!instance_id || uslot.instance_request_id !== instance_id)
  //   );
  // };

  const isSlotBooked = (slotId: string) => {
    // If in edit mode, don't consider slots from the current instance as booked
    return userTimeSlot.some(
      (uslot) =>
        String(uslot.time_slot_id) === String(slotId) &&
        (!instance_id || uslot.instance_request_id !== instance_id)
    );
  };



  // Add these new state variables after other state declarations
  const [dateSelectionMode, setDateSelectionMode] = useState<
    "individual" | "range"
  >("individual");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });



  const handleDateRangeAdd = () => {
  if (!dateRange.start || !dateRange.end) {
    showErrorSnackbarFunc("Please select both start and end dates");
    return;
  }

  const startDate = new Date(dateRange.start);
  const endDate = new Date(dateRange.end);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Skip past date validation in edit mode (when instance_id is set)
  if (!instance_id && (startDate < today || endDate < today)) {
    setErrors((prev) => ({
      ...prev,
      selectedDates: "Dates cannot be in the past",
    }));
    return;
  }

  if (endDate < startDate) {
    setErrors((prev) => ({
      ...prev,
      selectedDates: "End date must be after start date",
    }));
    return;
  }

  const dates: string[] = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dateString = currentDate.toISOString().split("T")[0];
    if (!formData.selectedDates.includes(dateString)) {
      dates.push(dateString);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const updatedDateTimeSlots = { ...formData.dateTimeSlots };
  dates.forEach((date) => {
    updatedDateTimeSlots[date] = {
      selectedSlots: [],
      selectedRanges: [],
    };
  });

  setFormData((prev) => ({
    ...prev,
    selectedDates: [...prev.selectedDates, ...dates].sort(),
    dateTimeSlots: updatedDateTimeSlots,
  }));

  setErrors((prev) => ({ ...prev, selectedDates: "" }));

  dates.forEach(date => getUserTimeSlotsForDate(date));
};




const handleReplicateSlots = async (sourceDate?: string) => {
  setIsReplicating(true);
  try {
    const src = sourceDate || selectedDate;
    if (!src) {
      showErrorSnackbarFunc("No source date available to replicate from");
      return;
    }

    console.log("Replicating from date:", src);

    // Prefer the explicitly stored per-date slots, fallback to current working slots
    const sourceSlots =
      formData.dateTimeSlots[src]?.selectedSlots?.slice() ||
      formData.selectedSlots?.slice() ||
      [];

    if (sourceSlots.length === 0) {
      showErrorSnackbarFunc("No slots selected to replicate");
      setErrors((prev) => ({
        ...prev,
        selectedSlots: "No slots selected to replicate",
      }));
      return;
    }

    // Target dates are all selected dates except the source date
    const targetDates = formData.selectedDates.filter((date) => date !== src);
    if (targetDates.length === 0) {
      showErrorSnackbarFunc("No other dates to replicate to");
      return;
    }

    console.log("Target dates for replication:", targetDates);
    console.log("Source slots to replicate:", sourceSlots);

    // Check server-side conflicts for each target date
    const replicationPlan: { [date: string]: { skip: boolean; conflicts: string[] } } = {};
    let successfulDates: string[] = [];
    let skippedDates: string[] = [];

    for (const date of targetDates) {
      console.log(`Checking conflicts for date: ${date}`);
      const conflicts = await checkTimeSlotConflicts(date, sourceSlots);
      
      if (conflicts.length > 0) {
        // ANY conflict found - skip entire date
        skippedDates.push(date);
        replicationPlan[date] = {
          skip: true,
          conflicts: conflicts,
        };
        console.log(`⚠️  Conflicts found for ${date}. Skipping entire date:`, conflicts);
      } else {
        // No conflicts - replicate all slots to this date
        successfulDates.push(date);
        replicationPlan[date] = {
          skip: false,
          conflicts: [],
        };
        console.log(`✅ No conflicts for ${date} - replicating all slots`);
      }
    }

    // Build comprehensive error and warning message
    let errorMessage = ``;
    let hasSkipped = skippedDates.length > 0;

    if (hasSkipped) {
      // errorMessage = `  REPLICATION SUMMARY\n`;
      

      // Successfully replicated dates
      if (successfulDates.length > 0) {
        errorMessage += ` Successfully Replicated (${successfulDates.length}):\n`;
        successfulDates.forEach((date) => {
          errorMessage += `   📅 ${formatDateDDMMYYYY(date)}\n`;
        });
        errorMessage += `\n`;
      }

      // Skipped dates (due to any conflict)
      if (skippedDates.length > 0) {
        errorMessage += ` Skipped Due to Conflicts (${skippedDates.length}):\n`;
        skippedDates.forEach((date) => {
          const plan = replicationPlan[date];
          const conflictSlots = plan.conflicts
            .map((slotId) => {
              const slot = timeSlot.find((ts) => String(ts.time_slot_id) === String(slotId));
              return slot?.time_slot;
            })
            .filter(Boolean);
          
          errorMessage += `${formatDateDDMMYYYY(date)}\n`;
          errorMessage += `Already booked: ${conflictSlots.join(", ")}\n`;
        });
        errorMessage += `\n`;
      }

      // errorMessage += `═══════════════════════════════════════════════════\n`;

      // Show error/warning message
      setErrors((prev) => ({
        ...prev,
        selectedSlots: errorMessage,
      }));

      setTouched((prev) => ({
        ...prev,
        selectedSlots: true,
      }));
    }

    // If all dates have conflicts, stop here
    if (successfulDates.length === 0) {
      showErrorSnackbarFunc(` Cannot replicate - all target dates have conflicts`);
      return;
    }

    // Build ranges for the sourceSlots
    const indices = sourceSlots
      .map((id) => getSlotIndex(id))
      .filter((i) => i >= 0)
      .sort((a, b) => a - b);

    const ranges: TimeSlotRange[] = [];
    if (indices.length > 0) {
      let rangeStart = indices[0];
      let rangeEnd = indices[0];
      for (let i = 1; i < indices.length; i++) {
        if (indices[i] === rangeEnd + 1) {
          rangeEnd = indices[i];
        } else {
          ranges.push({ start: rangeStart, end: rangeEnd });
          rangeStart = indices[i];
          rangeEnd = indices[i];
        }
      }
      ranges.push({ start: rangeStart, end: rangeEnd });
    }

    console.log("Calculated ranges:", ranges);

    // Proceed with replication only to successful dates
    setFormData((prev) => {
      const updatedDateTimeSlots = { ...prev.dateTimeSlots };
      
      // Replicate only to successful dates (non-conflicting)
      successfulDates.forEach((date) => {
        updatedDateTimeSlots[date] = {
          selectedSlots: [...sourceSlots],
          selectedRanges: ranges.map((r) => ({ start: r.start, end: r.end })),
        };
      });

      // If the current selectedDate is one of the successful dates, update current working selection
      let updatedSelectedSlots = prev.selectedSlots;
      let updatedSelectedRanges = prev.selectedRanges;

      if (selectedDate && successfulDates.includes(selectedDate)) {
        updatedSelectedSlots = [...sourceSlots];
        updatedSelectedRanges = ranges.map((r) => ({ start: r.start, end: r.end }));
      }

      return {
        ...prev,
        dateTimeSlots: updatedDateTimeSlots,
        selectedSlots: updatedSelectedSlots,
        selectedRanges: updatedSelectedRanges,
      };
    });

    // Show appropriate success/warning message
    if (successfulDates.length > 0 && skippedDates.length > 0) {
      // Mixed result - some replicated, some skipped
      showErrorSnackbarFunc(`Replicated to ${successfulDates.length}/${targetDates.length} dates. ${skippedDates.length} date${skippedDates.length > 1 ? "s" : ""} skipped due to conflicts`);
    } else if (successfulDates.length === targetDates.length) {
      // All successful
      showSuccessSnackbarFunc(`Slots replicated to all ${successfulDates.length} date${successfulDates.length > 1 ? "s" : ""}`);
    }
  } catch (error) {
    console.error("Error replicating slots:", error);
    const errorMsg =
      error instanceof Error
        ? error.message
        : "Failed to replicate time slots. Please try again.";
    showErrorSnackbarFunc(errorMsg);
    setErrors((prev) => ({ ...prev, selectedSlots: errorMsg }));
  } finally {
    setIsReplicating(false);
  }
};


  const handleTimeSlotClick = async (slotId: string) => {
    // Initial validation checks
    if (formData.selectedDates.length === 0) {
      showErrorSnackbarFunc(
        "Please add at least one date before selecting time slots"
      );
      return;
    }

    if (!selectedDate || !formData.selectedDates.includes(selectedDate)) {
      showErrorSnackbarFunc("Please select a date first");
      return;
    }

    // Check if slot is booked by others (allow if in edit mode)
    if (isSlotBooked(slotId) && !instance_id) {
      return;
    }

    const currentDateSlots =
      formData.dateTimeSlots[selectedDate]?.selectedSlots || [];
    const isCurrentlySelected = currentDateSlots.includes(slotId);
    let newSelectedSlots: string[];

    if (isCurrentlySelected) {
      // Remove slot if already selected
      newSelectedSlots = currentDateSlots.filter((id) => id !== slotId);
    } else {
      // Add new slot
      newSelectedSlots = [...currentDateSlots, slotId];

      // Check for conflicts only with other instances' slots
      const conflicts = await checkTimeSlotConflicts(selectedDate, [slotId]);
      if (conflicts.length > 0) {
        setErrors((prev) => ({
          ...prev,
          selectedSlots: `Time slot is already booked by another user`,
        }));
        return;
      }
    }




    const indices = newSelectedSlots
      .map((id) => getSlotIndex(id))
      .filter((index) => index !== -1)
      .sort((a, b) => a - b);



    const ranges: TimeSlotRange[] = [];

    if (indices.length > 0) {
      let rangeStart = indices[0];
      let rangeEnd = indices[0];

      for (let i = 1; i < indices.length; i++) {
        if (indices[i] === rangeEnd + 1) {
          rangeEnd = indices[i];
        } else {
          ranges.push({ start: rangeStart, end: rangeEnd });
          rangeStart = indices[i];
          rangeEnd = indices[i];
        }
      }
      ranges.push({ start: rangeStart, end: rangeEnd });
    }

    // Update form data with new selections
    setFormData((prev) => ({
      ...prev,
      selectedSlots: newSelectedSlots,
      selectedRanges: ranges,
      dateTimeSlots: {
        ...prev.dateTimeSlots,
        [selectedDate]: {
          selectedSlots: newSelectedSlots,
          selectedRanges: ranges,
        },
      },
    }));

    // Clear any existing errors
    setErrors((prev) => ({
      ...prev,
      selectedSlots: "",
    }));

    // Show replicate popup if this is the first slot selected
    // and there are other dates selected
    if (
      !isCurrentlySelected &&
      currentDateSlots.length === 0 &&
      formData.selectedDates.length > 1 &&
      !showReplicatePopup
    ) {
      setShowReplicatePopup(true);
    }
  };


  const showSuccessSnackbarFunc = (message: string) => {
    setSuccessMessage(message);
    setSuccessSnackbar(true);
    setTimeout(() => {
      setSuccessSnackbar(false);
      setSuccessMessage("");
    }, 5000);
  };

  const showErrorSnackbarFunc = (message: string) => {
    setErrorMessage(message);
    setShowErrorSnackbar(true);
    setTimeout(() => {
      setShowErrorSnackbar(false);
      setErrorMessage("");
    }, 8000);
  };



  // const getUserTimeSlots = async () => {
  //   try {
  //     const params = new URLSearchParams();
  //     if (selectedDate) params.append('selectedDate', selectedDate);
  //     if (instance_id) params.append('excludeInstanceId', instance_id);

  //     const data = await fetchAPI(`/userTimeSlots?${params.toString()}`);
  //     setUserTimeSlot(data);
  //   } catch (error) {
  //     console.error('Error fetching user time slots:', error);
  //     showErrorSnackbarFunc('Failed to load time slots');
  //   }
  // };


  const getUserTimeSlots = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedDate) params.append('selectedDate', selectedDate);
      if (instance_id) params.append('excludeInstanceId', instance_id);

      const data = await fetchAPI(`/userTimeSlots?${params.toString()}`);

      // Ensure time_slot_id is properly typed
      const processedData = data.map((slot: any) => ({
        ...slot,
        time_slot_id: String(slot.time_slot_id) // Convert to string for consistency
      }));

      setUserTimeSlot(processedData);
      console.log('Booked slots for', selectedDate, ':', processedData);
    } catch (error) {
      console.error('Error fetching user time slots:', error);
      showErrorSnackbarFunc('Failed to load time slots');
    }
  };




  // Also ensure selected_date is being sent with dates in time slots
  const saveUserTimeSlots = async (instanceRequestId: string) => {
    try {
      const timeSlots: any[] = [];

      Object.entries(formData.dateTimeSlots).forEach(
        ([date, { selectedSlots }]) => {
          if (selectedSlots && selectedSlots.length > 0) {
            selectedSlots.forEach((slotId) => {
              timeSlots.push({
                instance_request_id: instanceRequestId,
                time_slot_id: slotId,
                selected_date: date,  // This is correct - each slot has its own date
              });
            });
          }
        }
      );

      // Ensure timeSlots is not empty
      if (timeSlots.length === 0) {
        throw new Error('No time slots to save');
      }

      await fetchAPI('/userTimeSlots/bulk', {
        method: 'POST',
        body: JSON.stringify({
          timeSlots,
          userId: userId || loggedInUserId  // Pass actual user ID
        }),
      });

      console.log('Time slots saved successfully:', timeSlots);
    } catch (error) {
      console.error('Error saving time slots:', error);
      throw error;
    }
  };

  // 3. deleteUserTimeSlots - CORRECTED PARAM NAME
  const deleteUserTimeSlots = async (instanceRequestId: string) => {
    try {
      await fetchAPI(`/userTimeSlots?instanceRequestId=${instanceRequestId}`, {
        method: 'DELETE',
      });
      console.log('Time slots deleted successfully');
    } catch (error) {
      console.error('Error deleting time slots:', error);
      throw error;
    }
  };

  // 4. checkTimeSlotConflicts - CORRECTED PARAM NAMES
  // const checkTimeSlotConflicts = async (date: string, slotIds: string[]) => {
  //   try {
  //     const params = new URLSearchParams();
  //     params.append('date', date);
  //     if (instance_id) params.append('instanceId', instance_id);

  //     const data = await fetchAPI(`/userTimeSlots/conflicts?${params.toString()}`);

  //     const conflicts = slotIds.filter((slotId) =>
  //       data.some((existing: any) => existing.time_slot_id === slotId)
  //     );
  //     return conflicts;
  //   } catch (error) {
  //     console.error('Error checking time slot conflicts:', error);
  //     return [];
  //   }
  // };

  const checkTimeSlotConflicts = async (date: string, slotIds: string[]) => {
  try {
    const params = new URLSearchParams();
    params.append('date', date);
    if (instance_id) params.append('instanceId', instance_id);

    const data = await fetchAPI(`/userTimeSlots/conflicts?${params.toString()}`);

    const conflicts = slotIds.filter((slotId) =>
      data.some((existing: any) => String(existing.time_slot_id) === String(slotId))
    );
    return conflicts;
  } catch (error) {
    console.error('Error checking time slot conflicts:', error);
    return [];
  }
};


  // Helper function to detect if dates form a consecutive range
const isConsecutiveDateRange = (dates: string[]): boolean => {
  if (dates.length <= 1) return false;
  
  const sortedDates = [...dates].sort();
  const firstDate = new Date(sortedDates[0]);
  
  for (let i = 1; i < sortedDates.length; i++) {
    const currentDate = new Date(sortedDates[i]);
    const previousDate = new Date(sortedDates[i - 1]);
    
    // Check if current date is exactly 1 day after previous date
    const diffTime = currentDate.getTime() - previousDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
    if (diffDays !== 1) {
      return false;
    }
  }
  
  return true;
};


  const getInstanceRequestByUserId = async () => {
    try {
      const data = await fetchAPI(`/instanceRequests/${instance_id}`);

      // Fetch time slots for this instance
      const timeSlotData = await fetchAPI(
        `/userTimeSlots?instanceRequestId=${instance_id}`
      );

      console.log("🔍 Loaded instance data:", data);
      console.log("🔍 Loaded time slots:", timeSlotData);

      

      // Build dateTimeSlots structure
      const timeSlotsByDate: DateTimeSlots = {};
      const uniqueDates: string[] = [];


      

      timeSlotData.forEach((slot: any) => {
        const date = slot.selected_date;
        if (date) {
          if (!timeSlotsByDate[date]) {
            timeSlotsByDate[date] = {
              selectedSlots: [],
              selectedRanges: []
            };
            uniqueDates.push(date);
          }
          // Convert to string to match slot IDs
          timeSlotsByDate[date].selectedSlots.push(String(slot.time_slot_id));
        }
      });

      // Calculate ranges for each date
      Object.keys(timeSlotsByDate).forEach(date => {
        const slots = timeSlotsByDate[date].selectedSlots;


        const indices = slots
          .map(id => getSlotIndex(id))
          .filter((index) => index !== -1)
          .sort((a, b) => a - b);






        const ranges: TimeSlotRange[] = [];
        if (indices.length > 0) {
          let rangeStart = indices[0];
          let rangeEnd = indices[0];

          for (let i = 1; i < indices.length; i++) {
            if (indices[i] === rangeEnd + 1) {
              rangeEnd = indices[i];
            } else {
              ranges.push({ start: rangeStart, end: rangeEnd });
              rangeStart = indices[i];
              rangeEnd = indices[i];
            }
          }
          ranges.push({ start: rangeStart, end: rangeEnd });
        }

        timeSlotsByDate[date].selectedRanges = ranges;
      });

      console.log("🔍 Built dateTimeSlots:", timeSlotsByDate);
      console.log("🔍 Unique dates:", uniqueDates);

      

      // Populate form data
      const firstDate = uniqueDates.length > 0 ? uniqueDates[0] : '';
      const newFormData = {
        userTypeId: String(data.user_type_id || ''),
        selectedDate: firstDate,
        selectedDates: uniqueDates.sort(),
        customImageId: String(data.image_id || ''),
        cpuId: String(data.cpu_id || ''),
        statusId: String(data.status_id || ''),
        gpuPartitionId: String(data.gpu_partition_id || ''),
        storageVolume: String(data.storage_volume || '10'),
        ramId: String(data.ram_id || ''),
        gpuSlotId: String(data.gpu_id || ''),
        workDescription: data.work_description || '',
        dateTimeSlots: timeSlotsByDate,
        selectedSlots: timeSlotsByDate[firstDate]?.selectedSlots || [],
        selectedRanges: timeSlotsByDate[firstDate]?.selectedRanges || []
      };

      console.log("🔍 Setting formData:", newFormData);
      setFormData(newFormData);
      setSelectedDate(firstDate);

      console.log("🔍 Setting formData:", newFormData);
      setFormData(newFormData);
      setSelectedDate(firstDate);
      
      // ✅ Detect if dates are consecutive (range) or random (individual)
      if (isConsecutiveDateRange(uniqueDates)) {
        setDateSelectionMode("range");
        // Extract start and end dates for range mode display
        const sortedDates = [...uniqueDates].sort();
        setDateRange({
          start: sortedDates[0],
          end: sortedDates[sortedDates.length - 1]
        });
      } else {
        setDateSelectionMode("individual");
      }

    } catch (error) {
      console.error('Error fetching instance request:', error);
      showErrorSnackbarFunc('Failed to load instance request data');
    }
  };

  // 6. saveInstanceRequest - CORRECTED PAYLOAD & ENDPOINT
  const createInstanceRequest = async () => {
    try {
      // Validate form
      if (!validateForm()) {
        return;
      }

      const payload = {
        user_id: userId || loggedInUserId,
        cpu_id: formData.cpuId,
        gpu_id: 1, // Required field, use default if not provided
        ram_id: formData.ramId,
        gpu_vendor_id: formData.gpuSlotId || null,
        gpu_partition_id: formData.gpuPartitionId || null,
        image_id: formData.customImageId,
        status_id: 1, // Pending status
        work_description: formData.workDescription,
        storage_volume: parseInt(formData.storageVolume || '10'),
        user_type_id: formData.userTypeId,
        login_id: 'pending',
        password: 'pending',
        access_link: '',
        is_access_granted: false,
        additional_information: '',
        remarks: '',
        selected_date: formData.selectedDates && formData.selectedDates.length > 0
          ? formData.selectedDates[0]
          : new Date().toISOString().split('T')[0],
        created_by: userId || loggedInUserId || 1,
        updated_by: userId || loggedInUserId || 1
      };

      // Use new RESTful endpoint
      const response = await fetchAPI('/instanceRequests', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      console.log('Create response:', response);

      if (!response?.id) {
        throw new Error('Instance request ID not returned from server');
      }

      await saveUserTimeSlots(response.id);
      showSuccessSnackbar();
      handleReset();
    } catch (error: any) {
      console.error('Create Instance Request Error:', error);
      showErrorSnackbarFunc(
        error.message || 'Failed to submit instance request'
      );
    }
  };

  // 7. updateInstanceRequest - CORRECTED ENDPOINT & PAYLOAD
  const updateInstanceRequest = async () => {
    try {
      for (const date of formData.selectedDates) {
        const dateSlots = formData.dateTimeSlots[date]?.selectedSlots || [];
        if (dateSlots.length === 0) {
          throw new Error(
            // `Please select time slots for ${new Date(date).toLocaleDateString()}`
            `Please select time slots for ${formatDateDDMMYYYY(date)}`
          );
        }
      }

      const payload = {
        user_id: userId || loggedInUserId,
        cpu_id: formData.cpuId,
        gpu_id: Number(formData.gpuSlotId) || 1, // Required field
        ram_id: formData.ramId,
        gpu_vendor_id: formData.gpuSlotId || null,
        gpu_partition_id: formData.gpuPartitionId || null,
        image_id: formData.customImageId,
        status_id: 1,
        work_description: formData.workDescription,
        storage_volume: parseInt(formData.storageVolume || '10'),
        user_type_id: formData.userTypeId,
        login_id: '',
        password: '',
        access_link: '',
        is_access_granted: false,
        additional_information: '',
        remarks: '',
        selected_date: formData.selectedDates && formData.selectedDates.length > 0
          ? formData.selectedDates[0]
          : new Date().toISOString().split('T')[0],
        updated_by: loggedInUserId || userId || 1
      };

      const response = await fetchAPI(`/instanceRequests/${instance_id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      console.log('Update response:', response);

      // if (response && response.id) {
      //   console.log('Instance updated with ID:', response.id);

      if (response && response.instance_request_id) {
        console.log('Instance updated with ID:', response.instance_request_id);

        await deleteUserTimeSlots(instance_id);
        await saveUserTimeSlots(instance_id);
        showSuccessSnackbar();
      } else {
        throw new Error('No instance ID returned from server');
      }
    } catch (error: any) {
      console.error('Error updating instance request:', error);
      showErrorSnackbarFunc(
        error.message || 'Error updating request. Please try again later.'
      );
    }
  };

  // 8. deleteInstanceRequest - CORRECTED ENDPOINT
  const deleteInstanceRequest = async () => {
    try {
      // Delete time slots first
      await deleteUserTimeSlots(instance_id);

      // Then delete instance
      await fetchAPI(`/instanceRequests/${instance_id}`, {
        method: 'DELETE'
      });

      showSuccessSnackbar();
      router.push('/user');
    } catch (error: any) {
      console.error('Error deleting instance request:', error);
      showErrorSnackbarFunc(
        error.message || 'Failed to delete instance request'
      );
    }
  };


  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div
          className={`fixed inset-x-0 bottom-5 flex justify-center z-50 transition-all duration-500 ${showErrorSnackbar
            ? "transform translate-y-0 opacity-100"
            : "transform translate-y-full opacity-0"
            }`}
        >
          <div
            className="rounded-lg shadow-lg px-5 py-3 flex items-center space-x-3 text-sm font-medium"
            style={{ backgroundColor: "#ef4444", color: "white" }}
          >
            <AlertCircle className="w-6 h-4" style={{ color: "white" }} />
            <div>
              <p className="text-sm font-medium">{errorMessage}</p>
            </div>
          </div>
        </div>

        {/* Success Snackbar */}
        <div
          className={`fixed inset-x-0 bottom-5 flex justify-center z-50 transition-all duration-500 ${successSnackbar
            ? "transform translate-y-0 opacity-100"
            : "transform translate-y-full opacity-0"
            }`}
        >
          <div
            className="rounded-lg shadow-lg px-5 py-3 flex items-center space-x-3 text-sm font-medium"
            style={{ backgroundColor: "#76B900", color: "white" }}
          >
            <CheckCircle className="w-6 h-4" style={{ color: "white" }} />
            <div>
              <p className="text-sm font-medium">{successMessage}</p>
            </div>
          </div>
        </div>

        {/* Success Snackbar */}
        <SuccessSnackbar />

        {/* Error Snackbar */}
        <div
          className={`fixed inset-x-0 bottom-5 flex justify-center z-50 transition-all duration-500 ${showErrorSnackbar
            ? "transform translate-y-0 opacity-100"
            : "transform translate-y-full opacity-0"
            }`}
        >
          <div
            className="rounded-lg shadow-lg px-5 py-3 flex items-center space-x-3 text-sm font-medium"
            style={{ backgroundColor: "#ef4444", color: "white" }}
          >
            <AlertCircle className="w-6 h-4" style={{ color: "white" }} />
            <div>
              <p className="text-sm font-medium">{errorMessage}</p>
            </div>
          </div>
        </div>

        {/* Success Snackbar */}
        <div
          className={`fixed inset-x-0 bottom-5 flex justify-center z-50 transition-all duration-500 ${successSnackbar
            ? "transform translate-y-0 opacity-100"
            : "transform translate-y-full opacity-0"
            }`}
        >
          <div
            className="rounded-lg shadow-lg px-5 py-3 flex items-center space-x-3 text-sm font-medium"
            style={{ backgroundColor: "#76B900", color: "white" }}
          >
            <CheckCircle className="w-6 h-4" style={{ color: "white" }} />
            <div>
              <p className="text-sm font-medium">{successMessage}</p>
            </div>
          </div>
        </div>

        {/* Main Container with Card */}
        <div className="max-w-5xl mx-auto p-2">
          {/* Card Container */}
          {/* <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"> */}
          <div
            className="rounded-xl p-2"
            style={{
              backgroundColor: "#fff",
              boxShadow:
                "0 25px 50px -12px rgba(68, 73, 61, 0.15), 0 0 0 1px rgba(201, 202, 199, 0.5)",
            }}
          >
            {/* Card Header */}
            <div className="relative bg-gradient-to-r from-white-50 to-white-100 px-2 py-2">
              {/* Close Button */}
              <button
                onClick={() => {
                  router.push("/user");
                }} // replace with your own function
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 transition"
                aria-label="Close"
              >
                <X className="w-5 h-5 cursor-pointer" />
              </button>

              <h2 className="text-3xl font-bold text-gray-800 text-center">
                Instance Request Form
              </h2>

              {instance_id ? (
                <h4 className="text-3xl font-medium text-gray-800 text-center">
                  {instance_id}
                </h4>
              ) : null}
            </div>

            {/* Card Content */}
            <div className="p-8">
              <form onSubmit={submit} className="space-y-5">
                {/* Hardware Configuration Section - Consistent spacing */}
                {/* <div className="grid grid-cols-3 gap-x-14 max-w-20xl"> */}

                <div className="grid grid-cols-3 gap-x-14 max-w-20xl">
                  <div className="space-y-2">
                    <div className="relative w-64">
                      <label
                        className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 text-sm
                      ${floatCondition("userTypeId", formData.userTypeId)
                            ? "-top-2 px-1 bg-white"
                            : "top-3"
                          }
                      ${errors.userTypeId && touched.userTypeId
                            ? "text-red-500"
                            : floatCondition("userTypeId", formData.userTypeId)
                              ? "text-[#5A8F00] font-small"
                              : "text-gray-500"
                          }
                    `}
                      >
                        {errors.userTypeId && touched.userTypeId
                          ? errors.userTypeId
                          : formData.userTypeId
                            ? "User Type*"
                            : "Select User Type*"}
                      </label>
                      <select
                        value={formData.userTypeId}
                        onChange={(event) =>
                          handleInputChange("userTypeId", event.target.value)
                        }
                        onFocus={(e) => {
                          setFocusedField("userTypeId");
                          e.target.style.borderColor = "#5A8F00";
                          e.target.style.boxShadow =
                            "0 0 0 3px rgba(118, 185, 0, 0.1)";
                        }}
                        onBlur={(e) => {
                          setFocusedField(null);
                          handleBlur("userTypeId");
                          if (!errors.userTypeId) {
                            e.target.style.borderColor = "#e8f5d0";
                            e.target.style.boxShadow = "none";
                          }
                        }}
                        className="w-full px-3 pt-2 pb-2 text-sm rounded-lg focus:outline-none bg-white appearance-none transition-all duration-200 hover:border-green-200"
                        style={{
                          color: "#2d4a00",
                          border:
                            errors.userTypeId && touched.userTypeId
                              ? "2px solid #ef4444"
                              : "2px solid #e8f5d0",
                        }}
                      >
                        <option
                          value=""
                          style={{ color: "#9ca3af" }}
                          disabled
                          hidden
                        ></option>
                        {userType.map((type) => (
                          <option
                            key={type.user_type_id}
                            value={type.user_type_id || ""}
                          >
                            {type.user_type}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none"
                        style={{ color: "#5A8F00" }}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Image */}
                    <div className="relative w-64">
                      <label
                        className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 text-sm
                        ${floatCondition(
                          "customImageId",
                          formData.customImageId
                        )
                            ? "-top-2 px-1 bg-white"
                            : "top-3"
                          }
                        ${errors.customImageId && touched.customImageId
                            ? "text-red-500"
                            : floatCondition(
                              "customImageId",
                              formData.customImageId
                            )
                              ? "text-[#5A8F00] font-small"
                              : "text-gray-500"
                          }
                      `}
                      >
                        {errors.customImageId && touched.customImageId
                          ? errors.customImageId
                          : formData.customImageId
                            ? "Image*"
                            : "Select Image*"}
                      </label>
                      <select
                        value={formData.customImageId}
                        onChange={(event) =>
                          handleInputChange("customImageId", event.target.value)
                        }
                        onFocus={(e) => {
                          setFocusedField("customImageId");
                          e.target.style.borderColor = "#5A8F00";
                          e.target.style.boxShadow =
                            "0 0 0 3px rgba(118, 185, 0, 0.1)";
                        }}
                        onBlur={(e) => {
                          setFocusedField(null);
                          handleBlur("customImageId");
                          if (!errors.customImageId) {
                            e.target.style.borderColor = "#e8f5d0";
                            e.target.style.boxShadow = "none";
                          }
                        }}
                        className="w-full px-3 pt-2 pb-2 text-sm rounded-lg focus:outline-none bg-white appearance-none transition-all duration-200 hover:border-green-200"
                        style={{
                          color: "#2d4a00",
                          border:
                            errors.customImageId && touched.customImageId
                              ? "2px solid #ef4444"
                              : "2px solid #e8f5d0",
                        }}
                      >
                        <option
                          value=""
                          style={{ color: "#9ca3af" }}
                          disabled
                          hidden
                        ></option>
                        {customImage.map((i) => (
                          <option key={i.image_id} value={i.image_id || ""}>
                            {i.image_name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none"
                        style={{ color: "#5A8F00" }}
                      />
                    </div>
                  </div>
                  {/* </div> */}

                  <div className="space-y-4">
                    {/* CPU */}
                    {/* <div className="space-y-2"> */}
                    <div className="relative w-64">
                      <label
                        className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 text-sm
                        ${floatCondition("cpuId", formData.cpuId)
                            ? "-top-2 px-1 bg-white"
                            : "top-3"
                          }
                        ${errors.cpuId && touched.cpuId
                            ? "text-red-500"
                            : floatCondition("cpuId", formData.cpuId)
                              ? "text-[#5A8F00] font-small"
                              : "text-gray-500"
                          }
                      `}
                      >
                        {errors.cpuId && touched.cpuId
                          ? errors.cpuId
                          : formData.cpuId
                            ? "Requested CPUs*"
                            : "Select CPU*"}
                      </label>
                      <select
                        value={formData.cpuId}
                        onChange={(event) =>
                          handleInputChange("cpuId", event.target.value)
                        }
                        onFocus={(e) => {
                          setFocusedField("cpuId");
                          e.target.style.borderColor = "#5A8F00";
                          e.target.style.boxShadow =
                            "0 0 0 3px rgba(118, 185, 0, 0.1)";
                        }}
                        onBlur={(e) => {
                          setFocusedField(null);
                          handleBlur("cpuId");
                          if (!errors.cpuId) {
                            e.target.style.borderColor = "#e8f5d0";
                            e.target.style.boxShadow = "none";
                          }
                        }}
                        className="w-full px-3 pt-2 pb-2 text-sm rounded-lg focus:outline-none bg-white appearance-none transition-all duration-200 hover:border-green-200"
                        style={{
                          color: "#2d4a00",
                          border:
                            errors.cpuId && touched.cpuId
                              ? "2px solid #ef4444"
                              : "2px solid #e8f5d0",
                        }}
                      >
                        <option
                          value=""
                          style={{ color: "#9ca3af" }}
                          disabled
                          hidden
                        ></option>
                        {cpu.map((c) => (
                          <option key={c.cpu_id} value={c.cpu_id || ""}>
                            {c.number_of_cpu}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none"
                        style={{ color: "#5A8F00" }}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-x-14 max-w-20xl">
                  {/* GPU Partition */}
                  <div className="relative w-64">
                    <label
                      className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 text-sm
                        ${floatCondition(
                        "gpuPartitionId",
                        formData.gpuPartitionId
                      )
                          ? "-top-2 px-1 bg-white"
                          : "top-3"
                        }
                        ${errors.gpuPartitionId && touched.gpuPartitionId
                          ? "text-red-500"
                          : floatCondition(
                            "gpuPartitionId",
                            formData.gpuPartitionId
                          )
                            ? "text-[#5A8F00] font-small"
                            : "text-gray-500"
                        }
                      `}
                    >
                      {errors.gpuPartitionId && touched.gpuPartitionId
                        ? errors.gpuPartitionId
                        : formData.gpuPartitionId
                          ? "Number of GPUs*"
                          : "Select Number of GPUs*"}
                    </label>
                    <select
                      value={formData.gpuPartitionId}
                      onChange={(event) =>
                        handleInputChange("gpuPartitionId", event.target.value)
                      }
                      onFocus={(e) => {
                        setFocusedField("gpuPartitionId");
                        e.target.style.borderColor = "#5A8F00";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(118, 185, 0, 0.1)";
                      }}
                      onBlur={(e) => {
                        setFocusedField(null);
                        handleBlur("gpuPartitionId");
                        if (!errors.gpuPartitionId) {
                          e.target.style.borderColor = "#e8f5d0";
                          e.target.style.boxShadow = "none";
                        }
                      }}
                      className="w-full px-3 pt-2 pb-2 text-sm rounded-lg focus:outline-none bg-white appearance-none transition-all duration-200 hover:border-green-200"
                      style={{
                        color: "#2d4a00",
                        border:
                          errors.gpuPartitionId && touched.gpuPartitionId
                            ? "2px solid #ef4444"
                            : "2px solid #e8f5d0",
                      }}
                    >
                      <option
                        value=""
                        style={{ color: "#9ca3af" }}
                        disabled
                        hidden
                      ></option>
                      {gpuPartition.map((gp) => (
                        <option
                          key={gp.gpu_partition_id}
                          value={gp.gpu_partition_id || ""}
                        >
                          {gp.gpu_partition}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none"
                      style={{ color: "#5A8F00" }}
                    />
                  </div>

                  {/* RAM */}
                  <div className="space-y-4">
                    <div className="relative w-64">
                      <label
                        className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 text-sm
                        ${floatCondition("ramId", formData.ramId)
                            ? "-top-2 px-1 bg-white"
                            : "top-3"
                          }
                        ${errors.ramId && touched.ramId
                            ? "text-red-500"
                            : floatCondition("ramId", formData.ramId)
                              ? "text-[#5A8F00] font-small"
                              : "text-gray-500"
                          }
                      `}
                      >
                        {errors.ramId && touched.ramId
                          ? errors.ramId
                          : formData.ramId
                            ? "Requested RAM in GB*"
                            : "Select RAM*"}
                      </label>
                      <select
                        value={formData.ramId}
                        onChange={(event) =>
                          handleInputChange("ramId", event.target.value)
                        }
                        onFocus={(e) => {
                          setFocusedField("ramId");
                          e.target.style.borderColor = "#5A8F00";
                          e.target.style.boxShadow =
                            "0 0 0 3px rgba(118, 185, 0, 0.1)";
                        }}
                        onBlur={(e) => {
                          setFocusedField(null);
                          handleBlur("ramId");
                          if (!errors.ramId) {
                            e.target.style.borderColor = "#e8f5d0";
                            e.target.style.boxShadow = "none";
                          }
                        }}
                        className="w-full px-3 pt-2 pb-2 text-sm rounded-lg focus:outline-none bg-white appearance-none transition-all duration-200 hover:border-green-200"
                        style={{
                          color: "#2d4a00",
                          border:
                            errors.ramId && touched.ramId
                              ? "2px solid #ef4444"
                              : "2px solid #e8f5d0",
                        }}
                      >
                        <option
                          value=""
                          style={{ color: "#9ca3af" }}
                          disabled
                          hidden
                        ></option>
                        {ram.map((r) => (
                          <option key={r.ram_id} value={r.ram_id || ""}>
                            {r.ram}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none"
                        style={{ color: "#5A8F00" }}
                      />
                    </div>
                  </div>
                  {/* </div> */}

                  {/* GPU Slots */}
                  {/* <div className="space-y-2"> */}
                  <div className="relative w-64">
                    <label
                      className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 text-sm
                        ${floatCondition("gpuSlotId", formData.gpuSlotId)
                          ? "-top-2 px-1 bg-white"
                          : "top-3"
                        }
                        ${errors.gpuSlotId && touched.gpuSlotId
                          ? "text-red-500"
                          : floatCondition("gpuSlotId", formData.gpuSlotId)
                            ? "text-[#5A8F00] font-small"
                            : "text-gray-500"
                        }
                      `}
                    >
                      {errors.gpuSlotId && touched.gpuSlotId
                        ? errors.gpuSlotId
                        : formData.gpuSlotId
                          ? "GPU Vendor*"
                          : "Select GPU Vendor*"}
                    </label>
                    <select
                      value={formData.gpuSlotId}
                      onChange={(event) =>
                        handleInputChange("gpuSlotId", event.target.value)
                      }
                      onFocus={(e) => {
                        setFocusedField("gpuSlotId");
                        e.target.style.borderColor = "#5A8F00";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(118, 185, 0, 0.1)";
                      }}
                      onBlur={(e) => {
                        setFocusedField(null);
                        handleBlur("gpuSlotId");
                        if (!errors.gpuSlotId) {
                          e.target.style.borderColor = "#e8f5d0";
                          e.target.style.boxShadow = "none";
                        }
                      }}
                      className="w-full px-3 pt-2 pb-2 text-sm rounded-lg focus:outline-none bg-white appearance-none transition-all duration-200 hover:border-green-200"
                      style={{
                        color: "#2d4a00",
                        border:
                          errors.gpuSlotId && touched.gpuSlotId
                            ? "2px solid #ef4444"
                            : "2px solid #e8f5d0",
                      }}
                    >
                      <option
                        value=""
                        style={{ color: "#9ca3af" }}
                        disabled
                        hidden
                      ></option>
                      {gpuSlot.map((gs) => (
                        <option key={gs.gpu_id} value={gs.gpu_id || ""}>
                          {gs.gpu_vendor}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none"
                      style={{ color: "#5A8F00" }}
                    />
                    {/* </div> */}
                  </div>
                </div>

                {/* Storage Volume and Work Description */}
                <div className="grid grid-cols-3 gap-x-14 max-w-20xl">
                  {/* Storage Volume - Takes 1 column */}
                  <div className="relative w-64">
                    <label
                      className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 text-sm
        ${floatCondition("storageVolume", formData.storageVolume)
                          ? "-top-2 px-1 bg-white"
                          : "top-3"
                        }
        ${errors.storageVolume && touched.storageVolume
                          ? "text-red-500"
                          : floatCondition("storageVolume", formData.storageVolume)
                            ? "text-[#5A8F00] font-small"
                            : "text-gray-500"
                        }
      `}
                    >
                      {errors.storageVolume && touched.storageVolume
                        ? errors.storageVolume
                        : formData.storageVolume
                          ? "Storage Volume in GB*"
                          : "Storage Volume (1-150 GB)*"}
                    </label>
                    <input
                      type="number"
                      value={formData.storageVolume}
                      onChange={(event) => {
                        const value = event.target.value;
                        if (value === "" || parseInt(value) >= 0) {
                          handleInputChange("storageVolume", value);
                        }
                      }}
                      onFocus={(e) => {
                        setFocusedField("storageVolume");
                        e.target.style.borderColor = "#5A8F00";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(118, 185, 0, 0.1)";
                      }}
                      onBlur={(e) => {
                        setFocusedField(null);
                        handleBlur("storageVolume");
                        if (!errors.storageVolume) {
                          e.target.style.borderColor = "#e8f5d0";
                          e.target.style.boxShadow = "none";
                        }
                      }}
                      className="w-full px-3 pt-2 pb-2 text-sm rounded-lg focus:outline-none bg-white transition-all duration-200 hover:border-green-200"
                      style={{
                        color: "#2d4a00",
                        border:
                          errors.storageVolume && touched.storageVolume
                            ? "2px solid #ef4444"
                            : "2px solid #e8f5d0",
                      }}
                      min="1"
                      max="25000"
                    />
                  </div>

                  {/* Work Description - Spans 2 columns */}
                  <div className="col-span-2">
                    <div className="relative w-full">
                      <label
                        className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 text-sm
          ${floatCondition("workDescription", formData.workDescription)
                            ? "-top-2 px-1 bg-white"
                            : "top-3"
                          }
          ${errors.workDescription && touched.workDescription
                            ? "text-red-500"
                            : floatCondition("workDescription", formData.workDescription)
                              ? "text-[#5A8F00] font-small"
                              : "text-gray-500"
                          }
        `}
                      >
                        {formData.workDescription
                          ? "Work Description"
                          : "Enter Work Description"}
                      </label>
                      <textarea
                        value={formData.workDescription}
                        onChange={(event) =>
                          handleInputChange(
                            "workDescription",
                            event.target.value
                          )
                        }
                        onFocus={(e) => {
                          setFocusedField("workDescription");
                          e.target.style.borderColor = "#5A8F00";
                          e.target.style.boxShadow =
                            "0 0 0 3px rgba(118, 185, 0, 0.1)";
                        }}
                        onBlur={(e) => {
                          setFocusedField(null);
                          handleBlur("workDescription");
                          if (!errors.workDescription) {
                            e.target.style.borderColor = "#e8f5d0";
                            e.target.style.boxShadow = "none";
                          }
                        }}
                        className="w-full px-3 pt-2 pb-2 text-sm rounded-lg focus:outline-none bg-white transition-all duration-200 hover:border-green-200 resize-none"
                        style={{
                          color: "#2d4a00",
                          border:
                            errors.workDescription && touched.workDescription
                              ? "2px solid #ef4444"
                              : "2px solid #e8f5d0",
                          height: "40px",
                        }}
                        rows={1}
                        maxLength={500}
                      />
                    </div>
                  </div>
                </div>

                {/* </div> */}
                {/* </div> */}

                <div className="w-full max-w-6xl space-y-3">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="individual"
                          name="dateMode"
                          checked={dateSelectionMode === "individual"}
                          onChange={() => setDateSelectionMode("individual")}
                          className="text-green-600 focus:ring-green-500"
                        />
                        <label
                          htmlFor="individual"
                          className="text-sm text-gray-600"
                        >
                          Individual Dates
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="range"
                          name="dateMode"
                          checked={dateSelectionMode === "range"}
                          onChange={() => setDateSelectionMode("range")}
                          className="text-green-600 focus:ring-green-500"
                        />
                        <label
                          htmlFor="range"
                          className="text-sm text-gray-600"
                        >
                          Date Range
                        </label>
                      </div>
                    </div>

                    {dateSelectionMode === "individual" ? (
                      // Individual date selection
                      <div className="flex items-center gap-2">
                        <div className="relative w-64">
                          <label
                            className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 text-sm
            ${floatCondition("selectedDates", selectedDate)
                                ? "-top-2 px-1 bg-white"
                                : "top-3"
                              }
            ${errors.selectedDates && touched.selectedDates
                                ? "text-red-500"
                                : floatCondition("selectedDates", selectedDate)
                                  ? "text-[#5A8F00] font-small"
                                  : "text-gray-500"
                              }
          `}
                          >
                            {errors.selectedDates && touched.selectedDates
                              ? errors.selectedDates
                              : ""}
                          </label>
                          <input
                            type="date"
                            value={selectedDate}
                            // min={getTodayDate()}
                            min={instance_id ? "" : getTodayDate()}
                            onChange={(e) => {
                              setSelectedDate(e.target.value);
                              if (e.target.value) {
                                handleDateAdd(e.target.value);
                              }
                            }}
                            className="w-full px-3 pt-2 pb-2 text-sm rounded-lg focus:outline-none bg-white transition-all duration-200 hover:border-green-200 cursor-pointer"
                            style={{
                              color: "#2d4a00",
                              border:
                                errors.selectedDates && touched.selectedDates
                                  ? "2px solid #ef4444"
                                  : "2px solid #e8f5d0",
                            }}
                          />
                        </div>
                      </div>
                      // ) : (
                      //   // Date range selection
                      //   <div className="flex items-center gap-4">
                      //     <div className="relative w-64">
                      //       <label className="absolute -top-2 left-3 px-1 bg-white text-sm text-[#5A8F00] font-small">
                      //         Start Date
                      //       </label>
                      //       <input
                      //         type="date"
                      //         value={dateRange.start}
                      //         min={getTodayDate()}
                      //         onChange={(e) =>
                      //           setDateRange((prev) => ({
                      //             ...prev,
                      //             start: e.target.value,
                      //           }))
                      //         }
                      //         className="w-full px-3 pt-2 pb-2 text-sm rounded-lg focus:outline-none bg-white transition-all duration-200 hover:border-green-200 cursor-pointer"
                      //         style={{
                      //           color: "#2d4a00",
                      //           border: "2px solid #e8f5d0",
                      //         }}
                      //       />
                      //     </div>
                      //     <div className="relative w-64">
                      //       <label className="absolute -top-2 left-3 px-1 bg-white text-sm text-[#5A8F00] font-small">
                      //         End Date
                      //       </label>
                      //       <input
                      //         type="date"
                      //         value={dateRange.end}
                      //         min={dateRange.start || getTodayDate()}
                      //         onChange={(e) =>
                      //           setDateRange((prev) => ({
                      //             ...prev,
                      //             end: e.target.value,
                      //           }))
                      //         }
                      //         className="w-full px-3 pt-2 pb-2 text-sm rounded-lg focus:outline-none bg-white transition-all duration-200 hover:border-green-200 cursor-pointer"
                      //         style={{
                      //           color: "#2d4a00",
                      //           border: "2px solid #e8f5d0",
                      //         }}
                      //       />
                      //     </div>
                      //     <button
                      //       type="button"
                      //       onClick={handleDateRangeAdd}
                      //       disabled={!dateRange.start || !dateRange.end}
                      //       className="p-2 text-white rounded-full transition-all duration-200 hover:shadow-lg disabled:opacity-50 flex items-center justify-center"
                      //       style={{
                      //         backgroundColor:
                      //           !dateRange.start || !dateRange.end
                      //             ? "#9ca3af"
                      //             : "#76B900",
                      //         width: "36px",
                      //         height: "36px",
                      //       }}
                      //       title="Set date range"
                      //     >
                      //       <ArrowRightIcon size={16} />
                      //     </button>
                      //   </div>
                      // )}
                    ) : (
                      // Date range selection
                      <div className="flex items-center gap-4">
                        <div className="relative w-64">
                          <label
                            className={`absolute -top-2 left-3 px-1 bg-white text-sm font-small
          ${dateRangeErrors.start ? "text-red-500" : "text-[#5A8F00]"}
        `}
                          >
                            {dateRangeErrors.start || "Start Date*"}
                          </label>
                          <input
                            type="date"
                            value={dateRange.start}
                            // min={getTodayDate()}
                            min={instance_id ? "" : getTodayDate()}
                            onChange={(e) => {
                              setDateRange((prev) => ({
                                ...prev,
                                start: e.target.value,
                              }));
                              if (dateRangeErrors.start) {
                                setDateRangeErrors((prev) => ({ ...prev, start: "" }));
                              }
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = "#5A8F00";
                              e.target.style.boxShadow = "0 0 0 3px rgba(118, 185, 0, 0.1)";
                            }}
                            onBlur={(e) => {
                              if (!dateRangeErrors.start) {
                                e.target.style.borderColor = "#e8f5d0";
                                e.target.style.boxShadow = "none";
                              }
                            }}
                            className="w-full px-3 pt-2 pb-2 text-sm rounded-lg focus:outline-none bg-white transition-all duration-200 hover:border-green-200 cursor-pointer"
                            style={{
                              color: "#2d4a00",
                              border: dateRangeErrors.start ? "2px solid #ef4444" : "2px solid #e8f5d0",
                            }}
                          />
                        </div>
                        <div className="relative w-64">
                          <label
                            className={`absolute -top-2 left-3 px-1 bg-white text-sm font-small
          ${dateRangeErrors.end ? "text-red-500" : "text-[#5A8F00]"}
        `}
                          >
                            {dateRangeErrors.end || "End Date*"}
                          </label>
                          <input
                            type="date"
                            value={dateRange.end}
                            // min={dateRange.start || getTodayDate()}
                            min={dateRange.start || (instance_id ? "" : getTodayDate())}
                            onChange={(e) => {
                              setDateRange((prev) => ({
                                ...prev,
                                end: e.target.value,
                              }));
                              if (dateRangeErrors.end) {
                                setDateRangeErrors((prev) => ({ ...prev, end: "" }));
                              }
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = "#5A8F00";
                              e.target.style.boxShadow = "0 0 0 3px rgba(118, 185, 0, 0.1)";
                            }}
                            onBlur={(e) => {
                              if (!dateRangeErrors.end) {
                                e.target.style.borderColor = "#e8f5d0";
                                e.target.style.boxShadow = "none";
                              }
                            }}
                            className="w-full px-3 pt-2 pb-2 text-sm rounded-lg focus:outline-none bg-white transition-all duration-200 hover:border-green-200 cursor-pointer"
                            style={{
                              color: "#2d4a00",
                              border: dateRangeErrors.end ? "2px solid #ef4444" : "2px solid #e8f5d0",
                            }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleDateRangeAdd}
                          disabled={!dateRange.start || !dateRange.end}
                          className="p-2 text-white rounded-full transition-all duration-200 hover:shadow-lg disabled:opacity-50 flex items-center justify-center"
                          style={{
                            backgroundColor:
                              !dateRange.start || !dateRange.end
                                ? "#9ca3af"
                                : "#76B900",
                            width: "36px",
                            height: "36px",
                          }}
                          title="Set date range"
                        >
                          <ArrowRightIcon size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    {formData.selectedDates &&
                      formData.selectedDates.length > 0 && (
                        <div className="w-full">
                          <div className="flex items-center gap-1 ">
                            <div
                              className="text-xs font-small"
                              style={{ color: "#5A8F00" }}
                            >
                              Selected Dates ({formData.selectedDates.length}):
                            </div>
                            <div className="flex flex-row flex-wrap gap-2 items-center">
                              {formData.selectedDates.map((date) => (
                                <div
                                  key={date}
                                  onClick={() => setSelectedDate(date)}
                                  className={`flex items-center gap-1 px-1 py-0.5 rounded-full text-xs cursor-pointer transition-all duration-200 ${date === selectedDate
                                    ? "bg-green-100 border-1 border-green-500"
                                    : "bg-gray-50 border border-gray-200 hover:border-green-300 hover:bg-green-50"
                                    }`}
                                >
                                  <span className="text-xs text-gray-700">
                                    {/* {new Date(date).toLocaleDateString(
                                      "en-US",
                                      {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                      }
                                    )} */}
                                    {formatDateDDMMYYYY(date)}
                                  </span>
                                  <div className="flex items-center gap-1">
                                    {/* <span className="text-xs text-gray-500">
                                    ({formData.dateTimeSlots[date]?.selectedSlots.length || 0})
                                  </span> */}
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDateRemove(date);
                                      }}
                                      className="p-1 hover:bg-red-100 rounded-full transition-colors"
                                      aria-label="Remove date"
                                    >
                                      <X className="w-3 h-3 text-red-500" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                  </div>

                  {/* // Alternative: Always reserve space for the checkbox */}
                  <div className="flex items-center gap-2 mt-2 h-8">
                    {!selectedDate ||
                      formData.dateTimeSlots[selectedDate]?.selectedSlots
                        .length === 0 ||
                      formData.selectedDates.length < 2 ? (
                      // Hidden but space is reserved
                      <div className="invisible"></div>
                    ) : (
                      <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={replicateChecked}
                          disabled={
                            !selectedDate ||
                            formData.dateTimeSlots[selectedDate]?.selectedSlots
                              .length === 0 ||
                            isReplicating
                          }
                          onChange={async (e) => {
                            const checked = e.target.checked;
                            setReplicateChecked(checked);
                            if (checked) {
                              try {
                                await handleReplicateSlots();
                              } catch (error) {
                                console.error(
                                  "Error during replication:",
                                  error
                                );
                              } finally {
                                setReplicateChecked(false);
                              }
                            }
                          }}
                          className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                          aria-label="Replicate slots to other selected dates"
                          title={
                            isReplicating
                              ? "Replicating..."
                              : "Replicate slots to other selected dates"
                          }
                        />
                        <span className="whitespace-nowrap">
                          {isReplicating ? (
                            <span className="flex items-center gap-2">
                              <span className="inline-block animate-spin rounded-full h-3 w-3 border-2 border-green-600 border-t-transparent"></span>
                              Replicating...
                            </span>
                          ) : (
                            "Replicate selected time slots to all selected dates"
                          )}
                        </span>
                      </label>
                    )}
                  </div>
                </div>

                {/* Time Slots Selection */}
                <div>
                  {/* Error message for time slots - positioned above the slots grid */}

                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm text-gray-500">
                      Select Time Slots* (Drag to select multiple slots)
                    </label>
                  </div>

                  {/* {errors.selectedSlots && touched.selectedSlots && (
                    <div className="text-red-500 text-sm mb-2">
                      {errors.selectedSlots}
                    </div>
                  )} */}
                  {errors.selectedSlots && touched.selectedSlots && (
                    <div className="text-red-500 text-sm mb-2 whitespace-pre-wrap">
                      {errors.selectedSlots}
                    </div>
                  )}
                  <div
                    className="grid grid-cols-12 gap-0.5 mb-2"
                    onMouseLeave={() => {
                      if (isDragging) {
                        setIsDragging(false);
                        setDragStart(null);
                        setDragEnd(null);
                      }
                    }}
                  >
                    {timeSlot.map((slot, index) => {
                      // const slotId: any = slot.time_slot_id || "";
                      const slotId: any = String(slot.time_slot_id || "");
                      const isBooked = isSlotBooked(slotId);
                      const isSelected = isSlotSelected(slotId);
                      const isDragPreview =
                        isDragging &&
                        dragStart &&
                        dragEnd &&
                        getContinuousRange(dragStart, dragEnd).includes(slotId);

                      // Check if this slot is in a single-slot range
                      const isInSingleSlotRange = formData.selectedRanges.some(
                        (range) =>
                          range.start === range.end && range.start === index
                      );

                      return (
                        <button
                          key={slot.time_slot_id}
                          type="button"
                          disabled={isBooked} // Only disable if booked by someone else
                          onClick={() => handleTimeSlotClick(slotId)}
                          onMouseDown={() =>
                            !isBooked &&
                            handleMouseDown(
                              slotId,
                              isSelected ? "deselect" : "select"
                            )
                          }
                          onMouseEnter={() => handleMouseEnter(slotId)}
                          onMouseUp={handleMouseUp}
                          className={`
        relative px-0.5 py-1 rounded-md border-2 text-xs font-small transition-all duration-150 min-w-0 select-none
        ${isBooked
                              ? "bg-gray-200 border-gray-400 text-gray-600 cursor-not-allowed"
                              : isSelected
                                ? isInSingleSlotRange
                                  ? "bg-orange-100 border-orange-400 text-orange-900 shadow-md cursor-pointer hover:bg-orange-200"
                                  : "bg-green-100 border-green-500 text-green-900 shadow-md cursor-pointer hover:bg-green-200"
                                : isDragPreview
                                  ? "bg-green-50 border-green-300 cursor-pointer"
                                  : "bg-white border-gray-200 text-gray-700 hover:border-green-300 hover:bg-green-50 cursor-pointer"
                            }
      `}
                          style={{
                            userSelect: "none",
                            WebkitUserSelect: "none",
                            MozUserSelect: "none",
                          }}
                        >
                          {slot.time_slot}
                          {isInSingleSlotRange && (
                            <span className="absolute -top-1 -right-1 text-orange-500">
                              ⚠️
                            </span>
                          )}
                        </button>
                        //                         >
                        //   {slot.time_slot}
                        //   {isSelected && !isInSingleSlotRange && (
                        //     <CheckCircle className="absolute -top-1 -right-1 w-4 h-4 text-green-600 fill-current" />
                        //   )}
                        //   {isInSingleSlotRange && (
                        //     <span className="absolute -top-1 -right-1 text-orange-500">
                        //       ⚠️
                        //     </span>
                        //   )}
                        // </button>
                      );
                    })}
                  </div>
                  {/* )} */}
                  {/* <SelectedDateSlots /> */}
                </div>

                {/* Time Slots Legend */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-md bg-gray-200 border-2 border-gray-400"></div>
                    <span className="text-gray-600">Booked Slots</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-md bg-green-100 border-2 border-green-500"></div>
                    <span className="text-gray-600">Selected Slots</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-md bg-orange-100 border-2 border-orange-400"></div>
                    <span className="text-gray-600">
                      Single Slot (Not Allowed)
                    </span>
                  </div>
                </div>

                {/* Submit and Reset Buttons */}
                <div className="flex justify-center gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-2 text-white rounded font-semibold transition-all duration-200 hover:shadow-lg disabled:opacity-50 cursor-pointer"
                    style={{
                      backgroundColor: isSubmitting ? "#9ca3af" : "#76B900",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubmitting) {
                        e.currentTarget.style.backgroundColor = "#5a8f00";
                        e.currentTarget.style.transform = "translateY(-1px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSubmitting) {
                        e.currentTarget.style.backgroundColor = "#76B900";
                        e.currentTarget.style.transform = "translateY(0)";
                      }
                    }}
                  >
                    {instance_id
                      ? "Update"
                      : isSubmitting
                        ? "Submitting..."
                        : "Submit"}
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={isSubmitting}
                    className="px-8 py-2 text-white rounded font-semibold transition-all duration-200 hover:shadow-lg disabled:opacity-50 cursor-pointer"
                    style={{
                      backgroundColor: isSubmitting ? "#9ca3af" : "#76B900",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubmitting) {
                        e.currentTarget.style.backgroundColor = "#5a8f00";
                        e.currentTarget.style.transform = "translateY(-1px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSubmitting) {
                        e.currentTarget.style.backgroundColor = "#76B900";
                        e.currentTarget.style.transform = "translateY(0)";
                      }
                    }}
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}

// ------------------ Export with Suspense Wrapper ------------------
export default function DGXInstanceRequestForm() {
  return (
    <Suspense fallback={<div>Loading Instance Access Form...</div>}>
      <DGXInstanceRequestFormContent />
    </Suspense>
  );
}