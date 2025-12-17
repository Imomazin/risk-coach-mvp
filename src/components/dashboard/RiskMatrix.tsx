import { Card, CardHeader, CardTitle } from '../ui/Card';

interface RiskPoint {
  id: string;
  title: string;
  probability: number; // 1-5
  impact: number; // 1-5
}

interface RiskMatrixProps {
  risks: RiskPoint[];
}

export function RiskMatrix({ risks }: RiskMatrixProps) {
  const getCellColor = (prob: number, impact: number) => {
    const score = prob * impact;
    if (score >= 15) return 'bg-red-100 hover:bg-red-200';
    if (score >= 8) return 'bg-amber-100 hover:bg-amber-200';
    if (score >= 4) return 'bg-yellow-100 hover:bg-yellow-200';
    return 'bg-emerald-100 hover:bg-emerald-200';
  };

  const getRisksInCell = (prob: number, impact: number) => {
    return risks.filter((r) => r.probability === prob && r.impact === impact);
  };

  return (
    <Card padding="none" className="overflow-hidden">
      <CardHeader className="p-6 pb-4">
        <CardTitle>Risk Heat Map</CardTitle>
        <span className="text-sm text-slate-500">Probability vs Impact</span>
      </CardHeader>

      <div className="px-6 pb-6">
        <div className="relative">
          {/* Y-axis label */}
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-medium text-slate-400 whitespace-nowrap">
            Probability
          </div>

          <div className="ml-8">
            {/* Matrix Grid */}
            <div className="grid grid-cols-5 gap-1">
              {[5, 4, 3, 2, 1].map((prob) =>
                [1, 2, 3, 4, 5].map((impact) => {
                  const cellRisks = getRisksInCell(prob, impact);
                  return (
                    <div
                      key={`${prob}-${impact}`}
                      className={`
                        aspect-square rounded-lg ${getCellColor(prob, impact)}
                        flex items-center justify-center cursor-pointer
                        transition-colors duration-200 relative group
                      `}
                      title={
                        cellRisks.length > 0
                          ? cellRisks.map((r) => r.title).join(', ')
                          : `P${prob} x I${impact}`
                      }
                    >
                      {cellRisks.length > 0 && (
                        <div className="w-6 h-6 rounded-full bg-white/80 shadow-sm flex items-center justify-center">
                          <span className="text-xs font-bold text-slate-700">
                            {cellRisks.length}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* X-axis label */}
            <div className="text-center mt-2 text-xs font-medium text-slate-400">
              Impact
            </div>

            {/* X-axis numbers */}
            <div className="grid grid-cols-5 gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <div
                  key={n}
                  className="text-center text-[10px] text-slate-400"
                >
                  {n}
                </div>
              ))}
            </div>
          </div>

          {/* Y-axis numbers */}
          <div className="absolute left-4 top-0 bottom-8 flex flex-col justify-around">
            {[5, 4, 3, 2, 1].map((n) => (
              <div key={n} className="text-[10px] text-slate-400">
                {n}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-emerald-200" />
            <span className="text-xs text-slate-500">Low</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-yellow-200" />
            <span className="text-xs text-slate-500">Medium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-amber-200" />
            <span className="text-xs text-slate-500">High</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-red-200" />
            <span className="text-xs text-slate-500">Critical</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
