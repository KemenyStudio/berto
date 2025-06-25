'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, File, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';

interface FileUploadProps {
  onUploadComplete?: (files: { name: string; size: number; path: string }[]) => void;
  currentPath?: string;
  isRemoteMode?: boolean;
}

interface UploadedFile {
  name: string;
  size: number;
  path: string;
}

export default function FileUpload({ onUploadComplete, currentPath = '/home/user', isRemoteMode = false }: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Don't show the component if not in remote mode
  if (!isRemoteMode) {
    return null;
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFileUpload(Array.from(files));
    }
  };

  const handleFileUpload = async (files: File[]) => {
    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      formData.append('path', currentPath);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        const newFiles = result.files as UploadedFile[];
        setUploadedFiles(prev => [...prev, ...newFiles]);
        onUploadComplete?.(newFiles);
      } else {
        throw new Error(result.error || 'Upload failed');
      }

    } catch (error) {
      console.error('File upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const clearUploadedFiles = async () => {
    try {
      await fetch('/api/upload', {
        method: 'DELETE',
      });
      setUploadedFiles([]);
    } catch (error) {
      console.error('Error clearing files:', error);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="p-3 sm:p-4 border-dashed border-2 border-gray-300 dark:border-gray-600">
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
            📁 File Upload (Remote Mode)
          </h3>
          {uploadedFiles.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearUploadedFiles}
              className="text-xs h-6 px-2"
            >
              <X className="w-3 h-3 mr-1" />
              Clear
            </Button>
          )}
        </div>

        <div
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 sm:p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors cursor-pointer active:bg-gray-800"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-8 h-8 sm:w-8 sm:h-8 mx-auto mb-3 text-gray-400" />
          <p className="text-sm sm:text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-2">
            <span className="hidden sm:inline">Drag and drop files here, or </span>
            <span className="text-green-400 font-medium">Tap to select files</span>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Upload local files to access in terminal
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {isUploading && (
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            Uploading files...
          </div>
        )}

        {uploadError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{uploadError}</AlertDescription>
          </Alert>
        )}

        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Uploaded Files ({uploadedFiles.length})
            </h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 text-xs p-2 bg-gray-50 dark:bg-gray-800 rounded"
                >
                  <File className="w-3 h-3 text-gray-500" />
                  <span className="flex-1 truncate">{file.name}</span>
                  <span className="text-gray-500">{formatFileSize(file.size)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
          <p>• Files are uploaded to: {currentPath}</p>
          <p>• Use commands like: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">cat filename.txt</code></p>
          <p>• Or: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">ls</code> to see uploaded files</p>
        </div>
      </div>
    </Card>
  );
} 