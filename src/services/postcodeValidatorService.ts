import { DuckDBConnection } from "@duckdb/node-api";
import { getPostcodesDB } from "./queriesService";

export const validatePostcodeList = async (conn: DuckDBConnection) => {
  const postCodes = await getPostcodesDB(conn);

  const validUKPostcodeRegex =
    /^([Gg][Ii][Rr]\s?0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})$/;

  return postCodes.filter(
    (property) => !validUKPostcodeRegex.test(property.postcode)
  );
};
