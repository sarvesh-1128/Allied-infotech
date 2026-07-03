// Re-usable ECharts Dashboard Component for Corporate Performance Dashboard
import * as echarts from 'echarts';

export class ChartDashboard {
  private chartInstance: echarts.ECharts | null = null;
  private resizeHandler: () => void;

  constructor() {
    this.resizeHandler = this.handleResize.bind(this);
  }

  public init() {
    const chartDom = document.getElementById('performance-chart');
    if (!chartDom) return;

    // Initialize ECharts instance
    this.chartInstance = echarts.init(chartDom);
    
    // Performance Matrix Data
    const years = ['FY 21-22', 'FY 22-23', 'FY 23-24', 'FY 24-25', 'FY 25-26'];
    const kongerData = [320.00, 680.00, 885.00, 1100.00, 1265.00]; // Ningbo Konger IMM
    const antBrotherData = [5.50, 15.00, 27.50, 30.00, 34.50];    // Ant Brother Moulds
    const szyData = [200.00, 60.00, 87.50, 120.00, 138.00];      // Shangzhiyou QMC
    const othersData = [3.00, 0.55, 75.00, 15.00, 17.25];         // Peripheral Accessories

    const option: echarts.EChartsOption = {
      color: ['#0059B3', '#38BDF8', '#00C781', '#FF9F43'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#0B1329'
          }
        },
        backgroundColor: 'rgba(11, 19, 41, 0.95)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        textStyle: {
          color: '#F8FAFC',
          fontFamily: 'Inter, sans-serif',
          fontSize: 12
        },
        formatter: (params: any) => {
          let html = `<div style="font-weight: 700; margin-bottom: 6px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 4px;">${params[0].axisValue} Bookings</div>`;
          let total = 0;
          params.forEach((item: any) => {
            const val = parseFloat(item.value);
            total += val;
            html += `
              <div style="display: flex; justify-content: space-between; gap: 15px; margin: 3px 0; align-items: center;">
                <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${item.color};"></span>
                <span style="color: #94A3B8; font-size: 11px;">${item.seriesName}:</span>
                <span style="font-weight: 600; color: #FFFFFF;">₹${val.toFixed(2)}M</span>
              </div>
            `;
          });
          html += `
            <div style="display: flex; justify-content: space-between; gap: 15px; margin-top: 6px; padding-top: 6px; border-top: 1px dashed rgba(255,255,255,0.1); font-weight: 700;">
              <span style="color: #38BDF8; font-size: 12px;">Consolidated:</span>
              <span style="color: #38BDF8;">₹${total.toFixed(2)}M</span>
            </div>
          `;
          return html;
        }
      },
      legend: {
        data: ['Ningbo Konger IMM', 'Ant Brother Moulds', 'Shangzhiyou QMC', 'Accessories & Others'],
        textStyle: {
          color: '#cbd5e1',
          fontFamily: 'Inter, sans-serif',
          fontSize: 11
        },
        itemGap: 12,
        bottom: 0
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '12%',
        top: '8%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: years,
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          },
          axisLabel: {
            color: '#94a3b8',
            fontFamily: 'Inter, sans-serif'
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: 'Value (₹ Millions)',
          nameTextStyle: {
            color: '#94a3b8',
            fontFamily: 'Inter, sans-serif',
            fontSize: 10
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.05)'
            }
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          },
          axisLabel: {
            color: '#94a3b8',
            fontFamily: 'Inter, sans-serif',
            formatter: '₹{value}M'
          }
        }
      ],
      series: [
        {
          name: 'Ningbo Konger IMM',
          type: 'line',
          stack: 'Total',
          smooth: true,
          lineStyle: {
            width: 3
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.15
          },
          emphasis: {
            focus: 'series'
          },
          data: kongerData
        },
        {
          name: 'Ant Brother Moulds',
          type: 'line',
          stack: 'Total',
          smooth: true,
          lineStyle: {
            width: 3
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.15
          },
          emphasis: {
            focus: 'series'
          },
          data: antBrotherData
        },
        {
          name: 'Shangzhiyou QMC',
          type: 'line',
          stack: 'Total',
          smooth: true,
          lineStyle: {
            width: 3
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.15
          },
          emphasis: {
            focus: 'series'
          },
          data: szyData
        },
        {
          name: 'Accessories & Others',
          type: 'line',
          stack: 'Total',
          smooth: true,
          lineStyle: {
            width: 3
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.15
          },
          emphasis: {
            focus: 'series'
          },
          data: othersData
        }
      ]
    };

    // Render options
    this.chartInstance.setOption(option);

    // Bind window resize handler
    window.addEventListener('resize', this.resizeHandler);
  }

  private handleResize() {
    if (this.chartInstance) {
      this.chartInstance.resize();
    }
  }

  public destroy() {
    window.removeEventListener('resize', this.resizeHandler);
    if (this.chartInstance) {
      this.chartInstance.dispose();
      this.chartInstance = null;
    }
  }
}
