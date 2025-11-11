export function downloadBlob(blob, filename, mimeType = "text/csv") {
  const url = window.URL.createObjectURL(
    blob instanceof Blob ? blob : new Blob([blob], { type: mimeType })
  );
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
