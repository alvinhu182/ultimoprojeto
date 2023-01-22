import { model, Schema } from 'mongoose'

export interface IReportUser {
    value: Number;
    date: Date;
}
export const ReportUserSchema = new Schema<IReportUser>(
    {
        value: { type: 'Number', required: true },
        date: { type: 'Date', required: true },
    },
    { timestamps: true },
)

export const ReportUser = model<IReportUser>('ReportUser', ReportUserSchema);