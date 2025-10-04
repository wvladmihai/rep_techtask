export type PropertyStatusDB = {
  id: string;
  tenancyEndDate: string | undefined;
  capacity: number | undefined;
  currentTenantsCount: number;
};

export type PropertyPostcodesDB = {
  id: string;
  postcode: string;
};

export type MonthlyRentDB = {
  rentPence: number;
  rentPounds: number;
};

export enum PropertyStatus {
  PROPERTY_VACANT = "PROPERTY_VACANT",
  PARTIALLY_VACANT = "PARTIALLY_VACANT",
  PROPERTY_ACTIVE = "PROPERTY_ACTIVE",
  PROPERTY_OVERDUE = "PROPERTY_OVERDUE",
}
