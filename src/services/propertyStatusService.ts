import { DuckDBConnection } from "@duckdb/node-api";
import { PropertyStatus } from "../types";
import { getPropertyStatusDB } from "./queriesService";


export const getMappedPropertyStatus = async (
  conn: DuckDBConnection,
  propertyId: string
): Promise<PropertyStatus> => {
  const status = await getPropertyStatusDB(conn, propertyId);

  if (status.currentTenantsCount === 0) {
    return PropertyStatus.PROPERTY_VACANT;
  }

  if (status.tenancyEndDate && new Date(status.tenancyEndDate) < new Date()) {
    return PropertyStatus.PROPERTY_OVERDUE;
  }

  if (status.capacity) {
    if (status.currentTenantsCount < status.capacity) {
      return PropertyStatus.PARTIALLY_VACANT;
    } else if (status.currentTenantsCount === status.capacity) {
      return PropertyStatus.PROPERTY_ACTIVE;
    }
  }

  console.log("Unexpected state for propertyId: ", status.id);
  throw new Error("Unexpected property state");
};
