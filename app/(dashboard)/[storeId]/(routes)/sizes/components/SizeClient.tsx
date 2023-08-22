"use client";

import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { Separator } from "@/components/ui/Separator";
import { SizeColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/DateTable";
import { ApiList } from "@/components/ui/ApiList";

interface SizeClientProps {
  data: SizeColumn[];
}

const SizeClient: React.FC<SizeClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Sizes (${data.length})`}
          description="Manage sizes for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />
      <Heading title="API" description="API calls for Sizes" />
      <Separator />
      <ApiList entityName="size" entityIdName="sizeId" />
    </>
  );
};

export default SizeClient;
