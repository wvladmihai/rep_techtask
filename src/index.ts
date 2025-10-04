import { createConnection } from "./databaseConnection";
import { validatePostcodeList } from "./services/postcodeValidatorService";
import { getMappedPropertyStatus } from "./services/propertyStatusService";
import { getAverageRent, getMonthlyRent } from "./services/rentService";

const solution = async () => {
  console.log("Tech task solution running...");
  const dbConn = await createConnection();

  const args = process.argv.slice(2);
  const [argRegion, argPropertyId] = args;

  const averageRent = await getAverageRent(dbConn, argRegion ?? "WALES");
  console.log(
    `Average rent for region ${argRegion ?? "WALES"} is ${averageRent}`
  );

  const monthlyRent = await getMonthlyRent(dbConn, argPropertyId ?? "p_1002");
  console.log(
    `Monthly rent for property ID ${argPropertyId ?? "p_1002"} is ${
      monthlyRent.rentPence
    } in pence and ${monthlyRent.rentPounds} in pounds`
  );

  const invalidPostcodes = await validatePostcodeList(dbConn);
  console.log(`List of invalid postcodes: `, invalidPostcodes);

  const status = await getMappedPropertyStatus(
    dbConn,
    argPropertyId ?? "p_1002"
  );
  console.log(
    `Property status for property ID ${argPropertyId ?? "p_1002"} is ${status}`
  );
};

solution();
