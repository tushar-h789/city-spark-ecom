import NextTopLoader from "nextjs-toploader";

export default function StoreTopLoader() {
  // Converting HSL(30, 98%, 44%) to hex: #DE7802
  return (
    <NextTopLoader
      color="#DE7802"
      initialPosition={0.08}
      crawlSpeed={300}
      height={2}
      crawl
      showAtBottom={false}
      showSpinner={true}
      easing="ease"
      speed={300}
      zIndex={999999999}
      shadow="0 0 10px #DE7802, 0 0 5px #DE7802"
    />
  );
}
