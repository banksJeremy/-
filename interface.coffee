body = $("body")
inputForm = $("<form>")

body.append $("<h1>").text "traqk"
body.append inputForm

inputForm.append $("<h2>").text "Record Thing"

addAttribute = $("<div>")
addAttribute.append $("<span>").text "Add attribute:"
