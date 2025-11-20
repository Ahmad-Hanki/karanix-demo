import { restApi } from "@/lib/api-client";
import { MutationConfig, QueryConfig } from "@/lib/query-client";
import { User } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { useQuery, queryOptions } from "@tanstack/react-query";
import { cache } from "react";
import { toast } from "react-toastify";
import { setAuthCookie } from "@/lib/auth-cookies";
export const loginInputSchema = z.object({
  email: z.email(),
  password: z.string().min(5, "Password must be at least 6 characters long"),
});

export type LoginInput = z.infer<typeof loginInputSchema>;

export const createDiscussion = async ({
  data,
}: {
  data: LoginInput;
}): Promise<{ data: User }> => {
  const response = await restApi.post("/auth/login", data);
  return response.data;
};

type useLoginOptions = {
  mutationConfig?: MutationConfig<typeof createDiscussion>;
};

export const useLogin = ({ mutationConfig }: useLoginOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      const data = args[0];
      if (data) {
        setAuthCookie(data.data.accessToken, data.data.role);
        queryClient.setQueryData(getMeQueryOptions().queryKey, data);
        toast.success("Logged in successfully!");
      }
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createDiscussion,
  });
};

//////////////////////////// get me

export const getMe = cache(async (): Promise<{ data: User }> => {
  const response = await restApi.get("/auth/me", {
    next: { tags: ["me"], revalidate: 60 },
  });
  return response.data;
});

export const getMeQueryOptions = () => {
  return queryOptions({
    queryKey: ["me"],
    queryFn: () => getMe(),
  });
};

type UseMeOptions = {
  queryConfig?: QueryConfig<typeof getMeQueryOptions>;
};

export const useMe = ({ queryConfig }: UseMeOptions) => {
  return useQuery({
    ...getMeQueryOptions(),
    ...queryConfig,
  });
};
