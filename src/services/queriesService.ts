import { DuckDBConnection } from "@duckdb/node-api";
import { MonthlyRentDB, PropertyPostcodesDB, PropertyStatusDB } from "../types";

export const getAverageRentDB = async (
  conn: DuckDBConnection,
  region: string
): Promise<number> => {
  const preparedQuery = await conn.prepare(
    `SELECT
      AVG(monthlyRentPence)
     FROM properties
     WHERE region = $1`
  );

  preparedQuery.bindVarchar(1, region);
  const queryResult = (await preparedQuery.runAndReadAll()).getRowsJson();

  if (queryResult.length !== 1) {
    console.log(
      "Unexpected set of results for average rent for region: ",
      region
    );
    throw new Error("Unexpected set of results");
  } else {
    return Number(Number(queryResult[0][0]).toFixed(2));
  }
};

export const getMonthlyRentDB = async (
  conn: DuckDBConnection,
  propertyId: string
): Promise<MonthlyRentDB> => {
  const preparedQuery = await conn.prepare(`
    SELECT DISTINCT
      p.monthlyRentPence / COUNT(t.id) OVER (PARTITION BY p.id) AS rentPerTenantPence,
      (p.monthlyRentPence / 100) / COUNT(t.id) OVER (PARTITION BY p.id) AS rentPerTenantPounds
    FROM properties p
    INNER JOIN tenants t
    ON t.propertyId = p.id
    WHERE p.id = $1
    `);

  preparedQuery.bindVarchar(1, propertyId);
  const queryResult = (await preparedQuery.runAndReadAll()).getRowsJson();

  if (queryResult.length === 0) {
    return {
      rentPence: 0,
      rentPounds: 0,
    };
  } else if (queryResult.length === 1) {
    return {
      rentPence: Number(queryResult[0][0]),
      rentPounds: Number(queryResult[0][1]),
    };
  } else {
    console.log(
      "Unexpected set of results for monthly rent for propertyId: ",
      propertyId
    );
    throw new Error("Unexpected set of results");
  }
};

export const getPostcodesDB = async (
  conn: DuckDBConnection
): Promise<PropertyPostcodesDB[]> => {
  const query = await conn.runAndReadAll(`
    SELECT 
      id,
      postcode
    FROM properties
    `);

  const propertyPostcodes = query.getRowsJS().map((elem) => {
    return { id: `${elem[0]}`, postcode: `${elem[1]}` };
  });

  return propertyPostcodes;
};

export const getPropertyStatusDB = async (
  conn: DuckDBConnection,
  propertyId: string
): Promise<PropertyStatusDB> => {
  const preparedQuery = await conn.prepare(`
    SELECT
      p.id,
      tenancyEndDate,
      capacity,
      COUNT(t.id) AS myCount
    FROM properties p
    INNER JOIN tenants t
    ON t.propertyId = p.id
    WHERE p.id = $1
    GROUP BY p.id, tenancyEndDate, capacity
    `);

  preparedQuery.bindVarchar(1, propertyId);
  const queryResult = (await preparedQuery.runAndReadAll()).getRowsJson();

  if (queryResult.length === 0) {
    const result: PropertyStatusDB = {
      id: propertyId,
      tenancyEndDate: undefined,
      capacity: undefined,
      currentTenantsCount: 0,
    };
    return result;
  } else if (queryResult.length === 1) {
    const result: PropertyStatusDB = {
      id: `${queryResult[0][0]}`,
      tenancyEndDate: `${queryResult[0][1]}`,
      capacity: Number(queryResult[0][2]),
      currentTenantsCount: Number(queryResult[0][3]),
    };
    return result;
  } else {
    console.log(
      "Multiple results found for property status query for property id: ",
      propertyId
    );
    throw new Error("Unexpected set of results");
  }
};
