import BatchReaderInfo from "../../batch-reader-info";
import xlsx from "node-xlsx";
import BatchReaderResult from "../../batch-reader-result";
import EmptyString from "../../../../util/empty-string";

type WithdrawalBatchReaderInfo = {
  p_associate_rfc: string;
  p_amount: number;
  p_is_yields: boolean;
}

export default class WithdrawalBatchReader implements BatchReaderInfo<BatchReaderResult> {
  async execute(file: Buffer): Promise<BatchReaderResult> {
    const excel = xlsx.parse(file);
    const worksheet = excel[0].data;
    const data: WithdrawalBatchReaderInfo[] = [];
    const messages: string[] = [];

    worksheet.forEach((row, index, d) => {
      if (index > 0) { // skiping headers
        if (EmptyString(row[0]) === '') {
          messages.push(`Fila ${index} omitida por no cumplir con valor aceptado en columna rfc.`);
        }

        if (EmptyString(row[2]) === '') {
          messages.push(`Fila ${index} omitida por no cumplir con valor aceptado en columna monto.`);
        }

        data.push({
          p_associate_rfc: row[0],
          p_amount: Number(row[2]),
          p_is_yields: !(EmptyString(row[3]) === '')
        });
      }
    });

    const result: BatchReaderResult = { 
      rows: data as WithdrawalBatchReaderInfo[],
      messages: messages
    };

    return result;
  }
}
export type { WithdrawalBatchReaderInfo }