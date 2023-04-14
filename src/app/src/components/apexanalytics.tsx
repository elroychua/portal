import React, { Component } from "react";
import Chart from "react-apexcharts";

interface AnalyticsBarProps {
  analyticsResults: any;
  confidence: number;
  currentVideoKey: string | undefined;
  currentFrame: number;
  useDarkTheme: boolean;
  callbacks: any;
}

export default class AnalyticsBar extends Component<AnalyticsBarProps> {
  constructor(props: AnalyticsBarProps) {
    super(props);
  }

  render(): JSX.Element {
    const options = {
        // theme: {
        //     mode: this.props.useDarkTheme ? "dark" : "light",
        // },
        chart: {
          zoom: {
            enabled: true,
            type: 'x',  
            autoScaleYaxis: false,  
            zoomedArea: {
              fill: {
                color: '#90CAF9',
                opacity: 0.4
              },
              stroke: {
                color: '#0D47A1',
                opacity: 0.4,
                width: 1
              }
            }
        },
          id: "line-chart",
          type: "line",
          toolbar: {
            show: false,
          },
        },
        xaxis: {
          type: "numeric",
          labels: {
            formatter: (value: number) => `Time: ${value.toFixed(2)}s`,
            style: {
              colors: "#ffffff",
            },
          },
        },
        yaxis: {
          forceNiceScale: true,
          labels: {
              style: {
                colors: "#ffffff",
              },
            },
        },
        tooltip: {
            theme: "dark",
            style: {
                fontSize: '10px',
                fontFamily: undefined,
              },
            x: {
                show: false,
            },
        },
        flexDirection: 'row',
        fixed: {
          enabled: false,
          position: 'topRight',
          offsetX: 0,
          offsetY: 0,
        },
        stroke: {
          curve: "smooth",
        },
        dataLabels: {
          enabled: false,
        },
        legend: {
          labels: {colors: "#ffffff"},
        }
      };

    const data = this.props.analyticsResults[
      this.props.currentVideoKey ?? ""
    ] ?? [[]];

    const displayData = Object.values(data)
      .map((arr: any) =>
        arr
          .filter((doc: any) => doc.confidence >= this.props.confidence)
          .map((doc: any) => doc.tag.name)
          .reduce(
            (a: Record<string, number>, b: string) =>
              b in a ? { ...a, [b]: a[b] + 1 } : { ...a, [b]: 1 },
            {}
          )
      )
      .map((doc: any, index: number) => {
        return {
          ...doc,
          time: index / this.props.currentFrame,
        };
      });

    const uniqueKeys: Set<string> = displayData.reduce(
      (a: Set<string>, b: Record<string, number>) =>
        new Set([...a, ...Object.keys(b)]),
      new Set<string>()
    );
    uniqueKeys.delete("time");

    const series = Array.from(uniqueKeys).map(key => {
      return {
        name: key,
        data: displayData.map(doc => ({ x: doc.time, y: doc[key] ?? 0 }))
        // .filter(point => point.y !== 0),
      };
    });

    return (
      <div className="app" style={{ width: "100%",  overflow: "auto" }}>
        <Chart options={options} series={series} type="line" height={200} />
      </div>
    );
  }
}