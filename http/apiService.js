import axios from "axios";



export const universalAPIfunction = async (params, parameters, headers) => {
    try {
      const payLoad = {
        pmc: parameters.pmc,
        apiKey: params.apiKey,
        walletLoginToken: parameters.walletLoginToken,
        entityLoginToken: parameters.entityLoginToken,
        walletGUID: "",
        additionalPayload: params.additionalPayload
      }
  
      const { data } = await axios.post(
        parameters.apiUrl, payLoad, {
          headers,
        }
      );
  
      return data;
    } catch (error) {
      console.log(error.response);
    }
}