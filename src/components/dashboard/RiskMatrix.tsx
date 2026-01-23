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
    // High contrast risk-led colors
    if (score >= 20) return 'heatmap-cell heatmap-cell--extreme'; // Critical - glowing red
    if (score >= 15) return 'heatmap-cell heatmap-cell--high'; // High risk
    if (score >= 8) return 'heatmap-cell heatmap-cell--medium'; // Medium - amber
    if (score >= 4) return 'bg-yellow-400/60 dark:bg-yellow-600/50 hover:bg-yellow-400/80'; // Low-medium
    return 'heatmap-cell heatmap-cell--low'; // Low - olive green
  };

  const getCellTextColor = (prob: number, impact: number) => {
    const score = prob * impact;
    if (score >= 15) return 'text-white font-bold';
    if (score >= 8) return 'text-white font-semibold';
    return 'text-slate-800 dark:text-white font-medium';
  };

  const getRisksInCell = (prob: number, impact: number) => {
    return risks.filter((r) => r.probability === prob && r.impact === impact);
  };

  return (
    <Card padding="none" className="overflow-hidden">
      <CardHeader className="p-6 pb-4">
        <CardTitle>Risk Heat Map</CardTitle>
        <span className="text-sm text-slate-500 dark:text-slate-400">Probability vs Impact</span>
      </CardHeader>

      <div className="px-6 pb-6">
        <div className="relative">
          {/* Y-axis label */}
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
            Probability
          </div>

          <div className="ml-8">
            {/* Matrix Grid */}
            <div className="grid grid-cols-5 gap-1">
              {[5, 4, 3, 2, 1].map((prob) =>
                [1, 2, 3, 4, 5].map((impact) => {
                  const cellRisks = getRisksInCell(prob, impact);
                  const score = prob * impact;
                  const isExtreme = score >= 20;

                  return (
                    <div
                      key={`${prob}-${impact}`}
                      className={`
                        aspect-square rounded-md ${getCellColor(prob, impact)}
                        flex items-center justify-center cursor-pointer
                        transition-all duration-200 relative group
                        ${isExtreme ? 'animate-pulse' : ''}
                      `}
                      style={isExtreme ? { boxShadow: '0 0 15px rgba(220, 38, 38, 0.5)' } : undefined}
                      title={
                        cellRisks.length > 0
                          ? cellRisks.map((r) => r.title).join(', ')
                          : `P${prob} x I${impact} = ${score}`
                      }
                    >
                      {cellRisks.length > 0 && (
                        <div
                          className={`
                            w-7 h-7 rounded-md flex items-center justify-center
                            ${score >= 15
                              ? 'bg-white/90 dark:bg-black/50 shadow-md'
                              : 'bg-white/70 dark:bg-slate-900/70 shadow-sm'
                            }
                          `}
                          style={isExtreme ? { boxShadow: '0 0 8px rgba(220, 38, 38, 0.4)' } : undefined}
                        >
                          <span className={`text-sm ${getCellTextColor(prob, impact)} ${score >= 15 ? 'text-risk-600' : ''}`}>
                            {cellRisks.length}
                          </span>
                        </div>
                      )}

                      {/* Tooltip on hover */}
                      {cellRisks.length > 0 && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                          <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-md shadow-lg whitespace-nowrap">
                            <div className="font-semibold">{cellRisks.length} risk{cellRisks.length > 1 ? 's' : ''}</div>
                            <div className="text-slate-300">Score: {score}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* X-axis label */}
            <div className="text-center mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Impact
            </div>

            {/* X-axis numbers */}
            <div className="grid grid-cols-5 gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <div
                  key={n}
                  className="text-center text-[11px] font-medium text-slate-500 dark:text-slate-400"
                >
                  {n}
                </div>
              ))}
            </div>
          </div>

          {/* Y-axis numbers */}
          <div className="absolute left-4 top-0 bottom-8 flex flex-col justify-around">
            {[5, 4, 3, 2, 1].map((n) => (
              <div key={n} className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {n}
              </div>
            ))}
          </div>
        </div>

        {/* Legend - risk semantic colors */}
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-olive-500" style={{ boxShadow: '0 0 4px rgba(125, 145, 86, 0.4)' }} />
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Low</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-yellow-500" />
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Medium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-amber-500" />
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">High</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-risk-500" style={{ boxShadow: '0 0 6px rgba(220, 38, 38, 0.5)' }} />
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Critical</span>
          </div>
        </div>

        {/* Micro-copy status */}
        <div className="text-center mt-3">
          <span className="status-micro status-micro--attention">
            {risks.filter(r => r.probability * r.impact >= 15).length > 0
              ? `${risks.filter(r => r.probability * r.impact >= 15).length} risks require attention`
              : 'No critical risks identified'}
          </span>
        </div>
      </div>
    </Card>
  );
}
