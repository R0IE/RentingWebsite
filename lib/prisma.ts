import "dotenv/config"
import { PrismaMariaDb } from "@prisma/adapter-mariadb"
import { PrismaClient } from "@prisma/client"

const adapter = new PrismaMariaDb({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "Rental",
  connectionLimit: 5,
})

const prisma = new PrismaClient({ adapter })
export default prisma