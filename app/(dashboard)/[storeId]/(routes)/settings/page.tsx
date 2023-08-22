import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

import prismaDb from "@/lib/prismaDb";
import SettingsForm from "./components/SettingsForm";

interface SettingsProps {
  params: {
    storeId: string;
  };
}

const Settings: React.FC<SettingsProps> = async ({ params }) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }
  const store = await prismaDb.store.findFirst({
    where: {
      userId,
      id: params.storeId,
    },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={store} />
      </div>
    </div>
  );
};

export default Settings;
