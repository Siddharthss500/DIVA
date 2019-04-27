var piechart_chart = echarts.init(document.getElementById("pie_chart"))

/*Location of data - tags related to selected Top programming language*/
var related_tags_location = "/static/data/frame3_new.json";

var related_tags = [];
$.ajax({
    type: 'GET',
    url: related_tags_location,
    dataType: 'json',
    success: function(related_tags_data) {related_tags = related_tags_data;},
    async: false
});

var questions_links_location = "/static/data/tags_qid.json";

var ques_links = [];
$.ajax({
    type: 'GET',
    url: questions_links_location,
    dataType: 'json',
    success: function(question_links_data) {
        ques_links = question_links_data;
        },
    async: false
});

var legendData = [];
var seriesData = [];
var selected = {};
var all_selected = [];

// var tags_selected;

var data = genData(holder.value);

var pichart_option = {
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        type: 'scroll',
        orient: 'vertical',
        right: 10,
        top: 20,
        bottom: 20,
        data: data.legendData,
        selected: data.selected
    },
    series : [
        {
            name: '',
            type: 'pie',
            radius : '55%',
            center: ['40%', '50%'],
            data: data.seriesData,
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};

function genData(selected_tag) {

    for (var i = 0; i < related_tags.length; i++) {

        if (selected_tag === related_tags[i]["V1"]) {

            var tags = related_tags[i]["V2"];
            tags = tags.replace(/'/g, '"');
            tags = JSON.parse(tags);

            /*console.log(selected_tag);*/

/*            legendData = [];
            seriesData = [];
            selected = {};*/

            legendData.length = 0;
            seriesData.length = 0;
            selected.length = 0;

            for (var j = 0; j < tags.length; j++) {

                for (key_tag_val in tags[j]) {

                    // tag_val = tags[j];
                    tag_val = key_tag_val;

                    legendData.push(tag_val);
                    seriesData.push({
                        name: tag_val,
                        value: tags[j][key_tag_val]
                        // value: Math.round(Math.random() * 100000)
                    });
                    selected[tag_val] = j < 6;
                }
            }

            ques_and_ans_tags();
            question_links();
            /*tags_selected = legendData.slice(0,6);*/

            return {
                legendData: legendData,
                seriesData: seriesData,
                selected: selected
            };

        }

    }

}


/*Function to update the tags for Questions and Answers*/

function ques_and_ans_tags () {

    var tags_list = document.getElementById("all_tags_list");
    while(tags_list.hasChildNodes()) {
        tags_list.removeChild(tags_list.firstChild);
    }

    all_selected.length = 0;

    while(all_selected.length>0) {
        all_selected.pop();
    }

    for (var index in selected) {
        if (selected[index] == true) {
            all_selected.push(index);
        }
    }

    for(var k=0; k<legendData.length; k++) {
        var option = document.createElement('option');
        option.text = legendData[k];

        if(selected[legendData[k]] == true) {
            option.selected = "selected";
        }
        tags_list.add(option)
    }
}

function question_links () {

    var ques_list = document.getElementById("ques_table");
    while(ques_list.hasChildNodes()) {
        ques_list.removeChild(ques_list.firstChild);
    }

    var tag_list = [];
    var related_tags_list = [];
    var array_list;

    /*Get all the keys from the json object*/
    for (key in ques_links) {

        related_tags_list.push(key);

        var relevant_tag_list = key;
        relevant_tag_list = relevant_tag_list.replace(/'/g, '"');
        relevant_tag_list = JSON.parse(relevant_tag_list);

        tag_list.push(relevant_tag_list[0])
    }

    for(var i=0; i<tag_list.length; i++) {

        if (tag_list[i] == holder.value) {
            array_list = ques_links[related_tags_list[i]];
        }

    }


    for(var j=0;j<array_list.length;j++){
        var td = document.createElement('td');

        var link = "https://stackoverflow.com/questions/" + array_list[j] + "/";
        var a = document.createElement('a');

        a.setAttribute("href", link);
        a.setAttribute("target", "_blank");

        a.appendChild(document.createTextNode(link));
        td.appendChild(a);

        var tr = document.createElement('tr');
        tr.appendChild(td);
        ques_list.appendChild(tr)
    }

}

function shuffle(arra1) {
    var ctr = arra1.length, temp, index;

// While there are elements in the array
    while (ctr > 0) {
// Pick a random index
        index = Math.floor(Math.random() * ctr);
// Decrease ctr by 1
        ctr--;
// And swap the last element with it
        temp = arra1[ctr];
        arra1[ctr] = arra1[index];
        arra1[index] = temp;
    }
    return arra1;
}

/*Store the top users that correspond to the click*/
wordcloud_chart.on("CLICK", function (x){
    holder.value = x.data.name;
    get_top_user(x.data.name);
    data = genData(holder.value);
    piechart_chart.setOption(pichart_option);
    window.tags_selected = legendData.slice(0,6);
    candlestick_options.series.map(function(x, i){x.name = this[i];}, window.tags_selected);

    candlestick_options.legend.data = window.tags_selected;
    chart.setOption(candlestick_options);
});

// If legend is added or deleted

piechart_chart.on("legendselectchanged", function (y) {
    selected = y.selected;
    ques_and_ans_tags();

    current_total_selected = 0
    curr_tags = []

    for(var key in selected) {
        if (selected[key] == true) {
            current_total_selected += 1
            curr_tags.push(key)
        }
    }

    var data = rawData.map(function (item) {
    return [+item[1], +item[2], +item[5], +item[6]];
    });

    // Set the data candlestick_options.series using a for loop
    updated_data = []
    day_count_value = 10
    for(var i=0;i<current_total_selected;i++) {
        temp_value = {
            name: curr_tags[i],
            type: 'line',
            data: calculateMA(day_count_value, data),
            smooth: true,
            showSymbol: false,
            lineStyle: {
                normal: {
                    width: 1
                }
            }
        }

        day_count_value += 10
        updated_data.push(temp_value);
    }

    candlestick_options.series = [];
    candlestick_options.legend.data = [];

    candlestick_options.legend.data = curr_tags;
    candlestick_options.series = updated_data;

    chart.setOption(candlestick_options);
    window.onresize = candlestick_options.resize;

});

piechart_chart.setOption(pichart_option);

window.onresize = piechart_chart.resize;