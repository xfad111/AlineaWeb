import React from 'react';
import { Link } from 'react-router-dom';
import { Report } from '../types';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface ReportCardProps {
  report: Report;
  onDelete: (id: string) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, onDelete }) => {
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
  
  const getReportTypeLabel = (type: string) => {
    return type === 'weekly' ? 'Mingguan' : 'Bulanan';
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
  
  const confirmDelete = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus laporan ini?')) {
      onDelete(report.id);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-neutral-900 truncate">{report.title}</h3>
          <span className={`badge ${getStatusBadgeClass(report.status)}`}>
            {getStatusLabel(report.status)}
          </span>
        </div>
        
        <div className="mt-2 text-sm text-neutral-500 flex flex-wrap gap-2">
          <span className="inline-flex items-center">
            <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded">
              {getReportTypeLabel(report.type)}
            </span>
          </span>
          
          {report.category && report.category !== 'other' && (
            <span className="inline-flex items-center">
              <span className="bg-neutral-100 text-neutral-800 text-xs px-2 py-1 rounded">
                {getCategoryLabel(report.category)}
              </span>
            </span>
          )}
        </div>
        
        <p className="mt-3 text-sm text-neutral-600 line-clamp-2">
          {report.content}
        </p>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="text-xs text-neutral-500">
            <span>Oleh: {report.authorName}</span>
            <span className="mx-2">•</span>
            <span>{format(new Date(report.createdAt), 'dd MMM yyyy')}</span>
          </div>
          
          <div className="flex space-x-2">
            <Link
              to={`/reports/view/${report.id}`}
              className="p-1 text-neutral-500 hover:text-primary-600"
              title="Lihat detail"
            >
              <Eye className="h-4 w-4" />
            </Link>
            <Link
              to={`/reports/edit/${report.id}`}
              className="p-1 text-neutral-500 hover:text-primary-600"
              title="Edit laporan"
            >
              <Edit className="h-4 w-4" />
            </Link>
            <button
              onClick={confirmDelete}
              className="p-1 text-neutral-500 hover:text-error-600"
              title="Hapus laporan"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;