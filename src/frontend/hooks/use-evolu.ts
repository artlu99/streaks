import { createUseEvolu } from "@evolu/react";
import { evoluInstance } from "~/lib/evolu";

export const useEvolu = createUseEvolu(evoluInstance);
