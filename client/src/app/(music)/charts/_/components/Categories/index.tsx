"use client";
import { Dispatch, memo, SetStateAction } from "react";

import { ChartsCategories } from "@/app/(music)/_/types";
import { randomRGBPastelColor } from "@/shared/utils/functions";

import styles from "./styles.module.scss";

type CategoriesProps = {
  data: ChartsCategories;
  setSelectedCategory: Dispatch<SetStateAction<string>>;
};

const Categories = memo(function Categories({ data, setSelectedCategory }: CategoriesProps) {
  const attachBorderToCategories = () => {
    const category = Object.keys(data);

    type Category = { category: string; border: string };
    const result = [] as Category[];

    for (const chart of category) {
      const [r, g, b] = randomRGBPastelColor();
      const categoryName = chart.split("-chart")[0];
      const randomBorder = `1px solid rgb(${r},${g},${b}, 0.7)`;
      result.push({ category: categoryName, border: randomBorder });
    }
    return result;
  };

  const categories = attachBorderToCategories();

  return (
    <ul className={styles.categoriesList}>
      {categories.map(({ category, border }) => {
        return (
          <li
            className={styles.categriesListItem}
            style={{ border }}
            key={crypto.randomUUID()}
            onClick={() => setSelectedCategory(category + "-chart")}
          >
            {category}
          </li>
        );
      })}
    </ul>
  );
});

export { Categories };
