import Vapi from "@vapi-ai/web";

const vapiWebToken = process.env.NEXT_PUBLIC_VAPI_AI_KEY!;

export const vapi = new Vapi(vapiWebToken);
