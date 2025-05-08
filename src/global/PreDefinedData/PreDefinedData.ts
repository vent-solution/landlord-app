import { AccommodationCategory } from "../enums/accommodationCategory";
import { AccommodationType } from "../enums/accommodationType";
import { addressType } from "../enums/addressType";
import { businessTypeEnum } from "../enums/businessTypeEnum";
import { facilityCategory } from "../enums/facilityCategory";
import { FacilityRating } from "../enums/facilityRatingEnum";
import { FacilityStatus } from "../enums/facilityStatusEnum";
import { GenderEnum } from "../enums/genderEnum";
import { genderRestrictionEnum } from "../enums/genderRestrictionEnum";
import { NationalIdType } from "../enums/NationalIdType";
import { PaymentPartern } from "../enums/paymentParternEnum";
import { PaymentTypeEnum } from "../enums/paymentTypeEnum";
import { RoomLocationEnum } from "../enums/roomLocationEnum";
import { SpaceCategory } from "../enums/spaceCategory";

// BUSINESS TYPES
export const BUSINESS_TYPE_DATA: { label: string; value: string }[] = [
  { label: "Rent units", value: businessTypeEnum.rent },
  { label: "Rent whole facility", value: businessTypeEnum.rentWhole },
  { label: "Sale whole facility", value: businessTypeEnum.sale },
  { label: "Sale condominiums", value: businessTypeEnum.saleCondominium },
  { label: "Hospitality", value: businessTypeEnum.hospitality },
  { label: "Others", value: businessTypeEnum.others },
];

// FACILITY CATEGORIES
export const FACILITY_CATEGORY_DATA: { label: string; value: string }[] = [
  { label: "Apartment building", value: facilityCategory.apartmentBuilding },
  { label: "Arcade", value: facilityCategory.arcade },
  { label: "Hostel", value: facilityCategory.hostel },
  { label: "Hotel", value: facilityCategory.hotel },
  { label: "Lodges", value: facilityCategory.lodge },
  { label: "Shopping mall", value: facilityCategory.mall },
  { label: "Mansion", value: facilityCategory.manssion },
  { label: "Market", value: facilityCategory.market },
  { label: "Motel", value: facilityCategory.motel },
  { label: "Office building", value: facilityCategory.officeBuilding },
  { label: "Rental building", value: facilityCategory.rentalBuilding },
  { label: "Villa", value: facilityCategory.villa },
  { label: "Others", value: facilityCategory.others },
];

// GENDER RESTRICTION
export const GENDER_RESTRICTION_DATA: { label: string; value: string }[] = [
  { label: "All gender", value: genderRestrictionEnum.both },
  { label: "Female only", value: genderRestrictionEnum.femaleOnly },
  { label: "Male only", value: genderRestrictionEnum.maleOnly },
  {
    label: "Either male or female only",
    value: genderRestrictionEnum.eitherOnly,
  },
];

// ACCOMMODATION TYPE
export const ACCOMMODATION_TYPE_DATA: { label: string; value: string }[] = [
  { label: "Apartment", value: AccommodationType.apartment },
  { label: "Hostel room", value: AccommodationType.hostelRoom },
  { label: "Hotel room", value: AccommodationType.hotelRoom },
  { label: "Lodge room", value: AccommodationType.lodgeRoom },
  { label: "Motel room", value: AccommodationType.motelRoom },
  { label: "Office space", value: AccommodationType.oficeSpace },
  { label: "Rental", value: AccommodationType.rental },
  { label: "Shop room", value: AccommodationType.shopRoom },
  { label: "Villa details", value: AccommodationType.villa },
  { label: "Mansion details", value: AccommodationType.manssion },
  { label: "Market stall", value: AccommodationType.marketStall },
  { label: "Supermarket space", value: AccommodationType.supermarketSpace },
  { label: "Restaurant space", value: AccommodationType.restaurantSpace },
  { label: "Events space", value: AccommodationType.eventsSpace },
  { label: "Meeting space", value: AccommodationType.meetingSpace },
  { label: "Conference space", value: AccommodationType.conferenceSpace },
  { label: "Others", value: AccommodationType.others },
];

// PAYMENT TYPE
export const PAYMENT_TYPE_DATA: { label: string; value: string }[] = [
  { label: "Cash", value: PaymentTypeEnum.cash },
  { label: "Cheque", value: PaymentTypeEnum.cheque },
  { label: "Bank direct", value: PaymentTypeEnum.bank },
  { label: "Online MOMO", value: PaymentTypeEnum.onlineMomo },
  { label: "Online Bank", value: PaymentTypeEnum.onlineBank },
  { label: "Online Paypal", value: PaymentTypeEnum.onlinePaypal },
  { label: "Online Airtel money", value: PaymentTypeEnum.onlineAirtelMoney },
  { label: "Others", value: PaymentTypeEnum.others },
];

// ACCOMMODATION CATEGORY
export const ACCOMMODATION_CATEGORY: { label: string; value: string }[] = [
  { label: "Standard singel", value: AccommodationCategory.standardSingle },
  { label: "Standard double", value: AccommodationCategory.standardDouble },
  { label: "Standard twin", value: AccommodationCategory.standardTwin },
  { label: "Delux double", value: AccommodationCategory.deluxDouble },
  { label: "Studio room", value: AccommodationCategory.studioRoom },
  { label: "Junior suit", value: AccommodationCategory.juniorSuit },
  { label: "Executive suit", value: AccommodationCategory.executiveSuit },
  { label: "Presidential suit", value: AccommodationCategory.presidentailSuit },
  { label: "Royal suit", value: AccommodationCategory.royalSuit },
  { label: "Dormitory bunks", value: AccommodationCategory.domitoryBunks },
  { label: "Dormitory pods", value: AccommodationCategory.domitoryPods },
  { label: "Dormitory no bunks", value: AccommodationCategory.domitoryNoBunks },
  { label: "Private single", value: AccommodationCategory.privateSingle },
  { label: "Private twin", value: AccommodationCategory.privateTwin },
  { label: "Private double", value: AccommodationCategory.privateDouble },
  { label: "Private family", value: AccommodationCategory.privateFamily },
];

// PAYMENT PATTERN
export const PAYMENT_PARTERN: { label: string; value: string }[] = [
  { label: "Per year", value: PaymentPartern.annually },
  { label: "Per semester", value: PaymentPartern.perSemester },
  { label: "Per quarter", value: PaymentPartern.quaterly },
  { label: "Per month", value: PaymentPartern.monthly },
  { label: "Per week", value: PaymentPartern.weekly },
  { label: "Per day", value: PaymentPartern.daily },
  { label: "Per Night", value: PaymentPartern.perNight },
  { label: "Per hour", value: PaymentPartern.hourly },
];

// ROOM LOCATION
export const ROOM_LOCATION_DATA: { label: string; value: string }[] = [
  { label: "Inside", value: RoomLocationEnum.inside },
  { label: "Outside", value: RoomLocationEnum.outside },
];

// GENDER
export const GENDER_DATA: { label: string; value: string }[] = [
  { label: "Male", value: GenderEnum.male },
  { label: "Female", value: GenderEnum.female },
  { label: "Others", value: GenderEnum.others },
];

// ID TYPE
export const NATIONAL_ID_TYPE: { label: string; value: string }[] = [
  { label: "National ID", value: NationalIdType.NationalId },
  { label: "Passport", value: NationalIdType.Passport },
  { label: "Drivers License/permit", value: NationalIdType.DriversLicence },
  { label: "Work/Company ID", value: NationalIdType.WorkId },
  { label: "Student ID", value: NationalIdType.StudentId },
  { label: "Refugee ID", value: NationalIdType.RefugeeId },
];

// ADDRESS TYPE
export const ADDRESS_TYPE: { label: string; value: string }[] = [
  { label: "Home address", value: addressType.Home },
  { label: "Work address", value: addressType.Work },
  { label: "School address", value: addressType.School },
];

// SPACE CATEGORY
export const SPACE_CATEGORY: { label: string; value: string }[] = [
  { label: "Events space", value: SpaceCategory.eventsSpace },
  { label: "Meeting space", value: SpaceCategory.meetingSpace },
  { label: "Conference space", value: SpaceCategory.conferenceSpace },
];

// FACILITY RATING DATA
export const FACILITY_RATING: { label: string; value: string }[] = [
  { label: "1 Star", value: FacilityRating.oneStar },
  { label: "2 Star", value: FacilityRating.twoStar },
  { label: "3 Star", value: FacilityRating.threeStar },
  { label: "4 Star", value: FacilityRating.fourStar },
  { label: "5 Star", value: FacilityRating.fiveStar },
  { label: "6 Star", value: FacilityRating.sixStar },
  { label: "7 Star", value: FacilityRating.sevenStar },
];

// FACILITY STATUS DATA
export const FACILITY_STATUS: { label: string; value: string }[] = [
  { label: "Under construction", value: FacilityStatus.underConstruction },
  { label: "Under renovation", value: FacilityStatus.unserRenovation },
  { label: "In use", value: FacilityStatus.inUse },
  { label: "New opening", value: FacilityStatus.newOpening },
];
