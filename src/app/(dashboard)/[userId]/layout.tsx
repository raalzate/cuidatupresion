import Navbar from "@/components/shared/navbar/navbar";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  console.log({ userId });

  return (
    <>
      <Navbar />

      {children}
    </>
  );
}
