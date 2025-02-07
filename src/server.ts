import { createApp } from "./app";
import sequelize from "./config/sequelize";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("✅ Database Connected");
    const app = await createApp();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error("❌ Error occured while starting server :: ", error);
  }
};

startServer();
