export default function PageTitle({ children }: { children: string }) {
  return (
    <h2 className="text-2xl font-bold leading-9 text-[#242731]">{children}</h2>
  );
}
