"use client";
import { useCharts } from "@/charts/_/hooks";

export function Chartlist() {
  const { charts } = useCharts();
  console.log(charts, "charts");
  return <div style={{ color: "white" }}>Chart list will be Here</div>;
}
