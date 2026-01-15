// src/utils/exportUtils.ts
import XLSX from 'xlsx';
import { Specialist } from '@/types/specialist.types';

export const exportSpecialistsToXLSX = (specialists: Specialist[], filename: string = 'specialists.xlsx') => {
  if (!specialists || specialists.length === 0) {
    alert('No specialists to export');
    return;
  }

  // Transform data for export
  const exportData = specialists.map((specialist) => ({
    'Service Name': specialist.name,
    'Description': specialist.description || '-',
    'Email': specialist.contact_email,
    'Phone': specialist.contact_phone || '-',
    'Website': specialist.website_url || '-',
    'Status': specialist.status === 'published' ? 'Published' : 'Not Published',
    'Created Date': new Date(specialist.created_at).toLocaleDateString(),
    'Updated Date': new Date(specialist.updated_at).toLocaleDateString(),
  }));

  // Create a new workbook and add the data
  const worksheet = XLSX.utils.json_to_sheet(exportData);
  
  // Auto-size columns
  const colWidths = [
    { wch: 25 }, // Service Name
    { wch: 35 }, // Description
    { wch: 25 }, // Email
    { wch: 20 }, // Phone
    { wch: 25 }, // Website
    { wch: 15 }, // Status
    { wch: 15 }, // Created Date
    { wch: 15 }, // Updated Date
  ];
  worksheet['!cols'] = colWidths;

  // Style header row
  const headerStyle = {
    fill: { fgColor: { rgb: 'FF1E40AF' } },
    font: { bold: true, color: { rgb: 'FFFFFFFF' } },
    alignment: { horizontal: 'center', vertical: 'center' },
  };

  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const address = XLSX.utils.encode_col(C) + '1';
    if (!worksheet[address]) continue;
    worksheet[address].s = headerStyle;
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Specialists');

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().slice(0, 10);
  const exportFilename = `${filename.replace('.xlsx', '')}_${timestamp}.xlsx`;

  // Write the file
  XLSX.writeFile(workbook, exportFilename);
};
