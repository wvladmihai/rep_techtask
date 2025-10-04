import { DuckDBInstance } from "@duckdb/node-api";

// this would be a singleton
export const createConnection = async () => {
  const db = await DuckDBInstance.create();
  const connection = await db.connect();

  await connection.run(
    "CREATE TABLE properties AS SELECT * FROM 'technical-challenge-properties-september-2024.csv'"
  );
  
  await connection.run(
    "CREATE TABLE tenants AS SELECT * FROM 'technical-challenge-tenants-september-2024.csv'"
  );

  return connection;
};
