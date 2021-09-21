import { HTMLParser } from "https://js.sabae.cc/HTMLParser.js";
import { CSV } from "https://js.sabae.cc/CSV.js";

const scrapeLinks = async (url) => {
  const html = await (await fetch(url)).text();
  const dom = HTMLParser.parse(html);
  const as = dom.querySelectorAll("a");
  return as;
};

const res = [];
for (let i = 1; i <= 10; i++) {
  const url = "https://ameblo.jp/taisukef/entrylist" + (i == 1 ? "" : "-" + i) + ".html";
  const as = await scrapeLinks(url);
  const as2 = as.map(a => a.attributes.href);
  const as3 = as2.filter(s => s.startsWith("/taisukef/entry-")).map(s => "https://ameblo.jp" + s);
  as3.forEach(a => res.push({ url: a }));
}
await Deno.writeTextFile("links.csv", CSV.stringify(res));

