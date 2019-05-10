from flask import Flask, request, render_template, jsonify

app = Flask(__name__)


@app.route('/')
def hello_world():
    # Render the HTML file
    return render_template('dashboard.html')

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
    # 3. Get all questions and link it
    # 4. Add a place on top right corner which tells the current programmming language selected

