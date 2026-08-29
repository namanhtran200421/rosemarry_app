/* this file is for testing the didit session creation. feel free to delete it if you want. */

import "dotenv/config";
 
import { createSession } from "../id_verification/service/id_verification.service.js";

const TEST_USER_ID = 1;
 
async function main(): Promise<void> {
    console.log("creating session for user", TEST_USER_ID);
 
    const session = await createSession(TEST_USER_ID);
 
    console.log("\nsession created");
    console.log("  session_id  ", session.session_id);
    console.log("  status      ", session.status);
    console.log("  vendor_data ", session.vendor_data);
    console.log("\nopen this in a browser:\n");
    console.log(session.url);
    console.log();
}
 
main().catch((error) => {
    console.error("\nfailed:", error);
    process.exitCode = 1;
});