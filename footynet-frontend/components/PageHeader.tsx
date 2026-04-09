interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-12">
      <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-1">{title}</h1>
      <p className="text-sm text-neutral-500">{subtitle}</p>
    </div>
  );
}
