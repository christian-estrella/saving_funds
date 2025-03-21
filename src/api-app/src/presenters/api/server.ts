import Fastify from "fastify";
import cors from "@fastify/cors";
import AssociateRoute from "./routes/associate-route";
import { customLogger } from "./logger/custom-logger";
import CityRoute from "./routes/city-route";
import StateRoute from "./routes/state-route";
import AgreementRoute from "./routes/agreement-route";

const fastify = Fastify({
  logger: customLogger['development'] ?? true
});

fastify.register(cors, {
  origin: (origin, cb) => {
    const url = origin || "";

    if (url === "") {
      cb(new Error(`URL Empty ${origin} => Not allowed`), false);
      return;
    }

    const hostname = new URL(url).hostname;

    console.log(`TEST => ${hostname}`);

    if (hostname !== "localhost") {
      cb(new Error(`${hostname} => Not allowed`), false);
      return;
    }

    cb(null, true);
    return;
  }
});

fastify.register(AgreementRoute);
fastify.register(StateRoute);
fastify.register(CityRoute);
fastify.register(AssociateRoute);

fastify.get('/', async (request, reply) => {
  reply.send({ hello: 'world' });
});

const start = async () => {
  try {
    fastify.listen({ host: "localhost", port: 8081 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();