import { useRouter } from 'next/router';
import Link from 'next/link';
import { courses } from '../courses';

export default function PickTrack() {
  const router = useRouter();

  const mode = router.query.mode;
  return (
    <main className="relative min-h-screen bg-white m-8">
      <h1 className="text-3xl">Pick Track</h1>
      <h3 className="text-xl">{mode}</h3>
      <div className="px-4 py-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-5 mt-6 gap-y-2 gap-x-2">
          {courses.map((course, idx) => {
            const cid = idx * 2;
            return (
              <Link
                key={cid}
                href={{
                  pathname: `/videos/${cid}/${mode}`
                }}
              >
                <a className="relative w-36 h-24 overflow-hidden">
                  <h3 className="bg-gray-800 text-white whitespace-nowrap text-center w-full absolute transform -translate-x-1/2 -translate-y-1/2 bg-black-700 top-6 left-1/2 bg-opacity-50">
                    {course}
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
