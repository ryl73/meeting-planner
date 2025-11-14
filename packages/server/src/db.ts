import { Sequelize, type SequelizeOptions } from 'sequelize-typescript';

const {
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_DB,
    POSTGRES_PORT,
    DB_HOST,
} = process.env;

const sequelizeOptions: SequelizeOptions = {
    host: DB_HOST || 'localhost',
    port: Number(POSTGRES_PORT),
    username: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DB,
    dialect: 'postgres',
    timezone: '+00:00',
    dialectOptions: {
        useUTC: true,
    },
    logging: false,
    models: [__dirname + '/models/**/*.ts'],
};

export const sequelize = new Sequelize(sequelizeOptions);

export const dbConnect = async (): Promise<void> => {
    try {
        await sequelize.authenticate(); // Проверка аутентификации в БД
        await sequelize.sync(); // Синхронизация базы данных
        // await sequelize.sync({ force: true }); // Синхронизация базы данных
        console.log('  ➜ 🎸 Connected to the database');
    } catch (e) {
        console.error('Unable to connect to the database:', e);
    }
};
