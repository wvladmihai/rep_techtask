import { DuckDBConnection } from "@duckdb/node-api";
import { getAverageRentDB, getMonthlyRentDB } from "./queriesService";

export const getAverageRent = async (
  conn: DuckDBConnection,
  region: string
) => {
  return getAverageRentDB(conn, region);
};

export const getMonthlyRent = async (
  conn: DuckDBConnection,
  propertyId: string
) => {
  return getMonthlyRentDB(conn, propertyId);
};
