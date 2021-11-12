function params(obj) {
  if (obj.length === 0) return ""

  var header = "| フィールド | 必須 | コメント |\n"
  header += "|---|---|---|\n"
  const strings = []
  for (const item of obj) {
    if (typeof item === "string") {
      strings.push(`|\`${item}\` | \`true\` | |`)
    } else if (typeof item === "object") {
      var item_str = `|\`${item.key}\` | \`${item.mandatory}\` | `
      if ('comment' in item) {
        item_str += item.comment
      }
      item_str += " |"
      strings.push(item_str)
    }
  }
  return "### パラメーター\n\n" + header + strings.join("\n")
}

function methods(obj) {
  return obj.join(', ')
}

function returns(obj) {
  var str = "### 戻り値\n"
  for (const item of obj) {
    if (item === 200) {
      str += "- `200`: 成功。\n"
    } else if (item === 401) {
      str += "- `401`: 認証失敗。"
    } else if (item === 403) {
      str += "- `403`: 禁止。\n"
    } else if (item === 404) {
      str += "- `404`: 存在しない。"
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
    var str = `## \`${methods(item.methods)} ${item.path}\`\n`
    if ("description" in item) {
      str += `${item.description}\n`
    }
    if ("params" in item) {
      str += "\n\n" + params(item.params)
    }
    str += "\n\n" + returns(item.returns)

    if ("return_example" in item) {
      str += "\n### 戻り値の例\n```\n" + item.return_example + "\n```"
    }
    
    strings.push(str)
  }
  return strings.join("\n---\n")
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
