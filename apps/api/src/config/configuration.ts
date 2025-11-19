type Configuration = {
  PORT: number;
  NODE_ENV: 'development' | 'production';
};

export default (): Configuration => ({
  PORT: Number(process.env.PORT) || 8000,
  NODE_ENV:
    (process.env.NODE_ENV as 'development' | 'production') || 'development',
});
