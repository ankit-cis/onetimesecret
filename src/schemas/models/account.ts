import type Stripe from "stripe";
import { z } from "zod";

import { customerSchema } from "./customer";

// Account schema
export const accountSchema = z.object({
  cust: customerSchema,
  apitoken: z.string().optional(),
  stripe_customer: z.custom<Stripe.Customer>(),
  stripe_subscriptions: z.array(z.custom<Stripe.Subscription>()),
});

export type Account = z.infer<typeof accountSchema>;
