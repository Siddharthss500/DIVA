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
    # 1. Put actual data to top tags and then link
    # 2. Put actual data to trend of tags and then link
    # 3. Get all questions
    #     Questions based on tags selected (Priority - All tags to one tag)
    # 4. Hovering
    #
    # 5. Add more programming languages - 30-40

