export async function fetchLite(resource, fetchOptions) {
  let respText = ""
  try {
    const response = await fetch(resource, fetchOptions);
    respText = await response.text();
    console.log('respText: ', respText)

    const respJsonObj = JSON.parse(respText)

    let message = respJsonObj["reply"]
    return {
      "message": message,
    }

  } catch (error) {
    try {
      const resp = JSON.parse(respText)
      if (resp['error']) {
        throw new Error(resp['error'])
      } else if (!Boolean(resp['success']) && resp['message']) {
        throw new Error(resp['message'])
      }
    } catch (error2) {
      console.error("Not a valid JSON response, " + error2.message + ", " + error.message)
      throw new Error(error2.message)
    }
    throw new Error("Incorrect response from OpenAI API, " + error.message)
  }
}
