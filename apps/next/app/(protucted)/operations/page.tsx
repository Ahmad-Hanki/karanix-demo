import { SearchParams } from "nuqs/server";
import { loadSearchParams } from "./_lib/search-params";
import { OperationsTable } from "./_components/operations-table";
import PreloadData from "./_lib/preload-data";
import { Header } from "@/components/header";

const OperationsPage = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const awaitedParams = await searchParams;
  const loadedParams = loadSearchParams(awaitedParams);
  const { operations } = await PreloadData({ searchParams: loadedParams });

  console.log("OperationsPage loaded operations:", operations);

  return (
    <div className="space-y-4">
      <Header title="Operations" />
      <OperationsTable operations={operations} />
    </div>
  );
};

export default OperationsPage;
