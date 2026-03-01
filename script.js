document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------
    // 1. 메인 차트: 매매/전세/월세 9개월 다중 선형 차트
    // -------------------------------------------------------------------
    const ctxMain = document.getElementById('mainTrendsChart').getContext('2d');
    
    // 차트 색상 정의 (Cobalt Blue, Light Blue, Grey)
    const colorJeonse = '#0047AB';
    const colorTrading = '#4A90E2';
    const colorRent = '#ADB5BD';

    new Chart(ctxMain, {
        type: 'line',
        data: {
            labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월'],
            datasets: [
                {
                    label: '전세 (Jeonse)',
                    data: [100.5, 101.2, 102.1, 103.0, 103.8, 104.5, 105.2, 106.0, 106.55],
                    borderColor: colorJeonse,
                    backgroundColor: 'rgba(0, 71, 171, 0.1)', // 그라데이션 대신 단일 투명색 적용
                    borderWidth: 3,
                    tension: 0.4, // 부드러운 곡선
                    fill: false,
                    pointBackgroundColor: colorJeonse,
                    pointHoverRadius: 6,
                },
                {
                    label: '매매 (Trading)',
                    data: [100.2, 100.5, 100.8, 101.4, 101.6, 102.0, 102.3, 102.7, 102.94],
                    borderColor: colorTrading,
                    borderWidth: 2,
                    tension: 0.4,
                    fill: false,
                    pointHoverRadius: 5,
                },
                {
                    label: '월세 (Rent)',
                    data: [100.0, 100.3, 100.7, 101.1, 101.5, 102.0, 102.5, 102.8, 103.39],
                    borderColor: colorRent,
                    borderWidth: 2,
                    tension: 0.4,
                    fill: false,
                    pointBorderColor: 'transparent',
                    pointHoverRadius: 5,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        font: {
                            family: "'Inter', sans-serif"
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 29, 32, 0.9)',
                    titleFont: { family: "'Inter', sans-serif" },
                    bodyFont: { family: "'Inter', sans-serif" },
                    padding: 10,
                    cornerRadius: 8
                }
            },
            scales: {
                x: {
                    grid: { display: false }
                },
                y: {
                    min: 99, // Y-axis starts near 100
                    grid: {
                        color: 'rgba(233, 236, 239, 0.5)', // 연한 그리드 유지
                        drawBorder: false, // 축 테두리 제거 (미니멀)
                    }
                }
            }
        }
    });

    // -------------------------------------------------------------------
    // 2. 우측 사이드바: 전세가율 반원(Semi-Donut) 차트
    // -------------------------------------------------------------------
    const ctxRatio = document.getElementById('ratioDonutChart').getContext('2d');
    
    // 전국 평균 비교선 데이터 (약 68.3%)
    const jeonseRatioValue = 49.9;
    const jeonseRemainder = 100 - jeonseRatioValue;

    new Chart(ctxRatio, {
        type: 'doughnut',
        data: {
            labels: ['전세가율', '나머지'],
            datasets: [{
                data: [jeonseRatioValue, jeonseRemainder],
                backgroundColor: [colorJeonse, '#E9ECEF'],
                borderWidth: 0, // 테두리 없음
                circumference: 180, // 반원 모양
                rotation: 270,    // 시작점 (상단)
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '80%', // 얇은 도넛
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            }
        },
        plugins: [{
            // 비교선(68.3%) 그리기 커스텀 플러그인
            id: 'comparisonLine',
            afterDatasetDraw(chart, args, options) {
                const { ctx, width, height } = chart;
                ctx.save();
                
                // 중심 좌표
                const xCenter = width / 2;
                const yCenter = height / 2 + (chart.chartArea.height / 2) - 10;
                
                // 바깥/안쪽 반지름 측정
                const outerRadius = chart.getDatasetMeta(0).data[0].outerRadius;
                const innerRadius = chart.getDatasetMeta(0).data[0].innerRadius;
                
                // 68.3% 각도 계산 (π ~ 2π 사이)
                const angle = Math.PI + (Math.PI * (68.3 / 100));
                
                // 선 시작, 끝 지점
                const xIn = xCenter + innerRadius * Math.cos(angle);
                const yIn = yCenter + innerRadius * Math.sin(angle);
                const xOut = xCenter + outerRadius * Math.cos(angle);
                const yOut = yCenter + outerRadius * Math.sin(angle);
                
                ctx.beginPath();
                ctx.moveTo(xIn, yIn);
                ctx.lineTo(xOut, yOut);
                ctx.strokeStyle = '#ADB5BD'; // 회색 마커선
                ctx.lineWidth = 2;
                ctx.stroke();
                
                ctx.restore();
            }
        }]
    });

    // -------------------------------------------------------------------
    // 3. 온도계 애니메이션 트리거 (화면 로드 후)
    // -------------------------------------------------------------------
    setTimeout(() => {
        const fluid = document.querySelector('.thermometer-fluid');
        if(fluid) {
            fluid.style.height = '35%'; // 목표 지점으로 부드럽게 상승
        }
    }, 500);
});
