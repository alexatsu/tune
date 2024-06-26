"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

import { MusicList, Skeleton } from "@/app/(music)/_/components";
import { ChartSongs } from "@/app/(music)/_/types";
import { Categories } from "@/charts/_/components";
import { useCharts } from "@/charts/_/hooks";

import styles from "./styles.module.scss";

export function MainChartsContainer() {
  const { charts, chartsIsLoading } = useCharts();
  const { data: session } = useSession();
  const chart = charts?.data || {};
  const firstChart = Object.keys(chart)[0];
  const [selectedCategory, setSelectedCategory] = useState<string>(firstChart);
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    if (charts) {
      setSelectedCategory(firstChart);
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
        <IoIosArrowDown
          onClick={toggleDropdown}
          className={showDropdown ? styles.dropdownIconOpen : styles.dropdownIcon}
        />
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
