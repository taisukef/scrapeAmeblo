import { HTMLParser } from "https://js.sabae.cc/HTMLParser.js";
import { CSV } from "https://js.sabae.cc/CSV.js";
import { sleep } from "https://js.sabae.cc/sleep.js";

import { DateTime } from "https://js.sabae.cc/DateTime.js";

const scrapeLinks = async (url) => {
  const html = await (await fetch(url)).text();
  const dom = HTMLParser.parse(html);
  const as = dom.querySelectorAll("a");
  return as;
};

const links = CSV.toJSON(await CSV.fetch("./links.csv"));
const res = [];
for (const link of links) {
  const url = link.url;
  const html = await (await fetch(url)).text();
  const dom = HTMLParser.parse(html);
  const cut = (s) => s.substring(1, s.length - 1);
  const title = cut(dom.querySelectorAll("meta").find(m => m.attributes.property == "og:title").attributes.content);
  const date = html.match(/\"entry_created_datetime\"\:\"([^\"]+)\"/)[1];
  const body = dom.querySelector("div#entryBody").text;
  console.log(url, title);
  res.push({ url, date, title, body });
  //break;
  await sleep(200);
}
console.log(res);
await Deno.writeTextFile("contents.csv", CSV.stringify(res));
