interface CrewDetail {
  crewId: number;
  userId: number;
  captainId: number;
  captainAge: number;
  captainLocation: string;
  captainMessages: string;
  captainNickname: string;
  captainProfileImage: string;
  category: string;
  crecrewAddress: string;
  crewPlaceName: string;
  crewType: string;
  crewDDay: Date;
  crewMemberInfo: string;
  crewAgeInfo: string;
  crewSignup: string;
  crewTitle: string;
  crewContent: string;
  thumbnail: string;
  crewMaxMember: number;
  crewAttendedMember: number;
  latitude: number;
  longtitude: number;
  createdAt: Date;
  deletedAt: Date;
  signupFormId: number;
  existSignup: boolean;
}

export default CrewDetail;
