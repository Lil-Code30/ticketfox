import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserProfile } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import prisma from "@/lib/db";
import { Shield, Calendar } from "lucide-react";
import { UserRoleManager } from "@/components/user-role-manager";

export default async function SettingsPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  let allUsers: any[] = [];
  if (dbUser?.role === "ADMIN") {
    allUsers = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-[36px] font-semibold leading-tight tracking-tight text-text">
          Profile & Settings
        </h1>
        <p className="text-base text-text-muted">
          Manage your account settings and preferences.
        </p>
      </header>

      <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-3">
        {/* Left Side: TicketFox Profile Info */}
        <div className="flex flex-col gap-6 rounded-xl border border-border bg-surface p-6 md:col-span-1">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-lg font-semibold text-primary">
              {dbUser?.firstName?.charAt(0) ||
                user.primaryEmailAddress?.emailAddress.charAt(0).toUpperCase() ||
                "U"}
            </div>
            <div className="flex flex-col overflow-hidden">
              <h2 className="truncate text-lg font-semibold text-text">
                {dbUser?.firstName} {dbUser?.lastName}
              </h2>
              <p className="truncate text-sm text-text-muted">{dbUser?.email}</p>
            </div>
          </div>

          <div className="h-px w-full bg-border" />

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-text-muted" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-faint">
                  System Role
                </span>
                <span className="text-sm font-medium text-text">
                  {dbUser?.role || "USER"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-text-muted" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-faint">
                  Member Since
                </span>
                <span className="text-sm font-medium text-text">
                  {dbUser?.createdAt
                    ? new Date(dbUser.createdAt).toLocaleDateString()
                    : "Recently"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Clerk UserProfile Component */}
        <div className="flex justify-center md:col-span-2 md:justify-start">
          <UserProfile
            appearance={{
              baseTheme: dark,
              elements: {
                rootBox: "w-full",
                cardBox: "w-full bg-surface border border-border shadow-none rounded-xl",
              },
            }}
            routing="hash"
          />
        </div>
      </div>

      {dbUser?.role === "ADMIN" && (
        <>
          <div className="h-px w-full bg-border" />
          {/* Role Manager Section */}
          <UserRoleManager initialUsers={allUsers} />
        </>
      )}
    </div>
  );
}
