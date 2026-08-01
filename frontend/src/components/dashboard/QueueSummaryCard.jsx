const QueueSummaryCard = () => {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
      <h3 className="font-semibold text-slate-900 mb-4">Queue Summary</h3>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center"><span className="text-sm text-slate-600">Unassigned</span><span className="font-medium text-slate-900">12</span></div>
        <div className="flex justify-between items-center"><span className="text-sm text-slate-600">Open</span><span className="font-medium text-slate-900">45</span></div>
        <div className="flex justify-between items-center"><span className="text-sm text-slate-600">Pending</span><span className="font-medium text-slate-900">8</span></div>
      </div>
    </div>
  );
};

export default QueueSummaryCard;
