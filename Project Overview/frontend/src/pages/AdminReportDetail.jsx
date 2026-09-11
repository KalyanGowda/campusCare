import { StaffReportDetail } from "./StaffReportDetail";

export function AdminReportDetail() {
  return (
    <StaffReportDetail
      managementBasePath="/api/admin/reports"
      backPath="/admin/reports"
      backLabel="Back to All Reports"
      rejectionHelp="Use this only if the issue cannot be verified. Your reason is logged and visible to the reporting student."
    />
  );
}
