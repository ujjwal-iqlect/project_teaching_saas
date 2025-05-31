import Vapi from "@vapi-ai/web";

const vapiWebToken = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN!;

export const vapi = new Vapi(vapiWebToken);
