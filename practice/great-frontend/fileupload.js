import React, { useState } from "react";

const CHUNK_SIZE = 1024 * 1024 * 5; // 5 MB

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFileInChunks = async () => {
    if (!file) return;

    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    setStatus(`Uploading ${totalChunks} chunks...`);

    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const start = chunkIndex * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);

      const chunk = file.slice(start, end);

      const formData = new FormData();
      formData.append("chunk", chunk);
      formData.append("fileName", file.name);
      formData.append("chunkIndex", chunkIndex);
      formData.append("totalChunks", totalChunks);

      await fetch("/upload-chunk", {
        method: "POST",
        body: formData,
      });

      setStatus(`Uploaded chunk ${chunkIndex + 1} of ${totalChunks}`);
    }

    await fetch("/upload-complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,
        totalChunks,
      }),
    });

    setStatus("Upload complete");
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadFileInChunks} disabled={!file}>
        Upload
      </button>
      <p>{status}</p>
    </div>
  );
}
