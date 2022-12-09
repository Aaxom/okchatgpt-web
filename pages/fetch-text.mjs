export async function fetchText(resource, fetchOptions) {
  let respText = ""
  try {
    const response = await fetch(resource, fetchOptions);
    respText = await response.text();

    let lines = respText.split(/\r?\n/).filter((item)=>{
      return item !== ""
    })
    let text = lines[lines.length-2]
    // get from index 6 to the end
    text = text.slice(6)

    const respJsonObj = JSON.parse(text)

    const parent_id = respJsonObj["message"]["id"]
    const conversation_id = respJsonObj["conversation_id"]
    let message = respJsonObj["message"]["content"]["parts"][0]
    return {
      "message": message,
      "conversation_id": conversation_id,
      "parent_id": parent_id,
    }

  } catch (error) {
    try {
      const resp = JSON.parse(respText)
      if (resp['detail'] && resp['detail']['code'] && resp['detail']['code'] == "invalid_api_key") {
        throw new Error("Missing necessary credentials")
      } else if (resp['detail'] && resp['detail']['message'] && resp['detail']['message'] !== "") {
        throw new Error(resp['detail']['message'])
      } else if (resp['detail'] !== "") {
        throw new Error(resp['detail'])
      }
    } catch (error2) {
      console.error("Not a valid JSON response, " + error2.message + ", " + error.message)
      throw new Error(error2.message)
    }
    throw new Error("Incorrect response from OpenAI API, " + error.message)
  }
}
