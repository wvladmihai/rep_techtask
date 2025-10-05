import { DuckDBConnection, DuckDBInstance } from "@duckdb/node-api";
import { beforeAll, describe, expect, it } from "vitest";
import { getAverageRent, getMonthlyRent } from "./rentService";

let dbConn: DuckDBConnection;

describe("rent service", () => {
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
    const result = await getAverageRent(dbConn!, "WALES");
    expect(result).toEqual(152955.56);
  });

  it("returns the average rent for SCOTLAND", async () => {
    const result = await getAverageRent(dbConn!, "SCOTLAND");
    expect(result).toEqual(186373.33);
  });

  it("returns the average rent for ENGLAND", async () => {
    const result = await getAverageRent(dbConn!, "ENGLAND");
    expect(result).toEqual(166928.57);
  });

  it("returns the average rent for N.IRELAND", async () => {
    const result = await getAverageRent(dbConn!, "N.IRELAND");
    expect(result).toEqual(133990.91);
  });

  it("returns the average rent for invalid region", async () => {
    const result = await getAverageRent(dbConn!, "WRONG");
    expect(result).toEqual(0);
  });

  it("returns the monthly rent for overdue property", async () => {
    const result = await getMonthlyRent(dbConn!, "p_1002");
    expect(result.rentPence).toEqual(79400);
    expect(result.rentPounds).toEqual(794);
  });

  it("returns the monthly rent for active property", async () => {
    const result = await getMonthlyRent(dbConn!, "p_1004");
    expect(result.rentPence).toEqual(212500);
    expect(result.rentPounds).toEqual(2125);
  });

  it("returns the monthly rent for partially vacant property", async () => {
    const result = await getMonthlyRent(dbConn!, "p_1005");
    expect(result.rentPence).toEqual(190800);
    expect(result.rentPounds).toEqual(1908);
  });

  it("returns the monthly rent for vacant property", async () => {
    const result = await getMonthlyRent(dbConn!, "p_1029");
    expect(result.rentPence).toEqual(0);
    expect(result.rentPounds).toEqual(0);
  });

  it("returns the monthly rent for invalid ID", async () => {
    const result = await getMonthlyRent(dbConn!, "p_1");
    expect(result.rentPence).toEqual(0);
    expect(result.rentPounds).toEqual(0);
  });
});
