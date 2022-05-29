import '../styles/global.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />;
      <div className="absolute top-0 right-0 p-4 w-16 h-16">
        <a href="https://github.com/midanosi/mksc-videos-static">
          <img src="/GitHub-Mark-64px.png" />
        </a>
      </div>
    </>
  );
}
