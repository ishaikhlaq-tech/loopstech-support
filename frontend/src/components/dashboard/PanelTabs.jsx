const PanelTabs = ({ activePanel, setActivePanel }) => {
  const base = 'px-4 py-1.5 text-[13px] font-bold rounded-[5px] h-full flex items-center justify-center transition-all duration-150 cursor-pointer';
  const active = 'bg-[#CCFBF1] border border-[#5EEAD4] text-[#0F766E] shadow-sm';
  const inactive = 'bg-white border border-transparent text-[#64748B] hover:text-[#475569]';

  return (
    <div className="flex items-center bg-[#F1F5F9] p-1 rounded-[7px] h-[36px] gap-0.5">
      <button
        onClick={() => setActivePanel('my')}
        className={`${base} ${activePanel === 'my' ? active : inactive}`}
      >
        My Panel
      </button>
      <button
        onClick={() => setActivePanel('dept')}
        className={`${base} ${activePanel === 'dept' ? active : inactive}`}
      >
        Dept Panel
      </button>
    </div>
  );
};

export default PanelTabs;
