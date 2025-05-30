import { eventRouter } from "~/server/api/routers/event";
import { postRouter } from "~/server/api/routers/post";
import { productRouter } from "~/server/api/routers/product";
import { rewardRouter } from "~/server/api/routers/reward";
import { taskRouter } from "~/server/api/routers/task";
import { userRouter } from "~/server/api/routers/user";
import { walletRouter } from "~/server/api/routers/wallet";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	post: postRouter,
	user: userRouter,
	event: eventRouter,
	wallet: walletRouter,
	task: taskRouter,
	product: productRouter,
	reward: rewardRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
