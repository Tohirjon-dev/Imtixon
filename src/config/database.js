import { connect } from "mongoose";

const connectDB = async () => {
  const url = process.env.DB_url;
  await connect(url, {
    dbName: "Exam",
  });
};
export default connectDB;
