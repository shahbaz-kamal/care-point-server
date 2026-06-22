import { Gender } from "@prisma/client";

export interface IDoctorUpdateInput {
  email: string;
  contactNumber: string;
  gender: Gender;
  name: string;
  //   profilePhoto: string | null;
  address: string;
  registrationNumber: string;
  experience: number;
  qualification: string;
  currentWorkingPlace: string;
  designation: string;
  isDeleted: boolean;
  specialities: {
    specialityId: string;
    toBeDeleted?: boolean;
  }[];
}
