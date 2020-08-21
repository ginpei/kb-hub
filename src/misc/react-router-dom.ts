import { useParams as useParamsOrig } from "react-router-dom";

type Params = { [key: string]: string | undefined };

export function useParams(): Params {
  return useParamsOrig<Params>();
}
