import * as cheerio from "cheerio";

const parseHTML = async () => {
  const url = "https://www.billboard.com/charts/hot-100/";

  const res = await fetch(url).then((res) => res.text());
  const $ = cheerio.load(res);

  const products = [] as { title: string; artist: string }[];

  $(".lrv-u-width-100p").each((i: number, el: cheerio.Element) => {
    const ul = $(el).find("ul.lrv-a-unstyle-list > li:first");

    const title = ul
      .find("h3")
      .text()
      .replace(/[\t\n]/g, "");
    const artist = ul
      .find("span")
      .text()
      .trim()
      .replace(/[\t\n]/g, "");

    const escapes = ["Follow Billboard on Facebook", "Account"];

    products.push({
      title: escapes.includes(title) ? "" : title,
      artist: escapes.includes(artist) ? "" : artist,
    });
  });

  const removeEmpty = (products: { title: string; artist: string }[]) => {
    return products.filter((product) => product.title && product.artist);
  };

  console.log(removeEmpty(products));
};

parseHTML();
