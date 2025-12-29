import { IUser } from "./userInterface";

export interface IExercise {
  trainer: IUser;
  title: string;
  description: string;
  video_link: string;
  pattern: string[];
  type: string[];
  primary_muscle: string[];
  plane: string[];
  photo: string;
}
