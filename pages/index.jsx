import { getModeColor } from './utils';

const modes = [
  {
    id: 'nonzzmt',
    title: 'Non-ZZMT',
    desc: 'PP Rules (Non-SC)',
    desc2: 'ZZMTs banned'
  },
  {
    id: 'zzmt',
    title: 'ZZMT',
    desc: 'PP Rules (Non-SC)',
    desc2: 'ZZMTs allowed'
  },
  {
    id: 'sc',
    title: 'SC',
    desc: 'PP Rules (SC)',
    desc2: 'Ticking, lapskips, and all shortcuts are allowed'
  },
  {
    id: 'nolapskips',
    title: 'No Lapskips',
    desc: 'SC, but no lapskips'
  }
];

export default () => (
  <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
    <h1>MKSC Videos</h1>
    <div className="px-4 py-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="flex flex-wrap justify-center gap-8 mt-6">
        {modes.map((mode) => {
          const modeColor = getModeColor(mode.id);
          return (
            <a
              key={mode.id}
              href={`/picktrack?mode=${mode.id}`}
              className={`flex h-16 w-32 justify-center p-1 grayscale transition hover:grayscale-0 focus:grayscale-0`}
            >
              <h3 style={{ color: modeColor }}>{mode.title}</h3>
              <span>{mode.desc}</span>
              {mode.desc2 ? <span>{mode.desc2}</span> : null}
            </a>
          );
        })}
      </div>
    </div>
  </main>
);
