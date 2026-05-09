import { Children } from "react";
import Swal from "sweetalert2";

export const FILTER_OPERATORS = {
  IS: "is",
  CONTAINS: "contains",
  BETWEEN: "between",
  GTE: "gte",
  LTE: "lte",
  IN: "in",
};

export const INPUT_TYPES = {
  TEXT: "text",
  EMAIL:"email",
  NUMBER: "number",
  SELECT: "select",
  DATE: "date",
  DATE_RANGE: "dateRange",
};

const normalizeValue = (value) => {
  if (Array.isArray(value)) {
    return value.map((v) => normalizeValue(v));
  }

  if (value === "true") return true;
  if (value === "false") return false;

  return value;
};



export const buildFilterQuery = (filters = []) => {
  const query = {};

  filters?.forEach(({ key, operator, value }) => {
    if (!key || value === "" || value == null) return;

    if (!query[key]) {
      query[key] = {};
    }

    query[key][operator] = normalizeValue(value);
  });

  return query;
};

export const formatText = (text) => {
  if (!text) return "";

  return text
    .replace(/_/g, " ")        // underscores → space
    .toLowerCase()            // normalize
    .replace(/\b\w/g, (c) => c.toUpperCase()); // capitalize each word
};


export const getInitials = (name) => {
  if (!name) return "?";
  const words = name.split(" ");
  return words.length > 1
    ? words[0][0] + words[1][0]
    : words[0][0];
};


export const showToast = ({
  icon = "success",
  title = "",
}) => {
  Swal.fire({
    toast: true,
    position: "bottom-end",
    icon,
    title,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });
};

export const Loader = ({className}) => 

  {
    return (
      <div className={`flex justify-center items-center main ${className || ""}`}>
              <div className="loading"></div>
            </div>
    )

  }

export const TableCard = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-white p-5 rounded-2xl shadow-sm border ${className}`}
    >
      {children}
    </div>
  );
};

export const formatStatus = (status = "") => {
  return status
    ?.replace(/[_-]/g, " ") // replace _ and - with space
    ?.replace(/\s+/g, " ") // remove extra spaces
    ?.trim()
    ?.toUpperCase(); // convert uppercase
};