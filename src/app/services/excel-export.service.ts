import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Injectable({ providedIn: 'root' })
export class ExcelExportService {
  /**
   * Eksportuje dane do pliku .xlsx
   * @param data Tablica obiektów do eksportu
   * @param sheetName Nazwa arkusza w skoroszycie
   * @param fileName Nazwa pliku output (bez rozszerzenia)
   */
  exportAsExcelFile(
    data: any[],
    sheetName: string = 'Arkusz1',
    fileName: string = 'dane'
  ): void {
    // 1) Zamień tablicę obiektów na arkusz
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    // 2) Utwórz skoroszyt i dodaj do niego arkusz
    const workbook: XLSX.WorkBook = {
      Sheets: { [sheetName]: worksheet },
      SheetNames: [sheetName],
    };

    // 3) Wygeneruj binarny string .xlsx
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // 4) Zapisz plik z użyciem file-saver
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });

    const timestamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[:T]/g, '-'); // YYYY-MM-DD-HH-MM-SS

    saveAs(blob, `${fileName}_${timestamp}.xlsx`);
  }
}
