'use client';

import React from 'react';
import { Camera, Monitor, Smartphone } from 'lucide-react';
import { BASE_URL } from '@/config/environment';
import { useAdminTheme } from '@/context/AdminThemeContext';
import type { Car } from '@/types/cars';
import { HCard, HPhotoCard, HFileUpload } from './ui-primitives';

interface MediaTabProps {
  car: Car;
  onAddPhoto: (type: 'PREVIEW' | 'PC' | 'MOBILE', file: File) => void;
  onDeletePhoto: (photoId: number) => void;
  onEditPhotoAlt: (photoId: number, currentAlt: string) => void;
}

export function MediaTab({ car, onAddPhoto, onDeletePhoto, onEditPhotoAlt }: MediaTabProps) {
  const { H } = useAdminTheme();
  const pcPhotos = car.carPhoto.filter((p) => p.type === 'PC');
  const mobilePhotos = car.carPhoto.filter((p) => p.type === 'MOBILE');

  return (
    <div className="space-y-5">
      <HCard title="Превью фото" subtitle="1000 x 560" icon={Camera}>
        <div className="flex flex-wrap gap-4">
          {car.previewUrl && (
            <div
              style={{
                borderRadius: 16,
                overflow: 'hidden',
                border: `1px solid ${H.grayLight}`,
              }}
              className="w-full max-w-md"
            >
              <img
                src={`${BASE_URL}static/${car.previewUrl}`}
                alt="Preview"
                className="w-full aspect-[16/9] object-cover"
              />
            </div>
          )}
          <HFileUpload onUpload={(f) => onAddPhoto('PREVIEW', f)} label="Загрузить превью" />
        </div>
      </HCard>

      <HCard title="Фото для ПК" subtitle="Формат 16:9" icon={Monitor}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {pcPhotos.map((photo) => (
            <HPhotoCard
              key={photo.id}
              photo={photo}
              baseUrl={BASE_URL}
              onDelete={onDeletePhoto}
              onEdit={onEditPhotoAlt}
            />
          ))}
          <HFileUpload onUpload={(f) => onAddPhoto('PC', f)} label="Добавить" compact />
        </div>
      </HCard>

      <HCard title="Фото для мобильных" subtitle="Формат 1:1" icon={Smartphone}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {mobilePhotos.map((photo) => (
            <HPhotoCard
              key={photo.id}
              photo={photo}
              baseUrl={BASE_URL}
              onDelete={onDeletePhoto}
              onEdit={onEditPhotoAlt}
              square
            />
          ))}
          <HFileUpload onUpload={(f) => onAddPhoto('MOBILE', f)} label="Добавить" compact square />
        </div>
      </HCard>
    </div>
  );
}
