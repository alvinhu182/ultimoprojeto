import { model, Schema } from 'mongoose'

export interface IReportProduct {
    name: String;
    value: Number;
    date: Date;
}
export const ReportProductSchema = new Schema<IReportProduct>(
    {
        name: { type: 'String', required: true },
        value: { type: 'Number', required: true },
        date: { type: 'Date', required: true },
    },
    { timestamps: true },
)

export const ReportProduct = model<IReportProduct>('ReportProduct', ReportProductSchema);