export async function slackApi(
	endpoint: SlackApiEndpoint,
	body: SlackApiRequestBody
) {
	const res = await fetch(`https://slack.com/api/${endpoint}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.SLACK_BOT_OAUTH_TOKEN}`,
		},
		body: JSON.stringify(body),
	});

	return await res.json();
}
