// Chart Analysis Module for Trading Platform
// Provides interactive chart functionality for technical analysis

class ChartAnalysis {
    constructor(containerId) {
        this.containerId = containerId;
        this.chart = null;
        this.init();
    }

    init() {
        this.chart = echarts.init(document.getElementById(this.containerId));
        this.setupChart();
    }

    setupChart() {
        // Generate sample OHLC data
        const data = this.generateSampleData();
        
        const option = {
            backgroundColor: 'transparent',
            title: {
                text: 'EUR/USD - Analiza Techniczna',
                textStyle: {
                    color: '#fbbf24',
                    fontSize: 16,
                    fontWeight: 'bold'
                },
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    animation: false,
                    label: {
                        backgroundColor: '#505765'
                    }
                },
                backgroundColor: 'rgba(31, 41, 55, 0.9)',
                borderColor: '#6b7280',
                textStyle: {
                    color: '#f9fafb'
                }
            },
            legend: {
                data: ['Cena', 'SMA 20', 'SMA 50'],
                textStyle: {
                    color: '#9ca3af'
                },
                top: 30
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: data.dates,
                scale: true,
                boundaryGap: false,
                axisLine: { onZero: false },
                splitLine: { show: false },
                min: 'dataMin',
                max: 'dataMax',
                axisPointer: {
                    z: 100
                },
                axisLabel: {
                    color: '#9ca3af'
                }
            },
            yAxis: {
                scale: true,
                splitArea: {
                    show: true
                },
                axisLabel: {
                    color: '#9ca3af'
                },
                splitLine: {
                    lineStyle: {
                        color: '#374151'
                    }
                }
            },
            series: [
                {
                    name: 'EUR/USD',
                    type: 'candlestick',
                    data: data.ohlc,
                    itemStyle: {
                        color: '#10b981',
                        color0: '#ef4444',
                        borderColor: '#10b981',
                        borderColor0: '#ef4444'
                    }
                },
                {
                    name: 'SMA 20',
                    type: 'line',
                    data: data.sma20,
                    smooth: true,
                    lineStyle: {
                        opacity: 0.8,
                        color: '#fbbf24'
                    }
                },
                {
                    name: 'SMA 50',
                    type: 'line',
                    data: data.sma50,
                    smooth: true,
                    lineStyle: {
                        opacity: 0.8,
                        color: '#8b5cf6'
                    }
                }
            ]
        };

        this.chart.setOption(option);
        
        // Make chart responsive
        window.addEventListener('resize', () => {
            this.chart.resize();
        });
    }

    generateSampleData() {
        const dates = [];
        const ohlc = [];
        const sma20 = [];
        const sma50 = [];
        
        // Generate 60 days of sample data
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 60);
        
        let basePrice = 1.1800;
        
        for (let i = 0; i < 60; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            dates.push(currentDate.toISOString().split('T')[0]);
            
            // Generate realistic price movement
            const volatility = 0.005;
            const trend = Math.sin(i / 10) * 0.002;
            const randomChange = (Math.random() - 0.5) * volatility;
            
            basePrice += trend + randomChange;
            
            const open = basePrice + (Math.random() - 0.5) * 0.001;
            const close = basePrice + (Math.random() - 0.5) * 0.001;
            const high = Math.max(open, close) + Math.random() * 0.002;
            const low = Math.min(open, close) - Math.random() * 0.002;
            
            ohlc.push([open, close, low, high]);
        }
        
        // Calculate SMAs
        for (let i = 0; i < dates.length; i++) {
            // SMA 20
            if (i >= 19) {
                const sum20 = ohlc.slice(i - 19, i + 1).reduce((acc, val) => acc + val[1], 0);
                sma20.push(sum20 / 20);
            } else {
                sma20.push(null);
            }
            
            // SMA 50
            if (i >= 49) {
                const sum50 = ohlc.slice(i - 49, i + 1).reduce((acc, val) => acc + val[1], 0);
                sma50.push(sum50 / 50);
            } else {
                sma50.push(null);
            }
        }
        
        return { dates, ohlc, sma20, sma50 };
    }

    addSupportResistance(levels) {
        const option = this.chart.getOption();
        
        levels.forEach(level => {
            option.series.push({
                name: level.name,
                type: 'line',
                data: new Array(option.xAxis[0].data.length).fill(level.value),
                lineStyle: {
                    color: level.color || '#ef4444',
                    type: 'dashed',
                    width: 2
                },
                symbol: 'none',
                tooltip: {
                    formatter: function(params) {
                        return level.name + ': ' + level.value;
                    }
                }
            });
        });
        
        this.chart.setOption(option);
    }

    addTechnicalIndicators(indicators) {
        const option = this.chart.getOption();
        
        indicators.forEach(indicator => {
            switch (indicator.type) {
                case 'bollinger':
                    this.addBollingerBands(option, indicator);
                    break;
                case 'rsi':
                    this.addRSI(option, indicator);
                    break;
                case 'macd':
                    this.addMACD(option, indicator);
                    break;
            }
        });
        
        this.chart.setOption(option);
    }

    addBollingerBands(option, indicator) {
        const data = this.chart.getOption().series[0].data;
        const period = indicator.period || 20;
        const multiplier = indicator.multiplier || 2;
        
        const sma = [];
        const upper = [];
        const lower = [];
        
        for (let i = 0; i < data.length; i++) {
            if (i >= period - 1) {
                const slice = data.slice(i - period + 1, i + 1);
                const mean = slice.reduce((acc, val) => acc + val[1], 0) / period;
                
                const variance = slice.reduce((acc, val) => {
                    return acc + Math.pow(val[1] - mean, 2);
                }, 0) / period;
                
                const stdDev = Math.sqrt(variance);
                
                sma.push(mean);
                upper.push(mean + (stdDev * multiplier));
                lower.push(mean - (stdDev * multiplier));
            } else {
                sma.push(null);
                upper.push(null);
                lower.push(null);
            }
        }
        
        option.series.push({
            name: 'BB Upper',
            type: 'line',
            data: upper,
            lineStyle: { color: '#6b7280', width: 1 },
            symbol: 'none'
        });
        
        option.series.push({
            name: 'BB Lower',
            type: 'line',
            data: lower,
            lineStyle: { color: '#6b7280', width: 1 },
            symbol: 'none'
        });
    }

    addRSI(option, indicator) {
        // RSI implementation would go here
        // This is a simplified version
        const data = this.chart.getOption().series[0].data;
        const period = indicator.period || 14;
        
        // Calculate RSI
        const rsi = [];
        for (let i = 0; i < data.length; i++) {
            if (i >= period) {
                let gains = 0;
                let losses = 0;
                
                for (let j = i - period + 1; j <= i; j++) {
                    const change = data[j][1] - data[j - 1][1];
                    if (change > 0) gains += change;
                    else losses -= change;
                }
                
                const rs = gains / losses;
                rsi.push(100 - (100 / (1 + rs)));
            } else {
                rsi.push(null);
            }
        }
        
        // Add RSI subplot (simplified)
        console.log('RSI calculated:', rsi.filter(val => val !== null));
    }

    addMACD(option, indicator) {
        // MACD implementation would go here
        console.log('MACD indicator added');
    }

    markChartPatterns(patterns) {
        patterns.forEach(pattern => {
            this.highlightArea(pattern.startIndex, pattern.endIndex, pattern.color);
        });
    }

    highlightArea(startIndex, endIndex, color = 'rgba(251, 191, 36, 0.2)') {
        const option = this.chart.getOption();
        
        option.series.push({
            name: 'Pattern Highlight',
            type: 'bar',
            data: new Array(option.xAxis[0].data.length).fill(null),
            itemStyle: {
                color: color
            },
            barWidth: '100%',
            tooltip: {
                show: false
            }
        });
        
        // Fill the highlighted area
        for (let i = startIndex; i <= endIndex; i++) {
            option.series[option.series.length - 1].data[i] = 1;
        }
        
        this.chart.setOption(option);
    }

    addDrawingTools() {
        // Enable drawing tools
        this.chart.setOption({
            toolbox: {
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    restore: {},
                    saveAsImage: {}
                },
                iconStyle: {
                    borderColor: '#9ca3af'
                }
            },
            brush: {
                toolbox: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'],
                brushStyle: {
                    borderWidth: 1,
                    color: 'rgba(251, 191, 36, 0.3)',
                    borderColor: '#fbbf24'
                }
            }
        });
    }

    destroy() {
        if (this.chart) {
            this.chart.dispose();
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChartAnalysis;
}