import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCrewDto {
  // //userId
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  //category
  @IsString()
  @IsNotEmpty()
  category: string;

  //crewAddress
  @IsString()
  @IsNotEmpty()
  crewAddress: string;

  //crewType
  @IsString()
  @IsNotEmpty()
  crewType: string;

  //crewDDay
  @IsDate()
  @IsNotEmpty()
  crewDDay: Date;

  //crewMemberInfo
  @IsString()
  @IsNotEmpty()
  crewMemberInfo: string;

  //crewTimeInfo
  @IsString()
  @IsNotEmpty()
  crewTimeInfo: string;

  //crewAgeInfo
  @IsString()
  @IsNotEmpty()
  crewAgeInfo: string;

  //crewSignUp
  @IsNumber()
  @IsNotEmpty()
  crewSignUp: number;

  //crewTitle
  @IsString()
  @IsNotEmpty()
  crewTitle: string;

  //crewContent
  @IsString()
  @IsNotEmpty()
  crewContent: string;

  //thumbnail
  @IsString()
  @IsNotEmpty()
  thumbnail: string;

  //crewMaxMember
  @IsNumber()
  @IsNotEmpty()
  crewMaxMember: number;

  //latitude
  @IsNumber()
  @IsNotEmpty()
  latitude: number; //latitude

  //longtitude
  @IsNumber()
  @IsNotEmpty()
  longtitude: number; //longtitude
}
