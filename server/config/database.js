import mongoose from "mongoose";

const database = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("mongoDB connected"))
    .catch((error) => console.log(error));
};

export default database;
