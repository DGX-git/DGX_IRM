"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";

import {
  Edit3,
  User,
  Loader2,
  CheckCircle,
  X,
  Mail,
  LogOut,
} from "lucide-react";
import Header from "@/app/navbar/page";
import { List } from "lucide-react";
import { useRouter } from "next/navigation";

interface InstituteAssociation {
  id: string;
  institute_id: string;
  department_id: string;
  is_reg_institute: boolean;
  instituteName?: string;
  departmentName?: string;
}

function ProfilePage() {
  const [profileData, setProfileData] = useState({
    id: "",
    firstname: "",
    lastname: "",
    role_id: "",
    contact_no: "",
    email_id: "",
  });
  type ProfileKeys = keyof typeof profileData;

  const [instituteAssociations, setInstituteAssociations] = useState<
    InstituteAssociation[]
  >([]);
  const [displayRoleName, setDisplayRoleName] = useState("");
  const [dropdownData, setDropdownData] = useState<{
    institutes: { id: string; name: string }[];
    departments: { id: string; name: string; institute_id: string | null }[];
  }>({
    institutes: [],
    departments: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(profileData);
  const [editAssociations, setEditAssociations] = useState<
    InstituteAssociation[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const [showOtherInstitutes, setShowOtherInstitutes] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  // Email verification states
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(""); // dynamic message
  const searchParams = useSearchParams();
  const userEmail = decodeURIComponent(searchParams.get("userEmail") || "");

  // Function to show snackbar with a message
  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setShowSuccessSnackbar(true);
  };

  const router = useRouter();

  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      // const email = "simranjamal7@gmail.com";
      const email = userEmail;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DGX_API_URL}/profile/getUserProfile?email=${email}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || data.error) {
        return setError("Profile not found");
      }

      // Set everything directly
      setProfileData(data.user);
      setEditData(data.user);
      setDisplayRoleName(data.role?.role_name || "");

      setDropdownData({
        institutes: data.masterData.institutes,
        departments: data.masterData.departments,
      });

      setInstituteAssociations(data.associations);
      setEditAssociations(data.associations);
    } catch (err) {
      setError("Failed to load profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  useEffect(() => {
  if (userEmail) {
    const timer = setTimeout(() => {
      fetchUserProfile();
    }, 300); // delay 300ms

    return () => clearTimeout(timer); // cleanup
  }
}, [userEmail]);


  const validateField = (field: string, value: any): string => {
    const str = value === null || value === undefined ? "" : String(value);

    switch (field) {
      case "firstname":
        if (!str.trim()) return "First name is required";
        if (!/^[a-zA-Z\s]+$/.test(str))
          return "First name can only contain letters";
        break;

      case "lastname":
        if (!str.trim()) return "Last name is required";
        if (!/^[a-zA-Z\s]+$/.test(str))
          return "Last name can only contain letters";
        break;

      case "contact_no":
        if (!str.trim()) return "Phone number is required";
        if (!/^[0-9]\d{9}$/.test(str)) return "Enter valid 10-digit phone";
        break;

      case "email_id":
        if (!str.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)) {
          return "Enter valid email";
        }
        break;
    }

    return "";
  };

  const validateAll = () => {
    const newErrors: Record<string, string> = {};

    const fieldsToValidate = [
      "firstname",
      "lastname",
      "contact_no",
      "email_id",
    ];

    fieldsToValidate.forEach((field) => {
      const error = validateField(field, (editData as any)[field]);
      if (error) newErrors[field] = error;
    });

    const registeredAssoc = editAssociations.find((a) => a.is_reg_institute);

    if (!registeredAssoc?.institute_id) {
      newErrors["institute_id"] = "Institute is required";
    }

    if (!registeredAssoc?.department_id) {
      newErrors["department_id"] = "Department is required";
    }

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setEditData((prev) => ({ ...prev, [field]: value }));

    if (fieldErrors[field] && value.trim() !== "") {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const getFilteredDepartments = (instituteId: string | number | null) => {
    if (instituteId === null || instituteId === undefined || instituteId === "")
      return [];
    const idStr = String(instituteId);
    return dropdownData.departments.filter(
      (dept) => String(dept.institute_id) === idStr
    );
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(profileData);
    setEditAssociations([...instituteAssociations]);
    setFieldErrors({});
  };

  const handleSave = async () => {
    if (!validateAll()) return;

    const emailChanged = editData.email_id !== profileData.email_id;

    try {
      setSaving(true);
      // Compare old vs new values — same logic as AWS version
      const userFieldsChanged =
        editData.firstname !== profileData.firstname ||
        editData.lastname !== profileData.lastname ||
        editData.contact_no !== profileData.contact_no ||
        editData.email_id !== profileData.email_id;

      // ------------------------------------
      // 1️⃣ Update User in DB
      // ------------------------------------
      if (userFieldsChanged) {
        const updateUserResponse = await fetch(
          `${process.env.NEXT_PUBLIC_DGX_API_URL}/profile/${editData.id}/updateProfile`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("JWT_Token")}`,
            },
            body: JSON.stringify({
              first_name: editData.firstname,
              last_name: editData.lastname,
              contact_no: editData.contact_no,
              email_id: editData.email_id,
              updated_by: editData.id,
              updated_timestamp: new Date(),
            }),
          }
        );

        // if (!updateUserResponse.ok) {
        //   const errorData = await updateUserResponse.json();
        //   throw new Error(errorData.error || "Failed to update user");
        // }
        const updateUserData = await updateUserResponse.json();

// If backend sends a new token (because email changed), update localStorage
if (emailChanged && updateUserData.newToken) {
  localStorage.setItem("JWT_Token", updateUserData.newToken);
}

      }

      // ------------------------------------
      // 2️⃣ Handle Registered Institute changes
      // ------------------------------------
      const registeredAssoc = editAssociations.find((a) => a.is_reg_institute);
      const originalRegisteredAssoc = instituteAssociations.find(
        (a) => a.is_reg_institute
      );

      if (registeredAssoc && originalRegisteredAssoc) {
        const changed =
          registeredAssoc.institute_id !==
            originalRegisteredAssoc.institute_id ||
          registeredAssoc.department_id !==
            originalRegisteredAssoc.department_id;

        if (changed) {
          const existingAssoc = instituteAssociations.find(
            (a) =>
              !a.is_reg_institute &&
              Number(a.institute_id) === Number(registeredAssoc.institute_id)
          );

          if (existingAssoc) {
            // Swap flags - Update original to false
            const swapOriginalResponse = await fetch(
              `${process.env.NEXT_PUBLIC_DGX_API_URL}/profile/${originalRegisteredAssoc.id}/updateAssociation`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("JWT_Token")}`,
                },
                body: JSON.stringify({
                  is_reg_institute: false,
                  updated_by: editData.id,
                  updated_timestamp: new Date(),
                }),
              }
            );

            if (!swapOriginalResponse.ok) {
              throw new Error("Failed to update original association");
            }

            // Swap flags - Update existing to true
            const swapExistingResponse = await fetch(
              `${process.env.NEXT_PUBLIC_DGX_API_URL}/profile/${existingAssoc.id}/updateAssociation`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("JWT_Token")}`,
                },
                body: JSON.stringify({
                  is_reg_institute: true,
                  department_id: registeredAssoc.department_id,
                  updated_by: editData.id,
                  updated_timestamp: new Date(),
                }),
              }
            );

            if (!swapExistingResponse.ok) {
              throw new Error("Failed to update existing association");
            }
          } else {
            // Normal update
            const updateAssocResponse = await fetch(
              `${process.env.NEXT_PUBLIC_DGX_API_URL}/profile/${registeredAssoc.id}/updateAssociation`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("JWT_Token")}`,
                },
                body: JSON.stringify({
                  institute_id: registeredAssoc.institute_id,
                  department_id: registeredAssoc.department_id,
                  updated_by: editData.id,
                  updated_timestamp: new Date(),
                }),
              }
            );

            if (!updateAssocResponse.ok) {
              throw new Error("Failed to update association");
            }
          }
        }
      }

      if (
        !userFieldsChanged &&
        (!registeredAssoc ||
          !originalRegisteredAssoc ||
          (registeredAssoc.institute_id ===
            originalRegisteredAssoc.institute_id &&
            registeredAssoc.department_id ===
              originalRegisteredAssoc.department_id))
      ) {
        setIsEditing(false);
        return;
      }

      setProfileData(editData);

      // Update UI state
      // Refresh and show success
      if (!emailChanged) {
        await fetchUserProfile();
      }
      setProfileData(editData);
      setIsEditing(false);
      setFieldErrors({});
      setError(null);
      showSnackbar("Profile updated successfully!");
      setTimeout(() => setShowSuccessSnackbar(false), 3000);
    } catch (err) {
      console.error("❌ Error saving user data:", err);
      setError("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData(profileData);
    setEditAssociations([...instituteAssociations]);
    setIsEditing(false);
    setError(null);
    setFieldErrors({});
  };

  const handleLogout = async () => {
    try {
      // await supabase.auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setShowLogoutConfirm(false);
    }
  };

    // Loading state
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-50 via-green-50 min-h-screen py-0">
        <Header />
        <div className="max-w-md mx-auto mt-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="px-4 py-8">
              <div className="flex justify-center items-center">
                <Loader2 className="w-8 h-8 animate-spin text-lime-600" />
                <span className="ml-2 text-gray-600">Loading profile...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    // <div className="bg-gradient-to-br from-slate-50 via-green-50 min-h-screen py-0 ">
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col overflow-hidden">
      <Header />
      {/* Error Snackbar */}

      {/* <div className="max-w-lg mx-auto mt-4"> */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div
          className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 overflow-hidden"
          style={{
            backgroundColor: "#fff",
            boxShadow:
              "0 25px 50px -12px rgba(68, 73, 61, 0.15), 0 0 0 1px rgba(201, 202, 199, 0.5)",
          }}
        >
          <div className="px-4 py-2 mb-2">
            <div className="flex justify-center items-center mb-2 mt-2">
              <h1 className="text-xl font-bold text-gray-800">Profile</h1>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex justify-center mb-3">
              <div className="relative group">
                <div className="w-16 h-16 bg-gradient-to-br rounded-full flex items-center justify-center bg-[#76B900]">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r rounded-full bg-[#76B900] opacity-30 group-hover:opacity-50 blur transition-opacity duration-300"></div>
              </div>
            </div>

            <div className="flex justify-center mb-4">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="cursor-pointer inline-flex items-center px-3 py-1.5 text-sm font-semibold text-[#5a8f00] bg-green-50/80 backdrop-blur-sm rounded-lg hover:bg-green-100/80 transition-all duration-300 border border-green-200/50"
                >
                  <Edit3 className="w-4 h-4 mr-1.5" />
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="transition-colors text-sm font-medium cursor-pointer inline-flex items-center px-3 py-1.5 text-sm font-semibold text-white rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: saving ? "#9ca3af" : "#76B900",
                    }}
                    onMouseEnter={(e) => {
                      if (!saving) {
                        e.currentTarget.style.backgroundColor = "#5a8f00";
                        e.currentTarget.style.transform = "translateY(0px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!saving) {
                        e.currentTarget.style.backgroundColor = "#76B900";
                        e.currentTarget.style.transform = "translateY(0)";
                      }
                    }}
                  >
                    {saving && (
                      <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                    )}
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="transition-colors text-sm font-medium cursor-pointer px-3 py-1.5 text-sm font-semibold text-white rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: saving ? "#9ca3af" : "#76B900",
                    }}
                    onMouseEnter={(e) => {
                      if (!saving) {
                        e.currentTarget.style.backgroundColor = "#5a8f00";
                        e.currentTarget.style.transform = "translateY(0px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!saving) {
                        e.currentTarget.style.backgroundColor = "#76B900";
                        e.currentTarget.style.transform = "translateY(0)";
                      }
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            {/* Profile Fields */}
            <div className="space-y-2">
              {/* First Name and Last Name */}
              {[
                {
                  label: "First Name",
                  field: "firstname",
                  value: profileData.firstname,
                  required: true,
                },
                {
                  label: "Last Name",
                  field: "lastname",
                  value: profileData.lastname,
                  required: true,
                },
              ].map(({ label, field, value, required }) => (
                <div key={field} className="group">
                  <div
                    className={`bg-gradient-to-r rounded-lg p-2 border transition-all duration-300 hover:shadow-md ${
                      fieldErrors[field]
                        ? "border-red-300 from-red-50 to-pink-50/30"
                        : "border-gray-200/50 hover:border-green-200 from-gray-50 to-green-50/30 hover:from-white hover:to-green-50/50"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 min-w-0">
                        <label
                          className={`block text-xs font-medium tracking-wider mb-0.5 ${
                            fieldErrors[field]
                              ? "text-red-600"
                              : "text-gray-500"
                          }`}
                        >
                          {fieldErrors[field]
                            ? `${fieldErrors[field]}`
                            : `${label} ${required ? "*" : ""}`}
                        </label>

                        {isEditing ? (
                          <input
                            type="text"
                            value={editData[field as ProfileKeys]}
                            onChange={(e) => {
                              let inputValue = e.target.value;
                              inputValue = inputValue.replace(
                                /[^a-zA-Z\s]/g,
                                ""
                              );
                              handleInputChange(field, inputValue);
                            }}
                            className={`w-full text-gray-900 bg-transparent border-none outline-none focus:ring-0 p-0 font-medium transition-colors duration-200 ${
                              fieldErrors[field] ? "text-red-600" : ""
                            }`}
                            required={required}
                            maxLength={50}
                            style={
                              fieldErrors[field] ? { color: "#dc2626" } : {}
                            }
                          />
                        ) : (
                          <div className="text-gray-900 font-medium truncate">
                            {value || "Loading..."}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Institute & Department Section*/}
              <div>
                {(isEditing ? editAssociations : instituteAssociations)
                  .filter((assoc) => assoc.is_reg_institute)
                  .map((assoc) => (
                    <div key={assoc.id}>
                      {/* Institute Field */}
                      <div className="group">
                        <div
                          className={`bg-gradient-to-r rounded-lg p-2 border transition-all duration-300 hover:shadow-md ${
                            fieldErrors["institute_id"]
                              ? "border-red-300 from-red-50 to-pink-50/30"
                              : "border-gray-200/50 hover:border-green-200 from-gray-50 to-green-50/30 hover:from-white hover:to-green-50/50"
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-0.5">
                                <label
                                  className={`block text-xs font-medium tracking-wider ${
                                    fieldErrors["institute_id"]
                                      ? "text-red-600"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {fieldErrors["institute_id"]
                                    ? `${fieldErrors["institute_id"]}`
                                    : "Institute *"}
                                </label>
                                {instituteAssociations.filter(
                                  (a) => !a.is_reg_institute
                                ).length > 0 &&
                                  !isEditing && (
                                    <div className="relative">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setShowOtherInstitutes(true)
                                        }
                                        onMouseEnter={() =>
                                          setShowTooltip(true)
                                        }
                                        onMouseLeave={() =>
                                          setShowTooltip(false)
                                        }
                                        className="!p-0 cursor-pointer bg-lime-50 hover:bg-lime-100 text-lime-700 border border-lime-200 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 transition-all duration-200"
                                      >
                                        <List className="w-5 h-5" />
                                      </button>

                                      {showTooltip && (
                                        <div className="absolute z-50 -top-10 left-1/2 transform -translate-x-1/2 bg-white border border border-lime-500  rounded-lg shadow-lg px-1 py-2 whitespace-nowrap">
                                          <div className="text-xs font-medium text-gray-700">
                                            Institute List
                                          </div>
                                          {/* Triangle pointer */}
                                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white border-r border-b border-gray-300 rotate-45"></div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                              </div>

                              {isEditing ? (
                                <select
                                  value={assoc.institute_id}
                                  onChange={(e) => {
                                    const updatedAssocs = editAssociations.map(
                                      (a) =>
                                        a.id === assoc.id
                                          ? {
                                              ...a,
                                              institute_id: e.target.value,
                                              department_id: "",
                                            }
                                          : a
                                    );
                                    setEditAssociations(updatedAssocs);

                                    if (
                                      fieldErrors["institute_id"] &&
                                      e.target.value.trim() !== ""
                                    ) {
                                      setFieldErrors((prev) => ({
                                        ...prev,
                                        institute_id: "",
                                      }));
                                    }
                                  }}
                                  className={`w-full text-gray-900 bg-transparent border-none outline-none focus:ring-0 p-0 font-medium transition-colors duration-200 ${
                                    fieldErrors["institute_id"]
                                      ? "text-red-600"
                                      : ""
                                  }`}
                                  style={
                                    fieldErrors["institute_id"]
                                      ? { color: "#dc2626" }
                                      : {}
                                  }
                                >
                                  <option value="">Select Institute</option>
                                  {dropdownData.institutes.map((institute) => (
                                    <option
                                      key={institute.id}
                                      value={institute.id}
                                    >
                                      {institute.name}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <div className="text-gray-900 font-medium truncate">
                                  {assoc.instituteName || "Loading..."}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Department Field */}
                      <div className="group mt-2">
                        <div
                          className={`bg-gradient-to-r rounded-lg p-2 border transition-all duration-300 hover:shadow-md ${
                            fieldErrors["department_id"]
                              ? "border-red-300 from-red-50 to-pink-50/30"
                              : "border-gray-200/50 hover:border-green-200 from-gray-50 to-green-50/30 hover:from-white hover:to-green-50/50"
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 min-w-0">
                              <label
                                className={`block text-xs font-medium tracking-wider mb-0.5 ${
                                  fieldErrors["department_id"]
                                    ? "text-red-600"
                                    : "text-gray-500"
                                }`}
                              >
                                {fieldErrors["department_id"]
                                  ? `${fieldErrors["department_id"]}`
                                  : "Department *"}
                              </label>

                              {isEditing ? (
                                <select
                                  value={assoc.department_id ?? ""}
                                  onChange={(e) => {
                                    const updatedAssocs = editAssociations.map(
                                      (a) =>
                                        a.id === assoc.id
                                          ? {
                                              ...a,
                                              department_id: e.target.value,
                                            }
                                          : a
                                    );
                                    setEditAssociations(updatedAssocs);

                                    if (
                                      fieldErrors["department_id"] &&
                                      e.target.value.trim() !== ""
                                    ) {
                                      setFieldErrors((prev) => ({
                                        ...prev,
                                        department_id: "",
                                      }));
                                    }
                                  }}
                                  className={`w-full text-gray-900 bg-transparent border-none outline-none focus:ring-0 p-0 font-medium transition-colors duration-200 ${
                                    fieldErrors["department_id"]
                                      ? "text-red-600"
                                      : ""
                                  }`}
                                  disabled={!assoc.institute_id}
                                  style={
                                    fieldErrors["department_id"]
                                      ? { color: "#dc2626" }
                                      : {}
                                  }
                                >
                                  <option value="">Select Department</option>
                                  {getFilteredDepartments(
                                    Number(assoc.institute_id)
                                  ).map((option) => (
                                    <option key={option.id} value={option.id}>
                                      {option.name}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <div className="text-gray-900 font-medium truncate">
                                  {assoc.departmentName || "Loading..."}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                {/* {instituteAssociations.filter((a) => a.is_reg_institute)
                  .length === 0 &&
                  !isEditing && (
                    <div className="text-center py-4 text-sm text-gray-500">
                      No registered institute found
                    </div>
                  )} */}
              </div>

              {/* Remaining Fields: Role, Phone, Email */}
              {[
                {
                  label: "Role",
                  field: "role_id",
                  value: displayRoleName,
                  required: true,
                },
                {
                  label: "Phone No.",
                  field: "contact_no",
                  value: profileData.contact_no,
                  required: true,
                },
                {
                  label: "Email Id",
                  field: "email_id",
                  value: profileData.email_id,
                  required: true,
                },
              ].map(({ label, field, value, required }) => (
                <div key={field} className="group">
                  <div
                    className={`bg-gradient-to-r rounded-lg p-2 border transition-all duration-300 hover:shadow-md ${
                      fieldErrors[field]
                        ? "border-red-300 from-red-50 to-pink-50/30"
                        : "border-gray-200/50 hover:border-green-200 from-gray-50 to-green-50/30 hover:from-white hover:to-green-50/50"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 min-w-0">
                        <label
                          className={`block text-xs font-medium tracking-wider mb-0.5 ${
                            fieldErrors[field]
                              ? "text-red-600"
                              : "text-gray-500"
                          }`}
                        >
                          {fieldErrors[field]
                            ? `${fieldErrors[field]}`
                            : `${label} ${required ? "*" : ""}`}
                        </label>

                        {isEditing ? (
                          field === "role_id" ? (
                            <div className="text-gray-900 font-medium">
                              {displayRoleName || "Unknown Role"}
                            </div>
                          ) : (
                            <input
                              type={
                                field === "email_id"
                                  ? "email"
                                  : field === "contact_no"
                                  ? "tel"
                                  : "text"
                              }
                              value={editData[field as ProfileKeys]}
                              onChange={(e) => {
                                let inputValue = e.target.value;

                                if (field === "contact_no") {
                                  inputValue = inputValue
                                    .replace(/[^0-9]/g, "")
                                    .slice(0, 10);
                                }

                                handleInputChange(field, inputValue);
                              }}
                              className={`w-full text-gray-900 bg-transparent border-none outline-none focus:ring-0 p-0 font-medium transition-colors duration-200 ${
                                fieldErrors[field] ? "text-red-600" : ""
                              }`}
                              required={required}
                              maxLength={field === "contact_no" ? 10 : 50}
                              style={
                                fieldErrors[field] ? { color: "#dc2626" } : {}
                              }
                            />
                          )
                        ) : (
                          <div className="text-gray-900 font-medium truncate">
                            {value || "Loading..."}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Email Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <div className="text-center mb-4">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <Mail className="w-6 h-6" style={{ color: "#76B900" }} />
              </div>
              <h4 className="text-lg font-bold mb-1 text-gray-800">
                Verify Your New Email
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                We've sent a verification link to your new email address.
                {/* check your inbox and click the link to verify. */}
                To update your email, you first need to verify the new email
                address. Please check your inbox and click the verification
                link.
              </p>
            </div>
          </div>
        </div>
      )}

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-md shadow-md w-full max-w-sm mx-4">
            <div className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <LogOut className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Email Updated!
              </h3>
              <p className="text-gray-600 mb-6">
                Your new email has been updated successfully.
                <br />
                Please log out and log in again using your updated email
                address.
              </p>

              <button
                onClick={handleLogout}
                className="bg-lime-600 text-white px-5 py-2 rounded-sm text-sm font-semibold hover:bg-lime-700 cursor-pointer"
              >
                Logout Now
              </button>
            </div>
          </div>
        </div>
      )}

      {showOtherInstitutes && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-5 relative">
            <button
              onClick={() => setShowOtherInstitutes(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-medium text-gray-800 text-center mb-4">
              Associated Institute List
            </h3>

            {/* List of Institutes */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {[...instituteAssociations]
                .sort((a, b) =>
                  a.is_reg_institute === b.is_reg_institute
                    ? 0
                    : a.is_reg_institute
                    ? -1
                    : 1
                )
                .map((assoc, index) => (
                  <div
                    key={assoc.id}
                    className="bg-gradient-to-r from-gray-50 to-green-50/30 rounded-lg p-3 border border-gray-200/50 hover:border-green-200 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <span className="text-sm font-medium text-gray-700">
                          {index + 1}.
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* NEW: Wrapped institute name and badge in a flex container */}
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm font-medium text-gray-900">
                            {assoc.instituteName}
                          </h3>
                          {assoc.is_reg_institute && (
                            <span className="flex-shrink-0 bg-lime-100 text-lime-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-lime-200">
                              Primary
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-gray-900 truncate mt-1">
                          Department : {assoc.departmentName}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

              {instituteAssociations.length === 0 && (
                <div className="text-center py-8 text-sm text-gray-500">
                  No associated institutes
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setShowOtherInstitutes(false)}
                className="cursor-pointer bg-lime-500 hover:bg-lime-600 text-white px-6 py-2 rounded text-sm font-semibold transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Snackbar */}
      {showSuccessSnackbar && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-bottom duration-300">
          <div className="bg-[#76B900] text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm">
            <div className="bg-[#76B900] text-white w-5 h-5 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-4 text-white" />
            </div>
            <span className="font-medium text-sm">{snackbarMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Export with Suspense Wrapper
export default function Profile() {
  return (
    <Suspense fallback={<div></div>}>
      <ProfilePage />
    </Suspense>
  );
}
