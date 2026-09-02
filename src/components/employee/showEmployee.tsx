import React, { useState } from "react";
import {
  FaUsers,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMoneyBillWave,
  FaIdBadge,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
export interface Employee {
  _id: string;
  name: string;
  email: string;
  salary: number;
  mobile: string;
}

interface ShowEmployeeProps {
  data: Employee | Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

const ShowEmployee: React.FC<ShowEmployeeProps> = ({ data, onEdit, onDelete }) => {

  const [employees] = useState<Employee[]>(
    Array.isArray(data) ? data : [data]
  );

  const [loading] = useState(false);
  const [error] = useState("");

  const employeeList = employees;

  // Edit employee
  const handleEdit = (employee: Employee) => {
    onEdit(employee);
  };

  // Delete employee
  const handleDelete = (employee: Employee) => {
    onDelete(employee);
  };

  // Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto" />

          <p className="mt-3 text-gray-500">
            Loading employees...
          </p>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl">
          {error}
        </div>
      </div>
    );
  }

  // Empty
  if (employeeList.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <FaUsers className="text-5xl text-gray-300 mx-auto mb-4" />

          <h2 className="text-xl font-semibold text-gray-700">
            No Employees Found
          </h2>

          <p className="text-gray-500 mt-2">
            There are currently no employees available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 px-3 sm:px-4 py-5 sm:py-8">
      <div className="max-w-5xl mx-auto">

        {/* ================= HEADER ================= */}
        <div className="mb-5 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4">

            <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 bg-blue-600 text-white rounded-xl flex items-center justify-center">
              <FaUsers />
            </div>

            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-gray-800">
                Employees Details
              </h1>

              <p className="text-xs sm:text-sm text-gray-500">
                Manage and view employee information
              </p>
            </div>

          </div>
        </div>

        {/* ================= CONTAINER ================= */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

          {/* Header */}
          <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200">
            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Employee List
                </h2>

                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Total Employees: {employeeList.length}
                </p>
              </div>

              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <FaUsers />
              </div>

            </div>
          </div>

          {/* ================================================= */}
          {/* DESKTOP TABLE - md and above */}
          {/* ================================================= */}

          <div className="employee-table-scroll overflow-x-auto">

            <table className="w-full min-w-[760px]">

              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">

                  <th className="px-5 lg:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                    Employee ID
                  </th>

                  <th className="px-5 lg:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                    Employee
                  </th>

                  <th className="px-5 lg:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                    Email
                  </th>

                  <th className="px-5 lg:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                    Mobile
                  </th>

                  <th className="px-5 lg:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                    Salary
                  </th>

                  <th className="px-5 lg:px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">

                {employeeList.map((employee, index) => (

                  <tr
                    key={employee._id || index}
                    className="hover:bg-gray-50 transition-colors"
                  >

                    {/* ID */}
                    <td className="px-5 lg:px-6 py-5">
                      <div className="flex items-center gap-2">

                        <FaIdBadge className="text-gray-400 shrink-0" />

                        <span className="font-medium text-gray-700 text-sm">
                          {employee._id || "N/A"}
                        </span>

                      </div>
                    </td>

                    {/* Employee */}
                    <td className="px-5 lg:px-6 py-5">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 shrink-0 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                          <FaUser />
                        </div>

                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 capitalize truncate max-w-[180px]">
                            {employee.name}
                          </p>

                          <p className="text-xs text-gray-400">
                            Employee
                          </p>
                        </div>

                      </div>

                    </td>

                    {/* Email */}
                    <td className="px-5 lg:px-6 py-5">

                      <div className="flex items-center gap-2 text-gray-600">

                        <FaEnvelope className="text-blue-500 shrink-0" />

                        <span className="text-sm truncate max-w-[220px]">
                          {employee.email}
                        </span>

                      </div>

                    </td>

                    {/* Mobile */}
                    <td className="px-5 lg:px-6 py-5">

                      <div className="flex items-center gap-2 text-gray-600">

                        <FaPhone className="text-green-500 shrink-0" />

                        <span className="text-sm">
                          {employee.mobile}
                        </span>

                      </div>

                    </td>

                    {/* Salary */}
                    <td className="px-5 lg:px-6 py-5">

                      <div className="flex items-center gap-2">

                        <FaMoneyBillWave className="text-emerald-500 shrink-0" />

                        <span className="font-semibold text-gray-800 text-sm whitespace-nowrap">
                          Rs. {employee.salary.toLocaleString()}
                        </span>

                      </div>

                    </td>

                    {/* Actions */}
                    <td className="px-5 lg:px-6 py-5">

                      <div className="flex items-center justify-center gap-2">

                        <button
                          type="button"
                          onClick={() => handleEdit(employee)}
                          className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"
                          title="Edit Employee"
                        >
                          <FaEdit />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(employee)}
                          className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"
                          title="Delete Employee"
                        >
                          <FaTrash />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {/* ================================================= */}
          {/* MOBILE CARDS - below md */}
          {/* ================================================= */}

          <div className="hidden divide-y divide-gray-100">

            {employeeList.map((employee, index) => (

              <div
                key={employee._id || index}
                className="p-4 sm:p-5"
              >

                {/* Employee Header */}
                <div className="flex items-center justify-between gap-3 mb-4">

                  <div className="flex items-center gap-3 min-w-0">

                    <div className="w-11 h-11 shrink-0 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                      <FaUser />
                    </div>

                    <div className="min-w-0">

                      <h3 className="font-semibold text-gray-800 truncate">
                        {employee.name}
                      </h3>

                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <FaIdBadge />
                        <span className="truncate">
                          {employee._id || "N/A"}
                        </span>
                      </div>

                    </div>

                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">

                    <button
                      type="button"
                      onClick={() => handleEdit(employee)}
                      className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"
                      title="Edit Employee"
                    >
                      <FaEdit />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(employee)}
                      className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"
                      title="Delete Employee"
                    >
                      <FaTrash />
                    </button>

                  </div>

                </div>

                {/* Details */}
                <div className="space-y-3">

                  {/* Email */}
                  <div className="flex items-center gap-3">

                    <div className="w-8 h-8 shrink-0 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
                      <FaEnvelope size={13} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[11px] text-gray-400 uppercase">
                        Email
                      </p>

                      <p className="text-sm text-gray-700 truncate">
                        {employee.email}
                      </p>
                    </div>

                  </div>

                  {/* Mobile */}
                  <div className="flex items-center gap-3">

                    <div className="w-8 h-8 shrink-0 rounded-lg bg-green-50 text-green-500 flex items-center justify-center">
                      <FaPhone size={13} />
                    </div>

                    <div>
                      <p className="text-[11px] text-gray-400 uppercase">
                        Mobile
                      </p>

                      <p className="text-sm text-gray-700">
                        {employee.mobile}
                      </p>
                    </div>

                  </div>

                  {/* Salary */}
                  <div className="flex items-center gap-3">

                    <div className="w-8 h-8 shrink-0 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center">
                      <FaMoneyBillWave size={13} />
                    </div>

                    <div>
                      <p className="text-[11px] text-gray-400 uppercase">
                        Salary
                      </p>

                      <p className="text-sm font-semibold text-gray-800">
                        Rs. {employee.salary.toLocaleString()}
                      </p>
                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>
    </div>
  );
};

export default ShowEmployee;

