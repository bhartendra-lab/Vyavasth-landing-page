import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWaitlist extends Document {
  studioName: string;
  name: string;
  whatsapp: string;
  city: string;
  source: string;
  submittedAt: Date;
}

const WaitlistSchema = new Schema<IWaitlist>({
  studioName: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  whatsapp: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  source: { type: String, default: "landing_page" },
  submittedAt: { type: Date, default: Date.now },
});

const Waitlist: Model<IWaitlist> =
  mongoose.models.Waitlist ??
  mongoose.model<IWaitlist>("Waitlist", WaitlistSchema);

export default Waitlist;
