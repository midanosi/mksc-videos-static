import { useRouter } from 'next/router';
import { PrismaClient } from '@prisma/client';
import { courses } from '../courses';

export async function getStaticProps({ params }) {
  const prisma = new PrismaClient();
  // debugger;
  console.log('prisma', prisma);
  const modeNameToModeId = {
    nonzzmt: 0,
    zzmt: 1,
    sc: 2,
    nolapskips: 3
  };
  const cid = 0;
  const modeName = 'test';

  const modeId = modeNameToModeId[modeName];
  const mkscvids = await prisma.mkscvids.findMany({
    where: { cid: Number(cid), mode: modeId },
    // select: { cid: true, link: true, time: true },
    orderBy: { time: 'asc' }
  });

  return {
    props: {
      mkscvids
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
  const arrayIndex = subtractOneIfOdd(cid);
  return courses[arrayIndex];
};

export default function Videos(props) {
  const router = useRouter();
  const mode = router.query.mode;
  const cid = router.query.cid;
  const mkscvids = props.mkscvids;

  return (
    <div className="flex flex-col h-full min-h-screen">
      <header className="flex items-center justify-between p-4 text-white bg-slate-800">
        <h1 className="text-3xl font-bold">
          <a href="/"> Home</a>
        </h1>
      </header>

      <h2>{getCourseName(cid)}</h2>
      <h3>{mode}</h3>

      <main className="flex h-full bg-white">
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
                  URL
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {mkscvids.map((mkscvid) => {
                return (
                  <tr
                    key={mkscvid.cid}
                    className="bg-white border-b dark:border-gray-700 dark:bg-gray-800"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {mkscvid.time}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-white">
                      {mkscvid.player}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-white">
                      <a href={mkscvid.link}>URL</a>
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
