import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();


// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    serverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(async() => {
            const userId  = await auth();
            console.log("✔✔✔✔✔✔✔✔✔✔✔✔✔✔✔✔", userId.userId)
            if (!userId) throw new UploadThingError("Unauthorized");
            return { userId: userId.userId };
        })
        .onUploadComplete(({ metadata, file }) => {
            console.log("Upload complete", file.ufsUrl);
        }),

    messageFile: f(["image", "pdf"])
        .middleware(async() => {
          const userId  = await auth();
          console.log("😂😂😂😂😂😂😂😂😂", userId.userId)
         if (!userId) throw new UploadThingError("Unauthorized");
         return { userId: userId.userId };
    })
        .onUploadComplete(({ metadata, file }) => {
            console.log("File uploaded", file.ufsUrl);
            
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
