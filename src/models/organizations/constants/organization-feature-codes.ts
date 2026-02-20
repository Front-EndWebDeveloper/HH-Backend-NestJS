export const ORGANIZATION_FEATURE_CODES = [
  { code: 'operations_compliance', name: 'Company Documents & Compliance' },
  { code: 'operations_referral_management', name: 'Referral Management' },
  { code: 'operations_scheduling', name: 'Employee Scheduling' },
  { code: 'operations_job_management', name: 'Job Management & HR' },
  { code: 'patient_management_view_patients', name: 'Patient Management' },
  { code: 'operations_remote_monitoring', name: 'Remote Patient Monitoring' },
  { code: 'organization_setup', name: 'Organization Setup' },
  { code: 'operations_survey_audit', name: 'Survey & Audit' },
  { code: 'operations_calendar', name: 'Unified Calendar & Tasks' },
] as const;

export type OrganizationFeatureCode = (typeof ORGANIZATION_FEATURE_CODES)[number]['code'];
