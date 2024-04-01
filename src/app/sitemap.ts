// import {
//     getAllCategories,
//     getAllPostSlugsWithModifyTime
//   } from "@/utils/getData";
  import { MetadataRoute } from "next";
   
//   The sitemap can be wrapped in a Promise as well
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const defaultPages = [
      {
        url: "https://r0yce.com",
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1
      },
      {
        url: "https://r0yce.com/about",
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.9
      },
      {
        url: "https://r0yce.com/contact",
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.9
      }
      // other pages
    ];
   
    // const postSlugs = await getAllPostSlugsWithModifyTime();
   
    const sitemap = [
      ...defaultPages,
    //   ...postSlugs.map((e: any) => ({
    //     url: `https://dminhvu.com/${e.slug}`,
    //     lastModified: e.modified_at,
    //     changeFrequency: "daily",
    //     priority: 0.8
    //   })),
    ];
   
    return sitemap as MetadataRoute.Sitemap;
  }