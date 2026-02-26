import axios from "axios";
import type  { BatteryResponse } from "../types/battery";

export const uploadFile = async (
  file: File
): Promise<BatteryResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post<BatteryResponse>(
    "http://localhost:8000/predict",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};