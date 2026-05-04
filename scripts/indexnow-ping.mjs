// Notifies IndexNow (Bing, Yandex, etc.) that the listed URLs were updated.
// Run after a production deploy:
//
//   node scripts/indexnow-ping.mjs
//
// Docs: https://www.indexnow.org/documentation
//
// The key file at /<KEY>.txt must be reachable on the live host (it lives in
// public/ so Vite serves it as a static asset).

const HOST = "musicaenvivo.co";
const KEY = "84aa1fd9bb21344d7b14266d8e4765e4";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const URL_LIST = [
  `https://${HOST}/`,
  `https://${HOST}/mariachi`,
  `https://${HOST}/nortena`,
  `https://${HOST}/banda`,
  `https://${HOST}/serenatas`,
  `https://${HOST}/eventos-corporativos`,
  `https://${HOST}/bodas`,
  `https://${HOST}/cumpleanos`,
  `https://${HOST}/serenata-mama`,
  `https://${HOST}/faq`,
];

async function main() {
  const body = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: URL_LIST,
  };
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  console.log(`IndexNow ${res.status} ${res.statusText}`);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.log(text);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
