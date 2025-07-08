'use client';

import React, { useState } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../lib/cropImage';
import { toast } from 'sonner';

const aspectRatios = [
  { label: '1:1', value: 1 },
  { label: '3:4', value: 3 / 4 },
  { label: '16:9', value: 16 / 9 },
];

const CropImageModal = ({ open, image, onClose, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleCropSave = async () => {
    try {
      const croppedBlob = await getCroppedImg(image, croppedAreaPixels);
      const previewUrl = URL.createObjectURL(croppedBlob);
      setPreview(previewUrl);

      onCropComplete(croppedBlob);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to crop image');
    }
  };

  const handleClose = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setPreview(null);
    onClose();
  };

  if (!open || !image) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[90vw] max-w-lg bg-white rounded-xl shadow-lg p-4 relative flex flex-col gap-4">
        <div className="flex gap-2 justify-center">
          {aspectRatios.map(r => (
            <button
              key={r.label}
              onClick={() => setAspect(r.value)}
              className={`px-3 py-1 rounded-full border text-sm ${
                aspect === r.value
                  ? 'bg-secondary text-primary'
                  : 'bg-white text-black'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="relative w-full h-[300px] bg-black/10">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
          />
        </div>

        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={e => setZoom(+e.target.value)}
          className="w-full"
        />

        <div className="flex justify-between">
          <button
            onClick={handleClose}
            className="bg-transparent text-secondary border-2 border-secondary px-4 py-2 rounded-full"
          >
            Cancel
          </button>
          <button
            onClick={handleCropSave}
            className="bg-secondary text-primary px-4 py-2 rounded-full"
          >
            Save
          </button>
        </div>

        {preview && (
          <div className="absolute top-4 right-4 border rounded-full w-16 h-16 overflow-hidden">
            <img
              src={preview}
              alt="preview"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CropImageModal;
