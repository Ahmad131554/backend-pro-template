// Whenever need to integrate push notifications - topic based

import { getApps, initializeApp, applicationDefault } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

export const initFirebaseAdmin = () => {
  if (getApps().length) return;
  initializeApp({
    credential: applicationDefault(),
  });
};

export const firebaseMessaging = () => {
  initFirebaseAdmin();
  return getMessaging();
};
