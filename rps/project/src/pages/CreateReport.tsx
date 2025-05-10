import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReportForm from '../components/ReportForm';
import { useReports } from '../contexts/ReportsContext';
import { useAuth } from '../contexts/AuthContext';

const CreateReport: React.FC = () => {
  const { addReport } = useReports();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = (data: any) => {
    if (!currentUser) return;
    
    const newReport = {
      ...data,
      createdBy: currentUser.id,
      authorName: currentUser.displayName,
      division: currentUser.division,
    };
    
    addReport(newReport);
    navigate('/reports');
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Buat Laporan Baru</h1>
        <p className="text-neutral-600 mt-1">
          Silakan isi form di bawah ini untuk membuat laporan baru.
        </p>
      </div>
      
      <ReportForm onSubmit={handleSubmit} />
    </div>
  );
};

export default CreateReport;