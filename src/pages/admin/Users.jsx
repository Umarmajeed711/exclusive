import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../context/Context";
import ProductListView from "../../components/ProductList";
import Pagination from "../../components/Pagination";
import OrderList from "../../components/OrderList";
import { FILTER_OPERATORS, INPUT_TYPES } from "../../components/types";
import api from "../../components/api";
import SmartFilter from "../../components/SmartFilters";
import { ActiveFilters } from "../../components/ActiveFilters";
import { MdOutlineFilterAlt } from "react-icons/md";
import Swal from "sweetalert2";
import UsersList from "../../components/UsersList";

const Users = () => {
  const { state } = useContext(GlobalContext);

  let isAdmin = state?.isAdmin;

  const [loading, setloading] = useState(false);

  const [showFilter, setShowFilter] = useState(false);

  const [Users, setUsers] = useState([]);

  const [UsersByPage, setUsersByPage] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [limit, setLimit] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);

  const getUsers = async ({ filters = {}, page = 1, limit = 12 } = {}) => {
    setloading(true);

    try {
      const result = await api.get("/users", {
        params: {
          page,
          limit,
          filters: JSON.stringify(filters),
        },
      });

      setUsers(result?.data?.data);
      setCurrentPage(result?.data?.currentPage);
      setTotalPages(result?.data?.totalPages);
      setTotalUsers(result?.data?.totalUsers);
      setUsersByPage((prev) => ({
        ...prev,
        [page]: result?.data?.data,
      }));

      console.log("total Users", result?.data?.totalUsers);
      console.log("total Users", result?.data);
    } catch (error) {
      console.error(error);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const orderFilters = [
    {
      key: "user_id",
      label: "User ID",
      operators: [FILTER_OPERATORS.IS],
      inputType: INPUT_TYPES.TEXT,
    },

    {
      key: "name",
      label: "Name",
      operators: [FILTER_OPERATORS.CONTAINS, FILTER_OPERATORS.IS],
      inputType: INPUT_TYPES.TEXT,
    },
    {
      key: "email",
      label: "Email",
      operators: [FILTER_OPERATORS.IS],
      inputType: INPUT_TYPES.EMAIL,
    },
    {
      key: "phone",
      label: "Phone",
      operators: [FILTER_OPERATORS.CONTAINS, FILTER_OPERATORS.IS],
      inputType: INPUT_TYPES.NUMBER,
    },
    {
      key: "user_role",
      label: "User Role",
      operators: [FILTER_OPERATORS.IS],
      inputType: INPUT_TYPES.SELECT,
      options: [
        { label: "Super Admin", value: 1 },
        { label: "Admin", value: 2 },
        { label: "Manager", value: 3 },
        { label: "User", value: 4 },
      ],
    },
    {
      key: "is_active",
      label: "Active",
      operators: [FILTER_OPERATORS.IS],
      inputType: INPUT_TYPES.SELECT,
      options: [
        { label: "Active", value: true },
        { label: "Disabled", value: false },
      ],
    },
    {
      key: "is_blocked",
      label: "Blocked",
      operators: [FILTER_OPERATORS.IS],
      inputType: INPUT_TYPES.SELECT,
      options: [
        { label: "Not Blocked", value: false },
        { label: "Blocked Users", value: true },
      ],
    },
    {
      key: "email_verified",
      label: "Verified",
      operators: [FILTER_OPERATORS.IS],
      inputType: INPUT_TYPES.SELECT,
      options: [
        { label: "Verified", value: true },
        { label: "Not Verified", value: false },
      ],
    },
  ];

  const [filters, setFilters] = useState([]);
  const [filterquery, setFilterQuery] = useState([]);

  const handleFilterApply = (query, activeFilters) => {
    setFilters(activeFilters);
    setUsersByPage({});
    setCurrentPage(1);
    setFilterQuery(query);
    console.log("Filters", filters);
    console.log("query", query);
    getUsers({ filters: query, page: 1, limit });
  };

  const removeFilter = (index) => {
    const updated = filters?.filter((_, i) => i !== index);
    setFilters(updated);
    // getUsers(updated);
    getUsers({ filters: updated, page: 1, limit });
  };

  const clearAllFilters = () => {
    setFilters([]);
    // getUsers([]);
    getUsers({ filters: [], page: 1, limit });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (UsersByPage[page]) {
      setCurrentPage(page);
      setUsers(UsersByPage[page] || []);
      return;
    }

    getUsers({
      filters: filterquery,
      page,
      limit,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUserUpdate = (user) => {
    setUsers((prev) => {
      const exists = prev?.some((p) => p?.user_id == user?.user_id);

      if (exists) {
        // UPDATE
        return prev?.map((p) => (p.user_id === user.user_id ? user : p));
      }

      // ADD
      return [user, ...prev];
    });
  };

  return (
    <div className="mx-5  md:mx-8 lg:mx-14 py-4">
      <div>
        <div className="flex flex-col  gap-5 my-5 sm:my-10">
          <div className="flex flex-row justify-between h-full md:items-center">
            <div className="flex gap-5 items-center">
              <p className="h-10 w-5 rounded bg-theme-primary"></p>
              <p className="text-theme-primary text-xl font-medium">
                Explore All Users
              </p>
            </div>

            <div className="flex justify-center cursor-pointer">
              <button
                className={`button !p-[5px]  text-xl ${filters?.length > 0 ? "active" : ""}`}
                onClick={() => {
                  setShowFilter(!showFilter);
                }}
              >
                <MdOutlineFilterAlt />
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center h-full">
            <div className="flex items-center gap-2">
              {totalUsers > 100 ? (
                <select
                  defaultValue={limit == totalUsers ? "All Users" : limit || ""}
                  onChange={(e) => {
                    const newLimit =
                      e.target.value == "all"
                        ? Number(totalUsers)
                        : Number(e.target.value);
                    setLimit(newLimit);
                    setCurrentPage(1);

                    getUsers({
                      filters: filterquery,
                      page: 1,
                      limit: newLimit,
                    });
                  }}
                  disabled={loading}
                  className="disabled:opacity-50 disabled:cursor-not-allowed rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm
               focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30
               hover:border-gray-400 transition"
                >
                  <option value="" disabled selected>
                    - limit Users -
                  </option>
                  <option value={100}>100 Users</option>
                  <option value={200}>200 Users</option>
                  <option value={500}>500 Users</option>
                  <option value="all">All Users</option>
                </select>
              ) : null}
            </div>

            <ActiveFilters
              filters={filters}
              onRemove={removeFilter}
              onClear={clearAllFilters}
              showFilterModal={() => {
                setShowFilter(true);
              }}
            />
          </div>
        </div>
      </div>

      <UsersList
        users={Users}
        loading={loading}
        // loadingId={loadingId}
        // updateUserStatus={updateUserStatus}
        updateUser={handleUserUpdate}
        // deleteUser={deleteUser}
        isAdmin={isAdmin}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalUsers / (limit || 12))}
        totalProducts={totalUsers}
        pageSize={limit || 12}
        isLoading={loading}
        onPageChange={handlePageChange}
      />

      {showFilter && (
        <SmartFilter
          showFilterModal={showFilter}
          filters={orderFilters}
          onChange={handleFilterApply}
          value={filters}
          onClose={() => {
            setShowFilter(false);
          }}
        />
      )}
    </div>
  );
};

export default Users;
