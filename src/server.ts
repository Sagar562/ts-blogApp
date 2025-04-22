import express, {Request, Response} from "express";
import {sequelize} from "./config/database";
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';
import likeRoutes from './routes/likeRoutes';
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use('/api/v1', userRoutes);
app.use('/api/v1', postRoutes);
app.use('/api/v1', commentRoutes);
app.use('/api/v1', likeRoutes);


app.get('/', (req: Request, res: Response) => {
    res.send("This is home page of blog app");
});

const startServer = async () => {
    try {

        await sequelize.authenticate();
        console.log("Database connected successfully");

        await sequelize.sync({alter: true});
        console.log("Database synced");

        app.listen(PORT, () => {
            console.log(`server is running on ${PORT}`);
        });

    }catch(error) {
        console.log("Unable to connect with database", error);
        process.exit(1);
    }
};
startServer();