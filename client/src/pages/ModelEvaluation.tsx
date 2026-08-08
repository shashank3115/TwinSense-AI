import { useEffect, useState } from "react";
import { getModelEvaluation } from "@/services/predictionService";
import { Card } from "@/components/ui/card";

export default function ModelEvaluation() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const eval_metrics = await getModelEvaluation();
      setMetrics(eval_metrics);
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  const getMetricColor = (classical: number | null, twinsense: number | null) => {
    if (!classical || !twinsense) return "text-muted-foreground";
    if (twinsense > classical) return "text-green-400";
    if (twinsense < classical) return "text-red-400";
    return "text-foreground";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">AI vs Classical Baseline</h2>
        <p className="text-muted-foreground">
          Evaluating multi-sensor AI against conventional threshold-based monitoring.
        </p>
      </div>

      {/* Warning Box */}
      <Card className="bg-amber-500/10 border border-amber-500/30 p-4">
        <p className="text-sm text-amber-300">
          <span className="font-semibold">Demo Mode:</span> These are illustrative/placeholder metrics from the simulation.
          They demonstrate the expected performance improvements of sensor fusion. In production, these would be populated from
          the Python evaluation pipeline with real experimental results.
        </p>
      </Card>

      {/* Comparison Table */}
      <Card className="bg-card border-border p-6 overflow-x-auto">
        <h3 className="text-lg font-bold text-foreground mb-4">Performance Metrics</h3>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Metric</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Classical Baseline</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-semibold">TwinSense AI</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Improvement</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric, idx) => {
              const improvement =
                metric.classicalBaseline && metric.twinSenseAI
                  ? metric.twinSenseAI - metric.classicalBaseline
                  : null;
              const improvementPercent =
                metric.classicalBaseline && improvement
                  ? ((improvement / metric.classicalBaseline) * 100).toFixed(1)
                  : null;

              return (
                <tr key={idx} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                  <td className="py-3 px-4 text-foreground font-medium">{metric.metric}</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {metric.classicalBaseline !== null ? `${metric.classicalBaseline}${metric.unit}` : "N/A"}
                  </td>
                  <td className={`py-3 px-4 font-semibold ${getMetricColor(metric.classicalBaseline, metric.twinSenseAI)}`}>
                    {metric.twinSenseAI !== null ? `${metric.twinSenseAI}${metric.unit}` : "N/A"}
                  </td>
                  <td className={`py-3 px-4 font-semibold ${getMetricColor(metric.classicalBaseline, metric.twinSenseAI)}`}>
                    {improvement !== null && improvementPercent
                      ? `${improvement > 0 ? "+" : ""}${improvement}${metric.unit} (${improvementPercent}%)`
                      : "N/A"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {/* Key Insights */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Key Insights</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-sm text-green-300 font-semibold mb-2">Higher Accuracy</p>
            <p className="text-xs text-green-300/70">
              TwinSense AI achieves 94% accuracy vs 82% for threshold-based monitoring.
            </p>
          </div>

          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-blue-300 font-semibold mb-2">Earlier Detection</p>
            <p className="text-xs text-blue-300/70">
              18 hours lead time vs 6 hours for classical baseline enables proactive maintenance.
            </p>
          </div>

          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <p className="text-sm text-purple-300 font-semibold mb-2">Fewer False Alarms</p>
            <p className="text-xs text-purple-300/70">
              4% false alarm rate reduces unnecessary maintenance interventions.
            </p>
          </div>
        </div>
      </Card>

      {/* Methodology */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Evaluation Methodology</h3>

        <div className="space-y-3 text-sm text-foreground">
          <p>
            <span className="font-semibold">Classical Baseline:</span> Threshold-based monitoring using fixed limits for each
            sensor. Alerts triggered when any sensor exceeds its threshold.
          </p>

          <p>
            <span className="font-semibold">TwinSense AI:</span> Multi-sensor fusion with machine learning anomaly detection.
            Learns normal operating patterns and detects deviations across all sensors simultaneously.
          </p>

          <p>
            <span className="font-semibold">Dataset:</span> Industrial motor operating data with synthetic fault scenarios
            (bearing degradation, overheating, rotor imbalance, motor overload).
          </p>

          <p>
            <span className="font-semibold">Metrics:</span> Standard ML evaluation metrics (accuracy, precision, recall, F1
            score) plus domain-specific metrics (false alarm rate, detection lead time, inference latency).
          </p>
        </div>
      </Card>

      {/* Integration Info */}
      <Card className="bg-blue-500/10 border border-blue-500/30 p-4">
        <p className="text-sm text-blue-300">
          <span className="font-semibold">Production Integration:</span> To connect real model evaluation results, update the
          `getModelEvaluation()` function in `predictionService.ts` to call your Python/FastAPI evaluation pipeline endpoint.
          The frontend will automatically display the real metrics.
        </p>
      </Card>
    </div>
  );
}
