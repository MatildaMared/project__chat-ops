import type { Handler } from "@netlify/functions";
import { parse } from "querystring";
import { slackApi, verifySlackRequest, blocks, modal } from "./util/slack";

async function handleSlashCommand(payload: SlackSlashCommandPayload) {
	switch (payload.command) {
		case "/foodfight":
			const response = await slackApi(
				"views.open",
				modal({
					id: "foodfight-modal",
					title: "Start a food fight",
					trigger_id: payload.trigger_id,
					blocks: [
						blocks.section({
							text: "The discourse demands food drama! *Send in your spiciest food takes so we can all argue about them and feel alive.*",
						}),
						blocks.input({
							id: "opinion",
							label: "Deposit your controversial food opinion here",
							placeholder: "I think pineapple belongs on pizza",
							initial_value: payload.text ?? "",
							hint: "What do you believe about food that people find apalling? Say it with your chest!",
						}),
						blocks.select({
							id: "spice_level",
							label: "How spicy is this opinion?",
							placeholder: "Select a spice level",
							options: [
								{ label: "mild", value: "mild" },
								{ label: "medium", value: "medium" },
								{ label: "spicy", value: "spicy" },
								{ label: "nuclear", value: "nuclear" },
							],
						}),
					],
				})
			);

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
