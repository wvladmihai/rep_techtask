import { DuckDBConnection, DuckDBInstance } from "@duckdb/node-api";
import { beforeAll, describe, expect, it } from "vitest";
import { getMappedPropertyStatus } from "./propertyStatusService";
import { PropertyStatus } from "../types";

let dbConn: DuckDBConnection;

describe("property status service", () => {
  beforeAll(async () => {
    const db = await DuckDBInstance.create();
    dbConn = await db.connect();

    await dbConn.run(
      "CREATE TABLE properties AS SELECT * FROM 'technical-challenge-properties-september-2024.csv'"
    );

    await dbConn.run(
      "CREATE TABLE tenants AS SELECT * FROM 'technical-challenge-tenants-september-2024.csv'"
    );
  });

  it("finds vacant property", async () => {
    const result = await getMappedPropertyStatus(dbConn!, "p_1029");
    expect(result).toEqual(PropertyStatus.PROPERTY_VACANT);
  });

  it("finds overdue property", async () => {
    const result = await getMappedPropertyStatus(dbConn!, "p_1002");
    expect(result).toEqual(PropertyStatus.PROPERTY_OVERDUE);
  });

  it("finds partially vacant property", async () => {
    const result = await getMappedPropertyStatus(dbConn!, "p_1005");
    expect(result).toEqual(PropertyStatus.PARTIALLY_VACANT);
  });

  it("finds active property", async () => {
    const result = await getMappedPropertyStatus(dbConn!, "p_1004");
    expect(result).toEqual(PropertyStatus.PROPERTY_ACTIVE);
  });

  it("returns vacant for missing property id", async () => {
    const result = await getMappedPropertyStatus(dbConn!, "p_1");
    expect(result).toEqual(PropertyStatus.PROPERTY_VACANT);
  });
});
