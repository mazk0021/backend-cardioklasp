//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
import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({

    apiKey: "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",
});
const openai = new OpenAIApi(configuration);
const response = await openai.listEngines();

const sendMessage = (req, res) => {

}