import { redirect } from "next/navigation"
import { auth } from "@/auth"
import NoSiteBusinessFinderClient from "@/components/custom/no-site-business-finder-client"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export default async function NoSiteBusinessFinderPage() {
  const session = await auth()

  if (!session?.user) {
    redirect(
      `/auth/sign-in?callbackUrl=${encodeURIComponent("/misc/no-site-business-finder")}`
    )
  }

  return <NoSiteBusinessFinderClient />
}
