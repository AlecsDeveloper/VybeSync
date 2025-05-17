// import { Innertube, UniversalCache } from "youtubei.js"
// import YTMusic from "ytmusic-api"

// const ytmusic = new YTMusic();
// let yt: Innertube;
// let ytmusicLoaded = false;

// async function getAudioSource(videoId: string) {
//   const res = await yt.getStreamingData(videoId, {
//     type: "audio",
//     client: "WEB_EMBEDDED",
//   })

//   return res;
// }

// async function Main(YouTubeQuery: string) {
//   if (!ytmusicLoaded) {
//     await ytmusic.initialize();
//     yt = await Innertube.create({ cache: new UniversalCache(true) });
//     ytmusicLoaded = true;
//   }

//   const res = await ytmusic.searchSongs(YouTubeQuery);
//   if (res.length < 1) return console.warn("No results.");

//   const song = res[2];
//   const data = await getAudioSource(song.videoId);

//   console.log(data.url);
// }


// Main("Taylor Swift");