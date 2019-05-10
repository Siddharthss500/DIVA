var wordcloud_chart = echarts.init(document.getElementById('word_cloud'));

/*function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}*/

var holder = {value :'javascript'};

/*Location of data - top programmming languages*/
var word_cloud_location = "/static/data/1_language_tags_and_num.json";
// var word_cloud_location = "../data/frame1.json";

var actual_data = [];
$.ajax({
    type: 'GET',
    url: word_cloud_location,
    dataType: 'json',
    success: function(word_cloud_data) {actual_data = word_cloud_data;},
    async: false
});

/*Location of data - users with respect to top programming languages*/
var top_users_location = "/static/data/frame2.json";

var top_users = [];
$.ajax({
    type: 'GET',
    url: top_users_location,
    dataType: 'json',
    success: function(top_users_data) {top_users = top_users_data;},
    async: false
});

var wordcloud_option = {
    tooltip: {},
    series: [ {
        type: 'wordCloud',
        gridSize: 2,
        // sizeRange: [12, 50],
        sizeRange: [25, 60],
        rotationRange: [-90, 90],
        // The shape of the "cloud" to draw. Can be any polar equation represented as a
        // callback function, or a keyword present. Available presents are circle (default),
        // cardioid (apple or heart shape curve, the most known polar equation), diamond (
        // alias of square), triangle-forward, triangle, (alias of triangle-upright, pentagon, and star.
        // Shapes: pentagon, star, random-light, random-dark, circle, cardioid, diamond, triangle-forward, triangle, triangle-upright, apple, heart shape curve
        shape: 'apple',
        // width: '105%',
        // height: '105%',
        width: 580,
        height: 245,
        drawOutOfBound: false,
        textStyle: {
            normal: {
                // color: "#108c31",
                color: function () {

                    var letters = '0123456789ABCDEF';
                    var color_value = '#';
                    for (var i = 0; i < 6; i++) {
                        color_value += letters[Math.floor(Math.random() * 16)];
                    }

                    return color_value;
                    }
            },
            emphasis: {
                shadowBlur: 10,
                shadowColor: '#333'
            }
        },
        data: actual_data
    } ]
};

wordcloud_chart.setOption(wordcloud_option);

/*Function to get the top programming language*/
function get_top_user(x) {
    var program_language_clicked = x;
    var user_icon_names = ['man-4.png','boy.png','boy-1.png','girl.png','girl-1.png','man.png','man-1.png','man-2.png','man-3.png'];
    /*Run the for loop to get the corresponding users*/
    for (var i = 0; i < top_users.length; i++) {
        if (program_language_clicked == top_users[i]["V1"]) {
            // console.log(top_users[i]["V2"]);

            var current_users = top_users[i]["V2"];
            current_users = current_users.replace(/'/g, '"');
            current_users = JSON.parse(current_users);

            var user_table = document.getElementById("user_table");
            while (user_table.hasChildNodes()) {
                user_table.removeChild(user_table.firstChild);
            }
            for(var j=0;j<current_users.length;j++){
                var td = document.createElement('td');
                var img = document.createElement('img');


                var link = "https://stackoverflow.com/users/" + current_users[j] + "/";
                var a = document.createElement('a');
                a.setAttribute("href", link);
                a.setAttribute("target", "_blank");

                a.appendChild(document.createTextNode(current_users[j]));

                img.setAttribute("src", "/static/img/avatar/png/" + user_icon_names[Math.round(Math.random() * 10)%user_icon_names.length]);
                img.setAttribute("height", "15px");
                td.appendChild(img);
                /*td.appendChild(document.createTextNode(current_users[j]));*/
                td.appendChild(a);
                var tr = document.createElement('tr')
                tr.appendChild(td);
                user_table.appendChild(tr)
            }
            break;
        }
    }
}

window.onresize = wordcloud_chart.resize;