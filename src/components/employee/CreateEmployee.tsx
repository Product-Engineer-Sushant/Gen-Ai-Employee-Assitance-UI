import {
  FaUser,
  FaEnvelope,
  FaMoneyBillWave,
  FaPhone,
} from "react-icons/fa";

import { httpRequest } from "../../lib/httpRequest";
import { useState, type FormEvent } from "react";

interface EmployeeForm {
  name: string;
  email: string;
  salary: string;
  mobile: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  salary?: string;
  mobile?: string;
}

export default function CreateEmployee() {
  const [formData, setFormData] = useState<EmployeeForm>({
    name: "",
    email: "",
    salary: "",
    mobile: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const [loading, setLoading] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setSuccessMessage("");
    setErrorMessage("");
  };

  // =========================
  // VALIDATION
  // =========================

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Employee name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name =
        "Name must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      newErrors.email =
        "Enter a valid email address";
    }

    if (!formData.salary.trim()) {
      newErrors.salary = "Salary is required";
    } else if (Number(formData.salary) <= 0) {
      newErrors.salary =
        "Salary must be greater than 0";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile =
        "Mobile number is required";
    } else if (
      !/^[0-9]{10}$/.test(formData.mobile)
    ) {
      newErrors.mobile =
        "Mobile number must contain exactly 10 digits";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =========================
  // SUBMIT
  // =========================

const handleSubmit = async (
  e: FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  // Clear previous messages
  setSuccessMessage("");
  setErrorMessage("");

  // Validate form
  const isValid = validate();

  if (!isValid) {
    return;
  }

  try {
    setLoading(true);

const response = await httpRequest("/employee", {
  method: "POST",
  data: {
    name: formData.name.trim(),
    email: formData.email.trim(),
    salary: Number(formData.salary),
    mobile: formData.mobile.trim(),
  },
});

    console.log(
      "Employee Created:",
      response.data
    );

    setSuccessMessage(
      response.data?.message ||
        "Employee created successfully!"
    );

    // Reset form
    setFormData({
      name: "",
      email: "",
      salary: "",
      mobile: "",
    });
  } catch (error: any) {
    console.error(
      "Create Employee Error:",
      error
    );

    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Unable to create employee. Please try again.";

    setErrorMessage(message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="w-full min-h-full bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">

        {/* ================= HEADER ================= */}

        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Create Employee
          </h1>

          <p className="mt-2 text-sm md:text-base text-gray-500">
            Add a new employee to your organization by
            providing their basic information below.
          </p>
        </div>

        {/* ================= FORM CARD ================= */}

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 md:p-8">

          {/* SUCCESS MESSAGE */}

          {successMessage && (
            <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
              <p className="text-sm font-medium text-green-700">
                {successMessage}
              </p>
            </div>
          )}

          {/* ERROR MESSAGE */}

          {errorMessage && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm font-medium text-red-700">
                {errorMessage}
              </p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* ================= NAME ================= */}

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Employee Name
              </label>

              <div className="relative">
                <FaUser
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={14}
                />

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter employee name"
                  className={`
                    w-full h-11 pl-10 pr-4 rounded-xl
                    border outline-none text-sm
                    transition
                    ${
                      errors.name
                        ? "border-red-400 focus:ring-2 focus:ring-red-100"
                        : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    }
                  `}
                />
              </div>

              {errors.name && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.name}
                </p>
              )}
            </div>

            {/* ================= EMAIL ================= */}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>

              <div className="relative">
                <FaEnvelope
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={14}
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="employee@example.com"
                  className={`
                    w-full h-11 pl-10 pr-4 rounded-xl
                    border outline-none text-sm
                    transition
                    ${
                      errors.email
                        ? "border-red-400 focus:ring-2 focus:ring-red-100"
                        : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    }
                  `}
                />
              </div>

              {errors.email && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            {/* ================= SALARY ================= */}

            <div>
              <label
                htmlFor="salary"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Salary
              </label>

              <div className="relative">
                <FaMoneyBillWave
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={14}
                />

                <input
                  id="salary"
                  name="salary"
                  type="number"
                  min="0"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="Enter salary"
                  className={`
                    w-full h-11 pl-10 pr-4 rounded-xl
                    border outline-none text-sm
                    transition
                    ${
                      errors.salary
                        ? "border-red-400 focus:ring-2 focus:ring-red-100"
                        : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    }
                  `}
                />
              </div>

              {errors.salary && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.salary}
                </p>
              )}
            </div>

            {/* ================= MOBILE ================= */}

            <div>
              <label
                htmlFor="mobile"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mobile Number
              </label>

              <div className="relative">
                <FaPhone
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={14}
                />

                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter 10 digit mobile number"
                  className={`
                    w-full h-11 pl-10 pr-4 rounded-xl
                    border outline-none text-sm
                    transition
                    ${
                      errors.mobile
                        ? "border-red-400 focus:ring-2 focus:ring-red-100"
                        : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    }
                  `}
                />
              </div>

              {errors.mobile && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.mobile}
                </p>
              )}
            </div>

            {/* ================= SUBMIT ================= */}

            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="
                  w-full h-11
                  rounded-xl
                  bg-blue-600
                  hover:bg-blue-700
                  active:bg-blue-800
                  disabled:bg-blue-400
                  disabled:cursor-not-allowed
                  text-white
                  text-sm
                  font-semibold
                  transition
                  shadow-sm
                  flex items-center
                  justify-center
                "
              >
                {loading ? (
                  <>
                    <span
                      className="
                        w-4 h-4
                        border-2
                        border-white
                        border-t-transparent
                        rounded-full
                        animate-spin
                        mr-2
                      "
                    />

                    Creating Employee...
                  </>
                ) : (
                  "Create Employee"
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
