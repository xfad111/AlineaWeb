import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useReports } from '../contexts/ReportsContext';
import { PlusCircle, CheckCircle, AlertCircle, FilePenLine, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { Report } from '../types';

const Dashboard: React.FC = () => {
  const { currentUser, isAdmin } = useAuth();
  const { reports } = useReports();
  
  const userReports = useMemo(() => {
    if (!currentUser) return [];
    
    if (isAdmin()) {
      return reports;
    }
    
    return reports.filter(report => report.division === currentUser.division);
  }, [currentUser, reports, isAdmin]);
  
  const statusCounts = useMemo(() => {
    return {
      draft: userReports.filter(r => r.status === 'draft').length,
      submitted: userReports.filter(r => r.status === 'submitted').length,
      approved: userReports.filter(r => r.status === 'approved').length,
      rejected: userReports.filter(r => r.status === 'rejected').length,
      total: userReports.length
    };
  }, [userReports]);
  
  const recentReports = useMemo(() => {
    return [...userReports]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [userReports]);
  
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
  
  const getDivisionName = (report: Report) => {
    return report.division;
  };
  
  if (!currentUser) return null;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
        <Link to="/reports/create" className="btn btn-primary mt-3 sm:mt-0 inline-flex items-center">
          <PlusCircle className="h-5 w-5 mr-2" />
          Buat Laporan Baru
        </Link>
      </div>
      
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-primary-500">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-primary-100">
              <FileText className="h-5 w-5 text-primary-700" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-neutral-500">Total Laporan</p>
              <p className="text-2xl font-semibold text-neutral-900">{statusCounts.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-warning-500">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-warning-50">
              <FilePenLine className="h-5 w-5 text-warning-700" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-neutral-500">Draft</p>
              <p className="text-2xl font-semibold text-neutral-900">{statusCounts.draft}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-success-500">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-success-50">
              <CheckCircle className="h-5 w-5 text-success-700" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-neutral-500">Disetujui</p>
              <p className="text-2xl font-semibold text-neutral-900">{statusCounts.approved}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-error-500">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-error-50">
              <AlertCircle className="h-5 w-5 text-error-700" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-neutral-500">Ditolak</p>
              <p className="text-2xl font-semibold text-neutral-900">{statusCounts.rejected}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Reports */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-neutral-200">
          <h3 className="text-lg font-medium leading-6 text-neutral-900">Laporan Terbaru</h3>
          <p className="mt-1 max-w-2xl text-sm text-neutral-500">
            {isAdmin() ? 'Laporan dari semua divisi' : `Laporan dari divisi ${currentUser.division}`}
          </p>
        </div>
        
        {recentReports.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Judul</th>
                  <th scope="col">Divisi</th>
                  <th scope="col">Tanggal</th>
                  <th scope="col">Status</th>
                  <th scope="col">Tipe</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {recentReports.map((report) => (
                  <tr key={report.id} className="hover:bg-neutral-50">
                    <td className="text-sm font-medium text-neutral-900">
                      {report.title}
                    </td>
                    <td className="text-sm text-neutral-500">
                      {getDivisionName(report)}
                    </td>
                    <td className="text-sm text-neutral-500">
                      {format(new Date(report.createdAt), 'dd MMM yyyy')}
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(report.status)}`}>
                        {getStatusLabel(report.status)}
                      </span>
                    </td>
                    <td className="text-sm text-neutral-500">
                      {report.type === 'weekly' ? 'Mingguan' : 'Bulanan'}
                    </td>
                    <td className="text-right text-sm">
                      <Link 
                        to={`/reports/view/${report.id}`}
                        className="text-primary-600 hover:text-primary-800"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-4 py-12 text-center">
            <p className="text-neutral-600">Belum ada laporan yang dibuat.</p>
            <Link to="/reports/create" className="btn btn-primary mt-4 inline-flex items-center">
              <PlusCircle className="h-5 w-5 mr-2" />
              Buat Laporan Sekarang
            </Link>
          </div>
        )}
        
        {recentReports.length > 0 && (
          <div className="px-4 py-3 bg-neutral-50 text-right">
            <Link 
              to="/reports" 
              className="text-sm font-medium text-primary-600 hover:text-primary-800"
            >
              Lihat Semua Laporan
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;