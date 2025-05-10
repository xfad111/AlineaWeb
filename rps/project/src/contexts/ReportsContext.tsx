import React, { createContext, useState, useContext, useEffect } from 'react';
import { Report, ReportsContextType } from '../types';
import { useAuth } from './AuthContext';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

const defaultReportsContext: ReportsContextType = {
  reports: [],
  addReport: () => {},
  updateReport: () => {},
  deleteReport: () => {},
  getReportById: () => undefined,
  getUserReports: () => [],
  getDivisionReports: () => [],
  getAllReportsForAdmin: () => [],
  downloadReportAsPDF: () => {},
  downloadAllReportsAsPDF: () => {},
};

const ReportsContext = createContext<ReportsContextType>(defaultReportsContext);

export const useReports = () => useContext(ReportsContext);

export const ReportsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const storedReports = localStorage.getItem('reports');
    if (storedReports) {
      setReports(JSON.parse(storedReports));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('reports', JSON.stringify(reports));
  }, [reports]);

  const addReport = (reportData: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newReport: Report = {
      ...reportData,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    
    setReports(prev => [...prev, newReport]);
  };

  const updateReport = (id: string, reportData: Partial<Report>) => {
    setReports(prev => prev.map(report => {
      if (report.id === id) {
        return {
          ...report,
          ...reportData,
          updatedAt: new Date().toISOString(),
        };
      }
      return report;
    }));
  };

  const deleteReport = (id: string) => {
    setReports(prev => prev.filter(report => report.id !== id));
  };

  const getReportById = (id: string): Report | undefined => {
    return reports.find(report => report.id === id);
  };

  const getUserReports = (userId: string): Report[] => {
    return reports.filter(report => report.createdBy === userId);
  };

  const getDivisionReports = (division: string): Report[] => {
    return reports.filter(report => report.division === division);
  };

  const getAllReportsForAdmin = (): Report[] => {
    return [...reports].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  const downloadReportAsPDF = (report: Report) => {
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(20);
    doc.text('Alinea.MMTC Report', 20, 20);
    
    // Add report details
    doc.setFontSize(12);
    doc.text(`Title: ${report.title}`, 20, 40);
    doc.text(`Type: ${report.type}${report.weekNumber ? ` - Week ${report.weekNumber}` : ''}`, 20, 50);
    doc.text(`Division: ${report.division}`, 20, 60);
    doc.text(`Author: ${report.authorName}`, 20, 70);
    doc.text(`Status: ${report.status}`, 20, 80);
    doc.text(`Created: ${format(new Date(report.createdAt), 'dd MMM yyyy HH:mm')}`, 20, 90);
    
    // Add content
    doc.text('Content:', 20, 110);
    const splitContent = doc.splitTextToSize(report.content, 170);
    doc.text(splitContent, 20, 120);
    
    // Save the PDF
    doc.save(`report-${report.id}.pdf`);
  };

  const downloadAllReportsAsPDF = () => {
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(20);
    doc.text('Alinea.MMTC Reports Summary', 20, 20);
    
    // Add date range
    doc.setFontSize(12);
    doc.text(`Generated on: ${format(new Date(), 'dd MMM yyyy HH:mm')}`, 20, 30);
    
    // Create table
    const tableData = reports.map(report => [
      report.title,
      report.division,
      report.type + (report.weekNumber ? ` - Week ${report.weekNumber}` : ''),
      report.authorName,
      report.status,
      format(new Date(report.createdAt), 'dd MMM yyyy')
    ]);
    
    (doc as any).autoTable({
      startY: 40,
      head: [['Title', 'Division', 'Type', 'Author', 'Status', 'Created']],
      body: tableData,
    });
    
    // Save the PDF
    doc.save(`all-reports-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  const contextValue: ReportsContextType = {
    reports,
    addReport,
    updateReport,
    deleteReport,
    getReportById,
    getUserReports,
    getDivisionReports,
    getAllReportsForAdmin,
    downloadReportAsPDF,
    downloadAllReportsAsPDF,
  };

  return (
    <ReportsContext.Provider value={contextValue}>
      {children}
    </ReportsContext.Provider>
  );
};