var chart = echarts.init(document.getElementById("candlestick_chart"));

var tag_trends_location = "/static/data/frame5.json";

var trend_data = [];
$.ajax({
    type: 'GET',
    url: tag_trends_location,
    dataType: 'json',
    success: function(tag_trends_data) {trend_data = tag_trends_data;},
    async: false
});

// Min date - 2008-08
// Max date - 2016-10
var all_date_val = [];
// Generate the dates for the x-axis
function all_dates () {

    max_date = '2016/10';

    var curr_yr = 2008;
    var end_yr = 2016;

    var mnth = 8;

    for (curr_yr; curr_yr < (end_yr+1); curr_yr++ ) {

        for (mnth; mnth < 13; mnth ++) {
            var temp_date = curr_yr.toString() + '/' + mnth.toString();
            if(mnth < 10) {
                var temp_date = curr_yr.toString() + '/0' + mnth.toString();
            }

            all_date_val.push(temp_date);

            if (temp_date == max_date) {
                break;
            }
        }
        mnth = 1;
    }
}

// Given a tag and its
function fill_date_vals (all_dates_present, values) {

    var curr_values = Array.apply(null, Array(all_date_val.length)).map(Number.prototype.valueOf,0);

    for (var i = 0; i < all_dates_present.length; i++) {

        var curr_index = all_date_val.indexOf(all_dates_present[i]);
        curr_values[curr_index] = parseFloat(values[i]);
    }
    return(curr_values);
}

window.tags_selected = legendData.slice(0, 6);

var javascript_trend_data = {};

function only_javascript() {

    var tags_chosen = window.tags_selected;

    var curr_dates = [];
    var curr_values = [];
    var all_trend_data = [];
    var reg = /\('(.*?)',\s+(.*?)\)/g;
    for (var i = 0; i < trend_data.length; i++) {
        all_trend_data.push(trend_data[i]["V1"]);
    }

    for (var i = 0; i< tags_chosen.length; i++) {

        var curr_tag_index = all_trend_data.indexOf(tags_chosen[i]);

        var curr_trend = trend_data[curr_tag_index]["V2"];
        curr_trend = curr_trend.replace(/-/g, '/');
        var curr_trend_after = Array.from(curr_trend.matchAll(reg));

        for (var j = 0; j < curr_trend_after.length; j++) {
            curr_dates.push(curr_trend_after[j][1]);
            curr_values.push(curr_trend_after[j][2])
        }
        var current_tag_values = fill_date_vals(curr_dates, curr_values);
        curr_dates = [];
        curr_values = [];
        javascript_trend_data[tags_chosen[i]] = current_tag_values;
    }

}

all_dates();
only_javascript();

var candlestick_options = {
    /*backgroundColor: '#21202D',*/
    backgroundColor: '#ffffff',
    legend: {
        /*data: ['Tag1', 'Tag2', 'Tag3', 'Tag4'],*/
        data: window.tags_selected,
        inactiveColor: '#777',
        textStyle: {
            color: '#21202D'
        }
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            animation: false,
            type: 'cross',
            lineStyle: {
                color: '#376df4',
                width: 2,
                opacity: 1
            }
        }
    },
    xAxis: {
        type: 'category',
        data: all_date_val,
        axisLine: { lineStyle: { color: '#8392A5' } }
    },
    yAxis: {
        scale: true,
        axisLine: { lineStyle: { color: '#8392A5' } },
        splitLine: { show: false }
    },
    grid: {
        bottom: 80
    },
    dataZoom: [{
        textStyle: {
            color: '#8392A5'
        },
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        dataBackground: {
            areaStyle: {
                color: '#8392A5'
            },
            lineStyle: {
                opacity: 0.8,
                color: '#8392A5'
            }
        },
        handleStyle: {
            color: '#fff',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2
        }
    }, {
        type: 'inside'
    }],
    animation: true,
    series: [
        {
            name: window.tags_selected[0],
            type: 'line',
                data: javascript_trend_data[window.tags_selected[0]],
            smooth: true,
            showSymbol: false,
            lineStyle: {
                normal: {
                    width: 1
                }
            }
        },
        {
            name: window.tags_selected[1],
            type: 'line',
            data: javascript_trend_data[window.tags_selected[1]],
            smooth: true,
            showSymbol: false,
            lineStyle: {
                normal: {
                    width: 1
                }
            }
        },
        {
            name: window.tags_selected[2],
            type: 'line',
            data: javascript_trend_data[window.tags_selected[2]],
            smooth: true,
            showSymbol: false,
            lineStyle: {
                normal: {
                    width: 1
                }
            }
        },
        {
            name: window.tags_selected[3],
            type: 'line',
            data: javascript_trend_data[window.tags_selected[3]],
            smooth: true,
            showSymbol: false,
            lineStyle: {
                normal: {
                    width: 1
                }
            }
        },
        {
            name: window.tags_selected[4],
            type: 'line',
            data: javascript_trend_data[window.tags_selected[4]],
            smooth: true,
            showSymbol: false,
            lineStyle: {
                normal: {
                    width: 1
                }
            }
        },
        {
            name: window.tags_selected[5],
            type: 'line',
            data: javascript_trend_data[window.tags_selected[5]],
            smooth: true,
            showSymbol: false,
            lineStyle: {
                normal: {
                    width: 1
                }
            }
        }
    ]
};

chart.setOption(candlestick_options);

window.onresize = chart.resize;

function fill_data(current_tags) {

    var tags_chosen = current_tags;
    var all_new_data = {};

    var curr_dates = [];
    var curr_values = [];
    var all_trend_data = [];
    var reg = /\('(.*?)',\s+(.*?)\)/g;
    for (var i = 0; i < trend_data.length; i++) {
        all_trend_data.push(trend_data[i]["V1"]);
    }

    for (var i = 0; i< tags_chosen.length; i++) {

        var curr_tag_index = all_trend_data.indexOf(tags_chosen[i]);

        var curr_trend = trend_data[curr_tag_index]["V2"];
        curr_trend = curr_trend.replace(/-/g, '/');
        var curr_trend_after = Array.from(curr_trend.matchAll(reg));

        for (var j = 0; j < curr_trend_after.length; j++) {
            curr_dates.push(curr_trend_after[j][1]);
            curr_values.push(curr_trend_after[j][2])
        }
        var current_tag_values = fill_date_vals(curr_dates, curr_values);
        curr_dates = [];
        curr_values = [];
        all_new_data[tags_chosen[i]] = current_tag_values;
    }

    var updated_data = []
    for(var i=0;i<tags_chosen.length;i++) {
        temp_value = {
            name: tags_chosen[i],
            type: 'line',
            data: all_new_data[tags_chosen[i]],
            smooth: true,
            showSymbol: false,
            lineStyle: {
                normal: {
                    width: 1
                }
            }
        }

        updated_data.push(temp_value);
        temp_value = {};
    }

    candlestick_options.xAxis.data = all_date_val;

    candlestick_options.legend.data = tags_chosen;
    candlestick_options.series = updated_data;

    chart.setOption(candlestick_options, {notMerge: true});
    window.onresize = candlestick_options.resize;

}