import { Inbox } from 'lucide-react';

const EmptyQueue = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white border border-[#E2E8F0] rounded-xl border-dashed">
      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
        <Inbox className="w-6 h-6 text-slate-400" />
      </div>
      <h3 className="text-lg font-medium text-slate-900 mb-1">Queue is empty</h3>
      <p className="text-slate-500 text-sm text-center">You have no active or assigned tickets at the moment. Enjoy your day!</p>
    </div>
  );
};

export default EmptyQueue;
