import React from "react";
import { useForm } from "react-hook-form";

const UserForm = ({ user, onSave, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: user || { name: "", email: "", department: "" },
  });

  const onSubmit = (data) => {
    const [firstName, lastName] = data.name.split(" ");
    onSave({
      ...user,
      id: user?.id || Date.now(),
      name: `${firstName} ${lastName || ""}`,
      email: data.email,
      department: data.department,
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">
          {user ? "Edit User" : "Add User"}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              {...register("name", { required: "Name is required" })}
              className="w-full px-4 py-2 border rounded"
              placeholder="First Last"
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Invalid email address",
                },
              })}
              className="w-full px-4 py-2 border rounded"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Department</label>
            <input
              {...register("department", {
                required: "Department is required",
              })}
              className="w-full px-4 py-2 border rounded"
            />
            {errors.department && (
              <p className="text-red-500">{errors.department.message}</p>
            )}
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Save
            </button>
            <button
              onClick={onCancel}
              type="button"
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
