"use client";

import JoinRoom from "@/components/JoinRoom";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const params = useParams();
  const [spaceId, setSpaceId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof params.spaceId === "string") {
      setSpaceId(params.spaceId);
    } else if (Array.isArray(params.spaceId)) {
      setSpaceId(params.spaceId[0]); // in case it's a dynamic catch-all route
    }
  }, [params]);

  if (!spaceId) return <div>Loading...</div>;

  return <JoinRoom spaceId={spaceId} />;
};

export default Page;
