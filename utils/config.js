const NODE_ENV = process.env.NODE_ENV || "development";
console.log(`Running in ${NODE_ENV} mode`);

const JWT_SECRET = process.env.JWT_SECRET || "my-secret-key";

if (!JWT_SECRET) {
  console.error("JWT_SECRET is not set in the environment variables");
  process.exit(1);
} else {
  console.log(`JWT_SECRET is set to: ${JWT_SECRET}`);
}

module.exports = { JWT_SECRET };
