import { useState } from 'react';
import { FiGrid, FiImage, FiZoomIn, FiDownload } from 'react-icons/fi';

interface Photo {
  id: string;
  title: string;
  url: string;
  date: string;
}

const samplePhotos: Photo[] = [
  {
    id: '1',
    title: 'Montanhas ao Pôr do Sol',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    date: '2025-01-15',
  },
  {
    id: '2',
    title: 'Praia Tropical',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    date: '2025-01-14',
  },
  {
    id: '3',
    title: 'Floresta Nebulosa',
    url: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&q=80',
    date: '2025-01-13',
  },
  {
    id: '4',
    title: 'Cidade Noturna',
    url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&q=80',
    date: '2025-01-12',
  },
  {
    id: '5',
    title: 'Aurora Boreal',
    url: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=800&q=80',
    date: '2025-01-11',
  },
  {
    id: '6',
    title: 'Deserto ao Amanhecer',
    url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80',
    date: '2025-01-10',
  },
  {
    id: '7',
    title: 'Lago Sereno',
    url: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80',
    date: '2025-01-09',
  },
  {
    id: '8',
    title: 'Campo de Lavanda',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    date: '2025-01-08',
  },
];

export const PhotosApp = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'single'>('grid');

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[hsl(var(--window-titlebar))] border-b border-border">
        <h2 className="text-lg font-semibold">Fotos</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            }`}
            aria-label="Visualização em grade"
          >
            <FiGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('single')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'single' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            }`}
            aria-label="Visualização única"
          >
            <FiImage className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Photo Grid */}
      {viewMode === 'grid' && (
        <div className="flex-1 p-6 overflow-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {samplePhotos.map(photo => (
              <button
                key={photo.id}
                onClick={() => {
                  setSelectedPhoto(photo);
                  setViewMode('single');
                }}
                className="aspect-square rounded-lg overflow-hidden hover:ring-2 ring-primary transition-all hover:scale-105"
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Single Photo View */}
      {viewMode === 'single' && selectedPhoto && (
        <div className="flex-1 flex items-center justify-center p-6 overflow-auto">
          <div className="max-w-4xl w-full space-y-4">
            <div className="relative rounded-lg overflow-hidden">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="w-full h-auto"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{selectedPhoto.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedPhoto.date).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-muted rounded-lg" aria-label="Ampliar">
                  <FiZoomIn className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-muted rounded-lg" aria-label="Baixar">
                  <FiDownload className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};