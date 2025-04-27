import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';

const ItemTypes = {
  IMAGE: 'image'
};

const ImagePreview = ({ file, index, moveImage, removeImage }) => {
  const [, ref] = useDrag({
    type: ItemTypes.IMAGE,
    item: { index }
  });

  const [, drop] = useDrop({
    accept: ItemTypes.IMAGE,
    hover: (item) => {
      if (item.index !== index) {
        moveImage(item.index, index);
        item.index = index;
      }
    }
  });

  const previewUrl = URL.createObjectURL(file);

  return (
    <div ref={(node) => ref(drop(node))} className="relative inline-block w-20 h-20 sm:w-24 sm:h-24 mr-2 sm:mr-4 image-preview flex-shrink-0">
      <img
        src={previewUrl}
        alt={file.name}
        className="w-full h-full object-cover rounded-lg shadow-neon-red"
      />
      <button
        onClick={() => removeImage(index)}
        className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center hover:bg-red-700 cursor-pointer text-xs sm:text-sm"
      >
        ×
      </button>
      <span className="absolute bottom-0 left-0 bg-gray-800 text-red-300 text-xs px-1 rounded">
        Page {index + 1}
      </span>
    </div>
  );
};

const PulsePDF = () => {
  const [files, setFiles] = useState([]);
  const [filename, setFilename] = useState('output');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'image/bmp': ['.bmp'],
      'image/webp': ['.webp']
    },
    onDrop: (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        setError('Invalid file type detected. Only JPEG, PNG, GIF, BMP, and WebP files are allowed.');
        setFiles([]);
      } else {
        setError('');
        setFiles([...files, ...acceptedFiles]);
      }
    }
  });

  const moveImage = useCallback((dragIndex, hoverIndex) => {
    const newFiles = [...files];
    const [draggedFile] = newFiles.splice(dragIndex, 1);
    newFiles.splice(hoverIndex, 0, draggedFile);
    setFiles(newFiles);
  }, [files]);

  const removeImage = useCallback((index) => {
    setFiles(files.filter((_, i) => i !== index));
  }, [files]);

  const clearAll = () => {
    setFiles([]);
    setFilename('output');
    setError('');
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    setLoading(true);
    setError('');

    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    formData.append('filename', filename);

    try {
      const response = await axios.post('https://imagetopdf-back.onrender.com/api/pdf/convert', formData, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${filename}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to generate PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="max-w-3xl mx-auto p-4 sm:p-6 md:p-8 bg-gray-900 rounded-2xl shadow-neon-red my-8 sm:my-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-6 sm:mb-8 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700 animate-flicker">
          PulsePDF
        </h1>

        <div className="mb-4 sm:mb-6">
          <label className="block text-red-300 mb-2 font-semibold text-sm sm:text-base">Output PDF Name:</label>
          <input
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value || 'output')}
            className="w-full p-2 sm:p-3 bg-gray-800 border border-red-500 rounded-lg text-white focus:outline-none focus:border-red-400 shadow-neon-red animate-flicker text-sm sm:text-base"
            placeholder="Enter PDF name (without .pdf)"
          />
        </div>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed p-6 sm:p-8 rounded-xl text-center transition-all duration-300 ${
            isDragActive
              ? 'border-red-400 bg-red-900/20 shadow-neon-red-intense'
              : 'border-red-500 hover:bg-red-900/20 hover:shadow-neon-red-intense'
          } cursor-pointer`}
        >
          <input {...getInputProps()} />
          <p className="text-base sm:text-lg text-red-300">
            {isDragActive
              ? 'Drop those images here!'
              : 'Drag & drop images or click to select'}
          </p>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-900/20 text-red-300 rounded-lg shadow-neon-red animate-flicker text-sm sm:text-base">
            {error}
          </div>
        )}

        {files.length > 0 && (
          <div className="mt-4 sm:mt-6">
            <h2 className="text-lg sm:text-xl font-semibold text-red-400 mb-2">PDF Page Order:</h2>
            <div className="flex overflow-x-auto space-x-2 sm:space-x-4 pb-4 image-preview-container">
              {files.map((file, index) => (
                <ImagePreview
                  key={index}
                  file={file}
                  index={index}
                  moveImage={moveImage}
                  removeImage={removeImage}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={handleConvert}
            disabled={files.length === 0 || loading}
            className={`flex-1 py-2 sm:py-3 px-4 rounded-xl text-white font-bold transition-all duration-300 cursor-pointer text-sm sm:text-base ${
              files.length === 0 || loading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 shadow-neon-button hover:shadow-neon-button-hover animate-flicker'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-4 sm:h-5 w-4 sm:w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Converting...
              </span>
            ) : (
              'Convert to PDF'
            )}
          </button>
          <button
            onClick={clearAll}
            disabled={files.length === 0 && filename === 'output'}
            className={`flex-1 py-2 sm:py-3 px-4 rounded-xl text-white font-bold transition-all duration-300 cursor-pointer text-sm sm:text-base ${
              files.length === 0 && filename === 'output'
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-700 to-red-900 hover:from-red-800 hover:to-red-950 shadow-neon-button hover:shadow-neon-button-hover animate-flicker'
            }`}
          >
            Clear All
          </button>
        </div>
      </div>
    </DndProvider>
  );
};

export default PulsePDF;