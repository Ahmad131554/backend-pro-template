import mongoose, { Document, Schema } from "mongoose";
import { IClient } from "../interfaces";
import { date, required, string } from "joi";
import { ClientStatus } from "../utils/enums";

//EXPORT INTERFACE WITH MONGOOSE DOCUMENT
export interface IClientModel extends IClient, Document {}

//DEFINE USER SCHEMA
const ClientSchema: Schema = new Schema(
  {
    first_name: {
      type: String,
      default: "",
    },
    last_name: {
      type: String,
      default: "",
    },
    dob: {
      type: Date,
      default: null,
    },
    email: {
      type: String,
      unique: false,
    },
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    phone: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },
    start_weight: {
      type: Number,
      default: 0,
    },
    current_weight: {
      type: Number,
      default: 0,
    },
    target_weight: {
      type: Number,
      default: 0,
    },
    signature: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ClientStatus,
      default: ClientStatus.IN_PROGRESS,
    },
    attachments: [
      {
        title: {
          type: String,
        },
        file: {
          type: String,
        },
      },
    ],
    questions: [
      {
        question: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
        },
        answer: {
          type: Boolean,
        },
        description: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

ClientSchema.index({ first_name: "text", last_name: "text" });
ClientSchema.index({ first_name: 1 });
ClientSchema.index({ last_name: 1 });

//EXPORT
export default mongoose.model<IClientModel>("Client", ClientSchema);
