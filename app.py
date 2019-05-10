from flask import Flask, request, render_template, jsonify
import csv
import json
import pickle


app = Flask(__name__)


@app.route('/')
def hello_world():
    # Render the HTML file
    return render_template('dashboard.html')

@app.route('/update')
def update():

    jsdata = request.args

    tag_selected = []

    for val in jsdata:
        tag_selected.append(jsdata[val])

    tag_selected = [tag_selected]
    # tag_selected = [['javascript', 'jquery', 'html', 'css', 'angularjs', 'php', 'ajax']]

    with open('D:\DIVA\FinalProject\static\data\All_tag_qidaid_dict', 'rb') as pickle_file:
        tag_qidaid_dict = pickle.load(pickle_file)

    ans = []

    questions = []
    for i in range(len(tag_selected)):
        questions.append([])
        for j in range(len(tag_selected[i])):
            for k in range(len(tag_qidaid_dict[tag_selected[i][j]])):
                questions[-1].append(tag_qidaid_dict[tag_selected[i][j]][k][0])

    json_object = {}
    for i in range(len(tag_selected)):
        json_object[str(tag_selected[i])] = questions[i]
    with open('D:\DIVA\FinalProject\static\data\All_tags_qid.json', 'w') as outfile:
        json.dump(json_object, outfile, indent=4)

    return jsonify(json_object)

if __name__ == '__main__':
    # app.run(host="0.0.0.0", port=80)
    # Setting debug = True to understand what the problem is if it crashes
    app.debug = True
    # Run the code
    app.run()

    # Tasks left
    # 1. Put actual data to top tags and then link - Done
    # 1.1 Put actual data for top users - Done
    # 2. Put actual data to trend of tags and then link - Done
    # 3. Get all questions and link it - Done
    # 4. Add a place on top right corner which tells the current programmming language selected

