import useSWR from "swr";

import { ChartsResponse } from "@/app/(music)/_/types";

export function useCharts() {
  const url = `http://localhost:8020/charts/get-all`;

  const fetchAllCharts = async () => {
    const response = await fetch(url);

    return response.json();
  };

  const swrOptions = {
    revalidateOnFocus: false,
  };

  const {
    data: charts,
    error: chartsError,
    isLoading: chartsIsLoading,
    mutate: chartsMutate,
  } = useSWR<ChartsResponse>(url, fetchAllCharts, swrOptions);

  return {
    charts,
    chartsError,
    chartsIsLoading,
    chartsMutate,
  };
}
