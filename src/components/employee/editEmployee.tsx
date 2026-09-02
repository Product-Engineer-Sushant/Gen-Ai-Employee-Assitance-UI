import { useState } from "react";
import { httpRequest } from "../../lib/httpRequest";

interface Employee {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  salary: number;
}

interface FormData {
  name: string;
  email: string;
  mobile: string;
  salary: string;
}

interface Errors {
  name?: string;
  email?: string;
  mobile?: string;
  salary?: string;
}

interface EditEmployeeProps {
  initialEmployee?: Employee;
}

export default function EditEmployee({ initialEmployee }: EditEmployeeProps) {
  // =========================
  // Search States
  // =========================
  const [search, setSearch] = useState(initialEmployee?.name ?? "");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  // =========================
  // Employee State
  // =========================
  const [employee, setEmployee] = useState<Employee | null>(initialEmployee ?? null);

  // =========================
  // Form State
  // =========================
  const [formData, setFormData] = useState<FormData>({
    name: initialEmployee?.name ?? "",
    email: initialEmployee?.email ?? "",
    mobile: initialEmployee?.mobile ?? "",
    salary: initialEmployee ? String(initialEmployee.salary) : "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  // =========================
  // Search Employee
  // =========================
  const handleSearch = async () => {
    if (!search.trim()) {
      setSearchError("Please enter employee name, email or mobile.");
      return;
    }

    try {
      setSearchLoading(true);
      setSearchError("");
      setSuccess("");
      setEmployee(null);

        const response = await httpRequest(
            `/employee/search?search=${encodeURIComponent(search.trim())}`,
            {
                method: "GET",
            }
        );

      const data = response.data?.data;

      if (!data || data.length === 0) {
        setSearchError("Employee not found.");
        return;
      }

      // First matching employee
      const selectedEmployee = data[0];

      setEmployee(selectedEmployee);

      // Fill form
      setFormData({
        name: selectedEmployee.name || "",
        email: selectedEmployee.email || "",
        mobile: selectedEmployee.mobile || "",
        salary: String(selectedEmployee.salary ?? ""),
      });

      setErrors({});
    } catch (error: any) {
      console.error("Search Employee Error:", error);

      setSearchError(
        error?.response?.data?.message ||
          "Unable to search employee."
      );
    } finally {
      setSearchLoading(false);
    }
  };

  // =========================
  // Input Change
  // =========================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove field error while typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setSuccess("");
  };

  // =========================
  // Validation
  // =========================
  const validate = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required.";
    } else if (!/^[0-9]{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must be 10 digits.";
    }

    if (!formData.salary.trim()) {
      newErrors.salary = "Salary is required.";
    } else if (
      Number.isNaN(Number(formData.salary)) ||
      Number(formData.salary) < 0
    ) {
      newErrors.salary = "Enter a valid salary.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =========================
  // Save / Update Employee
  // =========================
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!employee) {
      return;
    }

    if (!validate()) {
      return;
    }

    try {
      setSaving(true);
      setSuccess("");
      setSearchError("");

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        salary: Number(formData.salary),
      };

      const response = await httpRequest(
            `/employee/${employee._id}`,
            {
                method: "PUT",
                data: payload,
            }
        );

      console.log("Update Response:", response.data);

      setSuccess(
        response.data?.message ||
          "Employee updated successfully."
      );


      // Update local employee state
      setEmployee((prev) =>
        prev
          ? {
              ...prev,
              ...payload,
            }
          : prev
      );
    } catch (error: any) {
      console.error("Update Employee Error:", error);

      setSearchError(
        error?.response?.data?.message ||
          "Unable to update employee."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // Cancel
  // =========================
  const handleCancel = () => {
    setSearch("");
    setEmployee(null);

    setFormData({
      name: "",
      email: "",
      mobile: "",
      salary: "",
    });

    setErrors({});
    setSearchError("");
    setSuccess("");
    setSaving(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm p-6">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Edit Employee
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Search an employee and update their information.
        </p>
      </div>

      {/* =========================
          Search
      ========================= */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search Employee
        </label>

        <div className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSearchError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder="Name, email or mobile"
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
          />

          <button
            type="button"
            onClick={handleSearch}
            disabled={searchLoading}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {searchLoading ? "Searching..." : "Search"}
          </button>
        </div>

        {searchError && (
          <p className="text-sm text-red-500 mt-2">
            {searchError}
          </p>
        )}
      </div>

      {/* =========================
          Employee Form
      ========================= */}
      {employee && (
        <form onSubmit={handleSave}>

          {/* Employee ID */}
          <div className="mb-5 px-4 py-3 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500">
              Employee ID
            </p>

            <p className="text-sm font-medium text-gray-700 break-all">
              {employee._id}
            </p>
          </div>

          {/* Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-100 ${
                errors.name
                  ? "border-red-400"
                  : "border-gray-300 focus:border-blue-500"
              }`}
            />

            {errors.name && (
              <p className="text-xs text-red-500 mt-1">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-100 ${
                errors.email
                  ? "border-red-400"
                  : "border-gray-300 focus:border-blue-500"
              }`}
            />

            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Mobile */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Mobile
            </label>

            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={(e) => {
                const value = e.target.value
                  .replace(/\D/g, "")
                  .slice(0, 10);

                setFormData((prev) => ({
                  ...prev,
                  mobile: value,
                }));

                setErrors((prev) => ({
                  ...prev,
                  mobile: "",
                }));
              }}
              className={`w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-100 ${
                errors.mobile
                  ? "border-red-400"
                  : "border-gray-300 focus:border-blue-500"
              }`}
            />

            {errors.mobile && (
              <p className="text-xs text-red-500 mt-1">
                {errors.mobile}
              </p>
            )}
          </div>

          {/* Salary */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Salary
            </label>

            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              min="0"
              className={`w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-100 ${
                errors.salary
                  ? "border-red-400"
                  : "border-gray-300 focus:border-blue-500"
              }`}
            />

            {errors.salary && (
              <p className="text-xs text-red-500 mt-1">
                {errors.salary}
              </p>
            )}
          </div>

          {/* Success */}
          {success && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-sm text-green-700">
              {success}
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

          </div>
        </form>
      )}

      {/* Empty State */}
      {!employee && !searchLoading && !searchError && (
        <div className="py-10 text-center text-gray-400 text-sm">
          Search an employee to edit their information.
        </div>
      )}
    </div>
  );
}
