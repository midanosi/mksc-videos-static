import Link from 'next/link';
import { courses } from '../../courses';
import { getModeColor } from '../../utils';

export async function getStaticPaths() {
  const modes = ['nonzzmt', 'zzmt', 'sc', 'nolapskips'];

  let paths = [];
  modes.forEach((mode) => {
    paths.push({
      params: { mode }
    });
  });

  return {
    paths,
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  return {
    props: {
      params
    }
  };
}

export default function PickTrack({ params }) {
  const mode = params.mode;
  const modeColor = getModeColor(mode);

  return (
    <main className="relative min-h-screen bg-white m-8">
      <h1 className="text-3xl">Pick Track</h1>
      <h3 className="text-xl font-bold" style={{ color: modeColor }}>
        {mode}
      </h3>
      <div className="py-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-5 mt-6 gap-y-2 gap-x-2">
          {courses.map((course, idx) => {
            const cid = idx * 2;
            return (
              <Link
                key={cid}
                href={{
                  pathname: `/videos/${cid}/${mode}.html`
                  //   query: { cid, mode }
                }}
              >
                <a className="relative md:w-36 md:h-24 overflow-hidden w-16 h-10">
                  <h3 className="text-xs md:text-md bg-gray-800 text-white md:whitespace-nowrap text-center w-full absolute transform -translate-x-1/2 -translate-y-1/2 bg-black-700 top-4 md:top-6 left-1/2 bg-opacity-50">
                    {course.replace('Retro', 'R')}
                  </h3>
                  <img
                    src={`/crs${idx + 1}.png`}
                    alt={`thumbnail for ${course}`}
                    className="h-full w-full"
                  />
                </a>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
