import { useContext, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import api from "./api";
import { GlobalContext } from "../context/Context";
import useOutsideClick from "./outSideClick";
import OrderDetailsModal from "./OrderDetailModal";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { formatText, getInitials } from "./types";
import {
  ActiveStatusDropdown,
  BlockStatusDropdown,
  DeliveryStatusDropdown,
  PaymentStatusDropdown,
} from "./statusOptions";
import Modal from "./modal";
import { useNavigate } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";
import UserUpdateForm from "./updateUser";

/* ==============================
   DEFAULT COLUMNS
================================ */
const DEFAULT_COLUMNS = [
  // { key: "name", label: "Name", visible: true },
  { key: "phone", label: "Phone", visible: true },
  { key: "email_verified", label: "Email Verified", visible: true },
  { key: "user_role", label: "Active", visible: true },
  { key: "is_active", label: "Blocked", visible: true },
  { key: "is_blocked", label: "Role", visible: true },
  { key: "created_at", label: "Date", visible: true },
  { key: "user_id", label: "User ID", visible: true },
  { key: "actions", label: "Actions", visible: true },
];

const STORAGE_KEY = "user_table_columns";

/* ==============================
   MAIN COMPONENT
================================ */

const UsersList = ({
  users = [],
  updateUserStatus = () => {},
  loadingId = null,
  deleteUser = () => {},
  loading = true,
  isAdmin = false,
}) => {
  let { state } = useContext(GlobalContext);

  const [columns, setColumns] = useState(DEFAULT_COLUMNS);
  const [open, setOpen] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);

  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [Users, setUsers] = useState([]);

  // useEffect(() => {
  //   if (selectedUser) {
  //     const select = users?.filter((p) => p?.user_id == selectedUser?.user_id);
  //     setSelectedUser(select[0]);
  //   }
  // }, [users]);

  useEffect(() => {
    setUsers(users);
  }, [users]);

  const menuRef = useOutsideClick(() => {
    setOpen(false); // close when clicked outside
  });

  /* ==============================
     LOAD / SAVE COLUMNS
  ================================ */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setColumns(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(columns));
  }, [columns]);

  /* ==============================
     COLUMN CONTROL
  ================================ */
  const toggleColumn = (key) => {
    setColumns((prev) =>
      prev.map((c) => (c.key === key ? { ...c, visible: !c.visible } : c)),
    );
  };

  const resetColumns = () => {
    setColumns(DEFAULT_COLUMNS);
    localStorage.removeItem(STORAGE_KEY);
  };

  const onDragStart = (index) => setDragIndex(index);
  const onDragOver = (e) => e.preventDefault();

  const onDrop = (dropIndex) => {
    if (dragIndex === null) return;
    const updated = [...columns];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(dropIndex, 0, moved);
    setColumns(updated);
    setDragIndex(null);
  };

  /* ==============================
     CELL RENDER
  ================================ */

  const renderProductCell = (user) => (
    <div className="flex items-center gap-3 min-w-[240px]">
      {/* Avatar */}
      {user.profile ? (
        <img
          src={user.profile}
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover border"
        />
      ) : (
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold">
          {getInitials(user.name)}
        </div>
      )}

      {/* Name + Email */}
      <div className="flex flex-col">
        <span className="font-medium text-gray-800">{user.name || "-"}</span>
        <span className="text-xs text-gray-500">{user.email || "-"}</span>
      </div>
    </div>
  );

  const renderCell = (key, user) => {
    switch (key) {
      case "user_id":
        return (
          <span className="font-semibold text-gray-700">#{user.user_id}</span>
        );

      case "phone":
        return (
          <span className="text-gray-700 font-medium">{user.phone || "-"}</span>
        );

      case "is_active":
        return isAdmin ? (
          <ActiveStatusDropdown
            user={user}
            updateUserStatus={updateUserStatus}
            loadingId={loadingId}
          />
        ) : (
          <b>{formatText(user?.is_active)}</b>
        );

      case "is_blocked":
        return isAdmin ? (
          <BlockStatusDropdown
            user={user}
            updateUserStatus={updateUserStatus}
            loadingId={loadingId}
          />
        ) : (
          <b>{formatText(user.is_blocked)}</b>
        );

      case "email_verified":
        return user.email_verified ? (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
            Verified
          </span>
        ) : (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-600">
            Not Verified
          </span>
        );

      case "user_role":
        return (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              user.user_role === 1
                ? "bg-purple-100 text-purple-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {user.user_role === 1 ? "Admin" : "User"}
          </span>
        );

      case "created_at":
        return (
          <span className="text-gray-500 text-sm">
            {new Date(user.created_at).toLocaleDateString()}
          </span>
        );

      case "actions":
        return isAdmin ? (
          <div className="flex items-center gap-3">
            {/* Edit Icon */}
            <button
              title="Edit User"
              onClick={() => {
                setSelectedUser(user);
                setShowModal(true);
              }}
              className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
            >
              <FiEdit2 size={16} />
            </button>

            {/* Delete */}
            <button
              title="Delete"
              disabled={loadingId === user.user_id}
              className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition disabled:opacity-50"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                Swal.fire({
                  title: "Delete this user?",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonText: "Delete",
                }).then((result) => {
                  if (result.isConfirmed) {
                    deleteUser(user.user_id);
                  }
                });
              }}
            >
              <RiDeleteBin6Fill size={16} />
            </button>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  const [selectedUsers, setSelectedUsers] = useState([]);

  const toggleSelectOrder = (user) => {
    setSelectedUsers((prev) =>
      prev.includes(user.user_id)
        ? prev.filter((id) => id !== user.user_id)
        : [...prev, user.user_id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === Users?.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(Users?.map((u) => u.user_id));
    }
  };
  const [bulkUpdLoading, setBulkUpdLoading] = useState(false);
  const [bulkDelLoading, setBulkDelLoading] = useState(false);

  const handleBulkUpdate = async ({ userId, field, value }) => {
    setBulkUpdLoading(true);

    const selectedUserObjects = users?.filter((u) =>
      selectedUsers?.includes(u.user_id),
    );

    const protectedUsers = selectedUserObjects?.filter(
      (u) => u.user_role === 1 || u.user_id === state?.user?.user_id,
    );

    if (protectedUsers.length > 0) {
      alert("Some selected users cannot be modified (Super Admin / Yourself)");
      return;
    }

    // bulk API
    const previosOrders = Users;

    setUsers((prev) =>
      prev.map((o) =>
        selectedUsers?.includes(o.user_id) ? { ...o, [field]: value } : o,
      ),
    );

    try {
      // 🔥 CONFIRMATION (important)
      const confirm = window.confirm(
        `Are you sure you want to update ${field}?`,
      );

      if (!confirm) return;

      const res = await api.put(`/users/status`, {
        ids: selectedUsers,
        [field]: value,
      });
    } catch (error) {
      setUsers(previosOrders);
      console.log(error);
      // toast.error(error?.response?.data?.message);
    } finally {
      setBulkUpdLoading(false);
    }

    setSelectedUsers([]);
  };

  const handleBulkDelete = async () => {
    setBulkDelLoading(true);
    const selectedUserObjects = users?.filter((u) =>
      selectedUsers?.includes(u.user_id),
    );

    const protectedUsers = selectedUserObjects?.filter(
      (u) => u.user_role === 1 || u.user_id === state?.user?.user_id,
    );

    if (protectedUsers.length > 0) {
      alert("Some selected users cannot be Delete (Super Admin / Yourself)");
      return;
    }

    const previousOrders = Users;

    setUsers((prev) => prev.filter((o) => !selectedUsers.includes(o.user_id)));

    try {
      const confirm = window.confirm(`Are you sure you want to delete ?`);

      if (!confirm) return;

      await api.delete("/users/delete", {
        ids: [ids],
      });

      Swal.fire({
        icon: "success",
        title: "Deleted Successfully",
        toast: true,
        position: "bottom-left",
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: "Something went wrong",
        toast: true,
        position: "bottom-left",
        timer: 3000,
        showConfirmButton: false,
      });
      setUsers(previousOrders);
    } finally {
      setBulkDelLoading(false);
    }

    setSelectedUsers([]);
  };

  const navigate = useNavigate();

  return (
    <>
      <div className="bg-white rounded-xl shadow p-4">
        {loading ? (
          <div className="flex justify-center items-center h-48 sm:h-96">
            <div className="loading"></div>
          </div>
        ) : Users?.length == 0 ? (
          <div className="flex justify-center items-center min-h-[500px] h-[50vh]">
            <p className="text-lg font-medium">No Users Found</p>
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Users</h2>

              {selectedUsers.length > 0 && isAdmin && (
                <div className=" bg-white border shadow-lg px-4 py-1 rounded-xl flex gap-3 items-center z-50">
                  <span className="text-sm font-medium">
                    {selectedUsers.length} selected
                  </span>

                  <ActiveStatusDropdown
                    order={Users}
                    updateUserStatus={handleBulkUpdate}
                    loadingId={loadingId}
                    isDisabled={bulkUpdLoading}
                  />

                  <BlockStatusDropdown
                    user={users}
                    updateUserStatus={handleBulkUpdate}
                    loadingId={loadingId}
                    isDisabled={bulkUpdLoading}
                  />

                  {/* Delete */}
                  <button
                    disabled={bulkDelLoading}
                    onClick={() => {
                      Swal.fire({
                        title: "Do you want delete this Order?",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Delete",
                      }).then((result) => {
                        /* Read more about isConfirmed, isDenied below */
                        if (result.isConfirmed) {
                          handleBulkDelete();
                        }
                      });
                    }}
                    className={`text-red-500 cursor-pointer px-3 py-1 hover:text-red-600 hover:scale-105 hover:animate-spin
                   duration-200 transition-all  ${bulkDelLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    Delete
                  </button>
                </div>
              )}

              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setOpen(!open)}
                  className="px-4 py-2 bg-gray-100 rounded"
                >
                  Columns ⚙
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded p-3 z-30">
                    {columns.map((col, index) => (
                      <div
                        key={col.key}
                        draggable
                        onDragStart={() => onDragStart(index)}
                        onDragOver={onDragOver}
                        onDrop={() => onDrop(index)}
                        className="flex justify-between items-center py-1 px-2 hover:bg-gray-100"
                      >
                        <label className="flex gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={col.visible}
                            onChange={() => toggleColumn(col.key)}
                          />
                          {col.label}
                        </label>
                        <span>⋮⋮</span>
                      </div>
                    ))}

                    <button
                      onClick={resetColumns}
                      className="mt-2 text-red-600 text-sm"
                    >
                      Reset
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto max-h-[500px] custom-scrollbar">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100 text-sm sticky top-0 z-20">
                  <tr>
                    <th className="p-3 sticky left-0 z-10 ">
                      <input
                        type="checkbox"
                        checked={
                          selectedUsers.length === Users?.length &&
                          Users?.length > 0
                        }
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th className="p-3 text-left sticky left-0 z-30 bg-gray-100 top-0 ">
                      User
                    </th>

                    {columns
                      .filter((c) => c.visible)
                      .map((col, i) => (
                        <th
                          key={col.key}
                          className="p-3 text-left"
                          key={`indx-${i}`}
                        >
                          {col.label}
                        </th>
                      ))}
                  </tr>
                </thead>

                <tbody>
                  {Users?.map((order) => (
                    <tr
                      key={order.order_id}
                      className="border-b hover:bg-gray-50"
                      // onClick={() => {
                      //   navigate(`/orders/${order.order_id}`);
                      // }}
                    >
                      <td className="p-3 sticky left-0 z-10 bg-white">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(order.user_id)}
                          onChange={() => toggleSelectOrder(order)}
                        />
                      </td>

                      <td className="p-3 sticky left-0 z-10 bg-white">
                        {renderProductCell(order)}
                      </td>
                      {columns.map(
                        (col) =>
                          col.visible && (
                            <td
                              key={col.key}
                              className="p-3 hover:bg-gray-50 transition "
                            >
                              {renderCell(col.key, order)}
                            </td>
                          ),
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {showModal && selectedUser && (
        <Modal
          onClose={() => {
            setShowModal(false);
            setSelectedUser({});
          }}
          isOpen={showModal}
        >
          <UserUpdateForm
            onclose={() => {
              setShowModal(false);
              setSelectedUser({});
            }}
            userData={selectedUser}
            // OnSuccess={onSuccess}
            // OnError={OnError}
          />
        </Modal>
      )}
    </>
  );
};

export default UsersList;
