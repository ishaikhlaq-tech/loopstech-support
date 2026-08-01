const DashboardHeader = ({ title, subtitle }) => {
  return (
    <div className="flex flex-col gap-0.5">
      <h1 className="text-[20px] font-bold text-[#0F172A] leading-tight">{title}</h1>
      <p className="text-[13px] text-[#64748B] font-medium tracking-wide">{subtitle}</p>
    </div>
  );
};

export default DashboardHeader;
