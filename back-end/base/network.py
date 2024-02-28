from flask import jsonify
def return_with_success(params = {}):
    return jsonify(**{
        "status": "success"
    }, **params)
    

def return_with_fail(msg=""):
    return jsonify({
        "status": "fail",
        "msg": msg
    })