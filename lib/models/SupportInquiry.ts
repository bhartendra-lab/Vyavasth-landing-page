import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISupportInquiry extends Document {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  source: string;
  submittedAt: Date;
}

const SupportInquirySchema = new Schema<ISupportInquiry>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  source: { type: String, default: "contact_page" },
  submittedAt: { type: Date, default: Date.now },
});

const SupportInquiry: Model<ISupportInquiry> =
  mongoose.models.SupportInquiry ??
  mongoose.model<ISupportInquiry>("SupportInquiry", SupportInquirySchema);

export default SupportInquiry;
