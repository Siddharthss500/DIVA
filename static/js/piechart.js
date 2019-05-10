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

var questions_links_location = "/static/data/All_tags_qid.json";

ques_links = [];
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

var ques_links = [];
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

        if (selected_tag == related_tags[i]["V1"]) {

            var tags = related_tags[i]["V2"];
            tags = tags.replace(/'/g, '"');
            tags = JSON.parse(tags);

            selected = {};

            legendData.length = 0;
            seriesData.length = 0;
            selected.length = 0;

            for (var j = 0; j < tags.length; j++) {

                for (var key_tag_val in tags[j]) {

                    // tag_val = tags[j];
                    var tag_val = key_tag_val;

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
            // question_links();
            /*tags_selected = legendData.slice(0,6);*/


            return {
                legendData: legendData,
                seriesData: seriesData,
                selected: selected
            };

        }

    }

}


// Always listening
// # If some of the tags are removed or added in the section - Top questions based on tags
$( ".js-example-basic-multiple" ).change(function() {
  var selected_vals = {};
    selected_vals[0] = holder.value;
    // Get the tags selected
    for(var i=0;i<all_tags_list.children.length;i++) {
        if(all_tags_list.children[i].selected == true) {
            selected_vals[i+1] = all_tags_list.children[i].label;
        }
    }

    $.ajax({
        url: '/update',
        data: selected_vals,
    }).done(function (data) {

        var link_numbers = []

        for( var i in data) {
            for (var j in i) {
                link_numbers.push(data[i][j])
            }
        }
        question_links(link_numbers);
    });
});


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


    var selected_vals = {};
    selected_vals[0] = holder.value;
    // Get the tags selected
    for(var i=0;i<all_tags_list.children.length;i++) {
        if(all_tags_list.children[i].selected == true) {
            selected_vals[i+1] = all_tags_list.children[i].label;
        }
    }

    $.ajax({
        url: '/update',
        data: selected_vals,
    }).done(function (data) {

        var link_numbers = []

        for( var i in data) {
            for (var j in i) {
                link_numbers.push(data[i][j])
            }
        }
        question_links(link_numbers);
    });
}

function question_links (link_numbers) {

    var ques_list = document.getElementById("ques_table");
    while(ques_list.hasChildNodes()) {
        ques_list.removeChild(ques_list.firstChild);
    }

    var tag_list = [];
    var related_tags_list = [];
    var array_list;

    /*Get all the keys from the json object*/
    // for (key in ques_links) {
    //
    //     related_tags_list.push(key);
    //
    //     var relevant_tag_list = key;
    //     relevant_tag_list = relevant_tag_list.replace(/'/g, '"');
    //     relevant_tag_list = JSON.parse(relevant_tag_list);
    //
    //     tag_list.push(relevant_tag_list[0])
    // }

    // for(var i=0; i<tag_list.length; i++) {
    //
    //     if (tag_list[i] == holder.value) {
    //         array_list = ques_links[related_tags_list[i]];
    //     }
    //
    // }

    for(var j=0;j<link_numbers.length;j++){
        var td = document.createElement('td');

        var link = "https://stackoverflow.com/questions/" + link_numbers[j] + "/";
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

/*Store the top users that correspond to the click*/
wordcloud_chart.on("CLICK", function (x){
    holder.value = x.data.name;
    get_top_user(x.data.name);
    data = genData(holder.value);

    pichart_option.legend.selected = data.selected;
    pichart_option.legend.data = data.legendData;

    piechart_chart.setOption(pichart_option);
    window.tags_selected = legendData.slice(0,6);

    fill_data(window.tags_selected);

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

    fill_data(curr_tags);

});

piechart_chart.setOption(pichart_option);

window.onresize = piechart_chart.resize;