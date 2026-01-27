/**
 * Data Upload Page - Admin Excel Upload Center
 * Allows admins to upload Excel files to populate backend data
 */
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  X,
  FolderOpen,
  RefreshCw,
  Download,
  Trash2,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { adminApi } from "@/api";

const DataUpload = () => {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState(null);
  const [recentUploads, setRecentUploads] = useState([
    { name: "gamification_data.xlsx", folder: "processed", date: "Jan 25, 2026", status: "success" },
    { name: "kpi target & weightage.csv", folder: "processed", date: "Jan 24, 2026", status: "success" },
  ]);
  const fileInputRef = useRef(null);

  const allowedTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
    "application/vnd.ms-excel", // xls
    "text/csv", // csv
  ];

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    // Validate file type
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/i)) {
      setUploadResult({
        success: false,
        message: "Invalid file type. Please upload an Excel file (.xlsx, .xls) or CSV file.",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadResult(null);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Call backend API
      const result = await adminApi.uploadDataFile(file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success) {
        setUploadResult({
          success: true,
          message: `File "${file.name}" uploaded successfully to ${result.folder || "processed"} folder!`,
          details: result,
        });

        // Add to recent uploads
        setRecentUploads((prev) => [
          {
            name: file.name,
            folder: result.folder || "processed",
            date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            status: "success",
          },
          ...prev.slice(0, 9),
        ]);
      } else {
        setUploadResult({
          success: false,
          message: result.error?.message || "Upload failed. Please try again.",
        });
      }
    } catch (error) {
      setUploadResult({
        success: false,
        message: error.message || "Upload failed. Please try again.",
      });
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const folderInfo = [
    {
      name: "processed",
      description: "Cleaned & formatted data ready for use",
      icon: FolderOpen,
      color: "text-success",
    },
    {
      name: "raw",
      description: "Original uploaded files for reference",
      icon: FolderOpen,
      color: "text-secondary",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-2xl lg:text-3xl font-bold text-foreground"
          style={{ fontFamily: "'Sora', sans-serif" }}
        >
          Data Upload Center
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Upload Excel or CSV files to update gamification data
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upload Zone */}
        <div className="lg:col-span-2 space-y-6">
          {/* Drop Zone */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "relative p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer",
              dragOver
                ? "border-primary bg-primary/10"
                : "border-border/50 hover:border-primary/50 bg-card/50"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="text-center">
              <motion.div
                animate={dragOver ? { scale: 1.1 } : { scale: 1 }}
                className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4"
              >
                <Upload className="w-8 h-8 text-primary" />
              </motion.div>

              <h3 className="text-lg font-semibold text-foreground mb-2">
                {dragOver ? "Drop your file here" : "Upload Data File"}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Drag & drop an Excel or CSV file, or click to browse
              </p>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <FileSpreadsheet className="w-4 h-4" />
                <span>Supported: .xlsx, .xls, .csv</span>
              </div>
            </div>

            {/* Upload Progress */}
            <AnimatePresence>
              {uploading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-card/90 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                >
                  <div className="text-center">
                    <RefreshCw className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-sm font-medium text-foreground mb-2">Uploading...</p>
                    <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{uploadProgress}%</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Upload Result */}
          <AnimatePresence>
            {uploadResult && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={cn(
                  "p-4 rounded-xl border flex items-start gap-3",
                  uploadResult.success
                    ? "bg-success/10 border-success/40"
                    : "bg-destructive/10 border-destructive/40"
                )}
              >
                {uploadResult.success ? (
                  <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className={cn("text-sm font-medium", uploadResult.success ? "text-success" : "text-destructive")}>
                    {uploadResult.success ? "Upload Successful" : "Upload Failed"}
                  </p>
                  <p className="text-sm text-muted-foreground">{uploadResult.message}</p>
                </div>
                <button
                  onClick={() => setUploadResult(null)}
                  className="p-1 rounded hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Recent Uploads */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl glass-card border border-border/50"
          >
            <div className="p-4 border-b border-border/50">
              <h3 className="font-semibold text-foreground">Recent Uploads</h3>
            </div>
            <div className="divide-y divide-border/50">
              {recentUploads.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <FileSpreadsheet className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No files uploaded yet</p>
                </div>
              ) : (
                recentUploads.map((upload, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <FileSpreadsheet className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{upload.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {upload.folder} • {upload.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "px-2 py-1 rounded text-xs font-medium",
                        upload.status === "success" ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                      )}>
                        {upload.status === "success" ? "Success" : "Failed"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Info Panel */}
        <div className="space-y-6">
          {/* Folder Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-xl glass-card border border-border/50 p-5"
          >
            <h3 className="font-semibold text-foreground mb-4">Data Folders</h3>
            <div className="space-y-3">
              {folderInfo.map((folder, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <folder.icon className={cn("w-5 h-5 mt-0.5", folder.color)} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{folder.name}/</p>
                    <p className="text-xs text-muted-foreground">{folder.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Supported Formats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl glass-card border border-border/50 p-5"
          >
            <h3 className="font-semibold text-foreground mb-4">Supported Formats</h3>
            <div className="space-y-3">
              {[
                { ext: ".xlsx", name: "Excel Workbook", desc: "Microsoft Excel 2007+" },
                { ext: ".xls", name: "Excel 97-2003", desc: "Legacy Excel format" },
                { ext: ".csv", name: "CSV File", desc: "Comma-separated values" },
              ].map((format, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="px-2 py-1 rounded bg-primary/20 text-primary text-xs font-mono font-bold">
                    {format.ext}
                  </span>
                  <div>
                    <p className="text-sm text-foreground">{format.name}</p>
                    <p className="text-xs text-muted-foreground">{format.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Tips */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/30 p-5"
          >
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-primary" />
              Quick Tips
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Ensure your Excel file follows the required format</li>
              <li>• Files are automatically processed and validated</li>
              <li>• Raw files are kept for backup purposes</li>
              <li>• Maximum file size: 10MB</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DataUpload;
