import { getPlaiceholder } from "plaiceholder";

export type ImageBlurDataMap = {
  [key: string]: {
    base64: string;
    img: {
      src: string;
      height: number;
      width: number;
    };
  } | null;
};

export async function getImageBlurData(src: string) {
  try {
    const buffer = await fetch(src).then(async (res) =>
      Buffer.from(await res.arrayBuffer())
    );

    const {
      metadata: { height, width },
      base64,
    } = await getPlaiceholder(buffer, { size: 10 });

    return {
      base64,
      img: { src, height, width },
    };
  } catch (error) {
    console.error("Error generating blur data:", error);
    return null;
  }
}
