import { useState } from "react";
import { FaSearch, FaTrash } from "react-icons/fa";
import {httpRequest} from "../../lib/httpRequest";

interface Employee {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  salary: number;
}

interface DeleteEmployeeProps {
  initialEmployee?: Employee;
}

export default function DeleteEmployee({ initialEmployee }: DeleteEmployeeProps) {
  const [search, setSearch] = useState(initialEmployee?.name ?? "");
  const [employee, setEmployee] = useState<Employee | null>(initialEmployee ?? null);

  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showConfirmation, setShowConfirmation] = useState(false);

  // Search employee
  const handleSearch = async () => {
    if (!search.trim()) {
      setError("Please enter employee name, email or mobile.");
      setEmployee(null);
      return;
    }

    try {
      setLoading(true);
      setError("");
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
        setError("Employee not found.");
        return;
      }

      // If multiple employees found, take first one
      setEmployee(data[0]);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to search employee."
      );
    } finally {
      setLoading(false);
    }
  };

  // Open confirmation
  const handleDeleteClick = () => {
    if (!employee) return;

    setShowConfirmation(true);
    setError("");
  };

  // Delete employee
  const handleDelete = async () => {
    if (!employee) return;

    try {
      setDeleting(true);
      setError("");
      setSuccess("");

      const response = await httpRequest(
        `/employee/${employee._id}`,
        {
          method: "DELETE",
        }
      );

      setSuccess(
        response.data?.message || "Employee deleted successfully."
      );

      setEmployee(null);
      setSearch("");
      setShowConfirmation(false);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to delete employee."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-sm border p-6">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Delete Employee
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Search an employee and delete the record.
        </p>
      </div>

      {/* Search */}
      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder="Search by name, email or mobile"
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="mb-5 p-3 rounded-lg bg-green-50 text-green-600 text-sm">
          {success}
        </div>
      )}

      {/* Employee Record */}
      {employee && (
        <div className="border rounded-xl overflow-hidden">

          <div className="bg-gray-50 px-5 py-4 border-b">
            <h3 className="font-semibold text-gray-800">
              Employee Details
            </h3>
          </div>

          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="text-sm text-gray-500">
                Employee ID
              </label>

              <p className="font-medium text-gray-800 break-all">
                {employee._id}
              </p>
            </div>

            <div>
              <label className="text-sm text-gray-500">
                Employee Name
              </label>

              <p className="font-medium text-gray-800">
                {employee.name}
              </p>
            </div>

            <div>
              <label className="text-sm text-gray-500">
                Email
              </label>

              <p className="font-medium text-gray-800">
                {employee.email}
              </p>
            </div>

            <div>
              <label className="text-sm text-gray-500">
                Mobile
              </label>

              <p className="font-medium text-gray-800">
                {employee.mobile}
              </p>
            </div>

            <div>
              <label className="text-sm text-gray-500">
                Salary
              </label>

              <p className="font-medium text-gray-800">
                Rs. {employee.salary}
              </p>
            </div>

          </div>

          {/* Delete button */}
          <div className="px-5 py-4 border-t flex justify-end">
            <button
              onClick={handleDeleteClick}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <FaTrash />
              Delete Employee
            </button>
          </div>
        </div>
      )}

      {/* Confirmation */}
      {showConfirmation && employee && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">

          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <FaTrash className="text-red-600" />
              </div>

              <h3 className="text-lg font-semibold text-gray-800">
                Delete Employee?
              </h3>
            </div>

            <p className="text-gray-600 text-sm mb-2">
              Are you sure you want to permanently delete:
            </p>

            <p className="font-semibold text-gray-800 mb-5">
              {employee.name}
            </p>

            <p className="text-sm text-red-600 mb-6">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setShowConfirmation(false)}
                disabled={deleting}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                <FaTrash />

                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}
