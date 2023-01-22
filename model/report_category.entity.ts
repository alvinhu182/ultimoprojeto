import { model, Schema } from 'mongoose'

export interface IReportCategory {
    name: String;
    value: Number;
    date: Date;
}
export const ReportCategorySchema = new Schema<IReportCategory>(
    {
        name: { type: 'String', required: true },
        value: { type: 'Number', required: true },
        date: { type: 'Date', required: true },
    },
    { timestamps: true },
)

export const ReportCategory = model<IReportCategory>('ReportCategory', ReportCategorySchema);