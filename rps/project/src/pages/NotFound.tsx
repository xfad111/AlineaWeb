import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center items-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-7xl font-bold text-primary-600 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Halaman Tidak Ditemukan</h2>
        <p className="text-neutral-600 mb-8">
          Halaman yang Anda cari tidak ditemukan atau telah dipindahkan.
        </p>
        <button
          onClick={() => navigate('/')}
          className="btn btn-primary inline-flex items-center"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Kembali ke Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFound;