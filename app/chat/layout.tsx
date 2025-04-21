import Sidebar from "./Sidebar";

export default async function chatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar>{children}</Sidebar>
    </>
  );
}
