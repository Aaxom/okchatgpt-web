export async function fetchLite(resource, fetchOptions) {
  let respText = ""
  try {
    const response = await fetch(resource, fetchOptions);
    respText = await response.text();
    console.log('respText: ', respText)

    const respJsonObj = JSON.parse(respText)

    if (response.status != 200) {
      throw new Error(respJsonObj['error'])
    }
    const message = respJsonObj["message"]
    return {
      "message": message,
      "conversation_uuid": respJsonObj["conversation_uuid"],
    }

  } catch (error) {
    try {
      const resp = JSON.parse(respText)
      if (resp['error']) {
        throw new Error(resp['error'])
      }
      throw new Error(error)
    } catch (error2) {
      console.error("Not a valid JSON response, " + error2.message + ", " + error.message)
      throw new Error(error2.message)
    }
  }
}
