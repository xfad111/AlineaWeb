import React, { useMemo } from 'react';
import { useReports } from '../contexts/ReportsContext';
import { Download } from 'lucide-react';

const ReportSummary: React.FC = () => {
  const { reports, downloadAllReportsAsPDF } = useReports();

  const summary = useMemo(() => {
    const divisionSummary = reports.reduce((acc, report) => {
      if (!acc[report.division]) {
        acc[report.division] = {
          total: 0,
          weekly: 0,
          monthly: 0,
          approved: 0,
          rejected: 0,
          pending: 0,
        };
      }

      acc[report.division].total++;
      acc[report.division][report.type]++;
      
      switch (report.status) {
        case 'approved':
          acc[report.division].approved++;
          break;
        case 'rejected':
          acc[report.division].rejected++;
          break;
        default:
          acc[report.division].pending++;
      }

      return acc;
    }, {} as Record<string, {
      total: number;
      weekly: number;
      monthly: number;
      approved: number;
      rejected: number;
      pending: number;
    }>);

    return divisionSummary;
  }, [reports]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-900">Report Summary</h1>
        <button
          onClick={downloadAllReportsAsPDF}
          className="btn btn-primary inline-flex items-center"
        >
          <Download className="h-4 w-4 mr-2" />
          Download All Reports
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(summary).map(([division, stats]) => (
          <div key={division} className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-neutral-900 mb-4">{division}</h3>
            <div className="space-y-2">
              <p className="text-sm text-neutral-600">
                Total Reports: <span className="font-medium text-neutral-900">{stats.total}</span>
              </p>
              <p className="text-sm text-neutral-600">
                Weekly Reports: <span className="font-medium text-neutral-900">{stats.weekly}</span>
              </p>
              <p className="text-sm text-neutral-600">
                Monthly Reports: <span className="font-medium text-neutral-900">{stats.monthly}</span>
              </p>
              <div className="pt-2 mt-2 border-t border-neutral-200">
                <p className="text-sm text-success-700">
                  Approved: <span className="font-medium">{stats.approved}</span>
                </p>
                <p className="text-sm text-error-700">
                  Rejected: <span className="font-medium">{stats.rejected}</span>
                </p>
                <p className="text-sm text-warning-700">
                  Pending: <span className="font-medium">{stats.pending}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-neutral-200">
          <h3 className="text-lg font-medium text-neutral-900">Recent Reports</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Division
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Author
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {reports.slice(0, 10).map((report) => (
                <tr key={report.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                    {report.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                    {report.division}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                    {report.type === 'weekly' ? 
                      `Weekly (Week ${report.weekNumber})` : 
                      'Monthly'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`badge ${
                      report.status === 'approved' ? 'badge-success' :
                      report.status === 'rejected' ? 'badge-error' :
                      'badge-warning'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                    {report.authorName}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportSummary;