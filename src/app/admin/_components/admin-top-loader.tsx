import NextTopLoader from "nextjs-toploader";

export default function AdminTopLoader() {
  return (
    <NextTopLoader
      color="#1A1A1A" // HSL(0, 0%, 10%) converted to hex
      initialPosition={0.08}
      crawlSpeed={300}
      height={3}
      crawl
      showAtBottom={false}
      showSpinner={true}
      easing="ease"
      speed={300}
      zIndex={999999999}
      shadow="0 0 10px #1A1A1A, 0 0 5px #1A1A1A"
    />
  );
}
