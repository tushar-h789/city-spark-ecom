import { Navbar } from "./navbar";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
  isContainer?: boolean;
}

export function ContentLayout({
  title,
  children,
  isContainer = true,
}: ContentLayoutProps) {
  return (
    <div>
      <Navbar title={title} />
      <div className={isContainer ? "container pt-8 pb-4 px-4 sm:px-8" : ""}>
        {children}
      </div>
    </div>
  );
}
