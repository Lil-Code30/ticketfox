import { PageHeader } from "@/components/page-header";
import { FilesClient } from "@/components/files/files-client";
import { getFiles } from "@/app/actions/files";

export const dynamic = "force-dynamic";

export default async function FilesPage() {
  const { data: files, success } = await getFiles();

  if (!success) {
    return (
      <div className="p-12 text-center text-red-500">
        Failed to load files.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Files"
        description="Manage uploaded files and attachments for your knowledge base."
      />
      <FilesClient initialFiles={files || []} />
    </div>
  );
}
