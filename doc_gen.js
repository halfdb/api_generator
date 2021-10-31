function params(obj) {
  if (obj.length === 0) return ""

  const strings = []
  for (const item of obj) {
    if (typeof item === "string") {
      strings.push(`#### \`${item}\`\n- *Mandatory* = \`true\`\n- *Require value* = \`true\``)
    } else if (typeof item === "object") {
      var item_str = `#### \`${item.key}\``
      if ('comment' in item) {
        item_str += `\n- ${item.comment}`
      }
      item_str += `\n- *Mandatory* = \`${item.mandatory}\`\n- *Require value* = \`${item.require_value}\``
      strings.push(item_str)
    }
  }
  return "### Params\n\n" + strings.join("\n\n")
}

function methods(obj) {
  const strings = []
  for (const method of obj) {
    strings.push("`" + method + "`")
  }
  return "- *Method* = " + strings.join(", ")
}

function returns(obj) {
  var str = "### Return\n"
  for (const item of obj) {
    if (item === 200) {
      str += "- `200`: Success.\n"
    } else if (item === 403) {
      str += "- `403`: Auth failed. Login and try again.\n"
    } else if (typeof item === 'object') {
      str += `- \`${item.status_code}\`:`
      if ("description" in item) {
        str += ` ${item.description}`
      }
      if ("schema" in item) {
        str += ` ${item.schema}`
      }
      str += '\n'
    }
  }
  return str
}

function apis(obj) {
  const strings = []
  for (const item of obj) {
    var str = `## \`${item.path}\`\n`
    if ("description" in item) {
      str += `- ${item.description}\n`
    }
    str += methods(item.methods)
    if ("params" in item) {
      str += "\n\n" + params(item.params)
    }
    str += "\n\n" + returns(item.returns)
    
    strings.push(str)
  }
  return strings.join("\n\n")
}

function chapters(obj) {
  const strings = []
  for (const item of obj) {
    var str = `# ${item.title}\n\n${item.description}`
    if ("list" in item) {
      str += "\n\n" + apis(item.list)
    }
    strings.push(str)
  }
  return strings.join("\n\n")
}

function doc(obj) {
  var str = `${obj.title}\n=====\n\n${obj.description}`
  if ("chapters" in obj) {
    str += "\n\n" + chapters(obj.chapters)
  }
  return str
}

const fs = require("fs")

obj = JSON.parse(fs.readFileSync(process.argv[2]))
console.log(doc(obj))
