var config = {
    type: 'bar',
    data: {
        labels: ["default"],
        datasets: [
            highArr={
                label: ['Delenya'],
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: ['rgb(207, 0, 0, 0.5)','rgb(54, 162, 235)','rgb(154, 162, 235)'],
                borderColor: 'red',
                borderWidth: 2,
                order:2
            },
            {
                type: 'line',
                label: 'Line',
                data: [1,2,3],
                fill: false,
                borderColor: 'rgb(54, 162, 235)',
                borderWidth: 2,
                order:1
            },
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                },
            }],
        },
    }
};