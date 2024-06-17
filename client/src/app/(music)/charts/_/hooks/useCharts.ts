import useSWR from "swr";

type Chart = {
  title: string;
  cover: string;
  urlId: string;
  url: string;
  duration: string;
  view_count: number;
};

type ChartsCategories = {
  [key: string]: Chart[];
};
type ChartsResponse = {
  message: string;
  data: ChartsCategories;
};

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
