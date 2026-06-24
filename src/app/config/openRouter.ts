import OpenAI from 'openai';
import { envVars } from './env';

export const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: envVars.OPEN_ROUTER_API_KEY,

});





// async function main() {
//   const completion = await openai.chat.completions.create({
//     model: '~openai/gpt-latest',
//     messages: [
//       {
//         role: 'user',
//         content: 'What is the meaning of life?',
//       },
//     ],
//   });

//   console.log(completion.choices[0].message);
// }

// main();
