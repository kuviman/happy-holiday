import sys, os, json

path = sys.argv[1].replace("\\", "/")
with open(path + ".ts", "w") as out:
    val = json.dumps(open(path).read())
    out.write("if (!GLSL) {var GLSL: {[path:string]:string} = {};}\n"
              + "GLSL[" + json.dumps(path) + "] = " + val + ";\n")
