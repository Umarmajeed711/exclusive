export const exportToCSV = ({
  data = [],
  fileName = "export",
  columns = [],
}) => {
  if (!data.length) {
    alert("No data available to export");
    return;
  }

  // =========================
  // Headers
  // =========================

  const headers = columns.map(
    (col) => col.label
  );

  // =========================
  // Rows
  // =========================

  const rows = data.map((item) =>
    columns.map((col) => {
      let value = item[col.key];

      // Null / Undefined
      if (
        value === null ||
        value === undefined
      ) {
        value = "";
      }

      // Boolean
      if (typeof value === "boolean") {
        value = value
          ? "Yes"
          : "No";
      }

      // Escape Quotes
      value = String(value).replace(
        /"/g,
        '""'
      );

      // Wrap in Quotes
      return `"${value}"`;
    })
  );

  // =========================
  // CSV Content
  // =========================

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  // =========================
  // Blob
  // =========================

  const blob = new Blob(
    [csvContent],
    {
      type: "text/csv;charset=utf-8;",
    }
  );

  // =========================
  // Download Link
  // =========================

  const url =
    window.URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.setAttribute(
    "download",
    `${fileName}.csv`
  );

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
};