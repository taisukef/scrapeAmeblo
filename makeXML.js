import { HTMLParser } from "https://js.sabae.cc/HTMLParser.js";
import { CSV } from "https://js.sabae.cc/CSV.js";
import { fix0 } from "https://js.sabae.cc/fix0.js";
import { encodeHTML } from "https://js.sabae.cc/encodeHTML.js";
import { DateTime } from "https://js.sabae.cc/DateTime.js";

const scrapeLinks = async (url) => {
  const html = await (await fetch(url)).text();
  const dom = HTMLParser.parse(html);
  const as = dom.querySelectorAll("a");
  return as;
};

/*
<title>サイト表示時に全面表示するお知らせ記述タグ popup-message #js</title>
<guid>https://fukuno.jig.jp/3301</guid>
<pubDate>Sun, 8 Aug 2021 23:55:00 +0900</pubDate>
<description><![CDATA[<p>
*/

const contents = CSV.toJSON(await CSV.fetch("./contents.csv"));
contents.reverse();
const yearcnt = {};
for (const c of contents) {
  let html = c.body;
  const dom = HTMLParser.parse(html);
  const imgs = dom.querySelectorAll("img").map(i => i.attributes.src);
  //console.log(imgs);
  for (const img of imgs) {
    if (img.startsWith("https://img-proxy.blog-video.jp/")) {
      continue;
    }
    const n = img.match(/(\d+.jpg)/);
    if (!n) {
      continue;
    }
    const fn = n[1];
    html = html.replace(img, "https://fukuno.jig.jp/imgab/" + fn);
    html = html.replace(img, "https://fukuno.jig.jp/imgab/" + fn);
  }

  const dt = new DateTime(c.date);
  let y = yearcnt[dt.day.year];
  if (!y) {
    y = yearcnt[dt.day.year] = 1;
  } else {
    y++;
    yearcnt[dt.day.year] = y;
  }
  const id = dt.day.year + fix0(y, 3);
  //console.log(dt.day.toString(), y, id);
  const guid = "https://fukuno.jig.jp/" + id;

//  <style>.PhotoSwipeImage { width: 610px }</style>

  const s = `<item>
<title>${c.title} #sabaephoto #photo</title>
<guid>${guid}</guid>
<pubDate>${dt.toStringRFC2822()}</pubDate>
<description><![CDATA[<p>
<style>.PhotoSwipeImage { display: block }</style>
${html}
</p>]]></description>
</item>`;
  const dir = id.substring(0, id.length - 2);
  
  Deno.mkdir("xml/" + dir, { recursive: true });
  const fn = "xml/" + dir + "/" + id + ".xml";
  console.log("xml/" + dir, fn);
  await Deno.writeTextFile(fn, s);
}
