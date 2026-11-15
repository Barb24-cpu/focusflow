import Button from "../components/common/Button";
export default function Dashboard() {
    const stats =[
        {label: "Tasks Done",value:12,color: "text-[#8B5CF6]"},
        {label: "Focus Hours",value:"5h 20m",color: "text-[#22D3EE]"},
        {label: "Commits",value:"18",color: "text-[#10B981]"},
        {label: "Streak",value:"6days",color: "text-[#F59E0B]"}

    ];
    return (<div className="p-6 bg-[#0B0B12] min-h-screen">
      <h1 className="text-white text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-[#1A1A28] border border-[#2A2A3D] rounded-xl p-4">
            <p className="text-[#9CA3AF] text-sm">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-[#1A1A28] border border-[#2A2A3D] rounded-xl p-4 mt-6">
        <h2 className="text-white font-bold">Today's Tasks</h2>
        <p className="text-[#9CA3AF]">Connect to /api/tasks later</p>
        <Button>View Tasks</Button>
      </div>
    </div>
  );
}