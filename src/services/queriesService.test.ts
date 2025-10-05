import { DuckDBConnection, DuckDBInstance } from "@duckdb/node-api";
import { beforeAll, describe, expect, it } from "vitest";
import { getAverageRentDB, getMonthlyRentDB, getPostcodesDB, getPropertyStatusDB } from "./queriesService";

let dbConn: DuckDBConnection;

describe("queries service", () => {
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

  it("returns the average rent for WALES", async () => {
    const result = await getAverageRentDB(dbConn!, "WALES");
    expect(result).toEqual(152955.56);
  });

  it("returns the average rent for SCOTLAND", async () => {
    const result = await getAverageRentDB(dbConn!, "SCOTLAND");
    expect(result).toEqual(186373.33);
  });

  it("returns the average rent for ENGLAND", async () => {
    const result = await getAverageRentDB(dbConn!, "ENGLAND");
    expect(result).toEqual(166928.57);
  });

  it("returns the average rent for N.IRELAND", async () => {
    const result = await getAverageRentDB(dbConn!, "N.IRELAND");
    expect(result).toEqual(133990.91);
  });

  it("returns average rent as 0 for invalid region", async () => {
    const result = await getAverageRentDB(dbConn!, "WRONG");
    expect(result).toEqual(0);
  });

  it("returns the monthly rent for overdue property", async () => {
    const result = await getMonthlyRentDB(dbConn!, "p_1002");
    expect(result.rentPence).toEqual(79400);
    expect(result.rentPounds).toEqual(794);
  });

  it("returns the monthly rent for active property", async () => {
    const result = await getMonthlyRentDB(dbConn!, "p_1004");
    expect(result.rentPence).toEqual(212500);
    expect(result.rentPounds).toEqual(2125);
  });

  it("returns the monthly rent for partially vacant property", async () => {
    const result = await getMonthlyRentDB(dbConn!, "p_1005");
    expect(result.rentPence).toEqual(190800);
    expect(result.rentPounds).toEqual(1908);
  });

  it("returns the monthly rent for vacant property", async () => {
    const result = await getMonthlyRentDB(dbConn!, "p_1029");
    expect(result.rentPence).toEqual(0);
    expect(result.rentPounds).toEqual(0);
  });

  it("returns the monthly rent for invalid ID", async () => {
    const result = await getMonthlyRentDB(dbConn!, "p_1");
    expect(result.rentPence).toEqual(0);
    expect(result.rentPounds).toEqual(0);
  });

  it("returns the list of postcodes", async () => {
    const result = await getPostcodesDB(dbConn!);
    expect(result.length).toEqual(100);
  });

  it("returns the property status for overdue property", async () => {
    const result = await getPropertyStatusDB(dbConn!, "p_1002");
    expect(result.tenancyEndDate).toEqual("2024-07-01");
    expect(result.capacity).toEqual(4);
    expect(result.currentTenantsCount).toEqual(2);
  });

  it("returns the property status for partially vacant property", async () => {
    const result = await getPropertyStatusDB(dbConn!, "p_1005");
    expect(result.tenancyEndDate).toEqual('2027-10-08');
    expect(result.capacity).toEqual(3);
    expect(result.currentTenantsCount).toEqual(1);
  });

  it("returns the property status for active property", async () => {
    const result = await getPropertyStatusDB(dbConn!, "p_1004");
    expect(result.tenancyEndDate).toEqual("2028-01-08");
    expect(result.capacity).toEqual(1);
    expect(result.currentTenantsCount).toEqual(1);
  });

  it("returns the property status for vacant property", async () => {
    const result = await getPropertyStatusDB(dbConn!, "p_1029");
    expect(result.tenancyEndDate).toBeUndefined();
    expect(result.capacity).toBeUndefined();
    expect(result.currentTenantsCount).toEqual(0);
  });

  it("returns the property status for invalid ID", async () => {
    const result = await getPropertyStatusDB(dbConn!, "p_1");
    expect(result.tenancyEndDate).toBeUndefined();
    expect(result.capacity).toBeUndefined();
    expect(result.currentTenantsCount).toEqual(0);
  });
});
