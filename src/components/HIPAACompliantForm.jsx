import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { encryptData } from '../utils/encryption';

// Define PHI fields directly to avoid import issues
const PHI_FIELDS = [
  'patientName',
  'dateOfBirth',
  'medicalRecordNumber',
  'socialSecurityNumber',
  'healthConditions',
  'medications',
  'treatmentPlans'
];

const HIPAACompliantForm = ({ onSubmit, initialData = {} }) => {
  const { canAccessPHI } = useAuth();
  const [formData, setFormData] = useState(initialData);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Encrypt PHI fields before submission
    const processedData = Object.keys(formData).reduce((acc, key) => {
      if (PHI_FIELDS.includes(key)) {
        acc[key] = encryptData(formData[key]);
      } else {
        acc[key] = formData[key];
      }
      return acc;
    }, {});

    onSubmit(processedData);
  };

  if (!canAccessPHI()) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        You do not have permission to access PHI data.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-md mb-4">
        <p className="text-sm text-blue-700">
          This form contains Protected Health Information (PHI) and is HIPAA compliant.
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Patient Name (PHI)
          </label>
          <input
            type="text"
            value={formData.patientName || ''}
            onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            autoComplete="off"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Medical Record Number (PHI)
          </label>
          <input
            type="text"
            value={formData.medicalRecordNumber || ''}
            onChange={(e) => setFormData({ ...formData, medicalRecordNumber: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            autoComplete="off"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Health Conditions (PHI)
          </label>
          <textarea
            value={formData.healthConditions || ''}
            onChange={(e) => setFormData({ ...formData, healthConditions: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            rows="3"
            required
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Submit Securely
        </button>
      </div>
    </form>
  );
};

export default HIPAACompliantForm;