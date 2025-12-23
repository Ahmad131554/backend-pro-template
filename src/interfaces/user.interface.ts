// User-related types and interfaces

export interface UploadProfilePictureResponseDto {
  profilePictureUrl: string;
  filename: string;
  size: number;
  mimetype: string;
  uploadedBy?: string;
}

export interface AuthenticatedUser {
  id: string;
  username: string;
  email: string;
  role: string;
}