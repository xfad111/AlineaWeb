import React from 'react';
import { useForm } from 'react-hook-form';
import { Report, ReportType, NewsCategory, WeekNumber } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface ReportFormProps {
  initialData?: Partial<Report>;
  onSubmit: (data: any) => void;
  isEditing?: boolean;
}

const ReportForm: React.FC<ReportFormProps> = ({ 
  initialData = {}, 
  onSubmit,
  isEditing = false
}) => {
  const { currentUser } = useAuth();
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    watch 
  } = useForm({
    defaultValues: {
      title: initialData.title || '',
      content: initialData.content || '',
      type: initialData.type || 'weekly',
      weekNumber: initialData.weekNumber || '1',
      category: initialData.category || 'other',
      status: initialData.status || 'draft'
    }
  });
  
  const reportType = watch('type');
  
  if (!currentUser) return null;
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-neutral-900 mb-4">
          {isEditing ? 'Edit Laporan' : 'Buat Laporan Baru'}
        </h3>
        
        <div className="space-y-4">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Judul Laporan
            </label>
            <input
              id="title"
              type="text"
              className={`input ${errors.title ? 'input-error' : ''}`}
              placeholder="Masukkan judul laporan"
              {...register('title', { 
                required: 'Judul laporan harus diisi',
                minLength: {
                  value: 5,
                  message: 'Judul minimal 5 karakter'
                }
              })}
            />
            {errors.title && (
              <p className="error-message">{errors.title.message?.toString()}</p>
            )}
          </div>
          
          {/* Report Type */}
          <div className="form-group">
            <label htmlFor="type" className="form-label">
              Tipe Laporan
            </label>
            <select
              id="type"
              className={`input ${errors.type ? 'input-error' : ''}`}
              {...register('type', { required: 'Tipe laporan harus dipilih' })}
            >
              <option value="weekly">Laporan Mingguan</option>
              <option value="monthly">Laporan Bulanan</option>
            </select>
            {errors.type && (
              <p className="error-message">{errors.type.message?.toString()}</p>
            )}
          </div>
          
          {/* Week Number (only for weekly reports) */}
          {reportType === 'weekly' && (
            <div className="form-group">
              <label htmlFor="weekNumber" className="form-label">
                Minggu Ke-
              </label>
              <select
                id="weekNumber"
                className={`input ${errors.weekNumber ? 'input-error' : ''}`}
                {...register('weekNumber')}
              >
                <option value="1">Minggu ke-1</option>
                <option value="2">Minggu ke-2</option>
                <option value="3">Minggu ke-3</option>
                <option value="4">Minggu ke-4</option>
              </select>
            </div>
          )}
          
          {/* Category (Show only if in news division) */}
          {(currentUser.division === 'Writer' || currentUser.division === 'Content') && (
            <div className="form-group">
              <label htmlFor="category" className="form-label">
                Kategori Berita
              </label>
              <select
                id="category"
                className={`input ${errors.category ? 'input-error' : ''}`}
                {...register('category')}
              >
                <option value="straight">Straight News</option>
                <option value="breaking">Breaking News</option>
                <option value="opini">Opini</option>
                <option value="other">Lainnya</option>
              </select>
              {errors.category && (
                <p className="error-message">{errors.category.message?.toString()}</p>
              )}
            </div>
          )}
          
          {/* Content */}
          <div className="form-group">
            <label htmlFor="content" className="form-label">
              Isi Laporan
            </label>
            <textarea
              id="content"
              rows={8}
              className={`input ${errors.content ? 'input-error' : ''}`}
              placeholder={`Tuliskan detail laporan ${reportType === 'weekly' ? 'mingguan' : 'bulanan'} Anda...`}
              {...register('content', { 
                required: 'Isi laporan harus diisi',
                minLength: {
                  value: 20,
                  message: 'Isi laporan minimal 20 karakter'
                }
              })}
            />
            {errors.content && (
              <p className="error-message">{errors.content.message?.toString()}</p>
            )}
          </div>
          
          {/* Status (Only for editing) */}
          {isEditing && (
            <div className="form-group">
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select
                id="status"
                className={`input ${errors.status ? 'input-error' : ''}`}
                {...register('status')}
              >
                <option value="draft">Draft</option>
                <option value="submitted">Submitted</option>
                {currentUser.role === 'admin' && (
                  <>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </>
                )}
              </select>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => window.history.back()}
        >
          Batal
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Memproses...' : isEditing ? 'Simpan Perubahan' : 'Buat Laporan'}
        </button>
      </div>
    </form>
  );
};

export default ReportForm;