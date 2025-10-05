import { DuckDBConnection, DuckDBInstance } from "@duckdb/node-api";
import { beforeAll, describe, expect, it } from "vitest";
import { validatePostcodeList } from "./postcodeValidatorService";

let dbConn: DuckDBConnection;

describe("postcode validator service", () => {
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

  it("finds invalid postcodes", async () => {
    const result = await validatePostcodeList(dbConn!);
    expect(result.length).toEqual(3);
  });
});
