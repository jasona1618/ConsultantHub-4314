// HIPAA configuration constants
export const PHI_FIELDS = [
  'patientName',
  'dateOfBirth',
  'medicalRecordNumber',
  'socialSecurityNumber',
  'healthConditions',
  'medications',
  'treatmentPlans'
];

export const DATA_RETENTION_DAYS = 365 * 6; // 6 years minimum for HIPAA

export const ACCESS_LEVELS = {
  FULL_PHI: 'full_phi_access',
  LIMITED_PHI: 'limited_phi_access',
  NO_PHI: 'no_phi_access'
};