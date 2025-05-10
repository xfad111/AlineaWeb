import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useReports } from '../contexts/ReportsContext';
import ReportCard from '../components/ReportCard';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, Filter } from 'lucide-react';
import { Report } from '../types';

const ReportList: React.FC = () => {
  const { currentUser, isAdmin } = useAuth();
  const { reports, deleteReport } = useReports();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  const filteredReports = useMemo(() => {
    if (!currentUser) return [];
    
    let filtered = isAdmin() 
      ? reports 
      : reports.filter(report => report.division === currentUser.division);
    
    // Apply search
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        report => 
          report.title.toLowerCase().includes(searchLower) || 
          report.content.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(report => report.status === statusFilter);
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(report => report.type === typeFilter);
    }
    
    // Sort by newest first
    return [...filtered].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [currentUser, reports, isAdmin, searchTerm, statusFilter, typeFilter]);
  
  const handleDelete = (id: string) => {
    deleteReport(id);
  };
  
  if (!currentUser) return null;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Daftar Laporan</h1>
        <Link to="/reports/create" className="btn btn-primary mt-3 sm:mt-0 inline-flex items-center">
          <PlusCircle className="h-5 w-5 mr-2" />
          Buat Laporan Baru
        </Link>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              type="text"
              className="input pl-10"
              placeholder="Cari laporan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button
            className="btn btn-secondary inline-flex items-center"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-5 w-5 mr-2" />
            Filter
          </button>
        </div>
        
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-neutral-200">
            <div>
              <label htmlFor="statusFilter" className="form-label">
                Status
              </label>
              <select
                id="statusFilter"
                className="input"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Semua Status</option>
                <option value="draft">Draft</option>
                <option value="submitted">Diajukan</option>
                <option value="approved">Disetujui</option>
                <option value="rejected">Ditolak</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="typeFilter" className="form-label">
                Tipe Laporan
              </label>
              <select
                id="typeFilter"
                className="input"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">Semua Tipe</option>
                <option value="weekly">Mingguan</option>
                <option value="monthly">Bulanan</option>
              </select>
            </div>
          </div>
        )}
      </div>
      
      {/* Results */}
      {filteredReports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map((report) => (
            <ReportCard 
              key={report.id} 
              report={report} 
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-neutral-600 mb-4">
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
              ? 'Tidak ada laporan yang sesuai dengan filter pencarian.'
              : 'Belum ada laporan yang dibuat.'}
          </p>
          
          {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && (
            <Link to="/reports/create" className="btn btn-primary inline-flex items-center">
              <PlusCircle className="h-5 w-5 mr-2" />
              Buat Laporan Sekarang
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportList;