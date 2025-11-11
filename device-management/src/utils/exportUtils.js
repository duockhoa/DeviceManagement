import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const exportToExcel = (data, fileName) => {
    try {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        
        // Generate Excel file
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        
        // Save file
        saveAs(blob, `${fileName}_${new Date().toISOString().slice(0,10)}.xlsx`);
    } catch (error) {
        console.error('Error exporting to Excel:', error);
        throw new Error('Không thể xuất file Excel');
    }
};