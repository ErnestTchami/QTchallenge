interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={`bg-white/80 backdrop-blur-sm rounded-lg shadow-xl ring-1 ring-indigo-900/5 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
