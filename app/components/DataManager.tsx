"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  X,
  FileJson,
  Database,
  HardDrive,
} from "lucide-react";
import {
  exportResumeData,
  importResumeData,
  validateImportData,
  clearAllResumeData,
  getStorageInfo,
  ExportedResumeData,
} from "../lib/storage";

interface DataManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const DataManager: React.FC<DataManagerProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"export" | "import" | "danger">("export");
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const storageInfo = getStorageInfo();

  const handleExport = () => {
    const data = exportResumeData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `resume-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportError(null);
    setImportSuccess(false);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        if (!validateImportData(data)) {
          setImportError("Invalid file format. Please select a valid resume backup file.");
          return;
        }

        const success = importResumeData(data as ExportedResumeData);
        if (success) {
          setImportSuccess(true);
          setTimeout(() => {
            onClose();
            window.location.reload();
          }, 1500);
        } else {
          setImportError("Failed to import data. Please try again.");
        }
      } catch (error) {
        setImportError("Invalid JSON file. Please check the file and try again.");
      }
    };
    reader.readAsText(file);
  };

  const handleClearAll = () => {
    clearAllResumeData();
    setShowClearConfirm(false);
    onClose();
    window.location.reload();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Database className="w-6 h-6 text-teal-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Manage Your Data
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100 dark:border-gray-700">
            {[
              { id: "export", label: "Export", icon: Download },
              { id: "import", label: "Import", icon: Upload },
              { id: "danger", label: "Danger", icon: AlertTriangle },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as typeof activeTab);
                  setImportError(null);
                  setImportSuccess(false);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-500 bg-teal-50/50 dark:bg-teal-500/10"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Export Tab */}
            {activeTab === "export" && (
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <HardDrive className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Storage Usage
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {storageInfo.formatted}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {storageInfo.percentage}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-500 rounded-full transition-all"
                        style={{ width: `${Math.min(storageInfo.percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-500/10 rounded-xl p-4">
                  <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-1">
                    Backup Your Resume
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-400 mb-4">
                    Export your resume data as a JSON file. You can import it later or on a different device.
                  </p>
                  <button
                    onClick={handleExport}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    Download Backup (.json)
                  </button>
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <p>Your data is stored locally in your browser.</p>
                  <p>Clearing browser data will remove your resume.</p>
                </div>
              </div>
            )}

            {/* Import Tab */}
            {activeTab === "import" && (
              <div className="space-y-4">
                {importSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      Import Successful!
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Reloading page...
                    </p>
                  </motion.div>
                ) : (
                  <>
                    <div className="bg-amber-50 dark:bg-amber-500/10 rounded-xl p-4">
                      <h4 className="font-medium text-amber-900 dark:text-amber-300 mb-1 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Import Warning
                      </h4>
                      <p className="text-sm text-amber-700 dark:text-amber-400">
                        Importing will overwrite your current resume data. Make sure to export a backup first if needed.
                      </p>
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept=".json"
                      className="hidden"
                    />

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-teal-400 dark:hover:border-teal-500 rounded-xl text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                    >
                      <FileJson className="w-5 h-5" />
                      Select Backup File
                    </button>

                    {importError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg"
                      >
                        <p className="text-sm text-red-600 dark:text-red-400">{importError}</p>
                      </motion.div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Danger Tab */}
            {activeTab === "danger" && (
              <div className="space-y-4">
                {!showClearConfirm ? (
                  <>
                    <div className="bg-red-50 dark:bg-red-500/10 rounded-xl p-4">
                      <h4 className="font-medium text-red-900 dark:text-red-300 mb-1 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Delete All Data
                      </h4>
                      <p className="text-sm text-red-700 dark:text-red-400 mb-4">
                        This will permanently delete all your resume data. This action cannot be undone.
                      </p>
                      <button
                        onClick={() => setShowClearConfirm(true)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                        Delete All Data
                      </button>
                    </div>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-50 dark:bg-red-500/10 rounded-xl p-4"
                  >
                    <h4 className="font-medium text-red-900 dark:text-red-300 mb-3">
                      Are you absolutely sure?
                    </h4>
                    <p className="text-sm text-red-700 dark:text-red-400 mb-4">
                      This will permanently delete all your resume data. Make sure you have a backup if needed.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowClearConfirm(false)}
                        className="flex-1 px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleClearAll}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Yes, Delete All
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DataManager;
