import { useContext, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import api from "./api";
import { GlobalContext } from "../context/Context";
import useOutsideClick from "./outSideClick";
import OrderDetailsModal from "./OrderDetailModal";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { formatText } from "./types";
import { DeliveryStatusDropdown, PaymentStatusDropdown } from "./statusOptions";
import Modal from "./modal";
import { useNavigate } from "react-router-dom";
 import { FiEdit2 } from "react-icons/fi";

/* ==============================
   DEFAULT COLUMNS
================================ */
const DEFAULT_COLUMNS = [
  { key: "user_id", label: "User ID", visible: true },
  { key: "name", label: "Name", visible: true },
  { key: "phone", label: "Phone", visible: true },
  { key: "email_verified", label: "Email Verified", visible: true },
  { key: "user_role", label: "Role", visible: true },
  { key: "created_at", label: "Date", visible: true },
  { key: "actions", label: "Actions", visible: true },
];

const STORAGE_KEY = "user_table_columns";

/* ==============================
   MAIN COMPONENT
================================ */

const UsersList = ({
  users = [],
  updateUser = () => {},
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
  const [showDetails, setShowDetails] = useState(false);
  const [Orders, setOrders] = useState([]);

  useEffect(() => {
    if (selectedUser) {
      const select = users?.filter((p) => p?.user_id == selectedUser?.user_id);
      setSelectedUser(select[0]);
    }
  }, [users]);

  useEffect(() => {
    setOrders(users);
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


const getInitials = (name) => {
  if (!name) return "?";
  const words = name.split(" ");
  return words.length > 1
    ? words[0][0] + words[1][0]
    : words[0][0];
};

const renderCell = (key, user) => {
  switch (key) {
    case "user_id":
      return (
        <span className="font-semibold text-gray-700">
          #{user.user_id}
        </span>
      );

    case "name":
      return (
        <div className="flex items-center gap-3">
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
            <span className="font-medium text-gray-800">
              {user.name || "-"}
            </span>
            <span className="text-xs text-gray-500">
              {user.email || "-"}
            </span>
          </div>
        </div>
      );

    case "phone":
      return (
        <span className="text-gray-700 font-medium">
          {user.phone || "-"}
        </span>
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
              setShowDetails(true);
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

  const [selectedOrders, setSelectedOrders] = useState([]);

  const toggleSelectOrder = (id) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedOrders.length === Orders?.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(Orders?.map((o) => o.order_id));
    }
  };
  const [bulkUpdLoading, setBulkUpdLoading] = useState(false);
  const [bulkDelLoading, setBulkDelLoading] = useState(false);

  const handleBulkUpdate = async (id, field, value) => {
    if (selectedOrders.length === 1) {
      // single API
      await updateUser(selectedOrders[0], field, value);
    } else {
      setBulkUpdLoading(true);

      // bulk API
      const previosOrders = Orders;

      setOrders((prev) =>
        prev.map((o) =>
          selectedOrders.includes(o.order_id) ? { ...o, [field]: value } : o,
        ),
      );
      try {
        console.log("Selected Orders", selectedOrders);
        console.log("Selected Field and value", field, value);

        await api.put("/orders/bulk-status", {
          ids: selectedOrders,
          [field]: value,
        });
      } catch (error) {
        setOrders(previosOrders);
      } finally {
        setBulkUpdLoading(false);
      }

      // optimistic update
    }
    setSelectedOrders([]);
  };

  const handleBulkDelete = async () => {
    if (selectedOrders.length === 1) {
      await deleteUser(selectedOrders[0]);
    } else {
      setBulkDelLoading(true);

      const previousOrders = Orders;

      setOrders((prev) =>
        prev.filter((o) => !selectedOrders.includes(o.order_id)),
      );

      try {
        await api.delete("/orders/bulk-delete", {
          data: { ids: selectedOrders },
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
        setOrders(previousOrders);
      } finally {
        setBulkDelLoading(false);
      }
    }
    setSelectedOrders([]);
  };

  const navigate = useNavigate();

  return (
    <>
      <div className="bg-white rounded-xl shadow p-4">
        {loading ? (
          <div className="flex justify-center items-center h-48 sm:h-96">
            <div className="loading"></div>
          </div>
        ) : Orders?.length == 0 ? (
          <div className="flex justify-center items-center min-h-[500px] h-[50vh]">
            <p className="text-lg font-medium">No Orders Found</p>
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Orders</h2>

              {selectedOrders.length > 0 && isAdmin && (
                <div className=" bg-white border shadow-lg px-4 py-1 rounded-xl flex gap-3 items-center z-50">
                  <span className="text-sm font-medium">
                    {selectedOrders.length} selected
                  </span>

                  {/* Delivery Status */}
                  {/* <select
      onChange={(e) =>
        handleBulkUpdate("delivery_status", e.target.value)
      }
      className="border px-2 py-1 rounded text-sm"
    >
      <option value="">Delivery Status</option>
      {DELIVERY_STATUS.map((s) => (
        <option key={s} value={s}>
          {formatText(s)}
        </option>
      ))}
    </select> */}
                  <DeliveryStatusDropdown
                    order={Orders}
                    updateUser={handleBulkUpdate}
                    loadingId={loadingId}
                    isDisabled={bulkUpdLoading}
                  />

                  {/* Payment Status */}
                  {/* <select
      onChange={(e) =>
        handleBulkUpdate("payment_status", e.target.value)
      }
      className="border px-2 py-1 rounded text-sm"
    >
      <option value="">Payment Status</option>
      {PAYMENT_STATUS.map((s) => (
        <option key={s} value={s}>
          {formatText(s)}
        </option>
      ))}
    </select> */}
                  <PaymentStatusDropdown
                    order={Orders}
                    updateUser={handleBulkUpdate}
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
                    <th className="p-3">
                      <input
                        type="checkbox"
                        checked={
                          selectedOrders.length === Orders?.length &&
                          Orders?.length > 0
                        }
                        onChange={toggleSelectAll}
                      />
                    </th>
                    {columns
                      .filter((c) => c.visible)
                      .map((col) => (
                        <th key={col.key} className="p-3 text-left">
                          {col.label}
                        </th>
                      ))}
                  </tr>
                </thead>

                <tbody>
                  {Orders?.map((order) => (
                    <tr
                      key={order.order_id}
                      className="border-b hover:bg-gray-50"
                      // onClick={() => {
                      //   navigate(`/orders/${order.order_id}`);
                      // }}
                    >
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.order_id)}
                          onChange={() => toggleSelectOrder(order.order_id)}
                        />
                      </td>
                      {columns.map(
                        (col) =>
                          col.visible && (
                            <td key={col.key} className="p-3 hover:bg-gray-50 transition ">
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

      {showDetails && selectedUser && (
        <Modal
          onClose={() => {
            setSelectedUser(null);
            setShowDetails(false);
          }}
          isOpen={showDetails}
          className="!w-[95%] !md:w-[1000px] !max-h-[92vh] !max-w-[1000px] !bg-white  !flex !flex-col "
        >
          <OrderDetailsModal
            order={selectedUser}
            onClose={() => {
              setShowDetails(false);
              setSelectedUser({});
            }}
            isAdmin={isAdmin}
            // onStatusUpdate={updateUser}
            updateUser={updateUser}
            loadingId={loadingId}
          />
        </Modal>
      )}
    </>
  );
};

export default UsersList;
