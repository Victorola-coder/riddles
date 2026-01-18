export default function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-[#FFFFFF] rounded-[24px] p-5 animate-float ${className}`}>
      {children}
    </div>
  );
}
