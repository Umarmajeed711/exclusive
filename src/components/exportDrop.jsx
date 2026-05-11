import { useState, useRef, useEffect } from "react";

import {
  Download,
  ChevronDown,
  FileSpreadsheet,
  Filter,
  Database,
} from "lucide-react";

import { showToast } from "./types";
import api from "./api";

const iconMap = {
  FileSpreadsheet,
  Filter,
  Database,
  Download,
  ChevronDown,
};

export default function ExportDropdown({
  exportOptions,
  paginatedUsers,
  exportColumns,
  exportToCSV,
  filters = {},
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(null);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  //   const downloadFromAPI = async (url, type) => {
  //     try {
  //       setLoading(type);

  //       window.open(url, "_blank");

  //       showToast({
  //         icon: "success",
  //         title: "Export started successfully",
  //       });

  //     } catch (err) {
  //       showToast({
  //         icon: "error",
  //         title: "Export failed",
  //       });
  //     } finally {
  //       setLoading(null);
  //       setOpen(false);
  //     }
  //   };

  const downloadFromAPI = async (url, fileName, type) => {
    try {
      setLoading(type);

      const response = await api.get(url, {
        responseType: "blob",
      });

      // =========================
      // Create Download URL
      // =========================

      const blob = new Blob([response.data], {
        type: "text/csv",
      });

      const downloadURL = window.URL.createObjectURL(blob);

      // =========================
      // Create Link
      // =========================

      const link = document.createElement("a");

      link.href = downloadURL;

      link.download = `${fileName}.csv`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      // =========================
      // Cleanup
      // =========================

      window.URL.revokeObjectURL(downloadURL);

      showToast({
        icon: "success",
        title: "Export completed successfully",
      });
    } catch (err) {
      console.log(err);

      showToast({
        icon: "error",
        title: "Export failed",
      });
    } finally {
      setLoading(null);

      setOpen(false);
    }
  };

  const handleExport = (type) => {
    setOpen(false);

    switch (type) {
      case "current-page":
        exportToCSV({
          fileName: "current-page-users",
          columns: exportColumns,
          data: paginatedUsers,
        });

        showToast({
          icon: "success",
          title: `${paginatedUsers.length} users exported`,
        });

        break;

      case "current-page-orders":
        exportToCSV({
          fileName: "current-page-orders",
          columns: exportColumns,
          data: paginatedUsers,
        });

        showToast({
          icon: "success",
          title: `${paginatedUsers.length} users exported`,
        });

        break;

      case "filtered-users":
        downloadFromAPI(
          `/users/export?filters=${encodeURIComponent(
            JSON.stringify(filters),
          )}`,

          "filtered-users",

          "filtered",
        );

        break;

      case "filtered-orders":
        downloadFromAPI(
          `/orders-export?filters=${encodeURIComponent(
            JSON.stringify(filters),
          )}`,
          "filtered-orders",
          "filtered",
        );

        break;

      case "all-users":
        downloadFromAPI(`/users/export`, "all-users", "all");
        break;
      case "all-orders":
        downloadFromAPI(`/orders-export`, "all-orders", "all");

        break;
    }
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="
          flex items-center gap-2
          rounded-xl
          bg-emerald-600
          px-4 py-2.5
          text-sm font-medium text-white
          shadow-lg shadow-emerald-500/20
          transition-all
          hover:scale-[1.02]
          hover:bg-emerald-700
        "
      >
        <Download size={18} />
        Export
        <ChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`
          absolute right-0 top-14 z-50
          w-52 rounded-2xl
          border border-zinc-200
          bg-white shadow-2xl
          transition-all duration-200

          ${
            open
              ? "opacity-100 visible translate-y-0"
              : "opacity-0 invisible -translate-y-2"
          }
        `}
      >
        {/* HEADER */}
        <div className="border-b px-4 py-3">
          <h3 className="text-sm font-semibold">Export Users</h3>
          <p className="text-xs text-zinc-500">Choose export type</p>
        </div>

        {/* ITEMS */}
        {/* <div className="p-2"> */}
        {/* CURRENT PAGE */}
        {/* <button
            onClick={() => handleExport("current-page")}
            className="w-full flex gap-3 p-2 items-center rounded-xl hover:bg-zinc-100"
          >
            <FileSpreadsheet size={18} />
            <div className="flex flex-col items-start">
              <p className="text-sm font-medium">Current Page</p>
              <p className="text-xs text-zinc-500">Visible users only</p>
            </div>
          </button> */}

        {/* FILTERED */}
        {/* <button
            onClick={() => handleExport("filtered-users")}
            className="w-full flex gap-3 p-2 items-center rounded-xl hover:bg-zinc-100"
          >
            <Filter size={18} />
            <div className="flex flex-col items-start">
              <p className="text-sm font-medium">Filtered Users</p>
              <p className="text-xs text-zinc-500">Based on applied filters</p>
            </div>
          </button> */}

        {/* ALL USERS */}
        {/* <button
            onClick={() => handleExport("all-users")}
            className="w-full flex gap-3 p-2 items-center rounded-xl hover:bg-zinc-100"
          >
            <Database size={18} />
            <div className="flex flex-col items-start">
              <p className="text-sm font-medium">All Users</p>
              <p className="text-xs text-zinc-500">Complete database export</p>
            </div>
          </button> */}
        {/* </div> */}

        <div className="p-2">
          {exportOptions?.map((exp, i) => {
            const Icon = iconMap[exp?.icon ?? ""];
            return (
              <button
                key={i}
                onClick={() => handleExport(exp?.type || "")}
                className="w-full flex gap-3 p-2 items-center rounded-xl hover:bg-zinc-100"
              >
                <Icon size={18} />

                <div className="flex flex-col items-start">
                  <p className="text-sm font-medium">{exp?.label || ""}</p>
                  <p className="text-xs text-zinc-500">
                    {exp?.description || ""}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
