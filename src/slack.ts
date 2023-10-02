import type { Handler } from "@netlify/functions";
import { parse } from "querystring";
import { slackApi, verifySlackRequest } from "./util/slack";

async function handleSlashCommand(payload: SlackSlashCommandPayload) {
	switch (payload.command) {
		case "/foodfight":
			const joke = await fetch("https://icanhazdadjoke.com/", {
				headers: {
					Accept: "text/plain",
				},
			});

			const response = await slackApi("chat.postMessage", {
				channel: payload.channel_id,
				text: await joke.text(),
			});

			if (!response.ok) {
				console.error(response);
				throw new Error("Failed to post message to Slack");
			}
			break;

		default:
			return {
				statusCode: 200,
				body: `Unknown command: ${payload.command}`,
			};
	}

	return {
		statusCode: 200,
		body: "",
	};
}

export const handler: Handler = async (event) => {
	// TODO validate the Slack request
	const valid = verifySlackRequest(event);

	if (!valid) {
		console.error("invalid request");

		return {
			statusCode: 400,
			body: "Invalid request",
		};
	}

	const body = parse(event.body ?? "") as SlackPayload;
	if (body.command) {
		return handleSlashCommand(body as SlackSlashCommandPayload);
	}

	// TODO handle interactivity (e.g. context commands, modals)

	return {
		statusCode: 200,
		body: "TODO: handle Slack commands and interactivity!!",
	};
};
