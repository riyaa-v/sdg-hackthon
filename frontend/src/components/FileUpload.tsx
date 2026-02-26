import React, { useState } from "react";
import { uploadFile } from "../api/api";
import type { BatteryResponse } from "../types/battery";

interface Props {
  onResult?: (data: BatteryResponse) => void;
}

const FileUpload: React.FC<Props> = ({ onResult }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    try {
      setLoading(true);
      setError(null);

      const result = await uploadFile(file);

      if (onResult) {
        onResult(result);
      }

    } catch (err) {
      setError("Upload failed. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
      />

      {loading && <p>Processing battery data...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default FileUpload;