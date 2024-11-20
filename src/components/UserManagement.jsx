import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import UserForm from "./UserForm";

const API_URL = "https://jsonplaceholder.typicode.com/users";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (error) {
      toast.error("Failed to fetch users");
    }
    setLoading(false);
  };

 const addUser = async (user) => {
   try {
     // Assign a unique ID for local use
     const newUser = { ...user, id: Date.now() };

     // Simulate API request
     const response = await axios.post(API_URL, newUser);

     // Update the local state
     setUsers((prevUsers) => [response.data, ...prevUsers]);

     toast.success("User added successfully!");
   } catch (error) {
     console.error("Add User Error:", error.response || error.message);
     toast.error("Failed to add user");
   }
 };


 const editUser = async (updatedUser) => {
   try {
     // Check if user ID exists in mock API
     if (updatedUser.id < 100) {
       // Simulate API update for existing users
       const response = await axios.put(
         `${API_URL}/${updatedUser.id}`,
         updatedUser
       );

       if (response.status === 200) {
         console.log("API Response Success:", response.data);

         // Update local state
         setUsers((prevUsers) =>
           prevUsers.map((user) =>
             user.id === updatedUser.id ? { ...user, ...updatedUser } : user
           )
         );
         toast.success("User updated successfully!");
       } else {
         throw new Error("Unexpected response from server.");
       }
     } else {
       // Handle locally added users
       setUsers((prevUsers) =>
         prevUsers.map((user) =>
           user.id === updatedUser.id ? { ...user, ...updatedUser } : user
         )
       );
       toast.success("User updated locally!");
     }
   } catch (error) {
     console.error("Edit User Error:", error.response || error.message);
     toast.error("Failed to update user");
   }
 };


  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== id));
      toast.success("User deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const paginatedUsers = users.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
      <h1 className="text-xl font-bold mb-4">User Management Dashboard</h1>
      <button
        onClick={() => {
          setSelectedUser(null);
          setIsFormVisible(true);
        }}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        <FaPlus className="inline mr-2" /> Add User
      </button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table className="table-auto w-full mb-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">ID</th>
                <th className="p-2">First Name</th>
                <th className="p-2">Last Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Department</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="p-2">{user.id}</td>
                  <td className="p-2">{user.name.split(" ")[0]}</td>
                  <td className="p-2">{user.name.split(" ")[1]}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.department || "N/A"}</td>
                  <td className="p-2">
                    <button
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 mr-2"
                      onClick={() => {
                        setSelectedUser(user);
                        setIsFormVisible(true);
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => deleteUser(user.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center items-center gap-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-4 py-2 bg-gray-300 text-black rounded disabled:opacity-50"
            >
              Prev
            </button>
            <p>Page {currentPage}</p>
            <button
              disabled={currentPage * usersPerPage >= users.length}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-4 py-2 bg-gray-300 text-black rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
      {isFormVisible && (
        <UserForm
          user={selectedUser}
          onSave={(user) => {
            selectedUser ? editUser(user) : addUser(user);
            setIsFormVisible(false);
          }}
          onCancel={() => setIsFormVisible(false)}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default UserManagement;
