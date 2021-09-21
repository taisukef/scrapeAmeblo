import { HTMLParser } from "https://js.sabae.cc/HTMLParser.js";
import { CSV } from "https://js.sabae.cc/CSV.js";
import { sleep } from "https://js.sabae.cc/sleep.js";
import { fetchBin } from "https://js.sabae.cc/fetchBin.js";

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
const res = [];
const files = [];
for (const c of contents) {
  const dom = HTMLParser.parse(c.body);
  const imgs = dom.querySelectorAll("img").map(i => i.attributes.src);
  //console.log(imgs);
  for (const img of imgs) {
    if (img.startsWith("https://img-proxy.blog-video.jp/images?url=")) {
      //https://img-proxy.blog-video.jp/images?url=http%3A%2F%2Fclub.jig.jp%2Ftaisuke%2Fphoto%2Fnigi2%2Fsabanyan.jpg
      const url = decodeURIComponent(img.substring("https://img-proxy.blog-video.jp/images?url=".length));
      console.log(url);
      continue;
    }
    if (true) {
      continue;
    }
    //console.log(img)
    const n = img.match(/(\d+.jpg)/);
    if (!n) {
      continue;
    }
    const fn = n[1];
    if (fn == "10061040378.jpg") {
      console.log(img);
    }
    if (res.indexOf(fn) >= 0) {
      console.log(fn, img, res[res.indexOf(fn)]);
    }
    res.push(fn);
    files.push({ url: img, fn });
  }
}
/*
for (const f of files) {
  const bin = await fetchBin(f.url);
  console.log(f.fn);
  await Deno.writeFile("imgab/" + f.fn, bin);
  await sleep(100);
  //break;
}
*/