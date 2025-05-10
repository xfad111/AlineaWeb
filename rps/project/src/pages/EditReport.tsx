import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReportForm from '../components/ReportForm';
import { useReports } from '../contexts/ReportsContext';

const EditReport: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getReportById, updateReport } = useReports();
  const navigate = useNavigate();
  
  const report = getReportById(id || '');
  
  if (!report) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-neutral-900 mb-4">Laporan Tidak Ditemukan</h1>
        <p className="text-neutral-600 mb-6">
          Laporan yang Anda cari tidak ditemukan atau telah dihapus.
        </p>
        <button
          onClick={() => navigate('/reports')}
          className="btn btn-primary"
        >
          Kembali ke Daftar Laporan
        </button>
      </div>
    );
  }
  
  const handleSubmit = (data: any) => {
    updateReport(report.id, data);
    navigate(`/reports/view/${report.id}`);
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Edit Laporan</h1>
        <p className="text-neutral-600 mt-1">
          Silakan edit laporan sesuai kebutuhan Anda.
        </p>
      </div>
      
      <ReportForm 
        initialData={report} 
        onSubmit={handleSubmit}
        isEditing
      />
    </div>
  );
};

export default EditReport;