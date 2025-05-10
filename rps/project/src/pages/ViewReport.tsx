import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useReports } from '../contexts/ReportsContext';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { Edit, Trash2, ArrowLeft } from 'lucide-react';

const ViewReport: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getReportById, deleteReport } = useReports();
  const { currentUser } = useAuth();
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
  
  const handleDelete = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus laporan ini?')) {
      deleteReport(report.id);
      navigate('/reports');
    }
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-success-50 text-success-700';
      case 'rejected':
        return 'bg-error-50 text-error-700';
      case 'submitted':
        return 'bg-warning-50 text-warning-700';
      default:
        return 'bg-neutral-100 text-neutral-700';
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Disetujui';
      case 'rejected':
        return 'Ditolak';
      case 'submitted':
        return 'Diajukan';
      default:
        return 'Draft';
    }
  };
  
  const getReportTypeLabel = (type: string) => {
    return type === 'weekly' ? 'Laporan Mingguan' : 'Laporan Bulanan';
  };
  
  const getCategoryLabel = (category?: string) => {
    switch (category) {
      case 'straight':
        return 'Straight News';
      case 'breaking':
        return 'Breaking News';
      case 'opini':
        return 'Opini';
      default:
        return 'Lainnya';
    }
  };
  
  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link to="/reports" className="inline-flex items-center text-neutral-600 hover:text-neutral-900">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Kembali
          </Link>
          <h1 className="text-2xl font-bold text-neutral-900 mt-2">{report.title}</h1>
        </div>
        
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <Link
            to={`/reports/edit/${report.id}`}
            className="btn btn-secondary flex items-center"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Link>
          
          <button
            onClick={handleDelete}
            className="btn btn-danger flex items-center"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Hapus
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className={`badge ${getStatusBadgeClass(report.status)}`}>
              {getStatusLabel(report.status)}
            </span>
            
            <span className="badge badge-primary">
              {getReportTypeLabel(report.type)}
            </span>
            
            {report.category && report.category !== 'other' && (
              <span className="badge badge-primary">
                {getCategoryLabel(report.category)}
              </span>
            )}
          </div>
          
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap">{report.content}</div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-neutral-200">
            <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-neutral-500">
              <div>
                <p>Divisi: <span className="font-medium">{report.division}</span></p>
                <p>Dibuat oleh: <span className="font-medium">{report.authorName}</span></p>
              </div>
              
              <div className="mt-4 sm:mt-0 sm:text-right">
                <p>Dibuat pada: {format(new Date(report.createdAt), 'dd MMMM yyyy HH:mm')}</p>
                {report.createdAt !== report.updatedAt && (
                  <p>Diperbarui pada: {format(new Date(report.updatedAt), 'dd MMMM yyyy HH:mm')}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewReport;