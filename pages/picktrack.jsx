import { useRouter } from 'next/router';
import Link from 'next/link';

const tracks = [
  {
    cid: 0,
    title: 'Peach Circuit'
  }
];

export default function PickTrack() {
  const router = useRouter();

  const mode = router.query.mode;
  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      <h1>Pick Track</h1>
      <h3>Mode: {mode}</h3>
      <div className="px-4 py-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-5 mt-6 gap-y-2">
          {tracks.map((track) => {
            return (
              <>
                <Link
                  key={track.cid}
                  href={{
                    pathname: `/videos/${track.cid}/${mode}`
                  }}
                >
                  <a className={`relative`}>
                    <h3 className="absolute transform -translate-x-1/2 -translate-y-1/2 bg-black-700 top-2 left-1/2 bg-opacity-20">
                      {track.title}
                    </h3>
                    <img
                      src={`/${track.cid}.png`}
                      alt={`thumbnail for ${track.title}`}
                    />
                  </a>
                </Link>
              </>
            );
          })}
        </div>
      </div>
    </main>
  );
}
