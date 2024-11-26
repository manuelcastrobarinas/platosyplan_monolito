import moongose from "mongoose";
import { CONFIG } from "../../../config";

export async function dbConnection() {
  try {
    moongose.set("strictQuery", false);
    await moongose.connect(CONFIG.db, {});
    console.log("base de datos conectada");
  } catch (error) {
    console.log({ error });
    throw new Error("error en la base de datos");
  }
}
