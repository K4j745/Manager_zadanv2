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
  private _getTimestamp(): string {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');

    const year = now.getFullYear();
    const month = pad(now.getMonth() + 1); // miesiące od 0
    const day = pad(now.getDate());
    const hour = pad(now.getHours());
    const minute = pad(now.getMinutes());
    const second = pad(now.getSeconds());

    return `${year}-${month}-${day}_${hour}-${minute}-${second}`;
  }
  exportAsExcelFile(
    data: any[],
    sheetName: string = 'Arkusz1',
    fileName: string = 'dane'
  ): void {
    // Tablica na arkusz
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

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

    const timestamp = this._getTimestamp();
    saveAs(blob, `${fileName}_${timestamp}.xlsx`);
  }
}
