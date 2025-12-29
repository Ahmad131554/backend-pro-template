import { ClientStatus } from "../utils/enums";
import { IQuestion } from "./questionInterface";
import { IRole } from "./roleInterface";
import { IUser } from "./userInterface";

interface IAttachments {
  file: string;
  title: string;
}

interface IQuestions {
  question: IQuestion;
  answer: boolean;
  description: string;
}

export interface IClient {
  first_name: string;
  last_name: string;
  email: string;
  trainer: IUser;
  phone: string;
  dob: Date;
  gender: string;
  start_weight: number;
  current_weight: number;
  target_weight: number;
  signature: string;
  status: ClientStatus;
  attachments: IAttachments[];
  questions: IQuestions[];
}
