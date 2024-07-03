"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

import { attachUUIDToSongs } from "@/app/(music)/_/utils/functions";
import { Categories } from "@/charts/_/components";
import { useCharts } from "@/charts/_/hooks";
import { MusicList, Skeleton } from "@/music/_/components";
import { ChartSongs } from "@/music/_/types";

import styles from "./styles.module.scss";

export function MainChartsContainer() {
  const { charts, chartsIsLoading } = useCharts();
  const { data: session } = useSession();
  const chart = charts?.data || {};

  for (const key in chart) {
    const updatedChart = attachUUIDToSongs(chart[key]);
    chart[key] = updatedChart;
  }

  const firstChart = Object.keys(chart)[0];
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    if (charts) {
      const cachedCategory = localStorage.getItem("selectedCategory");
      setSelectedCategory(cachedCategory || firstChart);
    }
  }, [firstChart, charts]);

  const payload = {
    songs: chart[selectedCategory] as ChartSongs[],
    message: selectedCategory,

    type: "chart",
    id: selectedCategory,
  };

  const chartList = chartsIsLoading ? (
    <div className={styles.chartsListSkeletonContainer}>
      <Skeleton className={styles.chartsListSkeleton} amount={5} />
    </div>
  ) : (
    <MusicList data={payload} session={session!} />
  );

  return (
    <div className={styles.chartsMainContainer}>
      <div className={styles.text}>
        <h2>Top Charts</h2>
        <div onClick={toggleDropdown} className={styles.dropdown}>
          <IoIosArrowDown
            onClick={toggleDropdown}
            className={showDropdown ? styles.dropdownIconOpen : styles.dropdownIcon}
          />
          <p>{selectedCategory}</p>
        </div>
      </div>

      <div
        className={
          showDropdown ? styles.chartsCategoriesContainerOpen : styles.chartsCategoriesContainer
        }
      >
        <Categories data={chart} setSelectedCategory={setSelectedCategory} />
      </div>
      {chartList}
    </div>
  );
}
