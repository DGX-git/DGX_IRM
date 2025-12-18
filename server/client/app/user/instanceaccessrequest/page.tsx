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
  const [initiallyLoadedSlots, setInitiallyLoadedSlots] = useState<string[]>(
    []
  );
  const [dragMode, setDragMode] = useState<"select" | "unselect" | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  // Add this state
  const [successMessage, setSuccessMessage] = useState("");
  // Add these near the top with other state declarations
  const [showReplicatePopup, setShowReplicatePopup] = useState(false);
  const [previousDate, setPreviousDate] = useState<string | null>(null);
  const [replicateSourceDate, setReplicateSourceDate] = useState<string | null>(
    null
  );

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

  // const getUserTimeSlots = async () => {
  //   try {
  //     const data = await fetchAPI(
  //       `/userTimeSlots?selectedDate=${selectedDate}${
  //         instance_id ? `&excludeInstanceId=${instance_id}` : ""
  //       }`
  //     );
  //     setUserTimeSlot(data);
  //     console.log("User Time Slot=", data);
  //   } catch (error) {
  //     console.error("Error fetching user time slots:", error);
  //   }
  // };

  // const getInstanceRequestByUserId = async () => {
  //   try {
  //     const data = await fetchAPI(`/instanceRequests/${instance_id}`);

  //     const timeSlotData = await fetchAPI(
  //       `/userTimeSlots?instanceRequestId=${instance_id}`
  //     );

  //     const timeSlotsByDate: DateTimeSlots = {};
  //     const uniqueDates: string[] = [];

  //     timeSlotData.forEach((slot: any) => {
  //       const date = slot.selected_date;
  //       if (date) {
  //         if (!timeSlotsByDate[date]) {
  //           timeSlotsByDate[date] = {
  //             selectedSlots: [],
  //             selectedRanges: [],
  //           };
  //           uniqueDates.push(date);
  //         }
  //         timeSlotsByDate[date].selectedSlots.push(slot.time_slot_id + "");
  //       }
  //     });

  //     Object.keys(timeSlotsByDate).forEach((date) => {
  //       const slots = timeSlotsByDate[date].selectedSlots;
  //       const indices = slots
  //         .map((id) => getSlotIndex(id))
  //         .sort((a, b) => a - b);
  //       const ranges: TimeSlotRange[] = [];

  //       if (indices.length > 0) {
  //         let rangeStart = indices[0];
  //         let rangeEnd = indices[0];

  //         for (let i = 1; i < indices.length; i++) {
  //           if (indices[i] === rangeEnd + 1) {
  //             rangeEnd = indices[i];
  //           } else {
  //             ranges.push({ start: rangeStart, end: rangeEnd });
  //             rangeStart = indices[i];
  //             rangeEnd = indices[i];
  //           }
  //         }
  //         ranges.push({ start: rangeStart, end: rangeEnd });
  //       }

  //       timeSlotsByDate[date].selectedRanges = ranges;
  //     });

  //     setFormData({
  //       userTypeId: data.user_type_id || "",
  //       selectedDate: uniqueDates[0] || "",
  //       selectedDates: uniqueDates,
  //       selectedRanges: [],
  //       customImageId: data.image_id || "",
  //       cpuId: data.cpu_id || "",
  //       statusId: data.status_id || "",
  //       gpuPartitionId: data.gpu_partition_id || "",
  //       storageVolume: data.storage_volume?.toString() || "10",
  //       ramId: data.ram_id || "",
  //       gpuSlotId: data.gpu_vendor_id || "",
  //       workDescription: data.work_description || "",
  //       dateTimeSlots: timeSlotsByDate,
  //       selectedSlots: timeSlotsByDate[uniqueDates[0]]?.selectedSlots || [],
  //     });

  //     setSelectedDate(uniqueDates[0] || "");
  //   } catch (error) {
  //     console.error("Error fetching instance request:", error);
  //     showErrorSnackbarFunc("Failed to load instance request data");
  //   }
  // };

  // const saveInstanceRequest = async () => {
  //   try {
  //     for (const date of formData.selectedDates) {
  //       const dateSlots = formData.dateTimeSlots[date]?.selectedSlots || [];
  //       if (dateSlots.length === 0) {
  //         throw new Error(`Please select time slots for ${new Date(date).toLocaleDateString()}`);
  //       }
  //     }

  //     const today = new Date();
  //     const formattedDate = today.toISOString().split('T')[0];

  //     const response = await fetchAPI('/instanceRequests', {
  //       method: 'POST',
  //       body: JSON.stringify({
  //         user_id: 1,
  //         remarks: "",
  //         image_id: formData.customImageId,
  //         cpu_id: formData.cpuId,
  //         selected_date: formattedDate,
  //         gpu_partition_id: formData.gpuPartitionId,
  //         ram_id: formData.ramId,
  //         gpu_vendor_id: formData.gpuSlotId,
  //         work_description: formData.workDescription,
  //         status_id: formData.statusId || status.find(s => s.status_name === "Pending")?.status_id,
  //         storage_volume: parseInt(formData.storageVolume || '10'),
  //         user_type_id: formData.userTypeId,
  //         login_id: "",
  //         password: "",
  //         access_link: "",
  //         is_access_granted: false,
  //         additional_information: "",
  //       }),
  //     });

  //     if (response.id) {
  //       await saveUserTimeSlots(response.id);
  //       showSuccessSnackbar();
  //       handleReset();
  //     }
  //   } catch (error: any) {
  //     console.error("Error creating instance request:", error);
  //     showErrorSnackbarFunc(error.message || 'Error submitting request. Please try again later.');
  //   }
  // };

  const saveInstanceRequest = async () => {
  try {
    /* -------------------- VALIDATE TIME SLOTS -------------------- */
    for (const date of formData.selectedDates) {
      const slots =
        formData.dateTimeSlots?.[date]?.selectedSlots || [];

      if (slots.length === 0) {
        throw new Error(
          `Please select time slots for ${new Date(
            date
          ).toLocaleDateString()}`
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

  // const updateInstanceRequest = async () => {
  //   try {
  //     for (const date of formData.selectedDates) {
  //       const dateSlots = formData.dateTimeSlots[date]?.selectedSlots || [];
  //       if (dateSlots.length === 0) {
  //         throw new Error(`Please select time slots for ${new Date(date).toLocaleDateString()}`);
  //       }
  //     }

  //     const response = await fetchAPI(`/instanceRequests/${instance_id}`, {
  //       method: 'PUT',
  //       body: JSON.stringify({
  //         user_id: 1,
  //         remarks: "",
  //         image_id: formData.customImageId,
  //         cpu_id: formData.cpuId,
  //         selected_date: new Date().toISOString().split('T')[0],
  //         gpu_partition_id: formData.gpuPartitionId,
  //         ram_id: formData.ramId,
  //         gpu_vendor_id: formData.gpuSlotId,
  //         work_description: formData.workDescription,
  //         status_id: formData.statusId,
  //         storage_volume: parseInt(formData.storageVolume || '10'),
  //         user_type_id: formData.userTypeId,
  //       }),
  //     });

  //     if (response.id) {
  //       await deleteUserTimeSlots(instance_id);
  //       await saveUserTimeSlots(instance_id);
  //       showSuccessSnackbar();
  //       router.push('/user');
  //     }
  //   } catch (error: any) {
  //     console.error("Error updating instance request:", error);
  //     showErrorSnackbarFunc(error.message || 'Error updating request. Please try again later.');
  //   }
  // };

  // const updateInstanceRequest = async () => {
  //   try {
  //     for (const date of formData.selectedDates) {
  //       const dateSlots = formData.dateTimeSlots[date]?.selectedSlots || [];
  //       if (dateSlots.length === 0) {
  //         throw new Error(
  //           `Please select time slots for ${new Date(
  //             date
  //           ).toLocaleDateString()}`
  //         );
  //       }
  //     }

  //     const response = await fetchAPI(`/instanceRequests/${instance_id}`, {
  //       method: "PUT",
  //       body: JSON.stringify({
  //         user_id: userId,
  //         remarks: "",
  //         image_id: formData.customImageId,
  //         cpu_id: formData.cpuId,
  //         selected_date:
  //           formData.selectedDates && formData.selectedDates.length > 0
  //             ? formData.selectedDates[0]
  //             : new Date().toISOString().split("T")[0],
  //         gpu_partition_id: formData.gpuPartitionId,
  //         ram_id: formData.ramId,
  //         gpu_vendor_id: formData.gpuSlotId,
  //         gpu_id: 1, // Add required field
  //         work_description: formData.workDescription,
  //         status_id: formData.statusId || 1,
  //         storage_volume: parseInt(formData.storageVolume || "10"),
  //         user_type_id: formData.userTypeId,
  //         login_id: "",
  //         password: "",
  //         access_link: "",
  //         is_access_granted: false,
  //         additional_information: "",
  //         updated_by: loggedInUserId,
  //       }),
  //     });

  //     console.log("Update response:", response);

  //     if (response && response.instance_request_id) {
  //       console.log("Instance updated with ID:", response.instance_request_id);
  //       await deleteUserTimeSlots(instance_id);
  //       await saveUserTimeSlots(instance_id);
  //       showSuccessSnackbar();
  //     } else {
  //       throw new Error("No instance ID returned from server");
  //     }
  //   } catch (error: any) {
  //     console.error("Error updating instance request:", error);
  //     showErrorSnackbarFunc(
  //       error.message || "Error updating request. Please try again later."
  //     );
  //   }
  // };

  // const saveUserTimeSlots = async (instanceRequestId: string) => {
  //   try {
  //     const timeSlots: any[] = [];

  //     Object.entries(formData.dateTimeSlots).forEach(
  //       ([date, { selectedSlots }]) => {
  //         if (selectedSlots && selectedSlots.length > 0) {
  //           selectedSlots.forEach((slotId) => {
  //             timeSlots.push({
  //               instance_request_id: instanceRequestId,
  //               time_slot_id: slotId,
  //               selected_date: date,
  //             });
  //           });
  //         }
  //       }
  //     );

  //     await fetchAPI("/userTimeSlots/bulk", {
  //       method: "POST",
  //       body: JSON.stringify({ timeSlots }),
  //     });

  //     console.log("Time slots saved successfully");
  //   } catch (error) {
  //     console.error("Error saving time slots:", error);
  //     throw error;
  //   }
  // };

  // const deleteUserTimeSlots = async (instanceRequestId: string) => {
  //   try {
  //     await fetchAPI(`/userTimeSlots?instanceRequestId=${instanceRequestId}`, {
  //       method: "DELETE",
  //     });
  //     console.log("Time slots deleted successfully");
  //   } catch (error) {
  //     console.error("Error deleting time slots:", error);
  //     throw error;
  //   }
  // };

  // const checkTimeSlotConflicts = async (date: string, slotIds: string[]) => {
  //   try {
  //     const data = await fetchAPI(
  //       `/userTimeSlots/conflicts?date=${date}&instanceId=${instance_id || ""}`
  //     );
  //     const conflicts = slotIds.filter((slotId) =>
  //       data.some((existing: any) => existing.time_slot_id === slotId)
  //     );
  //     return conflicts;
  //   } catch (error) {
  //     console.error("Error checking time slot conflicts:", error);
  //     return [];
  //   }
  // };

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
          // error = 'Please select at least one date';
          error = " ";
        } else {
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

  // const validateForm = () => {
  //   const newErrors: ErrorsType = {};
  //   let isValid = true;

  //   // First validate non-time-slot fields
  //   (Object.keys(formData) as Array<keyof FormData>).forEach(field => {
  //     if (field !== 'selectedSlots' && field !== 'selectedRanges') {
  //       const error = validateField(field, formData[field]);
  //       if (error) {
  //         newErrors[field] = error;
  //         isValid = false;
  //       }
  //     }
  //   });

  //   // Then validate time slots for each selected date
  //   if (formData.selectedDates.length === 0) {
  //     newErrors.selectedDates = ' ';
  //     isValid = false;
  //   } else {
  //     for (const date of formData.selectedDates) {
  //       const dateSlots = formData.dateTimeSlots[date]?.selectedSlots || [];
  //       if (dateSlots.length === 0) {
  //         newErrors.selectedSlots = `Please select time slots for ${new Date(date).toLocaleDateString()}`;
  //         isValid = false;
  //         break;
  //       }

  //       // Validate consecutive slots requirement for each date
  //       const indices = dateSlots
  //         .map(id => getSlotIndex(id))
  //         .sort((a, b) => a - b);

  //       const ranges: TimeSlotRange[] = [];
  //       if (indices.length > 0) {
  //         let rangeStart = indices[0];
  //         let rangeEnd = indices[0];

  //         for (let i = 1; i < indices.length; i++) {
  //           if (indices[i] === rangeEnd + 1) {
  //             rangeEnd = indices[i];
  //           } else {
  //             ranges.push({ start: rangeStart, end: rangeEnd });
  //             rangeStart = indices[i];
  //             rangeEnd = indices[i];
  //           }
  //         }
  //         ranges.push({ start: rangeStart, end: rangeEnd });
  //       }

  //       const hasSingleSlotRange = ranges.some(range => range.start === range.end);
  //       if (hasSingleSlotRange) {
  //         newErrors.selectedSlots = `Time slots for ${new Date(date).toLocaleDateString()} must be consecutive`;
  //         isValid = false;
  //         break;
  //       }
  //     }
  //   }

  //   setErrors(newErrors);
  //   setTouched(
  //     (Object.keys(formData) as Array<keyof FormData>)
  //       .reduce((acc, key) => ({ ...acc, [key]: true }), {} as Record<keyof FormData, boolean>)
  //   );

  //   return isValid;
  // };

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
          newErrors.selectedSlots = `Please select time slots for ${new Date(
            date
          ).toLocaleDateString()}`;
          isValid = false;
          break;
        }

        // Validate that slots are consecutive (no gaps)
        // const indices = dateSlots
        //   .map((id) => getSlotIndex(id))
        //   .filter((index) => index !== -1) // Filter out invalid indices
        //   .sort((a, b) => a - b);

        // // Check for gaps in the selected slots
        // let hasGap = false;
        // for (let i = 1; i < indices.length; i++) {
        //   if (indices[i] !== indices[i - 1] + 1) {
        //     hasGap = true;
        //     break;
        //   }
        // }


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
          newErrors.selectedSlots = `Time slots for ${new Date(
            date
          ).toLocaleDateString()} must have at least 2 consecutive slots in each range`;
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

  // Success and Error Snackbar functions
  // const showSuccessSnackbar = () => {
  //   setShowSnackbar(true);
  //   setTimeout(() => {
  //     setShowSnackbar(false);
  //     router.push('/user');
  //   }, 3000);
  // };

  //   const showSuccessSnackbar = () => {
  //   setShowSnackbar(true);
  //   setTimeout(() => {
  //     setShowSnackbar(false);
  //   }, 2500); // Keep visible for 2.5 seconds
  //   setTimeout(() => {
  //     router.push('/user');
  //   }, 4000); // Wait 4 seconds before redirect (includes fade-out time)
  // };

  const showSuccessSnackbar = () => {
    setShowSnackbar(true);
    setTimeout(() => {
      setShowSnackbar(false);
    }, 2500); // Keep visible for 2.5 seconds
    setTimeout(() => {
      router.push("/user");
    }, 4000); // Redirect after 4 seconds total
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

  // useEffect(() => {
  //   console.log("Selected Date Changed=", selectedDate);
  //   errors.selectedSlots = "";
  //   if (selectedDate !== "") {
  //     getUserTimeSlots();
  //   }
  // }, [selectedDate]);

  // const getInstanceRequests = async () => {
  //   const { data: instanceRequest, errors } = await client.models.instanceRequest.list();
  //   console.log("Instance Request=", instanceRequest);
  // }

  // const getUserTypes = async () => {
  //   const { data: userTypes, errors } = await client.models.userType.list();
  //   setUserType(userTypes);
  // }

  // const getTimeSlots = async () => {
  //   const { data: timeSlots, errors } = await client.models.timeSlot.list();
  //   setTimeSlot(timeSlots);
  // }

  // const getImages = async () => {
  //   const { data: images, errors } = await client.models.image.list();
  //   setCustomImage(images);
  // }

  // const getCPUs = async () => {
  //   const { data: cpus, errors } = await client.models.cpu.list();
  //   setCpu(cpus)
  // }

  // const getStatus = async () => {
  //   const { data: statuses, errors } = await client.models.status.list();
  //   setStatus(statuses)
  //   for (let i = 0; i < statuses.length; i++) {
  //     if (statuses[i].status_name == "Pending") {
  //       const status_id = statuses[i].id.toString();
  //       formData.statusId = (status_id);
  //       break;
  //     };
  //   }
  //   console.log("Status=", formData.statusId);
  //   // statuses[0].status_name == "Pending" ? setStatusId(statuses[0].id.toString()) : setStatusId("");
  // }

  // const getGPUPartition = async () => {
  //   const { data: gpuPartition, errors } = await client.models.gpuPartition.list();
  //   setGpuPartition(gpuPartition);
  // }

  // const getRam = async () => {
  //   const { data: rams, errors } = await client.models.ram.list();
  //   setRam(rams);
  // }

  // const getGPUSlots = async () => {
  //   const { data: gpuSlots, errors } = await client.models.gpuVendor.list();
  //   setGpuSlot(gpuSlots);
  // }

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
    }
  };

  // Replace the useEffect that handles instance_id with this:

  useEffect(() => {
    if (instance_id && timeSlot.length > 0) {
      // Only fetch instance data after timeSlot is loaded
      getInstanceRequestByUserId();
    }
  }, [instance_id, timeSlot.length]); // Add timeSlot.length as dependency

  // Update getUserTimeSlotsForInstance to add validation:

  // const getUserTimeSlotsForInstance = async (instanceRequestId: string) => {
  //   try {
  //     // Wait for timeSlot to be loaded
  //     if (timeSlot.length === 0) {
  //       console.warn("Time slots not loaded yet, waiting...");
  //       return;
  //     }

  //     const { data: userTimeSlots, errors } = await client.models.userTimeSlot.list({
  //       filter: {
  //         instance_request_id: { eq: instanceRequestId }
  //       }
  //     });

  //     if (userTimeSlots && userTimeSlots.length > 0) {
  //       const selectedSlotIds = userTimeSlots
  //         .map(slot => slot.time_slot_id || '')
  //         .filter(id => id !== '');

  //       // Validate that all slot IDs exist in timeSlot array
  //       const validSlotIds = selectedSlotIds.filter(id => getSlotIndex(id) !== -1);

  //       if (validSlotIds.length !== selectedSlotIds.length) {
  //         console.warn("Some slot IDs were not found in timeSlot array");
  //       }

  //       // Sort slot IDs by their index
  //       validSlotIds.sort((a, b) => getSlotIndex(a) - getSlotIndex(b));

  //       // Reconstruct ranges from slot IDs
  //       const indices = validSlotIds.map(id => getSlotIndex(id)).sort((a, b) => a - b);
  //       const ranges: TimeSlotRange[] = [];

  //       if (indices.length > 0) {
  //         let rangeStart = indices[0];
  //         let rangeEnd = indices[0];

  //         for (let i = 1; i < indices.length; i++) {
  //           if (indices[i] === rangeEnd + 1) {
  //             rangeEnd = indices[i];
  //           } else {
  //             ranges.push({ start: rangeStart, end: rangeEnd });
  //             rangeStart = indices[i];
  //             rangeEnd = indices[i];
  //           }
  //         }
  //         ranges.push({ start: rangeStart, end: rangeEnd });
  //       }

  //       console.log("Loaded time slots:", validSlotIds);
  //       console.log("Reconstructed ranges:", ranges);

  //       setFormData(prev => ({
  //         ...prev,
  //         selectedSlots: validSlotIds,
  //         selectedRanges: ranges,
  //         selectedDate: userTimeSlots[0].selected_date || prev.selectedDate
  //       }));

  //       // Clear any existing validation errors for time slots
  //       setErrors(prev => ({
  //         ...prev,
  //         selectedSlots: ''
  //       }));
  //     }

  //     if (errors) {
  //       console.error("Error fetching user time slots:", errors);
  //     }
  //   } catch (error) {
  //     console.error("Error in getUserTimeSlotsForInstance:", error);
  //   }
  // };

  // 1. Update getUserTimeSlots to exclude current instance slots
  // const getUserTimeSlots = async () => {
  //   const { data: userTimeSlot, errors } = await client.models.userTimeSlot.list(
  //     {
  //       filter: {
  //         selected_date: { eq: selectedDate },
  //         // Exclude slots from the current instance being edited
  //         ...(instance_id ? { instance_request_id: { ne: instance_id } } : {})
  //       }
  //     }
  //   );
  //   console.log("User Time Slot=", userTimeSlot);
  //   setUserTimeSlot(userTimeSlot);
  // }

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

  // 3. Update the selectedDate useEffect to handle edit mode properly
  // useEffect(() => {
  //   console.log("Selected Date Changed=", selectedDate);
  //   if (selectedDate !== "") {
  //     // Always call getUserTimeSlots when date changes
  //     // It will now properly filter out the current instance's slots
  //     getUserTimeSlots();
  //   }
  // }, [selectedDate]);


  // Add this useEffect right after the existing selectedDate useEffect (around line 1218)
// useEffect(() => {
//   // When selectedDate changes, update selectedSlots to show slots for the new date
//   if (selectedDate && formData.dateTimeSlots[selectedDate]) {
//     setFormData(prev => ({
//       ...prev,
//       selectedSlots: formData.dateTimeSlots[selectedDate].selectedSlots,
//       selectedRanges: formData.dateTimeSlots[selectedDate].selectedRanges
//     }));
//   }
// }, [selectedDate, formData.dateTimeSlots]);


  // Update selectedSlots and selectedRanges when selectedDate changes
  // useEffect(() => {
  //   if (selectedDate && formData.dateTimeSlots && formData.dateTimeSlots[selectedDate]) {
  //     const dateSlots = formData.dateTimeSlots[selectedDate];
  //     console.log(`Syncing slots for date ${selectedDate}:`, dateSlots);
      
  //     setFormData(prev => ({
  //       ...prev,
  //       selectedSlots: dateSlots.selectedSlots || [],
  //       selectedRanges: dateSlots.selectedRanges || []
  //     }));
  //   }
  // }, [selectedDate, formData.dateTimeSlots]);


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
      className={`fixed inset-x-0 bottom-5 flex justify-center z-50 transition-all duration-500 ${
        showSnackbar
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

  // Update updateUserTimeSlots similarly for editing
  // const updateUserTimeSlots = async (instanceRequestId: string) => {
  //   try {
  //     // First delete all existing time slots for this instance
  //     await deleteUserTimeSlots(instanceRequestId);

  //     // Create new time slots for all dates
  //     const allSlotPromises: Promise<any>[] = [];

  //     formData.selectedDates.forEach(date => {
  //       formData.selectedSlots.forEach(slotId => {
  //         const slotPromise = client.models.userTimeSlot.create({
  //           instance_request_id: instanceRequestId,
  //           time_slot_id: slotId,
  //           selected_date: date,
  //           created_by: "",
  //           updated_by: "",
  //         });
  //         allSlotPromises.push(slotPromise);
  //       });
  //     });

  //     await Promise.all(allSlotPromises);
  //     console.log(`Time slots updated successfully for all dates`);
  //   } catch (error) {
  //     console.error("Error updating time slots:", error);
  //     throw error;
  //   }
  // };

  // Update handleDateAdd function
  const handleDateAdd = (dateValue: string) => {
    if (!dateValue) return;

    const dateObj = new Date(dateValue);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dateObj < today) {
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

    // Initialize empty time slots for the new date
    // const updatedDateTimeSlots = {
    //   ...formData.dateTimeSlots,
    //   [dateValue]: {
    //     selectedSlots: [],
    //     selectedRanges: [],
    //   },
    // };

    // setFormData((prev) => ({
    //   ...prev,
    //   selectedDates: [...currentDates, dateValue].sort(),
    //   dateTimeSlots: updatedDateTimeSlots,
    //   selectedSlots: [], // Clear current working slots
    //   selectedRanges: [], // Clear current working ranges
    // }));
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
    dateTimeSlots: updatedDateTimeSlots,  // Make sure this is set
    selectedSlots: [],
    selectedRanges: []
  }));

    setErrors((prev) => ({ ...prev, selectedDates: "" }));
    setSelectedDate(dateValue); // Set as current working date
  };

  // Update handleDateRemove function
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
  };

  // Update the submit function
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

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
          `Some time slots are already booked for ${new Date(
            date
          ).toLocaleDateString()}`
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

  // Update saveInstanceRequest to handle the saving process
  // const saveInstanceRequest = async () => {
  //   try {
  //     // Validate that we have time slots selected for each date
  //     for (const date of formData.selectedDates) {
  //       const dateSlots = formData.dateTimeSlots[date]?.selectedSlots || [];
  //       if (dateSlots.length === 0) {
  //         throw new Error(`Please select time slots for ${new Date(date).toLocaleDateString()}`);
  //       }
  //     }

  //     const today = new Date();
  //     const formattedDate = today.toISOString().split('T')[0];

  //     // Create the instance request
  //     const response = await client.models.instanceRequest.create({
  //       user_id: userId,
  //       remarks: "",
  //       image_id: formData.customImageId,
  //       cpu_id: formData.cpuId,
  //       selected_date: formattedDate,
  //       gpu_partition_id: formData.gpuPartitionId,
  //       ram_id: formData.ramId,
  //       gpu_vendor_id: formData.gpuSlotId,
  //       work_description: formData.workDescription,
  //       status_id: formData.statusId || status.find(s => s.status_name === "Pending")?.id,
  //       storage_volume: parseInt(formData.storageVolume || '10'),
  //       user_type_id: formData.userTypeId,
  //       login_id: "",
  //       password: "",
  //       access_link: "",
  //       is_access_granted: false,
  //       additional_information: "",
  //       created_by: "",
  //       updated_by: "",
  //     });

  //     if (response.data?.id) {
  //       // Save time slots for all selected dates
  //       await saveUserTimeSlots(response.data.id);
  //       showSuccessSnackbar();
  //       handleReset();
  //     }
  //   } catch (error: any) {
  //     console.error("Error creating instance request:", error);
  //     showErrorSnackbarFunc(error.message || 'Error submitting request. Please try again later.');
  //   }
  // };

  // Add this effect to update displayed slots when changing dates
  // useEffect(() => {
  //   if (selectedDate && formData.dateTimeSlots[selectedDate]) {
  //     const dateSlots = formData.dateTimeSlots[selectedDate];
  //     setFormData((prev) => ({
  //       ...prev,
  //       selectedSlots: dateSlots.selectedSlots,
  //       selectedRanges: dateSlots.selectedRanges,
  //     }));
  //   } else {
  //     setFormData((prev) => ({
  //       ...prev,
  //       selectedSlots: [],
  //       selectedRanges: [],
  //     }));
  //   }
  // }, [selectedDate]);

  // Update the saveUserTimeSlots function
  // const saveUserTimeSlots = async (instanceRequestId: string) => {
  //   try {
  //     const allSlotPromises: Promise<any>[] = [];

  //     // Save time slots for each date using its specific selections
  //     Object.entries(formData.dateTimeSlots).forEach(([date, { selectedSlots }]) => {
  //       if (selectedSlots && selectedSlots.length > 0) {
  //         selectedSlots.forEach(slotId => {
  //           const slotPromise = client.models.userTimeSlot.create({
  //             instance_request_id: instanceRequestId,
  //             time_slot_id: slotId,
  //             selected_date: date,
  //             created_by: "",
  //             updated_by: "",
  //           });
  //           allSlotPromises.push(slotPromise);
  //         });
  //       }
  //     });

  //     await Promise.all(allSlotPromises);
  //     console.log('Time slots saved successfully for all dates:', formData.dateTimeSlots);
  //   } catch (error) {
  //     console.error("Error saving time slots:", error);
  //     throw error;
  //   }
  // };

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
              className={`mb-1 p-1 border rounded-sm transition-all ${
                isCurrentDate
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200"
              }`}
              onClick={() => setSelectedDate(date)}
              style={{ cursor: "pointer" }}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="font-small text-sm text-gray-700">
                  {new Date(date).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
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
                      className={`px-1 py-1 rounded-sm text-xs ${
                        isCurrentDate
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

  // Update the useEffect to handle date changes
  // useEffect(() => {
  //   if (selectedDate) {
  //     // Load existing slots for the selected date
  //     const dateSlots = formData.dateTimeSlots[selectedDate];
  //     setFormData((prev) => ({
  //       ...prev,
  //       selectedSlots: dateSlots?.selectedSlots || [],
  //       selectedRanges: dateSlots?.selectedRanges || [],
  //     }));

  //     // Also load booked slots for this date
  //     getUserTimeSlots();
  //   }
  // }, [selectedDate]);



  // Update the useEffect to handle date changes
// useEffect(() => {
//   if (selectedDate && formData.dateTimeSlots[selectedDate]) {
//     // Load existing slots for the selected date
//     const dateSlots = formData.dateTimeSlots[selectedDate];
//     console.log("📅 Switching to date:", selectedDate);
//     console.log("📌 Slots for this date:", dateSlots?.selectedSlots);
    
//     setFormData((prev) => ({
//       ...prev,
//       selectedSlots: dateSlots?.selectedSlots || [],
//       selectedRanges: dateSlots?.selectedRanges || [],
//     }));

//     // Also load booked slots for this date
//     getUserTimeSlots();
//   }
// }, [selectedDate, instance_id]); // Add instance_id as dependency






  // Update the useEffect to handle date changes - with proper dependency handling
  // useEffect(() => {
  //   if (selectedDate) {
  //     // Load existing slots for the selected date from dateTimeSlots
  //     const dateSlots = formData.dateTimeSlots[selectedDate];
      
  //     if (dateSlots) {
  //       console.log("📅 Date changed to:", selectedDate);
  //       console.log("📌 Loading slots for this date:", dateSlots.selectedSlots);
        
  //       setFormData((prev) => ({
  //         ...prev,
  //         selectedSlots: dateSlots.selectedSlots || [],
  //         selectedRanges: dateSlots.selectedRanges || [],
  //       }));
  //     }

  //     // Fetch booked slots for this date (slots booked by other users)
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

    // Also load booked slots for this date
    getUserTimeSlots();
  }
}, [selectedDate, instance_id]);

  // New function to fetch user time slots with proper date parameter
  const getUserTimeSlotsForDate = async (date: string) => {
    try {
      const params = new URLSearchParams();
      if (date) params.append('selectedDate', date);
      if (instance_id) params.append('excludeInstanceId', instance_id);
      
      const data = await fetchAPI(`/userTimeSlots?${params.toString()}`);
      setUserTimeSlot(data);
      console.log("📋 Booked slots for", date, ":", data);
    } catch (error) {
      console.error('Error fetching user time slots:', error);
      showErrorSnackbarFunc('Failed to load time slots');
    }
  };




  // Update getInstanceRequestByUserId function to handle multiple dates
  // const getInstanceRequestByUserId = async () => {
  //   try {
  //     const { data: instanceRequest, errors } = await client.models.instanceRequest.list({
  //       filter: {
  //         id: { eq: instance_id || "" }
  //       }
  //     });

  //     const { data: dbUser, error: userErr } = await supabase.from("userType").select("*").eq("email_id", email).single();

  //     if (instanceRequest && instanceRequest.length > 0) {
  //       const request = instanceRequest[0];

  //       // First get all user time slots for this instance
  //       const { data: userTimeSlots } = await client.models.userTimeSlot.list({
  //         filter: {
  //           instance_request_id: { eq: request.id }
  //         }
  //       });

  //       // Group time slots by date
  //       const timeSlotsByDate: DateTimeSlots = {};
  //       const uniqueDates: string[] = [];

  //       userTimeSlots.forEach(slot => {
  //         const date = slot.selected_date;
  //         if (date) {
  //           if (!timeSlotsByDate[date]) {
  //             timeSlotsByDate[date] = {
  //               selectedSlots: [],
  //               selectedRanges: []
  //             };
  //             uniqueDates.push(date);
  //           }
  //           timeSlotsByDate[date].selectedSlots.push(slot.time_slot_id + "");
  //         }
  //       });

  //       // Calculate ranges for each date
  //       Object.keys(timeSlotsByDate).forEach(date => {
  //         const slots = timeSlotsByDate[date].selectedSlots;
  //         const indices = slots.map(id => getSlotIndex(id)).sort((a, b) => a - b);
  //         const ranges: TimeSlotRange[] = [];

  //         if (indices.length > 0) {
  //           let rangeStart = indices[0];
  //           let rangeEnd = indices[0];

  //           for (let i = 1; i < indices.length; i++) {
  //             if (indices[i] === rangeEnd + 1) {
  //               rangeEnd = indices[i];
  //             } else {
  //               ranges.push({ start: rangeStart, end: rangeEnd });
  //               rangeStart = indices[i];
  //               rangeEnd = indices[i];
  //             }
  //           }
  //           ranges.push({ start: rangeStart, end: rangeEnd });
  //         }

  //         timeSlotsByDate[date].selectedRanges = ranges;
  //       });

  //       // Set form data with all the loaded information
  //       setFormData({
  //         userTypeId: request.user_type_id || '',
  //         selectedDate: uniqueDates[0] || '', // Set first date as current working date
  //         selectedDates: uniqueDates,
  //         customImageId: request.image_id || '',
  //         cpuId: request.cpu_id || '',
  //         statusId: request.status_id || '',
  //         gpuPartitionId: request.gpu_partition_id || '',
  //         storageVolume: request.storage_volume?.toString() || '10',
  //         ramId: request.ram_id || '',
  //         gpuSlotId: request.gpu_vendor_id || '',
  //         workDescription: request.work_description || '',
  //         dateTimeSlots: timeSlotsByDate,
  //         selectedSlots: timeSlotsByDate[uniqueDates[0]]?.selectedSlots || [],
  //         selectedRanges: timeSlotsByDate[uniqueDates[0]]?.selectedRanges || []
  //       });

  //       // Set the first date as the current working date
  //       setSelectedDate(uniqueDates[0] || '');
  //     }

  //     if (errors) {
  //       console.error("Error fetching instance request:", errors);
  //       showErrorSnackbarFunc('Error loading instance request data');
  //     }
  //   } catch (error) {
  //     console.error("Error in getInstanceRequestByUserId:", error);
  //     showErrorSnackbarFunc('Failed to load instance request data');
  //   }
  // };

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

  // Add this helper function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Update the updateInstanceRequest function to properly handle updates
  // const updateInstanceRequest = async () => {
  //   try {
  //     // First validate that we have time slots for each date
  //     for (const date of formData.selectedDates) {
  //       const dateSlots = formData.dateTimeSlots[date]?.selectedSlots || [];
  //       if (dateSlots.length === 0) {
  //         throw new Error(`Please select time slots for ${new Date(date).toLocaleDateString()}`);
  //       }
  //     }

  //     // Update the instance request
  //     const response = await client.models.instanceRequest.update({
  //       id: instance_id, // This is the key field for update
  //       user_id: userId,
  //       remarks: "",
  //       image_id: formData.customImageId,
  //       cpu_id: formData.cpuId,
  //       selected_date: new Date().toISOString().split('T')[0], // Current date
  //       gpu_partition_id: formData.gpuPartitionId,
  //       ram_id: formData.ramId,
  //       gpu_vendor_id: formData.gpuSlotId,
  //       work_description: formData.workDescription,
  //       status_id: formData.statusId,
  //       storage_volume: parseInt(formData.storageVolume || '10'),
  //       user_type_id: formData.userTypeId,
  //       login_id: "",
  //       password: "",
  //       access_link: "",
  //       is_access_granted: false,
  //       additional_information: "",
  //       created_by: "",
  //       updated_by: "",
  //     });

  //     if (!response.data?.id) {
  //       throw new Error('Failed to update instance request');
  //     }

  //     // Delete existing time slots first
  //     await deleteUserTimeSlots(instance_id);

  //     // Create new time slots for all selected dates
  //     const allSlotPromises: Promise<any>[] = [];

  //     Object.entries(formData.dateTimeSlots).forEach(([date, { selectedSlots }]) => {
  //       selectedSlots.forEach(slotId => {
  //         const slotPromise = client.models.userTimeSlot.create({
  //           instance_request_id: instance_id,
  //           time_slot_id: slotId,
  //           selected_date: date,
  //           created_by: "",
  //           updated_by: "",
  //         });
  //         allSlotPromises.push(slotPromise);
  //       });
  //     });

  //     await Promise.all(allSlotPromises);

  //     showSuccessSnackbar();
  //     router.push('/user');
  //   } catch (error: any) {
  //     console.error("Error updating instance request:", error);
  //     showErrorSnackbarFunc(error.message || 'Error updating request. Please try again later.');
  //   }
  // };

  // // Update deleteUserTimeSlots to properly handle deletion
  // const deleteUserTimeSlots = async (instanceRequestId: string) => {
  //   try {
  //     console.log('Deleting time slots for instance:', instanceRequestId);

  //     const { data: existingSlots, errors: fetchErrors } = await client.models.userTimeSlot.list({
  //       filter: {
  //         instance_request_id: { eq: instanceRequestId }
  //       }
  //     });

  //     if (fetchErrors) {
  //       throw new Error("Error fetching existing time slots");
  //     }

  //     if (existingSlots && existingSlots.length > 0) {
  //       const deletePromises = existingSlots.map(slot =>
  //         client.models.userTimeSlot.delete({ id: slot.id })
  //       );

  //       await Promise.all(deletePromises);
  //       console.log(`${existingSlots.length} time slots deleted successfully`);
  //     }
  //   } catch (error) {
  //     console.error("Error deleting time slots:", error);
  //     throw error;
  //   }
  // };

  const isSlotBooked = (slotId: string) => {
    // If in edit mode, don't consider slots from the current instance as booked
    return userTimeSlot.some(
      (uslot) =>
        uslot.time_slot_id === slotId &&
        (!instance_id || uslot.instance_request_id !== instance_id)
    );
  };

  // const checkTimeSlotConflicts = async (date: string, slotIds: string[]) => {
  //   try {
  //     const { data: existingSlots } = await client.models.userTimeSlot.list({
  //       filter: {
  //         selected_date: { eq: date },
  //         ...(instance_id ? { instance_request_id: { ne: instance_id } } : {})
  //       }
  //     });

  //     const conflicts = slotIds.filter(slotId =>
  //       existingSlots.some(existing => existing.time_slot_id === slotId)
  //     );

  //     return conflicts;
  //   } catch (error) {
  //     console.error("Error checking time slot conflicts:", error);
  //     return [];
  //   }
  // };

  // Add these new state variables after other state declarations
  const [dateSelectionMode, setDateSelectionMode] = useState<
    "individual" | "range"
  >("individual");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });

  // Add this new function to handle date range selection
  const handleDateRangeAdd = () => {
    if (!dateRange.start || !dateRange.end) {
      showErrorSnackbarFunc("Please select both start and end dates");
      return;
    }

    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today || endDate < today) {
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

    // Initialize empty time slots for new dates
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

    setDateRange({ start: "", end: "" });
    setErrors((prev) => ({ ...prev, selectedDates: "" }));
  };

  // Update the handleReplicateSlots function
  const handleReplicateSlots = async (sourceDate?: string) => {
    setIsReplicating(true); // Start loading
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
      const conflictDetails: { [key: string]: string[] } = {};
      for (const date of targetDates) {
        console.log(`Checking conflicts for date: ${date}`);
        const conflicts = await checkTimeSlotConflicts(date, sourceSlots);
        if (conflicts.length > 0) {
          conflictDetails[date] = conflicts;
          console.log(`Conflicts found for ${date}:`, conflicts);
        }
      }

      // If there are any conflicts, show detailed error message
      if (Object.keys(conflictDetails).length > 0) {
        const conflictDatesArray = Object.keys(conflictDetails);
        const conflictDates = conflictDatesArray
          .map((date) => new Date(date).toLocaleDateString())
          .join(", ");

        // Get the conflicting slot times for more detailed error message
        const conflictingSlotTimes: string[] = [];
        Object.values(conflictDetails).forEach((slotIds) => {
          slotIds.forEach((slotId) => {
            const slot = timeSlot.find(
              (ts) => ts.time_slot_id.toString() === slotId
            );
            if (slot && !conflictingSlotTimes.includes(slot.time_slot || "")) {
              conflictingSlotTimes.push(slot.time_slot || "");
            }
          });
        });

        const errorMsg = `Cannot replicate slots to ${conflictDates}. Time slots [${conflictingSlotTimes.join(
          ", "
        )}] are already booked. Please select different time slots or dates.`;

        console.error("Replication conflict error:", {
          conflictDates,
          conflictingSlots: conflictingSlotTimes,
          affectedDates: conflictDatesArray,
        });

        // Show error in multiple ways for better visibility
        setErrors((prev) => ({
          ...prev,
          selectedSlots: errorMsg,
        }));

        setTouched((prev) => ({
          ...prev,
          selectedSlots: true,
        }));
        // showErrorSnackbarFunc(errorMsg);
        return;
      }

      // Build ranges for the sourceSlots (by index in timeSlot)
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

      // Update dateTimeSlots for all target dates
      setFormData((prev) => {
        const updatedDateTimeSlots = { ...prev.dateTimeSlots };
        targetDates.forEach((date) => {
          updatedDateTimeSlots[date] = {
            selectedSlots: [...sourceSlots],
            selectedRanges: ranges.map((r) => ({ start: r.start, end: r.end })),
          };
        });

        // If the current selectedDate is one of the targets, also update current working selection
        const updatedSelectedSlots =
          prev.selectedDate && targetDates.includes(prev.selectedDate)
            ? [...sourceSlots]
            : prev.selectedSlots;

        const updatedSelectedRanges =
          prev.selectedDate && targetDates.includes(prev.selectedDate)
            ? ranges.map((r) => ({ start: r.start, end: r.end }))
            : prev.selectedRanges;

        return {
          ...prev,
          dateTimeSlots: updatedDateTimeSlots,
          selectedSlots: updatedSelectedSlots,
          selectedRanges: updatedSelectedRanges,
        };
      });

      // Clear any previous slot errors on success
      setErrors((prev) => ({ ...prev, selectedSlots: "" }));

      // Show brief success feedback
      const successMsg = `Slots replicated to ${targetDates.length} date${
        targetDates.length > 1 ? "s" : ""
      }`;
      console.log("Replication successful:", successMsg);
      showSuccessSnackbarFunc(successMsg);
    } catch (error) {
      console.error("Error replicating slots:", error);
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Failed to replicate time slots. Please try again.";
      showErrorSnackbarFunc(errorMsg);
      setErrors((prev) => ({ ...prev, selectedSlots: errorMsg }));
    } finally {
      setIsReplicating(false); // Stop loading
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

    // Calculate new ranges
    // const indices = newSelectedSlots
    //   .map((id) => getSlotIndex(id))
    //   .sort((a, b) => a - b);
    // const ranges: TimeSlotRange[] = [];

    // if (indices.length > 0) {
    //   let rangeStart = indices[0];
    //   let rangeEnd = indices[0];

    //   for (let i = 1; i < indices.length; i++) {
    //     if (indices[i] === rangeEnd + 1) {
    //       rangeEnd = indices[i];
    //     } else {
    //       ranges.push({ start: rangeStart, end: rangeEnd });
    //       rangeStart = indices[i];
    //       rangeEnd = indices[i];
    //     }
    //   }
    //   ranges.push({ start: rangeStart, end: rangeEnd });
    // }


    // NEW - filters out invalid indices (-1)
// const indices = newSelectedSlots
//   .map((id) => getSlotIndex(id))
//   .filter((index) => index !== -1) // Filter out invalid indices
//   .sort((a, b) => a - b);



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

  // if (authLoading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen bg-gray-50">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500 mx-auto mb-4"></div>
  //         <p className="text-gray-600">Verifying access...</p>
  //       </div>
  //     </div>
  //   );
  // }

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










































































  // ============== CORRECTED API CALLS ==============

// 1. getUserTimeSlots - FIX: Use query parameter 'selectedDate' not 'selectedDate'
const getUserTimeSlots = async () => {
  try {
    const params = new URLSearchParams();
    if (selectedDate) params.append('selectedDate', selectedDate);
    if (instance_id) params.append('excludeInstanceId', instance_id);
    
    const data = await fetchAPI(`/userTimeSlots?${params.toString()}`);
    setUserTimeSlot(data);
  } catch (error) {
    console.error('Error fetching user time slots:', error);
    showErrorSnackbarFunc('Failed to load time slots');
  }
};

// 2. saveUserTimeSlots - CORRECTED ENDPOINT
// const saveUserTimeSlots = async (instanceRequestId: string) => {
//   try {
//     const timeSlots: any[] = [];

//     Object.entries(formData.dateTimeSlots).forEach(
//       ([date, { selectedSlots }]) => {
//         if (selectedSlots && selectedSlots.length > 0) {
//           selectedSlots.forEach((slotId) => {
//             timeSlots.push({
//               instance_request_id: instanceRequestId,
//               time_slot_id: slotId,
//               selected_date: date,
//               created_by: userId || 1,
//               updated_by: userId || 1
//             });
//           });
//         }
//       }
//     );

//     await fetchAPI('/userTimeSlots/bulk', {
//       method: 'POST',
//       body: JSON.stringify({ timeSlots }),
//     });

//     console.log('Time slots saved successfully');
//   } catch (error) {
//     console.error('Error saving time slots:', error);
//     throw error;
//   }
// };





// const saveUserTimeSlots = async (instanceRequestId: string) => {
//   try {
//     const timeSlots: any[] = [];

//     Object.entries(formData.dateTimeSlots).forEach(
//       ([date, { selectedSlots }]) => {
//         if (selectedSlots && selectedSlots.length > 0) {
//           selectedSlots.forEach((slotId) => {
//             timeSlots.push({
//               instance_request_id: instanceRequestId,
//               time_slot_id: slotId,
//               selected_date: date,
//             });
//           });
//         }
//       }
//     );

//     await fetchAPI('/userTimeSlots/bulk', {
//       method: 'POST',
//       body: JSON.stringify({ 
//         timeSlots,
//         userId: userId || loggedInUserId  // Add actual user ID
//       }),
//     });

//     console.log('Time slots saved successfully');
//   } catch (error) {
//     console.error('Error saving time slots:', error);
//     throw error;
//   }
// };



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
const checkTimeSlotConflicts = async (date: string, slotIds: string[]) => {
  try {
    const params = new URLSearchParams();
    params.append('date', date);
    if (instance_id) params.append('instanceId', instance_id);
    
    const data = await fetchAPI(`/userTimeSlots/conflicts?${params.toString()}`);
    
    const conflicts = slotIds.filter((slotId) =>
      data.some((existing: any) => existing.time_slot_id === slotId)
    );
    return conflicts;
  } catch (error) {
    console.error('Error checking time slot conflicts:', error);
    return [];
  }
};

// 5. getInstanceRequestByUserId - Should use POST with body
// const getInstanceRequestByUserId = async () => {
//   try {
//     const data = await fetchAPI(`/instanceRequests/${instance_id}`);
//     // or for old endpoint:
//     // const data = await fetchAPI('/getInstanceRequestByUserId', {
//     //   method: 'POST',
//     //   body: JSON.stringify({ userId: loggedInUserId })
//     // });
//     return data;
//   } catch (error) {
//     console.error('Error fetching instance request:', error);
//     showErrorSnackbarFunc('Failed to load instance request');
//   }
// };


// const getInstanceRequestByUserId = async () => {
//   try {
//     const data = await fetchAPI(`/instanceRequests/${instance_id}`);
    
//     // Fetch time slots for this instance
//     const timeSlotData = await fetchAPI(
//       `/userTimeSlots?instanceRequestId=${instance_id}`
//     );

//     // Build dateTimeSlots structure
//     const timeSlotsByDate: DateTimeSlots = {};
//     const uniqueDates: string[] = [];

//     timeSlotData.forEach((slot: any) => {
//       const date = slot.selected_date;
//       if (date) {
//         if (!timeSlotsByDate[date]) {
//           timeSlotsByDate[date] = {
//             selectedSlots: [],
//             selectedRanges: []
//           };
//           uniqueDates.push(date);
//         }
//         // Convert to string to match slot IDs
//         timeSlotsByDate[date].selectedSlots.push(String(slot.time_slot_id));
//       }
//     });

//     // Calculate ranges for each date
//     Object.keys(timeSlotsByDate).forEach(date => {
//       const slots = timeSlotsByDate[date].selectedSlots;
//       const indices = slots
//         .map(id => getSlotIndex(id))
//         .sort((a, b) => a - b);

//       const ranges: TimeSlotRange[] = [];
//       if (indices.length > 0) {
//         let rangeStart = indices[0];
//         let rangeEnd = indices[0];

//         for (let i = 1; i < indices.length; i++) {
//           if (indices[i] === rangeEnd + 1) {
//             rangeEnd = indices[i];
//           } else {
//             ranges.push({ start: rangeStart, end: rangeEnd });
//             rangeStart = indices[i];
//             rangeEnd = indices[i];
//           }
//         }
//         ranges.push({ start: rangeStart, end: rangeEnd });
//       }

//       timeSlotsByDate[date].selectedRanges = ranges;
//     });

//     // Populate form data
//     const firstDate = uniqueDates.length > 0 ? uniqueDates[0] : '';
//     setFormData({
//       userTypeId: String(data.user_type_id || ''),
//       selectedDate: firstDate,
//       selectedDates: uniqueDates.sort(),
//       customImageId: String(data.image_id || ''),
//       cpuId: String(data.cpu_id || ''),
//       statusId: String(data.status_id || ''),
//       gpuPartitionId: String(data.gpu_partition_id || ''),
//       storageVolume: String(data.storage_volume || '10'),
//       ramId: String(data.ram_id || ''),
//       gpuSlotId: String(data.gpu_vendor_id || ''),
//       workDescription: data.work_description || '',
//       dateTimeSlots: timeSlotsByDate,
//       selectedSlots: timeSlotsByDate[firstDate]?.selectedSlots || [],
//       selectedRanges: timeSlotsByDate[firstDate]?.selectedRanges || []
//     });

//     setSelectedDate(firstDate);
//   } catch (error) {
//     console.error('Error fetching instance request:', error);
//     showErrorSnackbarFunc('Failed to load instance request');
//   }
// };



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
      // const indices = slots
      //   .map(id => getSlotIndex(id))
      //   .sort((a, b) => a - b);


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
      gpuSlotId: String(data.gpu_vendor_id || ''),
      workDescription: data.work_description || '',
      dateTimeSlots: timeSlotsByDate,
      selectedSlots: timeSlotsByDate[firstDate]?.selectedSlots || [],
      selectedRanges: timeSlotsByDate[firstDate]?.selectedRanges || []
    };

    console.log("🔍 Setting formData:", newFormData);
    setFormData(newFormData);
    setSelectedDate(firstDate);
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
          `Please select time slots for ${new Date(date).toLocaleDateString()}`
        );
      }
    }

    const payload = {
      user_id: userId || loggedInUserId,
      cpu_id: formData.cpuId,
      gpu_id: 1, // Required field
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

    if (response && response.id) {
      console.log('Instance updated with ID:', response.id);
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
          className={`fixed inset-x-0 bottom-5 flex justify-center z-50 transition-all duration-500 ${
            showErrorSnackbar
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
          className={`fixed inset-x-0 bottom-5 flex justify-center z-50 transition-all duration-500 ${
            successSnackbar
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
          className={`fixed inset-x-0 bottom-5 flex justify-center z-50 transition-all duration-500 ${
            showErrorSnackbar
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
          className={`fixed inset-x-0 bottom-5 flex justify-center z-50 transition-all duration-500 ${
            successSnackbar
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
        <div className="max-w-5xl mx-auto p-4">
          {/* Card Container */}
          {/* <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"> */}
          <div
            className="rounded-xl p-5"
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
                  router.replace("/user");
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
                      ${
                        floatCondition("userTypeId", formData.userTypeId)
                          ? "-top-2 px-1 bg-white"
                          : "top-3"
                      }
                      ${
                        errors.userTypeId && touched.userTypeId
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
                        ${
                          floatCondition(
                            "customImageId",
                            formData.customImageId
                          )
                            ? "-top-2 px-1 bg-white"
                            : "top-3"
                        }
                        ${
                          errors.customImageId && touched.customImageId
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
                        ${
                          floatCondition("cpuId", formData.cpuId)
                            ? "-top-2 px-1 bg-white"
                            : "top-3"
                        }
                        ${
                          errors.cpuId && touched.cpuId
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
                        ${
                          floatCondition(
                            "gpuPartitionId",
                            formData.gpuPartitionId
                          )
                            ? "-top-2 px-1 bg-white"
                            : "top-3"
                        }
                        ${
                          errors.gpuPartitionId && touched.gpuPartitionId
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
                        ${
                          floatCondition("ramId", formData.ramId)
                            ? "-top-2 px-1 bg-white"
                            : "top-3"
                        }
                        ${
                          errors.ramId && touched.ramId
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
                        ${
                          floatCondition("gpuSlotId", formData.gpuSlotId)
                            ? "-top-2 px-1 bg-white"
                            : "top-3"
                        }
                        ${
                          errors.gpuSlotId && touched.gpuSlotId
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
        ${
          floatCondition("storageVolume", formData.storageVolume)
            ? "-top-2 px-1 bg-white"
            : "top-3"
        }
        ${
          errors.storageVolume && touched.storageVolume
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
          ${
            floatCondition("workDescription", formData.workDescription)
              ? "-top-2 px-1 bg-white"
              : "top-3"
          }
          ${
            errors.workDescription && touched.workDescription
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
            ${
              floatCondition("selectedDates", selectedDate)
                ? "-top-2 px-1 bg-white"
                : "top-3"
            }
            ${
              errors.selectedDates && touched.selectedDates
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
                            min={getTodayDate()}
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
                    ) : (
                      // Date range selection
                      <div className="flex items-center gap-4">
                        <div className="relative w-64">
                          <label className="absolute -top-2 left-3 px-1 bg-white text-sm text-[#5A8F00] font-small">
                            Start Date
                          </label>
                          <input
                            type="date"
                            value={dateRange.start}
                            min={getTodayDate()}
                            onChange={(e) =>
                              setDateRange((prev) => ({
                                ...prev,
                                start: e.target.value,
                              }))
                            }
                            className="w-full px-3 pt-2 pb-2 text-sm rounded-lg focus:outline-none bg-white transition-all duration-200 hover:border-green-200 cursor-pointer"
                            style={{
                              color: "#2d4a00",
                              border: "2px solid #e8f5d0",
                            }}
                          />
                        </div>
                        <div className="relative w-64">
                          <label className="absolute -top-2 left-3 px-1 bg-white text-sm text-[#5A8F00] font-small">
                            End Date
                          </label>
                          <input
                            type="date"
                            value={dateRange.end}
                            min={dateRange.start || getTodayDate()}
                            onChange={(e) =>
                              setDateRange((prev) => ({
                                ...prev,
                                end: e.target.value,
                              }))
                            }
                            className="w-full px-3 pt-2 pb-2 text-sm rounded-lg focus:outline-none bg-white transition-all duration-200 hover:border-green-200 cursor-pointer"
                            style={{
                              color: "#2d4a00",
                              border: "2px solid #e8f5d0",
                            }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleDateRangeAdd}
                          disabled={!dateRange.start || !dateRange.end}
                          className="p-2 text-white rounded-full transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
                                  className={`flex items-center gap-1 px-1 py-0.5 rounded-full text-xs cursor-pointer transition-all duration-200 ${
                                    date === selectedDate
                                      ? "bg-green-100 border-1 border-green-500"
                                      : "bg-gray-50 border border-gray-200 hover:border-green-300 hover:bg-green-50"
                                  }`}
                                >
                                  <span className="text-xs text-gray-700">
                                    {new Date(date).toLocaleDateString(
                                      "en-US",
                                      {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                      }
                                    )}
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

                  {errors.selectedSlots && touched.selectedSlots && (
                    <div className="text-red-500 text-sm mb-2">
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
        ${
          isBooked
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
                    className="px-8 py-2 text-white rounded font-semibold transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
                    className="px-8 py-2 text-white rounded font-semibold transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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

// "use client"

// import React, { useCallback, useEffect, useState } from 'react';
// import { ChevronDown, CheckCircle, AlertCircle, X } from 'lucide-react';
// import Header from '@/app/navbar/page';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { Suspense } from 'react';
// // import { checkAuth } from "@/utils/auth";
// import { ArrowRightIcon } from 'lucide-react';

// function DGXInstanceRequestFormContent() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   let instance_id: any = searchParams.get('id');

//   // API Base URL
//   const API_BASE_URL = 'http://localhost:5000/instancerequest';

//   interface FormData {
//     userTypeId: string;
//     selectedDate: string;
//     dateTimeSlots: DateTimeSlots;
//     selectedDates: string[];
//     customImageId: string;
//     cpuId: string;
//     statusId: string;
//     gpuPartitionId: string;
//     storageVolume: string;
//     ramId: string;
//     gpuSlotId: string;
//     workDescription: string;
//     selectedSlots: string[];
//   }

//   type ErrorsType = Partial<Record<keyof FormData, string>>;
//   type TouchedType = Partial<Record<keyof FormData, boolean>>;

//   const [errors, setErrors] = useState<ErrorsType>({});
//   const [touched, setTouched] = useState<TouchedType>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showSnackbar, setShowSnackbar] = useState(false);
//   const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const [successSnackbar, setSuccessSnackbar] = useState(false);

//   interface userType {
//     id: string;
//     user_type: string;
//   }

//   interface customImage {
//     id: string;
//     image_name: string;
//   }

//   interface timeSlot {
//     id: string;
//     time_slot: string;
//   }

//   interface cpu {
//     id: string;
//     number_of_cpu: string;
//   }

//   interface status {
//     id: string;
//     status_name: string;
//   }

//   interface gpuPartition {
//     gpu_partition_id: string;
//     gpu_partition: string;
//   }

//   interface ram {
//     ram_id: string;
//     ram: string;
//   }

//   interface gpu {
//     gpu_id: string;
//     gpu_vendor: string;
//   }

//   const [userType, setUserType] = useState<userType[]>([]);
//   const [customImage, setCustomImage] = useState<customImage[]>([]);
//   const [timeSlot, setTimeSlot] = useState<timeSlot[]>([]);
//   const [userTimeSlot, setUserTimeSlot] = useState<any[]>([]);
//   const [cpu, setCpu] = useState<cpu[]>([]);
//   const [status, setStatus] = useState<status[]>([]);
//   const [gpuPartition, setGpuPartition] = useState<gpuPartition[]>([]);
//   const [ram, setRam] = useState<ram[]>([]);
//   const [gpu, setGpu] = useState<gpu[]>([]);

//   const [userId, setUserId] = useState("" as string);
//   const [selectedDate, setSelectedDate] = useState("" as string);
//   const [focusedField, setFocusedField] = useState<string | null>(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const [dragStart, setDragStart] = useState(null);
//   const [dragEnd, setDragEnd] = useState(null);
//   const [dragMode, setDragMode] = useState<'select' | 'unselect' | null>(null);
//   const [authLoading, setAuthLoading] = useState(true);
//   const [isReplicating, setIsReplicating] = useState(false);
//   const [replicateChecked, setReplicateChecked] = useState<boolean>(false);
//   const [dateSelectionMode, setDateSelectionMode] = useState<'individual' | 'range'>('individual');
//   const [dateRange, setDateRange] = useState<{ start: string, end: string }>({ start: '', end: '' });

//   interface TimeSlotRange {
//     start: number;
//     end: number;
//   }

//   interface DateTimeSlots {
//     [date: string]: {
//       selectedSlots: string[];
//       selectedRanges: TimeSlotRange[];
//     }
//   }

//   const [formData, setFormData] = useState<FormData>({
//     userTypeId: '',
//     selectedDate: '',
//     selectedDates: [],
//     customImageId: '',
//     cpuId: '',
//     dateTimeSlots: {},
//     statusId: '',
//     gpuPartitionId: '',
//     storageVolume: '10',
//     ramId: '',
//     gpuSlotId: '',
//     workDescription: '',
//     selectedSlots: [],
//   });

//   // Fetch wrapper function
//   const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//         headers: {
//           'Content-Type': 'application/json',
//           ...options.headers,
//         },
//         ...options,
//       });

//       if (!response.ok) {
//         throw new Error(`API Error: ${response.statusText}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Fetch error:', error);
//       throw error;
//     }
//   };

//   // useEffect(() => {
//   //   const verifyUser = async () => {
//   //     const result = await checkAuth(["User"], []);
//   //     if (!result.authorized) {
//   //       router.replace(result.redirect || "/login");
//   //     } else {
//   //       setAuthLoading(false);
//   //     }
//   //   };

//   //   verifyUser();
//   // }, [router]);

//   const floatCondition = (name: keyof FormData, value: any) =>
//     value || (errors[name] && focusedField === name);

//   const validateField = (name: keyof FormData, value: any) => {
//     let error = '';

//     switch (name) {
//       case 'userTypeId':
//         if (!value || value === '') {
//           error = 'Please select a User Type';
//         }
//         break;

//       case 'selectedDates':
//         const dates = formData.selectedDates || [];
//         if (dates.length === 0) {
//           error = ' ';
//         } else {
//           const today = new Date();
//           today.setHours(0, 0, 0, 0);

//           const hasPastDate = dates.some(date => {
//             const dateObj = new Date(date);
//             return dateObj < today;
//           });

//           if (hasPastDate) {
//             error = 'One or more dates are in the past';
//           }
//         }
//         break;

//       case 'customImageId':
//         if (!value || value === '') {
//           error = 'Please select an Image';
//         }
//         break;

//       case 'cpuId':
//         if (!value || value === '') {
//           error = 'Please select CPU';
//         }
//         break;

//       case 'gpuPartitionId':
//         if (!value || value === '') {
//           error = 'Please select Number of GPUs';
//         }
//         break;

//       case 'storageVolume':
//         if (!value || value === '') {
//           setFormData(prev => ({ ...prev, [name]: '10' }));
//         } else {
//           const numValue = parseInt(value);
//           if (isNaN(numValue) || numValue < 10 || numValue > 150) {
//             error = 'Storage Volume range 10GB-150GB';
//           }
//         }
//         break;

//       case 'ramId':
//         if (!value || value === '') {
//           error = 'Please select RAM';
//         }
//         break;

//       case 'gpuSlotId':
//         if (!value || value === '') {
//           error = 'Please select GPU Vendor';
//         }
//         break;

//       case 'workDescription':
//         if (!value || value.trim() === '') {
//           error = 'Work Description is required';
//         }
//         break;

//       case 'selectedSlots':
//         if (!value || value.length === 0) {
//           error = 'Please select time slot';
//         } else {
//           const indices = value.map((id: string) => getSlotIndex(id)).sort((a: number, b: number) => a - b);
//           const ranges: TimeSlotRange[] = [];
//           if (indices.length > 0) {
//             let rangeStart = indices[0];
//             let rangeEnd = indices[0];
//             for (let i = 1; i < indices.length; i++) {
//               if (indices[i] === rangeEnd + 1) {
//                 rangeEnd = indices[i];
//               } else {
//                 ranges.push({ start: rangeStart, end: rangeEnd });
//                 rangeStart = indices[i];
//                 rangeEnd = indices[i];
//               }
//             }
//             ranges.push({ start: rangeStart, end: rangeEnd });
//           }
//           const hasSingleSlotRange = ranges.some(range => range.start === range.end);
//           if (hasSingleSlotRange) {
//             error = 'Each time slot range must have at least 2 consecutive slots';
//           }
//         }
//         break;

//       default:
//         break;
//     }

//     return error;
//   };

//   const handleInputChange = (name: keyof FormData, value: any) => {
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));

//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ""
//       }));
//     }
//   };

//   const handleBlur = (name: keyof FormData) => {
//     setTouched(prev => ({
//       ...prev,
//       [name]: true
//     }));

//     const error = validateField(name, formData[name]);
//     if (error) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: error
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors: ErrorsType = {};
//     let isValid = true;

//     (Object.keys(formData) as Array<keyof FormData>).forEach(field => {
//       if (field !== 'selectedSlots') {
//         //   if(field !== 'selectedRanges') {
//         //   const error = validateField(field, formData[field]);
//         //   if (error) {
//         //     newErrors[field] = error;
//         //     isValid = false;
//         //   }
//         // }
//       }
//     });

//     if (formData.selectedDates.length === 0) {
//       newErrors.selectedDates = ' ';
//       isValid = false;
//     } else {
//       for (const date of formData.selectedDates) {
//         const dateSlots = formData.dateTimeSlots[date]?.selectedSlots || [];
//         if (dateSlots.length === 0) {
//           newErrors.selectedSlots = `Please select time slots for ${new Date(date).toLocaleDateString()}`;
//           isValid = false;
//           break;
//         }

//         const indices = dateSlots
//           .map(id => getSlotIndex(id))
//           .sort((a, b) => a - b);

//         const ranges: TimeSlotRange[] = [];
//         if (indices.length > 0) {
//           let rangeStart = indices[0];
//           let rangeEnd = indices[0];

//           for (let i = 1; i < indices.length; i++) {
//             if (indices[i] === rangeEnd + 1) {
//               rangeEnd = indices[i];
//             } else {
//               ranges.push({ start: rangeStart, end: rangeEnd });
//               rangeStart = indices[i];
//               rangeEnd = indices[i];
//             }
//           }
//           ranges.push({ start: rangeStart, end: rangeEnd });
//         }

//         const hasSingleSlotRange = ranges.some(range => range.start === range.end);
//         if (hasSingleSlotRange) {
//           newErrors.selectedSlots = `Time slots for ${new Date(date).toLocaleDateString()} must be consecutive`;
//           isValid = false;
//           break;
//         }
//       }
//     }

//     setErrors(newErrors);
//     setTouched(
//       (Object.keys(formData) as Array<keyof FormData>)
//         .reduce((acc, key) => ({ ...acc, [key]: true }), {} as Record<keyof FormData, boolean>)
//     );

//     return isValid;
//   };

//   const showSuccessSnackbar = () => {
//     setShowSnackbar(true);
//     setTimeout(() => {
//       setShowSnackbar(false);
//       router.push('/user');
//     }, 3000);
//   };

//   const showSuccessSnackbarFunc = (message: string) => {
//     setSuccessMessage(message);
//     setSuccessSnackbar(true);
//     setTimeout(() => {
//       setSuccessSnackbar(false);
//       setSuccessMessage('');
//     }, 5000);
//   };

//   const showErrorSnackbarFunc = (message: string) => {
//     setErrorMessage(message);
//     setShowErrorSnackbar(true);
//     setTimeout(() => {
//       setShowErrorSnackbar(false);
//       setErrorMessage('');
//     }, 8000);
//   };

//   // Fetch all data on mount
//   useEffect(() => {
//     getInstanceRequests();
//     getStatus();
//     getUserTypes();
//     getTimeSlots();
//     getImages();
//     getCPUs();
//     getGPUPartition();
//     getRam();
//     getGPU();
//     fetchUserProfile();
//   }, []);

//   useEffect(() => {
//     if (instance_id && timeSlot.length > 0) {
//       getInstanceRequestByUserId();
//     }
//   }, [instance_id, timeSlot.length]);

//   useEffect(() => {
//     console.log("Selected Date Changed=", selectedDate);
//     errors.selectedSlots = "";
//     if (selectedDate !== "") {
//       getUserTimeSlots();
//     }
//   }, [selectedDate]);

//   // API Fetch Functions
//   const getInstanceRequests = async () => {
//     try {
//       // const data = await fetchAPI('/getInstanceRequests');
//       console.log("Instance Request=");
//     } catch (error) {
//       console.error('Error fetching instance requests:', error);
//     }
//   };

//   const getUserTypes = async () => {
//     try {
//       const data = await fetchAPI('/getUserTypes');
//       setUserType(data);
//     } catch (error) {
//       console.error('Error fetching user types:', error);
//       showErrorSnackbarFunc('Failed to load user types');
//     }
//   };

//   const getTimeSlots = async () => {
//     try {
//       const data = await fetchAPI('/getTimeSlots');
//       setTimeSlot(data);
//     } catch (error) {
//       console.error('Error fetching time slots:', error);
//       showErrorSnackbarFunc('Failed to load time slots');
//     }
//   };

//   const getImages = async () => {
//     try {
//       const data = await fetchAPI('/getImages');
//       setCustomImage(data);
//     } catch (error) {
//       console.error('Error fetching images:', error);
//       showErrorSnackbarFunc('Failed to load images');
//     }
//   };

//   const getCPUs = async () => {
//     try {
//       const data = await fetchAPI('/getCpus');
//       setCpu(data);
//     } catch (error) {
//       console.error('Error fetching CPUs:', error);
//       showErrorSnackbarFunc('Failed to load CPUs');
//     }
//   };

//   const getStatus = async () => {
//     try {
//       // const data = await fetchAPI('/getStatuses');
//       console.log("Status=");
//       // setStatus(data);
//       // for (let i = 0; i < data.length; i++) {
//       //   if (data[i].status_name === "Pending") {
//       //     formData.statusId = data[i].id.toString();
//       //     break;
//       //   }
//       // }
//     } catch (error) {
//       console.error('Error fetching statuses:', error);
//       showErrorSnackbarFunc('Failed to load statuses');
//     }
//   };

//   const getGPU = async () => {
//     try {
//       const data = await fetchAPI('/getGpus');
//       setGpu(data);
//     } catch (error) {
//       console.error('Error fetching GPU partitions:', error);
//       showErrorSnackbarFunc('Failed to load GPU partitions');
//     }
//   };

//   const getRam = async () => {
//     try {
//       const data = await fetchAPI('/getRams');
//       setRam(data);
//     } catch (error) {
//       console.error('Error fetching RAM options:', error);
//       showErrorSnackbarFunc('Failed to load RAM options');
//     }
//   };

//   const getGPUPartition = async () => {
//     try {
//       const data = await fetchAPI('/getGpuPartition');
//       setGpuPartition(data);
//     } catch (error) {
//       console.error('Error fetching GPU vendors:', error);
//       showErrorSnackbarFunc('Failed to load GPU vendors');
//     }
//   };

//   const fetchUserProfile = useCallback(async () => {
//     try {
//       // const data = await fetchAPI('/users/getProfile');
//       // setUserId(data.id);
//       // console.log("✅ User Profile:", data.id);
//     } catch (err) {
//       console.error("❌ Error fetching user profile:", err);
//       showErrorSnackbarFunc('Failed to load user profile');
//     }
//   }, []);

//   const getUserTimeSlots = async () => {
//     try {
//       const data = await fetchAPI(`/userTimeSlots?selectedDate=${selectedDate}${instance_id ? `&excludeInstanceId=${instance_id}` : ''}`);
//       setUserTimeSlot(data);
//       console.log("User Time Slot=", data);
//     } catch (error) {
//       console.error('Error fetching user time slots:', error);
//     }
//   };

//   const getInstanceRequestByUserId = async () => {
//     try {
//       const data = await fetchAPI(`/instanceRequests/${instance_id}`);

//       const timeSlotData = await fetchAPI(`/userTimeSlots?instanceRequestId=${instance_id}`);

//       const timeSlotsByDate: DateTimeSlots = {};
//       const uniqueDates: string[] = [];

//       timeSlotData.forEach((slot: any) => {
//         const date = slot.selected_date;
//         if (date) {
//           if (!timeSlotsByDate[date]) {
//             timeSlotsByDate[date] = {
//               selectedSlots: [],
//               selectedRanges: []
//             };
//             uniqueDates.push(date);
//           }
//           timeSlotsByDate[date].selectedSlots.push(slot.time_slot_id + "");
//         }
//       });

//       Object.keys(timeSlotsByDate).forEach(date => {
//         const slots = timeSlotsByDate[date].selectedSlots;
//         const indices = slots.map(id => getSlotIndex(id)).sort((a, b) => a - b);
//         const ranges: TimeSlotRange[] = [];

//         if (indices.length > 0) {
//           let rangeStart = indices[0];
//           let rangeEnd = indices[0];

//           for (let i = 1; i < indices.length; i++) {
//             if (indices[i] === rangeEnd + 1) {
//               rangeEnd = indices[i];
//             } else {
//               ranges.push({ start: rangeStart, end: rangeEnd });
//               rangeStart = indices[i];
//               rangeEnd = indices[i];
//             }
//           }
//           ranges.push({ start: rangeStart, end: rangeEnd });
//         }

//         timeSlotsByDate[date].selectedRanges = ranges;
//       });

//       setFormData({
//         userTypeId: data.user_type_id || '',
//         selectedDate: uniqueDates[0] || '',
//         selectedDates: uniqueDates,
//         customImageId: data.image_id || '',
//         cpuId: data.cpu_id || '',
//         statusId: data.status_id || '',
//         gpuPartitionId: data.gpu_partition_id || '',
//         storageVolume: data.storage_volume?.toString() || '10',
//         ramId: data.ram_id || '',
//         gpuSlotId: data.gpu_vendor_id || '',
//         workDescription: data.work_description || '',
//         dateTimeSlots: timeSlotsByDate,
//         selectedSlots: timeSlotsByDate[uniqueDates[0]]?.selectedSlots || [],
//       });

//       setSelectedDate(uniqueDates[0] || '');
//     } catch (error) {
//       console.error('Error fetching instance request:', error);
//       showErrorSnackbarFunc('Failed to load instance request data');
//     }
//   };

//   const saveInstanceRequest = async () => {
//     try {
//       for (const date of formData.selectedDates) {
//         const dateSlots = formData.dateTimeSlots[date]?.selectedSlots || [];
//         if (dateSlots.length === 0) {
//           throw new Error(`Please select time slots for ${new Date(date).toLocaleDateString()}`);
//         }
//       }

//       const today = new Date();
//       const formattedDate = today.toISOString().split('T')[0];

//       const response = await fetchAPI('/instanceRequests', {
//         method: 'POST',
//         body: JSON.stringify({
//           user_id: userId,
//           remarks: "",
//           image_id: formData.customImageId,
//           cpu_id: formData.cpuId,
//           selected_date: formattedDate,
//           gpu_partition_id: formData.gpuPartitionId,
//           ram_id: formData.ramId,
//           gpu_vendor_id: formData.gpuSlotId,
//           work_description: formData.workDescription,
//           status_id: formData.statusId || status.find(s => s.status_name === "Pending")?.id,
//           storage_volume: parseInt(formData.storageVolume || '10'),
//           user_type_id: formData.userTypeId,
//           login_id: "",
//           password: "",
//           access_link: "",
//           is_access_granted: false,
//           additional_information: "",
//         }),
//       });

//       if (response.id) {
//         await saveUserTimeSlots(response.id);
//         showSuccessSnackbar();
//         handleReset();
//       }
//     } catch (error: any) {
//       console.error("Error creating instance request:", error);
//       showErrorSnackbarFunc(error.message || 'Error submitting request. Please try again later.');
//     }
//   };

//   const updateInstanceRequest = async () => {
//     try {
//       for (const date of formData.selectedDates) {
//         const dateSlots = formData.dateTimeSlots[date]?.selectedSlots || [];
//         if (dateSlots.length === 0) {
//           throw new Error(`Please select time slots for ${new Date(date).toLocaleDateString()}`);
//         }
//       }

//       const response = await fetchAPI(`/instanceRequests/${instance_id}`, {
//         method: 'PUT',
//         body: JSON.stringify({
//           user_id: userId,
//           remarks: "",
//           image_id: formData.customImageId,
//           cpu_id: formData.cpuId,
//           selected_date: new Date().toISOString().split('T')[0],
//           gpu_partition_id: formData.gpuPartitionId,
//           ram_id: formData.ramId,
//           gpu_vendor_id: formData.gpuSlotId,
//           work_description: formData.workDescription,
//           status_id: formData.statusId,
//           storage_volume: parseInt(formData.storageVolume || '10'),
//           user_type_id: formData.userTypeId,
//         }),
//       });

//       if (response.id) {
//         await deleteUserTimeSlots(instance_id);
//         await saveUserTimeSlots(instance_id);
//         showSuccessSnackbar();
//         router.push('/user');
//       }
//     } catch (error: any) {
//       console.error("Error updating instance request:", error);
//       showErrorSnackbarFunc(error.message || 'Error updating request. Please try again later.');
//     }
//   };

//   const saveUserTimeSlots = async (instanceRequestId: string) => {
//     try {
//       const timeSlots: any[] = [];

//       Object.entries(formData.dateTimeSlots).forEach(([date, { selectedSlots }]) => {
//         if (selectedSlots && selectedSlots.length > 0) {
//           selectedSlots.forEach(slotId => {
//             timeSlots.push({
//               instance_request_id: instanceRequestId,
//               time_slot_id: slotId,
//               selected_date: date,
//             });
//           });
//         }
//       });

//       await fetchAPI('/userTimeSlots/bulk', {
//         method: 'POST',
//         body: JSON.stringify({ timeSlots }),
//       });

//       console.log('Time slots saved successfully');
//     } catch (error) {
//       console.error("Error saving time slots:", error);
//       throw error;
//     }
//   };

//   const deleteUserTimeSlots = async (instanceRequestId: string) => {
//     try {
//       await fetchAPI(`/userTimeSlots?instanceRequestId=${instanceRequestId}`, {
//         method: 'DELETE',
//       });
//       console.log('Time slots deleted successfully');
//     } catch (error) {
//       console.error("Error deleting time slots:", error);
//       throw error;
//     }
//   };

//   const checkTimeSlotConflicts = async (date: string, slotIds: string[]) => {
//     try {
//       const data = await fetchAPI(`/userTimeSlots/conflicts?date=${date}&instanceId=${instance_id || ''}`);
//       const conflicts = slotIds.filter(slotId =>
//         data.some((existing: any) => existing.time_slot_id === slotId)
//       );
//       return conflicts;
//     } catch (error) {
//       console.error("Error checking time slot conflicts:", error);
//       return [];
//     }
//   };

//   // Helper functions
//   const getSlotIndex = (slotId: any) => {
//     return timeSlot.findIndex(slot => slot.id === slotId);
//   };

//   const isSlotBooked = (slotId: string) => {
//     return userTimeSlot.some(uslot =>
//       uslot.time_slot_id === slotId &&
//       (!instance_id || uslot.instance_request_id !== instance_id)
//     );
//   };

//   const isSlotSelected = (slotId: string) => {
//     return formData.selectedSlots.includes(slotId);
//   };

//   const getContinuousRange = (startSlotId: string, endSlotId: string) => {
//     const startIndex = getSlotIndex(startSlotId);
//     const endIndex = getSlotIndex(endSlotId);

//     const minIndex = Math.min(startIndex, endIndex);
//     const maxIndex = Math.max(startIndex, endIndex);

//     const range = [];
//     for (let i = minIndex; i <= maxIndex; i++) {
//       if (timeSlot[i] && !isSlotBooked(timeSlot[i].id)) {
//         range.push(timeSlot[i].id);
//       }
//     }
//     return range;
//   };

//   const getTodayDate = () => {
//     const today = new Date();
//     return today.toISOString().split('T')[0];
//   };

//   // Event Handlers
//   const handleReset = () => {
//     if (instance_id) {
//       getInstanceRequestByUserId();
//       return;
//     }

//     setFormData({
//       userTypeId: '',
//       selectedDate: '',
//       dateTimeSlots: {},
//       selectedDates: [],
//       customImageId: '',
//       cpuId: '',
//       statusId: '',
//       gpuPartitionId: '',
//       storageVolume: '10',
//       ramId: '',
//       gpuSlotId: '',
//       workDescription: '',
//       selectedSlots: [],
//     });
//     setSelectedDate('');
//     setErrors({});
//     setTouched({});
//   };

//   const handleDateAdd = (dateValue: string) => {
//     if (!dateValue) return;

//     const dateObj = new Date(dateValue);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     if (dateObj < today) {
//       setErrors(prev => ({ ...prev, selectedDates: 'Date cannot be in the past' }));
//       return;
//     }

//     const currentDates = formData.selectedDates || [];

//     if (currentDates.includes(dateValue)) {
//       setErrors(prev => ({ ...prev, selectedDates: 'This date is already selected' }));
//       return;
//     }

//     const updatedDateTimeSlots = {
//       ...formData.dateTimeSlots,
//       [dateValue]: {
//         selectedSlots: [],
//         selectedRanges: []
//       }
//     };

//     setFormData(prev => ({
//       ...prev,
//       selectedDates: [...currentDates, dateValue].sort(),
//       dateTimeSlots: updatedDateTimeSlots,
//       selectedSlots: [],
//       selectedRanges: []
//     }));

//     setErrors(prev => ({ ...prev, selectedDates: '' }));
//     setSelectedDate(dateValue);
//   };

//   const handleDateRemove = (dateToRemove: string) => {
//     const updatedDates = formData.selectedDates.filter(date => date !== dateToRemove);
//     const updatedDateTimeSlots = { ...formData.dateTimeSlots };
//     delete updatedDateTimeSlots[dateToRemove];

//     setFormData(prev => ({
//       ...prev,
//       selectedDates: updatedDates,
//       dateTimeSlots: updatedDateTimeSlots,
//       selectedSlots: selectedDate === dateToRemove ? [] : prev.selectedSlots,
//     }));
//   };

//   const handleDateRangeAdd = () => {
//     if (!dateRange.start || !dateRange.end) {
//       showErrorSnackbarFunc('Please select both start and end dates');
//       return;
//     }

//     const startDate = new Date(dateRange.start);
//     const endDate = new Date(dateRange.end);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     if (startDate < today || endDate < today) {
//       setErrors(prev => ({ ...prev, selectedDates: 'Dates cannot be in the past' }));
//       return;
//     }

//     if (endDate < startDate) {
//       setErrors(prev => ({ ...prev, selectedDates: 'End date must be after start date' }));
//       return;
//     }

//     const dates: string[] = [];
//     const currentDate = new Date(startDate);
//     while (currentDate <= endDate) {
//       const dateString = currentDate.toISOString().split('T')[0];
//       if (!formData.selectedDates.includes(dateString)) {
//         dates.push(dateString);
//       }
//       currentDate.setDate(currentDate.getDate() + 1);
//     }

//     const updatedDateTimeSlots = { ...formData.dateTimeSlots };
//     dates.forEach(date => {
//       updatedDateTimeSlots[date] = {
//         selectedSlots: [],
//         selectedRanges: []
//       };
//     });

//     setFormData(prev => ({
//       ...prev,
//       selectedDates: [...prev.selectedDates, ...dates].sort(),
//       dateTimeSlots: updatedDateTimeSlots
//     }));

//     setDateRange({ start: '', end: '' });
//     setErrors(prev => ({ ...prev, selectedDates: '' }));
//   };

//   const handleMouseDown = (slotId: any, mode: any) => {
//     if (formData.selectedDates.length === 0) {
//       showErrorSnackbarFunc('Please add at least one date before selecting time slots');
//       return;
//     }

//     if (!selectedDate || !formData.selectedDates.includes(selectedDate)) {
//       showErrorSnackbarFunc('Please select a date first');
//       return;
//     }
//     setDragStart(slotId);
//     setDragMode(mode);
//     setIsDragging(true);
//   };

//   const handleMouseEnter = async (slotId: any) => {
//     if (!isDragging || isSlotBooked(slotId) || !dragMode || !selectedDate) return;

//     setDragEnd(slotId);

//     if (dragStart && dragStart !== slotId) {
//       const startIndex = getSlotIndex(dragStart);
//       const endIndex = getSlotIndex(slotId);
//       const minIndex = Math.min(startIndex, endIndex);
//       const maxIndex = Math.max(startIndex, endIndex);

//       const draggedSlots: string[] = [];
//       for (let i = minIndex; i <= maxIndex; i++) {
//         if (timeSlot[i] && !isSlotBooked(timeSlot[i].id)) {
//           draggedSlots.push(timeSlot[i].id);
//         }
//       }

//       const conflicts = await checkTimeSlotConflicts(selectedDate, draggedSlots);
//       if (conflicts.length > 0) {
//         setErrors(prev => ({
//           ...prev,
//           selectedSlots: `Some selected time slots are already booked for ${new Date(selectedDate).toLocaleDateString()}`
//         }));
//         return;
//       }

//       const currentDateSlots = formData.dateTimeSlots[selectedDate]?.selectedSlots || [];
//       let updatedSlots: string[];

//       if (dragMode === 'select') {
//         updatedSlots = Array.from(new Set([...currentDateSlots, ...draggedSlots]));
//       } else {
//         updatedSlots = currentDateSlots.filter(id => !draggedSlots.includes(id));
//       }

//       const indices = updatedSlots.map(id => getSlotIndex(id)).sort((a, b) => a - b);
//       const ranges: TimeSlotRange[] = [];

//       if (indices.length > 0) {
//         let rangeStart = indices[0];
//         let rangeEnd = indices[0];

//         for (let i = 1; i < indices.length; i++) {
//           if (indices[i] === rangeEnd + 1) {
//             rangeEnd = indices[i];
//           } else {
//             ranges.push({ start: rangeStart, end: rangeEnd });
//             rangeStart = indices[i];
//             rangeEnd = indices[i];
//           }
//         }
//         ranges.push({ start: rangeStart, end: rangeEnd });
//       }

//       setFormData(prev => ({
//         ...prev,
//         selectedSlots: updatedSlots,
//         dateTimeSlots: {
//           ...prev.dateTimeSlots,
//           [selectedDate]: {
//             selectedSlots: updatedSlots,
//             selectedRanges: ranges
//           }
//         }
//       }));
//     }
//   };

//   const handleMouseUp = () => {
//     setIsDragging(false);
//     setDragStart(null);
//     setDragEnd(null);
//     setDragMode(null);
//   };

//   const handleTimeSlotClick = async (slotId: string) => {
//     if (formData.selectedDates.length === 0) {
//       showErrorSnackbarFunc('Please add at least one date before selecting time slots');
//       return;
//     }

//     if (!selectedDate || !formData.selectedDates.includes(selectedDate)) {
//       showErrorSnackbarFunc('Please select a date first');
//       return;
//     }

//     if (isSlotBooked(slotId) && !instance_id) {
//       return;
//     }

//     const currentDateSlots = formData.dateTimeSlots[selectedDate]?.selectedSlots || [];
//     const isCurrentlySelected = currentDateSlots.includes(slotId);
//     let newSelectedSlots: string[];

//     if (isCurrentlySelected) {
//       newSelectedSlots = currentDateSlots.filter(id => id !== slotId);
//     } else {
//       newSelectedSlots = [...currentDateSlots, slotId];

//       const conflicts = await checkTimeSlotConflicts(selectedDate, [slotId]);
//       if (conflicts.length > 0) {
//         setErrors(prev => ({
//           ...prev,
//           selectedSlots: `Time slot is already booked by another user`
//         }));
//         return;
//       }
//     }

//     const indices = newSelectedSlots.map(id => getSlotIndex(id)).sort((a, b) => a - b);
//     const ranges: TimeSlotRange[] = [];

//     if (indices.length > 0) {
//       let rangeStart = indices[0];
//       let rangeEnd = indices[0];

//       for (let i = 1; i < indices.length; i++) {
//         if (indices[i] === rangeEnd + 1) {
//           rangeEnd = indices[i];
//         } else {
//           ranges.push({ start: rangeStart, end: rangeEnd });
//           rangeStart = indices[i];
//           rangeEnd = indices[i];
//         }
//       }
//       ranges.push({ start: rangeStart, end: rangeEnd });
//     }

//     setFormData(prev => ({
//       ...prev,
//       selectedSlots: newSelectedSlots,
//       dateTimeSlots: {
//         ...prev.dateTimeSlots,
//         [selectedDate]: {
//           selectedSlots: newSelectedSlots,
//           selectedRanges: ranges
//         }
//       }
//     }));

//     setErrors(prev => ({
//       ...prev,
//       selectedSlots: ''
//     }));
//   };

//   const handleReplicateSlots = async (sourceDate?: string) => {
//     setIsReplicating(true);
//     try {
//       const src = sourceDate || selectedDate;
//       if (!src) {
//         showErrorSnackbarFunc('No source date available to replicate from');
//         return;
//       }

//       const sourceSlots = formData.dateTimeSlots[src]?.selectedSlots?.slice() || [];

//       if (sourceSlots.length === 0) {
//         showErrorSnackbarFunc('No slots selected to replicate');
//         return;
//       }

//       const targetDates = formData.selectedDates.filter(date => date !== src);
//       if (targetDates.length === 0) {
//         showErrorSnackbarFunc('No other dates to replicate to');
//         return;
//       }

//       const conflictDetails: { [key: string]: string[] } = {};
//       for (const date of targetDates) {
//         const conflicts = await checkTimeSlotConflicts(date, sourceSlots);
//         if (conflicts.length > 0) {
//           conflictDetails[date] = conflicts;
//         }
//       }

//       if (Object.keys(conflictDetails).length > 0) {
//         const conflictDatesArray = Object.keys(conflictDetails);
//         const conflictDates = conflictDatesArray
//           .map(date => new Date(date).toLocaleDateString())
//           .join(', ');

//         const conflictingSlotTimes: string[] = [];
//         Object.values(conflictDetails).forEach(slotIds => {
//           slotIds.forEach(slotId => {
//             const slot = timeSlot.find(ts => ts.id === slotId);
//             if (slot && !conflictingSlotTimes.includes(slot.time_slot || '')) {
//               conflictingSlotTimes.push(slot.time_slot || '');
//             }
//           });
//         });

//         const errorMsg = `Cannot replicate slots to ${conflictDates}. Time slots [${conflictingSlotTimes.join(', ')}] are already booked.`;

//         setErrors(prev => ({
//           ...prev,
//           selectedSlots: errorMsg
//         }));

//         setTouched(prev => ({
//           ...prev,
//           selectedSlots: true
//         }));
//         return;
//       }

//       const indices = sourceSlots
//         .map(id => getSlotIndex(id))
//         .filter(i => i >= 0)
//         .sort((a, b) => a - b);

//       const ranges: TimeSlotRange[] = [];
//       if (indices.length > 0) {
//         let rangeStart = indices[0];
//         let rangeEnd = indices[0];
//         for (let i = 1; i < indices.length; i++) {
//           if (indices[i] === rangeEnd + 1) {
//             rangeEnd = indices[i];
//           } else {
//             ranges.push({ start: rangeStart, end: rangeEnd });
//             rangeStart = indices[i];
//             rangeEnd = indices[i];
//           }
//         }
//         ranges.push({ start: rangeStart, end: rangeEnd });
//       }

//       setFormData(prev => {
//         const updatedDateTimeSlots = { ...prev.dateTimeSlots };
//         targetDates.forEach(date => {
//           updatedDateTimeSlots[date] = {
//             selectedSlots: [...sourceSlots],
//             selectedRanges: ranges.map(r => ({ start: r.start, end: r.end }))
//           };
//         });

//         const updatedSelectedSlots = prev.selectedDate && targetDates.includes(prev.selectedDate)
//           ? [...sourceSlots]
//           : prev.selectedSlots;

//         return {
//           ...prev,
//           dateTimeSlots: updatedDateTimeSlots,
//           selectedSlots: updatedSelectedSlots,
//         };
//       });

//       setErrors(prev => ({ ...prev, selectedSlots: '' }));
//       showSuccessSnackbarFunc(`Slots replicated to ${targetDates.length} date${targetDates.length > 1 ? 's' : ''}`);
//     } catch (error) {
//       console.error('Error replicating slots:', error);
//       const errorMsg = error instanceof Error ? error.message : 'Failed to replicate time slots.';
//       showErrorSnackbarFunc(errorMsg);
//     } finally {
//       setIsReplicating(false);
//     }
//   };

//   const submit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     for (const date of formData.selectedDates) {
//       const conflicts = await checkTimeSlotConflicts(date, formData.selectedSlots);
//       if (conflicts.length > 0) {
//         showErrorSnackbarFunc(`Some time slots are already booked for ${new Date(date).toLocaleDateString()}`);
//         return;
//       }
//     }

//     setIsSubmitting(true);

//     try {
//       if (instance_id) {
//         await updateInstanceRequest();
//       } else {
//         await saveInstanceRequest();
//       }
//     } catch (error) {
//       console.error('Submission failed:', error);
//       showErrorSnackbarFunc('Error submitting request. Please try again later.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Global mouse up handler
//   useEffect(() => {
//     const handleGlobalMouseUp = () => {
//       if (isDragging) {
//         setIsDragging(false);
//         setDragStart(null);
//         setDragEnd(null);
//         setDragMode(null);
//       }
//     };

//     document.addEventListener('mouseup', handleGlobalMouseUp);
//     return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
//   }, [isDragging]);

//   // Update displayed slots when date changes
//   useEffect(() => {
//     if (selectedDate && formData.dateTimeSlots[selectedDate]) {
//       const dateSlots = formData.dateTimeSlots[selectedDate];
//       setFormData(prev => ({
//         ...prev,
//         selectedSlots: dateSlots.selectedSlots,
//       }));
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         selectedSlots: [],
//       }));
//     }
//   }, [selectedDate]);

//   // if (authLoading) {
//   //   return (
//   //     <div className="flex items-center justify-center min-h-screen bg-gray-50">
//   //       <div className="text-center">
//   //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500 mx-auto mb-4"></div>
//   //         <p className="text-gray-600">Verifying access...</p>
//   //       </div>
//   //     </div>
//   //   );
//   // }

//   // ...existing code... (JSX rendering remains the same)
//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <div className="min-h-screen bg-gray-50">
//         <Header />
//         {/* ...rest of your JSX... */}

//         <div
//           className={`fixed inset-x-0 bottom-5 flex justify-center z-50 transition-all duration-500 ${showErrorSnackbar
//             ? "transform translate-y-0 opacity-100"
//             : "transform translate-y-full opacity-0"
//             }`}
//         >
//           <div
//             className="rounded-lg shadow-lg px-5 py-3 flex items-center space-x-3 text-sm font-medium"
//             style={{ backgroundColor: "#ef4444", color: "white" }}
//           >
//             <AlertCircle className="w-6 h-4" style={{ color: "white" }} />
//             <div>
//               <p className="text-sm font-medium">{errorMessage}</p>
//             </div>
//           </div>
//         </div>

//         {/* Success Snackbar */}
//         <div
//           className={`fixed inset-x-0 bottom-5 flex justify-center z-50 transition-all duration-500 ${successSnackbar
//             ? "transform translate-y-0 opacity-100"
//             : "transform translate-y-full opacity-0"
//             }`}
//         >
//           <div
//             className="rounded-lg shadow-lg px-5 py-3 flex items-center space-x-3 text-sm font-medium"
//             style={{ backgroundColor: "#76B900", color: "white" }}
//           >
//             <CheckCircle className="w-6 h-4" style={{ color: "white" }} />
//             <div>
//               <p className="text-sm font-medium">{successMessage}</p>
//             </div>
//           </div>
//         </div>

//         {/* Success Snackbar */}
//         {/* <SuccessSnackbar /> */}

//         {/* Error Snackbar */}
//         <div
//           className={`fixed inset-x-0 bottom-5 flex justify-center z-50 transition-all duration-500 ${showErrorSnackbar
//             ? "transform translate-y-0 opacity-100"
//             : "transform translate-y-full opacity-0"
//             }`}
//         >
//           <div
//             className="rounded-lg shadow-lg px-5 py-3 flex items-center space-x-3 text-sm font-medium"
//             style={{ backgroundColor: "#ef4444", color: "white" }}
//           >
//             <AlertCircle className="w-6 h-4" style={{ color: "white" }} />
//             <div>
//               <p className="text-sm font-medium">{errorMessage}</p>
//             </div>
//           </div>
//         </div>

//         {/* Success Snackbar */}
//         <div
//           className={`fixed inset-x-0 bottom-5 flex justify-center z-50 transition-all duration-500 ${successSnackbar
//             ? "transform translate-y-0 opacity-100"
//             : "transform translate-y-full opacity-0"
//             }`}
//         >
//           <div
//             className="rounded-lg shadow-lg px-5 py-3 flex items-center space-x-3 text-sm font-medium"
//             style={{ backgroundColor: "#76B900", color: "white" }}
//           >
//             <CheckCircle className="w-6 h-4" style={{ color: "white" }} />
//             <div>
//               <p className="text-sm font-medium">{successMessage}</p>
//             </div>
//           </div>
//         </div>

//         {/* Main Container with Card */}
//         <div className="max-w-5xl mx-auto p-4">
//           {/* Card Container */}
//           {/* <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"> */}
//           <div
//             className="rounded-xl p-5"
//             style={{
//               backgroundColor: "#fff",
//               boxShadow:
//                 "0 25px 50px -12px rgba(68, 73, 61, 0.15), 0 0 0 1px rgba(201, 202, 199, 0.5)",
//             }}
//           >
//             {/* Card Header */}
//             <div className="relative bg-gradient-to-r from-white-50 to-white-100 px-2 py-2">
//               {/* Close Button */}
//               <button
//                 onClick={() => { router.replace("/user") }} // replace with your own function
//                 className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 transition"
//                 aria-label="Close"
//               >
//                 <X className="w-5 h-5 cursor-pointer" />
//               </button>

//               <h2 className="text-3xl font-bold text-gray-800 text-center">
//                 Instance Request Form
//               </h2>

//               {instance_id ? (
//                 <h4 className="text-3xl font-medium text-gray-800 text-center">
//                   {instance_id}
//                 </h4>
//               ) : null}
//             </div>

//             {/* Card Content */}
//             <div className="p-8">
//               <form onSubmit={submit} className="space-y-5">
//                 {/* Hardware Configuration Section - Consistent spacing */}
//                 {/* <div className="grid grid-cols-3 gap-x-14 max-w-20xl"> */}

//                 <div className="grid grid-cols-3 gap-x-14 max-w-20xl">

//                   <div className="space-y-2">
//                     <div className="relative w-64">
//                       <label
//                         className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 text-sm
//                       ${floatCondition("userTypeId", formData.userTypeId)
//                             ? "-top-2 px-1 bg-white"
//                             : "top-3"}
//                       ${errors.userTypeId && touched.userTypeId
//                             ? "text-red-500"
//                             : floatCondition("userTypeId", formData.userTypeId)
//                               ? "text-[#5A8F00] font-small"
//                               : "text-gray-500"}
//                     `}
//                       >
//                         {errors.userTypeId && touched.userTypeId ? errors.userTypeId : formData.userTypeId ? "User Type*" : "Select User Type*"}
//                       </label>
//                       <select
//                         value={formData.userTypeId}
//                         onChange={(event) => handleInputChange('userTypeId', event.target.value)}
//                         onFocus={(e) => {
//                           setFocusedField("userTypeId");
//                           e.target.style.borderColor = "#5A8F00";
//                           e.target.style.boxShadow = "0 0 0 3px rgba(118, 185, 0, 0.1)";
//                         }}
//                         onBlur={(e) => {
//                           setFocusedField(null);
//                           handleBlur('userTypeId');
//                           if (!errors.userTypeId) {
//                             e.target.style.borderColor = "#e8f5d0";
//                             e.target.style.boxShadow = "none";
//                           }
//                         }}
//                         className="w-full px-3 pt-2 pb-2 text-sm rounded-lg focus:outline-none bg-white appearance-none transition-all duration-200 hover:border-green-200"
//                         style={{
//                           color: '#2d4a00',
//                           border: errors.userTypeId && touched.userTypeId ? '2px solid #ef4444' : '2px solid #e8f5d0'
//                         }}
//                       >
//                         <option value="" style={{ color: '#9ca3af' }} disabled hidden></option>
//                         {userType.map((type) => (
//                           <option key={type.id} value={type.id || ""}>
//                             {type.user_type}
//                           </option>
//                         ))}
//                       </select>
//                       <ChevronDown
//                         className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none"
//                         style={{ color: '#5A8F00' }}
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-4">
//                     {/* Image */}
//                     <div className="relative w-64">
//                       <label
//                         className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 text-sm
//                         ${floatCondition("customImageId", formData.customImageId)
//                             ? "-top-2 px-1 bg-white"
//                             : "top-3"}
//                         ${errors.customImageId && touched.customImageId
//                             ? "text-red-500"
//                             : floatCondition("customImageId", formData.customImageId)
//                               ? "text-[#5A8F00] font-small"
//                               : "text-gray-500"}
//                       `}
//                       >
//                         {errors.customImageId && touched.customImageId ? errors.customImageId : formData.customImageId ? "Image*" : "Select Image*"}
//                       </label>
//                       <select
//                         value={formData.customImageId}
//                         onChange={(event) => handleInputChange('customImageId', event.target.value)}
//                         onFocus={(e) => {
//                           setFocusedField("customImageId");
//                           e.target.style.borderColor = "#5A8F00";
//                           e.target.style.boxShadow = "0 0 0 3px rgba(118, 185, 0, 0.1)";
//                         }}
//                         onBlur={(e) => {
//                           setFocusedField(null);
//                           handleBlur('customImageId');
//                           if (!errors.customImageId) {
//                             e.target.style.borderColor = "#e8f5d0";
//                             e.target.style.boxShadow = "none";
//                           }
//                         }}
//                         className="w-full px-3 pt-2 pb-2 text-sm rounded-lg focus:outline-none bg-white appearance-none transition-all duration-200 hover:border-green-200"
//                         style={{
//                           color: '#2d4a00',
//                           border: errors.customImageId && touched.customImageId ? '2px solid #ef4444' : '2px solid #e8f5d0'
//                         }}
//                       >
//                         <option value="" style={{ color: '#9ca3af' }} disabled hidden></option>
//                         {customImage.map((i) => (
//                           <option key={i.id} value={i.id || ""}>
//                             {i.image_name}
//                           </option>
//                         ))}
//                       </select>
//                       <ChevronDown
//                         className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none"
//                         style={{ color: '#5A8F00' }}
//                       />
//                     </div>
//                   </div>
//                   {/* </div> */}

//                   <div className="space-y-4">
//                     {/* CPU */}
//                     {/* <div className="space-y-2"> */}
//                     <div className="relative w-64">
//                       <label
//                         className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 text-sm
//                         ${floatCondition("cpuId", formData.cpuId)
//                             ? "-top-2 px-1 bg-white"
//                             : "top-3"}
//                         ${errors.cpuId && touched.cpuId
//                             ? "text-red-500"
//                             : floatCondition("cpuId", formData.cpuId)
//                               ? "text-[#5A8F00] font-small"
//                               : "text-gray-500"}
//                       `}
//                       >
//                         {errors.cpuId && touched.cpuId ? errors.cpuId : formData.cpuId ? "Requested CPUs*" : "Select CPU*"}
//                       </label>
//                       <select
//                         value={formData.cpuId}
//                         onChange={(event) => handleInputChange('cpuId', event.target.value)}
//                         onFocus={(e) => {
//                           setFocusedField("cpuId");
//                           e.target.style.borderColor = "#5A8F00";
//                           e.target.style.boxShadow = "0 0 0 3px rgba(118, 185, 0, 0.1)";
//                         }}
//                         onBlur={(e) => {
//                           setFocusedField(null);
//                           handleBlur('cpuId');
//                           if (!errors.cpuId) {
//                             e.target.style.borderColor = "#e8f5d0";
//                             e.target.style.boxShadow = "none";
//                           }
//                         }}
//                         className="w-full px-3 pt-2 pb-2 text-sm rounded-lg focus:outline-none bg-white appearance-none transition-all duration-200 hover:border-green-200"
//                         style={{
//                           color: '#2d4a00',
//                           border: errors.cpuId && touched.cpuId ? '2px solid #ef4444' : '2px solid #e8f5d0'
//                         }}
//                       >
//                         <option value="" style={{ color: '#9ca3af' }} disabled hidden></option>
//                         {cpu.map((c) => (
//                           <option key={c.id} value={c.id || ""}>
//                             {c.number_of_cpu}
//                           </option>
//                         ))}
//                       </select>
//                       <ChevronDown
//                         className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none"
//                         style={{ color: '#5A8F00' }}
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-3 gap-x-14 max-w-20xl">

//                   {/* GPU */}
//                   <div className="relative w-64">
//                     <label
//                       className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 text-sm
//                         ${floatCondition("gpuPartitionId", formData.gpuPartitionId)
//                           ? "-top-2 px-1 bg-white"
//                           : "top-3"}
//                         ${errors.gpuPartitionId && touched.gpuPartitionId
//                           ? "text-red-500"
//                           : floatCondition("gpuPartitionId", formData.gpuPartitionId)
//                             ? "text-[#5A8F00] font-small"
//                             : "text-gray-500"}
//                       `}
//                     >
//                       {errors.gpuPartitionId && touched.gpuPartitionId ? errors.gpuPartitionId : formData.gpuPartitionId ? "Number of GPUs*" : "Select Number of GPUs*"}
//                     </label>
//                     <select
//                       value={formData.gpuPartitionId}
//                       onChange={(event) => handleInputChange('gpuPartitionId', event.target.value)}
//                       onFocus={(e) => {
//                         setFocusedField("gpuPartitionId");
//                         e.target.style.borderColor = "#5A8F00";
//                         e.target.style.boxShadow = "0 0 0 3px rgba(118, 185, 0, 0.1)";
//                       }}
//                       onBlur={(e) => {
//                         setFocusedField(null);
//                         handleBlur('gpuPartitionId');
//                         if (!errors.gpuPartitionId) {
//                           e.target.style.borderColor = "#e8f5d0";
//                           e.target.style.boxShadow = "none";
//                         }
//                       }}
//                       className="w-full px-3 pt-2 pb-2 text-sm rounded-lg focus:outline-none bg-white appearance-none transition-all duration-200 hover:border-green-200"
//                       style={{
//                         color: '#2d4a00',
//                         border: errors.gpuPartitionId && touched.gpuPartitionId ? '2px solid #ef4444' : '2px solid #e8f5d0'
//                       }}
//                     >
//                       <option value="" style={{ color: '#9ca3af' }} disabled hidden></option>
//                       {gpu.map((gp) => (
//                         <option key={gp.gpu_id} value={gp.gpu_vendor || ""}>
//                           {gp.gpu_vendor}
//                         </option>
//                       ))}
//                     </select>
//                     <ChevronDown
//                       className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none"
//                       style={{ color: '#5A8F00' }}
//                     />
//                   </div>

//                   {/* RAM */}
//                   <div className="space-y-4">
//                     <div className="relative w-64">
//                       <label
//                         className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 text-sm
//                         ${floatCondition("ramId", formData.ramId)
//                             ? "-top-2 px-1 bg-white"
//                             : "top-3"}
//                         ${errors.ramId && touched.ramId
//                             ? "text-red-500"
//                             : floatCondition("ramId", formData.ramId)
//                               ? "text-[#5A8F00] font-small"
//                               : "text-gray-500"}
//                       `}
//                       >
//                         {errors.ramId && touched.ramId ? errors.ramId : formData.ramId ? "Requested RAM in GB*" : "Select RAM*"}
//                       </label>
//                       <select
//                         value={formData.ramId}
//                         onChange={(event) => handleInputChange('ramId', event.target.value)}
//                         onFocus={(e) => {
//                           setFocusedField("ramId");
//                           e.target.style.borderColor = "#5A8F00";
//                           e.target.style.boxShadow = "0 0 0 3px rgba(118, 185, 0, 0.1)";
//                         }}
//                         onBlur={(e) => {
//                           setFocusedField(null);
//                           handleBlur('ramId');
//                           if (!errors.ramId) {
//                             e.target.style.borderColor = "#e8f5d0";
//                             e.target.style.boxShadow = "none";
//                           }
//                         }}
//                         className="w-full px-3 pt-2 pb-2 text-sm rounded-lg focus:outline-none bg-white appearance-none transition-all duration-200 hover:border-green-200"
//                         style={{
//                           color: '#2d4a00',
//                           border: errors.ramId && touched.ramId ? '2px solid #ef4444' : '2px solid #e8f5d0'
//                         }}
//                       >
//                         <option value="" style={{ color: '#9ca3af' }} disabled hidden></option>
//                         {ram.map((r) => (
//                           <option key={r.ram_id} value={r.ram || ""}>
//                             {r.ram}
//                           </option>
//                         ))}
//                       </select>
//                       <ChevronDown
//                         className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none"
//                         style={{ color: '#5A8F00' }}
//                       />
//                     </div>
//                   </div>
//                   {/* </div> */}

//                   {/* GPU Partition */}
//                   {/* <div className="space-y-2"> */}
//                   <div className="relative w-64">
//                     <label
//                       className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 text-sm
//                         ${floatCondition("gpuSlotId", formData.gpuSlotId)
//                           ? "-top-2 px-1 bg-white"
//                           : "top-3"}
//                         ${errors.gpuSlotId && touched.gpuSlotId
//                           ? "text-red-500"
//                           : floatCondition("gpuSlotId", formData.gpuSlotId)
//                             ? "text-[#5A8F00] font-small"
//                             : "text-gray-500"}
//                       `}
//                     >
//                       {errors.gpuSlotId && touched.gpuSlotId ? errors.gpuSlotId : formData.gpuSlotId ? "GPU Vendor*" : "Select GPU Vendor*"}
//                     </label>
//                     <select
//                       value={formData.gpuSlotId}
//                       onChange={(event) => handleInputChange('gpuSlotId', event.target.value)}
//                       onFocus={(e) => {
//                         setFocusedField("gpuSlotId");
//                         e.target.style.borderColor = "#5A8F00";
//                         e.target.style.boxShadow = "0 0 0 3px rgba(118, 185, 0, 0.1)";
//                       }}
//                       onBlur={(e) => {
//                         setFocusedField(null);
//                         handleBlur('gpuSlotId');
//                         if (!errors.gpuSlotId) {
//                           e.target.style.borderColor = "#e8f5d0";
//                           e.target.style.boxShadow = "none";
//                         }
//                       }}
//                       className="w-full px-3 pt-2 pb-2 text-sm rounded-lg focus:outline-none bg-white appearance-none transition-all duration-200 hover:border-green-200"
//                       style={{
//                         color: '#2d4a00',
//                         border: errors.gpuSlotId && touched.gpuSlotId ? '2px solid #ef4444' : '2px solid #e8f5d0'
//                       }}
//                     >
//                       <option value="" style={{ color: '#9ca3af' }} disabled hidden></option>
//                       {gpu.map((gs) => (
//                         <option key={gs.gpu_id} value={gs.gpu_vendor || ""}>
//                           {gs.gpu_vendor}
//                         </option>
//                       ))}
//                     </select>
//                     <ChevronDown
//                       className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none"
//                       style={{ color: '#5A8F00' }}
//                     />
//                     {/* </div> */}
//                   </div>
//                 </div>

//                 {/* Storage Volume and Work Description */}
//                 <div className="grid grid-cols-3 gap-x-14 max-w-20xl">
//                   {/* Storage Volume - Takes 1 column */}
//                   <div className="relative w-64">
//                     <label
//                       className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 text-sm
//         ${floatCondition("storageVolume", formData.storageVolume)
//                           ? "-top-2 px-1 bg-white"
//                           : "top-3"}
//         ${errors.storageVolume && touched.storageVolume
//                           ? "text-red-500"
//                           : floatCondition("storageVolume", formData.storageVolume)
//                             ? "text-[#5A8F00] font-small"
//                             : "text-gray-500"}
//       `}
//                     >
//                       {errors.storageVolume && touched.storageVolume ? errors.storageVolume : formData.storageVolume ? "Storage Volume in GB*" : "Storage Volume (1-150 GB)*"}
//                     </label>
//                     <input
//                       type="number"
//                       value={formData.storageVolume}
//                       onChange={(event) => {
//                         const value = event.target.value;
//                         if (value === '' || (parseInt(value) >= 0)) {
//                           handleInputChange('storageVolume', value);
//                         }
//                       }}
//                       onFocus={(e) => {
//                         setFocusedField("storageVolume");
//                         e.target.style.borderColor = "#5A8F00";
//                         e.target.style.boxShadow = "0 0 0 3px rgba(118, 185, 0, 0.1)";
//                       }}
//                       onBlur={(e) => {
//                         setFocusedField(null);
//                         handleBlur('storageVolume');
//                         if (!errors.storageVolume) {
//                           e.target.style.borderColor = "#e8f5d0";
//                           e.target.style.boxShadow = "none";
//                         }
//                       }}
//                       className="w-full px-3 pt-2 pb-2 text-sm rounded-lg focus:outline-none bg-white transition-all duration-200 hover:border-green-200"
//                       style={{
//                         color: '#2d4a00',
//                         border: errors.storageVolume && touched.storageVolume ? '2px solid #ef4444' : '2px solid #e8f5d0'
//                       }}
//                       min="1"
//                       max="25000"
//                     />
//                   </div>

//                   {/* Work Description - Spans 2 columns */}
//                   <div className="col-span-2">
//                     <div className="relative w-full">
//                       <label
//                         className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 text-sm
//           ${floatCondition("workDescription", formData.workDescription)
//                             ? "-top-2 px-1 bg-white"
//                             : "top-3"}
//           ${errors.workDescription && touched.workDescription
//                             ? "text-red-500"
//                             : floatCondition("workDescription", formData.workDescription)
//                               ? "text-[#5A8F00] font-small"
//                               : "text-gray-500"}
//         `}
//                       >
//                         {formData.workDescription ? "Work Description" : "Enter Work Description"}
//                       </label>
//                       <textarea
//                         value={formData.workDescription}
//                         onChange={(event) => handleInputChange('workDescription', event.target.value)}
//                         onFocus={(e) => {
//                           setFocusedField("workDescription");
//                           e.target.style.borderColor = "#5A8F00";
//                           e.target.style.boxShadow = "0 0 0 3px rgba(118, 185, 0, 0.1)";
//                         }}
//                         onBlur={(e) => {
//                           setFocusedField(null);
//                           handleBlur('workDescription');
//                           if (!errors.workDescription) {
//                             e.target.style.borderColor = "#e8f5d0";
//                             e.target.style.boxShadow = "none";
//                           }
//                         }}
//                         className="w-full px-3 pt-2 pb-2 text-sm rounded-lg focus:outline-none bg-white transition-all duration-200 hover:border-green-200 resize-none"
//                         style={{
//                           color: '#2d4a00',
//                           border: errors.workDescription && touched.workDescription
//                             ? '2px solid #ef4444'
//                             : '2px solid #e8f5d0',
//                           height: '40px'
//                         }}
//                         rows={1}
//                         maxLength={500}
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* </div> */}
//                 {/* </div> */}

//                 <div className="w-full max-w-6xl space-y-3">
//                   <div className="flex items-center gap-4 mb-2">
//                     <div className="flex items-center gap-4 mb-2">
//                       <div className="flex items-center gap-2">
//                         <input
//                           type="radio"
//                           id="individual"
//                           name="dateMode"
//                           checked={dateSelectionMode === 'individual'}
//                           onChange={() => setDateSelectionMode('individual')}
//                           className="text-green-600 focus:ring-green-500"
//                         />
//                         <label htmlFor="individual" className="text-sm text-gray-600">Individual Dates</label>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <input
//                           type="radio"
//                           id="range"
//                           name="dateMode"
//                           checked={dateSelectionMode === 'range'}
//                           onChange={() => setDateSelectionMode('range')}
//                           className="text-green-600 focus:ring-green-500"
//                         />
//                         <label htmlFor="range" className="text-sm text-gray-600">Date Range</label>
//                       </div>
//                     </div>

//                     {dateSelectionMode === 'individual' ? (
//                       // Individual date selection
//                       <div className="flex items-center gap-2">
//                         <div className="relative w-64">
//                           <label
//                             className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 text-sm
//             ${floatCondition("selectedDates", selectedDate)
//                                 ? "-top-2 px-1 bg-white"
//                                 : "top-3"}
//             ${errors.selectedDates && touched.selectedDates
//                                 ? "text-red-500"
//                                 : floatCondition("selectedDates", selectedDate)
//                                   ? "text-[#5A8F00] font-small"
//                                   : "text-gray-500"}
//           `}
//                           >
//                             {errors.selectedDates && touched.selectedDates
//                               ? errors.selectedDates
//                               : ""}
//                           </label>
//                           <input
//                             type="date"
//                             value={selectedDate}
//                             min={getTodayDate()}
//                             onChange={(e) => {
//                               setSelectedDate(e.target.value);
//                               if (e.target.value) {
//                                 handleDateAdd(e.target.value);
//                               }
//                             }}
//                             className="w-full px-3 pt-2 pb-2 text-sm rounded-lg focus:outline-none bg-white transition-all duration-200 hover:border-green-200 cursor-pointer"
//                             style={{
//                               color: '#2d4a00',
//                               border: errors.selectedDates && touched.selectedDates ? '2px solid #ef4444' : '2px solid #e8f5d0'
//                             }}
//                           />
//                         </div>
//                       </div>
//                     ) : (
//                       // Date range selection
//                       <div className="flex items-center gap-4">
//                         <div className="relative w-64">
//                           <label className="absolute -top-2 left-3 px-1 bg-white text-sm text-[#5A8F00] font-small">
//                             Start Date
//                           </label>
//                           <input
//                             type="date"
//                             value={dateRange.start}
//                             min={getTodayDate()}
//                             onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
//                             className="w-full px-3 pt-2 pb-2 text-sm rounded-lg focus:outline-none bg-white transition-all duration-200 hover:border-green-200 cursor-pointer"
//                             style={{
//                               color: '#2d4a00',
//                               border: '2px solid #e8f5d0'
//                             }}
//                           />
//                         </div>
//                         <div className="relative w-64">
//                           <label className="absolute -top-2 left-3 px-1 bg-white text-sm text-[#5A8F00] font-small">
//                             End Date
//                           </label>
//                           <input
//                             type="date"
//                             value={dateRange.end}
//                             min={dateRange.start || getTodayDate()}
//                             onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
//                             className="w-full px-3 pt-2 pb-2 text-sm rounded-lg focus:outline-none bg-white transition-all duration-200 hover:border-green-200 cursor-pointer"
//                             style={{
//                               color: '#2d4a00',
//                               border: '2px solid #e8f5d0'
//                             }}
//                           />
//                         </div>
//                         <button
//                           type="button"
//                           onClick={handleDateRangeAdd}
//                           disabled={!dateRange.start || !dateRange.end}
//                           className="p-2 text-white rounded-full transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//                           style={{
//                             backgroundColor: (!dateRange.start || !dateRange.end) ? '#9ca3af' : '#76B900',
//                             width: '36px',
//                             height: '36px'
//                           }}
//                           title="Set date range"
//                         >
//                           <ArrowRightIcon size={16} />
//                         </button>
//                       </div>
//                     )}
//                   </div>

//                   <div>

//                     {formData.selectedDates && formData.selectedDates.length > 0 && (
//                       <div className="w-full">
//                         <div className="flex items-center gap-1 ">
//                           <div className="text-xs font-small" style={{ color: '#5A8F00' }}>
//                             Selected Dates ({formData.selectedDates.length}):
//                           </div>
//                           <div className="flex flex-row flex-wrap gap-2 items-center">
//                             {formData.selectedDates.map((date) => (
//                               <div
//                                 key={date}
//                                 onClick={() => setSelectedDate(date)}
//                                 className={`flex items-center gap-1 px-1 py-0.5 rounded-full text-xs cursor-pointer transition-all duration-200 ${date === selectedDate
//                                   ? 'bg-green-100 border-1 border-green-500'
//                                   : 'bg-gray-50 border border-gray-200 hover:border-green-300 hover:bg-green-50'
//                                   }`}
//                               >
//                                 <span className="text-xs text-gray-700">
//                                   {new Date(date).toLocaleDateString('en-US', {
//                                     day: '2-digit',
//                                     month: '2-digit',
//                                     year: 'numeric'
//                                   })}
//                                 </span>
//                                 <div className="flex items-center gap-1">
//                                   {/* <span className="text-xs text-gray-500">
//                                     ({formData.dateTimeSlots[date]?.selectedSlots.length || 0})
//                                   </span> */}
//                                   <button
//                                     type="button"
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       handleDateRemove(date);
//                                     }}
//                                     className="p-1 hover:bg-red-100 rounded-full transition-colors"
//                                     aria-label="Remove date"
//                                   >
//                                     <X className="w-3 h-3 text-red-500" />
//                                   </button>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                   </div>

//                   {/* // Alternative: Always reserve space for the checkbox */}
//                   <div className="flex items-center gap-2 mt-2 h-8">
//                     {!selectedDate || formData.dateTimeSlots[selectedDate]?.selectedSlots.length === 0 || formData.selectedDates.length < 2 ? (
//                       // Hidden but space is reserved
//                       <div className="invisible"></div>
//                     ) : (
//                       <label className="inline-flex items-center gap-2 text-sm text-gray-700">
//                         <input
//                           type="checkbox"
//                           checked={replicateChecked}
//                           disabled={
//                             !selectedDate ||
//                             formData.dateTimeSlots[selectedDate]?.selectedSlots.length === 0 ||
//                             isReplicating
//                           }
//                           onChange={async (e) => {
//                             const checked = e.target.checked;
//                             setReplicateChecked(checked);
//                             if (checked) {
//                               try {
//                                 await handleReplicateSlots();
//                               } catch (error) {
//                                 console.error('Error during replication:', error);
//                               } finally {
//                                 setReplicateChecked(false);
//                               }
//                             }
//                           }}
//                           className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
//                           aria-label="Replicate slots to other selected dates"
//                           title={isReplicating ? "Replicating..." : "Replicate slots to other selected dates"}
//                         />
//                         <span className="whitespace-nowrap">
//                           {isReplicating ? (
//                             <span className="flex items-center gap-2">
//                               <span className="inline-block animate-spin rounded-full h-3 w-3 border-2 border-green-600 border-t-transparent"></span>
//                               Replicating...
//                             </span>
//                           )
//                             :
//                             "Replicate selected time slots to all selected dates"
//                           }
//                         </span>
//                       </label>
//                     )}
//                   </div>

//                 </div>

//                 {/* Time Slots Selection */}
//                 <div>

//                   {/* Error message for time slots - positioned above the slots grid */}

//                   <div className="flex justify-between items-center mb-3">
//                     <label className="text-sm text-gray-500">
//                       Select Time Slots* (Drag to select multiple slots)
//                     </label>
//                   </div>

//                   {errors.selectedSlots && touched.selectedSlots && (
//                     <div className="text-red-500 text-sm mb-2">{errors.selectedSlots}</div>
//                   )}

//                   <div
//                     className="grid grid-cols-12 gap-0.5 mb-2"
//                     onMouseLeave={() => {
//                       if (isDragging) {
//                         setIsDragging(false);
//                         setDragStart(null);
//                         setDragEnd(null);
//                       }
//                     }}
//                   >
//                     {timeSlot.map((slot, index) => {
//                       const slotId = slot.id || "";
//                       const isBooked = isSlotBooked(slotId);
//                       const isSelected = isSlotSelected(slotId);
//                       const isDragPreview = isDragging && dragStart && dragEnd &&
//                         getContinuousRange(dragStart, dragEnd).includes(slotId);

//                       // Check if this slot is in a single-slot range
//                       // const isInSingleSlotRange = formData.selectedRanges.some(range =>
//                       //   range.start === range.end && range.start === index
//                       // );

//                       return (
//                         <button
//                           key={slot.id}
//                           type="button"
//                           disabled={isBooked} // Only disable if booked by someone else
//                           onClick={() => handleTimeSlotClick(slotId)}
//                           onMouseDown={() => !isBooked && handleMouseDown(slotId, isSelected ? 'deselect' : 'select')}
//                           onMouseEnter={() => handleMouseEnter(slotId)}
//                           onMouseUp={handleMouseUp}
//                           className={`
//         relative px-0.5 py-1 rounded-md border-2 text-xs font-small transition-all duration-150 min-w-0 select-none
//         ${isBooked
//                               ? 'bg-gray-200 border-gray-400 text-gray-600 cursor-not-allowed'
//                               : isSelected
//                                 ?
//                                 null
//                                 //  isInSingleSlotRange
//                                 //   ? 'bg-orange-100 border-orange-400 text-orange-900 shadow-md cursor-pointer hover:bg-orange-200'
//                                 //   : 'bg-green-100 border-green-500 text-green-900 shadow-md cursor-pointer hover:bg-green-200'
//                                 : isDragPreview
//                                   ? 'bg-green-50 border-green-300 cursor-pointer'
//                                   : 'bg-white border-gray-200 text-gray-700 hover:border-green-300 hover:bg-green-50 cursor-pointer'
//                             }
//       `}
//                           style={{
//                             userSelect: 'none',
//                             WebkitUserSelect: 'none',
//                             MozUserSelect: 'none'
//                           }}
//                         >
//                           {slot.time_slot}
//                           {/* {isInSingleSlotRange && (
//                             <span className="absolute -top-1 -right-1 text-orange-500">⚠️</span>
//                           )} */}
//                         </button>
//                       );
//                     })}
//                   </div>
//                   {/* )} */}
//                   {/* <SelectedDateSlots /> */}
//                 </div>

//                 {/* Time Slots Legend */}
//                 <div className="flex items-center gap-4 text-sm">
//                   <div className="flex items-center gap-2">
//                     <div className="w-4 h-4 rounded-md bg-gray-200 border-2 border-gray-400"></div>
//                     <span className="text-gray-600">Booked Slots</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <div className="w-4 h-4 rounded-md bg-green-100 border-2 border-green-500"></div>
//                     <span className="text-gray-600">Selected Slots</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <div className="w-4 h-4 rounded-md bg-orange-100 border-2 border-orange-400"></div>
//                     <span className="text-gray-600">Single Slot (Not Allowed)</span>
//                   </div>
//                 </div>

//                 {/* Submit and Reset Buttons */}
//                 <div className="flex justify-center gap-2 pt-2">
//                   <button
//                     type="submit"
//                     disabled={isSubmitting}
//                     className="px-8 py-2 text-white rounded font-semibold transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
//                     style={{ backgroundColor: isSubmitting ? '#9ca3af' : '#76B900' }}
//                     onMouseEnter={(e) => {
//                       if (!isSubmitting) {
//                         e.currentTarget.style.backgroundColor = '#5a8f00';
//                         e.currentTarget.style.transform = 'translateY(-1px)';
//                       }
//                     }}
//                     onMouseLeave={(e) => {
//                       if (!isSubmitting) {
//                         e.currentTarget.style.backgroundColor = '#76B900';
//                         e.currentTarget.style.transform = 'translateY(0)';
//                       }
//                     }}
//                   >
//                     {instance_id ? "Update" : isSubmitting ? 'Submitting...' : 'Submit'}
//                   </button>
//                   <button
//                     type="button"
//                     onClick={handleReset}
//                     disabled={isSubmitting}
//                     className="px-8 py-2 text-white rounded font-semibold transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
//                     style={{ backgroundColor: isSubmitting ? '#9ca3af' : '#76B900' }}
//                     onMouseEnter={(e) => {
//                       if (!isSubmitting) {
//                         e.currentTarget.style.backgroundColor = '#5a8f00';
//                         e.currentTarget.style.transform = 'translateY(-1px)';
//                       }
//                     }}
//                     onMouseLeave={(e) => {
//                       if (!isSubmitting) {
//                         e.currentTarget.style.backgroundColor = '#76B900';
//                         e.currentTarget.style.transform = 'translateY(0)';
//                       }
//                     }}
//                   >
//                     Reset
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>

//       </div>
//     </Suspense>
//   );
// }

// export default function DGXInstanceRequestForm() {
//   return (
//     <Suspense fallback={<div>Loading Instance Access Form...</div>}>
//       <DGXInstanceRequestFormContent />
//     </Suspense>
//   );
// }
