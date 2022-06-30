import { connectToDatabase } from "../utils/db";
import { addAdminMigration } from "./add_admin_migration";

connectToDatabase(process.env.MONGO_URI);

addAdminMigration();
