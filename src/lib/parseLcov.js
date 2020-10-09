
const defaultLine = () => {
    return {
        line: 0,
        branches: [],
        functions: []
    }
}
module.exports = (content, basePath="") => {
    const files = [];

    let fileName=null;
    let lines=[];
    let functions={};

    content.split('\n').forEach(line => {
        const [type, data] = line.split(":");
        switch (type) {
            case "SF" : {
                fileName = data.replace(RegExp("^"+basePath+"/?"),"")
                break;
            }

            case "DA": {
                const [lineNumber, count] = data.split(',');
                lines[lineNumber] = lines[lineNumber] || defaultLine();
                lines[lineNumber].line = Number(count);
                break;
            }

            case "BRDA": {
                const [lineNumber, block, branch, count] = data.split(',');
                lines[lineNumber] = lines[lineNumber] || defaultLine();
                lines[lineNumber].branches.push(Number(count));
                break;
            }

            case "FN": {
                const [lineNumber, name] = data.split(',');
                functions[name] = lineNumber;
                break;
            }

            case "FNDA": {
                const [count, name] = data.split(',');
                const lineNumber = functions[name];
                lines[lineNumber] = lines[lineNumber] || defaultLine();
                lines[lineNumber].functions.push(Number(count));
                break;
            }

            case "end_of_record": {
                const covered = [];
                const partial = [];
                const uncovered = [];

                if (fileName.includes("filters-state-types.js")) debugger;

                lines.forEach(({line, branches, functions}, idx) => {
                    if (line === 0) {
                        uncovered.push(idx);
                        return;
                    }

                    if (line >= 1 && (branches.some(b => b===0) || functions.some(f => f===0))) {
                        partial.push(idx);
                        return;
                    }

                    covered.push(idx);
                })

                if (covered.length || partial.length || uncovered.length) {
                    files.push({
                        path: fileName,
                        coverage: `C:${covered.join(',')};P:${partial.join(',')};U:${uncovered.join(',')}`
                    })
                }

                lines = [];
                functions = {};
                fileName = null
            }
            default:
                break;
        }
    });
    return {files};
}