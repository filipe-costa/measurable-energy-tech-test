import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CarbonIntensity } from "./types";
import { apiClient } from "../api/api-client";
import { AxiosError } from "axios";
import dayjs from "dayjs";

export const useGetCarbonIntensities = () =>
  useQuery({
    queryKey: ["intensities"],
    queryFn: async () => {
      const response = await apiClient.get<CarbonIntensity[]>("/intensities");
      return response.data;
    },
  });

export const useCreateCarbonIntensity = ({
  onError,
  onSuccess,
}: {
  onError: (error: Error | AxiosError) => void;
  onSuccess: (data: CarbonIntensity) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation<CarbonIntensity, Error | AxiosError, CarbonIntensity>({
    mutationKey: ["intensities"],
    mutationFn: async (data) => {
      const response = await apiClient.post<CarbonIntensity>(
        "/intensities",
        data
      );
      return response.data;
    },
    onError: (error) => onError(error),
    onSuccess: (data) => onSuccess(data),
    onSettled: (data) => {
      if (data) {
        queryClient.setQueryData(
          ["intensities"],
          (prevIntensities: CarbonIntensity[]) => {
            const newIntensities = [...prevIntensities];

            newIntensities.push(data);

            return newIntensities.sort((a, b) => dayjs(a.from).diff(b.from));
          }
        );
      }
    },
  });
};

export const useUpdateCarbonIntensity = ({
  onError,
  onSuccess,
}: {
  onError: (error: Error | AxiosError) => void;
  onSuccess: (data: CarbonIntensity) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation<CarbonIntensity, Error | AxiosError, CarbonIntensity>({
    mutationKey: ["intensities"],
    mutationFn: async (data) => {
      const response = await apiClient.put<CarbonIntensity>(
        `/intensities/${data.id}`,
        data
      );
      return response.data;
    },
    onError: (error) => onError(error),
    onSuccess: (data) => onSuccess(data),
    onSettled: (data) => {
      if (data) {
        queryClient.setQueryData(
          ["intensities"],
          (prevIntensities: CarbonIntensity[]) => {
            const newIntensities = [...prevIntensities].map((intensity) => {
              if (intensity.id === data.id) {
                return data;
              }
              return intensity;
            });
            return newIntensities.sort((a, b) => dayjs(a.from).diff(b.from));
          }
        );
      }
    },
  });
};

export const useDeleteCarbonIntensity = ({
  onError,
  onSuccess,
}: {
  onError: (error: Error | AxiosError) => void;
  onSuccess: (data: Pick<CarbonIntensity, "id">) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation<
    Pick<CarbonIntensity, "id">,
    Error | AxiosError,
    number | string
  >({
    mutationKey: ["intensities"],
    mutationFn: async (id) => {
      const response = await apiClient.delete<CarbonIntensity>(
        `/intensities/${id}`
      );
      return response.data;
    },
    onError: (error) => onError(error),
    onSuccess: (data) => onSuccess(data),
    onSettled: (data) =>
      queryClient.setQueryData(
        ["intensities"],
        (prevIntensities: CarbonIntensity[]) =>
          prevIntensities.filter((pi) => pi.id !== data?.id)
      ),
  });
};
