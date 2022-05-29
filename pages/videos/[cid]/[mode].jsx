import { PrismaClient } from '@prisma/client';
import { courses } from '../../../courses';
import { getModeColor } from '../../../utils';

function chunkArray(a, chunk) {
  if (a.length <= chunk) return [a];
  let arr = [];
  a.forEach((_, i) => {
    if (i % chunk === 0) arr.push(a.slice(i, i + chunk));
  });
  const [left_overs] = arr.filter((a) => a.length < chunk);
  arr = arr.filter((a) => a.length >= chunk);
  arr[arr.length - 1] = [...arr[arr.length - 1], ...left_overs];
  return arr;
}

export async function getStaticPaths() {
  const cids = [...Array(80).keys()];
  const modes = ['nonzzmt', 'zzmt', 'sc', 'nolapskips'];

  let paths = [];
  cids.forEach((cid) => {
    modes.forEach((mode) => {
      paths.push({
        params: { cid: String(cid), mode }
      });
    });
  });

  return {
    paths,
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const prisma = new PrismaClient();
  const modeNameToModeId = {
    nonzzmt: 0,
    zzmt: 1,
    sc: 2,
    nolapskips: 3
  };

  const modeId = modeNameToModeId[params.mode];
  const mkscvids = await prisma.mkscvids.findMany({
    where: { cid: Number(params.cid), mode: modeId },
    // select: { cid: true, link: true, time: true },
    orderBy: { time: 'asc' }
  });
  const ytNameItems = await prisma.mkscytnames.findMany();
  const channelIdToPlayerNameMap = Object.fromEntries(
    ytNameItems.map((item) => [item.id, item.name])
  );

  const ytLinksInChunksOf50 = chunkArray(
    mkscvids.map((vid) => vid.link),
    50
  );
  for (let chunk of ytLinksInChunksOf50) {
    const arrayOfLinks = chunk.map((link) => link.slice(0, 11)); // always exactly 11 chars, remove \t=12s etc.
    const concattedLinks = arrayOfLinks.join(',');

    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${concattedLinks}&key=AIzaSyATN_FTkF9ehCDRJa4IaketQD3jMDlNTw8&part=snippet&fields=items(snippet,id)`
    );
    const json = await res.json();

    json.items?.forEach((item) => {
      const videoId = item.id;
      const snippet = item.snippet;
      if (!snippet) return;

      const channelId = snippet.channelId;
      const date = snippet.publishedAt;

      const playerName = channelIdToPlayerNameMap[channelId];

      const matchingVid = mkscvids.find((vid) => vid.link === videoId);
      if (matchingVid) {
        const dateobj = new Date(date);
        matchingVid.date = dateobj.toLocaleDateString('en-US');

        if (playerName) {
          matchingVid.player = playerName;
        }
      }
    });
  }

  return {
    props: {
      mkscvids,
      params
    }
  };
}
const subtractOneIfOdd = (i) => {
  if (i % 2 === 0) {
    return i;
  }
  return i - 1;
};
const getCourseName = (cid) => {
  const arrayIndex = subtractOneIfOdd(cid) / 2;
  return courses[arrayIndex];
};

export default function Videos(props) {
  const mkscvids = props.mkscvids;
  const mode = props.params.mode;
  const cid = Number(props.params.cid);

  const courseLapType = cid % 2 === 0 ? 'Course' : 'Flap';
  const otherTypeCid = courseLapType === 'Course' ? cid + 1 : cid - 1;

  return (
    <div className="flex flex-col h-full min-h-screen">
      <header className="flex items-center justify-between p-4 bg-slate-800">
        <h3 className="font-bold">
          <a href="/"> Home</a>
        </h3>
      </header>

      <main className="h-full bg-white ml-20">
        <div
          className="flex justify-between items-center"
          style={{ width: '26rem' }}
        >
          <div className="p-4">
            <h1 className="text-3xl whitespace-nowrap mb-2 font-bold">
              {getCourseName(cid)}
            </h1>
            <div className="flex items-end gap-2 mb-2">
              {['Course', 'Flap'].map((type) => {
                return (
                  <a
                    className="hover:underline"
                    style={{
                      color: getModeColor(type),
                      fontWeight: courseLapType === type ? '500' : 'normal',
                      opacity: courseLapType === type ? 1 : 0.5,
                      fontSize: courseLapType === type ? '1.4rem' : '1rem',
                      lineHeight: courseLapType === type ? '1' : '1.2'
                    }}
                    href={`/videos/${otherTypeCid}/${mode}`}
                  >
                    {type}
                  </a>
                );
              })}
            </div>
            <div className="flex items-end gap-4">
              {['nonzzmt', 'zzmt', 'sc', 'nolapskips'].map((modeOption) => (
                <a
                  className="text-xl hover:underline"
                  style={{
                    color: getModeColor(modeOption),
                    fontWeight: mode === modeOption ? 'bold' : 'normal',
                    opacity: mode === modeOption ? 1 : 0.5,
                    fontSize: mode === modeOption ? '1.4rem' : '1rem',
                    lineHeight: mode === modeOption ? '1' : '1.2'
                  }}
                  href={`/videos/${otherTypeCid}/${modeOption}`}
                >
                  {modeOption}
                </a>
              ))}
            </div>
          </div>
          <img
            src={`/crs${subtractOneIfOdd(cid) / 2 + 1}.png`}
            alt={`thumbnail for ${getCourseName(cid)}`}
            className="w-40 h-30 overflow-hidden"
          />
        </div>
        <div className="h-full border-r shadow-md w-80 bg-gray-50 sm:rounded-lg">
          <table className="min-w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                >
                  Time
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                >
                  Player
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                >
                  URL
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {mkscvids?.map((mkscvid) => {
                function formatTime(time) {
                  return time.toFixed(2);
                }
                return (
                  <tr
                    key={mkscvid.link}
                    className="bg-white border-b dark:border-gray-700 dark:bg-gray-800"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {mkscvid.time.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-white">
                      {mkscvid.player}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-white">
                      {mkscvid.date}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-white underline">
                      <a href={`https://youtu.be/${mkscvid.link}`}>URL</a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
