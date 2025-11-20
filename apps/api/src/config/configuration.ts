type Configuration = {
  PORT: number;
  NODE_ENV: 'development' | 'production';
  JWT_SECRET: string;
};

export default (): Configuration => ({
  PORT: Number(process.env.PORT) || 8000,
  NODE_ENV:
    (process.env.NODE_ENV as 'development' | 'production') || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'defaultsecret',
});
